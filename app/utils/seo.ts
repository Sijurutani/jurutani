/**
 * SEO Utility Functions untuk JuruTani
 * Membantu optimasi meta tags, canonical URL, dan OG images di semua halaman
 */

import siteMeta from '@/site'

export type OgType = 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_status' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other'
export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player'

export interface SEOMetaOptions {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
    ogUrl?: string
    ogType?: OgType
    canonicalUrl?: string
    author?: string
    publisher?: string
    robots?: string
    locale?: string
}

/**
 * Generate SEO meta tags dengan default dari siteMeta
 */
export const generateSeoMeta = (options: SEOMetaOptions) => {
    const {
        title: pageTitle,
        description: pageDescription,
        keywords: pageKeywords,
        ogImage,
        ogUrl,
        ogType = 'website',
        canonicalUrl,
        author = siteMeta.author,
        publisher = siteMeta.publisher,
        robots = 'index, follow',
        locale = 'id_ID',
    } = options

    const { titleSeparator, title: siteTitle, description: siteDescription } = siteMeta

    // Generate full title
    const fullTitle = pageTitle
        ? `${pageTitle} ${titleSeparator} ${siteTitle}`
        : siteTitle

    // Generate description
    const fullDescription = pageDescription || siteDescription

    // Generate keywords
    const defaultKeywords = ['JuruTani', 'pertanian', 'penyuluhan', 'digital', 'petani indonesia', 'teknologi pertanian']
    const combinedKeywords = pageKeywords
        ? [...pageKeywords, ...defaultKeywords]
        : defaultKeywords

    // Generate OG Image
    const finalOgImage = ogImage || siteMeta.ogImageUrl

    // Generate OG URL
    const route = useRoute()
    const finalOgUrl = ogUrl || `${siteMeta.url}${route.path}`

    // Generate Canonical URL
    const finalCanonicalUrl = canonicalUrl || finalOgUrl

    return {
        title: fullTitle,
        description: fullDescription,
        keywords: combinedKeywords.join(', '),
        author,
        publisher,
        robots,
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1',
        ogTitle: fullTitle,
        ogDescription: fullDescription,
        ogImage: finalOgImage,
        ogUrl: finalOgUrl,
        ogType: ogType as OgType,
        ogLocale: locale,
        ogSiteName: siteTitle,
        twitterCard: 'summary_large_image' as TwitterCardType,
        twitterSite: siteMeta.twitter,
        twitterCreator: siteMeta.twitter,
        twitterTitle: fullTitle,
        twitterDescription: fullDescription,
        twitterImage: finalOgImage,
        twitterImageAlt: fullTitle,
        canonicalUrl: finalCanonicalUrl,
    }
}

/**
 * Generate SEO meta dengan keyword yang sudah dioptimasi per halaman
 * Membuat struktur yang konsisten dan SEO-friendly
 */
