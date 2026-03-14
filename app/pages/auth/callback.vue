<script setup lang="ts">
import { toastStore } from '~/composables/useJuruTaniToast'
import type { Database } from '~/types/database.types'

definePageMeta({
  layout: 'default',
  middleware: ['guest']
})

const client = useSupabaseClient<Database>()
const authStore = useAuthStore()
const route = useRoute()

const loading = ref(true)

onMounted(async () => {
  if (!import.meta.client) return
  try {
    // @ts-ignore
    const existingSession = authStore.session
    // @ts-ignore
    if (existingSession?.user) {
      // @ts-ignore
      await authStore.fetchProfile(existingSession.user.id)
      await navigateTo('/')
      return
    }

    const authCode = route.query.code as string

    if (!authCode) {
      toastStore.error('Login gagal: kode otorisasi tidak ditemukan.', 5000)
      await navigateTo('/auth/login?error=missing_code')
      return
    }

    const { data, error: authError } = await client.auth.exchangeCodeForSession(authCode)

    if (authError) {
      if (authError.message?.toLowerCase().includes('pkce code verifier not found')) {
        toastStore.error('Login sosial kedaluwarsa. Silakan ulangi login Google dari halaman login.', 6000)
        await navigateTo('/auth/login?error=pkce_verifier_missing')
        return
      }

      toastStore.error('Login gagal: ' + authError.message, 5000)
      await navigateTo('/auth/login?error=oauth_failed')
      return
    }

    if (data.session) {
      // Pinia store akan otomatis mendeteksi user via useSupabaseUser watcher
      // Tapi kita tetap eksplisit fetch profil agar data langsung tersedia
      await authStore.fetchProfile(data.session.user.id)
      toastStore.success('Login berhasil! Mengarahkan...', 1500)
      setTimeout(() => {
        loading.value = false
        navigateTo('/', { external: true })
      }, 1500)
    } else {
      toastStore.warning('Sesi login tidak ditemukan. Silakan coba lagi.', 3000)
      await navigateTo('/auth/login')
    }
  } catch (err: any) {
    toastStore.error('Terjadi kesalahan: ' + (err.message || 'Error tidak diketahui'), 5000)
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
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Memproses Login...</h2>
        <p class="text-gray-500 dark:text-gray-400">Mohon tunggu sebentar</p>
      </div>
    </div>
  </div>
</template>
