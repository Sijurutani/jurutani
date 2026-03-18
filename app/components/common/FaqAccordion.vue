<script setup lang="ts">
/**
 * FaqAccordion - Enhanced FAQ Accordion Component
 * Modern accordion with smooth animations and glassmorphism
 */

import type { FaqItem } from '~/data/types'

interface Props {
  items: FaqItem[]
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false
})

const openItems = ref<number[]>(props.defaultOpen ? [0] : [])

const toggleItem = (index: number) => {
  const itemIndex = openItems.value.indexOf(index)
  if (itemIndex > -1) {
    openItems.value.splice(itemIndex, 1)
  } else {
    openItems.value.push(index)
  }
}

const isOpen = (index: number) => openItems.value.includes(index)
</script>

<template>
  <div class="w-full space-y-3">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:border-green-300 dark:hover:border-green-700"
    >
      <!-- Gradient Overlay on Hover -->
      <div class="absolute inset-0 bg-linear-to-r from-green-50/0 via-emerald-50/0 to-green-50/0 dark:from-green-900/0 dark:via-emerald-900/0 dark:to-green-900/0 group-hover:from-green-50/30 group-hover:via-emerald-50/20 group-hover:to-green-50/30 dark:group-hover:from-green-900/10 dark:group-hover:via-emerald-900/5 dark:group-hover:to-green-900/10 transition-all duration-300 pointer-events-none" />
      
      <!-- Question Button -->
      <button
        class="w-full px-6 py-5 text-left flex items-start gap-4 relative z-10 transition-all duration-200"
        @click="toggleItem(index)"
      >
        <!-- Icon Indicator -->
        <div 
          class="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
          :class="isOpen(index) 
            ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rotate-90' 
            : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'"
        >
          <UIcon 
            name="i-heroicons-chevron-right" 
            class="w-5 h-5 transition-transform duration-300"
          />
        </div>

        <!-- Question Text -->
        <div class="flex-1 min-w-0">
          <h3 
            class="text-base md:text-lg font-semibold transition-colors duration-200"
            :class="isOpen(index) 
              ? 'text-green-700 dark:text-green-400' 
              : 'text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400'"
          >
            {{ item.question }}
          </h3>
        </div>

        <!-- Badge for New/Popular (optional) -->
        <div 
          v-if="index === 0"
          class="shrink-0 px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-xs font-medium text-green-700 dark:text-green-400"
        >
          Popular
        </div>
      </button>

      <!-- Answer Content with Smooth Transition -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[500px]"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 max-h-[500px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div 
          v-if="isOpen(index)"
          class="overflow-hidden"
        >
          <div class="px-6 pb-6 pl-[4.5rem] relative z-10">
            <!-- Decorative Line -->
            <div class="absolute left-9 top-0 bottom-6 w-0.5 bg-linear-to-b from-green-300 to-transparent dark:from-green-700 dark:to-transparent" />
            
            <!-- Answer Text -->
            <div class="prose prose-sm md:prose-base dark:prose-invert max-w-none">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed m-0">
                {{ item.answer }}
              </p>
            </div>

            <!-- Helpful Feedback (Optional) -->
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700/50 flex items-center gap-3">
              <span class="text-sm text-gray-500 dark:text-gray-400">Apakah ini membantu?</span>
              <div class="flex gap-2">
                <button 
                  class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400"
                >
                  <UIcon name="i-heroicons-hand-thumb-up" class="w-4 h-4" />
                </button>
                <button 
                  class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400"
                >
                  <UIcon name="i-heroicons-hand-thumb-down" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Empty State -->
    <div 
      v-if="items.length === 0"
      class="text-center py-16 px-6"
    >
      <slot name="empty">
        <div class="max-w-md mx-auto">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <UIcon name="i-heroicons-question-mark-circle" class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">
            Tidak ada pertanyaan ditemukan
          </p>
          <p class="text-gray-500 dark:text-gray-500 text-sm">
            Coba ubah filter atau kata kunci pencarian Anda
          </p>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.prose p {
  margin: 0;
}
</style>
