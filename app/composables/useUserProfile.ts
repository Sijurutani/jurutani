import type { UserProfile } from '~/types/user'

export type { UserProfile }

/**
 * useUserProfile - composable sebagai function yang membungkus Pinia auth store.
 * Menyediakan data profil serta utility untuk template/halaman.
 */
export const useUserProfile = () => {
    const store = useAuthStore()

    return {
        // -- State -------------------------------------------------------
        profileData: readonly(store.profile as Ref<UserProfile | null>),
        loading: computed(() => store.profileLoading),
        error: computed(() => store.error),

        // -- Computed profile (gabungan auth-user + DB) ------------------
        profile: store.computedProfile,
        avatarUrl: store.avatarUrl,
        isAuthenticated: store.isAuthenticated,
        initials: store.initials,
        roleLabel: store.roleLabel,

        // -- Methods -----------------------------------------------------
        fetchProfile: store.fetchProfile,
        updateProfile: store.updateProfile,
        uploadAvatar: store.uploadAvatar,
        refreshAvatarCache: store.refreshAvatarCache,
        formatDate: store.formatDate,
    }
}
