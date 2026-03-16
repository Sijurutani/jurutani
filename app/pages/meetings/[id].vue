<script setup lang="ts">
  import type { Tables } from '~/types/database.types'
  import { formatDateLong } from '~/utils/dateFormatter'

  definePageMeta({
    layout: 'default',
  })

  const route = useRoute()
  const router = useRouter()
  const supabase = useSupabaseClient()

  type MeetingSchedule = Tables<'meeting_schedules'>

  const meeting = ref<MeetingSchedule | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  const notFound = ref(false)

  const content = computed(() => meeting.value?.content || '')

  const goBack = () => {
    router.push('/meetings')
  }

  onMounted(async () => {
    loading.value = true
    error.value = null
    notFound.value = false
    try {
      const id = route.params.id as string
      const { data, error: err } = await supabase
        .from('meeting_schedules')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .is('archived_at', null)
        .single()
      if (err) {
        if (err.code === 'PGRST116') {
          notFound.value = true
        } else {
          error.value = err.message
        }
      } else {
        meeting.value = data
        if (data) {
          useSeoDetail({
            title: data.title,
            description: data.content || 'Jadwal kegiatan dan meeting JuruTani.',
            url: `https://jurutani.com/meetings/${id}`,
            type: 'article'
          })
        }
      }
    } catch (e: any) {
      error.value = e?.message || 'Terjadi kesalahan'
    } finally {
      loading.value = false
    }
  })
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950">
    <div class="max-w-4xl mx-auto px-4 pb-16 pt-6 lg:pt-4">
      <button
        type="button"
        class="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/40 mb-6"
        @click="goBack"
      >
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Kembali ke daftar meetings
      </button>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-500 dark:border-t-emerald-400" />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat detail meeting...</p>
      </div>

      <div v-else-if="error" class="max-w-md mx-auto">
        <UAlert
          color="error"
          icon="i-lucide-alert-triangle"
          title="Gagal memuat data"
          :description="error"
        />
      </div>

      <div v-else-if="notFound" class="max-w-md mx-auto text-center py-16">
        <UIcon name="i-lucide-calendar-x" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Meeting tidak ditemukan</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Meeting yang Anda cari mungkin sudah diarsipkan atau dihapus.
        </p>
      </div>

      <article
        v-else-if="meeting"
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/60 overflow-hidden"
      >
        <div class="px-6 pt-6 pb-3 border-b border-emerald-100 dark:border-emerald-900/50">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {{ meeting.title }}
            </h1>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-medium">
              <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
              {{ formatDateLong(meeting.created_at) }}
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-medium">
              <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
              Terakhir diperbarui {{ formatDateLong(meeting.updated_at) }}
            </span>
          </div>
        </div>

        <div class="p-6 md:p-8">
          <div
            v-if="content"
            class="prose prose-sm md:prose lg:prose-lg max-w-none prose-emerald prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-emerald-600 hover:prose-a:text-emerald-700 dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-200 dark:prose-a:text-emerald-400"
            v-html="content"
          />
          <p v-else class="text-gray-600 dark:text-gray-300">
            Belum ada deskripsi rinci untuk meeting ini.
          </p>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
  .prose {
    line-height: 1.75;
  }
</style>

