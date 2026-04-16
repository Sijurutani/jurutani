<script setup lang="ts">
// Data testimoni pengguna JuruTani
const testimonialsBase = [
  {
    id: 1,
    name: 'Ahmad Blora',
    email: 'Bloraachmad@gmail.com',
    role: 'Petani Tanaman Pangan',
    description: 'Aplikasi JuruTani sangat membantu saya mendapatkan informasi tentang masalah pertanian. Contohnya tentang hama dan penyakit tanaman, saya bisa bertanya langsung lewat chat JuruTani.',
    avatar: 'https://ui-avatars.com/api/?name=Ahmad+Blora&background=10b981&color=fff',
    color: 'green',
    rating: 5
  },
  {
    id: 2,
    name: 'Fisya Hapsari',
    email: 'fisyanahapsari@gmail.com',
    role: 'UMKM Produk Pertanian',
    description: 'JuruTani bermanfaat untuk promosi produk saya untuk lebih dikenal banyak orang. Platform ini memberikan akses yang luas untuk memasarkan hasil pertanian saya.',
    avatar: 'https://ui-avatars.com/api/?name=Fisya+Hapsari&background=f59e0b&color=fff',
    color: 'blue',
    rating: 5
  },
  {
    id: 3,
    name: 'Sugeng',
    email: 'Sugeng2703@gmail.com',
    role: 'Petani Mitra',
    description: 'JuruTani solusi yang tepat untuk membantu saya menghubungi langsung ke penyuluh. Fitur komunikasi langsung ini sangat memudahkan saya dalam berkonsultasi tentang teknik bertani.',
    avatar: 'https://ui-avatars.com/api/?name=Sugeng&background=ef4444&color=fff',
    color: 'orange',
    rating: 5
  },
  {
    id: 4,
    name: 'Suwarni',
    email: 'Suwarni@gmail.com',
    role: 'Petani Sayuran',
    description: 'JuruTani mantap! Terdapat fitur cuaca dan kalkulator benih dan pupuk sebagai bahan pertimbangan dalam budidaya tanaman. Tools ini sangat membantu perencanaan pertanian saya.',
    avatar: 'https://ui-avatars.com/api/?name=Suwarni&background=8b5cf6&color=fff',
    color: 'yellow',
    rating: 5
  },
]

const trackRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const perPage = ref(1)

const updatePerPage = () => {
  if (!trackRef.value || !testimonialsBase.length) return
  const card = trackRef.value.children[0] as HTMLElement
  if (!card) return
  perPage.value = Math.max(1, Math.round(trackRef.value.clientWidth / card.offsetWidth))
}

const dotCount = computed(() =>
  Math.max(1, Math.ceil(testimonialsBase.length / perPage.value))
)

const handleScroll = () => {
  if (!trackRef.value) return
  const { scrollLeft, clientWidth } = trackRef.value
  currentIndex.value = Math.round(scrollLeft / clientWidth)
}

const scrollTo = (index: number) => {
  if (!trackRef.value) return
  trackRef.value.scrollTo({ left: trackRef.value.clientWidth * index, behavior: 'smooth' })
  currentIndex.value = index
}

onMounted(() => {
  nextTick(() => updatePerPage())
  window.addEventListener('resize', updatePerPage, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePerPage)
})
</script>

<template>
  <div class="tm-root">
    <div class="tm-block">
      <div class="tm-block__head qa-topic-head">
        <div class="qa-topic-head__main">
          <div class="tm-block__icon-wrap">
            <UIcon name="i-lucide-message-square-quote" class="w-4 h-4" />
          </div>
          <div class="qa-topic-head__text">
            <h2 class="qa-block__heading">Testimoni Pengguna</h2>
            <p class="qa-block__desc">Cerita petani dan pelaku usaha yang sudah merasakan manfaat JuruTani.</p>
          </div>
        </div>
      </div>

      <div ref="trackRef" class="tm-scroll" @scroll.passive="handleScroll">
        <article
          v-for="testimonial in testimonialsBase"
          :key="testimonial.id"
          class="tm-card"
        >
          <div class="tm-card__head">
            <div class="tm-card__avatar-wrap">
              <img
                :src="testimonial.avatar"
                :alt="testimonial.name"
                class="tm-card__avatar"
                loading="lazy"
              >
            </div>

            <div class="tm-card__identity">
              <h3 class="tm-card__name">{{ testimonial.name }}</h3>
              <p class="tm-card__role">{{ testimonial.role }}</p>
              <p class="tm-card__email">{{ testimonial.email }}</p>
              <div class="tm-card__rating">
                <UIcon
                  v-for="star in testimonial.rating"
                  :key="star"
                  name="i-lucide-star"
                  class="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                />
              </div>
            </div>
          </div>

          <p class="tm-card__quote">"{{ testimonial.description }}"</p>
        </article>
      </div>

      <div v-if="dotCount > 1" class="tm-carousel-foot">
        <div class="tm-dots tm-dots--left">
          <button
            v-for="(_, i) in dotCount"
            :key="i"
            class="tm-dot"
            :class="{ 'tm-dot--active': i === currentIndex }"
            :aria-label="`Halaman testimoni ${i + 1}`"
            @click="scrollTo(i)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ══ Root ══ */
