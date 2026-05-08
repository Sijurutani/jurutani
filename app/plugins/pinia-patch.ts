import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin({
  name: 'pinia-patch',
  enforce: 'pre',
  setup(nuxtApp) {
    // Memastikan pinia dan state tidak undefined saat SSR atau Hydration
    // Mencegah error "Cannot read properties of undefined (reading 'state')"
    if (nuxtApp.$pinia) {
      const pinia = nuxtApp.$pinia as any
      if (!pinia.state) {
        pinia.state = { value: {} }
      } else {
        pinia.state.value = pinia.state.value || {}
      }
    } else if (import.meta.server) {
      // Jika pinia benar-benar undefined (biasanya karena race condition),
      // kita berikan fallback object untuk menghindari crash di app:rendered
      nuxtApp.hook('app:rendered', () => {
        if (!nuxtApp.$pinia) {
          nuxtApp.$pinia = { state: { value: {} } } as any
        }
      })
    }
  }
})
