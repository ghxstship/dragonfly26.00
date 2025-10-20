'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface MarketplaceProduct {
  id: string
  vendor_id: string
  name: string
  description: string | null
  category: string
  price: number
  currency: string
  stock_quantity: number
  images: string[]
  rating: number
  reviews_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MarketplaceOrder {
  id: string
  buyer_id: string
  order_number: string
  total_amount: number
  currency: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: string | null
  payment_status: 'pending' | 'paid' | 'refunded'
  created_at: string
  updated_at: string
}

export interface MarketplaceReview {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string | null
  is_verified_purchase: boolean
  created_at: string
}

export interface VendorProfile {
  id: string
  user_id: string
  business_name: string
  description: string | null
  logo_url: string | null
  rating: number
  total_sales: number
  is_verified: boolean
  created_at: string
}

export function useMarketplaceData() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([])
  const [orders, setOrders] = useState<MarketplaceOrder[]>([])
  const [reviews, setReviews] = useState<MarketplaceReview[]>([])
  const [vendors, setVendors] = useState<VendorProfile[]>([])
  const [services, setServices] = useState<MarketplaceProduct[]>([]) // Services are products with service category
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAllData()
    const channel = supabase
      .channel('marketplace-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_products' }, fetchProducts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_orders' }, fetchOrders)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchAllData() {
    setLoading(true)
    try {
      await Promise.all([fetchProducts(), fetchOrders(), fetchReviews(), fetchVendors()])
      setError(null)
    } catch (err: any) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchProducts() {
    const { data, error } = await supabase.from('marketplace_products').select('*').eq('is_active', true).order('created_at', { ascending: false })
    if (error) throw error
    setProducts(data || [])
  }

  async function fetchOrders() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase.from('marketplace_orders').select('*').eq('buyer_id', user.id).order('created_at', { ascending: false })
    if (error) throw error
    setOrders(data || [])
  }

  async function fetchReviews() {
    const { data, error } = await supabase.from('marketplace_reviews').select('*, profiles(full_name, avatar_url)').order('created_at', { ascending: false })
    if (error) throw error
    setReviews(data || [])
  }

  async function fetchVendors() {
    const { data, error } = await supabase.from('vendor_profiles').select('*').eq('is_verified', true).order('rating', { ascending: false })
    if (!error && data) setVendors(data)
  }

  async function createProduct(productData: Omit<MarketplaceProduct, 'id' | 'vendor_id' | 'rating' | 'reviews_count' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase.from('marketplace_products').insert({ ...productData, vendor_id: user.id, rating: 0, reviews_count: 0 }).select().single()
    if (error) throw error
    await fetchProducts()
    return data
  }

  async function updateProduct(id: string, updates: Partial<MarketplaceProduct>) {
    const { id: _, vendor_id, rating, reviews_count, created_at, ...validUpdates } = updates as any
    const { data, error } = await supabase.from('marketplace_products').update({ ...validUpdates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    await fetchProducts()
    return data
  }

  async function createOrder(orderData: Omit<MarketplaceOrder, 'id' | 'buyer_id' | 'order_number' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const orderNumber = `ORD-${Date.now()}`
    const { data, error } = await supabase.from('marketplace_orders').insert({ ...orderData, buyer_id: user.id, order_number: orderNumber }).select().single()
    if (error) throw error
    await fetchOrders()
    return data
  }

  async function updateOrderStatus(id: string, status: MarketplaceOrder['status']) {
    const { data, error } = await supabase.from('marketplace_orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    await fetchOrders()
    return data
  }

  async function createReview(reviewData: Omit<MarketplaceReview, 'id' | 'user_id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase.from('marketplace_reviews').insert({ ...reviewData, user_id: user.id }).select().single()
    if (error) throw error
    
    // Update product rating
    const product = products.find(p => p.id === reviewData.product_id)
    if (product) {
      const newReviewsCount = product.reviews_count + 1
      const newRating = ((product.rating * product.reviews_count) + reviewData.rating) / newReviewsCount
      await supabase.from('marketplace_products').update({ rating: newRating, reviews_count: newReviewsCount }).eq('id', reviewData.product_id)
    }
    
    await Promise.all([fetchReviews(), fetchProducts()])
    return data
  }

  return {
    products, orders, reviews, vendors, services, loading, error,
    createProduct, updateProduct, createOrder, updateOrderStatus, createReview,
    refresh: fetchAllData,
  }
}
