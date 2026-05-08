import { ref, watch } from 'vue'
import { useScrollLock } from '@vueuse/core'

/**
 * Composable untuk manage mobile menu state
 * Includes body scroll lock dan keyboard navigation
 */
export const useMobileMenu = () => {
  const isOpen = ref(false)
  const menuRef = ref<HTMLElement | null>(null)
  const isLocked = useScrollLock(
    typeof document !== 'undefined' ? document.body : null,
  )

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  // Auto lock/unlock body scroll
  watch(isOpen, (newValue) => {
    isLocked.value = newValue
  })

  // Keyboard handler
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) {
      close()
    }
  }

  return {
    isOpen,
    menuRef,
    open,
    close,
    toggle,
    handleKeydown,
  }
}
