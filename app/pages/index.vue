<script setup lang="ts">
import { getHomePageSchemas, useJsonLdSchemas } from '@/composables/useJsonLdSchema'

definePageMeta({
  layout: 'default',
  navOrder: 1,
  icon: 'i-mdi-home'
})

// SEO Optimization with Publisher & Author
useSeoOptimized('home')

// Inject JSON-LD Schemas untuk improved SEO
const schemas = getHomePageSchemas()
useJsonLdSchemas(schemas)
</script>

<template>
  <main>
    <!-- Hero Section: always render immediately (above the fold, LCP element) -->
    <HomeHeroSection />

    <!-- ═══ Weather Section ═══ -->
    <section aria-labelledby="weather-section" class="mt-7">
      <HomeWeatherSection />
    </section>

    <!-- ═══ Quick Access Section ═══ -->
    <section aria-labelledby="quick-access-section" class="mt-10">
      <h2 id="quick-access-section" class="sr-only">
        Akses Cepat Layanan JuruTani
      </h2>
      <HomeQuickAccess />
    </section>

    <!-- ═══ Promotion Section (below fold: defer rendering hingga scroll dekat) ═══ -->
    <section aria-labelledby="promotion-section" class="mt-16 perf-section">
      <h2 id="promotion-section" class="sr-only">
        Promosi Spesial
      </h2>
      <LazyHomePromotionSection />
    </section>

    <!-- ═══ Food Price Section ═══ -->
    <section aria-labelledby="food-price-section" class="mt-16 perf-section">
      <h2 id="food-price-section" class="sr-only">
        Informasi Harga Pangan
      </h2>
      <LazyHomeFoodPriceSection />
    </section>

    <!-- ═══ Testimonials Section ═══ -->
    <section aria-labelledby="testimonials-section" class="my-16 perf-section">
      <h2 id="testimonials-section" class="sr-only">
        Testimoni Pengguna
      </h2>
      <LazyHomeTestimoni />
    </section>

  </main>
</template>

<style>
/*
  content-visibility: auto — CSS modern yang memberitahu browser untuk melewati
  layout & rendering element yang belum terlihat di viewport.
  Dampak: browser tidak perlu mem-paint semua 5 section sekaligus saat load,
  sehingga mengurangi Main-Thread work secara signifikan.
  Tidak mempengaruhi tampilan atau UX sama sekali.
*/
.perf-section {
  content-visibility: auto;
  /* contain-intrinsic-size: memberitahu browser perkiraan ukuran
     sebelum elemen dirender, mencegah scroll jump */
  contain-intrinsic-size: 0 400px;
}
</style>