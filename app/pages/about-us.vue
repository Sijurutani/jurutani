<script setup lang="ts">
  // SEO Optimization dengan meta tags yang lebih detail
  useHead({
    title: 'Tentang JuruTani - Platform Penyuluhan Digital Pertanian Indonesia',
    meta: [
      {
        name: 'description',
        content: 'JuruTani adalah inovasi platform penyuluhan digital pertanian dari Politeknik Pembangunan Pertanian Yogyakarta Magelang. Menghubungkan teknologi modern dengan pertanian berkelanjutan untuk petani Indonesia.'
      },
      {
        name: 'keywords',
        content: 'JuruTani, penyuluhan digital, pertanian, teknologi pertanian, inovasi pertanian, Polbangtan, platform digital, petani Indonesia, Agriculture 4.0'
      },
      {
        property: 'og:title',
        content: 'Tentang JuruTani - Platform Penyuluhan Digital Pertanian'
      },
      {
        property: 'og:description',
        content: 'Inovasi penyuluhan digital dari mahasiswa dan dosen Politeknik Pembangunan Pertanian Yogyakarta Magelang untuk memajukan pertanian Indonesia'
      },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:image',
        content: '/jurutani.png'
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:title',
        content: 'Tentang JuruTani - Platform Penyuluhan Digital Pertanian'
      },
      {
        name: 'twitter:description',
        content: 'Inovasi platform penyuluhan digital dari Polbangtan Yogyakarta Magelang'
      }
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://jurutani.id/about-us'
      }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'JuruTani',
          alternateName: 'JuruTani - Platform Penyuluhan Digital Pertanian',
          url: 'https://jurutani.id',
          logo: 'https://jurutani.id/jurutani.png',
          description: 'Platform inovasi penyuluhan digital pertanian Indonesia yang menghubungkan teknologi modern dengan pertanian berkelanjutan',
          sameAs: [
            'https://www.instagram.com/jurutani',
            'https://www.facebook.com/jurutani',
            'https://twitter.com/jurutani'
          ],
          foundingDate: '2024',
          founder: {
            '@type': 'Organization',
            name: 'Politeknik Pembangunan Pertanian Yogyakarta Magelang'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Support',
            email: 'info@jurutani.id'
          }
        })
      }
    ]
  })

  useSeoOptimized('about')

  // ============ DATA DECLARATIONS ============

  // Image declarations
  const logoJuruTani = '/jurutani.png'
  const sponsorLogo = '/logo/sponsor1.png'

  const galleryImages = [
    '/gallery/image1.webp',
    '/gallery/image2.webp', 
    '/gallery/image3.webp',
    '/gallery/image4.webp',
    '/gallery/image5.webp'
  ] as const

  const galleryData = [
    {
      src: galleryImages[0],
      title: 'Layanan Penyuluhan',
      desc: 'Konsultasi langsung dengan penyuluh pertanian digital melalui aplikasi JuruTani'
    },
    {
      src: galleryImages[1],
      title: 'Berita Pertanian',
      desc: 'Informasi terbaru seputar pertanian, teknologi, dan kegiatan masyarakat tani'
    },
    {
      src: galleryImages[2],
      title: 'Marketplace Petani',
      desc: 'Tempat jual beli pupuk, bibit, dan hasil panen secara langsung'
    },
    {
      src: galleryImages[3],
      title: 'Edukasi & Artikel',
      desc: 'Bacaan informatif untuk meningkatkan pengetahuan dan keterampilan petani'
    },
    {
      src: galleryImages[4],
      title: 'Kursus & Alat Bantu',
      desc: 'Belajar mandiri melalui kursus dan alat bantu seperti kalkulator pupuk atau cuaca'
    }
  ] as const

  // Innovation Points Data
  const innovationPoints = [
    {
      icon: 'i-lucide-message-square',
      title: 'Konsultasi Digital Real-Time',
      desc: 'Akses langsung dengan penyuluh pertanian profesional melalui chat dan video call'
    },
    {
      icon: 'i-lucide-database',
      title: 'Database Komoditas Lengkap',
      desc: 'Informasi detail tentang berbagai jenis tanaman dan teknik budidaya terbaru'
    },
    {
      icon: 'i-lucide-cloud-rain',
      title: 'Data Cuaca & Pasar Akurat',
      desc: 'Prediksi cuaca harian dan harga komoditas real-time untuk perencanaan yang lebih baik'
    },
    {
      icon: 'i-lucide-shopping-cart',
      title: 'Marketplace Terintegrasi',
      desc: 'Jual-beli pupuk, bibit, dan hasil panen langsung dengan pembeli tanpa perantara'
    },
    {
      icon: 'i-lucide-book-open',
      title: 'Edukasi & Kursus Pertanian',
      desc: 'Materi pembelajaran interaktif dari ahli dan praktisi pertanian berpengalaman'
    },
    {
      icon: 'i-lucide-user',
      title: 'Alat Bantu Otomatis',
      desc: 'Kalkulator pupuk, prediksi hasil, dan tools analisis untuk keputusan yang tepat'
    }
  ] as const

  // Keunggulan Platform Data
  interface FeatureCard {
    icon: string
    title: string
    description: string
  }

  const platformAdvantages: FeatureCard[] = [
    {
      icon: 'i-lucide-bar-chart-3',
      title: 'Data Terintegrasi & Real-Time',
      description: 'Database lengkap komoditas pertanian, data cuaca akurat, harga pasar real-time, dan informasi pasar yang terupdate setiap saat dalam satu platform terpadu'
    },
    {
      icon: 'i-lucide-smartphone',
      title: 'User-Friendly untuk Semua',
      description: 'Interface intuitif dirancang khusus untuk petani dengan berbagai tingkat literasi digital, dari yang masih konvensional hingga tech-savvy'
    },
    {
      icon: 'i-lucide-headset',
      title: 'Penyuluhan Digital 24/7',
      description: 'Akses langsung dengan penyuluh pertanian profesional kapan saja, di mana saja melalui chat, video call, atau forum diskusi komunitas petani'
    },
    {
      icon: 'i-lucide-shopping-bag',
      title: 'Marketplace Terintegrasi',
      description: 'Jual-beli pupuk, bibit berkualitas, hasil panen, dan produk pertanian lainnya langsung dengan pembeli tanpa perantara yang memberatkan'
    },
    {
      icon: 'i-lucide-graduation-cap',
      title: 'Edukasi Pertanian Berkualitas',
      description: 'Kursus online, webinar, dan artikel edukatif dari ahli pertanian profesional yang dikurasi khusus untuk peningkatan skill dan pengetahuan'
    },
    {
      icon: 'i-lucide-user',
      title: 'Tools & Kalkulasi Otomatis',
      description: 'Kalkulator pupuk, prediksi hasil panen, analisis keuntungan, dan tools AI yang membantu petani membuat keputusan bisnis yang lebih tepat'
    }
  ] as const

  // Developer Team Data
  const teamCategories = [
    {
      icon: 'i-lucide-user-search',
      title: 'Mahasiswa Berprestasi',
      items: [
        'Mahasiswa terpilih dari berbagai program studi',
        'Kompetensi teknologi digital terdepan',
        'Pemahaman mendalam tentang pertanian praktis',
        'Semangat untuk menciptakan dampak sosial'
      ]
    },
    {
      icon: 'i-lucide-user-check',
      title: 'Dosen Pembimbing Berpengalaman',
      items: [
        'Ahli di bidang pertanian dan teknologi',
        'Pengalaman puluhan tahun di industri',
        'Komitmen pada inovasi berkelanjutan',
        'Mentoring profesional untuk tim mahasiswa'
      ]
    }
  ] as const

  const institutionHighlights = [
    {
      icon: 'i-lucide-graduation-cap',
      title: 'Pendidikan Vokasi',
      desc: 'Program praktis berbasis industri'
    },
    {
      icon: 'i-lucide-search',
      title: 'Riset & Inovasi',
      desc: 'Penelitian pertanian berkelanjutan'
    },
    {
      icon: 'i-lucide-earth',
      title: 'Pemberdayaan Masyarakat',
      desc: 'Solusi nyata untuk petani lokal'
    }
  ] as const

