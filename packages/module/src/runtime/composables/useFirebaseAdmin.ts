import { applicationDefault, cert, getApp, initializeApp } from 'firebase-admin/app'
import { useRuntimeConfig } from '#imports'

/**
 * Use Firebase App
 * If not initialized, returns `null`.
 */
export const useFirebaseAdmin = () => {
  const adminSDKCredential = useRuntimeConfig().__FIREBASE_ADMIN_SDK_CREDENTIAL__
  if (process.client) { return null }
  try {
    return getApp()
  } catch (e) {}
  if (typeof adminSDKCredential === 'undefined') {
    return initializeApp({ credential: applicationDefault() })
  }
  try {
    return initializeApp({ credential: cert(JSON.parse(adminSDKCredential)) })
  } catch (e) {}
  try {
    return initializeApp({ credential: cert(adminSDKCredential) })
  } catch (e) {}
  return null
}
