
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { toastStore } from '~/composables/useJuruTaniToast'

const authStore = useAuthStore()
const supabase = useSupabaseClient()

// SEO Meta
useHead({
  title: 'Pengaturan Akun - JuruTani',
  meta: [
    { name: 'description', content: 'Kelola pengaturan email dan password akun JuruTani Anda dengan aman.' }
  ]
})

// Get current user from auth store
const currentUser = computed(() => authStore.user)

// State
const newEmail = ref('')
const confirmEmail = ref('')
const resetEmail = ref('')
const isLoadingChangeEmail = ref(false)
const isLoadingResetPassword = ref(false)
const emailError = ref('')
const confirmEmailError = ref('')
const resetEmailError = ref('')
const successMessage = ref('')

// Function to get current user is not needed anymore
const getCurrentUser = async () => {
  return authStore.user
}

// Email validation
const validateEmail = (email: string) => {
  if (!email) return 'Email wajib diisi'
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  if (!emailRegex.test(email)) return 'Format email tidak valid'
  return ''
}

// Computed properties
const isEmailFormValid = computed(() => {
  return newEmail.value && 
         confirmEmail.value && 
         newEmail.value === confirmEmail.value && 
         !emailError.value && 
         !confirmEmailError.value &&
         newEmail.value.toLowerCase() !== currentUser.value?.email?.toLowerCase()
})

// Watchers for real-time validation
watch(newEmail, (value) => {
  emailError.value = validateEmail(value)
  if (value && currentUser.value?.email && value.toLowerCase() === currentUser.value.email.toLowerCase()) {
    emailError.value = 'Email baru harus berbeda dengan email saat ini'
  }
  // Revalidate confirmation email
  if (confirmEmail.value && value !== confirmEmail.value) {
    confirmEmailError.value = 'Email konfirmasi tidak cocok'
  } else if (confirmEmail.value && value === confirmEmail.value) {
    confirmEmailError.value = ''
  }
})

watch(confirmEmail, (value) => {
  if (value && newEmail.value && value !== newEmail.value) {
    confirmEmailError.value = 'Email konfirmasi tidak cocok'
  } else if (value && newEmail.value && value === newEmail.value) {
    confirmEmailError.value = ''
  }
})

watch(resetEmail, (value) => {
  resetEmailError.value = validateEmail(value)
})

// Handle change email
const handleChangeEmail = async () => {
  // Clear previous messages
  successMessage.value = ''
  
  // Validate inputs
  const newEmailValidation = validateEmail(newEmail.value)
  const confirmEmailValidation = validateEmail(confirmEmail.value)
  
  if (newEmailValidation) {
    emailError.value = newEmailValidation
    return
  }
  
  if (confirmEmailValidation) {
    confirmEmailError.value = confirmEmailValidation
    return
  }
  
  if (newEmail.value !== confirmEmail.value) {
    confirmEmailError.value = 'Email konfirmasi tidak cocok'
    return
  }
  
  if (newEmail.value.toLowerCase() === currentUser.value?.email?.toLowerCase()) {
    emailError.value = 'Email baru harus berbeda dengan email saat ini'
    return
  }

  isLoadingChangeEmail.value = true
  emailError.value = ''
  confirmEmailError.value = ''

  try {
    const { error } = await supabase.auth.updateUser({ 
      email: newEmail.value.toLowerCase().trim() 
    })

    if (error) {
      let errorMessage = 'Gagal mengubah email'
      
      if (error.message.includes('rate_limit')) {
        errorMessage = 'Terlalu banyak percobaan. Coba lagi dalam beberapa menit.'
      } else if (error.message.includes('email_address_invalid')) {
        errorMessage = 'Format email tidak valid'
      } else if (error.message.includes('email_address_taken')) {
        errorMessage = 'Email sudah digunakan oleh akun lain'
      }
      
      emailError.value = errorMessage
      toastStore.error(errorMessage)
    } else {
      successMessage.value = 'Link konfirmasi berhasil dikirim ke email baru Anda. Silakan cek kotak masuk dan klik link konfirmasi.'
      toastStore.success('Email berhasil diubah! Cek email baru untuk konfirmasi.')
      newEmail.value = ''
      confirmEmail.value = ''
    }
  } catch (error) {
    console.error('Email update error:', error)
    emailError.value = 'Terjadi kesalahan sistem. Silakan coba lagi.'
    toastStore.error('Terjadi kesalahan sistem. Silakan coba lagi.')
  } finally {
    isLoadingChangeEmail.value = false
  }
}

