"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tag, X, Check, AlertCircle } from "lucide-react"

export interface DiscountCode {
  id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_shipping'
  value: number
  applies_to: string
  minimum_purchase_amount: number | null
  usage_limit: number | null
  usage_count: number
  starts_at: string | null
  ends_at: string | null
  is_active: boolean
}

export interface AppliedDiscount {
  code: string
  discount_type: string
  value: number
  discount_amount: number
  description?: string
}

interface DiscountInputProps {
  cartTotal: number
  onDiscountApplied?: (discount: AppliedDiscount | null) => void
  appliedDiscount?: AppliedDiscount | null
  className?: string
}

export function DiscountInput({
  cartTotal,
  onDiscountApplied,
  appliedDiscount: externalAppliedDiscount,
  className
}: DiscountInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(
    externalAppliedDiscount || null
  )

  const calculateDiscountAmount = (discountCode: DiscountCode, total: number): number => {
    switch (discountCode.discount_type) {
      case 'percentage':
        return (total * discountCode.value) / 100
      case 'fixed_amount':
        return Math.min(discountCode.value, total)
      case 'free_shipping':
        return 0 // Handled separately in shipping calculation
      default:
        return 0
    }
  }

  const validateDiscountCode = async (code: string): Promise<DiscountCode | null> => {
    // In real implementation, this would query the discount_codes table
    // For now, simulate with mock validation
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock discount codes for demo
    const mockDiscounts: Record<string, DiscountCode> = {
      'SAVE20': {
        id: '1',
        code: 'SAVE20',
        description: '20% off your order',
        discount_type: 'percentage',
        value: 20,
        applies_to: 'all',
        minimum_purchase_amount: 100,
        usage_limit: 1000,
        usage_count: 50,
        starts_at: null,
        ends_at: null,
        is_active: true
      },
      'WELCOME10': {
        id: '2',
        code: 'WELCOME10',
        description: '$10 off your first order',
        discount_type: 'fixed_amount',
        value: 10,
        applies_to: 'all',
        minimum_purchase_amount: 50,
        usage_limit: null,
        usage_count: 0,
        starts_at: null,
        ends_at: null,
        is_active: true
      },
      'FREESHIP': {
        id: '3',
        code: 'FREESHIP',
        description: 'Free shipping on all orders',
        discount_type: 'free_shipping',
        value: 0,
        applies_to: 'all',
        minimum_purchase_amount: null,
        usage_limit: null,
        usage_count: 0,
        starts_at: null,
        ends_at: null,
        is_active: true
      }
    }

    const discount = mockDiscounts[code.toUpperCase()]
    
    if (!discount) {
      throw new Error('Invalid discount code')
    }

    if (!discount.is_active) {
      throw new Error('This discount code is no longer active')
    }

    if (discount.minimum_purchase_amount && cartTotal < discount.minimum_purchase_amount) {
      throw new Error(`Minimum purchase of $${discount.minimum_purchase_amount} required`)
    }

    if (discount.usage_limit && discount.usage_count >= discount.usage_limit) {
      throw new Error('This discount code has reached its usage limit')
    }

    if (discount.starts_at && new Date(discount.starts_at) > new Date()) {
      throw new Error('This discount code is not yet valid')
    }

    if (discount.ends_at && new Date(discount.ends_at) < new Date()) {
      throw new Error('This discount code has expired')
    }

    return discount
  }

  const handleApply = async () => {
    if (!code.trim()) return

    setLoading(true)
    setError(null)

    try {
      const discountCode = await validateDiscountCode(code)
      
      if (!discountCode) {
        throw new Error('Invalid discount code')
      }

      const discountAmount = calculateDiscountAmount(discountCode, cartTotal)

      const applied: AppliedDiscount = {
        code: discountCode.code,
        discount_type: discountCode.discount_type,
        value: discountCode.value,
        discount_amount: discountAmount,
        description: discountCode.description || undefined
      }

      setAppliedDiscount(applied)
      onDiscountApplied?.(applied)
      setCode('')
    } catch (err: any) {
      setError(err.message || 'Failed to apply discount code')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setAppliedDiscount(null)
    onDiscountApplied?.(null)
    setCode('')
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApply()
    }
  }

  const formatDiscountDisplay = (discount: AppliedDiscount): string => {
    switch (discount.discount_type) {
      case 'percentage':
        return `${discount.value}% off`
      case 'fixed_amount':
        return `$${discount.value.toFixed(2)} off`
      case 'free_shipping':
        return 'Free shipping'
      case 'buy_x_get_y':
        return 'BOGO discount'
      default:
        return 'Discount applied'
    }
  }

  return (
    <div className={className}>
      {!appliedDiscount ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('marketplace.discount.placeholder')}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="pl-9"
              />
            </div>
            <Button 
              onClick={handleApply} 
              disabled={!code.trim() || loading}
              className="min-w-[80px]"
            >
              {loading ? 'Checking...' : 'Apply'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <p className="text-xs text-muted-foreground">
            Try: SAVE20, WELCOME10, or FREESHIP
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
            <div className="flex items-center gap-2 flex-1">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-green-600 dark:bg-green-700">
                    {appliedDiscount.code}
                  </Badge>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    {formatDiscountDisplay(appliedDiscount)}
                  </span>
                </div>
                {appliedDiscount.description && (
                  <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                    {appliedDiscount.description}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-8 text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {appliedDiscount.discount_amount > 0 && (
            <div className="flex items-center justify-between text-sm px-1">
              <span className="text-muted-foreground">Discount savings:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                -${appliedDiscount.discount_amount.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
