/**
 * Form utilities untuk news_updated
 * Handle file uploads, validation, dan submission
 */

import type { NewsAttachment } from '~/types/news'
import { toastStore } from '~/composables/useJuruTaniToast'

export const NEWS_UPDATED_CONSTANTS = {
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_ATTACHMENT_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_GALLERY_IMAGES: 10,
    MAX_ATTACHMENTS: 5,
    STORAGE_BUCKETS: {
        images: 'news-images',
        attachments: 'news-attachments'
    } as const
}

export function useNewsUpdatedForm() {
    const { uploadFile } = useAppFileUpload()
    const { generateSlug } = useNewsUpdatedUtils()

    /**
     * Validate and process image file
     */
    function validateImageFile(file: File, maxSize: number = NEWS_UPDATED_CONSTANTS.MAX_IMAGE_SIZE): boolean {
        if (!file.type.startsWith('image/')) {
            toastStore.error(`File ${file.name} bukan gambar`)
            return false
        }
        if (file.size > maxSize) {
            toastStore.error(`Ukuran ${file.name} terlalu besar (maks ${Math.round(maxSize / 1024 / 1024)}MB)`)
            return false
        }
        return true
    }

    /**
     * Upload cover image
     */
    async function uploadCoverImage(file: File, slug: string): Promise<string> {
        try {
            const result = await uploadFile(file, {
                bucket: NEWS_UPDATED_CONSTANTS.STORAGE_BUCKETS.images,
                folder: `covers/${slug}`,
                maxSizeMB: 5,
                allowedTypes: ['image/*']
            })
            return result.path
        } catch (error) {
            console.error('Error uploading cover image:', error)
            throw new Error('Gagal mengupload gambar cover')
        }
    }

    /**
     * Upload gallery images
     */
    async function uploadGalleryImages(files: File[], slug: string): Promise<string[]> {
        const imagePaths: string[] = []

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const result = await uploadFile(file, {
                    bucket: NEWS_UPDATED_CONSTANTS.STORAGE_BUCKETS.images,
                    folder: `gallery/${slug}`,
                    maxSizeMB: 5,
                    allowedTypes: ['image/*']
                })
                imagePaths.push(result.path)
            }
            return imagePaths
        } catch (error) {
            console.error('Error uploading gallery images:', error)
            throw new Error('Gagal mengupload gambar galeri')
        }
    }

    /**
     * Upload attachments
     */
    async function uploadAttachments(files: File[], slug: string): Promise<NewsAttachment[]> {
        const attachments: NewsAttachment[] = []

        try {
            for (const file of files) {
                const result = await uploadFile(file, {
                    bucket: NEWS_UPDATED_CONSTANTS.STORAGE_BUCKETS.attachments,
                    folder: `attachments/${slug}`,
                    maxSizeMB: 10,
                    allowedTypes: [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    ]
                })
                attachments.push({
                    name: file.name,
                    url: result.path,
                    size: file.size,
                    type: file.type
                })
            }
            return attachments
        } catch (error) {
            console.error('Error uploading attachments:', error)
            throw new Error('Gagal mengupload lampiran')
        }
    }

    /**
     * Create preview URL for image file
     */
    function createImagePreview(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                resolve(e.target?.result as string)
            }
            reader.onerror = () => {
                reject(new Error('Gagal membaca file'))
            }
            reader.readAsDataURL(file)
        })
    }

    /**
     * Handle multiple image preview creation
     */
    async function createImagePreviews(files: File[]): Promise<string[]> {
        const previews: string[] = []
        for (const file of files) {
            try {
                const preview = await createImagePreview(file)
                previews.push(preview)
            } catch (error) {
                console.error('Error creating preview:', error)
            }
        }
        return previews
    }

    /**
     * Validate attachment file
     */
    function validateAttachmentFile(file: File): boolean {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]

        if (!allowedTypes.some(type => file.type.includes(type))) {
            toastStore.error(`File ${file.name} bukan format yang didukung (PDF, DOC, DOCX, XLS, XLSX)`)
            return false
        }

        if (file.size > NEWS_UPDATED_CONSTANTS.MAX_ATTACHMENT_SIZE) {
            toastStore.error(`Ukuran ${file.name} terlalu besar (maks 10MB)`)
            return false
        }

        return true
    }

    /**
     * Generate slug from title without numeric suffix
     * e.g. "kota yogyakarta" → "kota-yogyakarta"
     */
    function generateUniqueSlug(title: string): string {
        return generateSlug(title)
    }

    return {
        validateImageFile,
        validateAttachmentFile,
        uploadCoverImage,
        uploadGalleryImages,
        uploadAttachments,
        createImagePreview,
        createImagePreviews,
        generateUniqueSlug
    }
}
