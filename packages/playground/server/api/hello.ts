import { useServerAuth } from '#firebase/server'

export default defineEventHandler((event) => {
  // To use in server routes, you should use `useServerAuth`:
  const { currentUser, isAuthenticated } = useServerAuth(event)

  if (!isAuthenticated) {
    event.res.statusCode = 401
    event.res.statusMessage = 'Unauthorized'
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
