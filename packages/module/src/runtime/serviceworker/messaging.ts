/// <reference types="serviceworker" />

import { initializeApp, FirebaseOptions } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

// Variables that will be injected by module
interface Options {
  firebaseConfig: FirebaseOptions
}

// @ts-expect-error injected later
const options: Options = {}

const app = initializeApp(options.firebaseConfig)
const messaging = getMessaging(app)

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})
