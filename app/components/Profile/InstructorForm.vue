<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { toastStore } from '~/composables/useJuruTaniToast'
import type { Database } from '~/types/database.types'

const emit = defineEmits<{
  update: []
}>()

const authStore = useAuthStore()
const supabase = useSupabaseClient<Database>()

// Form state
const formData = reactive({
  provinces: '',
  district: '',
  note: ''
})

const isSubmitting = ref(false)
const isLoading = ref(true)

// District data from Supabase
const districts = ref<Database['public']['Tables']['districts']['Row'][]>([])

const provinceOptions = computed(() => {
  const set = new Set<string>()
  for (const d of districts.value) {
    if (d.province) set.add(d.province)
  }
  return Array.from(set).sort().map(p => ({ label: p, value: p }))
})

const districtOptions = computed(() => {
  if (!formData.provinces) return []
  return districts.value
    .filter(d => d.province === formData.provinces)
    .map(d => ({ label: d.name, value: d.name }))
})

// Computed
const isFormValid = computed(() => {
  return !!formData.provinces && !!formData.district
})

// Load data
const loadData = async () => {
  if (!authStore.user?.sub) return
  isLoading.value = true

  try {
    // load districts
    const { data: districtsData } = await supabase
      .from('districts')
      .select('id, name, province')
      .order('province', { ascending: true })
      .order('name', { ascending: true })

    districts.value = (districtsData ?? []) as Database['public']['Tables']['districts']['Row'][]

    // load instructor profile
    const { data: instructorData } = await supabase
      .from('instructors')
      .select('*')
      .eq('user_id', authStore.user.sub)
      .is('deleted_at', null)
      .maybeSingle()

    if (instructorData) {
      formData.provinces = instructorData.provinces || ''
      formData.district = instructorData.district || ''
      formData.note = instructorData.note || ''
    }
  } catch (error) {
    console.error('Failed to fetch instructor data', error)
  } finally {
    isLoading.value = false
  }
}

// Submit handler
const handleSubmit = async () => {
  if (!authStore.user?.sub || !isFormValid.value) return

  isSubmitting.value = true

  try {
    const updates = {
      user_id: authStore.user.sub,
      provinces: formData.provinces || null,
      district: formData.district || null,
      note: formData.note || null,
      updated_at: new Date().toISOString()
    }
    
    // Check if instructor exists
    const { data: existingData } = await supabase
      .from('instructors')
      .select('id')
      .eq('user_id', authStore.user.sub)
      .is('deleted_at', null)
      .maybeSingle()
      
    let error;
    if (existingData) {
      const { error: updErr } = await supabase.from('instructors').update(updates).eq('user_id', authStore.user.sub)
      error = updErr;
    } else {
      const { error: insErr } = await supabase.from('instructors').insert({ ...updates, created_at: new Date().toISOString() })
      error = insErr;
    }

    if (!error) {
      toastStore.success('Data profesional penyuluh berhasil diperbarui.')
      emit('update')
    } else {
      toastStore.error(error.message || 'Gagal memperbarui data penyuluh.')
    }
  } catch (err: any) {
    toastStore.error(err.message || 'Terjadi kesalahan.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-lg border border-gray-100 dark:border-gray-800 p-6 transition-all duration-200">
    <h3 class="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
      <UIcon name="i-lucide-user-check" class="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
      Data Profesional Penyuluh
    </h3>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
      <span class="text-gray-600 dark:text-gray-400">Memuat data...</span>
    </div>

    <!-- Form -->
    <form v-else class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Provinces -->
      <div>
        <label for="instructor-provinces" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          Provinsi *
        </label>
        <USelect
          id="instructor-provinces"
          v-model="formData.provinces"
          :items="provinceOptions"
          placeholder="Pilih provinsi"
          class="w-full"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Provinsi wilayah kerja Anda sebagai penyuluh
        </p>
      </div>

      <!-- District -->
      <div>
        <label for="instructor-district" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          Kabupaten/Kota *
        </label>
        <USelect
          id="instructor-district"
          v-model="formData.district"
          :items="districtOptions"
          :disabled="!formData.provinces"
          placeholder="Pilih kabupaten/kota"
          class="w-full"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Kabupaten atau kota wilayah kerja Anda
        </p>
      </div>

      <!-- Note -->
      <div>
        <label for="instructor-note" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          Catatan / Deskripsi
        </label>
        <textarea
          id="instructor-note"
          v-model="formData.note"
          rows="5"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-colors"
          placeholder="Ceritakan tentang pengalaman dan fokus penyuluhan Anda..."
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ formData.note?.length || 0 }}/500 karakter
        </p>
      </div>

      <!-- Info Box -->
      <div class="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div class="flex">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2 shrink-0 mt-0.5" />
          <div class="text-sm text-gray-700 dark:text-gray-300">
            <p class="font-medium mb-1">Informasi Penting:</p>
            <ul class="list-disc list-inside space-y-1 text-xs">
              <li>Wilayah kerja membantu petani menemukan penyuluh terdekat</li>
              <li>Catatan dapat berisi spesialisasi atau program unggulan Anda</li>
              <li>Data ini dapat dilihat oleh pengguna lain</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors">
        <UButton
          type="submit"
          color="success"
          variant="solid"
          size="lg"
          :loading="isSubmitting"
          :disabled="isSubmitting || !isFormValid"
          icon="i-lucide-save"
        >
          Simpan Perubahan
        </UButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
