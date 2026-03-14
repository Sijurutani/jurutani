<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'
import type { ProductMarket } from '~/types/market'
import {
  getImagePathUrl,
  getMarketPublicUrl,
  getAttachmentUrl,
  getExcerpt,
  formatDate,
  formatFileSize,
  getFileIcon,
  downloadAttachment,
  formatPrice
} from '~/composables/useProductMarketUtils'
import { formatDateLong } from '~/utils/dateFormatter'
import { Enum } from '~/utils/enum'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const { supabase } = useSupabase()

// Fetch product by slug
const { data: product, error } = await useAsyncData(
  `product_market_${route.params.slug}`,
  async () => {
    const { data, error } = await supabase
      .from('product_markets')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('slug', route.params.slug)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data as ProductMarket & { profiles: any }
  }
)

// Handle error
if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Produk tidak ditemukan'
  })
}

// Get all images (thumbnail + gallery)
const allImages = computed(() => {
  const images: string[] = []
  if (product.value.thumbnail_url) {
    images.push(product.value.thumbnail_url)
  }
  if (product.value.images && product.value.images.length > 0) {
    images.push(...product.value.images)
  }
  return images
})

// Image gallery state
const currentImageIndex = ref(0)
const isLightboxOpen = ref(false)

function openLightbox(index: number) {
  currentImageIndex.value = index
  isLightboxOpen.value = true
}

function closeLightbox() {
  isLightboxOpen.value = false
}

function nextImage() {
  if (currentImageIndex.value < allImages.value.length - 1) {
    currentImageIndex.value++
  }
}

function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

// Format price
const formattedPrice = computed(() => {
  return formatPrice(product.value.price)
})

// Price label
const priceLabel = computed(() => {
  if (!product.value) return null
  if (product.value.price != null) {
    const formatted = new Intl.NumberFormat('id-ID').format(Number(product.value.price))
    return `Rp ${formatted}${product.value.price_unit ? ` / ${product.value.price_unit}` : ''}`
  }
  if (product.value.price_range) return product.value.price_range
  return null
})

// Category badge class
const categoryClass = computed(() => {
  const baseClass = 'text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border'
  
  const categoryClasses: Record<string, string> = {
    'Hasil Pertanian': `${baseClass} bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800`,
    'Alat Pertanian': `${baseClass} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800`,
    'Pupuk': `${baseClass} bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800`,
    'Bibit': `${baseClass} bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800`
  }

  return categoryClasses[product.value.category] || `${baseClass} bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700`
})

// Status info from Enum
const statusInfo = computed(() =>
  Enum.StatusMarkets.find(s => s.value === product.value?.status)
)

const statusColor = computed((): 'neutral' | 'success' | 'warning' | 'error' => {
  const map: Record<string, 'neutral' | 'success' | 'warning' | 'error'> = {
    neutral: 'neutral', success: 'success', warning: 'warning', error: 'error'
  }
  return map[statusInfo.value?.color ?? 'neutral'] ?? 'neutral'
})

// Check if e-commerce links exist
const hasMarketplaceLinks = computed(() => {
  if (!product.value.links || product.value.links.length === 0) return false
  return product.value.links.some(link => 
    link.shopee_link || link.tokopedia_link || link.tiktok_link
  )
})

// Format WhatsApp link
const whatsappLink = computed(() => {
  if (!product.value.contact_seller) return '#'
  const phone = product.value.contact_seller.replace(/\D/g, '')
  const message = `Saya tertarik dengan produk: ${product.value.name}`
  const encodedMessage = encodeURIComponent(message)
  return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`
})

// Go back
const handleGoBack = (): void => {
  navigateTo('/markets')
}

// Open WhatsApp
const openWhatsApp = (): void => {
  if (whatsappLink.value !== '#') {
    window.open(whatsappLink.value, '_blank', 'noopener,noreferrer')
  }
}

// SEO
const seoTitle = computed(() => product.value ? `${product.value.name}` : 'Memuat Produk...')
const seoDescription = computed(() => product.value ? (product.value.excerpt || getExcerpt(product.value.content, 160)) : 'Produk pertanian dari JuruTani.')
const seoImage = computed(() => allImages.value[0] ? getImagePathUrl(allImages.value[0]) : '/product.png')
const seoKeywords = computed(() => product.value ? [
  'marketplace pertanian',
  product.value.category?.toLowerCase() || 'produk',
  'jual beli pertanian',
  'supplier pertanian'
] : [])

// Share URL
const shareUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/markets/${route.params.slug}`
  }
  return `https://jurutani.com/markets/${route.params.slug}`
})

