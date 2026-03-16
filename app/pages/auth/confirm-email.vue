<!-- pages/auth/confirm-email.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'blank',
  middleware: ['guest']
})

const toast = usejuruTaniToast()
const authStore = useAuthStore()
const route = useRoute()

const email = ref(route.query.email as string || '')
const canResend = ref(false)
const countdown = ref(0)
let countdownInterval: ReturnType<typeof setInterval> | null = null

const isLoading = computed(() => authStore.loading)

const startCountdown = () => {
  canResend.value = false
  countdown.value = 60
  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      canResend.value = true
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, 1000)
}

const handleResendConfirmation = async () => {
  if (!email.value) {
    toast.error('Email tidak ditemukan. Silakan daftar kembali.', 3000)
    return
  }
  const result = await authStore.resendConfirmation(email.value)
  if (result.success) {
    toast.success('Email konfirmasi telah dikirim ulang. Silakan cek kotak masuk Anda.', 5000)
    startCountdown()
  } else {
    toast.error(result.error || 'Gagal mengirim ulang email konfirmasi.', 3000)
  }
}

onBeforeUnmount(() => { if (countdownInterval) clearInterval(countdownInterval) })

onMounted(() => {
  startCountdown()
  if (!email.value) {
    toast.warning('Silakan daftar terlebih dahulu.', 3000)
    navigateTo('/auth/register')
  }
})
</script>
<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="flex items-center justify-center space-x-3 mb-8">
            <NuxtLink data-pg-name="Logo" class="flex items-center sm:flex-row" to="/">
              <NuxtImg src="/LOGO02.png" alt="Logo" class="h-10" />
            </NuxtLink>
      </div>
      
      <UCard class="shadow-lg border-0">
        <div class="text-center p-6">
          <!-- Icon email -->
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UIcon name="i-lucide-mail" class="w-8 h-8 text-green-600" />
          </div>
          
          <!-- Title -->
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Periksa Email Anda
          </h2>
          
          <!-- Description -->
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Kami telah mengirimkan link konfirmasi ke email:
          </p>
          
          <!-- Email display -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-6">
            <p class="font-medium text-green-600 break-all">
              {{ email }}
            </p>
          </div>
          
          <!-- Instructions -->
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-6 space-y-2">
            <p>• Klik link konfirmasi di email untuk mengaktifkan akun</p>
            <p>• Periksa folder spam/junk jika tidak menemukan email</p>
            <p>• Link akan kedaluwarsa dalam 24 jam</p>
          </div>
          
          <!-- Resend section -->
          <div class="border-t pt-6">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Tidak menerima email?
            </p>
            
            <UButton
              v-if="canResend"
              color="success"
              variant="outline"
              :loading="loading"
              :disabled="loading"
              class="w-full"
              @click="handleResendConfirmation"
            >
              <UIcon name="i-lucide-send" class="w-4 h-4 mr-2" />
              {{ loading ? 'Mengirim...' : 'Kirim Ulang Email' }}
            </UButton>
            
            <UButton
              v-else
              color="neutral"
              variant="outline"
              disabled
              class="w-full"
            >
              <UIcon name="i-lucide-clock" class="w-4 h-4 mr-2" />
              Kirim Ulang dalam {{ countdown }}s
            </UButton>
          </div>
          
          <!-- Back to login -->
          <div class="mt-6 pt-6 border-t">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Sudah konfirmasi email?
            </p>
            <UButton
              variant="link"
              to="/auth/login"
              class="text-green-600 hover:text-green-700 font-medium"
            >
              <UIcon name="i-lucide-arrow-left" class="w-4 h-4 mr-1" />
              Kembali ke Login
            </UButton>
          </div>
        </div>
      </UCard>
      
      <!-- Footer -->
      <div class="text-center text-sm text-gray-400 mt-6">
        <p>&copy; 2026 JuruTani. Teknologi untuk pertanian Indonesia.</p>
      </div>
    </div>
  </div>
</template>