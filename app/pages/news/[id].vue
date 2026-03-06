<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useContentDetail } from '~/composables/useContentDetail'
import { useSupabase } from '~/composables/useSupabase'
import type { NewsItem } from '~/types'

definePageMeta({
  layout: 'default',
})

const { supabase } = useSupabase()

// Use content detail composable
const {
  item: news,
  loading,
  error,
  similarItems: similarNews,
  loadingSimilar,
  slug,
  isLoading,
  hasError,
  hasData,
  fetchItem,
  goBack
} = useContentDetail<NewsItem>({
  tableName: 'news',
  statusField: 'status_news',
  statusValue: 'approved',
  categoryField: 'category',
  similarLimit: 4
})

// Computed
const imageUrl = computed(() => {
  if (!news.value?.image_url) return null
  
  if (news.value.image_url.startsWith('http')) {
    return news.value.image_url
  }
  
  const { data } = supabase.storage
    .from('news-images')
    .getPublicUrl(news.value.image_url)
  
  return data.publicUrl
})

const attachmentUrl = computed(() => {
  if (!news.value?.attachment_url) return null
  
  if (news.value.attachment_url.startsWith('http')) {
    return news.value.attachment_url
  }
  
  const { data } = supabase.storage
    .from('news-attachments')
    .getPublicUrl(news.value.attachment_url)
  
  return data.publicUrl
})

const attachmentFileName = computed(() => {
  if (!news.value?.attachment_url) return ''
  return news.value.attachment_url.split('/').pop() || 'Lampiran'
})

const attachmentFileType = computed(() => {
  if (!news.value?.attachment_url) return 'FILE'
  const fileName = attachmentFileName.value
  const extension = fileName.split('.').pop()
  return extension?.toUpperCase() || 'FILE'
})

const similarNewsFormatted = computed(() => {
  return similarNews.value.map(item => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    content: item.content,
    image_url: item.image_url,
    category: item.category || 'Lainnya',
    created_at: item.created_at,
    author: item.author
  }))
})

// Methods
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatCategory = (category?: string): string => {
  if (!category) return 'Lainnya'
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const handleGoBack = (): void => {
  goBack('/update')
}

const openAttachment = (): void => {
  if (attachmentUrl.value) {
    window.open(attachmentUrl.value, '_blank', 'noopener,noreferrer')
  }
}

const openLink = (): void => {
  if (news.value?.link) {
    window.open(news.value.link, '_blank', 'noopener,noreferrer')
  }
}

// SEO
const seoTitle = computed(() => news.value ? `${news.value.title}` : 'Memuat Berita...')
const seoDescription = computed(() => news.value ? (news.value.sub_title || (news.value.content ? news.value.content.slice(0, 160) : '')) : 'Berita terkini seputar pertanian dari JuruTani.')
const seoImage = computed(() => imageUrl.value || '/jurutani.png')
const seoKeywords = computed(() => news.value ? [
  'berita pertanian',
  news.value.category?.toLowerCase() || 'berita',
  'inovasi tani',
  'kabar tani'
] : [])

// Share URL
const shareUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/update/${slug.value}`
  }
  return `https://jurutani.com/update/${slug.value}`
})

// Lifecycle
onMounted(() => {
  fetchItem()
})

