<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useSupabase } from '~/composables/useSupabase';
import { toastStore } from '~/composables/useJuruTaniToast';

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});

const { supabase } = useSupabase();

const newsItems = ref([]);
const loading = ref(true);
const error = ref(null);

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// Status mapping
const statusConfig = {
  approved: {
    label: 'Disetujui',
    class: 'bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
    icon: 'i-heroicons-check-circle'
  },
  pending: {
    label: 'Menunggu',
    class: 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    icon: 'i-heroicons-clock'
  },
  rejected: {
    label: 'Ditolak',
    class: 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
    icon: 'i-heroicons-x-circle'
  }
};

// Helper function to get image URL for news
const getNewsImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder.png';
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  const { data } = supabase.storage
    .from('news-images')
    .getPublicUrl(imageUrl);
  
  return data?.publicUrl || '/placeholder.png';
};

// Fetch news data
const fetchNewsData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const from = (currentPage.value - 1) * pageSize.value;
    const to = from + pageSize.value - 1;
    
    const { data: newsData, error: newsError, count } = await supabase
      .from('news_updated')
      .select('id, title, created_at, cover_image, status_news', { count: 'exact' })
      .eq('user_id', props.userId)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (newsError) {
      console.error('Error fetching news:', newsError);
      error.value = newsError;
      toastStore.error('Gagal memuat data berita.');
    } else {
      const formattedNews = (newsData || []).map(item => ({
        ...item,
        type: 'news',
        typeLabel: 'Berita',
        route: `/update/${item.id}`,
        status: item.status_news || 'pending',
        imageUrl: getNewsImageUrl(item.cover_image),
        title: item.title || 'Berita Tanpa Judul'
      }));
      
      newsItems.value = formattedNews;
      totalItems.value = count || 0;
    }
    
  } catch (err) {
    console.error('Exception fetching news data:', err);
    error.value = err;
    toastStore.error('Terjadi kesalahan saat memuat data berita.');
  } finally {
    loading.value = false;
  }
};

// Change page
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchNewsData();
  }
};

// Get normalized status for display
const getNormalizedStatus = (status) => {
  const normalizedStatus = status?.toLowerCase() || 'pending';
  return statusConfig[normalizedStatus] || statusConfig.pending;
};

// Watch for userId changes
watch(() => props.userId, (newUserId) => {
  if (newUserId) {
    currentPage.value = 1;
    fetchNewsData();
  }
}, { immediate: true });

onMounted(() => {
  if (props.userId) {
    fetchNewsData();
  }
});
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <UIcon name="i-heroicons-arrow-path" class="inline-block animate-spin h-8 w-8 text-green-600 dark:text-green-500 mb-4" />
      <p class="text-gray-500 dark:text-gray-400">Memuat riwayat berita...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg transition-colors duration-200">
      <div class="flex items-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0" />
        <p class="font-medium">Terjadi kesalahan saat memuat riwayat berita.</p>
      </div>
      <button 
        class="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline transition-colors" 
        @click="fetchNewsData"
      >
        Coba lagi
      </button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="!newsItems || newsItems.length === 0" class="text-center py-16">
      <UIcon name="i-heroicons-newspaper" class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
      <h3 class="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">Belum ada berita</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Belum ada berita yang Anda buat. Mulai buat berita pertama Anda!
      </p>
      <nuxt-link 
        to="/update" 
        class="inline-flex items-center px-6 py-3 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors"
      >
        <UIcon name="i-heroicons-plus" class="w-5 h-5 mr-2" />
        Buat Berita
      </nuxt-link>
    </div>
    
    <!-- News Items List -->
    <div v-else class="space-y-4">
      <div 
        v-for="item in newsItems" 
        :key="'news-' + item.id"
        class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:shadow-black/50 transition-all duration-200"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <!-- Type Badge -->
            <div class="flex items-center space-x-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 transition-colors">
                <UIcon name="i-heroicons-newspaper" class="w-4 h-4 mr-1" />
                {{ item.typeLabel }}
              </span>
              
              <!-- Date -->
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Tanggal tidak tersedia' }}
              </span>
            </div>
            
            <!-- Status Badge -->
            <span 
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-colors',
                getNormalizedStatus(item.status).class
              ]"
            >
              <UIcon 
                :name="getNormalizedStatus(item.status).icon" 
                class="w-4 h-4 mr-1"
              />
              {{ getNormalizedStatus(item.status).label }}
            </span>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Image -->
            <div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
              <img 
                :src="item.imageUrl" 
                :alt="item.title"
                class="w-full h-full object-cover"
                loading="lazy"
                @error="(e) => (e.target as HTMLImageElement).src = '/placeholder.png'"
              >
            </div>
            
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {{ item.title }}
              </h3>
              
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  ID: NEWS-{{ item.id }}
                </div>
                
                <nuxt-link 
                  :to="item.route"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
                >
                  Lihat Detail
                  <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <AppPaginationInfo 
      v-if="!loading && newsItems && newsItems.length > 0" 
      :current-page="currentPage" 
      :total-pages="totalPages" 
      @prev="currentPage > 1 ? currentPage-- : null" 
      @next="currentPage < totalPages ? currentPage++ : null" 
      @goto="page => currentPage = page" 
    />
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
</style>