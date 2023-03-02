import { defineNuxtPlugin } from 'nuxt/app'
import { FirebaseOptions, initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

// Variables that will be injected by module
interface Options {
  authSSR: boolean
  swEntries: Record<string, string>,
  firebaseConfig: FirebaseOptions
  recaptchaSiteKey: string
}

// @ts-expect-error injected later
const options: Options = {}

export default defineNuxtPlugin(async () => {
  const app = initializeApp(options.firebaseConfig)

  if (options.recaptchaSiteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(options.recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    })
  }

  if ('serviceWorker' in navigator) {
    for (const [path, scope] of Object.entries(options.swEntries)) {
      await navigator.serviceWorker.register(path, { scope, type: 'module' })
    }
  }
})
