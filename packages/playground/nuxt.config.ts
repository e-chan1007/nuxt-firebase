export default defineNuxtConfig({
  modules: [
    '../..',
    '@nuxt/devtools'
  ],
  firebase: {
    configEnvPrefix: 'FIREBASE_',
    injectMessagingServiceWorker: true
  }
})
