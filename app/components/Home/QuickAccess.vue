<script setup lang="ts">
const supabase = useSupabaseClient()

// ── 8 Pakar Terbaru ────────────────────────────────────────
interface Expert {
  id: number
  user_id: string
  category: string
  note: string
  profiles: { full_name: string; avatar_url: string } | null
}

const experts = ref<Expert[]>([])
const loadingExperts = ref(true)

const authStore = useAuthStore()
const toast = useToast()
const startingChatId = ref<number | null>(null)

const startChat = async (userId: string, expertId: number) => {
  try {
    if (!authStore.isAuthenticated) { await navigateTo('/auth/login'); return }
    startingChatId.value = expertId
    const res = await supabase.rpc('create_or_get_conversation', { other_user_id: userId })
    if (res.error) throw res.error
    await navigateTo(`/messages/${res.data}`)
  } catch (e: any) {
    toast.add({ title: 'Gagal membuka chat', description: e?.message, color: 'error' })
  } finally {
    startingChatId.value = null
  }
}

// Expert carousel — page-based dots
const expertTrackRef = ref<HTMLElement | null>(null)
const expertDotIndex = ref(0)
const expertPerPage = ref(1)

const updateExpertPerPage = () => {
  if (!expertTrackRef.value || !experts.value.length) return
  const card = expertTrackRef.value.children[0] as HTMLElement
  if (!card) return
  expertPerPage.value = Math.max(1, Math.round(expertTrackRef.value.clientWidth / card.offsetWidth))
}

const expertDotCount = computed(() =>
  Math.max(1, Math.ceil(experts.value.length / expertPerPage.value))
)

const handleExpertScroll = () => {
  if (!expertTrackRef.value) return
  const { scrollLeft, clientWidth } = expertTrackRef.value
  expertDotIndex.value = Math.round(scrollLeft / clientWidth)
}

const scrollExpertTo = (index: number) => {
  if (!expertTrackRef.value) return
  expertTrackRef.value.scrollTo({ left: expertTrackRef.value.clientWidth * index, behavior: 'smooth' })
  expertDotIndex.value = index
}

const fetchExperts = async () => {
  try {
    const { data } = await supabase
      .from('experts')
      .select('id, user_id, category, note, profiles!inner(full_name, avatar_url)')
      .order('id', { ascending: false })
      .limit(5)
    experts.value = (data || []) as unknown as Expert[]
  } catch {
    experts.value = []
  } finally {
    loadingExperts.value = false
  }
}

// ── 8 Penyuluh Terbaru ────────────────────────────────────────
interface Instructor {
  id: number
  user_id: string
  provinces: string
  district: string
  profiles: { full_name: string; avatar_url: string } | null
}

const instructors = ref<Instructor[]>([])
const loadingInstructors = ref(true)
const instructorTrackRef = ref<HTMLElement | null>(null)
const instructorDotIndex = ref(0)
const instructorPerPage = ref(1)

const updateInstructorPerPage = () => {
  if (!instructorTrackRef.value || !instructors.value.length) return
  const card = instructorTrackRef.value.children[0] as HTMLElement
  if (!card) return
  instructorPerPage.value = Math.max(1, Math.round(instructorTrackRef.value.clientWidth / card.offsetWidth))
}

const instructorDotCount = computed(() =>
  Math.max(1, Math.ceil(instructors.value.length / instructorPerPage.value))
)

const handleInstructorScroll = () => {
  if (!instructorTrackRef.value) return
  const { scrollLeft, clientWidth } = instructorTrackRef.value
  instructorDotIndex.value = Math.round(scrollLeft / clientWidth)
}

const scrollInstructorTo = (index: number) => {
  if (!instructorTrackRef.value) return
  instructorTrackRef.value.scrollTo({ left: instructorTrackRef.value.clientWidth * index, behavior: 'smooth' })
  instructorDotIndex.value = index
}

const startingChatInstructorId = ref<number | null>(null)

const startInstructorChat = async (userId: string, instructorId: number) => {
  try {
    if (!authStore.isAuthenticated) { await navigateTo('/auth/login'); return }
    startingChatInstructorId.value = instructorId
    const res = await supabase.rpc('create_or_get_conversation', { other_user_id: userId })
    if (res.error) throw res.error
    await navigateTo(`/messages/${res.data}`)
  } catch (e: any) {
    toast.add({ title: 'Gagal membuka chat', description: e?.message, color: 'error' })
  } finally {
    startingChatInstructorId.value = null
  }
}