.tm-root {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-inline: 1.5rem;
}

@media (min-width: 768px) {
  .tm-root {
    padding-inline: 2.5rem;
  }
}

@media (min-width: 1280px) {
  .tm-root {
    padding-inline: 3rem;
  }
}

.tm-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tm-block__head {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.qa-topic-head {
  align-items: stretch;
  gap: 0.75rem;
}

.qa-topic-head__main {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}

.qa-topic-head__text {
  min-width: 0;
}

@media (min-width: 768px) {
  .qa-topic-head {
    align-items: center;
    flex-wrap: nowrap;
  }
}

.tm-block__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #16a34a;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.qa-block__heading {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-base, #111827);
  line-height: 1.3;
  margin: 0 0 0.2rem;
  letter-spacing: -0.01em;
}

@media (min-width: 768px) {
  .qa-block__heading {
    font-size: 1.2rem;
  }
}

.qa-block__desc {
  font-size: 0.75rem;
  color: var(--text-muted, #6b7280);
  line-height: 1.5;
  margin: 0;
}

/* ══ Testimonial carousel ══ */
.tm-scroll {
  display: flex;
  gap: 0.625rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 0.25rem;
}

.tm-scroll::-webkit-scrollbar {
  display: none;
}

.tm-card {
  flex: 0 0 100%;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: 0.875rem;
  border: 1px solid var(--border-light, rgba(209,213,219,0.6));
  background: var(--bg-surface, #fff);
  min-width: 0;
}

@media (min-width: 1024px) {
  .tm-card {
    flex: 0 0 calc(50% - 0.3125rem);
  }
}

.tm-card__head {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 0;
}

.tm-card__avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.tm-card__avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(220,252,231,0.9);
}

.tm-card__identity {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
  flex: 1;
}

.tm-card__name {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-base, #111827);
  line-height: 1.35;
  margin: 0;
}

.tm-card__role {
  font-size: 0.75rem;
  font-weight: 600;
  color: #16a34a;
  margin: 0;
}

.tm-card__email {
  font-size: 0.7rem;
  color: var(--text-muted, #6b7280);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tm-card__rating {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin-top: 0.25rem;
}

.tm-card__quote {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.55;
  color: var(--text-muted, #374151);
}

.tm-carousel-foot {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.15rem;
}

.tm-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.tm-dots--left {
  justify-content: flex-start;
  flex: 1;
}

.tm-dot {
  height: 0.3125rem;
  width: 0.375rem;
  border-radius: 9999px;
  background: rgba(156, 163, 175, 0.45);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tm-dot--active {
  width: 1.5rem;
  background: #16a34a;
}

.tm-dot:not(.tm-dot--active):hover {
  background: #4ade80;
  transform: scaleY(1.25);
}

/* ══ Dark mode ══ */
:root.dark .qa-block__heading {
  color: #f9fafb;
}

:root.dark .tm-block__icon-wrap {
  background: rgba(22, 163, 74, 0.2);
  color: #4ade80;
}

:root.dark .tm-card {
  border-color: rgba(75,85,99,0.5);
  background: rgba(17,24,39,0.5);
}

:root.dark .tm-card__name {
  color: #f3f4f6;
}

:root.dark .tm-card__email,
:root.dark .tm-card__quote {
  color: #9ca3af;
}
</style>
