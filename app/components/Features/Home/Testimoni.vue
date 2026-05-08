<script setup lang="ts">
  const testimonials = [
    {
      id: 1,
      name: 'Ahmad Blora',
      role: 'Petani Tanaman Pangan',
      quote: 'Aplikasi JuruTani sangat membantu saya mendapatkan informasi tentang masalah pertanian secara instan. Saya bisa bertanya langsung lewat chat JuruTani dan mendapatkan solusi dari pakar tepercaya tanpa harus menunggu lama.',
      avatar: 'https://ui-avatars.com/api/?name=Ahmad+Blora&background=10b981&color=fff',
      rating: 5,
      span: 'md:col-span-8 lg:col-span-7',
      bgClass: 'bg-gradient-to-br from-emerald-500/10 to-teal-900/40 border-emerald-500/20'
    },
    {
      id: 2,
      name: 'Fisya Hapsari',
      role: 'UMKM Produk Pertanian',
      quote: 'JuruTani sangat bermanfaat untuk promosi produk saya. Platform ini memberikan akses pasar yang luas.',
      avatar: 'https://ui-avatars.com/api/?name=Fisya+Hapsari&background=f59e0b&color=fff',
      rating: 5,
      span: 'md:col-span-4 lg:col-span-5',
      bgClass: 'bg-gradient-to-bl from-amber-500/10 to-orange-900/40 border-amber-500/20'
    },
    {
      id: 3,
      name: 'Sugeng',
      role: 'Petani Mitra',
      quote: 'Fitur komunikasi ini sangat memudahkan saya berkonsultasi langsung ke penyuluh kapan saja.',
      avatar: 'https://ui-avatars.com/api/?name=Sugeng&background=ef4444&color=fff',
      rating: 5,
      span: 'md:col-span-4 lg:col-span-5',
      bgClass: 'bg-gradient-to-tr from-rose-500/10 to-red-900/40 border-rose-500/20'
    },
    {
      id: 4,
      name: 'Suwarni',
      role: 'Petani Sayuran',
      quote: 'JuruTani mantap! Fitur prediksi cuaca dan kalkulator benih beserta takaran pupuk benar-benar akurat. Sangat berguna sebagai bahan pertimbangan utama dalam budidaya tanaman harian saya.',
      avatar: 'https://ui-avatars.com/api/?name=Suwarni&background=8b5cf6&color=fff',
      rating: 5,
      span: 'md:col-span-8 lg:col-span-7',
      bgClass: 'bg-gradient-to-tl from-indigo-500/10 to-violet-900/40 border-indigo-500/20'
    },
  ]

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
</script>

<template>
  <div class="px-4 lg:px-6 flex flex-col gap-6 relative">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <!-- Badge -->
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100/50 dark:bg-green-900/20 border border-green-500/20 mb-3 shadow-sm">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span class="text-[10px] font-extrabold uppercase tracking-widest text-green-700 dark:text-green-400">
            Suara Petani
          </span>
        </div>

        <h2 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-50 tracking-tight">
          Testimoni Pengguna
        </h2>
        <p class="text-sm md:text-[15px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed max-w-xl">
          Kisah sukses dan cerita pengalaman dari petani serta pelaku usaha yang telah merasakan manfaat revolusi digital bersama JuruTani.
        </p>
      </div>
    </div>

    <!-- Bento Grid Container -->
    <!-- Mobile: Horizontal swipe (consistent), Desktop: Bento Grid asimetris yang keren -->
    <div class="hidden md:grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-fr">
      <article
        v-for="(item, i) in testimonials"
        :key="item.id"
        class="relative flex flex-col justify-between p-6 rounded-3xl border backdrop-blur-2xl shadow-xl shadow-black/5 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 group overflow-hidden"
        :class="[item.span, item.bgClass]"
      >
        <!-- Dekorasi Background Quote -->
        <UIcon 
          name="i-lucide-quote" 
          class="absolute -top-4 -right-4 w-32 h-32 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-500" 
          :class="{
            'text-emerald-500': i === 0,
            'text-amber-500': i === 1,
            'text-rose-500': i === 2,
            'text-indigo-500': i === 3,
          }"
        />
        
        <div class="relative z-10 mb-6">
          <div class="flex items-center gap-1 mb-4">
            <UIcon
              v-for="s in item.rating"
              :key="s"
              name="i-heroicons-star-20-solid"
              class="w-4 h-4 text-amber-400 drop-shadow-sm"
            />
          </div>
          <p class="text-[15px] md:text-base font-medium text-gray-800 dark:text-gray-200 leading-relaxed italic">
            "{{ item.quote }}"
          </p>
        </div>

        <div class="relative z-10 flex items-center gap-4 mt-auto">
          <div class="relative">
            <div class="absolute inset-0 rounded-full blur-md opacity-50 bg-current" />
            <NuxtImg
              :src="item.avatar"
              :alt="item.name"
              class="relative w-12 h-12 rounded-full object-cover border-2 border-white/50 dark:border-gray-800/50 shadow-md"
              loading="lazy"
            />
          </div>
          <div>
            <p class="text-sm font-extrabold text-gray-900 dark:text-white tracking-wide">{{ item.name }}</p>
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-0.5">{{ item.role }}</p>
          </div>
        </div>
      </article>
    </div>

    <!-- Mobile view: Snap Carousel to preserve screen space -->
    <div class="flex flex-col gap-2 md:hidden">
      <div
        ref="trackRef"
        class="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide pb-2"
        @scroll.passive="handleScroll"
      >
        <article
          v-for="(item, i) in testimonials"
          :key="item.id"
          class="flex-none snap-start w-[85vw] p-5 rounded-2xl border backdrop-blur-xl flex flex-col justify-between overflow-hidden relative"
          :class="item.bgClass"
        >
          <UIcon 
            name="i-lucide-quote" 
            class="absolute -bottom-2 -right-2 w-24 h-24 opacity-5" 
          />
          <div class="relative z-10 mb-6">
            <div class="flex items-center gap-1 mb-3">
              <UIcon v-for="s in item.rating" :key="s" name="i-heroicons-star-20-solid" class="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p class="text-[13px] text-gray-800 dark:text-gray-200 leading-relaxed italic line-clamp-4">
              "{{ item.quote }}"
            </p>
          </div>
          <div class="relative z-10 flex items-center gap-3 mt-auto">
            <NuxtImg :src="item.avatar" :alt="item.name" class="w-10 h-10 rounded-full border-2 border-white/20" loading="lazy" />
            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">{{ item.name }}</p>
              <p class="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{{ item.role }}</p>
            </div>
          </div>
        </article>
      </div>

      <!-- Mobile Dots -->
      <div v-if="testimonials.length > 1" class="flex justify-center items-center gap-1.5 mt-1">
        <button
          v-for="(_, i) in testimonials"
          :key="i"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="i === dotIndex ? 'w-5 bg-green-500' : 'w-1.5 bg-gray-300 dark:bg-gray-700'"
          aria-label="Testimoni"
          @click="scrollTo(i)"
        />
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Hapus scrollbar untuk Testimoni Mobile */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
