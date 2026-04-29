<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import type { Database } from '~/types/database.types'

type HeroData = Database['public']['Tables']['hero_data']['Row']

const supabase = useSupabaseClient()
const getImageUrl = (imageUrl: string): string | null => {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http')) return imageUrl
  const { data } = supabase.storage.from('hero-image').getPublicUrl(imageUrl)
  return data.publicUrl
}

const { data: heroData, pending: loading, error: fetchErrorObj, refresh: fetchHeroData } = await useAsyncData('hero-data', async () => {
  const { data, error: fetchError } = await supabase
    .schema('public')
    .from('hero_data')
    .select('*')
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('created_at', { ascending: true })

  if (fetchError) throw fetchError
  return (data as HeroData[]) || []
}, { default: () => [] as HeroData[] })

const carouselItems = computed(() => heroData.value || [])
const error = computed(() => fetchErrorObj.value ? fetchErrorObj.value.message || 'Terjadi kesalahan saat memuat data hero' : null)
const isInitialized = computed(() => true)

useHead(() => {
  const firstImage = carouselItems.value[0]?.image_url;
  const firstImageUrl = firstImage ? getImageUrl(firstImage) : null;
  return firstImageUrl ? {
    link: [
      {
        rel: 'preload',
        as: 'image',
        href: firstImageUrl,
        fetchpriority: 'high'
      }
    ]
  } : {}
})

// --- Carousel Logic ---
const itemsCount = computed(() => carouselItems.value.length)
const currentSlide = ref(0)
const autoplayInterval = ref<ReturnType<typeof setInterval> | null>(null)
const isTransitioning = ref(false)
const progressWidth = ref(0)
const progressInterval = ref<ReturnType<typeof setInterval> | null>(null)

// Touch / swipe
const isSwiping = ref(false)
const startX = ref(0)
const startY = ref(0)
const swipeThreshold = 50
const dragOffset = ref(0)
const isDragging = ref(false)

interface QuickMenu {
  label: string
  icon: string
  to: string
}

const quickMenus: QuickMenu[] = [
  { label: 'Penyuluhan', icon: 'i-lucide-book-open', to: '/discussions' },
  { label: 'Pakar', icon: 'i-lucide-lightbulb', to: '/discussions/expert' },
  { label: 'Penyuluh', icon: 'i-lucide-users', to: '/discussions/instructor' },
  { label: 'Berita', icon: 'i-lucide-newspaper', to: '/news' },
  { label: 'Video', icon: 'i-lucide-play-circle', to: '/videos' },
  { label: 'Kursus', icon: 'i-lucide-graduation-cap', to: '/courses' },
  { label: 'Harga Pasar', icon: 'i-lucide-trending-up', to: '/markets' },
  { label: 'Harga Pangan', icon: 'i-lucide-shopping-basket', to: '/food-prices' },
  { label: 'Cuaca', icon: 'i-lucide-cloud-sun', to: '/weathers' },
  { label: 'Alat Tani', icon: 'i-lucide-wrench', to: '/tools' },
  { label: 'Edukasi', icon: 'i-lucide-book-marked', to: '/educations' },
  { label: 'Pertemuan', icon: 'i-lucide-calendar', to: '/meetings' }
]

const quickTrackRef = ref<HTMLElement | null>(null)
const quickDotIndex = ref(0)
const quickItemsPerView = ref(3)

const updateQuickItemsPerView = () => {
  if (!import.meta.client) return
  quickItemsPerView.value = 3
}

const quickDotCount = computed(() => Math.max(1, Math.ceil(quickMenus.length / quickItemsPerView.value)))

const getQuickStep = (track: HTMLElement) => {
  return track.clientWidth || 1
}

const handleQuickScroll = () => {
  if (!quickTrackRef.value) return
  const step = getQuickStep(quickTrackRef.value)
  quickDotIndex.value = Math.round(quickTrackRef.value.scrollLeft / step)
}

const scrollQuickTo = (index: number) => {
  if (!quickTrackRef.value) return
  const step = getQuickStep(quickTrackRef.value)
  quickTrackRef.value.scrollTo({ left: step * index, behavior: 'smooth' })
  quickDotIndex.value = index
}

const stopProgress = () => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
    progressInterval.value = null
  }
}

