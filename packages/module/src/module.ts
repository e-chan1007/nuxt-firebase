import { fileURLToPath } from 'url'
import { addImportsDir, addPluginTemplate, addTemplate, addVitePlugin, createResolver, defineNuxtModule, extendViteConfig } from '@nuxt/kit'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import type { ServiceAccount } from 'firebase-admin'
import type { FirebaseOptions } from 'firebase/app'
import { getJSTemplateContents } from './util/template'

export interface ModuleOptions {
  /**
   * SDK configuration(Object or JSON string)
   */
  config?: FirebaseOptions | string,
  /**
   * Prefix of environment variables that includes SDK configuration
   */
  configEnvPrefix?: string
  /**
   * reCAPTCHA site key (if set, enable App Check)
   * @see https://firebase.google.com/docs/app-check/web/recaptcha-provider
   */
  recaptchaSiteKey?: string
  /**
   * Whether to use Service Worker for the authenticate session management  
   * If used without set `adminSDKCredential`, some features would be disabled.
   * @default true
   * @see https://firebase.google.com/docs/auth/web/service-worker-sessions
   */
  authSSR?: boolean

  /**
   * Credential path of Admin SDK
   * 
   * The way to determine which credential to use:  
   * 1. Use Application Default Credentials if undefined (`GOOGLE_APPLICATION_CREDENTIALS`)  
   * 2. Parse this value as JSON  
   * 3. Parse this value as the file path of the JSON file  
   * 4. Use this value as the credential
   */
  adminSDKCredential?: string | ServiceAccount,

  /**
   * Whether to disable Admin SDK  
   * If the credential is unavailable, SDK will be disabled automatically.  
   * Even if the credential is available, enabling this parameter makes SDK disabled.
   * @default false
   */
  disableAdminSDK?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'firebase',
    configKey: 'firebase',
    compatibility: { nuxt: '^3.0.0-rc.11' }
  },
  defaults: {
    config: {},
    authSSR: true,
    disableAdminSDK: false
  },
  setup (options, nuxt) {
    const baseURL = nuxt.options.app.baseURL
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    const { resolve } = createResolver(runtimeDir)
    const { resolve: resolveURL } = createResolver(baseURL)
    nuxt.options.build.transpile.push(runtimeDir)

    // If `generate`, disable all SSR features
    if (nuxt.options._generate) {
      options.authSSR = false
    }

    /* Composables */
    addImportsDir(resolve('composables'))
    const composableNames = ['useAuth', 'useFirebase', 'useFirebaseAdmin']
    const composablesTypePath = addTemplate({
      filename: 'types/firebase.d.ts',
      getContents: () => [
        'declare module \'#firebase\' {',
        ...composableNames.map(name => `  const ${name}: typeof import('${resolve('composables')}').${name}`),
        '}'
      ].join('\n')
    }).dst
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias['#firebase'] = resolve('composables')
    })
    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: composablesTypePath })
    })

    /* Client SDK */
    let firebaseConfig: FirebaseOptions | undefined
    try {
      firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG!)
    } catch (e) {}
    if (typeof firebaseConfig === 'undefined') {
      if (typeof options.configEnvPrefix === 'string') {
        const envMap: Record<keyof FirebaseOptions, string> = {
          apiKey: 'API_KEY',
          authDomain: 'AUTH_DOMAIN',
          databaseURL: 'DATABASE_URL',
          projectId: 'PROJECT_ID',
          storageBucket: 'STORAGE_BUCKET',
          messagingSenderId: 'MESSAGING_SENDER_ID',
          appId: 'APP_ID',
          measurementId: 'MEASUREMENT_ID'
        }
        firebaseConfig = Object.fromEntries(Object.entries(envMap).map(([configKey, envKey]) => [configKey, process.env[options.configEnvPrefix + envKey]]))
      } else {
        if (typeof options.config === 'string') { options.config = JSON.parse(options.config) }
        firebaseConfig = options.config as FirebaseOptions
      }
    }
    nuxt.options.runtimeConfig.__FIREBASE_CONFIG__ = firebaseConfig

    const recaptchaSiteKey = process.env[options.configEnvPrefix + 'RECAPTCHA_SITE_KEY'] ?? options.recaptchaSiteKey

    addPluginTemplate({
      filename: 'plugin.client.ts',
      getContents: getJSTemplateContents(resolve('plugin.client.ts')),
      options: { authSSR: options.authSSR, firebaseConfig, recaptchaSiteKey, swPath: resolveURL('firebase-sw.js') }
    })

    /* Service Worker */
    if (options.authSSR) {
      const swPath = addTemplate({
        write: true,
        filename: 'firebase-sw.js',
        getContents: getJSTemplateContents(resolve('serviceWorker.js')),
        options: {
          firebaseConfig
        }
      }).dst

      viteStaticCopy({
        targets: [{
          src: swPath,
          dest: baseURL.slice(1)
        }]
      }).forEach(plugin => addVitePlugin(plugin))
    }

    /* Admin SDK */
    nuxt.options.runtimeConfig.__FIREBASE_ADMIN_SDK_CREDENTIAL__ = options.adminSDKCredential
    addPluginTemplate({
      filename: 'plugin.server.ts',
      getContents: getJSTemplateContents(resolve('plugin.server.ts')),
      options
    })
  }
})
