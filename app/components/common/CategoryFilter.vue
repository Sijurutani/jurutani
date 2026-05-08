<script setup lang="ts">
  /**
   * CommonCategoryFilter.vue
   * Modern category filter with pill design and smooth animations
   */

  export interface CategoryItem {
    id: string
    name: string
    icon?: string
  }

  defineProps<{
    categories: CategoryItem[]
    activeCategory: string
  }>()

  const emit = defineEmits<{
    'update:category': [id: string]
  }>()
</script>

<template>
  <div class="relative">
    <!-- Decorative Background -->
    <div
      class="absolute inset-0 bg-linear-to-r from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-green-900/10 dark:via-emerald-900/5 dark:to-green-900/10 rounded-2xl blur-xl opacity-50"
    />

    <!-- Filter Container -->
    <div
      class="relative flex flex-wrap justify-center gap-3 p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
    >
      <UButton
        color="neutral"
        variant="ghost"
        v-for="category in categories"
        :key="category.id"
        class="group relative inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden"
        :class="[
          activeCategory === category.id
            ? 'bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-105'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 hover:shadow-md hover:scale-105',
        ]"
        @click="emit('update:category', category.id)"
      >
        <!-- Animated Background Gradient -->
        <div
          v-if="activeCategory !== category.id"
          class="absolute inset-0 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <!-- Ripple Effect on Active -->
        <div
          v-if="activeCategory === category.id"
          class="absolute inset-0 rounded-full bg-green-400/15"
        />

        <!-- Icon -->
        <UIcon
          v-if="category.icon"
          :name="category.icon"
          class="relative z-10 mr-2 w-4 h-4 transition-transform duration-300 group-hover:scale-110"
        />

        <!-- Label -->
        <span class="relative z-10">{{ category.name }}</span>

        <!-- Active Indicator Dot -->
        <span
          v-if="activeCategory === category.id"
          class="relative z-10 ml-2 w-1.5 h-1.5 rounded-full bg-white"
        />
      </UButton>
    </div>
  </div>
</template>
