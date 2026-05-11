# Jurutani Client App - Stabilization & Refactor Plan

## 🚨 URGENT: Broken Dependencies (Must Fix Now)
Berdasarkan pembersihan package ekstensif yang baru saja kita lakukan, aplikasi saat ini **PASTI MENGALAMI ERROR (500 Server Error atau Client Build Fail)** karena beberapa modul masih di-import di dalam kode:

1. **VueUse (`@vueuse/core` & `@vueuse/router`)**
   - **Lokasi Error:** Banyak file yang masih menggunakan `watchDebounced`, `useRouteQuery`, dan `useIntersectionObserver`. Contoh: `app/pages/history/index.vue`, `videos/index.vue`, `markets/index.vue`, dan `discussions/index.vue`.
   - **Solusi A (Refactor Native):** Buat implementasi custom untuk debounce, baca/tulis query parameter menggunakan native `vue-router` (`useRoute().query`), dan gunakan standar `IntersectionObserver` Web API.
   - **Solusi B (Quick Fix):** Jika fitur ini sangat kompleks dan memakan waktu untuk di-refactor, Anda harus menginstal kembali core-nya saja: `pnpm add -D @vueuse/core @vueuse/router` (tanpa perlu module nuxt-nya).

2. **Nuxt MDC (`@nuxtjs/mdc`)**
   - **Lokasi Error:** Komponen `<MDC>` masih dirender secara langsung di dalam `app/components/Features/Chatbot/MessageList.vue` (baris 121) untuk mem-parsing balasan markdown dari AI.
   - **Solusi:** Karena modulnya telah dicabut, Anda harus menggantinya. Gunakan library markdown parser vanilla seperti `marked` + `dompurify` (di-render via `v-html`), atau pasang ulang `@nuxtjs/mdc` murni hanya untuk fitur chatbot ini.

---

## 🛠️ REFACTOR PENSTABILAN (Langkah Berurutan)

### Fase 1: Resolve Compilation Errors (Segera Lakukan)
Fokus pertama adalah membuat command `pnpm dev` berjalan normal tanpa *crash* di terminal.
1. Putuskan apakah akan melakukan **Solusi A** atau **Solusi B** untuk masalah `VueUse` dan `MDC` di atas.
2. Hapus atau sesuaikan sisa kode yang rusak.

### Fase 2: Modernisasi SEO
Kita sudah menggunakan `@nuxtjs/seo`, saatnya membuang *tech debt* SEO yang lama.
1. Hapus file konfigurasi statis `app/site.ts`. Setel environment variable `NUXT_PUBLIC_SITE_URL=https://jurutani.com` di `.env` agar modul SEO baru langsung otomatis mendeteksi konfigurasi domain.
2. Hapus utility buatan lama `app/utils/seo.ts`. Mulai migrasikan semua halaman dan layout untuk murni memanggil `useSeoMeta()` dan `defineOgImage()` yang jauh lebih kuat dan *type-safe* bawaan dari Nuxt.

### Fase 3: Pencopotan Tiptap (Diet Bundle Size)
Sesuai dengan niat Anda membersihkan "yang tidak kepake di client app":
1. Aplikasi Klien biasanya **hanya membaca (read-only)** artikel/course, bukan menulisnya.
2. Hapus seluruh keluarga dependensi `@tiptap/*` dari `package.json`.
3. Refactor komponen yang sebelumnya merender Tiptap menjadi *read-only view* (seperti `app/composables/useTiptapContent.ts` dan `app/components/App/ContentViewer.vue`) menjadi rendering HTML mentah standar. Ini akan memangkas ukuran load page klien Anda secara masif!
