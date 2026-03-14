<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import type { ProductMarket } from '~/types/market'
import type { SortOption } from '~/types/content'
import { Enum } from '~/utils/enum'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Pasar Tani JuruTani',
  description: 'Marketplace produk pertanian, peternakan, dan alat tani terpercaya'
})

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const pageSize = 12

const category = computed<string>({
  get() {
    const raw = route.query.category
    return typeof raw === 'string' ? raw : 'all'
  },
  set(value) {
    const nextQuery = { ...route.query }
    if (!value || value === 'all' || value === 'semua') {
      delete nextQuery.category
    } else {
      nextQuery.category = value
    }
    router.replace({ query: nextQuery })
  }
})

const search = computed<string | undefined>({
  get() {
    const raw = route.query.search
    return typeof raw === 'string' && raw.trim() ? raw : undefined
  },
  set(value) {
    const nextQuery = { ...route.query }
    if (!value || !value.trim()) {
      delete nextQuery.search
    } else {
      nextQuery.search = value
    }
    router.replace({ query: nextQuery })
  }
})

const sort = computed<string>({
  get() {
    const raw = route.query.sort
    return typeof raw === 'string' ? raw : Enum.SortOptions[0].value
  },
  set(value) {
    const nextQuery = { ...route.query }
    if (!value || value === Enum.SortOptions[0].value) {
      delete nextQuery.sort
    } else {
      nextQuery.sort = value
    }
    router.replace({ query: nextQuery })
  }
})

const page = computed<number>({
  get() {
    const raw = route.query.page
    if (typeof raw !== 'string') return 1
    const parsed = Number.parseInt(raw, 10)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
  },
  set(value) {
    const nextQuery = { ...route.query }
    const normalized = Number.isFinite(value) && value > 0 ? Math.floor(value) : 1
    if (normalized <= 1) {
      delete nextQuery.page
    } else {
      nextQuery.page = String(normalized)
    }
    router.replace({ query: nextQuery })
  }
})

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

const normalizeAttachments = (value: unknown): ProductMarket['attachments'] => {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map(item => ({
      name: typeof item.name === 'string' ? item.name : 'Lampiran',
      url: typeof item.url === 'string' ? item.url : '',
      size: typeof item.size === 'number' ? item.size : undefined,
      type: typeof item.type === 'string' ? item.type : undefined
    }))
    .filter(item => !!item.url)
}

const normalizeLinks = (value: unknown): ProductMarket['links'] => {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map(item => ({
      shopee_link: typeof item.shopee_link === 'string' ? item.shopee_link : undefined,
      tokopedia_link: typeof item.tokopedia_link === 'string' ? item.tokopedia_link : undefined,
      tiktok_link: typeof item.tiktok_link === 'string' ? item.tiktok_link : undefined,
      other_link: typeof item.other_link === 'string' ? item.other_link : undefined
    }))
}

const query = computed(() => {
  let q = supabase
    .from('product_markets')
    .select('id,name,slug,excerpt,content,category,price,price_range,price_unit,thumbnail_url,images,attachments,links,seller,contact_seller,created_at', { count: 'exact' })
    .is('deleted_at', null)
    .eq('status', 'approved')

  if (category.value && category.value !== 'all' && category.value !== 'semua') {
    q = q.eq('category', category.value)
  }

  if (search.value) {
    const term = search.value.trim()
    q = q.or(`name.ilike.%${term}%,excerpt.ilike.%${term}%,seller.ilike.%${term}%`)
  }

  const [rawColumn, direction] = sort.value.split('-')
  const column = rawColumn === 'name' ? 'name' : rawColumn

  return q.order(column, { ascending: direction === 'asc' })
})

const { data, pending, error, refresh } = await useAsyncData('markets-list', async () => {
  const from = (page.value - 1) * pageSize
  const to = page.value * pageSize - 1

  const { data: marketsData, count, error: fetchError } = await query.value.range(from, to)
  if (fetchError) throw fetchError

  const items = (marketsData ?? []).map(item => ({
    ...item,
    content: item.content as ProductMarket['content'],
    images: normalizeStringArray(item.images),
    attachments: normalizeAttachments(item.attachments),
    links: normalizeLinks(item.links)
  })) as ProductMarket[]

  return {
    items,
    total: count || 0
  }
}, {
  default: () => ({ items: [] as ProductMarket[], total: 0 }),
  watch: [sort, page, category]
})

