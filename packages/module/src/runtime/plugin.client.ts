import { defineNuxtPlugin } from '#app'
import { initializeApp } from 'firebase/app'

export default defineNuxtPlugin((nuxtApp) => {
  const { __FIREBASE_CONFIG__: config } = useRuntimeConfig().public
  initializeApp(config)
})
