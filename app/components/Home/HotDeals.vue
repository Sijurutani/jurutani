<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import type { JSONContent } from '@tiptap/vue-3'
import type { Database } from '~/types/database.types'

// ─── Metadata ──────────────────────────────────────────────────────────────────
useSeoMeta({
  title: 'Pasar Tani JuruTani',
  description: 'Marketplace produk pertanian, peternakan, dan alat tani terpercaya'
})

// ─── Types ─────────────────────────────────────────────────────────────────────
type ProductMarketRow = Database['public']['Tables']['product_markets']['Row']
type CategoryMarketsRow = Database['public']['Tables']['category_markets']['Row']

interface MarketAttachment {
  name: string; url: string; size?: number; type?: string
}

interface MarketLink {
  shopee_link?: string; tokopedia_link?: string; tiktok_link?: string; other_link?: string
}

type ProductMarket = Omit<ProductMarketRow, 'content' | 'images' | 'attachments' | 'links'> & {
  content: JSONContent
  images: string[]
  attachments: MarketAttachment[]
  links: MarketLink[]
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const normalizeArray = (val: any): string[] => Array.isArray(val) ? val : []
const normalizeJSON = (val: any): any[] => Array.isArray(val) ? val : []

// ─── Setup & State ─────────────────────────────────────────────────────────────
const supabase = useSupabaseClient()
const pageSize = 12

// Reactive Route Queries (Agar filter tetap tersimpan saat page direfresh)
const search = useRouteQuery<string>('search', '')
const category = useRouteQuery<string>('category', 'all')
const page = useRouteQuery<number>('page', 1, { transform: Number })

// ─── Fetch Kategori ────────────────────────────────────────────────────────────
const { data: categoriesData } = await useAsyncData('market-home-categories', async () => {
  const { data } = await supabase
    .from('category_markets')
    .select('name')
    .order('name', { ascending: true })
  return data || []
})

const categories = computed(() => 
  (categoriesData.value || []).map(cat => ({ name: cat.name, value: cat.name }))
)

// ─── Fetch Data Utama ──────────────────────────────────────────────────────────
const { data, pending, error, refresh } = await useAsyncData('markets-home-list', async () => {
  const from = (page.value - 1) * pageSize
  const to = page.value * pageSize - 1

  let query = supabase
    .from('product_markets')
    .select('id,name,slug,excerpt,content,category,price,price_range,price_unit,thumbnail_url,images,attachments,links,seller,contact_seller,created_at', { count: 'exact' })
    .is('deleted_at', null)
    .eq('status', 'approved')

  // Filter Kategori
  if (category.value && category.value !== 'all') {
    query = query.eq('category', category.value)
  }

  // Filter Search
  if (search.value) {
    query = query.or(`name.ilike.%${search.value}%,excerpt.ilike.%${search.value}%`)
  }

  const { data: dbData, count, error: fetchError } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (fetchError) throw fetchError

  const items = (dbData || []).map(item => ({
    ...item,
    content: item.content as JSONContent,
    images: normalizeArray(item.images),
    attachments: normalizeJSON(item.attachments),
    links: normalizeJSON(item.links)
  })) as ProductMarket[]

  return { items, total: count || 0 }
}, {
  watch: [page] // Auto-refresh saat halaman berubah
})

// Debounce search agar tidak spam request saat mengetik
watchDebounced([search, category], () => {
  page.value = 1
  refresh()
}, { debounce: 500 })

// ─── Computed ─────────────────────────────────────────────────────────────────
const totalPages = computed(() => Math.ceil((data.value?.total || 0) / pageSize))
const hasData = computed(() => (data.value?.items?.length || 0) > 0)

// ─── Handlers ─────────────────────────────────────────────────────────────────
const handleCategoryChange = (val: string) => { category.value = val }
const handlePageChange = (val: number) => { page.value = val }
</script>

<template>
  <main class="markets-page container mx-auto px-4 py-12">
    <header class="mx-auto mb-10 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
        <UIcon name="i-lucide-shopping-bag" class="w-4 h-4 text-emerald-600" />
        <span class="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Marketplace</span>
      </div>
      
      <h1 class="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        Pasar Tani JuruTani
      </h1>

      <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
        Temukan produk pertanian segar dan peralatan tani terbaik langsung dari mitra terpercaya kami.
      </p>

      <AppCategoryFilter 
        :categories="categories" 
        :current-category="category"
        all-option-value="all"
        @update:category="handleCategoryChange"
      />
    </header>

    <div class="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
      <div class="w-full md:max-w-md">
        <AppSearchBar v-model="search" placeholder="Cari produk tani..." />
      </div>
    </div>

    <section>
      <LoadingData v-if="pending" />
      <ErrorData v-else-if="error" :error="error.message" />
      <NotFoundData v-else-if="!hasData" />
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <MarketsProductMarketCard 
          v-for="product in data.items" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </section>

    <div class="mt-12 flex justify-center">
      <AppPagination 
        v-if="hasData && totalPages > 1"
        :current-page="page" 
        :total-pages="totalPages"
        @update:page="handlePageChange"
      />
    </div>
  </main>
</template>