export default defineNuxtRouteMiddleware(() => {
  // You can use `useAuth` in middlewares:
  const { currentUser } = useAuth()
  if (!currentUser) {
    return navigateTo('/login')
  }
})
