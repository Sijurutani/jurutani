<script setup lang="ts">
import { faqCategories, faqData, quickHelpCards, supportResources } from '~/data/faq'
import type { FaqItem } from '~/data/types'

useSeoOptimized('help')

const categories = faqCategories
const activeCategory = ref('general')
const searchQuery = ref('')

const feedbackMap = reactive<Record<string, 'up' | 'down' | null>>({})
const feedbackKey = (cat: string, idx: number) => `${cat}_${idx}`
const setFeedback = (cat: string, idx: number, v: 'up' | 'down') => {
  const k = feedbackKey(cat, idx)
  feedbackMap[k] = feedbackMap[k] === v ? null : v
}

const activeFaqs = computed((): FaqItem[] => {
  let items = faqData[activeCategory.value] || []
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(i => i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q))
  }
  return items
})

const openItems = ref<number[]>([0])
const toggleItem = (i: number) => {
  const idx = openItems.value.indexOf(i)
  if (idx > -1) openItems.value.splice(idx, 1)
  else openItems.value.push(i)
}
const isOpen = (i: number) => openItems.value.includes(i)

watch(activeCategory, () => { openItems.value = [0] })
watch(searchQuery, () => { openItems.value = activeFaqs.value.length > 0 ? [0] : [] })

const scrollToFaqs = () => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <CommonPageHeroSection
      title="Pusat Bantuan"
      title-accent="JuruTani"
      subtitle="Temukan jawaban, panduan, dan dukungan untuk memaksimalkan hasil pertanian Anda bersama JuruTani."
      :badge="{ text: 'Help Center', icon: 'i-lucide-help-circle' }"
      decorative="gradient"
      align="center"
      :cta="{ text: 'Cari Bantuan', icon: 'i-lucide-search', action: scrollToFaqs }"
      :stats="[
        { value: '24/7', label: 'Dukungan' },
        { value: '10K+', label: 'Pertanyaan' },
        { value: '98%', label: 'Kepuasan' },
      ]"
    />

    <div class="hf-wrap">

      <!-- Quick Help -->
      <section>
        <CommonSectionHeader title="Bantuan Cepat" subtitle="Akses langsung ke layanan bantuan yang paling sering digunakan" align="center" class="mb-10" />
        <div class="hf-quick-grid">
          <NuxtLink
            v-for="(card, i) in quickHelpCards"
            :key="i"
            :to="card.link ?? '#'"
            class="hf-quick-card app-reveal bg-white dark:bg-gray-900/60"
            :style="`animation-delay:${i * 60}ms`"
          >
            <div class="hf-quick-card__icon">
              <UIcon :name="card.icon" class="w-5 h-5" />
            </div>
            <h3 class="hf-quick-card__title">{{ card.title }}</h3>
            <p class="hf-quick-card__desc">{{ card.description }}</p>
            <span class="hf-quick-card__cta">Selengkapnya <UIcon name="i-lucide-arrow-right" class="w-3 h-3" /></span>
          </NuxtLink>
        </div>
      </section>

      <!-- FAQ -->
      <section id="faq-section">
        <CommonSectionHeader title="Pertanyaan Umum (FAQ)" subtitle="Jawaban untuk pertanyaan yang sering diajukan pengguna kami" align="center" class="mb-10" />

        <!-- Search -->
        <div class="hf-search-wrap">
          <div class="hf-search-inner">
            <AppSearchBar v-model="searchQuery" placeholder="Cari pertanyaan atau kata kunci..." />
          </div>
          <Transition name="hf-fade">
            <p v-if="searchQuery" class="hf-search-stat">
              Ditemukan <strong style="color:#16a34a">{{ activeFaqs.length }}</strong> hasil untuk <em>"{{ searchQuery }}"</em>
            </p>
          </Transition>
        </div>

        <!-- Category filter -->
        <div class="mb-8">
          <CommonCategoryFilter :categories="categories" :active-category="activeCategory" @update:category="activeCategory = $event" />
        </div>

        <!-- Accordion -->
        <div class="hf-accordion">
          <!-- Empty -->
          <div v-if="activeFaqs.length === 0" class="hf-empty">
            <div class="hf-empty__icon"><UIcon name="i-lucide-search-x" class="w-8 h-8" style="color:#16a34a" /></div>
            <h3 class="hf-empty__title">Tidak ada hasil</h3>
            <p class="hf-empty__desc">
              Tidak ada pertanyaan yang cocok di kategori
              <strong>{{ categories.find(c => c.id === activeCategory)?.name }}</strong>
            </p>
            <div class="hf-empty__btns">
              <UButton size="md" color="primary" @click="searchQuery = ''">
                <UIcon name="i-lucide-rotate-ccw" class="mr-2 w-4 h-4" />Hapus Pencarian
              </UButton>
              <UButton size="md" variant="outline" color="primary" to="/contact-us">
                <UIcon name="i-lucide-message-square" class="mr-2 w-4 h-4" />Hubungi Kami
              </UButton>
            </div>
          </div>

          <!-- Items -->
          <div
            v-for="(item, index) in activeFaqs"
            :key="`${activeCategory}-${index}`"
            class="hf-faq-item bg-white dark:bg-gray-900/60"
            :class="{ 'hf-faq-item--open': isOpen(index) }"
          >
            <button class="hf-faq-item__btn" :aria-expanded="isOpen(index)" @click="toggleItem(index)">
              <div class="hf-faq-item__chevron" :class="{ 'hf-faq-item__chevron--open': isOpen(index) }">
                <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
              </div>
              <div class="hf-faq-item__q">
                <h3 class="hf-faq-item__question" :class="{ 'hf-faq-item__question--active': isOpen(index) }">{{ item.question }}</h3>
              </div>
              <span v-if="index === 0" class="hf-popular-badge">Popular</span>
            </button>

            <Transition name="hf-expand">
              <div v-if="isOpen(index)" class="hf-faq-item__body">
                <div class="hf-faq-item__line" />
                <p class="hf-faq-item__answer">{{ item.answer }}</p>
                <!-- Feedback -->
                <div class="hf-feedback">
                  <span class="hf-feedback__label">Apakah ini membantu?</span>
                  <div class="hf-feedback__btns">
                    <button
                      class="hf-vote"
                      :class="{ 'hf-vote--up': feedbackMap[feedbackKey(activeCategory, index)] === 'up' }"
                      @click.stop="setFeedback(activeCategory, index, 'up')"
                    >
                      <UIcon name="i-lucide-thumbs-up" class="w-3.5 h-3.5" />
                      Ya
                    </button>
                    <button
                      class="hf-vote"
                      :class="{ 'hf-vote--down': feedbackMap[feedbackKey(activeCategory, index)] === 'down' }"
                      @click.stop="setFeedback(activeCategory, index, 'down')"
                    >
                      <UIcon name="i-lucide-thumbs-down" class="w-3.5 h-3.5" />
                      Tidak
                    </button>
                  </div>
                  <Transition name="hf-fade">
                    <span v-if="feedbackMap[feedbackKey(activeCategory, index)]" class="hf-feedback__thanks">Terima kasih!</span>
                  </Transition>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Still need help -->
          <div v-if="activeFaqs.length > 0" class="hf-still-help">
            <UIcon name="i-lucide-help-circle" class="hf-still-help__icon" />
            <h4 class="hf-still-help__title">Masih belum menemukan jawaban?</h4>
            <p class="hf-still-help__desc">Tim support kami siap membantu permasalahan spesifik Anda kapan saja.</p>
            <div class="hf-still-help__btns">
              <UButton to="/contact-us" size="md" class="hf-btn-primary">
                <UIcon name="i-lucide-send" class="mr-2 w-4 h-4" />Hubungi Support
              </UButton>
              <UButton to="/discussions" variant="outline" color="primary" size="md">
                <UIcon name="i-lucide-users" class="mr-2 w-4 h-4" />Tanya Komunitas
              </UButton>
            </div>
          </div>
        </div>
      </section>

      <!-- Resources -->
      <section>
        <CommonSectionHeader title="Sumber Belajar" subtitle="Perkaya wawasan pertanian Anda dengan materi edukasi kami" align="center" class="mb-10" />
        <div class="hf-resource-grid">
          <div v-for="(r, i) in supportResources" :key="i" class="app-reveal" :style="`animation-delay:${i * 80}ms`">
            <CommonIconInfoCard v-bind="r" hoverable variant="gradient" />
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.hf-wrap {
  max-width: 72rem;
  margin: 0 auto;
  padding: 4rem 1.25rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 5rem;
}
@media (min-width: 640px) { .hf-wrap { padding: 4rem 2rem 6rem; } }