export const getPageSeoMeta = (pageType: 'home' | 'news' | 'courses' | 'discussions' | 'educations' | 'markets' | 'tools' | 'food-prices' | 'about' | 'contact' | 'help' | 'terms' | 'privacy' | 'security' | 'profile' | 'history' | 'setting' | 'videos' | 'chat') => {
    const pageMetaConfig: Record<string, SEOMetaOptions> = {
        home: {
            title: 'Solusi Penyuluhan Pertanian Digital',
            description: 'Platform penyuluhan digital dari Polbangtan Yogyakarta-Magelang untuk mendukung petani lokal menuju era pertanian modern.',
            keywords: ['JuruTani', 'penyuluhan digital', 'inovasi pertanian', 'polbangtan yogyakarta', 'petani indonesia', 'teknologi pertanian', 'penyuluhan digital'],
            ogType: 'website',
        },
        news: {
            title: 'Berita Pertanian Terkini',
            description: 'Berita pertanian terkini dan inovasi dari Polbangtan Yogyakarta-Magelang untuk petani Indonesia.',
            keywords: ['berita pertanian', 'berita tani', 'inovasi pertanian terbaru', 'kabar tani', 'berita agribisnis'],
            ogType: 'website',
        },
        courses: {
            title: 'Kursus Pertanian Online',
            description: 'Kursus dan pelatihan pertanian dari para ahli untuk meningkatkan keterampilan dan keahlian Anda.',
            keywords: ['kursus pertanian', 'pelatihan pertanian', 'belajar pertanian', 'course pertanian', 'edukasi petani', 'pelatihan digital'],
            ogType: 'website',
        },
        discussions: {
            title: 'Forum Diskusi Pertanian',
            description: 'Forum diskusi komunitas petani untuk tanya jawab, berbagi pengalaman, dan solusi pertanian.',
            keywords: ['forum diskusi pertanian', 'diskusi tani', 'komunitas petani', 'tanya jawab pertanian', 'forum petani', 'forum agribisnis'],
            ogType: 'website',
        },
        educations: {
            title: 'Edukasi & Artikel Pertanian',
            description: 'Materi edukasi dan artikel pertanian praktis dengan tutorial dan tips berguna untuk petani.',
            keywords: ['edukasi pertanian', 'artikel pertanian', 'panduan pertanian', 'tutorial pertanian', 'tips bertani', 'materi edukasi pertanian'],
            ogType: 'website',
        },
        markets: {
            title: 'Pasar Tani Online',
            description: 'Marketplace pertanian untuk jual beli produk, pupuk, bibit, dan perlengkapan pertanian online.',
            keywords: ['pasar tani', 'marketplace pertanian', 'jual beli pertanian', 'toko online pertanian', 'supplier pertanian', 'produk pertanian'],
            ogType: 'website',
        },
        tools: {
            title: 'Tools & Kalkulator Pertanian',
            description: 'Rekomendasi alat pertanian, tips perawatan, kalkulator, dan tools berguna untuk petani modern.',
            keywords: ['alat pertanian', 'tools pertanian', 'kalkulator pertanian', 'alat bantu tani', 'peralatan pertanian', 'aplikasi pertanian'],
            ogType: 'website',
        },
        'food-prices': {
            title: 'Daftar Harga Pangan DIY',
            description: 'Informasi harga pangan dan komoditas pertanian terkini dari produsen lokal di Daerah Istimewa Yogyakarta.',
            keywords: ['harga pangan', 'harga komoditas', 'harga sayur', 'harga hasil tani', 'informasi harga', 'harga pasar', 'daftar harga DIY'],
            ogType: 'website',
        },
        about: {
            title: 'Tentang JuruTani',
            description: 'JuruTani: inovasi digital Polbangtan untuk mengembangkan pertanian Indonesia menuju era digital.',
            keywords: ['tentang JuruTani', 'visi misi JuruTani', 'polbangtan yogyakarta', 'polbangtan magelang', 'tentang penyuluhan digital'],
            ogType: 'website',
        },
        contact: {
            title: 'Hubungi Kami',
            description: 'Hubungi tim JuruTani untuk informasi atau pertanyaan tentang platform pertanian digital kami.',
            keywords: ['hubungi JuruTani', 'kontak JuruTani', 'layanan pelanggan', 'customer service', 'dukungan JuruTani'],
            ogType: 'website',
        },
        help: {
            title: 'Bantuan & FAQ',
            description: 'FAQ dan panduan lengkap untuk menggunakan platform JuruTani secara optimal dengan bantuan teknis.',
            keywords: ['faq JuruTani', 'bantuan JuruTani', 'pertanyaan umum', 'cara menggunakan', 'panduan pengguna', 'tips JuruTani'],
            ogType: 'website',
        },
        terms: {
            title: 'Syarat & Ketentuan',
            description: 'Baca syarat dan ketentuan penggunaan platform JuruTani. Perjanjian pengguna dan kebijakan layanan untuk semua pengguna.',
            keywords: ['syarat ketentuan', 'terms of service', 'kebijakan JuruTani', 'perjanjian pengguna'],
            ogType: 'website',
        },
        privacy: {
            title: 'Kebijakan Privasi',
            description: 'Kebijakan privasi JuruTani: komitmen kami melindungi data pribadi dan keamanan pengguna platform.',
            keywords: ['kebijakan privasi', 'privacy policy', 'keamanan data', 'perlindungan data pribadi'],
            ogType: 'website',
        },
        security: {
            title: 'Keamanan Akun',
            description: 'Kelola keamanan akun JuruTani dengan fitur keamanan lengkap untuk melindungi data pribadi.',
            keywords: ['keamanan akun', 'keamanan data', 'proteksi akun', 'keamanan login', 'verifikasi identitas'],
            ogType: 'website',
        },
        profile: {
            title: 'Profil Saya',
            description: 'Kelola profil pribadi Anda di JuruTani. Edit informasi, preferensi, dan pengaturan akun dengan mudah.',
            keywords: ['profil pengguna', 'akun saya', 'pengaturan profil', 'data pribadi'],
            ogType: 'website',
            robots: 'noindex, follow', // Private page
        },
        history: {
            title: 'Riwayat Aktivitas',
            description: 'Lihat riwayat lengkap aktivitas, transaksi, diskusi, dan interaksi Anda di platform JuruTani.',
            keywords: ['riwayat aktivitas', 'riwayat transaksi', 'history', 'log aktivitas'],
            ogType: 'website',
            robots: 'noindex, follow', // Private page
        },
        setting: {
            title: 'Pengaturan Akun',
            description: 'Atur preferensi dan pengaturan akun Anda di JuruTani. Kustomisasi pengalaman pengguna sesuai kebutuhan.',
            keywords: ['pengaturan akun', 'preferences', 'settings', 'konfigurasi'],
            ogType: 'website',
            robots: 'noindex, follow', // Private page
        },
        videos: {
            title: 'Video JuruTani',
            description: 'Video JuruTani: belajar pertanian dengan video tutorial interaktif dan materi pembelajaran lengkap.',
            keywords: ['video JuruTani', 'pertanian digital', 'video tutorial', 'materi pembelajaran', 'belajar pertanian'],
            ogType: 'website',
        },
        chat: {
            title: 'Ruang Obrolan — JuruTani',
            description: 'Ikuti percakapan dan pembaruan terbaru di Ruang Obrolan JuruTani untuk berdiskusi, berbagi tips, dan mendapatkan info pertanian terkini.',
            keywords: ['ruang obrolan', 'obrolan', 'diskusi', 'tips', 'info pertanian'],
            ogType: 'website',
        },
    }

    return generateSeoMeta(pageMetaConfig[pageType] || pageMetaConfig.home)
}

