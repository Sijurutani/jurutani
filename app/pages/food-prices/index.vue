<script setup lang="ts">
import { h, resolveComponent } from 'vue'

definePageMeta({
  layout: 'default',
})

const UIcon = resolveComponent('UIcon')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const router = useRouter()
const { 
  getFoodsWithLatestPrices, 
  formatCurrency, 
  formatDate,
  getCategoryIcon,
  getCategoryLabel 
} = useFoodPrices()

// State
const foods = ref<any[]>([])
const loading = ref(true)
const error = ref<any>(null)
const selectedCategory = ref('all')
const searchQuery = ref('')
const currentSort = ref<'name' | 'price-asc' | 'price-desc' | 'updated'>('updated')
const currentPage = ref(1)
const itemsPerPage = 15

// Fetch data from Supabase
const fetchFoods = async () => {
  loading.value = true
  error.value = null
  
  const { data, error: fetchError } = await getFoodsWithLatestPrices(
    selectedCategory.value,
    searchQuery.value
  )
  
  if (fetchError) {
    error.value = fetchError
    console.error('Error fetching foods:', fetchError)
  } else {
    foods.value = data || []
  }
  
  loading.value = false
}

// Watch for filter changes
watch([selectedCategory, searchQuery], () => {
  currentPage.value = 1
  fetchFoods()
})

// Sort foods
const sortedData = computed(() => {
  const data = [...foods.value]
  
  switch (currentSort.value) {
    case 'name':
      return data.sort((a, b) => a.name.localeCompare(b.name, 'id'))
    case 'price-asc':
      return data.sort((a, b) => (a.latest_price || 0) - (b.latest_price || 0))
    case 'price-desc':
      return data.sort((a, b) => (b.latest_price || 0) - (a.latest_price || 0))
    case 'updated':
      return data.sort((a, b) => {
        const dateA = new Date(a.latest_price_date || a.updated_at).getTime()
        const dateB = new Date(b.latest_price_date || b.updated_at).getTime()
        return dateB - dateA
      })
    default:
      return data
  }
})

// Pagination
const totalPages = computed(() => Math.ceil(sortedData.value.length / itemsPerPage))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedData.value.slice(start, end)
})

// Table columns with cell renderers
const columns = [
  {
    accessorKey: 'name',
    header: 'Nama Komoditas',
    cell: ({ row }: any) => {
      return h('div', { class: 'flex items-center gap-3 min-w-[200px]' }, [
        h('div', {
          class: 'flex-shrink-0 w-10 h-10 rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center'
        }, [
          h(UIcon, {
            name: getCategoryIcon(row.original.category),
            class: 'w-5 h-5 text-emerald-600 dark:text-emerald-400'
          })
        ]),
        h('div', { class: 'flex-1 min-w-0' }, [
          h('div', { class: 'font-semibold text-gray-900 dark:text-white truncate' }, row.original.name),
          row.original.description ? h('div', {
            class: 'text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs'
          }, row.original.description) : null
        ])
      ])
    }
  },
  {
    accessorKey: 'category',
    header: 'Kategori',
    cell: ({ row }: any) => {
      return h('div', { class: 'min-w-[120px]' }, [
        h(UBadge, {
          color: 'primary',
          variant: 'subtle',
          size: 'sm'
        }, () => getCategoryLabel(row.original.category))
      ])
    }
  },
  {
    accessorKey: 'latest_price',
    header: 'Harga Terkini',
    cell: ({ row }: any) => {
      return h('div', { class: 'min-w-[120px]' }, [
        h('div', {
          class: 'font-bold text-emerald-600 dark:text-emerald-400 text-base'
        }, formatCurrency(row.original.latest_price || 0)),
        h('div', {
          class: 'text-xs text-gray-500 dark:text-gray-400'
        }, `per ${row.original.satuan}`)
      ])
    }
  },
  {
    accessorKey: 'price_change',
    header: 'Perubahan',
    cell: ({ row }: any) => {
      const change = row.original.price_change || 0
      const changePercent = row.original.price_change_percent || 0
      
      if (change === 0) {
        return h('div', { class: 'min-w-[100px] text-gray-500' }, '-')
      }
      
      const isPositive = change > 0
      const color = isPositive ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
      const icon = isPositive ? 'i-lucide-trending-up' : 'i-lucide-trending-down'
      
      return h('div', { class: `min-w-[100px] ${color}` }, [
        h('div', { class: 'flex items-center gap-1' }, [
          h(UIcon, { name: icon, class: 'w-4 h-4' }),
          h('span', { class: 'font-medium' }, `${Math.abs(changePercent).toFixed(1)}%`)
        ]),
        h('div', { class: 'text-xs opacity-75' }, 
          `${isPositive ? '+' : ''}${formatCurrency(change)}`
        )
      ])
    }
  },
  {
    accessorKey: 'latest_price_date',
    header: 'Tanggal Update',
    cell: ({ row }: any) => {
      return h('div', { class: 'min-w-[120px] text-sm text-gray-600 dark:text-gray-400' }, 
        formatDate(row.original.latest_price_date)
      )
    }
  },
  {
    accessorKey: 'actions',
    header: 'Aksi',
    cell: ({ row }: any) => {
      return h('div', { class: 'flex items-center gap-2 min-w-[100px]' }, [
        h(UButton, {
          color: 'primary',
          variant: 'soft',
          size: 'xs',
          icon: 'i-lucide-eye',
          onClick: () => router.push(`/food-prices/${row.original.slug}`)
        }, () => 'Detail')
      ])
    }
  }
]

