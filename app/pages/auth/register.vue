<!-- pages/auth/register.vue -->
<script setup lang="ts">
// SEO Optimization
useSeoAuth('register')

definePageMeta({
  layout: 'blank',
  middleware: ['guest']
})

const toast = usejuruTaniToast()
const authStore = useAuthStore()

const form = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const togglePasswordVisibility = () => { showPassword.value = !showPassword.value }
const toggleConfirmPasswordVisibility = () => { showConfirmPassword.value = !showConfirmPassword.value }

const passwordStrength = computed(() => {
  const p = form.value.password
  if (!p) return { score: 0, text: '', color: '' }
  const score = [
    p.length >= 8,
    /[a-z]/.test(p),
    /[A-Z]/.test(p),
    /\d/.test(p),
    /[!@#$%^&*(),.?":{}|<>]/.test(p),
  ].filter(Boolean).length
  if (score <= 2) return { score, text: 'Lemah', color: 'text-red-500' }
  if (score <= 3) return { score, text: 'Sedang', color: 'text-yellow-500' }
  if (score <= 4) return { score, text: 'Kuat', color: 'text-green-500' }
  return { score, text: 'Sangat Kuat', color: 'text-green-600' }
})

const passwordsMatch = computed(() => {
  if (!form.value.confirmPassword) return null
  return form.value.password === form.value.confirmPassword
})

const isLoading = computed(() => authStore.loading)

const handleRegister = async () => {
  const { fullName, email, password, confirmPassword, agreeTerms } = form.value

  if (!fullName || !email || !password || !confirmPassword) {
    toast.warning('Semua field harus diisi.', 3000)
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    toast.warning('Format email tidak valid.', 3000)
    return
  }
  if (password.length < 8) {
    toast.warning('Kata sandi harus minimal 8 karakter.', 3000)
    return
  }
  if (password !== confirmPassword) {
    toast.warning('Kata sandi dan konfirmasi kata sandi tidak cocok.', 3000)
    return
  }
  if (!agreeTerms) {
    toast.warning('Anda harus menyetujui syarat dan ketentuan.', 3000)
    return
  }

  const result = await authStore.signUp(email, password, fullName)

  if (result.success) {
    toast.success('Pendaftaran berhasil! Silakan periksa email Anda.', 3000)
    await navigateTo({ path: '/auth/confirm-email', query: { email } })
  } else {
    toast.error(result.error || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.', 5000)
  }
}

const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
  const { success, error } = await authStore.signInWithSocialProvider(provider)
  if (!success) {
    toast.error(error || `Login dengan ${provider} gagal.`, 3000)
  }
}
</script>
<template>
  <div class="min-h-screen flex">
    <!-- Side image - ilustrasi pertanian modern -->
    <div class="hidden lg:flex lg:w-1/2 bg-green-600 relative overflow-hidden">
      <div class="absolute inset-0 bg-linear-to-br from-green-600 to-emerald-800 opacity-90"/>
      
      <!-- Pola abstrak -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 border-8 border-white rounded-full"/>
        <div class="absolute bottom-1/3 right-1/4 w-72 h-72 border-8 border-white rounded-full"/>
        <div class="absolute top-1/2 right-1/3 w-48 h-48 border-8 border-white rounded-full"/>
      </div>
      
      <!-- Info branding -->
      <div class="relative z-10 flex flex-col justify-between h-full p-12 text-white">
        <div>
          <div class="flex items-center space-x-3">
            <NuxtLink data-pg-name="Logo" class="flex items-center sm:flex-row" to="/">
              <NuxtImg src="/LOGO02.png" alt="Logo" class="h-10" />
            </NuxtLink>
          </div>
          <p class="mt-2 text-green-100">Bergabung untuk masa depan pertanian yang lebih baik</p>
        </div>
        
        <div class="space-y-6">
          <!-- Highlight fitur -->
          <div class="flex items-start space-x-3">
            <UIcon name="i-lucide-users" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Komunitas Petani</h3>
              <p class="text-sm text-green-100">Terhubung dengan ribuan petani sukses di seluruh Indonesia</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Teknologi Pertanian</h3>
              <p class="text-sm text-green-100">Akses teknologi terbaru untuk meningkatkan hasil panen</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Analisis Pertanian</h3>
              <p class="text-sm text-green-100">Pantau perkembangan lahan dengan data analitik yang akurat</p>
            </div>
          </div>
        </div>
        
        <div class="text-sm">
          &copy; 2026 JuruTani. Teknologi untuk pertanian Indonesia.
        </div>
      </div>
    </div>
    
    <!-- Form register -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <div class="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <NuxtLink data-pg-name="Logo" class="flex items-center sm:flex-row" to="/">
              <NuxtImg src="/LOGO02.png" alt="Logo" class="h-10" />
            </NuxtLink>
        </div>
        
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Buat Akun Baru</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Bergabung dengan platform JuruTani</p>
        </div>
        
        <UCard class="shadow-sm border-green-100 dark:border-green-700">
          <form @submit.prevent="handleRegister">
            <UFormField label="Nama Lengkap" name="fullName">
              <div class="relative">
                <UInput
                  v-model="form.fullName"
                  placeholder="Contoh: Budi Santoso"
                  size="lg"
                  :disabled="isLoading"
                  class="w-full"
                />
                <div class="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                  <UIcon name="i-lucide-user" class="w-5 h-5" />
                </div>
              </div>
            </UFormField>

            <UFormField label="Email" name="email" class="mt-4">
              <div class="relative">
                <UInput
                v-model="form.email"
                type="email"
                placeholder="nama@example.com"
                size="lg"
                :disabled="isLoading"
                class="w-full"
              />
                <div class="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                  <UIcon name="i-lucide-mail" class="w-5 h-5" />
                </div>
              </div>
            </UFormField>

            <UFormField label="Kata Sandi" name="password" class="mt-4">
              <div class="relative">
                <UInput
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimal 8 karakter"
                size="lg"
                :disabled="isLoading"
                class="w-full"
              />
                <button
                  type="button"
                  class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300 transition-colors duration-200"
                  :aria-label="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
                  @click="togglePasswordVisibility"
                >
                  <UIcon 
                    :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" 
                    class="w-5 h-5" 
                  />
                </button>
              </div>
              
              <!-- Password Strength Indicator -->
              <div v-if="form.password" class="mt-2">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-500 dark:text-gray-400">Kekuatan kata sandi:</span>
                  <span :class="passwordStrength.color" class="font-medium">
                    {{ passwordStrength.text }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div 
                    class="h-1 rounded-full transition-all duration-300"
                    :class="{
                      'bg-red-500': passwordStrength.score <= 2,
                      'bg-yellow-500': passwordStrength.score === 3,
                      'bg-green-500': passwordStrength.score >= 4
                    }"
                    :style="{ width: `${(passwordStrength.score / 5) * 100}%` }"
                  />
                </div>
              </div>
            </UFormField>

            <UFormField label="Konfirmasi Kata Sandi" name="confirmPassword" class="mt-4">
              <div class="relative">
                <UInput
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Masukkan kembali kata sandi"
                size="lg"
                :disabled="isLoading"
                class="w-full"
              />
                <button
                  type="button"
                  class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300 transition-colors duration-200"
                  :aria-label="showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'"
                  @click="toggleConfirmPasswordVisibility"
                >
                  <UIcon 
                    :name="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" 
                    class="w-5 h-5" 
                  />
                </button>
              </div>
              
              <!-- Password Match Indicator -->
              <div v-if="form.confirmPassword" class="mt-2 flex items-center text-xs">
                <UIcon 
                  :name="passwordsMatch ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                  :class="passwordsMatch ? 'text-green-500' : 'text-red-500'"
                  class="w-4 h-4 mr-1"
                />
                <span :class="passwordsMatch ? 'text-green-600' : 'text-red-600'">
                  {{ passwordsMatch ? 'Kata sandi cocok' : 'Kata sandi tidak cocok' }}
                </span>
              </div>
            </UFormField>

            <div class="mt-4">
              <UCheckbox 
              v-model="form.agreeTerms" 
              name="agreeTerms"
              :disabled="isLoading"
              class="text-sm"
            >
                <template #label>
                  <span>
                    Saya menyetujui 
                    <UButton
                      variant="link"
                      to="/terms"
                      class="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-0 font-medium underline-offset-2"
                    >
                      Syarat & Ketentuan
                    </UButton> 
                    dan 
                    <UButton
                      variant="link"
                      to="/privacy-policy"
                      class="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-0 font-medium underline-offset-2"
                    >
                      Kebijakan Privasi
                    </UButton>
                  </span>
                </template>
              </UCheckbox>
            </div>

            <div class="mt-6">
              <UButton
              type="submit"
              block
              color="primary"
              :loading="isLoading"
              :disabled="isLoading || !form.agreeTerms || passwordsMatch === false"
              class="bg-green-600 hover:bg-green-700 text-white font-medium"
            >
                <template #leading>
                  <UIcon v-if="!isLoading" name="i-lucide-user-plus" class="w-5 h-5" />
                </template>
                {{ isLoading ? 'Mendaftar...' : 'Daftar Sekarang' }}
              </UButton>
            </div>
          </form>

          <!-- Social Login Section -->
          <div class="relative flex items-center justify-center gap-3 my-6">
            <span class="h-px flex-1 bg-gray-200 dark:bg-gray-700"/>
            <span class="text-sm text-gray-400">atau</span>
            <span class="h-px flex-1 bg-gray-200 dark:bg-gray-700"/>
          </div>

          <div class="grid grid-cols-1 place-items-center gap-3">
            <UButton
            variant="outline"
            :disabled="isLoading"
            :loading="isLoading"
            class="bg-white cursor-pointer hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
            @click="handleSocialLogin('google')"
          >
              <UIcon v-if="!isLoading" name="i-logos-google-icon" class="mr-2 h-5 w-5" />
              Daftar dengan Google
            </UButton>
          </div>
        </UCard>
        
        <div class="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Sudah punya akun?
          <UButton 
            variant="link" 
            to="/auth/login" 
            class="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
          >
            Masuk sekarang
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>