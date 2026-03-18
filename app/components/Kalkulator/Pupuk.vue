<script setup lang="ts">
import { ref, computed } from 'vue'

const luasLahan = ref<number | null>(null) // dalam hektar

// Standar kebutuhan pupuk dasar per hektar (contoh padi sawah)
const ureaPerHa = 100 // kg
const npkPerHa = 150 // kg
const kclPerHa = 75 // kg

const totalUrea = computed(() => (luasLahan.value || 0) * ureaPerHa)
const totalNPK = computed(() => (luasLahan.value || 0) * npkPerHa)
const totalKCL = computed(() => (luasLahan.value || 0) * kclPerHa)
</script>

<template>
  <div class="rounded-2xl p-8 shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <div class="w-12 h-12 rounded-xl bg-linear-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
        <UIcon name="i-lucide-beaker" class="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Kalkulator Pupuk</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">Hitung kebutuhan pupuk untuk hasil optimal</p>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Input Section -->
      <div class="space-y-5">
        <div>
          <label class="flex items-center gap-2 font-semibold mb-2 text-gray-700 dark:text-gray-200">
            <UIcon name="i-lucide-ruler" class="w-4 h-4 text-teal-600" />
            Luas Lahan (hektar)
          </label>
          <UInput 
            v-model="luasLahan" 
            type="number" 
            placeholder="Contoh: 1.5"
            size="lg"
            icon="i-lucide-map"
          />
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1.5 ml-1">Standar untuk tanaman padi sawah</p>
        </div>

        <!-- Info Card -->
        <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div class="flex gap-2">
            <UIcon name="i-lucide-info" class="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div class="text-xs text-blue-700 dark:text-blue-300">
              <p class="font-semibold mb-1">Standar Pupuk/Ha:</p>
              <ul class="space-y-0.5">
                <li>• Urea: 100 kg</li>
                <li>• NPK: 150 kg</li>
                <li>• KCL: 75 kg</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="space-y-4">
        <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Total Kebutuhan Pupuk:</p>
        
        <!-- Urea -->
        <div class="p-4 rounded-xl bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-amber-500 dark:bg-amber-600 flex items-center justify-center">
                <UIcon name="i-lucide-flask-conical" class="w-4 h-4 text-white" />
              </div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Urea</span>
            </div>
            <p class="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {{ totalUrea }}
              <span class="text-sm font-normal text-gray-600 dark:text-gray-400">kg</span>
            </p>
          </div>
        </div>

        <!-- NPK -->
        <div class="p-4 rounded-xl bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-green-500 dark:bg-green-600 flex items-center justify-center">
                <UIcon name="i-lucide-flask-conical" class="w-4 h-4 text-white" />
              </div>
              <span class="font-medium text-gray-700 dark:text-gray-300">NPK</span>
            </div>
            <p class="text-2xl font-bold text-green-700 dark:text-green-300">
              {{ totalNPK }}
              <span class="text-sm font-normal text-gray-600 dark:text-gray-400">kg</span>
            </p>
          </div>
        </div>

        <!-- KCL -->
        <div class="p-4 rounded-xl bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-purple-500 dark:bg-purple-600 flex items-center justify-center">
                <UIcon name="i-lucide-flask-conical" class="w-4 h-4 text-white" />
              </div>
              <span class="font-medium text-gray-700 dark:text-gray-300">KCL</span>
            </div>
            <p class="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {{ totalKCL }}
              <span class="text-sm font-normal text-gray-600 dark:text-gray-400">kg</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-primary {
  color: #2E7D32;
}
</style>
