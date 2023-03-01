import { defineEventHandler, getHeader } from 'h3'
import * as jwt from 'jsonwebtoken'
import type { AuthUser } from '../types'

export default defineEventHandler((event) => {
  const idToken = getHeader(event, 'authorization')?.split(' ')[1]
  if (!idToken) { return }
  let currentUser: AuthUser | null = null

  const decodedJWT = jwt.decode(idToken)
  if (!decodedJWT || typeof decodedJWT === 'string') { return }
  currentUser = { isSSRData: true, displayName: decodedJWT.name, photoURL: decodedJWT.picture, email: decodedJWT.email, uid: decodedJWT.user_id, emailVerified: decodedJWT.email_verified }

  event.context.__FIREBASE_AUTH_CURRENT_USER__ = currentUser
})
