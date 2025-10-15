import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface ProductVariant {
  id: string
  product_id: string
  title: string
  option1: string | null
  option2: string | null
  option3: string | null
  price: number
  compare_at_price: number | null
  cost_per_item: number | null
  sku: string | null
  barcode: string | null
  inventory_quantity: number
  inventory_policy: 'continue' | 'deny'
  fulfillment_service: string
  weight: number | null
  weight_unit: 'kg' | 'g' | 'lb' | 'oz'
  requires_shipping: boolean
  taxable: boolean
  available_for_sale: boolean
  image_url: string | null
  position: number
  created_at: string
  updated_at: string
}

export interface ProductOption {
  id: string
  product_id: string
  name: string
  position: number
  values: string[]
  created_at: string
}

export function useProductVariants(productId: string) {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [options, setOptions] = useState<ProductOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchVariants() {
      try {
        setLoading(true)

        // Fetch variants
        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productId)
          .order('position', { ascending: true })

        if (variantsError) throw variantsError

        // Fetch options
        const { data: optionsData, error: optionsError } = await supabase
          .from('product_options')
          .select('*')
          .eq('product_id', productId)
          .order('position', { ascending: true })

        if (optionsError) throw optionsError

        setVariants(variantsData || [])
        setOptions(optionsData || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchVariants()
    }
  }, [productId, supabase])

  return { variants, options, loading, error }
}

export function useInventoryLevel(variantId: string, locationId?: string) {
  const [inventory, setInventory] = useState<{
    available: number
    committed: number
    incoming: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchInventory() {
      try {
        setLoading(true)

        const query = supabase
          .from('inventory_levels')
          .select('available, committed, incoming')
          .eq('variant_id', variantId)

        if (locationId) {
          query.eq('location_id', locationId)
        }

        const { data, error: inventoryError } = await query.single()

        if (inventoryError) throw inventoryError

        setInventory(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (variantId) {
      fetchInventory()
    }
  }, [variantId, locationId, supabase])

  return { inventory, loading, error }
}
