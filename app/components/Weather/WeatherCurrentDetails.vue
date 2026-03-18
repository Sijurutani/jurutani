<script setup lang="ts">
const props = defineProps<{
  isLoading: boolean
  error: string
  weatherData: any
  farmingConditions: any
  windDirection: string
  sunriseTime: string
  sunsetTime: string
}>()
</script>

<template>
  <div>
    <LoadingData v-if="isLoading" message="Memuat data cuaca..." />
    <NotFoundData v-else-if="error" :message="error" />
    <div v-else-if="weatherData" class="space-y-6">
      <!-- Weather Details Grid (glassmorphism style) -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <!-- Kelembaban -->
        <div class="glass-card group">
          <div class="flex items-center gap-2 mb-3">
            <div class="icon-wrapper bg-blue-500/10">
              <UIcon name="i-ic-baseline-water-drop" class="w-5 h-5 text-blue-500" />
            </div>
            <span class="text-xs font-medium text-slate-600 dark:text-slate-400">Kelembaban</span>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ weatherData.main.humidity }}%</p>
        </div>

        <!-- Angin -->
        <div class="glass-card group">
          <div class="flex items-center gap-2 mb-3">
            <div class="icon-wrapper bg-cyan-500/10">
              <UIcon name="i-ic-baseline-air" class="w-5 h-5 text-cyan-500" />
            </div>
            <span class="text-xs font-medium text-slate-600 dark:text-slate-400">Angin</span>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ weatherData.wind?.speed || 0 }} m/s</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ windDirection }}</p>
        </div>

        <!-- Matahari Terbit -->
        <div class="glass-card group">
          <div class="flex items-center gap-2 mb-3">
            <div class="icon-wrapper bg-orange-500/10">
              <UIcon name="i-ic-baseline-wb-sunny" class="w-5 h-5 text-orange-500 transition-transform group-hover:rotate-180 duration-500" />
            </div>
            <span class="text-xs font-medium text-slate-600 dark:text-slate-400">Terbit</span>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ sunriseTime }}</p>
        </div>

        <!-- Matahari Terbenam -->
        <div class="glass-card group">
          <div class="flex items-center gap-2 mb-3">
            <div class="icon-wrapper bg-red-500/10">
              <UIcon name="i-ic-baseline-wb-twilight" class="w-5 h-5 text-red-500" />
            </div>
            <span class="text-xs font-medium text-slate-600 dark:text-slate-400">Terbenam</span>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ sunsetTime }}</p>
        </div>

        <!-- Jarak Pandang -->
        <div class="glass-card group">
          <div class="flex items-center gap-2 mb-3">
            <div class="icon-wrapper bg-purple-500/10">
              <UIcon name="i-ic-baseline-visibility" class="w-5 h-5 text-purple-500" />
            </div>
            <span class="text-xs font-medium text-slate-600 dark:text-slate-400">Pandang</span>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ (weatherData.visibility / 1000).toFixed(1) }} km</p>
        </div>

        <!-- Tekanan -->
        <div class="glass-card group">
          <div class="flex items-center gap-2 mb-3">
            <div class="icon-wrapper bg-indigo-500/10">
              <UIcon name="i-ic-baseline-speed" class="w-5 h-5 text-indigo-500" />
            </div>
            <span class="text-xs font-medium text-slate-600 dark:text-slate-400">Tekanan</span>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ weatherData.main.pressure }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">hPa</p>
        </div>
      </div>

      <!-- Rekomendasi Pertanian -->
      <div v-if="farmingConditions" class="glass-card-large group">
        <div class="flex items-center gap-3 mb-6">
          <div class="icon-wrapper-large bg-linear-to-br from-green-500 to-emerald-500">
            <UIcon name="i-ic-baseline-agriculture" class="w-7 h-7 text-slate-900 dark:text-slate-200" />
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">Rekomendasi Pertanian</h3>
        </div>

        <!-- Status Card -->
        <div
          :class="[
            'status-card mb-5',
            farmingConditions.suitable 
              ? 'status-optimal' 
              : 'status-warning'
          ]"
        >
          <div class="flex items-center gap-3">
            <div
:class="[
              'p-2 rounded-xl backdrop-blur-sm',
              farmingConditions.suitable 
                ? 'bg-green-500/20' 
                : 'bg-yellow-500/20'
            ]">
              <UIcon
                :name="farmingConditions.suitable ? 'ic:baseline-check-circle' : 'ic:baseline-warning'"
                :class="[
                  'w-6 h-6',
                  farmingConditions.suitable ? 'text-green-600 dark:text-green-300' : 'text-yellow-600 dark:text-yellow-300'
                ]"
              />
            </div>
            <p v-if="farmingConditions.suitable" class="font-semibold text-lg text-green-800 dark:text-green-100">
              Kondisi Optimal
            </p>
            <p v-else class="font-semibold text-lg text-yellow-800 dark:text-yellow-100">
              Perlu Perhatian
            </p>
          </div>
        </div>

        <!-- Recommendations List -->
        <div class="grid gap-3 md:grid-cols-2">
          <div
            v-for="(rec, index) in farmingConditions.recommendations"
            :key="index"
            class="recommendation-card"
          >
            <div class="icon-wrapper-small bg-green-500/20 dark:bg-green-500/10 shrink-0">
              <UIcon name="i-ic-baseline-check" class="w-4 h-4 text-green-600 dark:text-green-300" />
            </div>
            <span class="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{{ rec }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Glassmorphism Cards */
