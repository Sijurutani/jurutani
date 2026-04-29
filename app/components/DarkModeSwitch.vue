<script setup lang="ts">
const colorMode = useColorMode()

const modes = ['light', 'dark'] as const

const nextMode = () => {
  const index = modes.indexOf(colorMode.preference as any)
  colorMode.preference = modes[(index + 1) % modes.length]
}

const isDark = computed(() => colorMode.value === 'dark')

</script>

<template>
  <ClientOnly>
    <UButton
      variant="ghost"
      size="sm"
      aria-label="Ganti tema warna"
      class="!rounded-xl
             text-green-700 dark:text-green-300
             hover:bg-green-100/50 dark:hover:bg-green-700/30
             transition-all"
      @click="nextMode"
    >
      <Transition name="slide" mode="out-in">
        <UIcon
          :key="colorMode.preference"
          :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
          class="text-2xl"
        />
      </Transition>
    </UButton>

    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.15s ease;
}

.slide-enter-from {
  transform: translateY(-100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
}

.slide-leave-to {
  transform: translateY(100%);
}
</style>
