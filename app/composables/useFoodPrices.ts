/**
 * Composable untuk Food Prices
 * Fetch data dari Supabase (foods + food_prices tables)
 */

import type { Food, FoodWithPrice, FoodPriceTrend, FoodCategory } from '~/types'
import { Enum } from '~/utils/enum'

export const useFoodPrices = () => {
    const supabase = useSupabaseClient()

    /**
     * Get all foods with their latest prices
     * @param category - Filter by category (optional)
     * @param searchQuery - Search by name (optional)
     */
    const getFoodsWithLatestPrices = async (
        category?: string,
        searchQuery?: string
    ): Promise<{ data: FoodWithPrice[] | null; error: any }> => {
        try {
            // Build query
            let query = supabase
                .from('foods')
                .select(`
          id,
          slug,
          name,
          category,
          description,
          satuan,
          image_url,
          specifications,
          tags,
          created_at,
          updated_at
        `)
                .is('deleted_at', null)
                .order('name', { ascending: true })

            // Filter by category
            if (category && category !== 'all') {
                query = query.eq('category', category)
            }

            // Search by name
            if (searchQuery && searchQuery.trim() !== '') {
                query = query.ilike('name', `%${searchQuery}%`)
            }

            const { data: foods, error: foodsError } = await query

            if (foodsError) throw foodsError
            if (!foods || foods.length === 0) {
                return { data: [], error: null }
            }

            // Get latest prices for each food
            const foodIds = foods.map(f => f.id)

            // Get all prices for these foods, ordered by date
            const { data: allPrices, error: pricesError } = await supabase
                .from('food_prices')
                .select('*')
                .in('food_id', foodIds)
                .is('deleted_at', null)
                .order('date', { ascending: false })

            if (pricesError) {
                console.error('Error fetching prices:', pricesError)
                // Return foods without prices if price fetch fails
                return {
                    data: foods.map(f => ({ ...f, latest_price: 0, latest_price_date: '' })) as FoodWithPrice[],
                    error: null
                }
            }

            // Group prices by food_id and get latest 2 for each
            const pricesByFood: Record<string, any[]> = {}
            allPrices?.forEach((price: any) => {
                if (!pricesByFood[price.food_id]) {
                    pricesByFood[price.food_id] = []
                }
                if (pricesByFood[price.food_id].length < 2) {
                    pricesByFood[price.food_id].push(price)
                }
            })

            // Merge foods with their latest prices
            const foodsWithPrices: FoodWithPrice[] = foods.map(food => {
                const prices = pricesByFood[food.id] || []
                const latestPrice = prices[0]
                const previousPrice = prices[1]

                let priceChange = 0
                let priceChangePercent = 0

                if (latestPrice && previousPrice) {
                    priceChange = latestPrice.price - previousPrice.price
                    priceChangePercent = previousPrice.price > 0
                        ? ((priceChange / previousPrice.price) * 100)
                        : 0
                }

                return {
                    ...food,
                    latest_price: latestPrice?.price || 0,
                    latest_price_date: latestPrice?.date || '',
                    price_change: priceChange,
                    price_change_percent: Number(priceChangePercent.toFixed(2))
                }
            })

            return { data: foodsWithPrices, error: null }
        } catch (error) {
            console.error('Error in getFoodsWithLatestPrices:', error)
            return { data: null, error }
        }
    }

    /**
     * Get a single food by slug with latest price
     * @param slug - Food slug
     */
    const getFoodBySlug = async (
        slug: string
    ): Promise<{ data: FoodWithPrice | null; error: any }> => {
        try {
            // Get food details
            const { data: food, error: foodError } = await supabase
                .from('foods')
                .select('*')
                .eq('slug', slug)
                .is('deleted_at', null)
                .single()

            if (foodError) throw foodError
            if (!food) return { data: null, error: new Error('Food not found') }

            // Get latest price with trend
            const { data: priceData, error: priceError } = await supabase
                .from('food_prices')
                .select('*')
                .eq('food_id', food.id)
                .is('deleted_at', null)
                .order('date', { ascending: false })
                .limit(2)

            if (priceError) throw priceError

            const latestPrice = priceData?.[0]
            const previousPrice = priceData?.[1]

            let priceChange = 0
            let priceChangePercent = 0

            if (latestPrice && previousPrice) {
                priceChange = latestPrice.price - previousPrice.price
                priceChangePercent = previousPrice.price > 0
                    ? ((priceChange / previousPrice.price) * 100)
                    : 0
            }

            const foodWithPrice: FoodWithPrice = {
                ...food,
                latest_price: latestPrice?.price || 0,
                latest_price_date: latestPrice?.date || '',
                price_change: priceChange,
                price_change_percent: Number(priceChangePercent.toFixed(2))
            }

            return { data: foodWithPrice, error: null }
        } catch (error) {
            console.error('Error in getFoodBySlug:', error)
            return { data: null, error }
        }
    }

    /**
     * Get price trend for a food item
     * @param foodId - Food ID
     * @param days - Number of days to look back (default 30)
     */
    const getPriceTrend = async (
        foodId: string,
        days: number = 30
    ): Promise<{ data: FoodPriceTrend[] | null; error: any }> => {
        try {
            const dateFrom = new Date()
            dateFrom.setDate(dateFrom.getDate() - days)
            const dateFromStr = dateFrom.toISOString().split('T')[0]

            const { data: prices, error } = await supabase
                .from('food_prices')
                .select('*')
                .eq('food_id', foodId)
                .is('deleted_at', null)
                .gte('date', dateFromStr)
                .order('date', { ascending: false })

            if (error) throw error

            // Calculate price changes
            const trend: FoodPriceTrend[] = (prices || []).map((price, index) => {
                const prevPrice = prices?.[index + 1]
                let priceChange = 0
                let priceChangePercent = 0

                if (prevPrice) {
                    priceChange = price.price - prevPrice.price
                    priceChangePercent = prevPrice.price > 0
                        ? ((priceChange / prevPrice.price) * 100)
                        : 0
                }

                return {
                    date: price.date,
                    price: price.price,
                    price_change: priceChange,
                    price_change_percent: Number(priceChangePercent.toFixed(2))
                }
            })

            return { data: trend, error: null }
        } catch (error) {
            console.error('Error in getPriceTrend:', error)
            return { data: null, error }
        }
    }

    /**
     * Get foods by category with count
     */
    const getFoodCategories = async (): Promise<{ data: FoodCategory[] | null; error: any }> => {
        try {
            const { data, error } = await supabase
                .from('foods')
                .select('category')
                .is('deleted_at', null)

            if (error) throw error

            // Count by category
            const categoryCounts: Record<string, number> = {}
            data?.forEach((item: any) => {
                categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1
            })

            const categories: FoodCategory[] = [
                { name: 'Semua Kategori', value: 'all', icon: 'i-lucide-layers', count: data?.length || 0 },
                { name: 'Hortikultura', value: 'hortikultura', icon: 'i-lucide-flower-2', count: categoryCounts['hortikultura'] || 0 },
                { name: 'Perkebunan', value: 'perkebunan', icon: 'i-lucide-trees', count: categoryCounts['perkebunan'] || 0 },
                { name: 'Peternakan', value: 'peternakan', icon: 'i-lucide-beef', count: categoryCounts['peternakan'] || 0 },
                { name: 'Perikanan', value: 'perikanan', icon: 'i-lucide-fish', count: categoryCounts['perikanan'] || 0 }
            ]

            return { data: categories, error: null }
        } catch (error) {
            console.error('Error in getFoodCategories:', error)
            return { data: null, error }
        }
    }

    /**
     * Get similar foods by category
     * @param categoryValue - Category value
     * @param excludeId - Food ID to exclude from results
     * @param limit - Number of results (default 4)
     */
    const getSimilarFoods = async (
        categoryValue: string,
        excludeId: string,
        limit: number = 4
    ): Promise<{ data: FoodWithPrice[] | null; error: any }> => {
        try {
            // Get similar foods by category
            const { data: foods, error: foodsError } = await supabase
                .from('foods')
                .select('*')
                .eq('category', categoryValue)
                .neq('id', excludeId)
                .is('deleted_at', null)
                .limit(limit)

            if (foodsError) throw foodsError
            if (!foods || foods.length === 0) return { data: [], error: null }

            // Get latest prices
            const foodIds = foods.map(f => f.id)

            const { data: prices, error: pricesError } = await supabase
                .from('food_prices')
                .select('*')
                .in('food_id', foodIds)
                .is('deleted_at', null)
                .order('date', { ascending: false })

            if (pricesError) {
                console.error('Error fetching prices:', pricesError)
                return {
                    data: foods.map(f => ({ ...f, latest_price: 0, latest_price_date: '' })) as FoodWithPrice[],
                    error: null
                }
            }

            // Get latest price per food
            const latestPricesByFood: Record<string, any> = {}
            prices?.forEach((price: any) => {
                if (!latestPricesByFood[price.food_id]) {
                    latestPricesByFood[price.food_id] = price
                }
            })

            const foodsWithPrices: FoodWithPrice[] = foods.map(food => {
                const priceData = latestPricesByFood[food.id]
                return {
                    ...food,
                    latest_price: priceData?.price || 0,
                    latest_price_date: priceData?.date || ''
                }
            })

            return { data: foodsWithPrices, error: null }
        } catch (error) {
            console.error('Error in getSimilarFoods:', error)
            return { data: null, error }
        }
    }

    // Helper utilities
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const formatDate = (dateString: string): string => {
        if (!dateString) return '-'
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date)
    }

    const getCategoryIcon = (category: string): string => {
        const categoryItem = Enum.foodPriceCategories.find(c => c.value === category)
        return categoryItem?.icon || 'i-lucide-package'
    }

    const getCategoryLabel = (category: string): string => {
        const labels: Record<string, string> = {
            hortikultura: 'Hortikultura',
            perkebunan: 'Perkebunan',
            peternakan: 'Peternakan',
            perikanan: 'Perikanan'
        }
        return labels[category] || category
    }

    return {
        getFoodsWithLatestPrices,
        getFoodBySlug,
        getPriceTrend,
        getFoodCategories,
        getSimilarFoods,
        formatCurrency,
        formatDate,
        getCategoryIcon,
        getCategoryLabel
    }
}
