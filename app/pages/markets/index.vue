<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useContentList } from '~/composables/useContentList'
import { useAsyncData } from '#app'
import { useSupabase } from '~/composables/useSupabase'
import type { ProductMarket, Category } from '~/types'

definePageMeta({
  layout: 'default',
})

// SEO Optimization
useSeoOptimized('markets')

const { supabase } = useSupabase()

// Use content list composable
const {
  items: marketsList,
  loading,
  error,
  currentPage,
  totalPages,
  totalItems,
  filters,
  isLoading,
  hasError,
  hasData,
  showPagination,
  sortOptions,
  currentSort,
  fetchItems,
  handleCategoryChange,
  handleSearchChange,
  handleSortChange,
  handlePageChange
} = useContentList<ProductMarket>({
  tableName: 'product_markets',
  pageSize: 12,
  statusField: 'status',
  statusValue: 'approved',
  categoryField: 'category',
  defaultSort: {
    column: 'created_at',
    ascending: false
  }
})

// Categories
const categories = ref<Category[]>([])

// Fetch categories
const { data: categoriesData } = await useAsyncData('market-categories', async () => {
  try {
    const { data, error: catError } = await supabase
      .from('category_markets')
      .select('name')
      .order('name', { ascending: true })

    if (catError) throw catError

    return data as Category[]
  } catch (err) {
    console.error('Error fetching categories:', err)
    return []
  }
})

// Set categories
if (categoriesData.value) {
  categories.value = categoriesData.value.map(cat => ({
    name: cat.name,
    value: cat.name
  }))
}

// Bento grid pattern - determines which cards should be large
const getBentoVariant = (index: number): 'default' | 'large' | 'wide' | 'tall' => {
  // Pattern: large card every 8 items, wide card every 6 items
  if (index % 8 === 0) return 'large'
  if (index % 6 === 0) return 'wide'
  if (index % 13 === 0) return 'tall'
  return 'default'
}

// Initial fetch
onMounted(() => {
  fetchItems()
})
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
        v-model="filters.search"
        placeholder="Cari produk, kategori, atau penjual..."
        @search="handleSearchChange"
      />

      <!-- Sort and Results Row -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <!-- Sort Dropdown -->
        <AppSortDropdown
          :sort-options="sortOptions"
          :current-sort="filters.sort"
          @update:sort="handleSortChange"
        />

        <!-- Results Count -->
        <div v-if="!isLoading && hasData" class="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan <span class="font-semibold text-green-600 dark:text-green-400">{{ marketsList.length }}</span> dari <span class="font-semibold">{{ totalItems }}</span> produk
        </div>
      </div>
    </div>

    <!-- Markets Content with Bento Grid -->
    <div class="mt-8">
      <LoadingData v-if="isLoading" />
      <ErrorData v-else-if="hasError" :error="error" />
      <NotFoundData v-else-if="!hasData" />

      <!-- Bento Grid Layout -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
        <MarketsProductMarketCard
          v-for="(product, index) in marketsList"
          :key="product.id"
          :product="product"
          :variant="getBentoVariant(index)"
        />
      </div>
    </div>

    <!-- Pagination -->
    <AppPagination
      v-if="showPagination"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :page-size="12"
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