const fetchInstructors = async () => {
  try {
    const { data } = await supabase
      .from('instructors')
      .select('id, user_id, provinces, district, profiles!inner(full_name, avatar_url)')
      .order('id', { ascending: false })
      .limit(5)
    instructors.value = (data || []) as unknown as Instructor[]
  } catch {
    instructors.value = []
  } finally {
    loadingInstructors.value = false
  }
}

onMounted(() => {
  fetchExperts()
  fetchInstructors()
  window.addEventListener('resize', updateExpertPerPage, { passive: true })
  window.addEventListener('resize', updateInstructorPerPage, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateExpertPerPage)
  window.removeEventListener('resize', updateInstructorPerPage)
})

watch(
  () => experts.value.length,
  () => nextTick(() => updateExpertPerPage())
)

watch(
  () => instructors.value.length,
  () => nextTick(() => updateInstructorPerPage())
)
</script>

<template>
  <div class="qa-root">

    <!-- ══════════════════════════════════════════════════════
         BAGIAN 2 — Konsultasi Pakar dari Berbagai Bidang
    ═══════════════════════════════════════════════════════ -->
    <div class="qa-block">
      <div class="qa-block__head qa-topic-head">
        <div class="qa-topic-head__main">
          <div class="qa-block__icon-wrap">
            <UIcon name="i-lucide-lightbulb" class="w-4 h-4" />
          </div>
          <div class="qa-topic-head__text">
            <h2 class="qa-block__heading">Pakar Jurutani</h2>
            <p class="qa-block__desc">Konsultasi Pakar Jurutani dengan berbagai bidang</p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loadingExperts" class="qa-expert-scroll">
        <div v-for="i in 4" :key="i" class="qa-expert-skeleton" />
      </div>

      <!-- Expert carousel -->
      <template v-else>
        <div ref="expertTrackRef" class="qa-expert-scroll" @scroll.passive="handleExpertScroll">
          <NuxtLink
            v-for="expert in experts"
            :key="expert.id"
            :to="`/discussions/expert/${expert.id}`"
            class="qa-expert-card"
          >
            <!-- Avatar -->
            <div class="qa-expert-avatar-wrap">
              <img
                :src="expert.profiles?.avatar_url || '/profile.png'"
                :alt="expert.profiles?.full_name || 'Pakar'"
                class="qa-expert-avatar"
                @error="(e: any) => e.target.src = '/profile.png'"
              >
              <span class="qa-expert-verified" aria-label="Terverifikasi">
                <UIcon name="i-lucide-check" class="w-2.5 h-2.5" />
              </span>
            </div>

            <!-- Info -->
            <div class="qa-expert-info">
              <p class="qa-expert-name">{{ expert.profiles?.full_name || 'Nama tidak tersedia' }}</p>
              <span class="qa-expert-category">{{ expert.category }}</span>
              <p v-if="expert.note" class="qa-expert-note">{{ expert.note }}</p>
            </div>

            <!-- Actions -->
            <div class="qa-expert-actions" @click.prevent>
              <button
                class="qa-expert-btn qa-expert-btn--chat"
                :disabled="startingChatId === expert.id"
                @click.prevent="startChat(expert.user_id, expert.id)"
              >
                <UIcon
                  :name="startingChatId === expert.id ? 'i-lucide-loader' : 'i-lucide-send'"
                  class="w-3.5 h-3.5"
                  :class="{ 'animate-spin': startingChatId === expert.id }"
                />
                Chat
              </button>
            </div>
          </NuxtLink>
        </div>

        <div class="qa-carousel-foot">
          <div v-if="expertDotCount > 1" class="qa-expert-dots qa-expert-dots--left">
            <button
              v-for="(_, i) in expertDotCount"
              :key="i"
              class="qa-expert-dot"
              :class="{ 'qa-expert-dot--active': i === expertDotIndex }"
              :aria-label="`Halaman pakar ${i + 1}`"
              @click="scrollExpertTo(i)"
            />
          </div>
          <NuxtLink to="/discussions/expert" class="qa-see-all qa-see-all--inline">
            Selengkapnya
            <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </template>
    </div>

    <!-- ══════════════════════════════════════════════════════
         BAGIAN 3 — Penyuluh di Daerah Anda
    ═══════════════════════════════════════════════════════ -->
    <div class="qa-block">
      <div class="qa-block__head qa-topic-head">
        <div class="qa-topic-head__main">
          <div class="qa-block__icon-wrap">
            <UIcon name="i-lucide-map-pin" class="w-4 h-4" />
          </div>
          <div class="qa-topic-head__text">
            <h2 class="qa-block__heading">Penyuluh Jurutani</h2>
            <p class="qa-block__desc">Penyuluh pertanian terdekat dengan lokasi Anda</p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loadingInstructors" class="qa-expert-scroll">
        <div v-for="i in 4" :key="i" class="qa-expert-skeleton" />
      </div>

      <!-- Instructor carousel -->
      <template v-else>
        <div ref="instructorTrackRef" class="qa-expert-scroll" @scroll.passive="handleInstructorScroll">
          <NuxtLink
            v-for="ins in instructors"
            :key="ins.id"
            :to="`/discussions/instructor/${ins.id}`"
            class="qa-expert-card qa-ins-card"
          >
            <!-- Avatar -->
            <div class="qa-expert-avatar-wrap">
              <img
                :src="ins.profiles?.avatar_url || '/profile.png'"
                :alt="ins.profiles?.full_name || 'Penyuluh'"
                class="qa-expert-avatar"
                @error="(e: any) => e.target.src = '/profile.png'"
              >
              <span class="qa-expert-verified qa-ins-verified" aria-label="Terverifikasi">
                <UIcon name="i-lucide-check" class="w-2.5 h-2.5" />
              </span>
            </div>

            <!-- Info -->
            <div class="qa-expert-info">
              <p class="qa-expert-name">{{ ins.profiles?.full_name || 'Nama tidak tersedia' }}</p>
              <span class="qa-ins-location">
                <UIcon name="i-lucide-map-pin" class="w-3 h-3" />
                {{ ins.district }}, {{ ins.provinces }}
              </span>
            </div>

            <!-- Actions -->
            <div class="qa-expert-actions" @click.prevent>
              <button
                class="qa-expert-btn qa-expert-btn--ins"
                :disabled="startingChatInstructorId === ins.id"
                @click.prevent="startInstructorChat(ins.user_id, ins.id)"
              >
                <UIcon
                  :name="startingChatInstructorId === ins.id ? 'i-lucide-loader' : 'i-lucide-send'"
                  class="w-3.5 h-3.5"
                  :class="{ 'animate-spin': startingChatInstructorId === ins.id }"
                />
                Chat
              </button>
            </div>
          </NuxtLink>
        </div>

        <div class="qa-carousel-foot">
          <div v-if="instructorDotCount > 1" class="qa-expert-dots qa-expert-dots--left">
            <button
              v-for="(_, i) in instructorDotCount"
              :key="i"
              class="qa-expert-dot qa-ins-dot"
              :class="{ 'qa-ins-dot--active': i === instructorDotIndex }"
              :aria-label="`Halaman penyuluh ${i + 1}`"
              @click="scrollInstructorTo(i)"
            />
          </div>
          <NuxtLink to="/discussions/instructor" class="qa-see-all qa-see-all--inline">
            Selengkapnya
            <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </template>
    </div>

  </div>
