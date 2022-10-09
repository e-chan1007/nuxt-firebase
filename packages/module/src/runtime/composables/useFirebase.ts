import { FirebaseApp, getApps } from 'firebase/app'

/**
 * Use Firebase App
 *
 * If not initialized, returns `null`.
 */
export const useFirebase = () => {
  const app = getApps()[0]
  if (typeof app === 'undefined') { return null }
  return app
}
