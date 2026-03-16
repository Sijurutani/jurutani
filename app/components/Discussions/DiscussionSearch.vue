<script setup lang="ts">
interface Props {
  modelValue: string;
  placeholder?: string;
  icon?: string;
  title?: string;
  showTitle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Cari...',
  icon: 'i-lucide-search',
  title: 'Cari',
  showTitle: true
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const localValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
});
</script>

<template>
<div>
    <div v-if="showTitle" class="flex items-center gap-2 mb-4">
        <UIcon 
            :name="icon" 
            class="w-5 h-5 text-green-600 dark:text-green-400"
        />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
    </div>
    
    <div class="relative w-full max-w-2xl mx-auto">
        <div class="relative group">
            <!-- Search Icon -->
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200">
                <UIcon :name="icon" class="w-5 h-5" />
            </div>
            
            <!-- Input Field -->
            <input
                v-model="localValue"
                type="text"
                :placeholder="placeholder"
                class="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            >
            
            <!-- Clear Button -->
            <button
                v-if="localValue"
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                @click="localValue = ''"
            >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
            </button>
        </div>
        
        <!-- Search hint -->
        <p v-if="localValue" class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            Mencari: <span class="font-semibold text-green-600 dark:text-green-400">{{ localValue }}</span>
        </p>
    </div>
</div>
</template>
