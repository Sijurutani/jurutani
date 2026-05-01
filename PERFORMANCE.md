# Analisis Performa Lighthouse JuruTani

Berdasarkan laporan Lighthouse yang Anda lampirkan, skor performa berada pada tingkat yang sangat kritis: **11/100**. Namun, metrik lainnya cukup baik (Aksesibilitas 87, Best Practices 92, SEO 100).

Pesan eror _"The page loaded too slowly to finish within the time limit"_ adalah indikator bahwa halaman memakan waktu terlalu lama untuk dimuat secara penuh sehingga Lighthouse bahkan tidak bisa menyelesaikan proses auditnya tepat waktu.

Berikut adalah analisis mendalam mengapa performa aplikasi sangat buruk, serta solusi komprehensif untuk memperbaikinya.

---

## 1. Analisis Metrik Utama (Core Web Vitals)

Metrik Core Web Vitals adalah indikator pengalaman pengguna yang dilacak oleh Google:

- 🔴 **Largest Contentful Paint (LCP): 9.3 s** (Sangat Buruk)
  Waktu yang dibutuhkan untuk menampilkan elemen terbesar (biasanya gambar hero atau teks utama) di layar. Target yang disarankan adalah < 2.5 detik.
- 🔴 **Total Blocking Time (TBT): 1,850 ms** (Sangat Buruk)
  Waktu saat halaman tidak bisa diinteraksi (di-scroll atau di-klik) karena *main thread* sedang sibuk mengeksekusi tugas lain. Target yang disarankan adalah < 200 ms.
- 🔴 **Cumulative Layout Shift (CLS): 0.398** (Buruk)
  Mengukur seberapa banyak elemen di halaman bergeser tiba-tiba saat dimuat. Target yang disarankan adalah < 0.1.
- 🔴 **Speed Index: 9.9 s** (Sangat Buruk)
  Waktu yang menunjukkan seberapa cepat konten halaman terlihat oleh pengguna.
- 🟠 **First Contentful Paint (FCP): 1.7 s** (Cukup/Sedang)
  Waktu saat teks atau gambar pertama kali muncul.

---

## 2. Mengapa Performanya Sangat Buruk? (Akar Masalah)

Berdasarkan *Insights* dan *Diagnostics*, berikut adalah biang kerok utama lambatnya halaman ini:

### A. Beban Kerja Main Thread Sangat Berat (Minimize main-thread work: 12.4 s)
Browser menghabiskan lebih dari 12 detik di *main thread*. Ini terutama disebabkan oleh eksekusi JavaScript (2.2 s) dan "17 long main-thread tasks". Jika *main thread* sibuk, browser tidak bisa menggambar halaman atau merespon klik pengguna, yang menyebabkan halaman terasa "nge-hang" atau "lag".

### B. Payload Jaringan Raksasa (Avoid enormous network payloads: 9,673 KiB / ~9.6 MB)
Halaman ini mengunduh hampir **10 Megabyte** data! Ini sangat mematikan bagi pengguna dengan koneksi internet standar (terutama di HP). Sebagian besar muatan raksasa ini berasal dari gambar yang tidak teroptimasi (potensi hemat 1.5 MB) serta JavaScript yang tidak digunakan (potensi hemat 683 KiB).

### C. Masalah Rendering (Render-blocking requests & Layout Shifts)
Terdapat file JS/CSS yang memblokir rendering halaman awal (memakan waktu ~570ms sebelum apapun bisa tampil). Selain itu, CLS tinggi diakibatkan oleh *Forced reflow* dan gambar yang tidak memiliki atribut dimensi (`width` & `height`) eksplisit.

### D. Infrastruktur & Respon Server Lambat
*Document request latency* (1.1 detik) menunjukkan respons awal server (TTFB) sangat lambat. Peringatan *Modern HTTP* juga menandakan bahwa web Anda mungkin masih menggunakan HTTP/1.1 yang lambat saat memuat banyak aset secara bersamaan, bukan HTTP/2 atau HTTP/3.

---

## 3. Tips & Solusi Optimasi (Action Plan)

Berikut adalah panduan perbaikan yang diurutkan dari dampak paling besar dan paling cepat (*Quick Wins*):

### Prioritas 1: Optimasi Aset dan Jaringan (Solusi LCP & Payload)
1. **Format Gambar Modern:** Konversi semua gambar ke format WebP atau AVIF. Ini bisa memangkas ukuran gambar hingga 50-70%.
2. **Lazy Loading:** Tambahkan atribut `loading="lazy"` pada gambar yang tidak terlihat saat halaman pertama kali dibuka (*below the fold*).
3. **Bereskan Dimensi Gambar:** Pastikan semua tag `<img>` memiliki atribut `width` dan `height` secara eksplisit. Hal ini akan memecahkan peringatan *"Image elements do not have explicit width and height"* sekaligus mengatasi masalah **CLS (Layout Shift)** secara instan.
4. **Implementasi HTTP/2 atau HTTP/3:** Konfigurasikan server (Nginx/Apache/CDN) untuk menggunakan HTTP/2. Ini akan menyelesaikan masalah "Modern HTTP".

