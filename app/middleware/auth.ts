/**
 * Auth Middleware — proteksi route yang memerlukan autentikasi.
 * Menggunakan useSupabaseUser() dari @nuxtjs/supabase (sudah reactive)
 * dan Pinia store untuk data profil.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
  }

  // Pastikan profil tersedia (lazy-load)
  const authStore = useAuthStore()
  if (!authStore.profile) {
    await authStore.fetchProfile()
  }
})
