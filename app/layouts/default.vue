<script setup lang="ts">
  import gsap from 'gsap'

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

      const orbs = gsap.utils.toArray<HTMLElement>('.ambient-orb')
      orbs.forEach((orb) => {
        const isSlow = orb.classList.contains('ambient-orb--slow')
        const isReverse = orb.classList.contains('ambient-orb--reverse')
        const drift = isReverse ? 16 : -20

        gsap.to(orb, {
          y: drift,
          scale: 1.04,
          opacity: 0.3,
          duration: isSlow ? 21 : 16,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      })
    })
  })

  onUnmounted(() => {
    layoutAnimContext?.revert()
    layoutAnimContext = null
  })
</script>

<template>
  <div class="relative">
    <LayoutFirstVisitModal />
    <div
      class="fixed inset-0 z-0 bg-linear-to-b from-green-50 via-green-100 to-blue-50 dark:from-green-950 dark:via-green-800 dark:to-green-950 pointer-events-none"
    />

    <!-- Decorative blur circles -->
    <div
      class="ambient-orb pointer-events-none fixed top-20 left-10 h-72 w-72 rounded-full bg-green-200 opacity-20 blur-3xl dark:bg-green-800"
    />
    <div
      class="ambient-orb ambient-orb--slow pointer-events-none fixed right-10 bottom-20 h-96 w-96 rounded-full bg-blue-200 opacity-20 blur-3xl dark:bg-blue-800"
    />
    <div
      class="ambient-orb ambient-orb--reverse pointer-events-none fixed top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-green-100 opacity-10 blur-2xl dark:bg-green-700"
    />

    <div
      class="relative z-10 min-h-screen flex flex-col bg-transparent text-green-900 dark:text-green-100"
    >
      <LayoutNavigation />

      <UMain class="app-reveal">
        <slot />
      </UMain>

      <div class="app-reveal app-reveal--2">
        <LayoutFooter />
      </div>
    </div>
  </div>
</template>
