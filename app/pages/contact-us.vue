<script setup lang="ts">
import type { FaqItem } from '~/data/types'

// SEO Optimization
useSeoOptimized('contact')

// Contact methods data
const contactMethods = [
  {
    icon: 'i-heroicons-phone',
    title: 'Telepon Kami',
    description: 'Layanan panggilan tersedia Senin - Jumat, 09:00 - 16:00 WIB',
    value: '+62 815 7552 5260',
    color: 'blue',
    link: 'tel:+6281575525260'
  },
  {
    icon: 'i-heroicons-envelope',
    title: 'Email Kami',
    description: 'Kirim email dan tim kami akan merespon secepatnya',
    value: 'si.jurutani@gmail.com',
    color: 'emerald',
    link: 'mailto:si.jurutani@gmail.com'
  },
  {
    icon: 'i-heroicons-map-pin',
    title: 'Lokasi Kami',
    description: 'Kunjungi kantor kami untuk diskusi langsung',
    value: 'Jl. Kusumanegara No.2, Yogyakarta',
    color: 'green',
    link: 'https://maps.app.goo.gl/UPTBRghSuHci7GxR7'
  }
]

// FAQ data
const faqs: FaqItem[] = [
  {
    question: 'Layanan apa saja yang disediakan oleh JuruTani?',
    answer: 'JuruTani menyediakan layanan konsultasi pertanian yang komprehensif, solusi teknologi pertanian, sistem manajemen tanaman, platform koneksi pasar, dan sumber belajar untuk praktik pertanian berkelanjutan.'
  },
  {
    question: 'Bagaimana cara bergabung dengan komunitas JuruTani?',
    answer: 'Anda dapat mendaftar melalui aplikasi seluler atau situs web kami. Setelah terdaftar, Anda akan mendapatkan akses ke basis pengetahuan, forum komunitas, dan layanan pertanian yang dipersonalisasi.'
  },
  {
    question: 'Apakah JuruTani tersedia di wilayah saya?',
    answer: 'JuruTani saat ini melayani berbagai wilayah di seluruh Indonesia. Silakan hubungi tim dukungan kami dengan lokasi spesifik Anda untuk memeriksa ketersediaan di daerah Anda.'
  },
  {
    question: 'Berapa lama waktu respon tim support?',
    answer: 'Tim support kami berusaha merespon setiap pertanyaan dalam waktu maksimal 24 jam pada hari kerja. Untuk pertanyaan mendesak, Anda dapat menghubungi kami melalui telepon.'
  }
]

