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

// --- Navbar State ---
const navbarClasses = computed(() => ({
  'bg-white/90 dark:bg-green-950/90 backdrop-blur-xl shadow-lg border-b border-green-200/50 dark:border-green-700/50': isScrolled.value,
  'bg-transparent': !isScrolled.value,
}))

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
const profileDropdownRef = ref(null)

onClickOutside(profileDropdownRef, () => {
  isProfileOpen.value = false
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
    <nav
      class="fixed top-0 left-0 right-0 z-60 transition-all duration-300"
      :class="navbarClasses"
      role="navigation"
      aria-label="Main navigation"
    >
      <div class="container max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4">
          <!-- Left side: Mobile Toggle & Logo -->
          <div class="flex items-center gap-3">
            <div
              class="flex flex-nowrap items-center justify-center gap-2 p-2 rounded-xl bg-white/50 dark:bg-green-900/50 backdrop-blur-sm border border-green-100/50 dark:border-green-700/50 shadow-sm transition-all duration-300 hover:shadow-md xl:hidden"
              role="toolbar"
            >
              <UButton
                :icon="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
                variant="ghost"
                size="sm"
                :aria-label="isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'"
                :aria-expanded="isMobileMenuOpen"
                @click="toggleMobileMenu"
              />
            </div>
            
            <NuxtLink 
              to="/" 
              class="flex items-center transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-green-500 focus-visible:outline-offset-2 rounded-lg"
              :aria-label="`${siteMeta.title} - Kembali ke beranda`"
            >
              <NuxtImg 
                src="/jurutani.png" 
                :alt="`Logo ${siteMeta.title}`"
                class="h-10 w-auto logo-img"
                loading="eager"
                preload
                format="webp"
                quality="90"
                width="160"
                height="40"
              />
            </NuxtLink>
          </div>

          <!-- Middle: Desktop Primary Nav -->
          <div class="hidden xl:flex flex-1 justify-center max-w-3xl">
            <nav class="flex items-center justify-center gap-1" aria-label="Primary navigation">
              <template v-for="nav in navsPrimary" :key="nav.title">
                <UDropdownMenu
                  v-if="nav.children"
                  :items="getDropdownItems(nav.children)"
                  mode="hover"
                  :open-delay="150"
                  :close-delay="200"
                  :ui="{
                    content: 'w-48 bg-white dark:bg-green-950 border border-green-200 dark:border-green-800 z-[70]',
                    item: 'rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/50',
                    itemLeadingIcon: 'shrink-0 size-5 text-green-600 dark:text-green-400',
                  }"
                >
                  <UButton
                    variant="ghost"
                    color="primary"
                    trailing-icon="i-heroicons-chevron-down-20-solid"
                    class="font-medium hover:bg-green-50 dark:hover:bg-green-900/30"
                  >
                    <UIcon v-if="nav.icon" :name="nav.icon" class="mr-2 h-6 w-6" />
                    {{ nav.title }}
                  </UButton>
                </UDropdownMenu>

                <UButton
                  v-else
                  :to="nav.to"
                  variant="ghost"
                  color="primary"
                  class="font-medium hover:bg-green-50 dark:hover:bg-green-900/30"
                  :class="{ 'bg-green-100 dark:bg-green-900 font-semibold text-green-700 dark:text-green-300': isActive(nav.to!) }"
                >
                  <UIcon v-if="nav.icon" :name="nav.icon" class="mr-2 h-6 w-6" />
                  {{ nav.title }}
                </UButton>
              </template>
            </nav>
          </div>

          <!-- Right: Profile Actions & Secondary Nav -->
          <div class="flex items-center gap-2">
            <!-- Profile Actions (Dark Mode Switch) -->
            <div class="hidden sm:flex flex-nowrap items-center justify-center gap-2 p-2 rounded-xl bg-white/50 dark:bg-green-900/50 backdrop-blur-sm border border-green-100/50 dark:border-green-700/50 shadow-sm transition-all duration-300 hover:shadow-md">
              <DarkModeSwitch />
            </div>

            <!-- Profile / Secondary Menu -->
            <div ref="profileDropdownRef" class="relative">
              <button
                type="button"
                class="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-full transition-all duration-200 hover:scale-105"
                @click="isProfileOpen = !isProfileOpen"
              >
                <div
                  class="relative rounded-full overflow-hidden ring-2 transition-all duration-200 w-12 h-12"
                  :class="authStore.isAuthenticated ? 'ring-green-500/30 hover:ring-green-500/50' : 'ring-gray-300/30 hover:ring-gray-300/50'"
                >
                  <img :src="authStore.avatarUrl" :alt="authStore.computedProfile?.displayName || 'Guest'" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" @error="handleImageError">
                  <div
                    v-if="authStore.isAuthenticated"
                    class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-green-950 rounded-full"
                  />
                </div>
              </button>

              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-2"
              >
                <div
                  v-if="isProfileOpen"
                  class="fixed left-1/2 -translate-x-1/2 top-16 sm:absolute sm:left-auto sm:right-0 sm:translate-x-0 sm:top-auto mt-0 sm:mt-2 w-[calc(100vw-1rem)] max-w-[360px] sm:w-72 lg:w-80 bg-white dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-2xl shadow-xl z-70 overflow-hidden"
                >
                  <div class="p-4 border-b border-green-200 dark:border-green-800">
                    <div v-if="authStore.isAuthenticated && authStore.computedProfile" class="flex items-center gap-3 mb-3">
                      <div class="w-16 h-16 rounded-full overflow-hidden ring-2 ring-green-500/30">
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

                    <div class="flex items-center justify-center sm:justify-start sm:hidden mb-2">
                      <DarkModeSwitch />
                    </div>
                  </div>

                  <div v-if="authStore.isAuthenticated" class="p-3 border-b border-green-200 dark:border-green-800">
                    <UButton block color="error" size="lg" icon="i-heroicons-arrow-left-on-rectangle" @click="handleLogout">
                      Logout
                    </UButton>
                  </div>
                  <div v-else class="p-3 border-b border-green-200 dark:border-green-800 space-y-2">
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
      </div>
    </nav>

    <!-- Mobile Navigation Menu Dropdown from bottom -->
    <Transition name="slide-up">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-50 xl:hidden"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="toggleMobileMenu" />

        <div ref="menuRef" class="absolute bottom-0 left-0 right-0 bg-white dark:bg-green-950 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
          <div class="flex justify-center pt-3 pb-2">
            <div class="w-12 h-1.5 bg-gray-300 dark:bg-green-700 rounded-full" />
          </div>

          <div class="p-4 pb-8">
            <div class="xl:hidden flex flex-col items-center border-muted rounded-xl p-4">
              <NuxtImg src="/jurutani.png" alt="Logo JuruTani" class="h-10 w-auto mb-4" />

              <div class="w-full max-w-md mx-auto">
                <div class="grid grid-cols-3 gap-2">
                  <template v-for="nav in navsPrimary" :key="nav.title">
                    <template v-if="nav.children">
                      <NuxtLink
                        v-for="child in nav.children"
                        :key="child.to"
                        :to="child.to"
                        class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-green-900/30 hover:bg-green-50 dark:hover:bg-green-900/50 border border-transparent hover:border-green-200 dark:hover:border-green-700 transition-all duration-200 group"
                        :class="isActive(child.to!) ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-600' : ''"
                        @click="toggleMobileMenu"
                      >
                        <UIcon v-if="child.icon" :name="child.icon" class="h-6 w-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200" />
                        <span class="text-xs font-medium text-gray-700 dark:text-gray-200 text-center leading-tight">{{ child.title }}</span>
                      </NuxtLink>
                    </template>
                    <NuxtLink
                      v-else
                      :to="nav.to"
                      class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-green-900/30 hover:bg-green-50 dark:hover:bg-green-900/50 border border-transparent hover:border-green-200 dark:hover:border-green-700 transition-all duration-200 group"
                      :class="isActive(nav.to!) ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-600' : ''"
                      @click="toggleMobileMenu"
                    >
                      <UIcon v-if="nav.icon" :name="nav.icon" class="h-6 w-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200" />
                      <span class="text-xs font-medium text-gray-700 dark:text-gray-200 text-center leading-tight">{{ nav.title }}</span>
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
.logo-img {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
a:hover .logo-img {
  filter: brightness(1.1);
}
a:active .logo-img {
  transform: scale(0.95);
}

:deep(.u-button:focus-visible) {
  outline: 2px solid rgb(34 197 94);
  outline-offset: 2px;
}
:deep(.u-button) {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
:deep(.router-link-active) {
  font-weight: 600;
}

:deep([data-headlessui-state="open"]) {
  animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
:deep([role="menu"]) {
  z-index: 99999 !important;
}
:deep([id^="headlessui-menu"]) {
  z-index: 99999 !important;
}
:deep(.group:hover .shrink-0) {
  transform: scale(1.1);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

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
</style>
