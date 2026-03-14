<script setup lang="ts">
// Empty state when no conversation is selected
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header with Sidebar Toggle (Mobile Only) -->
    <div class="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 lg:hidden">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Room Chat
        </h2>
        <UButton
          icon="i-heroicons-bars-3"
          variant="ghost"
          color="neutral"
          size="sm"
        >
          List Chat
        </UButton>
      </div>
    </div>

    <!-- Empty State Content -->
    <div class="flex-1 flex flex-col items-center justify-center p-4">
      <div class="text-center max-w-md space-y-6">
        
        <!-- Title -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Selamat Datang di JuruTani Chat
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Pilih percakapan dari sidebar untuk mulai berkomunikasi dengan ahli pertanian dan penyuluh
          </p>
        </div>
        
        <!-- Features -->
        <div class="grid gap-4 text-left">
          <div class="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">Konsultasi dengan Pakar</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">Tanya jawab langsung dengan ahli pertanian bersertifikat</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <UIcon name="i-heroicons-megaphone" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">Bimbingan Penyuluh</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">Dapatkan panduan praktis dari penyuluh pertanian</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
            <UIcon name="i-heroicons-photo" class="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">Kirim Gambar</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">Bagikan foto tanaman untuk diagnosis yang lebih akurat</p>
            </div>
          </div>
        </div>
        
        <!-- CTA -->
        <div class="pt-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Belum ada percakapan? Klik tombol <span class="font-semibold text-green-600 dark:text-green-400">"Baru"</span> di sidebar untuk memulai chat
          </p>
          <!-- Mobile CTA -->
          <UButton
            class="mt-4 lg:hidden"
            icon="i-heroicons-bars-3"
            color="success"
            block
          >
            Lihat List Chat
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
