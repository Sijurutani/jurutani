<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { Database } from '~/types/database.types';
import { toastStore } from '~/composables/useJuruTaniToast';

type UserData = Database['public']['Tables']['profiles']['Row'];

const authStore = useAuthStore();
const supabase = useSupabaseClient<Database>();

const props = defineProps<{
  userData: UserData;
}>();

const emit = defineEmits<{
  update: [];
}>();

// State
const loading = ref(false);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

// Form data with all fields
const formData = reactive({
  full_name: props.userData.full_name || '',
  username: props.userData.username || '',
  phone: props.userData.phone || '',
  address: props.userData.address || '',
  bio: props.userData.bio || '',
  website: props.userData.website || '',
  birth_date: props.userData.birth_date || '',
  avatar_url: props.userData.avatar_url || ''
});

// Validation rules
const validations = {
  username: (value: string) => {
    if (!value) return true; // Optional field
    return /^[a-zA-Z0-9_]+$/.test(value) || 'Username hanya boleh berisi huruf, angka, dan underscore';
  },
  website: (value: string) => {
    if (!value) return true; // Optional field
    try {
      new URL(value.startsWith('http') ? value : `https://${value}`);
      return true;
    } catch {
      return 'Format website tidak valid';
    }
  },
  phone: (value: string) => {
    if (!value) return true; // Optional field
    return /^[\d\s\-+()]+$/.test(value) || 'Format nomor telepon tidak valid';
  }
};

// Computed validation
const formErrors = computed(() => {
  const errors: Record<string, string> = {};
  
  Object.entries(validations).forEach(([field, validator]) => {
    const result = validator(formData[field as keyof typeof formData]);
    if (typeof result === 'string') {
      errors[field] = result;
    }
  });
  
  return errors;
});

const isFormValid = computed(() => Object.keys(formErrors.value).length === 0);

// Image handling
const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!validTypes.includes(file.type)) {
    toastStore.error('Format file tidak didukung. Gunakan JPG, PNG, atau GIF.');
    return;
  }

  if (file.size > maxSize) {
    toastStore.error('Ukuran file terlalu besar. Maksimal 2MB.');
    return;
  }

  imageFile.value = file;
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const resetImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
};

