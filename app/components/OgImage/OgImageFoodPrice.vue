<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'Komoditas',
  },
  price: {
    type: String,
    default: '',
  },
  unit: {
    type: String,
    default: 'kg',
  },
  image: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="w-full h-full flex flex-row items-center relative text-white" style="background-color: #78350f;">
    <!-- Base Background -->
    <img src="/background.jpg" class="absolute inset-0 w-full h-full" style="object-fit: cover;">

    <!-- Gradient Overlay Left -->
    <div class="absolute inset-0" style="width: 60%; height: 100%; background-image: linear-gradient(to right, rgba(60, 20, 5, 0.97), rgba(120, 53, 15, 0.88));" />

    <!-- Kiri: Detail Komoditas -->
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
            <span style="font-size: 20px; font-weight: 600; color: #fed7aa;">{{ category }}</span>
          </div>
          <div class="flex px-4 py-2 rounded-full border" style="background-color: rgba(219, 234, 254, 0.15); border-color: rgba(191, 219, 254, 0.3);">
            <span style="font-size: 20px; font-weight: 600; color: #bfdbfe;">Harga Pangan DIY</span>
          </div>
        </div>

        <!-- Nama Komoditas -->
        <h1 class="font-bold" style="font-size: 48px; line-height: 1.2; color: #ffffff; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 24px;">
          {{ title }}
        </h1>

        <!-- Harga -->
        <div v-if="price" class="flex flex-col">
          <span style="font-size: 20px; color: #fed7aa; margin-bottom: 4px;">Harga Terkini</span>
          <div class="flex items-baseline">
            <span class="font-extrabold" style="font-size: 60px; color: #fb923c; line-height: 1;">{{ price }}</span>
            <span style="font-size: 24px; color: #fed7aa; margin-left: 12px;">/ {{ unit }}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex flex-row items-center mt-8">
        <div class="flex items-center justify-center rounded-full" style="width: 72px; height: 72px; background-color: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.2); margin-right: 20px;">
          <span style="font-size: 28px; font-weight: 700; color: #ffffff;">SJT</span>
        </div>
        <div class="flex flex-col">
          <span style="font-size: 22px; color: #fed7aa; margin-bottom: 2px;">SiJuruTani</span>
          <span style="font-size: 26px; font-weight: 700; color: #ffffff;">Informasi Harga Pangan</span>
        </div>
      </div>
    </div>

    <!-- Kanan: Gambar -->
    <div class="h-full flex flex-col justify-center items-center relative p-10 border-l" style="width: 40%; background-image: linear-gradient(to bottom right, #92400e, #78350f); border-color: rgba(180, 83, 9, 0.5);">
      <div v-if="image" class="w-full h-full flex items-center justify-center">
        <img :src="image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
      </div>
      <div v-else class="flex flex-col items-center justify-center h-full text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: #fed7aa; opacity: 0.9; margin-bottom: 32px;">
          <path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M21.18 13.52A10 10 0 1 0 10.48 2.82"/>
        </svg>
        <span style="font-size: 44px; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 12px;">SiJuruTani</span>
        <span style="font-size: 22px; color: #fed7aa;">Harga Pangan DIY</span>
      </div>
    </div>
  </div>
</template>