const startProgress = () => {
  stopProgress()
  progressWidth.value = 0
  const step = 100 / (4500 / 50) // 4.5s total, update every 50ms
  progressInterval.value = setInterval(() => {
    progressWidth.value = Math.min(progressWidth.value + step, 100)
  }, 50)
}

const goToSlide = (index: number, resetProgress = true) => {
  if (isTransitioning.value || itemsCount.value === 0 || index === currentSlide.value) return
  currentSlide.value = index
  isTransitioning.value = true
  setTimeout(() => { isTransitioning.value = false }, 600)
  if (resetProgress) startProgress()
}

const nextSlide = () => {
  if (isTransitioning.value || itemsCount.value === 0) return
  currentSlide.value = (currentSlide.value + 1) % itemsCount.value
  isTransitioning.value = true
  setTimeout(() => { isTransitioning.value = false }, 600)
  startProgress()
}

const prevSlide = () => {
  if (isTransitioning.value || itemsCount.value === 0) return
  currentSlide.value = (currentSlide.value - 1 + itemsCount.value) % itemsCount.value
  isTransitioning.value = true
  setTimeout(() => { isTransitioning.value = false }, 600)
  startProgress()
}

const startAutoplay = () => {
  stopAutoplay()
  if (itemsCount.value > 1) {
    startProgress()
    autoplayInterval.value = setInterval(() => {
      if (!isSwiping.value && !isTransitioning.value) {
        nextSlide()
      }
    }, 4500)
  }
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
  stopProgress()
}

// Touch handlers
const handleTouchStart = (e: TouchEvent) => {
  if (isTransitioning.value || itemsCount.value === 0) return
  isSwiping.value = true
  isDragging.value = true
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
  dragOffset.value = 0
  stopAutoplay()
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  const deltaX = e.touches[0].clientX - startX.value
  dragOffset.value = Math.max(-80, Math.min(80, deltaX))
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!isSwiping.value || itemsCount.value === 0) return
  const deltaX = e.changedTouches[0].clientX - startX.value
  const deltaY = e.changedTouches[0].clientY - startY.value
  isSwiping.value = false
  isDragging.value = false
  dragOffset.value = 0
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
    if (deltaX > 0) prevSlide()
    else nextSlide()
  }
  setTimeout(() => startAutoplay(), 100)
}

// --- Stats matching discussions/index.vue ---
const displayCounts = reactive({
  profiles: 0,
  instructors: 0,
  experts: 0
})

const { data: counts } = await useAsyncData('hero-discussion-stats', async () => {
  const [profiles, instructors, experts] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('instructors').select('id', { count: 'exact', head: true }),
    supabase.from('experts').select('id', { count: 'exact', head: true })
  ])
  return {
    profiles: profiles.count || 500,
    instructors: instructors.count || 400,
    experts: experts.count || 200
  }
}, { default: () => ({ profiles: 500, instructors: 400, experts: 200 }) })

const statsAnimated = ref(false)
const statsRef = ref<HTMLElement | null>(null)

const animateCounter = (key: keyof typeof displayCounts, to: number, duration = 1800) => {
  let current = 0
  const increment = to / (duration / 16)
  const update = () => {
    current += increment
    if (current < to) {
      displayCounts[key] = Math.floor(current)
      requestAnimationFrame(update)
    } else {
      displayCounts[key] = to
    }
  }
  update()
}

const startStatsAnimation = () => {
  if (statsAnimated.value || !counts.value) return
  statsAnimated.value = true
  setTimeout(() => animateCounter('profiles', counts.value!.profiles), 100)
  setTimeout(() => animateCounter('instructors', counts.value!.instructors), 200)
  setTimeout(() => animateCounter('experts', counts.value!.experts), 300)
}

const { stop: stopObserver } = useIntersectionObserver(statsRef, ([entry]) => {
  if (entry.isIntersecting) {
    startStatsAnimation()
    stopObserver()
  }
}, { threshold: 0.3 })

onMounted(async () => {
  if (!import.meta.client) return
  updateQuickItemsPerView()
  window.addEventListener('resize', updateQuickItemsPerView, { passive: true })
})

onBeforeUnmount(() => {
  stopAutoplay()
  window.removeEventListener('resize', updateQuickItemsPerView)
})

