<script setup lang="ts">
import type { NewsUpdated } from '~/types/news'
import type { Category } from '~/types'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Berita Terbaru',
  description: 'Berita dan artikel terbaru tentang pertanian dan agrikultur'
})

const { supabase } = useSupabase()

// Use content list composable
const {
  items: newsList,
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
  fetchItems,
  handleCategoryChange,
  handleSearchChange,
  handleSortChange,
  handlePageChange
} = useContentList<NewsUpdated>({
  tableName: 'news_updated',
  pageSize: 9,
  statusField: 'status_news',
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
const { data: categoriesData } = await useAsyncData('news-updated-categories', async () => {
  try {
    const { data, error: catError } = await supabase
      .from('category_news')
      .select('name')
      .order('name', { ascending: true })

    if (catError) throw catError
    return data as Category[]
  } catch (err) {
    console.error('Error fetching categories:', err)
    return []
  }
})

if (categoriesData.value) {
  categories.value = categoriesData.value.map(cat => ({
    name: cat.name,
    value: cat.name
  }))
}

// Bento grid pattern
const getBentoVariant = (index: number): 'default' | 'large' | 'wide' => {
  if (index % 7 === 0) return 'large'
  if (index % 5 === 0) return 'wide'
  return 'default'
}

// Initial fetch
onMounted(() => {
  fetchItems()
})
</script>

<template>
  <main class="update-page container mx-auto px-4 py-12">
    <!-- Page Header -->
    <header class="mx-auto mb-8 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-linear-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-newspaper" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Berita Terbaru JuruTani</span>
      </div>

      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Berita & Artikel Pertanian
      </h1>

      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
        Dapatkan informasi terkini seputar dunia pertanian, teknologi, dan inovasi dengan
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">berita terpercaya</span>,
        <span class="font-semibold text-teal-600 dark:text-teal-400">update teknologi</span>, dan
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">prestasi petani</span> yang menginspirasi.
      </p>

      <!-- Category Filter -->
      <nav aria-label="Filter kategori berita terbaru">
        <AppCategoryFilter
          :categories="categories"
          :current-category="filters.category"
          :show-all-option="true"
          all-option-text="Semua"
          all-option-value="all"
          @update:category="handleCategoryChange"
        />
      </nav>
    </header>

    <!-- Filter & Sort Bar -->
    <aside class="flex flex-col gap-4 mb-8" aria-label="Filter dan pencarian berita">
      <!-- Search Bar - Full width on all screens -->
      <AppSearchBar
        v-model="filters.search"
        placeholder="Cari berita, artikel, atau topik pertanian..."
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
          Menampilkan <span class="font-semibold text-green-600 dark:text-green-400">{{ newsList.length }}</span> dari <span class="font-semibold">{{ totalItems }}</span> berita
        </div>
      </div>
    </aside>

    <!-- News Content -->
    <section aria-labelledby="news-updated-list-heading" class="mt-8">
      <h2 id="news-updated-list-heading" class="sr-only">Daftar Berita Terbaru Pertanian</h2>

      <LoadingData v-if="isLoading" />
      <ErrorData v-else-if="hasError" :error="error" />
      <NotFoundData v-else-if="!hasData" />

      <!-- Grid Layout -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
        <NewsUpdatedCard
          v-for="(news, index) in newsList"
          :key="news.id"
          :news="news"
          :variant="getBentoVariant(index)"
        />
      </div>
    </section>

    <!-- Pagination -->
    <nav aria-label="Navigasi halaman berita terbaru">
      <AppPagination
        v-if="showPagination"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :page-size="9"
        :show-page-info="true"
        :show-first-last="true"
        @update:page="handlePageChange"
      />
    </nav>

    <CreateButton />
  </main>
</template>