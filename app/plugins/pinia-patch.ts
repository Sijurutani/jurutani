import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin({
  name: 'pinia-patch',
  enforce: 'pre',
  setup(nuxtApp) {
    if (nuxtApp.$pinia) {
      const pinia = nuxtApp.$pinia as any
      pinia.state.value = pinia.state.value || {}
    }
  }
})
