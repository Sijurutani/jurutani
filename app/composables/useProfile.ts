import type { Database } from '~/types/database.types'

type UserProfile = Database['public']['Tables']['profiles']['Row']

export const useProfile = () => {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  // ─── Local state ──────────────────────────────────────────────────────────
  const profile = useState<UserProfile | null>('auth-profile', () => null)
  const profileLoading = useState('auth-profile-loading', () => false)
  const error = useState<string | null>('auth-profile-error', () => null)
  const avatarVersion = useState('auth-avatar-version', () => Math.floor(Date.now() / (5 * 60 * 1000)))

  // ─── Computed ─────────────────────────────────────────────────────────────
  const displayName = computed(
    () =>
      profile.value?.full_name ||
      user.value?.user_metadata?.full_name ||
      user.value?.email?.split('@')[0] ||
      'User',
  )

  const avatarUrl = computed(() => {
    const raw =
      profile.value?.avatar_url ||
      user.value?.user_metadata?.avatar_url ||
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
    // Enum.UserRole seharusnya ada di types/enums (disesuaikan dengan aslinya)
    const roleValue = profile.value?.role || 'user'
    const roleMap: Record<string, string> = {
      admin: 'Admin',
      expert: 'Pakar',
      instructor: 'Instruktur',
      user: 'Pengguna'
    }
    return roleMap[roleValue] || 'Pengguna'
  })

  /** Gabungan data auth-user + profil DB untuk konsumsi template */
  const computedProfile = computed(() => {
    if (!user.value && !profile.value) return null
    return {
      id: user.value?.sub ?? profile.value?.id ?? '',
      email: user.value?.email ?? profile.value?.email ?? '',
      displayName: displayName.value,
      fullName:
        profile.value?.full_name ?? user.value?.user_metadata?.full_name ?? '',
      avatar: avatarUrl.value,
      phone: profile.value?.phone ?? user.value?.user_metadata?.phone ?? '',
      role: profile.value?.role ?? 'user',
      bio: profile.value?.bio ?? '',
      location: profile.value?.address ?? '',
      createdAt: profile.value?.created_at ?? '',
      updatedAt: profile.value?.updated_at ?? '',
      isAuthenticated: !!user.value,
    }
  })

  // ─── Actions ──────────────────────────────────────────────────────────────

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
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      profileLoading.value = false
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user.value?.id)
      return { success: false, error: 'User tidak terautentikasi' }

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
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      profileLoading.value = false
    }
  }

  const uploadAvatar = async (file: File) => {
    if (!user.value?.id)
      return { success: false, error: 'User tidak terautentikasi' }

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

      const {
        data: { publicUrl },
      } = client.storage.from('avatars').getPublicUrl(filePath)
      
      const updateResult = await updateProfile({ avatar_url: publicUrl })
      if (!updateResult.success) return updateResult

      refreshAvatarCache()
      return { success: true, data: { avatar_url: publicUrl } }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      profileLoading.value = false
    }
  }

  const refreshAvatarCache = () => {
    avatarVersion.value = Math.floor(Date.now() / (5 * 60 * 1000))
  }

  const initProfile = async () => {
    if (user.value && !profile.value) {
      await fetchProfile(user.value.id)
    }
  }

  // Otomatis fetch profil saat user berganti
  watch(user, async (newUser) => {
    if (newUser && !profile.value) {
      await fetchProfile(newUser.id)
    } else if (!newUser) {
      profile.value = null
    }
  })

  return {
    profile,
    profileLoading,
    error,
    displayName,
    avatarUrl,
    initials,
    roleLabel,
    computedProfile,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    refreshAvatarCache,
    initProfile,
  }
}
