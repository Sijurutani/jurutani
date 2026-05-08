<script setup lang="ts">
  /**
   * IconInfoCard - Single Card with Icon, Title, Description
   * Modern card design with hover effects and glassmorphism
   */

  interface Props {
    icon: string
    title: string
    description: string
    color?: string
    link?: string
    variant?: 'default' | 'outlined' | 'gradient'
    hoverable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    color: 'green',
    variant: 'default',
    hoverable: true,
  })

  const colorClass = computed(() => {
    const colors: Record<string, string> = {
      green:
        'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
      blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
      emerald:
        'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    }
    return colors[props.color] || colors.green
  })

  const cardClass = computed(() => {
    const base =
      'group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 h-full'

    if (props.variant === 'outlined') {
      return `${base} bg-white dark:bg-gray-800/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 ${props.hoverable ? 'hover:border-green-500 dark:hover:border-green-400 hover:shadow-xl hover:-translate-y-2' : ''}`
    }

    if (props.variant === 'gradient') {
      return `${base} bg-linear-to-br from-white via-white to-green-50/50 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-green-900/20 shadow-md border border-gray-100 dark:border-gray-700/50 ${props.hoverable ? 'hover:shadow-2xl hover:-translate-y-2 hover:border-green-200 dark:hover:border-green-800' : ''}`
    }

    // Default variant
    return `${base} bg-white dark:bg-gray-800/70 backdrop-blur-sm shadow-sm border border-gray-200 dark:border-gray-700/50 ${props.hoverable ? 'hover:shadow-xl hover:-translate-y-2 hover:border-green-300 dark:hover:border-green-700' : ''}`
  })
</script>

<template>
  <component :is="link ? 'NuxtLink' : 'div'" :to="link" class="block h-full">
    <div :class="cardClass">
      <!-- Hover Glow Effect -->
      <div
        v-if="hoverable"
        class="absolute inset-0 bg-linear-to-br from-green-500/0 via-emerald-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:via-emerald-500/5 group-hover:to-green-500/10 transition-all duration-500 pointer-events-none rounded-2xl"
      />

      <!-- Shine Effect -->
      <div
        v-if="hoverable"
        class="shine-sweep absolute -inset-full top-0 block h-full w-1/2 bg-linear-to-r from-transparent to-white/10"
      />

      <!-- Content Container -->
      <div class="relative z-10 flex flex-col h-full">
        <!-- Icon -->
        <div
          class="inline-flex items-center justify-center w-14 h-14 mb-5 rounded-xl transition-all duration-300 shadow-sm"
          :class="[
            colorClass,
            hoverable
              ? 'group-hover:scale-110 group-hover:shadow-md group-hover:rotate-3'
              : '',
          ]"
        >
          <UIcon :name="icon" class="text-2xl" />
        </div>

        <!-- Title -->
        <h3
          class="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300 group-hover:text-green-700 dark:group-hover:text-green-400"
        >
          {{ title }}
        </h3>

        <!-- Description -->
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
          {{ description }}
        </p>

        <!-- Link Indicator -->
        <div
          v-if="link"
          class="flex items-center gap-2 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700/50 text-green-600 dark:text-green-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
        >
          <span>Lihat detail</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="text-sm transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </div>
  </component>
</template>

<style scoped>
  .shine-sweep {
    opacity: 0;
    transform: translateX(-120%) skewX(-12deg);
    transition:
      transform 0.75s ease,
      opacity 0.75s ease;
  }

  .group:hover .shine-sweep {
    opacity: 0.4;
    transform: translateX(220%) skewX(-12deg);
  }
</style>
