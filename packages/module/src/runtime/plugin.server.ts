import type { FirebaseOptions } from 'firebase/app'
import { getApp, initializeApp as initializeClientApp } from 'firebase/app'
import { defineNuxtPlugin, useState } from 'nuxt/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

// Variables that will be injected by module
interface Options {
  adminSDKCredential: string
  authSSR: boolean
  disableAdminSDK: boolean
  firebaseConfig: FirebaseOptions
  recaptchaSiteKey: string
}

// @ts-ignore
const options: Options = {}

const tryInitClientSDK = (): boolean => {
  try {
    getApp()
  } catch (e) {
    try {
      initializeClientApp(options.firebaseConfig)
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

export default defineNuxtPlugin((nuxtApp) => {
  tryInitClientSDK()
  if (options.recaptchaSiteKey) {
    initializeAppCheck(getApp(), {
      provider: new ReCaptchaV3Provider(options.recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    })
  }
  if (options.authSSR) { authSSRPlugin(nuxtApp) }
})
