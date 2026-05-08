<script setup lang="ts">
  import { onClickOutside } from '@vueuse/core'
  import gsap from 'gsap'

  const router = useRouter()
  const { isScrolled } = useNavbarScroll()

  const handleBack = () => {
    // Jika ada history sebelumnya di router (tidak buka tab baru/refresh langsung di halaman ini)
    if (window.history.state && window.history.state.back) {
      router.back()
    } else {
      // Fallback jika tidak ada riwayat
      router.push('/')
    }
  }

  let layoutAnimContext: gsap.Context | null = null

  const getRevealDelay = (el: HTMLElement) => {
    const delayValue = getComputedStyle(el)
      .getPropertyValue('--reveal-delay')
      .trim()
    const parsed = Number.parseFloat(delayValue)
    return Number.isNaN(parsed) ? 0 : parsed
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('.app-reveal', { opacity: 1, clearProps: 'transform' })
      return
    }

    layoutAnimContext = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>('.app-reveal')
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 14, scale: 0.99 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            delay: getRevealDelay(el),
            clearProps: 'transform',
          },
        )
      })
    })
  })

  onUnmounted(() => {
    layoutAnimContext?.revert()
    layoutAnimContext = null
  })
</script>

<template>
  <div
    class="relative min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 dark:from-neutral-950 dark:via-emerald-950/10 dark:to-teal-950/10 flex flex-col font-sans"
  >
    <!-- ═══════════════════════ FLOATING NAVBAR ═══════════════════════ -->
    <div
      class="fixed top-0 left-0 right-0 z-60 flex items-center justify-center"
      style="isolation: isolate"
      :class="isScrolled ? 'pt-3' : 'pt-4'"
    >
      <nav
        class="transition-all duration-500 ease-out rounded-full px-4 py-2 flex items-center gap-3"
        :class="[
          isScrolled
            ? 'bg-white/85 dark:bg-emerald-950/85 border border-emerald-200/50 dark:border-emerald-700/40 shadow-lg shadow-emerald-900/10 backdrop-blur-xl'
            : 'bg-white/70 dark:bg-emerald-950/70 border border-emerald-200/30 dark:border-emerald-700/30 shadow-md shadow-emerald-900/5 backdrop-blur-md',
        ]"
        role="navigation"
        aria-label="Page navigation"
      >
        <!-- Back Button -->
        <UButton
          color="neutral"
          variant="ghost"
          class="group flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-800/40 focus-visible:ring-2 focus-visible:ring-emerald-400 dark:focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-emerald-950"
          aria-label="Kembali"
          @click="handleBack"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="h-4 w-4 text-emerald-600 dark:text-emerald-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-200 transition-colors"
          />
        </UButton>

        <!-- Divider -->
        <div class="h-5 w-px bg-emerald-200/40 dark:bg-emerald-700/40" />

        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center shrink-0 transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-emerald-400 dark:focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-emerald-950 rounded-lg px-1"
          aria-label="Kembali ke beranda"
        >
          <NuxtImg
            src="/jurutani.webp"
            alt="Logo JuruTani"
            class="h-7 w-auto"
            loading="eager"
            preload
          />
        </NuxtLink>

        <!-- Divider -->
        <div class="h-5 w-px bg-emerald-200/40 dark:bg-emerald-700/40" />

        <!-- Dark Mode Switch -->
        <UiDarkModeSwitch />
      </nav>
    </div>

    <!-- Main Content Slot -->
    <main
      class="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-8 sm:pb-16 app-reveal app-reveal--2"
    >
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="py-8 text-center text-sm text-emerald-700/70 dark:text-emerald-300/70 border-t border-emerald-200/30 dark:border-emerald-700/30"
    >
      <p>
        &copy; {{ new Date().getFullYear() }}
        <span class="font-semibold text-emerald-700 dark:text-emerald-300"
          >JuruTani</span
        >. All rights reserved.
      </p>
    </footer>
  </div>
</template>
