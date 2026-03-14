<!-- Deprecated: News page has been moved to /update -->
<script lang="ts" setup>
// Redirect to new update page
await navigateTo('/update', { replace: true })
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <p class="text-gray-600 dark:text-gray-400">Redirecting to new news page...</p>
    </div>
  </div>
</template>
