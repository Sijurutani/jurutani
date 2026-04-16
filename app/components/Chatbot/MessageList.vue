<script setup lang="ts">
import type { ChatMessage } from '~/composables/useAI'

interface Props {
  messages: ChatMessage[]
  isLoading: boolean
  isExpanded: boolean
}

const props = defineProps<Props>()

const container = ref<HTMLElement | null>(null)
const expandedIds = ref(new Set<string>())

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatTime = (d: Date) =>
  d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

const modelLabel = (msg: ChatMessage) => {
  const m = msg.model ?? ''
  if (m.includes('gemini')) return { label: 'Gemini', icon: 'i-simple-icons-google' }
  if (msg.provider === 'groq') return { label: 'Groq', icon: 'i-simple-icons-meta' }
  if (msg.provider === 'openrouter') return { label: 'OpenRouter', icon: 'i-lucide-network' }
  if (m) return { label: m.split('/').pop()?.split(':')[0] ?? m, icon: 'i-lucide-cpu' }
  return null
}

function toggleExpand(id: string) {
  const next = new Set(expandedIds.value)
  next.has(id) ? next.delete(id) : next.add(id)
  expandedIds.value = next
}

// ── Scroll ───────────────────────────────────────────────────────────────────

function scrollToBottom() {
  nextTick(() => {
    if (container.value) {
      container.value.scrollTo({ top: container.value.scrollHeight, behavior: 'smooth' })
    }
  })
}

watch(() => props.messages.length, scrollToBottom)
watch(() => props.isLoading, scrollToBottom)

defineExpose({ scrollToBottom })
</script>

<template>
  <div
    ref="container"
    class="absolute top-17 bottom-18 left-0 right-0 overflow-y-auto px-3 py-3 space-y-3 bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 scroll-smooth"
  >
    <!-- Empty state -->
    <div
      v-if="messages.length === 0 && !isLoading"
      class="flex flex-col items-center justify-center h-full gap-3 text-center px-4"
    >
      <div class="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <NuxtImg src="/jurutani.png" alt="JuruTani" class="w-8 h-8" />
      </div>
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
        Halo! Ada yang bisa saya bantu?
      </p>
      <p class="text-xs text-gray-400 dark:text-gray-500">
        Tanyakan seputar pertanian, peternakan, atau pembangunan
      </p>
    </div>

    <!-- Messages -->
    <template v-else>
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex gap-2 animate-fade-in"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <!-- Bot avatar -->
        <div
          v-if="msg.role === 'assistant'"
          class="shrink-0 w-7 h-7 rounded-full bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 flex items-center justify-center mt-1"
        >
          <NuxtImg src="/jurutani.png" alt="Bot" class="w-4 h-4" />
        </div>

        <!-- Bubble + meta -->
        <div
          class="flex flex-col gap-1"
          :class="[
            msg.role === 'user' ? 'items-end' : 'items-start',
            isExpanded ? 'max-w-md' : 'max-w-[78%]',
          ]"
        >
          <!-- Bubble -->
          <div
            class="px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm"
            :class="msg.role === 'user'
              ? 'bg-linear-to-br from-green-600 to-green-500 text-white rounded-br-sm'
              : msg.error
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-bl-sm w-full'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm w-full'"
          >
            <!-- User: plain text -->
            <p v-if="msg.role === 'user'" class="whitespace-pre-wrap wrap-break-word">
              {{ msg.content }}
            </p>

            <!-- Bot: rich markdown -->
            <div
              v-else
              class="prose prose-sm dark:prose-invert max-w-none
                prose-headings:text-green-800 dark:prose-headings:text-green-300
                prose-a:text-green-600 dark:prose-a:text-green-400
                prose-code:bg-green-50 dark:prose-code:bg-green-900/30
                prose-blockquote:border-green-400 prose-blockquote:bg-green-50/50 dark:prose-blockquote:bg-green-900/20
                prose-strong:text-gray-900 dark:prose-strong:text-gray-100"
            >
              <MDC :value="msg.content" />
            </div>
          </div>

          <!-- Meta: waktu + model badge -->
          <div
            class="flex items-center gap-2 px-1"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <span class="text-[10px] text-gray-400 dark:text-gray-500">
              {{ formatTime(msg.timestamp) }}
            </span>

            <span
              v-if="msg.role === 'assistant' && modelLabel(msg)"
              class="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5"
            >
              <UIcon :name="modelLabel(msg)!.icon" class="w-2.5 h-2.5" />
              {{ modelLabel(msg)!.label }}
            </span>
          </div>
        </div>

        <!-- User avatar -->
        <div
          v-if="msg.role === 'user'"
          class="shrink-0 w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center mt-1"
        >
          <UIcon name="i-heroicons-user" class="w-4 h-4 text-gray-200" />
        </div>
      </div>
    </template>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex gap-2 justify-start animate-fade-in">
      <div class="shrink-0 w-7 h-7 rounded-full bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 flex items-center justify-center mt-1">
        <NuxtImg src="/jurutani.png" alt="Bot" class="w-4 h-4" />
      </div>
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div class="flex items-center gap-2">
          <div class="flex gap-1">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0ms" />
            <span class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 150ms" />
            <span class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 300ms" />
          </div>
          <span class="text-xs text-gray-400 dark:text-gray-500">Mengetik...</span>
        </div>
      </div>
    </div>

    <!-- Scroll anchor -->
    <div class="h-1" />
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.25s ease-out; }

/* Scrollbar */
.overflow-y-auto::-webkit-scrollbar { width: 4px; }
.overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #10b981, #059669);
  border-radius: 2px;
}
:global(.dark) .overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #059669, #047857);
}
</style>