<script setup lang="ts">
import type { Database } from '~/types/database.types'

type HeroData = Database['public']['Tables']['hero_data']['Row']

// --- Hero Data Logic ---
const supabase = useSupabaseClient()
const carouselItems = ref<HeroData[]>([])
const error = ref<string | null>(null)
const loading = ref(false)
const isInitialized = ref(false)

const getImageUrl = (imageUrl: string): string | null => {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http')) {
    return imageUrl
  }
  const { data } = supabase.storage.from('hero-image').getPublicUrl(imageUrl)
  return data.publicUrl
}

const fetchHeroData = async () => {
  loading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await supabase
      .schema('public')
      .from('hero_data')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('created_at', { ascending: true })

    if (fetchError) throw fetchError

    carouselItems.value = (data as HeroData[]) || []
    isInitialized.value = true

    console.log('Hero data fetched successfully:', carouselItems.value.length, 'items')
  } catch (err: any) {
    error.value = err.message || 'Terjadi kesalahan saat memuat data hero'
    console.error('Error fetching hero data:', err)
  } finally {
    loading.value = false
  }
}

// --- Carousel Logic ---
const itemsCount = computed(() => carouselItems.value.length)

const currentSlide = ref(0)
const autoplayInterval = ref<NodeJS.Timeout | null>(null)
const isTransitioning = ref(false)
const isSwiping = ref(false)
const isMobile = ref(false)

const startX = ref(0)
const startY = ref(0)
const swipeThreshold = 50

const detectDevice = () => {
  if (import.meta.client) {
    isMobile.value = window.innerWidth < 768
  }
}

const triggerContentAnimation = () => {
  isTransitioning.value = true
  setTimeout(() => {
    isTransitioning.value = false
  }, 800)
}

const goToSlide = (index: number) => {
  if (isTransitioning.value || itemsCount.value === 0) return
  currentSlide.value = index
  triggerContentAnimation()
}

const nextSlide = () => {
  if (isTransitioning.value || itemsCount.value === 0) return
  const nextIndex = (currentSlide.value + 1) % itemsCount.value
  currentSlide.value = nextIndex
  triggerContentAnimation()
}

const prevSlide = () => {
  if (isTransitioning.value || itemsCount.value === 0) return
  const prevIndex = (currentSlide.value - 1 + itemsCount.value) % itemsCount.value
  currentSlide.value = prevIndex
  triggerContentAnimation()
}

const startAutoplay = () => {
  if (autoplayInterval.value || itemsCount.value <= 1) {
    if (autoplayInterval.value) {
      clearInterval(autoplayInterval.value)
    }
  }

  if (itemsCount.value > 1) {
    autoplayInterval.value = setInterval(() => {
      if (!isSwiping.value && !isTransitioning.value) {
        nextSlide()
      }
    }, 4000)
  }
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
}

const handleTouchStart = (e: TouchEvent) => {
  if (isTransitioning.value || itemsCount.value === 0) return

  isSwiping.value = true
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
  stopAutoplay()
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!isSwiping.value || itemsCount.value === 0) return

  const endX = e.changedTouches[0].clientX
  const endY = e.changedTouches[0].clientY
  const deltaX = endX - startX.value
  const deltaY = endY - startY.value

  isSwiping.value = false

  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
    if (deltaX > 0) {
      prevSlide()
    } else {
      nextSlide()
    }
  }

  setTimeout(() => startAutoplay(), 100)
}

const handleClick = (e: MouseEvent) => {
  if (isTransitioning.value || isMobile.value || itemsCount.value === 0) return

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const containerWidth = rect.width

  if (clickX < containerWidth / 2) {
    prevSlide()
  } else {
    nextSlide()
  }
}

const handleMouseEnter = () => {
  if (!isMobile.value) {
    stopAutoplay()
  }
}

const handleMouseLeave = () => {
  if (!isMobile.value) {
    setTimeout(() => startAutoplay(), 200)
  }
}

const handleResize = () => {
  detectDevice()
}

onMounted(async () => {
  detectDevice()
  window.addEventListener('resize', handleResize)

  if (!import.meta.client) return

  try {
    console.log('Fetching hero data...')
    await fetchHeroData()
    console.log('Hero data loaded:', carouselItems.value.length, 'items')
  } catch (err) {
    console.error('Failed to fetch hero data:', err)
  }
})

onBeforeUnmount(() => {
  stopAutoplay()
  if (import.meta.client) {
    window.removeEventListener('resize', handleResize)
  }
})

