<script setup lang="ts">
import { contactInfo, contactFaqs, officeInfo } from '~/data/contact'
import type { ContactFormData } from '~/data/types'

useSeoOptimized('contact')

const formData = reactive<ContactFormData>({ name: '', email: '', phone: '', subject: '', message: '' })
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const submitError = ref('')

const subjects = ['Pertanyaan Umum', 'Bantuan Teknis', 'Kemitraan & Kerjasama', 'Laporan Bug', 'Permintaan Fitur', 'Lainnya']

const handleSubmit = async () => {
  isSubmitting.value = true
  submitError.value = ''
  try {
    await new Promise(r => setTimeout(r, 1500))
    isSubmitted.value = true
    Object.assign(formData, { name: '', email: '', phone: '', subject: '', message: '' })
  }
  catch { submitError.value = 'Terjadi kesalahan. Silakan coba lagi.' }
  finally { isSubmitting.value = false }
}

const scrollToForm = () => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })

const socialLinks = [
  { icon: 'i-lucide-instagram', label: 'Instagram', href: 'https://instagram.com/jurutani', color: '#e1306c' },
  { icon: 'i-lucide-youtube', label: 'YouTube', href: 'https://www.youtube.com/@jurutani', color: '#ff0000' },
  { icon: 'i-lucide-github', label: 'GitHub', href: 'https://github.com/jurutani', color: '#333' },
  { icon: 'i-lucide-twitter', label: 'Twitter/X', href: 'https://twitter.com/jurutani', color: '#1da1f2' },
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <CommonPageHeroSection
      title="Hubungi Tim"
      title-accent="JuruTani"
      subtitle="Kami siap membantu. Sampaikan pertanyaan, saran, atau ajakan kerjasama Anda."
      :badge="{ text: 'Contact Us', icon: 'i-lucide-mail' }"
      decorative="gradient"
      align="center"
      :cta="{ text: 'Kirim Pesan', icon: 'i-lucide-send', action: scrollToForm }"
      :stats="[
        { value: '24/7', label: 'Dukungan' },
        { value: '< 24h', label: 'Respons' },
        { value: '98%', label: 'Kepuasan' },
      ]"
    />

    <div class="cu-wrap">

      <!-- Contact Cards -->
      <section>
        <CommonSectionHeader title="Cara Menghubungi Kami" subtitle="Pilih metode yang paling nyaman untuk Anda" align="center" class="mb-10" />
        <div class="cu-methods">
          <NuxtLink
            v-for="m in contactInfo"
            :key="m.title"
            :to="m.link"
            :target="m.link?.startsWith('http') ? '_blank' : undefined"
            class="cu-method bg-white dark:bg-gray-900/60"
          >
            <div class="cu-method__icon">
              <UIcon :name="m.icon" class="w-6 h-6" />
            </div>
            <h3 class="cu-method__title">{{ m.title }}</h3>
            <p class="cu-method__desc">{{ m.description }}</p>
            <p class="cu-method__value">{{ m.value }}</p>
            <div class="cu-method__arrow">
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Form + Sidebar -->
      <section id="contact-form">
        <CommonSectionHeader title="Kirim Pesan" subtitle="Isi formulir berikut dan tim kami akan merespons secepatnya" align="center" class="mb-10" />

        <div class="cu-form-grid">
          <!-- Form Panel -->
          <div class="cu-form-panel">
            <div class="cu-form-panel__inner bg-white dark:bg-gray-900/80">
              <Transition name="cu-fade" mode="out-in">
                <div v-if="isSubmitted" class="cu-success">
                  <div class="cu-success__icon">
                    <UIcon name="i-lucide-check-circle-2" class="w-10 h-10" style="color:#16a34a" />
                  </div>
                  <h3 class="cu-success__title">Pesan Terkirim!</h3>
                  <p class="cu-success__desc">Tim JuruTani akan membalas dalam 1×24 jam kerja.</p>
                  <UButton size="md" variant="outline" color="primary" @click="isSubmitted = false">Kirim Lagi</UButton>
                </div>

                <form v-else class="cu-form" @submit.prevent="handleSubmit">
                  <div class="cu-form__row">
                    <div class="cu-field">
                      <label class="cu-label">Nama Lengkap <span class="cu-req">*</span></label>
                      <UInput v-model="formData.name" placeholder="Nama Anda" size="md" required />
                    </div>
                    <div class="cu-field">
                      <label class="cu-label">Nomor Telepon</label>
                      <UInput v-model="formData.phone" type="tel" placeholder="+62 8xx xxxx xxxx" size="md" />
                    </div>
                  </div>
                  <div class="cu-field">
                    <label class="cu-label">Alamat Email <span class="cu-req">*</span></label>
                    <UInput v-model="formData.email" type="email" placeholder="email@contoh.com" size="md" required />
                  </div>
                  <div class="cu-field">
                    <label class="cu-label">Topik <span class="cu-req">*</span></label>
                    <USelect v-model="formData.subject" :items="subjects" placeholder="Pilih topik..." size="md" required />
                  </div>
                  <div class="cu-field">
                    <label class="cu-label">Pesan <span class="cu-req">*</span></label>
                    <UTextarea v-model="formData.message" placeholder="Tulis pesan Anda..." :rows="5" size="md" required />
                  </div>
                  <UAlert v-if="submitError" color="error" variant="soft" :title="submitError" icon="i-lucide-alert-circle" class="mb-2" />
                  <UButton type="submit" size="lg" block :loading="isSubmitting" class="cu-submit-btn">
                    <UIcon v-if="!isSubmitting" name="i-lucide-send" class="mr-2 w-4 h-4" />
                    {{ isSubmitting ? 'Mengirim...' : 'Kirim Pesan' }}
                  </UButton>
                  <p class="cu-form__note">
                    Dengan mengirim pesan, Anda menyetujui
                    <NuxtLink to="/privacy-policy" class="cu-form__link">kebijakan privasi</NuxtLink> kami.
                  </p>
                </form>
              </Transition>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="cu-sidebar">
            <!-- Office info -->
            <div class="cu-info-card bg-white dark:bg-gray-900/60">
              <h3 class="cu-info-card__title">
                <UIcon name="i-lucide-building-2" class="w-4 h-4" style="color:#16a34a" />
                Informasi Kantor
              </h3>
              <div class="cu-info-row">
                <div class="cu-info-row__icon"><UIcon name="i-lucide-map-pin" class="w-4 h-4" style="color:#16a34a" /></div>
                <div>
                  <p class="cu-info-row__label">Alamat</p>
                  <p class="cu-info-row__val">{{ officeInfo.address }}</p>
                </div>
              </div>
              <div class="cu-info-row">
                <div class="cu-info-row__icon"><UIcon name="i-lucide-clock" class="w-4 h-4" style="color:#16a34a" /></div>
                <div>
                  <p class="cu-info-row__label">Jam Operasional</p>
                  <p class="cu-info-row__val">{{ officeInfo.hours }}</p>
                  <p class="cu-info-row__sub">Sabtu – Minggu: Tutup</p>
                </div>
              </div>
              <UButton :to="officeInfo.mapLink" target="_blank" block size="md" variant="outline" color="primary" class="mt-5">
                <UIcon name="i-lucide-map" class="mr-2 w-4 h-4" />Buka di Google Maps
              </UButton>
            </div>

            <!-- Map -->
            <div class="cu-map-card bg-white dark:bg-gray-900/60">
              <div class="cu-map-card__header">
                <div>
                  <p class="cu-map-card__title">Peta Lokasi</p>
                  <p class="cu-map-card__sub">Jl. Kusumanegara No.2, Yogyakarta</p>
                </div>
                <UButton :to="officeInfo.mapLink" target="_blank" size="xs" variant="outline" color="primary">
                  <UIcon name="i-lucide-external-link" class="mr-1 w-3 h-3" />Buka
                </UButton>
              </div>
              <div class="cu-map-card__frame">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.0446280892394!2d110.39089007501!3d-7.789999992218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5a1c5c8c8c8d%3A0x1c8c8c8c8c8c8c8c!2sJl.%20Kusumanegara%20No.2%2C%20Yogyakarta!5e0!3m2!1sid!2sid!4v1704430000000!5m2!1sid!2sid"
                  class="cu-map-iframe"
                  :allowfullscreen="true"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Lokasi Kantor JuruTani"
                />
              </div>
            </div>

            <!-- Social -->
            <div class="cu-social-card bg-white dark:bg-gray-900/60">
              <h3 class="cu-info-card__title">
                <UIcon name="i-lucide-share-2" class="w-4 h-4" style="color:#16a34a" />
                Media Sosial
              </h3>
              <div class="cu-social-grid">
                <a
                  v-for="s in socialLinks"
                  :key="s.label"
                  :href="s.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="cu-social-item"
                >
                  <span class="cu-social-item__dot" :style="`background:${s.color}`">
                    <UIcon :name="s.icon" class="w-4 h-4 text-white" />
                  </span>
                  <span class="cu-social-item__label">{{ s.label }}</span>
                  <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5 cu-social-item__arrow" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section>
        <CommonSectionHeader title="Pertanyaan Umum" subtitle="Jawaban cepat untuk pertanyaan yang sering diajukan" align="center" class="mb-10" />
        <div class="cu-faq-wrap">
          <CommonFaqAccordion :items="contactFaqs" default-open />
          <div class="cu-faq-cta">
            <UIcon name="i-lucide-message-circle-question" class="cu-faq-cta__icon" />
            <h3 class="cu-faq-cta__title">Masih ada pertanyaan?</h3>
            <p class="cu-faq-cta__desc">Tim support kami siap membantu kapan saja.</p>
            <UButton size="md" class="cu-submit-btn" @click="scrollToForm">
              <UIcon name="i-lucide-send" class="mr-2 w-4 h-4" />Kirim Pesan
            </UButton>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.cu-wrap {
  max-width: 72rem;
  margin: 0 auto;
  padding: 4rem 1.25rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 5rem;
}
@media (min-width: 640px) { .cu-wrap { padding: 4rem 2rem 6rem; } }

