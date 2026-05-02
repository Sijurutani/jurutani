# Panduan SEO Google Terbaru (Update 2026)

Dokumen ini berisi ringkasan aturan dan praktik terbaik SEO terbaru untuk memastikan website memiliki performa optimal di hasil pencarian Google, dengan fokus pada _Helpful Content_, _User Experience_, dan _Technical Excellence_.

---

## 1. Core Web Vitals (CWV) & Performance

Google telah memperbarui metrik performa utama. Pastikan aplikasi (terutama yang berbasis framework modern seperti Nuxt/Vue) memenuhi standar berikut:

- **INP (Interaction to Next Paint):** Menggantikan FID. Mengukur responsivitas halaman secara keseluruhan selama kunjungan pengguna. Skor ideal: **< 200ms**.
- **LCP (Largest Contentful Paint):** Waktu loading elemen visual terbesar. Skor ideal: **< 2.5 detik**.
- **CLS (Cumulative Layout Shift):** Stabilitas visual saat loading. Skor ideal: **< 0.1**.

## 2. Strategi Konten: E-E-A-T & Helpful Content

Google memprioritaskan konten yang dibuat untuk manusia, bukan mesin pencari.

- **Experience (Pengalaman):** Sertakan bukti bahwa penulis memiliki pengalaman nyata (misal: studi kasus, foto asli, atau pengujian langsung).
- **Expertise (Keahlian):** Tunjukkan kredibilitas penulis dalam topik tersebut.
- **Authoritativeness (Otoritas):** Reputasi website di bidangnya.
- **Trustworthiness (Kepercayaan):** Faktor terpenting. Pastikan data akurat, sumber jelas, dan website aman (HTTPS).

## 3. Optimasi Meta & On-Page (Aturan 2026)

Meskipun setiap alat _checker_ berbeda, ikuti standar piksel Google terbaru:

- **Title Tag:** - Panjang ideal: **50-60 karakter** (sekitar 580px).
  - Masukkan kata kunci utama di awal kalimat.
- **Meta Description:**
  - Panjang ideal: **120-155 karakter**.
  - Fokus pada _Click-Through Rate_ (CTR) dengan kalimat ajakan (CTA).
- **Semantic HTML:** Gunakan struktur `<h1>` hingga `<h6>` secara logis. Gunakan tag `<article>`, `<section>`, dan `<nav>` untuk membantu bot memahami struktur halaman.

## 4. Technical SEO untuk Framework Modern

Untuk aplikasi berbasis JavaScript (Nuxt, Vue, dsb):

- **Server-Side Rendering (SSR):** Wajib digunakan untuk halaman publik agar konten dapat di-_crawl_ dengan sempurna oleh Googlebot.
- **Schema Markup (JSON-LD):** Implementasikan _Structured Data_ untuk artikel, produk, atau organisasi agar muncul di _Rich Snippets_.
- **Sitemap & Robots.txt:** Pastikan sitemap dinamis terupdate otomatis saat ada konten baru.

## 5. Mobile-First Indexing & Accessibility

- **Responsivitas:** Website harus berfungsi sempurna di perangkat mobile.
- **Accessibility (A11y):** Kontras warna yang baik, ukuran font yang terbaca (min 16px), dan penggunaan `alt text` pada gambar bukan lagi sekadar opsional, melainkan sinyal kualitas website.

## 6. AI-Generated Content Policy

Google tidak melarang penggunaan AI, namun:

- Konten harus diedit ulang oleh manusia untuk memastikan akurasi.
- Hindari konten yang hanya bersifat "generative spam".
- Fokus pada memberikan nilai tambah yang tidak bisa diberikan oleh AI mentah.

---

_Terakhir diperbarui: Mei 2026_
