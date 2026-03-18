<script setup lang="ts">
const props = defineProps<{
  isLoading: boolean
  error: string
  hourlyData: any[]
  formatHour: (timestamp: number) => string
}>()
</script>
<template>
  <div>
    <LoadingData v-if="isLoading" message="Memuat ramalan 24 jam..." />
    <NotFoundData v-else-if="error" :message="error" />
    <div v-else-if="hourlyData && hourlyData.length > 0">
      <div class="glass-card-container">
        <div class="flex items-center gap-3 mb-6">
          <div class="icon-wrapper-header bg-linear-to-br from-green-500/20 to-green-500/20">
            <UIcon name="i-ic-baseline-access-time" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Ramalan 24 Jam Kedepan</h3>
        </div>
        <div class="overflow-x-auto pb-4 -mx-2 px-2">
          <div class="flex space-x-4 min-w-max">
            <div
              v-for="(hour, index) in hourlyData"
              :key="hour.dt"
              class="hourly-card group"
            >
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                {{ index === 0 ? 'Sekarang' : formatHour(hour.dt) }}
              </p>
              <div class="weather-icon-wrapper mb-3">
                <img
                  :src="`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`"
                  class="w-14 h-14 mx-auto transition-transform group-hover:scale-110"
                  :alt="hour.weather[0].description"
                >
              </div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ Math.round(hour.main.temp) }}°</p>
              <div class="rain-badge">
                <UIcon name="i-heroicons-cloud-arrow-down" class="w-3.5 h-3.5" />
                <span>{{ Math.round(hour.pop * 100) }}%</span>
              </div>
              <div class="stats-divider">
                <div class="stat-item">
                  <UIcon name="i-heroicons-wind" class="w-3.5 h-3.5 text-cyan-500" />
                  <span>{{ hour.wind.speed.toFixed(1) }} m/s</span>
                </div>
                <div class="stat-item">
                  <UIcon name="i-heroicons-beaker" class="w-3.5 h-3.5 text-blue-500" />
                  <span>{{ hour.main.humidity }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @reference "tailwindcss";
/* Main Container - Glassmorphism */
.glass-card-container {
  @apply relative overflow-hidden rounded-3xl p-6;
  @apply bg-white/70 dark:bg-gray-800/70;
  @apply backdrop-blur-xl backdrop-saturate-150;
  @apply border border-white/20 dark:border-gray-700/30;
  @apply shadow-xl shadow-black/5 dark:shadow-black/20;
  @apply transition-all duration-300;
}

.glass-card-container::before {
  content: '';
  @apply absolute inset-0 rounded-3xl;
  @apply bg-linear-to-br from-green-500/5 via-green-500/5 to-transparent;
  @apply dark:from-green-500/10 dark:via-green-500/10;
  pointer-events: none;
}

/* Header Icon */
.icon-wrapper-header {
  @apply p-3 rounded-2xl;
  @apply backdrop-blur-sm;
  @apply transition-all duration-300;
  @apply hover:scale-110 hover:rotate-3;
}

/* Hourly Card */
.hourly-card {
  @apply shrink-0 text-center;
  @apply relative overflow-hidden;
  @apply rounded-2xl p-4 min-w-[130px];
  @apply bg-white/60 dark:bg-gray-700/60;
  @apply backdrop-blur-md backdrop-saturate-150;
  @apply border border-white/30 dark:border-gray-600/30;
  @apply shadow-lg shadow-black/5 dark:shadow-black/10;
  @apply transition-all duration-300;
  @apply hover:scale-105 hover:shadow-xl;
  @apply hover:bg-white/80 dark:hover:bg-gray-700/80;
  @apply hover:border-green-300/50 dark:hover:border-green-600/50;
}

.hourly-card.group {
  /* Applied via class in template */
}

.hourly-card::before {
  content: '';
  @apply absolute inset-0 rounded-2xl;
  @apply bg-linear-to-br from-white/40 to-transparent dark:from-white/5;
  @apply opacity-0 group-hover:opacity-100;
  @apply transition-opacity duration-300;
  pointer-events: none;
}

/* Weather Icon Wrapper */
.weather-icon-wrapper {
  @apply relative;
  @apply p-2 rounded-xl;
  @apply bg-linear-to-br from-white/40 to-white/10;
  @apply dark:from-gray-600/40 dark:to-gray-700/20;
  @apply backdrop-blur-sm;
  @apply transition-all duration-300;
  @apply group-hover:scale-105;
}

/* Rain Badge */
.rain-badge {
  @apply flex items-center justify-center gap-1;
  @apply text-xs font-medium mb-3;
  @apply px-2.5 py-1 rounded-lg;
  @apply bg-green-100/80 dark:bg-green-900/30;
  @apply text-green-700 dark:text-green-300;
  @apply border border-green-200/50 dark:border-green-700/50;
  @apply backdrop-blur-sm;
  @apply transition-all duration-300;
  @apply group-hover:bg-green-200/80 dark:group-hover:bg-green-800/40;
}

/* Stats Divider */
.stats-divider {
  @apply space-y-1.5 text-xs;
  @apply border-t border-gray-200/50 dark:border-gray-600/50;
  @apply pt-3 mt-2;
}

.stat-item {
  @apply flex items-center justify-center gap-1.5;
  @apply text-gray-600 dark:text-gray-400;
  @apply transition-colors duration-300;
  @apply group-hover:text-gray-900 dark:group-hover:text-gray-200;
}

/* Scrollbar Styling */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  @apply bg-gray-200/50 dark:bg-gray-700/50;
  @apply backdrop-blur-sm;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  @apply bg-linear-to-r from-green-400 to-emerald-500;
  @apply dark:from-green-500 dark:to-emerald-600;
  border-radius: 10px;
  @apply transition-all duration-300;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-linear-to-r from-green-500 to-emerald-600;
  @apply dark:from-green-600 dark:to-emerald-700;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .glass-card-container {
    @apply p-4;
  }
}
</style>
