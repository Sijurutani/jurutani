import type { ContactInfo, FaqItem } from './types'

/**
 * Contact Page Data
 * Contact information and FAQs for contact-us.vue
 */

export const contactInfo: ContactInfo[] = [
  {
    icon: 'i-lucide-phone',
    title: 'Telepon kami',
    description:
      'Layanan Panggilan JuruTani tersedia di hari Senin - Jumat. Jam layanan: 09.00 - 16.00 WIB',
    value: '+62 856-6900-0010',
    link: 'tel:+6285669000010',
  },
  {
    icon: 'i-lucide-mail',
    title: 'Email kami',
    description:
      'Kirimi kami pesan email dan segera Tim JuruTani akan memberikan respon secepatnya.',
    value: 'si.jurutani@gmail.com',
    link: 'mailto:si.jurutani@gmail.com',
  },
  {
    icon: 'i-lucide-map-pin',
    title: 'Lokasi kami',
    description:
      'Mari datang dan berdiskusi dengan tim JuruTani secara langsung.',
    value:
      'Jl. Kusumanegara No.2, Tahunan, Kec. Umbulharjo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55167',
    link: 'https://maps.app.goo.gl/UPTBRghSuHci7GxR7?g_st=awb',
  },
]

export const contactFaqs: FaqItem[] = [
  {
    question: 'Layanan apa saja yang disediakan oleh JuruTani?',
    answer:
      'JuruTani menyediakan layanan konsultasi pertanian yang komprehensif, solusi teknologi pertanian, sistem manajemen tanaman, platform koneksi pasar, dan sumber belajar untuk praktik pertanian berkelanjutan.',
  },
  {
    question: 'Bagaimana cara bergabung dengan komunitas JuruTani?',
    answer:
      'Anda dapat mendaftar melalui aplikasi seluler atau situs web kami. Setelah terdaftar, Anda akan mendapatkan akses ke basis pengetahuan, forum komunitas, dan layanan pertanian yang dipersonalisasi.',
  },
  {
    question: 'Apakah JuruTani tersedia di wilayah saya?',
    answer:
      'JuruTani saat ini melayani berbagai wilayah di seluruh Indonesia. Silakan hubungi tim dukungan kami dengan lokasi spesifik Anda untuk memeriksa ketersediaan di daerah Anda.',
  },
]

export const officeInfo = {
  address:
    'Jl. Kusumanegara No.2, Tahunan, Kec. Umbulharjo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55167',
  hours: 'Buka Senin - Jumat, 09:00 - 17:00 WIB',
  mapImage: '/maps.webp',
  mapLink: 'https://maps.app.goo.gl/UPTBRghSuHci7GxR7?g_st=awb',
}
