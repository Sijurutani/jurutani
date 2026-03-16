<script setup lang="ts">
  import type { Tables } from '~/types/database.types'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  const supabase = useSupabaseClient()
  const authStore = useAuthStore()

  type CourseCompletion = Tables<'course_completions'>
  type LearningCourse = Tables<'learning_courses'>
  type CourseRating = Tables<'course_ratings'>

  type CompletionWithCourse = CourseCompletion & { course: LearningCourse | null; rating: CourseRating | null }

  const completions = ref<CompletionWithCourse[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    loading.value = true
    error.value = null
    try {
      const userId = authStore.user?.value?.id || authStore.user?.value?.sub
      if (!userId) throw new Error('User tidak terautentikasi')

      const { data, error: err } = await supabase
        .from('course_completions')
        .select(`
          *,
          course:learning_courses(*),
          rating:course_ratings(rating, review, created_at, updated_at)
        `)
        .eq('user_id', userId)
        .is('invalidated_at', null)
        .order('completed_at', { ascending: false })

      if (err) throw err
      completions.value = (data ?? []) as unknown as CompletionWithCourse[]
    } catch (e: any) {
      error.value = e?.message || 'Gagal memuat riwayat course'
    } finally {
      loading.value = false
    }
  })
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950">
    <div class="max-w-5xl mx-auto px-4 pb-16 pt-6 lg:pt-4">
      <header class="mb-8 mt-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <UIcon name="i-lucide-book-open-check" class="w-4 h-4" />
          Riwayat Kursus Saya
        </div>
        <h1 class="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Progress & Sertifikasi Belajar
        </h1>
      </header>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-500 dark:border-t-emerald-400" />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat riwayat course...</p>
      </div>

      <div v-else-if="error" class="max-w-md mx-auto">
        <UAlert
          color="error"
          icon="i-lucide-alert-triangle"
          title="Gagal memuat data"
          :description="error"
        />
      </div>

      <div v-else-if="!completions.length" class="max-w-md mx-auto text-center py-16">
        <UIcon name="i-lucide-book-open" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Belum ada course selesai</h2>
        <p class="text-gray-600 dark:text-gray-400">
          Mulailah mengikuti course di JuruTani, dan progress serta sertifikatmu akan tampil di sini.
        </p>
      </div>

      <div v-else class="space-y-4">
        <article
          v-for="item in completions"
          :key="item.course_id"
          class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-900/60 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4"
        >
          <div class="flex-1 min-w-0">
            <h2 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">
              {{ item.course?.title || 'Course tidak ditemukan' }}
            </h2>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Selesai {{ new Date(item.completed_at).toLocaleDateString('id-ID') }} • {{ item.lesson_count }} lesson
            </p>
            <p v-if="item.rating" class="mt-2 text-xs text-gray-600 dark:text-gray-300">
              Rating kamu: <span class="font-semibold">{{ item.rating.rating }}/5</span>
            </p>
          </div>
          <div class="flex flex-col items-stretch gap-2 w-full md:w-auto">
            <UButton
              color="success"
              variant="solid"
              size="sm"
              :to="`/courses/${item.course?.slug || item.course_id}`"
            >
              Lihat Course
            </UButton>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

