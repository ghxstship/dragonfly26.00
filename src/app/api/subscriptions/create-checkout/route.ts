import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripeService } from '@/lib/stripe/service'
import { SUBSCRIPTION_PLANS } from '@/lib/subscriptions/plans'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { planId, workspaceId } = body

    if (!planId || !workspaceId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Validate plan
    const plan = SUBSCRIPTION_PLANS[planId]
    if (!plan || !plan.stripePriceId) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
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
    const session = await stripeService.createCheckoutSession({
      userId: user.id,
      email: user.email!,
      planId,
      stripePriceId: plan.stripePriceId,
      organizationId: workspace.organization.id,
      workspaceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/invite?workspace=${workspaceId}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/plan?workspace=${workspaceId}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
