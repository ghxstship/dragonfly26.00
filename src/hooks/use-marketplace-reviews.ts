import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface ProductReview {
  id: string
  product_id: string
  order_id: string | null
  customer_id: string
  customer_name: string
  customer_email: string | null
  rating: number
  title: string | null
  body: string
  photos: string[]
  is_verified_purchase: boolean
  status: 'pending' | 'approved' | 'rejected'
  moderated_by: string | null
  moderated_at: string | null
  helpful_count: number
  not_helpful_count: number
  vendor_response: string | null
  vendor_response_at: string | null
  created_at: string
  updated_at: string
}

export function useProductReviews(productId: string) {
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const { data, error: reviewsError } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (reviewsError) throw reviewsError
      setReviews(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async (reviewData: {
    product_id: string
    order_id?: string
    rating: number
    title: string
    body: string
    photos: string[]
    is_verified_purchase: boolean
  }) => {
    try {
      setLoading(true)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error: submitError } = await supabase
        .from('product_reviews')
        .insert([{
          ...reviewData,
          customer_id: user.id,
          customer_name: user.user_metadata?.full_name || user.email || 'Anonymous',
          customer_email: user.email,
          status: 'pending'
        }])
        .select()
        .single()

      if (submitError) throw submitError

      // Refresh reviews
      await fetchReviews()

      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const voteHelpful = async (reviewId: string, isHelpful: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error: voteError } = await supabase
        .from('review_votes')
        .upsert({
          review_id: reviewId,
          user_id: user.id,
          is_helpful: isHelpful
        }, {
          onConflict: 'review_id,user_id'
        })

      if (voteError) throw voteError

      // Refresh reviews to get updated counts
      await fetchReviews()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    submitReview,
    voteHelpful
  }
}
