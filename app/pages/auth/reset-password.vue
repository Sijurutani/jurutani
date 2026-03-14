<script setup lang="ts">
// SEO Optimization
useSeoAuth('reset-password')

definePageMeta({
  layout: 'blank',
  middleware: ['guest']
})

const toast = usejuruTaniToast()
const authStore = useAuthStore()
const client = useSupabaseClient()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const isValidSession = ref(false)
const isCheckingSession = ref(true)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const isPasswordValid = computed(() => password.value.length >= 8)
const isFormValid = computed(
  () => isPasswordValid.value && password.value === confirmPassword.value && password.value.length > 0
)
const isLoading = computed(() => authStore.loading)

onMounted(async () => {
  try {
    const { data: { session } } = await client.auth.getSession()
    if (session) {
      isValidSession.value = true
    } else {
      toast.error('Link reset password tidak valid atau sudah kadaluarsa.')
      setTimeout(() => router.push('/auth/forgot-password'), 2000)
    }
  } catch {
    toast.error('Terjadi kesalahan saat memverifikasi session.')
    router.push('/auth/forgot-password')
  } finally {
    isCheckingSession.value = false
  }
})

const handleUpdatePassword = async () => {
  if (!isFormValid.value) {
    toast.warning('Pastikan semua field diisi dengan benar.')
    return
  }
  if (password.value !== confirmPassword.value) {
    toast.error('Password konfirmasi tidak cocok.')
    return
  }

  const { success, error } = await authStore.updatePassword(password.value)

  if (!success) {
    toast.error('Gagal mengupdate password. ' + (error || ''))
    return
  }

  toast.success('Password berhasil diperbarui!')
  setTimeout(() => router.push('/auth/login'), 2000)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      
      <!-- Loading State -->
      <div v-if="isCheckingSession" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div class="text-center">
          <div class="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
          <p class="text-gray-600 dark:text-gray-400">Memverifikasi session...</p>
        </div>
      </div>

      <!-- Main Form -->
      <div v-else-if="isValidSession" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span class="text-white text-xl font-bold">🌱</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Reset Password
          </h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            Buat password baru untuk akun JuruTani Anda
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="handleUpdatePassword">
          
          <!-- Password Baru -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password Baru
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimal 8 karakter"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                :disabled="isLoading"
                required
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L21.036 21.036"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
            <p v-if="password && !isPasswordValid" class="text-xs text-red-500 mt-1">
              Password minimal 8 karakter
            </p>
          </div>

          <!-- Konfirmasi Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Konfirmasi Password
            </label>
            <div class="relative">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Ulangi password baru"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                :disabled="isLoading"
                required
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L21.036 21.036"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
            <p v-if="confirmPassword && password !== confirmPassword" class="text-xs text-red-500 mt-1">
              Password tidak cocok
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"/>
              Memperbarui...
            </span>
            <span v-else>Update Password</span>
          </button>

        </form>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <NuxtLink 
            to="/auth/login"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            ← Kembali ke Login
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>