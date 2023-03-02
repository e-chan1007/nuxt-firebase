import { applicationDefault, cert, getApp, initializeApp as initializeAdminApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { defineEventHandler, getHeader } from 'h3'
import type { AuthUser } from '../types'

// Variables that will be injected by module
interface Options {
  adminSDKCredential: string
}

// @ts-ignore
const options: Options = {}

const tryInitAdminSDK = (): boolean => {
  try {
    getApp()
  } catch (e) {
    if (typeof options.adminSDKCredential === 'undefined') {
      initializeAdminApp({ credential: applicationDefault() })
    } else {
      try {
        initializeAdminApp({ credential: cert(JSON.parse(options.adminSDKCredential)) })
      } catch (e) {
        try {
          initializeAdminApp({ credential: cert(options.adminSDKCredential) })
        } catch (e) {
          return false
        }
      }
    }
  }
  return true
}

export default defineEventHandler(async (event) => {
  const idToken = getHeader(event, 'authorization')?.split(' ')[1]
  if (!idToken) { return }
  let currentUser: AuthUser | null = null

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

  event.context.__FIREBASE_AUTH_CURRENT_USER__ = currentUser
})
