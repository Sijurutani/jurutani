/**
 * SEO Utility Functions untuk JuruTani
 * Membantu optimasi meta tags, canonical URL, dan OG images di semua halaman
 *
 * Prinsip:
 * - Setiap halaman punya "search intent" yang jelas
 * - Keywords berbasis long-tail & semantic (bukan keyword stuffing)
 * - OG Image per-halaman pakai komponen Satoru yang sesuai
 * - Auth pages selalu noindex
 * - E-E-A-T: title & description yang informatif & trustworthy
 */

import siteMeta from '@/site'

// ─── Types ────────────────────────────────────────────────────────────────────

export type OgType =
  | 'website'
  | 'article'
  | 'book'
  | 'profile'
  | 'music.song'
  | 'music.album'
  | 'music.playlist'
  | 'music.radio_status'
  | 'video.movie'
  | 'video.episode'
  | 'video.tv_show'
  | 'video.other'

export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player'

/** Semua page type yang tersedia di platform */
export type StaticPageType =
  | 'home'
  | 'news'
  | 'courses'
  | 'discussions'
  | 'educations'
  | 'markets'
  | 'tools'
  | 'food-prices'
  | 'about'
  | 'contact'
  | 'help'
  | 'terms'
  | 'privacy'
  | 'security'
  | 'profile'
  | 'history'
  | 'setting'
  | 'videos'
  | 'chat'
  | 'meetings'
  | 'weathers'

export type AuthPageType =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'confirm-email'
  | 'callback'

export type AllPageType = StaticPageType | AuthPageType

export interface SEOMetaOptions {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogUrl?: string
  ogType?: OgType
  /** Nama komponen Nuxt Satoru OG Image (tanpa prefix 'OgImage') */
  ogImageComponent?: string
  canonicalUrl?: string
  author?: string
  publisher?: string
  robots?: string
  locale?: string
}

// ─── Core Generator ───────────────────────────────────────────────────────────

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
    ogImageComponent,
    canonicalUrl,
    author = siteMeta.author,
    publisher = siteMeta.publisher,
    robots = siteMeta.robots,
    locale = siteMeta.locale,
  } = options

  const { title: siteTitle, description: siteDescription } = siteMeta

  const fullTitle = pageTitle || siteTitle
  const fullDescription = pageDescription || siteDescription

  const defaultKeywords = [
    'JuruTani',
    'pertanian',
    'peternakan',
    'perikanan',
    'penyuluhan digital',
    'petani indonesia',
    'polbangtan',
  ]

  const combinedKeywords = pageKeywords
    ? [...new Set([...pageKeywords, ...defaultKeywords])]
    : defaultKeywords

  const finalOgImage = ogImage || siteMeta.ogImageUrl

  const route = useRoute()
  const finalOgUrl = ogUrl || `${siteMeta.url}${route.path}`
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
    // internal — dipakai oleh useSeoOptimized untuk defineOgImageComponent
    _ogImageComponent: ogImageComponent,
  }
}

// ─── Page Meta Config ─────────────────────────────────────────────────────────

/**
 * Konfigurasi SEO per halaman.
 * Setiap entry punya:
 * - title: intent-based, mengandung keyword utama
 * - description: actionable, 140-160 karakter ideal
 * - keywords: long-tail, berbasis semantic search
 * - ogImageComponent: nama komponen Satoru tanpa prefix "OgImage"
 */
