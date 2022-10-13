import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { FirebaseOptions, initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

// Variables that will be injected by module
interface Options {
  authSSR: boolean
  swPath: string
  firebaseConfig: FirebaseOptions
  recaptchaSiteKey: string
}

// @ts-ignore
const options: Options = {}

export default defineNuxtPlugin((nuxtApp) => {
  const { baseURL } = useRuntimeConfig().app
  const app = initializeApp(options.firebaseConfig)

  if (options.recaptchaSiteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(options.recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    })
  }

  if (options.authSSR && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register(options.swPath, { scope: (baseURL + '/').replace(/\/\/$/, '/'), type: 'module' })
  }
})
