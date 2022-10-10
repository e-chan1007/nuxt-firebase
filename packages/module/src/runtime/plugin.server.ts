import { defineNuxtPlugin } from 'nuxt/app'
import { getAuth } from 'firebase-admin/auth'
import * as jwt from 'jsonwebtoken'
import { initializeApp, applicationDefault, cert, getApp } from 'firebase-admin/app'
import type { AuthUser } from './types'

// Variables that will be injected by module
/* eslint-disable no-var */
declare module './plugin.server' {
  var adminSDKCredential: string
  var authSSR: boolean
  var disableAdminSDK: boolean
}
/* eslint-enable no-var */

/* [ Inject Variables Here ] */

const tryInitAdminSDK = (): boolean => {
  try {
    getApp()
    return true
  } catch (e) {}
  if (typeof adminSDKCredential === 'undefined') {
    initializeApp({ credential: applicationDefault() })
  } else {
    try {
      initializeApp({ credential: cert(JSON.parse(adminSDKCredential)) })
    } catch (e) {
      try {
        initializeApp({ credential: cert(adminSDKCredential) })
      } catch (e) {
        return false
      }
    }
  }
  return true
}

const authSSRPlugin = defineNuxtPlugin(async (nuxtApp) => {
  const idToken = nuxtApp.ssrContext?.event.req.headers.authorization?.split(' ')[1]
  if (!idToken) { return }

  const currentUser = useState<AuthUser | null>('__FIREBASE_AUTH_CURRENT_USER__')

  if (disableAdminSDK) {
    // Fallback to parse JWT
    const decodedJWT = jwt.decode(idToken)
    if (!decodedJWT || typeof decodedJWT === 'string') { return }
    currentUser.value = { isSSRData: true, displayName: decodedJWT.name, photoURL: decodedJWT.picture, email: decodedJWT.email, uid: decodedJWT.user_id, emailVerified: decodedJWT.email_verified }
  } else {
    if (!tryInitAdminSDK()) { return }
    const auth = getAuth()
    await auth.verifyIdToken(idToken)
      .then(({ uid }) => auth.getUser(uid))
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn(e)
      })
      .then((user) => {
        if (user) {
          currentUser.value = { isSSRData: true, ...user }
        } else {
          currentUser.value = null
        }
      }).catch(() => {})
  }
})

export default defineNuxtPlugin(async (nuxtApp) => {
  if (authSSR) { await authSSRPlugin(nuxtApp) }
})
