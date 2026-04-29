<script setup lang="ts">
import type { Database } from '~/types/database.types'
import { getMarketPublicUrl } from '~/utils/storage'

type ProductMarket = Database['public']['Tables']['product_markets']['Row']

interface Banner {
  id: string
  image_url: string
  updated_at: string
}

const supabase = useSupabaseClient()

// ── Categories ─────────────────────────────────────────────────────────────
const { data: categoriesData } = await useAsyncData('market-categories', async () => {
  const { data } = await supabase
    .from('category_markets')
    .select('name')
    .order('name', { ascending: true })
  return data || []
})

const categories = computed(() =>
  (categoriesData.value || []).map(c => ({ name: c.name, value: c.name }))
)

const selectedCategory = ref('')

// ── Banners (TransitionGroup carousel, arrow-navigated) ────────────────────
const banners = ref<Banner[]>([])
const bannerIndex = ref(0)
const bannerTransitioning = ref(false)
const bannerProgressWidth = ref(0)

const getBannerUrl = (path: string) => {
  if (!path) return '/placeholder.png'
  if (path.startsWith('http')) return path
  try {
    const { data } = supabase.storage.from('banner-image').getPublicUrl(path)
    return data.publicUrl
  } catch { return '/placeholder.png' }
}

// Autoplay
const bannerAutoplayTimer = ref<ReturnType<typeof setInterval> | null>(null)
const bannerProgressTimer = ref<ReturnType<typeof setInterval> | null>(null)

const stopBannerProgress = () => {
  if (bannerProgressTimer.value) {
    clearInterval(bannerProgressTimer.value)
    bannerProgressTimer.value = null
  }
}

const startBannerProgress = () => {
  stopBannerProgress()
  bannerProgressWidth.value = 0
  const step = 100 / (4000 / 50)
  bannerProgressTimer.value = setInterval(() => {
    bannerProgressWidth.value = Math.min(bannerProgressWidth.value + step, 100)
  }, 50)
}

const stopBannerAutoplay = () => {
  if (bannerAutoplayTimer.value) {
    clearInterval(bannerAutoplayTimer.value)
    bannerAutoplayTimer.value = null
  }
  stopBannerProgress()
}

const startBannerAutoplay = () => {
  stopBannerAutoplay()
  if (banners.value.length > 1) {
    startBannerProgress()
    bannerAutoplayTimer.value = setInterval(() => {
      if (!bannerTransitioning.value) nextBanner()
    }, 4000)
  }
}

const goToBanner = (i: number) => {
  if (bannerTransitioning.value || i === bannerIndex.value) return
  bannerIndex.value = i
  bannerTransitioning.value = true
  startBannerProgress()
  setTimeout(() => { bannerTransitioning.value = false }, 500)
}

const prevBanner = () => {
  if (bannerTransitioning.value || !banners.value.length) return
  bannerIndex.value = (bannerIndex.value - 1 + banners.value.length) % banners.value.length
  bannerTransitioning.value = true
  startBannerProgress()
  setTimeout(() => { bannerTransitioning.value = false }, 500)
}

const nextBanner = () => {
  if (bannerTransitioning.value || !banners.value.length) return
  bannerIndex.value = (bannerIndex.value + 1) % banners.value.length
  bannerTransitioning.value = true
  startBannerProgress()
  setTimeout(() => { bannerTransitioning.value = false }, 500)
}

// Touch swipe for banner
const bannerTouchStartX = ref(0)
const handleBannerTouchStart = (e: TouchEvent) => {
  bannerTouchStartX.value = e.touches[0].clientX
  stopBannerAutoplay()
}
const handleBannerTouchEnd = (e: TouchEvent) => {
  const delta = e.changedTouches[0].clientX - bannerTouchStartX.value
  if (Math.abs(delta) > 40) {
    if (delta > 0) prevBanner()
    else nextBanner()
  }
  setTimeout(() => startBannerAutoplay(), 200)
}

