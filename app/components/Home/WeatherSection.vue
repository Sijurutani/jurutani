<script setup lang="ts">
const weatherData = ref<any>(null)
const forecastData = ref<any>(null)
const hourlyData = ref<any>(null)
const isLoading = ref(true)
const isForecastLoading = ref(false)
const isHourlyLoading = ref(false)
const error = ref('')
const forecastError = ref('')
const hourlyError = ref('')
const activeTab = ref('current')

const BASE_URL = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5'
const API_KEY = process.env.OPENWEATHER_API_KEY || '416f0ed0bb28d3110beedecf5fa9cf85'

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        await fetchWeatherData(lat, lon)
        await fetchForecastData(lat, lon)
      },
      (err) => {
        isLoading.value = false
        error.value = 'Tidak dapat mengakses lokasi Anda'
      }
    )
  } else {
    isLoading.value = false
    error.value = 'Geolocation tidak didukung di browser ini'
  }
}

const fetchWeatherData = async (lat: number, lon: number) => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
  try {
    const response = await fetch(url)
    const data = await response.json()
    weatherData.value = data
    isLoading.value = false
  } catch (err) {
    error.value = 'Gagal mengambil data cuaca'
    isLoading.value = false
  }
}

const fetchForecastData = async (lat: number, lon: number) => {
  isForecastLoading.value = true
  isHourlyLoading.value = true
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
  try {
    const response = await fetch(url)
    const data = await response.json()
    const dailyForecast = groupForecastByDay(data.list)
    forecastData.value = dailyForecast
    hourlyData.value = data.list.slice(0, 8)
    isForecastLoading.value = false
    isHourlyLoading.value = false
  } catch (err) {
    forecastError.value = 'Gagal mengambil data prediksi cuaca'
    hourlyError.value = 'Gagal mengambil data hourly cuaca'
    isForecastLoading.value = false
    isHourlyLoading.value = false
  }
}

const groupForecastByDay = (forecastList: any[]) => {
  const grouped: any = {}
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000)
    const dateKey = date.toISOString().split('T')[0]
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: dateKey,
        items: [],
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        main_weather: item.weather[0],
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        pop: item.pop || 0
      }
    }
    grouped[dateKey].items.push(item)
    grouped[dateKey].temp_min = Math.min(grouped[dateKey].temp_min, item.main.temp_min)
    grouped[dateKey].temp_max = Math.max(grouped[dateKey].temp_max, item.main.temp_max)
  })
  return Object.values(grouped).slice(0, 5)
}

const farmingConditions = computed(() => {
  if (!weatherData.value) return null
  const temp = weatherData.value.main.temp
  const humidity = weatherData.value.main.humidity
  const windSpeed = weatherData.value.wind.speed
  const clouds = weatherData.value.clouds.all
  const weatherMain = weatherData.value.weather[0].main.toLowerCase()
  const conditions = { suitable: true, recommendations: [] as string[] }
  if (temp > 35) {
    conditions.suitable = false
    conditions.recommendations.push('Suhu terlalu tinggi. Siram tanaman lebih sering dan hindari penyemprotan pestisida.')
  } else if (temp < 15) {
    conditions.suitable = false
    conditions.recommendations.push('Suhu terlalu rendah. Lindungi tanaman dari embun beku.')
  } else if (temp >= 25 && temp <= 35) {
    conditions.recommendations.push('Suhu optimal untuk pertumbuhan tanaman tropis.')
  }
  if (humidity > 85) {
    conditions.recommendations.push('Kelembaban tinggi. Waspada serangan jamur dan hama.')
  } else if (humidity < 40) {
    conditions.recommendations.push('Kelembaban rendah. Tingkatkan penyiraman.')
  } else {
    conditions.recommendations.push('Kelembaban ideal untuk sebagian besar tanaman.')
  }
  if (windSpeed > 5) {
    conditions.recommendations.push('Angin kencang. Hindari penyemprotan pestisida atau pupuk.')
  } else {
    conditions.recommendations.push('Kondisi angin baik untuk penyemprotan pestisida/pupuk.')
  }
  if (clouds > 80) {
    conditions.recommendations.push('Tingkat cahaya matahari rendah. Tanaman mungkin kurang optimal untuk fotosintesis.')
  } else if (clouds < 30) {
    conditions.recommendations.push('Cahaya matahari optimal untuk fotosintesis tanaman.')
  }
  if (weatherMain.includes('rain') || weatherMain.includes('thunder')) {
    conditions.suitable = false
    conditions.recommendations.push('Hujan. Tunda pemupukan dan penyemprotan pestisida.')
  } else if (weatherMain.includes('clear')) {
    conditions.recommendations.push('Cuaca cerah. Waktu ideal untuk pemupukan dan pengolahan lahan.')
  }
  return conditions
})

const currentLocalTime = computed(() => {
  if (!weatherData.value) return '-'
  const timestamp = weatherData.value.dt
  const timezoneOffset = weatherData.value.timezone
  const utcDate = new Date((timestamp + timezoneOffset) * 1000)
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).format(utcDate)
})

const sunriseTime = computed(() => {
  if (!weatherData.value) return '-'
  const timestamp = weatherData.value.sys.sunrise
  const timezoneOffset = weatherData.value.timezone
  const utcDate = new Date((timestamp + timezoneOffset) * 1000)
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).format(utcDate)
})

const sunsetTime = computed(() => {
  if (!weatherData.value) return '-'
  const timestamp = weatherData.value.sys.sunset
  const timezoneOffset = weatherData.value.timezone
  const utcDate = new Date((timestamp + timezoneOffset) * 1000)
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).format(utcDate)
})

