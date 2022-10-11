import { getApp, initializeApp } from 'firebase/app'

/**
 * Use Firebase App
 * If not initialized, returns `null`.
 */
export const useFirebase = () => {
  try {
    return getApp()
  } catch (e) {
    const app = initializeApp(useRuntimeConfig().__FIREBASE_CONFIG__)
    return app
  }
}
