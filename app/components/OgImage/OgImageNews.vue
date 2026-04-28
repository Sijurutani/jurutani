<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: 'JuruTani',
  },
  date: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'Berita Pertanian',
  },
  image: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="w-full h-full flex flex-row items-center relative text-white" style="background-color: #14532d;">
    <!-- Base Background -->
    <img src="/background.jpg" class="absolute inset-0 w-full h-full" style="object-fit: cover;" />

    <!-- Gradient Overlay for Left Area -->
    <div class="absolute inset-0" style="width: 60%; height: 100%; background-image: linear-gradient(to right, rgba(10, 40, 20, 0.95), rgba(20, 83, 45, 0.85));" />

    <!-- Kiri: Detail Berita -->
    <div class="h-full flex flex-col py-12 px-16 relative" style="width: 60%;">

      <!-- Logo Kiri Atas -->
      <div class="flex items-center mb-8">
        <div class="flex items-center justify-center px-4 py-2 rounded-2xl border" style="background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2);">
          <img src="/LOGO02.png" style="height: 48px; object-fit: contain;" />
        </div>
      </div>

      <div class="flex flex-col flex-grow justify-center">
        <!-- Badges: Kategori + Label -->
        <div class="flex flex-row items-center mb-6">
          <div class="flex px-4 py-2 rounded-full border" style="background-color: rgba(220, 252, 231, 0.2); border-color: rgba(187, 247, 208, 0.3); margin-right: 16px;">
            <span style="font-size: 20px; font-weight: 600; color: #bbf7d0;">{{ category }}</span>
          </div>
          <div class="flex px-4 py-2 rounded-full border" style="background-color: rgba(219, 234, 254, 0.2); border-color: rgba(191, 219, 254, 0.3);">
            <span style="font-size: 20px; font-weight: 600; color: #bfdbfe;">SiJuruTani Berita</span>
          </div>
        </div>

        <!-- Judul -->
        <h1 class="font-bold" style="font-size: 44px; line-height: 1.25; color: #ffffff; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;">
          {{ title }}
        </h1>
      </div>

    </div>

    <!-- Kanan: Gambar Berita -->
    <div class="h-full flex flex-col justify-center items-center relative p-10 border-l border-green-800" style="width: 40%; background-image: linear-gradient(to bottom right, #15803d, #14532d);">
      <div v-if="image" class="w-full h-full flex items-center justify-center">
        <img :src="image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);" />
      </div>
      <div v-else class="flex flex-col items-center justify-center h-full text-white">
        <!-- Leaf Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: #86efac; opacity: 0.9; margin-bottom: 32px;">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
        <span style="font-size: 48px; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 12px;">SiJuruTani</span>
        <span style="font-size: 24px; color: #bbf7d0;">Solusi Penyuluhan Digital</span>
      </div>
    </div>
  </div>
</template>
