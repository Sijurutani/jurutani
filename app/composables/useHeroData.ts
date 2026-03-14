import type { HeroData } from '~/types/hero'

export type { HeroData }

export const useHeroData = () => {
    const supabase = useSupabaseClient();
    const carouselItems = ref<HeroData[]>([])
    const error = ref<string | null>(null)
    const loading = ref(false) // Start from false, will be set to true in fetchHeroData
    const isInitialized = ref(false)

    const getImageUrl = (imageUrl: string): string | null => {
        if (!imageUrl) return null

        // Jika sudah berupa URL lengkap, return langsung
        if (imageUrl.startsWith('http')) {
            return imageUrl
        }

        // Jika hanya nama file, ambil dari bucket hero-image
        const { data } = supabase.storage.from('hero-image').getPublicUrl(imageUrl)

        return data.publicUrl
    }

    const fetchHeroData = async () => {
        loading.value = true
        error.value = null

        try {
            const { data, error: fetchError } = await supabase
                .schema('public')
                .from('hero_data')
                .select('*')
                .eq('status', 'active')
                .is('deleted_at', null)
                .order('created_at', { ascending: true })

            if (fetchError) throw fetchError

            carouselItems.value = (data as HeroData[]) || []
            isInitialized.value = true

            console.log('Hero data fetched successfully:', carouselItems.value.length, 'items')
        } catch (err: any) {
            error.value = err.message || 'Terjadi kesalahan saat memuat data hero'
            console.error('Error fetching hero data:', err)
        } finally {
            loading.value = false
        }
    }

    return {
        carouselItems,
        error,
        loading,
        isInitialized,
        getImageUrl,
        fetchHeroData
    }
}
