<script lang="ts" setup>
// SEO Optimization di-handle di level child component

definePageMeta({
  middleware: ['auth']
});
</script>

<template>
  <div class="lg:pt-16 pt-12">
    <NuxtPage />
  </div>
</template>
