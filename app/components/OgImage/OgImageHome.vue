<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  }
})
</script>

<template>
  <div class="w-full h-full flex flex-col items-center text-white relative" style="background-color: #14532d;">
    <!-- Background Image -->
    <img src="/background.jpg" class="absolute inset-0 w-full h-full" style="object-fit: cover;" >
    
    <!-- Overlay Gradient -->
    <div class="absolute inset-0 w-full h-full" style="background-image: linear-gradient(to bottom, rgba(10, 40, 20, 0.9), rgba(20, 83, 45, 0.75), rgba(10, 40, 20, 0.95));" />

    <!-- Content Container -->
    <div class="w-full h-full flex flex-col justify-between absolute inset-0 py-12 px-16">
      
      <!-- Content Atas: Logo Utama -->
      <div class="flex flex-col items-center justify-start w-full">
        <div class="flex items-center justify-center">
          <img src="/LOGO02.png" style="height: 64px; object-fit: contain;" >
        </div>
      </div>

      <!-- Content Tengah: Title & Description -->
      <div class="flex flex-col items-center text-center justify-center w-full px-8">
        <h1 class="font-extrabold tracking-tight mb-4" style="font-size: 56px; line-height: 1.15;">
          {{ title }}
        </h1>
        <p class="font-medium max-w-4xl" style="font-size: 28px; line-height: 1.5; color: rgba(220, 252, 231, 0.9);">
          {{ description }}
        </p>
      </div>

      <!-- Content Bawah: Logo Sponsor -->
      <div class="flex flex-col items-center justify-end w-full">
        <div class="font-medium tracking-widest uppercase mb-5" style="font-size: 18px; color: rgba(187, 247, 208, 0.9);">
          Didukung Oleh
        </div>
        <div class="flex flex-row items-center justify-center w-full">
          <img src="/logo/sponsor.png" style="height: 56px; object-fit: contain;" >
        </div>
      </div>
      
    </div>
  </div>
</template>
