import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable untuk manage navbar scroll state dan behavior
 * Menggunakan throttle untuk optimize performance
 */
export const useNavbarScroll = (threshold = 10) => {
  const isScrolled = ref(false)
  const scrollY = ref(0)
  const isScrollingDown = ref(false)
  const lastScrollY = ref(0)

  let ticking = false

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        scrollY.value = window.scrollY
        isScrolled.value = scrollY.value > threshold
        isScrollingDown.value =
          scrollY.value > lastScrollY.value && scrollY.value > threshold
        lastScrollY.value = scrollY.value
        ticking = false
      })
      ticking = true
    }
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // Initial check
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return {
    isScrolled,
    scrollY,
    isScrollingDown,
  }
}