</script>

<template>
  <main class="min-h-screen transition-colors duration-300">
    
    <!-- Hero Section with Logo -->
    <header class="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center max-w-4xl mx-auto">
          <!-- Logo -->
          <div class="mb-8">
            <NuxtImg :src="logoJuruTani" alt="Si JuruTani Logo" class="w-32 md:w-40 mx-auto drop-shadow-2xl animate-pulse" />
          </div>
          
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold bg-linear-to-r from-green-700 via-emerald-600 to-green-800 bg-clip-text text-transparent mb-6 leading-tight">
            Si JuruTani
          </h1>
          <div class="w-24 h-1 bg-linear-to-r from-green-500 to-emerald-500 mx-auto mb-6"/>
          <p class="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            Inovasi digital dari <strong class="text-green-700 dark:text-green-400">Politeknik Pembangunan Pertanian Yogyakarta Magelang</strong> untuk memajukan pertanian Indonesia menuju era digital yang berkelanjutan
          </p>  
          
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 pb-16">
      
      <!-- Tentang Si JuruTani -->
      <section id="tentang" class="mb-16" aria-labelledby="about-heading">
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-green-100 dark:border-green-800">
          <h2 id="about-heading" class="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 mb-2 text-center">
            Apa itu Si JuruTani?
          </h2>
          <p class="text-center text-sm text-green-600 dark:text-green-400 mb-8 font-medium">Platform Inovasi Penyuluhan Digital Pertanian</p>
          
          <div class="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            <p class="text-center text-xl mb-8 font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border-l-4 border-green-500">
              <strong>Si JuruTani</strong> adalah inovasi penyuluhan digital pertanian yang menghubungkan teknologi modern dengan kearifan pertanian tradisional Indonesia untuk menciptakan ekosistem pertanian berkelanjutan.
            </p>
            
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-2xl font-bold text-green-700 dark:text-green-300 mb-4 flex items-center">
                  <span class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 text-lg"><UIcon name="i-lucide-sprout" /></span>
                  Inovasi yang Lahir dari Pendidikan
                </h3>
                <p class="mb-6">
                  <strong>Si JuruTani</strong> adalah hasil karya inovatif dari mahasiswa dan dosen <strong>Politeknik Pembangunan Pertanian Yogyakarta Magelang (Polbangtan YoMa)</strong>. Platform ini dikembangkan dengan dedikasi tinggi untuk menjawab tantangan modernisasi pertanian Indonesia di era digital.
                </p>
                <p class="mb-6">
                  Dengan memanfaatkan teknologi digital terdepan dan database yang komprehensif, Si JuruTani memungkinkan petani untuk mengakses informasi real-time tentang komoditas pertanian, data cuaca akurat, harga pasar kompetitif, dan teknik pertanian berkelanjutan yang disesuaikan dengan kondisi lokal.
                </p>
                <p class="mb-6">
                  Setiap fitur dirancang dengan mempertimbangkan kebutuhan nyata petani Indonesia, dari yang masih menggunakan pertanian tradisional hingga yang siap bertransformasi ke Agriculture 4.0.
                </p>
              </div>

              <div>
                <h3 class="text-2xl font-bold text-green-700 dark:text-green-300 mb-4 flex items-center">
                  <span class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 text-lg"><UIcon name="i-lucide-user-check" /></span>
                  Solusi Penyuluhan Digital Terpadu
                </h3>
                <p class="mb-6">
                  Platform ini bukan sekadar aplikasi mobile, melainkan ekosistem digital komprehensif yang mengintegrasikan berbagai layanan penyuluhan pertanian modern. Si JuruTani menjembatani kesenjangan antara petani dan ahli pertanian melalui teknologi yang accessible dan user-friendly.
                </p>
                <p class="mb-6">
                  Dengan antarmuka yang intuitif dan fitur-fitur canggih, petani dapat meningkatkan produktivitas, efisiensi, dan keberlanjutan usaha tani mereka. Platform ini juga memfasilitasi kolaborasi antar petani dan akses langsung ke pasar, menciptakan nilai tambah yang signifikan.
                </p>
                <p class="mb-6">
                  Si <strong>JuruTani</strong> adalah bukti nyata komitmen Polbangtan YoMa dalam menghasilkan lulusan yang tidak hanya kompeten secara akademis, tetapi juga mampu menciptakan inovasi yang memberikan dampak nyata bagi masyarakat pertanian Indonesia.
                </p>
              </div>
            </div>

            <!-- Key Innovation Points -->
            <div class="mt-12 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-8 rounded-xl border border-green-200 dark:border-green-800">
              <h3 class="text-2xl font-bold text-green-800 dark:text-green-300 mb-6 text-center">Inovasi Penyuluhan Digital Kami</h3>
              <div class="grid md:grid-cols-2 gap-6">
                <div v-for="point in innovationPoints" :key="point.title" class="flex items-center group hover:bg-green-100 dark:hover:bg-green-800/30 p-4 rounded-lg transition-colors">
                  <div class="w-10 h-10 flex items-center justify-center mr-4 bg-green-50 dark:bg-green-900 rounded-full">
                    <UIcon :name="point.icon" class="w-6 h-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-green-800 dark:text-green-300 mb-0">{{ point.title }}</h4>
                    <p class="text-sm text-gray-700 dark:text-gray-400 mt-1">{{ point.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Gallery Section -->
      <section id="galeri" class="mb-16 pt-6" aria-labelledby="gallery-heading">
        <div class="text-center mb-12">
          <h2 id="gallery-heading" class="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 mb-4">
            Galeri Inovasi Penyuluhan Digital
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Perjalanan pengembangan dan implementasi JuruTani sebagai inovasi penyuluhan digital pertanian Indonesia
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(item, index) in galleryData" 
            :key="index"
            class="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div class="aspect-w-16 aspect-h-12">
            <NuxtImg 
                :src="item.src" 
                :alt="item.title" 
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div class="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 class="text-xl font-semibold mb-2">{{ item.title }}</h3>
                <p class="text-sm opacity-90">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Visi Misi -->
      <section class="mb-16" aria-labelledby="vision-mission-heading">
        <h2 id="vision-mission-heading" class="sr-only">Visi dan Misi JuruTani</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Visi -->
          <div class="bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-8 border border-green-200 dark:border-green-700">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-lucide-eye" class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-green-800 dark:text-green-300">
                Visi
              </h3>
            </div>
            <p class="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
              Menjadi platform digital terdepan yang mengintegrasikan teknologi modern dengan praktik pertanian berkelanjutan untuk menciptakan ekosistem pertanian Indonesia yang cerdas, produktif, dan ramah lingkungan.
            </p>
          </div>

          <!-- Misi -->
          <div class="bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-8 border border-green-200 dark:border-green-700">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-lucide-check-circle-2" class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-green-800 dark:text-green-300">
                Misi
              </h3>
            </div>
            <ul class="text-gray-700 dark:text-gray-300 space-y-3">
              <li class="flex items-start">
                <UIcon name="i-lucide-check" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                Mengembangkan solusi digital yang mudah diakses petani
              </li>
              <li class="flex items-start">
                <UIcon name="i-lucide-check" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                Menyediakan data real-time untuk keputusan pertanian yang tepat
              </li>
              <li class="flex items-start">
                <UIcon name="i-lucide-check" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                Membangun komunitas petani yang terhubung dan berdaya
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Keunggulan Platform -->
      <section class="mb-16" aria-labelledby="advantages-heading">
        <div class="text-center mb-12">
          <h2 id="advantages-heading" class="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 mb-4">
            Keunggulan Kompetitif JuruTani
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Platform penyuluhan digital yang dirancang khusus untuk kebutuhan petani Indonesia dengan fitur-fitur unggulan yang tidak ditemukan di platform lain
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div 
            v-for="(feature, index) in platformAdvantages" 
            :key="index"
            class="group text-center p-8 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm rounded-xl shadow-lg border border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div class="w-16 h-16 bg-linear-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <UIcon :name="feature.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-green-800 dark:text-green-300 mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </section>
      <!-- Sponsor Section -->
      <section id="sponsor" class="mb-16" aria-labelledby="sponsor-heading">
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-green-100 dark:border-green-800">
          <div class="text-center mb-10">
            <h2 id="sponsor-heading" class="text-3xl font-bold text-green-800 dark:text-green-300 mb-2">
              Institusi Pengembang & Mitra Strategis
            </h2>
            <p class="text-gray-600 dark:text-gray-400">Dukungan penuh dari institusi pendidikan dan organisasi strategis</p>
          </div>
          
          <div class="flex flex-col md:flex-row items-center justify-center gap-8">
            <div class="text-center">
              <div class="mb-4">
                <NuxtImg 
                  :src="sponsorLogo" 
                  alt="Polbangtan Yogyakarta Magelang" 
                  class="max-h-20 md:max-h-24 object-contain mx-auto opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
              <h3 class="font-semibold text-green-800 dark:text-green-300 mb-2">Polbangtan YoMa</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                Politeknik Pembangunan Pertanian Yogyakarta Magelang
              </p>
            </div>
          </div>

          <div class="mt-10 pt-10 border-t border-green-200 dark:border-green-800">
            <p class="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
              <strong>JuruTani</strong> adalah produk dari komitmen Polbangtan Yogyakarta Magelang dalam mengembangkan inovasi yang berdampak positif bagi pertanian Indonesia. Melalui kolaborasi antara mahasiswa berprestasi, dosen berpengalaman, dan mitra industri, platform ini terus berkembang dan memberikan manfaat maksimal bagi petani Indonesia.
            </p>
          </div>
        </div>
      </section>

      <!-- Tim Pengembang -->
      <section id="tim-developer" class="mb-16" aria-labelledby="team-heading">
        <div class="bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-xl">
          <h2 id="team-heading" class="text-3xl md:text-4xl font-bold mb-3">
            Tim Pengembang Inovasi
          </h2>
          <p class="text-lg text-green-100 mb-8 font-medium">
            Mahasiswa dan Dosen Politeknik Pembangunan Pertanian Yogyakarta Magelang
          </p>
          
          <!-- Institution Info -->
          <div class="bg-white/15 backdrop-blur-sm rounded-xl p-8 mb-8 border border-white/20">
            <h3 class="text-2xl font-bold mb-4">Polbangtan Yogyakarta Magelang (YoMa)</h3>
            <p class="text-lg mb-6 leading-relaxed">
              Politeknik Pembangunan Pertanian Yogyakarta Magelang adalah institusi pendidikan tinggi vokasi yang berkomitmen untuk mengembangkan sumber daya manusia kompeten di bidang pertanian. Melalui program-program inovatif dan kolaborasi strategis, Polbangtan YoMa mempersiapkan mahasiswa tidak hanya sebagai profesional pertanian, tetapi juga sebagai agent of change yang mampu menciptakan solusi nyata untuk tantangan pertanian modern.
            </p>
            <div class="grid md:grid-cols-3 gap-4">
              <div v-for="highlight in institutionHighlights" :key="highlight.title" class="bg-white/10 rounded-lg p-4">
                <p class="text-2xl font-bold mb-2"><UIcon :name="highlight.icon" /></p>
                <p class="font-semibold">{{ highlight.title }}</p>
                <p class="text-sm text-green-100 mt-2">{{ highlight.desc }}</p>
              </div>
            </div>
          </div>

          <div class="text-left max-w-3xl mx-auto">
            <h3 class="text-xl font-bold mb-6 text-center">Komposisi Tim Pengembang</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div v-for="team in teamCategories" :key="team.title" class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div class="text-4xl mb-4"><UIcon :name="team.icon" /></div>
                <h4 class="font-semibold text-lg mb-3">{{ team.title }}</h4>
                <ul class="text-sm space-y-2 text-green-100">
                  <li v-for="item in team.items" :key="item">✓ {{ item }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>



    </div>
  </main>
</template>