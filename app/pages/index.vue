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
    <!-- Hero Section with h1 -->
    <HomeHeroSection />
    
    <!-- Weather Section -->
    <section aria-labelledby="weather-section" class="mt-16">
      <h2 id="weather-section" class="sr-only">Informasi Cuaca Pertanian</h2>
      <HomeWeatherSection />
    </section>
    
    <!-- Promo Section -->
    <section aria-labelledby="promo-section" class="mt-16 sm:px-4">
      <h2 id="promo-section" class="sr-only">Promo dan Penawaran Spesial</h2>
      <HomeLaunchSale />
    </section>
    
    <!-- Hot Deals Section -->
    <section aria-labelledby="deals-section" class="mt-16">
      <h2 id="deals-section" class="sr-only">Penawaran Terbaik Hari Ini</h2>
      <HomeHotDeals />
    </section>
    
    <!-- Food Price Section -->
    <section aria-labelledby="food-price-section" class="mt-16">
      <h2 id="food-price-section" class="sr-only">Informasi Harga Pangan</h2>
      <HomeFoodPriceSection />
    </section>
    
    <!-- Features Section -->
    <section aria-labelledby="features-section" class="mt-16">
      <h2 id="features-section" class="sr-only">Fitur Unggulan JuruTani</h2>
      <HomeFeatureSection />
    </section>
    
    
    <!-- Sponsors Section -->
    <section aria-labelledby="sponsors-section" class="mt-16">
      <h2 id="sponsors-section" class="sr-only">Sponsor dan Mitra</h2>
      <HomeSponsorship />
    </section>
    
    <!-- Testimonials Section -->
    <section aria-labelledby="testimonials-section">
      <h2 id="testimonials-section" class="sr-only">Testimoni Pengguna</h2>
      <HomeTestimoni />
    </section>
    
    <!-- Android App Promotion Section -->
    <section aria-labelledby="android-app-section" class="my-16 container mx-auto px-4">
      <h2 id="android-app-section" class="sr-only">Download Aplikasi JuruTani di Android</h2>
      <HomeAndroidAppPromotion />
    </section>
    <!-- Chatbot -->
    <ChatbotJurutani />
  </main>
</template>


<style scoped></style>
