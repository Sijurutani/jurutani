/**
 * @deprecated Gunakan `useAuth` untuk autentikasi dan `useProfile` untuk manajemen profil.
 * File ini dipertahankan murni untuk backward compatibility (agar komponen lama tidak error).
 */
export const useAuthStore = () => {
  const auth = useAuth()
  const profileState = useProfile()

  // Gabungkan semua dalam satu objek reactive agar sifatnya sama persis seperti sebelumnya
  return reactive({
    // State (refs)
    user: auth.user,
    session: auth.session,
    profile: profileState.profile,
    loading: auth.loading,
    profileLoading: profileState.profileLoading,
    error: auth.error,

    // Computed
    isAuthenticated: auth.isAuthenticated,
    displayName: profileState.displayName,
    avatarUrl: profileState.avatarUrl,
    initials: profileState.initials,
    roleLabel: profileState.roleLabel,
    computedProfile: profileState.computedProfile,

    // Auth actions
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    signInWithSocialProvider: auth.signInWithSocialProvider,
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword,
    resendConfirmation: auth.resendConfirmation,

    // Profile actions
    fetchProfile: profileState.fetchProfile,
    updateProfile: profileState.updateProfile,
    uploadAvatar: profileState.uploadAvatar,
    refreshAvatarCache: profileState.refreshAvatarCache,
    init: profileState.initProfile,
  })
}
