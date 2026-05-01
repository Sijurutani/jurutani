// https://nuxt.com/docs/api/configuration/nuxt-config
import siteMeta from './app/site'

const {
  title,
  titleTemplate,
  titleSeparator,
  description,
  url,
  defaultLocale,
  locale,
  lang,
  identity,
  twitter,
  trailingSlash,
  robots: defaultRobots,
  favicon,
  appleTouchIcon,
  organization,
} = siteMeta

export default defineNuxtConfig({
  // ─── Runtime Config ──────────────────────────────────────────────────────────
  // ⚠️ SECURITY: API keys di `public` terekspos ke client-side bundle.
  // Pindahkan ke server-only jika key ini hanya dipakai di server/API routes.
  runtimeConfig: {
    groqApiKey: process.env.GROQ_API_KEY,
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    public: {
      groqApiKey: process.env.GROQ_API_KEY,
      openrouterApiKey: process.env.OPENROUTER_API_KEY,
      geminiApiKey: process.env.GEMINI_API_KEY,
    },
  },

  // ─── App Head ────────────────────────────────────────────────────────────────
  app: {
    baseURL: '/',
    head: {
      // titleTemplate di-handle oleh nuxt-site-config / useSeoMeta per halaman.
      // Ini adalah fallback untuk halaman yang belum punya title eksplisit.
      titleTemplate: titleTemplate ?? `%s ${titleSeparator} ${title}`,

      htmlAttrs: {
        lang,
      },

      link: [
        { rel: 'icon', type: 'image/x-icon', href: favicon ?? '/favicon.ico' },
        { rel: 'apple-touch-icon', href: appleTouchIcon ?? '/apple-touch-icon.png' },
        // Preconnect ke domain eksternal yang paling sering dipakai
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],

      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: description },
        { name: 'author', content: siteMeta.author },
        { name: 'publisher', content: siteMeta.publisher },
        { name: 'theme-color', content: '#16a34a' }, // green-600 — sesuaikan dengan brand color JuruTani

        // ── Geo Meta Tags (penting untuk local SEO Yogyakarta/Jawa Tengah) ──
        { name: 'geo.region', content: 'ID-YO' },
        { name: 'geo.placename', content: 'Yogyakarta' },
        { name: 'geo.position', content: '-7.6253;110.2921' },
        { name: 'ICBM', content: '-7.6253, 110.2921' },

        // ── Language ──
        { 'http-equiv': 'content-language', content: lang },
      ],
    },
  },

  // ─── Nitro ───────────────────────────────────────────────────────────────────
  nitro: {
    preset: 'node-server',
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
  },

  features: {
    inlineStyles: true,
  },

  // ─── Modules ─────────────────────────────────────────────────────────────────
  modules: [
    '@nuxtjs/mdc',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@vee-validate/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-og-image',
    'nuxt-schema-org',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/supabase',
  ],

  // ─── Supabase ────────────────────────────────────────────────────────────────
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/auth/login', '/auth/callback'],
    },
    useSsrCookies: true,
    redirect: false,
  },

  // ─── Color Mode ──────────────────────────────────────────────────────────────
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },

  // ─── CSS ─────────────────────────────────────────────────────────────────────
  css: ['@/assets/css/tailwind.css'],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  // ─── Nuxt Image ──────────────────────────────────────────────────────────────
  image: {
    format: ['avif', 'webp', 'png', 'jpg'],
    provider: 'ipx',
    quality: 85,
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 80,
          height: 80,
        },
      },
      thumbnail: {
        modifiers: {
          format: 'webp',
          width: 400,
          height: 225, // 16:9
          fit: 'cover',
        },
      },
      og: {
        modifiers: {
          format: 'jpg',
          width: 1200,
          height: 630,
          fit: 'cover',
        },
      },
    },
    domains: [
      'images.unsplash.com',
      'fakestoreapi.com',
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
      'gravatar.com',
      // Supabase storage — ganti <project-ref> dengan ref project kamu
      // 'xxxxxxxxxxx.supabase.co',
    ],
    alias: {
      unsplash: 'https://images.unsplash.com',
    },
  },

  // ─── VeeValidate ─────────────────────────────────────────────────────────────
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },

  // ─── Vite ────────────────────────────────────────────────────────────────────
  vite: {
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor',
      ],
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.message.includes('imported from external module') &&
            warning.message.includes('never used in')
          ) {
            return
          }
          warn(warning)
        },
      },
    },
  },

  sourcemap: {
    client: false,
    server: false,
  },

  // ─── Route Rules ─────────────────────────────────────────────────────────────
  routeRules: {
    // Halaman yang tidak boleh diindex (bukan halaman publik)
    '/hidden': { robots: false },
    '/auth/**': { robots: false },

    // Static assets — cache immutable 1 tahun
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/og/**': { headers: { 'cache-control': 'public, max-age=86400' } }, // OG images: cache 1 hari

    // Security headers global
    // ℹ️ CSP masih Report-Only — ubah ke 'Content-Security-Policy' setelah semua
    // third-party scripts (analytics, hotjar, dll) sudah dikonfirmasi & diwhitelist.
    '/**': {
      headers: {
        'Content-Security-Policy-Report-Only': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: https:",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self' wss: https:",
          "frame-src 'self' https:",
          "media-src 'self' https:",
          "worker-src 'self' blob:",
        ].join('; '),
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
      },
    },
  },

  // ─── nuxt-site-config (via @nuxtjs/sitemap, robots, og-image, schema-org) ───
  site: {
    url,
    name: title,
    description,
    defaultLocale,
    locale,
    identity,
    twitter,
    trailingSlash,
    titleSeparator,
    indexable: true,
  },

  // ─── Robots ──────────────────────────────────────────────────────────────────
  robots: {
    blockNonSeoBots: true,
    // Disallow halaman private secara eksplisit
    disallow: [
      '/auth/',
      '/profile/',
      '/setting/',
      '/history/',
      '/chat/',
    ],
  },

  // ─── Sitemap ─────────────────────────────────────────────────────────────────
  sitemap: {
    xsl: false,
    strictNuxtContentPaths: true,
    // Exclude private pages dari sitemap
    exclude: [
      '/auth/**',
      '/profile/**',
      '/setting/**',
      '/history/**',
    ],
  },

  // ─── Schema.org (nuxt-schema-org) ────────────────────────────────────────────
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: organization.name,
      url,
      logo: organization.logo,
      sameAs: organization.sameAs,
    },
  },

  // ─── OG Image (nuxt-og-image / Satoru) ───────────────────────────────────────
  ogImage: {
    // Komponen OgImage* di components/OgImage/ akan di-auto-discover
    // Satoru akan pakai komponen yang di-define via defineOgImageComponent()
    componentDirs: ['OgImage'],
    defaults: {
      width: 1200,
      height: 630,
      extension: 'jpg',
    },
  },

  // ─── ESLint ──────────────────────────────────────────────────────────────────
  eslint: {},

  // ─── Compatibility ───────────────────────────────────────────────────────────
  compatibilityDate: '2026-01-14',

  devtools: {
    enabled: true,
  },
})