/**
 * Generate canonical URL untuk halaman spesifik
 */
export const getCanonicalUrl = (path: string) => {
    return new URL(path, siteMeta.url).href
}

/**
 * Generate OG image URL dengan fallback
 */
export const getOgImageUrl = (customImage?: string) => {
    return customImage || siteMeta.ogImageUrl
}

/**
 * Hook untuk mengoptimalkan SEO meta di halaman
 * Usage: const seoMeta = useSeoOptimized('news')
 */
export const useSeoOptimized = (pageType: 'home' | 'news' | 'courses' | 'discussions' | 'educations' | 'markets' | 'tools' | 'food-prices' | 'about' | 'contact' | 'help' | 'terms' | 'privacy' | 'security' | 'profile' | 'history' | 'setting' | 'videos' | 'chat') => {
    const seoMeta = getPageSeoMeta(pageType)

    // Auto-apply useSeoMeta
    useSeoMeta({
        title: seoMeta.title,
        description: seoMeta.description,
        keywords: seoMeta.keywords,
        author: seoMeta.author,
        publisher: seoMeta.publisher,
        robots: seoMeta.robots,
        ogTitle: seoMeta.ogTitle,
        ogDescription: seoMeta.ogDescription,
        ogImage: seoMeta.ogImage,
        ogUrl: seoMeta.ogUrl,
        ogType: seoMeta.ogType as OgType,
        ogLocale: seoMeta.ogLocale,
        ogSiteName: seoMeta.ogSiteName,
        twitterCard: 'summary_large_image' as TwitterCardType,
        twitterSite: seoMeta.twitterSite,
        twitterCreator: seoMeta.twitterCreator,
        twitterTitle: seoMeta.twitterTitle,
        twitterDescription: seoMeta.twitterDescription,
        twitterImage: seoMeta.twitterImage,
        twitterImageAlt: seoMeta.twitterImageAlt,
    })

    // Eksekusi Dynamic OG Image untuk semua halaman statis
    defineOgImageComponent('OgImageHome', {
        title: seoMeta.title,
        description: seoMeta.description,
    })

    // Eksekusi Global Schema (Organization/WebSite) khusus untuk Home
    if (pageType === 'home') {
        useSchemaOrg([
            defineWebSite({
                name: siteMeta.title,
                url: siteMeta.url,
                description: siteMeta.description,
            }),
            defineOrganization({
                name: 'Polbangtan Yogyakarta-Magelang',
                logo: '/LOGO02.png',
                url: siteMeta.url,
            })
        ])
    }

    return seoMeta
}

/**
 * Gunakan untuk halaman detail/dinamis (news, courses, dll)
 * Membuat SEO meta yang lebih spesifik dengan title dan description custom
 */
