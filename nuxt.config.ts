// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  site: {
    url: 'https://jurutani.com',
    name: 'JuruTani',
    description: 'Platform penyuluhan pertanian, peternakan, perkebunan, dan perikanan digital Indonesia.',
    defaultLocale: 'id',
  },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/supabase',
  ],
  
  runtimeConfig: {
    public: {
      openweatherApiKey: process.env.NUXT_PUBLIC_OPENWEATHER_API_KEY,
      openweatherBaseUrl: process.env.NUXT_PUBLIC_OPENWEATHER_BASE_URL,
      groqApiKey: process.env.NUXT_PUBLIC_GROQ_API_KEY,
      openrouterApiKey: process.env.NUXT_PUBLIC_OPENROUTER_API_KEY,
      geminiApiKey: process.env.NUXT_PUBLIC_GEMINI_API_KEY,
    },
  },

  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/auth/login', '/auth/callback'],
    },
    useSsrCookies: true,
    redirect: false,
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },

  experimental: {
    appManifest: false, 
  },

  sitemap: {
    // Disable global sources and auto lastmod which often cause virtual file errors during Nitro build
    sources: [],
    autoLastmod: false,
  },

  build: {
    transpile: ['@nuxtjs/seo', '@nuxtjs/sitemap', 'unhead', '@unhead/vue', '@unhead/ssr'],
  },

  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    },
    externals: {
      inline: ['@nuxtjs/seo', '@nuxtjs/sitemap', 'unhead', '@unhead/vue', '@unhead/ssr']
    }
  },

  css: ['@/assets/css/tailwind.css'],

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
  },

  sourcemap: {
    client: false,
    server: false,
  },
  vite: {
    build: {
      sourcemap: false,
    },
    optimizeDeps: {
      include: [
        'snarkdown',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ],
    },
  },
  eslint: {},
  compatibilityDate: '2026-01-14',
})
