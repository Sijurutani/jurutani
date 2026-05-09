import { createRequire } from 'node:module'

/**
 * Nitro Plugin: CJS & WebSocket Polyfill
 *
 * 1. Polyfill `require` untuk package CJS (@supabase/realtime-js) yang
 *    dijalankan di lingkungan ESM Nitro (mencegah "require is not defined").
 * 2. Polyfill global WebSocket untuk Node < 22.
 */
export default defineNitroPlugin(async () => {
  // --- 1. Polyfill `require` untuk ESM ---
  if (typeof globalThis.require === 'undefined') {
    globalThis.require = createRequire(import.meta.url)
    console.info('[ws-polyfill] Injecting global require() for ESM compatibility')
  }

  // --- 2. Polyfill WebSocket ---
  if (typeof globalThis.WebSocket === 'undefined') {
    try {
      const wsModule = await import('ws')
      const WS = (wsModule.default ?? wsModule) as unknown as typeof WebSocket
      globalThis.WebSocket = WS
      console.info('[ws-polyfill] WebSocket global dipatch menggunakan ws package')
    } catch (e) {
      console.warn('[ws-polyfill] Gagal load ws package:', e)
    }
  } else {
    console.info('[ws-polyfill] WebSocket native tersedia, skip patch')
  }
})
