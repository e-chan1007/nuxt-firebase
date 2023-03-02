import { mkdir, rename } from 'node:fs/promises'
import { addDevServerHandler, addVitePlugin, Resolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { eventHandler, send } from 'h3'
import { Plugin as VitePlugin } from 'vite'
import { getJSTemplateContents } from './util/template'

const swUrl = 'virtual:nuxt-firebase/serviceworker.ts'

export async function setupServiceWorkerBuilder (nuxt: Nuxt, resolve: Resolver['resolve'], resolveURL: Resolver['resolve'], firebaseConfig: object) {
  const swSource = await getJSTemplateContents(resolve('serviceworker'))({ options: { firebaseConfig } })

  if (nuxt.options.dev) {
    let code = ''
    nuxt.hook('vite:serverCreated', async (server) => {
      await server.moduleGraph.ensureEntryFromUrl(swUrl)
      const result = await server.pluginContainer.transform(swSource, swUrl)
      code = result!.code
    })

    addDevServerHandler({
      route: resolveURL('nuxt-firebase-sw.js'),
      handler: eventHandler((event) => {
        send(event, code, 'text/javascript')
      })
    })
  } else {
    const buildPlugin = viteBuildPlugin(resolve, swSource)
    addVitePlugin(buildPlugin)
    nuxt.hook('nitro:build:before', async (nitro) => {
      if (!buildPlugin.outputPath) { return }
      const outputDir = resolve(nuxt.options.buildDir, 'nuxt-firebase')
      await mkdir(outputDir).catch(() => {})
      await rename(buildPlugin.outputPath, resolve(outputDir, 'nuxt-firebase-sw.js'))

      nitro.options.publicAssets.push({
        baseURL: '/',
        dir: outputDir,
        maxAge: 60 * 60 * 24
      })
    })
    nuxt.hook('build:manifest', (manifest) => {
      manifest[swUrl].isEntry = false
    })
  }
}

interface ViteBuildPlugin extends VitePlugin {
  chunkId?: string,
  outputPath?: string
}

const viteBuildPlugin = (resolve: Resolver['resolve'], swSource: string): ViteBuildPlugin => {
  let chunkId = ''
  let isServer = false
  const plugin: ViteBuildPlugin = {
    name: 'nuxt-firebase:builder',
    configResolved (config) {
      isServer = config.build.outDir.includes('.nuxt/dist/server')
    },
    load (url) {
      if (url === swUrl) { return swSource }
    },
    resolveId (id) {
      if (id === swUrl) { return swUrl }
    },
    buildStart () {
      chunkId = this.emitFile({
        type: 'chunk',
        name: 'nuxt-firebase-sw.js',
        id: swUrl
      })
    },
    renderChunk (code, chunk) {
      if (chunk.facadeModuleId === swUrl) {
        code = code.replace(/(import .* from '\.\/)/g, '$1_nuxt/')
        return { code, map: null }
      }
    },
    generateBundle (output) {
      if (isServer) { return }
      plugin.outputPath = resolve(output.dir!, this.getFileName(chunkId))
    }
  }
  return plugin
}
