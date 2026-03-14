/**
 * Utility functions for Product Markets
 */

import type { MarketAttachment } from '~/types/market'
import type { JSONContent } from '@tiptap/vue-3'

/**
 * Get image URL from storage
 */
export function getImagePathUrl(imagePath: string | null): string {
  if (!imagePath) return '/placeholder.png'
  if (imagePath.startsWith('http')) return imagePath

  const { supabase } = useSupabase()
  const { data } = supabase.storage
    .from('product-markets-images')
    .getPublicUrl(imagePath)

  return data?.publicUrl || '/placeholder.png'
}

/**
 * Get market public URL (alias for getImagePathUrl, for admin compatibility)
 */
export function getMarketPublicUrl(imagePath: string | null): string {
  return getImagePathUrl(imagePath)
}

/**
 * Get attachment URL
 */
export function getAttachmentUrl(attachmentPath: string): string {
  if (attachmentPath.startsWith('http')) return attachmentPath

  const { supabase } = useSupabase()
  const { data } = supabase.storage
    .from('product-markets-attachments')
    .getPublicUrl(attachmentPath)

  return data?.publicUrl || '#'
}

/**
 * Extract plain text excerpt from JSONContent
 */
export function getExcerpt(content: JSONContent | null, maxLength: number = 160): string {
  if (!content) return ''

  let text = ''
  function extractText(node: any) {
    if (node.text) text += node.text
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach((child: any) => extractText(child))
    }
  }
  extractText(content)

  text = text.trim()
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get file icon based on file type
 */
export function getFileIcon(fileType: string): string {
  const iconMap: Record<string, string> = {
    'application/pdf': 'i-lucide-file-text',
    'application/msword': 'i-lucide-file-text',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'i-lucide-file-text',
    'application/vnd.ms-excel': 'i-lucide-file-spreadsheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'i-lucide-file-spreadsheet',
    'image/jpeg': 'i-lucide-image',
    'image/png': 'i-lucide-image',
    'image/webp': 'i-lucide-image'
  }

  return iconMap[fileType] || 'i-lucide-file'
}

/**
 * Download attachment
 */
export async function downloadAttachment(attachment: MarketAttachment) {
  try {
    const link = document.createElement('a')
    link.href = attachment.url
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading attachment:', error)
  }
}

/**
 * Get status badge configuration
 */
export function getStatusBadge(status: string) {
  const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    'approved': {
      label: 'Disetujui',
      color: 'success',
      icon: 'i-lucide-check-circle'
    },
    'pending': {
      label: 'Menunggu',
      color: 'warning',
      icon: 'i-lucide-clock'
    },
    'rejected': {
      label: 'Ditolak',
      color: 'error',
      icon: 'i-lucide-x-circle'
    },
    'draft': {
      label: 'Draft',
      color: 'neutral',
      icon: 'i-lucide-file'
    }
  }

  return statusConfig[status] || {
    label: status,
    color: 'neutral',
    icon: 'i-lucide-circle'
  }
}

/**
 * Format price to IDR currency
 */
export function formatPrice(price: number | null): string {
  if (!price) return 'Harga tidak tersedia'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

/**
 * Get category badge class
 */
export function getCategoryBadgeClass(category: string): string {
  const baseClass = 'text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border'

  const categoryClasses: Record<string, string> = {
    'Hasil Pertanian': `${baseClass} bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800`,
    'Alat Pertanian': `${baseClass} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800`,
    'Pupuk': `${baseClass} bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800`,
    'Bibit': `${baseClass} bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800`
  }

  return categoryClasses[category] || `${baseClass} bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700`
}
