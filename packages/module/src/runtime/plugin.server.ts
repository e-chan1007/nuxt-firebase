import type { FirebaseOptions } from 'firebase/app'
import { getApp, initializeApp as initializeClientApp } from 'firebase/app'
import { defineNuxtPlugin, useState } from 'nuxt/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

// Variables that will be injected by module
/* eslint-disable no-var */
declare module './plugin.server' {
  var adminSDKCredential: string
  var authSSR: boolean
  var disableAdminSDK: boolean
  var firebaseConfig: FirebaseOptions
  var recaptchaSiteKey: string
}
/* eslint-enable no-var */

/* [ Inject Variables Here ] */

const tryInitClientSDK = (): boolean => {
  try {
    getApp()
  } catch (e) {
    try {
      initializeClientApp(firebaseConfig)
    } catch (e) {
      return false
    }
  }
  return true
}

const authSSRPlugin = defineNuxtPlugin((nuxtApp) => {
  const currentUser = useState('__FIREBASE_AUTH_CURRENT_USER__')
  currentUser.value = nuxtApp.ssrContext?.__FIREBASE_AUTH_CURRENT_USER__ ?? null
})

export default defineNuxtPlugin(async (nuxtApp) => {
  tryInitClientSDK()
  if (recaptchaSiteKey) {
    initializeAppCheck(getApp(), {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    })
  }
  if (authSSR) { await authSSRPlugin(nuxtApp) }
})
