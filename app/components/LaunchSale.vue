<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
 

// Types
interface Banner {
  id: string
  image_url: string
  updated_at: string
}

const supabase = useSupabaseClient()

// State
const banner = ref<Banner | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Constants
const BUCKET_NAME = 'banner-image'

// Get full image URL from Supabase Storage
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder.png'
  
  // Jika sudah URL lengkap, return as is
  if (imagePath.startsWith('http')) return imagePath
  
  // Jika hanya path, build URL dari bucket
  try {
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(imagePath)
    
    return data.publicUrl
  } catch (err) {
    console.error('Error getting image URL:', err)
    return '/placeholder.png'
  }
}

// Computed
const bannerImageUrl = computed(() => {
  return banner.value ? getImageUrl(banner.value.image_url) : ''
})

// Fetch banner from Supabase (ambil yang pertama/active)
const fetchBanner = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { data, error: fetchError } = await supabase
      .from('banner')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    banner.value = data || null
  } catch (err: any) {
    console.error('Error fetching banner:', err)
    error.value = err.message || 'Gagal memuat banner'
  } finally {
    loading.value = false
  }
}

// Handle image load error
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  console.error('Failed to load banner image:', target.src)
  target.src = '/placeholder.png'
}

onMounted(() => {
  fetchBanner()
})
</script>

<template>
  <section class="relative max-w-6xl mx-auto w-full">
    <!-- Loading State -->
    <div v-if="loading" class="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl">
      <div class="absolute inset-0 bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center">
        <div class="text-center">
          <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
          <p class="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Memuat banner...</p>
        </div>
      </div>
      <!-- Shimmer effect -->
      <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-pulse"/>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl">
      <div class="absolute inset-0 bg-linear-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <div class="text-center">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-red-600 dark:text-red-400 font-medium text-sm mb-1">Gagal memuat banner</p>
          <button 
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors duration-200" 
            @click="fetchBanner"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!banner" class="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl">
      <div class="absolute inset-0 bg-linear-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 flex items-center justify-center">
        <div class="text-center">
          <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400 font-medium text-sm">Belum ada banner</p>
        </div>
      </div>
    </div>

    <!-- Banner Image -->
    <div v-else class="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl group">
      <!-- Main Image -->
      <img
        :src="bannerImageUrl"
        alt="Banner JuruTani"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        @error="handleImageError"
      >
      
      <!-- Subtle gradient overlay for text readability -->
      <div class="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"/>
      
      <!-- Optional floating decoration -->
      <div class="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"/>
      <div class="absolute top-6 right-8 w-2 h-2 bg-white/20 rounded-full animate-pulse" style="animation-delay: 0.5s;"/>
    </div>
  </section>
</template>

<style scoped>
/* Custom animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Hover effects */
.group:hover .absolute.top-4 {
  animation-play-state: paused;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .rounded-xl {
    border-radius: 0.75rem;
  }
}
</style>