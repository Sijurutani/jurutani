<script setup lang="ts">
const weatherData = ref<any>(null)
const isLoading = ref(true)
const error = ref('')

const BASE_URL = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5'
const API_KEY = process.env.OPENWEATHER_API_KEY || '416f0ed0bb28d3110beedecf5fa9cf85'

const fetchWeatherData = async (lat: number, lon: number) => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
  try {
    const response = await fetch(url)
    const data = await response.json()
    if (!response.ok) throw new Error(data?.message || 'Gagal mengambil data cuaca')
    weatherData.value = data
    error.value = ''
  } catch (fetchError) {
    weatherData.value = null
    error.value = fetchError instanceof Error ? fetchError.message : 'Gagal mengambil data cuaca'
  } finally {
    isLoading.value = false
  }
}

const getLocation = () => {
  if (!import.meta.client) return
  if (!navigator.geolocation) {
    isLoading.value = false
    error.value = 'Geolocation tidak didukung'
    return
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => await fetchWeatherData(pos.coords.latitude, pos.coords.longitude),
    () => { isLoading.value = false; error.value = 'Lokasi tidak dapat diakses' }
  )
}

// Current time
const currentTime = ref('')
const updateTime = () => {
  currentTime.value = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(new Date())
}

const windDirection = computed(() => {
  if (!weatherData.value?.wind) return ''
  const dirs = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL']
  return dirs[Math.round(weatherData.value.wind.deg / 45) % 8]
})

const farmingSuitable = computed(() => {
  if (!weatherData.value) return true
  const main = weatherData.value.weather[0].main.toLowerCase()
  const temp = weatherData.value.main.temp
  return !main.includes('rain') && !main.includes('thunder') && temp >= 15 && temp <= 35
})

// Themed gradient + decoration based on condition
const theme = computed(() => {
  if (!weatherData.value) return { grad: 'from-slate-700 to-slate-900', accent: '#94a3b8', orb1: '#334155', orb2: '#1e293b' }
  const main = weatherData.value.weather[0].main.toLowerCase()
  const temp = weatherData.value.main.temp
  if (main.includes('thunder')) return { grad: 'from-slate-900 via-purple-950 to-slate-900', accent: '#a78bfa', orb1: '#4c1d95', orb2: '#1e1b4b' }
  if (main.includes('rain') || main.includes('drizzle')) return { grad: 'from-slate-700 via-blue-900 to-slate-800', accent: '#93c5fd', orb1: '#1e3a5f', orb2: '#0f2a4a' }
  if (main.includes('cloud')) return { grad: 'from-slate-500 via-slate-700 to-slate-800', accent: '#cbd5e1', orb1: '#334155', orb2: '#1e293b' }
  if (main.includes('mist') || main.includes('fog')) return { grad: 'from-slate-400 via-slate-600 to-slate-700', accent: '#e2e8f0', orb1: '#475569', orb2: '#334155' }
  if (temp >= 32) return { grad: 'from-orange-600 via-amber-700 to-red-800', accent: '#fde68a', orb1: '#b45309', orb2: '#92400e' }
  if (temp >= 25) return { grad: 'from-emerald-700 via-teal-800 to-cyan-900', accent: '#86efac', orb1: '#065f46', orb2: '#0f4c5c' }
  return { grad: 'from-indigo-700 via-blue-800 to-cyan-900', accent: '#bfdbfe', orb1: '#1e3a8a', orb2: '#0c4a6e' }
})

onMounted(() => {
  getLocation()
  updateTime()
  setInterval(updateTime, 30000)
})
</script>

