<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useContentList } from '~/composables/useContentList'
import { useAsyncData } from '#app'
 

// Types
interface Course {
  id: string
  category: string
  created_at: string
  title: string
  description: string
  image_url?: string
  instructor?: string
  files?: any
  link_drive?: string
  link_youtube?: string
}

interface Category {
  id?: string
  name: string
  value?: string
}

const supabase = useSupabaseClient()

// Use content list composable
const {
  items: courseList,
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
} = useContentList<Course>({
  tableName: 'courses',
  pageSize: 9,
  categoryField: 'category',
  defaultSort: {
    column: 'created_at',
    ascending: false
  }
})

// Categories
const categories = ref<Category[]>([])

// Fetch categories
const { data: categoriesData } = await useAsyncData('course-categories', async () => {
  try {
    const { data, error: catError } = await supabase
      .from('category')
      .select('name')
      .order('name', { ascending: true })

    if (catError) throw catError
    
    return data as Category[]
  } catch (err) {
    console.error('Error fetching course categories:', err)
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
  // Pattern: large card every 7 items, wide card every 5 items
  if (index % 7 === 0) return 'large'
  if (index % 5 === 0) return 'wide'
  if (index % 11 === 0) return 'tall'
  return 'default'
}

// Initial fetch
onMounted(() => {
  fetchItems()
})
</script>

<template>
  <div class="course-page container mx-auto py-12 px-4">
    <!-- Course Section Header -->
    <div class="mx-auto mb-8 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-linear-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-book-open" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Panduan Lengkap & Terstruktur</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Materi Edukasi JuruTani
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
        Jelajahi koleksi lengkap materi edukasi dengan 
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">panduan praktis</span>,
        <span class="font-semibold text-teal-600 dark:text-teal-400">teknik berkelanjutan</span>, dan
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">strategi produktivitas</span> untuk mengoptimalkan usaha tani Anda.
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
        placeholder="Cari materi pembelajaran, panduan, atau topik edukasi..."
        :debounce="300"
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
          Menampilkan <span class="font-semibold text-green-600 dark:text-green-400">{{ courseList.length }}</span> dari <span class="font-semibold">{{ totalItems }}</span> materi
        </div>
      </div>
    </div>
    
    <!-- Course Content with Bento Grid -->
    <div class="mt-8">
      <LoadingData v-if="isLoading" />      
      <ErrorData v-else-if="hasError" :error="error" />
      <NotFoundData v-else-if="!hasData" />
      
      <!-- Bento Grid Layout -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
        <MaterialCardContent 
          v-for="(course, index) in courseList" 
          :key="course.id" 
          :course="course"
          :variant="getBentoVariant(index)"
          :index="index"
        />
      </div>
    </div>
    
    <!-- Pagination -->
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
  </div>
</template>

<style scoped>
.course-page {
  min-height: calc(100vh - 200px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .course-page {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>