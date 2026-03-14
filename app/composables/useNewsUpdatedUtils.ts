/**
 * Utilities for news_updated (bukan untuk news lama)
 * Composable untuk handle news_updated operations
 */

import type { JSONContent } from '@tiptap/vue-3'
import type { NewsUpdated } from '~/types/news'
import { Enum } from '~/utils/enum'

/**
 * Format file size to human readable (standalone utility)
 */
export function formatFileSize(bytes: number): string {
    if (!bytes || bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function useNewsUpdatedUtils() {
    const { supabase } = useSupabase()

    /**
     * Get public URL for image from news-images bucket
     */
    function getImageUrl(news: NewsUpdated, bucket: 'news-images' | 'news-attachments' = 'news-images'): string {
        // Priority: cover_image, then first image from gallery, then placeholder
        const imagePath = news.cover_image || (news.images && news.images.length > 0 ? news.images[0] : null)

        if (!imagePath) return '/placeholder.png'

        if (imagePath.startsWith('http')) {
            return imagePath
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(imagePath)

        return data.publicUrl || '/placeholder.png'
    }

    /**
     * Get public URL for any image path
     */
    function getImagePathUrl(path: string, bucket: 'news-images' | 'news-attachments' = 'news-images'): string {
        if (!path) return '/placeholder.png'

        if (path.startsWith('http')) {
            return path
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path)

        return data.publicUrl || '/placeholder.png'
    }

    /**
     * Get public URL for attachment
     */
    function getAttachmentUrl(path: string): string {
        if (!path) return ''

        if (path.startsWith('http')) {
            return path
        }

        const { data } = supabase.storage
            .from('news-attachments')
            .getPublicUrl(path)

        return data.publicUrl || ''
    }

    /**
     * Extract plain text excerpt from TipTap JSONContent
     */
    function getExcerpt(content: JSONContent | string, maxLength: number = 150): string {
        if (!content) return ''

        // If content is string (old markdown), return it directly
        if (typeof content === 'string') {
            const text = content.replace(/[#*_\-\[\]]/g, '').trim()
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
        }

        // If content is JSONContent (TipTap)
        if (typeof content === 'object' && 'content' in content) {
            let text = ''

            function extractText(node: any) {
                if (node.text) {
                    text += node.text
                }
                if (node.content && Array.isArray(node.content)) {
                    node.content.forEach((child: any) => extractText(child))
                }
            }

            extractText(content)

            text = text.trim()
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
        }

        return ''
    }

    /**
     * Format date to Indonesian locale
     */
    function formatDate(dateString: string, locale: string = 'id-ID'): string {
        try {
            const date = new Date(dateString)
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date)
        } catch (error) {
            console.error('Error formatting date:', error)
            return dateString
        }
    }

    /**
     * Format date with time
     */
    function formatDateTime(dateString: string, locale: string = 'id-ID'): string {
        try {
            const date = new Date(dateString)
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date)
        } catch (error) {
            console.error('Error formatting date time:', error)
            return dateString
        }
    }

    /**
     * Get status badge configuration from enum
     */
    function getStatusBadge(status: string) {
        const statusConfig = Enum.newsStatus.find(s => s.value === status)
        return statusConfig || {
            value: status,
            label: status,
            icon: 'i-lucide-circle',
            color: 'default'
        }
    }

    /**
     * Get file icon based on mime type
     */
    function getFileIcon(type: string): string {
        if (!type) return 'i-lucide-file'

        if (type.includes('pdf')) return 'i-lucide-file-text'
        if (type.includes('word') || type.includes('document')) return 'i-lucide-file-text'
        if (type.includes('excel') || type.includes('sheet')) return 'i-lucide-table'
        if (type.includes('image')) return 'i-lucide-file-image'
        if (type.includes('video')) return 'i-lucide-file-video'
        if (type.includes('audio')) return 'i-lucide-file-audio'
        if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) return 'i-lucide-file-archive'

        return 'i-lucide-file'
    }

    /**
     * Generate slug from title
     */
    function generateSlug(title: string): string {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    /**
     * Download attachment helper
     */
    function downloadAttachment(attachment: { url: string; name: string }) {
        const url = getAttachmentUrl(attachment.url)
        if (url) {
            const link = document.createElement('a')
            link.href = url
            link.download = attachment.name
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    return {
        getImageUrl,
        getImagePathUrl,
        getAttachmentUrl,
        getExcerpt,
        formatDate,
        formatDateTime,
        formatFileSize,
        getStatusBadge,
        getFileIcon,
        generateSlug,
        downloadAttachment
    }
}
