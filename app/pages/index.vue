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
    <!-- Hero Section -->
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

    <!-- ═══ Promotion Section -->
    <section aria-labelledby="promotion-section" class="mt-16">
      <h2 id="promotion-section" class="sr-only">
        Promosi Spesial
      </h2>
      <LazyHomePromotionSection />
    </section>

    <!-- ═══ Food Price Section -->
    <section aria-labelledby="food-price-section" class="mt-16">
      <h2 id="food-price-section" class="sr-only">
        Informasi Harga Pangan
      </h2>
      <LazyHomeFoodPriceSection />
    </section>

    <!-- ═══ Testimonials Section -->
    <section aria-labelledby="testimonials-section" class="my-16">
      <h2 id="testimonials-section" class="sr-only">
        Testimoni Pengguna
      </h2>
      <LazyHomeTestimoni />
    </section>

  </main>
</template>