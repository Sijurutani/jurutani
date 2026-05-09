/**
 * Nitro Plugin: WebSocket polyfill untuk @supabase/realtime-js
 *
 * @nuxtjs/supabase menggunakan @supabase/realtime-js yang memanggil native
 * WebSocket. Di Node.js < 22, WebSocket global tidak tersedia, dan package
 * lama menggunakan require("ws") yang gagal di lingkungan ESM Nitro.
 *
 * Plugin ini memastikan globalThis.WebSocket tersedia sebelum Supabase
 * terinisialisasi, menggunakan dynamic import (ESM-safe).
 */
export default defineNitroPlugin(async () => {
  // Node 22+ sudah punya WebSocket global natively — hanya patch jika belum ada
  if (typeof globalThis.WebSocket === 'undefined') {
    try {
      const { default: ws } = await import('ws')
      // @ts-ignore — patch global untuk kompatibilitas Supabase Realtime
      globalThis.WebSocket = ws
      console.info('[ws-polyfill] WebSocket global dipatch menggunakan ws package')
    } catch (e) {
      console.warn('[ws-polyfill] Gagal load ws package:', e)
    }
  }
})
