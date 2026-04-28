# 🌾 JuruTani — Lighthouse Audit Implementation Plan

> **Tanggal Audit:** 2026-04-28  
> **URL:** JuruTani Web App (Production)  
> **Tool:** Google Lighthouse  
> **Catatan:** Audit dijalankan dengan Chrome Extension aktif — hasil mungkin sedikit lebih buruk dari kondisi sebenarnya. Ulangi audit di Incognito Mode untuk hasil akurat.

---

## 📊 Ringkasan Skor Audit

| Kategori | Skor | Status |
|---|---|---|
| ⚡ Performance | **17 / 100** | 🔴 Kritis |
| ♿ Accessibility | **86 / 100** | 🟡 Perlu Perbaikan |
| ✅ Best Practices | **88 / 100** | 🟡 Perlu Perbaikan |

### Metrik Inti (Core Web Vitals)

| Metrik | Nilai | Target | Status |
|---|---|---|---|
| First Contentful Paint (FCP) | 5.1 s | < 1.8 s | 🔴 |
| Largest Contentful Paint (LCP) | 54.5 s | < 2.5 s | 🔴 |
| Total Blocking Time (TBT) | 990 ms | < 200 ms | 🔴 |
| Cumulative Layout Shift (CLS) | 0.353 | < 0.1 | 🔴 |
| Speed Index (SI) | 11.6 s | < 3.4 s | 🔴 |

---

## ⚡ PERFORMANCE (Skor: 17)

### P1 — KRITIS (Harus dikerjakan pertama)

---

#### [ ] 1. Perbaiki Largest Contentful Paint (LCP: 54.5s)

- **Estimasi Dampak:** Sangat Tinggi  
- **Sumber Masalah:** Render-blocking requests, gambar tidak dioptimasi, LCP element lambat ditemukan
- **Langkah:**
  - [ ] Identifikasi elemen LCP (biasanya hero image atau heading utama)
  - [ ] Tambahkan `rel="preload"` untuk LCP image di `<head>`
  - [ ] Pastikan LCP image bukan lazy-loaded (`loading="lazy"` → hapus untuk LCP element)
  - [ ] Gunakan `fetchpriority="high"` pada LCP image
  - [ ] Audit LCP request discovery chain — minimasi redirect dan chain panjang

---

#### [ ] 2. Hilangkan Render-Blocking Requests

- **Estimasi Simpanan:** ~2,960 ms  
- **Langkah:**
  - [ ] Identifikasi CSS/JS yang memblokir render di Lighthouse "Render-blocking requests" panel
  - [ ] Pindahkan CSS non-kritis ke `<link rel="preload">` atau inline critical CSS
  - [ ] Tambahkan `defer` atau `async` pada script non-kritis
  - [ ] Pertimbangkan code-splitting di Nuxt (`defineAsyncComponent`, dynamic `import()`)

---

#### [ ] 3. Optimalkan Pengiriman Gambar

- **Estimasi Simpanan:** ~8,673 KiB  
- **Langkah:**
  - [ ] Konversi semua gambar ke format **WebP** atau **AVIF**
  - [ ] Gunakan komponen `<NuxtImg>` / `<NuxtPicture>` dari `@nuxt/image` untuk otomasi konversi & resize
  - [ ] Pastikan `@nuxt/image` sudah dikonfigurasi dengan provider yang tepat (Cloudinary / IPX / dll)
  - [ ] Tambahkan atribut `width` dan `height` eksplisit pada semua `<img>` (lihat juga item CLS)
  - [ ] Implementasi `loading="lazy"` pada gambar di bawah fold
  - [ ] Gunakan `sizes` attribute untuk responsive images

---

#### [ ] 4. Perbaiki Cache Lifetime

- **Estimasi Simpanan:** ~9,929 KiB  
- **Langkah:**
  - [ ] Set HTTP header `Cache-Control` dengan TTL panjang untuk aset statis (JS, CSS, fonts, images):
    ```
    Cache-Control: public, max-age=31536000, immutable
    ```
  - [ ] Pastikan aset statis menggunakan content hash di nama file (Nuxt melakukan ini secara otomatis)
  - [ ] Konfigurasi di `nitro.routeRules` di `nuxt.config.ts`:
    ```ts
    routeRules: {
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    }
    ```

---

### P2 — TINGGI

---

#### [ ] 5. Kurangi Total Blocking Time (TBT: 990ms)