/* methods */
.cu-methods {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 768px) { .cu-methods { grid-template-columns: repeat(3, 1fr); } }

.cu-method {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 1.75rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(22,163,74,0.12);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
  overflow: hidden;
}
.cu-method:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(22,163,74,0.18); border-color: rgba(22,163,74,0.3); }

.cu-method__icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.875rem;
  background: rgba(22,163,74,0.1);
  color: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transition: transform 0.25s ease;
}
.cu-method:hover .cu-method__icon { transform: scale(1.1) rotate(3deg); }

.cu-method__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-base);
  margin-bottom: 0.375rem;
  transition: color 0.2s;
}
.cu-method:hover .cu-method__title { color: #16a34a; }

.cu-method__desc {
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.55;
  margin-bottom: 0.75rem;
  flex: 1;
}

.cu-method__value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #16a34a;
  word-break: break-word;
}

.cu-method__arrow {
  position: absolute;
  bottom: 1.25rem;
  right: 1.25rem;
  color: #16a34a;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
}
.cu-method:hover .cu-method__arrow { opacity: 1; transform: translateX(0); }

/* form grid */
.cu-form-grid {
  display: grid;
  gap: 2rem;
}
@media (min-width: 1024px) { .cu-form-grid { grid-template-columns: 1fr 1fr; align-items: start; } }

