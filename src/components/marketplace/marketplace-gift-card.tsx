"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Check, AlertCircle, CreditCard } from "lucide-react"

export interface GiftCard {
  id: string
  code: string
  initial_value: number
  current_balance: number
  currency: string
  status: 'active' | 'used' | 'disabled' | 'expired'
  expires_at: string | null
}

export interface AppliedGiftCard {
  code: string
  balance: number
  amount_applied: number
}

interface GiftCardInputProps {
  cartTotal: number
  onApply?: (giftCard: AppliedGiftCard | null) => void
  appliedGiftCard?: AppliedGiftCard | null
  className?: string
}

export function GiftCardInput({
  cartTotal,
  onApply,
  appliedGiftCard: externalAppliedGiftCard,
  className
}: GiftCardInputProps) {
  const t = useTranslations()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appliedGiftCard, setAppliedGiftCard] = useState<AppliedGiftCard | null>(
    externalAppliedGiftCard || null
  )

  const validateGiftCard = async (code: string): Promise<GiftCard | null> => {
    // In real implementation, query gift_cards table
    // For now, simulate with mock validation
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock gift cards for demo
    const mockGiftCards: Record<string, GiftCard> = {
      'GIFT-100': {
        id: '1',
        code: 'GIFT-100',
        initial_value: 100,
        current_balance: 100,
        currency: 'USD',
        status: 'active',
        expires_at: null
      },
      'GIFT-50': {
        id: '2',
        code: 'GIFT-50',
        initial_value: 50,
        current_balance: 35.50,
        currency: 'USD',
        status: 'active',
        expires_at: null
      },
      'GIFT-USED': {
        id: '3',
        code: 'GIFT-USED',
        initial_value: 25,
        current_balance: 0,
        currency: 'USD',
        status: 'used',
        expires_at: null
      }
    }

    const giftCard = mockGiftCards[code.toUpperCase()]

    if (!giftCard) {
      throw new Error('Invalid gift card code')
    }

    if (giftCard.status !== 'active') {
      throw new Error(`This gift card is ${giftCard.status}`)
    }

    if (giftCard.current_balance <= 0) {
      throw new Error('This gift card has a zero balance')
    }

    if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
      throw new Error('This gift card has expired')
    }

    return giftCard
  }

  const handleApply = async () => {
    if (!code.trim()) return

    setLoading(true)
    setError(null)

    try {
      const giftCard = await validateGiftCard(code)

      if (!giftCard) {
        throw new Error('Invalid gift card code')
      }

      // Calculate how much to apply (min of balance and cart total)
      const amountToApply = Math.min(giftCard.current_balance, cartTotal)

      const applied: AppliedGiftCard = {
        code: giftCard.code,
        balance: giftCard.current_balance,
        amount_applied: amountToApply
      }

      setAppliedGiftCard(applied)
      onApply?.(applied)
      setCode('')
    } catch (err: any) {
      setError(err instanceof Error ? (err as any).message : 'Failed to apply gift card')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setAppliedGiftCard(null)
    onApply?.(null)
    setCode('')
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApply()
    }
  }

  return (
    <div className={className}>
      {!appliedGiftCard ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1">
              <Gift className="absolute sm:relative sm:inset-auto left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
              <Input
                placeholder={t('marketplace.giftCard.placeholder')}
                value={code as any}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="pl-9 font-mono"
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
            Try: GIFT-100, GIFT-50
          </p>
        </div>
      ) : (
        <Card className="border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex flex-wrap items-center justify-center">
                  <Gift className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Gift Card Applied</CardTitle>
                  <CardDescription className="text-xs font-mono">
                    {appliedGiftCard.code}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-8"
              >
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
              <span className="text-muted-foreground">Gift card balance:</span>
              <span className="font-semibold">
                ${appliedGiftCard.balance.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount applied:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                -${appliedGiftCard.amount_applied.toFixed(2)}
              </span>
            </div>
            {appliedGiftCard.balance > appliedGiftCard.amount_applied && (
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground">Remaining balance:</span>
                <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900">
                  ${(appliedGiftCard.balance - appliedGiftCard.amount_applied).toFixed(2)}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Gift Card Balance Display (for account/profile page)
export function GiftCardBalance({ giftCards }: { giftCards: GiftCard[] }) {
  const t = useTranslations()
  const activeCards = giftCards.filter(gc => gc.status === 'active' && gc.current_balance > 0)
  const totalBalance = activeCards.reduce((sum: any, gc: any) => sum + gc.current_balance, 0)

  if (activeCards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Gift className="h-5 w-5" />
            Gift Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have any active gift cards
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Gift className="h-5 w-5" />
          Gift Cards
        </CardTitle>
        <CardDescription>
          Total balance: ${totalBalance.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeCards.map((card: any) => (
            <div
              key={card.id}
              className="flex flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div>
                <p className="font-mono text-sm font-medium">{card.code}</p>
                {card.expires_at && (
                  <p className="text-xs text-muted-foreground">
                    Expires {new Date(card.expires_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className="text-base font-semibold">
                ${card.current_balance.toFixed(2)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