watch(itemsCount, (newLength, oldLength) => {
  if (newLength > 0) {
    if (currentSlide.value >= newLength) currentSlide.value = 0
    if (!oldLength || oldLength === 0) nextTick(() => startAutoplay())
    else startAutoplay()
  } else {
    stopAutoplay()
  }
})
</script>

<template>
  <section class="hero-section select-none overflow-hidden mt-20 md:mt-20 xl:mt-20 2xl:mt-20 lg:mt-12">
    <div class="hero-container">

      <!-- ═══════════════ LEFT: Text Content ═══════════════ -->
      <div class="hero-left">

        <!-- Badge -->
        <div class="hero-badge">
          <span class="hero-badge__dot" />
          <span class="hero-badge__text">Platform Penyuluhan Digital</span>
        </div>

        <!-- Heading -->
        <h1 class="hero-heading">
          Penyuluhan pertanian modern
          <span class="hero-heading__accent">untuk Indonesia</span>
        </h1>

        <!-- Description -->
        <p class="hero-description">
          JuruTani hadir sebagai solusi penyuluhan pertanian digital yang menghubungkan petani dengan penyuluh, pakar, dan pelaku usaha untuk meningkatkan produktivitas dan kesejahteraan.
        </p>

        <!-- Stats — mirroring discussions/index.vue data -->
        <div ref="statsRef" class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">{{ displayCounts.profiles > 0 ? `${displayCounts.profiles}+` : '500+' }}</span>
            <span class="stat-label">Petani Bergabung</span>
          </div>
          <div class="stat-sep" />
          <div class="stat-item">
            <span class="stat-value">{{ displayCounts.instructors > 0 ? `${displayCounts.instructors}+` : '400+' }}</span>
            <span class="stat-label">Penyuluh Aktif</span>
          </div>
          <div class="stat-sep" />
          <div class="stat-item">
            <span class="stat-value">{{ displayCounts.experts > 0 ? `${displayCounts.experts}+` : '200+' }}</span>
            <span class="stat-label">Pakar Ahli</span>
          </div>
          <div class="stat-sep" />
          <div class="stat-item">
            <span class="stat-value">98%</span>
            <span class="stat-label">Tingkat Kepuasan</span>
          </div>
        </div>

        <!-- Quick Access -->
        <div class="hero-shortaccess">
          <div class="hero-shortaccess__lead">
            <div class="hero-shortaccess__text">
              <h2 class="hero-shortaccess__title">Layanan JuruTani</h2>
              <p class="hero-shortaccess__desc">Akses cepat ke fitur inti JuruTani dengan sekali geser.</p>
            </div>

            <button
              v-if="quickDotCount > 1"
              type="button"
              aria-label="Layanan selanjutnya"
              class="hero-shortaccess__cta"
              @click="scrollQuickTo(Math.min(quickDotIndex + 1, quickDotCount - 1))"
            >
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
            </button>
          </div>

          <div class="hero-shortaccess__content">
            <div ref="quickTrackRef" class="hero-quick-carousel" @scroll.passive="handleQuickScroll">
              <NuxtLink
                v-for="menu in quickMenus"
                :key="menu.label"
                :to="menu.to"
                class="hero-quick-card"
              >
                <div class="hero-quick-card__icon">
                  <UIcon :name="menu.icon" class="w-5 h-5" />
                </div>
                <div class="hero-quick-card__body">
                  <p class="hero-quick-card__title">{{ menu.label }}</p>
                </div>
                <UIcon name="i-lucide-chevron-right" class="hero-quick-card__arrow w-4 h-4" />
              </NuxtLink>
            </div>

            <div v-if="quickDotCount > 1" class="hero-quick-dots">
              <button
                v-for="(_, i) in quickDotCount"
                :key="i"
                class="hero-quick-dot"
                :class="{ 'hero-quick-dot--active': i === quickDotIndex }"
                :aria-label="`Halaman layanan ${i + 1}`"
                @click="scrollQuickTo(i)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════ RIGHT: Carousel ═══════════════ -->
      <div class="hero-right">

        <!-- Loading Skeleton -->
        <div v-if="loading" class="carousel-wrapper">
          <!-- Viewport skeleton -->
          <div class="carousel-skeleton-viewport">
            <!-- Shimmer overlay -->
            <div class="carousel-skeleton-shimmer" />
            <!-- Fake gradient overlay bottom -->
            <div class="carousel-skeleton-overlay" />
            <!-- Fake caption + title bars -->
            <div class="carousel-skeleton-content">
              <div class="carousel-skeleton-bar carousel-skeleton-bar--caption" />
              <div class="carousel-skeleton-bar carousel-skeleton-bar--title" />
              <div class="carousel-skeleton-bar carousel-skeleton-bar--desc" />
            </div>
          </div>
          <!-- Fake dots + counter -->
          <div class="carousel-skeleton-controls">
            <div class="carousel-skeleton-dots">
              <div v-for="i in 3" :key="i" class="carousel-skeleton-dot" :class="{ 'carousel-skeleton-dot--wide': i === 1 }" />
            </div>
            <div class="carousel-skeleton-bar carousel-skeleton-bar--counter" />
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="carousel-placeholder carousel-placeholder--error">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-10 h-10 text-red-400 mb-2" />
          <p class="text-red-400 text-sm mb-3">{{ error }}</p>
          <UButton color="error" size="sm" @click="fetchHeroData">Coba Lagi</UButton>
        </div>

        <!-- Empty -->
        <div
          v-else-if="isInitialized && carouselItems.length === 0"
          class="carousel-placeholder"
        >
          <UIcon name="i-heroicons-photo" class="w-10 h-10 text-gray-400 mb-2" />
          <p class="text-gray-400 text-sm">Konten hero belum tersedia.</p>
        </div>

        <!-- ══════ CLEAN FULL-SLIDE CAROUSEL ══════ -->
        <template v-else-if="carouselItems.length > 0">
          <div
            class="carousel-wrapper"
            @touchstart.passive="handleTouchStart"
            @touchmove.passive="handleTouchMove"
            @touchend.passive="handleTouchEnd"
          >
            <!-- Slide viewport -->
            <div class="carousel-viewport">
              <TransitionGroup name="carousel-fade" tag="div" class="carousel-inner">
                <div
                  v-for="(item, index) in carouselItems"
                  v-show="index === currentSlide"
                  :key="item.id"
                  class="carousel-slide-full"
                >
                  <!-- Background image -->
                  <img
                    v-if="getImageUrl(item.image_url)"
                    :src="getImageUrl(item.image_url)!"
                    :alt="item.title || 'Slide'"
                    class="carousel-slide-full__img"
                    :loading="index === 0 ? undefined : 'lazy'"
                    :fetchpriority="index === 0 ? 'high' : 'auto'"
                    @error="(e: any) => e.target.style.display = 'none'"
                  >
                  <!-- Fallback gradient -->
                  <div
                    v-else
                    class="absolute inset-0"
                    :style="{
                      background: [
                        'linear-gradient(135deg,#27500A,#085041)',
                        'linear-gradient(135deg,#085041,#3B6D11)',
                        'linear-gradient(135deg,#3B6D11,#0C447C)',
                        'linear-gradient(135deg,#0C447C,#633806)',
                        'linear-gradient(135deg,#633806,#27500A)',
                      ][index % 5]
                    }"
                  />
                  <!-- Gradient overlay -->
                  <div class="carousel-slide-full__overlay" />

                  <!-- Caption + Title + Description -->
                  <div class="carousel-slide-full__content">
                    <p class="slide-caption">{{ item.caption }}</p>
                    <h2 class="slide-title">{{ item.title }}</h2>
                    <p class="slide-desc">{{ item.description }}</p>
                  </div>
                </div>
              </TransitionGroup>

              <!-- Prev arrow -->
              <button
                class="carousel-btn carousel-btn--prev"
                aria-label="Slide sebelumnya"
                @click="prevSlide"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <!-- Next arrow -->
              <button
                class="carousel-btn carousel-btn--next"
                aria-label="Slide berikutnya"
                @click="nextSlide"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            <!-- Bottom Controls -->
            <div class="carousel-controls">
              <!-- Dots -->
              <div class="carousel-dots">
                <button
                  v-for="(_, index) in carouselItems"
                  :key="index"
                  class="carousel-dot"
                  :class="{ 'carousel-dot--active': index === currentSlide }"
                  :aria-label="`Ke slide ${index + 1}`"
                  @click="goToSlide(index)"
                >
                  <!-- Progress bar inside active dot -->
                  <span
                    v-if="index === currentSlide"
                    class="carousel-dot__progress"
                    :style="{ width: `${progressWidth}%` }"
                  />
                </button>
              </div>

              <!-- Counter -->
              <span class="carousel-counter">
                {{ String(currentSlide + 1).padStart(2, '0') }} / {{ String(carouselItems.length).padStart(2, '0') }}
              </span>
            </div>

            <!-- CTA -->
            <div v-if="carouselItems[currentSlide]?.button_text" class="carousel-cta">
              <UButton
                as="NuxtLink"
                :to="carouselItems[currentSlide]?.button_link"
                color="success"
                size="sm"
                trailing-icon="i-heroicons-arrow-right"
                class="carousel-cta__btn"
              >
                {{ carouselItems[currentSlide]?.button_text }}
              </UButton>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ══════ SECTION ══════ */
