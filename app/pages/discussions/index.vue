<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
 
import { discussionServices, discussionStatsFallback } from '~/data/discussion'

definePageMeta({
  layout: 'default',
})

// SEO Optimization
useSeoOptimized('discussions')

const supabase = useSupabaseClient()

const profilesCount = ref(0)
const instructorsCount = ref(0)
const expertsCount = ref(0)
const loading = ref(false)
const error = ref<any>(null)

const profilesDisplayCount = ref(0)
const instructorsDisplayCount = ref(0)
const expertsDisplayCount = ref(0)
const statsVisible = ref(false)

const services = ref(discussionServices)

let observer: IntersectionObserver | null = null
const statsRef = ref<HTMLElement>()

const animateCounter = (
  from: number,
  to: number,
  displayRef: any,
  duration: number = 2000
) => {
  const increment = (to - from) / (duration / 16)
  let current = from
  
  const updateCounter = () => {
    current += increment
    if (current < to) {
      displayRef.value = Math.floor(current)
      requestAnimationFrame(updateCounter)
    } else {
      displayRef.value = to
    }
  }
  
  updateCounter()
}

const startAnimations = () => {
  if (statsVisible.value) return
  
  statsVisible.value = true
  
  const profilesTarget = profilesCount.value > 0 ? profilesCount.value : discussionStatsFallback.profiles
  const instructorsTarget = instructorsCount.value > 0 ? instructorsCount.value : discussionStatsFallback.instructors
  const expertsTarget = expertsCount.value > 0 ? expertsCount.value : discussionStatsFallback.experts
  
  setTimeout(() => animateCounter(0, profilesTarget, profilesDisplayCount), 100)
  setTimeout(() => animateCounter(0, instructorsTarget, instructorsDisplayCount), 200)
  setTimeout(() => animateCounter(0, expertsTarget, expertsDisplayCount), 300)
}

const fetchCounts = async () => {
  loading.value = true
  error.value = null

  try {
    const [profiles, instructors, experts] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('instructors').select('*', { count: 'exact', head: true }),
      supabase.from('experts').select('*', { count: 'exact', head: true })
    ])

    if (profiles.error || instructors.error || experts.error) {
      throw profiles.error || instructors.error || experts.error
    }

    profilesCount.value = profiles.count || 0
    instructorsCount.value = instructors.count || 0
    expertsCount.value = experts.count || 0
    
    if (statsVisible.value) {
      statsVisible.value = false
      startAnimations()
    }
  } catch (err) {
    console.error('Error fetching counts:', err)
    error.value = err
    
    profilesCount.value = 0
    instructorsCount.value = 0
    expertsCount.value = 0
  } finally {
    loading.value = false
  }
}

// Bento grid variant logic
const getBentoVariant = (index: number) => {
  if (index === 0) return 'large'
  if (index === 3) return 'wide'
  return 'default'
}

onMounted(() => {
  fetchCounts()
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsVisible.value) {
          startAnimations()
        }
      })
    },
    {
      threshold: 0.5
    }
  )
  
  if (statsRef.value) {
    observer.observe(statsRef.value)
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <UContainer class="py-12">
    <div class="mx-auto mb-16 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-linear-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Platform Diskusi Pertanian #1 Indonesia</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Forum Diskusi JuruTani
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Temukan solusi pertanian terbaik melalui diskusi interaktif dengan 
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">penyuluh berpengalaman</span>, 
        <span class="font-semibold text-teal-600 dark:text-teal-400">pakar pertanian</span>, dan 
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">komunitas petani</span> seluruh Indonesia.
      </p> 
    </div>

    <!-- Bento Grid Services -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto mb-16 auto-rows-auto">
      <DiscussionsServiceCard 
        v-for="(service, index) in services" 
        :key="service.id" 
        :service="service"
        :variant="getBentoVariant(index)"
        :index="index"
      />
    </div>

    <!-- Statistics Section -->
    <div class="mx-auto max-w-6xl">
      <div class="rounded-3xl bg-linear-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-700 p-8">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-green-100 dark:bg-green-800 rounded-full">
            <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-green-600 dark:text-green-400" />
            <span class="text-sm font-medium text-green-700 dark:text-green-300">Keunggulan Platform JuruTani</span>
          </div>
          
          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Mengapa Memilih JuruTani?
          </h3>
          
          <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Platform terdepan untuk konsultasi pertanian yang menghubungkan petani dengan para ahli dan komunitas
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-lucide-user-check" class="w-8 h-8 text-white" />
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Terverifikasi & Terpercaya</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Semua penyuluh dan pakar telah melalui proses verifikasi ketat dan memiliki sertifikasi resmi</p>
          </div>
          
          <div class="text-center group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-lucide-clock" class="w-8 h-8 text-white" />
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Respon Super Cepat</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Dapatkan jawaban dalam hitungan menit dari komunitas aktif dan tim support 24/7</p>
          </div>
          
          <div class="text-center group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-amber-400 to-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-lucide-star" class="w-8 h-8 text-white" />
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">100% Gratis</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Seluruh layanan konsultasi dan diskusi tersedia gratis untuk mendukung kemajuan pertanian Indonesia</p>
          </div>
        </div>
        
        <div ref="statsRef" class="mt-8 pt-8 border-t border-green-200 dark:border-green-700">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div class="stats-item">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400 transition-all duration-300">
                {{ profilesDisplayCount > 0 ? `${profilesDisplayCount}+` : '500+' }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Petani Bergabung</div>
            </div>
            <div class="stats-item">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400 transition-all duration-300">
                {{ instructorsDisplayCount > 0 ? `${instructorsDisplayCount}+` : '400+' }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Penyuluh Aktif</div>
            </div>
            <div class="stats-item">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400 transition-all duration-300">
                {{ expertsDisplayCount > 0 ? `${expertsDisplayCount}+` : '200+' }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Pakar Ahli</div>
            </div>
            <div class="stats-item">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">98%</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Tingkat Kepuasan</div>
            </div>
          </div>
          
          <div v-if="loading" class="text-center mt-4">
            <div class="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"/>
              Memuat data terbaru...
            </div>
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-item {
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp 0.6s ease-out forwards;
}

.stats-item:nth-child(1) { animation-delay: 0.1s; }
.stats-item:nth-child(2) { animation-delay: 0.2s; }
.stats-item:nth-child(3) { animation-delay: 0.3s; }
.stats-item:nth-child(4) { animation-delay: 0.4s; }

.stats-item .text-2xl {
  font-variant-numeric: tabular-nums;
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>