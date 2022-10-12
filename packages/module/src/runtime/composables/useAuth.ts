import { Ref, ComputedRef, computed } from 'vue'
import { useNuxtApp, useState } from 'nuxt/app'
import { getAuth } from 'firebase/auth'
import type { Auth as FirebaseAuth } from 'firebase/auth'
import type { AuthUser } from '../types'
import { useFirebase } from './useFirebase'

interface Auth {
  /**
   * `Auth` instance of Firebase (The same as the return value of `getAuth()`)  
   * If unavailable, returns `null`
   */
   auth: FirebaseAuth | null

   /**
    * Reactive `auth.currentUser`
    */
   currentUser: Ref<AuthUser | null>

   /**
    * Whether the user is logged in (Checks if `currentUser` is filled)
    */
   isAuthenticated: ComputedRef<boolean>
}

/**
 * Use `Auth` instance of Firebase and reactive `currentUser` and `isAuthenticated`
 */
export const useAuth = (): Auth => {
  const app = useFirebase()
  const currentUser = useState<AuthUser | null>('__FIREBASE_AUTH_CURRENT_USER__')
  const isAuthenticated = computed(() => Boolean(currentUser.value))
  let auth: FirebaseAuth | null = null
  if (app !== null && process.client) {
    auth = getAuth(app)
    auth.onAuthStateChanged((user) => {
      if (user) {
        currentUser.value = { isSSRData: false, ...user }
      } else {
        currentUser.value = null
      }
    })
  } else {
    const { ssrContext } = useNuxtApp()
    currentUser.value = ssrContext?.event.context.__FIREBASE_AUTH_CURRENT_USER__ ?? null
  }
  return { auth, currentUser, isAuthenticated }
}
