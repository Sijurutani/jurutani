/**
 * Nitro Plugin: WebSocket polyfill untuk @supabase/realtime-js
 *
 * Node.js < 22 tidak punya WebSocket global, dan @supabase/realtime-js
 * menggunakan `class X extends WebSocket` yang crash jika global tidak ada.
 *
 * Node 22+ sudah punya WebSocket native — plugin ini hanya aktif jika belum ada.
 * 'ws' dikonfigurasi sebagai external di Nitro agar CJS export-nya tetap
 * sebagai class constructor (bukan ESM namespace object).
 */
export default defineNitroPlugin(async () => {
  if (typeof globalThis.WebSocket === 'undefined') {
    try {
      const wsModule = await import('ws')
      // ws adalah CJS package — default export adalah class-nya.
      // Saat external: wsModule.default = WebSocket class
      // Defensive: fallback ke wsModule jika .default tidak ada
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
