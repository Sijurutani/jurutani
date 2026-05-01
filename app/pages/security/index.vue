<script setup lang="ts">
import { ref, computed } from 'vue'
import { toastStore } from '@/composables/useJuruTaniToast'

const supabase = useSupabaseClient()

// SEO Meta
useSeoOptimized('security')

// Form data
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Password strength calculation
const passwordStrength = computed(() => {
  const password = newPassword.value
  let score = 0
  
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  
  return score
})

const passwordStrengthText = computed(() => {
  const score = passwordStrength.value
  if (score === 0) return ''
  if (score <= 2) return 'Lemah'
  if (score <= 4) return 'Sedang'
  return 'Kuat'
})

const passwordStrengthColor = computed(() => {
  const score = passwordStrength.value
  if (score <= 2) return 'bg-red-500'
  if (score <= 4) return 'bg-yellow-500'
  return 'bg-green-500'
})

const passwordStrengthTextColor = computed(() => {
  const score = passwordStrength.value
  if (score <= 2) return 'text-red-600'
  if (score <= 4) return 'text-yellow-600'
  return 'text-green-600'
})

const passwordStrengthWidth = computed(() => {
  const score = passwordStrength.value
  return `${Math.min(score * 16.67, 100)}%`
})

// Form validation
const isFormValid = computed(() => {
  return newPassword.value.length >= 6 && 
         newPassword.value === confirmPassword.value &&
         passwordStrength.value >= 3
})

// Form submission
const handleChangePassword = async () => {
  // Validation
  if (newPassword.value !== confirmPassword.value) {
    toastStore.error('Password tidak cocok')
    return
  }

  if (newPassword.value.length < 6) {
    toastStore.error('Password harus minimal 6 karakter')
    return
  }

  if (passwordStrength.value < 3) {
    toastStore.error('Password terlalu lemah. Gunakan kombinasi huruf besar, kecil, angka, dan simbol.')
    return
  }

  loading.value = true
  
  try {
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword.value 
    })

    if (error) {
      let errorMessage = 'Gagal mengganti password'
      
      if (error.message.includes('rate_limit')) {
        errorMessage = 'Terlalu banyak percobaan. Coba lagi dalam beberapa menit.'
      } else if (error.message.includes('weak_password')) {
        errorMessage = 'Password terlalu lemah. Gunakan password yang lebih kuat.'
      } else if (error.message.includes('same_password')) {
        errorMessage = 'Password baru tidak boleh sama dengan password lama.'
      }
      
      toastStore.error(errorMessage)
    } else {
      toastStore.success('Password berhasil diperbarui! Akun Anda sekarang lebih aman.')
      
      // Clear form
      newPassword.value = ''
      confirmPassword.value = ''
      
      // Optional: redirect after success
      // setTimeout(() => {
      //   navigateTo('/profile')
      // }, 2000)
    }
  } catch (error) {
    console.error('Password update error:', error)
    toastStore.error('Terjadi kesalahan sistem. Silakan coba lagi.')
  } finally {
    loading.value = false
  }
}

// Auto-focus new password input on mount
onMounted(() => {
  const passwordInput = document.getElementById('newPassword')
  if (passwordInput) {
    passwordInput.focus()
  }
})
</script>

<template>
  <div class="min-h-screen py-12 px-4 transition-colors duration-200">
    <div class="max-w-md mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-600 dark:bg-green-700 rounded-full mb-4 shadow-lg dark:shadow-green-900/50">
          <UIcon name="i-heroicons-lock-closed" class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Ganti Password</h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Pastikan password baru Anda kuat dan mudah diingat
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/50 border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-200">
        <div class="p-6">
          <form class="space-y-6" @submit.prevent="handleChangePassword">
            <!-- Password Strength Info -->
            <div class="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border-l-4 border-blue-400 dark:border-blue-600 transition-colors duration-200">
              <div class="flex items-start">
                <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-400 dark:text-blue-500 mt-0.5 mr-2 shrink-0" />
                <div>
                  <p class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Tips Password Kuat</p>
                  <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Minimal 8 karakter</li>
                    <li>• Kombinasi huruf besar, kecil, dan angka</li>
                    <li>• Gunakan simbol (!@#$%)</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- New Password Input -->
            <div class="space-y-2">
              <label for="newPassword" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password Baru
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-lock-closed" class="h-5 w-5 text-gray-400 dark:text-gray-600" />
                </div>
                <input
                  id="newPassword"
                  v-model="newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-600 dark:focus:border-green-600
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                         transition-colors duration-200
                         hover:border-gray-400 dark:hover:border-gray-500"
                  placeholder="Masukkan password baru"
                  required
                >
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
                  @click="showNewPassword = !showNewPassword"
                >
                  <UIcon :name="showNewPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="h-5 w-5" />
                </button>
              </div>
              <!-- Password Strength Indicator -->
              <div v-if="newPassword" class="mt-2">
                <div class="flex items-center space-x-2">
                  <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all duration-300"
                      :class="passwordStrengthColor"
                      :style="{ width: passwordStrengthWidth }"
                    />
                  </div>
                  <span class="text-sm font-medium dark:text-gray-300" :class="passwordStrengthTextColor">
                    {{ passwordStrengthText }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Confirm Password Input -->
            <div class="space-y-2">
              <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Konfirmasi Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-lock-closed" class="h-5 w-5 text-gray-400 dark:text-gray-600" />
                </div>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-600 dark:focus:border-green-600
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                         transition-colors duration-200
                         hover:border-gray-400 dark:hover:border-gray-500"
                  :class="{ 
                    'border-red-300 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-600 focus:border-red-500 dark:focus:border-red-600': confirmPassword && newPassword !== confirmPassword,
                    'border-green-300 dark:border-green-600 focus:ring-green-500 dark:focus:ring-green-600 focus:border-green-500 dark:focus:border-green-600': confirmPassword && newPassword === confirmPassword
                  }"
                  placeholder="Ulangi password baru"
                  required
                >
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <UIcon :name="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="h-5 w-5" />
                </button>
              </div>
              <!-- Password Match Indicator -->
              <div v-if="confirmPassword" class="flex items-center mt-2">
                <UIcon 
                  :name="newPassword === confirmPassword ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                  :class="newPassword === confirmPassword ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'"
                  class="w-4 h-4 mr-2"
                />
                <span 
                  :class="newPassword === confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                  class="text-sm font-medium"
                >
                  {{ newPassword === confirmPassword ? 'Password cocok' : 'Password tidak cocok' }}
                </span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="w-full bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700
                     hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600
                     disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-600 dark:disabled:to-gray-700
                     text-white font-semibold py-3 px-4 rounded-lg 
                     transition-all duration-200 transform 
                     hover:scale-[1.02] active:scale-[0.98]
                     disabled:cursor-not-allowed disabled:transform-none
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950
                     shadow-lg hover:shadow-xl dark:shadow-green-900/50"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Memproses...
              </span>
              <span v-else class="flex items-center justify-center">
                <UIcon name="i-heroicons-shield-check" class="w-5 h-5 mr-2" />
                Simpan Password
              </span>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div class="flex items-center justify-between text-sm">
            <button 
              type="button"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center"
              @click="$router.back()"
            >
              <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 mr-1" />
              Kembali
            </button>
            <div class="flex items-center text-gray-500 dark:text-gray-400">
              <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-1" />
              <span>Enkripsi 256-bit</span>
            </div>
          </div>
        </div>
      </div>      
    </div>
  </div>
</template>
