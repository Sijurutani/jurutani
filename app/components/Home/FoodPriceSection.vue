<script setup lang="ts">
import { formatCurrency } from '~/utils/currency'
import { getFoodPublicUrl } from '~/utils/storage'
import type { Database } from '~/types/database.types'

const supabase = useSupabaseClient<Database>()

type FoodRow = {
  id: string
  name: string
  category: string | null
  satuan: string | null
  slug: string | null
  image_url: string | null
  latest_price: number
  latest_price_date: string
}

const getCategoryTheme = (val: string) => ({
  'hortikultura': { bg: 'rgba(209,250,229,0.7)', color: '#059669', icon: 'i-lucide-leaf' },
  'perkebunan':   { bg: 'rgba(220,252,231,0.7)', color: '#16a34a', icon: 'i-lucide-tree-deciduous' },
  'peternakan':   { bg: 'rgba(254,243,199,0.7)', color: '#d97706', icon: 'i-lucide-beef' },
}[val] || { bg: 'rgba(243,244,246,0.7)', color: '#6b7280', icon: 'i-lucide-package' })

const formatShortDate = (d?: string) => {
  if (!d) return ''
  try {
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d))
  } catch { return '' }
}



// ── OPTIMASI: Ganti 2 query terpisah → 1 query efisien via JOIN ───────────────
// Sebelumnya: fetch ALL foods + fetch ALL food_prices → gabung di JS (sangat berat!)
// Sekarang: Supabase hanya kirim 12 baris data dengan JOIN langsung di DB server
const { data: items, pending } = await useAsyncData<FoodRow[]>(
  'fp-home-latest',
  async () => {
    // Ambil 12 harga terbaru sekaligus dengan JOIN sisi server
    const { data, error } = await supabase
      .from('food_prices')
      .select('price, date, foods!inner(id, name, category, satuan, slug, image_url)')
      .is('deleted_at', null)
      .is('foods.deleted_at', null)
      .order('date', { ascending: false })
      .limit(50) // ambil lebih dulu, lalu deduplicate di JS

    if (error) throw error

    // Deduplicate: ambil harga terbaru per makanan, lalu ambil 12 terbaru
    const seen = new Set<string>()
    const deduped: FoodRow[] = []
    for (const row of (data || [])) {
      const food = row.foods as any
      if (!food || seen.has(food.id)) continue
      if (!row.price || row.price <= 0) continue
      seen.add(food.id)
      deduped.push({
        id: food.id,
        name: food.name,
        category: food.category,
        satuan: food.satuan,
        slug: food.slug,
        image_url: getFoodPublicUrl(food.image_url || null),
        latest_price: row.price,
        latest_price_date: row.date,
      })
      if (deduped.length >= 12) break
    }
    return deduped
  }
)

// ── Carousel (page-based dots, sama dengan PromotionSection) ─────────────────
const trackRef = ref<HTMLElement | null>(null)
const dotIndex = ref(0)
const perPage = ref(2) // card visible per halaman, diupdate setelah mount

const updatePerPage = () => {
  const itemList = items.value as FoodRow[] | null
  if (!trackRef.value || !itemList?.length) return
  const card = trackRef.value.children[0] as HTMLElement
  if (!card) return
  const cardW = card.offsetWidth
  const trackW = trackRef.value.clientWidth
  perPage.value = Math.max(1, Math.round(trackW / cardW))
}

const dotCount = computed(() => {
  const itemList = items.value as FoodRow[] | null
  return Math.max(1, Math.ceil((itemList?.length ?? 0) / perPage.value))
})

const handleScroll = () => {
  if (!trackRef.value) return
  const { scrollLeft, clientWidth } = trackRef.value
  dotIndex.value = Math.round(scrollLeft / clientWidth)
}

const scrollTo = (i: number) => {
  if (!trackRef.value) return
  trackRef.value.scrollTo({ left: trackRef.value.clientWidth * i, behavior: 'smooth' })
  dotIndex.value = i
}

const latestDate = computed(() => items.value?.[0]?.latest_price_date)

onMounted(() => {
  nextTick(() => updatePerPage())
  window.addEventListener('resize', updatePerPage, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePerPage)
})
</script>

