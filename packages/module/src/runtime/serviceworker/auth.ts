/// <reference types="serviceworker" />

import { initializeApp, FirebaseOptions } from 'firebase/app'
import { getAuth, onAuthStateChanged, getIdToken } from 'firebase/auth'

// Variables that will be injected by module
interface Options {
  firebaseConfig: FirebaseOptions
}

// @ts-expect-error injected later
const options: Options = {}

initializeApp(options.firebaseConfig)

const auth = getAuth()
const getIdTokenPromise = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      if (user) {
        getIdToken(user).then((idToken) => {
          resolve(idToken)
        }, () => {
          resolve(null)
        })
      } else {
        resolve(null)
      }
    })
  })
}

const getOriginFromUrl = (url: string) => new URL(url).origin

self.addEventListener('fetch', (event: FetchEvent) => {
  const requestProcessor = (idToken: unknown) => {
    let req = event.request
    if (self.location.origin === getOriginFromUrl(event.request.url) &&
        (self.location.protocol === 'https:' ||
         self.location.hostname === 'localhost') &&
        idToken) {
      req = new Request(req)
      req.headers.append('Authorization', 'Bearer ' + idToken)
    }
    return fetch(req)
  }
  event.respondWith(getIdTokenPromise().then(requestProcessor, requestProcessor))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})
