import { defineNuxtConfig } from 'nuxt/config'
import FirebaseModule from '../../dist/module.cjs'

export default defineNuxtConfig({
  modules: [
    FirebaseModule
  ],
  firebase: {
    addPlugin: true
  }
})