<template>
  <div class="fp-root">

    <!-- ── Top bar ── -->
    <div class="fp-topbar">
      <div class="fp-title-icon">
        <UIcon name="i-lucide-trending-up" class="w-4 h-4" />
      </div>
      <div class="fp-title-text">
        <h2 class="fp-heading">Harga Pangan Terkini</h2>
        <p class="fp-desc">
          Data komoditas pertanian DIY
          <span v-if="latestDate"> — update {{ formatShortDate(latestDate) }}</span>
        </p>
      </div>
    </div>

    <!-- ── Loading ── -->
    <div v-if="pending" class="fp-track">
      <div v-for="i in 6" :key="i" class="fp-skeleton" />
    </div>

    <!-- ── Carousel ── -->
    <template v-else-if="(items as FoodRow[] | null)?.length">
      <div ref="trackRef" class="fp-track" @scroll.passive="handleScroll">
        <NuxtLink
          v-for="item in items"
          :key="item.id"
          :to="`/food-prices/${item.slug || item.id}`"
          class="fp-card"
        >
          <div v-if="item.image_url" class="fp-card__image-wrap">
            <img
              :src="item.image_url"
              :alt="item.name"
              class="fp-card__image"
              loading="lazy"
              width="200"
              height="200"
              decoding="async"
              @error="(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.style.display = 'none' }"
            >
          </div>
          <div v-else class="fp-card__icon-bg" :style="{ background: getCategoryTheme(item.category || '').bg }">
            <UIcon
              :name="getCategoryTheme(item.category || '').icon"
              class="w-5 h-5"
              :style="{ color: getCategoryTheme(item.category || '').color }"
            />
          </div>
          <div class="fp-card__body">
            <p class="fp-card__name">{{ item.name }}</p>
            <div class="fp-card__meta">
              <p class="fp-card__price" :style="{ color: getCategoryTheme(item.category || '').color }">
                {{ formatCurrency(item.latest_price || 0) }}
              </p>
              <p class="fp-card__satuan">/ {{ item.satuan }}</p>
            </div>
            <button class="fp-card__cta">Cek Sekarang</button>
          </div>
        </NuxtLink>
      </div>

      <div class="fp-carousel-foot">
        <!-- Dots per halaman (bukan per item) -->
        <div v-if="dotCount > 1" class="fp-dots fp-dots--left">
          <button
            v-for="(_, i) in dotCount"
            :key="i"
            class="fp-dot"
            :class="{ 'fp-dot--active': i === dotIndex }"
            :aria-label="`Halaman ${i + 1}`"
            @click="scrollTo(i)"
          />
        </div>

        <!-- Bottom see more -->
        <NuxtLink to="/food-prices" class="fp-see-more fp-see-more--inline">
          Selengkapnya <span class="sr-only">tentang Harga Pangan</span>
          <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </template>

    <!-- Empty -->
    <div v-else class="fp-empty">
      <UIcon name="i-lucide-package-open" class="w-8 h-8 text-gray-300" />
      <p class="text-sm text-gray-400 mt-2">Belum ada data harga pangan</p>
    </div>

  </div>
</template>

<style scoped>
/* ══ Root ══ */
.fp-root {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding-inline: 1.5rem;
}

@media (min-width: 768px) {
  .fp-root { padding-inline: 2.5rem; }
}

@media (min-width: 1280px) {
  .fp-root { padding-inline: 3rem; }
}

/* ══ Top bar ══ */
.fp-topbar {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.fp-title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #16a34a;
  flex-shrink: 0;
}

.fp-title-text {
  flex: 1;
  min-width: 0;
}

.fp-heading {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-base, #111827);
  line-height: 1.3;
  margin: 0 0 0.15rem;
  letter-spacing: -0.01em;
}

@media (min-width: 768px) {
  .fp-heading { font-size: 1.2rem; }
}

