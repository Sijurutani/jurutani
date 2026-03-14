<script setup lang="ts">
import { computed, ref } from 'vue'
 

const supabase = useSupabaseClient()

interface Product {
  id: number | string
  slug: string
  name: string
  description: string
  price: number
  price_range?: string
  category: string
  attachments?: string
  seller?: string
  contact_seller?: string
  location?: string
  stock?: string | number
  links?: {
    shopee_link?: string
    tokopedia_link?: string
    tiktok_link?: string
  }
  profiles?: {
    name?: string
    full_name?: string
    avatar_url?: string
  }
}

interface Props {
  product: Product
  variant?: 'default' | 'large' | 'wide' | 'tall'
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  index: 0
})

const imageError = ref(false)
const imageLoading = ref(true)

// Get main image from attachments
const mainImage = computed(() => {
  if (!props.product.attachments?.trim()) {
    return '/product.png'
  }

  let imageUrl = ''

  try {
    const attachmentsData = JSON.parse(props.product.attachments)
    imageUrl = attachmentsData?.url_image?.trim()

    if (!imageUrl) {
      return '/product.png'
    }
  } catch {
    return '/product.png'
  }

  if (imageUrl.startsWith('http')) {
    return imageUrl
  }

  const { data } = supabase.storage
    .from('markets-attachments')
    .getPublicUrl(imageUrl)

  return data?.publicUrl || '/product.png'
})

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(props.product.price || 0)
})

const shortDescription = computed(() => {
  if (!props.product.description) return ''
  const maxLength = props.variant === 'large' ? 150 : 80
  return props.product.description.length > maxLength
    ? `${props.product.description.substring(0, maxLength)}...`
    : props.product.description
})

const handleImageLoad = () => {
  imageLoading.value = false
  imageError.value = false
}

const handleImageError = () => {
  imageLoading.value = false
  imageError.value = true
}

const getCategoryColor = (category: string) => {
  const colors = {
    'hasil pertanian': 'bg-green-600',
    'alat pertanian': 'bg-blue-600',
    'pupuk': 'bg-yellow-600',
    'bibit': 'bg-emerald-600',
    'default': 'bg-lime-600'
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
  <NuxtLink
    :to="`/markets/${product.slug}`"
    :class="cardClasses"
  >
    <!-- Background Image with Gradient Overlay -->
    <div class="absolute inset-0">
      <!-- Loading State -->
      <div 
        v-if="imageLoading && mainImage && !imageError" 
        class="absolute inset-0 flex items-center justify-center bg-linear-to-br from-emerald-50 to-green-100 dark:from-gray-800 dark:to-gray-900"
      >
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600" />
      </div>
      
      <!-- Background Image -->
      <img
        v-if="mainImage && !imageError"
        :src="mainImage"
        :alt="product.name"
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
          <UIcon name="i-heroicons-shopping-bag" class="w-20 h-20 mb-3 opacity-50" />
          <p class="text-sm font-medium opacity-75">Produk Tani</p>
        </div>
      </div>
      
      <!-- Gradient Overlay - Enhanced with multiple layers -->
      <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
      
      <!-- Additional gradient for better text readability -->
      <div class="absolute inset-0 bg-linear-to-br from-emerald-900/20 via-transparent to-green-900/20 group-hover:from-emerald-900/30 group-hover:to-green-900/30 transition-all duration-500" />
    </div>
    
    <!-- Content Overlay -->
    <div :class="['relative h-full flex flex-col justify-end', contentClasses]">
      <!-- Category Badge -->
      <div class="absolute top-4 left-4 md:top-6 md:left-6">
        <span 
          :class="[
            getCategoryColor(product.category),
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl'
          ]"
        >
          <UIcon name="i-heroicons-tag" class="w-3 h-3" />
          {{ product.category }}
        </span>
      </div>
      
      <!-- Stock Badge (if available) -->
      <div v-if="product.stock" class="absolute top-4 right-4 md:top-6 md:right-6">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
          <UIcon name="i-heroicons-cube" class="w-3 h-3 text-green-600" />
          Stok: {{ product.stock }}
        </span>
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
          {{ product.name }}
        </h3>
        
        <!-- Price -->
        <div class="flex items-baseline gap-2">
          <span 
            :class="[
              'font-bold text-green-400 transition-all duration-300',
              variant === 'large' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
            ]"
          >
            {{ formattedPrice }}
          </span>
          <span v-if="product.price_range" class="text-sm text-gray-300">
            {{ product.price_range }}
          </span>
        </div>
        
        <!-- Description - Show more on large variant -->
        <p 
          v-if="variant === 'large' || variant === 'wide'"
          :class="[
            'text-gray-200 leading-relaxed transition-all duration-300',
            variant === 'large' ? 'text-base md:text-lg line-clamp-3' : 'text-sm md:text-base line-clamp-2'
          ]"
        >
          {{ shortDescription }}
        </p>
        
        <!-- Meta Info -->
        <div class="flex items-center gap-4 text-xs md:text-sm text-gray-300">
          <div v-if="product.seller || product.profiles?.name" class="flex items-center gap-2">
            <UIcon name="i-heroicons-user" class="w-4 h-4 text-green-400" />
            <span class="font-medium">{{ product.seller || product.profiles?.full_name || product.profiles?.name }}</span>
          </div>
          <div v-if="product.location" class="flex items-center gap-2">
            <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-green-400" />
            <span>{{ product.location }}</span>
          </div>
        </div>
        
        <!-- E-commerce Badges -->
        <div v-if="product.links?.shopee_link || product.links?.tokopedia_link || product.links?.tiktok_link" class="flex flex-wrap gap-2">
          <span v-if="product.links?.shopee_link" class="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
            <UIcon name="i-heroicons-shopping-bag" class="w-3 h-3" />
            Shopee
          </span>
          <span v-if="product.links?.tokopedia_link" class="inline-flex items-center gap-1 px-2 py-1 bg-green-500/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
            <UIcon name="i-heroicons-shopping-cart" class="w-3 h-3" />
            Tokopedia
          </span>
          <span v-if="product.links?.tiktok_link" class="inline-flex items-center gap-1 px-2 py-1 bg-gray-900/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
            <UIcon name="i-heroicons-musical-note" class="w-3 h-3" />
            TikTok
          </span>
        </div>
        
        <!-- View Details Button -->
        <div class="flex items-center gap-2 text-white font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span class="text-sm md:text-base">Lihat Detail Produk</span>
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
</style>