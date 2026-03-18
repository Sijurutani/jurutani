<script setup lang="ts">
interface Message {
  id: number
  type: 'user' | 'bot'
  text: string
  timestamp: Date
}

defineProps<{
  message: Message
  isExpanded: boolean
  maxWidth: string
}>()

const emit = defineEmits<{
  toggleExpand: [messageId: number]
}>()

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const truncateText = (text: string, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const shouldShowExpandButton = (message: Message) => {
  return message.text.length > 150
}
</script>

<template>
  <div
    :class="[
      'flex animate-fade-in',
      message.type === 'user' ? 'justify-end' : 'justify-start'
    ]"
  >
    <div
      :class="[
        maxWidth,
        'px-3 py-2 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md',
        message.type === 'user'
          ? 'bg-linear-to-r from-green-600 to-green-500 text-white ml-4'
          : 'bg-white text-gray-800 mr-4 border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
      ]"
    >
      <div class="flex items-start space-x-2">
        <div v-if="message.type === 'bot'" class="shrink-0 mt-0.5">
          <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center border border-green-200 dark:bg-green-900 dark:border-green-800">
            <NuxtImg 
              src="/jurutani.png" 
              alt="Chatbot" 
              class="w-3 h-3 text-green-600 dark:text-green-300"
            />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {{ shouldShowExpandButton(message) && !isExpanded
              ? truncateText(message.text)
              : message.text }}
          </p>
          
          <!-- Expand/Collapse button -->
          <UButton
            v-if="shouldShowExpandButton(message)"
            :icon="isExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            size="2xs"
            variant="ghost"
            :color="message.type === 'user' ? 'white' : 'gray'"
            class="mt-1 hover:bg-black/10 dark:hover:bg-white/10"
            @click="emit('toggleExpand', message.id)"
          >
            {{ isExpanded ? 'Tutup' : 'Selengkapnya' }}
          </UButton>
          
          <p class="text-xs mt-1 opacity-70 text-gray-500 dark:text-gray-300">
            {{ formatTime(message.timestamp) }}
          </p>
        </div>
        <div v-if="message.type === 'user'" class="shrink-0 mt-0.5">
          <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
            <UIcon name="i-heroicons-user" class="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.break-words {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
