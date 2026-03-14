import { ref } from 'vue';
import { toastStore } from './useJuruTaniToast';
import { useUserBadge } from './useUserBadge';

export function useProfile() {
  const supabase = useSupabaseClient();
  const { getBadgeName } = useUserBadge();

  const userData = ref<any>(null);
  const loading = ref(true);
  const error = ref<any>(null);
  const isEditing = ref(false);

  const fetchUserData = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toastStore.error('Tidak dapat memuat data pengguna. Silakan login kembali.');
        return;
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        error.value = profileError;
        toastStore.error('Gagal memuat profil pengguna.');
      } else {
        userData.value = {
          ...data,
          email: user.email,
          avatar_url: data.avatar_url ? `${data.avatar_url}?t=${Date.now()}` : null
        };
      }
    } catch (err) {
      error.value = err;
      toastStore.error('Terjadi kesalahan saat memuat data profil.');
    } finally {
      loading.value = false;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const formatRole = (role?: string) => {
    return getBadgeName(role)
  };

  const updateUserProfile = async (updatedProfile: Record<string, any>) => {
    userData.value = { ...userData.value, ...updatedProfile };
    await fetchUserData();
    toastStore.success('Profil berhasil diperbarui');
    isEditing.value = false;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  return {
    userData,
    loading,
    error,
    isEditing,
    fetchUserData,
    updateUserProfile,
    formatDate,
    formatRole,
    isValidUrl
  };
}
