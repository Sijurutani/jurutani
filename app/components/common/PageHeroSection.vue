<script setup lang="ts">
/**
 * PageHeroSection — Redesigned hero section matching HomeHeroSection design language.
 * Uses CSS variables (--text-base, --text-accent, etc.) from tailwind.css,
 * badge with light-sweep shimmer, fadeSlideUp animations, and responsive grid layout.
 */

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
  stats?: Array<{
    value: string
    label: string
  }>
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
  <section class="page-hero select-none overflow-hidden">

    <!-- Background decoration -->
    <div v-if="decorative === 'gradient'" class="page-hero__gradient" aria-hidden="true">
      <div class="page-hero__orb page-hero__orb--1" />
      <div class="page-hero__orb page-hero__orb--2" />
    </div>
    <div v-else-if="decorative === 'ripple'" class="absolute inset-0 z-0" aria-hidden="true">
      <BackgroundRipple />
    </div>
    <div v-else-if="decorative === 'pattern'" class="page-hero__pattern" aria-hidden="true">
      <svg class="page-hero__pattern-svg" viewBox="0 0 800 400">
        <pattern id="ph-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.5" fill="currentColor" class="text-green-500" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#ph-dots)" />
      </svg>
    </div>

    <!-- Content -->
    <div class="page-hero__inner" :class="{ 'page-hero__inner--center': align === 'center' }">

      <!-- Badge -->
      <div v-if="badge" class="page-hero__badge" :class="{ 'page-hero__badge--center': align === 'center' }">
        <span class="page-hero__badge-dot" aria-hidden="true" />
        <UIcon v-if="badge.icon" :name="badge.icon" class="page-hero__badge-icon" aria-hidden="true" />
        <span class="page-hero__badge-text">{{ badge.text }}</span>
        <span class="page-hero__badge-sweep" aria-hidden="true" />
      </div>

      <!-- Title -->
      <h1 class="page-hero__heading" :class="{ 'page-hero__heading--center': align === 'center' }">
        {{ title }}
        <span v-if="titleAccent" class="page-hero__heading-accent">{{ titleAccent }}</span>
        <slot name="title-suffix" />
      </h1>

      <!-- Divider bar -->
      <div
        class="page-hero__bar"
        :class="{ 'page-hero__bar--center': align === 'center' }"
        aria-hidden="true"
      />

      <!-- Subtitle -->
      <p
        v-if="subtitle"
        class="page-hero__subtitle"
        :class="{ 'page-hero__subtitle--center': align === 'center' }"
      >
        {{ subtitle }}
      </p>

      <!-- CTA buttons -->
      <div
        v-if="cta || ctaSecondary"
        class="page-hero__cta"
        :class="{ 'page-hero__cta--center': align === 'center' }"
      >
        <UButton
          v-if="cta"
          :to="cta.link"
          size="lg"
          class="page-hero__btn page-hero__btn--primary"
          @click="!cta.link ? handleCtaClick() : undefined"
        >
          <UIcon v-if="cta.icon" :name="cta.icon" class="mr-2 w-4 h-4" />
          {{ cta.text }}
        </UButton>
        <UButton
          v-if="ctaSecondary"
          :to="ctaSecondary.link"
          variant="outline"
          color="primary"
          size="lg"
          class="page-hero__btn page-hero__btn--secondary"
        >
          <UIcon v-if="ctaSecondary.icon" :name="ctaSecondary.icon" class="mr-2 w-4 h-4" />
          {{ ctaSecondary.text }}
        </UButton>
      </div>

      <!-- Stats strip -->
      <div
        v-if="stats && stats.length"
        class="page-hero__stats"
        :class="{ 'page-hero__stats--center': align === 'center' }"
      >
        <template v-for="(stat, i) in stats" :key="i">
          <div class="page-hero__stat">
            <span class="page-hero__stat-value">{{ stat.value }}</span>
            <span class="page-hero__stat-label">{{ stat.label }}</span>
          </div>
          <div v-if="i < stats.length - 1" class="page-hero__stat-sep" aria-hidden="true" />
        </template>
      </div>

      <!-- Custom slot -->
      <slot />
    </div>
  </section>
</template>

<style scoped>
/* ── Section ──────────────────────────────────────────────────── */
.page-hero {
  position: relative;
  padding-top: 6rem;
  padding-bottom: 3.5rem;
  isolation: isolate;
}

@media (min-width: 768px) {
  .page-hero {
    padding-top: 7rem;
    padding-bottom: 4.5rem;
  }
}

/* ── Decorative gradient background ─────────────────────────── */
.page-hero__gradient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.page-hero__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  will-change: transform, opacity;
}

.page-hero__orb--1 {
  width: 28rem;
  height: 28rem;
  top: -6rem;
  right: -6rem;
  background: radial-gradient(circle, rgba(134, 239, 172, 0.18) 0%, transparent 70%);
  animation: phOrbFloat 18s ease-in-out infinite;
}

.page-hero__orb--2 {
  width: 22rem;
  height: 22rem;
  bottom: -4rem;
  left: -4rem;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.14) 0%, transparent 70%);
  animation: phOrbFloat 22s ease-in-out 4s infinite reverse;
}

