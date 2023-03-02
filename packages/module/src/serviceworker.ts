import { mkdir, rename } from 'node:fs/promises'
import { addDevServerHandler, addVitePlugin, Resolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { eventHandler, send } from 'h3'
import { Plugin as VitePlugin } from 'vite'
import { getJSTemplateContents } from './util/template'

export type ServiceWorkerFeature = 'auth' | 'messaging'

const getServiceWorkerId = (feature: ServiceWorkerFeature) => `virtual:nuxt-firebase/${feature}.ts`

const serviceWorkerPaths = {
  auth: {
    file: 'firebase-auth-sw.js',
    scope: '/'
  },
  messaging: {
    file: 'firebase-messaging-sw.js',
    scope: '/firebase-cloud-messaging-push-scope'
  }
} as const

export async function setupServiceWorker (nuxt: Nuxt, resolve: Resolver['resolve'], resolveURL: Resolver['resolve'], firebaseConfig: object, features: ServiceWorkerFeature[]) {
  const swIds = new Map<ServiceWorkerFeature, string>()
  const swSources = new Map<ServiceWorkerFeature, string>()
  for (const feature of features) {
    swIds.set(feature, getServiceWorkerId(feature))
    swSources.set(feature, await getJSTemplateContents(resolve(`serviceworker/${feature}`))({ options: { firebaseConfig } }))
  }

  if (nuxt.options.dev) {
    const transpiledSwSources = new Map<ServiceWorkerFeature, string>()
    nuxt.hook('vite:serverCreated', async (server) => {
      for (const [feature, id] of swIds.entries()) {
        await server.moduleGraph.ensureEntryFromUrl(id)
        const result = await server.pluginContainer.transform(swSources.get(feature)!, id)
        transpiledSwSources.set(feature, result!.code)
      }
    })

    for (const feature of features) {
      addDevServerHandler({
        route: resolveURL(serviceWorkerPaths[feature].file),
        handler: eventHandler((event) => {
          send(event, transpiledSwSources.get(feature), 'text/javascript')
        })
      })
    }
  } else {
    const buildPlugin = viteBuildPlugin(resolve, features, swIds, swSources)
    addVitePlugin(buildPlugin)
    nuxt.hook('nitro:build:before', async (nitro) => {
      const outputDir = resolve(nuxt.options.buildDir, 'nuxt-firebase')
      await mkdir(outputDir).catch(() => {})
      for (const [feature, outputPath] of buildPlugin.outputPaths.entries()) {
        await rename(outputPath, resolve(outputDir, serviceWorkerPaths[feature].file))
      }

      nitro.options.publicAssets.push({
        baseURL: '/',
        dir: outputDir,
        maxAge: 60 * 60 * 24
      })
    })
    nuxt.hook('build:manifest', (manifest) => {
      for (const swURL of swIds.values()) {
        manifest[swURL].isEntry = false
      }
    })
  }
  return Object.fromEntries(features
    .map(feature => [resolveURL(serviceWorkerPaths[feature].file), serviceWorkerPaths[feature].scope && resolveURL(serviceWorkerPaths[feature].scope!)]))
}

interface ViteBuildPlugin extends VitePlugin {
  chunkId?: string,
  outputPaths: Map<ServiceWorkerFeature, string>
}

const viteBuildPlugin = (resolve: Resolver['resolve'], features: ServiceWorkerFeature[], swIds: Map<ServiceWorkerFeature, string>, swSources: Map<ServiceWorkerFeature, string>): ViteBuildPlugin => {
  const chunkIds = new Map<ServiceWorkerFeature, string>()
  let isServer = false
  const plugin: ViteBuildPlugin = {
    name: 'nuxt-firebase:builder',
    outputPaths: new Map(),
    configResolved (config) {
      isServer = config.build.outDir.includes('.nuxt/dist/server')
    },
    load (url) {
      const matchedSW = [...swIds.entries()].find(([_, id]) => id === url)
      if (matchedSW) { return swSources.get(matchedSW[0]) }
    },
    resolveId (id) {
      if ([...swIds.values()].includes(id)) { return id }
    },
    buildStart () {
      for (const feature of features) {
        chunkIds.set(feature, this.emitFile({
          type: 'chunk',
          name: 'nuxt-firebase-sw.js',
          id: swIds.get(feature)!
        }))
      }
    },
    renderChunk (code, chunk) {
      if ([...swIds.values()].includes(chunk.facadeModuleId!)) {
        code = code.replace(/(import( .* from)? '\.\/)/g, '$1_nuxt/')
        return { code, map: null }
      }
    },
    generateBundle (output) {
      if (isServer) { return }
      for (const [feature, chunkId] of chunkIds.entries()) {
        plugin.outputPaths.set(feature, resolve(output.dir!, this.getFileName(chunkId)))
      }
    }
  }
  return plugin
}