// Scroll to form
const scrollToForm = () => {
  const element = document.getElementById('contact-form')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="min-h-screen max-w-6xl mx-auto w-full">
    <!-- Hero Section -->
    <CommonPageHeroSection
      title="Hubungi Tim JuruTani"
      subtitle="Kami siap membantu komunitas pertanian Indonesia berkembang. Sampaikan pertanyaan Anda dan mari berkembang bersama."
      :badge="{ text: 'Contact Us', icon: 'i-heroicons-chat-bubble-left-right' }"
      align="center"
      decorative="ripple"
      :cta="{ text: 'Hubungi Sekarang', action: scrollToForm }"
    />

    <!-- Contact Methods Section -->
    <div class="relative py-20 overflow-hidden">
      <!-- Floating Background Elements -->
      <div class="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-3xl animate-pulse" />
      <div class="absolute bottom-10 left-10 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;" />
      
      <div class="container mx-auto px-4 sm:px-6 relative z-10">
        <CommonSectionHeader
          title="Cara Menghubungi Kami"
          subtitle="Pilih metode komunikasi yang paling nyaman untuk Anda"
          align="center"
          class="mb-16"
        />
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(method, index) in contactMethods"
            :key="index"
            class="animate-slide-up"
            :style="`animation-delay: ${index * 100}ms`"
          >
            <NuxtLink
              :to="method.link"
              :target="method.link.startsWith('http') ? '_blank' : undefined"
              class="block h-full group"
            >
              <div class="relative h-full overflow-hidden rounded-2xl p-8 transition-all duration-300 bg-linear-to-br from-white via-white to-green-50/50 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-green-900/20 shadow-md border border-gray-100 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-2 hover:border-green-200 dark:hover:border-green-800">
                <!-- Hover Glow -->
                <div class="absolute inset-0 bg-linear-to-br from-green-500/0 via-emerald-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:via-emerald-500/5 group-hover:to-green-500/10 transition-all duration-500 pointer-events-none rounded-2xl" />
                
                <!-- Icon -->
                <div 
                  class="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-xl transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:rotate-3"
                  :class="`bg-${method.color}-100 dark:bg-${method.color}-900/40 text-${method.color}-600 dark:text-${method.color}-400`"
                >
                  <UIcon :name="method.icon" class="text-3xl" />
                </div>

                <!-- Content -->
                <div class="relative z-10">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300 group-hover:text-green-700 dark:group-hover:text-green-400">
                    {{ method.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {{ method.description }}
                  </p>
                  <div class="font-semibold text-green-600 dark:text-green-400 break-words">
                    {{ method.value }}
                  </div>
                </div>

                <!-- Link Indicator -->
                <div class="flex items-center gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700/50 text-green-600 dark:text-green-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span>Hubungi via {{ method.title.toLowerCase() }}</span>
                  <UIcon name="i-heroicons-arrow-right" class="text-sm transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Form & Map Section -->
    <div id="contact-form" class="relative py-20">
      <!-- Decorative Grid Pattern -->
      <div class="absolute inset-0 opacity-[0.02] dark:opacity-[0.01]">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle, #22c55e 1px, transparent 1px); background-size: 30px 30px;" />
      </div>

      <div class="container mx-auto px-4 sm:px-6 relative z-10">
        <CommonSectionHeader
          title="Hubungi Kami"
          subtitle="Jika Anda memiliki pertanyaan atau membutuhkan bantuan, jangan ragu untuk menghubungi kami."
          align="center"
          class="mb-16"
        />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">          
          <!-- Map & Location Info -->
          <div class="space-y-6">
            <!-- Location Info Card -->
            <div class="bg-linear-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-900/20 dark:via-emerald-900/10 dark:to-green-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800/50">
              <div class="flex items-start gap-4 mb-6">
                <div class="shrink-0 w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <UIcon name="i-heroicons-map-pin" class="text-2xl text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                    Alamat Kantor
                  </h3>
                  <p class="text-green-700 dark:text-green-300 leading-relaxed">
                    Jl. Kusumanegara No.2, Tahunan<br >
                    Kec. Umbulharjo, Kota Yogyakarta<br >
                    Daerah Istimewa Yogyakarta 55167
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 mb-6">
                <div class="shrink-0 w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <UIcon name="i-heroicons-clock" class="text-2xl text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                    Jam Operasional
                  </h3>
                  <p class="text-green-700 dark:text-green-300">
                    Senin - Jumat: 09:00 - 17:00 WIB<br >
                    Sabtu - Minggu: Tutup
                  </p>
                </div>
              </div>

              <UButton
                to="https://maps.app.goo.gl/UPTBRghSuHci7GxR7"
                target="_blank"
                block
                size="lg"
                variant="outline"
                color="primary"
                class="mt-6"
              >
                <UIcon name="i-heroicons-map" class="mr-2" />
                Buka di Google Maps
              </UButton>
            </div>
          </div>

          <!-- Google Maps Canvas -->
          <div class="relative">
            <!-- Glow Effect -->
            <div class="absolute -inset-1 bg-linear-to-r from-blue-600 to-emerald-600 rounded-2xl blur opacity-20" />
            
            <div class="relative bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700/50">
              <!-- Map Header -->
              <div class="p-6 border-b border-gray-200 dark:border-gray-700/50">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      Peta Lokasi
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Jl. Kusumanegara No.2, Yogyakarta
                    </p>
                  </div>
                  <UButton
                    to="https://maps.app.goo.gl/UPTBRghSuHci7GxR7"
                    target="_blank"
                    size="sm"
                    variant="outline"
                    color="primary"
                  >
                    <UIcon name="i-heroicons-arrow-top-right-on-square" class="mr-1" />
                    Buka Maps
                  </UButton>
                </div>
              </div>

              <!-- Map Container -->
              <div class="relative aspect-[16/10] bg-gray-100 dark:bg-gray-900">
                <!-- Loading Skeleton -->
                <div class="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse" />
                
                <!-- Google Maps Iframe -->
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.0446280892394!2d110.39089007501!3d-7.789999992218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5a1c5c8c8c8d%3A0x1c8c8c8c8c8c8c8c!2sJl.%20Kusumanegara%20No.2%2C%20Tahunan%2C%20Kec.%20Umbulharjo%2C%20Kota%20Yogyakarta%2C%20Daerah%20Istimewa%20Yogyakarta%2055167!5e0!3m2!1sid!2sid!4v1704430000000!5m2!1sid!2sid"
                  class="absolute inset-0 w-full h-full border-0"
                  style="filter: grayscale(0%) contrast(100%);"
                  :allowfullscreen="true"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Lokasi Kantor JuruTani"
                />
              </div>

              <!-- Map Footer with Quick Actions -->
              <div class="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700/50">
                <div class="flex flex-wrap gap-3">
                  <a
                    href="https://maps.app.goo.gl/UPTBRghSuHci7GxR7"
                    target="_blank"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <UIcon name="i-heroicons-map-pin" class="text-green-600 dark:text-green-400" />
                    Lihat Rute
                  </a>
                  <a
                    href="https://maps.app.goo.gl/UPTBRghSuHci7GxR7"
                    target="_blank"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <UIcon name="i-heroicons-share" class="text-blue-600 dark:text-blue-400" />
                    Bagikan Lokasi
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="relative py-20 overflow-hidden">
      <!-- Gradient Background -->
      <div class="absolute inset-0 " />
      
      <div class="container mx-auto px-4 sm:px-6 relative z-10">
        <CommonSectionHeader
          title="Pertanyaan Umum"
          subtitle="Temukan jawaban cepat untuk pertanyaan yang sering diajukan"
          align="center"
          class="mb-16"
        />
        
        <div class="max-w-4xl mx-auto">
          <CommonFaqAccordion :items="faqs" default-open />
          
          <!-- CTA Card -->
          <div class="mt-12 relative overflow-hidden rounded-2xl bg-linear-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-900/20 dark:via-emerald-900/10 dark:to-green-900/20 border border-green-200 dark:border-green-800/50 p-8 text-center">
            <div class="absolute top-0 right-0 w-64 h-64 bg-green-300/10 dark:bg-green-700/10 rounded-full blur-3xl" />
            <div class="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/10 dark:bg-emerald-700/10 rounded-full blur-3xl" />
            
            <div class="relative z-10">
              <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-green-100 dark:bg-green-900/50">
                <UIcon name="i-heroicons-question-mark-circle" class="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h3 class="text-2xl font-bold text-green-900 dark:text-green-100 mb-3">
                Masih ada pertanyaan?
              </h3>
              <p class="text-green-700 dark:text-green-300 mb-6 max-w-2xl mx-auto">
                Tim support kami siap membantu Anda. Jangan ragu untuk menghubungi kami!
              </p>
              
              <UButton 
                size="lg"
                class="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                @click="scrollToForm"
              >
                <UIcon name="i-heroicons-chat-bubble-left-right" class="mr-2" />
                Hubungi Tim Kami
              </UButton>
            </div>
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