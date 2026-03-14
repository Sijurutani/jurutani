/**
 * useAuth - composable sebagai function yang membungkus Pinia auth store.
 * Mempertahankan kompatibilitas API dengan kode yang sudah ada sebelumnya.
 */
export const useAuth = () => {
    const store = useAuthStore()

    return {
        // -- State -------------------------------------------------------
        user: store.user,
        session: store.session,
        loading: computed(() => store.loading),
        isAuthenticated: store.isAuthenticated,
        /** Backward-compat error shape { auth, session } */
        error: computed(() => ({ auth: store.error, session: null })),

        // -- Methods (alias ke store actions) ----------------------------
        initialize: async () => {
            if (store.user && !store.profile) {
                await store.fetchProfile()
            }
        },
        login: store.signIn,
        register: store.signUp,
        loginWithSocialProvider: store.signInWithSocialProvider,
        logout: store.signOut,
        resetPassword: store.resetPassword,
        updatePassword: store.updatePassword,
        resendConfirmation: store.resendConfirmation,
    }
}
