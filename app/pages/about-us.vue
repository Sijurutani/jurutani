<script setup lang="ts">
useHead({
  title: 'Tentang JuruTani - Platform Penyuluhan Digital Pertanian Indonesia',
  meta: [
    { name: 'description', content: 'JuruTani adalah inovasi platform penyuluhan digital pertanian dari Politeknik Pembangunan Pertanian Yogyakarta Magelang.' },
    { property: 'og:title', content: 'Tentang JuruTani - Platform Penyuluhan Digital Pertanian' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/jurutani.png' },
  ],
  link: [{ rel: 'canonical', href: 'https://jurutani.id/about-us' }],
})

useSeoOptimized('about')

// ─── Data ─────────────────────────────────────────────────────────────────────

const galleryData = [
  { src: '/gallery/image1.webp', title: 'Layanan Penyuluhan',   desc: 'Konsultasi langsung dengan penyuluh pertanian digital' },
  { src: '/gallery/image2.webp', title: 'Berita Pertanian',     desc: 'Informasi terbaru seputar pertanian dan teknologi' },
  { src: '/gallery/image3.webp', title: 'Marketplace Petani',   desc: 'Jual beli pupuk, bibit, dan hasil panen langsung' },
  { src: '/gallery/image4.webp', title: 'Edukasi & Artikel',    desc: 'Bacaan informatif untuk petani Indonesia' },
  { src: '/gallery/image5.webp', title: 'Kursus & Alat Bantu',  desc: 'Belajar mandiri melalui kursus dan kalkulator tani' },
]

const innovationPoints = [
  { icon: 'i-lucide-message-square', title: 'Konsultasi Digital Real-Time',  desc: 'Akses langsung dengan penyuluh pertanian profesional kapan saja' },
  { icon: 'i-lucide-database',       title: 'Database Komoditas Lengkap',    desc: 'Informasi detail tentang berbagai jenis tanaman dan teknik budidaya' },
  { icon: 'i-lucide-cloud-rain',     title: 'Data Cuaca & Pasar Akurat',     desc: 'Prediksi cuaca harian dan harga komoditas real-time' },
  { icon: 'i-lucide-shopping-cart',  title: 'Marketplace Terintegrasi',      desc: 'Jual-beli hasil panen langsung tanpa perantara' },
  { icon: 'i-lucide-book-open',      title: 'Edukasi & Kursus Pertanian',    desc: 'Materi pembelajaran dari ahli dan praktisi berpengalaman' },
  { icon: 'i-lucide-user',           title: 'Alat Bantu Otomatis',           desc: 'Kalkulator pupuk, prediksi hasil, dan tools analisis' },
]

const platformAdvantages = [
  { icon: 'i-lucide-bar-chart-3',    title: 'Data Terintegrasi & Real-Time', desc: 'Database komoditas, cuaca, dan harga pasar dalam satu platform terpadu' },
  { icon: 'i-lucide-smartphone',     title: 'User-Friendly untuk Semua',     desc: 'Interface intuitif untuk semua tingkat literasi digital petani' },
  { icon: 'i-lucide-headset',        title: 'Penyuluhan Digital 24/7',       desc: 'Akses penyuluh kapan saja via chat, video call, atau forum diskusi' },
  { icon: 'i-lucide-shopping-bag',   title: 'Marketplace Terintegrasi',      desc: 'Jual-beli produk pertanian langsung tanpa perantara' },
  { icon: 'i-lucide-graduation-cap', title: 'Edukasi Berkualitas',           desc: 'Kursus dan artikel edukatif dari ahli pertanian profesional' },
  { icon: 'i-lucide-wrench',         title: 'Tools & Kalkulasi Otomatis',    desc: 'Kalkulator pupuk, prediksi panen, dan analisis keuntungan' },
]

const institutionHighlights = [
  { icon: 'i-lucide-graduation-cap', title: 'Pendidikan Vokasi',       desc: 'Program praktis berbasis industri' },
  { icon: 'i-lucide-search',         title: 'Riset & Inovasi',         desc: 'Penelitian pertanian berkelanjutan' },
  { icon: 'i-lucide-earth',          title: 'Pemberdayaan Masyarakat', desc: 'Solusi nyata untuk petani lokal' },
]

const teamCategories = [
  {
    icon: 'i-lucide-user-search',
    title: 'Mahasiswa Berprestasi',
    items: ['Terpilih dari berbagai program studi', 'Kompetensi teknologi digital terdepan', 'Pemahaman mendalam tentang pertanian', 'Semangat menciptakan dampak sosial'],
  },
  {
    icon: 'i-lucide-user-check',
    title: 'Dosen Pembimbing',
    items: ['Ahli di bidang pertanian dan teknologi', 'Pengalaman puluhan tahun di industri', 'Komitmen pada inovasi berkelanjutan', 'Mentoring profesional untuk tim'],
  },
]

const misi = [
  'Mengembangkan solusi digital yang mudah diakses petani',
  'Menyediakan data real-time untuk keputusan pertanian yang tepat',
  'Membangun komunitas petani yang terhubung dan berdaya',
]
</script>

<template>
  <main class="min-h-screen">

    <!-- ── Hero ────────────────────────────────────────────────────────────── -->
    <header class="relative overflow-hidden bg-linear-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950 pt-20 pb-16">
      <!-- Decorative blobs -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-200/30 dark:bg-emerald-900/20 blur-3xl" />
        <div class="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-green-200/30 dark:bg-green-900/20 blur-3xl" />
      </div>

      <div class="container relative mx-auto px-4 text-center max-w-3xl">
        <NuxtImg src="/jurutani.png" alt="Logo JuruTani" class="w-24 mx-auto mb-6 drop-shadow-xl" />

        <h1 class="text-4xl md:text-6xl font-bold bg-linear-to-r from-green-700 via-emerald-600 to-green-800 bg-clip-text text-transparent leading-tight mb-4">
          Si JuruTani
        </h1>

        <div class="w-16 h-1 rounded-full bg-linear-to-r from-green-500 to-emerald-500 mx-auto mb-6" />

        <p class="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Inovasi digital dari
          <strong class="text-green-700 dark:text-green-400">Politeknik Pembangunan Pertanian Yogyakarta Magelang</strong>
          untuk memajukan pertanian Indonesia menuju era digital yang berkelanjutan.
        </p>
      </div>
    </header>

    <div class="container mx-auto px-4 py-12 space-y-20 max-w-6xl">

      <!-- ── Tentang ─────────────────────────────────────────────────────── -->
      <section aria-labelledby="about-heading">
        <div class="rounded-2xl bg-white dark:bg-gray-900 border border-green-100 dark:border-green-900/60 shadow-sm overflow-hidden">

          <!-- Header section -->
          <div class="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-8 text-center border-b border-green-100 dark:border-green-900/60">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-semibold mb-4">
              <UIcon name="i-lucide-sprout" class="w-3.5 h-3.5" />
              Platform Inovasi Penyuluhan Digital
            </div>
            <h2 id="about-heading" class="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-200">
              Apa itu Si JuruTani?
            </h2>
          </div>

          <div class="p-6 md:p-10 space-y-8">
            <!-- Highlight quote -->
            <p class="text-center text-base md:text-lg font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-xl px-6 py-4">
              <strong>Si JuruTani</strong> menghubungkan teknologi modern dengan kearifan pertanian tradisional Indonesia untuk menciptakan ekosistem pertanian yang berkelanjutan.
            </p>

            <!-- Dua kolom teks -->
            <div class="grid md:grid-cols-2 gap-6 text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              <div class="space-y-4">
                <h3 class="text-lg font-bold text-green-700 dark:text-green-300 flex items-center gap-2">
                  <UIcon name="i-lucide-sprout" class="w-5 h-5 flex-shrink-0" />
                  Lahir dari Pendidikan
                </h3>
                <p>
                  <strong>Si JuruTani</strong> adalah hasil karya inovatif dari mahasiswa dan dosen
                  <strong>Polbangtan Yogyakarta Magelang</strong>. Platform ini dikembangkan untuk menjawab tantangan modernisasi pertanian Indonesia di era digital.
                </p>
                <p>
                  Dengan teknologi digital terdepan, petani dapat mengakses informasi real-time tentang komoditas, data cuaca, harga pasar, dan teknik pertanian berkelanjutan.
                </p>
              </div>
              <div class="space-y-4">
                <h3 class="text-lg font-bold text-green-700 dark:text-green-300 flex items-center gap-2">
                  <UIcon name="i-lucide-user-check" class="w-5 h-5 flex-shrink-0" />
                  Solusi Terpadu
                </h3>
                <p>
                  Bukan sekadar aplikasi mobile — Si JuruTani adalah ekosistem digital yang mengintegrasikan berbagai layanan penyuluhan modern dan menjembatani petani dengan ahli pertanian.
                </p>
                <p>
                  Dengan antarmuka yang intuitif, petani dapat meningkatkan produktivitas, efisiensi, dan keberlanjutan usaha tani mereka secara mandiri.
                </p>
              </div>
            </div>

            <!-- Innovation grid -->
            <div class="rounded-xl bg-green-50/60 dark:bg-green-900/10 border border-green-100 dark:border-green-900/50 p-6">
              <h3 class="text-base font-bold text-green-800 dark:text-green-200 text-center mb-5">
                Inovasi Penyuluhan Digital Kami
              </h3>
              <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div
                  v-for="point in innovationPoints"
                  :key="point.title"
                  class="flex items-start gap-3 p-3 rounded-lg hover:bg-green-100/60 dark:hover:bg-green-800/20 transition-colors"
                >
                  <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <UIcon :name="point.icon" class="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-green-800 dark:text-green-200 leading-snug">{{ point.title }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{{ point.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Gallery ────────────────────────────────────────────────────────── -->
      <section aria-labelledby="gallery-heading">
        <div class="text-center mb-8">
          <h2 id="gallery-heading" class="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-200 mb-2">
            Galeri Inovasi
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Perjalanan pengembangan dan implementasi JuruTani sebagai platform penyuluhan digital pertanian
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(item, i) in galleryData"
            :key="i"
            class="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 aspect-[4/3] bg-green-100 dark:bg-green-900/30"
          >
            <NuxtImg
              :src="item.src"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div class="p-4 text-white">
                <h3 class="font-semibold text-sm mb-0.5">{{ item.title }}</h3>
                <p class="text-xs text-white/80">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Visi & Misi ─────────────────────────────────────────────────── -->
      <section aria-labelledby="vision-heading">
        <div class="grid md:grid-cols-2 gap-6">

          <!-- Visi -->
          <div class="rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-6 md:p-8">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-eye" class="w-5 h-5 text-white" />
              </div>
              <h3 id="vision-heading" class="text-xl font-bold text-green-800 dark:text-green-200">Visi</h3>
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Menjadi platform digital terdepan yang mengintegrasikan teknologi modern dengan praktik pertanian berkelanjutan untuk menciptakan ekosistem pertanian Indonesia yang cerdas, produktif, dan ramah lingkungan.
            </p>
          </div>

          <!-- Misi -->
          <div class="rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-6 md:p-8">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-check-circle-2" class="w-5 h-5 text-white" />
              </div>
              <h3 class="text-xl font-bold text-green-800 dark:text-green-200">Misi</h3>
            </div>
            <ul class="space-y-3">
              <li
                v-for="item in misi"
                :key="item"
                class="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300"
              >
                <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ── Keunggulan Platform ────────────────────────────────────────────── -->
      <section aria-labelledby="advantages-heading">
        <div class="text-center mb-8">
          <h2 id="advantages-heading" class="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-200 mb-2">
            Keunggulan Kompetitif JuruTani
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Fitur-fitur unggulan yang dirancang khusus untuk kebutuhan petani Indonesia
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="f in platformAdvantages"
            :key="f.title"
            class="group rounded-xl bg-white dark:bg-gray-900 border border-green-100 dark:border-green-900/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col gap-3"
          >
            <div class="w-11 h-11 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UIcon :name="f.icon" class="w-5 h-5 text-white" />
            </div>
            <h3 class="font-semibold text-green-800 dark:text-green-200 text-sm leading-snug">{{ f.title }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>
      </section>

      <!-- ── Sponsor / Institusi ────────────────────────────────────────────── -->
      <section aria-labelledby="sponsor-heading">
        <div class="rounded-2xl bg-white dark:bg-gray-900 border border-green-100 dark:border-green-900/60 shadow-sm overflow-hidden">
          <div class="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-6 border-b border-green-100 dark:border-green-900/60 text-center">
            <h2 id="sponsor-heading" class="text-xl md:text-2xl font-bold text-green-800 dark:text-green-200 mb-1">
              Institusi Pengembang & Mitra Strategis
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Dukungan penuh dari institusi pendidikan dan organisasi strategis</p>
          </div>

          <div class="p-6 md:p-10 flex flex-col items-center gap-6">
            <NuxtImg
              src="/logo/sponsor.png"
              alt="Polbangtan Yogyakarta Magelang"
              class="max-h-20 object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
            <div class="text-center">
              <h3 class="font-semibold text-green-800 dark:text-green-200 mb-1">Polbangtan YoMa</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Politeknik Pembangunan Pertanian Yogyakarta Magelang</p>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center max-w-2xl border-t border-green-100 dark:border-green-900/50 pt-6">
              <strong>JuruTani</strong> adalah produk dari komitmen Polbangtan Yogyakarta Magelang dalam mengembangkan inovasi berdampak bagi pertanian Indonesia. Melalui kolaborasi mahasiswa, dosen, dan mitra industri, platform ini terus berkembang memberikan manfaat bagi petani.
            </p>
          </div>
        </div>
      </section>

      <!-- ── Tim Pengembang ─────────────────────────────────────────────────── -->
      <section aria-labelledby="team-heading">
        <div class="rounded-2xl bg-linear-to-br from-green-600 to-emerald-600 overflow-hidden shadow-xl">

          <!-- Header -->
          <div class="px-6 py-8 text-center text-white">
            <h2 id="team-heading" class="text-2xl md:text-3xl font-bold mb-2">Tim Pengembang Inovasi</h2>
            <p class="text-green-100 text-sm">Mahasiswa dan Dosen Politeknik Pembangunan Pertanian Yogyakarta Magelang</p>
          </div>

          <!-- Institution card -->
          <div class="mx-4 md:mx-8 mb-6 rounded-xl bg-white/10 border border-white/20 p-6 text-white">
            <h3 class="text-lg font-bold mb-2 text-center">Polbangtan Yogyakarta Magelang (YoMa)</h3>
            <p class="text-sm text-green-100 leading-relaxed text-center mb-5">
              Institusi pendidikan tinggi vokasi yang berkomitmen mengembangkan SDM kompeten di bidang pertanian dan menciptakan solusi nyata untuk tantangan pertanian modern.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                v-for="h in institutionHighlights"
                :key="h.title"
                class="bg-white/10 rounded-lg p-4 text-center"
              >
                <UIcon :name="h.icon" class="w-6 h-6 mx-auto mb-2 text-green-200" />
                <p class="font-semibold text-sm">{{ h.title }}</p>
                <p class="text-xs text-green-100 mt-1">{{ h.desc }}</p>
              </div>
            </div>
          </div>

          <!-- Team categories -->
          <div class="mx-4 md:mx-8 mb-8 grid md:grid-cols-2 gap-4">
            <div
              v-for="team in teamCategories"
              :key="team.title"
              class="rounded-xl bg-white/10 border border-white/20 p-5 text-white"
            >
              <div class="flex items-center gap-2 mb-3">
                <UIcon :name="team.icon" class="w-5 h-5 text-green-200" />
                <h4 class="font-semibold text-sm">{{ team.title }}</h4>
              </div>
              <ul class="space-y-1.5">
                <li
                  v-for="item in team.items"
                  :key="item"
                  class="flex items-start gap-2 text-xs text-green-100"
                >
                  <UIcon name="i-lucide-check" class="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-green-300" />
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

    </div>
  </main>
</template>