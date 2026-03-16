<script setup lang="ts">
import { 
  faqCategories, 
  faqData, 
  quickHelpCards, 
  supportResources 
} from '~/data/faq'
import type { FaqItem } from '~/data/types'

// SEO Optimization
useSeoOptimized('help')

// Categories logic
const categories = faqCategories
const activeCategory = ref('general')

// Search state
const searchQuery = ref('')

// Map data to array format required by FaqAccordion
const activeFaqs = computed((): FaqItem[] => {
  let items = faqData[activeCategory.value] || []
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => 
      item.question.toLowerCase().includes(query) || 
      item.answer.toLowerCase().includes(query)
    )
  }
  
  return items
})

// Scroll handler
const scrollToFaqs = () => {
  const element = document.getElementById('faq-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="min-h-screen w-full max-w-6xl mx-auto">
    <!-- 1. Hero Section Component -->
    <CommonPageHeroSection
      title="Pusat Bantuan JuruTani"
      subtitle="Temukan jawaban, panduan, dan dukungan yang Anda butuhkan untuk memaksimalkan hasil pertanian Anda bersama JuruTani."
      :badge="{ text: 'Help Center', icon: 'i-lucide-help-circle' }"
      align="center"
      decorative="ripple"
      :cta="{ text: 'Cari Bantuan', action: scrollToFaqs }"
    />

    <!-- 2. Quick Help Cards Section -->
    <div class="relative py-20 overflow-hidden">
      <div class="container mx-auto px-4 sm:px-6 relative z-10">
        <CommonSectionHeader
          title="Bantuan Cepat"
          subtitle="Akses langsung ke layanan bantuan yang paling sering digunakan"
          align="center"
          class="mb-16"
        />
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(card, index) in quickHelpCards"
            :key="index"
            class="animate-slide-up"
            :style="`animation-delay: ${index * 100}ms`"
          >
            <CommonIconInfoCard
              v-bind="card"
              hoverable
              variant="gradient"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 3. FAQ Accordion Section -->
    <div id="faq-section" class="relative py-20">
      <div class="container mx-auto px-4 sm:px-6 relative z-10">
        <CommonSectionHeader
          title="Pertanyaan Umum (FAQ)"
          subtitle="Jawaban untuk pertanyaan yang sering diajukan oleh pengguna kami"
          align="center"
          class="mb-12"
        />

        <!-- Search Bar with Enhanced Design -->
        <div class="mb-12 max-w-2xl mx-auto">
          <div class="relative group">
            <!-- Glow Effect -->
            <div class="absolute -inset-1 bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
            
            <div class="relative">
              <AppSearchBar
                v-model="searchQuery"
                placeholder="Cari pertanyaan, topik, atau kata kunci..."
                class="relative z-10"
              />
            </div>
          </div>

          <!-- Search Stats -->
          <div v-if="searchQuery" class="mt-4 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Ditemukan 
              <span class="font-bold text-green-600 dark:text-green-400">{{ activeFaqs.length }}</span> 
              hasil untuk 
              <span class="font-semibold">"{{ searchQuery }}"</span>
            </p>
          </div>
        </div>

        <!-- Category Filter -->
        <div class="mb-12">
          <CommonCategoryFilter
            :categories="categories"
            :active-category="activeCategory"
            @update:category="activeCategory = $event"
          />
        </div>

        <!-- FAQ Accordion -->
        <div class="max-w-4xl mx-auto">
          <CommonFaqAccordion
            :items="activeFaqs"
            default-open
          >
            <!-- Custom Empty State -->
            <template #empty>
              <div class="text-center py-20 px-6">
                <div class="max-w-md mx-auto">
                  <!-- Animated Icon -->
                  <div class="relative inline-block mb-6">
                    <div class="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping" />
                    <div class="relative w-20 h-20 bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-full flex items-center justify-center">
                      <UIcon name="i-heroicons-magnifying-glass" class="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Tidak ada hasil ditemukan
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-6">
                    Tidak ada pertanyaan yang cocok dengan pencarian Anda di kategori 
                    <span class="font-semibold text-green-600 dark:text-green-400">
                      {{ categories.find(c => c.id === activeCategory)?.name }}
                    </span>
                  </p>
                  
                  <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <UButton 
                      variant="solid" 
                      color="primary" 
                      size="lg"
                      @click="searchQuery = ''"
                    >
                      <UIcon name="i-heroicons-arrow-path" class="mr-2" />
                      Hapus Pencarian
                    </UButton>
                    <UButton 
                      variant="outline" 
                      color="primary" 
                      to="/contact-us"
                      size="lg"
                    >
                      <UIcon name="i-heroicons-chat-bubble-left-right" class="mr-2" />
                      Hubungi Kami
                    </UButton>
                  </div>
                </div>
              </div>
            </template>
          </CommonFaqAccordion>

          <!-- Still Need Help Card -->
          <div 
            v-if="activeFaqs.length > 0" 
            class="mt-12 relative overflow-hidden rounded-2xl bg-linear-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-900/20 dark:via-emerald-900/10 dark:to-green-900/20 border border-green-200 dark:border-green-800/50 p-8"
          >
            <!-- Decorative Elements -->
            <div class="absolute top-0 right-0 w-64 h-64 bg-green-300/10 dark:bg-green-700/10 rounded-full blur-3xl" />
            <div class="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/10 dark:bg-emerald-700/10 rounded-full blur-3xl" />
            
            <div class="relative z-10 text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-green-100 dark:bg-green-900/50">
                <UIcon name="i-heroicons-question-mark-circle" class="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h4 class="text-2xl font-bold text-green-900 dark:text-green-100 mb-3">
                Masih belum menemukan jawaban?
              </h4>
              <p class="text-base text-green-700 dark:text-green-300 mb-6 max-w-2xl mx-auto">
                Tim support kami siap membantu permasalahan spesifik Anda. Jangan ragu untuk menghubungi kami kapan saja.
              </p>
              
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <UButton 
                  to="/contact-us" 
                  size="lg"
                  class="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <UIcon name="i-heroicons-chat-bubble-left-right" class="mr-2" />
                  Hubungi Support
                </UButton>
                <UButton 
                  to="/discussions" 
                  variant="outline" 
                  color="primary"
                  size="lg"
                >
                  <UIcon name="i-heroicons-users" class="mr-2" />
                  Tanya Komunitas
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Support Resources Section -->
    <div class="relative py-20 overflow-hidden">

      <div class="container mx-auto px-4 sm:px-6 relative z-10">
        <CommonSectionHeader
          title="Sumber Belajar Tambahan"
          subtitle="Perkaya wawasan pertanian Anda dengan materi edukasi kami"
          align="center"
          class="mb-16"
        />
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(resource, index) in supportResources"
            :key="index"
            class="animate-slide-up"
            :style="`animation-delay: ${index * 150}ms`"
          >
            <CommonIconInfoCard
              v-bind="resource"
              hoverable
              variant="gradient"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 5. CTA Section with Ripple Background -->
    <div class="relative py-24 overflow-hidden text-gray-900 dark:text-white">
      <div class="container mx-auto px-4 relative z-10 text-center">
        <!-- Floating Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <UIcon name="i-heroicons-sparkles" class="text-green-600 dark:text-green-400" />
          <span class="text-sm font-medium text-gray-900 dark:text-white">Butuh Bantuan Lebih?</span>
        </div>

        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Tidak Menemukan Apa yang Anda Cari?
        </h2>
        <p class="text-gray-700 dark:text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          Jangan ragu untuk menghubungi tim JuruTani. Kami berkomitmen untuk mendampingi setiap langkah perjalanan bertani Anda dengan solusi terbaik.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            to="/contact-us"
            size="xl"
            class="bg-white text-green-700 font-bold hover:bg-green-50 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
          >
            <UIcon name="i-lucide-message-square" class="mr-2" />
            Chat dengan CS
          </UButton>
          <UButton
            to="/discussions/expert"
            size="xl"
            variant="outline"
            class=" border-2 border-white hover:bg-white/10 backdrop-blur-sm shadow-xl hover:scale-105 transition-all duration-300"
          >
            <UIcon name="i-lucide-user-check" class="mr-2" />
            Konsultasi Pakar
          </UButton>
        </div>

        <!-- Trust Indicators -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">Dukungan Pelanggan</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">10K+</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">Pertanyaan Terjawab</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">98%</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">Tingkat Kepuasan</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out both;
}
</style>