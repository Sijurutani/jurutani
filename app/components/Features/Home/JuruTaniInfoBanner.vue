<script setup lang="ts">
// Komponen dekoratif info JuruTani — inspirasi dari bgn.go.id
// Bersifat standalone: tidak ada data fetching, murni informasi + CTA

const features = [
  {
    icon: 'i-lucide-shield-check',
    label: 'Terverifikasi',
    desc: 'Penyuluh & pakar berlisensi resmi',
  },
  {
    icon: 'i-lucide-zap',
    label: 'Respon Cepat',
    desc: 'Jawaban dalam hitungan menit',
  },
  {
    icon: 'i-lucide-leaf',
    label: '100% Gratis',
    desc: 'Seluruh layanan tanpa biaya',
  },
]
</script>

<template>
  <div class="jtb-root">
    <!-- Decorative background pattern (wavy/batik motif via SVG) -->
    <div class="jtb-bg" aria-hidden="true">
      <!-- Background Image -->
      <!-- <NuxtImg
        src="/LOGO02.webp"
        class="absolute inset-y-0 right-0 w-full h-full object-cover object-[80%_center] opacity-40 mix-blend-overlay pointer-events-none"
        style="mask-image: linear-gradient(to right, transparent 0%, transparent 30%, black 100%); -webkit-mask-image: linear-gradient(to right, transparent 0%, transparent 30%, black 100%);"
        loading="lazy"
      /> -->

      <svg class="jtb-bg__svg jtb-bg__svg--right" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="130" cy="130" r="110" stroke="currentColor" stroke-width="18" fill="none" opacity="0.12"/>
        <circle cx="130" cy="130" r="80"  stroke="currentColor" stroke-width="14" fill="none" opacity="0.09"/>
        <circle cx="130" cy="130" r="50"  stroke="currentColor" stroke-width="10" fill="none" opacity="0.07"/>
        <circle cx="130" cy="130" r="22"  fill="currentColor" opacity="0.08"/>
        <path d="M20 130 Q65 80 130 130 Q195 180 240 130" stroke="currentColor" stroke-width="10" fill="none" opacity="0.1" stroke-linecap="round"/>
        <path d="M20 100 Q65 50 130 100 Q195 150 240 100" stroke="currentColor" stroke-width="6"  fill="none" opacity="0.07" stroke-linecap="round"/>
        <path d="M20 160 Q65 110 130 160 Q195 210 240 160" stroke="currentColor" stroke-width="6"  fill="none" opacity="0.07" stroke-linecap="round"/>
      </svg>
      <svg class="jtb-bg__svg jtb-bg__svg--left" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 90 Q45 40 90 90 Q135 140 170 90" stroke="currentColor" stroke-width="10" fill="none" opacity="0.1" stroke-linecap="round"/>
        <circle cx="90" cy="90" r="70" stroke="currentColor" stroke-width="12" fill="none" opacity="0.08"/>
        <circle cx="90" cy="90" r="40" stroke="currentColor" stroke-width="8"  fill="none" opacity="0.07"/>
      </svg>
    </div>

    <!-- Logo / Visual Identity area -->
    <div class="jtb-visual" aria-hidden="true">
      <div class="jtb-logo-ring">
        <div class="jtb-logo-ring__inner">
          <NuxtImg
            src="/jurutani.webp"
            alt="Logo JuruTani"
            class="jtb-logo-img"
            loading="lazy"
            width="80"
            height="80"
            @error="(e: any) => e.target.style.display = 'none'"
          />
        </div>
      </div>
    </div>

    <!-- Text Content -->
    <div class="jtb-body">
      <div class="jtb-eyebrow">
        <span class="jtb-eyebrow__dot" />
        <span class="jtb-eyebrow__text">Tentang JuruTani</span>
        <span class="jtb-eyebrow__sweep" aria-hidden="true" />
      </div>

      <h2 class="jtb-title">
        Platform Penyuluhan Pertanian
        <span class="jtb-title__accent">Digital #1 Indonesia</span>
      </h2>

      <p class="jtb-desc">
        JuruTani adalah inisiatif strategis yang menghubungkan petani seluruh Indonesia dengan penyuluh bersertifikat, pakar pertanian, dan ekosistem agribisnis — semuanya dalam satu platform terpadu.
      </p>

      <!-- Feature pills -->
      <div class="jtb-features">
        <div v-for="f in features" :key="f.label" class="jtb-feature">
          <div class="jtb-feature__icon">
            <UIcon :name="f.icon" class="w-4 h-4" />
          </div>
          <div>
            <p class="jtb-feature__label">{{ f.label }}</p>
            <p class="jtb-feature__desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>

      <!-- CTAs -->
      <div class="jtb-ctas">
        <NuxtLink to="/discussions" class="jtb-cta jtb-cta--primary">
          <UIcon name="i-lucide-message-circle" class="w-4 h-4" />
          Mulai Konsultasi
        </NuxtLink>
        <NuxtLink to="/about-us" class="jtb-cta jtb-cta--ghost">
          <UIcon name="i-lucide-info" class="w-4 h-4" />
          Pelajari Lebih Lanjut
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ══ Root ═══════════════════════════════════════════════════════════════ */
.jtb-root {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
  padding: 3rem 2rem;
  border-radius: 1.25rem;
  overflow: hidden;
  isolation: isolate;

  /* Rich dark green — JuruTani identity, stable di semua mode */
  background: linear-gradient(135deg, #052e16 0%, #064e3b 45%, #0f4c35 100%);
}

@media (min-width: 768px) {
  .jtb-root {
    flex-direction: row;
    align-items: center;
    gap: 3rem;
    padding: 3.5rem 3.5rem;
  }
}

@media (min-width: 1280px) {
  .jtb-root {
    padding: 4rem 5rem;
  }
}

/* ══ Decorative Background SVG ══════════════════════════════════════════ */
.jtb-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.jtb-bg__svg {
  position: absolute;
  color: #4ade80;
}

.jtb-bg__svg--right {
  width: clamp(200px, 35%, 320px);
  height: auto;
  right: -2%;
  top: 50%;
  transform: translateY(-50%);
}

.jtb-bg__svg--left {
  width: clamp(100px, 18%, 200px);
  height: auto;
  left: -3%;
  bottom: -20%;
  opacity: 0.6;
}

/* ══ Logo Visual ════════════════════════════════════════════════════════ */
.jtb-visual {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: none;
}

@media (min-width: 768px) {
  .jtb-visual {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.jtb-logo-ring {
  width: 9rem;
  height: 9rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  box-shadow:
    0 0 0 12px rgba(74, 222, 128, 0.06),
    0 0 0 24px rgba(74, 222, 128, 0.03),
    0 16px 48px rgba(0, 0, 0, 0.4);
}

.jtb-logo-ring__inner {
  width: 6.5rem;
  height: 6.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.jtb-logo-img {
  width: 4rem;
  height: 4rem;
  object-fit: contain;
  filter: brightness(0) invert(1) opacity(0.9);
}

/* ══ Body Content ═══════════════════════════════════════════════════════ */
.jtb-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
  min-width: 0;
}

/* Eyebrow badge — dengan light sweep */
.jtb-eyebrow {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.875rem;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 9999px;
  overflow: hidden;
  width: fit-content;
  backdrop-filter: blur(6px);
}

.jtb-eyebrow__dot {
  display: block;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: #4ade80;
  flex-shrink: 0;
  animation: dot-blink 2s ease-in-out infinite;
}

@keyframes dot-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}

.jtb-eyebrow__text {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.88);
}

/* Light sweep */
.jtb-eyebrow__sweep {
  position: absolute;
  top: 0; left: 0;
  width: 55%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
  pointer-events: none;
  animation: sweep 4s ease-in-out 1.5s infinite;
}

@keyframes sweep {
  0%   { transform: translateX(-200%); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateX(280%); opacity: 0; }
}

/* Title */
.jtb-title {
  font-size: 1.625rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

@media (min-width: 640px) {
  .jtb-title { font-size: 2rem; }
}

@media (min-width: 1024px) {
  .jtb-title { font-size: 2.25rem; }
}

.jtb-title__accent {
  display: block;
  background: linear-gradient(135deg, #4ade80, #34d399, #6ee7b7);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  isolation: isolate;
  transform: translateZ(0);
}

/* Description */
.jtb-desc {
  font-size: 0.9375rem;
  color: rgba(209, 213, 219, 0.88);
  line-height: 1.7;
  max-width: 38rem;
}

/* Feature pills */
.jtb-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .jtb-features {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem 1.5rem;
  }
}

.jtb-feature {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}

.jtb-feature__icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: rgba(74, 222, 128, 0.18);
  border: 1px solid rgba(74, 222, 128, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ade80;
  flex-shrink: 0;
}

.jtb-feature__label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
}

.jtb-feature__desc {
  font-size: 0.7rem;
  color: rgba(209, 213, 219, 0.7);
  margin: 0.1rem 0 0;
  line-height: 1.4;
}

/* CTAs */
.jtb-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.jtb-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 9999px;
  padding: 0.625rem 1.375rem;
  text-decoration: none;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.jtb-cta--primary {
  background: #16a34a;
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(22, 163, 74, 0.4);
}

.jtb-cta--primary:hover {
  background: #15803d;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(22, 163, 74, 0.5);
}

.jtb-cta--ghost {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(6px);
}

.jtb-cta--ghost:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(134, 239, 172, 0.45);
  transform: translateY(-2px);
}
</style>
