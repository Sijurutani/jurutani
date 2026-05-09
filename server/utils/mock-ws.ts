/**
 * Mock file untuk package 'ws' (WebSocket).
 * Digunakan oleh Nitro alias untuk mencegah error saat bundling
 * @supabase/realtime-js di server-side (Node ESM).
 */
export default class WebSocket {
  constructor() {
    console.warn('[mock-ws] WebSocket diinisialisasi di server. SSR tidak mendukung WebSockets.')
  }
}