// Update SEO after product is loaded
watch(() => product.value, (newVal) => {
  if (newVal) {
    useSeoDetail({
      title: seoTitle.value,
      description: seoDescription.value,
      keywords: seoKeywords.value,
      image: seoImage.value,
      url: shareUrl.value,
      type: 'product'
    })
  }
}, { immediate: true })

// Fetch similar products
const { data: similarProducts } = await useAsyncData(
  `similar_products_${route.params.slug}`,
  async () => {
    const { data, error } = await supabase
      .from('product_markets')
      .select('*')
      .eq('category', product.value.category)
      .eq('status', 'approved')
      .is('deleted_at', null)
      .neq('id', product.value.id)
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) return []
    return data as ProductMarket[]
  }
)
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
            Kembali ke Pasar Tani
          </UButton>

          <div class="flex items-center gap-2 text-green-700 dark:text-green-400">
            <UIcon name="i-heroicons-shopping-cart" class="w-5 h-5" />
            <span class="font-semibold">Pasar Tani</span>
          </div>
        </div>
      </div>

      <!-- Breadcrumb -->
      <nav class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <NuxtLink to="/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          Beranda
        </NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
        <NuxtLink to="/markets" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          Pasar Tani
        </NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
        <span class="text-gray-900 dark:text-white font-medium">{{ product.name }}</span>
      </nav>

      <!-- Product Details -->
      <article class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <!-- Left Column - Image Gallery -->
          <div class="relative bg-gray-900 dark:bg-gray-950 overflow-hidden">
            <!-- Main Image Container -->
            <div class="relative h-96 lg:h-full min-h-[500px] overflow-hidden">
              <img
                v-if="allImages.length > 0"
                :src="getImagePathUrl(allImages[currentImageIndex])"
                :alt="product.name"
                class="w-full h-full object-cover"
                @error="(e: any) => e.target.src = '/product.png'"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-800">
                <UIcon name="i-heroicons-shopping-bag" class="w-20 h-20 text-gray-600" />
              </div>

              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              <!-- Image Navigation -->
              <div v-if="allImages.length > 1" class="absolute inset-0 flex justify-between items-center pointer-events-none">
                <button
                  class="pointer-events-auto bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full p-3 m-4 transition-all focus:outline-none shadow-lg backdrop-blur-sm hover:scale-110"
                  @click="prevImage"
                >
                  <UIcon name="i-lucide-chevron-left" class="w-5 h-5" />
                </button>

                <button
                  class="pointer-events-auto bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full p-3 m-4 transition-all focus:outline-none shadow-lg backdrop-blur-sm hover:scale-110"
                  @click="nextImage"
                >
                  <UIcon name="i-lucide-chevron-right" class="w-5 h-5" />
                </button>
              </div>

              <!-- Category badge -->
              <div class="absolute top-4 left-4">
                <span :class="categoryClass">
                  {{ product.category }}
                </span>
              </div>

              <!-- Image counter -->
              <div v-if="allImages.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div class="bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm font-medium">
                  {{ currentImageIndex + 1 }} / {{ allImages.length }}
                </div>
              </div>
            </div>

            <!-- Thumbnail Images -->
            <div v-if="allImages.length > 1" class="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
              <div class="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  v-for="(img, index) in allImages"
                  :key="index"
                  :class="[
                    'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                    currentImageIndex === index
                      ? 'border-emerald-400 shadow-lg ring-2 ring-emerald-300 scale-110'
                      : 'border-white/50 hover:border-white/80 opacity-70 hover:opacity-100'
                  ]"
                  @click="currentImageIndex = index"
                >
                  <img :src="getImagePathUrl(img)" :alt="`Thumbnail ${index + 1}`" class="w-full h-full object-cover" @error="(e: any) => e.target.src = '/product.png'">
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column - Product Info -->
          <div class="p-6 lg:p-8">
            <div class="h-full flex flex-col">
              <!-- Status & Category Badges -->
              <div class="flex flex-wrap items-center gap-2 mb-4">
                <UBadge variant="soft" color="primary" class="capitalize">
                  {{ product.category }}
                </UBadge>
                <UBadge :color="statusColor" variant="subtle" class="capitalize">
                  {{ statusInfo?.label ?? product.status }}
                </UBadge>
                <span
                  v-if="product.published_at"
                  class="text-xs text-gray-500 dark:text-gray-400 ml-auto"
                >
                  {{ formatDateLong(product.published_at) }}
                </span>
              </div>

              <!-- Product Title -->
              <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {{ product.name }}
              </h1>

              <!-- Excerpt -->
              <p v-if="product.excerpt" class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {{ product.excerpt }}
              </p>

              <!-- Price + Seller Row -->
              <div class="flex flex-wrap items-start gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <!-- Price -->
                <div v-if="priceLabel" class="flex flex-col gap-0.5">
                  <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Harga</span>
                  <span class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ priceLabel }}</span>
                </div>

                <!-- Seller -->
                <div class="flex flex-col gap-0.5">
                  <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Penjual</span>
                  <div class="flex items-center gap-2">
                    <UAvatar
                      v-if="product.profiles?.avatar_url"
                      :src="product.profiles.avatar_url"
                      :alt="product.seller"
                      size="xs"
                    />
                    <span class="font-medium text-gray-900 dark:text-white">{{ product.seller }}</span>
                  </div>
                </div>

                <!-- Contact -->
                <div v-if="product.contact_seller" class="flex flex-col gap-0.5">
                  <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Kontak</span>
                  <span class="text-sm text-gray-900 dark:text-white">{{ product.contact_seller }}</span>
                </div>
              </div>

              <!-- Share Button -->
              <div class="mb-6">
                <AppShareButton
                  :title="product.name"
                  :description="product.excerpt || getExcerpt(product.content, 160)"
                  :url="shareUrl"
                  button-text="Bagikan Produk"
                  button-variant="outline"
                />
              </div>

              <!-- Description with UEditor (read-only) -->
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <UIcon name="i-lucide-file-text" class="w-5 h-5 mr-2 text-gray-500" />
                  Deskripsi Produk
                </h2>
                <div class="prose prose-lg dark:prose-invert max-w-none">
                  <UEditor
                    :model-value="product.content"
                    :editable="false"
                    content-type="json"
                    class="[&_.ProseMirror]:outline-none [&_.ProseMirror]:border-0 [&_.ProseMirror]:p-0"
                  />
                </div>
              </div>

              <!-- Attachments -->
              <div v-if="product.attachments && product.attachments.length > 0" class="mb-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <UIcon name="i-lucide-paperclip" class="w-5 h-5 mr-2 text-gray-500" />
                  Lampiran
                </h2>
                <div class="space-y-2">
                  <div
                    v-for="(attachment, index) in product.attachments"
                    :key="index"
                    class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group"
                    @click="downloadAttachment(attachment)"
                  >
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <div class="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <UIcon :name="getFileIcon(attachment.type || '')" class="w-5 h-5 text-primary" />
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="font-medium truncate">{{ attachment.name }}</p>
                        <p class="text-sm text-gray-500">{{ formatFileSize(attachment.size || 0) }}</p>
                      </div>
                    </div>
                    <UButton color="primary" variant="ghost" icon="i-lucide-download" />
                  </div>
                </div>
              </div>

              <!-- Marketplace Links -->
              <div v-if="hasMarketplaceLinks" class="mb-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <UIcon name="i-lucide-shopping-bag" class="w-5 h-5 mr-2 text-gray-500" />
                  Beli Sekarang
                </h2>
                <div class="flex flex-wrap gap-3">
                  <NuxtLink
                    v-for="(link, index) in product.links"
                    :key="index"
                    v-if="link.shopee_link"
                    :to="link.shopee_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 transition-all transform hover:scale-105 shadow-sm font-medium"
                  >
                    <UIcon name="i-lucide-shopping-bag" class="w-4 h-4 mr-2" />
                    Shopee
                  </NuxtLink>

                  <NuxtLink
                    v-for="(link, index) in product.links"
                    :key="index"
                    v-if="link.tokopedia_link"
                    :to="link.tokopedia_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-all transform hover:scale-105 shadow-sm font-medium"
                  >
                    <UIcon name="i-lucide-store" class="w-4 h-4 mr-2" />
                    Tokopedia
                  </NuxtLink>

                  <NuxtLink
                    v-for="(link, index) in product.links"
                    :key="index"
                    v-if="link.tiktok_link"
                    :to="link.tiktok_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all transform hover:scale-105 shadow-sm font-medium"
                  >
                    <UIcon name="i-lucide-music" class="w-4 h-4 mr-2" />
                    TikTok Shop
                  </NuxtLink>
                </div>
              </div>

              <!-- Contact Button -->
              <div class="mt-auto pt-6">
                <button
                  @click="openWhatsApp"
                  class="inline-flex items-center justify-center w-full px-6 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all transform hover:scale-105 text-lg font-semibold shadow-lg hover:shadow-xl"
                >
                  <UIcon name="i-mdi-whatsapp" class="text-2xl mx-4" />
                  Hubungi Penjual
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Gallery Section (Separate) -->
      <section v-if="allImages.length > 1" class="mt-12">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
          <UIcon name="i-lucide-images" class="w-6 h-6" />
          Galeri Foto
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(image, index) in allImages"
            :key="index"
            class="aspect-square rounded-lg overflow-hidden cursor-pointer group relative shadow-md hover:shadow-xl transition-shadow"
            @click="openLightbox(index)"
          >
            <img
              :src="getImagePathUrl(image)"
              :alt="`Gallery ${index + 1}`"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            >
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <UIcon name="i-lucide-expand" class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      <!-- Similar Products Section -->
      <section class="mt-12">
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-package-2" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Produk Serupa
              </h2>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            Kategori: <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ product.category }}</span>
          </p>
        </div>

        <!-- Similar Products Grid -->
        <div v-if="similarProducts && similarProducts.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ProductMarketCard
            v-for="item in similarProducts"
            :key="item.id"
            :product="item"
            variant="default"
          />
        </div>

        <!-- View All Button -->
        <div v-if="similarProducts && similarProducts.length > 0" class="flex justify-center">
          <NuxtLink
            to="/markets"
            class="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-all duration-200 hover:shadow-lg font-semibold"
          >
            <span>Lihat Semua Produk</span>
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- No Similar Products -->
        <NotFoundData v-else />
      </section>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="isLightboxOpen"
        class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        @click.self="closeLightbox"
      >
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          @click="closeLightbox"
        >
          <UIcon name="i-lucide-x" class="w-6 h-6" />
        </button>

        <!-- Navigation -->
        <button
          v-if="currentImageIndex > 0"
          class="absolute left-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          @click="prevImage"
        >
          <UIcon name="i-lucide-chevron-left" class="w-8 h-8" />
        </button>

        <button
          v-if="currentImageIndex < allImages.length - 1"
          class="absolute right-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          @click="nextImage"
        >
          <UIcon name="i-lucide-chevron-right" class="w-8 h-8" />
        </button>

        <!-- Image -->
        <div class="max-w-6xl max-h-[90vh] p-4">
          <img
            :src="getImagePathUrl(allImages[currentImageIndex])"
            :alt="`Image ${currentImageIndex + 1}`"
            class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          >
        </div>

        <!-- Counter -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-sm text-white text-sm rounded-full">
          {{ currentImageIndex + 1 }} / {{ allImages.length }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
