import { fileURLToPath } from 'url'
import { addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { FirebaseOptions } from 'firebase/app'

export interface ModuleOptions {
  /**
   * SDK configuration(Object or JSON string)
   */
  config?: FirebaseOptions | string,
  /**
   * Prefix of environment variables that includes SDK configuration
   */
  configEnvPrefix?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'firebase',
    configKey: 'firebase',
    compatibility: { nuxt: '^3.0.0-rc.11' }
  },
  defaults: {
    config: {}
  },
  setup (options, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    const { resolve } = createResolver(runtimeDir)

    if (typeof options.configEnvPrefix === 'string') {
      const envMap: Record<keyof FirebaseOptions, string> = {
        apiKey: `${options.configEnvPrefix}API_KEY`,
        authDomain: `${options.configEnvPrefix}AUTH_DOMAIN`,
        databaseURL: `${options.configEnvPrefix}DATABASE_URL`,
        projectId: `${options.configEnvPrefix}PROJECT_ID`,
        storageBucket: `${options.configEnvPrefix}STORAGE_BUCKET`,
        messagingSenderId: `${options.configEnvPrefix}MESSAGING_SENDER_ID`,
        appId: `${options.configEnvPrefix}APP_ID`,
        measurementId: `${options.configEnvPrefix}MEASUREMENT_ID`
      }
      nuxt.options.runtimeConfig.public.__FIREBASE_CONFIG__ = Object.fromEntries(Object.entries(envMap).map(([configKey, envKey]) => [configKey, process.env[envKey]]))
    } else {
      if (typeof options.config === 'string') { options.config = JSON.parse(options.config) }
      nuxt.options.runtimeConfig.public.__FIREBASE_CONFIG__ = options.config
    }

    nuxt.options.build.transpile.push(runtimeDir)
    addPlugin(resolve(runtimeDir, 'plugin.client'))
    addImports({ name: 'useFirebase', from: resolve('composables/useFirebase') })
  }
})
