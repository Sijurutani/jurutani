<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="w-full h-full flex flex-row items-center relative text-white" style="background-color: #0c4a6e;">
    <!-- Base Background -->
    <img src="/background.jpg" class="absolute inset-0 w-full h-full" style="object-fit: cover;">

    <!-- Full Gradient Overlay -->
    <div class="absolute inset-0 w-full h-full" style="background-image: linear-gradient(135deg, rgba(5, 30, 55, 0.97) 0%, rgba(12, 74, 110, 0.92) 60%, rgba(3, 105, 161, 0.85) 100%);" />

    <!-- Left: Content (60%) -->
    <div class="h-full flex flex-col py-12 px-16 relative" style="width: 60%;">

      <!-- Logo -->
      <div class="flex items-center mb-8">
        <div class="flex items-center justify-center px-4 py-2 rounded-2xl border" style="background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2);">
          <img src="/LOGO02.png" style="height: 48px; object-fit: contain;">
        </div>
      </div>

      <div class="flex flex-col grow justify-center">
        <!-- Badges -->
        <div class="flex flex-row items-center mb-6">
          <div class="flex px-4 py-2 rounded-full border" style="background-color: rgba(186, 230, 253, 0.2); border-color: rgba(125, 211, 252, 0.3); margin-right: 16px;">
            <span style="font-size: 20px; font-weight: 600; color: #bae6fd;">Jadwal Kegiatan</span>
          </div>
          <div class="flex px-4 py-2 rounded-full border" style="background-color: rgba(219, 234, 254, 0.15); border-color: rgba(191, 219, 254, 0.3);">
            <span style="font-size: 20px; font-weight: 600; color: #bfdbfe;">SiJuruTani</span>
          </div>
        </div>

        <!-- Judul -->
        <h1 class="font-bold" style="font-size: 46px; line-height: 1.25; color: #ffffff; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;">
          {{ title }}
        </h1>

        <!-- Tanggal -->
        <div v-if="date" class="flex items-center mt-6" style="gap: 12px;">
          <div style="width: 48px; height: 48px; background-color: rgba(125, 211, 252, 0.2); border: 1px solid rgba(125, 211, 252, 0.3); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #7dd3fc;">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
          </div>
          <span style="font-size: 28px; font-weight: 600; color: #7dd3fc;">{{ date }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex flex-row items-center mt-8">
        <div class="flex items-center justify-center rounded-full" style="width: 72px; height: 72px; background-color: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.2); margin-right: 20px;">
          <span style="font-size: 28px; font-weight: 700; color: #ffffff;">SJT</span>
        </div>
        <div class="flex flex-col">
          <span style="font-size: 22px; color: #bae6fd; margin-bottom: 2px;">SiJuruTani</span>
          <span style="font-size: 26px; font-weight: 700; color: #ffffff;">Jadwal & Kegiatan</span>
        </div>
      </div>
    </div>

    <!-- Kanan: Dekorasi Visual (40%) -->
    <div class="h-full flex flex-col justify-center items-center relative p-10 border-l" style="width: 40%; background-image: linear-gradient(to bottom right, #075985, #0c4a6e); border-color: rgba(56, 189, 248, 0.2);">
      <div class="flex flex-col items-center justify-center h-full text-white">
        <!-- Calendar icon besar -->
        <svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="color: #7dd3fc; opacity: 0.85; margin-bottom: 32px;">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><line x1="8" x2="8" y1="14" y2="18"/><line x1="12" x2="12" y1="14" y2="18"/><line x1="16" x2="16" y1="14" y2="18"/>
        </svg>
        <span style="font-size: 44px; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 12px;">SiJuruTani</span>
        <span style="font-size: 22px; color: #bae6fd;">Jadwal & Kegiatan</span>
      </div>
    </div>
  </div>
</template>