.hero-section {
  padding: 0;
  background: transparent;
  /* Fix: isolate dari stacking context Navigation (backdrop-filter) */
  isolation: isolate;
  position: relative;
  z-index: 1;
}

.hero-container {
  display: flex;
  /* Mobile: image di atas, teks di bawah */
  flex-direction: column-reverse;
}

@media (min-width: 1280px) {
  .hero-container {
    /* Desktop: grid 2 kolom — teks kiri, gambar kanan */
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
    gap: 0 1.25rem;
    flex-direction: unset;
  }
}

/* ══════ LEFT PANEL (Teks) ══════ */
.hero-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 2.5rem 1.5rem;
}

@media (min-width: 768px) {
  .hero-left {
    padding: 3.5rem 2.5rem;
  }
}

@media (min-width: 1280px) {
  .hero-left {
    justify-content: flex-start;
    padding: 3.5rem 2.75rem;
  }
}

/* Badge — menggunakan CSS variables untuk dark mode otomatis */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  background: var(--bg-badge);
  border: 1px solid var(--border-badge);
  border-radius: 9999px;
  margin-bottom: 1.25rem;
  width: fit-content;
  animation: fadeSlideUp 0.5s ease-out both;
}

.hero-badge__dot {
  display: block;
  width: 0.375rem;
  height: 0.375rem;
  background: #16a34a;
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.hero-badge__text {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-badge);
}

