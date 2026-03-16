<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const playStoreUrl =
  'https://play.google.com/store/apps/details?id=com.jurutani.app&pcampaignid=web_share'

const qrCodeUrl = computed(() =>
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(playStoreUrl)}`
)

const stats = {
  rating: 4.5,
  downloads: '10K+'
}

const badges = [
  { text: 'FREE', color: 'success' },
  { text: 'NEW', color: 'info' },
  { text: 'INNOVATIVE', color: 'neutral' },
  { text: 'COLLABORATIVE', color: 'warning' }
]

const currentBadgeIndex = ref(0)

let intervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  intervalId = setInterval(() => {
    currentBadgeIndex.value =
      (currentBadgeIndex.value + 1) % badges.length
  }, 2500)
})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})

const currentBadge = computed(() => badges[currentBadgeIndex.value])
</script>

<template>
  <section class="relative max-w-6xl mx-auto overflow-hidden rounded-2xl">
    
    <!-- Background linear -->
    <div class="absolute inset-0 bg-linear-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-800/20" />
    
    <!-- Decorative Blur -->
    <div class="absolute -top-32 -right-32 w-96 h-96 bg-green-400/10 rounded-full blur-3xl" />
    <div class="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />

    <div class="relative px-6 py-12 lg:px-12 lg:py-16">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-12">

        <!-- LEFT CONTENT -->
        <div class="flex-1 max-w-xl space-y-6">

          <!-- Logo + Title -->
          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="absolute inset-0 bg-linear-to-br from-green-400 to-emerald-500 rounded-xl blur-md opacity-40" />
              <div class="relative w-20 h-20 p-3 bg-white dark:bg-green-900/40 border border-green-200 dark:border-green-700 rounded-xl shadow-md flex items-center justify-center">
                <NuxtImg
                  src="/jurutani.png"
                  alt="JuruTani Logo"
                  class="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                JuruTani
              </h2>
              <p class="text-sm text-green-600 dark:text-green-400 font-medium">
                Solusi Pertanian Modern
              </p>
            </div>
          </div>

          <!-- Description -->
          <p class="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Download aplikasi JuruTani dan rasakan kemudahan bertani dengan teknologi AI
            untuk monitoring, rekomendasi tanam, dan kolaborasi petani modern.
          </p>

          <!-- Download Button -->
          <UButton
            :to="playStoreUrl"
            external
            target="_blank"
            rel="noopener noreferrer"
            color="success"
            size="xl"
            class="shadow-md hover:shadow-lg transition-all duration-200"
          >
            <template #leading>
              <UIcon name="i-simple-icons-googleplay" class="w-5 h-5" />
            </template>
            Download di Google Play
          </UButton>

          <!-- Stats -->
          <div class="flex items-center gap-6 pt-6 border-t border-green-200/60 dark:border-green-700/40">
            
            <!-- Rating -->
            <div class="flex items-center gap-2">
              <div class="flex">
                <UIcon
                  v-for="i in 4"
                  :key="i"
                  name="i-lucide-star"
                  class="w-4 h-4 text-yellow-400"
                />
                <UIcon
                  name="i-lucide-star"
                  class="w-4 h-4 text-yellow-400"
                />
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ stats.rating }}
              </span>
            </div>

            <div class="w-px h-6 bg-green-200 dark:bg-green-700" />

            <!-- Downloads -->
            <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <UIcon
                name="i-heroicons-arrow-down-tray"
                class="w-4 h-4 text-green-600 dark:text-green-400"
              />
              <span class="font-semibold">
                {{ stats.downloads }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                Downloads
              </span>
            </div>

          </div>

          <!-- QR Code -->
          <div
            class="hidden sm:block w-fit mt-6 p-6 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-2xl shadow-md"
          >
            <img
              :src="qrCodeUrl"
              alt="QR Code"
              class="w-36 h-36 mx-auto"
            >
            <p class="mt-3 text-xs text-center text-gray-600 dark:text-gray-300">
              Scan untuk download
            </p>
          </div>

        </div>

        <!-- RIGHT PHONE MOCKUP -->
        <div class="hidden lg:flex shrink-0 relative">

          <div class="relative w-72 h-[560px] bg-gray-900 rounded-[3rem] shadow-2xl p-3 ring-8 ring-gray-800/40">
            
            <!-- Notch -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-3xl z-10" />

            <!-- Screen -->
            <div class="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
              <NuxtImg
                src="/android.png"
                alt="App Screenshot"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <!-- Home Indicator -->
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
          </div>

          <!-- Rotating Badge -->
          <Transition name="badge-flip" mode="out-in">
            <UBadge
              :key="currentBadgeIndex"
              :color="currentBadge?.color"
              class="absolute -top-4 -right-4 shadow-md animate-pulse-subtle cursor-pointer"
              @click="currentBadgeIndex = (currentBadgeIndex + 1) % badges.length"
            >
              {{ currentBadge.text }}
            </UBadge>
          </Transition>

        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>

/* Smooth global transition untuk elemen interaktif */
button,
a,
.badge-flip-enter-active,
.badge-flip-leave-active {
  transition: all 0.5s ease;
}

/* Subtle floating effect (lebih lambat & kalem) */
@keyframes float-soft {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.float-soft {
  animation: float-soft 6s ease-in-out infinite;
}

/* Badge pulse versi santai */
@keyframes pulse-soft {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.04);
    opacity: 0.95;
  }
}

.animate-pulse-subtle {
  animation: pulse-soft 3.5s ease-in-out infinite;
}

/* Badge flip transition (lebih smooth & tidak agresif) */
.badge-flip-enter-active,
.badge-flip-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.badge-flip-enter-from {
  opacity: 0;
  transform: rotateY(-45deg) scale(0.95);
}

.badge-flip-leave-to {
  opacity: 0;
  transform: rotateY(45deg) scale(0.95);
}

.badge-flip-enter-to,
.badge-flip-leave-from {
  opacity: 1;
  transform: rotateY(0deg) scale(1);
}

/* Optional: phone hover dibuat lebih kalem */
.phone-hover {
  transition: transform 0.6s ease;
}

.phone-hover:hover {
  transform: translateY(-6px);
}

/* QR hover juga lebih santai */
.qr-hover {
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.qr-hover:hover {
  transform: scale(1.03);
}

</style>
