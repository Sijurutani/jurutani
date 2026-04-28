<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'Video Edukasi',
  },
  date: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="w-full h-full flex flex-row items-center relative text-white" style="background-color: #052e16;">
    <!-- Base Background -->
    <img src="/background.jpg" class="absolute inset-0 w-full h-full" style="object-fit: cover;" />

    <!-- Gradient Overlay Left -->
    <div class="absolute inset-0" style="width: 60%; height: 100%; background-image: linear-gradient(to right, rgba(5, 20, 10, 0.97), rgba(10, 50, 25, 0.90));" />

    <!-- Kiri: Info Video -->
    <div class="h-full flex flex-col py-12 px-16 relative" style="width: 60%;">

      <!-- Logo -->
      <div class="flex items-center mb-8">
        <div class="flex items-center justify-center px-4 py-2 rounded-2xl border" style="background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2);">
          <img src="/LOGO02.png" style="height: 48px; object-fit: contain;" />
        </div>
      </div>

      <div class="flex flex-col flex-grow justify-center">
        <!-- Badges -->
        <div class="flex flex-row items-center mb-6">
          <div class="flex px-4 py-2 rounded-full border" style="background-color: rgba(220, 252, 231, 0.2); border-color: rgba(187, 247, 208, 0.3); margin-right: 16px;">
            <span style="font-size: 20px; font-weight: 600; color: #bbf7d0;">{{ category }}</span>
          </div>
          <div class="flex px-4 py-2 rounded-full border" style="background-color: rgba(254, 202, 202, 0.15); border-color: rgba(252, 165, 165, 0.3);">
            <!-- YouTube badge -->
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#fc2d2d" style="margin-right: 8px; flex-shrink: 0;">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span style="font-size: 20px; font-weight: 600; color: #fca5a5;">Video Edukasi</span>
          </div>
        </div>

        <!-- Judul -->
        <h1 class="font-bold" style="font-size: 44px; line-height: 1.25; color: #ffffff; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;">
          {{ title }}
        </h1>

        <!-- Tanggal -->
        <div v-if="date" class="flex items-center mt-6" style="gap: 12px;">
          <span style="font-size: 24px; color: #bbf7d0;">📅 {{ date }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex flex-row items-center mt-8">
        <div class="flex items-center justify-center rounded-full" style="width: 72px; height: 72px; background-color: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.2); margin-right: 20px;">
          <span style="font-size: 28px; font-weight: 700; color: #ffffff;">SJT</span>
        </div>
        <div class="flex flex-col">
          <span style="font-size: 22px; color: #bbf7d0; margin-bottom: 2px;">SiJuruTani</span>
          <span style="font-size: 26px; font-weight: 700; color: #ffffff;">Video Edukasi Pertanian</span>
        </div>
      </div>
    </div>

    <!-- Kanan: YouTube Thumbnail Card Style -->
    <div class="h-full flex flex-col justify-center items-center relative border-l" style="width: 40%; background-color: #000; border-color: rgba(255,255,255,0.1);">
      <!-- Thumbnail image — fills entire right pane -->
      <div class="w-full h-full relative">
        <img
          v-if="thumbnail"
          :src="thumbnail"
          style="width: 100%; height: 100%; object-fit: cover;"
        />
        <!-- Dark gradient overlay atas-bawah seperti card YT -->
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%);" />

        <!-- YouTube logo bottom-right -->
        <div style="position: absolute; bottom: 20px; right: 20px; display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.6); padding: 8px 14px; border-radius: 20px; backdrop-filter: blur(4px);">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fc2d2d">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span style="font-size: 14px; font-weight: 600; color: white;">YouTube</span>
        </div>
      </div>

      <!-- Fallback jika tidak ada thumbnail -->
      <div v-if="!thumbnail" class="flex flex-col items-center justify-center h-full" style="background-color: #111827;">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="#fc2d2d" style="margin-bottom: 24px; opacity: 0.8;">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        <span style="font-size: 40px; font-weight: 800; color: white; margin-bottom: 8px;">SiJuruTani</span>
        <span style="font-size: 20px; color: #bbf7d0;">Video Edukasi Pertanian</span>
      </div>
    </div>
  </div>
</template>
