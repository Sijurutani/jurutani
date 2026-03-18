<script setup lang="ts">
defineEmits<{ start: [] }>()
</script>

<template>
  <UCard
    class="w-80 border-2 border-green-400 shadow-2xl dark:border-green-400 dark:bg-gray-900"
    :ui="{ body: { padding: 'p-6' } }"
  >
    <div class="text-center space-y-4">
      <div class="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shadow-lg ring-4 ring-green-200 dark:ring-green-800">
        <NuxtImg src="/jurutani.png" alt="JuruTani AI" class="w-12 h-12" />
      </div>

      <div>
        <h1 class="text-xl font-bold text-green-700 dark:text-green-300">JuruTani AI</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Asisten Penyuluh Pertanian</p>
      </div>

      <div class="grid grid-cols-2 gap-2 text-left">
        <div
          v-for="item in [
            { icon: 'i-heroicons-sun', text: 'Budidaya & tanaman' },
            { icon: 'i-heroicons-bug-ant', text: 'Hama & penyakit' },
            { icon: 'i-heroicons-beaker', text: 'Pupuk & nutrisi' },
            { icon: 'i-heroicons-chart-bar', text: 'Pemasaran hasil' },
          ]"
          :key="item.text"
          class="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 rounded-lg p-2"
        >
          <UIcon :name="item.icon" class="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
          <span class="text-xs text-gray-600 dark:text-gray-300">{{ item.text }}</span>
        </div>
      </div>

      <UButton
        color="success"
        size="lg"
        block
        class="transition-all duration-200 hover:scale-[1.02]"
        @click="$emit('start')"
      >
        🌱 Mulai Konsultasi
      </UButton>
    </div>
  </UCard>
</template>