.cu-form-panel {
  position: relative;
}
.cu-form-panel::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 1.375rem;
  background: linear-gradient(135deg, rgba(22,163,74,0.3), rgba(52,211,153,0.15));
  z-index: 0;
  filter: blur(1px);
}
.cu-form-panel__inner {
  position: relative;
  z-index: 1;
  border-radius: 1.25rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

/* form */
.cu-form { display: flex; flex-direction: column; gap: 1rem; }
.cu-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 480px) { .cu-form__row { grid-template-columns: 1fr; } }

.cu-field { display: flex; flex-direction: column; gap: 0.375rem; }
.cu-label { font-size: 0.8125rem; font-weight: 600; color: var(--text-base); }
.cu-req { color: #ef4444; }

.cu-submit-btn {
  background: linear-gradient(135deg, #16a34a, #059669) !important;
  color: #fff !important;
  box-shadow: 0 4px 14px rgba(22,163,74,0.3);
}

.cu-form__note { font-size: 0.75rem; color: var(--text-subtle); text-align: center; }
.cu-form__link { color: #16a34a; text-decoration: underline; }

/* success */
.cu-success {
  text-align: center;
  padding: 2.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
}
.cu-success__icon {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: rgba(22,163,74,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cu-success__title { font-size: 1.25rem; font-weight: 700; color: var(--text-base); }
.cu-success__desc { font-size: 0.875rem; color: var(--text-muted); }

/* sidebar */
.cu-sidebar { display: flex; flex-direction: column; gap: 1.25rem; }

.cu-info-card, .cu-social-card {
  padding: 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(22,163,74,0.12);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.cu-info-card__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-base);
  margin-bottom: 1.125rem;
}

.cu-info-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.cu-info-row__icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.625rem;
  background: rgba(22,163,74,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cu-info-row__label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-subtle);
  margin-bottom: 0.25rem;
}
.cu-info-row__val { font-size: 0.8125rem; color: var(--text-muted); line-height: 1.5; }
.cu-info-row__sub { font-size: 0.75rem; color: var(--text-subtle); margin-top: 0.2rem; }

.cu-map-card {
  border-radius: 1.25rem;
  border: 1px solid rgba(22,163,74,0.12);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.cu-map-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(22,163,74,0.1);
}
.cu-map-card__title { font-size: 0.875rem; font-weight: 700; color: var(--text-base); }
.cu-map-card__sub { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.125rem; }

.cu-map-card__frame {
  position: relative;
  aspect-ratio: 4/3;
  background: #f3f4f6;
}
.cu-map-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* social */
.cu-social-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.625rem; }
.cu-social-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(22,163,74,0.1);
  background: rgba(22,163,74,0.03);
  text-decoration: none;
  transition: all 0.2s ease;
}
.cu-social-item:hover { border-color: rgba(22,163,74,0.3); background: rgba(22,163,74,0.07); transform: translateY(-2px); }

.cu-social-item__dot {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.cu-social-item:hover .cu-social-item__dot { transform: scale(1.1); }

.cu-social-item__label { font-size: 0.8rem; font-weight: 600; color: var(--text-base); flex: 1; }
.cu-social-item__arrow { color: var(--text-subtle); opacity: 0; transition: opacity 0.2s; }
.cu-social-item:hover .cu-social-item__arrow { opacity: 1; }

/* faq */
.cu-faq-wrap { max-width: 44rem; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
.cu-faq-cta {
  text-align: center;
  padding: 2.5rem 1.5rem;
  border-radius: 1.25rem;
  background: var(--bg-badge);
  border: 1px solid var(--border-badge);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
}
.cu-faq-cta__icon { width: 2.5rem; height: 2.5rem; color: #16a34a; }
.cu-faq-cta__title { font-size: 1.125rem; font-weight: 700; color: var(--text-base); }
.cu-faq-cta__desc { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem; }

/* transition */
.cu-fade-enter-active, .cu-fade-leave-active { transition: opacity 0.25s ease; }
.cu-fade-enter-from, .cu-fade-leave-to { opacity: 0; }
</style>