import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js'
import { getAuth, onAuthStateChanged, getIdToken } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js'

/* [ Inject Variables Here ] */

initializeApp(firebaseConfig)

const auth = getAuth()
const getIdTokenPromise = () => {
  return new Promise((resolve, reject) => {
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

const getOriginFromUrl = url => new URL(url).origin

self.addEventListener('fetch', (event) => {
  /** @type {FetchEvent} */
  const evt = event

  const requestProcessor = (idToken) => {
    /** @type {Request} */
    let req = evt.request
    if (self.location.origin === getOriginFromUrl(evt.request.url) &&
        (self.location.protocol === 'https:' ||
         self.location.hostname === 'localhost') &&
        idToken) {
      req = new Request(req)
      req.headers.append('Authorization', 'Bearer ' + idToken)
    }
    return fetch(req)
  }
  evt.respondWith(getIdTokenPromise().then(requestProcessor, requestProcessor))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})
