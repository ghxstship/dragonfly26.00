import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Wishlist {
  id: string
  customer_id: string
  name: string
  description: string | null
  is_public: boolean
  share_token: string | null
  created_at: string
  updated_at: string
  item_count?: number
}

export interface WishlistItem {
  id: string
  wishlist_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  notes: string | null
  added_at: string
}

export function useWishlists() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const fetchWishlists = async () => {
    try {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Fetch wishlists with item counts
      const { data, error: fetchError } = await supabase
        .from('customer_wishlists')
        .select(`
          *,
          wishlist_items (count)
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Map the count to item_count
      const wishlistsWithCounts = data?.map(wishlist => ({
        ...wishlist,
        item_count: wishlist.wishlist_items?.[0]?.count || 0
      })) || []

      setWishlists(wishlistsWithCounts)
      return wishlistsWithCounts
    } catch (err: any) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createWishlist = async (name: string, description?: string) => {
    try {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error: createError } = await supabase
        .from('customer_wishlists')
        .insert({
          customer_id: user.id,
          name,
          description: description || null,
          is_public: false
        })
        .select()
        .single()

      if (createError) throw createError

      await fetchWishlists()
      return data
    } catch (err: any) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (
    wishlistId: string,
    productId: string,
    variantId?: string,
    quantity: number = 1
  ) => {
    try {
      setLoading(true)

      const { error: addError } = await supabase
        .from('wishlist_items')
        .upsert({
          wishlist_id: wishlistId,
          product_id: productId,
          variant_id: variantId || null,
          quantity
        }, {
          onConflict: 'wishlist_id,product_id,variant_id'
        })

      if (addError) throw addError

      await fetchWishlists()
    } catch (err: any) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (wishlistId: string, productId: string, variantId?: string) => {
    try {
      setLoading(false)

      let query = supabase
        .from('wishlist_items')
        .delete()
        .eq('wishlist_id', wishlistId)
        .eq('product_id', productId)

      if (variantId) {
        query = query.eq('variant_id', variantId)
      } else {
        query = query.is('variant_id', null)
      }

      const { error: removeError } = await query

      if (removeError) throw removeError

      await fetchWishlists()
    } catch (err: any) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getWishlistItems = async (wishlistId: string) => {
    try {
      setLoading(true)

      const { data, error: fetchError } = await supabase
        .from('wishlist_items')
        .select(`
          *,
          product:marketplace_products (*)
        `)
        .eq('wishlist_id', wishlistId)
        .order('added_at', { ascending: false })

      if (fetchError) throw fetchError

      return data || []
    } catch (err: any) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const isInWishlist = async (productId: string, variantId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      let query = supabase
        .from('wishlist_items')
        .select('wishlist_id')
        .eq('product_id', productId)
        .in('wishlist_id', wishlists.map(w => w.id))

      if (variantId) {
        query = query.eq('variant_id', variantId)
      }

      const { data } = await query

      return data?.map(item => item.wishlist_id) || []
    } catch (err: any) {
      return []
    }
  }

  useEffect(() => {
    fetchWishlists()
  }, [])

  return {
    wishlists,
    loading,
    error,
    fetchWishlists,
    createWishlist,
    addToWishlist,
    removeFromWishlist,
    getWishlistItems,
    isInWishlist
  }
}