- **Langkah:**
  - [ ] Kurangi JavaScript execution time (lihat item 6)
  - [ ] Audit long tasks (lihat item 10)
  - [ ] Pertimbangkan Web Workers untuk komputasi berat
  - [ ] Pecah bundle JS besar menjadi chunk yang lebih kecil

---

#### [ ] 6. Kurangi JavaScript Execution Time (4.2s)

- **Langkah:**
  - [ ] Jalankan `nuxt analyze` untuk melihat bundle breakdown
  - [ ] Identifikasi library besar yang bisa diganti dengan alternatif lebih ringan
  - [ ] Gunakan `defineAsyncComponent()` untuk komponen yang tidak dibutuhkan saat render awal
  - [ ] Audit dependency: hapus package yang tidak terpakai

---

#### [ ] 7. Kurangi JavaScript Tidak Terpakai

- **Estimasi Simpanan:** ~680 KiB  
- **Langkah:**
  - [ ] Gunakan dynamic import untuk modul yang hanya dibutuhkan di halaman tertentu
  - [ ] Periksa apakah ada library yang di-import seluruhnya padahal hanya dipakai sebagian (misalnya: lodash → lodash-es dengan tree-shaking)
  - [ ] Aktifkan tree-shaking yang proper di Nuxt/Vite

---

#### [ ] 8. Kurangi CSS Tidak Terpakai

- **Estimasi Simpanan:** ~37 KiB  
- **Langkah:**
  - [ ] Pastikan konfigurasi `content` di `tailwind.config` mencakup semua file Vue/TS
  - [ ] Hapus CSS global yang sudah tidak relevan

---

#### [ ] 9. Perbaiki Cumulative Layout Shift (CLS: 0.353)

- **Langkah:**
  - [ ] **Tambahkan `width` dan `height` eksplisit pada semua elemen `<img>`** — ini adalah penyebab CLS paling umum
  - [ ] Audit "Layout shift culprits" di Lighthouse untuk identifikasi elemen spesifik
  - [ ] Tambahkan skeleton / placeholder dengan dimensi yang sama sebelum konten dimuat
  - [ ] Hindari menyisipkan konten di atas konten yang sudah ada (mis: banner, ads)
  - [ ] Pastikan font tidak menyebabkan layout shift — gunakan `font-display: optional` atau `swap` dengan size-adjust

---

### P3 — SEDANG

---

#### [ ] 10. Hindari Long Main-Thread Tasks (20 tasks ditemukan)

- **Langkah:**
  - [ ] Buka Chrome DevTools → Performance tab → rekam dan identifikasi task panjang
  - [ ] Pecah task > 50ms menggunakan `setTimeout`, `requestIdleCallback`, atau `scheduler.postTask`
  - [ ] Pertimbangkan penggunaan `useAsyncData` yang benar di Nuxt agar data fetching tidak memblokir

---

#### [ ] 11. Gunakan Modern HTTP (HTTP/2 atau HTTP/3)

- **Estimasi Simpanan:** ~470 ms  
- **Langkah:**
  - [ ] Verifikasi server/hosting mendukung HTTP/2 (cek di DevTools → Network → Protocol)
  - [ ] Jika menggunakan Vercel/Netlify/Cloudflare — biasanya sudah HTTP/2 by default
  - [ ] Jika self-hosted: aktifkan HTTP/2 di Nginx/Caddy config

---

#### [ ] 12. Minifikasi JavaScript

- **Estimasi Simpanan:** ~11 KiB  
- **Langkah:**
  - [ ] Pastikan build production (`nuxt build`) dijalankan — bukan `nuxt dev`
  - [ ] Verifikasi bahwa Vite/Rollup melakukan minifikasi (default: aktif di production build)
  - [ ] Cek apakah ada file JS yang di-serve tanpa minifikasi (mis: dari folder `/public`)

---

#### [ ] 13. Hindari Payload Jaringan yang Besar (Total: 16,160 KiB)

- **Langkah:**
  - [ ] Review semua aset yang diunduh — target total payload < 1,600 KiB
  - [ ] Kombinasikan dengan perbaikan gambar (item 3) dan JavaScript (item 7)
  - [ ] Aktifkan Gzip atau Brotli compression di server

---

#### [ ] 14. Hindari Non-Composited Animations (96 elemen)

