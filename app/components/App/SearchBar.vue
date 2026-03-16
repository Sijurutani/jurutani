<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  debounce?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Cari berita, artikel, atau topik...',
  debounce: 300,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
}>()

const searchQuery = ref(props.modelValue)
let debounceTimer: NodeJS.Timeout | null = null

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

// Handle input with debounce - more responsive
const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  searchQuery.value = value
  emit('update:modelValue', value)
  
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  // Set new timer - triggers search on server
  debounceTimer = setTimeout(() => {
    emit('search', value)
  }, props.debounce)
}

// Clear search immediately
const clearSearch = () => {
  searchQuery.value = ''
  emit('update:modelValue', '')
  emit('search', '')
  
  // Clear any pending debounce
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
}
</script>

<template>
  <div class="relative w-full max-w-2xl mx-auto">
    <div class="relative group">
      <!-- Search Icon -->
      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200">
        <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5" />
      </div>
      
      <!-- Input Field -->
      <input
        :value="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        @input="handleInput"
      >
      
      <!-- Clear Button -->
      <button
        v-if="searchQuery"
        type="button"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
        @click="clearSearch"
      >
        <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
      </button>
    </div>
    
    <!-- Search hint -->
    <p v-if="searchQuery" class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
      Mencari: <span class="font-semibold text-green-600 dark:text-green-400">{{ searchQuery }}</span>
    </p>
  </div>
</template>
