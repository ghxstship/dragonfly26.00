import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface DiscountCode {
  id: string
  workspace_id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_shipping'
  value: number
  buy_quantity: number | null
  get_quantity: number | null
  get_discount_percent: number | null
  applies_to: string
  product_ids: string[] | null
  collection_ids: string[] | null
  minimum_purchase_amount: number | null
  usage_limit: number | null
  usage_limit_per_customer: number | null
  usage_count: number
  starts_at: string | null
  ends_at: string | null
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export function useDiscountValidation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const validateDiscount = async (
    code: string,
    cartTotal: number,
    productIds?: string[],
    collectionIds?: string[]
  ): Promise<DiscountCode> => {
    try {
      setLoading(true)
      setError(null)

      // Fetch discount code
      const { data: discount, error: fetchError } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single()

      if (fetchError) throw new Error('Invalid discount code')
      if (!discount) throw new Error('Discount code not found')

      // Validate date range
      const now = new Date()
      if (discount.starts_at && new Date(discount.starts_at) > now) {
        throw new Error('This discount code is not yet valid')
      }
      if (discount.ends_at && new Date(discount.ends_at) < now) {
        throw new Error('This discount code has expired')
      }

      // Validate minimum purchase
      if (discount.minimum_purchase_amount && cartTotal < discount.minimum_purchase_amount) {
        throw new Error(`Minimum purchase of $${discount.minimum_purchase_amount} required`)
      }

      // Validate usage limits
      if (discount.usage_limit && discount.usage_count >= discount.usage_limit) {
        throw new Error('This discount code has reached its usage limit')
      }

      // Check per-customer usage limit
      if (discount.usage_limit_per_customer) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { count } = await supabase
            .from('discount_usages')
            .select('*', { count: 'exact', head: true })
            .eq('discount_code_id', discount.id)
            .eq('customer_id', user.id)

          if (count && count >= discount.usage_limit_per_customer) {
            throw new Error('You have already used this discount code')
          }
        }
      }

      // Validate product/collection applicability
      if (discount.applies_to === 'specific_products' && discount.product_ids) {
        if (!productIds?.some(id => discount.product_ids?.includes(id))) {
          throw new Error('This discount does not apply to items in your cart')
        }
      }

      if (discount.applies_to === 'specific_collections' && discount.collection_ids) {
        if (!collectionIds?.some(id => discount.collection_ids?.includes(id))) {
          throw new Error('This discount does not apply to items in your cart')
        }
      }

      return discount
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const recordDiscountUsage = async (
    discountCodeId: string,
    orderId: string,
    discountAmount: number
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error: usageError } = await supabase
        .from('discount_usages')
        .insert({
          discount_code_id: discountCodeId,
          order_id: orderId,
          customer_id: user.id,
          discount_amount: discountAmount
        })

      if (usageError) throw usageError

      // Increment usage count
      const { error: updateError } = await supabase.rpc('increment_discount_usage', {
        discount_id: discountCodeId
      })

      if (updateError) throw updateError
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    validateDiscount,
    recordDiscountUsage,
    loading,
    error
  }
}