/* quick cards */
.hf-quick-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media (min-width: 768px) { .hf-quick-grid { grid-template-columns: repeat(4, 1fr); } }

.hf-quick-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 1.125rem;
  border: 1px solid rgba(22,163,74,0.12);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
}
.hf-quick-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(22,163,74,0.18); border-color: rgba(22,163,74,0.3); }

.hf-quick-card__icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  background: rgba(22,163,74,0.1);
  color: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.875rem;
  transition: transform 0.25s ease;
}
.hf-quick-card:hover .hf-quick-card__icon { transform: scale(1.1) rotate(3deg); }

.hf-quick-card__title { font-size: 0.875rem; font-weight: 700; color: var(--text-base); margin-bottom: 0.375rem; transition: color 0.2s; }
.hf-quick-card:hover .hf-quick-card__title { color: #16a34a; }
.hf-quick-card__desc { font-size: 0.75rem; color: var(--text-muted); line-height: 1.55; flex: 1; }

.hf-quick-card__cta {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.875rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #16a34a;
  opacity: 0;
  transition: opacity 0.2s;
}
.hf-quick-card:hover .hf-quick-card__cta { opacity: 1; }

/* search */
.hf-search-wrap { max-width: 36rem; margin: 0 auto 2rem; }
.hf-search-inner { position: relative; }
.hf-search-stat { text-align: center; margin-top: 0.75rem; font-size: 0.8125rem; color: var(--text-muted); }

/* accordion */
.hf-accordion { max-width: 44rem; margin: 0 auto; display: flex; flex-direction: column; gap: 0.625rem; }

.hf-faq-item {
  border-radius: 0.875rem;
  border: 1px solid rgba(22,163,74,0.1);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.hf-faq-item--open { border-color: rgba(22,163,74,0.3); box-shadow: 0 4px 16px rgba(22,163,74,0.1); }
.hf-faq-item:not(.hf-faq-item--open):hover { border-color: rgba(22,163,74,0.2); }

.hf-faq-item__btn {
  width: 100%;
  padding: 1rem 1.25rem;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.hf-faq-item__chevron {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.5rem;
  background: rgba(156,163,175,0.2);
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
.hf-faq-item__chevron--open {
  background: rgba(22,163,74,0.1);
  color: #16a34a;
  transform: rotate(90deg);
}

.hf-faq-item__q { flex: 1; min-width: 0; }
.hf-faq-item__question {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-base);
  line-height: 1.45;
  transition: color 0.2s;
}
.hf-faq-item__question--active { color: #16a34a; }

.hf-popular-badge {
  flex-shrink: 0;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  background: rgba(22,163,74,0.1);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #16a34a;
}

.hf-faq-item__body {
  padding: 0 1.25rem 1.25rem 1.25rem;
  padding-left: calc(1.25rem + 1.75rem + 0.75rem);
  position: relative;
}
.hf-faq-item__line {
  position: absolute;
  left: calc(1.25rem + 0.875rem);
  top: 0;
  bottom: 1.25rem;
  width: 1.5px;
  background: linear-gradient(to bottom, #16a34a, transparent);
}

.hf-faq-item__answer {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

/* feedback */
.hf-feedback {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.625rem;
  padding-top: 0.875rem;
  border-top: 1px solid rgba(22,163,74,0.1);
}
.hf-feedback__label { font-size: 0.75rem; color: var(--text-subtle); }
.hf-feedback__btns { display: flex; gap: 0.5rem; }
.hf-feedback__thanks { font-size: 0.75rem; color: var(--text-subtle); font-style: italic; }

.hf-vote {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(156,163,175,0.3);
  background: rgba(156,163,175,0.08);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}
.hf-vote:hover { border-color: #16a34a; color: #16a34a; background: rgba(22,163,74,0.06); }
.hf-vote--up { border-color: #16a34a; color: #16a34a; background: rgba(22,163,74,0.1); }
.hf-vote--down { border-color: #ef4444; color: #ef4444; background: rgba(239,68,68,0.08); }

/* still help */
.hf-still-help {
  margin-top: 0.5rem;
  text-align: center;
  padding: 2.5rem 1.5rem;
  border-radius: 1.25rem;
  background: var(--bg-badge);
  border: 1px solid var(--border-badge);
}
.hf-still-help__icon { width: 2.75rem; height: 2.75rem; color: #16a34a; margin: 0 auto 0.75rem; }
.hf-still-help__title { font-size: 1.0625rem; font-weight: 700; color: var(--text-base); margin-bottom: 0.375rem; }
.hf-still-help__desc { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.25rem; }
.hf-still-help__btns { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }

.hf-btn-primary {
  background: linear-gradient(135deg, #16a34a, #059669) !important;
  color: #fff !important;
  box-shadow: 0 4px 14px rgba(22,163,74,0.3);
}

/* empty */
.hf-empty { text-align: center; padding: 3.5rem 1.5rem; }
.hf-empty__icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: rgba(22,163,74,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}
.hf-empty__title { font-size: 1.0625rem; font-weight: 700; color: var(--text-base); margin-bottom: 0.5rem; }
.hf-empty__desc { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem; }
.hf-empty__btns { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }

/* resource */
.hf-resource-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
@media (min-width: 768px) { .hf-resource-grid { grid-template-columns: repeat(3, 1fr); } }

/* transitions */
.hf-expand-enter-active { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
.hf-expand-leave-active { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
.hf-expand-enter-from, .hf-expand-leave-to { opacity: 0; max-height: 0; }
.hf-expand-enter-to, .hf-expand-leave-from { opacity: 1; max-height: 800px; }

.hf-fade-enter-active, .hf-fade-leave-active { transition: opacity 0.2s; }
.hf-fade-enter-from, .hf-fade-leave-to { opacity: 0; }
</style>