// Update SEO after news is loaded
watch(() => news.value, (newVal) => {
  if (newVal) {
    useSeoDetail({
      title: seoTitle.value,
      description: seoDescription.value,
      keywords: seoKeywords.value,
      image: seoImage.value,
      url: shareUrl.value,
      type: 'article'
    })
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen py-6">
    
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div>
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <UButton
              color="success"
              variant="ghost"
              icon="i-lucide-arrow-left"
              @click="handleGoBack"
            >
              Kembali ke Berita
            </UButton>
            
            <div class="flex items-center gap-2 text-green-700 dark:text-green-400">
              <UIcon name="i-lucide-newspaper" class="w-5 h-5" />
              <span class="font-semibold">JuruTani News</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
        <p class="text-gray-600 dark:text-gray-400 mt-4">Memuat berita...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="hasError" class="text-center py-20">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md mx-auto">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Oops! Terjadi Kesalahan</h3>
          <p class="text-red-600 dark:text-red-300 mb-4">{{ error }}</p>
          <UButton color="error" variant="outline" @click="handleGoBack">
            Kembali ke Daftar Berita
          </UButton>
        </div>
      </div>

      <!-- News Content -->
      <article v-else-if="hasData" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Hero Image -->
        <div class="relative h-64 md:h-80 bg-linear-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="news.title"
            class="w-full h-full object-cover"
            @error="console.log('Image failed to load:', imageUrl)"
          />
          <div v-else class="flex items-center justify-center h-full">
            <div class="text-center text-green-600 dark:text-green-400">
              <UIcon name="i-heroicons-photo" class="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p class="text-sm opacity-75">Tidak ada gambar</p>
            </div>
          </div>

          <!-- Category Badge -->
          <div class="absolute top-4 right-4">
            <span class="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full shadow-sm">
              <UIcon name="i-heroicons-tag" class="w-3 h-3" />
              {{ formatCategory(news.category) }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 md:p-8">
          <!-- Title -->
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
            {{ news.title }}
          </h1>

          <!-- Subtitle -->
          <h2 v-if="news.sub_title" class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {{ news.sub_title }}
          </h2>

          <!-- Meta Information -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-user" class="w-4 h-4" />
              <span>{{ news.author || 'Tim JuruTani' }}</span>
            </div>
            
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
              <span>{{ formatDate(news.published_at || news.created_at) }}</span>
            </div>
            
            <div v-if="news.updated_at && news.updated_at !== news.created_at" class="flex items-center gap-1">
              <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
              <span>Diperbarui {{ formatDate(news.updated_at) }}</span>
            </div>
            
            <!-- Share Button -->
            <div class="ml-auto">
              <AppShareButton
                :title="news.title"
                :description="news.sub_title || news.content.substring(0, 160)"
                :url="shareUrl"
                button-text="Bagikan"
                button-variant="outline"
              />
            </div>
          </div>

          <!-- Main Content -->
          <div 
            class="prose prose-lg max-w-none prose-green prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 hover:prose-a:text-green-700 dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-a:text-green-400"
            v-html="news.content"
          />

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <!-- External Link -->
            <UButton
              v-if="news.link"
              color="success"
              variant="outline"
              icon="i-heroicons-link"
              class="flex-1 sm:flex-none"
              @click="openLink"
            >
              Baca Selengkapnya
            </UButton>

            <!-- Attachment -->
            <UButton
              v-if="attachmentUrl"
              color="success" 
              variant="outline"
              icon="i-heroicons-paper-clip"
              class="flex-1 sm:flex-none"
              @click="openAttachment"
            >
              Unduh {{ attachmentFileType }}
            </UButton>
          </div>

          <!-- Attachment Info -->
          <div v-if="attachmentUrl" class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                <span class="text-blue-600 dark:text-blue-400 text-xs font-bold">
                  {{ attachmentFileType }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-blue-900 dark:text-blue-200 truncate">
                  {{ attachmentFileName }}
                </p>
                <p class="text-xs text-blue-600 dark:text-blue-400">
                  Klik tombol untuk mengunduh lampiran
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Similar News Section -->
      <section v-if="hasData" class="mt-12">
        <div class="container mx-auto px-4 mb-8">
          <div class="flex items-center gap-3">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Berita Serupa
            </h2>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            Kategori: <span class="font-semibold text-green-600 dark:text-green-400">{{ formatCategory(news.category) }}</span>
            <br />
            Berikut adalah berita serupa pilihan JuruTani. Kami menampilkan artikel terkait untuk membantu Anda menemukan informasi yang relevan dan terbaru.
          </p>
        </div>

        <!-- Loading State -->
        <LoadingData v-if="loadingSimilar" />

        <!-- Similar News Grid -->
        <div v-else-if="similarNews.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <NewsCardContent 
              v-for="item in similarNewsFormatted"
              :key="item.id"
              :news="item"
              variant="default"
            />
          </div>

          <!-- Button placed outside the grid so it won't become a grid item -->
          <div class="mt-8 flex justify-center">
            <NuxtLink
              to="/update"
              class="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold bg-linear-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
            >
              <span>Lihat Semua Berita</span>
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4 transition-transform" />
            </NuxtLink>
          </div>
        </div>

      
        <!-- No Similar News -->
        <NotFoundData v-else />
      </section>
    </div>
  </div>
</template>

<style scoped>
.prose {
  line-height: 1.75;
}

.prose p {
  margin-bottom: 1.25rem;
}

.prose h1, .prose h2, .prose h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.prose h1 {
  font-size: 1.875rem;
}

.prose h2 {
  font-size: 1.5rem;
}

.prose h3 {
  font-size: 1.25rem;
}

.prose ul, .prose ol {
  margin: 1.25rem 0;
  padding-left: 1.75rem;
}

.prose li {
  margin: 0.75rem 0;
}

.prose blockquote {
  margin: 1.5rem 0;
  padding-left: 1rem;
  border-left: 4px solid #10b981;
  font-style: italic;
  color: #6b7280;
}

.dark .prose blockquote {
  color: #9ca3af;
  border-left-color: #34d399;
}
</style>