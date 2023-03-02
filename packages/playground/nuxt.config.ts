import FirebaseModule from '../../dist/module.cjs'

export default defineNuxtConfig({
  modules: [
    FirebaseModule
  ],
  firebase: {
    configEnvPrefix: 'FIREBASE_',
    injectMessagingServiceWorker: true
  }
})