/* Heading — menggunakan CSS variable untuk auto dark mode */
.hero-heading {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--text-base);
  margin-bottom: 1rem;
  animation: fadeSlideUp 0.55s ease-out 0.05s both;
}

@media (min-width: 768px) {
  .hero-heading {
    font-size: 2.25rem;
  }
}

@media (min-width: 1280px) {
  .hero-heading {
    font-size: 2.5rem;
  }
}

.hero-heading__accent {
  display: block;
  background: linear-gradient(135deg, var(--text-accent), var(--text-accent-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  /* Fix: isolate stacking context agar tidak blur akibat backdrop-filter Navigation */
  isolation: isolate;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* Description */
.hero-description {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-muted);
  margin-bottom: 1.75rem;
  max-width: 36rem;
  animation: fadeSlideUp 0.6s ease-out 0.1s both;
}

@media (min-width: 768px) {
  .hero-description {
    font-size: 0.9375rem;
  }
}

/* ══════ STATS ══════ */
.hero-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  animation: fadeSlideUp 0.65s ease-out 0.15s both;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-accent);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

@media (min-width: 768px) {
  .stat-value {
    font-size: 1.25rem;
  }
}

.stat-label {
  font-size: 0.7rem;
  color: var(--text-subtle);
  white-space: nowrap;
}

.stat-sep {
  width: 1px;
  height: 2.25rem;
  background: linear-gradient(to bottom, transparent, rgba(134, 239, 172, 0.5), transparent);
  flex-shrink: 0;
}

/* ══════ QUICK ACCESS ══════ */
.hero-shortaccess {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 100%;
  animation: fadeSlideUp 0.7s ease-out 0.2s both;
}

.hero-shortaccess__lead {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.625rem;
  width: 100%;
}

.hero-shortaccess__text {
  min-width: 0;
}

.hero-shortaccess__title {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.25;
  color: var(--text-base);
  font-weight: 700;
}

.hero-shortaccess__desc {
  margin: 0.2rem 0 0;
  font-size: 0.72rem;
  color: var(--text-muted);
  line-height: 1.45;
}

.hero-shortaccess__cta {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid rgba(22, 163, 74, 0.25);
  background: rgba(220, 252, 231, 0.85);
  color: #16a34a;
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 9999px;
  padding: 0.38rem 0.75rem;
}

.hero-shortaccess__content {
  min-width: 0;
  max-width: 100%;
}

.hero-quick-carousel {
  display: flex;
  gap: 0.65rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 0.2rem;
}

.hero-quick-carousel::-webkit-scrollbar {
  display: none;
}

.hero-quick-card {
  flex: 0 0 auto;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 3.15rem;
  min-width: 9.75rem;
  max-width: 11.25rem;
  border-radius: 0.8rem;
  border: 1px solid rgba(22, 163, 74, 0.28);
  border-bottom-width: 3px;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  padding: 0.4rem 0.55rem;
  text-decoration: none;
}

.hero-quick-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.65rem;
  height: 1.65rem;
  flex-shrink: 0;
  border-radius: 0.55rem;
  background: #dcfce7;
  color: #16a34a;
}

