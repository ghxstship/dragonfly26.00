/**
 * =====================================================
 * STRIPE CONFIGURATION
 * =====================================================
 * Stripe SDK setup and configuration
 * =====================================================
 */

import Stripe from 'stripe'

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Stripe configuration
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  
  // Price IDs from Stripe Dashboard
  prices: {
    pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO!,
    enterprise: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE!,
  },
  
  // Trial period (in days)
  trialPeriodDays: 14,
  
  // URLs
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/invite`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/plan`,
  customerPortalUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
}

// Validate configuration
export function validateStripeConfig() {
  const required = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required Stripe environment variables: ${missing.join(', ')}`)
  }
}
