<script setup lang="ts">
/**
 * LegalPageLayout - Reusable Layout for Legal Pages
 * Used for Privacy Policy, Terms of Service, etc.
 */

import type { LegalPageData } from '~/data/types'

interface Props {
  data: LegalPageData
}

const props = defineProps<Props>()

const renderContent = (content: string | string[], type?: string) => {
  if (Array.isArray(content)) {
    if (type === 'nested') {
      // First item is intro text, rest are list items
      return {
        intro: content[0],
        items: content.slice(1)
      }
    }
    return { items: content }
  }
  return { text: content }
}
</script>

<template>
  <section class="min-h-screen pt-24 pb-12 lg:pt-32 text-gray-800 dark:text-gray-200 transition-colors duration-300 px-6">
    <div class="max-w-3xl mx-auto">
      
      <!-- Header with Logo -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-full">
            <UIcon :name="data.icon" class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 class="text-lg font-semibold text-green-700 dark:text-green-400">JuruTani</h3>
        </div>
      </div>

      <!-- Page Title -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-400 mb-2">
          {{ data.title }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Terakhir diperbarui: {{ data.lastUpdated }}
        </p>
      </div>

      <!-- Introduction -->
      <div class="relative mb-10 bg-green-50 dark:bg-green-900/30 p-5 rounded-lg border-l-4 border-green-500 dark:border-green-600">
        <p class="text-base md:text-lg leading-relaxed" v-html="data.intro" />
      </div>

      <!-- Sections -->
      <div class="space-y-8">
        <section
          v-for="(section, index) in data.sections"
          :key="section.id"
          class="transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 p-4 rounded-lg"
        >
          <!-- Section Title -->
          <h2 class="text-2xl font-semibold text-green-600 dark:text-green-400 border-l-4 border-green-500 dark:border-green-400 pl-4 mb-3">
            {{ index + 1 }}. {{ section.title }}
          </h2>

          <!-- Section Content -->
          <div class="flex items-start">
            <span class="inline-flex mr-2 mt-1 shrink-0">
              <UIcon :name="section.icon" class="h-5 w-5 text-green-500 dark:text-green-400" />
            </span>

            <!-- Text Type -->
            <div v-if="section.type === 'text'" class="text-base leading-relaxed" v-html="section.content" />

            <!-- List Type -->
            <ul v-else-if="section.type === 'list'" class="list-none space-y-3 text-base leading-relaxed">
              <li
                v-for="(item, i) in (Array.isArray(section.content) ? section.content : [section.content])"
                :key="i"
                class="flex items-start"
              >
                <span class="inline-flex mr-2 mt-1 shrink-0">
                  <UIcon name="i-lucide-check-circle" class="h-5 w-5 text-green-500 dark:text-green-400" />
                </span>
                <span v-html="item" />
              </li>
            </ul>

            <!-- Nested Type -->
            <div v-else-if="section.type === 'nested'" class="text-base leading-relaxed">
              <template v-if="Array.isArray(section.content)">
                <p class="mb-2" v-html="section.content[0]" />
                <p v-if="section.content.length > 1" v-html="section.content[1]" />
                <ul v-if="section.content.length > 2" class="list-none space-y-2 mt-2 pl-6">
                  <li
                    v-for="(item, i) in section.content.slice(2)"
                    :key="i"
                    class="flex items-start"
                  >
                    <span class="inline-flex mr-2 mt-1 text-xs">•</span>
                    <span v-html="item" />
                  </li>
                </ul>
              </template>
            </div>

            <!-- Default -->
            <div v-else class="text-base leading-relaxed" v-html="section.content" />
          </div>
        </section>
      </div>

      <!-- Slot for additional content -->
      <slot />
    </div>
  </section>
</template>
