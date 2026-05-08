/**
 * Composable untuk fetch data cuaca OpenWeatherMap.
 * Dipisahkan dari komponen agar tidak di-parse sebagai CSS oleh Tailwind v4.
 */
export const useWeatherData = () => {
  const weatherData = ref<any>(null)
  const isLoading = ref(true)
  const error = ref('')

  const BASE = 'https://api.openweathermap.org/data/2.5/weather'
  const KEY = '416f0ed0bb28d3110beedecf5fa9cf85'

  const fetchByCoords = async (lat: number, lon: number) => {
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
      error.value = ''
    } catch (e) {
      weatherData.value = null
      error.value = e instanceof Error ? e.message : 'Gagal mengambil data cuaca'
    } finally {
      isLoading.value = false
    }
  }

  const requestLocation = () => {
    if (!import.meta.client) return
    if (!navigator.geolocation) {
      isLoading.value = false
      error.value = 'Geolocation tidak didukung browser ini'
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => {
        isLoading.value = false
        error.value = 'Izin lokasi ditolak'
      },
    )
  }

  return { weatherData, isLoading, error, requestLocation }
}