.hero-quick-card__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.14rem;
}

.hero-quick-card__title {
  margin: 0;
  font-size: 0.76rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.hero-quick-card__arrow {
  margin-left: auto;
  color: #16a34a;
  flex-shrink: 0;
}

.hero-quick-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 0.45rem;
}

.hero-quick-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background: rgba(156, 163, 175, 0.5);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-quick-dot--active {
  width: 1.5rem;
  background: #16a34a;
}

:global(.dark) .hero-quick-card,
:global(.dark-mode) .hero-quick-card,
:global([data-theme='dark']) .hero-quick-card {
  background: linear-gradient(to bottom, rgba(17, 24, 39, 0.75), rgba(2, 6, 23, 0.8));
  border-color: rgba(22, 163, 74, 0.42);
}

:global(.dark) .hero-quick-card__title,
:global(.dark-mode) .hero-quick-card__title,
:global([data-theme='dark']) .hero-quick-card__title {
  color: #f3f4f6;
}

:global(.dark) .hero-shortaccess__cta,
:global(.dark-mode) .hero-shortaccess__cta,
:global([data-theme='dark']) .hero-shortaccess__cta {
  border-color: rgba(34, 197, 94, 0.35);
  background: rgba(21, 128, 61, 0.2);
  color: #86efac;
}

/* ══════ RIGHT PANEL (Gambar/Carousel) ══════ */
.hero-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  /* Mobile: padding lebih kecil karena gambar ada di atas */
  padding: 1.25rem 1.25rem 0.5rem;
}

@media (min-width: 768px) {
  .hero-right {
    padding: 2rem 2rem 1rem;
  }
}

@media (min-width: 1280px) {
  .hero-right {
    align-items: stretch;
    justify-content: flex-start;
    padding: 3.5rem 2.75rem;
  }
}

/* Placeholder states */
.carousel-placeholder {
  width: 100%;
  min-height: 16rem;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(5, 46, 22, 0.12);
  text-align: center;
  padding: 2rem;
}

.carousel-placeholder--error {
  background: rgba(127, 29, 29, 0.1);
}

/* ══════ CAROUSEL WRAPPER ══════ */
.carousel-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  animation: fadeSlideUp 0.6s ease-out 0.1s both;
}

/* Viewport = the visible frame */
.carousel-viewport {
  position: relative;
  width: 100%;
  border-radius: 1.5rem;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: #0a1a0e;
  box-shadow:
    0 20px 60px -15px rgba(0, 0, 0, 0.35),
    0 4px 16px rgba(0, 0, 0, 0.15);
}

@media (min-width: 768px) {
  .carousel-viewport {
    aspect-ratio: 16 / 10;
  }
}

/* TransitionGroup wrapper */
.carousel-inner {
  position: absolute;
  inset: 0;
}

/* Full-slide item */
.carousel-slide-full {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.carousel-slide-full__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide-full__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.78) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.05) 100%
  );
}

/* Bottom caption area */
.carousel-slide-full__content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1.25rem 1.5rem 1.5rem;
  z-index: 10;
}

.slide-caption {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6ee7b7;
  margin-bottom: 0.375rem;
  animation: slideContentIn 0.45s ease-out both;
}

.slide-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 0.375rem;
  animation: slideContentIn 0.45s ease-out 0.06s both;
}