.fp-desc {
  font-size: 0.72rem;
  color: var(--text-muted, #6b7280);
  margin: 0;
  line-height: 1.4;
}

.fp-see-all {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #059669;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: gap 0.2s ease;
}

.fp-see-all:hover { gap: 0.5rem; }

/* ══ Track ══ */
.fp-track {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.fp-track::-webkit-scrollbar { display: none; }

/* ── Card ── */
.fp-card {
  flex: 0 0 calc(50% - 0.375rem);
  scroll-snap-align: start;
  border-radius: 0.875rem;
  border: 1px solid var(--border-light, rgba(209,213,219,0.6));
  background: var(--bg-surface, #fff);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  min-width: 0;
}

@media (min-width: 640px) {
  .fp-card { flex: 0 0 calc(33.333% - 0.5rem); }
}

@media (min-width: 1024px) {
  .fp-card { flex: 0 0 calc(25% - 0.5625rem); }
}

.fp-card:hover {
  box-shadow: 0 4px 20px -4px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.fp-card__icon-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1 / 1;
  padding: 1.25rem;
  transition: background 0.3s;
}

.fp-card__image-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #f9fafb;
}

.fp-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.fp-card:hover .fp-card__image {
  transform: scale(1.05);
}

.fp-card__body {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.fp-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.fp-card__name {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-base, #111827);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.fp-card__satuan {
  font-size: 0.7rem;
  color: var(--text-muted, #6b7280);
  margin: 0;
  white-space: nowrap;
}

.fp-card__price {
  font-size: 0.8125rem;
  font-weight: 800;
  margin: 0.125rem 0 0;
}

.fp-card__cta {
  margin-top: auto;
  padding-top: 0.625rem;
  width: 100%;
  padding-block: 0.45rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #16a34a;
  border: 1.5px solid #16a34a;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.fp-card__cta:hover {
  background: #16a34a;
  color: #fff;
}

/* ── Skeleton ── */
.fp-skeleton {
  flex: 0 0 calc(50% - 0.375rem);
  aspect-ratio: 3 / 4;
  border-radius: 0.875rem;
  background: rgba(209,213,219,0.35);
  animation: fp-pulse 1.4s ease-in-out infinite;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .fp-skeleton { flex: 0 0 calc(33.333% - 0.5rem); }
}

@media (min-width: 1024px) {
  .fp-skeleton { flex: 0 0 calc(25% - 0.5625rem); }
}

@keyframes fp-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* ── Dots ── */
.fp-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.fp-carousel-foot {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.15rem;
}

.fp-dots--left {
  justify-content: flex-start;
  flex: 1;
}

.fp-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background: rgba(156,163,175,0.5);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.fp-dot--active {
  width: 1.5rem;
  background: #059669;
}

/* ── Bottom link ── */
.fp-bottom-link { display: flex; }

.fp-see-more {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  align-self: flex-start;
  margin-top: 0.5rem;
  padding: 0.4rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #16a34a;
  background: rgba(22, 163, 74, 0.08);
  border: 1px solid rgba(22, 163, 74, 0.2);
  border-radius: 9999px;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.fp-see-more--inline {
  margin-left: auto;
  align-self: center;
  margin-top: 0;
}

.fp-see-more:hover {
  background: rgba(22, 163, 74, 0.15);
  border-color: rgba(22, 163, 74, 0.4);
  transform: translateX(2px);
}

/* ── Empty ── */
.fp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  border: 1px dashed rgba(209,213,219,0.6);
  border-radius: 1rem;
}

/* ══ Dark mode ══ */
:root.dark .fp-heading { color: #f9fafb; }

:root.dark .fp-title-icon {
  background: rgba(22, 163, 74, 0.2);
  color: #4ade80;
}

:root.dark .fp-card {
  border-color: rgba(75,85,99,0.5);
  background: rgba(17,24,39,0.6);
}

:root.dark .fp-card__image-wrap {
  background: rgba(31,41,55,0.8);
}

:root.dark .fp-card__name { color: #f3f4f6; }

:root.dark .fp-see-more {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.08);
  border-color: rgba(74, 222, 128, 0.2);
}

:root.dark .fp-see-more:hover {
  background: rgba(74, 222, 128, 0.15);
  border-color: rgba(74, 222, 128, 0.4);
}

:root.dark .fp-card__cta {
  border-color: #4ade80;
  color: #4ade80;
}

:root.dark .fp-card__cta:hover {
  background: #16a34a;
  color: #fff;
  border-color: #16a34a;
}
</style>