export default defineNuxtConfig({
  modules: [
    '../..'
  ],
  firebase: {
    configEnvPrefix: 'FIREBASE_',
    injectMessagingServiceWorker: true
  }
})
