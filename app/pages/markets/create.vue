<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import type { EditorSuggestionMenuItem } from '@nuxt/ui'
import type { JSONContent } from '@tiptap/vue-3'
import { formatFileSize } from '~/utils/storage'
import { PRODUCT_MARKETS_CONSTANTS } from '~/composables/useProductMarketForm'
import { Enum } from '~/utils/enum'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Jual Produk Pertanian',
  description: 'Jual produk pertanian Anda di Pasar Tani JuruTani'
})

const { supabase } = useSupabase()
const router = useRouter()
const toast = useToast()

// Pre-generate ID untuk storage paths
const productId = crypto.randomUUID()

const {
  uploadThumbnail,
  uploadGalleryImages,
  uploadAttachments,
  createImagePreview,
  createImagePreviews,
  validateImageFile,
  validateAttachmentFile,
  generateUniqueSlug
} = useProductMarketForm()

// Fetch categories
const { data: categories } = await useAsyncData('category_markets_create', async () => {
  const { data, error } = await supabase
    .from('category_markets')
    .select('name, value')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data
})

const categoryItems = computed(() => {
  if (!categories.value) return []
  return categories.value.map((cat: any) => ({
    label: cat.name,
    value: cat.value
  }))
})

// Price unit options from Enum
const priceUnitItems = Enum.PriceUnits

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi').max(200, 'Nama produk maksimal 200 karakter'),
  excerpt: z.string().max(300, 'Ringkasan maksimal 300 karakter').optional(),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  slug: z.string().optional(),
  seller: z.string().min(1, 'Nama penjual wajib diisi'),
  contact_seller: z.string().min(10, 'Nomor WhatsApp minimal 10 digit').optional(),
  // price mode: 'fixed' | 'range'
  price_mode: z.enum(['fixed', 'range']),
  price: z.number({ invalid_type_error: 'Harga harus berupa angka' }).min(0).optional().nullable(),
  price_unit: z.string().optional(),
  price_range: z.string().max(100, 'Jangkauan harga maksimal 100 karakter').optional()
})

type Schema = z.output<typeof schema>

// ─── Form state ───────────────────────────────────────────────────────────────
const form = reactive<Partial<Schema>>({
  name: '',
  excerpt: '',
  category: '',
  slug: '',
  seller: '',
  contact_seller: '',
  price_mode: 'fixed',
  price: null,
  price_unit: '',
  price_range: ''
})

const content = ref<JSONContent>({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: []
    }
  ]
})

const saving = ref(false)
const uploading = ref(false)

// ─── Links ────────────────────────────────────────────────────────────────────
type LinkItem = { shopee_link?: string; tokopedia_link?: string; tiktok_link?: string }
const links = ref<LinkItem[]>([])

function addLink() {
  links.value.push({ shopee_link: '', tokopedia_link: '', tiktok_link: '' })
}