@media (min-width: 768px) {
  .slide-title {
    font-size: 1.3125rem;
  }
}

.slide-desc {
  font-size: 0.8125rem;
  color: rgba(209, 213, 219, 0.9);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  animation: slideContentIn 0.45s ease-out 0.12s both;
}

/* ══════ ARROW BUTTONS ══════ */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
  border-color: rgba(134, 239, 172, 0.5);
  box-shadow: 0 4px 16px rgba(22, 163, 74, 0.25);
}

.carousel-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.carousel-btn--prev {
  left: 0.875rem;
}

.carousel-btn--next {
  right: 0.875rem;
}

/* ══════ BOTTOM CONTROLS ══════ */
.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.25rem;
}

/* Dots */
.carousel-dots {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.carousel-dot {
  position: relative;
  height: 0.375rem;
  border-radius: 9999px;
  overflow: hidden;
  border: none;
  outline: none;
  cursor: pointer;
  background: rgba(209, 213, 219, 0.5);
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  width: 0.5rem;
}

:global(.dark) .carousel-dot,
:global(.dark-mode) .carousel-dot,
:global([data-theme='dark']) .carousel-dot {
  background: rgba(75, 85, 99, 0.6);
}

.carousel-dot--active {
  width: 2rem;
  background: rgba(209, 213, 219, 0.4);
}

.carousel-dot__progress {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: #16a34a;
  border-radius: 9999px;
  transition: width 0.05s linear;
}

.carousel-dot:not(.carousel-dot--active):hover {
  background: #4ade80;
  transform: scaleY(1.2);
}

.carousel-dot:focus-visible {
  outline: 2px solid #16a34a;
  outline-offset: 2px;
}

/* Counter */
.carousel-counter {
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.03em;
}

:global(.dark) .carousel-counter,
:global(.dark-mode) .carousel-counter,
:global([data-theme='dark']) .carousel-counter {
  color: #9ca3af;
}

/* CTA */
.carousel-cta {
  padding: 0 0.25rem;
}

.carousel-cta__btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-cta__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(22, 163, 74, 0.3);
}

/* ══════ TRANSITIONS ══════ */
.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  inset: 0;
}

.carousel-fade-enter-from {
  opacity: 0;
  transform: scale(1.03);
}

.carousel-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

.carousel-fade-enter-to,
.carousel-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* ══════ SLIDE CONTENT ANIMATION ══════ */
@keyframes slideContentIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ══════ STAT + HERO ANIMATIONS ══════ */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ══════ CAROUSEL SKELETON ══════ */
.carousel-skeleton-viewport {
  position: relative;
  width: 100%;
  border-radius: 1.5rem;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: linear-gradient(135deg, #1a2e1a 0%, #0f1f0f 50%, #1a2e1a 100%);
  box-shadow:
    0 20px 60px -15px rgba(0, 0, 0, 0.35),
    0 4px 16px rgba(0, 0, 0, 0.15);
}

@media (min-width: 768px) {
  .carousel-skeleton-viewport { aspect-ratio: 16 / 10; }
}

/* Shimmer sweep */
.carousel-skeleton-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255, 255, 255, 0.04) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: skeleton-sweep 1.8s ease-in-out infinite;
}

@keyframes skeleton-sweep {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Bottom gradient overlay (mimic real slide) */
.carousel-skeleton-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 55%;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
}

/* Fake caption/title/desc bars at bottom */
.carousel-skeleton-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10;
}

.carousel-skeleton-bar {
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.12);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.carousel-skeleton-bar--caption {
  height: 0.5rem;
  width: 4.5rem;
}

.carousel-skeleton-bar--title {
  height: 0.875rem;
  width: 70%;
}

.carousel-skeleton-bar--desc {
  height: 0.625rem;
  width: 55%;
  opacity: 0.7;
}

.carousel-skeleton-bar--counter {
  height: 0.5rem;
  width: 2.5rem;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}

/* Fake dots + counter bar */
.carousel-skeleton-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.25rem;
}

.carousel-skeleton-dots {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.carousel-skeleton-dot {
  height: 0.375rem;
  width: 0.5rem;
  border-radius: 9999px;
  background: rgba(156, 163, 175, 0.35);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.carousel-skeleton-dot--wide {
  width: 2rem;
  background: rgba(156, 163, 175, 0.5);
}
</style>
