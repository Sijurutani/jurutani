<script setup lang="ts">
  /**
   * FeatureCardGrid - Grid Layout for Feature Cards
   * Responsive grid with customizable columns and variants
   */

  import type { IconCard } from '~/data/types'

  interface Props {
    cards: IconCard[]
    columns?: 2 | 3 | 4
    variant?: 'default' | 'outlined' | 'gradient'
    hoverable?: boolean
    gap?: 'sm' | 'md' | 'lg'
  }

  const props = withDefaults(defineProps<Props>(), {
    columns: 3,
    variant: 'default',
    hoverable: true,
    gap: 'md',
  })

  const gridClass = computed(() => {
    const colClass = {
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-2 lg:grid-cols-3',
      4: 'md:grid-cols-2 lg:grid-cols-4',
    }

    const gapClass = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
    }

    return `grid grid-cols-1 ${colClass[props.columns]} ${gapClass[props.gap]}`
  })

  const gridRef = ref<HTMLElement | null>(null)
  const {
    bindings: { 'v-reveal': vReveal },
  } = useReveal()
</script>

<template>
  <div ref="gridRef" :class="gridClass">
    <IconInfoCard
      v-for="(card, index) in cards"
      :key="index"
      v-reveal
      :style="{ '--reveal-delay': `${index * 80}ms` }"
      :icon="card.icon"
      :title="card.title"
      :description="card.description"
      :color="card.color"
      :link="card.link"
      :variant="variant"
      :hoverable="hoverable"
    />
  </div>
</template>
