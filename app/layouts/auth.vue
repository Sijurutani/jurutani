<template>
  <div class="auth-shell relative h-[100dvh] w-full overflow-hidden text-(--text-base)">
    <!-- Background Image (Full on mobile, half on desktop) -->
    <div class="absolute inset-0 lg:w-1/2">
      <NuxtImg
        src="/services/pakarjurutani.webp"
        alt="Petani profesional JuruTani"
        class="h-full w-full object-cover"
        sizes="100vw lg:50vw"
      />
      <!-- Soft gradient overlay for better text readability and dark vibe -->
      <div class="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent lg:from-black/80 lg:via-black/40 lg:to-black/20" />
    </div>

    <!-- Header / Nav Elements (Top) -->
    <div class="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-6 lg:w-1/2 lg:p-8">
      <NuxtLink class="inline-flex" to="/">
        <NuxtImg src="/LOGO02.png" alt="Logo JuruTani" class="h-10 w-auto" />
      </NuxtLink>
      <div class="inline-flex rounded-full border border-white/40 bg-white/10 p-0.5 backdrop-blur-sm">
        <DarkModeSwitch />
      </div>
    </div>

    <!-- Hero Text (Hidden on mobile, prominent on desktop) -->
    <div class="pointer-events-none absolute inset-x-0 top-[15%] z-10 px-6 text-white sm:top-[20%] lg:bottom-0 lg:top-auto lg:w-1/2 lg:p-10 lg:pb-12">
      <div class="hidden lg:block">
        <span class="sweep-badge inline-flex rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs tracking-wide backdrop-blur-sm">
          JuruTani Indonesia
        </span>
        <h2 class="mt-4 max-w-md text-3xl font-semibold leading-tight lg:text-4xl">
          Pertanian modern, langkah lebih pasti.
        </h2>
        <p class="mt-3 max-w-md text-sm text-white/85 lg:text-base">
          Satu platform untuk pantau lahan, harga pangan, dan edukasi tani harian.
        </p>
      </div>
    </div>

    <!-- Form Pane -->
    <main class="auth-form-pane absolute inset-x-0 bottom-0 z-20 flex max-h-[90dvh] flex-col overflow-y-auto rounded-t-[32px] sm:rounded-t-[40px] border-t border-white/20 p-5 sm:p-8 dark:border-white/10 lg:static lg:ml-auto lg:h-full lg:w-1/2 lg:max-h-none lg:justify-center lg:rounded-none lg:border-t-0 lg:p-12">
      <div class="mx-auto w-full max-w-md">
        <!-- Mobile pull indicator -->
        <div class="mx-auto mb-3 sm:mb-6 h-1 w-10 sm:h-1.5 sm:w-12 rounded-full bg-neutral-300/80 dark:bg-neutral-600/80 lg:hidden" />
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth-shell {
  background: var(--auth-shell-bg);
}

/* Glassmorphism pane for mobile, solid for desktop or adapt based on theme */
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

.auth-theme-switch {
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 35%);
  background: rgb(0 0 0 / 25%);
  backdrop-filter: blur(8px);
}

.sweep-badge {
  position: relative;
  overflow: hidden;
}

.sweep-badge::after {
  content: '';
  position: absolute;
  top: -45%;
  left: -140%;
  width: 45%;
  height: 190%;
  background: linear-gradient(120deg, transparent 10%, rgb(255 255 255 / 55%) 50%, transparent 90%);
  transform: skewX(-20deg);
  animation: badge-sweep 4.8s ease-in-out infinite;
}

@keyframes badge-sweep {
  0%,
  68% {
    left: -140%;
  }

  100% {
    left: 160%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sweep-badge::after {
    animation: none;
  }
}
</style>