watch(itemsCount, (newLength, oldLength) => {
  if (newLength > 0) {
    if (currentSlide.value >= newLength) {
      currentSlide.value = 0
    }

    if (!oldLength || oldLength === 0) {
      nextTick(() => {
        triggerContentAnimation()
      })
    }

    startAutoplay()
  } else {
    stopAutoplay()
  }
}, { immediate: false })
</script>

<template>
  <section class="relative overflow-hidden select-none">
    <!-- SEO h1 - Hidden but accessible -->
    <h1 class="sr-only">JuruTani - Platform Penyuluhan Digital Pertanian Indonesia</h1>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="relative w-full h-screen max-h-screen flex items-center justify-center bg-linear-to-br from-green-900 via-green-800 to-emerald-900 dark:from-green-950 dark:via-green-900 dark:to-emerald-950"
    >
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 dark:border-green-500 mx-auto mb-4" />
        <p class="text-white dark:text-gray-100 text-lg">Memuat konten...</p>
      </div>
    </div>

    <!-- Error State -->
    <UCard
      v-else-if="error"
      class="absolute inset-0 w-full h-screen max-h-screen flex items-center justify-center bg-linear-to-br from-red-900 via-red-800 to-orange-900 dark:from-red-950 dark:via-red-900 dark:to-orange-950 border-0 shadow-none bg-opacity-0"
    >
      <template #header>
        <div class="text-center max-w-md mx-auto px-4">
          <div class="flex justify-center mb-4">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-400 dark:text-red-300" />
          </div>
          <h3 class="text-xl font-semibold text-white dark:text-gray-100 mb-2">
            Terjadi Kesalahan
          </h3>
          <p class="text-red-200 dark:text-red-300">{{ error }}</p>
        </div>
      </template>

      <div class="flex justify-center">
        <UButton
          color="error"
          size="md"
          class="px-6"
          @click="fetchHeroData"
        >
          Coba Lagi
        </UButton>
      </div>
    </UCard>

    <!-- Empty State - Only show after initialization -->
    <UCard
      v-else-if="isInitialized && carouselItems.length === 0"
      class="absolute inset-0 w-full h-screen max-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-slate-900 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 border-0 shadow-none bg-opacity-0"
    >
      <template #header>
        <div class="text-center max-w-md mx-auto px-4">
          <div class="flex justify-center mb-4">
            <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 class="text-xl font-semibold text-white dark:text-gray-100 mb-2">
            Belum Ada Konten
          </h3>
          <p class="text-gray-300 dark:text-gray-400">
            Konten hero sedang tidak tersedia.
          </p>
        </div>
      </template>
    </UCard>

    <!-- Carousel Container -->
    <div
      v-else-if="carouselItems.length > 0"
      class="relative w-full h-screen max-h-screen cursor-pointer select-none"
      :class="{ 'cursor-default': isMobile }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
      @touchstart.passive="handleTouchStart"
      @touchend.passive="handleTouchEnd"
    >
      <!-- Background Container -->
      <div class="absolute inset-0">
        <!-- Background Images dengan animasi transisi -->
        <div
          v-for="(item, index) in carouselItems"
          :key="`bg-${item.id}`"
          class="absolute inset-0 transition-all duration-1000 ease-out"
          :class="[currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105']"
        >
          <!-- Gambar Background jika ada -->
          <img
            v-if="getImageUrl(item.image_url)"
            :src="getImageUrl(item.image_url)!"
            :alt="item.title || 'Hero Image'"
            class="w-full h-full object-cover transition-transform duration-1000 ease-out"
            :class="[currentSlide === index ? 'scale-100' : 'scale-110']"
            loading="lazy"
            @error="(e: any) => {
              console.error('Image load error:', e)
              e.target.style.display = 'none'
            }"
          >

          <!-- Background Hijau jika tidak ada gambar -->
          <div
            v-else
            class="absolute inset-0 bg-linear-to-br from-green-800 via-green-700 to-emerald-800 transition-all duration-1000 ease-out"
            :class="[currentSlide === index ? 'scale-100' : 'scale-105']"
          />
        </div>

        <!-- Overlay untuk readability -->
        <div class="absolute inset-0 bg-black/30 dark:bg-black/50" />

        <!-- Shadow dari bawah -->
        <div class="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

        <!-- Side shadows -->
        <div class="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-black/30 to-transparent" />
        <div class="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-black/30 to-transparent" />
      </div>

      <!-- Carousel Items -->
      <div
        v-for="(item, index) in carouselItems"
        :key="item.id"
        class="absolute inset-0 transition-all duration-1000 ease-out"
        :class="[currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0']"
      >
        <!-- Slide Content -->
        <div class="absolute inset-0 flex items-center justify-center px-4">
          <div
            class="max-w-xs sm:max-w-lg md:max-w-2xl w-full transform transition-all duration-1000 rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden group"
            :class="[
              currentSlide === index && !isTransitioning
                ? 'translate-y-0 opacity-100 scale-100'
                : 'translate-y-8 opacity-0 scale-95'
            ]"
          >
            <!-- Glassmorphism Background -->
            <div class="absolute inset-0 bg-linear-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-white/[0.02] backdrop-blur-2xl" />

            <!-- Animated Shadow Effect -->
            <div class="absolute inset-0 rounded-2xl bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <!-- Enhanced Glass Effect on hover -->
            <div class="absolute -inset-0.5 bg-black/20 dark:bg-black/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

            <!-- Content -->
            <div class="relative px-4 sm:px-6 md:px-8 py-8 md:py-12 text-center">
              <!-- Caption -->
              <p
                class="text-green-300 dark:text-green-400 font-semibold uppercase tracking-widest text-xs sm:text-sm mb-2 md:mb-3 transition-all duration-700 delay-200"
                :class="[
                  currentSlide === index && !isTransitioning
                    ? 'translate-x-0 opacity-100'
                    : index % 2 === 0
                      ? '-translate-x-8 opacity-0'
                      : 'translate-x-8 opacity-0'
                ]"
              >
                {{ item.caption }}
              </p>

              <!-- Title -->
              <h2
                class="text-white dark:text-gray-50 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6 leading-tight transition-all duration-700 delay-300"
                :class="[
                  currentSlide === index && !isTransitioning
                    ? 'translate-x-0 opacity-100'
                    : index % 2 === 0
                      ? 'translate-x-8 opacity-0'
                      : '-translate-x-8 opacity-0'
                ]"
              >
                {{ item.title }}
              </h2>

              <!-- Description -->
              <p
                class="text-gray-100 dark:text-gray-200 text-sm sm:text-base md:text-lg mb-6 md:mb-8 leading-relaxed transition-all duration-700 delay-400"
                :class="[
                  currentSlide === index && !isTransitioning
                    ? 'translate-x-0 opacity-100'
                    : index % 2 === 0
                      ? '-translate-x-8 opacity-0'
                      : 'translate-x-8 opacity-0'
                ]"
              >
                {{ item.description }}
              </p>

              <!-- Button -->
              <div
                class="transition-all duration-700 delay-500"
                :class="[
                  currentSlide === index && !isTransitioning
                    ? 'translate-y-0 opacity-100 scale-100'
                    : 'translate-y-4 opacity-0 scale-95'
                ]"
              >
                <UButton
                  v-if="item.button_text"
                  as="NuxtLink"
                  :to="item.button_link"
                  color="success"
                  size="md"
                  @click.stop
                >
                  {{ item.button_text }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dots Indicators -->
      <div
        v-if="carouselItems.length > 1"
        class="absolute bottom-6 md:bottom-8 inset-x-0 flex justify-center gap-2 md:gap-3 z-20"
      >
        <button
          v-for="index in carouselItems.length"
          :key="index"
          class="relative overflow-hidden rounded-full transition-all duration-500 hover:scale-110 touch-target"
          :class="[
            currentSlide === index - 1
              ? 'w-8 md:w-12 h-2 md:h-3 bg-linear-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 shadow-lg'
              : 'w-2 md:w-3 h-2 md:h-3 bg-white/40 hover:bg-white/60 dark:bg-white/20 dark:hover:bg-white/40 backdrop-blur-sm'
          ]"
          @click.stop="goToSlide(index - 1)"
        >
          <div
            v-if="currentSlide === index - 1"
            class="absolute inset-0 bg-linear-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 rounded-full animate-pulse"
          />
        </button>
      </div>

      <!-- Navigation Hint -->
      <!-- <CarouselNavigationHint v-if="carouselItems.length > 1" /> -->
    </div>
  </section>
</template>

<style scoped>
/* Hardware acceleration for smoother animations */
.transition-all,
.transition-transform,
.transition-opacity {
  will-change: transform, opacity;
  transform: translateZ(0);
}

/* Touch target for better mobile usability */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
