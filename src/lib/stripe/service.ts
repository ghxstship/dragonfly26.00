/**
 * =====================================================
 * STRIPE SERVICE
 * =====================================================
 * Complete Stripe integration service
 * =====================================================
 */

import { stripe, stripeConfig } from './config'
import { createClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export class StripeService {
  /**
   * Get or create Stripe customer for user
   */
  async getOrCreateCustomer(userId: string, email: string): Promise<string> {
    const supabase = await createClient()
    
    // Check if user already has a Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (profile?.stripe_customer_id) {
      return profile.stripe_customer_id
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
      },
    })

    // Save customer ID to profile
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', userId)

    return customer.id
  }

  /**
   * Create Stripe Checkout session for subscription
   */
  async createCheckoutSession(params: {
    userId: string
    email: string
    planId: string
    stripePriceId: string
    organizationId: string
    workspaceId: string
    successUrl?: string
    cancelUrl?: string
  }): Promise<Stripe.Checkout.Session> {
    const customerId = await this.getOrCreateCustomer(params.userId, params.email)

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl || stripeConfig.successUrl,
      cancel_url: params.cancelUrl || stripeConfig.cancelUrl,
      subscription_data: {
        trial_period_days: stripeConfig.trialPeriodDays,
        metadata: {
          userId: params.userId,
          planId: params.planId,
          organizationId: params.organizationId,
          workspaceId: params.workspaceId,
        },
      },
      metadata: {
        userId: params.userId,
        planId: params.planId,
        organizationId: params.organizationId,
        workspaceId: params.workspaceId,
      },
    })

    return session
  }

  /**
   * Create Customer Portal session for managing subscription
   */
  async createPortalSession(
    customerId: string,
    returnUrl?: string
  ): Promise<Stripe.BillingPortal.Session> {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || stripeConfig.customerPortalUrl,
    })

    return session
  }

  /**
   * Get subscription by ID
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.retrieve(subscriptionId)
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd,
    })
  }

  /**
   * Resume canceled subscription
   */
  async resumeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })
  }

  /**
   * Update subscription (change plan)
   */
  async updateSubscription(
    subscriptionId: string,
    newPriceId: string
  ): Promise<Stripe.Subscription> {
    const subscription = await this.getSubscription(subscriptionId)

    return await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    })
  }

  /**
   * Get customer's payment methods
   */
  async getPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    })

    return paymentMethods.data
  }

  /**
   * Get upcoming invoice
   */
  async getUpcomingInvoice(customerId: string): Promise<Stripe.UpcomingInvoice | null> {
    try {
      return await stripe.invoices.retrieveUpcoming({
        customer: customerId,
      })
    } catch (error: any) {
      // No upcoming invoice
      return null
    }
  }

  /**
   * Get customer's invoices
   */
  async getInvoices(customerId: string, limit: number = 12): Promise<Stripe.Invoice[]> {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit,
    })

    return invoices.data
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeConfig.webhookSecret
    )
  }
}

// Singleton instance
export const stripeService = new StripeService()
