/**
 * Market/Product-related type definitions
 * Used by market pages and components
 */

import type { JSONContent } from '@tiptap/vue-3'

// Legacy Market types (for old markets table)
export interface Market {
    id: string
    title: string
    name: string
    slug: string
    description: string
    price: number
    image_url: string
    category: string
    stock?: number
    unit?: string
    seller_id?: string
    status: string
    price_range?: string
    location?: string
    weight?: string
    size?: string
    attachments?: string
    seller?: string
    contact_seller?: string
    links?: {
        shopee_link?: string
        tokopedia_link?: string
        tiktok_link?: string
    }
    profiles?: {
        full_name?: string
        name?: string
        avatar_url?: string
    }
    created_at: string
    updated_at: string
    deleted_at?: string
    archived_at?: string
}

// New types for product_markets table with rich content
export interface MarketAttachment {
    name: string
    url: string
    size?: number
    type?: string
}

export interface MarketLink {
    shopee_link?: string
    tokopedia_link?: string
    tiktok_link?: string
    other_link?: string
}

export interface ProductMarket {
    id: string
    name: string
    slug: string | null
    excerpt: string | null
    content: JSONContent
    category: string
    price: number | null
    price_range: string | null
    price_unit: string | null
    thumbnail_url: string | null
    images: string[]
    attachments: MarketAttachment[]
    links: MarketLink[]
    seller: string
    contact_seller: string | null
    status: string
    status_depriority: number | null
    published_at: string | null
    user_id: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface ProductMarketFormState {
    name: string
    excerpt?: string
    content: JSONContent
    category: string
    price?: number
    price_range?: string
    price_unit?: string
    thumbnailFile?: File
    galleryFiles: File[]
    attachmentFiles: File[]
    seller: string
    contact_seller?: string
    links: MarketLink[]
}

export interface Product {
    id: string
    title: string
    slug: string
    description: string
    price: number
    image_url: string
    category: string
    stock?: number
    unit?: string
    seller_id?: string
    status: string
    created_at: string
    updated_at: string
    deleted_at?: string
}

export interface ProductFormState {
    title: string
    slug: string
    description: string
    price: number
    image_url: string
    category: string
    stock: number
    unit: string
    status: string
}
