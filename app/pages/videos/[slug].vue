<script setup lang="ts">
import type { Database } from '~/types/database.types'

type VideoRow = Database['public']['Tables']['videos']['Row']

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const supabase = useSupabaseClient()
const slugParam = computed(() =>
  Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
)

// ─── Helper: Extract YouTube ID ────────────────────────────────────────────────
const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

const getYouTubeThumbnail = (linkYt: string): string => {
  const videoId = getYouTubeId(linkYt)
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : '/video.png'
}

// ─── Fetch Video ───────────────────────────────────────────────────────────────
const { data: video, error } = await useAsyncData(
  `video_slug_${route.params.slug}`,
  async () => {
    if (!slugParam.value) return null

    const { data, error } = await supabase
      .from('videos')
      .select('id,slug,title,description,link_yt,category,created_at,updated_at')
      .eq('slug', slugParam.value)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data as VideoRow
  }
)

if (error.value || !video.value) {
  throw createError({ statusCode: 404, statusMessage: 'Video tidak ditemukan' })
}

// ─── SEO ───────────────────────────────────────────────────────────────────────
const thumbnailForSeo = computed(() =>
  video.value?.link_yt ? getYouTubeThumbnail(video.value.link_yt) : '/video.png'
)

useSeoMeta({
  title: video.value.title,
  description: video.value.description || `Tonton ${video.value.title} - Video edukasi pertanian dari JuruTani`,
  ogTitle: video.value.title,
  ogDescription: video.value.description || `Tonton ${video.value.title}`,
  ogImage: thumbnailForSeo.value,
  twitterCard: 'summary_large_image'
})

// ─── YouTube Embed ─────────────────────────────────────────────────────────────
const youtubeVideoId = computed(() =>
  video.value?.link_yt ? getYouTubeId(video.value.link_yt) : null
)

const youtubeEmbedUrl = computed(() =>
  youtubeVideoId.value
    ? `https://www.youtube.com/embed/${youtubeVideoId.value}?rel=0&modestbranding=1`
    : null
)

// ─── Format Helpers ────────────────────────────────────────────────────────────
const formatDate = (dateString: string): string =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    .format(new Date(dateString))

const formatCategory = (category?: string | null): string =>
  category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Video'

// ─── Share URL ─────────────────────────────────────────────────────────────────
const shareUrl = computed(() => {
  const path = `/videos/${slugParam.value}`
  if (typeof window !== 'undefined') return `${window.location.origin}${path}`
  return `https://jurutani.com${path}`
})

// ─── Related Videos ────────────────────────────────────────────────────────────
const { data: relatedVideos } = await useAsyncData(
  `related_videos_slug_${route.params.slug}`,
  async () => {
    if (!video.value?.category) return []

    const { data } = await supabase
      .from('videos')
      .select('id,slug,title,description,link_yt,category,created_at')
      .eq('category', video.value.category)
      .is('deleted_at', null)
      .neq('id', video.value.id)
      .order('created_at', { ascending: false })
      .limit(6)

    return (data ?? []) as VideoRow[]
  },
  { default: () => [] as VideoRow[] }
)
</script>

<template>
  <div class="min-h-screen py-6">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <UButton
            to="/videos"
            color="success"
            variant="ghost"
            icon="i-lucide-arrow-left"
          >
            Kembali ke Edukasi
          </UButton>

          <div class="flex items-center gap-2 text-green-700 dark:text-green-400">
            <UIcon name="i-heroicons-video-camera" class="w-5 h-5" />
            <span class="font-semibold">Video Edukasi</span>
          </div>
        </div>
      </div>

      <!-- Breadcrumb -->
      <nav class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <NuxtLink to="/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <UIcon name="i-lucide-home" class="w-4 h-4" />
        </NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
        <NuxtLink to="/videos" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <UIcon name="i-heroicons-video-camera" class="w-4 h-4" />
        </NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
        <span class="text-gray-900 dark:text-white font-medium truncate">{{ video.title }}</span>
      </nav>

      <!-- Main Content -->
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
            <div class="mb-6">
              <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
                  <UIcon name="i-heroicons-video-camera" class="w-3 h-3" />
                  {{ formatCategory(video.category) }}
                </span>
              </div>

              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {{ video.title }}
              </h1>

              <!-- Meta Info -->
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-1">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                  <time :datetime="video.created_at">{{ formatDate(video.created_at) }}</time>
                </div>

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

            <!-- Related Videos List -->
            <div v-if="relatedVideos && relatedVideos.length > 0" class="space-y-4">
              <NuxtLink
                v-for="item in relatedVideos.slice(0, 4)"
                :key="item.id"
                :to="`/videos/${item.slug}`"
                class="group block hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 transition-colors"
              >
                <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-2">
                  <img
                    v-if="item.link_yt"
                    :src="getYouTubeThumbnail(item.link_yt)"
                    :alt="item.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  >
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <UIcon name="i-heroicons-video-camera" class="w-12 h-12 text-gray-400" />
                  </div>
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <UIcon name="i-heroicons-play" class="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                </div>
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

      <!-- More Related Videos (Bottom Grid) -->
      <section v-if="relatedVideos && relatedVideos.length > 4" class="mt-12">
        <div class="mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <UIcon name="i-heroicons-play-circle" class="w-6 h-6 text-green-600" />
            Lebih Banyak Video {{ formatCategory(video.category) }}
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VideoCardContent
            v-for="item in relatedVideos.slice(4)"
            :key="item.id"
            :video="item"
            variant="default"
          />
        </div>

        <div class="mt-8 flex justify-center">
          <NuxtLink
            to="/videos"
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-linear-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
          >
            <span>Lihat Semua Video</span>
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
