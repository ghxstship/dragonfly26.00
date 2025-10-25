import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripeService } from '@/lib/stripe/service'
import { SUBSCRIPTION_PLANS } from '@/lib/subscriptions/plans'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { planId, workspaceId, billingCycle = 'monthly' } = body

    if (!planId || !workspaceId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Validate plan
    const plan = SUBSCRIPTION_PLANS[planId]
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    // Free plan doesn't need Stripe
    if (planId === 'community') {
      return NextResponse.json(
        { error: 'Community plan is free and does not require checkout' },
        { status: 400 }
      )
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe not configured: STRIPE_SECRET_KEY missing')
      return NextResponse.json(
        { error: 'Payment processing is not configured. Please contact support.' },
        { status: 503 }
      )
    }

    // Get correct price ID based on billing cycle
    const stripePriceId = billingCycle === 'annual' 
      ? plan.stripePriceIdAnnual 
      : plan.stripePriceIdMonthly

    // Check if plan has Stripe price ID configured
    if (!stripePriceId || stripePriceId === '') {
      console.error(`Stripe price ID not configured for plan: ${planId} (${billingCycle})`)
      return NextResponse.json(
        { error: `Payment processing is not available for the ${plan.name} plan. Please contact support or choose a different plan.` },
        { status: 503 }
      )
    }

    // Get workspace and organization
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('*, organization:organizations(*)')
      .eq('id', workspaceId)
      .single()

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      )
    }

    // Create Stripe Checkout session
    try {
      const session = await stripeService.createCheckoutSession({
        userId: user.id,
        email: user.email!,
        planId,
        stripePriceId,
        organizationId: workspace.organization.id,
        workspaceId,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/invite?workspace=${workspaceId}&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/plan?workspace=${workspaceId}`,
      })

      if (!session.url) {
        throw new Error('Checkout session created but no URL returned')
      }

      return NextResponse.json({ url: session.url })
    } catch (stripeError: any) {
      console.error('Stripe checkout error:', stripeError)
      
      // Handle specific Stripe errors
      if (stripeError.type === 'StripeInvalidRequestError') {
        return NextResponse.json(
          { error: 'Invalid payment configuration. Please contact support.' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: stripeError.message || 'Failed to create checkout session' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: (error as any).message || 'Failed to process request' },
      { status: 500 }
    )
  }
}
