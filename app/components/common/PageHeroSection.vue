<script setup lang="ts">
/**
 * PageHeroSection - Reusable Hero Section Component
 * Modern futuristic design with gradient backgrounds and animations
 */

interface Props {
  title: string
  subtitle?: string
  badge?: {
    text: string
    icon?: string
  }
  decorative?: 'gradient' | 'pattern' | 'ripple'
  cta?: {
    text: string
    link?: string
    action?: () => void
  }
  align?: 'left' | 'center'
  minHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  decorative: 'gradient',
  align: 'center',
  minHeight: 'auto'
})

const handleCtaClick = () => {
  if (props.cta?.action) {
    props.cta.action()
  }
}
</script>

<template>
  <section 
    class="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24 transition-colors duration-300"
    :class="{ 'min-h-screen': minHeight === 'screen' }"
  >
    <!-- Background Decorative Elements -->
    <div v-if="decorative === 'gradient'" class="absolute inset-0 bg-linear-to-br from-green-600/10 via-emerald-500/5 to-green-700/10 dark:from-green-700/20 dark:via-emerald-600/10 dark:to-green-800/20" />
    
    <div v-else-if="decorative === 'pattern'" class="absolute inset-0 opacity-10 dark:opacity-5">
      <svg class="h-full w-full" viewBox="0 0 800 800">
        <pattern id="hero-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.6" fill="currentColor" class="text-green-600 dark:text-green-400"/>
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#hero-pattern)"/>
      </svg>
    </div>

    <div v-else-if="decorative === 'ripple'" class="absolute inset-0">
      <BackgroundRipple />
    </div>

    <!-- Content Container -->
    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <div 
        class="max-w-4xl mx-auto animate-fade-in"
        :class="{
          'text-center': align === 'center',
          'text-left': align === 'left'
        }"
      >
        <!-- Badge -->
        <div 
          v-if="badge" 
          class="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-700 backdrop-blur-sm"
          :class="{ 'mx-auto': align === 'center' }"
        >
          <UIcon v-if="badge.icon" :name="badge.icon" class="text-green-600 dark:text-green-400" />
          <span class="text-sm font-medium text-green-700 dark:text-green-300">{{ badge.text }}</span>
        </div>

        <!-- Title with Gradient Text -->
        <h1 
          class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-linear-to-r from-green-700 via-emerald-600 to-green-800 dark:from-green-400 dark:via-emerald-400 dark:to-green-500 bg-clip-text text-transparent animate-slide-up"
        >
          {{ title }}
        </h1>

        <!-- Decorative Divider -->
        <div 
          class="w-24 h-1 mb-6 bg-linear-to-r from-green-500 to-emerald-500 rounded-full"
          :class="{ 'mx-auto': align === 'center' }"
        />

        <!-- Subtitle -->
        <p 
          v-if="subtitle"
          class="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed animate-slide-up"
          style="animation-delay: 150ms"
        >
          {{ subtitle }}
        </p>

        <!-- CTA Button -->
        <div v-if="cta" class="animate-slide-up" style="animation-delay: 300ms">
          <UButton
            v-if="cta.link"
            :to="cta.link"
            size="lg"
            class="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {{ cta.text }}
          </UButton>
          <UButton
            v-else
            size="lg"
            class="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            @click="handleCtaClick"
          >
            {{ cta.text }}
          </UButton>
        </div>

        <!-- Slot for additional content -->
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out both;
}
</style>
