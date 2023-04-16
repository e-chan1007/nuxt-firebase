import { fileURLToPath } from 'url'
import { createRequire } from 'node:module'
import { addImports, addPluginTemplate, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { getJSTemplateContents } from './util/template'
import { ServiceWorkerFeature, setupServiceWorker } from './serviceworker'

export interface ModuleOptions {
  /**
   * SDK configuration(Object or JSON string)
   */
  config: string | object,
  /**
   * Prefix of environment variables that includes SDK configuration
   */
  configEnvPrefix?: string
  /**
   * Credential (path) of Admin SDK
   *
   * The way to determine which credential to use:
   * 1. Use Application Default Credentials if undefined (`GOOGLE_APPLICATION_CREDENTIALS`)
   * 2. Parse this value as JSON
   * 3. Parse this value as the file path of the JSON file
   * 4. Use this value as the credential
   * 5. Use the value of FIREBASE_ADMIN_SDK_CREDENTIAL as the credential
   */
  adminSDKCredential?: string | object

  /**
   * reCAPTCHA site key (if set, enable App Check)
   * @see https://firebase.google.com/docs/app-check/web/recaptcha-provider
   */
  recaptchaSiteKey?: string

  /**
   * VAPID (Voluntary Application Server Identification) key for Cloud Messaging
   */
  vapidKey?: string

  /**
   * Whether to enable Admin SDK
   * Even if the credential is available, disabling this parameter makes SDK disabled.
   * If `firebase-admin` is not installed, disabled automatically.
   * @default false
   */
  useAdminSDK: boolean

  /**
   * Whether to use Service Worker for the authenticate session management
   * If used without set `adminSDKCredential`, some features would be disabled.
   * @default true
   * @see https://firebase.google.com/docs/auth/web/service-worker-sessions
   */
  useAuthSSR: boolean

  /**
   * Whether to use Nuxt Devtools Tab
   */
  useDevtools: boolean

  /**
   * Whether to use builtin service worker for Cloud Messaging
   * If you want to use the service worker that you made, keep this option `false`.
   * @default false
   */
  useMessagingServiceWorker: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@e-chan1007/nuxt-firebase',
    configKey: 'firebase',
    compatibility: { nuxt: '^3.0.0' }
  },
  defaults: {
    config: {},
    recaptchaSiteKey: '',
    useAdminSDK: false,
    useAuthSSR: true,
    useDevtools: true,
    useMessagingServiceWorker: false
  },
  async setup (options, nuxt) {
    const baseURL = nuxt.options.app.baseURL
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    const require = createRequire(import.meta.url)
    const { resolve } = createResolver(runtimeDir)
    const { resolve: resolveURL } = createResolver(baseURL)

    nuxt.options.build.transpile.push(runtimeDir)

    // If `generate`, disable all SSR features
    if (nuxt.options._generate) {
      options.useAuthSSR = false
    }

    // If `firebase-admin` is not installed, disable features
    try {
      require.resolve('firebase-admin')
    } catch (e) {
      options.useAdminSDK = false
    }

    /* Composables */
    const composableNames = ['useAuth', 'useFirebase', 'useFCMToken']
    const serverComposableNames = ['useFirebase', 'useServerAuth']
    if (options.useAdminSDK) {
      composableNames.push('useFirebaseAdmin')
      serverComposableNames.push('useFirebaseAdmin')
    }

    const toKebab = (input: string) => input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    addImports([...composableNames, ...serverComposableNames].map(name => ({
      name,
      from: resolve(`composables/${name}`),
      meta: {
        docsUrl: `https://e-chan1007.github.io/nuxt-firebase/references/${toKebab(name)}`
      }
    })))

    const composablesTypePath = addTemplate({
      filename: 'types/firebase.d.ts',
      getContents: () => [
        'declare module \'#firebase\' {',
        ...composableNames.map(name => `  const ${name}: typeof import('${resolve('composables')}/${name}').${name}`),
        '}',
        'declare module \'#firebase/server\' {',
        ...serverComposableNames.map(name => `  const ${name}: typeof import('${resolve('composables')}/${name}').${name}`),
        '}'
      ].join('\n')
    }).dst
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias ?? {}
      nitroConfig.alias['#firebase'] = resolve(options.useAdminSDK ? './composables/index.withAdmin' : './composables/index')
      nitroConfig.alias['#firebase/server'] = resolve(options.useAdminSDK ? './composables/server.withAdmin' : './composables/server')
    })
    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: composablesTypePath })
    })

    /* Client SDK */
    let firebaseConfig: object | undefined
    try {
      firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG!)
    } catch (e) {}
    if (typeof firebaseConfig === 'undefined') {
      if (typeof options.configEnvPrefix === 'string') {
        const envMap: Record<string, string> = {
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
        firebaseConfig = options.config as object
      }
    }
    nuxt.options.runtimeConfig.__FIREBASE_CONFIG__ = firebaseConfig as any
    if (process.env[options.configEnvPrefix + 'VAPID_KEY']) { options.vapidKey ??= process.env[options.configEnvPrefix + 'VAPID_KEY'] }
    if (options.vapidKey) { nuxt.options.runtimeConfig.__FIREBASE_VAPID_KEY__ = options.vapidKey }
    if (process.env[options.configEnvPrefix + 'ADMIN_SDK_CREDENTIAL']) { options.adminSDKCredential ??= process.env[options.configEnvPrefix + 'ADMIN_SDK_CREDENTIAL'] }

    const recaptchaSiteKey = process.env[options.configEnvPrefix + 'RECAPTCHA_SITE_KEY'] ?? options.recaptchaSiteKey

    /* Service Worker */
    const swFeatures: ServiceWorkerFeature[] = []

    if (options.useAuthSSR) {
      const middlewarePath = addTemplate({
        write: true,
        filename: options.useAdminSDK ? 'middleware/auth.withAdmin.ts' : 'middleware/auth.ts',
        getContents: getJSTemplateContents(resolve('middleware/auth')),
        options
      }).dst
      nuxt.options.serverHandlers.push({ handler: middlewarePath })
      swFeatures.push('auth')
    }
    if (options.useMessagingServiceWorker) {
      swFeatures.push('messaging')
    }

    const swEntries = (await setupServiceWorker(nuxt, resolve, resolveURL, firebaseConfig, swFeatures))

    addPluginTemplate({
      filename: 'plugin.client.ts',
      getContents: getJSTemplateContents(resolve('plugin.client')),
      options: { firebaseConfig, recaptchaSiteKey, swEntries }
    })

    /* Admin SDK */
    nuxt.options.runtimeConfig.__FIREBASE_ADMIN_SDK_CREDENTIAL__ = options.adminSDKCredential
    addPluginTemplate({
      filename: 'plugin.server.ts',
      getContents: getJSTemplateContents(resolve('plugin.server')),
      options: { ...options, firebaseConfig }
    })

    if (options.useDevtools) {
      // @ts-expect-error there is no type
      nuxt.hook('devtools:customTabs', (tabs) => {
        tabs.push({
          name: 'nuxt-firebase',
          title: 'Nuxt Firebase',
          icon: 'mdi:firebase',
          view: {
            type: 'iframe',
            src: 'https://e-chan1007.github.io/nuxt-firebase/references/use-firebase'
          }
        })
      })
    }
  }
})
