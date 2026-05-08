/**
 * Shared TypeScript interfaces for JuruTani data structures
 * Used across all pages for type safety and consistency
 */

// ============ HERO SECTION ============
export interface HeroSection {
  title: string
  subtitle: string
  badge?: {
    text: string
    icon?: string
  }
  cta?: {
    text: string
    link?: string
    action?: () => void
  }
}

// ============ FEATURE CARDS ============
export interface IconCard {
  icon: string
  title: string
  description: string
  link?: string
  color?: string
}

export interface FeatureCard {
  icon: string
  title: string
  description: string
  badge?: string
  link?: string
}

// ============ GALLERY ============
export interface GalleryItem {
  src: string
  title: string
  description: string
  alt?: string
}

// ============ FAQ SYSTEM ============
export interface FaqItem {
  question: string
  answer: string
}

export interface FaqCategory {
  id: string
  name: string
  icon: string
}

export interface FaqData {
  [categoryId: string]: FaqItem[]
}

// ============ CONTACT ============
export interface ContactInfo {
  icon: string
  title: string
  description: string
  value: string
  link?: string
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

// ============ LEGAL PAGES ============
export interface LegalSection {
  id: string
  title: string
  icon: string
  content: string | string[]
  type?: 'text' | 'list' | 'nested'
}

export interface LegalPageData {
  pageType: 'privacy' | 'terms' | 'cookies'
  icon: string
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

// ============ TEAM & ORGANIZATION ============
export interface TeamCategory {
  icon: string
  title: string
  items: string[]
}

export interface InstitutionHighlight {
  icon: string
  title: string
  description: string
}

// ============ SECTION HEADERS ============
export interface SectionHeaderProps {
  title: string
  subtitle?: string
  badge?: {
    text: string
    icon?: string
  }
  align?: 'left' | 'center' | 'right'
}