// ── Category Filter Carousel (page-based, no ugly scrollbar) ───────────────
const catTrackRef = ref<HTMLElement | null>(null)
const catDotIndex = ref(0)
const CAT_PER_PAGE = 4 // pills shown per page snap

const catAllItems = computed(() => [{ name: 'Semua', value: '' }, ...categories.value])

const catDotCount = computed(() =>
  Math.max(1, Math.ceil(catAllItems.value.length / CAT_PER_PAGE))
)

const handleCatScroll = () => {
  if (!catTrackRef.value) return
  const step = catTrackRef.value.clientWidth
  catDotIndex.value = Math.round(catTrackRef.value.scrollLeft / step)
}

const scrollCatTo = (i: number) => {
  if (!catTrackRef.value) return
  catTrackRef.value.scrollTo({ left: catTrackRef.value.clientWidth * i, behavior: 'smooth' })
  catDotIndex.value = i
}

// ── Products ────────────────────────────────────────────────────────────────
const products = ref<ProductMarket[]>([])
const loadingProducts = ref(true)
const productTrackRef = ref<HTMLElement | null>(null)
const productPageIndex = ref(0)
const productPerPage = ref(2) // updated on mount/resize

const updateProductPerPage = () => {
  if (!productTrackRef.value || !products.value.length) return
  const card = productTrackRef.value.children[0] as HTMLElement
  if (!card) return
  const cardW = card.offsetWidth
  const trackW = productTrackRef.value.clientWidth
  productPerPage.value = Math.max(1, Math.round(trackW / cardW))
}

const productDotCount = computed(() =>
  Math.max(1, Math.ceil(products.value.length / productPerPage.value))
)

const fetchProducts = async () => {
  loadingProducts.value = true
  try {
    let q = supabase
      .from('product_markets')
      .select('id,name,slug,category,price,price_range,price_unit,thumbnail_url,images')
      .is('deleted_at', null)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(8)
    if (selectedCategory.value) q = q.eq('category', selectedCategory.value)
    const { data } = await q
    products.value = (data || []) as ProductMarket[]
    productPageIndex.value = 0
    nextTick(() => {
      productTrackRef.value?.scrollTo({ left: 0 })
      updateProductPerPage()
    })
  } catch { products.value = [] }
  finally { loadingProducts.value = false }
}

const handleProductScroll = () => {
  if (!productTrackRef.value) return
  const { scrollLeft, clientWidth } = productTrackRef.value
  productPageIndex.value = Math.round(scrollLeft / clientWidth)
}

const scrollProductTo = (i: number) => {
  if (!productTrackRef.value) return
  productTrackRef.value.scrollTo({ left: productTrackRef.value.clientWidth * i, behavior: 'smooth' })
  productPageIndex.value = i
}

const getImage = (p: ProductMarket) => {
  const url = getMarketPublicUrl(p.thumbnail_url || '')
  return url || '/product.png'
}

const formatPrice = (p: ProductMarket) => {
  if (p.price_range) return p.price_range
  if (p.price == null) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.price)
}

watch(selectedCategory, fetchProducts)

onMounted(async () => {
  const { data } = await supabase
    .from('banner')
    .select('*')
    .order('updated_at', { ascending: false })
  banners.value = data || []
  if (banners.value.length > 1) nextTick(() => startBannerAutoplay())
  await fetchProducts()
  window.addEventListener('resize', updateProductPerPage, { passive: true })
})

onBeforeUnmount(() => {
  stopBannerAutoplay()
  window.removeEventListener('resize', updateProductPerPage)
})
</script>

