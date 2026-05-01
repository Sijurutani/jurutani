<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  badge?: {
    text: string
    icon?: string
  }
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  align: 'center',
  size: 'md',
})
</script>

<template>
  <div class="sh-wrapper" :class="`sh-wrapper--${align}`">
    <!-- Badge -->
    <div v-if="badge" class="sh-badge" :class="{ 'sh-badge--center': align === 'center' }">
      <UIcon v-if="badge.icon" :name="badge.icon" class="sh-badge__icon" />
      <span class="sh-badge__text">{{ badge.text }}</span>
    </div>

    <!-- Title -->
    <h2
      class="sh-title"
      :class="[`sh-title--${size}`, `sh-title--${align}`]"
    >
      {{ title }}
    </h2>

    <!-- Accent bar -->
    <div class="sh-bar" :class="`sh-bar--${align}`" aria-hidden="true" />

    <!-- Subtitle -->
    <p
      v-if="subtitle"
      class="sh-subtitle"
      :class="{ 'sh-subtitle--center': align === 'center' }"
    >
      {{ subtitle }}
    </p>

    <slot />
  </div>
</template>

<style scoped>
.sh-wrapper {
  margin-bottom: 0;
}

.sh-wrapper--center { text-align: center; }
.sh-wrapper--left   { text-align: left; }
.sh-wrapper--right  { text-align: right; }

/* Badge */
.sh-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
  background: var(--bg-badge);
  border: 1px solid var(--border-badge);
  margin-bottom: 0.875rem;
  width: fit-content;
}

.sh-badge--center {
  margin-left: auto;
  margin-right: auto;
}

.sh-badge__icon {
  width: 0.75rem;
  height: 0.75rem;
  color: var(--text-badge);
}

.sh-badge__text {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-badge);
}

/* Title */
.sh-title {
  font-weight: 800;
  color: var(--text-base);
  line-height: 1.2;
  margin-bottom: 0.625rem;
}

.sh-title--sm { font-size: 1.375rem; }
@media (min-width: 768px) { .sh-title--sm { font-size: 1.625rem; } }

.sh-title--md { font-size: 1.625rem; }
@media (min-width: 768px) { .sh-title--md { font-size: 2rem; } }

.sh-title--lg { font-size: 1.875rem; }
@media (min-width: 768px) { .sh-title--lg { font-size: 2.5rem; } }

.sh-title--center { max-width: 42rem; margin-left: auto; margin-right: auto; }
.sh-title--left   {}
.sh-title--right  {}

/* Accent bar */
.sh-bar {
  width: 2.5rem;
  height: 3px;
  border-radius: 9999px;
  background: linear-gradient(90deg, #16a34a, #34d399);
  margin-bottom: 0.875rem;
}

.sh-bar--center { margin-left: auto; margin-right: auto; }
.sh-bar--left   {}
.sh-bar--right  { margin-left: auto; }

/* Subtitle */
.sh-subtitle {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--text-muted);
  max-width: 38rem;
}

.sh-subtitle--center {
  margin-left: auto;
  margin-right: auto;
}
</style>
