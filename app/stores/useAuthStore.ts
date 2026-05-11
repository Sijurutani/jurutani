import { defineStore } from 'pinia'
import type { Database } from '~/types/database.types'

type UserProfile = Database['public']['Tables']['profiles']['Row']

/**
 * User Store — Pinia store terpadu yang menggabungkan auth + profil.
 * Dipakai sebagai `useAuthStore()` di seluruh aplikasi untuk backward compatibility.
 */
export const useAuthStore = defineStore('user', () => {
  const client = useSupabaseClient<Database>()
  const supabaseUser = useSupabaseUser()
  const supabaseSession = useSupabaseSession()

  // ── Auth State ─────────────────────────────────────────────────────────────
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ── Profile State ──────────────────────────────────────────────────────────
  const profile = ref<UserProfile | null>(null)
  const profileLoading = ref(false)
  const profileError = ref<string | null>(null)
  const avatarVersion = ref(Math.floor(Date.now() / (5 * 60 * 1000)))

  // ── Auth Getters ───────────────────────────────────────────────────────────
  const user = computed(() => supabaseUser.value)
  const session = computed(() => supabaseSession.value)
  const isAuthenticated = computed(() => !!supabaseUser.value)

  // ── Profile Getters ────────────────────────────────────────────────────────
  const displayName = computed(
    () =>
      profile.value?.full_name ||
      supabaseUser.value?.user_metadata?.full_name ||
      supabaseUser.value?.email?.split('@')[0] ||
      'User',
  )

  const avatarUrl = computed(() => {
    const raw =
      profile.value?.avatar_url ||
      supabaseUser.value?.user_metadata?.avatar_url ||
      '/profile.webp'
    if (raw === '/profile.webp') return raw
    return raw.includes('?') ? raw : `${raw}?v=${avatarVersion.value}`
  })

  const initials = computed(
    () =>
      displayName.value
        .split(' ')
        .slice(0, 2)
        .map((n: string) => n[0])
        .join('')
        .toUpperCase() || 'U',
  )

  const roleLabel = computed(() => {
    const roleValue = profile.value?.role || 'user'
    const roleMap: Record<string, string> = {
      admin: 'Admin',
      expert: 'Pakar',
      instructor: 'Instruktur',
      user: 'Pengguna',
    }
    return roleMap[roleValue] || 'Pengguna'
  })

  const computedProfile = computed(() => {
    if (!supabaseUser.value && !profile.value) return null
    return {
      id: supabaseUser.value?.sub ?? profile.value?.id ?? '',
      email: supabaseUser.value?.email ?? profile.value?.email ?? '',
      displayName: displayName.value,
      fullName: profile.value?.full_name ?? supabaseUser.value?.user_metadata?.full_name ?? '',
      avatar: avatarUrl.value,
      phone: profile.value?.phone ?? supabaseUser.value?.user_metadata?.phone ?? '',
      role: profile.value?.role ?? 'user',
      bio: profile.value?.bio ?? '',
      location: profile.value?.address ?? '',
      createdAt: profile.value?.created_at ?? '',
      updatedAt: profile.value?.updated_at ?? '',
      isAuthenticated: !!supabaseUser.value,
    }
  })

  // ── Auth Actions ───────────────────────────────────────────────────────────

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
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

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
    } catch (err: any) {
      let msg: string = err.message ?? 'Terjadi kesalahan saat mendaftar'
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError'))
        msg = 'Koneksi bermasalah. Periksa koneksi internet Anda.'
      else if (msg.includes('timeout'))
        msg = 'Koneksi timeout. Silakan coba lagi.'
      error.value = msg
      return { success: false, error: msg }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    error.value = null
    try {
      const { error: authError } = await client.auth.signOut()
      if (authError) {
        error.value = authError.message
        return { success: false, error: authError.message }
      }
      $reset()
      return { success: true }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const signInWithSocialProvider = async (provider: 'google' | 'facebook' | 'github') => {
    loading.value = true
    error.value = null
    try {
      const baseUrl = import.meta.client ? window.location.origin : 'https://jurutani.com'
      const { data, error: authError } = await client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
          skipBrowserRedirect: false,
        },
      })
      if (authError) {
        error.value = authError.message
        return { success: false, error: authError.message }
      }
      return { success: true, data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email: string) => {
    loading.value = true
    error.value = null
    try {
      const baseUrl = import.meta.client ? window.location.origin : 'https://jurutani.com'
      const { error: authError } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/auth/reset-password`,
      })
      if (authError) {
        error.value = authError.message
        return { success: false, error: authError.message }
      }
      return { success: true }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (newPwd: string) => {
    loading.value = true
    error.value = null
    try {
      const { error: authError } = await client.auth.updateUser({ password: newPwd })
      if (authError) {
        error.value = authError.message
        return { success: false, error: authError.message }
      }
      return { success: true }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

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
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // ── Profile Actions ────────────────────────────────────────────────────────

  const fetchProfile = async (userId?: string) => {
    const targetId = userId ?? supabaseUser.value?.id
    if (!targetId) return { success: false, error: 'User ID tidak ditemukan' }

    profileLoading.value = true
    profileError.value = null
    try {
      const { data, error: profileErr } = await client
        .from('profiles')
        .select('*')
        .eq('id', targetId)
        .single()

      if (profileErr) {
        profileError.value = profileErr.message
        return { success: false, error: profileErr.message }
      }
      profile.value = data as UserProfile
      return { success: true, data }
    } catch (err: any) {
      profileError.value = err.message
      return { success: false, error: err.message }
    } finally {
      profileLoading.value = false
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!supabaseUser.value?.id)
      return { success: false, error: 'User tidak terautentikasi' }

    profileLoading.value = true
    profileError.value = null
    try {
      const { data, error: updateErr } = await client
        .from('profiles')
        .update(updates)
        .eq('id', supabaseUser.value.id)
        .select()
        .single()

      if (updateErr) {
        profileError.value = updateErr.message
        return { success: false, error: updateErr.message }
      }
      profile.value = data as UserProfile
      return { success: true, data }
    } catch (err: any) {
      profileError.value = err.message
      return { success: false, error: err.message }
    } finally {
      profileLoading.value = false
    }
  }

  const uploadAvatar = async (file: File) => {
    if (!supabaseUser.value?.id)
      return { success: false, error: 'User tidak terautentikasi' }

    profileLoading.value = true
    profileError.value = null
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${supabaseUser.value.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadErr } = await client.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadErr) {
        profileError.value = uploadErr.message
        return { success: false, error: uploadErr.message }
      }

      const { data: { publicUrl } } = client.storage.from('avatars').getPublicUrl(filePath)
      const updateResult = await updateProfile({ avatar_url: publicUrl })
      if (!updateResult.success) return updateResult

      refreshAvatarCache()
      return { success: true, data: { avatar_url: publicUrl } }
    } catch (err: any) {
      profileError.value = err.message
      return { success: false, error: err.message }
    } finally {
      profileLoading.value = false
    }
  }

  const refreshAvatarCache = () => {
    avatarVersion.value = Math.floor(Date.now() / (5 * 60 * 1000))
  }

  const initProfile = async () => {
    if (supabaseUser.value && !profile.value) {
      await fetchProfile(supabaseUser.value.id)
    }
  }

  // Alias untuk backward compat
  const init = initProfile

  const $reset = () => {
    profile.value = null
    profileError.value = null
    profileLoading.value = false
  }

  // Auto-fetch profil saat user berubah
  watch(supabaseUser, async (newUser) => {
    if (newUser && !profile.value) {
      await fetchProfile(newUser.id)
    } else if (!newUser) {
      $reset()
    }
  })

  return {
    // Auth state
    loading,
    error,
    // Profile state
    profile,
    profileLoading,
    profileError,
    avatarVersion,
    // Auth getters
    user,
    session,
    isAuthenticated,
    // Profile getters
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
    initProfile,
    init,
    $reset,
  }
})
