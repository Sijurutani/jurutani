<script setup lang="ts">
const props = defineProps({
  activeTab: { type: String, required: true },
  isLoading: { type: Boolean, required: true },
  isForecastLoading: { type: Boolean, required: true },
  isHourlyLoading: { type: Boolean, required: true },
  error: { type: String, required: true },
  forecastError: { type: String, required: true },
  hourlyError: { type: String, required: true },
  weatherData: { type: Object, required: false },
  forecastData: { type: [Array, Object], required: false },
  hourlyData: { type: [Array, Object], required: false },
  farmingConditions: { type: Object, required: false },
  windDirection: { type: String, required: false },
  sunriseTime: { type: String, required: false },
  sunsetTime: { type: String, required: false },
  formatHour: { type: Function, required: true },
  formatDateShort: { type: Function, required: true },
})
</script>
<template>
  <div>
    <WeatherCurrentDetails
      v-if="activeTab === 'current'"
      :is-loading="isLoading"
      :error="error"
      :weather-data="weatherData"
      :farming-conditions="farmingConditions"
      :wind-direction="windDirection"
      :sunrise-time="sunriseTime"
      :sunset-time="sunsetTime"
    />
    <WeatherHourlyDetails
      v-else-if="activeTab === 'hourly'"
      :is-loading="isHourlyLoading"
      :error="hourlyError"
      :hourly-data="hourlyData"
      :format-hour="formatHour"
    />
    <WeatherForecastDetails
      v-else-if="activeTab === 'forecast'"
      :is-loading="isForecastLoading"
      :error="forecastError"
      :forecast-data="forecastData"
      :format-date-short="formatDateShort"
    />
  </div>
</template>
