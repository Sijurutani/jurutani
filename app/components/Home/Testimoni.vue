<script setup lang="ts">
// Data testimoni pengguna JuruTani
const testimonialsBase = [
  {
    id: 1,
    name: 'Ahmad Blora',
    email: 'Bloraachmad@gmail.com',
    role: 'Petani Tanaman Pangan',
    description: 'Aplikasi JuruTani sangat membantu saya mendapatkan informasi tentang masalah pertanian. Contohnya tentang hama dan penyakit tanaman, saya bisa bertanya langsung lewat chat JuruTani.',
    avatar: 'https://ui-avatars.com/api/?name=Ahmad+Blora&background=10b981&color=fff',
    color: 'green',
    rating: 5
  },
  {
    id: 2,
    name: 'Fisya Hapsari',
    email: 'fisyanahapsari@gmail.com',
    role: 'UMKM Produk Pertanian',
    description: 'JuruTani bermanfaat untuk promosi produk saya untuk lebih dikenal banyak orang. Platform ini memberikan akses yang luas untuk memasarkan hasil pertanian saya.',
    avatar: 'https://ui-avatars.com/api/?name=Fisya+Hapsari&background=f59e0b&color=fff',
    color: 'blue',
    rating: 5
  },
  {
    id: 3,
    name: 'Sugeng',
    email: 'Sugeng2703@gmail.com',
    role: 'Petani Mitra',
    description: 'JuruTani solusi yang tepat untuk membantu saya menghubungi langsung ke penyuluh. Fitur komunikasi langsung ini sangat memudahkan saya dalam berkonsultasi tentang teknik bertani.',
    avatar: 'https://ui-avatars.com/api/?name=Sugeng&background=ef4444&color=fff',
    color: 'orange',
    rating: 5
  },
  {
    id: 4,
    name: 'Suwarni',
    email: 'Suwarni@gmail.com',
    role: 'Petani Sayuran',
    description: 'JuruTani mantap! Terdapat fitur cuaca dan kalkulator benih dan pupuk sebagai bahan pertimbangan dalam budidaya tanaman. Tools ini sangat membantu perencanaan pertanian saya.',
    avatar: 'https://ui-avatars.com/api/?name=Suwarni&background=8b5cf6&color=fff',
    color: 'yellow',
    rating: 5
  },
]

// Duplicate data untuk seamless infinite scroll
const testimonials = [...testimonialsBase, ...testimonialsBase, ...testimonialsBase]
</script>

<template>
  <div class="relative py-20 overflow-hidden bg-linear-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30">
    <!-- Decorative Elements -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-green-300/20 dark:bg-green-500/10 rounded-full blur-3xl" />
    <div class="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-200/30 dark:bg-emerald-600/10 rounded-full blur-3xl" />
    
    <UContainer class="relative z-10">
      <!-- Section Header -->
      <div class="mx-auto mb-12 max-w-4xl text-center">
        <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-linear-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
          <UIcon name="i-lucide-message-square-quote" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Testimoni Pengguna</span>
        </div>

        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent py-1">
          Kata Mereka Tentang JuruTani
        </h2>

        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Bergabunglah dengan ribuan petani yang telah merasakan manfaat 
          <span class="font-semibold text-emerald-600 dark:text-emerald-400">aplikasi JuruTani</span> dalam meningkatkan 
          <span class="font-semibold text-teal-600 dark:text-teal-400">produktivitas</span> dan 
          <span class="font-semibold text-cyan-600 dark:text-cyan-400">efisiensi</span> pertanian mereka.
        </p>
      </div>

      <!-- Testimonials Horizontal Scroll -->
      <div class="testimonials-wrapper">
        <div class="testimonials-grid">
          <!-- Testimonial Card -->
          <div 
            v-for="(testimonial, index) in testimonials" 
            :key="`${testimonial.id}-${index}`" 
            class="testimonial-card group animate-slide-up"
            :style="`animation-delay: ${(index % testimonialsBase.length) * 100}ms`"
          >
            <!-- Card Background with Gradient -->
            <div class="absolute inset-0 bg-linear-to-br from-white via-green-50/30 to-emerald-50/30 dark:from-green-900/80 dark:via-green-800/60 dark:to-emerald-900/80 rounded-2xl backdrop-blur-sm" />
            
            <!-- Border Glow Effect -->
            <div class="absolute inset-0 rounded-2xl bg-linear-to-br from-green-200/50 via-emerald-200/30 to-green-200/50 dark:from-green-700/50 dark:via-emerald-700/30 dark:to-green-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            
            <div class="relative z-10">
              <!-- Header dengan Avatar -->
              <div class="flex items-start gap-4 mb-4">
                <div class="relative flex-shrink-0">
                  <div class="absolute inset-0 bg-linear-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
                  <img
                    :src="testimonial.avatar"
                    :alt="testimonial.name"
                    class="relative w-14 h-14 rounded-full object-cover border-2 border-white/50 dark:border-green-700/50 shadow-lg"
                    loading="lazy"
                  >
                </div>
                
                <div class="flex-1 min-w-0">
                  <h3 class="text-base font-bold text-gray-900 dark:text-white truncate">
                    {{ testimonial.name }}
                  </h3>
                  <p class="text-sm text-green-600 dark:text-green-400 truncate">
                    {{ testimonial.role }}
                  </p>
                </div>
              </div>

              <!-- Rating Stars -->
              <div class="flex gap-1 mb-4">
                <UIcon 
                  v-for="star in testimonial.rating" 
                  :key="star"
                  name="i-lucide-star"
                  class="w-4 h-4 text-amber-400 fill-amber-400"
                />
              </div>

              <!-- Quote Icon -->
              <div class="mb-3">
                <UIcon 
                  name="i-heroicons-chat-bubble-left-right" 
                  class="w-8 h-8 text-green-500/40 dark:text-green-400/40"
                />
              </div>

              <!-- Testimonial Text -->
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm line-clamp-4 mb-4">
                "{{ testimonial.description }}"
              </p>

              <!-- Email with Icon -->
              <div class="flex items-center gap-2 pt-4 border-t border-green-100/50 dark:border-green-800/50">
                <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {{ testimonial.email }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Animation */
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

/* Testimonials Wrapper */
.testimonials-wrapper {
  overflow: hidden;
  width: 100%;
  position: relative;
  padding: 2rem 0;
}

.testimonials-grid {
  display: flex;
  gap: 1.5rem;
  animation: slideRightInfinite 60s linear infinite;
  width: max-content;
}

@keyframes slideRightInfinite {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-33.333% - 1.5rem));
  }
}

.testimonials-grid:hover {
  animation-play-state: paused;
}

/* Testimonial Card - Matching QuickHelp Style */
.testimonial-card {
  position: relative;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  min-width: 360px;
  width: 360px;
  border: 1px solid rgba(34, 197, 94, 0.1);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(34, 197, 94, 0.05);
}

.testimonial-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(34, 197, 94, 0.1);
}

/* Dark mode adjustments */
:global(.dark) .testimonial-card {
  border-color: rgba(34, 197, 94, 0.2);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(34, 197, 94, 0.1);
}

:global(.dark) .testimonial-card:hover {
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.4),
    0 10px 10px -5px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(34, 197, 94, 0.2);
}

/* Responsiveness */
@media (max-width: 768px) {
  .testimonials-grid {
    gap: 1rem;
  }

  .testimonial-card {
    min-width: 300px;
    width: 300px;
    padding: 1.25rem;
  }
}

@media (max-width: 640px) {
  .testimonial-card {
    min-width: 280px;
    width: 280px;
    padding: 1rem;
  }
}
</style>
