<script setup lang="ts">
const props = defineProps<{
  isLoading: boolean
  error: string
  forecastData: any[]
  formatDateShort: (dateString: string) => string
}>()

// Function to get weather background image based on weather condition
const getWeatherBg = (weatherMain: string) => {
  const main = weatherMain.toLowerCase()
  
  // Rain - rainy weather scene
  if (main.includes('rain')) return 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200&q=80'
  
  // Clouds - cloudy sky
  if (main.includes('cloud')) return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&q=80'
  
  // Clear - sunny green sky
  if (main.includes('clear')) return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1200&q=80'
  
  // Thunder - storm
  if (main.includes('thunder')) return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1200&q=80'
  
  // Snow - snowy landscape
  if (main.includes('snow')) return 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1200&q=80'
  
  // Mist/Fog
  if (main.includes('mist') || main.includes('fog')) return 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1200&q=80'
  
  return 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80'
}

// Weather icon animation class based on condition
const getWeatherIconClass = (weatherMain: string) => {
  const main = weatherMain.toLowerCase()
  
  if (main.includes('rain')) return 'animate-bounce'
  if (main.includes('clear')) return 'animate-pulse'
  if (main.includes('cloud')) return 'animate-float'
  
  return ''
}
</script>

<template>
  <div>
    <LoadingData v-if="isLoading" message="Memuat ramalan 5 hari..." />
    <NotFoundData v-else-if="error" :message="error" />
    <div v-else-if="forecastData && forecastData.length > 0">
      <div class="glass-card-container">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="icon-wrapper-header bg-linear-to-br from-green-500/20 to-green-500/20">
            <UIcon name="i-ic-baseline-date-range" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Ramalan 5 Hari Kedepan</h3>
        </div>

        <!-- Forecast List -->
        <div class="space-y-3">
          <div
            v-for="(day, index) in forecastData"
            :key="day.date"
            class="forecast-card group relative overflow-hidden"
          >
            <!-- Background Image with Animation -->
            <div class="absolute inset-0 weather-bg-container overflow-hidden">
              <img
                :src="getWeatherBg(day.main_weather.main)"
                :alt="`${day.main_weather.description} background`"
                class="w-full h-full object-cover scale-105 transition-transform duration-[3000ms] group-hover:scale-110 filter blur-sm"
                style="background: rgba(0,0,0,0.3);"
                loading="lazy"
              >              

              <!-- Animated Particles -->
              <div class="particle particle-1" />
              <div class="particle particle-2" />
            </div>

            <!-- Content Container -->
            <div class="relative z-10 flex items-center gap-3 sm:justify-between sm:gap-6 w-full">
              <!-- Left Section (Mobile & Desktop) -->
              <div class="flex items-center gap-3 sm:gap-4 flex-1 sm:flex-initial">
                <!-- Weather Icon -->
                <div class="weather-icon-wrapper shrink-0">
                  <img
                    :src="`https://openweathermap.org/img/wn/${day.main_weather.icon}@2x.png`"
                    :alt="day.main_weather.description"
                    class="w-12 h-12 sm:w-16 sm:h-16"
                    :class="getWeatherIconClass(day.main_weather.main)"
                  >
                </div>

                <!-- Weather Details -->
                <div class="flex-1 min-w-0 sm:flex-initial">
                  <h4 class="font-bold text-base sm:text-lg text-white mb-0.5 sm:mb-1 drop-shadow-md truncate">
                    {{ index === 0 ? 'Hari Ini' : formatDateShort(day.date) }}
                  </h4>
                  <!-- Description - Hidden on mobile -->
                  <p class="hidden sm:block text-sm text-white/90 capitalize mb-2 drop-shadow-sm">
                    {{ day.main_weather.description }}
                  </p>
                  <!-- Rain probability badge -->
                  <div class="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/30">
                    <UIcon name="i-heroicons-cloud-arrow-down" class="w-3 h-3 sm:w-4 sm:h-4 text-green-200" />
                    <span class="text-xs font-medium text-white">{{ Math.round(day.pop * 100) }}%</span>
                  </div>
                </div>
              </div>

              <!-- Temperature (Mobile Only) -->
              <div class="text-right sm:hidden shrink-0">
                <p class="text-2xl font-bold text-white drop-shadow-lg leading-tight">
                  {{ Math.round(day.temp_max) }}°
                </p>
                <p class="text-sm text-white/80 drop-shadow-md leading-tight">
                  {{ Math.round(day.temp_min) }}°
                </p>
              </div>

                <!-- Stats Section (Desktop Only) -->
                <div class="hidden sm:flex items-center gap-3 shrink-0 ml-auto">
                <!-- Temperature -->
                <div class="text-center min-w-[90px]">
                  <p class="text-3xl font-bold text-white drop-shadow-lg mb-1">
                  {{ Math.round(day.temp_max) }}°
                  </p>
                  <p class="text-lg text-white/80 drop-shadow-md">
                  {{ Math.round(day.temp_min) }}°
                  </p>
                </div>

                <!-- Humidity -->
                <div class="stat-badge bg-white/15">
                  <div class="flex items-center gap-1.5 mb-1">
                  <UIcon name="i-ic-baseline-water-drop" class="w-4 h-4 text-green-200" />
                  <span class="text-xs text-white/80">Lembab</span>
                  </div>
                  <p class="text-lg font-bold text-white">{{ day.humidity }}%</p>
                </div>

                <!-- Wind -->
                <div class="stat-badge bg-white/15">
                  <div class="flex items-center gap-1.5 mb-1">
                  <UIcon name="i-ic-baseline-air" class="w-4 h-4 text-cyan-200" />
                  <span class="text-xs text-white/80">Angin</span>
                  </div>
                  <p class="text-lg font-bold text-white">{{ day.wind_speed.toFixed(1) }} m/s</p>
                </div>
                </div>
            </div>

            <!-- Stats Grid (Mobile Only) -->
            <div class="relative z-10 grid grid-cols-2 gap-2 sm:hidden pt-3 mt-3 border-t border-white/20">
              <!-- Humidity -->
              <div class="stat-badge-mobile bg-white/15">
                <UIcon name="i-ic-baseline-water-drop" class="w-4 h-4 text-green-200 mx-auto mb-1" />
                <p class="text-xs text-white/70 mb-0.5 hidden">Lembab</p>
                <p class="text-sm font-bold text-white">{{ day.humidity }}%</p>
              </div>

              <!-- Wind -->
              <div class="stat-badge-mobile bg-white/15">
                <UIcon name="i-ic-baseline-air" class="w-4 h-4 text-cyan-200 mx-auto mb-1" />
                <p class="text-xs text-white/70 mb-0.5 hidden">Angin</p>
                <p class="text-sm font-bold text-white">{{ day.wind_speed.toFixed(1) }}<span class="text-xs text-white/70 ml-0.5">m/s</span></p>
              </div>

            </div>
            
            <!-- Animated Border on Hover -->
            <div class="absolute inset-0 border-2 border-transparent group-hover:border-green-400/40 rounded-2xl transition-all duration-500 pointer-events-none z-20" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @reference "tailwindcss";