### Prioritas 2: Optimasi Kode & Eksekusi (Solusi TBT & Main-Thread)
1. **Code Splitting & Tree Shaking:** Jangan muat seluruh kode JavaScript aplikasi di halaman pertama. Gunakan *dynamic import* untuk memuat modul JS hanya jika diperlukan. Ini akan mengatasi masalah *"Reduce unused JavaScript"*.
2. **Tunda Skrip Non-Kritis:** Gunakan atribut `defer` atau `async` pada tag `<script>` pihak ketiga (seperti analitik, widget chat). Ini akan menyelesaikan masalah *"Render-blocking requests"*.
3. **Hapus CSS yang Tidak Dipakai:** Gunakan tool (seperti PurgeCSS jika menggunakan Tailwind) untuk membuang rule CSS yang tidak digunakan.

### Prioritas 3: Stabilitas Layout & Animasi
1. **Animasi Berbasis Compositor:** Anda mendapat peringatan *"Avoid non-composited animations - 98 animated elements found"*. Pastikan animasi CSS Anda HANYA menggunakan properti `transform` (seperti `translate`, `scale`) atau `opacity`. Jangan gunakan `margin`, `top`, `left`, `width`, atau `height` untuk animasi karena akan memaksa browser melakukan *reflow* secara berat berulang-ulang.
2. **Hindari Forced Reflow:** Pastikan kode JavaScript Anda tidak membaca dimensi elemen (misal: `.offsetHeight`) dan langsung menulis ulang stylenya secara berulang-ulang dalam satu frame.
3. **Bereskan Caching:** Atur HTTP headers Cache-Control (`Use efficient cache lifetimes`) agar aset statis (gambar, font, CSS, JS) disimpan di cache browser pengunjung selama beberapa waktu (misalnya 1 tahun untuk aset immutable).

---

### Kesimpulan
Performa saat ini lumpuh akibat **kombinasi ukuran data terlalu besar (hampir 10MB) dan proses eksekusi JS yang sangat berat di browser (12.4s)**. Fokuslah terlebih dahulu pada **mengurangi ukuran aset gambar & JavaScript** serta menerapkan atribut ukuran gambar (`width`/`height`). Langkah sederhana ini biasanya bisa mendongkrak skor Lighthouse dari belasan ke angka 50-60 seketika.

---

## 4. Kasus Khusus: Optimasi Supabase di Halaman Index

Karena halaman `index` Anda memuat banyak *source* dari Supabase, hal tersebut sangat mungkin menjadi penyebab utama bengkaknya ukuran payload (9.6 MB) dan lambatnya LCP. Berikut adalah rekomendasi spesifik untuk kasus ini:

### A. Gunakan Supabase Image Transformations (Wajib untuk Gambar)
Jika Anda menampilkan gambar dari Supabase Storage, **jangan** pernah merender URL gambar aslinya secara langsung jika ukurannya besar. Gunakan fitur transformasi bawaan Supabase untuk memotong dan mengonversi format secara *on-the-fly*:
```javascript
const { data } = supabase.storage
  .from('bucket-name')
  .getPublicUrl('folder/image.jpg', {
    transform: {
      width: 400,
      height: 300,
      quality: 80,
      format: 'webp', // Mengonversi ke WebP otomatis mengurangi size 70%
    },
  })
```

### B. Hindari Mengambil Semua Data (Gunakan Limit & Projection)
Jangan pernah melakukan _fetch_ seluruh baris dari sebuah tabel saat halaman pertama dimuat.
- **Batasi Jumlah (Pagination):** Gunakan `.range(0, 9)` untuk mengambil 10 item pertama saja. Tampilkan sisanya saat *user* melakukan scroll ke bawah (Infinite Scroll).
- **Spesifikkan Kolom:** Jangan menggunakan `.select('*')`. Panggil hanya data yang benar-benar dirender di layar, misalnya `.select('id, nama_produk, harga, gambar_url')`. Ini akan mengecilkan ukuran JSON secara drastis.

### C. Fetch Data via Server (SSR) - Khusus Nuxt/Next.js
Jika Anda me-*request* Supabase sepenuhnya di sisi klien (Client-Side Rendering), browser harus mendownload JS, mengeksekusi JS, lalu baru memanggil data ke Supabase (menyebabkan efek "*loading waterfall*").
- **Solusi:** Karena Anda menggunakan Nuxt.js, pastikan pengambilan data Supabase menggunakan `useAsyncData` atau `useFetch`. Dengan ini, pemanggilan Supabase terjadi di server Node.js dan browser langsung menerima HTML yang sudah berisi data (sangat berdampak pada LCP).

### D. Gunakan "Virtual Scrolling" untuk Data Masif
Peringatan _"Minimize main-thread work 12.4s"_ menandakan browser kelelahan merender DOM HTML. Jika Anda menampilkan lebih dari 50 baris/kartu Supabase sekaligus di layar, *main thread* akan lambat.
- **Solusi:** Implementasikan library **Virtual List** (seperti `vue-virtual-scroller` jika memakai Vue/Nuxt). Teknik ini hanya merender elemen (misal 10 kartu) yang benar-benar sedang terlihat oleh mata *user* di layar, sehingga DOM HTML tetap ringan.
