<script setup lang="ts">
defineProps<{
  myId: string
}>()
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center gap-3 text-muted p-6">
    <UIcon name="i-lucide-messages-square" class="size-12 text-dimmed" />
    <div class="text-center">
      <p class="text-base font-semibold text-highlighted">Messages</p>
      <p class="text-sm text-muted mt-1">Pilih percakapan di sebelah kiri atau mulai chat baru.</p>
    </div>
  </div>
</template>

