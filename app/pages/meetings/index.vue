<script setup lang="ts">
  import type { Tables } from '~/types/database.types'
  import { formatDateLong } from '~/utils/dateFormatter'

  definePageMeta({
    layout: 'default',
  })

  const supabase = useSupabaseClient()

  type MeetingSchedule = Tables<'meeting_schedules'>

  const meetings = ref<MeetingSchedule[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('meeting_schedules')
        .select('*')
        .is('deleted_at', null)
        .is('archived_at', null)
        .order('created_at', { ascending: false })

      if (err) throw err
      meetings.value = data ?? []
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat meetings'
    } finally {
      loading.value = false
    }
  })
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950">
    <div class="max-w-5xl mx-auto px-4 pb-16 pt-4 lg:pt-0">
      <header class="mb-10 mt-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <UIcon name="i-lucide-calendar-range" class="w-4 h-4" />
          Jadwal Kegiatan
        </div>
        <h1 class="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Meetings & Webinar JuruTani
        </h1>
        <p class="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl">
          Ikuti berbagai kegiatan online dan offline seputar pertanian, penyuluhan, dan pelatihan yang diselenggarakan JuruTani.
        </p>
      </header>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-500 dark:border-t-emerald-400" />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat daftar meetings...</p>
      </div>

      <div v-else-if="error" class="max-w-md mx-auto">
        <UAlert
          color="error"
          icon="i-lucide-alert-triangle"
          title="Gagal memuat data"
          :description="error"
        />
      </div>

      <div v-else-if="!meetings.length" class="max-w-md mx-auto text-center py-16">
        <UIcon name="i-lucide-calendar-x" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Belum ada jadwal meetings</h2>
        <p class="text-gray-600 dark:text-gray-400">
          Nantikan jadwal kegiatan dan webinar terbaru dari JuruTani di halaman ini.
        </p>
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2">
        <article
          v-for="item in meetings"
          :key="item.id"
          class="group relative rounded-2xl border border-emerald-100/80 dark:border-emerald-900/60 bg-white/80 dark:bg-emerald-950/40 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <NuxtLink :to="`/meetings/${item.id}`" class="flex flex-col h-full">
            <div class="px-5 pt-5 pb-4 flex-1 flex flex-col">
              <div class="flex items-center justify-between gap-3 mb-3">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                  <UIcon name="i-lucide-calendar-clock" class="w-3.5 h-3.5" />
                  {{ formatDateLong(item.created_at) }}
                </span>
              </div>
              <h2 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 line-clamp-2 mb-2">
                {{ item.title }}
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-1">
                {{ item.content || 'Kegiatan seputar pelatihan, webinar, atau pertemuan komunitas JuruTani.' }}
              </p>
            </div>
            <div class="px-5 pb-4 flex items-center justify-between border-t border-emerald-100/80 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/60">
              <span class="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <UIcon name="i-lucide-eye" class="w-3.5 h-3.5" />
                Lihat detail
              </span>
              <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>
  </div>
</template>