@keyframes phOrbFloat {
  0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.8; }
  50%       { transform: translate3d(0, -18px, 0); opacity: 1; }
}

/* ── Dot pattern ─────────────────────────────────────────────── */
.page-hero__pattern {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  z-index: 0;
  pointer-events: none;
}
.page-hero__pattern-svg {
  width: 100%;
  height: 100%;
}

/* ── Content wrapper ─────────────────────────────────────────── */
.page-hero__inner {
  position: relative;
  z-index: 1;
  max-width: 68rem;
  margin: 0 auto;
  padding: 0 1.25rem;
}

@media (min-width: 640px) {
  .page-hero__inner {
    padding: 0 2rem;
  }
}

.page-hero__inner--center {
  text-align: center;
}

/* ── Badge ───────────────────────────────────────────────────── */
.page-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.375rem 0.875rem;
  background: var(--bg-badge);
  border: 1px solid var(--border-badge);
  border-radius: 9999px;
  margin-bottom: 1.25rem;
  width: fit-content;
  position: relative;
  overflow: hidden;
  animation: phFadeUp 0.5s ease-out both;
}

.page-hero__badge--center {
  margin-left: auto;
  margin-right: auto;
}

.page-hero__badge-dot {
  display: block;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: #16a34a;
  animation: phPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  flex-shrink: 0;
}

.page-hero__badge-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--text-badge);
  flex-shrink: 0;
}

.page-hero__badge-text {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-badge);
  white-space: nowrap;
}

/* Light sweep shimmer (matches HomeHeroSection badge) */
.page-hero__badge-sweep {
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.55) 50%,
    transparent 100%
  );
  transform: translateX(-200%);
  animation: phBadgeSweep 3.5s ease-in-out 1.5s infinite;
  pointer-events: none;
  will-change: transform;
  border-radius: inherit;
}

@keyframes phBadgeSweep {
  0%   { transform: translateX(-200%); opacity: 0; }
  8%   { opacity: 1; }
  45%  { transform: translateX(280%); opacity: 1; }
  46%  { transform: translateX(280%); opacity: 0; }
  100% { transform: translateX(280%); opacity: 0; }
}

/* ── Heading ─────────────────────────────────────────────────── */
.page-hero__heading {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.18;
  color: var(--text-base);
  margin-bottom: 0.875rem;
  animation: phFadeUp 0.55s ease-out 0.05s both;
  text-wrap: balance;
}

@media (min-width: 640px) {
  .page-hero__heading { font-size: 2.5rem; }
}

@media (min-width: 1024px) {
  .page-hero__heading { font-size: 3rem; }
}

.page-hero__heading--center {
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
}

.page-hero__heading-accent {
  display: block;
  background: linear-gradient(135deg, var(--text-accent), var(--text-accent-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  isolation: isolate;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* ── Divider bar ─────────────────────────────────────────────── */
.page-hero__bar {
  width: 3.5rem;
  height: 3px;
  border-radius: 9999px;
  background: linear-gradient(90deg, #16a34a, #34d399);
  margin-bottom: 1.25rem;
  animation: phFadeUp 0.6s ease-out 0.1s both;
}

.page-hero__bar--center {
  margin-left: auto;
  margin-right: auto;
}

/* ── Subtitle ─────────────────────────────────────────────────── */
.page-hero__subtitle {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--text-muted);
  margin-bottom: 1.75rem;
  max-width: 38rem;
  animation: phFadeUp 0.6s ease-out 0.12s both;
}

@media (min-width: 768px) {
  .page-hero__subtitle { font-size: 1.0625rem; }
}

.page-hero__subtitle--center {
  margin-left: auto;
  margin-right: auto;
}

/* ── CTA buttons ─────────────────────────────────────────────── */
.page-hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
  animation: phFadeUp 0.65s ease-out 0.18s both;
}

.page-hero__cta--center {
  justify-content: center;
}

.page-hero__btn--primary {
  background: linear-gradient(135deg, #16a34a, #059669) !important;
  color: #fff !important;
  box-shadow: 0 4px 16px rgba(22, 163, 74, 0.3);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-hero__btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(22, 163, 74, 0.4);
}

.page-hero__btn--secondary {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-hero__btn--secondary:hover {
  transform: translateY(-2px);
}

/* ── Stats ───────────────────────────────────────────────────── */
.page-hero__stats {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  animation: phFadeUp 0.7s ease-out 0.22s both;
}

.page-hero__stats--center {
  justify-content: center;
}

.page-hero__stat {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.page-hero__stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-accent);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.page-hero__stat-label {
  font-size: 0.68rem;
  color: var(--text-subtle);
  white-space: nowrap;
}

.page-hero__stat-sep {
  width: 1px;
  height: 2rem;
  background: linear-gradient(to bottom, transparent, rgba(134, 239, 172, 0.5), transparent);
  flex-shrink: 0;
}

/* ── Keyframes ───────────────────────────────────────────────── */
@keyframes phFadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes phPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
</style>
