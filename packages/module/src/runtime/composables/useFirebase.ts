import { getApp, initializeApp } from 'firebase/app'

/**
 * Use Firebase App
 * If not initialized, returns `null`.
 */
export const useFirebase = () => {
  try {
    const app = getApp()
    return app
  } catch (e) {
    const app = initializeApp(useRuntimeConfig().__FIREBASE_CONFIG__)
    return app
  }
}