- **Langkah:**
  - [ ] Ganti animasi yang menggunakan `top`, `left`, `width`, `height`, `margin` dengan `transform` dan `opacity`
  - [ ] Audit komponen animasi — pastikan hanya properti compositable yang dianimasikan
  - [ ] Tambahkan `will-change: transform` pada elemen yang sering dianimasikan (gunakan dengan hemat)

---

#### [ ] 15. Optimalkan DOM Size

- **Langkah:**
  - [ ] Target: < 1,500 node DOM
  - [ ] Implementasi virtual scrolling untuk list panjang (`vue-virtual-scroller` atau `@tanstack/vue-virtual`)
  - [ ] Gunakan `v-if` bukan `v-show` untuk elemen yang jarang tampil

---

#### [ ] 16. Aktifkan Back/Forward Cache (bfcache)

- **2 failure reasons ditemukan**  
- **Langkah:**
  - [ ] Buka Lighthouse "Back/forward cache" detail untuk melihat reason spesifik
  - [ ] Hindari penggunaan `unload` event listener
  - [ ] Hindari Cache-Control: no-store pada halaman utama
  - [ ] Pastikan tidak ada `SharedArrayBuffer` atau lock yang aktif saat navigasi

---

## ♿ ACCESSIBILITY (Skor: 86)

---

#### [ ] 17. Tombol Tanpa Accessible Name

- **Dampak:** Pengguna screen reader tidak bisa memahami fungsi tombol  
- **Langkah:**
  - [ ] Cari semua `<button>` dan `<UButton>` tanpa teks visible atau `aria-label`
  - [ ] Tambahkan `aria-label="Deskripsi aksi"` pada icon-only buttons
  - [ ] Contoh fix:
    ```html
    <!-- Sebelum -->
    <button><Icon name="heroicons:x-mark" /></button>
    
    <!-- Sesudah -->
    <button aria-label="Tutup menu"><Icon name="heroicons:x-mark" /></button>
    ```

---

#### [ ] 18. Kontras Warna Tidak Cukup

- **Langkah:**
  - [ ] Gunakan DevTools → Accessibility → Color Contrast checker
  - [ ] Target rasio: **4.5:1** untuk teks normal, **3:1** untuk teks besar
  - [ ] Audit palette warna brand JuruTani — terutama teks hijau muda di background putih
  - [ ] Perhatikan dark mode — kontras sering bermasalah di mode gelap

---

#### [ ] 19. Touch Target Terlalu Kecil

- **Langkah:**
  - [ ] Pastikan semua elemen interaktif (button, link, input) minimal **44×44px** (Apple) atau **48×48px** (Google)
  - [ ] Tambahkan padding jika elemen secara visual lebih kecil:
    ```css
    .icon-btn {
      padding: 12px;
      min-width: 44px;
      min-height: 44px;
    }
    ```

---

#### [ ] 20. Link Identik dengan Tujuan Sama

- **Langkah:**
  - [ ] Audit link dengan teks "Baca selengkapnya", "Lihat detail", dll yang merujuk ke URL berbeda
  - [ ] Tambahkan context tersembunyi menggunakan `<span class="sr-only">` atau `aria-label`:
    ```html
    <a href="/berita/123" aria-label="Baca selengkapnya tentang Harga Cabai Naik">
      Baca selengkapnya
    </a>
    ```

---

## ✅ BEST PRACTICES (Skor: 88)

---

#### [ ] 21. Gambar Ditampilkan dengan Rasio Aspek Salah

- **Langkah:**
  - [ ] Tambahkan `aspect-ratio` CSS atau pastikan `width`/`height` HTML sesuai dengan dimensi gambar asli
  - [ ] Gunakan `object-fit: cover` jika gambar perlu di-crop
  - [ ] Audit komponen card/thumbnail yang mungkin meregangkan gambar

---

#### [ ] 22. Browser Errors di Console

- **Langkah:**
  - [ ] Buka DevTools Console di environment production
  - [ ] Catat dan fix semua error merah (TypeError, ReferenceError, network errors)
  - [ ] Pastikan tidak ada uncaught promise rejections

---

#### [ ] 23. Issues di Chrome DevTools Issues Panel

- **Langkah:**
  - [ ] Buka DevTools → Issues tab
  - [ ] Kategorikan: Cookie, CORS, Deprecation, CSP
  - [ ] Fix sesuai kategori — biasanya terkait cookie SameSite atau deprecated API