/* Main Container */
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

/* Forecast Card */
.forecast-card {
  @apply relative flex items-center gap-4 p-6 rounded-2xl overflow-hidden;
  @apply bg-linear-to-br from-white/30 via-green-100/20 to-green-200/10 dark:from-gray-700/40 dark:via-gray-800/30 dark:to-gray-900/20;
  @apply shadow-xl shadow-black/10;
  @apply transition-all duration-500;
  @apply hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/20;
}

/* Weather Background Container */
.weather-bg-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
  animation: pulse-glow 4s ease-in-out infinite;
  @apply opacity-0 group-hover:opacity-100;
  @apply transition-opacity duration-300;
  pointer-events: none;
}

/* Weather Icon Wrapper */
.weather-icon-wrapper {
  @apply relative shrink-0;
  @apply p-2 rounded-2xl;
  @apply bg-linear-to-br from-white/50 to-white/20;
  @apply dark:from-gray-600/50 dark:to-gray-700/30;
  @apply backdrop-blur-md;
  @apply border border-white/30;
  @apply transition-all duration-300;
  @apply group-hover:scale-110 group-hover:bg-white/30;
}

.weather-icon-wrapper::before {
  content: '';
  @apply absolute inset-0 rounded-2xl;
  @apply bg-linear-to-br from-white/20 to-transparent;
  pointer-events: none;
}

/* Stat Badge (Desktop) */
.stat-badge {
  @apply text-center min-w-[75px] p-3 rounded-xl;
  @apply backdrop-blur-sm;
  @apply border border-white/30 dark:border-gray-600/30;
  @apply transition-all duration-300;
  @apply hover:scale-105 hover:bg-white/25;
}

/* Stat Badge Mobile */
.stat-badge-mobile {
  @apply text-center p-3 rounded-xl;
  @apply backdrop-blur-md;
  @apply border border-white/20;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .glass-card-container {
    @apply p-4;
  }
  
  .forecast-card {
    @apply p-4;
  }
}

/* Animations */
@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Particle animations */
.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: float-particle 10s infinite;
}

.particle-1 {
  width: 6px;
  height: 6px;
  top: 20%;
  left: 15%;
  animation-delay: 0s;
  animation-duration: 8s;
}

.particle-2 {
  width: 8px;
  height: 8px;
  top: 60%;
  right: 25%;
  animation-delay: 2s;
  animation-duration: 10s;
}

@keyframes float-particle {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  50% {
    transform: translate(30px, -30px);
    opacity: 0.3;
  }
  90% {
    opacity: 0.6;
  }
}

@keyframes float-icon {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.forecast-card:hover .weather-icon-wrapper img {
  animation: float-icon 2s ease-in-out infinite;
}
</style>