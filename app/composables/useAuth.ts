import type { Database } from '~/types/database.types'

export const useAuth = () => {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const session = useSupabaseSession()

  // ─── Local state ──────────────────────────────────────────────────────────
  const loading = useState('auth-loading', () => false)
  const error = useState<string | null>('auth-error', () => null)

  const isAuthenticated = computed(() => !!user.value)

  // ─── Auth Actions ─────────────────────────────────────────────────────────

  const signIn = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: authError } = await client.auth.signInWithPassword({
        email,
        password,
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
        if (
          msg.includes('already registered') ||
          msg.includes('already in use')
        )
          msg = 'Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.'
        else if (
          msg.includes('weak password') ||
          msg.includes('Password should be')
        )
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
      return { success: true }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const signInWithSocialProvider = async (
    provider: 'google' | 'facebook' | 'github',
  ) => {
    loading.value = true
    error.value = null
    try {
      const baseUrl = import.meta.client
        ? window.location.origin
        : 'https://jurutani.com'
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
      const baseUrl = import.meta.client
        ? window.location.origin
        : 'https://jurutani.com'
      const { error: authError } = await client.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${baseUrl}/auth/reset-password`,
        },
      )
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

  const updatePassword = async (newPassword: string) => {
    loading.value = true
    error.value = null
    try {
      const { error: authError } = await client.auth.updateUser({
        password: newPassword,
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

  const resendConfirmation = async (email: string) => {
    loading.value = true
    error.value = null
    try {
      const { error: authError } = await client.auth.resend({
        type: 'signup',
        email,
      })
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

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    signInWithSocialProvider,
    resetPassword,
    updatePassword,
    resendConfirmation,
  }
}