const PAGE_META_CONFIG: Record<StaticPageType, SEOMetaOptions> = {
  home: {
    // Intent: cari platform penyuluhan digital pertanian / peternakan / perikanan
    title: 'JuruTani — Platform Penyuluhan Pertanian, Peternakan & Perikanan Digital Indonesia',
    description:
      'Platform penyuluhan digital terpadu untuk petani, peternak, dan nelayan Indonesia. Edukasi, konsultasi ahli, harga komoditas real-time, dan komunitas agribisnis dari Polbangtan Yogyakarta-Magelang.',
    keywords: [
      'platform penyuluhan pertanian digital',
      'penyuluhan peternakan perikanan online',
      'platform petani indonesia terpadu',
      'edukasi agribisnis online gratis',
      'konsultasi pertanian penyuluh ahli',
      'harga komoditas pertanian terkini',
      'komunitas petani peternak nelayan',
      'polbangtan yogyakarta magelang',
      'teknologi pertanian indonesia',
      'pertanian peternakan perkebunan perikanan',
    ],
    ogType: 'website',
    ogImageComponent: 'Home',
  },

  news: {
    // Intent: cari berita agribisnis terkini, harga komoditas, kebijakan pangan
    title: 'Berita Pertanian, Peternakan & Perikanan Terkini — JuruTani',
    description:
      'Update berita agribisnis, harga komoditas, kebijakan pangan, dan inovasi pertanian terbaru untuk petani, peternak, dan nelayan Indonesia. Dipilih dan dikurasi oleh tim ahli JuruTani.',
    keywords: [
      'berita pertanian terkini hari ini',
      'berita peternakan indonesia terbaru',
      'berita perikanan nelayan',
      'harga komoditas pertanian hari ini',
      'kebijakan pangan indonesia 2025',
      'inovasi teknologi pertanian terbaru',
      'kabar tani peternak nelayan',
      'berita agribisnis indonesia',
      'subsidi pupuk terbaru',
      'harga gabah hari ini',
    ],
    ogType: 'website',
    ogImageComponent: 'News',
  },

  courses: {
    // Intent: cari pelatihan budidaya, cara ternak, cara ikan, kursus pertanian online gratis
    title: 'Kursus & Pelatihan Budidaya, Peternakan, Perikanan Online Gratis — JuruTani',
    description:
      'Belajar budidaya tanaman, beternak, dan budidaya ikan gratis bersama penyuluh ahli. Kursus pertanian organik, cara ternak ayam sapi kambing, budidaya lele nila, dan agribisnis modern.',
    keywords: [
      'kursus pertanian online gratis',
      'pelatihan budidaya tanaman padi sayur',
      'cara beternak ayam sapi kambing',
      'pelatihan budidaya ikan lele nila',
      'belajar pertanian organik online',
      'kursus agribisnis untuk pemula',
      'pelatihan penyuluhan pertanian',
      'cara berkebun untuk pemula',
      'sertifikasi petani peternak nelayan',
      'video tutorial budidaya peternakan',
    ],
    ogType: 'website',
    ogImageComponent: 'Course',
  },

  discussions: {
    // Intent: forum tanya jawab masalah tanaman/ternak, konsultasi penyuluh gratis
    title: 'Forum Diskusi & Konsultasi Petani, Peternak, Nelayan — JuruTani',
    description:
      'Forum tanya jawab gratis seputar masalah budidaya, penyakit tanaman, penyakit ternak, dan tips pertanian. Konsultasi langsung dengan penyuluh ahli dan sesama petani berpengalaman.',
    keywords: [
      'forum tanya jawab pertanian',
      'konsultasi pertanian penyuluh gratis',
      'diskusi masalah tanaman penyakit',
      'forum peternak indonesia online',
      'tanya jawab budidaya ikan',
      'komunitas petani digital indonesia',
      'kelompok tani online aktif',
      'forum nelayan perikanan',
      'solusi hama penyakit tanaman',
      'diskusi usaha tani agribisnis',
    ],
    ogType: 'website',
    ogImageComponent: 'Home',
  },

  educations: {
    // Intent: cari panduan cara tanam, cara ternak, artikel pertanian organik
    title: 'Artikel & Panduan Budidaya Pertanian, Peternakan, Perikanan — JuruTani',
    description:
      'Panduan lengkap cara budidaya tanaman pangan & hortikultura, teknik beternak, dan pembudidayaan ikan. Tips pertanian organik, manajemen lahan, penanganan hama penyakit, dan peningkatan hasil panen.',
    keywords: [
      'panduan budidaya tanaman pangan',
      'cara budidaya padi jagung kedelai',
      'panduan beternak untuk pemula',
      'cara budidaya ikan lele nila mas',
      'artikel pertanian organik indonesia',
      'teknik pengelolaan lahan pertanian',
      'tips meningkatkan hasil panen',
      'nutrisi pupuk tanaman optimal',
      'penanganan hama penyakit tanaman',
      'edukasi pertanian agribisnis',
    ],
    ogType: 'website',
    ogImageComponent: 'Home',
  },

  markets: {
    // Intent: cari tempat jual hasil panen online, beli bibit/saprotan, marketplace tani
    title: 'Marketplace Pertanian — Jual Beli Hasil Panen, Bibit & Saprotan Online',
    description:
      'Marketplace online khusus pertanian untuk jual beli hasil panen, bibit unggul, benih ikan, pakan ternak, pupuk organik, obat-obatan tanaman, dan alat pertanian langsung dari produsen terpercaya.',
    keywords: [
      'marketplace pertanian indonesia',
      'jual hasil panen online langsung',
      'beli bibit unggul tanaman murah',
      'toko pakan ternak online terpercaya',
      'jual beli hewan ternak online',
      'supplier benih ikan berkualitas',
      'pupuk organik online murah',
      'alat pertanian modern murah',
      'pasar tani digital indonesia',
      'jual komoditas pertanian online',
    ],
    ogType: 'website',
    ogImageComponent: 'Market',
  },

  tools: {
    // Intent: kalkulator pupuk, jadwal tanam, kalkulator pakan ternak, analisis usaha tani
    title: 'Tools & Kalkulator Pertanian, Peternakan, Perikanan Online — JuruTani',
    description:
      'Tools dan kalkulator online gratis untuk petani dan peternak. Hitung kebutuhan pupuk, dosis obat, pakan ternak, estimasi biaya produksi, jadwal tanam musiman, dan analisis kelayakan usaha tani.',
    keywords: [
      'kalkulator kebutuhan pupuk otomatis',
      'kalkulator pakan ternak online',
      'jadwal tanam musiman indonesia',
      'estimasi biaya usaha tani',
      'analisis kelayakan pertanian',
      'tools smart farming indonesia',
      'aplikasi pertanian pintar gratis',
      'hitung dosis obat pestisida',
      'kalkulator biaya budidaya ikan',
      'alat bantu petani peternak digital',
    ],
    ogType: 'website',
    ogImageComponent: 'Home',
  },

  'food-prices': {
    // Intent: cari harga pangan hari ini, harga komoditas, harga beras cabai dll
    title: 'Harga Pangan & Komoditas Pertanian Hari Ini — Yogyakarta, DIY & Jawa Tengah',
    description:
      'Pantau harga pangan dan komoditas pertanian terkini di Yogyakarta, DIY, dan Jawa Tengah. Update harga beras, cabai, bawang, daging, ikan, sayuran, dan hasil ternak dari pasar-pasar lokal.',
    keywords: [
      'harga pangan hari ini yogyakarta',
      'harga komoditas pertanian terbaru',
      'harga beras cabai bawang hari ini',
      'harga daging sapi kambing ayam',
      'harga ikan terbaru pasar',
      'harga sayuran segar hari ini',
      'informasi harga pangan DIY',
      'harga komoditas Jawa Tengah',
      'pantau harga tani real-time',
      'referensi harga hasil panen',
    ],
    ogType: 'website',
    ogImageComponent: 'FoodPrice',
  },

  videos: {
    // Intent: video tutorial cara tanam, cara ternak, cara panen dari penyuluh
    title: 'Video Tutorial Budidaya, Peternakan & Perikanan dari Penyuluh Ahli — JuruTani',
    description:
      'Tonton video tutorial pertanian, peternakan, dan perikanan dari penyuluh dan ahli agribisnis berpengalaman. Pelajari teknik budidaya, beternak, pemeliharaan ikan, dan tips panen secara visual.',
    keywords: [
      'video tutorial pertanian indonesia',
      'video cara budidaya tanaman sayur',
      'video peternakan pemula indonesia',
      'video budidaya ikan lele nila',
      'tutorial cara tanam padi jagung',
      'video penyuluhan pertanian resmi',
      'video teknik beternak modern',
      'belajar tani dari video online',
      'konten pertanian peternakan perikanan',
      'channel pertanian indonesia',
    ],
    ogType: 'website',
    ogImageComponent: 'Video',
  },

  chat: {
    // Intent: konsultasi real-time dengan penyuluh, chat petani langsung
    title: 'Konsultasi & Chat Langsung dengan Penyuluh Pertanian — JuruTani',
    description:
      'Chat langsung dengan penyuluh pertanian, dokter hewan, dan ahli perikanan di JuruTani. Dapatkan jawaban cepat untuk masalah budidaya, penyakit tanaman & ternak, dan pertanyaan agribisnis Anda.',
    keywords: [
      'konsultasi penyuluh pertanian online',
      'chat petani peternak nelayan',
      'tanya jawab real-time budidaya',
      'konsultasi dokter hewan online',
      'obrolan komunitas tani digital',
      'diskusi langsung peternakan ikan',
      'bantuan masalah tanaman online',
    ],
    ogType: 'website',
    ogImageComponent: 'Home',
  },

  meetings: {
    // Intent: cari webinar pertanian, jadwal pelatihan online, seminar agribisnis
    title: 'Jadwal Webinar & Pertemuan Penyuluhan Pertanian — JuruTani',
    description:
      'Ikuti webinar, pelatihan online, dan pertemuan penyuluhan pertanian, peternakan, dan perikanan bersama pakar dari Polbangtan. Daftar gratis dan tingkatkan pengetahuan agribisnis Anda.',
    keywords: [
      'webinar pertanian peternakan online',
      'jadwal pelatihan penyuluhan pertanian',
      'seminar agribisnis gratis',
      'meeting petani peternak nelayan',
      'pertemuan kelompok tani online',
      'diskusi panel pertanian digital',
      'jadwal event agribisnis indonesia',
    ],
    ogType: 'website',
    ogImageComponent: 'Meeting',
  },

  weathers: {
    // Intent: cari info cuaca untuk bertani, prakiraan cuaca tani, rekomendasi jadwal tanam
    title: 'Informasi Cuaca Pertanian & Prakiraan Hujan untuk Petani — JuruTani',
    description:
      'Pantau cuaca pertanian terkini, prakiraan hujan 5 hari, dan rekomendasi kondisi ideal untuk tanam, semprot, dan panen. Data cuaca akurat khusus untuk kebutuhan petani dan peternak Indonesia.',
    keywords: [
      'cuaca pertanian hari ini',
      'prakiraan cuaca untuk petani',
      'info cuaca tani indonesia',
      'jadwal tanam berdasarkan cuaca',
      'rekomendasi waktu semprot pestisida',
      'prakiraan hujan petani peternak',
      'cuaca agribisnis terkini',
      'ramalan cuaca lahan pertanian',
    ],
    ogType: 'website',
    ogImageComponent: 'Home',
  },

  // ─── Static/Info Pages ──────────────────────────────────────────────────────

  about: {
    title: 'Tentang JuruTani — Platform Penyuluhan Digital Polbangtan Yogyakarta-Magelang',
    description:
      'JuruTani adalah platform penyuluhan digital resmi Polbangtan Yogyakarta-Magelang. Mendukung petani, peternak, dan nelayan Indonesia melalui edukasi, teknologi, dan inovasi agribisnis modern.',
    keywords: [
      'tentang JuruTani platform pertanian',
      'profil polbangtan yogyakarta magelang',
      'platform penyuluhan digital resmi',
      'visi misi JuruTani agribisnis',
      'inovasi pertanian digital indonesia',
      'lembaga penyuluhan pertanian resmi',
    ],
    ogType: 'website',
    ogImageComponent: 'Home',
  },

  contact: {
    title: 'Hubungi Tim JuruTani — Layanan & Kemitraan Penyuluhan Pertanian',
    description:
      'Hubungi tim JuruTani untuk pertanyaan layanan penyuluhan pertanian, peternakan, perikanan, kemitraan agribisnis, atau laporan teknis. Tim kami siap membantu petani dan peternak Indonesia.',
    keywords: [
      'kontak JuruTani',
      'hubungi penyuluh pertanian',
      'kemitraan agribisnis digital',
      'layanan dukungan petani',
      'pengaduan platform pertanian',
    ],
    ogType: 'website',
    ogImageComponent: 'Home',
  },

  help: {
    title: 'Pusat Bantuan & Panduan JuruTani',
    description:
      'Panduan lengkap cara menggunakan platform JuruTani. FAQ, tutorial fitur, dan bantuan teknis untuk petani, peternak, dan nelayan yang terdaftar di platform penyuluhan digital kami.',
    keywords: [
      'cara menggunakan JuruTani',
      'panduan platform penyuluhan pertanian',
      'FAQ JuruTani',
      'tutorial fitur petani digital',
      'bantuan teknis platform tani',
    ],
    ogType: 'website',
    ogImageComponent: 'Home',
  },

  terms: {
    title: 'Syarat & Ketentuan Layanan — JuruTani',
    description:
      'Syarat dan ketentuan penggunaan platform penyuluhan pertanian JuruTani. Perjanjian pengguna, kebijakan layanan, dan hak serta kewajiban pengguna platform agribisnis digital.',
    keywords: ['syarat ketentuan JuruTani', 'terms of service platform pertanian'],
    ogType: 'website',
    ogImageComponent: 'Home',
  },

  privacy: {
    title: 'Kebijakan Privasi — Perlindungan Data Pengguna JuruTani',
    description:
      'Kebijakan privasi JuruTani menjelaskan cara kami mengumpulkan, menyimpan, dan melindungi data pribadi petani, peternak, dan nelayan yang terdaftar di platform penyuluhan digital kami.',
    keywords: ['kebijakan privasi JuruTani', 'perlindungan data petani', 'privacy policy agribisnis'],
    ogType: 'website',
    ogImageComponent: 'Home',
  },

  // ─── Private Pages (noindex) ────────────────────────────────────────────────

  security: {
    title: 'Keamanan Akun — JuruTani',
    description:
      'Kelola keamanan akun JuruTani Anda. Atur verifikasi dua langkah, ganti kata sandi, dan lindungi akses ke layanan penyuluhan digital Anda.',
    keywords: [],
    ogType: 'website',
    robots: 'noindex, follow',
    ogImageComponent: 'Home',
  },

  profile: {
    title: 'Profil Saya — JuruTani',
    description:
      'Kelola profil petani, peternak, atau nelayan Anda di JuruTani. Edit informasi pribadi, atur preferensi komoditas, dan perbarui data usaha tani.',
    keywords: [],
    ogType: 'website',
    robots: 'noindex, follow',
    ogImageComponent: 'Home',
  },

  history: {
    title: 'Riwayat Aktivitas — JuruTani',
    description: 'Lihat riwayat diskusi, pelatihan, transaksi, dan semua interaksi Anda di platform penyuluhan JuruTani.',
    keywords: [],
    ogType: 'website',
    robots: 'noindex, follow',
    ogImageComponent: 'Home',
  },

  setting: {
    title: 'Pengaturan Akun — JuruTani',
    description:
      'Atur preferensi komoditas, notifikasi harga pangan, dan pengaturan akun penyuluhan JuruTani sesuai kebutuhan usaha tani Anda.',
    keywords: [],
    ogType: 'website',
    robots: 'noindex, follow',
    ogImageComponent: 'Home',
  },
}

