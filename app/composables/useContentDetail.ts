import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ContentDetailOptions } from '~/types/content'

export type { ContentDetailOptions }

export function useContentDetail<T = any>(options: ContentDetailOptions) {
    const supabase = useSupabaseClient()
    const route = useRoute()
    const router = useRouter()

    // State
    const item = ref<T | null>(null) as Ref<T | null>
    const loading = ref(true)
    const error = ref<string | null>(null)
    const similarItems = ref<T[]>([]) as Ref<T[]>
    const loadingSimilar = ref(false)

    // Get slug from route
    const slug = computed(() => route.params.slug as string || route.params.id as string)

    // Computed
    const isLoading = computed(() => loading.value)
    const hasError = computed(() => !!error.value)
    const hasData = computed(() => !!item.value)

    // Fetch item by slug
    const fetchItem = async () => {
        loading.value = true
        error.value = null

        try {
            let query = supabase
                .from(options.tableName)
                .select('*')
                .eq('slug', slug.value)
                .is('deleted_at', null)

            // Apply status filter if specified
            if (options.statusField && options.statusValue) {
                query = query.eq(options.statusField, options.statusValue)
            }

            const { data, error: fetchError } = await query.single()

            if (fetchError) {
                console.error(`Error fetching ${options.tableName}:`, fetchError)
                error.value = 'Gagal memuat data'
                return
            }

            if (!data) {
                error.value = 'Data tidak ditemukan'
                return
            }

            item.value = data as T

            // Fetch similar items if category field is specified
            if (options.categoryField && (data as any)[options.categoryField]) {
                await fetchSimilarItems((data as any)[options.categoryField])
            }
        } catch (err) {
            console.error(`Unexpected error fetching ${options.tableName}:`, err)
            error.value = 'Terjadi kesalahan yang tidak terduga'
        } finally {
            loading.value = false
        }
    }

    // Fetch similar items by category
    const fetchSimilarItems = async (category?: string) => {
        if (!category || !options.categoryField) return

        loadingSimilar.value = true

        try {
            let query = supabase
                .from(options.tableName)
                .select('*')
                .eq(options.categoryField, category)
                .neq('slug', slug.value)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })
                .limit(options.similarLimit || 4)

            // Apply status filter if specified
            if (options.statusField && options.statusValue) {
                query = query.eq(options.statusField, options.statusValue)
            }

            const { data, error: fetchError } = await query

            if (fetchError) {
                console.error(`Error fetching similar ${options.tableName}:`, fetchError)
                return
            }

            similarItems.value = (data as T[]) || []
        } catch (err) {
            console.error(`Unexpected error fetching similar ${options.tableName}:`, err)
        } finally {
            loadingSimilar.value = false
        }
    }

    // Navigate back to list
    const goBack = (listPath: string) => {
        router.push(listPath)
    }

    // Refresh data
    const refresh = async () => {
        await fetchItem()
    }

    return {
        // State
        item,
        loading,
        error,
        similarItems,
        loadingSimilar,
        slug,

        // Computed
        isLoading,
        hasError,
        hasData,

        // Methods
        fetchItem,
        fetchSimilarItems,
        goBack,
        refresh
    }
}
