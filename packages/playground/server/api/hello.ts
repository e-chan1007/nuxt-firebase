import { setResponseStatus } from 'h3'
import { useServerAuth } from '#firebase/server'

export default defineEventHandler((event) => {
  // To use in server routes, you should use `useServerAuth`:
  const { currentUser, isAuthenticated } = useServerAuth(event)

  if (!isAuthenticated) {
    setResponseStatus(event, 401, 'Unauthorized')
    return {
      message: 'Not authenticated',
      user: null
    }
  }
  return {
    message: 'OK',
    user: currentUser
  }
})
