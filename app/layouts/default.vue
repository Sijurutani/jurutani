<script setup lang="ts">
import { useMobileMenu } from '~/composables/useMobileMenu'
import { useNavbarScroll } from '~/composables/useNavbarScroll'

const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu, handleKeydown, menuRef } = useMobileMenu()
const { isScrolled } = useNavbarScroll()

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const navbarClasses = computed(() => ({
  'bg-white/90 dark:bg-green-950/90 backdrop-blur-xl shadow-lg border-b border-green-200/50 dark:border-green-700/50': isScrolled.value,
  'bg-transparent': !isScrolled.value,
}))
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- Background gradient -->
    <div
      class="absolute inset-0 z-0 bg-linear-to-b from-green-50 via-green-100 to-blue-50 dark:from-green-950 dark:via-green-800 dark:to-green-950"
    />

    <!-- Decorative blur circles -->
    <div class="absolute top-20 left-10 w-72 h-72 bg-green-200 dark:bg-green-800 rounded-full opacity-20 blur-3xl" />
    <div class="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-3xl" />
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-100 dark:bg-green-700 rounded-full opacity-10 blur-2xl" />

    <BackgroundRipple class="opacity-30" />

    <div class="relative z-10 min-h-screen flex flex-col bg-transparent text-green-900 dark:text-green-100">
      <nav
        class="fixed top-0 left-0 right-0 z-60 transition-all duration-300"
        :class="navbarClasses"
        role="navigation"
        aria-label="Main navigation"
      >
        <div class="container max-w-7xl mx-auto px-4 py-3">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div
                class="flex flex-nowrap items-center justify-center gap-2 p-2 rounded-xl bg-white/50 dark:bg-green-900/50 backdrop-blur-sm border border-green-100/50 dark:border-green-700/50 shadow-sm transition-all duration-300 hover:shadow-md xl:hidden"
                role="toolbar"
                aria-label="hamburger menu"
              >
                <UButton
                  :icon="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
                  variant="ghost"
                  size="sm"
                  :aria-label="isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'"
                  :aria-expanded="isMobileMenuOpen"
                  @click="toggleMobileMenu"
                />
              </div>
              <NavLogo />
            </div>

            <div class="hidden xl:flex flex-1 justify-center max-w-3xl">
              <NavPrimary />
            </div>

            <div class="flex items-center gap-2">
              <NavProfileActions class="hidden sm:flex" />
              <NavSecondary />
            </div>
          </div>
        </div>
      </nav>

      <Transition name="slide-up">
        <div
          v-if="isMobileMenuOpen"
          class="fixed inset-0 z-50 xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <div
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            @click="toggleMobileMenu"
          />

          <div
            ref="menuRef"
            class="absolute bottom-0 left-0 right-0 bg-white dark:bg-green-950 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div class="flex justify-center pt-3 pb-2">
              <div class="w-12 h-1.5 bg-gray-300 dark:bg-green-700 rounded-full" />
            </div>

            <div class="p-4 pb-8">
              <NavPrimary @navigate="toggleMobileMenu" />
            </div>
          </div>
        </div>
      </Transition>

      <UMain>
        <slot />
      </UMain>
      <FootFooter />
    </div>
  </div>
</template>

<style scoped>
body {
  transition: background-color 0.5s, color 0.5s;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-active > div:last-child,
.slide-up-leave-active > div:last-child {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from > div:last-child,
.slide-up-leave-to > div:last-child {
  transform: translateY(100%);
}

.slide-up-enter-from > div:first-child,
.slide-up-leave-to > div:first-child {
  opacity: 0;
}

:global(html) {
  scroll-padding-top: 100px;
}
</style>