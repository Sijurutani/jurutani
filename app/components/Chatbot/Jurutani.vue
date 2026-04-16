<script setup lang="ts">
import { PROVIDER_MODELS, type AIProvider } from '~/utils/ai'

const chatbot = useClientChatbot()

const messageListRef = ref<{ scrollToBottom: () => void } | null>(null)
const inputRef = ref<{ focus: () => void } | null>(null)

// ── Provider options untuk select menu ───────────────────────────────────────

const providers = [
  { label: 'Gemini', value: 'gemini' as AIProvider, icon: 'i-simple-icons-google' },
  { label: 'Groq (Llama)', value: 'groq' as AIProvider, icon: 'i-simple-icons-meta' },
  { label: 'OpenRouter', value: 'openrouter' as AIProvider, icon: 'i-lucide-network' },
]

const selectedProvider = computed({
  get: () => providers.find(p => p.value === chatbot.provider.value) ?? providers[0]!,
  set: v => { chatbot.provider.value = v.value },
})

// ── History sidebar ───────────────────────────────────────────────────────────

const isHistoryOpen = ref(false)

// ── Event handlers ────────────────────────────────────────────────────────────

async function handleSend(text: string) {
  await chatbot.sendMessage(text)
  nextTick(() => messageListRef.value?.scrollToBottom())
}

function handleStart() {
  chatbot.startChat()
  nextTick(() => {
    inputRef.value?.focus()
    messageListRef.value?.scrollToBottom()
  })
}

function handleOpen() {
  chatbot.open()
  if (chatbot.hasSeenSplash.value) {
    nextTick(() => inputRef.value?.focus())
  }
}

// ── Window size ───────────────────────────────────────────────────────────────

const windowClass = computed(() => {
  if (chatbot.isExpanded.value) return 'w-[420px] h-[600px]'
  return 'w-80 h-[440px]'
})
</script>

