import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { stripeService } from '@/lib/stripe/service'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripeService.verifyWebhookSignature(body, signature)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  const supabase = createClient()

  try {
    switch (event.type) {
      // Checkout session completed - subscription created
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription' && session.subscription) {
          const { userId, planId, organizationId, workspaceId } = session.metadata || {}
          
          if (!userId || !planId || !organizationId || !workspaceId) {
            console.error('Missing metadata in checkout session')
            break
          }

          // Create subscription record
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              organization_id: organizationId,
              workspace_id: workspaceId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              plan_id: planId,
              status: 'trialing', // Starts as trial
              trial_start: new Date().toISOString(),
              trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            })

          if (error) {
            console.error('Error creating subscription:', error)
          }
        }
        break
      }

      // Subscription created
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        const { organizationId, workspaceId } = subscription.metadata || {}

        if (organizationId && workspaceId) {
          await supabase
            .from('subscriptions')
            .upsert({
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              organization_id: organizationId,
              workspace_id: workspaceId,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
              trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
            })
        }
        break
      }

      // Subscription updated
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      // Subscription deleted/canceled
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Downgrade to free tier
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            plan_id: 'free',
            canceled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      // Payment succeeded
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'active',
            })
            .eq('stripe_subscription_id', invoice.subscription as string)
        }
        break
      }

      // Payment failed
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
            })
            .eq('stripe_subscription_id', invoice.subscription as string)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
