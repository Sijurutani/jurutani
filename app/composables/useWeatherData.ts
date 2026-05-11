/**
 * Composable untuk fetch data cuaca OpenWeatherMap.
 * Dipisahkan dari komponen agar tidak di-parse sebagai CSS oleh Tailwind v4.
 */
export const useWeatherData = () => {
  const weatherData = ref<any>(null)
  const isLoading = ref(true)
  const error = ref('')

  const config = useRuntimeConfig()
  const BASE = (config.public.openweatherBaseUrl || 'https://api.openweathermap.org/data/2.5') + '/weather'
  const KEY = config.public.openweatherApiKey || ''

  const fetchByCoords = async (lat: number, lon: number) => {
    isLoading.value = true
    error.value = ''
    try {
      const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lon),
        appid: KEY,
        units: 'metric',
        lang: 'id',
      })
      const res = await fetch(BASE + '?' + params.toString())
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || 'Gagal mengambil data cuaca')
      weatherData.value = json
    } catch (e) {
      weatherData.value = null
      error.value = e instanceof Error ? e.message : 'Gagal mengambil data cuaca'
    } finally {
      isLoading.value = false
    }
  }

  const fetchDefault = () => {
    // Default fetch ke Jakarta Pusat
    fetchByCoords(-6.2088, 106.8456)
  }

  const requestLocation = () => {
    if (!import.meta.client) return
    if (!navigator.geolocation) {
      error.value = 'Geolocation tidak didukung browser ini'
      isLoading.value = false
      return
    }
    
    isLoading.value = true
    error.value = ''
    
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        isLoading.value = false
        if (err.code === err.PERMISSION_DENIED) {
           error.value = 'Izin lokasi ditolak. Menampilkan cuaca default.'
           fetchDefault() // Fallback
        } else {
           error.value = 'Gagal mendapatkan lokasi'
        }
      },
    )
  }

  return { weatherData, isLoading, error, requestLocation, fetchDefault }
}
