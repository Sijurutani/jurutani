<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { toastStore } from '~/composables/useJuruTaniToast'
 
const supabase = useSupabaseClient()
const { userData, fetchUserData } = useProfile()
const { uploadFile } = useAppFileUpload()

// Types
interface Category {
  name: string
}

// Constants
const STORAGE_BUCKET = 'markets-attachments'
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

// Fetch categories
const { data: CATEGORY } = await useAsyncData('category_markets', async () => {
  try {
    const { data, error: catError } = await supabase
      .from('category_markets')
      .select('name')
      .order('name', { ascending: true })

    if (catError) throw catError
    
    return data as Category[]
  } catch (err) {
    console.error('Error fetching categories:', err)
    return []
  }
})

// Transform categories for USelect
const categoryItems = computed(() => {
  if (!CATEGORY.value) return []
  
  return CATEGORY.value.map(cat => ({
    label: cat.name,
    value: cat.name
  }))
})

// Props
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Zod Schema
const schema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  description: z.string().min(1, 'Deskripsi produk wajib diisi'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  price: z.string().optional(),
  price_range: z.string().optional(),
  shopee_link: z.string().url('Format link Shopee tidak valid').optional().or(z.literal('')),
  tiktok_link: z.string().url('Format link TikTok tidak valid').optional().or(z.literal('')),
  tokopedia_link: z.string().url('Format link Tokopedia tidak valid').optional().or(z.literal('')),
  seller: z.string().min(1, 'Nama toko wajib diisi'),
  contact_seller: z.string().min(1, 'Kontak seller wajib diisi'),
  imageFile: z.instanceof(File).optional()
    .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, {
      message: 'Ukuran gambar maksimal 5MB'
    })
    .refine((file) => !file || file.type.startsWith('image/'), {
      message: 'File harus berupa gambar'
    })
})

type Schema = z.output<typeof schema>

// Form State
const state = reactive<Partial<Schema>>({
  name: '',
  description: '',
  category: '',
  price: '',
  price_range: '',
  shopee_link: '',
  tiktok_link: '',
  tokopedia_link: '',
  seller: '',
  contact_seller: '',
  imageFile: undefined
})

const isSubmitting = ref(false)

// Check user authentication
const checkUserAuth = (): boolean => {
  if (!userData.value) {
    toastStore.error('Login dulu')
    showModal.value = false
    navigateTo('/auth/login')
    return false
  }
  return true
}

