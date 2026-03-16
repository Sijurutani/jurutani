<script setup lang="ts">
  import type { Tables } from '~/types/database.types'
  import { formatDateLong } from '~/utils/dateFormatter'

  useSeoOptimized('courses')

  const supabase = useSupabaseClient()

  type LearningCourse = Tables<'learning_courses'>

  const courses = ref<LearningCourse[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const getCoverUrl = (path: string | null) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    const { data } = supabase.storage.from('courses-images').getPublicUrl(path)
    return data.publicUrl
  }

  onMounted(async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('learning_courses')
        .select('*')
        .eq('status', 'approved')
        .is('deleted_at', null)
        .is('archived_at', null)
        .order('published_at', { ascending: false })

      if (err) throw err
      courses.value = data ?? []
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat courses'
    } finally {
      loading.value = false
    }
  })
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950">
    <div class="max-w-6xl mx-auto px-4 pb-16 pt-6 lg:pt-4">
      <header class="mb-10 mt-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <UIcon name="i-lucide-graduation-cap" class="w-4 h-4" />
          Kursus Pertanian
        </div>
        <h1 class="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Belajar Pertanian bersama JuruTani
        </h1>
        <p class="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl">
          Kumpulan course pertanian terkurasi dari pakar dan penyuluh untuk meningkatkan keterampilanmu di lapangan.
        </p>
      </header>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-500 dark:border-t-emerald-400" />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat daftar course...</p>
      </div>

      <div v-else-if="error" class="max-w-md mx-auto">
        <UAlert
          color="error"
          icon="i-lucide-alert-triangle"
          title="Gagal memuat data"
          :description="error"
        />
      </div>

      <div v-else-if="!courses.length" class="max-w-md mx-auto text-center py-16">
        <UIcon name="i-lucide-book-open" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Belum ada course tersedia</h2>
        <p class="text-gray-600 dark:text-gray-400">
          Kursus pertanian akan segera hadir. Nantikan pembaruan dari JuruTani.
        </p>
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="course in courses"
          :key="course.id"
          :to="`/courses/${course.slug || course.id}`"
          class="group bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-sm hover:shadow-xl border border-emerald-100 dark:border-emerald-900 overflow-hidden flex flex-col transition-all duration-300"
        >
          <div class="relative h-40 bg-emerald-100 dark:bg-emerald-900/40">
            <img
              v-if="getCoverUrl(course.cover_image)"
              :src="getCoverUrl(course.cover_image)"
              :alt="course.title"
              class="w-full h-full object-cover"
            >
            <div v-else class="flex items-center justify-center h-full text-emerald-500 dark:text-emerald-300">
              <UIcon name="i-lucide-book-open" class="w-12 h-12 opacity-70" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div class="absolute left-4 bottom-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <UIcon name="i-lucide-graduation-cap" class="w-3.5 h-3.5" />
              <span>Kursus</span>
            </div>
          </div>
          <div class="flex-1 flex flex-col px-4 pt-4 pb-4">
            <h2 class="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
              {{ course.title }}
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Diterbitkan {{ course.published_at ? formatDateLong(course.published_at) : formatDateLong(course.created_at) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-1">
              {{ (course.description as any)?.summary || 'Pelajari materi pertanian yang terstruktur dan praktis dari para ahli.' }}
            </p>
            <div class="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span class="inline-flex items-center gap-1">
                <UIcon name="i-lucide-play-circle" class="w-4 h-4" />
                <span>Mulai belajar</span>
              </span>
              <UIcon name="i-lucide-chevron-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>