// https://nuxt.com/docs/api/configuration/nuxt-config
import siteMeta from './app/site'
const {
  title,
  description,
  url,
  defaultLocale,
  identity,
  twitter,
  trailingSlash,
  titleSeparator,
} = siteMeta

export default defineNuxtConfig({
  runtimeConfig: {
    // Private keys are only available on the server
    groqApiKey: process.env.GROQ_API_KEY,
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    public: {
      // Public keys that are also exposed to the client
      groqApiKey: process.env.GROQ_API_KEY,
      openrouterApiKey: process.env.OPENROUTER_API_KEY,
      geminiApiKey: process.env.GEMINI_API_KEY
    }
  },

  app: {
    baseURL: '/',
    head: {
      titleTemplate: `%s ${titleSeparator} ${title}`,
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      meta: [
        { name: 'description', content: description },
      ],
    },
  },

  nitro: {
    preset: 'node-server',
  },

  features: {
    inlineStyles: true,
  },

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

  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/auth/login', '/auth/callback']
    },
    useSsrCookies: true,
    redirect: false,
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },

  css: [
    '@/assets/css/tailwind.css',
  ],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  image: {
    format: ['avif', 'webp', 'png', 'jpg'],
    provider: 'ipx',
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 80,
          height: 80,
        },
      },
    },

    domains: [
      'images.unsplash.com',
      'fakestoreapi.com',
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
      'gravatar.com',
    ],

    alias: {
      unsplash: 'https://images.unsplash.com',
    },
  },

  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },

  imports: {
  },

  vite: {
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor'
      ]
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.message.includes('imported from external module') && warning.message.includes('never used in')) {
            return
          }
          warn(warning)
        }
      }
    }
  },

  sourcemap: {
    client: false,
    server: false,
  },

  routeRules: {
    '/hidden': { robots: false },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/**': {
      headers: {
        'Content-Security-Policy-Report-Only': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' wss: https:; font-src 'self' data: https:; frame-src 'self' https:;",
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'X-Frame-Options': 'SAMEORIGIN'
      }
    }
  },

  site: {
    url,
    name: title,
    description,
    defaultLocale,
    identity,
    twitter,
    trailingSlash,
    titleSeparator,
  },

  robots: {
    blockNonSeoBots: true,
  },

  sitemap: {
    xsl: false,
    strictNuxtContentPaths: true,
  },

  eslint: {
  },

  compatibilityDate: '2026-01-14',

  devtools: {
    enabled: true,
  },
})
