<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
 ;

definePageMeta({
  layout: 'default',
})

const route = useRoute();
const router = useRouter();
const supabase = useSupabaseClient();

const meeting = ref(null);
const author = ref(null);
const loading = ref(true);
const error = ref(null);
const notFound = ref(false);

const formatDate = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return parsedDate.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getCategoryBadgeClass = (category: string) => {
  return category === 'Online' || category === 'online'
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
};

const getCategoryIcon = (category: string) => {
  return category === 'Online' || category === 'online' ? '🌐' : '📍';
};

const generateImageUrl = (id: string, imageFileName?: string) => {
  if (!imageFileName) return null;
  
  // If it's already a full URL, return as is
  if (imageFileName.startsWith('http')) {
    return imageFileName;
  }
  
  return supabase.storage
    .from('meetings')
    .getPublicUrl(`${id}/${imageFileName}`)
    .data.publicUrl;
};

const generateAttachmentUrl = (id: string, attachmentFileName: string) => {
  return supabase.storage
    .from('meetings')
    .getPublicUrl(`${id}/attachments/${attachmentFileName}`)
    .data.publicUrl;
};

// Fixed image URL handling
const imageUrl = computed(() => {
  if (!meeting.value || !meeting.value.image_url || meeting.value.image_url.trim() === '') {
    return null;
  }
  
  // Check if image_url is already a full URL (starts with http/https)
  if (meeting.value.image_url.startsWith('http')) {
    return meeting.value.image_url;
  }
  
  // If it's just a filename, generate the URL
  return generateImageUrl(meeting.value.id, meeting.value.image_url);
});

const authorAvatarUrl = computed(() => {
  return author.value?.avatar_url || null;
});

// Fixed attachments parsing to handle multiple files with correct data structure
const attachmentUrls = computed(() => {
  if (!meeting.value?.attachments) {
    return [];
  }
  
  let attachments = [];
  
  // Parse attachments if it's a string (JSON array)
  if (typeof meeting.value.attachments === 'string') {
    try {
      attachments = JSON.parse(meeting.value.attachments);
    } catch (e) {
      console.error('Error parsing attachments:', e);
      return [];
    }
  } else if (Array.isArray(meeting.value.attachments)) {
    attachments = meeting.value.attachments;
  } else {
    // Single attachment object
    attachments = [meeting.value.attachments];
  }
  
  // Ensure we have an array
  if (!Array.isArray(attachments)) {
    return [];
  }
  
  // Handle multiple formats and map each attachment
  return attachments.map((attachment, index) => {
    if (typeof attachment === 'string') {
      // Old format - just filename string
      return {
        id: `${meeting.value.id}-${index}`,
        filename: attachment,
        url: generateAttachmentUrl(meeting.value.id, attachment),
        name: attachment,
        size: null,
        type: null
      };
    } else if (typeof attachment === 'object' && (attachment.name || attachment.filename)) {
      // New format - object with metadata
      const fileName = attachment.name || attachment.filename;
      return {
        id: `${meeting.value.id}-${index}`,
        filename: fileName,
        url: attachment.url || generateAttachmentUrl(meeting.value.id, fileName),
        name: fileName,
        size: attachment.size || null,
        type: attachment.type || null
      };
    }
    
    console.warn('Unknown attachment format:', attachment);
    return null;
  }).filter(Boolean); // Remove null entries
});

const downloadAttachment = (attachment: any) => {
  if (attachment.url) {
    window.open(attachment.url, '_blank');
  }
};

const openCourseLink = () => {
  if (meeting.value?.link) {
    window.open(meeting.value.link, '_blank');
  }
};

const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toUpperCase() || 'FILE';
};

const getFileIcon = (type: string) => {
  if (!type) return 'i-heroicons-document';
  
  if (type.includes('pdf')) return 'i-heroicons-document-text';
  if (type.includes('image')) return 'i-heroicons-photo';
  if (type.includes('video')) return 'i-heroicons-film';
  if (type.includes('audio')) return 'i-heroicons-speaker-wave';
  if (type.includes('zip') || type.includes('rar')) return 'i-heroicons-archive-box';
  if (type.includes('word') || type.includes('doc')) return 'i-heroicons-document-text';
  if (type.includes('excel') || type.includes('sheet')) return 'i-heroicons-table-cells';
  if (type.includes('powerpoint') || type.includes('presentation')) return 'i-heroicons-presentation-chart-bar';
  
  return 'i-heroicons-document';
};