// Main submit handler
const handleSubmit = async () => {
  if (!isFormValid.value) {
    toastStore.error('Mohon perbaiki kesalahan pada form.');
    return;
  }

  loading.value = true;
  
  try {
    if (!authStore.user?.sub) {
      toastStore.error('Anda harus login untuk memperbarui profil.');
      return;
    }

    if (authStore.user.sub !== props.userData.id) {
      toastStore.error('Tidak dapat memperbarui profil pengguna lain.');
      return;
    }

    let newAvatarUrl = formData.avatar_url;
    
    // Handle avatar upload locally
    if (imageFile.value) {
      const fileExt = imageFile.value.name.split('.').pop();
      const fileName = `${authStore.user.sub}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, imageFile.value, { upsert: true });

      if (uploadError) {
        throw new Error(uploadError.message || 'Gagal mengupload gambar profil');
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      newAvatarUrl = publicUrl;
      formData.avatar_url = newAvatarUrl;
      
      // Update cache version equivalent
      authStore.refreshAvatarCache?.();
    }

    // Prepare update data
    const updates = {
      full_name: (formData.full_name || '').trim(),
      username: (formData.username || '').trim() || null,
      phone: (formData.phone || '').trim() || null,
      address: (formData.address || '').trim() || null,
      bio: (formData.bio || '').trim() || null,
      website: (formData.website || '').trim() || null,
      birth_date: formData.birth_date || null,
      avatar_url: newAvatarUrl,
      updated_at: new Date().toISOString()
    };

    // Update profile directly to supabase
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authStore.user.sub)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message || 'Gagal memperbarui profil');
    }

    // Update local store state if needed, assuming reactive
    if (authStore.profile) {
      Object.assign(authStore.profile, updates);
    }

    // Emit success
    emit('update');
    toastStore.success('Profil berhasil diperbarui.');
    resetImage();
    
  } catch (error) {
    console.error('Exception updating profile:', error);
    toastStore.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui profil.');
  } finally {
    loading.value = false;
  }
};



// Computed properties
const currentAvatar = computed(() => {
  return imagePreview.value || formData.avatar_url || '/profile.png';
});

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  console.error('Image failed to load:', target.src);
  target.src = '/profile.png';
};

// Format website URL for display
const formatWebsiteUrl = (url: string) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
};
</script>

<template>
  <form class="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-lg border border-gray-100 dark:border-gray-800 p-6 max-w-2xl mx-auto transition-all duration-200" @submit.prevent="handleSubmit">
    <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Edit Profil</h2>

    <!-- Avatar Upload -->
    <div class="mb-6">
      <label class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Foto Profil</label>
      
      <div class="flex items-center">
        <div class="w-24 h-24 rounded-full overflow-hidden mr-4 bg-gray-100 dark:bg-gray-800 shrink-0">
          <NuxtImg 
            :src="currentAvatar" 
            alt="Avatar Preview"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>
        
        <div class="flex flex-col">
          <input 
            id="avatar" 
            type="file" 
            accept="image/*" 
            class="hidden"
            @change="handleImageSelect"
          >
          <div class="flex space-x-2">
            <UButton
              color="success"
              variant="soft"
              size="sm"
              as="label"
              for="avatar"
              class="cursor-pointer"
            >
              Pilih Gambar
            </UButton>
            <UButton
              v-if="imagePreview"
              color="neutral"
              variant="soft"
              size="sm"
              type="button"
              @click="resetImage"
            >
              Batal
            </UButton>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Format: JPG, PNG, GIF. Maks. 2MB
          </p>
        </div>
      </div>
    </div>

    <!-- Form Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <!-- Full Name -->
      <div class="md:col-span-2">
        <label for="full_name" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          Nama Lengkap *
        </label>
        <input
          id="full_name"
          v-model="formData.full_name"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          placeholder="Masukkan nama lengkap Anda"
        >
      </div>

      <!-- Username -->
      <div>
        <label for="username" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          Username
        </label>
        <input
          id="username"
          v-model="formData.username"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          :class="{ 'border-red-500 dark:border-red-500': formErrors.username }"
          placeholder="username_anda"
        >
        <p v-if="formErrors.username" class="text-red-500 dark:text-red-400 text-xs mt-1">
          {{ formErrors.username }}
        </p>
      </div>

      <!-- Phone -->
      <div>
        <label for="phone" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          Nomor Telepon
        </label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          :class="{ 'border-red-500 dark:border-red-500': formErrors.phone }"
          placeholder="08123456789"
        >
        <p v-if="formErrors.phone" class="text-red-500 dark:text-red-400 text-xs mt-1">
          {{ formErrors.phone }}
        </p>
      </div>

      <!-- Birth Date -->
      <div>
        <label for="birth_date" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          Tanggal Lahir
        </label>
        <input
          id="birth_date"
          v-model="formData.birth_date"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
        >
      </div>

      <!-- Website -->
      <div>
        <label for="website" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          Website
        </label>
        <input
          id="website"
          v-model="formData.website"
          type="url"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          :class="{ 'border-red-500 dark:border-red-500': formErrors.website }"
          placeholder="https://website-anda.com"
        >
        <p v-if="formErrors.website" class="text-red-500 dark:text-red-400 text-xs mt-1">
          {{ formErrors.website }}
        </p>
      </div>

      <!-- Address -->
      <div class="md:col-span-2">
        <label for="address" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          Alamat
        </label>
        <input
          id="address"
          v-model="formData.address"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          placeholder="Masukkan alamat lengkap Anda"
        >
      </div>

      <!-- Bio -->
      <div class="md:col-span-2">
        <label for="bio" class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          v-model="formData.bio"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-colors"
          placeholder="Ceritakan sedikit tentang diri Anda..."
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ formData.bio.length }}/300 karakter
        </p>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors">
      <UButton
        type="submit"
        color="success"
        variant="solid"
        size="lg"
        :loading="loading"
        :disabled="loading || !isFormValid"
        icon="i-lucide-save"
      >
        Simpan Perubahan
      </UButton>
    </div>
  </form>
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