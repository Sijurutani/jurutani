/**
 * Food Prices Data - Daftar Harga Pangan DIY
 * Static data untuk harga komoditas pertanian
 */

export interface FoodPrice {
  id: string
  slug: string
  name: string
  producer: string
  price: number
  unit: string
  category: string
  description?: string
  fullDescription?: string
  specifications?: string
  stock?: string
  district?: string
  address: string
  phone: string
  contactPerson: string
  website?: string
  image: string
  updated_at?: string
}

export interface FoodPriceCategory {
  name: string
  value: string
  icon?: string
}

export const foodPriceCategories: FoodPriceCategory[] = [
  { name: 'Semua Kategori', value: 'all', icon: 'i-lucide-layers' },
  { name: 'Hortikultura', value: 'Hortikultura', icon: 'i-lucide-flower-2' },
  { name: 'Perkebunan', value: 'Perkebunan', icon: 'i-lucide-trees' },
  { name: 'Peternakan', value: 'Peternakan', icon: 'i-lucide-beef' },
  { name: 'Perikanan', value: 'Perikanan', icon: 'i-lucide-fish' },
  { name: 'Rempah-rempah', value: 'Rempah-rempah', icon: 'i-lucide-cookie' },
]

export const foodPricesData: FoodPrice[] = [
  // Hortikultura
  {
    id: '1',
    slug: 'cabai-merah-keriting-kelompok-tani-makmur',
    name: 'Cabai Merah Keriting',
    producer: 'Kelompok Tani Makmur',
    price: 45000,
    unit: 'Kg',
    category: 'Hortikultura',
    district: 'Sleman',
    stock: 'Tersedia',
    description: 'Cabai merah keriting segar pilihan kualitas premium',
    fullDescription:
      'Cabai merah keriting berkualitas premium langsung dari petani lokal. Dipanen segar setiap hari dengan standar kualitas terbaik untuk kebutuhan kuliner Anda.',
    specifications:
      'Warna merah cerah, tingkat kepedasan tinggi, ukuran seragam 8-12cm, bebas pestisida berlebih',
    address: 'Jl. Kaliurang Km 12, Ngaglik, Sleman',
    phone: '081234567890',
    contactPerson: 'Pak Budi',
    website: '',
    image:
      'https://images.unsplash.com/photo-1583663835214-8cf51e2d64c6?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '2',
    slug: 'tomat-sayur-kelompok-tani-sejahtera',
    name: 'Tomat Sayur',
    producer: 'Kelompok Tani Sejahtera',
    price: 8000,
    unit: 'Kg',
    category: 'Hortikultura',
    district: 'Bantul',
    stock: 'Tersedia',
    description: 'Tomat sayur segar untuk kebutuhan dapur',
    fullDescription:
      'Tomat sayur segar berkualitas tinggi dari kebun petani Bantul. Dipilih dengan teliti untuk menghasilkan rasa yang sempurna dalam setiap masakan.',
    specifications:
      'Warna merah matang, tekstur padat, berat 50-80 gram per buah, kandungan air optimal',
    address: 'Desa Srimartani, Piyungan, Bantul',
    phone: '081298765432',
    contactPerson: 'Ibu Sri',
    website: '',
    image:
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '3',
    slug: 'bawang-merah-gapoktan-subur',
    name: 'Bawang Merah',
    producer: 'Gapoktan Subur',
    price: 35000,
    unit: 'Kg',
    category: 'Hortikultura',
    district: 'Kulon Progo',
    stock: 'Tersedia',
    description: 'Bawang merah lokal kualitas super',
    fullDescription:
      'Bawang merah varietas lokal unggulan dari Kulon Progo. Dikenal dengan aroma harum khas dan rasa yang kuat, cocok untuk berbagai masakan Indonesia.',
    specifications:
      'Ukuran sedang-besar, kulit kering mengkilap, umbi padat tidak keropos, aroma tajam',
    address: 'Kalibawang, Kulon Progo',
    phone: '085712345678',
    contactPerson: 'Pak Agus',
    website: '',
    image:
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '4',
    slug: 'kentang-granola-kelompok-tani-merbabu',
    name: 'Kentang Granola',
    producer: 'Kelompok Tani Merbabu',
    price: 15000,
    unit: 'Kg',
    category: 'Hortikultura',
    district: 'Sleman',
    stock: 'Tersedia',
    description: 'Kentang granola segar dari dataran tinggi',
    fullDescription:
      'Kentang Granola berkualitas premium dari dataran tinggi Sleman. Dipanen langsung dari kebun dengan standar quality control ketat.',
    specifications:
      'Ukuran besar, kulit mulus, tekstur pulen, rendah kadar air, cocok untuk french fries',
    address: 'Dusun Krinjing, Tempel, Sleman',
    phone: '081387654321',
    contactPerson: 'Pak Joko',
    website: '',
    image:
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80',
    updated_at: '2026-01-06',
  },
  {
    id: '5',
    slug: 'wortel-kelompok-tani-sejahtera',
    name: 'Wortel',
    producer: 'Kelompok Tani Sejahtera',
    price: 12000,
    unit: 'Kg',
    category: 'Hortikultura',
    district: 'Sleman',
    stock: 'Tersedia',
    description: 'Wortel segar organik',
    fullDescription:
      'Wortel organik segar tanpa pestisida kimia. Ditanam dengan metode organik alami untuk menghasilkan sayuran yang sehat dan bergizi tinggi.',
    specifications:
      'Warna orange cerah, panjang 15-20cm, diameter 2-3cm, tekstur renyah, manis alami',
    address: 'Cangkringan, Sleman',
    phone: '082134567890',
    contactPerson: 'Ibu Yanti',
    website: '',
    image:
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80',
    updated_at: '2026-01-06',
  },
  {
    id: '6',
    slug: 'sawi-hijau-gapoktan-berkah',
    name: 'Sawi Hijau',
    producer: 'Gapoktan Berkah',
    price: 5000,
    unit: 'Kg',
    category: 'Hortikultura',
    district: 'Bantul',
    stock: 'Tersedia',
    description: 'Sawi hijau segar dari kebun petani',
    fullDescription:
      'Sawi hijau segar dipetik pagi hari untuk menjaga kesegaran dan kandungan nutrisi. Ditanam secara hidroponik dengan standar higienis.',
    specifications:
      'Daun hijau segar, batang renyah, bebas hama, panjang 25-30cm',
    address: 'Imogiri, Bantul',
    phone: '081256789012',
    contactPerson: 'Pak Hadi',
    website: '',
    image:
      'https://images.unsplash.com/photo-1550167164-1b67c2be3973?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '7',
    slug: 'kangkung-kelompok-tani-makmur',
    name: 'Kangkung',
    producer: 'Kelompok Tani Makmur',
    price: 4000,
    unit: 'Kg',
    category: 'Hortikultura',
    district: 'Bantul',
    stock: 'Tersedia',
    description: 'Kangkung air segar',
    fullDescription:
      'Kangkung air segar dari sistem tanam air bersih. Dipanen setiap hari untuk menjamin kesegaran maksimal.',
    specifications:
      'Daun hijau tua, batang lunak, panjang 20-25cm, bebas kotoran',
    address: 'Kasihan, Bantul',
    phone: '085678901234',
    contactPerson: 'Ibu Siti',
    website: '',
    image:
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '8',
    slug: 'bayam-kelompok-tani-sejahtera',
    name: 'Bayam',
    producer: 'Kelompok Tani Sejahtera',
    price: 6000,
    unit: 'Kg',
    category: 'Hortikultura',
    district: 'Sleman',
    stock: 'Tersedia',
    description: 'Bayam hijau segar organik',
    fullDescription:
      'Bayam hijau organik kaya nutrisi, ditanam tanpa pestisida kimia berbahaya. Ideal untuk MPASI dan masakan keluarga sehat.',
    specifications:
      'Daun lebar hijau tua, batang segar, tinggi 15-20cm, kaya zat besi',
    address: 'Mlati, Sleman',
    phone: '081345678901',
    contactPerson: 'Ibu Rina',
    website: '',
    image:
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80',
    updated_at: '2026-01-07',
  },

  // Perkebunan
  {
    id: '9',
    slug: 'jahe-merah-kelompok-tani-sekar-arum',
    name: 'Jahe Merah',
    producer: 'Kelompok Tani Sekar Arum',
    price: 25000,
    unit: 'Kg',
    category: 'Perkebunan',
    district: 'Kulon Progo',
    stock: 'Tersedia',
    description: 'Jahe merah segar kualitas ekspor',
    fullDescription:
      'Jahe merah berkualitas ekspor dengan kandungan minyak atsiri tinggi. Cocok untuk jamu tradisional, minuman hangat, dan kebutuhan industri herbal.',
    specifications:
      'Warna merah pekat, aroma tajam khas, ukuran rimpang besar, kadar air rendah',
    address: 'Kokap, Kulon Progo',
    phone: '082198765432',
    contactPerson: 'Pak Sukardi',
    website: '',
    image:
      'https://images.unsplash.com/photo-1615485290352-1f347a37f1a4?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '10',
    slug: 'kunyit-kelompok-tani-sekar-arum',
    name: 'Kunyit',
    producer: 'Kelompok Tani Sekar Arum',
    price: 15000,
    unit: 'Kg',
    category: 'Perkebunan',
    district: 'Kulon Progo',
    stock: 'Tersedia',
    description: 'Kunyit segar untuk rempah dan jamu',
    fullDescription:
      'Kunyit segar kualitas premium dengan warna kuning cerah alami. Mengandung curcumin tinggi untuk kesehatan dan sebagai pewarna alami makanan.',
    specifications:
      'Warna kuning orange cerah, tekstur padat, aroma harum, rimpang besar',
    address: 'Kokap, Kulon Progo',
    phone: '082198765432',
    contactPerson: 'Pak Sukardi',
    website: '',
    image:
      'https://images.unsplash.com/photo-1615485925950-ba54c21bc43d?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '11',
    slug: 'kencur-kelompok-tani-sekar-arum',
    name: 'Kencur',
    producer: 'Kelompok Tani Sekar Arum',
    price: 20000,
    unit: 'Kg',
    category: 'Perkebunan',
    district: 'Kulon Progo',
    stock: 'Tersedia',
    description: 'Kencur segar pilihan',
    fullDescription:
      'Kencur pilihan dengan aroma khas yang kuat. Sangat cocok untuk jamu beras kencur, bumbu masakan, dan kebutuhan industri jamu tradisional.',
    specifications:
      'Rimpang utuh bersih, aroma kuat khas kencur, warna putih kecoklatan, bebas busuk',
    address: 'Kokap, Kulon Progo',
    phone: '082198765432',
    contactPerson: 'Pak Sukardi',
    website: '',
    image:
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '12',
    slug: 'kopi-arabika-gapoktan-menoreh',
    name: 'Kopi Arabika',
    producer: 'Gapoktan Menoreh',
    price: 120000,
    unit: 'Kg',
    category: 'Perkebunan',
    district: 'Kulon Progo',
    stock: 'Tersedia',
    description: 'Biji kopi arabika premium dari lereng Menoreh',
    fullDescription:
      'Kopi Arabika premium dari lereng Gunung Menoreh dengan cita rasa yang khas dan kompleks. Diproses dengan metode full washed untuk menghasilkan profil rasa terbaik.',
    specifications:
      'Biji utuh size 17-18, kadar air 12-13%, proses full washed, altitude 700-1000 mdpl, flavor notes: chocolate, caramel, fruity',
    address: 'Menoreh, Kokap, Kulon Progo',
    phone: '081567890123',
    contactPerson: 'Pak Bambang',
    website: 'kopimenoreh.com',
    image:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
    updated_at: '2026-01-06',
  },
  {
    id: '13',
    slug: 'kakao-fermentasi-kelompok-tani-cokelat',
    name: 'Kakao Fermentasi',
    producer: 'Kelompok Tani Cokelat',
    price: 85000,
    unit: 'Kg',
    category: 'Perkebunan',
    district: 'Gunungkidul',
    stock: 'Tersedia',
    description: 'Kakao fermentasi berkualitas tinggi',
    fullDescription:
      'Biji kakao fermentasi dengan proses pengolahan standar internasional. Menghasilkan cokelat dengan cita rasa premium dan aroma yang khas.',
    specifications:
      'Fermentasi sempurna 5-7 hari, cut test 80-85%, kadar air 7-8%, bebas biji slate',
    address: 'Patuk, Gunungkidul',
    phone: '082345678901',
    contactPerson: 'Pak Slamet',
    website: '',
    image:
      'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=80',
    updated_at: '2026-01-06',
  },
  {
    id: '14',
    slug: 'vanili-kering-gapoktan-vanilla',
    name: 'Vanili Kering',
    producer: 'Gapoktan Vanilla',
    price: 450000,
    unit: 'Kg',
    category: 'Perkebunan',
    district: 'Sleman',
    stock: 'Terbatas',
    description: 'Vanili kering grade A',
    fullDescription:
      'Vanili kering Grade A dengan aroma harum yang kuat dan alami. Dikeringkan dengan standar ekspor untuk menghasilkan kualitas terbaik.',
    specifications:
      'Panjang 15-18cm, kadar air 25-30%, warna coklat tua mengkilap, aroma kuat, bebas jamur',
    address: 'Turi, Sleman',
    phone: '081678901234',
    contactPerson: 'Ibu Lastri',
    website: '',
    image:
      'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&q=80',
    updated_at: '2026-01-05',
  },

  // Rempah-rempah
  {
    id: '15',
    slug: 'lengkuas-kelompok-tani-sekar-arum',
    name: 'Lengkuas',
    producer: 'Kelompok Tani Sekar Arum',
    price: 18000,
    unit: 'Kg',
    category: 'Rempah-rempah',
    district: 'Kulon Progo',
    stock: 'Tersedia',
    description: 'Lengkuas segar untuk bumbu dapur',
    fullDescription:
      'Lengkuas segar dengan aroma harum khas yang cocok untuk berbagai masakan tradisional Indonesia. Dipanen saat usia optimal untuk rasa terbaik.',
    specifications:
      'Rimpang besar utuh, aroma harum khas, tekstur padat, warna putih kekuningan',
    address: 'Kokap, Kulon Progo',
    phone: '082198765432',
    contactPerson: 'Pak Sukardi',
    website: '',
    image:
      'https://images.unsplash.com/photo-1615485290352-1f347a37f1a4?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '16',
    slug: 'sereh-gapoktan-wangi',
    name: 'Sereh',
    producer: 'Gapoktan Wangi',
    price: 12000,
    unit: 'Kg',
    category: 'Rempah-rempah',
    district: 'Bantul',
    stock: 'Tersedia',
    description: 'Sereh wangi segar',
    fullDescription:
      'Sereh wangi segar dengan aroma yang kuat dan menyegarkan. Cocok untuk bumbu masakan, minuman herbal, dan aromaterapi.',
    specifications:
      'Batang segar utuh, aroma citrus kuat, panjang 40-50cm, bebas layu',
    address: 'Sewon, Bantul',
    phone: '081789012345',
    contactPerson: 'Ibu Wati',
    website: '',
    image:
      'https://images.unsplash.com/photo-1584278818479-427c5e1e9f40?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '17',
    slug: 'daun-jeruk-kelompok-tani-harum',
    name: 'Daun Jeruk',
    producer: 'Kelompok Tani Harum',
    price: 8000,
    unit: 'Kg',
    category: 'Rempah-rempah',
    district: 'Sleman',
    stock: 'Tersedia',
    description: 'Daun jeruk segar dan wangi',
    fullDescription:
      'Daun jeruk purut segar dengan aroma citrus yang kuat. Sangat cocok untuk bumbu masakan Thailand, tom yum, dan berbagai masakan khas Indonesia.',
    specifications:
      'Daun segar hijau tua, aroma jeruk kuat, ukuran sedang-besar, tidak layu',
    address: 'Ngaglik, Sleman',
    phone: '082890123456',
    contactPerson: 'Pak Heru',
    website: '',
    image:
      'https://images.unsplash.com/photo-1584278818479-427c5e1e9f40?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '18',
    slug: 'kayu-manis-gapoktan-rempah-nusantara',
    name: 'Kayu Manis',
    producer: 'Gapoktan Rempah Nusantara',
    price: 45000,
    unit: 'Kg',
    category: 'Rempah-rempah',
    district: 'Gunungkidul',
    stock: 'Tersedia',
    description: 'Kayu manis asli kualitas premium',
    fullDescription:
      'Kayu manis asli Indonesia dengan aroma manis yang khas. Dikeringkan secara alami untuk mempertahankan kualitas dan aroma terbaiknya.',
    specifications:
      'Kulit kayu utuh tebal 2-3mm, warna coklat kemerahan, aroma manis kuat, kandungan minyak atsiri tinggi',
    address: 'Playen, Gunungkidul',
    phone: '081901234567',
    contactPerson: 'Pak Arif',
    website: '',
    image:
      'https://images.unsplash.com/photo-1531213124565-8f8f73b846e6?w=800&q=80',
    updated_at: '2026-01-06',
  },

  // Peternakan
  {
    id: '19',
    slug: 'telur-ayam-kampung-kelompok-ternak-maju',
    name: 'Telur Ayam Kampung',
    producer: 'Kelompok Ternak Maju',
    price: 2500,
    unit: 'Butir',
    category: 'Peternakan',
    district: 'Sleman',
    stock: 'Tersedia',
    description: 'Telur ayam kampung segar',
    fullDescription:
      'Telur ayam kampung segar dari peternakan organik. Ayam diberi pakan alami tanpa bahan kimia berbahaya, menghasilkan telur berkualitas tinggi.',
    specifications:
      'Berat 45-50 gram per butir, kuning telur orange pekat, cangkang kuat, bebas antibiotik',
    address: 'Mlati, Sleman',
    phone: '082012345678',
    contactPerson: 'Pak Darto',
    website: '',
    image:
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '20',
    slug: 'ayam-kampung-hidup-kelompok-ternak-maju',
    name: 'Ayam Kampung Hidup',
    producer: 'Kelompok Ternak Maju',
    price: 65000,
    unit: 'Kg',
    category: 'Peternakan',
    district: 'Sleman',
    stock: 'Tersedia',
    description: 'Ayam kampung hidup siap potong',
    fullDescription:
      'Ayam kampung hidup sehat dari peternakan terpercaya. Dipelihara secara organik dengan pakan alami untuk menghasilkan daging berkualitas.',
    specifications:
      'Berat hidup 1.2-1.5 kg, umur 4-5 bulan, sehat aktif, daging padat tekstur kenyal',
    address: 'Mlati, Sleman',
    phone: '082012345678',
    contactPerson: 'Pak Darto',
    website: '',
    image:
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '21',
    slug: 'susu-kambing-segar-peternakan-etawa-sejahtera',
    name: 'Susu Kambing Segar',
    producer: 'Peternakan Etawa Sejahtera',
    price: 25000,
    unit: 'Liter',
    category: 'Peternakan',
    district: 'Kulon Progo',
    stock: 'Tersedia',
    description: 'Susu kambing etawa segar berkualitas',
    fullDescription:
      'Susu kambing etawa segar murni 100% tanpa pengawet. Kaya nutrisi dan baik untuk kesehatan pencernaan. Diperah langsung dari peternakan higienis.',
    specifications:
      'Murni tanpa campuran, tidak amis, kandungan lemak 3-4%, protein tinggi, diperah pagi hari',
    address: 'Sentolo, Kulon Progo',
    phone: '081123456789',
    contactPerson: 'Pak Wahyu',
    website: '',
    image:
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '22',
    slug: 'daging-sapi-segar-kelompok-ternak-sapi-makmur',
    name: 'Daging Sapi Segar',
    producer: 'Kelompok Ternak Sapi Makmur',
    price: 130000,
    unit: 'Kg',
    category: 'Peternakan',
    district: 'Gunungkidul',
    stock: 'Tersedia',
    description: 'Daging sapi segar lokal',
    fullDescription:
      'Daging sapi lokal segar dari sapi sehat yang dipelihara secara tradisional. Dipotong sesuai permintaan untuk menjaga kesegaran.',
    specifications:
      'Warna merah segar, tekstur padat kenyal, marbling baik, bebas formalin',
    address: 'Wonosari, Gunungkidul',
    phone: '082234567890',
    contactPerson: 'Pak Suroto',
    website: '',
    image:
      'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&q=80',
    updated_at: '2026-01-06',
  },
  {
    id: '23',
    slug: 'madu-lebah-hutan-kelompok-peternak-lebah',
    name: 'Madu Lebah Hutan',
    producer: 'Kelompok Peternak Lebah',
    price: 150000,
    unit: 'Kg',
    category: 'Peternakan',
    district: 'Gunungkidul',
    stock: 'Terbatas',
    description: 'Madu murni dari lebah hutan',
    fullDescription:
      'Madu lebah hutan murni 100% tanpa campuran dari hutan Gunungkidul. Dipanen secara tradisional dengan kualitas terjamin untuk kesehatan.',
    specifications:
      'Murni tanpa campuran, aroma khas hutan, warna amber gelap, kandungan enzim tinggi, tidak mengkristal',
    address: 'Semanu, Gunungkidul',
    phone: '081345678901',
    contactPerson: 'Pak Tono',
    website: '',
    image:
      'https://images.unsplash.com/photo-1587049352846-4a222e784084?w=800&q=80',
    updated_at: '2026-01-06',
  },

  // Perikanan
  {
    id: '24',
    slug: 'lele-segar-kelompok-pembudidaya-ikan',
    name: 'Lele Segar',
    producer: 'Kelompok Pembudidaya Ikan',
    price: 25000,
    unit: 'Kg',
    category: 'Perikanan',
    district: 'Sleman',
    stock: 'Tersedia',
    description: 'Lele segar hasil budidaya',
    fullDescription:
      'Ikan lele segar hasil budidaya dengan sistem bioflok. Dipelihara di kolam bersih dengan pakan berkualitas untuk menghasilkan daging lele yang gurih.',
    specifications:
      'Ukuran 7-10 ekor per kg, daging tebal, tidak bau lumpur, segar hidup',
    address: 'Godean, Sleman',
    phone: '082456789012',
    contactPerson: 'Pak Jono',
    website: '',
    image:
      'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '25',
    slug: 'nila-merah-kelompok-pembudidaya-ikan',
    name: 'Nila Merah',
    producer: 'Kelompok Pembudidaya Ikan',
    price: 30000,
    unit: 'Kg',
    category: 'Perikanan',
    district: 'Sleman',
    stock: 'Tersedia',
    description: 'Ikan nila merah segar',
    fullDescription:
      'Ikan nila merah segar dari kolam air bersih. Memiliki daging yang tebal dan rasa yang gurih, cocok untuk dibakar atau digoreng.',
    specifications:
      'Ukuran 4-6 ekor per kg, warna merah cerah, daging tebal, sisik mengkilap',
    address: 'Godean, Sleman',
    phone: '082456789012',
    contactPerson: 'Pak Jono',
    website: '',
    image:
      'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '26',
    slug: 'gurame-perikanan-mina-sejahtera',
    name: 'Gurame',
    producer: 'Perikanan Mina Sejahtera',
    price: 45000,
    unit: 'Kg',
    category: 'Perikanan',
    district: 'Bantul',
    stock: 'Tersedia',
    description: 'Ikan gurame segar ukuran konsumsi',
    fullDescription:
      'Ikan gurame segar ukuran konsumsi dari kolam berkualitas. Daging tebal dengan rasa yang lezat, cocok untuk berbagai olahan masakan.',
    specifications:
      'Ukuran 3-4 ekor per kg, daging tebal padat, sisik rapi, hidup segar',
    address: 'Pandak, Bantul',
    phone: '081567890123',
    contactPerson: 'Ibu Tuti',
    website: '',
    image:
      'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=800&q=80',
    updated_at: '2026-01-07',
  },
  {
    id: '27',
    slug: 'udang-vaname-kelompok-tambak-udang',
    name: 'Udang Vaname',
    producer: 'Kelompok Tambak Udang',
    price: 85000,
    unit: 'Kg',
    category: 'Perikanan',
    district: 'Bantul',
    stock: 'Tersedia',
    description: 'Udang vaname segar hasil tambak',
    fullDescription:
      'Udang vaname segar dari tambak intensif dengan teknologi modern. Ukuran seragam dan kualitas terjamin untuk kebutuhan restoran dan rumah tangga.',
    specifications:
      'Size 60-70 per kg, kulit bersih mengkilap, daging kenyal, kepala utuh, hidup segar',
    address: 'Sanden, Bantul',
    phone: '082678901234',
    contactPerson: 'Pak Agung',
    website: '',
    image:
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80',
    updated_at: '2026-01-06',
  },
  {
    id: '28',
    slug: 'bandeng-perikanan-pantai-selatan',
    name: 'Bandeng',
    producer: 'Perikanan Pantai Selatan',
    price: 35000,
    unit: 'Kg',
    category: 'Perikanan',
    district: 'Bantul',
    stock: 'Tersedia',
    description: 'Ikan bandeng segar',
    fullDescription:
      'Ikan bandeng segar dari tambak pantai selatan. Daging lembut dengan rasa yang enak, cocok untuk digoreng atau dibakar.',
    specifications:
      'Ukuran 3-5 ekor per kg, daging lembut, sisik mengkilap, duri lunak',
    address: 'Sanden, Bantul',
    phone: '081789123456',
    contactPerson: 'Pak Slamet',
    website: '',
    image:
      'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=800&q=80',
    updated_at: '2026-01-06',
  },
]

// Helper function untuk format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Helper function untuk mendapatkan produk berdasarkan slug
export const getFoodPriceBySlug = (slug: string): FoodPrice | undefined => {
  return foodPricesData.find((item) => item.slug === slug)
}

// Helper function untuk mendapatkan produk serupa (berdasarkan kategori)
export const getSimilarProducts = (
  product: FoodPrice,
  limit: number = 4,
): FoodPrice[] => {
  return foodPricesData
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, limit)
}

// Helper function untuk filter data
export const filterFoodPrices = (
  data: FoodPrice[],
  category: string,
  searchQuery: string,
): FoodPrice[] => {
  let filtered = [...data]

  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter((item) => item.category === category)
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.producer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.district?.toLowerCase().includes(query),
    )
  }

  return filtered
}

// Helper function untuk sorting
export const sortFoodPrices = (
  data: FoodPrice[],
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'updated',
): FoodPrice[] => {
  const sorted = [...data]

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'updated':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.updated_at || '').getTime()
        const dateB = new Date(b.updated_at || '').getTime()
        return dateB - dateA
      })
    default:
      return sorted
  }
}
