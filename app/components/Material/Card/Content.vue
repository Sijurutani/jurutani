<script setup lang="ts">
import { computed, ref } from 'vue'
 

const supabase = useSupabaseClient()

interface Course {
  id: string
  slug: string
  title: string
  description: string
  image_url?: string
  category: string
  created_at: string
  instructor?: string
  files?: any
  link_drive?: string
  link_youtube?: string
}

interface Props {
  course: Course
  variant?: 'default' | 'large' | 'wide' | 'tall'
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  index: 0
})

// State management
const imageError = ref(false)
const imageLoading = ref(true)

// Parse files helper
const parseFiles = (filesData: any): any[] => {
  if (!filesData) return []
  
  try {
    if (Array.isArray(filesData)) return filesData
    
    if (typeof filesData === 'string') {
      let parsed = JSON.parse(filesData)
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed)
      }
      return Array.isArray(parsed) ? parsed : []
    }
    
    return []
  } catch (error) {
    console.error('Error parsing files:', error)
    return []
  }
}

// Computed properties
const parsedFiles = computed(() => parseFiles(props.course.files))
const fileCount = computed(() => parsedFiles.value.length)
const hasFiles = computed(() => fileCount.value > 0)
const hasLinks = computed(() => !!(props.course.link_drive || props.course.link_youtube))
const resourceCount = computed(() => {
  let count = 0
  if (hasFiles.value) count += fileCount.value
  if (props.course.link_drive) count += 1
  if (props.course.link_youtube) count += 1
  return count
})

// Image URL handling
const imageUrl = computed(() => {
  if (!props.course?.image_url) return null
  
  if (props.course.image_url.startsWith('http')) {
    return props.course.image_url
  }
  
  const { data } = supabase.storage
    .from('course-images')
    .getPublicUrl(props.course.image_url)
  
  return data.publicUrl
})

// Formatting utilities
const formattedDate = computed(() => {
  const date = new Date(props.course.created_at)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
})

const formattedCategory = computed(() => {
  return props.course.category.charAt(0).toUpperCase() + props.course.category.slice(1)
})

const excerpt = computed(() => {
  if (!props.course.description) return ''
  const maxLength = props.variant === 'large' ? 180 : 100
  return props.course.description.length > maxLength 
    ? props.course.description.substring(0, maxLength) + '...' 
    : props.course.description
})

// Image handlers
const handleImageError = () => {
  imageError.value = true
  imageLoading.value = false
}

const handleImageLoad = () => {
  imageLoading.value = false
  imageError.value = false
}

// Category color coding
const getCategoryColor = (category: string) => {
  const colors = {
    pertanian: 'bg-green-600',
    peternakan: 'bg-emerald-600',
    teknologi: 'bg-teal-600',
    bisnis: 'bg-lime-600',
    tutorial: 'bg-green-700',
    panduan: 'bg-emerald-500',
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

// Navigation
const viewDetails = () => {
  navigateTo(`/educations/${props.course.slug}`)
}
</script>

<template>
  <div
    :class="cardClasses"
    @click="viewDetails"
  >
    <!-- Background Image with Gradient Overlay -->
    <div class="absolute inset-0">
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
        :alt="course.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        @error="handleImageError"
        @load="handleImageLoad"
      />
      
      <!-- Fallback Background -->
      <div 
        v-else 
        class="w-full h-full bg-linear-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center"
      >
        <div class="text-center text-green-400 dark:text-gray-600">
          <UIcon name="i-heroicons-book-open" class="w-20 h-20 mb-3 opacity-50" />
          <p class="text-sm font-medium opacity-75">Materi JuruTani</p>
        </div>
      </div>
      
      <!-- Gradient Overlay - Enhanced with multiple layers -->
      <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
      
      <!-- Additional gradient for better text readability -->
      <div class="absolute inset-0 bg-linear-to-br from-green-900/20 via-transparent to-emerald-900/20 group-hover:from-green-900/30 group-hover:to-emerald-900/30 transition-all duration-500" />
    </div>
    
    <!-- Content Overlay -->
    <div :class="['relative h-full flex flex-col justify-end', contentClasses]">
      <!-- Category Badge -->
      <div class="absolute top-4 left-4 md:top-6 md:left-6">
        <span 
          :class="[
            getCategoryColor(course.category),
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl'
          ]"
        >
          <UIcon name="i-heroicons-book-open" class="w-3 h-3" />
          {{ formattedCategory }}
        </span>
      </div>
      
      <!-- Resource Indicators (top-right) -->
      <div v-if="resourceCount > 0" class="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2">
        <!-- Files indicator -->
        <div 
          v-if="hasFiles"
          class="inline-flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium"
        >
          <UIcon name="i-heroicons-document" class="w-3 h-3" />
          <span>{{ fileCount }}</span>
        </div>
        
        <!-- Links indicator -->
        <div 
          v-if="hasLinks"
          class="inline-flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium"
        >
          <UIcon name="i-heroicons-link" class="w-3 h-3" />
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="space-y-3 md:space-y-4 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
        <!-- Title -->
        <h3 
          :class="[
            'font-bold text-white leading-tight line-clamp-2 transition-all duration-300',
            variant === 'large' ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'
          ]"
        >
          {{ course.title }}
        </h3>
        
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
        <div class="flex items-center gap-4 text-xs md:text-sm text-gray-300">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-green-400" />
            <span>{{ formattedDate }}</span>
          </div>
          <div v-if="course.instructor" class="flex items-center gap-2">
            <UIcon name="i-heroicons-user" class="w-4 h-4 text-green-400" />
            <span class="font-medium">{{ course.instructor }}</span>
          </div>
        </div>
        
        <!-- View Material Button -->
        <div class="flex items-center gap-2 text-white font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span class="text-sm md:text-base">Lihat Materi</span>
          <UIcon 
            name="i-heroicons-arrow-right" 
            class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" 
          />
        </div>
      </div>
      
      <!-- Animated Border on Hover -->
      <div class="absolute inset-0 border-2 border-transparent group-hover:border-green-400/50 rounded-2xl transition-all duration-500 pointer-events-none" />
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
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
