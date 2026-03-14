<script setup lang="ts">
// Bisa ditambahkan action buttons lain di sini jika diperlukan
// Misalnya: notifications, search, dll
</script>

<template>
  <div 
    class="flex flex-nowrap items-center justify-center gap-2 p-2 rounded-xl bg-white/50 dark:bg-green-900/50 backdrop-blur-sm border border-green-100/50 dark:border-green-700/50 shadow-sm transition-all duration-300 hover:shadow-md"
    role="toolbar"
    aria-label="Profile actions"
  >
    <DarkModeSwitch />
  </div>
</template>

<style scoped>
:deep(.u-button) {
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.u-button:hover) {
  transform: scale(1.05);
}

:deep(.u-button:focus-visible) {
  outline: 2px solid rgb(34 197 94);
  outline-offset: 2px;
}
</style>
