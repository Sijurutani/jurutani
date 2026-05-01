<script setup lang="ts">
/**
 * SwipeCarousel — Reusable swipeable card carousel with dots
 * 
 * Usage:
 * <SwipeCarousel :items="myItems" card-width="calc(50% - 0.375rem)" :gap="12">
 *   <template #card="{ item, index }">
 *     <MyCard :data="item" />
 *   </template>
 * </SwipeCarousel>
 */

interface Props {
  /** The array of items to render */
  items: any[]
  /** dot accent color (CSS color value) */
  accentColor?: string
  /** Show "see more" link */
  seeMoreLabel?: string
  seeMoreTo?: string
  /** Loading state */
  loading?: boolean
  /** Number of skeleton cards to show */
  skeletonCount?: number
  /** Skeleton aspect ratio e.g. "3/4" */
  skeletonAspect?: string
}

const props = withDefaults(defineProps<Props>(), {
  accentColor: '#16a34a',
  seeMoreLabel: '',
  seeMoreTo: '',
  loading: false,
  skeletonCount: 4,
  skeletonAspect: '3/4',
})

// --- Scroll / Dots logic ---
const trackRef = ref<HTMLElement | null>(null)
const dotIndex = ref(0)
const perPage = ref(1)

const updatePerPage = () => {
  if (!trackRef.value) return
  const firstChild = trackRef.value.children[0] as HTMLElement
  if (!firstChild) return
  const cardW = firstChild.offsetWidth
  const trackW = trackRef.value.clientWidth
  perPage.value = Math.max(1, Math.round(trackW / cardW))
}

const dotCount = computed(() =>
  Math.max(1, Math.ceil(props.items.length / perPage.value))
)

const handleScroll = () => {
  if (!trackRef.value) return
  const { scrollLeft, clientWidth } = trackRef.value
  dotIndex.value = Math.round(scrollLeft / clientWidth)
}

const scrollTo = (i: number) => {
  if (!trackRef.value) return
  trackRef.value.scrollTo({ left: trackRef.value.clientWidth * i, behavior: 'smooth' })
  dotIndex.value = i
}

onMounted(() => {
  nextTick(() => updatePerPage())
  window.addEventListener('resize', updatePerPage, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePerPage)
})

watch(() => props.items.length, () => {
  nextTick(() => updatePerPage())
})
</script>

<template>
  <!-- Loading Skeleton -->
  <div v-if="loading" class="swipe-track">
    <div
      v-for="i in skeletonCount"
      :key="i"
      class="swipe-skeleton"
      :style="{ aspectRatio: skeletonAspect.replace('/', ' / ') }"
    />
  </div>

  <!-- Carousel Content -->
  <template v-else-if="items.length">
    <div
      ref="trackRef"
      class="swipe-track"
      @scroll.passive="handleScroll"
    >
      <slot name="card" v-for="(item, index) in items" :item="item" :index="index" />
    </div>

    <!-- Footer: Dots + See More -->
    <div class="swipe-footer">
      <div v-if="dotCount > 1" class="swipe-dots">
        <button
          v-for="(_, i) in dotCount"
          :key="i"
          class="swipe-dot"
          :class="{ 'swipe-dot--active': i === dotIndex }"
          :aria-label="`Halaman ${i + 1}`"
          :style="i === dotIndex ? { background: accentColor } : {}"
          @click="scrollTo(i)"
        />
      </div>

      <NuxtLink
        v-if="seeMoreLabel && seeMoreTo"
        :to="seeMoreTo"
        class="swipe-see-more"
        :style="`--accent: ${accentColor}`"
      >
        {{ seeMoreLabel }}
        <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
      </NuxtLink>
    </div>
  </template>

  <!-- Empty State slot -->
  <slot v-else name="empty">
    <div class="swipe-empty">
      <UIcon name="i-lucide-package-open" class="w-8 h-8 text-gray-300 dark:text-gray-600" />
      <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">Data tidak tersedia</p>
    </div>
  </slot>
</template>

<style scoped>
/* Track */
.swipe-track {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.swipe-track > :deep(*) {
  scroll-snap-align: start;
  flex-shrink: 0;
}

.swipe-track::-webkit-scrollbar {
  display: none;
}

/* Footer */
.swipe-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.625rem;
}

/* Dots */
.swipe-dots {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex: 1;
}

.swipe-dot {
  height: 0.3125rem;
  width: 0.375rem;
  border-radius: 9999px;
  background: rgba(156, 163, 175, 0.45);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.swipe-dot--active {
  width: 1.5rem;
}

.swipe-dot:not(.swipe-dot--active):hover {
  background: rgba(156, 163, 175, 0.75);
  transform: scaleY(1.25);
}

/* See More Link */
.swipe-see-more {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent, #16a34a);
  background: color-mix(in srgb, var(--accent, #16a34a) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent, #16a34a) 25%, transparent);
  border-radius: 9999px;
  text-decoration: none;
  white-space: nowrap;
  margin-left: auto;
  transition: all 0.2s ease;
}

.swipe-see-more:hover {
  background: color-mix(in srgb, var(--accent, #16a34a) 15%, transparent);
  border-color: color-mix(in srgb, var(--accent, #16a34a) 45%, transparent);
  transform: translateX(2px);
}

/* Skeleton */
.swipe-skeleton {
  flex: 0 0 calc(50% - 0.375rem);
  border-radius: 0.875rem;
  background: rgba(209, 213, 219, 0.35);
  animation: swipe-pulse 1.4s ease-in-out infinite;
}

@keyframes swipe-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

:root.dark .swipe-skeleton {
  background: rgba(55, 65, 81, 0.4);
}

/* Empty state */
.swipe-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  border: 1px dashed rgba(209, 213, 219, 0.6);
  border-radius: 1rem;
}
</style>
