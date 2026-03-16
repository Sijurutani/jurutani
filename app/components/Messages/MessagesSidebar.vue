<script setup lang="ts">
import { format, isToday, isYesterday } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { ConversationWithProfiles } from '~/composables/useMessages'

const props = defineProps<{
  conversations: ConversationWithProfiles[]
  myId: string
  unreadCounts: Record<string, number>
  loading?: boolean
  selectedId?: string | null
}>()

const emit = defineEmits<{
  open: [conversationId: string]
  markRead: [conversationId: string]
  deleteConv: [conversationId: string]
  newChat: []
  chatAdmin: []
}>()

const search = ref('')
const filterMode = ref<'all' | 'unread'>('all')

const totalUnread = computed(() =>
  Object.values(props.unreadCounts).reduce((a, b) => a + b, 0)
)

function getOther(conv: ConversationWithProfiles) {
  return conv.participant1_id === props.myId ? conv.participant2 : conv.participant1
}

function formatTime(t: string | null) {
  if (!t) return ''
  const d = new Date(t)
  if (isToday(d)) return format(d, 'HH:mm')
  if (isYesterday(d)) return 'Kemarin'
  return format(d, 'd MMM', { locale: idLocale })
}

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  let list = props.conversations
  if (filterMode.value === 'unread') {
    list = list.filter(c => (props.unreadCounts[c.id] ?? 0) > 0)
  }
  if (!q) return list
  return list.filter(c => {
    const other = getOther(c)
    const name = (other.full_name || other.username || '').toLowerCase()
    return name.includes(q) || (c.last_message ?? '').toLowerCase().includes(q)
  })
})

const roleLabel: Record<string, string> = {
  petani: 'Petani',
  pakar: 'Pakar',
  penyuluh: 'Penyuluh',
  admin: 'Admin',
  superadmin: 'Superadmin'
}

const filterTabs = [
  { label: 'Semua', value: 'all' },
  { label: 'Belum Dibaca', value: 'unread', slot: 'unread' }
]

function convActions(conv: ConversationWithProfiles): DropdownMenuItem[][] {
  const hasUnread = (props.unreadCounts[conv.id] ?? 0) > 0
  return [
    [
      { label: 'Buka Percakapan', icon: 'i-lucide-message-circle', onSelect: () => emit('open', conv.id) }
    ],
    [
      ...(hasUnread ? [{
        label: 'Tandai Sudah Dibaca',
        icon: 'i-lucide-check-check',
        onSelect: () => emit('markRead', conv.id)
      }] : []),
      {
        label: 'Hapus Percakapan',
        icon: 'i-lucide-trash-2',
        color: 'error' as const,
        onSelect: () => emit('deleteConv', conv.id)
      }
    ]
  ]
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="p-3 border-b border-default shrink-0 space-y-2">
      <div class="flex items-center gap-2">
        <UButton icon="i-lucide-plus" size="sm" @click="emit('newChat')">
          Chat Baru
        </UButton>
        <UButton icon="i-lucide-headset" color="neutral" variant="outline" size="sm" @click="emit('chatAdmin')">
          Chat Admin
        </UButton>
      </div>

      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Cari percakapan..."
        size="sm"
        class="w-full"
        variant="none"
        :trailing-icon="search ? 'i-lucide-x' : undefined"
        @click:trailing="search = ''"
      />
    </div>

    <div class="px-3 pt-2.5 pb-0 border-b border-default shrink-0">
      <UTabs
        v-model="filterMode"
        :items="filterTabs"
        :content="false"
        size="sm"
        variant="link"
        class="w-full"
        :ui="{ list: 'w-full', trigger: 'flex-1 justify-center' }"
      >
        <template #unread="{ item }">
          <span class="flex items-center gap-1.5">
            {{ item.label }}
            <UBadge
              v-if="totalUnread > 0"
              :label="totalUnread > 99 ? '99+' : String(totalUnread)"
              color="error"
              variant="solid"
              size="xs"
            />
          </span>
        </template>
      </UTabs>
    </div>

    <div v-if="loading && !conversations.length" class="flex-1 flex items-center justify-center">
      <UIcon name="i-lucide-loader-circle" class="size-5 text-muted animate-spin" />
    </div>

    <div
      v-else-if="!filtered.length"
      class="flex-1 flex flex-col items-center justify-center gap-3 text-muted p-6"
    >
      <UIcon name="i-lucide-message-circle-off" class="size-10 text-dimmed" />
      <p class="text-sm text-center">
        {{ search
          ? 'Tidak ada percakapan ditemukan'
          : filterMode === 'unread'
            ? 'Tidak ada pesan belum dibaca'
            : 'Belum ada percakapan' }}
      </p>
    </div>

    <div v-else class="flex-1 overflow-y-auto divide-y divide-default">
      <div
        v-for="conv in filtered"
        :key="conv.id"
        class="flex items-start gap-3 p-3 border-l-2 transition-colors hover:bg-elevated/60 cursor-pointer group"
        :class="selectedId === conv.id ? 'border-primary bg-primary/8' : 'border-transparent'"
        @click="emit('open', conv.id)"
      >
        <div class="relative shrink-0">
          <UAvatar
            :src="getOther(conv).avatar_url ?? undefined"
            :alt="getOther(conv).full_name ?? getOther(conv).username ?? ''"
            size="md"
          />
          <span
            v-if="(unreadCounts[conv.id] ?? 0) > 0"
            class="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-primary border-2 border-background"
          />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-1 mb-0.5">
            <p
              class="text-sm truncate leading-tight"
              :class="(unreadCounts[conv.id] ?? 0) > 0 ? 'font-bold text-highlighted' : 'font-semibold text-highlighted'"
            >
              {{ getOther(conv).full_name || getOther(conv).username || 'Pengguna' }}
            </p>
            <div class="flex items-center gap-1 shrink-0">
              <span
                v-if="(unreadCounts[conv.id] ?? 0) > 0"
                class="min-w-4.5 h-4.5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center px-1"
              >{{ (unreadCounts[conv.id] ?? 0) > 99 ? '99+' : unreadCounts[conv.id] }}</span>
              <span class="text-xs text-muted">{{ formatTime(conv.last_message_at) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <UBadge
              v-if="getOther(conv).role"
              :label="roleLabel[getOther(conv).role!] ?? getOther(conv).role!"
              color="neutral"
              variant="subtle"
              size="xs"
              class="shrink-0"
            />
            <p
              class="text-xs truncate"
              :class="(unreadCounts[conv.id] ?? 0) > 0 ? 'text-default font-medium' : 'text-muted'"
            >
              {{ conv.last_message ?? 'Mulai percakapan...' }}
            </p>
          </div>
        </div>

        <div
          class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop
        >
          <UDropdownMenu :items="convActions(conv)" :content="{ align: 'end' }">
            <UButton
              icon="i-lucide-ellipsis-vertical"
              color="neutral"
              variant="ghost"
              size="xs"
              square
            />
          </UDropdownMenu>
        </div>
      </div>
    </div>
  </div>
</template>

