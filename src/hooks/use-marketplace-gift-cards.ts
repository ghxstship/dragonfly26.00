import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface GiftCard {
  id: string
  workspace_id: string
  code: string
  initial_value: number
  current_balance: number
  currency: string
  recipient_email: string | null
  recipient_name: string | null
  sender_name: string | null
  message: string | null
  status: 'active' | 'used' | 'disabled' | 'expired'
  expires_at: string | null
  created_by: string | null
  purchased_order_id: string | null
  created_at: string
  updated_at: string
}

export function useGiftCardValidation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const validateGiftCard = async (code: string): Promise<GiftCard> => {
    try {
      setLoading(true)
      setError(null)

      const { data: giftCard, error: fetchError } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', code.toUpperCase())
        .single()

      if (fetchError) throw new Error('Invalid gift card code')
      if (!giftCard) throw new Error('Gift card not found')

      // Validate status
      if (giftCard.status !== 'active') {
        throw new Error(`This gift card is ${giftCard.status}`)
      }

      // Validate balance
      if (giftCard.current_balance <= 0) {
        throw new Error('This gift card has a zero balance')
      }

      // Validate expiration
      if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
        throw new Error('This gift card has expired')
      }

      return giftCard
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const applyGiftCard = async (
    giftCardId: string,
    orderId: string,
    amount: number
  ) => {
    try {
      setLoading(true)

      // Record transaction
      const { error: transactionError } = await supabase
        .from('gift_card_transactions')
        .insert({
          gift_card_id: giftCardId,
          order_id: orderId,
          transaction_type: 'redemption',
          amount: amount
        })

      if (transactionError) throw transactionError

      // Note: The trigger update_gift_card_balance will automatically
      // update the current_balance and status of the gift card

      return true
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getUserGiftCards = async () => {
    try {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data: giftCards, error: fetchError } = await supabase
        .from('gift_cards')
        .select('*')
        .or(`created_by.eq.${user.id},recipient_email.eq.${user.email}`)
        .eq('status', 'active')
        .gt('current_balance', 0)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      return giftCards || []
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    validateGiftCard,
    applyGiftCard,
    getUserGiftCards,
    loading,
    error
  }
}
