<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { onClickOutside } from '@vueuse/core'
import siteMeta from '@/site'
import { toastStore } from '~/composables/useJuruTaniToast'

const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu, handleKeydown, menuRef } = useMobileMenu()
const { isScrolled } = useNavbarScroll()
const { navsPrimary, navsSecondary } = useNavMenu()
const authStore = useAuthStore()
const route = useRoute()

// --- Lifecycle ---
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// --- Router Helpers ---
const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`)
}

// --- Menu Actions ---
const getDropdownItems = (children: any[]): DropdownMenuItem[][] => {
  return [
    children.map(child => ({
      label: child.title,
      icon: child.icon,
      to: child.to,
      class: isActive(child.to!) ? 'bg-green-100 dark:bg-green-900 font-semibold text-green-700 dark:text-green-300' : '',
    }))
  ]
}

// --- Profile Dropdown State ---
const isProfileOpen = ref(false)
const desktopProfileDropdownRef = ref<HTMLElement | null>(null)
const mobileProfileDropdownRef = ref<HTMLElement | null>(null)

onClickOutside(desktopProfileDropdownRef, () => {
  isProfileOpen.value = false
})

onClickOutside(mobileProfileDropdownRef, () => {
  isProfileOpen.value = false
})

watch(isMobileMenuOpen, (open) => {
  if (open) {
    isProfileOpen.value = false
  }
})

const handleLogout = async () => {
  const result = await authStore.signOut()
  
  if (result.success) {
    toastStore.success('Berhasil logout')
    isProfileOpen.value = false
    await navigateTo('/')
    window.location.reload()
  } else {
    toastStore.error('Gagal logout')
    console.error('Logout failed:', result.error)
  }
}

// Handle image error for avatar
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/profile.png'
}
</script>

<template>
  <div>
    <!-- ═══════════════════════ DESKTOP FLOATING NAVBAR ═══════════════════════ -->
    <div
      class="fixed top-0 left-0 right-0 z-60 hidden md:flex items-center justify-center nav-entrance"
      style="isolation: isolate;"
      :class="isScrolled ? 'pt-3' : 'pt-4'"
    >
      <nav
        class="floating-nav transition-all duration-500 ease-out"
        :class="[
          isScrolled ? 'floating-nav--scrolled' : 'floating-nav--top',
        ]"
        role="navigation"
        aria-label="Main navigation"
      >
        <!-- Inner wrapper -->
        <div class="flex items-center gap-3 px-3 py-2">

          <!-- Logo -->
          <NuxtLink
            to="/"
            class="flex items-center shrink-0 transition-all duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-green-500 focus-visible:outline-offset-2 rounded-xl px-1"
            :aria-label="`${siteMeta.title} - Kembali ke beranda`"
          >
            <NuxtImg
              src="/jurutani.png"
              :alt="`Logo ${siteMeta.title}`"
              class="h-8 w-auto logo-img"
              loading="eager"
              preload
              format="webp"
              quality="90"
              width="130"
              height="32"
            />
          </NuxtLink>

          <!-- Divider -->
          <div class="h-5 w-px bg-green-200/50 dark:bg-green-700/50 mx-1 shrink-0" />

          <!-- Primary Nav Links -->
          <nav class="flex items-center gap-0.5" aria-label="Primary navigation">
            <template v-for="nav in navsPrimary" :key="nav.title">
              <UDropdownMenu
                v-if="nav.children"
                :items="getDropdownItems(nav.children)"
                mode="hover"
                :open-delay="100"
                :close-delay="150"
                :ui="{
                  content: 'w-48 bg-white/95 dark:bg-green-950/95 backdrop-blur-xl border border-green-200/60 dark:border-green-700/60 rounded-2xl shadow-xl shadow-green-900/10 z-[70]',
                  item: 'rounded-xl px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/50',
                  itemLeadingIcon: 'shrink-0 size-5 text-green-600 dark:text-green-400',
                }"
              >
                <button
                  class="nav-pill group"
                  :class="{ 'nav-pill--active': nav.children?.some(c => isActive(c.to!)) }"
                >
                  <UIcon v-if="nav.icon" :name="nav.icon" class="w-4 h-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200" />
                  <span>{{ nav.title }}</span>
                  <UIcon name="i-heroicons-chevron-down-20-solid" class="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-all duration-300" />
                </button>
              </UDropdownMenu>

              <NuxtLink
                v-else
                :to="nav.to"
                class="nav-pill group"
                :class="{ 'nav-pill--active': isActive(nav.to!) }"
              >
                <UIcon v-if="nav.icon" :name="nav.icon" class="w-4 h-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200" />
                <span>{{ nav.title }}</span>
              </NuxtLink>
            </template>
          </nav>

          <!-- Divider -->
          <div class="h-5 w-px bg-green-200/50 dark:bg-green-700/50 mx-1 shrink-0" />

          <!-- Right: Dark mode + Profile -->
          <div class="flex items-center gap-2 shrink-0">
            <DarkModeSwitch />

            <!-- Profile / Secondary Menu -->
            <div ref="desktopProfileDropdownRef" class="relative">
              <button
                type="button"
                aria-label="Buka menu profil"
                class="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                @click="isProfileOpen = !isProfileOpen"
              >
                <div
                  class="relative rounded-full overflow-hidden ring-2 transition-all duration-300 w-9 h-9"
                  :class="authStore.isAuthenticated
                    ? 'ring-green-500/40 hover:ring-green-500/70 hover:shadow-lg hover:shadow-green-500/20'
                    : 'ring-gray-300/40 hover:ring-gray-300/60'"
                >
                  <img
                    :src="authStore.avatarUrl"
                    :alt="authStore.computedProfile?.displayName || 'Guest'"
                    class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    @error="handleImageError"
                  >
                  <div
                    v-if="authStore.isAuthenticated"
                    class="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white dark:border-green-950 rounded-full"
                  />
                </div>
              </button>

              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95 translate-y-1"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 translate-y-1"
              >
                <div
                  v-if="isProfileOpen"
                  class="absolute right-0 top-full mt-4 w-72 bg-white/95 dark:bg-green-950/95 backdrop-blur-xl border border-green-200/60 dark:border-green-800/60 rounded-2xl shadow-2xl shadow-green-900/20 z-70 overflow-hidden"
                >
                  <div class="p-4 border-b border-green-100 dark:border-green-800/50">
                    <div v-if="authStore.isAuthenticated && authStore.computedProfile" class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-full overflow-hidden ring-2 ring-green-500/30 shrink-0">
                        <img :src="authStore.avatarUrl" :alt="authStore.computedProfile.displayName" class="w-full h-full object-cover" @error="handleImageError">
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {{ authStore.computedProfile.displayName }}
                        </p>
                        <p class="text-xs text-green-600 dark:text-green-400 truncate">
                          {{ authStore.computedProfile.email }}
                        </p>
                      </div>
                    </div>
                    <div v-else class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <UIcon name="i-heroicons-user-circle" class="w-5 h-5" />
                      Tamu
                    </div>
                  </div>

                  <div v-if="authStore.isAuthenticated" class="p-3 border-b border-green-100 dark:border-green-800/50">
                    <UButton block color="error" size="lg" icon="i-heroicons-arrow-left-on-rectangle" @click="handleLogout">
                      Logout
                    </UButton>
                  </div>
                  <div v-else class="p-3 border-b border-green-100 dark:border-green-800/50 space-y-2">
                    <UButton block color="success" size="lg" icon="i-heroicons-arrow-right-on-rectangle" to="/auth/login" @click="isProfileOpen = false">
                      Sign In
                    </UButton>
                    <UButton block color="success" variant="outline" size="lg" icon="i-heroicons-user-plus" to="/auth/register" @click="isProfileOpen = false">
                      Register
                    </UButton>
                  </div>

                  <div v-if="navsSecondary && navsSecondary.length > 0" class="p-3">
                    <div class="grid grid-cols-2 gap-2">
                      <UButton
                        v-for="nav in navsSecondary"
                        :key="nav.to"
                        :to="nav.to"
                        color="success"
                        variant="ghost"
                        class="h-auto! p-3! flex-col gap-1.5"
                        @click="isProfileOpen = false"
                      >
                        <UIcon :name="nav.icon" class="size-6 text-green-600 dark:text-green-400" />
                        <span class="text-xs font-medium text-gray-700 dark:text-gray-200 text-center">
                          {{ nav.title }}
                        </span>
                      </UButton>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- ═══════════════════════ MOBILE FLOATING NAVBAR ═══════════════════════ -->
    <div
      class="fixed top-0 left-0 right-0 z-60 flex items-center justify-center md:hidden nav-entrance px-4"
      style="isolation: isolate;"
      :class="isScrolled ? 'pt-3' : 'pt-4'"
    >
      <nav
        class="floating-nav floating-nav--mobile transition-all duration-500 ease-out"
        :class="isScrolled ? 'floating-nav--scrolled' : 'floating-nav--top'"
        role="navigation"
        aria-label="Main navigation"
      >
        <div class="flex w-full items-center justify-between px-4 py-2">

          <!-- Left: Hamburger + Logo -->
          <div class="flex flex-1 items-center gap-2 min-w-0">
            <UButton
              :icon="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
              variant="ghost"
              size="sm"
              color="success"
              :aria-label="isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'"
              :aria-expanded="isMobileMenuOpen"
              class="shrink-0"
              @click="toggleMobileMenu"
            />

            <!-- Divider -->
            <div class="h-5 w-px bg-green-200/50 dark:bg-green-700/50 shrink-0" />

            <!-- Logo -->
            <NuxtLink
              to="/"
              class="flex items-center shrink-0 transition-all duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-green-500 focus-visible:outline-offset-2 rounded-xl px-1"
              :aria-label="`${siteMeta.title} - Kembali ke beranda`"
            >
              <NuxtImg
                src="/jurutani.png"
                :alt="`Logo ${siteMeta.title}`"
                class="h-7 w-auto logo-img"
                loading="eager"
                preload
                format="webp"
                quality="90"
                width="120"
                height="28"
              />
            </NuxtLink>
          </div>

          <!-- Right: Dark Mode + Avatar -->
          <div class="flex shrink-0 items-center justify-end gap-2">
            <DarkModeSwitch />

            <!-- Profile Avatar -->
            <div ref="mobileProfileDropdownRef" class="relative">
              <button
                type="button"
                aria-label="Buka menu profil"
                class="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                @click="isProfileOpen = !isProfileOpen"
              >
                <div
                  class="relative rounded-full overflow-hidden ring-2 transition-all duration-200 w-8 h-8"
                  :class="authStore.isAuthenticated ? 'ring-green-500/40 hover:ring-green-500/70' : 'ring-gray-300/40 hover:ring-gray-300/60'"
                >
                  <img :src="authStore.avatarUrl" :alt="authStore.computedProfile?.displayName || 'Guest'" class="w-full h-full object-cover" @error="handleImageError">
                  <div
                    v-if="authStore.isAuthenticated"
                    class="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white dark:border-green-950 rounded-full"
                  />
                </div>
              </button>

              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95 translate-y-1"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 translate-y-1"
              >
                <div v-if="isProfileOpen" class="fixed inset-0 z-70 pointer-events-none md:static md:pointer-events-auto">
                  <button
                    type="button"
                    aria-label="Tutup panel profil"
                    class="pointer-events-auto absolute inset-0 md:hidden"
                    @click="isProfileOpen = false"
                  />
                  <div
                    class="pointer-events-auto absolute top-[calc(env(safe-area-inset-top)+5.5rem)] left-1/2 w-[calc(100vw-2rem)] max-w-[320px] -translate-x-1/2 overflow-hidden rounded-2xl border border-green-200/60 bg-white/95 shadow-2xl shadow-green-900/20 backdrop-blur-xl dark:border-green-800/60 dark:bg-green-950/95 md:absolute md:right-0 md:left-auto md:top-full md:mt-2 md:w-72 md:max-w-none md:translate-x-0 md:translate-y-0"
                  >
                  <div class="p-4 border-b border-green-100 dark:border-green-800/50">
                    <div v-if="authStore.isAuthenticated && authStore.computedProfile" class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-full overflow-hidden ring-2 ring-green-500/30 shrink-0">
                        <img :src="authStore.avatarUrl" :alt="authStore.computedProfile.displayName" class="w-full h-full object-cover" @error="handleImageError">
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {{ authStore.computedProfile.displayName }}
                        </p>
                        <p class="text-xs text-green-600 dark:text-green-400 truncate">
                          {{ authStore.computedProfile.email }}
                        </p>
                      </div>
                    </div>
                    <div v-else class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <UIcon name="i-heroicons-user-circle" class="w-5 h-5" />
                      Tamu
                    </div>
                  </div>

                  <div v-if="authStore.isAuthenticated" class="p-3 border-b border-green-100 dark:border-green-800/50">
                    <UButton block color="error" size="lg" icon="i-heroicons-arrow-left-on-rectangle" @click="handleLogout">
                      Logout
                    </UButton>
                  </div>
                  <div v-else class="p-3 border-b border-green-100 dark:border-green-800/50 space-y-2">
                    <UButton block color="success" size="lg" icon="i-heroicons-arrow-right-on-rectangle" to="/auth/login" @click="isProfileOpen = false">
                      Sign In
                    </UButton>
                    <UButton block color="success" variant="outline" size="lg" icon="i-heroicons-user-plus" to="/auth/register" @click="isProfileOpen = false">
                      Register
                    </UButton>
                  </div>

                  <div v-if="navsSecondary && navsSecondary.length > 0" class="p-3">
                    <div class="grid grid-cols-2 gap-2">
                      <UButton
                        v-for="nav in navsSecondary"
                        :key="nav.to"
                        :to="nav.to"
                        color="success"
                        variant="ghost"
                        class="h-auto! p-3! flex-col gap-1.5"
                        @click="isProfileOpen = false"
                      >
                        <UIcon :name="nav.icon" class="size-6 text-green-600 dark:text-green-400" />
                        <span class="text-xs font-medium text-gray-700 dark:text-gray-200 text-center">
                          {{ nav.title }}
                        </span>
                      </UButton>
                    </div>
                  </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

        </div>
      </nav>
    </div>

    <!-- Mobile Navigation Menu Dropdown from bottom -->
    <Transition name="slide-up">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-50 md:hidden"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="toggleMobileMenu" />

        <div ref="menuRef" class="absolute bottom-0 left-0 right-0 bg-white dark:bg-green-950 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
          <div class="flex justify-center pt-3 pb-2">
            <div class="w-12 h-1.5 bg-gray-300 dark:bg-green-700 rounded-full" />
          </div>

          <div class="p-4 pb-8">
            <div class="flex flex-col items-center border-muted rounded-xl p-4">
              <NuxtImg src="/jurutani.png" alt="Logo JuruTani" class="h-10 w-auto mb-4" />

              <div class="w-full max-w-md mx-auto">
                <div class="grid grid-cols-4 gap-1.5">
                  <template v-for="nav in navsPrimary" :key="nav.title">
                    <template v-if="nav.children">
                      <NuxtLink
                        v-for="child in nav.children"
                        :key="child.to"
                        :to="child.to"
                        class="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-gray-50 dark:bg-green-900/30 hover:bg-green-50 dark:hover:bg-green-900/50 border border-transparent hover:border-green-200 dark:hover:border-green-700 transition-all duration-200 group"
                        :class="isActive(child.to!) ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-600' : ''"
                        @click="toggleMobileMenu"
                      >
                        <UIcon v-if="child.icon" :name="child.icon" class="h-4 w-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200" />
                        <span class="text-[10px] font-medium text-gray-700 dark:text-gray-200 text-center leading-tight">{{ child.title }}</span>
                      </NuxtLink>
                    </template>
                    <NuxtLink
                      v-else
                      :to="nav.to"
                      class="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-gray-50 dark:bg-green-900/30 hover:bg-green-50 dark:hover:bg-green-900/50 border border-transparent hover:border-green-200 dark:hover:border-green-700 transition-all duration-200 group"
                      :class="isActive(nav.to!) ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-600' : ''"
                      @click="toggleMobileMenu"
                    >
                      <UIcon v-if="nav.icon" :name="nav.icon" class="h-4 w-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200" />
                      <span class="text-[10px] font-medium text-gray-700 dark:text-gray-200 text-center leading-tight">{{ nav.title }}</span>
                    </NuxtLink>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ═══════════════════════ NAV ENTRANCE ANIMATION ═══════════════════════ */
.nav-entrance {
  animation: navSlideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes navSlideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* ═══════════════════════ FLOATING NAV ═══════════════════════ */
.floating-nav {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid rgba(134, 239, 172, 0.35);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  background: rgba(255, 255, 255, 0.82);
  box-shadow:
    0 4px 24px -4px rgba(22, 163, 74, 0.14),
    0 1px 4px rgba(0,0,0,0.04),
    inset 0 1px 0 rgba(255,255,255,0.8);
  transition:
    box-shadow 0.4s ease,
    background 0.4s ease,
    border-color 0.4s ease;
}

/* Hover glow — safe box-shadow approach, no stacking context issues */
.floating-nav:hover {
  border-color: rgba(134, 239, 172, 0.65);
  box-shadow:
    0 8px 32px -8px rgba(22, 163, 74, 0.25),
    0 0 0 3px rgba(134, 239, 172, 0.18),
    0 2px 8px rgba(0,0,0,0.05),
    inset 0 1px 0 rgba(255,255,255,0.9);
}

/* Dark mode */
:global(.dark) .floating-nav {
  background: rgba(5, 46, 22, 0.85);
  border-color: rgba(22, 163, 74, 0.28);
  box-shadow:
    0 4px 24px -4px rgba(22, 163, 74, 0.2),
    0 1px 4px rgba(0,0,0,0.25),
    inset 0 1px 0 rgba(255,255,255,0.06);
}

:global(.dark) .floating-nav:hover {
  border-color: rgba(22, 163, 74, 0.5);
  box-shadow:
    0 8px 32px -8px rgba(22, 163, 74, 0.3),
    0 2px 8px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.08);
}

:global(.dark) .floating-nav__ring {
  background: conic-gradient(
    from var(--ring-angle, 0deg),
    transparent 0deg,
    rgba(22, 163, 74, 0.6) 60deg,
    rgba(16, 185, 129, 0.45) 120deg,
    transparent 180deg
  );
}

.floating-nav--top {
  padding: 0;
}

/* Mobile: override inline-flex so w-full / justify-between work */
.floating-nav--mobile {
  display: flex !important;
  width: 100%;
}

.floating-nav--scrolled {
  box-shadow:
    0 8px 32px -8px rgba(22, 163, 74, 0.2),
    0 2px 8px rgba(0,0,0,0.06),
    inset 0 1px 0 rgba(255,255,255,0.8);
}

:global(.dark) .floating-nav--scrolled {
  box-shadow:
    0 8px 32px -8px rgba(22, 163, 74, 0.28),
    0 2px 8px rgba(0,0,0,0.35),
    inset 0 1px 0 rgba(255,255,255,0.06);
}

/* ═══════════════════════ NAV PILL BUTTONS ═══════════════════════ */
.nav-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.45rem 0.9rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
}

:global(.dark) .nav-pill {
  color: #d1fae5;
}

.nav-pill::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(135deg, rgba(134, 239, 172, 0.15), rgba(16, 185, 129, 0.1));
  opacity: 0;
  transition: opacity 0.2s ease;
}

.nav-pill:hover::before {
  opacity: 1;
}

.nav-pill:hover {
  color: #15803d;
  border-color: rgba(134, 239, 172, 0.4);
}

:global(.dark) .nav-pill:hover {
  color: #6ee7b7;
  border-color: rgba(22, 163, 74, 0.35);
}

.nav-pill:active {
  transform: scale(0.97);
}

.nav-pill--active {
  color: #15803d;
  background: linear-gradient(135deg, rgba(134, 239, 172, 0.25), rgba(16, 185, 129, 0.15));
  border-color: rgba(134, 239, 172, 0.5);
  font-weight: 600;
}

:global(.dark) .nav-pill--active {
  color: #6ee7b7;
  background: linear-gradient(135deg, rgba(22, 163, 74, 0.2), rgba(16, 185, 129, 0.12));
  border-color: rgba(22, 163, 74, 0.4);
}

/* ═══════════════════════ LOGO ═══════════════════════ */
.logo-img {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease;
}
a:hover .logo-img {
  filter: brightness(1.1);
}
a:active .logo-img {
  transform: scale(0.95);
}

/* ═══════════════════════ MOBILE SLIDE UP ═══════════════════════ */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-active > div:last-child,
.slide-up-leave-active > div:last-child {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from > div:last-child,
.slide-up-leave-to > div:last-child {
  transform: translateY(100%);
}
.slide-up-enter-from > div:first-child,
.slide-up-leave-to > div:first-child {
  opacity: 0;
}

/* ═══════════════════════ DROPDOWN Z-INDEX ═══════════════════════ */
:deep([role="menu"]) {
  z-index: 99999 !important;
}
:deep([id^="headlessui-menu"]) {
  z-index: 99999 !important;
}
:deep([data-headlessui-state="open"]) {
  animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-6px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
