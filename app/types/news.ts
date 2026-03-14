/**
 * News-related type definitions
 * Used by news_updated pages and components
 */

import type { JSONContent } from '@tiptap/vue-3'

// Types for news_updated table with multi-image and rich content
export interface NewsAttachment {
    name: string
    url: string
    size?: number
    type?: string
}

export interface NewsUpdated {
    id: string
    title: string
    sub_title?: string
    content: JSONContent
    category: string
    link?: string
    status_news: 'pending' | 'approved' | 'rejected'
    created_at: string
    updated_at: string
    published_at?: string
    deleted_at?: string
    user_id?: string
    cover_image?: string
    images: string[]
    attachments: NewsAttachment[]
    slug: string
}

export interface NewsUpdatedFormState {
    title: string
    sub_title?: string
    content: JSONContent
    category: string
    link?: string
    coverImageFile?: File
    galleryFiles: File[]
    attachmentFiles: File[]
}

export interface NewsUpdatedDisplay extends NewsUpdated {
    author?: {
        id: string
        name?: string
        avatar_url?: string
    }
}
