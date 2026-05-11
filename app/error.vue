<script setup lang="ts">
  // Deteksi apakah sedang di mode development
  const isDev = import.meta.dev

  // Props error otomatis dikirim oleh Nuxt saat ada error
  const props = defineProps<{
    error: {
      statusCode?: number
      statusMessage?: string
      message?: string
      stack?: string
      data?: any // Terkadang Nuxt Nitro melempar data tambahan di sini
    }
  }>()

  // Default values untuk error
  const statusCode = computed(() => props.error?.statusCode ?? 500)
  
  // Judul error sesuai kode status (Untuk UI Production)
  const errorTitle = computed(() => {
    switch (statusCode.value) {
      case 400: return 'Permintaan Tidak Valid'
      case 401: return 'Tidak Diotorisasi'
      case 403: return 'Akses Ditolak'
      case 404: return 'Halaman Tidak Ditemukan'
      case 500: return 'Kesalahan Server'
      case 502: return 'Bad Gateway'
      case 503: return 'Layanan Tidak Tersedia'
      default: return 'Terjadi Kesalahan'
    }
  })

  // Deskripsi error sesuai kode status (Untuk UI Production)
  const errorDescription = computed(() => {
    switch (statusCode.value) {
      case 400: return 'Permintaan yang Anda kirim tidak dapat dipahami oleh server.'
      case 401: return 'Anda perlu login untuk mengakses halaman ini.'
      case 403: return 'Anda tidak memiliki izin untuk mengakses halaman ini.'
      case 404: return 'Halaman yang Anda cari tidak dapat ditemukan.'
      case 500: return 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
      case 502: return 'Server tidak dapat terhubung dengan layanan yang diperlukan.'
      case 503: return 'Layanan sedang dalam perbaikan. Silakan coba lagi nanti.'
      default: return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'
    }
  })

  // Aksi tombol
  const handleClearError = () => clearError({ redirect: '/' })
  const handleReload = () => window.location.reload()
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-lg w-full text-center">
      <div class="mb-8">
        <NuxtImg src="/jurutani.webp" alt="Jurutani Logo" class="w-40 mx-auto" />
      </div>

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

    <div 
      v-if="isDev" 
      class="w-full max-w-4xl mt-16 text-left"
    >
      <div class="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-6 overflow-hidden">
        <div class="flex items-center gap-2 mb-4 border-b border-red-200 dark:border-red-900 pb-3">
          <UIcon name="i-lucide-bug" class="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 class="text-lg font-bold text-red-800 dark:text-red-400">Developer Debug Panel</h3>
          <span class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded dark:bg-red-900 dark:text-red-300 ml-auto">
            Hanya tampil di Local Dev
          </span>
        </div>

        <div class="space-y-4 font-mono text-sm">
          <div>
            <p class="text-gray-500 dark:text-gray-400 font-semibold mb-1">Raw Error Message:</p>
            <div class="bg-white dark:bg-gray-900 p-3 rounded border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 whitespace-pre-wrap break-words">
              {{ error?.message || 'No specific message provided' }}
            </div>
          </div>

          <div v-if="error?.data">
            <p class="text-gray-500 dark:text-gray-400 font-semibold mb-1">Error Data / API Response:</p>
            <div class="bg-white dark:bg-gray-900 p-3 rounded border border-red-100 dark:border-red-800 text-gray-700 dark:text-gray-300 overflow-x-auto">
              <pre>{{ JSON.stringify(error?.data, null, 2) }}</pre>
            </div>
          </div>

          <div v-if="error?.stack">
            <p class="text-gray-500 dark:text-gray-400 font-semibold mb-1">Stack Trace:</p>
            <div class="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-xs leading-relaxed">
              <pre><code>{{ error?.stack }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>