/** Config untuk halaman autentikasi — selalu noindex */
const AUTH_META_CONFIG: Record<AuthPageType, SEOMetaOptions> = {
  login: {
    title: 'Masuk ke JuruTani',
    description:
      'Masuk ke akun JuruTani untuk mengakses layanan penyuluhan pertanian, peternakan, dan perikanan digital Indonesia.',
    keywords: [],
    robots: 'noindex, nofollow',
    ogImageComponent: 'Home',
  },
  register: {
    title: 'Daftar Gratis — JuruTani',
    description:
      'Buat akun JuruTani gratis dan bergabung dengan komunitas petani, peternak, dan nelayan digital Indonesia.',
    keywords: [],
    robots: 'noindex, nofollow',
    ogImageComponent: 'Home',
  },
  'forgot-password': {
    title: 'Lupa Kata Sandi — JuruTani',
    description: 'Masukkan email Anda untuk menerima tautan pemulihan kata sandi akun JuruTani.',
    keywords: [],
    robots: 'noindex, nofollow',
    ogImageComponent: 'Home',
  },
  'reset-password': {
    title: 'Buat Kata Sandi Baru — JuruTani',
    description: 'Buat kata sandi baru yang kuat untuk mengamankan kembali akun JuruTani Anda.',
    keywords: [],
    robots: 'noindex, nofollow',
    ogImageComponent: 'Home',
  },
  'confirm-email': {
    title: 'Verifikasi Email — JuruTani',
    description: 'Periksa email Anda dan klik tautan verifikasi untuk mengaktifkan akun JuruTani.',
    keywords: [],
    robots: 'noindex, nofollow',
    ogImageComponent: 'Home',
  },
  callback: {
    title: 'Memproses — JuruTani',
    description: '',
    keywords: [],
    robots: 'noindex, nofollow',
    ogImageComponent: 'Home',
  },
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Ambil SEO meta untuk static page berdasarkan pageType.
 * Gunakan ini kalau butuh raw object (tanpa side-effect useSeoMeta).
 */
export const getPageSeoMeta = (pageType: AllPageType) => {
  const config =
    PAGE_META_CONFIG[pageType as StaticPageType] ??
    AUTH_META_CONFIG[pageType as AuthPageType] ??
    PAGE_META_CONFIG.home

  return generateSeoMeta(config)
}

/**
 * Ambil SEO meta untuk halaman auth.
 * Alias dari getPageSeoMeta — untuk backward compat.
 */
export const getAuthPageSeoMeta = (pageType: AuthPageType) => {
  return generateSeoMeta(AUTH_META_CONFIG[pageType] ?? AUTH_META_CONFIG.login)
}

// ─── Composables ──────────────────────────────────────────────────────────────

/**
 * Composable untuk static pages.
 * Auto-apply useSeoMeta + defineOgImageComponent (Satoru) + Schema.org untuk home.
 *
 * Usage: `useSeoOptimized('news')`
 */
export const useSeoOptimized = (pageType: StaticPageType) => {
  const config = PAGE_META_CONFIG[pageType] ?? PAGE_META_CONFIG.home
  const seoMeta = generateSeoMeta(config)

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

  // OG Image per-halaman menggunakan komponen Satoru yang tepat
  const ogImageComponent = seoMeta._ogImageComponent ?? 'Home'
  defineOgImageComponent(`OgImage${ogImageComponent}`, {
    title: seoMeta.title,
    description: seoMeta.description,
  })

  // Schema.org global (WebSite + Organization) khusus home
  if (pageType === 'home') {
    useSchemaOrg([
      defineWebSite({
        name: siteMeta.title,
        url: siteMeta.url,
        description: siteMeta.description,
        inLanguage: siteMeta.lang,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteMeta.url}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }),
      defineOrganization({
        name: siteMeta.organization.name,
        alternateName: siteMeta.organization.alternateName,
        logo: siteMeta.organization.logo,
        url: siteMeta.organization.url,
        sameAs: siteMeta.organization.sameAs,
        email: siteMeta.organization.email,
        telephone: siteMeta.organization.phone,
        foundingDate: siteMeta.organization.foundingDate,
        areaServed: siteMeta.organization.areaServed,
        knowsAbout: siteMeta.organization.knowsAbout,
      }),
    ])
  }

  return seoMeta
}

