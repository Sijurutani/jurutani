<script setup lang="ts">
// SEO Optimization
useSeoAuth('forgot-password')

definePageMeta({
  layout: 'blank',
  middleware: ['guest']
})

const toast = usejuruTaniToast()
const authStore = useAuthStore()

const email = ref('')
const isSubmitted = ref(false)
const isLoading = computed(() => authStore.loading)

const handleResetPassword = async () => {
  if (!email.value) {
    toast.warning('Email tidak boleh kosong ...')
    return
  }

  const { success, error } = await authStore.resetPassword(email.value)

  if (success) {
    isSubmitted.value = true
    toast.success('Benih reset password telah dikirim ke email Anda! 🌱')
  } else {
    toast.error(error || 'Gagal mengirim benih reset password. Silakan coba lagi.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 flex items-center justify-center p-4">
    <!-- Background decorative elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-4 h-4 bg-green-300/30 dark:bg-green-600/30 rounded-full animate-float"/>
      <div class="absolute top-40 right-20 w-6 h-6 bg-emerald-300/20 dark:bg-emerald-600/20 rounded-full animate-float delay-1000"/>
      <div class="absolute bottom-40 left-20 w-3 h-3 bg-teal-300/40 dark:bg-teal-600/40 rounded-full animate-float delay-2000"/>
      <div class="absolute bottom-60 right-10 w-5 h-5 bg-green-400/25 dark:bg-green-500/25 rounded-full animate-float delay-1500"/>
    </div>

    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200/50 dark:border-green-700/50 p-8 w-full max-w-md relative overflow-hidden">
      <!-- Decorative top border -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-green-500 via-emerald-500 to-teal-500"/>
      
      <div v-if="!isSubmitted" class="space-y-6">
        <!-- Header with plant icon -->
        <div class="text-center space-y-4">
          <!-- Plant Icon -->
            <TheLogo class="mx-auto" />
          
          <h1 class="text-3xl font-bold bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Lupa Password?
          </h1>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            Jangan khawatir! Masukkan email Anda dan kami akan mengirimkan 
            <span class="text-green-600 dark:text-green-400 font-medium">benih</span> 
            untuk menumbuhkan password baru 🌱
          </p>
        </div>
        
        <form class="space-y-6" @submit.prevent="handleResetPassword">
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              🌿 Alamat Email
            </label>
            <div class="relative">
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="nama@email.com"
                class="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-green-200 dark:border-green-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-200 transition-all duration-300"
                :disabled="isLoading"
                required
              >
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            class="group w-full py-3 px-6 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Menanam benih...
            </span>
            <span v-else class="flex items-center gap-2">
              <svg class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              Kirim Benih Reset Password 🌱
            </span>
          </button>
        </form>
        
        <div class="text-center pt-4 border-t border-green-200/50 dark:border-green-700/50">
          <NuxtLink
            to="/auth/login"
            class="inline-flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium transition-colors duration-300 group"
          >
            <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Kembali ke kebun login
          </NuxtLink>
        </div>
      </div>
      
      <!-- Success State -->
      <div v-else class="text-center space-y-6">
        <!-- Success Plant Animation -->
        <div class="w-20 h-20 mx-auto mb-6 relative">
          <!-- Pot -->
          <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-12 bg-linear-to-b from-amber-600 to-amber-700 dark:from-amber-700 dark:to-amber-800 rounded-b-2xl rounded-t-lg"/>
          <!-- Soil -->
          <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-amber-900 dark:bg-amber-950 rounded-full"/>
          <!-- Main stem -->
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-12 bg-linear-to-t from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 rounded-full"/>
          <!-- Success leaves (bigger and more vibrant) -->
          <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <!-- Left leaf -->
            <div class="absolute -left-4 top-3 w-6 h-9 bg-linear-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full transform -rotate-45 origin-bottom animate-pulse"/>
            <!-- Right leaf -->
            <div class="absolute -right-4 top-3 w-6 h-9 bg-linear-to-bl from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full transform rotate-45 origin-bottom animate-pulse delay-300"/>
            <!-- Center leaf -->
            <div class="absolute -left-2 top-0 w-6 h-10 bg-linear-to-t from-green-500 to-green-400 dark:from-green-600 dark:to-green-500 rounded-full animate-pulse delay-150"/>
          </div>
          <!-- Sparkles -->
          <div class="absolute top-2 left-2 text-yellow-400 animate-bounce">✨</div>
          <div class="absolute top-4 right-2 text-green-400 animate-bounce delay-500">🌟</div>
        </div>

        <div class="space-y-4">
          <h2 class="text-2xl font-bold bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Benih Telah Ditanam! 🌱
          </h2>
          <div class="space-y-3">
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Kami telah menanam <span class="font-medium text-green-600 dark:text-green-400">benih reset password</span> 
              ke email 
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ email }}</span>
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Silakan periksa kotak masuk Anda dan tunggu hingga benih tersebut tumbuh menjadi password baru! 🌿
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-3 pt-6">
          <NuxtLink
            to="/auth/login"
            class="inline-flex items-center justify-center gap-2 py-3 px-6 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            Kembali ke Kebun Login
          </NuxtLink>
          
          <button
            class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium transition-colors duration-300"
            @click="isSubmitted = false; email = ''"
          >
            Tanam benih lain?
          </button>
        </div>
      </div>

      <!-- Decorative bottom elements -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-40 dark:opacity-60">
        <div class="text-sm animate-bounce delay-100">🌿</div>
        <div class="text-sm animate-bounce delay-300">🌱</div>
        <div class="text-sm animate-bounce delay-500">🍃</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>