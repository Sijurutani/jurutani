<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useContentDetail } from '~/composables/useContentDetail'
 

definePageMeta({
  layout: 'default',
})

interface CourseItem {
  id: string
  slug: string
  title: string
  description?: string
  category?: string
  duration?: string
  instructor?: string
  image_url?: string
  files?: any
  link_drive?: string
  link_youtube?: string
  user_id?: string
  created_at: string
  updated_at?: string
}

interface ParsedFile {
  name: string
  url: string
}

const supabase = useSupabaseClient()

// Use content detail composable
const {
  item: course,
  loading,
  error,
  similarItems: relatedCourses,
  loadingSimilar,
  slug,
  isLoading,
  hasError,
  hasData,
  fetchItem,
  goBack
} = useContentDetail<CourseItem>({
  tableName: 'courses',
  categoryField: 'category',
  similarLimit: 4
})

// Helper function to parse files
const parseFiles = (filesData: any): ParsedFile[] => {
  if (!filesData) return []
  
  try {
    if (Array.isArray(filesData)) {
      return filesData.map((item, index) => {
        if (typeof item === 'string') {
          const urlParts = item.split('/')
          const filename = urlParts[urlParts.length - 1]
          const cleanFilename = filename.split('_').slice(1).join('_') || `Document ${index + 1}`
          
          return {
            name: cleanFilename,
            url: item
          }
        }
        return item
      })
    }
    
    if (typeof filesData === 'string') {
      let parsed = JSON.parse(filesData)
      
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed)
      }
      
      if (Array.isArray(parsed)) {
        return parsed.map((item, index) => {
          if (typeof item === 'string') {
            const urlParts = item.split('/')
            const filename = urlParts[urlParts.length - 1]
            const cleanFilename = filename.split('_').slice(1).join('_') || `Document ${index + 1}`
            
            return {
              name: cleanFilename,
              url: item
            }
          }
          return item
        })
      }
    }
    
    return []
  } catch (error) {
    console.error('Error parsing files:', error)
    return []
  }
}

// Computed
const imageUrl = computed(() => {
  if (!course.value?.image_url) return null
  
  if (course.value.image_url.startsWith('http')) {
    return course.value.image_url
  }
  
  const { data } = supabase.storage
    .from('course-images')
    .getPublicUrl(course.value.image_url)
  
  return data.publicUrl
})

const parsedFiles = computed((): ParsedFile[] => {
  if (!course.value) return []
  return parseFiles(course.value.files)
})

const hasFiles = computed(() => parsedFiles.value && parsedFiles.value.length > 0)
const hasLinks = computed(() => course.value?.link_drive || course.value?.link_youtube)
const hasResources = computed(() => hasFiles.value || hasLinks.value)