const formatFileSize = (bytes: number) => {
  if (!bytes) return '';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

const fetchAuthor = async (authorId: string) => {
  try {
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('full_name, role, avatar_url')
      .eq('id', authorId)
      .single();

    if (fetchError) {
      console.error('Error fetching author:', fetchError);
    } else if (data) {
      author.value = data;
    }
  } catch (err) {
    console.error('Exception fetching author:', err);
  }
};

const fetchMeetingById = async () => {
  loading.value = true;
  error.value = null;
  notFound.value = false;

  try {
    const meetingId = route.params.id;

    if (!meetingId) {
      router.push('/courses');
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .is('deleted_at', null)
      .is('archived_at', null)
      .single();

    if (fetchError) {
      console.error('Error fetching meeting:', fetchError);
      error.value = 'Gagal memuat course';
      if (fetchError.code === 'PGRST116') {
        notFound.value = true;
      }
    } else if (data) {
      meeting.value = data;
      
      if (data.author_id) {
        await fetchAuthor(data.author_id);
      }
    } else {
      notFound.value = true
    }
  } catch (err) {
    console.error('Exception fetching meeting:', err);
    error.value = 'Terjadi kesalahan yang tidak terduga';
  } finally {
    loading.value = false;
  }
};

const seoTitle = computed(() => meeting.value ? `${meeting.value.title}` : 'Memuat Meeting...')
const seoDescription = computed(() => {
  if (!meeting.value) return 'Course seputar pertanian dari JuruTani.'
  if (meeting.value.description && meeting.value.description !== '') return meeting.value.description
  return ''
})
const seoImage = computed(() => imageUrl.value || '/jurutani.png')
const seoKeywords = computed(() => meeting.value ? [
  'kursus pertanian',
  'course',
  meeting.value.category?.toLowerCase() || 'pelatihan',
  'pembelajaran'
] : [])

const goBack = () => {
  router.push('/courses');
};

onMounted(() => {
  fetchMeetingById();
});

// Update SEO after meeting is loaded
watch(() => meeting.value, (newVal) => {
  if (newVal) {
    useSeoDetail({
      title: seoTitle.value,
      description: seoDescription.value,
      keywords: seoKeywords.value,
      image: seoImage.value,
      url: `https://jurutani.com/courses/${route.params.id}`,
      type: 'article'
    })
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen pt-14 bg-linear-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <button 
            class="flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/20 px-3 py-2 rounded-lg"
            @click="goBack"
          >
            <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
            <span class="font-medium">Kembali ke Course</span>
          </button>
          
          <div class="flex items-center gap-2 text-green-700 dark:text-green-400">
            <UIcon name="i-heroicons-academic-cap" class="w-5 h-5" />
            <span class="font-semibold">JuruTani Courses</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-green-200 dark:border-green-800 border-t-green-500 dark:border-t-green-400" />
          <div class="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-green-300 dark:border-green-600 opacity-20" />
        </div>
        <p class="text-gray-600 dark:text-gray-400 mt-6 text-lg font-medium">Memuat course...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="bg-linear-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Oops! Terjadi Kesalahan</h3>
          <p class="text-red-600 dark:text-red-300 mb-6">{{ error }}</p>
          <UButton color="error" variant="solid" size="lg" @click="goBack">
            Kembali ke Daftar Course
          </UButton>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else-if="notFound" class="text-center py-20">
        <div class="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
          <div class="text-8xl mb-6 opacity-50">📚</div>
          <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Course Tidak Ditemukan</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Course yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
          <UButton color="neutral" variant="solid" size="lg" @click="goBack">
            Kembali ke Daftar Course
          </UButton>
        </div>
      </div>

      <!-- Course Content -->
      <article v-else-if="meeting" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Hero Image -->
        <div class="relative h-72 md:h-96 bg-linear-to-br from-green-100 via-green-200 to-emerald-200 dark:from-green-900 dark:via-green-800 dark:to-emerald-800">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="meeting.title"
            class="w-full h-full object-cover"
            @error="console.error('Image failed to load:', imageUrl)"
          >
          <div v-else class="flex items-center justify-center h-full">
            <div class="text-center text-green-600 dark:text-green-400">
              <UIcon name="i-heroicons-academic-cap" class="w-20 h-20 mx-auto mb-4 opacity-60" />
              <p class="text-lg font-medium opacity-80">Tidak ada gambar</p>
            </div>
          </div>

          <!-- Overlay gradient -->
          <div class="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>

          <!-- Category Badge -->
          <div class="absolute top-6 right-6">
            <span class="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 text-sm font-semibold rounded-full shadow-lg border border-white/20">
              <span>{{ getCategoryIcon(meeting.category) }}</span>
              {{ meeting.category }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 md:p-10">
          <!-- Title -->
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            {{ meeting.title }}
          </h1>

          <!-- Meta Information -->
          <div class="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-10 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-full">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
              <span class="font-medium">{{ formatDate(meeting.created_at) }}</span>
            </div>
            
            <div v-if="author" class="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-full">
              <UIcon name="i-heroicons-user" class="w-4 h-4" />
              <span class="font-medium">{{ author.full_name || 'Instruktur' }}</span>
            </div>

            <div v-if="meeting.organization" class="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-full">
              <UIcon name="i-heroicons-building-office" class="w-4 h-4" />
              <span class="font-medium">{{ meeting.organization }}</span>
            </div>
          </div>

          <!-- Instructor Card -->
          <div v-if="author" class="mb-10 p-8 bg-linear-to-br from-green-50 via-blue-50 to-indigo-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-green-200 dark:border-green-700 shadow-sm">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-white" />
              </div>
              Instruktur
            </h2>
            <div class="flex items-center space-x-6">
              <div class="relative">
                <img
                  :src="authorAvatarUrl || '/placeholder.png'"
                  :alt="author.full_name"
                  class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl"
                >
                <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white"/>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white text-xl mb-1">{{ author.full_name || 'Nama tidak tersedia' }}</h3>
                <p class="text-green-600 dark:text-green-400 font-semibold text-lg">{{ author.role || 'Role tidak tersedia' }}</p>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="mb-10">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-white" />
              </div>
              Deskripsi Course
            </h2>
            <div class="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-600 shadow-sm">
              <div 
                class="prose prose-lg max-w-none prose-green prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 hover:prose-a:text-green-700 dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-a:text-green-400"
                v-html="meeting.description || meeting.content"
              />
            </div>
          </div>

          <!-- Course Link -->
          <div v-if="meeting.link" class="mb-10 p-8 bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-link" class="w-5 h-5 text-white" />
              </div>
              Link Course
            </h2>
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <NuxtLink
                :to="meeting.link"
                target="_blank"
                class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium break-all flex-1 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 transition-colors shadow-sm"
              >
                {{ meeting.link }}
              </NuxtLink>
              <UButton
                color="success"
                variant="solid"
                icon="i-heroicons-arrow-top-right-on-square"
                size="xl"
                class="whitespace-nowrap shadow-lg hover:shadow-xl transition-shadow"
                @click="openCourseLink"
              >
                Akses Course
              </UButton>
            </div>
          </div>

          <!-- Attachments -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-paper-clip" class="w-5 h-5 text-white" />
              </div>
              Lampiran
              <span class="text-sm font-normal bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full">{{ attachmentUrls.length }}</span>
            </h2>
            
            <div v-if="attachmentUrls.length > 0" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div 
                v-for="attachment in attachmentUrls" 
                :key="attachment.id"
                class="group relative flex items-center justify-between p-6 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                @click="downloadAttachment(attachment)"
              >
                <div class="flex items-start space-x-4 flex-1">
                  <div class="w-14 h-14 bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                    <UIcon :name="getFileIcon(attachment.type)" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-blue-900 dark:text-blue-200 mb-1 line-clamp-2" :title="attachment.filename">
                      {{ attachment.filename }}
                    </p>
                    <div class="flex flex-wrap items-center gap-2 text-xs">
                      <span class="bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-full font-medium text-blue-600 dark:text-blue-400">
                        {{ getFileExtension(attachment.filename) }}
                      </span>
                      <span v-if="attachment.size" class="text-blue-600 dark:text-blue-400">
                        {{ formatFileSize(attachment.size) }}
                      </span>
                    </div>
                    <p class="text-xs text-blue-500 dark:text-blue-300 mt-1 opacity-75">
                      Klik untuk mengunduh
                    </p>
                  </div>
                </div>
                <div class="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60 transition-colors flex-shrink-0">
                  <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                </div>

                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-linear-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>
            
            <div v-else class="text-center py-16 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl border border-gray-200 dark:border-gray-600">
              <div class="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <UIcon name="i-heroicons-paper-clip" class="w-10 h-10 text-gray-400" />
              </div>
              <p class="text-gray-500 dark:text-gray-400 text-xl font-medium mb-2">Tidak ada lampiran</p>
              <p class="text-gray-400 dark:text-gray-500">Lampiran akan ditampilkan di sini jika tersedia</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.prose {
  line-height: 1.8;
}

.prose p {
  margin-bottom: 1.5rem;
}

.prose h1, .prose h2, .prose h3 {
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  font-weight: 700;
}

.prose h1 {
  font-size: 2rem;
}

.prose h2 {
  font-size: 1.75rem;
}

.prose h3 {
  font-size: 1.5rem;
}

.prose ul, .prose ol {
  margin: 1.5rem 0;
  padding-left: 2rem;
}

.prose li {
  margin: 1rem 0;
}

.prose blockquote {
  margin: 2rem 0;
  padding-left: 1.5rem;
  border-left: 4px solid #10b981;
  font-style: italic;
  color: #6b7280;
  background: rgba(16, 185, 129, 0.05);
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
}

.dark .prose blockquote {
  color: #9ca3af;
  border-left-color: #34d399;
  background: rgba(52, 211, 153, 0.1);
}

/* Custom scrollbar */
.prose::-webkit-scrollbar {
  width: 8px;
}

.prose::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.prose::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #10b981, #059669);
  border-radius: 4px;
}

.prose::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #059669, #047857);
}

/* Text overflow handling for long filenames */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.3;
  max-height: 2.6em;
}
</style>