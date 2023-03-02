import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { FirebaseOptions, initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

// Variables that will be injected by module
interface Options {
  authSSR: boolean
  swPath: string,
  swScope: string,
  firebaseConfig: FirebaseOptions
  recaptchaSiteKey: string
}

// @ts-expect-error injected later
const options: Options = {}

export default defineNuxtPlugin(() => {
  const app = initializeApp(options.firebaseConfig)

  if (options.recaptchaSiteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(options.recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    })
  }

  if (options.authSSR && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register(options.swPath, { scope: options.swScope, type: 'module' })
  }
})