// Handle reset password
const handleResetPassword = async () => {
  // Clear previous messages
  successMessage.value = ''
  
  const validation = validateEmail(resetEmail.value)
  if (validation) {
    resetEmailError.value = validation
    return
  }

  isLoadingResetPassword.value = true
  resetEmailError.value = ''

  try {
    const { success, error } = await authStore.resetPassword(resetEmail.value.toLowerCase().trim())

    if (!success) {
      let errorMessage = 'Gagal mengirim link reset password'
      
      if (error && error.includes('rate_limit')) {
        errorMessage = 'Terlalu banyak percobaan. Coba lagi dalam beberapa menit.'
      } else if (error && error.includes('user_not_found')) {
        errorMessage = 'Email tidak terdaftar di sistem'
      }
      
      resetEmailError.value = errorMessage
      toastStore.error(errorMessage)
    } else {
      successMessage.value = 'Link reset password berhasil dikirim ke email Anda. Silakan cek kotak masuk.'
      toastStore.success('Link reset password berhasil dikirim!')
      resetEmail.value = ''
    }
  } catch (error: any) {
    console.error('Reset password error:', error)
    resetEmailError.value = 'Terjadi kesalahan sistem. Silakan coba lagi.'
    toastStore.error('Terjadi kesalahan sistem. Silakan coba lagi.')
  } finally {
    isLoadingResetPassword.value = false
  }
}

// Initialize component
onMounted(async () => {
  await authStore.fetchProfile()
  
  // Auto-fill current user email for reset password
  if (currentUser.value?.email) {
    resetEmail.value = currentUser.value.email
  }
})

// Listen for auth store changes instead of Supabase client manually
watch(currentUser, (user) => {
  if (user?.email && !resetEmail.value) {
    resetEmail.value = user.email
  }
})
</script>

<template>
  <div class="min-h-screen py-12 px-4 transition-colors duration-200">
    <div class="max-w-2xl mx-auto">
       <!-- Header Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-600 dark:bg-green-700 rounded-full mb-4 shadow-lg dark:shadow-green-900/50">
          <UIcon name="i-lucide-shield" class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Pengaturan Akun</h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Kelola pengaturan email akun JuruTani Anda dengan aman.
        </p>
      </div>

      <div class="space-y-6">
        <!-- Email Settings -->
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-md border border-gray-200 dark:border-gray-800 p-6 transition-all duration-200">
          <div class="flex items-center mb-6">
            <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Pengaturan Email</h3>
          </div>

          <!-- Current Email Display -->
          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-green-400 dark:border-green-600 transition-colors duration-200">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Saat Ini</p>
            <p class="text-gray-900 dark:text-white font-medium">{{ currentUser?.email || 'Tidak ada email' }}</p>
          </div>

          <!-- Change Email Form -->
          <form class="space-y-4" @submit.prevent="handleChangeEmail">
            <div>
              <label for="newEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Baru
              </label>
              <div class="relative">
                <input
                  id="newEmail"
                  v-model="newEmail"
                  type="email"
                  placeholder="masukkan@email.baru"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-600 dark:focus:border-green-600 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  :class="{ 'border-red-300 dark:border-red-600': emailError }"
                  required
                >
              </div>
              <p v-if="emailError" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ emailError }}</p>
            </div>

            <div>
              <label for="confirmEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Konfirmasi Email Baru
              </label>
              <input
                id="confirmEmail"
                v-model="confirmEmail"
                type="email"
                placeholder="konfirmasi email baru"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-600 dark:focus:border-green-600 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                :class="{ 'border-red-300 dark:border-red-600': confirmEmailError }"
                required
              >
              <p v-if="confirmEmailError" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ confirmEmailError }}</p>
            </div>

            <button
              type="submit"
              :disabled="isLoadingChangeEmail || !isEmailFormValid"
              class="w-full bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              <span v-if="isLoadingChangeEmail" class="flex items-center justify-center">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                Mengubah Email...
              </span>
              <span v-else>Ubah Email</span>
            </button>
          </form>
        </div>

        <!-- Password Settings -->
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-md border border-gray-200 dark:border-gray-800 p-6 transition-all duration-200">
          <div class="flex items-center mb-6">
            <UIcon name="i-heroicons-key" class="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Pengaturan Password</h3>
          </div>

          <form class="space-y-4" @submit.prevent="handleResetPassword">
            <div class="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800 mb-4 transition-colors duration-200">
              <div class="flex items-start">
                <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 mr-2 shrink-0" />
                <div class="text-sm text-green-800 dark:text-green-200">
                  <p class="font-medium mb-1">Reset Password</p>
                  <p>Kami akan mengirim link reset password ke email Anda.</p>
                </div>
              </div>
            </div>

            <div>
              <label for="resetEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Akun
              </label>
              <input
                id="resetEmail"
                v-model="resetEmail"
                type="email"
                placeholder="email@akun.anda"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-600 dark:focus:border-green-600 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                :class="{ 'border-red-300 dark:border-red-600': resetEmailError }"
                required
              >
              <p v-if="resetEmailError" class="text-red-500 dark:text-red-400 text-sm mt-1">{{ resetEmailError }}</p>
            </div>

            <button
              type="submit"
              :disabled="isLoadingResetPassword || !resetEmail"
              class="w-full bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              <span v-if="isLoadingResetPassword" class="flex items-center justify-center">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                Mengirim Link...
              </span>
              <span v-else>Kirim Link Reset Password</span>
            </button>
          </form>
        </div>

        <!-- Success Messages -->
        <div v-if="successMessage" class="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800 transition-colors duration-200">
          <div class="flex">
            <div class="shrink-0 mt-0.5 mr-2">
              <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-500 dark:text-green-400" />
            </div>
            <p class="text-sm text-green-800 dark:text-green-200">{{ successMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
