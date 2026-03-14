/**
 * Plugin auth awal — @nuxtjs/supabase mengelola auth state secara otomatis.
 * Plugin ini hanya memastikan profil di-fetch setelah user sudah tersedia.
 */
export default defineNuxtPlugin(async () => {
    if (!import.meta.client) return

    const authStore = useAuthStore()

    // Jika user sudah authenticated saat mount, pastikan profil sudah di-load
    if (authStore.user && !authStore.profile) {
        await authStore.fetchProfile()
    }
})
