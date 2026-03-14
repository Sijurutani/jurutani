import { defineStore } from 'pinia'
import type { UserProfile } from '~/types/user'

/**
 * Pinia Auth Store — satu-satunya sumber kebenaran untuk autentikasi & profil.
 * Menggunakan @nuxtjs/supabase composables:
 *   - useSupabaseClient()  → Supabase client (singleton per request)
 *   - useSupabaseUser()    → Reactive ref<User | null>, auto-update via onAuthStateChange
 *   - useSupabaseSession() → Reactive ref<Session | null>
 */
export const useAuthStore = defineStore('auth', () => {
    // ─── Supabase primitives (dari @nuxtjs/supabase) ─────────────────────────
    const client = useSupabaseClient()
    const user = useSupabaseUser()
    const session = useSupabaseSession()

    // ─── Local state ──────────────────────────────────────────────────────────
    const profile = ref<UserProfile | null>(null)
    const loading = ref(false)
    const profileLoading = ref(false)
    const error = ref<string | null>(null)
    const avatarVersion = ref(Math.floor(Date.now() / (5 * 60 * 1000)))

    // ─── Computed ─────────────────────────────────────────────────────────────
    const isAuthenticated = computed(() => !!user.value)

    const displayName = computed(
        () =>
            profile.value?.full_name ||
            user.value?.user_metadata?.full_name ||
            user.value?.email?.split('@')[0] ||
            'User'
    )

    const avatarUrl = computed(() => {
        const raw =
            profile.value?.avatar_url ||
            user.value?.user_metadata?.avatar_url ||
            '/profile.png'
        if (raw === '/profile.png') return raw
        return raw.includes('?') ? raw : `${raw}?v=${avatarVersion.value}`
    })

    const initials = computed(() =>
        displayName.value
            .split(' ')
            .slice(0, 2)
            .map((n: string) => n[0])
            .join('')
            .toUpperCase() || 'U'
    )

    const roleLabel = computed(() => {
        return Enum.UserRole.find(r => r.value === profile.value?.role)?.label || 'Pengguna'
    })

    /** Gabungan data auth-user + profil DB untuk konsumsi template */
    const computedProfile = computed(() => {
        if (!user.value && !profile.value) return null
        return {
            id: user.value?.id ?? profile.value?.id ?? '',
            email: user.value?.email ?? profile.value?.email ?? '',
            displayName: displayName.value,
            fullName: profile.value?.full_name ?? user.value?.user_metadata?.full_name ?? '',
            avatar: profile.value?.avatar_url ?? user.value?.user_metadata?.avatar_url ?? '/profile.png',
            phone: profile.value?.phone ?? user.value?.user_metadata?.phone ?? '',
            role: profile.value?.role ?? 'user',
            bio: profile.value?.bio ?? '',
            location: profile.value?.location ?? '',
            createdAt: profile.value?.created_at ?? '',
            updatedAt: profile.value?.updated_at ?? '',
            isAuthenticated: !!user.value,
        }
    })

    // ─── Auth Actions ─────────────────────────────────────────────────────────

    /** Login dengan email + password */
    const signIn = async (email: string, password: string) => {
        loading.value = true
        error.value = null
        try {
            const { data, error: authError } = await client.auth.signInWithPassword({ email, password })
            if (authError) {
                error.value = authError.message
                return { success: false, error: authError.message }
            }
            return { success: true, data }
        }
        catch (err: any) {
            error.value = err.message
            return { success: false, error: err.message }
        }
        finally {
            loading.value = false
        }
    }

    /** Daftar akun baru */
    const signUp = async (
        email: string,
        password: string,
        fullName: string = 'User',
        phone: string = '',
    ) => {
        loading.value = true
        error.value = null
        try {
            const { data, error: authError } = await client.auth.signUp({
                email: email.trim().toLowerCase(),
                password,
                options: {
                    data: {
                        full_name: fullName.trim(),
                        phone: phone.trim(),
                        display_name: fullName.trim(),
                    },
                },
            })

            if (authError) {
                let msg = authError.message
                if (msg.includes('already registered') || msg.includes('already in use'))
                    msg = 'Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.'
                else if (msg.includes('weak password') || msg.includes('Password should be'))
                    msg = 'Kata sandi terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol.'
                else if (msg.includes('signup disabled'))
                    msg = 'Pendaftaran akun baru sedang dinonaktifkan. Silakan coba lagi nanti.'
                else if (msg.includes('rate limit'))
                    msg = 'Terlalu banyak percobaan. Silakan tunggu beberapa menit.'
                error.value = msg
                return { success: false, error: msg }
            }

            if (!data.user) {
                const msg = 'Gagal membuat akun. Silakan coba lagi.'
                error.value = msg
                return { success: false, error: msg }
            }

            if (!data.user.email_confirmed_at) {
                return {
                    success: true,
                    data,
                    needsConfirmation: true,
                    message: 'Akun berhasil dibuat! Silakan cek email Anda untuk mengkonfirmasi akun.',
                }
            }

            return { success: true, data }
        }
        catch (err: any) {
            let msg: string = err.message ?? 'Terjadi kesalahan saat mendaftar'
            if (msg.includes('Failed to fetch') || msg.includes('NetworkError'))
                msg = 'Koneksi bermasalah. Periksa koneksi internet Anda.'
            else if (msg.includes('timeout'))
                msg = 'Koneksi timeout. Silakan coba lagi.'
            error.value = msg
            return { success: false, error: msg }
        }
        finally {
            loading.value = false
        }
    }

    /** Logout */
    const signOut = async () => {
        loading.value = true
        error.value = null
        try {
            const { error: authError } = await client.auth.signOut()
            if (authError) {
                error.value = authError.message
                return { success: false, error: authError.message }
            }
            profile.value = null
            return { success: true }
        }
        catch (err: any) {
            error.value = err.message
            return { success: false, error: err.message }
        }
        finally {
            loading.value = false
        }
    }

    /** Login via OAuth provider */
    const signInWithSocialProvider = async (provider: 'google' | 'facebook' | 'github') => {
        loading.value = true
        error.value = null
        try {
            const baseUrl = import.meta.client ? window.location.origin : 'http://localhost:3000'
            const { data, error: authError } = await client.auth.signInWithOAuth({
                provider,
                options: { redirectTo: `${baseUrl}/auth/callback` },
            })
            if (authError) {
                error.value = authError.message
                return { success: false, error: authError.message }
            }
            return { success: true, data }
        }
        catch (err: any) {
            error.value = err.message
            return { success: false, error: err.message }
        }
        finally {
            loading.value = false
        }
    }

    /** Kirim email reset password */
    const resetPassword = async (email: string) => {
        loading.value = true
        error.value = null
        try {
            const baseUrl = import.meta.client ? window.location.origin : 'http://localhost:3000'
            const { error: authError } = await client.auth.resetPasswordForEmail(email, {
                redirectTo: `${baseUrl}/auth/reset-password`,
            })
            if (authError) {
                error.value = authError.message
                return { success: false, error: authError.message }
            }
            return { success: true }
        }
        catch (err: any) {
            error.value = err.message
            return { success: false, error: err.message }
        }
        finally {
            loading.value = false
        }
    }

    /** Ganti password user yang sudah login */
    const updatePassword = async (newPassword: string) => {
        loading.value = true
        error.value = null
        try {
            const { error: authError } = await client.auth.updateUser({ password: newPassword })
            if (authError) {
                error.value = authError.message
                return { success: false, error: authError.message }
            }
            return { success: true }
        }
        catch (err: any) {
            error.value = err.message
            return { success: false, error: err.message }
        }
        finally {
            loading.value = false
        }
    }

    /** Kirim ulang email konfirmasi */
    const resendConfirmation = async (email: string) => {
        loading.value = true
        error.value = null
        try {
            const { error: authError } = await client.auth.resend({ type: 'signup', email })
            if (authError) {
                error.value = authError.message
                return { success: false, error: authError.message }
            }
            return { success: true, message: 'Email konfirmasi telah dikirim ulang.' }
        }
        catch (err: any) {
            error.value = err.message
            return { success: false, error: err.message }
        }
        finally {
            loading.value = false
        }
    }

    // ─── Profile Actions ──────────────────────────────────────────────────────

    const fetchProfile = async (userId?: string) => {
        const targetId = userId ?? user.value?.id
        if (!targetId) return { success: false, error: 'User ID tidak ditemukan' }

        profileLoading.value = true
        error.value = null
        try {
            const { data, error: profileError } = await client
                .from('profiles')
                .select('*')
                .eq('id', targetId)
                .single()

            if (profileError) {
                error.value = profileError.message
                return { success: false, error: profileError.message }
            }
            profile.value = data as UserProfile
            return { success: true, data }
        }
        catch (err: any) {
            error.value = err.message
            return { success: false, error: err.message }
        }
        finally {
            profileLoading.value = false
        }
    }

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user.value?.id) return { success: false, error: 'User tidak terautentikasi' }

        profileLoading.value = true
        error.value = null
        try {
            const { data, error: updateError } = await client
                .from('profiles')
                .update(updates)
                .eq('id', user.value.id)
                .select()
                .single()

            if (updateError) {
                error.value = updateError.message
                return { success: false, error: updateError.message }
            }
            profile.value = data as UserProfile
            return { success: true, data }
        }
        catch (err: any) {
            error.value = err.message
            return { success: false, error: err.message }
        }
        finally {
            profileLoading.value = false
        }
    }

    const uploadAvatar = async (file: File) => {
        if (!user.value?.id) return { success: false, error: 'User tidak terautentikasi' }

        profileLoading.value = true
        error.value = null
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.value.id}-${Date.now()}.${fileExt}`
            const filePath = `avatars/${fileName}`

            const { error: uploadError } = await client.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (uploadError) {
                error.value = uploadError.message
                return { success: false, error: uploadError.message }
            }

            const { data: { publicUrl } } = client.storage.from('avatars').getPublicUrl(filePath)
            const updateResult = await updateProfile({ avatar_url: publicUrl })
            if (!updateResult.success) return updateResult

            refreshAvatarCache()
            return { success: true, data: { avatar_url: publicUrl } }
        }
        catch (err: any) {
            error.value = err.message
            return { success: false, error: err.message }
        }
        finally {
            profileLoading.value = false
        }
    }

    const refreshAvatarCache = () => {
        avatarVersion.value = Math.floor(Date.now() / (5 * 60 * 1000))
    }

    // Otomatis fetch profil saat user login / ganti user
    watch(user, async (newUser) => {
        if (newUser && !profile.value) {
            await fetchProfile(newUser.id)
        }
        else if (!newUser) {
            profile.value = null
        }
    })

    // ─── Exports ──────────────────────────────────────────────────────────────
    return {
        // State (refs)
        user,
        session,
        profile,
        loading,
        profileLoading,
        error,

        // Computed
        isAuthenticated,
        displayName,
        avatarUrl,
        initials,
        roleLabel,
        computedProfile,

        // Auth actions
        signIn,
        signUp,
        signOut,
        signInWithSocialProvider,
        resetPassword,
        updatePassword,
        resendConfirmation,

        // Profile actions
        fetchProfile,
        updateProfile,
        uploadAvatar,
        refreshAvatarCache,
        formatDate,
    }
})
