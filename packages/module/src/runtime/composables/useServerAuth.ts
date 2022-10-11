import type { UserRecord } from 'firebase-admin/auth'
import type { H3Event } from 'h3'

interface Auth {
   /**
    * `auth.currentUser`
    */
   currentUser: UserRecord | null

   /**
    * Whether the user is logged in (Checks if `currentUser` is filled)
    */
   isAuthenticated: boolean
}

/**
 * Use `Auth` instance of Firebase and reactive `currentUser` and `isAuthenticated`
 */
export const useServerAuth = ({ context }: H3Event): Auth => {
  const currentUser: UserRecord | null = context.__FIREBASE_AUTH_CURRENT_USER__ ?? null
  const isAuthenticated = Boolean(currentUser)
  return { currentUser, isAuthenticated }
}
