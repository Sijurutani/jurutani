<script setup lang="ts">
import { ref } from 'vue'

// Interface untuk tipe sponsor
interface Sponsor {
  id: number
  name: string
  logo: string
  description: string
  website?: string
}

// Data sponsor
const sponsors: Sponsor[] = [
  {
    id: 1,
    name: "Partner Teknologi Pertanian",
    logo: "/logo/sponsor.png",
    description: "Partner Teknologi Pertanian Terpercaya",
    website: "https://example.com"
  }
]

// Reactive variables
const isLoading = ref<boolean>(false)
const currentSponsor = ref<Sponsor | null>(sponsors[0])
</script>

<template>
  <div class="py-16">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
     
      <div class="mx-auto mb-6 max-w-4xl text-center">
        <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-linear-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
            <UIcon name="i-lucide-shopping-bag" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Partnership</span>
        </div>

        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Mitra Kami
        </h2>

        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Bergabunglah bersama kami untuk memberdayakan petani Indonesia melalui 
            <span class="font-semibold text-emerald-600 dark:text-emerald-400">teknologi</span>, 
            <span class="font-semibold text-teal-600 dark:text-teal-400">pakar JuruTani</span>, dan 
            <span class="font-semibold text-cyan-600 dark:text-cyan-400">AI</span> yang dirancang khusus untuk menyelesaikan permasalahan di bidang pertanian.
        </p>
        </div>



      <!-- Sponsor Card -->
      <div class="flex justify-center">
        <div class="sponsor-card group max-w-sm">
          <div class="p-8 rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-center h-20 mb-4">
              <NuxtImg 
                :src="currentSponsor?.logo" 
                :alt="currentSponsor?.name" 
                class="max-h-full max-w-full object-contain"
              />
            </div>
            <p class="text-sm text-gray-600 text-center">
              {{ currentSponsor?.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sponsor-card {
  transition: transform 0.3s ease;
}

.sponsor-card:hover {
  transform: translateY(-2px);
}
</style>