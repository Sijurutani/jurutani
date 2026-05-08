<script setup lang="ts">
const supabase = useSupabaseClient()
const { getLatestNews } = useHomeData()

const { data: news, pending } = await getLatestNews()

const formattedDate = (d: string) =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))

const getImageUrl = (item: any): string | null => {
  const path = item.cover_image || (item.images?.length ? item.images[0] : null)
  if (!path) return null
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from('news-images').getPublicUrl(path)
  return data?.publicUrl || null
}

const categoryGradient = (cat: string) => {
  const map: Record<string, string> = {
    teknologi: 'from-emerald-600 to-teal-600',
    pertanian: 'from-green-600 to-emerald-600',
    bisnis:    'from-lime-600 to-green-600',
    pendidikan:'from-teal-600 to-cyan-600',
    tips:      'from-emerald-500 to-green-500',
  }
  return map[(cat || '').toLowerCase()] || 'from-green-600 to-emerald-600'
}

// Mobile swipe carousel
const trackRef = ref<HTMLElement | null>(null)
const dotIndex = ref(0)

const handleScroll = () => {
  if (!trackRef.value) return
  const { scrollLeft, clientWidth } = trackRef.value
  dotIndex.value = Math.round(scrollLeft / clientWidth)
}

const scrollTo = (i: number) => {
  if (!trackRef.value) return
  trackRef.value.scrollTo({ left: trackRef.value.clientWidth * i, behavior: 'smooth' })
  dotIndex.value = i
}

const dotCount = computed(() => news?.value?.length ?? 0)
</script>

