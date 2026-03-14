<script setup lang="ts">
import { onMounted, computed, watch, ref } from 'vue'
import { useContentDetail } from '~/composables/useContentDetail'
 
import type { Video } from '~/types'

definePageMeta({
  layout: 'default',
})

const supabase = useSupabaseClient()

// Use content detail composable
const {
  item: video,
  loading,
  error,
  similarItems: relatedVideos,
  loadingSimilar,
  slug,
  isLoading,
  hasError,
  hasData,
  fetchItem,
  goBack
} = useContentDetail<Video>({
  tableName: 'videos',
  categoryField: 'category',
  similarLimit: 6
})

// Extract YouTube video ID
const youtubeVideoId = computed(() => {
  if (!video.value?.link_yt) return null
  
  try {
    const url = new URL(video.value.link_yt)
    if (url.hostname.includes('youtube.com')) {
      return url.searchParams.get('v')
    } else if (url.hostname.includes('youtu.be')) {
      return url.pathname.slice(1)
    }
  } catch (e) {
    console.error('Invalid YouTube URL:', e)
  }
  
  return null
})

const youtubeEmbedUrl = computed(() => {
  if (!youtubeVideoId.value) return null
  return `https://www.youtube.com/embed/${youtubeVideoId.value}?rel=0&modestbranding=1`
})

// Methods
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  }).format(date)
}

const formatCategory = (category?: string): string => {
  if (!category) return 'Video'
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const handleGoBack = (): void => {
  goBack('/videos')
}

// SEO
const seoTitle = computed(() => video.value ? `${video.value.title}` : 'Memuat Video...')
const seoDescription = computed(() => video.value ? (video.value.description || `Tonton ${video.value.title} - Video edukasi pertanian dari JuruTani`) : 'Video edukasi pertanian dari JuruTani.')
const seoImage = computed(() => video.value?.thumbnail || '/video.png')
const seoKeywords = computed(() => video.value ? [
  'video pertanian',
  'tutorial pertanian',
  video.value.category?.toLowerCase() || 'edukasi',
  'pembelajaran visual'
] : [])

// Share URL
const shareUrl = computed(() => {
  if (typeof window !== 'undefined') {
    const path = video.value?.slug ? `/videos/${video.value.slug}` : `/videos/${video.value?.id}`
    return `${window.location.origin}${path}`
  }
  return `https://jurutani.com/videos/${slug.value || video.value?.id}`
})

// Lifecycle
onMounted(() => {
  fetchItem()
})

// Update SEO
watch(() => video.value, (newVal) => {
  if (newVal) {
    useSeoDetail({
      title: seoTitle.value,
      description: seoDescription.value,
      keywords: seoKeywords.value,
      image: seoImage.value,
      url: shareUrl.value,
      type: 'video.other'
    })
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen py-6">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <UButton
            color="success"
            variant="ghost"
            icon="i-lucide-arrow-left"
            @click="handleGoBack"
          >
            Kembali ke Edukasi
          </UButton>
          
          <div class="flex items-center gap-2 text-green-700 dark:text-green-400">
            <UIcon name="i-heroicons-video-camera" class="w-5 h-5" />
            <span class="font-semibold">Video Edukasi</span>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <LoadingData v-if="isLoading" />
      
      <!-- Error State -->
      <ErrorData v-else-if="hasError" :error="error" />
      
      
      <!-- Video Detail Content -->
      <div v-else-if="hasData">
        <!-- Breadcrumb -->
        <nav class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <NuxtLink to="/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Beranda
          </NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          <NuxtLink to="/videos" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Video Edukasi
          </NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          <span class="text-gray-900 dark:text-white font-medium">{{ video.title }}</span>
        </nav>
        <!-- Main Content Area -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Video Player & Info -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Video Player -->
            <div v-if="youtubeEmbedUrl" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div class="relative aspect-video bg-gray-900">
                <iframe
                  :src="youtubeEmbedUrl"
                  class="absolute inset-0 w-full h-full"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                />
              </div>
            </div>

            <!-- Video Info Card -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8">
              <!-- Title & Meta -->
              <div class="mb-6">
                <div class="flex flex-wrap items-center gap-2 mb-4">
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
                    <UIcon name="i-heroicons-video-camera" class="w-3 h-3" />
                    {{ formatCategory(video.category) }}
                  </span>
                  
                  <span v-if="video.duration" class="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full">
                    <UIcon name="i-heroicons-clock" class="w-3 h-3" />
                    {{ video.duration }}
                  </span>
                </div>

                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {{ video.title }}
                </h1>

                <!-- Meta Info -->
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-1">
                    <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                    <span>{{ formatDate(video.created_at) }}</span>
                  </div>

                  <!-- Share Button -->
                  <div class="ml-auto">
                    <AppShareButton
                      :title="video.title"
                      :description="video.description || `Tonton ${video.title}`"
                      :url="shareUrl"
                      button-text="Bagikan"
                      button-variant="outline"
                    />
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div v-if="video.description">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-green-600" />
                  Deskripsi Video
                </h2>
                
                <div class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {{ video.description }}
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Related Videos Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-8">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <UIcon name="i-heroicons-play-circle" class="w-5 h-5 text-green-600" />
                Video Terkait
              </h3>
              
              <!-- Loading State -->
              <div v-if="loadingSimilar" class="space-y-4">
                <div v-for="i in 3" :key="i" class="animate-pulse">
                  <div class="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>

              <!-- Related Videos List -->
              <div v-else-if="relatedVideos.length > 0" class="space-y-4">
                <NuxtLink
                  v-for="item in relatedVideos"
                  :key="item.id"
                  :to="item.slug ? `/videos/${item.slug}` : `/videos/${item.id}`"
                  class="group block hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 transition-colors"
                >
                  <!-- Thumbnail -->
                  <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-2">
                    <img
                      v-if="item.thumbnail || item.url"
                      :src="item.thumbnail || `/video.png`"
                      :alt="item.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <!-- Play Overlay -->
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <UIcon name="i-heroicons-play" class="w-5 h-5 text-white ml-0.5" />
                      </div>
                    </div>

                    <!-- Duration -->
                    <div v-if="item.duration" class="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs rounded">
                      {{ item.duration }}
                    </div>
                  </div>

                  <!-- Title -->
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {{ item.title }}
                  </h4>
                </NuxtLink>
              </div>

              <!-- No Related Videos -->
              <div v-else class="text-center py-8">
                <UIcon name="i-heroicons-video-camera-slash" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p class="text-sm text-gray-500 dark:text-gray-400">Tidak ada video terkait</p>
              </div>
            </div>
          </div>
        </div>

        <!-- More Related Videos Section (Bottom) -->
        <section v-if="relatedVideos.length > 3" class="mt-12">
            <div class="mb-8 flex items-center gap-2 text-green-700 dark:text-green-400">
            <UIcon name="i-heroicons-video-camera" class="w-5 h-5" />
              Lebih Banyak Video {{ formatCategory(video.category) }}
            </div>

          <!-- Videos Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VideoCardContent 
              v-for="item in relatedVideos.slice(3)"
              :key="item.id"
              :video="(item as any)"
              variant="default"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
