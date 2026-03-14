<script setup lang="ts">

const { getFoodsWithLatestPrices, formatCurrency, formatDate, getCategoryIcon, getCategoryLabel } = useFoodPrices()

// State
const loading = ref(true)
const allFoods = ref<any[]>([])

// Filter kategori utama (4 kategori, exclude 'all')
const mainCategories = computed(() => {
  return Enum.FoodPriceCategories
    .filter(cat => cat.value !== 'all')
    .slice(0, 4)
})

// Grouped data per kategori
const categorizedData = computed(() => {
  return mainCategories.value.map(category => {
    // Filter foods by category and sort by latest price date
    const items = allFoods.value
      .filter(food => food.category === category.value)
      .sort((a, b) => {
        const dateA = new Date(a.latest_price_date || a.updated_at).getTime()
        const dateB = new Date(b.latest_price_date || b.updated_at).getTime()
        return dateB - dateA
      })
      .slice(0, 5) // Get 5 latest items per category

    return {
      category,
      items
    }
  })
})

// Fetch data from Supabase
const fetchFoods = async () => {
  loading.value = true
  
  const { data, error } = await getFoodsWithLatestPrices()
  
  if (error) {
    console.error('Error fetching foods:', error)
  } else {
    allFoods.value = data || []
  }
  
  loading.value = false
}

// Format date in short format
const formatShortDate = (dateStr?: string) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  } catch {
    return ''
  }
}

// Get category color
const getCategoryColor = (categoryValue: string) => {
  const colors: Record<string, string> = {
    'hortikultura': 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
    'perkebunan': 'from-green-50 to-lime-50 dark:from-green-950/30 dark:to-lime-950/30',
    'peternakan': 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30',
    'perikanan': 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
  }
  return colors[categoryValue] || 'from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30'
}

// Get category icon color
const getCategoryIconColor = (categoryValue: string) => {
  const colors: Record<string, string> = {
    'hortikultura': 'text-emerald-600 dark:text-emerald-400',
    'perkebunan': 'text-green-600 dark:text-green-400',
    'peternakan': 'text-orange-600 dark:text-orange-400',
    'perikanan': 'text-blue-600 dark:text-blue-400',
  }
  return colors[categoryValue] || 'text-gray-600 dark:text-gray-400'
}

// Get price color
const getPriceColor = (categoryValue: string) => {
  const colors: Record<string, string> = {
    'hortikultura': 'text-emerald-600 dark:text-emerald-400',
    'perkebunan': 'text-green-600 dark:text-green-400',
    'peternakan': 'text-orange-600 dark:text-orange-400',
    'perikanan': 'text-blue-600 dark:text-blue-400',
  }
  return colors[categoryValue] || 'text-gray-600 dark:text-gray-400'
}

// Initial fetch
onMounted(() => {
  fetchFoods()
})
</script>

