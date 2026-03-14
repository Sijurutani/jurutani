<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { toastStore } from '~/composables/useJuruTaniToast'

const supabase = useSupabaseClient()

interface Props {
  modelValue: boolean
  userData: {
    id: string
    email?: string
    full_name?: string
    username?: string
    phone?: string
    address?: string
    bio?: string
    website?: string
    birth_date?: string
    avatar_url?: string
  }
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update': []
}>()

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Constants
const MAX_IMAGE_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_BIO_LENGTH = 300

// Zod Schema
const schema = z.object({
  full_name: z.string().min(1, 'Nama lengkap wajib diisi'),
  username: z.string()
    .regex(/^[a-zA-Z0-9_]*$/, 'Username hanya boleh berisi huruf, angka, dan underscore')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .regex(/^[\d\s\-+()]*$/, 'Format nomor telepon tidak valid')
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
  bio: z.string()
    .max(MAX_BIO_LENGTH, `Bio maksimal ${MAX_BIO_LENGTH} karakter`)
    .optional(),
  website: z.string()
    .url('Format website tidak valid')
    .optional()
    .or(z.literal('')),
  birth_date: z.string().optional(),
  avatarFile: z.instanceof(File).optional()
    .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, {
      message: 'Ukuran gambar maksimal 2MB'
    })
    .refine((file) => !file || file.type.startsWith('image/'), {
      message: 'File harus berupa gambar'
    })
})

type Schema = z.output<typeof schema>

// Form State
const state = reactive<Partial<Schema>>({
  full_name: props.userData.full_name || '',
  username: props.userData.username || '',
  phone: props.userData.phone || '',
  address: props.userData.address || '',
  bio: props.userData.bio || '',
  website: props.userData.website || '',
  birth_date: props.userData.birth_date || '',
  avatarFile: undefined
})

const isSubmitting = ref(false)
const imagePreview = ref<string | null>(null)

// Computed
const currentAvatar = computed(() => {
  return imagePreview.value || props.userData.avatar_url || '/profile.png'
})

const bioLength = computed(() => state.bio?.length || 0)

