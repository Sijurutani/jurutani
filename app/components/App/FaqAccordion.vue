<script setup lang="ts">
  import { ref } from 'vue'
  import type { FaqItem } from '~/data/types'

  interface Props {
    items: FaqItem[]
    singleOpen?: boolean
    defaultOpen?: number | null
  }

  const props = withDefaults(defineProps<Props>(), {
    singleOpen: true,
    defaultOpen: null,
  })

  const openItems = ref<number[]>(
    props.defaultOpen !== null ? [props.defaultOpen] : [],
  )

  const toggleItem = (index: number) => {
    if (props.singleOpen) {
      if (openItems.value.includes(index)) {
        openItems.value = []
      } else {
        openItems.value = [index]
      }
    } else {
      const itemIndex = openItems.value.indexOf(index)
      if (itemIndex > -1) {
        openItems.value.splice(itemIndex, 1)
      } else {
        openItems.value.push(index)
      }
    }
  }

  const isOpen = (index: number) => openItems.value.includes(index)
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="bg-white dark:bg-[#064e3b]/20 border border-[var(--border-badge)] dark:border-[#6ee7b7]/20 rounded-[10px] overflow-hidden transition-colors duration-200"
      :class="{ 'border-green-600 dark:border-green-400': isOpen(index) }"
    >
      <button
        class="w-full flex items-center justify-between gap-4 p-4 md:px-[1.125rem] md:py-4 bg-transparent border-none cursor-pointer text-left focus:outline-none group"
        :aria-expanded="isOpen(index)"
        @click="toggleItem(index)"
      >
        <span
          class="text-[0.9375rem] font-semibold flex-1 min-w-0 transition-colors duration-200 leading-[1.45]"
          :class="
            isOpen(index)
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-900 dark:text-[#d1fae5]'
          "
        >
          {{ item.question }}
        </span>
        <span
          class="shrink-0 flex items-center justify-center w-7 h-7 rounded-full border-[1.5px] border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 transition-all duration-300"
          :class="{
            'bg-green-600 dark:bg-green-400 !text-white dark:!text-[#022c22] rotate-45':
              isOpen(index),
          }"
        >
          <UIcon name="i-lucide-plus" class="w-3.5 h-3.5" />
        </span>
      </button>

      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="grid-rows-[0] opacity-0"
        enter-to-class="grid-rows-[1fr] opacity-100"
        leave-from-class="grid-rows-[1fr] opacity-100"
        leave-to-class="grid-rows-[0] opacity-0"
      >
        <div v-if="isOpen(index)" class="overflow-hidden">
          <div
            class="px-[1.125rem] pb-[1.125rem] border-t border-[var(--border-badge)] dark:border-[#6ee7b7]/15"
          >
            <p
              class="text-[0.875rem] leading-[1.75] text-gray-500 dark:text-[#a7f3d0] pt-[0.875rem] m-0"
            >
              {{ item.answer }}
            </p>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="text-center py-16 px-6">
      <slot name="empty">
        <div class="max-w-md mx-auto">
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <UIcon name="i-lucide-help-circle" class="w-8 h-8 text-gray-400" />
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
