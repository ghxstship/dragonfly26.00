'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import { SUBSCRIPTION_PLANS, formatPlanFeatures } from '@/lib/subscriptions/plans'
import { createClient } from '@/lib/supabase/client'

export default function SelectPlanPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('community')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const workspaceId = searchParams.get('workspace')

  useEffect(() => {
    if (!workspaceId) {
      toast({
        title: 'Missing workspace',
        description: 'Please complete workspace setUp first.',
        variant: 'destructive',
      })
      router.push('/onboarding/workspace')
    }
  }, [workspaceId])

  const handleSelectPlan = async (planId: string) => {
    setLoading(true)
    setSelectedPlan(planId)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (planId === 'community') {
        // Free plan - just continue to next step
        router.push(`/onboarding/invite?workspace=${workspaceId}`)
      } else {
        // Paid plan - redirect to Stripe Checkout
        const response = await fetch('/api/subscriptions/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId,
            workspaceId,
            billingCycle,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create checkout session')
        }

        const { url } = await response.json()
        
        // Redirect to Stripe Checkout
        window.location.href = url
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: (error as any).message,
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  const plans = Object.values(SUBSCRIPTION_PLANS)

  return (
    <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen py-6 md:py-4 md:py-6 lg:py-8 lg:py-12 px-4 md:px-6 lg:px-8">
      <div className="space-y-4 md:space-y-3 md:space-y-4 lg:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-lg md:text-xl lg:text-2xl md:text-xl md:text-2xl lg:text-3xl lg:text-4xl font-title uppercase">Choose your plan</h1>
          <p className="text-muted-foreground text-lg">
            Start with a free trial, upgrade anytime
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex flex-wrap flex-col md:flex-row items-center justify-center gap-2">
          <div className="h-2 w-12 bg-primary rounded-full" />
          <div className="h-2 w-12 bg-primary rounded-full" />
          <div className="h-2 w-12 bg-primary rounded-full" />
          <div className="h-2 w-12 bg-muted rounded-full" />
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex flex-wrap flex-col md:flex-row items-center justify-center gap-2 p-1 bg-muted rounded-lg w-fit mx-auto">
          <Button
            variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === 'annual' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingCycle('annual')}
          >
            Annual
            <Badge variant="secondary" className="ml-2">Save 2 Months</Badge>
          </Button>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6 mt-12">
          {plans.map((plan: any) => {
            const features = formatPlanFeatures(plan)
            const isSelected = selectedPlan === plan.id
            const isPopular = plan.popular

            return (
              <Card
                key={plan.id}
                className={`relative ${isPopular ? 'border-primary shadow-lg scale-105' : ''} ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute sm:relative sm:inset-auto -top-2 md:top-4 left-0 right-2 md:right-0 flex flex-wrap justify-center">
                    <Badge className="px-3 py-1">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="min-h-[40px]">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="pt-4">
                    <div className="flex flex-wrap items-baseline justify-center gap-1">
                      <span className="text-xl md:text-2xl lg:text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-title uppercase">
                        ${billingCycle === 'annual' && plan.annualPrice ? plan.annualPrice : plan.price}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {billingCycle === 'annual' && plan.annualPrice && plan.annualPrice !== plan.price && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                        ${plan.price * 12} billed annually
                      </p>
                    )}
                    {plan.id !== 'community' && (
                      <p className="text-sm text-muted-foreground mt-2">
                        14-day free trial included
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 md:space-y-4 lg:space-y-6">
                  {/* Features */}
                  <ul className="space-y-3">
                    {features.slice(0, 8).map((feature: any, idx: number) => (
                      <li key={idx} className="flex flex-wrap flex-col md:flex-row items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {features.length > 8 && (
                      <li className="text-sm text-muted-foreground">
                        +{features.length - 8} more features
                      </li>
                    )}
                  </ul>

                  {/* CTA */}
                  <Button
                    className="w-full max-w-full"
                    variant={isPopular ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={loading}
                  >
                    {loading && isSelected && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {plan.id === 'network' ? 'Start Free' : 'Start Free Trial'}
                  </Button>

                  {plan.highlight && (
                    <p className="text-xs text-center text-muted-foreground">
                      {plan.highlight}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional info */}
        <div className="text-center pt-8 space-y-4">
          <p className="text-sm text-muted-foreground">
            All plans include access to core features. Cancel anytime.
          </p>
          <Button
            variant="ghost"
            onClick={() => router.push(`/onboarding/invite?workspace=${workspaceId}`)}
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  )
}
