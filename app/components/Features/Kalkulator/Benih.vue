<script setup lang="ts">
  import { ref, computed } from 'vue'

  const luasLahan = ref<number | null>(null) // m2
  const jarakBaris = ref<number | null>(null) // cm
  const jarakTanam = ref<number | null>(null) // cm
  const benihPerLubang = ref<number | null>(1)
  const cadanganPersen = ref<number | null>(10) // %
  const dayaTumbuhPersen = ref<number | null>(85) // %

  const totalKebutuhanBenih = computed<number>(() => {
    if (
      !luasLahan.value ||
      !jarakBaris.value ||
      !jarakTanam.value ||
      !benihPerLubang.value ||
      !cadanganPersen.value ||
      !dayaTumbuhPersen.value
    ) {
      return 0
    }

    const jumlahLubang =
      (luasLahan.value * 10000) / (jarakBaris.value * jarakTanam.value)
    const totalBenih =
      (jumlahLubang * benihPerLubang.value) / (dayaTumbuhPersen.value / 100)
    const totalBenihDenganCadangan =
      totalBenih * (1 + cadanganPersen.value / 100)

    return totalBenihDenganCadangan
  })
</script>

<template>
  <div
    class="rounded-2xl p-8 shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
  >
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <div
        class="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
      >
        <UIcon name="i-lucide-sprout" class="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Kalkulator Benih
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Hitung kebutuhan benih untuk lahan Anda
        </p>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Left Column -->
      <div class="space-y-5">
        <div>
          <label
            class="flex items-center gap-2 font-semibold mb-2 text-gray-700 dark:text-gray-200"
          >
            <UIcon name="i-lucide-ruler" class="w-4 h-4 text-emerald-600" />
            Luas Lahan (m²)
          </label>
          <UInput
            v-model="luasLahan"
            type="number"
            placeholder="Contoh: 1000"
            size="lg"
            icon="i-lucide-map"
          />
        </div>

        <div>
          <label
            class="flex items-center gap-2 font-semibold mb-2 text-gray-700 dark:text-gray-200"
          >
            <UIcon name="i-lucide-ruler" class="w-4 h-4 text-emerald-600" />
            Jarak Tanam (cm)
          </label>
          <div class="flex items-center gap-3">
            <UInput
              v-model="jarakBaris"
              type="number"
              placeholder="Baris"
              size="lg"
            />
            <span class="text-gray-500 dark:text-gray-400 font-bold">×</span>
            <UInput
              v-model="jarakTanam"
              type="number"
              placeholder="Tanam"
              size="lg"
            />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1.5 ml-1">
            Contoh: 25 × 25 cm
          </p>
        </div>

        <div>
          <label
            class="flex items-center gap-2 font-semibold mb-2 text-gray-700 dark:text-gray-200"
          >
            <UIcon name="i-lucide-bean" class="w-4 h-4 text-emerald-600" />
            Benih per Lubang
          </label>
          <UInput
            v-model="benihPerLubang"
            type="number"
            placeholder="Contoh: 1"
            size="lg"
          />
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-5">
        <div>
          <label
            class="flex items-center gap-2 font-semibold mb-2 text-gray-700 dark:text-gray-200"
          >
            <UIcon
              name="i-lucide-package-plus"
              class="w-4 h-4 text-emerald-600"
            />
            Cadangan (%)
          </label>
          <UInput
            v-model="cadanganPersen"
            type="number"
            placeholder="Contoh: 10"
            size="lg"
          />
        </div>

        <div>
          <label
            class="flex items-center gap-2 font-semibold mb-2 text-gray-700 dark:text-gray-200"
          >
            <UIcon name="i-lucide-leaf" class="w-4 h-4 text-emerald-600" />
            Daya Tumbuh (%)
          </label>
          <UInput
            v-model="dayaTumbuhPersen"
            type="number"
            placeholder="Contoh: 85"
            size="lg"
          />
        </div>

        <!-- Result Card -->
        <div
          class="mt-6 p-6 rounded-xl bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-200 dark:border-emerald-800"
        >
          <div class="flex items-center gap-2 mb-2">
            <UIcon
              name="i-lucide-calculator"
              class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
            />
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Kebutuhan Benih
            </p>
          </div>
          <p class="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
            {{ totalKebutuhanBenih.toFixed(0) }}
            <span class="text-lg font-normal text-gray-600 dark:text-gray-400"
              >butir</span
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @reference "tailwindcss";
  .text-primary {
    @apply text-green-700 dark:text-green-300;
  }
</style>