<template>
  <div class="wx-root">

    <div class="wx-head qa-topic-head">
      <div class="qa-topic-head__main">
        <div class="wx-head__icon-wrap">
          <UIcon name="i-lucide-cloud-sun" class="w-4 h-4" />
        </div>
        <div class="qa-topic-head__text">
          <h2 class="qa-block__heading">Cuaca Hari Ini</h2>
          <p class="qa-block__desc">Pantau kondisi cuaca lokal untuk mendukung aktivitas bertani.</p>
        </div>
      </div>
    </div>

    <!-- ── Loading ── -->
    <div v-if="isLoading" class="wx-card bg-linear-to-br from-slate-700 to-slate-900">
      <div class="wx-card__inner">
        <div class="wx-left">
          <div class="wx-temp-skeleton" />
          <div class="wx-desc-skeleton" />
        </div>
        <div class="flex items-center gap-2 ml-auto">
          <div class="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          <span class="text-white/50 text-xs">Memuat cuaca...</span>
        </div>
      </div>
    </div>

    <!-- ── Error ── -->
    <div v-else-if="error" class="wx-card bg-linear-to-br from-slate-700 to-slate-800">
      <div class="wx-card__inner">
        <UIcon name="i-lucide-cloud-off" class="w-8 h-8 text-white/40" />
        <div class="flex flex-col gap-0.5 ml-2">
          <span class="text-white/60 text-sm">{{ error }}</span>
          <button class="text-white/40 text-xs underline text-left" @click="getLocation">Coba lagi</button>
        </div>
      </div>
    </div>

    <!-- ── Weather Card ── -->
    <NuxtLink
      v-else-if="weatherData"
      to="/weathers"
      class="wx-card"
      :class="`bg-linear-to-br ${theme.grad}`"
    >
      <!-- Decorative orbs -->
      <div class="wx-orb wx-orb--1" :style="{ background: theme.orb1 }" />
      <div class="wx-orb wx-orb--2" :style="{ background: theme.orb2 }" />

      <!-- Ground / landscape strip -->
      <div class="wx-ground" />

      <!-- ── Inner layout ── -->
      <div class="wx-card__inner">

        <!-- LEFT: Big temp + description -->
        <div class="wx-left">
          <div class="wx-temp">
            <span class="wx-temp__num">{{ Math.round(weatherData.main.temp) }}</span>
            <span class="wx-temp__unit">°</span>
          </div>
          <p class="wx-condition">{{ weatherData.weather[0].description }}</p>
        </div>

        <!-- CENTER: Weather icon floating -->
        <div class="wx-icon-wrap">
          <img
            :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
            :alt="weatherData.weather[0].description"
            class="wx-icon"
            @error="(e: any) => e.target.style.display = 'none'"
          >
        </div>

        <!-- RIGHT: Location, time, stats -->
        <div class="wx-right">
          <!-- time + location -->
          <div class="wx-right__top">
            <span class="wx-time">{{ currentTime }}</span>
            <span class="wx-location">
              <UIcon name="i-heroicons-map-pin-solid" class="w-3 h-3 inline -mt-0.5" />
              {{ weatherData.name }}
            </span>
          </div>

          <!-- stats row -->
          <div class="wx-stats">
            <div class="wx-stat">
              <UIcon name="i-ic-baseline-water-drop" class="w-3.5 h-3.5 text-blue-300 shrink-0" />
              <span class="wx-stat__val">{{ weatherData.main.humidity }}%</span>
            </div>
            <div class="wx-stat">
              <UIcon name="i-ic-baseline-air" class="w-3.5 h-3.5 text-cyan-300 shrink-0" />
              <span class="wx-stat__val">{{ weatherData.wind?.speed || 0 }} m/s {{ windDirection }}</span>
            </div>
            <div
              class="wx-farming"
              :class="farmingSuitable ? 'wx-farming--ok' : 'wx-farming--warn'"
            >
              <UIcon :name="farmingSuitable ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-triangle'" class="w-3 h-3" />
              {{ farmingSuitable ? 'Kondisi Optimal' : 'Perlu Perhatian' }}
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>

    <NuxtLink to="/weathers" class="wx-see-more-btn">
      Selengkapnya <span class="sr-only">tentang Cuaca</span>
      <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
    </NuxtLink>

  </div>
</template>

<style scoped>
/* ── Root: full width, max-w sejajar container ── */
.wx-root {
  width: 100%;
  max-width: 80rem;
  margin-inline: auto;
  padding-inline: 1rem;
}

@media (min-width: 1024px) {
  .wx-root {
    max-width: 60%;
  }
}

.wx-head {
  margin-bottom: 0.75rem;
}

.qa-topic-head {
  align-items: stretch;
  gap: 0.75rem;
}

.qa-topic-head__main {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}

.qa-topic-head__text {
  min-width: 0;
}

.qa-block__heading {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-base, #111827);
  line-height: 1.3;
  margin: 0 0 0.2rem;
  letter-spacing: -0.01em;
}

.qa-block__desc {
  font-size: 0.75rem;
  color: var(--text-muted, #6b7280);
  line-height: 1.5;
  margin: 0;
}

@media (min-width: 768px) {
  .qa-block__heading {
    font-size: 1.2rem;
  }
}

.wx-head__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #16a34a;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

/* ── Card ── */
.wx-card {
  position: relative;
  display: block;
  width: 100%;
  border-radius: 1.25rem;
  overflow: hidden;
  text-decoration: none;
  cursor: pointer;
  height: 140px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 8px 32px -8px rgba(0,0,0,0.4);
}

@media (min-width: 640px) {
  .wx-card {
    height: 160px;
  }
}

@media (min-width: 1024px) {
  .wx-card {
    min-height: 200px;
    height: 100%;
  }
}

.wx-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px -8px rgba(0,0,0,0.5);
}

