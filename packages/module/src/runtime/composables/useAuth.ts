import { Ref, ComputedRef, computed, onBeforeUnmount } from 'vue'
import { useState } from 'nuxt/app'
import { getAuth } from 'firebase/auth'
import type { Auth as FirebaseAuth, User } from 'firebase/auth'
import { useFirebase } from './useFirebase'

interface Auth {
  /**
   * `Auth` instance of Firebase (The same as the return value of `getAuth()`)
   *
   * If unavailable, returns `null`
   */
   auth: FirebaseAuth | null

   /**
    * Reactive `auth.currentUser`
    */
   currentUser: Ref<User | null>

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
  const currentUser = useState<User | null>('__FIREBASE_AUTH_CURRENT_USER__', () => null)
  const isAuthenticated = computed(() => Boolean(currentUser.value))
  let auth: FirebaseAuth | null = null
  if (app !== null) {
    auth = getAuth(app)
    auth.onAuthStateChanged((user) => {
      currentUser.value = user
    })
    currentUser.value = auth.currentUser
  }
  return { auth, currentUser, isAuthenticated }
}
