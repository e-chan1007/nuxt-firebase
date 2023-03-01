export default defineNuxtRouteMiddleware(() => {
  // You can use `useAuth` in middlewares:
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return navigateTo('/login')
  }
})