// Form Submission
async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Check authentication first
  if (!checkUserAuth()) return

  isSubmitting.value = true

  try {
    const marketId = crypto.randomUUID()
    let attachmentsData = {}

    // Upload image if file selected
    if (event.data.imageFile) {
      const result = await uploadFile(event.data.imageFile, {
        bucket: STORAGE_BUCKET,
        folder: 'markets',
        maxSizeMB: 5,
        allowedTypes: ['image/*']
      })
      
      attachmentsData = {
        url_image: result.path
      }
    }

    // Prepare links JSONB data
    const linksData = {
      shopee_link: event.data.shopee_link?.trim() || null,
      tiktok_link: event.data.tiktok_link?.trim() || null,
      tokopedia_link: event.data.tokopedia_link?.trim() || null
    }

    // Prepare payload for insert
    const payload = {
      id: marketId,
      name: event.data.name.trim(),
      description: event.data.description.trim(),
      price: event.data.price ? Number(event.data.price) : null,
      price_range: event.data.price_range?.trim() || null,
      attachments: Object.keys(attachmentsData).length > 0 ? attachmentsData : null,
      links: linksData,
      category: event.data.category,
      seller: event.data.seller.trim(),
      contact_seller: event.data.contact_seller.trim(),
      user_id: userData.value.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Insert new record
    const { error } = await supabase
      .from('markets')
      .insert(payload)

    if (error) throw error

    toastStore.success('Produk baru berhasil ditambahkan!')
    showModal.value = false

  } catch (error: any) {
    console.error('Error saving market item:', error)
    toastStore.error(`Gagal menyimpan produk: ${error.message}`)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = (): void => {
  showModal.value = false
}

// Initialize component
onMounted(async () => {
  await fetchUserData()
})
</script>

<template>
  <UModal
    v-model:open="showModal"
    title="Tambah Produk Baru"
    description="Isi formulir di bawah untuk menambahkan produk baru"
  >
    <template #body>
      <UForm id="product-form" :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
        <!-- Nama Produk -->
        <UFormField label="Nama Produk" name="name" required>
          <UInput
            v-model="state.name"
            placeholder="Masukkan nama produk"
            size="lg"
            icon="i-lucide-tag"
            class="w-full"
          />
        </UFormField>

        <!-- Deskripsi Produk -->
        <UFormField label="Deskripsi Produk" name="description" required>
          <UTextarea
            v-model="state.description"
            placeholder="Masukkan deskripsi produk"
            :rows="5"
            size="lg"
            icon="i-lucide-file-text"
            class="w-full"
            autoresize
          />
        </UFormField>

        <!-- Kategori -->
        <UFormField label="Kategori" name="category" required>
          <USelect
            v-model="state.category"
            :items="categoryItems"
            placeholder="Pilih kategori"
            size="lg"
            icon="i-lucide-tags"
            class="w-full"
          />
        </UFormField>

        <!-- Harga dan Rentang Harga -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="Harga (Rp)" name="price">
            <UInput
              v-model="state.price"
              type="number"
              placeholder="Masukkan harga produk"
              size="lg"
              icon="i-lucide-currency-dollar"
            >
              <template #leading>
                <span class="text-gray-500 font-medium">Rp</span>
              </template>
            </UInput>
          </UFormField>

          <UFormField label="Rentang Harga" name="price_range">
            <UInput
              v-model="state.price_range"
              placeholder="Contoh: 50.000 - 75.000"
              size="lg"
              icon="i-lucide-scale-3d"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Image Upload -->
        <UFormField 
          label="Gambar Produk" 
          name="imageFile"
          description="Format: JPG, PNG, GIF. Maksimal 5MB"
        >
          <UFileUpload
            v-model="state.imageFile"
            accept="image/*"
            class="min-h-48 w-full"
          />
        </UFormField>

        <!-- Links -->
        <UFormField label="Link Marketplace">
          <div class="space-y-3">
            <!-- Shopee Link -->
            <UFormField label="Shopee" name="shopee_link">
              <UInput
                v-model="state.shopee_link"
                placeholder="https://shopee.co.id/product..."
                size="lg"
                icon="i-lucide-link"
                class="w-full"
              />
            </UFormField>
            
            <!-- TikTok Link -->
            <UFormField label="TikTok Shop" name="tiktok_link">
              <UInput
                v-model="state.tiktok_link"
                placeholder="https://tiktok.com/shop/product..."
                size="lg"
                icon="i-lucide-link"
                class="w-full"
              />
            </UFormField>
            
            <!-- Tokopedia Link -->
            <UFormField label="Tokopedia" name="tokopedia_link">
              <UInput
                v-model="state.tokopedia_link"
                placeholder="https://tokopedia.com/product..."
                size="lg"
                icon="i-lucide-link"
                class="w-full"
              />
            </UFormField>
          </div>
        </UFormField>

        <!-- Seller Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="Nama Toko/Seller" name="seller" required>
            <UInput
              v-model="state.seller"
              placeholder="Masukkan nama toko"
              size="lg"
              icon="i-lucide-store"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Kontak Seller (WhatsApp)" name="contact_seller" required>
            <UInput
              v-model="state.contact_seller"
              placeholder="Contoh: 08123456789"
              size="lg"
              icon="i-lucide-phone"
              class="w-full"
            />
          </UFormField>
        </div>
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
          form="product-form"
        >
          <UIcon name="i-heroicons-check" class="mr-1" />
          Simpan Produk
        </UButton>
      </div>
    </template>
  </UModal>
</template>