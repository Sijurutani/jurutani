import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import type { ContentListOptions, SortOption, FilterState } from '~/types/content'

export type { ContentListOptions, SortOption, FilterState }

export function useContentList<T = any>(options: ContentListOptions) {
    const supabase = useSupabaseClient()

    // State
    const items = ref<T[]>([]) as Ref<T[]>
    const loading = ref(true)
    const error = ref<string | null>(null)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const totalItems = ref(0)

    // Filter & Sort State
    const filters = ref<FilterState>({
        category: 'all',
        search: '',
        sort: 'newest'
    })

    // Configuration
    const pageSize = options.pageSize || 9
    const sortColumn = options.defaultSort?.column || 'created_at'
    const sortAscending = options.defaultSort?.ascending || false

    // Define search fields per table type
    const getSearchFields = (): string[] => {
        const table = options.tableName.toLowerCase()
        const fieldMap: Record<string, string[]> = {
            'news': ['title', 'content', 'sub_title'],
            'news_updated': ['title', 'sub_title'],
            'videos': ['title', 'description'],
            'courses': ['title', 'description'],
            'markets': ['name', 'description', 'seller'],
            'product_markets': ['name', 'excerpt', 'seller', 'category'],
            'meetings': ['title', 'content']
        }
        return fieldMap[table] || ['title', 'description', 'content']
    }

    // Sort Options
    const sortOptions: SortOption[] = [
        { label: 'Terbaru', value: 'newest', column: 'created_at', ascending: false },
        { label: 'Terlama', value: 'oldest', column: 'created_at', ascending: true },
        { label: 'A-Z', value: 'a-z', column: 'title', ascending: true },
        { label: 'Z-A', value: 'z-a', column: 'title', ascending: false }
    ]

    // Get current sort configuration
    const currentSort = computed(() => {
        return sortOptions.find(opt => opt.value === filters.value.sort) || sortOptions[0]
    })

    // Computed
    const isLoading = computed(() => loading.value)
    const hasError = computed(() => !!error.value)
    const hasData = computed(() => items.value.length > 0)
    const showPagination = computed(() => !isLoading.value && hasData.value && totalPages.value > 1)

    // Build search query - optimized for Supabase FTS
    const buildSearchQuery = (searchTerm: string): string => {
        const fields = getSearchFields()
        const normalizedTerm = searchTerm.trim()

        // Create OR conditions for each field
        return fields.map(field => `${field}.ilike.%${normalizedTerm}%`).join(',')
    }

    // Fetch data
    const fetchItems = async () => {
        loading.value = true
        error.value = null

        try {
            // Build base query
            let query = supabase
                .from(options.tableName)
                .select('*', { count: 'exact' })
                .is('deleted_at', null)

            // Apply status filter if specified (handles both 'status' and 'status_news')
            if (options.statusField && options.statusValue) {
                query = query.eq(options.statusField, options.statusValue)
            }

            // Apply category filter
            if (filters.value.category !== 'all' && filters.value.category !== 'semua' && options.categoryField) {
                query = query.eq(options.categoryField, filters.value.category)
            }

            // Apply search filter using optimized search fields
            if (filters.value.search.trim()) {
                const searchQuery = buildSearchQuery(filters.value.search)
                query = query.or(searchQuery)
            }

            // Apply sorting
            const sort = currentSort.value
            query = query.order(sort.column, { ascending: sort.ascending })

            // Apply pagination
            const { data, error: fetchError, count } = await query.range(
                (currentPage.value - 1) * pageSize,
                currentPage.value * pageSize - 1
            )

            if (fetchError) throw fetchError

            items.value = (data as T[]) || []
            totalItems.value = count || 0
            totalPages.value = Math.ceil(totalItems.value / pageSize)
        } catch (err: any) {
            error.value = err.message || 'Terjadi kesalahan saat memuat data'
            console.error(`Error fetching ${options.tableName}:`, err)
        } finally {
            loading.value = false
        }
    }

    // Handlers
    const handleCategoryChange = (category: string) => {
        filters.value.category = category
        currentPage.value = 1
    }

    const handleSearchChange = (search: string) => {
        filters.value.search = search
        currentPage.value = 1
    }

    const handleSortChange = (sort: string) => {
        filters.value.sort = sort
        currentPage.value = 1
    }

    const handlePageChange = (page: number) => {
        currentPage.value = page
    }

    const resetFilters = () => {
        filters.value = {
            category: 'all',
            search: '',
            sort: 'newest'
        }
        currentPage.value = 1
    }

    // Watch for filter changes
    watch(
        () => [filters.value.category, filters.value.search, filters.value.sort, currentPage.value],
        () => {
            fetchItems()
        }
    )

    return {
        // State
        items,
        loading,
        error,
        currentPage,
        totalPages,
        totalItems,
        filters,

        // Computed
        isLoading,
        hasError,
        hasData,
        showPagination,
        sortOptions,
        currentSort,

        // Methods
        fetchItems,
        handleCategoryChange,
        handleSearchChange,
        handleSortChange,
        handlePageChange,
        resetFilters
    }
}
