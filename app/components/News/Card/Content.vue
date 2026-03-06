<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

const { supabase } = useSupabase()

interface News {
  id: number
  slug: string
  title: string
  content: string
  image_url?: string
  category: string
  created_at: string
  author?: string
}

interface Props {
  news: News
  variant?: 'default' | 'large' | 'wide' | 'tall'
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  index: 0
})

const imageError = ref(false)
const imageLoading = ref(true)

// Computed for Supabase image URL
const imageUrl = computed(() => {
  if (!props.news?.image_url) return null
  
  if (props.news.image_url.startsWith('http')) {
    return props.news.image_url
  }
  
  const { data } = supabase.storage
    .from('news-images')
    .getPublicUrl(props.news.image_url)
  
  return data.publicUrl
})

const formattedDate = computed(() => {
  const date = new Date(props.news.created_at)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
})

const formattedCategory = computed(() => {
  return props.news.category.charAt(0).toUpperCase() + props.news.category.slice(1)
})

const excerpt = computed(() => {
  const stripHtml = props.news.content.replace(/<[^>]*>?/gm, '')
  const maxLength = props.variant === 'large' ? 180 : 100
  return stripHtml.length > maxLength ? stripHtml.substring(0, maxLength) + '...' : stripHtml
})

const handleImageError = () => {
  imageError.value = true
  imageLoading.value = false
}

const handleImageLoad = () => {
  imageLoading.value = false
  imageError.value = false
}

const getCategoryColor = (category: string) => {
  const colors = {
    teknologi: 'bg-emerald-600',
    pertanian: 'bg-green-600',
    bisnis: 'bg-lime-600',
    pendidikan: 'bg-teal-600',
    kesehatan: 'bg-green-700',
    tips: 'bg-emerald-500',
    panduan: 'bg-lime-500',
    default: 'bg-green-500'
  }
  return colors[category.toLowerCase()] || colors.default
}

// Bento grid variants
const cardClasses = computed(() => {
  const base = 'group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer'
  
  const variants = {
    default: 'col-span-1 row-span-1 min-h-[400px]',
    large: 'col-span-1 md:col-span-2 row-span-1 md:row-span-2 min-h-[400px] md:min-h-[600px]',
    wide: 'col-span-1 md:col-span-2 row-span-1 min-h-[400px]',
    tall: 'col-span-1 row-span-1 md:row-span-2 min-h-[400px] md:min-h-[600px]'
  }
  
  return `${base} ${variants[props.variant]}`
})

const contentClasses = computed(() => {
  if (props.variant === 'large') {
    return 'p-8 md:p-10'
  }
  return 'p-6 md:p-8'
})
</script>

<template>
  <article :class="cardClasses">
    <NuxtLink :to="`/update/${news.slug}`" class="block h-full">
      <!-- Background Image with Gradient Overlay -->
      <figure class="absolute inset-0">
        <!-- Loading State -->
        <div 
          v-if="imageLoading && imageUrl && !imageError" 
          class="absolute inset-0 flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900"
        >
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600" />
        </div>
        
        <!-- Background Image -->
        <img
          v-if="imageUrl && !imageError"
          :src="imageUrl"
          :alt="`Gambar berita: ${news.title}`"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          @error="handleImageError"
          @load="handleImageLoad"
        >
        
        <!-- Fallback Background -->
        <div 
          v-else 
          class="w-full h-full bg-linear-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center"
        >
          <div class="text-center text-green-400 dark:text-gray-600">
            <UIcon name="i-heroicons-newspaper" class="w-20 h-20 mb-3 opacity-50" />
            <p class="text-sm font-medium opacity-75">JuruTani</p>
          </div>
        </div>
        
        <!-- Gradient Overlay - Enhanced with multiple layers -->
        <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
        
        <!-- Additional gradient for better text readability -->
        <div class="absolute inset-0 bg-linear-to-br from-green-900/20 via-transparent to-emerald-900/20 group-hover:from-green-900/30 group-hover:to-emerald-900/30 transition-all duration-500" />
      </figure>
      
      <!-- Content Overlay -->
      <div :class="['relative h-full flex flex-col justify-end', contentClasses]">
        <!-- Category Badge -->
        <div class="absolute top-4 left-4 md:top-6 md:left-6">
          <span 
            :class="[
              getCategoryColor(news.category),
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl'
            ]"
          >
            <UIcon name="i-heroicons-tag" class="w-3 h-3" />
            {{ formattedCategory }}
          </span>
        </div>
        
        <!-- Main Content -->
        <div class="space-y-3 md:space-y-4 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
          <!-- Title -->
          <header>
            <h3 
              :class="[
                'font-bold text-white leading-tight line-clamp-2 transition-all duration-300',
                variant === 'large' ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'
              ]"
            >
              {{ news.title }}
            </h3>
          </header>
          
          <!-- Excerpt - Show more on large variant -->
          <p 
            v-if="variant === 'large' || variant === 'wide'"
            :class="[
              'text-gray-200 leading-relaxed transition-all duration-300',
              variant === 'large' ? 'text-base md:text-lg line-clamp-3' : 'text-sm md:text-base line-clamp-2'
            ]"
          >
            {{ excerpt }}
          </p>
          
          <!-- Meta Info -->
          <footer class="flex items-center gap-4 text-xs md:text-sm text-gray-300">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-user" class="w-4 h-4 text-green-400" />
              <span class="font-medium">{{ news.author || 'Admin JuruTani' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-green-400" />
              <time :datetime="news.created_at">{{ formattedDate }}</time>
            </div>
          </footer>
          
          <!-- Read More Button -->
          <div class="flex items-center gap-2 text-white font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span class="text-sm md:text-base">Baca Selengkapnya</span>
            <UIcon 
              name="i-heroicons-arrow-right" 
              class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" 
            />
          </div>
        </div>
        
        <!-- Animated Border on Hover -->
        <div class="absolute inset-0 border-2 border-transparent group-hover:border-green-400/50 rounded-2xl transition-all duration-500 pointer-events-none" />
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth animation for image scale */
@keyframes imageScale {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}
</style>