/**
 * Composable untuk halaman detail / dinamis (artikel berita, kursus, produk marketplace, dll).
 * Auto-apply useSeoMeta + optional Schema.org (Article / Product) + optional Satoru OG Image.
 *
 * Usage:
 * ```ts
 * useSeoDetail({
 *   title: artikel.judul,
 *   description: artikel.ringkasan,
 *   keywords: ['cabai merah', 'hama kutu daun'],
 *   image: artikel.thumbnail,
 *   type: 'article',
 *   ogImageComponent: 'News',
 *   ogImageProps: { category: 'Berita', date: artikel.tanggal },
 *   schema: {
 *     type: 'Article',
 *     data: {
 *       datePublished: artikel.tanggal,
 *       dateModified: artikel.diperbarui,
 *       author: { name: artikel.penulis },
 *     }
 *   }
 * })
 * ```
 */
export const useSeoDetail = (options: {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: OgType
  ogImageComponent?: string
  ogImageProps?: Record<string, any>
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

  const { title: siteTitle } = siteMeta

  const fullTitle = pageTitle || siteTitle
  const fullDescription = pageDescription || siteMeta.description

  const defaultKeywords = ['JuruTani', 'pertanian', 'peternakan', 'perikanan', 'penyuluhan', 'petani indonesia']
  const combinedKeywords = pageKeywords
    ? [...new Set([...pageKeywords, ...defaultKeywords])]
    : defaultKeywords

  const finalOgImage = image || siteMeta.ogImageUrl

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
    ogLocale: siteMeta.locale,
    ogSiteName: siteTitle,
    twitterCard: 'summary_large_image' as TwitterCardType,
    twitterSite: siteMeta.twitter,
    twitterCreator: siteMeta.twitter,
    twitterTitle: fullTitle,
    twitterDescription: fullDescription,
    twitterImage: finalOgImage,
    twitterImageAlt: fullTitle,
  })

  // OG Image dinamis via Satoru
  if (ogImageComponent) {
    defineOgImageComponent(`OgImage${ogImageComponent}`, {
      title: pageTitle,
      description: pageDescription,
      ...ogImageProps,
    })
  }

  // Schema.org dinamis
  if (schema) {
    if (schema.type === 'Article') {
      useSchemaOrg([
        defineArticle({
          headline: pageTitle,
          description: pageDescription,
          image: finalOgImage,
          url: finalOgUrl,
          inLanguage: siteMeta.lang,
          publisher: {
            '@type': 'Organization',
            name: siteMeta.organization.name,
            logo: siteMeta.organization.logo,
          },
          ...schema.data,
        }),
      ])
    } else if (schema.type === 'Product') {
      useSchemaOrg([
        defineProduct({
          name: pageTitle,
          description: pageDescription,
          image: finalOgImage,
          url: finalOgUrl,
          ...schema.data,
        }),
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
 * Composable untuk halaman auth.
 * Auto-apply useSeoMeta dengan robots noindex.
 *
 * Usage: `useSeoAuth('login')`
 */
export const useSeoAuth = (pageType: AuthPageType) => {
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generate canonical URL absolut dari path relatif.
 * Usage: `getCanonicalUrl('/berita/harga-cabai-naik')`
 */
export const getCanonicalUrl = (path: string): string => {
  return new URL(path, siteMeta.url).href
}

/**
 * Resolve OG image URL dengan fallback ke default.
 */
export const getOgImageUrl = (customImage?: string): string => {
  return customImage || siteMeta.ogImageUrl
}