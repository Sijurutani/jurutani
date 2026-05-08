<script setup lang="ts">
  /**
   * PageHeroSection — Refined, clean hero section.
   * Minimal footprint, intentional typography, Tailwind-powered animations.
   */

  interface Stat {
    value: string
    label: string
  }

  interface Props {
    title: string
    titleAccent?: string
    subtitle?: string
    badge?: {
      text: string
      icon?: string
    }
    decorative?: 'gradient' | 'pattern' | 'ripple' | 'none'
    cta?: {
      text: string
      icon?: string
      link?: string
      action?: () => void
    }
    ctaSecondary?: {
      text: string
      link: string
      icon?: string
    }
    align?: 'left' | 'center'
    stats?: Stat[]
  }

  const props = withDefaults(defineProps<Props>(), {
    decorative: 'gradient',
    align: 'center',
  })

  const handleCtaClick = () => {
    if (props.cta?.action) props.cta.action()
  }
</script>

<template>
  <section class="relative py-[5.5rem] md:py-[7rem] isolate overflow-hidden select-none" aria-label="Page hero">

    <!-- Decorative background -->
    <div v-if="decorative === 'gradient'" class="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div class="absolute rounded-full blur-[72px] will-change-transform w-[30rem] h-[30rem] -top-[7rem] -right-[7rem] bg-[radial-gradient(circle,rgba(134,239,172,0.15)_0%,transparent_70%)] animate-[drift-a_18s_ease-in-out_infinite_alternate]" />
      <div class="absolute rounded-full blur-[72px] will-change-transform w-[22rem] h-[22rem] -bottom-[5rem] -left-[5rem] bg-[radial-gradient(circle,rgba(52,211,153,0.12)_0%,transparent_70%)] animate-[drift-b_22s_ease-in-out_infinite_alternate]" style="animation-delay: 4s;" />
    </div>

    <div v-else-if="decorative === 'ripple'" class="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true"/>

    <div v-else-if="decorative === 'pattern'" class="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-5 text-green-600" aria-hidden="true">
      <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" class="w-full h-full">
        <defs>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>

    <!-- Inner content -->
    <div :class="['relative z-10 max-w-[68rem] mx-auto px-5 sm:px-8', align === 'center' ? 'text-center' : '']">

      <!-- Badge -->
      <div
        v-if="badge"
        :class="['inline-flex items-center gap-[0.4rem] py-[0.35rem] px-[0.85rem] bg-[var(--bg-badge)] border border-[var(--border-badge)] rounded-full mb-5 w-fit relative overflow-hidden animate-[fade-up_0.55s_ease-out_both]', align === 'center' ? 'mx-auto' : '']"
        style="animation-delay: 0ms;"
      >
        <span class="block w-[0.35rem] h-[0.35rem] rounded-full bg-green-600 shrink-0 will-change-[opacity,transform] animate-[badge-pulse_1.4s_ease-in-out_infinite_alternate]" aria-hidden="true" />
        <UIcon v-if="badge.icon" :name="badge.icon" class="w-[0.8rem] h-[0.8rem] text-[var(--text-badge)] shrink-0" aria-hidden="true" />
        <span class="text-[0.675rem] font-semibold tracking-[0.09em] uppercase text-[var(--text-badge)] whitespace-nowrap">{{ badge.text }}</span>
        <span class="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none will-change-[transform,opacity] opacity-0 animate-[badge-sweep_3.8s_ease-in-out_infinite]" style="border-radius: inherit;" aria-hidden="true" />
      </div>

      <!-- Heading -->
      <h1
        :class="['text-[clamp(1.875rem,4vw+1rem,3rem)] font-extrabold leading-[1.16] tracking-tight text-[var(--text-base)] mb-[0.875rem] text-balance animate-[fade-up_0.55s_ease-out_both]', align === 'center' ? 'max-w-[40rem] mx-auto' : '']"
        style="animation-delay: 65ms;"
      >
        {{ title }}
        <span v-if="titleAccent" class="block bg-gradient-to-br from-[var(--text-accent)] to-[var(--text-accent-light)] bg-clip-text text-transparent transform-gpu">{{ titleAccent }}</span>
        <slot name="title-suffix" />
      </h1>

      <!-- Accent bar -->
      <div
        :class="['w-11 h-[2.5px] rounded-full bg-gradient-to-r from-green-600 to-emerald-400 mb-5 animate-[fade-up_0.55s_ease-out_both]', align === 'center' ? 'mx-auto' : '']"
        style="animation-delay: 130ms;"
        aria-hidden="true"
      />

      <!-- Subtitle -->
      <p
        v-if="subtitle"
        :class="['text-[clamp(0.9rem,1vw+0.7rem,1.0625rem)] leading-[1.75] text-[var(--text-muted)] max-w-[38rem] mb-[1.875rem] animate-[fade-up_0.55s_ease-out_both]', align === 'center' ? 'mx-auto' : '']"
        style="animation-delay: 195ms;"
      >
        {{ subtitle }}
      </p>

      <!-- CTA row -->
      <div
        v-if="cta || ctaSecondary"
        :class="['flex flex-wrap gap-3 mb-[1.875rem] animate-[fade-up_0.55s_ease-out_both]', align === 'center' ? 'justify-center' : '']"
        style="animation-delay: 260ms;"
      >
        <UButton
          v-if="cta"
          :to="cta.link"
          size="lg"
          class="!bg-[linear-gradient(135deg,#16a34a,#059669)] !text-white shadow-[0_2px_12px_rgba(22,163,74,0.28)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.38)] hover:-translate-y-[2px] transition-[transform,box-shadow] duration-200"
          @click="!cta.link ? handleCtaClick() : undefined"
        >
          <UIcon v-if="cta.icon" :name="cta.icon" class="w-4 h-4 mr-[0.375rem]" aria-hidden="true" />
          {{ cta.text }}
        </UButton>

        <UButton
          v-if="ctaSecondary"
          :to="ctaSecondary.link"
          variant="outline"
          color="primary"
          size="lg"
          class="hover:-translate-y-[2px] transition-transform duration-200"
        >
          <UIcon v-if="ctaSecondary.icon" :name="ctaSecondary.icon" class="w-4 h-4 mr-[0.375rem]" aria-hidden="true" />
          {{ ctaSecondary.text }}
        </UButton>
      </div>

      <!-- Stats -->
      <div
        v-if="stats?.length"
        :class="['flex items-center flex-wrap gap-4 animate-[fade-up_0.55s_ease-out_both]', align === 'center' ? 'justify-center' : '']"
        style="animation-delay: 325ms;"
        role="list"
      >
        <template v-for="(stat, i) in stats" :key="i">
          <div class="flex flex-col gap-[0.15rem]" role="listitem">
            <span class="text-[1.2rem] font-bold text-[var(--text-accent)] tabular-nums leading-none">{{ stat.value }}</span>
            <span class="text-[0.65rem] tracking-[0.05em] text-[var(--text-subtle)] whitespace-nowrap">{{ stat.label }}</span>
          </div>
          <span v-if="i < stats.length - 1" class="block w-px h-7 bg-gradient-to-b from-transparent via-green-300/45 to-transparent shrink-0" aria-hidden="true" />
        </template>
      </div>

      <!-- Custom slot -->
      <div class="animate-[fade-up_0.55s_ease-out_both]" style="animation-delay: 390ms;">
        <slot />
      </div>

    </div>
  </section>
</template>

<style scoped>
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes drift-a {
  from { transform: translateY(-20px); }
  to { transform: translateY(20px); }
}

@keyframes drift-b {
  from { transform: translateY(-14px); }
  to { transform: translateY(14px); }
}

@keyframes badge-pulse {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0.3;
    transform: scale(0.8);
  }
}

@keyframes badge-sweep {
  0% {
    transform: translateX(-180%);
    opacity: 0;
  }
  5% {
    transform: translateX(-150%);
    opacity: 1;
  }
  42% {
    transform: translateX(230%);
    opacity: 1;
  }
  47% {
    transform: translateX(260%);
    opacity: 0;
  }
  100% {
    transform: translateX(260%);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-\[fade-up_0\.55s_ease-out_both\] {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .animate-\[drift-a_18s_ease-in-out_infinite_alternate\],
  .animate-\[drift-b_22s_ease-in-out_infinite_alternate\],
  .animate-\[badge-pulse_1\.4s_ease-in-out_infinite_alternate\],
  .animate-\[badge-sweep_3\.8s_ease-in-out_infinite\] {
    animation: none !important;
  }
}
</style>