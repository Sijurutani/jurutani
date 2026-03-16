<script setup lang="ts">
import type { Tables } from '~/types/database.types'

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const authStore = useAuthStore()

type LearningCourse = Tables<'learning_courses'>
type CourseLesson = Tables<'course_lessons'>

const course = ref<LearningCourse | null>(null)
const lessons = ref<CourseLesson[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const getCoverUrl = (path: string | null) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from('courses-images').getPublicUrl(path)
  return data.publicUrl
}

const goBack = () => {
  router.push('/courses')
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const slug = route.params.slug as string
    const { data: courseData, error: err } = await supabase
      .from('learning_courses')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'approved')
      .is('deleted_at', null)
      .is('archived_at', null)
      .single()
    if (err) {
      if (err.code === 'PGRST116') {
        error.value = 'Course tidak ditemukan'
      } else {
        error.value = err.message
      }
      return
    }
    course.value = courseData

    const { data: lessonsData, error: lessonErr } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('course_id', courseData.id)
      .eq('status', 'approved')
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
    if (lessonErr) throw lessonErr
    lessons.value = lessonsData ?? []

    useSeoDetail({
      title: courseData.title,
      description: (courseData.description as any)?.summary || 'Course pertanian dari JuruTani.',
      image: getCoverUrl(courseData.cover_image) || '/jurutani.png',
      url: `https://jurutani.com/courses/${slug}`,
      type: 'article',
    })
  } catch (e: any) {
    error.value = e?.message || 'Terjadi kesalahan'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950">
    <div class="max-w-5xl mx-auto px-4 pb-16 pt-6 lg:pt-4">
      <button
        type="button"
        class="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/40 mb-6"
        @click="goBack"
      >
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Kembali ke daftar course
      </button>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-500 dark:border-t-emerald-400" />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat detail course...</p>
      </div>

      <div v-else-if="error || !course" class="max-w-md mx-auto">
        <UAlert
          color="error"
          icon="i-lucide-alert-triangle"
          title="Gagal memuat course"
          :description="error || 'Course tidak ditemukan atau tidak tersedia.'"
        />
      </div>

      <div v-else class="space-y-6">
        <article class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/60 overflow-hidden">
          <div class="relative h-48 md:h-60 bg-emerald-100 dark:bg-emerald-900/40">
            <img
              v-if="getCoverUrl(course.cover_image)"
              :src="getCoverUrl(course.cover_image)"
              :alt="course.title"
              class="w-full h-full object-cover"
            >
            <div v-else class="flex items-center justify-center h-full text-emerald-500 dark:text-emerald-300">
              <UIcon name="i-lucide-book-open" class="w-16 h-16 opacity-70" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div class="absolute bottom-4 left-4 right-4">
              <h1 class="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">
                {{ course.title }}
              </h1>
            </div>
          </div>

          <div class="p-6 md:p-8">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {{ (course.description as any)?.summary || 'Course pertanian dari JuruTani.' }}
            </p>

            <div class="mt-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Daftar Lesson
              </h2>
              <div v-if="lessons.length" class="space-y-3">
                <NuxtLink
                  v-for="(lesson, index) in lessons"
                  :key="lesson.id"
                  :to="`/courses/${course.slug || course.id}/lessons/${lesson.slug}`"
                  class="flex items-center justify-between px-4 py-3 rounded-xl border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-semibold">
                      {{ index + 1 }}
                    </span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ lesson.title }}
                    </span>
                  </div>
                  <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                </NuxtLink>
              </div>
              <p v-else class="text-sm text-gray-500 dark:text-gray-400">
                Belum ada lesson untuk course ini.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