const windDirection = computed(() => {
  if (!weatherData.value || !weatherData.value.wind) return '-'
  const deg = weatherData.value.wind.deg
  if (deg >= 337.5 || deg < 22.5) return 'Utara'
  if (deg >= 22.5 && deg < 67.5) return 'Timur Laut'
  if (deg >= 67.5 && deg < 112.5) return 'Timur'
  if (deg >= 112.5 && deg < 157.5) return 'Tenggara'
  if (deg >= 157.5 && deg < 202.5) return 'Selatan'
  if (deg >= 202.5 && deg < 247.5) return 'Barat Daya'
  if (deg >= 247.5 && deg < 292.5) return 'Barat'
  if (deg >= 292.5 && deg < 337.5) return 'Barat Laut'
  return '-'
})

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(date)
}

const formatHour = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('id-ID', { 
    hour: '2-digit',
    hour12: false
  })
}

onMounted(() => {
  getLocation()
})
</script>

<template>
  <div class="rounded-lg">
    <div class="container mx-auto px-4 py-6">
            <!-- Section Header -->
      <div class="mx-auto mb-12 max-w-4xl text-center">
        <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-linear-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
          <UIcon name="i-lucide-cloudy" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Prediksi Cuaca</span>
        </div>

        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent py-1">
          Informasi Cuaca Pertanian
        </h2>

        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Dapatkan informasi cuaca terkini dan prediksi 5 hari ke depan untuk mendukung keputusan pertanian Anda. 
          <span class="font-semibold text-emerald-600 dark:text-emerald-400">JuruTani</span> membantu meningkatkan 
          <span class="font-semibold text-teal-600 dark:text-teal-400">produktivitas</span> dan 
          <span class="font-semibold text-cyan-600 dark:text-cyan-400">efisiensi</span> lahan pertanian Anda.
        </p>
      </div>
      
      <!-- Navigation Tabs -->
      <div class="flex justify-center mb-6">
        <div class="glass-tab-container">
          <nav class="flex flex-wrap gap-2 sm:gap-1 justify-center">
            <button
              :class="[
                'tab-button',
                activeTab === 'current' && 'tab-button-active'
              ]"
              @click="activeTab = 'current'"
            >
              <UIcon name="i-ic-baseline-wb-sunny" class="w-4 h-4 sm:mr-2" />
              <span class="hidden sm:inline">Cuaca Saat Ini</span>
            </button>
            <button
              :class="[
                'tab-button',
                activeTab === 'hourly' && 'tab-button-active'
              ]"
              @click="activeTab = 'hourly'"
            >
              <UIcon name="i-ic-baseline-access-time" class="w-4 h-4 sm:mr-2" />
              <span class="hidden sm:inline">Ramalan 24 Jam</span>
            </button>
            <button
              :class="[
                'tab-button',
                activeTab === 'forecast' && 'tab-button-active'
              ]"
              @click="activeTab = 'forecast'"
            >
              <UIcon name="i-ic-baseline-date-range" class="w-4 h-4 sm:mr-2" />
              <span class="hidden sm:inline">Ramalan 5 Hari</span>
            </button>
          </nav>
        </div>
      </div>
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- Main Weather Card (selalu tampil) -->
        <WeatherMainCard
          v-if="weatherData"
          :weather-data="weatherData"
          :current-local-time="currentLocalTime"
          :sunrise-time="sunriseTime"
          :sunset-time="sunsetTime"
        />
        <!-- Tab Details (hanya detail yang berubah) -->
        <WeatherTabDetails
          :active-tab="activeTab"
          :is-loading="isLoading"
          :is-forecast-loading="isForecastLoading"
          :is-hourly-loading="isHourlyLoading"
          :error="error"
          :forecast-error="forecastError"
          :hourly-error="hourlyError"
          :weather-data="weatherData"
          :forecast-data="forecastData"
          :hourly-data="hourlyData"
          :farming-conditions="farmingConditions"
          :wind-direction="windDirection"
          :sunrise-time="sunriseTime"
          :sunset-time="sunsetTime"
          :format-hour="formatHour"
          :format-date-short="formatDateShort"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
/* Glass Tab Container */
.glass-tab-container {
  @apply relative overflow-hidden rounded-2xl p-1.5;
  @apply bg-white/70 dark:bg-gray-800/70;
  @apply backdrop-blur-xl backdrop-saturate-150;
  @apply border border-white/20 dark:border-gray-700/30;
  @apply shadow-xl shadow-black/5 dark:shadow-black/20;
}

.glass-tab-container::before {
  content: '';
  @apply absolute inset-0 rounded-2xl;
  @apply bg-linear-to-br from-green-500/5 to-transparent;
  @apply dark:from-green-500/10;
  pointer-events: none;
}

/* Tab Button */
.tab-button {
  @apply relative px-4 py-3 sm:px-6 rounded-xl;
  @apply text-sm font-medium;
  @apply text-gray-600 dark:text-gray-300;
  @apply transition-all duration-300;
  @apply hover:text-green-500 dark:hover:text-green-400;
  @apply hover:bg-white/50 dark:hover:bg-gray-700/50;
  @apply flex items-center justify-center;
  @apply min-w-[44px] sm:min-w-0;
}

.tab-button-active {
  @apply bg-linear-to-br from-green-500 to-emerald-600;
  @apply text-white shadow-lg shadow-green-500/30;
  @apply hover:text-white;
  @apply hover:from-green-600 hover:to-emerald-700;
}

.tab-button-active::before {
  content: '';
  @apply absolute inset-0 rounded-xl;
  @apply bg-linear-to-br from-white/20 to-transparent;
  pointer-events: none;
}

/* Custom scrollbar untuk horizontal scroll */
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
</style>