.glass-card {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  padding: 1rem;
  background-color: white;
  backdrop-filter: blur(24px) saturate(150%);
  border: 1px solid rgb(209 250 229);
  box-shadow: 0 10px 15px -3px rgb(16 185 129 / 0.05);
  transition: all 0.3s;
}

.glass-card:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 25px -5px rgb(16 185 129 / 0.1);
  border-color: rgb(167 243 208);
}

.dark .glass-card {
  background-color: rgba(30, 41, 59, 0.9);
  border-color: rgba(51, 65, 85, 0.5);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
}

.dark .glass-card:hover {
  border-color: rgba(16, 185, 129, 0.5);
}

.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  background: linear-gradient(to bottom right, rgb(236 253 245), transparent);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.dark .glass-card::before {
  background: linear-gradient(to bottom right, rgba(16, 185, 129, 0.05), transparent);
}

.group:hover .glass-card::before {
  opacity: 1;
}

.glass-card-large {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  padding: 1.5rem;
  background-color: white;
  backdrop-filter: blur(24px) saturate(150%);
  border: 1px solid rgb(209 250 229);
  box-shadow: 0 20px 25px -5px rgb(16 185 129 / 0.05);
  transition: all 0.3s;
}

.glass-card-large:hover {
  box-shadow: 0 25px 50px -12px rgb(16 185 129 / 0.1);
}

.dark .glass-card-large {
  background-color: rgba(30, 41, 59, 0.95);
  border-color: rgba(51, 65, 85, 0.5);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

.glass-card-large::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  background: linear-gradient(to bottom right, rgb(236 253 245), rgb(240 253 244));
  opacity: 0.5;
  transition: opacity 0.5s;
  pointer-events: none;
}

.dark .glass-card-large::before {
  background: linear-gradient(to bottom right, rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.05));
}

.group:hover .glass-card-large::before {
  opacity: 1;
}

/* Icon Wrappers */
.icon-wrapper {
  padding: 0.5rem;
  border-radius: 0.75rem;
  backdrop-filter: blur(4px);
  transition: all 0.3s;
}

.group:hover .icon-wrapper {
  transform: scale(1.1);
}

.icon-wrapper-large {
  padding: 0.75rem;
  border-radius: 1rem;
  backdrop-filter: blur(4px);
  transition: all 0.3s;
}

.group:hover .icon-wrapper-large {
  transform: scale(1.1) rotate(3deg);
}

.icon-wrapper-small {
  padding: 0.5rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(4px);
  transition: all 0.3s;
}

/* Status Cards */
.status-card {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  padding: 1.25rem;
  backdrop-filter: blur(12px) saturate(150%);
  border-left-width: 4px;
  transition: all 0.3s;
}

.status-card:hover {
  transform: scale(1.01);
}

.status-optimal {
  background-color: rgb(240 253 244);
  border-color: rgb(34 197 94);
  box-shadow: 0 10px 15px -3px rgb(34 197 94 / 0.1);
}

.dark .status-optimal {
  background-color: rgba(20, 83, 45, 0.4);
  border-color: rgb(74, 222, 128);
  box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.2);
}

.status-warning {
  background-color: rgb(254 252 232);
  border-color: rgb(234 179 8);
  box-shadow: 0 10px 15px -3px rgb(234 179 8 / 0.1);
}

.dark .status-warning {
  background-color: rgba(113, 63, 18, 0.4);
  border-color: rgb(250, 204, 21);
  box-shadow: 0 10px 15px -3px rgba(234, 179, 8, 0.2);
}

/* Recommendation Cards */
.recommendation-card {
  position: relative;
  display: flex;
  align-items: start;
  gap: 0.75rem;
  padding: 1rem;
  background-color: white;
  backdrop-filter: blur(12px) saturate(150%);
  border-radius: 0.75rem;
  border: 1px solid rgb(209 250 229);
  box-shadow: 0 4px 6px -1px rgb(16 185 129 / 0.05);
  transition: all 0.3s;
}

.recommendation-card:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 15px -3px rgb(16 185 129 / 0.1);
  background-color: rgb(236 253 245);
  border-color: rgb(167 243 208);
}

.dark .recommendation-card {
  background-color: rgba(51, 65, 85, 0.8);
  border-color: rgba(71, 85, 105, 0.5);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.dark .recommendation-card:hover {
  background-color: rgba(71, 85, 105, 0.8);
  border-color: rgba(34, 197, 94, 0.5);
}

.recommendation-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.recommendation-card:hover::before {
  opacity: 1;
}
</style>