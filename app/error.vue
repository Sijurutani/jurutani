<script setup lang="ts">
// Props error otomatis dikirim oleh Nuxt saat ada error
const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
    stack?: string
  }
}>()

// Default values untuk error
const statusCode = computed(() => props.error?.statusCode ?? 500)
const statusMessage = computed(() => props.error?.statusMessage ?? 'Internal Server Error')
const message = computed(() => props.error?.message ?? 'Terjadi kesalahan pada server')

// Judul error sesuai kode status
const errorTitle = computed(() => {
  switch (statusCode.value) {
    case 400:
      return 'Permintaan Tidak Valid'
    case 401:
      return 'Tidak Diotorisasi'
    case 403:
      return 'Akses Ditolak'
    case 404:
      return 'Halaman Tidak Ditemukan'
    case 500:
      return 'Kesalahan Server'
    case 502:
      return 'Bad Gateway'
    case 503:
      return 'Layanan Tidak Tersedia'
    default:
      return 'Terjadi Kesalahan'
  }
})

// Deskripsi error sesuai kode status
const errorDescription = computed(() => {
  switch (statusCode.value) {
    case 400:
      return 'Permintaan yang Anda kirim tidak dapat dipahami oleh server.'
    case 401:
      return 'Anda perlu login untuk mengakses halaman ini.'
    case 403:
      return 'Anda tidak memiliki izin untuk mengakses halaman ini.'
    case 404:
      return 'Halaman yang Anda cari tidak dapat ditemukan.'
    case 500:
      return 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
    case 502:
      return 'Server tidak dapat terhubung dengan layanan yang diperlukan.'
    case 503:
      return 'Layanan sedang dalam perbaikan. Silakan coba lagi nanti.'
    default:
      return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'
  }
})

// Aksi tombol
const handleClearError = () => clearError({ redirect: '/' })
const handleReload = () => window.location.reload()

</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-lg w-full text-center">
      <!-- Logo -->
      <div class="mb-8">
        <NuxtImg 
          src="/jurutani.png" 
          alt="Jurutani Logo" 
          class="w-40 mx-auto"
        />
      </div>

      <!-- Error Text -->
      <div class="mb-6">
        <h1 class="text-6xl font-extrabold text-red-600 dark:text-red-400 mb-4">
          {{ statusCode }}
        </h1>
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          {{ errorTitle }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400">
          {{ errorDescription }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <UButton
          size="lg"
          color="primary"
          icon="i-lucide-home"
          @click="handleClearError"
        >
          Kembali ke Beranda
        </UButton>
        
        <UButton
          size="lg"
          color="neutral"
          variant="outline"
          icon="i-lucide-refresh-cw"
          @click="handleReload"
        >
          Muat Ulang Halaman
        </UButton>
      </div>
    </div>
  </div>
</template>