---

#### [ ] 24. Source Maps Tidak Tersedia untuk JS Besar

- **Langkah:**
  - [ ] Untuk development: source maps sudah aktif by default
  - [ ] Untuk production debugging: pertimbangkan upload source maps ke error monitoring (Sentry)
  - [ ] Jangan expose source maps ke public di production

---

### Keamanan

---

#### [ ] 25. Content Security Policy (CSP) — Proteksi XSS

- **Langkah:**
  - [ ] Tambahkan header CSP di `nuxt.config.ts`:
    ```ts
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
        }
      }
    }
    ```
  - [ ] Mulai dengan mode `Content-Security-Policy-Report-Only` untuk audit tanpa blocking
  - [ ] Pertimbangkan package `nuxt-security`

---

#### [ ] 26. HSTS Policy

- **Langkah:**
  - [ ] Tambahkan header Strict-Transport-Security:
    ```
    Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
    ```
  - [ ] Submit domain ke HSTS preload list: https://hstspreload.org

---

#### [ ] 27. Cross-Origin Opener Policy (COOP)

- **Langkah:**
  - [ ] Tambahkan header:
    ```
    Cross-Origin-Opener-Policy: same-origin
    ```

---

#### [ ] 28. X-Frame-Options (XFO) — Proteksi Clickjacking

- **Langkah:**
  - [ ] Tambahkan header:
    ```
    X-Frame-Options: SAMEORIGIN
    ```
  - [ ] Atau via CSP: `frame-ancestors 'self'`

---

#### [ ] 29. Trusted Types — Proteksi DOM-based XSS

- **Langkah:**
  - [ ] Evaluasi apakah aplikasi menggunakan `innerHTML`, `document.write`, atau eval-like patterns
  - [ ] Jika ya, pertimbangkan implementasi Trusted Types policy

---

## 🗂️ Urutan Pengerjaan yang Disarankan

```
Sprint 1 — Performance Kritis (Dampak Terbesar)
├── [3]  Optimasi gambar → WebP + NuxtImg
├── [9]  Fix CLS → tambah width/height pada semua img
├── [2]  Hilangkan render-blocking requests
└── [4]  Perbaiki cache lifetime

Sprint 2 — JavaScript & Loading
├── [6]  Kurangi JS execution time (nuxt analyze)
├── [7]  Kurangi unused JavaScript
├── [8]  Kurangi unused CSS
└── [5]  Kurangi TBT

Sprint 3 — Aksesibilitas & UX
├── [17] Tombol tanpa accessible name
├── [18] Perbaiki kontras warna
├── [19] Touch targets
└── [20] Link identik

Sprint 4 — Keamanan & Best Practices
├── [25] Implementasi CSP
├── [26] HSTS policy
├── [27] COOP header
├── [28] X-Frame-Options
└── [22] Fix browser console errors

Sprint 5 — Optimasi Lanjutan
├── [10] Long main-thread tasks
├── [14] Non-composited animations
├── [15] Optimasi DOM size
└── [16] Back/forward cache
```

---

## 🔧 Tools yang Berguna

| Tool | Kegunaan |
|---|---|
| `nuxt analyze` | Visualisasi bundle size |
| Chrome DevTools → Performance | Audit long tasks & LCP |
| Chrome DevTools → Network | Cek cache headers, HTTP version |
| Chrome DevTools → Issues | Lihat CSP/cookie issues |
| [PageSpeed Insights](https://pagespeed.web.dev) | Audit dari server Google (lebih akurat) |
| [WebPageTest](https://webpagetest.org) | Audit mendalam dengan waterfall |
| [hstspreload.org](https://hstspreload.org) | Submit HSTS preload |
| [squoosh.app](https://squoosh.app) | Konversi gambar ke WebP |

---

## 📝 Catatan Tambahan

- **Audit ulang** selalu di **Incognito Mode** tanpa ekstensi untuk hasil yang akurat
- **PageSpeed Insights** lebih reliable karena dijalankan dari server Google, bukan lokal
- Prioritaskan **LCP** dan **CLS** karena keduanya adalah Core Web Vitals yang mempengaruhi Google Search ranking
- Setelah setiap sprint, lakukan audit ulang dan update skor di tabel ringkasan atas

---

*Last updated: 2026-04-28 | Audit tool: Google Lighthouse*