<template>
  <div class="fixed bottom-4 right-4 z-60" style="isolation: isolate;">
    <!-- ── Bubble Button ─────────────────────────────────────────────────── -->
    <Transition name="scale">
      <button
        v-if="!chatbot.isOpen.value"
        class="w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden border-2 border-green-400 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        aria-label="Buka chat JuruTani"
        @click="handleOpen"
      >
        <NuxtImg src="/jurutani.png" alt="JuruTani AI" class="w-full h-full object-cover" />
      </button>
    </Transition>

    <!-- ── Splash Screen ─────────────────────────────────────────────────── -->
    <Transition name="scale">
      <ChatbotSplashScreen
        v-if="chatbot.showSplash.value"
        @start="handleStart"
      />
    </Transition>

    <!-- ── Chat Window ───────────────────────────────────────────────────── -->
    <Transition name="scale">
      <UCard
        v-if="chatbot.isOpen.value && !chatbot.showSplash.value"
        :class="['relative overflow-hidden border-2 border-green-400 shadow-2xl transition-all duration-300', windowClass]"
        :ui="{ body: { padding: 'p-0' } }"
      >
        <!-- Header -->
        <div class="absolute top-0 left-0 right-0 z-10 bg-linear-to-r from-green-700 to-green-500 text-white px-3 py-2.5 flex items-center gap-3">
          <!-- Avatar + name -->
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <div class="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <NuxtImg src="/jurutani.png" alt="JuruTani" class="w-6 h-6" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold leading-tight truncate">JuruTani AI</p>
              <div class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                <span class="text-[11px] text-green-100">Penyuluh JuruTani</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1">
            <!-- Riwayat -->
            <UTooltip text="Riwayat chat" :side="'bottom'">
              <UButton
                icon="i-lucide-history"
                color="neutral"
                variant="ghost"
                size="xs"
                class="hover:bg-white/20 text-white"
                :class="isHistoryOpen ? 'bg-white/20' : ''"
                @click="isHistoryOpen = !isHistoryOpen"
              />
            </UTooltip>

            <!-- Chat baru -->
            <UTooltip text="Chat baru" :side="'bottom'">
              <UButton
                icon="i-lucide-plus"
                color="neutral"
                variant="ghost"
                size="xs"
                class="hover:bg-white/20 text-white"
                @click="chatbot.newChat()"
              />
            </UTooltip>

            <!-- Expand / collapse -->
            <UTooltip :text="chatbot.isExpanded.value ? 'Perkecil' : 'Perbesar'" :side="'bottom'">
              <UButton
                :icon="chatbot.isExpanded.value ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'"
                color="neutral"
                variant="ghost"
                size="xs"
                class="hover:bg-white/20 text-white"
                @click="chatbot.toggleExpand()"
              />
            </UTooltip>

            <!-- Close -->
            <UButton
              icon="i-heroicons-x-mark"
              color="neutral"
              variant="ghost"
              size="xs"
              class="hover:bg-white/20 text-white"
              @click="chatbot.close()"
            />
          </div>
        </div>

        <!-- History Sidebar (slide in) -->
        <Transition name="slide-left">
          <div
            v-if="isHistoryOpen"
            class="absolute top-13 bottom-0 left-0 w-56 z-20 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg"
          >
            <div class="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">Riwayat Chat</span>
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                size="xs"
                @click="isHistoryOpen = false"
              />
            </div>

            <div v-if="chatbot.sessions.value.length === 0" class="flex-1 flex items-center justify-center p-4 text-xs text-gray-400 text-center">
              Belum ada riwayat.
            </div>

            <div v-else class="flex-1 overflow-y-auto">
              <div
                v-for="sess in chatbot.sessions.value"
                :key="sess.id"
                class="group flex items-start gap-2 px-3 py-2.5 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 border-b border-gray-100 dark:border-gray-800 transition-colors"
                :class="sess.id === chatbot.activeSessionId.value ? 'bg-green-50 dark:bg-green-900/20' : ''"
                @click="chatbot.loadSession(sess.id); isHistoryOpen = false"
              >
                <UIcon name="i-lucide-message-circle" class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium text-gray-700 dark:text-gray-200 truncate leading-snug">
                    {{ sess.title }}
                  </p>
                  <p class="text-[10px] text-gray-400 mt-0.5">
                    {{ new Date(sess.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) }}
                  </p>
                </div>
                <UButton
                  icon="i-lucide-trash-2"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="opacity-0 group-hover:opacity-100 shrink-0 hover:text-red-500"
                  @click.stop="chatbot.deleteSession(sess.id)"
                />
              </div>
            </div>

            <!-- Clear all -->
            <div class="p-2 border-t border-gray-200 dark:border-gray-700">
              <UButton
                icon="i-lucide-trash-2"
                label="Hapus semua"
                color="neutral"
                variant="ghost"
                size="xs"
                block
                class="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                @click="chatbot.clearAllSessions()"
              />
            </div>
          </div>
        </Transition>

        <!-- Messages -->
        <ChatbotMessageList
          ref="messageListRef"
          :messages="chatbot.messages.value"
          :is-loading="chatbot.isLoading.value"
          :is-expanded="chatbot.isExpanded.value"
        />

        <!-- Input area -->
        <div class="absolute bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-3 pt-2 pb-2">
          <!-- Provider selector -->
          <div class="flex items-center justify-between mb-1.5">
            <USelectMenu
              v-model="selectedProvider"
              :items="providers"
              variant="ghost"
              color="neutral"
              size="xs"
              :leading-icon="selectedProvider?.icon"
              class="min-w-32 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ring-1 ring-inset ring-gray-200 dark:ring-gray-700 transition-colors"
            />
            <span class="text-[10px] text-gray-400">
              {{ PROVIDER_MODELS[chatbot.provider.value].length }} model
            </span>
          </div>

          <!-- Text input -->
          <ChatbotChatInput
            ref="inputRef"
            :disabled="chatbot.isLoading.value"
            @submit="handleSend"
          />
        </div>
      </UCard>
    </Transition>
  </div>
</template>

<style scoped>
/* Scale transition untuk buka/tutup chat */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: bottom right;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

/* Slide-left untuk history sidebar */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>