// Sort options
const sortOptions = [
  { label: 'Terbaru', value: 'updated', column: 'updated_at', ascending: false },
  { label: 'Nama (A-Z)', value: 'name', column: 'name', ascending: true },
  { label: 'Harga Terendah', value: 'price-asc', column: 'price', ascending: true },
  { label: 'Harga Tertinggi', value: 'price-desc', column: 'price', ascending: false },
]

// Handlers
const handleCategoryChange = (category: string) => {
  selectedCategory.value = category
}

const handleSortChange = (sort: string) => {
  currentSort.value = sort as any
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Initial fetch
onMounted(() => {
  fetchFoods()
})

// SEO
useSeoOptimized('food-prices')
useHead({
  title: 'Daftar Harga Pangan DIY - JuruTani',
  meta: [
    { name: 'description', content: 'Informasi harga komoditas pertanian terkini dari produsen lokal di Daerah Istimewa Yogyakarta. Data transparan untuk keputusan bisnis yang lebih baik.' }
  ]
})
</script>

<template>
  <main class="food-prices-page container mx-auto px-4 py-12">
    <!-- Hero Section -->
    <header class="mx-auto mb-12 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-linear-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-lucide-bar-chart-2" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Informasi Harga Terkini</span>
      </div>
      
      <h1 class="text-3xl md:text-4xl lg:text-5xl py-1 font-bold mb-6 bg-linear-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Daftar Harga Pangan DIY
      </h1>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
        Pantau harga komoditas pertanian terkini dari wilayah 
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">Daerah Istimewa Yogyakarta</span>.
        Informasi harga transparan untuk 
        <span class="font-semibold text-teal-600 dark:text-teal-400">keputusan bisnis yang lebih baik</span>.
      </p>

      <!-- Category Filter -->
      <nav aria-label="Filter kategori pangan">
        <AppCategoryFilter 
          :categories="Enum.FoodPriceCategories" 
          :current-category="selectedCategory"
          :show-all-option="false"
          @update:category="handleCategoryChange"
        />
      </nav>
    </header>
    
    <!-- Filter & Sort Bar -->
    <aside class="flex flex-col gap-4 mb-8" aria-label="Filter dan pencarian harga pangan">
      <!-- Search Bar -->
      <AppSearchBar 
        v-model="searchQuery"
        placeholder="Cari komoditas..."
        @search="() => currentPage = 1"
      />
      
      <!-- Sort and Results Row -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <!-- Sort Dropdown -->
        <AppSortDropdown 
          :sort-options="sortOptions"
          :current-sort="currentSort"
          @update:sort="handleSortChange"
        />
        
        <!-- Results Count -->
        <div v-if="!loading && sortedData.length > 0" class="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ paginatedData.length }}</span> dari <span class="font-semibold">{{ sortedData.length }}</span> produk
        </div>
      </div>
    </aside>
    
    <!-- Info Badge -->
    <div v-if="!loading" class="flex items-center justify-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
      <UIcon name="i-lucide-clock" class="w-4 h-4" />
      Data diperbarui secara berkala
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 dark:border-emerald-800 dark:border-t-emerald-400"/>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat data harga pangan...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <UIcon name="i-lucide-alert-circle" class="w-16 h-16 mx-auto text-red-400 mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Gagal memuat data
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Terjadi kesalahan saat mengambil data. Silakan coba lagi.
      </p>
      <UButton 
        color="primary" 
        @click="fetchFoods"
      >
        Coba Lagi
      </UButton>
    </div>

    <!-- Data Table -->
    <section v-else aria-labelledby="price-table-heading">
      <h2 id="price-table-heading" class="sr-only">Tabel Harga Komoditas Pangan</h2>
      
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div v-if="paginatedData.length > 0" class="overflow-x-auto">
          <UTable
            :data="paginatedData"
            :columns="columns"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <UIcon name="i-lucide-search-x" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Tidak ada data ditemukan
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Coba ubah filter atau kata kunci pencarian
          </p>
          <UButton 
            color="primary" 
            variant="soft"
            @click="() => { selectedCategory = 'all'; searchQuery = '' }"
          >
            Reset Filter
          </UButton>
        </div>
      </div>
    </section>

    <!-- Pagination -->
    <nav v-if="!loading && totalPages > 1" aria-label="Navigasi halaman harga pangan" class="mt-8">
      <AppPagination 
        :current-page="currentPage" 
        :total-pages="totalPages"
        :total-items="sortedData.length"
        :page-size="itemsPerPage"
        :show-page-info="true"
        :show-first-last="true"
        @update:page="handlePageChange"
      />
    </nav>

    <!-- Info Footer -->
    <aside class="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl" aria-label="Catatan penting">
      <div class="flex items-start gap-3">
        <UIcon name="i-lucide-info" class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div class="text-sm text-amber-800 dark:text-amber-200">
          <p class="font-semibold mb-1">Catatan Penting:</p>
          <ul class="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-300">
            <li>Harga yang tertera merupakan harga rata-rata pasar dan dapat berubah sewaktu-waktu</li>
            <li>Data harga bersumber dari <a href="https://dpkp.jogjaprov.go.id/harga-pangan/list" target="_blank" rel="noopener noreferrer" class="font-medium underline hover:text-amber-900 dark:hover:text-amber-100">Dinas Pertanian dan Ketahanan Pangan DIY</a> dan pasar lokal</li>
            <li>Untuk informasi lebih detail, silakan hubungi dinas terkait</li>
          </ul>
        </div>
      </div>
    </aside>
  </main>
</template>

<style scoped>
/* Smooth transitions */
.food-prices-page {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
