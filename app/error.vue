<script setup lang="ts">
  // Deteksi apakah sedang di mode development
  const isDev = import.meta.dev

  // SEO meta — tampilkan judul ramah, bukan pesan error
  useSeoMeta({
    title: 'Selamat Datang di JuruTani',
    description: 'Platform penyuluhan pertanian, peternakan, perkebunan, dan perikanan digital Indonesia.',
    robots: 'noindex, nofollow',
  })

  // Props error otomatis dikirim oleh Nuxt saat ada error
  const props = defineProps<{
    error: {
      statusCode?: number
      statusMessage?: string
      message?: string
      stack?: string
      data?: any
    }
  }>()

  const statusCode = computed(() => props.error?.statusCode ?? 500)

  // Aksi tombol
  const handleClearError = () => clearError({ redirect: '/' })

  // Auto-redirect untuk semua error — tampil sebagai loading
  onMounted(() => {
    const delay = statusCode.value === 404 ? 3000 : 2500
    setTimeout(() => {
      handleClearError()
    }, delay)
  })

  /*
  ──────────────────────────────────────────────────
  TAMPILAN ERROR (dikomen — sekarang pakai loading)
  ──────────────────────────────────────────────────

  const errorTitle = computed(() => {
    switch (statusCode.value) {
      case 400: return 'Permintaan Tidak Valid'
      case 401: return 'Tidak Diotorisasi'
      case 403: return 'Akses Ditolak'
      case 404: return 'Halaman Tidak Ditemukan'
      case 500: return 'Kesalahan Server'
      case 502: return 'Bad Gateway'
      case 503: return 'Layanan Tidak Tersedia'
      default:  return 'Terjadi Kesalahan'
    }
  })

  const errorDescription = computed(() => {
    switch (statusCode.value) {
      case 400: return 'Permintaan yang Anda kirim tidak dapat dipahami oleh server.'
      case 401: return 'Anda perlu login untuk mengakses halaman ini.'
      case 403: return 'Anda tidak memiliki izin untuk mengakses halaman ini.'
      case 404: return 'Halaman yang Anda cari tidak dapat ditemukan.'
      case 500: return 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
      case 502: return 'Server tidak dapat terhubung dengan layanan yang diperlukan.'
      case 503: return 'Layanan sedang dalam perbaikan. Silakan coba lagi nanti.'
      default:  return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'
    }
  })

  const handleReload = () => window.location.reload()

  Template error (diganti loading di bawah):

  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-lg w-full text-center">
      <div class="mb-8">
        <NuxtImg src="/jurutani.webp" alt="Jurutani Logo" class="w-40 mx-auto" />
      </div>
      <div class="mb-6">
        <h1 class="text-6xl font-extrabold text-red-600 dark:text-red-400 mb-4">{{ statusCode }}</h1>
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">{{ errorTitle }}</h2>
        <p class="text-gray-500 dark:text-gray-400">{{ errorDescription }}</p>
      </div>
      <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <UButton size="lg" color="primary" icon="i-lucide-home" @click="handleClearError">Kembali ke Beranda</UButton>
        <UButton size="lg" color="neutral" variant="outline" icon="i-lucide-refresh-cw" @click="handleReload">Muat Ulang Halaman</UButton>
      </div>
    </div>
  </div>
  */
</script>

<template>
  <!-- Loading screen — ditampilkan sebagai pengganti halaman error -->
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-950"
  >
    <div class="flex flex-col items-center gap-6">
      <!-- Logo -->
      <NuxtImg
        src="/jurutani.webp"
        alt="JuruTani"
        class="w-20 h-20 object-contain animate-pulse"
      />

      <!-- Animated dots -->
      <div class="flex items-center gap-2">
        <span
          class="w-2.5 h-2.5 rounded-full bg-green-500 animate-bounce"
          style="animation-delay: 0ms"
        />
        <span
          class="w-2.5 h-2.5 rounded-full bg-green-500 animate-bounce"
          style="animation-delay: 150ms"
        />
        <span
          class="w-2.5 h-2.5 rounded-full bg-green-500 animate-bounce"
          style="animation-delay: 300ms"
        />
      </div>

      <!-- Teks -->
      <p class="text-sm text-gray-400 dark:text-gray-500 tracking-wide">
        Memuat halaman...
      </p>
    </div>

    <!-- Dev debug panel — hanya lokal -->
    <div
      v-if="isDev"
      class="fixed bottom-0 left-0 right-0 w-full max-w-4xl mx-auto p-4"
    >
      <div
        class="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4 overflow-hidden"
      >
        <div class="flex items-center gap-2 mb-3 border-b border-red-200 dark:border-red-900 pb-2">
          <span class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded dark:bg-red-900 dark:text-red-300 font-mono font-bold">
            DEV · Error {{ statusCode }}
          </span>
        </div>
        <div class="font-mono text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap break-words">
          {{ error?.message || 'No message' }}
        </div>
        <div v-if="error?.stack" class="mt-2 bg-gray-900 text-green-400 p-3 rounded text-[11px] overflow-x-auto">
          <pre><code>{{ error?.stack }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>