function removeLink(idx: number) {
  links.value.splice(idx, 1)
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────
const thumbnailFile = ref<File | null>(null)
const thumbnailPreview = ref<string | null>(null)

watch(thumbnailFile, async (file) => {
  if (!file) {
    thumbnailPreview.value = null
    return
  }
  
  if (!validateImageFile(file)) {
    thumbnailFile.value = null
    return
  }
  
  try {
    thumbnailPreview.value = await createImagePreview(file)
  } catch (error) {
    console.error('Error creating preview:', error)
    toast.add({ title: 'Gagal membuat preview gambar', color: 'error' })
  }
})

function removeThumbnail() {
  thumbnailFile.value = null
  thumbnailPreview.value = null
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
const galleryFiles = ref<File[]>([])
const galleryPreviews = ref<string[]>([])
const newGalleryInput = ref<File[]>([])

function addGalleryFiles(files: File | File[] | null) {
  const list = Array.isArray(files) ? files : files ? [files] : []
  const valid = list.filter(f => {
    if (!PRODUCT_MARKETS_CONSTANTS.ALLOWED_IMAGE_TYPES.some(type => f.type.includes(type))) {
      toast.add({ title: `File ${f.name} bukan format gambar (JPG/PNG/WebP)`, color: 'error' })
      return false
    }
    if (f.size > PRODUCT_MARKETS_CONSTANTS.MAX_GALLERY_SIZE) {
      toast.add({ title: `File ${f.name} melebihi 5MB`, color: 'error' })
      return false
    }
    return true
  })
  
  if (valid.length < list.length) {
    toast.add({ title: 'Beberapa file diabaikan (format salah atau ukuran > 5MB)', color: 'warning' })
  }
  
  if (galleryFiles.value.length + valid.length > PRODUCT_MARKETS_CONSTANTS.MAX_GALLERY_IMAGES) {
    toast.add({ title: `Maksimal ${PRODUCT_MARKETS_CONSTANTS.MAX_GALLERY_IMAGES} gambar galeri`, color: 'error' })
    const remaining = PRODUCT_MARKETS_CONSTANTS.MAX_GALLERY_IMAGES - galleryFiles.value.length
    valid.splice(remaining)
  }
  
  galleryFiles.value.push(...valid)
  
  // Create previews
  createImagePreviews(valid).then(previews => {
    galleryPreviews.value.push(...previews)
  })
}

function removeGallery(idx: number) {
  galleryFiles.value.splice(idx, 1)
  galleryPreviews.value.splice(idx, 1)
}

watch(newGalleryInput, (files) => {
  if (!files || files.length === 0) return
  addGalleryFiles(files)
  newGalleryInput.value = []
})

// ─── Attachments ─────────────────────────────────────────────────────────────
const attachmentFiles = ref<File[]>([])
const newAttachmentInput = ref<File[]>([])

watch(newAttachmentInput, (files) => {
  if (!files || files.length === 0) return
  
  const valid = files.filter(f => {
    if (!PRODUCT_MARKETS_CONSTANTS.ALLOWED_ATTACHMENT_TYPES.some(type => f.type.includes(type))) {
      toast.add({ title: `File ${f.name} bukan format yang didukung (PDF/DOC/XLS)`, color: 'error' })
      return false
    }
    if (f.size > PRODUCT_MARKETS_CONSTANTS.MAX_ATTACHMENT_SIZE) {
      toast.add({ title: `File ${f.name} melebihi 10MB`, color: 'error' })
      return false
    }
    return true
  })
  
  if (valid.length < files.length) {
    toast.add({ title: 'Beberapa file diabaikan (format salah atau ukuran > 10MB)', color: 'warning' })
  }
  
  if (attachmentFiles.value.length + valid.length > PRODUCT_MARKETS_CONSTANTS.MAX_ATTACHMENTS) {
    toast.add({ title: `Maksimal ${PRODUCT_MARKETS_CONSTANTS.MAX_ATTACHMENTS} lampiran`, color: 'error' })
    const remaining = PRODUCT_MARKETS_CONSTANTS.MAX_ATTACHMENTS - attachmentFiles.value.length
    valid.splice(remaining)
  }
  
  attachmentFiles.value.push(...valid)
  newAttachmentInput.value = []
})

function removeAttachment(idx: number) {
  attachmentFiles.value.splice(idx, 1)
}

// ─── Auto-slug ────────────────────────────────────────────────────────────────
const slugEdited = ref<boolean>(false)

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function onNameInput() {
  if (!slugEdited.value && form.name) {
    form.slug = slugify(form.name)
  }
}

// ─── Slash command suggestions ──────────────────────────────────────────────
const suggestionItems: EditorSuggestionMenuItem[][] = [
  [
    { type: 'label', label: 'Text' },
    { kind: 'paragraph', label: 'Paragraph', description: 'Teks paragraf biasa', icon: 'i-lucide-text' },
    { kind: 'heading', level: 1, label: 'Heading 1', description: 'Judul besar', icon: 'i-lucide-heading-1' },
    { kind: 'heading', level: 2, label: 'Heading 2', description: 'Judul sedang', icon: 'i-lucide-heading-2' },
    { kind: 'heading', level: 3, label: 'Heading 3', description: 'Judul kecil', icon: 'i-lucide-heading-3' }
  ],
  [
    { type: 'label', label: 'Lists' },
    { kind: 'bulletList', label: 'Bullet List', description: 'Daftar dengan bullet', icon: 'i-lucide-list' },
    { kind: 'orderedList', label: 'Numbered List', description: 'Daftar dengan nomor', icon: 'i-lucide-list-ordered' }
  ],
  [
    { type: 'label', label: 'Insert' },
    { kind: 'blockquote', label: 'Blockquote', description: 'Kutipan teks', icon: 'i-lucide-text-quote' },
    { kind: 'horizontalRule', label: 'Divider', description: 'Garis pemisah', icon: 'i-lucide-separator-horizontal' },
    { kind: 'image', label: 'Image', description: 'Insert gambar', icon: 'i-lucide-image' }
  ]
]

// ─── Submit ───────────────────────────────────────────────────────────────────
async function onSubmit(event: FormSubmitEvent<Schema>) {
  saving.value = true
  uploading.value = true
  
  try {
    // Validate required fields
    if (!event.data.name || !event.data.category || !event.data.seller) {
      toast.add({ title: 'Nama produk, kategori, dan nama penjual wajib diisi', color: 'error' })
      saving.value = false
      uploading.value = false
      return
    }

    // Generate slug
    const slug = event.data.slug?.trim() || generateUniqueSlug(event.data.name)

    // Upload files
    const [thumbnailPath, galleryPaths, attachmentsData] = await Promise.all([
      thumbnailFile.value ? uploadThumbnail(thumbnailFile.value, slug) : Promise.resolve(null),
      galleryFiles.value.length > 0 ? uploadGalleryImages(galleryFiles.value, slug) : Promise.resolve([]),
      attachmentFiles.value.length > 0 ? uploadAttachments(attachmentFiles.value, slug) : Promise.resolve([])
    ])
    
    uploading.value = false

    // Filter empty links
    const validLinks = links.value.filter(l => 
      l.shopee_link || l.tokopedia_link || l.tiktok_link
    )

    // Prepare payload
    const payload: any = {
      id: productId,
      name: event.data.name.trim(),
      excerpt: event.data.excerpt?.trim() || null,
      content: content.value,
      category: event.data.category,
      slug: slug,
      seller: event.data.seller.trim(),
      contact_seller: event.data.contact_seller?.trim() || null,
      status: 'pending',
      thumbnail_url: thumbnailPath,
      images: galleryPaths,
      attachments: attachmentsData,
      links: validLinks,
      user_id: null, // Will be set by RLS or trigger
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Add price fields based on mode
    if (event.data.price_mode === 'fixed') {
      payload.price = event.data.price ?? null
      payload.price_unit = event.data.price_unit || null
      payload.price_range = null
    } else {
      payload.price = null
      payload.price_unit = null
      payload.price_range = event.data.price_range?.trim() || null
    }

    // Insert to database
    const { error: insertError } = await supabase
      .from('product_markets')
      .insert(payload)
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      throw insertError
    }

    toast.add({ title: 'Produk berhasil dibuat! Menunggu persetujuan admin.', color: 'success' })
    router.push(`/markets/${slug}`)
  } catch (error: any) {
    console.error('Error creating product:', error)
    toast.add({ title: 'Gagal membuat produk: ' + (error.message || 'Silakan coba lagi.'), color: 'error' })
  } finally {
    saving.value = false
    uploading.value = false
  }
}
</script>

<template>
  <main class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold mb-2">Jual Produk Pertanian</h1>
          <p class="text-gray-600 dark:text-gray-400">Tawarkan produk pertanian Anda kepada ribuan petani lainnya</p>
        </div>
        <UButton
          to="/markets"
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-left"
        >
          Kembali
        </UButton>
      </div>

      <UAlert
        icon="i-lucide-info"
        color="primary"
        variant="soft"
        title="Informasi Penjualan"
        description="Produk yang Anda buat akan berstatus 'Pending' dan menunggu persetujuan dari admin sebelum ditampilkan di Pasar Tani."
      />
    </div>

    <!-- Form -->
    <UForm :schema="schema" :state="form" class="space-y-6" @submit="onSubmit">
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- ── Main column ──────────────────────────────────────────── -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Product info -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-package" class="w-5 h-5" />
                <h2 class="text-xl font-semibold">Informasi Produk</h2>
              </div>
            </template>

            <div class="space-y-4">
              <UFormField name="name" label="Nama Produk *" required>
                <UInput
                  v-model="form.name"
                  placeholder="Masukkan nama produk..."
                  class="w-full"
                  @input="onNameInput"
                />
              </UFormField>

              <UFormField name="excerpt" label="Ringkasan" hint="Deskripsi singkat produk (opsional)">
                <UInput
                  v-model="form.excerpt"
                  placeholder="Deskripsi singkat produk..."
                  class="w-full"
                />
              </UFormField>

              <UFormField name="slug" label="Slug URL">
                <UInput
                  v-model="form.slug"
                  placeholder="slug-produk"
                  class="w-full font-mono text-sm"
                  @input="() => { slugEdited = true }"
                />
                <template #hint>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    /markets/<span class="text-emerald-600 dark:text-emerald-400">{{ form.slug || 'slug-produk' }}</span>
                  </span>
                </template>
              </UFormField>
            </div>
          </UCard>

          <!-- Rich content -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-file-edit" class="w-5 h-5" />
                  <h2 class="text-xl font-semibold">Deskripsi Produk</h2>
                </div>
                <UBadge color="primary" variant="soft">
                  <UIcon name="i-lucide-zap" class="w-3 h-3" />
                  Ketik / untuk perintah cepat
                </UBadge>
              </div>
            </template>

            <UFormField name="content" required>
              <UEditor
                v-slot="{ editor }"
                v-model="content"
                content-type="json"
                placeholder="Tulis deskripsi produk secara lengkap..."
                class="min-h-125 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <UEditorSuggestionMenu
                  :editor="editor"
                  :items="suggestionItems"
                />
              </UEditor>
            </UFormField>
          </UCard>

          <!-- Seller info -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-user" class="w-5 h-5" />
                <h2 class="text-xl font-semibold">Informasi Penjual</h2>
              </div>
            </template>

            <div class="grid sm:grid-cols-2 gap-4">
              <UFormField name="seller" label="Nama Penjual / Toko *" required>
                <UInput
                  v-model="form.seller"
                  placeholder="Nama toko atau penjual..."
                  class="w-full"
                />
              </UFormField>

              <UFormField name="contact_seller" label="Kontak Penjual" hint="Format: 628xxxxxxxxxx">
                <UInput
                  v-model="form.contact_seller"
                  placeholder="No. HP / WhatsApp..."
                  class="w-full"
                />
              </UFormField>
            </div>
          </UCard>

          <!-- Price -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-indonesian-rupiah-sign" class="w-5 h-5" />
                <h2 class="text-xl font-semibold">Harga</h2>
              </div>
            </template>

            <div class="space-y-4">
              <!-- Price mode toggle -->
              <div class="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-fit">
                <button
                  type="button"
                  class="px-4 py-1.5 text-sm transition-colors"
                  :class="form.price_mode === 'fixed'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
                  @click="form.price_mode = 'fixed'"
                >
                  Harga Tetap
                </button>
                <button
                  type="button"
                  class="px-4 py-1.5 text-sm transition-colors"
                  :class="form.price_mode === 'range'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
                  @click="form.price_mode = 'range'"
                >
                  Range Harga
                </button>
              </div>

              <div v-if="form.price_mode === 'fixed'" class="grid sm:grid-cols-2 gap-4">
                <UFormField name="price" label="Harga (Rp)">
                  <UInput
                    v-model.number="form.price"
                    type="number"
                    placeholder="0"
                    class="w-full"
                  />
                </UFormField>
                <UFormField name="price_unit" label="Satuan">
                  <USelect
                    v-model="form.price_unit"
                    :items="priceUnitItems"
                    placeholder="Pilih satuan..."
                    class="w-full"
                  />
                </UFormField>
              </div>

              <div v-if="form.price_mode === 'range'">
                <UFormField name="price_range" label="Range Harga">
                  <UInput
                    v-model="form.price_range"
                    placeholder="Contoh: Rp 5.000 – Rp 10.000 / kg"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </div>
          </UCard>

          <!-- Links -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-link" class="w-5 h-5" />
                  <h2 class="text-xl font-semibold">Link Marketplace</h2>
                </div>
                <UButton
                  type="button"
                  icon="i-lucide-plus"
                  color="neutral"
                  variant="outline"
                  size="sm"
                  @click="addLink"
                >
                  Tambah Link
                </UButton>
              </div>
            </template>

            <div class="space-y-3">
              <div
                v-for="(link, idx) in links"
                :key="idx"
                class="flex items-center gap-2"
              >
                <UInput
                  v-model="link.shopee_link"
                  placeholder="Link Shopee"
                  class="w-full"
                />
                <UInput
                  v-model="link.tokopedia_link"
                  placeholder="Link Tokopedia"
                  class="w-full"
                />
                <UInput
                  v-model="link.tiktok_link"
                  placeholder="Link TikTok"
                  class="w-full"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  size="sm"
                  @click="removeLink(idx)"
                />
              </div>
              
              <p v-if="links.length === 0" class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Belum ada link marketplace. Klik "Tambah Link" untuk menambahkan.
              </p>
            </div>
          </UCard>
        </div>

        <!-- ── Sidebar ──────────────────────────────────────────────── -->
        <div class="space-y-6">
          <!-- Publish settings -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-settings" class="w-5 h-5" />
                <h2 class="text-xl font-semibold">Pengaturan Publikasi</h2>
              </div>
            </template>

            <div class="space-y-4">
              <UFormField name="category" label="Kategori *" required>
                <USelect
                  v-model="form.category"
                  :items="categoryItems"
                  placeholder="Pilih kategori..."
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="mt-6">
              <UButton
                type="submit"
                class="w-full"
                size="lg"
                :loading="saving"
              >
                <UIcon name="i-lucide-send" class="w-4 h-4 mr-2" />
                {{ saving ? (uploading ? 'Mengunggah...' : 'Menyimpan...') : 'Jual Produk' }}
              </UButton>
            </div>
          </UCard>

          <!-- Thumbnail -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-image" class="w-5 h-5" />
                <h2 class="text-xl font-semibold">Foto Utama (Thumbnail)</h2>
              </div>
            </template>

            <div class="space-y-3">
              <div
                v-if="thumbnailPreview"
                class="relative rounded-lg overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800"
              >
                <img :src="thumbnailPreview" class="w-full h-full object-cover" alt="Thumbnail">
                <UButton
                  icon="i-lucide-x"
                  color="error"
                  variant="solid"
                  size="xs"
                  class="absolute top-2 right-2"
                  @click="removeThumbnail"
                />
              </div>
              
              <UFileUpload
                v-else
                v-model="thumbnailFile"
                accept="image/*"
                class="min-h-32 w-full"
              />
              
              <p class="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, WebP · maksimal 5MB
              </p>
            </div>
          </UCard>

          <!-- Gallery -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-images" class="w-5 h-5" />
                <h2 class="text-xl font-semibold">Galeri Foto</h2>
              </div>
            </template>

            <div class="space-y-3">
              <div
                v-if="galleryPreviews.length > 0"
                class="grid grid-cols-3 gap-2"
              >
                <div
                  v-for="(url, idx) in galleryPreviews"
                  :key="idx"
                  class="relative rounded-md overflow-hidden aspect-square bg-gray-100 dark:bg-gray-800 group"
                >
                  <img :src="url" class="w-full h-full object-cover" alt="">
                  <button
                    type="button"
                    class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    @click="removeGallery(idx)"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              
              <UFileUpload
                v-model="newGalleryInput"
                accept="image/*"
                multiple
                class="min-h-32 w-full"
              />
              
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Multiple · maksimal {{ PRODUCT_MARKETS_CONSTANTS.MAX_GALLERY_IMAGES }} foto · 5MB/foto
              </p>
            </div>
          </UCard>

          <!-- Attachments -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-paperclip" class="w-5 h-5" />
                <h2 class="text-xl font-semibold">Lampiran</h2>
              </div>
            </template>

            <div class="space-y-3">
              <div v-if="attachmentFiles.length > 0" class="space-y-1.5">
                <div
                  v-for="(file, idx) in attachmentFiles"
                  :key="idx"
                  class="flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800"
                >
                  <UIcon name="i-lucide-file-text" class="w-4 h-4 text-gray-500 shrink-0" />
                  <span class="flex-1 truncate text-gray-700 dark:text-gray-300">{{ file.name }}</span>
                  <span class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
                  <UButton
                    icon="i-lucide-x"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    @click="removeAttachment(idx)"
                  />
                </div>
              </div>
              
              <UFileUpload
                v-model="newAttachmentInput"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                multiple
                class="min-h-32 w-full"
              />
              
              <p class="text-xs text-gray-500 dark:text-gray-400">
                PDF, DOC, XLS · maksimal {{ PRODUCT_MARKETS_CONSTANTS.MAX_ATTACHMENTS }} file · 10MB/file
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </UForm>
  </main>
</template>