<template>
  <div class="food-price-section container max-w-6xl mx-auto px-4 py-12">
    <!-- Section Header -->
    <div class="mx-auto mb-12 max-w-4xl text-center">
      <UBadge 
        color="success" 
        variant="subtle" 
        size="lg"
        class="mb-6"
      >
        <template #leading>
          <UIcon name="i-lucide-trending-down" class="w-4 h-4" />
        </template>
        Harga Pangan Terupdate
      </UBadge>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent py-2">
        Pantau Harga Pangan DIY
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
        Informasi harga komoditas pertanian terkini dari berbagai produsen lokal Daerah Istimewa Yogyakarta. 
        <span class="font-semibold text-green-600 dark:text-green-400">Update harian</span> untuk kebutuhan Anda.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 dark:border-emerald-800 dark:border-t-emerald-400"/>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat data harga pangan...</p>
    </div>

    <!-- Bento Grid Layout -->
    <div v-else class="mb-8">
      <!-- Mobile: Horizontal Scroll -->
      <div class="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div class="flex gap-4 pb-4">
          <div 
            v-for="categoryGroup in categorizedData" 
            :key="categoryGroup.category.value"
            :class="[
              'rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden',
              'hover:shadow-xl transition-all duration-300',
              'bg-linear-to-br min-w-[280px] flex-shrink-0',
              getCategoryColor(categoryGroup.category.value)
            ]"
          >
            <!-- Category Header -->
            <div class="p-4 pb-3 border-b border-gray-200 dark:border-gray-700/50">
              <div class="flex items-center gap-2 mb-2">
                <div class="p-2 rounded-lg bg-white/60 dark:bg-gray-900/60">
                  <UIcon 
                    :name="getCategoryIcon(categoryGroup.category.value)" 
                    :class="['w-5 h-5', getCategoryIconColor(categoryGroup.category.value)]"
                  />
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ categoryGroup.category.name }}
                </h3>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                <span v-if="categoryGroup.items.length > 0">
                  Harga per {{ formatShortDate(categoryGroup.items[0]?.latest_price_date) }}
                </span>
                <span v-else>Belum ada data</span>
              </p>
            </div>

            <!-- Items List -->
            <div class="p-4">
              <ul v-if="categoryGroup.items.length > 0" class="space-y-2">
                <li 
                  v-for="item in categoryGroup.items" 
                  :key="item.id"
                  class="py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <div class="text-gray-900 dark:text-white font-medium text-sm mb-1 truncate">{{ item.name }}</div>
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-gray-600 dark:text-gray-400 text-xs truncate">{{ item.satuan }}</span>
                    <span :class="['font-bold text-sm whitespace-nowrap', getPriceColor(categoryGroup.category.value)]">
                      {{ formatCurrency(item.latest_price || 0) }}
                    </span>
                  </div>
                </li>
              </ul>

              <!-- Empty State -->
              <div v-else class="text-center py-6">
                <UIcon name="i-lucide-package-x" class="w-10 h-10 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Belum ada data tersedia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop: 2 Column Grid -->
      <div class="hidden md:grid md:grid-cols-2 gap-6">
        <div 
          v-for="categoryGroup in categorizedData" 
          :key="categoryGroup.category.value"
          :class="[
            'rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden',
            'hover:shadow-xl transition-all duration-300',
            'bg-linear-to-br',
            getCategoryColor(categoryGroup.category.value)
          ]"
        >
          <!-- Category Header -->
          <div class="p-6 pb-4 border-b border-gray-200 dark:border-gray-700/50">
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 rounded-lg bg-white/60 dark:bg-gray-900/60">
                <UIcon 
                  :name="getCategoryIcon(categoryGroup.category.value)" 
                  :class="['w-6 h-6', getCategoryIconColor(categoryGroup.category.value)]"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ categoryGroup.category.name }}
              </h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <span v-if="categoryGroup.items.length > 0">
                Harga per {{ formatShortDate(categoryGroup.items[0]?.latest_price_date) }}
              </span>
              <span v-else>Belum ada data</span>
            </p>
          </div>

          <!-- Items List -->
          <div class="p-6">
            <ul v-if="categoryGroup.items.length > 0" class="space-y-3">
              <li 
                v-for="item in categoryGroup.items" 
                :key="item.id"
                class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <div class="flex-1 min-w-0">
                  <span class="text-gray-900 dark:text-white font-medium block truncate">{{ item.name }}</span>
                  <span class="text-gray-600 dark:text-gray-400 text-sm">per {{ item.satuan }}</span>
                </div>
                <div :class="['font-bold whitespace-nowrap ml-4', getPriceColor(categoryGroup.category.value)]">
                  {{ formatCurrency(item.latest_price || 0) }}
                </div>
              </li>
            </ul>

            <!-- Empty State -->
            <div v-else class="text-center py-8">
              <UIcon name="i-lucide-package-x" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Belum ada data tersedia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action Button -->
    <div v-if="!loading" class="text-center">
      <UButton 
        to="/food-prices"
        color="success"
        size="xl"
        class="shadow-lg hover:shadow-xl"
      >
        <template #leading>
          <span class="text-lg">Lihat Semua Harga Pangan</span>
        </template>
        <template #trailing>
          <UIcon name="i-lucide-arrow-right" class="w-5 h-5" />
        </template>
      </UButton>
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Temukan ribuan komoditas pertanian dengan harga terbaik
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
.food-price-section {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effects */
.group:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>