// Extract YouTube video ID
const youtubeVideoId = computed(() => {
  if (!course.value?.link_youtube) return null
  
  try {
    const url = new URL(course.value.link_youtube)
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
  if (!category) return 'Pertanian'
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const handleGoBack = (): void => {
  goBack('/educations')
}

const downloadFile = (file: ParsedFile): void => {
  if (file.url) {
    if (file.url.startsWith('http')) {
      window.open(file.url, '_blank', 'noopener,noreferrer')
    } else {
      const { data } = supabase.storage
        .from('courses')
        .getPublicUrl(`files/${course.value?.id}/${file.url}`)
      
      if (data.publicUrl) {
        window.open(data.publicUrl, '_blank', 'noopener,noreferrer')
      }
    }
  }
}

const openDriveLink = (): void => {
  if (course.value?.link_drive) {
    window.open(course.value.link_drive, '_blank', 'noopener,noreferrer')
  }
}

// SEO
const seoTitle = computed(() => course.value ? `${course.value.title}` : 'Memuat Materi...')
const seoDescription = computed(() => course.value ? (course.value.description || `Pelajari ${course.value.title} - Materi edukasi pertanian dari JuruTani`) : 'Materi edukasi pertanian dari JuruTani.')
const seoImage = computed(() => imageUrl.value || '/jurutani.png')
const seoKeywords = computed(() => course.value ? [
  'edukasi pertanian',
  'materi pertanian',
  course.value.category?.toLowerCase() || 'pembelajaran',
  'panduan pertanian'
] : [])

// Share URL
const shareUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/educations/${slug.value}`
  }
  return `https://jurutani.com/educations/${slug.value}`
})

// Lifecycle
onMounted(() => {
  fetchItem()
})

// Update SEO
watch(() => course.value, (newVal) => {
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
    <div class="container mx-auto px-4 py-8 max-w-4xl">
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
            <UIcon name="i-heroicons-academic-cap" class="w-5 h-5" />
            <span class="font-semibold">Edukasi Jurutani</span>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <LoadingData v-if="isLoading" />
      
      <!-- Error State -->
      <ErrorData v-else-if="hasError" :error="error" />
      
      <!-- Breadcrumb -->
      <nav v-if="hasData" class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <NuxtLink to="/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          Beranda
        </NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
        <NuxtLink to="/educations" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          Materi Edukasi
        </NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
        <span class="text-gray-900 dark:text-white font-medium">{{ course.title }}</span>
      </nav>
      
      <!-- Course Detail Content -->
      <article v-else-if="hasData" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Hero Image -->
        <div class="relative h-64 md:h-80 bg-linear-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="course.title"
            class="w-full h-full object-cover"
          >
          <div v-else class="flex items-center justify-center h-full">
            <div class="text-center text-green-600 dark:text-green-400">
              <UIcon name="i-heroicons-book-open" class="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p class="text-sm opacity-75">Tidak ada gambar</p>
            </div>
          </div>

          <!-- Category Badge -->
          <div class="absolute top-4 right-4">
            <span class="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full shadow-sm">
              <UIcon name="i-heroicons-tag" class="w-3 h-3" />
              {{ formatCategory(course.category) }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 md:p-8">
          <!-- Title -->
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
            {{ course.title }}
          </h1>

          <!-- Meta Information -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div v-if="course.instructor" class="flex items-center gap-1">
              <UIcon name="i-heroicons-user" class="w-4 h-4" />
              <span>{{ course.instructor }}</span>
            </div>
            
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
              <span>{{ formatDate(course.created_at) }}</span>
            </div>

            <div v-if="course.duration" class="flex items-center gap-1">
              <UIcon name="i-heroicons-clock" class="w-4 h-4" />
              <span>{{ course.duration }}</span>
            </div>
            
            <!-- Share Button -->
            <div class="ml-auto">
              <AppShareButton
                :title="course.title"
                :description="course.description || `Pelajari ${course.title}`"
                :url="shareUrl"
                button-text="Bagikan"
                button-variant="outline"
              />
            </div>
          </div>

          <!-- Description -->
          <div 
            v-if="course.description"
            class="prose prose-lg max-w-none prose-green prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 hover:prose-a:text-green-700 dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-a:text-green-400 mb-8"
            v-html="course.description"
          />
          
          <div v-else class="text-center py-8 mb-8">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p class="text-gray-500 dark:text-gray-400 font-medium">Deskripsi belum tersedia</p>
          </div>

          <!-- Video Player -->
          <div v-if="youtubeEmbedUrl" class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UIcon name="i-heroicons-play-circle" class="w-5 h-5 text-green-600" />
              Video Pembelajaran
            </h3>
            <div class="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
              <iframe
                :src="youtubeEmbedUrl"
                class="absolute inset-0 w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>
          </div>

          <!-- Resources Section -->
          <div v-if="hasResources" class="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <UIcon name="i-heroicons-folder-open" class="w-5 h-5 text-green-600" />
              Sumber Pembelajaran
            </h3>
            
            <div class="space-y-6">
              <!-- Files Section -->
              <div v-if="hasFiles">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <div class="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center mr-2">
                    <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-green-800 dark:text-green-400" />
                  </div>
                  Materi & Dokumen
                </h4>
                
                <div class="space-y-3">
                  <button
                    v-for="(file, index) in parsedFiles"
                    :key="index"
                    class="flex items-center justify-between w-full p-4 bg-white dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-300 rounded-lg transition-all duration-300 group border border-gray-200 dark:border-gray-600"
                    @click="downloadFile(file)"
                  >
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-green-800 dark:text-green-400" />
                      </div>
                      <span class="font-medium text-left text-sm">{{ file.name || `Dokumen ${index + 1}` }}</span>
                    </div>
                    <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>

              <!-- Links Section -->
              <div v-if="hasLinks">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center mr-2">
                    <UIcon name="i-heroicons-link" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Link Pembelajaran
                </h4>
                
                <div class="space-y-3">
                  <!-- Google Drive Link -->
                  <button
                    v-if="course.link_drive"
                    class="flex items-center justify-between w-full p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-800/30 text-green-700 dark:text-green-300 rounded-lg transition-all duration-300 group border border-green-200 dark:border-green-800"
                    @click="openDriveLink"
                  >
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <UIcon name="i-heroicons-folder" class="w-5 h-5 text-green-800 dark:text-green-400" />
                      </div>
                      <div class="text-left">
                        <p class="font-semibold text-sm">Google Drive</p>
                        <p class="text-xs opacity-75">Akses file tambahan</p>
                      </div>
                    </div>
                    <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Similar Materials Section -->
      <section v-if="hasData && relatedCourses.length > 0" class="mt-12">
        <div class="mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Materi Serupa
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Kategori: <span class="font-semibold text-green-600 dark:text-green-400">{{ formatCategory(course.category) }}</span>
          </p>
        </div>

        <!-- Loading State -->
        <LoadingData v-if="loadingSimilar" />

        <!-- Similar Materials Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MaterialCardContent 
            v-for="item in relatedCourses"
            :key="item.id"
            :course="item"
            variant="default"
          />
        </div>

        <!-- View All Button -->
        <div class="mt-8 flex justify-center">
          <NuxtLink
            to="/educations"
            class="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold bg-linear-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
          >
            <span>Lihat Semua Materi</span>
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 transition-transform" />
          </NuxtLink>
        </div>
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