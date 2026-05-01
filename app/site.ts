/**
 * JuruTani — Site-wide metadata & configuration
 * Platform Penyuluhan Pertanian, Peternakan & Perikanan Digital Indonesia
 */

export default {
  // ─── Identity ──────────────────────────────────────────────────────────────
  title: 'JuruTani',
  titleTemplate: '%s — JuruTani',
  titleSeparator: '—',

  // Deskripsi yang mengandung primary keyword secara alami (E-E-A-T friendly)
  description:
    'Platform penyuluhan pertanian, peternakan, perkebunan, dan perikanan digital resmi dari Polbangtan Yogyakarta-Magelang. Edukasi, konsultasi, harga komoditas, dan komunitas petani Indonesia dalam satu platform.',

  // ─── Publisher / Author ────────────────────────────────────────────────────
  author: 'Politeknik Pembangunan Pertanian Yogyakarta-Magelang',
  publisher: 'Politeknik Pembangunan Pertanian Yogyakarta-Magelang',
  publisherShort: 'Polbangtan Yogyakarta-Magelang',

  // ─── Organization Schema (Schema.org) ─────────────────────────────────────
  organization: {
    name: 'Politeknik Pembangunan Pertanian Yogyakarta-Magelang',
    shortName: 'Polbangtan Yogyakarta-Magelang',
    alternateName: ['Polbangtan Yoma', 'JuruTani'],
    url: 'https://jurutani.com',
    logo: 'https://jurutani.com/logo/jurutani.png',
    // OG image utama — rasio 1200x630 (rekomendasi WhatsApp/FB/Twitter)
    image: 'https://jurutani.com/og/og-home.jpg',
    description:
      'Platform digital penyuluhan pertanian, peternakan, perkebunan, dan perikanan resmi Polbangtan Yogyakarta-Magelang untuk mendukung ketahanan pangan dan kesejahteraan petani Indonesia.',
    address: {
      streetAddress: 'Jl. Kusumanegara No.2',
      addressLocality: 'Yogyakarta',
      addressRegion: 'Daerah Istimewa Yogyakarta',
      postalCode: '55167',
      addressCountry: 'ID',
    },
    email: 'si.jurutani@gmail.com',
    // Format E.164 — lebih machine-readable untuk schema.org
    phone: '+6285669000010',
    areaServed: 'ID',
    foundingDate: '2024',
    sameAs: [
      'https://github.com/jurutani',
      'https://twitter.com/jurutani',
      'https://instagram.com/jurutani',
      'https://www.youtube.com/@jurutani',
    ],
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 1,
    },
    knowsAbout: [
      'pertanian',
      'peternakan',
      'perikanan',
      'perkebunan',
      'agribisnis',
      'penyuluhan pertanian',
      'teknologi pertanian',
    ],
  },

  // ─── URLs ──────────────────────────────────────────────────────────────────
  url: 'https://jurutani.com',
  github: 'https://github.com/jurutani',

  // ─── Assets ────────────────────────────────────────────────────────────────
  // Fallback OG image (Nuxt Satoru akan override ini per-halaman)
  ogImageUrl: '/og/og-home.jpg',
  favicon: '/favicon.ico',
  appleTouchIcon: '/apple-touch-icon.png',

  // ─── Social ────────────────────────────────────────────────────────────────
  twitter: '@jurutani',
  instagram: '@jurutani',
  youtube: 'https://www.youtube.com/@jurutani',

  // ─── Locale & i18n ─────────────────────────────────────────────────────────
  defaultLocale: 'id',
  locale: 'id_ID',
  lang: 'id',

  // ─── Technical ─────────────────────────────────────────────────────────────
  generator: 'Nuxt 4, TailwindCSS v4',
  trailingSlash: false,

  // ─── Schema.org identity ───────────────────────────────────────────────────
  identity: {
    type: 'Organization',
  } as const,

  // ─── Default robots ────────────────────────────────────────────────────────
  // Override per-halaman di seo.ts (auth pages = noindex)
  robots: 'index, follow',

  // ─── Verification tags (opsional, isi jika sudah punya) ────────────────────
  // verification: {
  //   google: 'GOOGLE_SEARCH_CONSOLE_TOKEN',
  //   bing: 'BING_WEBMASTER_TOKEN',
  // },
}