/* ── Decorative orbs ── */
.wx-orb {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  filter: blur(40px);
  pointer-events: none;
}

.wx-orb--1 {
  width: 200px;
  height: 200px;
  top: -60px;
  right: 5%;
}

.wx-orb--2 {
  width: 160px;
  height: 160px;
  bottom: -50px;
  left: 30%;
}

/* ── Ground landscape strip ── */
.wx-ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 36%;
  background: linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%);
  mask-image: radial-gradient(ellipse 120% 100% at 50% 100%, black 60%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 120% 100% at 50% 100%, black 60%, transparent 100%);
}

/* ── Inner flex layout ── */
.wx-card__inner {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 1rem;
  gap: 0.5rem;
  overflow: hidden;
}

/* ── LEFT: Temperature block ── */
.wx-left {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-width: 0;
}

.wx-temp {
  display: flex;
  align-items: flex-start;
  line-height: 1;
}

.wx-temp__num {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.04em;
  line-height: 1;
  text-shadow: 0 2px 16px rgba(0,0,0,0.3);
}

.wx-temp__unit {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 300;
  color: rgba(255,255,255,0.7);
  margin-top: 0.25rem;
}

.wx-condition {
  font-size: clamp(0.7rem, 2vw, 0.875rem);
  color: rgba(255,255,255,0.75);
  text-transform: capitalize;
  letter-spacing: 0.02em;
  margin-top: 0.25rem;
  white-space: nowrap;
}

/* ── CENTER: Weather icon ── */
.wx-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-inline: auto;
}

.wx-icon {
  width: clamp(3rem, 8vw, 5rem);
  height: clamp(3rem, 8vw, 5rem);
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
}

/* ── RIGHT: Info block ── */
.wx-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding-block: 0.25rem;
  flex-shrink: 0;
  align-items: flex-end;
  margin-left: auto;
  gap: 0.5rem;
  min-width: 0;
  max-width: 45%;
}

.wx-right__top {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  min-width: 0;
  width: 100%;
}

.wx-time {
  font-size: clamp(1rem, 3vw, 1.625rem);
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
  line-height: 1;
  white-space: nowrap;
}

.wx-location {
  font-size: 0.6rem;
  color: rgba(255,255,255,0.65);
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

/* ── Stats row ── */
.wx-stats {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.wx-stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 9999px;
  padding: 0.2rem 0.5rem;
}

.wx-stat__val {
  font-size: 0.7rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.wx-farming {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  white-space: nowrap;
}

.wx-farming--ok {
  background: rgba(16,185,129,0.25);
  color: #6ee7b7;
  border: 1px solid rgba(110,231,183,0.3);
}

.wx-farming--warn {
  background: rgba(245,158,11,0.25);
  color: #fcd34d;
  border: 1px solid rgba(252,211,77,0.3);
}

.wx-see-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
  align-self: flex-end;
  padding: 0.4rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #16a34a;
  background: rgba(22, 163, 74, 0.08);
  border: 1px solid rgba(22, 163, 74, 0.2);
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.wx-see-more-btn:hover {
  background: rgba(22, 163, 74, 0.15);
  border-color: rgba(22, 163, 74, 0.4);
  transform: translateX(2px);
}

.wx-root :deep(.wx-see-more-btn) {
  margin-right: 0;
}

:root.dark .wx-head__icon-wrap {
  background: rgba(22, 163, 74, 0.2);
  color: #4ade80;
}

:root.dark .qa-block__heading {
  color: #f9fafb;
}

.wx-head :deep(.qa-topic-head__main) {
  align-items: flex-start;
}

:root.dark .wx-see-more-btn {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.08);
  border-color: rgba(74, 222, 128, 0.2);
}

:root.dark .wx-see-more-btn:hover {
  background: rgba(74, 222, 128, 0.15);
  border-color: rgba(74, 222, 128, 0.4);
}

/* ── Skeleton states ── */
.wx-temp-skeleton {
  width: 8rem;
  height: 4rem;
  background: rgba(255,255,255,0.1);
  border-radius: 0.5rem;
  animation: pulse 1.5s infinite;
}

.wx-desc-skeleton {
  width: 5rem;
  height: 0.875rem;
  background: rgba(255,255,255,0.08);
  border-radius: 0.25rem;
  margin-top: 0.5rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* ── Mobile: hide farming badge if too cramped ── */
@media (max-width: 440px) {
  .wx-farming {
    display: none;
  }
  .wx-icon-wrap {
    display: none;
  }
}
</style>
