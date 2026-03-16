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
const lesson = ref<CourseLesson | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const goBack = () => {
  router.push(`/courses/${route.params.slug}`)
}

const currentIndex = computed(() => {
  if (!lesson.value) return -1
  return lessons.value.findIndex(l => l.id === lesson.value?.id)
})

const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value >= 0 && currentIndex.value < lessons.value.length - 1)

const goPrev = () => {
  if (!hasPrev.value) return
  const prev = lessons.value[currentIndex.value - 1]
  if (!prev) return
  router.push(`/courses/${route.params.slug}/lessons/${prev.slug}`)
}

const goNext = () => {
  if (!hasNext.value) return
  const next = lessons.value[currentIndex.value + 1]
  if (!next) return
  router.push(`/courses/${route.params.slug}/lessons/${next.slug}`)
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const slug = route.params.slug as string
    const lessonSlug = route.params.lessonSlug as string

    const { data: courseData, error: cErr } = await supabase
      .from('learning_courses')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'approved')
      .is('deleted_at', null)
      .is('archived_at', null)
      .single()
    if (cErr) throw cErr
    course.value = courseData

    const { data: lessonsData, error: lErr } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('course_id', courseData.id)
      .eq('status', 'approved')
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
    if (lErr) throw lErr
    lessons.value = lessonsData ?? []

    const found = lessons.value.find(l => l.slug === lessonSlug) || null
    if (!found) {
      error.value = 'Lesson tidak ditemukan'
      return
    }
    lesson.value = found

    useSeoDetail({
      title: `${found.title} – ${courseData.title}`,
      description: 'Lesson dari course JuruTani.',
      url: `https://jurutani.com/courses/${slug}/lessons/${lessonSlug}`,
      type: 'article'
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
      <div class="flex items-center justify-between gap-2 mb-4">
        <button
          type="button"
          class="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
          @click="goBack"
        >
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Kembali ke course
        </button>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-500 dark:border-t-emerald-400" />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat lesson...</p>
      </div>

      <div v-else-if="error || !lesson" class="max-w-md mx-auto">
        <UAlert
          color="error"
          icon="i-lucide-alert-triangle"
          title="Gagal memuat lesson"
          :description="error || 'Lesson tidak ditemukan atau tidak tersedia.'"
        />
      </div>

      <div v-else class="space-y-4">
        <header>
          <p class="text-xs text-emerald-700 dark:text-emerald-300 font-medium mb-1">
            {{ course?.title }}
          </p>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {{ lesson.title }}
          </h1>
        </header>

        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-emerald-100 dark:border-emerald-900/60 p-5 md:p-7">
          <div
            class="prose prose-sm md:prose lg:prose-lg max-w-none prose-emerald prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-emerald-600 hover:prose-a:text-emerald-700 dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-200 dark:prose-a:text-emerald-400"
            v-html="(lesson.content as any)?.html || ''"
          />
        </div>

        <div class="flex items-center justify-between mt-4">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-chevron-left"
            :disabled="!hasPrev"
            @click="goPrev"
          >
            Sebelumnya
          </UButton>
          <UButton
            color="success"
            variant="solid"
            :trailing-icon="hasNext ? 'i-lucide-chevron-right' : undefined"
            :disabled="!hasNext"
            @click="goNext"
          >
            {{ hasNext ? 'Berikutnya' : 'Selesai' }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

