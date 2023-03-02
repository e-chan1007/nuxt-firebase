export default defineNuxtConfig({
  modules: [
    '../..',
    '@nuxt/devtools'
  ],
  firebase: {
    configEnvPrefix: 'FIREBASE_',
    useMessagingServiceWorker: true
  }
})
