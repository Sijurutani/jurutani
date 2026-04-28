<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'Pertanian',
  },
  lessons: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="w-full h-full flex flex-row items-center relative text-white" style="background-color: #1c1917;">
    <!-- Base Background -->
    <img src="/background.jpg" class="absolute inset-0 w-full h-full" style="object-fit: cover;">

    <!-- Gradient Overlay Left — dark amber -->
    <div class="absolute inset-0" style="width: 60%; height: 100%; background-image: linear-gradient(to right, rgba(28, 10, 2, 0.97), rgba(92, 45, 5, 0.90));" />

    <!-- Kiri: Detail Kursus -->
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
          <div class="flex px-4 py-2 rounded-full border" style="background-color: rgba(254, 215, 170, 0.2); border-color: rgba(253, 186, 116, 0.3); margin-right: 16px;">
            <span style="font-size: 20px; font-weight: 600; color: #fde68a;">{{ category }}</span>
          </div>
          <div class="flex px-4 py-2 rounded-full border" style="background-color: rgba(219, 234, 254, 0.15); border-color: rgba(191, 219, 254, 0.3);">
            <span style="font-size: 20px; font-weight: 600; color: #bfdbfe;">SiJuruTani Kursus</span>
          </div>
        </div>

        <!-- Judul Kursus -->
        <h1 class="font-bold" style="font-size: 46px; line-height: 1.2; color: #ffffff; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 28px;">
          {{ title }}
        </h1>

        <!-- Stats Row -->
        <div class="flex flex-row items-center" style="gap: 32px;">
          <div v-if="lessons > 0" class="flex flex-col items-center">
            <span style="font-size: 40px; font-weight: 800; color: #fbbf24; line-height: 1;">{{ lessons }}</span>
            <span style="font-size: 18px; color: #fde68a;">Lesson</span>
          </div>
          <div v-if="rating > 0" class="flex flex-col items-center">
            <span style="font-size: 40px; font-weight: 800; color: #fbbf24; line-height: 1;">{{ rating }}</span>
            <span style="font-size: 18px; color: #fde68a;">Rating ★</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex flex-row items-center mt-8">
        <div class="flex items-center justify-center rounded-full" style="width: 72px; height: 72px; background-color: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.2); margin-right: 20px;">
          <span style="font-size: 28px; font-weight: 700; color: #ffffff;">SJT</span>
        </div>
        <div class="flex flex-col">
          <span style="font-size: 22px; color: #fde68a; margin-bottom: 2px;">SiJuruTani</span>
          <span style="font-size: 26px; font-weight: 700; color: #ffffff;">Platform Kursus Pertanian</span>
        </div>
      </div>
    </div>

    <!-- Kanan: Cover Kursus -->
    <div class="h-full flex flex-col justify-center items-center relative p-10 border-l" style="width: 40%; background-image: linear-gradient(to bottom right, #78350f, #1c1917); border-color: rgba(180, 83, 9, 0.4);">
      <div v-if="image" class="w-full h-full flex items-center justify-center">
        <img :src="image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);">
      </div>
      <div v-else class="flex flex-col items-center justify-center h-full text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: #fde68a; opacity: 0.9; margin-bottom: 32px;">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
        <span style="font-size: 44px; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 12px;">SiJuruTani</span>
        <span style="font-size: 22px; color: #fde68a;">Platform Kursus Pertanian</span>
      </div>
    </div>
  </div>
</template>
