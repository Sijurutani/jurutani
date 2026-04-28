/**
 * Composable untuk menghasilkan JSON-LD Schema
 * Berguna untuk structured data yang meningkatkan SEO dan rich snippets
 */

import siteMeta from '@/site'

/**
 * Generate Organization Schema JSON-LD
 */
export const useOrganizationSchema = () => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${siteMeta.url}/#organization`,
        name: siteMeta.organization.name,
        alternateName: siteMeta.organization.shortName,
        description: siteMeta.organization.description,
        url: siteMeta.organization.url,
        logo: {
            '@type': 'ImageObject',
            url: siteMeta.organization.logo,
            width: 256,
            height: 256,
        },
        image: {
            '@type': 'ImageObject',
            url: siteMeta.organization.image,
            width: 1200,
            height: 630,
        },
        sameAs: siteMeta.organization.sameAs,
        address: {
            '@type': 'PostalAddress',
            addressRegion: siteMeta.organization.address,
            addressCountry: 'ID',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: siteMeta.organization.phone || '+62',
            contactType: 'Customer Service',
            email: siteMeta.organization.email,
            url: siteMeta.organization.url,
        },
        founder: {
            '@type': 'Organization',
            name: 'Politeknik Pembangunan Pertanian',
        },
        foundingDate: siteMeta.organization.foundingDate,
        areaServed: {
            '@type': 'Country',
            name: 'Indonesia',
        },
        knowsAbout: [
            'Penyuluhan Pertanian Digital',
            'Penyuluhan Pertanian',
            'Teknologi Pertanian',
            'Agribisnis',
            'Edukasi Petani',
        ],
        mainEntity: {
            '@type': 'WebSite',
            url: siteMeta.url,
        },
    }

    return schema
}

/**
 * Generate Website Schema JSON-LD
 */
export const useWebsiteSchema = () => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${siteMeta.url}/#website`,
        url: siteMeta.url,
        name: siteMeta.title,
        description: siteMeta.description,
        publisher: {
            '@type': 'Organization',
            '@id': `${siteMeta.url}/#organization`,
            name: siteMeta.organization.name,
        },
        creator: {
            '@type': 'Organization',
            '@id': `${siteMeta.url}/#organization`,
            name: siteMeta.organization.name,
        },
        author: {
            '@type': 'Organization',
            '@id': `${siteMeta.url}/#organization`,
            name: siteMeta.author,
        },
        inLanguage: 'id',
        potentialAction: [
            {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${siteMeta.url}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
            },
        ],
    }

    return schema
}

/**
 * Generate Person/Author Schema JSON-LD
 */
export const usePersonSchema = (options: {
    name?: string
    description?: string
    image?: string
    url?: string
} = {}) => {
    const {
        name = siteMeta.author,
        description = 'Author dan Publisher di ' + siteMeta.publisher,
        image = siteMeta.organization.logo,
        url = siteMeta.url,
    } = options

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${url}/#person`,
        name: name,
        description: description,
        image: {
            '@type': 'ImageObject',
            url: image,
        },
        url: url,
        sameAs: siteMeta.organization.sameAs,
        workLocation: {
            '@type': 'Place',
            name: siteMeta.organization.address,
        },
    }

    return schema
}

/**
 * Generate Article/NewsArticle Schema JSON-LD
 */
export const useArticleSchema = (options: {
    title: string
    description: string
    image?: string
    url?: string
    author?: string
    datePublished?: string
    dateModified?: string
    articleBody?: string
    keywords?: string[]
}) => {
    const route = useRoute()
    const {
        title,
        description,
        image = siteMeta.organization.image,
        url = `${siteMeta.url}${route.path}`,
        author = siteMeta.author,
        datePublished = new Date().toISOString(),
        dateModified = new Date().toISOString(),
        articleBody = '',
        keywords = [],
    } = options

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: {
            '@type': 'ImageObject',
            url: image,
            width: 1200,
            height: 630,
        },
        url: url,
        author: {
            '@type': 'Organization',
            name: author,
            logo: {
                '@type': 'ImageObject',
                url: siteMeta.organization.logo,
            },
        },
        publisher: {
            '@type': 'Organization',
            name: siteMeta.publisher,
            logo: {
                '@type': 'ImageObject',
                url: siteMeta.organization.logo,
            },
        },
        datePublished: datePublished,
        dateModified: dateModified,
        articleBody: articleBody,
        inLanguage: 'id',
        keywords: keywords.join(', '),
        mainEntity: {
            '@type': 'Article',
            '@id': `${url}#article`,
        },
    }

    return schema
}

/**
 * Generate BreadcrumbList Schema JSON-LD
 */
export const useBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => {
    const items = breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url,
    }))

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items,
    }

    return schema
}

/**
 * Generate Product Schema JSON-LD untuk marketplace
 */
export const useProductSchema = (options: {
    name: string
    description: string
    image: string
    url: string
    price: string
    currency?: string
    seller?: string
    rating?: number
    reviewCount?: number
}) => {
    const {
        name,
        description,
        image,
        url,
        price,
        currency = 'IDR',
        seller = siteMeta.publisher,
        rating = 0,
        reviewCount = 0,
    } = options

    const schema = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: name,
        description: description,
        image: image,
        url: url,
        brand: {
            '@type': 'Brand',
            name: siteMeta.publisher,
        },
        offers: {
            '@type': 'Offer',
            url: url,
            priceCurrency: currency,
            price: price,
            seller: {
                '@type': 'Organization',
                name: seller,
            },
            availability: 'https://schema.org/InStock',
        },
        aggregateRating: rating > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: rating.toString(),
            reviewCount: reviewCount.toString(),
        } : undefined,
    }

    return schema
}

/**
 * Set JSON-LD script tag di head
 * Usage: useSetJsonLdScript(useOrganizationSchema())
 */
export const useSetJsonLdScript = (schema: any) => {
    useHead({
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify(schema),
                async: true,
            },
        ],
    })
}

/**
 * Composable untuk inject multiple JSON-LD schemas
 */
export const useJsonLdSchemas = (schemas: any[]) => {
    schemas.forEach(schema => {
        useSetJsonLdScript(schema)
    })
}

/**
 * Get combined schemas untuk home page
 */
export const getHomePageSchemas = () => {
    return [
        useOrganizationSchema(),
        useWebsiteSchema(),
        usePersonSchema(),
    ]
}
