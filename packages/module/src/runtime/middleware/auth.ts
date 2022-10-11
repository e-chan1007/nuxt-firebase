import { applicationDefault, cert, getApp, initializeApp as initializeAdminApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { defineEventHandler } from 'h3'
import * as jwt from 'jsonwebtoken'
import type { AuthUser } from '../types'

// Variables that will be injected by module
/* eslint-disable no-var */
declare module './auth' {
  var adminSDKCredential: string
  var authSSR: boolean
  var disableAdminSDK: boolean
}
/* eslint-enable no-var */

/* [ Inject Variables Here ] */

const tryInitAdminSDK = (): boolean => {
  try {
    getApp()
  } catch (e) {
    if (typeof adminSDKCredential === 'undefined') {
      initializeAdminApp({ credential: applicationDefault() })
    } else {
      try {
        initializeAdminApp({ credential: cert(JSON.parse(adminSDKCredential)) })
      } catch (e) {
        try {
          initializeAdminApp({ credential: cert(adminSDKCredential) })
        } catch (e) {
          return false
        }
      }
    }
  }
  return true
}

export default defineEventHandler(async (event) => {
  const idToken = event.req.headers.authorization?.split(' ')[1]
  if (!idToken) { return }
  let currentUser: AuthUser | null = null

  if (disableAdminSDK) {
    // Fallback to parse JWT
    const decodedJWT = jwt.decode(idToken)
    if (!decodedJWT || typeof decodedJWT === 'string') { return }
    currentUser = { isSSRData: true, displayName: decodedJWT.name, photoURL: decodedJWT.picture, email: decodedJWT.email, uid: decodedJWT.user_id, emailVerified: decodedJWT.email_verified }
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
          currentUser = { isSSRData: true, ...user }
        } else {
          currentUser = null
        }
      }).catch(() => {})
  }
  event.context.__FIREBASE_AUTH_CURRENT_USER__ = currentUser
})