// Avatar upload utility
const uploadAvatar = async (userId: string): Promise<string | null> => {
  if (!state.avatarFile) return null

  console.log('Starting avatar upload process...')
  
  // Delete old avatar
  if (props.userData.avatar_url?.includes('avatars/')) {
    try {
      const oldPath = props.userData.avatar_url.split('avatars/')[1].split('?')[0]
      if (oldPath) {
        console.log('Attempting to delete old avatar:', oldPath)
        await supabase.storage.from('avatars').remove([oldPath])
        console.log('Old avatar deleted successfully')
      }
    } catch (error) {
      console.warn('Error deleting old avatar:', error)
    }
  }

  // Upload new avatar
  const fileExt = state.avatarFile.name.split('.').pop()
  const fileName = `avatar_${Date.now()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  console.log('Uploading new avatar:', { fileName, filePath, fileSize: state.avatarFile.size })

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, state.avatarFile, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    console.error('Upload error:', error)
    throw new Error(`Gagal mengunggah gambar profil: ${error.message}`)
  }

  console.log('Avatar uploaded successfully:', data)

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  if (!publicUrl) {
    throw new Error('Gagal mendapatkan URL gambar profil.')
  }

  return `${publicUrl}?t=${Date.now()}`
}

// Form Submission
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true
  
  try {
    // Get authenticated user
    const { data: user } = await supabase.auth.getUser()
    console.log("auth.uid():", user?.user?.id)
    console.log("props.userData.id:", props.userData.id)
    
    if (!user?.user?.id) {
      console.error('No authenticated user found')
      toastStore.error('Anda harus login untuk memperbarui profil.')
      return
    }

    if (user.user.id !== props.userData.id) {
      console.error('User ID mismatch:', {
        authUserId: user.user.id,
        profileUserId: props.userData.id
      })
      toastStore.error('Tidak dapat memperbarui profil pengguna lain.')
      return
    }

    // Handle avatar upload
    let newAvatarUrl = props.userData.avatar_url
    if (state.avatarFile) {
      newAvatarUrl = await uploadAvatar(user.user.id)
      if (newAvatarUrl) {
        console.log('New avatar URL:', newAvatarUrl)
      }
    }

    // Prepare update data
    const updates = {
      id: user.user.id,
      full_name: event.data.full_name.trim(),
      username: event.data.username?.trim() || null,
      phone: event.data.phone?.trim() || null,
      address: event.data.address?.trim() || null,
      bio: event.data.bio?.trim() || null,
      website: event.data.website?.trim() || null,
      birth_date: event.data.birth_date || null,
      avatar_url: newAvatarUrl,
      updated_at: new Date().toISOString()
    }

    console.log('Updating profile with data:', updates)

    // Update profile
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .upsert(updates, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()

    if (updateError) {
      console.error('Error updating profile:', updateError)
      throw new Error(`Gagal memperbarui profil: ${updateError.message}`)
    }

    console.log('Profile updated successfully:', updateData)

    toastStore.success('Profil berhasil diperbarui.')
    showModal.value = false
    
    // Emit update event
    emit('update')
    
    // Reset image preview
    imagePreview.value = null
    
  } catch (error: any) {
    console.error('Exception updating profile:', error)
    toastStore.error(`Gagal memperbarui profil: ${error.message}`)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = (): void => {
  showModal.value = false
  imagePreview.value = null
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  console.error('Image failed to load:', target.src)
  target.src = '/profile.png'
}

// Watch for modal open to reset form
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // Reset form state when modal opens
    state.full_name = props.userData.full_name || ''
    state.username = props.userData.username || ''
    state.phone = props.userData.phone || ''
    state.address = props.userData.address || ''
    state.bio = props.userData.bio || ''
    state.website = props.userData.website || ''
    state.birth_date = props.userData.birth_date || ''
    state.avatarFile = undefined
    imagePreview.value = null
  }
})
</script>

<template>
  <UModal
    v-model:open="showModal"
    title="Edit Profil"
    description="Perbarui informasi profil Anda"
  >
    <template #body>
      <UForm id="profile-form" :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
        <!-- Avatar Upload -->
        <div class="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
            <NuxtImg 
              :src="currentAvatar" 
              alt="Avatar Preview"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>
          
          <UFormField label="Foto Profil" name="avatarFile" description="Format: JPG, PNG, GIF. Maksimal 2MB" class="flex-1">
            <UFileUpload
              v-model="state.avatarFile"
              accept="image/*"
              class="min-h-32 w-full"
              @change="(files) => {
                if (files && files.length > 0) {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    imagePreview = e.target?.result as string
                  }
                  reader.readAsDataURL(files[0])
                }
              }"
            />
          </UFormField>
        </div>

        <!-- Full Name -->
        <UFormField label="Nama Lengkap" name="full_name" required>
          <UInput
            v-model="state.full_name"
            placeholder="Masukkan nama lengkap Anda"
            size="lg"
            icon="i-lucide-user"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Username -->
          <UFormField label="Username" name="username">
            <UInput
              v-model="state.username"
              placeholder="username_anda"
              size="lg"
              icon="i-lucide-at-sign"
              class="w-full"
            />
          </UFormField>

          <!-- Phone -->
          <UFormField label="Nomor Telepon" name="phone">
            <UInput
              v-model="state.phone"
              placeholder="08123456789"
              size="lg"
              icon="i-lucide-phone"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Birth Date -->
          <UFormField label="Tanggal Lahir" name="birth_date">
            <UInput
              v-model="state.birth_date"
              type="date"
              size="lg"
              icon="i-lucide-calendar"
              class="w-full"
            />
          </UFormField>

          <!-- Website -->
          <UFormField label="Website" name="website">
            <UInput
              v-model="state.website"
              placeholder="https://website-anda.com"
              size="lg"
              icon="i-lucide-globe"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Address -->
        <UFormField label="Alamat" name="address">
          <UInput
            v-model="state.address"
            placeholder="Masukkan alamat lengkap Anda"
            size="lg"
            icon="i-lucide-map-pin"
            class="w-full"
          />
        </UFormField>

        <!-- Bio -->
        <UFormField 
          label="Bio" 
          name="bio"
          :description="`${bioLength}/${MAX_BIO_LENGTH} karakter`"
        >
          <UTextarea
            v-model="state.bio"
            placeholder="Ceritakan sedikit tentang diri Anda..."
            :rows="4"
            size="lg"
            autoresize
            icon="i-lucide-message-square"
            class="w-full"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          :disabled="isSubmitting"
          @click="handleCancel"
        >
          <UIcon name="i-heroicons-x-mark" class="mr-1" />
          Batal
        </UButton>
        <UButton
          type="submit"
          color="success"
          size="lg"
          :loading="isSubmitting"
          form="profile-form"
        >
          <UIcon name="i-heroicons-check" class="mr-1" />
          Simpan Perubahan
        </UButton>
      </div>
    </template>
  </UModal>
</template>