</template>

<style scoped>
/* ══ Root ══ */
.qa-root {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-inline: 1.5rem;
}

@media (min-width: 768px) {
  .qa-root {
    padding-inline: 2.5rem;
  }
}

@media (min-width: 1280px) {
  .qa-root {
    padding-inline: 3rem;
  }
}

/* ══ Block wrapper ══ */
.qa-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ══ Block header ══ */
.qa-block__head {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.qa-block__icon-wrap {
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

/* See all link */
.qa-see-all {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-left: auto;
  align-self: flex-start;
  margin-top: 0.5rem;
  padding: 0.4rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #16a34a;
  background: rgba(22, 163, 74, 0.08);
  border: 1px solid rgba(22, 163, 74, 0.2);
  border-radius: 9999px;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.qa-see-all:hover {
  background: rgba(22, 163, 74, 0.15);
  border-color: rgba(22, 163, 74, 0.4);
  transform: translateX(2px);
}

/* ══ BAGIAN 2: Expert Carousel ══ */
.qa-expert-scroll {
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

.qa-expert-scroll::-webkit-scrollbar {
  display: none;
}

/* Mobile: 1 card full width */
.qa-expert-scroll > .qa-expert-card {
  flex: 0 0 100%;
  scroll-snap-align: start;
}

/* Desktop: 3 cards per view */
@media (min-width: 1024px) {
  .qa-expert-scroll > .qa-expert-card {
    flex: 0 0 calc(33.333% - 0.4167rem);
  }
}

/* Dots */
.qa-expert-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 0.25rem;
}

.qa-carousel-foot {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.15rem;
}

.qa-expert-dots--left {
  margin-top: 0;
  justify-content: flex-start;
  flex: 1;
}

.qa-see-all--inline {
  margin-left: auto;
  align-self: center;
  margin-top: 0;
}

.qa-expert-dot {
  height: 0.3125rem;
  width: 0.375rem;
  border-radius: 9999px;
  background: rgba(156, 163, 175, 0.45);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.qa-expert-dot--active {
  width: 1.5rem;
  background: #16a34a;
}

.qa-expert-dot:not(.qa-expert-dot--active):not(.qa-ins-dot--active):hover {
  background: #4ade80;
  transform: scaleY(1.25);
}

/* Instructor dot — biru */
.qa-ins-dot--active {
  width: 1.5rem;
  background: #16a34a !important;
}

.qa-ins-dot:not(.qa-ins-dot--active):hover {
  background: #4ade80;
  transform: scaleY(1.25);
}

/* Card */
.qa-expert-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.875rem;
  text-decoration: none;
  border: 1px solid var(--border-light, rgba(209,213,219,0.6));
  background: var(--bg-surface, #fff);
  transition: all 0.2s ease;
  min-width: 0;
}

/* Avatar */
.qa-expert-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.qa-expert-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(220,252,231,0.8);
}

.qa-expert-verified {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #16a34a;
  border: 1.5px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

/* Info */
.qa-expert-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.qa-expert-name {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-base, #111827);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.qa-expert-category {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  color: #d97706;
  background: rgba(254,249,195,0.8);
  border: 1px solid rgba(217,119,6,0.2);
  border-radius: 9999px;
  padding: 0.1rem 0.45rem;
  width: fit-content;
}

.qa-expert-note {
  font-size: 0.7rem;
  color: var(--text-muted, #6b7280);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

/* Actions */
.qa-expert-actions {
  flex-shrink: 0;
}

.qa-expert-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.qa-expert-btn--chat {
  background: rgba(37,99,235,0.08);
  color: #2563eb;
  border: 1px solid rgba(37,99,235,0.2);
}

.qa-expert-btn--chat:hover {
  background: rgba(37,99,235,0.14);
}

.qa-expert-btn--chat:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Expert skeleton */
.qa-expert-skeleton {
  flex: 0 0 100%;
  height: 4.5rem;
  border-radius: 0.875rem;
  background: rgba(209,213,219,0.35);
  animation: qa-pulse 1.4s ease-in-out infinite;
}

@media (min-width: 1024px) {
  .qa-expert-skeleton {
    flex: 0 0 calc(33.333% - 0.4167rem);
  }
}

@keyframes qa-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* ══ Dark mode global ══ */
:root.dark .qa-block__heading {
  color: #f9fafb;
}

:root.dark .qa-block__icon-wrap {
  background: rgba(22, 163, 74, 0.2);
  color: #4ade80;
}

/* Dark mode expert */
:root.dark .qa-expert-card {
  border-color: rgba(75,85,99,0.5);
  background: rgba(17,24,39,0.5);
}

:root.dark .qa-expert-name {
  color: #f3f4f6;
}

:root.dark .qa-expert-category {
  background: rgba(217,119,6,0.15);
}

/* ══ BAGIAN 3: Instructor Carousel — reuse expert styles ══ */
.qa-ins-verified {
  background: #2563eb !important;
}

.qa-ins-location {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: #2563eb;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.qa-expert-btn--ins {
  background: rgba(22,163,74,0.08);
  color: #16a34a;
  border: 1px solid rgba(22,163,74,0.2);
}

.qa-expert-btn--ins:hover {
  background: rgba(22,163,74,0.14);
}

.qa-expert-btn--ins:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.qa-ins-dot--active {
  background: #16a34a !important;
}

/* Dark mode instructor */
:root.dark .qa-ins-card {
  border-color: rgba(75,85,99,0.5);
  background: rgba(17,24,39,0.5);
}

:root.dark .qa-ins-location {
  color: #60a5fa;
}

:root.dark .qa-see-all {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.08);
  border-color: rgba(74, 222, 128, 0.2);
}

:root.dark .qa-see-all:hover {
  background: rgba(74, 222, 128, 0.15);
  border-color: rgba(74, 222, 128, 0.4);
}
</style>
