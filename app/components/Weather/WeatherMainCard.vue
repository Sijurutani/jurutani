<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  weatherData: any
  currentLocalTime: string
  sunriseTime: string
  sunsetTime: string
}>()

// Map cuaca ke background image dari Unsplash (cuaca-specific)
const weatherBg = computed(() => {
  if (!props.weatherData) return 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80'
  const main = props.weatherData.weather[0].main.toLowerCase()
  
  // Rain - rainy weather scene
  if (main.includes('rain')) return 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200&q=80'
  
  // Clouds - cloudy sky
  if (main.includes('cloud')) return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&q=80'
  
  // Clear - sunny blue sky
  if (main.includes('clear')) return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1200&q=80'
  
  // Thunder - storm
  if (main.includes('thunder')) return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1200&q=80'
  
  // Snow - snowy landscape
  if (main.includes('snow')) return 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1200&q=80'
  
  // Mist/Fog
  if (main.includes('mist') || main.includes('fog')) return 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1200&q=80'
  
  return 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80'
})

// Weather icon style berdasarkan kondisi
const weatherIconClass = computed(() => {
  if (!props.weatherData) return ''
  const main = props.weatherData.weather[0].main.toLowerCase()
  
  if (main.includes('rain')) return 'animate-bounce'
  if (main.includes('clear')) return 'animate-pulse'
  if (main.includes('cloud')) return 'animate-float'
  
  return ''
})
</script>

<template>
  <div class="weather-main-card group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-green-500/20 hover:scale-[1.01] h-full min-h-[400px]">
    <!-- Background Image with Animation -->
    <div class="absolute inset-0 weather-bg-container">
      <img
        :src="weatherBg"
        :alt="`${weatherData.weather[0].description} background`"
        class="w-full h-full object-cover scale-105 transition-transform duration-[3000ms] group-hover:scale-110"
        loading="lazy"
      >
      <!-- Animated Gradient Overlays -->
      <div class="absolute inset-0 bg-linear-to-br from-blue-900/70 via-green-800/60 to-emerald-900/70 animate-gradient" />
      <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
      
      <!-- Animated particles effect -->
      <div class="absolute inset-0 opacity-30">
        <div class="particle particle-1" />
        <div class="particle particle-2" />
        <div class="particle particle-3" />
      </div>
    </div>
    
    <!-- Content Overlay -->
    <div class="relative z-10 h-full min-h-[400px] flex flex-col justify-between p-6 md:p-8">
      <!-- Top Section: Location & Temperature -->
      <div class="flex justify-between items-start gap-4 mb-6">
        <!-- Location Info -->
        <div class="flex-1">
          <div class="inline-flex items-center gap-2 mb-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-green-300" />
            <span class="text-sm font-medium text-white/90">{{ weatherData.name }}, {{ weatherData.sys.country }}</span>
          </div>
          <p class="text-white/70 text-xs md:text-sm flex items-center gap-2 ml-1">
            <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
            {{ currentLocalTime }}
          </p>
        </div>
        
        <!-- Temperature Display -->
        <div class="text-right">
          <div class="text-5xl md:text-6xl font-bold text-white mb-1 drop-shadow-lg">
            {{ Math.round(weatherData.main.temp) }}°
          </div>
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full">
            <img
              :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`"
              :alt="weatherData.weather[0].description"
              class="w-6 h-6"
              @error="(e) => ((e.target as HTMLImageElement).src = '/profile.png')"
            >
            <span class="text-sm text-white/90 capitalize">{{ weatherData.weather[0].description }}</span>
          </div>
        </div>
      </div>
      
      <!-- Bottom Section: Weather Details Grid -->
      <div class="grid grid-cols-3 gap-3 md:gap-4 mt-auto">
        <!-- Feels Like -->
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:scale-105">
          <div class="flex items-center gap-2 mb-1">
            <UIcon name="i-heroicons-hand-raised" class="w-4 h-4 text-orange-300" />
            <span class="text-xs text-white/70">Terasa</span>
          </div>
          <p class="text-lg md:text-xl font-bold text-white">{{ Math.round(weatherData.main.feels_like) }}°</p>
        </div>
        
        <!-- Min/Max Temperature -->
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:scale-105">
          <div class="flex items-center gap-2 mb-1">
            <UIcon name="i-heroicons-arrow-trending-up" class="w-4 h-4 text-blue-300" />
            <span class="text-xs text-white/70">Min/Max</span>
          </div>
          <p class="text-base md:text-lg font-bold text-white">
            {{ Math.round(weatherData.main.temp_min) }}° / {{ Math.round(weatherData.main.temp_max) }}°
          </p>
        </div>
        
        <!-- Weather Icon Large -->
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:scale-105 flex items-center justify-center">
          <img
            :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
            :alt="weatherData.weather[0].description"
            :class="['w-16 h-16 drop-shadow-lg', weatherIconClass]"
            @error="(e) => ((e.target as HTMLImageElement).src = '/profile.png')"
          >
        </div>
      </div>
      
      <!-- Animated Border on Hover -->
      <div class="absolute inset-0 border-2 border-transparent group-hover:border-green-400/40 rounded-3xl transition-all duration-500 pointer-events-none" />
    </div>
  </div>
</template>

<style scoped>
.weather-main-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.weather-bg-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
  animation: pulse-glow 4s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

@keyframes gradient {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.animate-gradient {
  animation: gradient 6s ease-in-out infinite;
}

/* Floating animation for clouds */
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
  width: 8px;
  height: 8px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
  animation-duration: 8s;
}

.particle-2 {
  width: 6px;
  height: 6px;
  top: 60%;
  right: 20%;
  animation-delay: 2s;
  animation-duration: 10s;
}

.particle-3 {
  width: 10px;
  height: 10px;
  bottom: 30%;
  left: 70%;
  animation-delay: 4s;
  animation-duration: 12s;
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
    transform: translate(30px, -50px);
    opacity: 0.3;
  }
  90% {
    opacity: 0.6;
  }
}
</style>