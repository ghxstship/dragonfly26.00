import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price_monthly: 0,
    price_yearly: 0,
    features: [
      'Up to 5 users',
      'Basic views (List, Board, Table)',
      '100 MB storage',
      'Community support',
    ],
    max_users: 5,
    max_workspaces: 1,
  },
  pro: {
    name: 'Pro',
    price_monthly: 10,
    price_yearly: 100,
    features: [
      'Up to 25 users',
      'All view types',
      '10 GB storage',
      'Priority support',
      'Custom fields',
      'Advanced permissions',
    ],
    max_users: 25,
    max_workspaces: 5,
  },
  business: {
    name: 'Business',
    price_monthly: 25,
    price_yearly: 250,
    features: [
      'Up to 100 users',
      'All features',
      '100 GB storage',
      '24/7 support',
      'Advanced analytics',
      'Custom branding',
      'API access',
    ],
    max_users: 100,
    max_workspaces: -1, // Unlimited
  },
  enterprise: {
    name: 'Enterprise',
    price_monthly: null, // Custom pricing
    price_yearly: null,
    features: [
      'Unlimited users',
      'All features',
      'Unlimited storage',
      'Dedicated support',
      'Advanced security',
      'SSO/SAML',
      'Custom integrations',
      'SLA guarantee',
    ],
    max_users: -1, // Unlimited
    max_workspaces: -1, // Unlimited
  },
}

export async function createCheckoutSession(params: {
  customerId?: string
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  })

  return session
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function createCustomer(params: {
  email: string
  name: string
  metadata?: Record<string, string>
}) {
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata,
  })

  return customer
}

export async function updateSubscription(subscriptionId: string, params: {
  priceId?: string
  quantity?: number
  metadata?: Record<string, string>
}) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: params.priceId,
        quantity: params.quantity,
      },
    ],
    metadata: params.metadata,
    proration_behavior: 'create_prorations',
  })

  return updatedSubscription
}

export async function cancelSubscription(subscriptionId: string, immediately = false) {
  if (immediately) {
    return await stripe.subscriptions.cancel(subscriptionId)
  } else {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })
  }
}

// Marketplace Functions
export async function createProduct(params: {
  name: string
  description: string
  price: number
  metadata?: Record<string, string>
}) {
  const product = await stripe.products.create({
    name: params.name,
    description: params.description,
    metadata: params.metadata,
  })

  const price = await stripe.prices.create({
    product: product.id,
    currency: 'usd',
    unit_amount: params.price * 100, // Convert to cents
  })

  return { product, price }
}

export async function createMarketplaceCheckoutSession(params: {
  customerId?: string
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  })

  return session
}

export async function createConnectedAccount(params: {
  email: string
  country: string
}) {
  const account = await stripe.accounts.create({
    type: 'express',
    email: params.email,
    country: params.country,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })

  return account
}

export async function createAccountLink(accountId: string, returnUrl: string, refreshUrl: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  })

  return accountLink
}

export async function createTransfer(params: {
  amount: number
  currency: string
  destination: string
  metadata?: Record<string, string>
}) {
  const transfer = await stripe.transfers.create({
    amount: params.amount,
    currency: params.currency,
    destination: params.destination,
    metadata: params.metadata,
  })

  return transfer
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

export async function getCustomer(customerId: string) {
  return await stripe.customers.retrieve(customerId)
}

export async function listInvoices(customerId: string, limit = 10) {
  return await stripe.invoices.list({
    customer: customerId,
    limit,
  })
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}
