import type { Database } from './database.types'

export type Food = Database['public']['Tables']['foods']['Row']

export interface FoodWithPrice extends Omit<Food, 'created_at' | 'updated_at'> {
  created_at: string;
  updated_at: string;
  latest_price?: number;
  latest_price_date?: string;
  price_change?: number;
  price_change_percent?: number;
}

export interface FoodPriceTrend {
  date: string;
  price: number;
  price_change?: number;
  price_change_percent?: number;
}

export interface FoodCategory {
  name: string;
  value: string;
  icon: string;
  count: number;
}
