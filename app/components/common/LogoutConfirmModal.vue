<script setup lang="ts">
/**
 * LogoutConfirmModal — Confirmation modal before logout
 * Usage: <LogoutConfirmModal v-model="showLogout" @confirm="doLogout" />
 */
const props = defineProps<{
  modelValue: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'confirm': []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        @click.self="isOpen = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="isOpen = false" />

        <!-- Card -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
          appear
        >
          <div class="logout-modal relative z-10">
            <!-- Icon -->
            <div class="logout-modal__icon">
              <UIcon name="i-lucide-log-out" class="w-7 h-7 text-red-500" />
            </div>

            <!-- Text -->
            <h2 id="logout-modal-title" class="logout-modal__title">
              Konfirmasi Logout
            </h2>
            <p class="logout-modal__desc">
              Apakah Anda yakin ingin keluar dari JuruTani? Sesi Anda akan berakhir.
            </p>

            <!-- Actions -->
            <div class="logout-modal__actions">
              <button
                class="logout-modal__btn logout-modal__btn--cancel"
                :disabled="loading"
                @click="isOpen = false"
              >
                Batal
              </button>

              <button
                class="logout-modal__btn logout-modal__btn--confirm"
                :disabled="loading"
                @click="emit('confirm')"
              >
                <UIcon
                  v-if="loading"
                  name="i-lucide-loader"
                  class="w-4 h-4 animate-spin"
                />
                <UIcon v-else name="i-lucide-log-out" class="w-4 h-4" />
                {{ loading ? 'Keluar...' : 'Ya, Logout' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.logout-modal {
  background: #fff;
  border-radius: 1.25rem;
  padding: 2rem;
  width: 100%;
  max-width: 20rem;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

:root.dark .logout-modal {
  background: #0f1f0f;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.05);
}

.logout-modal__icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
  border: 2px solid rgba(239, 68, 68, 0.2);
}

.logout-modal__title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

:root.dark .logout-modal__title {
  color: #f9fafb;
}

.logout-modal__desc {
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

:root.dark .logout-modal__desc {
  color: #9ca3af;
}

.logout-modal__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
  width: 100%;
  margin-top: 0.5rem;
}

.logout-modal__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.logout-modal__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logout-modal__btn--cancel {
  background: #f3f4f6;
  color: #374151;
}

.logout-modal__btn--cancel:hover:not(:disabled) {
  background: #e5e7eb;
}

:root.dark .logout-modal__btn--cancel {
  background: rgba(75, 85, 99, 0.3);
  color: #d1d5db;
}

:root.dark .logout-modal__btn--cancel:hover:not(:disabled) {
  background: rgba(75, 85, 99, 0.5);
}

.logout-modal__btn--confirm {
  background: #ef4444;
  color: #fff;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.logout-modal__btn--confirm:hover:not(:disabled) {
  background: #dc2626;
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
  transform: translateY(-1px);
}

.logout-modal__btn--confirm:active:not(:disabled) {
  transform: translateY(0);
}
</style>
