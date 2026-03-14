/**
 * Composables for Product Market form handling
 * Handles file uploads, validation, and form state management
 */

import type { MarketAttachment, MarketLink } from '~/types/market'
import type { JSONContent } from '@tiptap/vue-3'
import {
  uploadProductMarketFile,
  uploadProductMarketAttachment,
  validateFileSize,
  validateFileType
} from '~/utils/storage'

export const PRODUCT_MARKETS_CONSTANTS = {
  MAX_THUMBNAIL_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_GALLERY_IMAGES: 10,
  MAX_GALLERY_SIZE: 5 * 1024 * 1024, // 5MB per image
  MAX_ATTACHMENTS: 5,
  MAX_ATTACHMENT_SIZE: 10 * 1024 * 1024, // 10MB per attachment
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_ATTACHMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
} as const

export function useProductMarketForm() {
  const { supabase } = useSupabase()
  const toast = useToast()

  /**
   * Upload cover/thumbnail image
   */
  async function uploadThumbnail(file: File, slug: string): Promise<string> {
    return await uploadProductMarketFile('thumbnails', slug, file)
  }

  /**
   * Upload gallery images
   */
  async function uploadGalleryImages(files: File[], slug: string): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
      return await uploadProductMarketFile('gallery', `${slug}-${index}`, file)
    })

    return await Promise.all(uploadPromises)
  }

  /**
   * Upload attachments
   */
  async function uploadAttachments(files: File[], slug: string): Promise<MarketAttachment[]> {
    const uploadPromises = files.map(async (file) => {
      return await uploadProductMarketAttachment(slug, file)
    })

    return await Promise.all(uploadPromises)
  }

  /**
   * Create image preview URL
   */
  async function createImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Create multiple image previews
   */
  async function createImagePreviews(files: File[]): Promise<string[]> {
    return Promise.all(files.map(file => createImagePreview(file)))
  }

  /**
   * Validate image file
   */
  function validateImageFile(file: File): boolean {
    if (!validateFileType(file, PRODUCT_MARKETS_CONSTANTS.ALLOWED_IMAGE_TYPES)) {
      toast.add({
        title: 'Format tidak valid',
        description: 'File harus berupa JPG, PNG, atau WebP',
        color: 'error'
      })
      return false
    }

    if (!validateFileSize(file, PRODUCT_MARKETS_CONSTANTS.MAX_THUMBNAIL_SIZE / 1024 / 1024)) {
      toast.add({
        title: 'Ukuran terlalu besar',
        description: 'Maksimal ukuran file 5MB',
        color: 'error'
      })
      return false
    }

    return true
  }

  /**
   * Validate attachment file
   */
  function validateAttachmentFile(file: File): boolean {
    if (!validateFileType(file, PRODUCT_MARKETS_CONSTANTS.ALLOWED_ATTACHMENT_TYPES)) {
      toast.add({
        title: 'Format tidak valid',
        description: 'File harus berupa PDF, DOC, DOCX, XLS, atau XLSX',
        color: 'error'
      })
      return false
    }

    if (!validateFileSize(file, PRODUCT_MARKETS_CONSTANTS.MAX_ATTACHMENT_SIZE / 1024 / 1024)) {
      toast.add({
        title: 'Ukuran terlalu besar',
        description: 'Maksimal ukuran file 10MB',
        color: 'error'
      })
      return false
    }

    return true
  }

  /**
   * Generate unique slug from name
   */
  function generateUniqueSlug(name: string): string {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    return `${baseSlug}-${Date.now()}`
  }

  return {
    uploadThumbnail,
    uploadGalleryImages,
    uploadAttachments,
    createImagePreview,
    createImagePreviews,
    validateImageFile,
    validateAttachmentFile,
    generateUniqueSlug
  }
}
