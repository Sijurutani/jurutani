/**
 * Thin wrapper agar kode lama yang menggunakan useSupabase() tetap berjalan.
 * Menggunakan @nuxtjs/supabase client (auto-configured via SUPABASE_URL + SUPABASE_KEY env).
 */
export const useSupabase = () => ({
  supabase: useSupabaseClient(),
})