const { data: categoriesData } = await useAsyncData('market-categories', async () => {
  const { data, error: catError } = await supabase
    .from('category_markets')
    .select('name')
    .order('name', { ascending: true })

  if (catError) throw catError
  return data ?? []
})

const categories = computed(() => {
  return (categoriesData.value ?? []).map((cat: any) => ({
    name: cat.name,
    value: cat.name
  }))
})

watchDebounced([search], async () => {
  page.value = 1
  await refresh()
}, { debounce: 500 })

watch([category, sort], () => {
  page.value = 1
})

const sortOptions: SortOption[] = Enum.SortOptions.map((option) => {
  const [rawColumn, direction] = option.value.split('-')
  return {
    label: option.label,
    value: option.value,
    column: rawColumn === 'name' ? 'name' : rawColumn,
    ascending: direction === 'asc'
  }
})

const totalPages = computed(() => Math.max(1, Math.ceil(data.value.total / pageSize)))
const hasData = computed(() => data.value.items.length > 0)
const showPagination = computed(() => !pending.value && hasData.value && totalPages.value > 1)

const getBentoVariant = (index: number, total: number): 'default' | 'large' | 'wide' => {
  const remainder = total % 3
  if (remainder === 2 && index === total - 2) return 'wide'
  if (remainder === 2 && index === total - 1) return 'default'
  if (remainder === 1 && index === total - 1) return 'wide'
  if (index === 0) return 'large'
  const pattern = (index - 1) % 5
  if (pattern === 3 || pattern === 4) return 'wide'
  return 'default'
}

const handleCategoryChange = (value: string) => {
  category.value = value
}

const handleSortChange = (value: string) => {
  sort.value = value
}

const handlePageChange = (value: number) => {
  page.value = value
}
</script>

<template>
  <div class="markets-page container mx-auto px-4 py-12">
    <!-- Markets Section Header -->
    <div class="mx-auto mb-8 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-linear-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-lucide-shopping-bag" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Marketplace Petani Terpercaya</span>
      </div>

      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Pasar Tani JuruTani
      </h2>

      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
        Jelajahi marketplace produk lokal dengan pilihan lengkap
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">hasil pertanian segar</span>,
        <span class="font-semibold text-teal-600 dark:text-teal-400">produk peternakan berkualitas</span>, dan
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">olahan artisan</span> langsung dari petani dan produsen terpercaya.
      </p>

      <!-- Category Filter -->
      <AppCategoryFilter
        :categories="categories"
        :current-category="filters.category"
        :show-all-option="true"
        all-option-text="Semua"
        all-option-value="all"
        @update:category="handleCategoryChange"
      />
    </div>

    <!-- Filter & Sort Bar -->
    <div class="flex flex-col gap-4 mb-8">

      <!-- Search Bar - Full width on all screens -->
      <AppSearchBar
        v-model="search"
        placeholder="Cari produk, kategori, atau penjual..."
      />

      <!-- Sort and Results Row -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <!-- Sort Dropdown -->
        <AppSortDropdown
          :sort-options="sortOptions"
          :current-sort="sort"
          @update:sort="handleSortChange"
        />

        <!-- Results Count -->
        <div v-if="!pending && hasData" class="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan <span class="font-semibold text-green-600 dark:text-green-400">{{ data.items.length }}</span> dari <span class="font-semibold">{{ data.total }}</span> produk
        </div>
      </div>
    </div>

    <!-- Markets Content with Bento Grid -->
    <div class="mt-8">
      <LoadingData v-if="pending" />
      <ErrorData v-else-if="error" :error="error.message" />
      <NotFoundData v-else-if="!hasData" />

      <!-- Bento Grid Layout -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
        <MarketsProductMarketCard
          v-for="(product, index) in data.items"
          :key="product.id"
          :product="product"
          :variant="getBentoVariant(index, data.items.length)"
        />
      </div>
    </div>

    <!-- Pagination -->
    <AppPagination
      v-if="showPagination"
      :current-page="page"
      :total-pages="totalPages"
      :total-items="data.total"
      :page-size="pageSize"
      :show-page-info="true"
      :show-first-last="true"
      @update:page="handlePageChange"
    />

    <!-- Create Button - Link to create page -->
    <div class="mt-8 flex justify-center">
      <NuxtLink
        to="/markets/create"
        class="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-all duration-200 hover:shadow-lg font-semibold"
      >
        <UIcon name="i-lucide-plus" class="w-5 h-5" />
        Jual Produk Sekarang
      </NuxtLink>
    </div>
  </div>
</template>