export const useSeoDetail = (options: {
    title: string
    description: string
    keywords?: string[]
    image?: string
    url?: string
    type?: OgType
    // Dukungan untuk dynamic OG Image
    ogImageComponent?: string
    ogImageProps?: Record<string, any>
    // Dukungan untuk Schema.org (GEO)
    schema?: {
        type: 'Article' | 'Product'
        data: Record<string, any>
    }
}) => {
    const {
        title: pageTitle,
        description: pageDescription,
        keywords: pageKeywords,
        image,
        url,
        type = 'article',
        ogImageComponent,
        ogImageProps,
        schema,
    } = options

    const { titleSeparator, title: siteTitle } = siteMeta

    // Generate full title
    const fullTitle = `${pageTitle} ${titleSeparator} ${siteTitle}`

    // Generate description
    const fullDescription = pageDescription || siteMeta.description

    // Generate keywords
    const defaultKeywords = ['JuruTani', 'pertanian', 'penyuluhan', 'digital', 'petani indonesia']
    const combinedKeywords = pageKeywords
        ? [...pageKeywords, ...defaultKeywords]
        : defaultKeywords

    // Generate OG Image
    const finalOgImage = image || siteMeta.ogImageUrl

    // Generate OG URL
    const route = useRoute()
    const finalOgUrl = url || `${siteMeta.url}${route.path}`

    useSeoMeta({
        title: fullTitle,
        description: fullDescription,
        keywords: combinedKeywords.join(', '),
        author: siteMeta.author,
        publisher: siteMeta.publisher,
        robots: 'index, follow',
        ogTitle: fullTitle,
        ogDescription: fullDescription,
        ogImage: finalOgImage,
        ogUrl: finalOgUrl,
        ogType: type as OgType,
        ogLocale: 'id_ID',
        ogSiteName: siteTitle,
        twitterCard: 'summary_large_image' as TwitterCardType,
        twitterSite: siteMeta.twitter,
        twitterCreator: siteMeta.twitter,
        twitterTitle: fullTitle,
        twitterDescription: fullDescription,
        twitterImage: finalOgImage,
        twitterImageAlt: fullTitle,
    })

    // Eksekusi Dynamic OG Image jika komponen diberikan
    if (ogImageComponent) {
        // Auto-inject title & description jika belum ada di props
        const props = {
            title: pageTitle,
            description: pageDescription,
            ...ogImageProps,
        }
        defineOgImageComponent(ogImageComponent, props)
    }

    // Eksekusi Schema.org (GEO) jika ada definisi
    if (schema) {
        if (schema.type === 'Article') {
            useSchemaOrg([
                defineArticle({
                    headline: pageTitle,
                    description: pageDescription,
                    image: finalOgImage,
                    ...schema.data
                })
            ])
        } else if (schema.type === 'Product') {
            useSchemaOrg([
                defineProduct({
                    name: pageTitle,
                    description: pageDescription,
                    image: finalOgImage,
                    ...schema.data
                })
            ])
        }
    }

    return {
        title: fullTitle,
        description: fullDescription,
        keywords: combinedKeywords.join(', '),
    }
}

/**
 * Get SEO untuk halaman autentikasi
 */
export const getAuthPageSeoMeta = (pageType: 'login' | 'register' | 'forgot-password' | 'reset-password' | 'confirm-email' | 'callback') => {
    const pageMetaConfig: Record<string, SEOMetaOptions> = {
        login: {
            title: 'Masuk',
            description: 'Masuk ke akun JuruTani Anda untuk mengakses semua fitur penyuluhan pertanian digital yang kami sediakan.',
            keywords: ['login JuruTani', 'masuk akun', 'autentikasi'],
            robots: 'noindex, follow',
        },
        register: {
            title: 'Daftar',
            description: 'Daftar akun baru di JuruTani dan mulai bergabung dengan komunitas petani modern di Indonesia.',
            keywords: ['daftar JuruTani', 'registrasi', 'buat akun'],
            robots: 'noindex, follow',
        },
        'forgot-password': {
            title: 'Lupa Kata Sandi',
            description: 'Pulihkan akses akun JuruTani Anda dengan mereset kata sandi dengan mudah dan aman.',
            keywords: ['lupa password', 'reset password', 'recover account'],
            robots: 'noindex, follow',
        },
        'reset-password': {
            title: 'Atur Ulang Kata Sandi',
            description: 'Atur ulang kata sandi JuruTani Anda untuk keamanan akun yang lebih baik.',
            keywords: ['atur password', 'ubah password', 'reset password'],
            robots: 'noindex, follow',
        },
        'confirm-email': {
            title: 'Konfirmasi Email',
            description: 'Konfirmasi email Anda untuk menyelesaikan proses registrasi di JuruTani.',
            keywords: ['konfirmasi email', 'verifikasi email'],
            robots: 'noindex, follow',
        },
        callback: {
            title: 'Memproses',
            description: 'Memproses autentikasi Anda...',
            keywords: ['callback', 'verifikasi'],
            robots: 'noindex, nofollow',
        },
    }

    return generateSeoMeta(pageMetaConfig[pageType] || pageMetaConfig.login)
}

/**
 * Hook untuk auth pages
 */
export const useSeoAuth = (pageType: 'login' | 'register' | 'forgot-password' | 'reset-password' | 'confirm-email' | 'callback') => {
    const seoMeta = getAuthPageSeoMeta(pageType)

    useSeoMeta({
        title: seoMeta.title,
        description: seoMeta.description,
        keywords: seoMeta.keywords,
        author: seoMeta.author,
        robots: seoMeta.robots,
        ogTitle: seoMeta.ogTitle,
        ogDescription: seoMeta.ogDescription,
        ogImage: seoMeta.ogImage,
    })

    return seoMeta
}
