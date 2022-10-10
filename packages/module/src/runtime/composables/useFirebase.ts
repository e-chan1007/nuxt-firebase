import { getApp } from 'firebase/app'

/**
 * Use Firebase App  
 * If not initialized, returns `null`.
 */
export const useFirebase = () => {
  try {
    return getApp()
  } catch (e) {
    return null
  }
}