<template>
  <section class="px-6 md:px-10 xl:px-12 flex flex-col gap-4">

    <!-- Header -->
    <div class="flex items-start gap-2.5">
      <div class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
        <UIcon name="i-lucide-shopping-bag" class="w-4 h-4 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <h2 class="text-[17px] md:text-[19px] font-bold text-gray-900 dark:text-gray-50 leading-snug tracking-tight">
          Penawaran &amp; Produk
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
          Promo spesial dan produk pertanian pilihan dari mitra terpercaya.
        </p>
      </div>
    </div>

    <!-- ══ Banner Carousel (HeroSection-style: arrow + dot + autoplay) ══ -->
    <div v-if="banners.length" class="flex flex-col gap-2">
      <!-- Viewport + Arrows -->
      <div
        class="promo-banner-viewport"
        @touchstart.passive="handleBannerTouchStart"
        @touchend.passive="handleBannerTouchEnd"
      >
        <!-- Slides -->
        <TransitionGroup name="promo-banner-fade" tag="div" class="absolute inset-0">
          <div
            v-for="(banner, i) in banners"
            v-show="i === bannerIndex"
            :key="banner.id"
            class="absolute inset-0"
          >
            <img
              :src="getBannerUrl(banner.image_url)"
              alt="Banner Promo JuruTani"
              class="w-full h-full object-cover block"
              loading="lazy"
              @error="(e: any) => (e.target as HTMLImageElement).src = '/placeholder.png'"
            >
          </div>
        </TransitionGroup>

        <!-- Prev Arrow -->
        <button
          v-if="banners.length > 1"
          class="promo-banner-btn promo-banner-btn--prev"
          aria-label="Banner sebelumnya"
          @click="prevBanner"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <!-- Next Arrow -->
        <button
          v-if="banners.length > 1"
          class="promo-banner-btn promo-banner-btn--next"
          aria-label="Banner berikutnya"
          @click="nextBanner"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <!-- Dots + Counter -->
      <div v-if="banners.length > 1" class="flex items-center justify-between px-0.5">
        <div class="flex items-center gap-1.5">
          <button
            v-for="(_, i) in banners"
            :key="i"
            :aria-label="`Banner ${i + 1}`"
            class="promo-banner-dot"
            :class="{ 'promo-banner-dot--active': i === bannerIndex }"
            @click="goToBanner(i)"
          >
            <span
              v-if="i === bannerIndex"
              class="promo-banner-dot__progress"
              :style="{ width: `${bannerProgressWidth}%` }"
            />
          </button>
        </div>
        <span class="text-[11px] font-medium text-gray-400 dark:text-gray-500 tabular-nums tracking-wide">
          {{ String(bannerIndex + 1).padStart(2, '0') }} / {{ String(banners.length).padStart(2, '0') }}
        </span>
      </div>
    </div>

    <!-- ══ Category Filter (hero-quick-carousel style, page-based dots) ══ -->
    <div class="flex flex-col gap-1.5">
      <!-- Pills track — scroll snap per page -->
      <div
        ref="catTrackRef"
        class="promo-cat-track"
        @scroll.passive="handleCatScroll"
      >
        <button
          v-for="cat in catAllItems"
          :key="cat.value"
          class="promo-cat-pill"
          :class="selectedCategory === cat.value
            ? 'promo-cat-pill--active'
            : 'promo-cat-pill--inactive'"
          @click="selectedCategory = cat.value"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Category Dots (only if > 1 page) -->
      <div v-if="catDotCount > 1" class="flex items-center gap-1.5">
        <button
          v-for="(_, i) in catDotCount"
          :key="i"
          class="promo-cat-dot"
          :class="{ 'promo-cat-dot--active': i === catDotIndex }"
          :aria-label="`Halaman kategori ${i + 1}`"
          @click="scrollCatTo(i)"
        />
      </div>
    </div>

    <!-- ══ Product Grid / Carousel ══ -->

    <!-- Loading skeleton -->
    <div v-if="loadingProducts" class="flex gap-3 overflow-hidden">
      <div
        v-for="i in 4"
        :key="i"
        class="flex-none w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(25%-9px)] aspect-[3/4] rounded-[0.875rem] bg-gray-200/40 dark:bg-gray-700/30 animate-pulse"
      />
    </div>

    <template v-else-if="products.length">
      <!-- Scrollable track -->
      <div
        ref="productTrackRef"
        class="promo-product-track"
        @scroll.passive="handleProductScroll"
      >
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/markets/${product.slug}`"
          class="promo-product-card"
        >
          <!-- Image -->
          <div class="w-full aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden">
            <img
              :src="getImage(product)"
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-400 hover:scale-105"
              loading="lazy"
              @error="(e: any) => (e.target as HTMLImageElement).src = '/product.png'"
            >
          </div>

          <!-- Body -->
          <div class="p-3 flex flex-col gap-1 flex-1">
            <p class="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
              {{ product.name }}
            </p>
            <div class="flex items-end justify-between gap-1 mt-0.5">
              <p class="text-[13px] font-extrabold text-green-600 dark:text-green-400">
                {{ formatPrice(product) }}
              </p>
              <p v-if="product.price_unit" class="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                / {{ product.price_unit }}
              </p>
            </div>
            <button class="promo-product-cta">
              Cek Sekarang
            </button>
          </div>
        </NuxtLink>
      </div>

      <!-- Dots (per page) + See More -->
      <div class="flex items-center gap-3">
        <div v-if="productDotCount > 1" class="flex gap-1.5 flex-1">
          <button
            v-for="(_, i) in productDotCount"
            :key="i"
            :aria-label="`Halaman produk ${i + 1}`"
            class="promo-product-dot"
            :class="{ 'promo-product-dot--active': i === productPageIndex }"
            @click="scrollProductTo(i)"
          />
        </div>
        <NuxtLink
          to="/markets"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-semibold text-green-600 dark:text-green-400 bg-green-600/8 dark:bg-green-400/10 border border-green-600/20 dark:border-green-400/20 rounded-full no-underline hover:bg-green-600/15 hover:border-green-600/40 transition-all duration-200 ml-auto"
        >
          Selengkapnya <span class="sr-only">promosi</span>
          <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </template>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-10 border border-dashed border-gray-200/60 dark:border-gray-700/50 rounded-xl">
      <UIcon name="i-lucide-package-open" class="w-8 h-8 text-gray-300 dark:text-gray-600" />
      <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">Produk tidak ditemukan</p>
    </div>

  </section>
</template>

<style scoped>
/* ══════════════════════════════════════════════════
   BANNER CAROUSEL
══════════════════════════════════════════════════ */
.promo-banner-viewport {
  position: relative;
  width: 100%;
  border-radius: 0.875rem;
  overflow: hidden;
  aspect-ratio: 2.8 / 1;
  background: #0a1a0e;
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.2);
}

@media (min-width: 768px) {
  .promo-banner-viewport { aspect-ratio: 4 / 1; }
}

/* Arrow buttons */
.promo-banner-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.promo-banner-btn:hover {
  background: rgba(255, 255, 255, 0.32);
  transform: translateY(-50%) scale(1.08);
  border-color: rgba(134, 239, 172, 0.5);
  box-shadow: 0 4px 16px rgba(22, 163, 74, 0.25);
}

.promo-banner-btn:active { transform: translateY(-50%) scale(0.93); }

.promo-banner-btn--prev { left: 0.625rem; }
.promo-banner-btn--next { right: 0.625rem; }

/* Dots */
.promo-banner-dot {
  position: relative;
  height: 0.3125rem;
  width: 0.4rem;
  border-radius: 9999px;
  overflow: hidden;
  border: none;
  padding: 0;
  cursor: pointer;
  background: rgba(209, 213, 219, 0.45);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.promo-banner-dot--active {
  width: 1.75rem;
  background: rgba(209, 213, 219, 0.35);
}

.promo-banner-dot__progress {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: #f59e0b;
  border-radius: 9999px;
  transition: width 0.05s linear;
}

.promo-banner-dot:not(.promo-banner-dot--active):hover {
  background: #fbbf24;
  transform: scaleY(1.3);
}

/* Slide transition */
.promo-banner-fade-enter-active,
.promo-banner-fade-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  inset: 0;
}

.promo-banner-fade-enter-from { opacity: 0; transform: scale(1.03); }
.promo-banner-fade-leave-to  { opacity: 0; transform: scale(0.97); }
.promo-banner-fade-enter-to,
.promo-banner-fade-leave-from { opacity: 1; transform: scale(1); }

/* ══════════════════════════════════════════════════
   CATEGORY FILTER CAROUSEL
══════════════════════════════════════════════════ */
.promo-cat-track {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 0.125rem;
}

.promo-cat-track::-webkit-scrollbar { display: none; }

.promo-cat-pill {
  flex: 0 0 auto;
  scroll-snap-align: start;
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s ease;
}

.promo-cat-pill--active {
  background: #dcfce7;
  border-color: rgba(74, 222, 128, 0.5);
  color: #15803d;
}

.promo-cat-pill--inactive {
  background: #fff;
  border-color: rgba(209, 213, 219, 0.7);
  color: #6b7280;
}

.promo-cat-pill--inactive:hover {
  border-color: #86efac;
  color: #16a34a;
}

/* Category dots */
.promo-cat-dot {
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 9999px;
  background: rgba(156, 163, 175, 0.45);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.promo-cat-dot--active {
  width: 1.375rem;
  background: #16a34a;
}

/* ══════════════════════════════════════════════════
   PRODUCT TRACK & CARD
══════════════════════════════════════════════════ */
.promo-product-track {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.promo-product-track::-webkit-scrollbar { display: none; }

.promo-product-card {
  flex: 0 0 calc(50% - 0.375rem);
  scroll-snap-align: start;
  border-radius: 0.875rem;
  border: 1px solid rgba(209, 213, 219, 0.6);
  background: #fff;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  min-width: 0;
}

@media (min-width: 640px) {
  .promo-product-card { flex: 0 0 calc(33.333% - 0.5rem); }
}

@media (min-width: 1024px) {
  .promo-product-card { flex: 0 0 calc(25% - 0.5625rem); }
}

.promo-product-card:hover {
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* CTA Button */
.promo-product-cta {
  margin-top: auto;
  padding-top: 0.5rem;
  width: 100%;
  padding-block: 0.4rem;
  border-radius: 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #16a34a;
  border: 1.5px solid #16a34a;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.promo-product-cta:hover {
  background: #16a34a;
  color: #fff;
}

/* Product Dots */
.promo-product-dot {
  height: 0.3125rem;
  width: 0.375rem;
  border-radius: 9999px;
  background: rgba(156, 163, 175, 0.5);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.promo-product-dot--active {
  width: 1.5rem;
  background: #16a34a;
}

.promo-product-dot:not(.promo-product-dot--active):hover {
  background: #4ade80;
  transform: scaleY(1.25);
}

/* ══════════════════════════════════════════════════
   DARK MODE
══════════════════════════════════════════════════ */
:root.dark .promo-cat-pill--active {
  background: rgba(22, 163, 74, 0.18);
  border-color: rgba(74, 222, 128, 0.4);
  color: #4ade80;
}

:root.dark .promo-cat-pill--inactive {
  background: rgba(17, 24, 39, 0.6);
  border-color: rgba(75, 85, 99, 0.5);
  color: #9ca3af;
}

:root.dark .promo-cat-pill--inactive:hover {
  border-color: rgba(74, 222, 128, 0.4);
  color: #4ade80;
}

:root.dark .promo-cat-dot--active { background: #4ade80; }

:root.dark .promo-product-card {
  border-color: rgba(75, 85, 99, 0.5);
  background: rgba(17, 24, 39, 0.6);
}

:root.dark .promo-product-cta {
  border-color: #4ade80;
  color: #4ade80;
}

:root.dark .promo-product-cta:hover {
  background: #16a34a;
  color: #fff;
  border-color: #16a34a;
}

:root.dark .promo-product-dot--active { background: #4ade80; }
</style>