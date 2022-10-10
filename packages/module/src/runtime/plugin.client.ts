import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { FirebaseOptions, initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

// Variables that will be injected by module
/* eslint-disable no-var */
declare module './plugin.client' {
  var authSSR: boolean
  var swPath: string
  var firebaseConfig: FirebaseOptions
  var recaptchaSiteKey: string
}
/* eslint-enable no-var */

/* [ Inject Variables Here ] */

export default defineNuxtPlugin((nuxtApp) => {
  const { baseURL } = useRuntimeConfig().app
  const app = initializeApp(firebaseConfig)

  if (recaptchaSiteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    })
  }

  if (authSSR && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register(swPath, { scope: (baseURL + '/').replace(/\/\/$/, '/'), type: 'module' })
  }
})
