<script setup lang="ts">
  const sweepRef = ref<HTMLElement | null>(null)
  const route = useRoute()

  // GSAP is removed. The animation is now handled by CSS.
  // The sweep badge animation is defined in tailwind.css.
</script>

<template>
  <!-- auth-shell: full height, overflow hidden, bg dari CSS var -->
  <div
    class="relative h-dvh w-full overflow-hidden bg-(--auth-shell-bg) text-[var(--text-base)]"
  >
    <!-- Background Image — full on mobile, half on desktop -->
    <div class="absolute inset-0 lg:w-1/2">
      <NuxtImg
        src="/services/pakarjurutani.webp"
        alt="Petani profesional JuruTani"
        class="h-full w-full object-cover"
        sizes="100vw lg:50vw"
      />
      <!-- Gradient overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent lg:from-black/80 lg:via-black/40 lg:to-black/20"
      />
    </div>

    <!-- Top bar: Logo + Dark Mode Switch -->
    <div
      class="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-6 lg:w-1/2 lg:p-8"
    >
      <NuxtLink class="inline-flex" to="/">
        <NuxtImg
          src="/jurutani_long_logo.webp"
          alt="Logo JuruTani"
          class="h-10 w-auto"
        />
      </NuxtLink>
      <!-- Theme switch dengan glassmorphism kecil -->
      <div
        class="inline-flex rounded-full border border-white/40 bg-black/25 p-0.5 backdrop-blur-sm"
      >
        <UiDarkModeSwitch />
      </div>
    </div>

    <!-- Hero Text — desktop only -->
    <div
      class="pointer-events-none absolute inset-x-0 top-[15%] z-10 px-6 text-white sm:top-[20%] lg:bottom-0 lg:top-auto lg:w-1/2 lg:p-10 lg:pb-12"
    >
      <div class="hidden lg:block">
        <!-- Sweep badge -->
        <span
          class="sweep-badge inline-flex rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs tracking-wide backdrop-blur-sm"
        >
          JuruTani Indonesia
          <span
            ref="sweepRef"
            class="sweep-badge__sweep animate-sweep-light"
            aria-hidden="true"
          />
        </span>
        <h2
          class="mt-4 max-w-md text-3xl font-semibold leading-tight lg:text-4xl"
        >
          Pertanian modern, langkah lebih pasti.
        </h2>
        <p class="mt-3 max-w-md text-sm text-white/85 lg:text-base">
          Satu platform untuk pantau lahan, harga pangan, dan edukasi tani
          harian.
        </p>
      </div>
    </div>

    <!-- Form Pane — wrap Transition di sini agar seluruh panel (rounded sheet) ikut animasi -->
    <!-- Parent sudah overflow-hidden jadi translateY 100% akan ter-clip rapi -->
    <!-- appear: jalankan enter transition juga saat initial render (bukan hanya navigasi) -->
    <Transition
      mode="out-in"
      appear
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-full"
    >
      <main
        :key="route.path"
        class="absolute inset-x-0 bottom-0 z-20 flex max-h-[90dvh] flex-col overflow-y-auto rounded-t-[32px] sm:rounded-t-[40px] border-t border-white/20 dark:border-white/10 p-5 sm:p-8 lg:static lg:ml-auto lg:h-full lg:w-1/2 lg:max-h-none lg:justify-center lg:rounded-none lg:border-t-0 lg:p-12 auth-form-pane"
      >
        <div class="mx-auto w-full max-w-md">
          <!-- Mobile pull indicator -->
          <div
            class="mx-auto mb-3 sm:mb-6 h-1 w-10 sm:h-1.5 sm:w-12 rounded-full bg-neutral-300/80 dark:bg-neutral-600/80 lg:hidden"
          />
          <slot />
        </div>
      </main>
    </Transition>
  </div>
</template>

<style scoped>
  /* ── Form Pane glassmorphism (mobile) / solid (desktop) ── */
  .auth-form-pane {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }

  :root.dark .auth-form-pane {
    background: rgba(20, 20, 20, 0.7);
  }

  @media (min-width: 1024px) {
    .auth-form-pane {
      background: var(--auth-pane-bg) !important;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }
  }

  /* ── Sweep badge ── */
  .sweep-badge {
    position: relative;
    overflow: hidden;
  }

  .sweep-badge__sweep {
    position: absolute;
    top: -45%;
    left: -140%;
    width: 45%;
    height: 190%;
    background: linear-gradient(
      120deg,
      transparent 10%,
      rgb(255 255 255 / 55%) 50%,
      transparent 90%
    );
    transform: skewX(-20deg);
    opacity: 0;
    pointer-events: none;
  }
</style>
