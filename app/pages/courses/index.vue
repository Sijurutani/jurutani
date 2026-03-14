<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
 
import { useAsyncData } from '#app'

definePageMeta({
  layout: 'default',
})

// SEO Optimization
useSeoOptimized('courses')

// Types
interface Announcement {
  id: string
  category: string
  created_at: string
  deleted_at?: string
  archived_at?: string
  title?: string
  content?: string
  image_url?: string
  attachments?: string
  organization?: string
  link?: string
  author_id?: string
  fullImageUrl?: string
  fullAttachmentUrls?: AttachmentFile[]
}

interface AttachmentFile {
  name: string  // Changed from 'filename' to 'name'
  url: string
  size?: number
  type?: string
}

interface Category {
  id?: string
  name: string
  value?: string
  icon?: string
  color?: string
}

// Supabase client
const supabase = useSupabaseClient()

// Data utama
const announcements = ref<Announcement[]>([])
const error = ref<string | null>(null)
const loading = ref(true)

// Filter & pagination
const currentCategory = ref('all')
const currentPage = ref(1)
const pageSize = 9 // Changed to 9 for better 3-column layout
const totalPages = ref(1)
const totalItems = ref(0)
const categories = ref<Category[]>([])

// Enhanced categories with icons and colors
const { data: categoriesData } = await useAsyncData('meeting-categories', async () => {
  try {
    const enhancedCategories = [
      { 
        name: 'online', 
        value: 'online',
        icon: 'i-heroicons-computer-desktop',
        color: 'text-blue-600'
      },
      { 
        name: 'offline', 
        value: 'offline',
        icon: 'i-heroicons-map-pin',
        color: 'text-emerald-600'
      }
    ]
    
    return enhancedCategories as Category[]
  } catch (err) {
    console.error('Error fetching meeting categories:', err)
    return []
  }
})

// Set categories setelah data dimuat
if (categoriesData.value) {
  categories.value = categoriesData.value
}

// Fungsi untuk parse attachments JSON string - Updated to handle new format
const parseAttachments = (attachmentsString?: string): AttachmentFile[] => {
  if (!attachmentsString) return []
  try {
    const parsed = JSON.parse(attachmentsString)
    if (Array.isArray(parsed)) {
      // Handle new format with url, name, size, type
      return parsed.map(attachment => ({
        name: attachment.name || attachment.filename || 'Unknown file',
        url: attachment.url,
        size: attachment.size,
        type: attachment.type
      }))
    }
    return []
  } catch (err) {
    console.error('Error parsing attachments:', err)
    return []
  }
}

// Fungsi fetch data yang dioptimasi
const fetchAnnouncements = async () => {
  loading.value = true
  error.value = null

  try {
    const baseQuery = supabase
      .from('meetings')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .is('archived_at', null)

    const query = currentCategory.value !== 'all' && currentCategory.value !== 'semua'
      ? baseQuery.eq('category', currentCategory.value)
      : baseQuery

    const { data, error: fetchError, count } = await query
      .order('created_at', { ascending: false })
      .range(
        (currentPage.value - 1) * pageSize,
        currentPage.value * pageSize - 1
      )

    if (fetchError) throw fetchError

    const processedData = (data as Announcement[] || []).map(item => {
      const attachmentsList = parseAttachments(item.attachments)
      
      return {
        ...item,
        fullImageUrl: item.image_url, // Use direct URL from database
        fullAttachmentUrls: attachmentsList // Direct use of parsed attachments
      }
    })

    announcements.value = processedData
    totalItems.value = count || 0
    totalPages.value = Math.ceil(totalItems.value / pageSize)
  } catch (err: any) {
    error.value = err.message || 'Terjadi kesalahan saat memuat data meeting'
    console.error('Error fetching meetings:', err)
  } finally {
    loading.value = false
  }
}

// Initial data fetch - remove SSR for now to avoid double loading
const { refresh } = await useAsyncData('meetings', fetchAnnouncements, {
  server: false // Client-side only untuk menghindari double loading
})

// Watch untuk perubahan category dan page
watchEffect(async () => {
  if (import.meta.client) {
    await fetchAnnouncements()
  }
})

// Computed untuk status
const isLoading = computed(() => loading.value)
const hasError = computed(() => !!error.value)
const hasData = computed(() => announcements.value.length > 0)
const showPagination = computed(() => !isLoading.value && hasData.value && totalPages.value > 1)

// Statistics
const totalOnline = computed(() => announcements.value.filter(item => item.category === 'online').length)
const totalOffline = computed(() => announcements.value.filter(item => item.category === 'offline').length)

// Handler untuk category change
const handleCategoryChange = (category: string) => {
  currentCategory.value = category
  currentPage.value = 1
}

// Handler untuk pagination change
const handlePageChange = (page: number) => {
  currentPage.value = page
}
</script>

<template>
  <main class="announcement-page container mx-auto px-4 py-12">
    <!-- Header Section -->
    <header class="mx-auto mb-6 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-linear-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-users" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Pengembangan Kemampuan Pertanian</span>
      </div>
      
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent py-2">
        Pengumuman Course & Pelatihan
      </h1>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Temukan berbagai kesempatan untuk mengembangkan kemampuan pertanian melalui
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">kursus bersertifikat</span>,
        <span class="font-semibold text-teal-600 dark:text-teal-400">pelatihan praktis</span>, dan
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">workshop inovatif</span> yang diselenggarakan oleh JuruTani.
      </p> 
    </header>

    <!-- Category Filter -->
    <nav aria-label="Filter kategori kursus">
    <AppCategoryFilter 
      :categories="categories" 
      :current-category="currentCategory"
      :show-all-option="true"
      all-option-text="Semua"
      all-option-value="all"
      @update:category="handleCategoryChange"
      />
    </nav>

    <!-- Announcements Content -->
    <section aria-labelledby="courses-list-heading" class="mt-8">
      <h2 id="courses-list-heading" class="sr-only">Daftar Kursus dan Pelatihan</h2>
      
      <LoadingData v-if="isLoading" />      
      <ErrorData v-else-if="hasError" :error="error" />
      <NotFoundData v-else-if="!hasData" />

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnnouncementCardContent 
          v-for="item in announcements" 
          :key="item.id" 
          :announcement="item" 
        />
      </div>
    </section>

    <!-- Pagination -->
    <nav aria-label="Navigasi halaman kursus">
    <AppPagination 
      v-if="showPagination"
      :current-page="currentPage" 
      :total-pages="totalPages"
      :total-items="totalItems"
      :page-size="pageSize"
      :show-page-info="true"
      :show-first-last="true"
      @update:page="handlePageChange"
      />
    </nav>
  </main>
</template>