/**
 * Guest Middleware — redirect user yang sudah login ke halaman utama.
 */
export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser()

  if (user.value) {
    return navigateTo('/', { replace: true })
  }
})
