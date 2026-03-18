<script setup lang="ts">
import { toastStore } from '~/composables/useJuruTaniToast'

definePageMeta({
  layout: 'blank',
  middleware: ['guest'],
  ssr: false,
})

const authStore = useAuthStore()
const loading = ref(true)
const statusMessage = ref('Memproses login...')

onMounted(async () => {
  try {
    // Beri waktu @nuxtjs/supabase menyelesaikan pertukaran session secara internal
    // Module ini sudah handle PKCE + exchangeCodeForSession otomatis di background
    let attempts = 0
    const maxAttempts = 20 // maksimal 10 detik (20 x 500ms)

    const waitForSession = () =>
      new Promise<void>((resolve) => {
        const check = async () => {
          attempts++
          const user = authStore.user

          if (user) {
            resolve()
            return
          }

          if (attempts >= maxAttempts) {
            resolve() // resolve agar tidak hang, user akan null → redirect ke login
            return
          }

          setTimeout(check, 500)
        }
        check()
      })

    statusMessage.value = 'Memverifikasi akun...'
    await waitForSession()

    const user = authStore.user

    if (!user) {
      toastStore.error('Login gagal atau sesi tidak ditemukan. Silakan coba lagi.', 5000)
      await navigateTo('/auth/login?error=oauth_failed')
      return
    }

    statusMessage.value = 'Memuat profil...'
    await authStore.fetchProfile(user.sub ?? user.id)

    const fullName = authStore.displayName || user.email?.split('@')[0] || 'Petani Hebat'
    toastStore.success(`Selamat datang, ${fullName}!`, 3000)

    statusMessage.value = 'Mengarahkan...'
    await navigateTo('/')
  } catch (err: any) {
    toastStore.error('Terjadi kesalahan: ' + (err?.message || 'Error tidak diketahui'), 5000)
    await navigateTo('/auth/login?error=callback_failed')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <!-- Tidak render UI apapun -->
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">{{ statusMessage }}</h2>
        <p class="text-gray-500 dark:text-gray-400">Mohon tunggu sebentar</p>
      </div>
    </div>
  </div>
</template>