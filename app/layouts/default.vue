<script setup lang="ts">
const route = useRoute()
const showHomeChatbot = computed(() => route.path === '/')
</script>

<template>
  <!-- Root: NO overflow-hidden — it clips fixed elements (navbar) and creates
       a broken stacking context that intercepts pointer events on fixed children -->
  <div class="relative">
    <!-- Background gradient -->
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

    <BackgroundRipple class="opacity-30 pointer-events-none" />

    <div
      class="relative z-10 min-h-screen flex flex-col bg-transparent text-green-900 dark:text-green-100"
    >
      <!-- Nav is NOT wrapped in app-reveal so it's never opacity:0 or scaled
           during page load (both break pointer events on fixed elements) -->
      <LayoutNavigation />

      <UMain class="app-reveal">
        <slot />
      </UMain>

      <div class="app-reveal app-reveal--2">
        <LayoutFooter />
      </div>
    </div>

    <ChatbotJurutani v-if="showHomeChatbot" />
  </div>
</template>