<template>
  <div class="px-4 lg:px-6 flex flex-col gap-6">
    <!-- ── Section Header ── -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <!-- Badge -->
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100/50 dark:bg-green-900/20 border border-green-500/20 mb-3 shadow-sm">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span class="text-[10px] font-extrabold uppercase tracking-widest text-green-700 dark:text-green-400">
            Kabar Terbaru
          </span>
        </div>

        <h2 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-50 tracking-tight">
          Informasi &amp; Update
        </h2>
        <p class="text-sm md:text-[15px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed max-w-xl">
          Berita, tren, dan tips terkini seputar dunia pertanian Indonesia untuk mendukung aktivitas Anda.
        </p>
      </div>

      <NuxtLink
        to="/update"
        class="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-bold text-green-600 dark:text-green-400 border border-green-600/30 dark:border-green-400/30 rounded-full no-underline hover:bg-green-600/8 hover:border-green-600/55 transition-all duration-200 shrink-0 self-start md:self-auto"
      >
        Semua Berita
        <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
      </NuxtLink>
    </div>

    <!-- ── Loading ── -->
    <!-- Desktop: bento grid -->
    <div v-if="pending" class="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
      <div
        v-for="i in 4"
        :key="i"
        class="rounded-sm bg-white/10 animate-pulse"
        :class="i === 1 ? 'min-h-[440px] col-span-2' : 'min-h-[320px]'"
      />
    </div>
    <!-- Mobile: single skeleton -->
    <div v-if="pending" class="sm:hidden w-full h-72 rounded-sm bg-white/10 animate-pulse" />

    <!-- ── Bento Grid (desktop sm+) ── -->
    <div
      v-else-if="news && news.length"
      class="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto"
    >
      <NuxtLink
        v-for="(item, index) in news"
        :key="item.id"
        :to="'/update/' + item.slug"
        class="relative overflow-hidden rounded-sm block cursor-pointer no-underline group transition-all duration-400 hover:scale-[1.02] hover:shadow-2xl"
        :class="index === 0
          ? 'col-span-2 min-h-[440px] lg:min-h-[480px]'
          : 'min-h-[320px]'"
      >
        <!-- BG image -->
        <NuxtImg
          v-if="getImageUrl(item)"
          :src="getImageUrl(item)!"
          :alt="item.title"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <!-- Fallback -->
        <div
          v-else
          class="absolute inset-0 bg-gradient-to-br from-[#052e16] to-[#064e3b] flex items-center justify-center"
        >
          <UIcon name="i-lucide-leaf" class="w-12 h-12 text-green-300/50" />
        </div>

        <!-- Overlays -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/5 opacity-85 group-hover:opacity-92 transition-opacity duration-400" />
        <div class="absolute inset-0 bg-gradient-to-br from-green-600/12 via-transparent to-teal-600/10" />

        <!-- Category badge -->
        <div class="absolute top-3.5 left-3.5 z-10">
          <span
            class="news-badge relative inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white overflow-hidden shadow-lg bg-gradient-to-r"
            :class="categoryGradient(item.category)"
          >
            <UIcon name="i-lucide-tag" class="w-3 h-3" />
            {{ item.category || 'Update' }}
            <span class="badge-sweep" aria-hidden="true" />
          </span>
        </div>

        <!-- Content -->
        <div
          class="absolute inset-x-0 bottom-0 z-10 p-5 flex flex-col gap-2 group-hover:-translate-y-1.5 transition-transform duration-400"
        >
          <h3
            class="font-bold text-white leading-snug line-clamp-2"
            :class="index === 0 ? 'text-2xl md:text-[28px]' : 'text-[17px]'"
          >
            {{ item.title }}
          </h3>
          <p v-if="index === 0 && item.sub_title" class="text-[14px] text-gray-300/90 leading-relaxed line-clamp-2">
            {{ item.sub_title }}
          </p>
          <footer class="flex items-center gap-1.5 text-[11px] text-gray-400/90 font-medium">
            <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 text-green-400" />
            <time :datetime="item.created_at">{{ formattedDate(item.created_at) }}</time>
          </footer>
          <!-- Read CTA -->
          <div class="inline-flex items-center gap-1.5 text-[13px] font-bold text-white opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            Baca Selengkapnya
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>

        <!-- Hover border glow -->
        <div class="absolute inset-0 rounded-sm border-2 border-transparent group-hover:border-green-400/45 transition-colors duration-400 pointer-events-none" />
      </NuxtLink>
    </div>

    <!-- ── Swipe Carousel (mobile only) ── -->
    <template v-if="news && news.length">
      <div
        ref="trackRef"
        class="sm:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
        @scroll.passive="handleScroll"
      >
        <NuxtLink
          v-for="(item, index) in news"
          :key="item.id"
          :to="'/update/' + item.slug"
          class="relative flex-none snap-start w-[calc(100%-1rem)] rounded-sm overflow-hidden block no-underline group"
          style="min-height: 280px;"
        >
          <NuxtImg
            v-if="getImageUrl(item)"
            :src="getImageUrl(item)!"
            :alt="item.title"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div
            v-else
            class="absolute inset-0 bg-gradient-to-br from-[#052e16] to-[#064e3b] flex items-center justify-center"
          >
            <UIcon name="i-lucide-leaf" class="w-10 h-10 text-green-300/50" />
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-black/88 via-black/35 to-transparent" />

          <!-- Badge -->
          <div class="absolute top-3 left-3 z-10">
            <span
              class="news-badge relative inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white overflow-hidden shadow bg-gradient-to-r"
              :class="categoryGradient(item.category)"
            >
              <UIcon name="i-lucide-tag" class="w-3 h-3" />
              {{ item.category || 'Update' }}
              <span class="badge-sweep" aria-hidden="true" />
            </span>
          </div>

          <!-- Content -->
          <div class="absolute inset-x-0 bottom-0 z-10 p-4 flex flex-col gap-1.5">
            <h3 class="text-[16px] font-bold text-white leading-snug line-clamp-2">{{ item.title }}</h3>
            <footer class="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
              <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 text-green-400" />
              <time :datetime="item.created_at">{{ formattedDate(item.created_at) }}</time>
            </footer>
          </div>

          <div class="absolute inset-0 rounded-sm border-2 border-transparent group-hover:border-green-400/45 transition-colors duration-300 pointer-events-none" />
        </NuxtLink>
      </div>

      <!-- Dots (mobile) -->
      <div v-if="dotCount > 1" class="sm:hidden flex items-center justify-center gap-1.5 mt-2">
        <button
          v-for="(_, i) in dotCount"
          :key="i"
          :aria-label="'Berita ' + (i + 1)"
          class="h-1.5 rounded-full border-none cursor-pointer transition-all duration-300"
          :class="i === dotIndex ? 'w-6 bg-green-500' : 'w-1.5 bg-gray-400/50 hover:bg-green-400'"
          @click="scrollTo(i)"
        />
      </div>
    </template>

    <!-- ── Empty ── -->
    <div
      v-else-if="!pending"
      class="flex flex-col items-center justify-center py-16 rounded-sm border-2 border-dashed border-white/20 gap-3 text-center"
    >
      <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <UIcon name="i-lucide-newspaper" class="w-8 h-8 text-gray-400 dark:text-gray-600" />
      </div>
      <h3 class="text-[17px] font-bold text-gray-700 dark:text-gray-200">Belum ada berita</h3>
      <p class="text-sm text-gray-400 max-w-xs leading-relaxed">Informasi terbaru akan segera hadir di sini.</p>
    </div>
  </div>
</template>

<style scoped>
/* ── Section badge (light sweep — tidak bisa pure Tailwind) ── */
.section-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.875rem 0.3rem 0.6rem;
  background: linear-gradient(to right, #dcfce7, #ccfbf1);
  border: 1px solid rgba(22, 163, 74, 0.25);
  border-radius: 9999px;
  overflow: hidden;
  width: fit-content;
}

:global(.dark) .section-badge {
  background: linear-gradient(to right, rgba(21,128,61,0.2), rgba(15,118,110,0.2));
  border-color: rgba(34,197,94,0.3);
}

/* Badge light sweep (section + news card) */
.badge-sweep {
  position: absolute;
  top: 0; left: 0;
  width: 55%; height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
  border-radius: inherit;
  pointer-events: none;
  animation: badge-sweep 3.5s ease-in-out infinite;
}

@keyframes badge-sweep {
  0%   { transform: translateX(-200%); opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { transform: translateX(280%); opacity: 0; }
}

.news-badge { animation-delay: 1s; }

/* Scrollbar hide */
.scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>
