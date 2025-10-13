# Stripe Implementation Guide

## Overview
This guide covers everything you need to implement Stripe payments for your subscription plans.

## Current Status
✅ **Code Implementation**: Complete  
❌ **Stripe Configuration**: Not configured  
❌ **Environment Variables**: Missing  

## Prerequisites
- Stripe account (create at https://stripe.com)
- Access to your Stripe Dashboard
- Vercel/deployment platform access for environment variables

---

## Step-by-Step Implementation

### 1. Create a Stripe Account
1. Go to https://stripe.com and sign up
2. Complete business verification (required for production)
3. Access your Stripe Dashboard at https://dashboard.stripe.com

### 2. Get Your API Keys

#### Development Keys (Test Mode)
1. In Stripe Dashboard, click **Developers** → **API keys**
2. Toggle to **Test mode** (top right)
3. Copy the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

#### Production Keys
1. Toggle to **Live mode**
2. Copy the following keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

> ⚠️ **Never commit secret keys to Git!**

---

### 3. Create Stripe Products & Prices

For each of your 5 paid plans, create a product and price in Stripe:

#### A. Create Products
1. Go to **Products** → **Add product**
2. Create a product for each plan:

   **Product 1: Crew**
   - Name: `Crew`
   - Description: `For small teams getting started`
   - Pricing model: `Recurring`
   - Price: `$10` per `month`
   - Trial period: `14 days`
   - Copy the **Price ID** (starts with `price_`)

   **Product 2: Team**
   - Name: `Team`
   - Description: `For growing teams with team leads`
   - Price: `$20` per `month`
   - Trial period: `14 days`
   - Copy the **Price ID**

   **Product 3: Pro**
   - Name: `Pro`
   - Description: `For departments with advanced needs`
   - Price: `$30` per `month`
   - Trial period: `14 days`
   - Copy the **Price ID**

   **Product 4: Core**
   - Name: `Core`
   - Description: `For strategic leadership and multi-project oversight`
   - Price: `$50` per `month`
   - Trial period: `14 days`
   - Copy the **Price ID**

   **Product 5: Executive**
   - Name: `Executive`
   - Description: `For large organizations with enterprise needs`
   - Price: `$100` per `month`
   - Trial period: `14 days`
   - Copy the **Price ID**

> 💡 **Optional**: Create annual pricing options (e.g., $12/year billed annually) if you want to offer annual billing

---

### 4. Set Up Webhooks

Webhooks notify your app when subscription events occur (payments, cancellations, etc.)

#### A. Create Webhook Endpoint
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter endpoint URL:
   ```
   https://your-domain.vercel.app/api/webhooks/stripe
   ```
4. Select events to listen to:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

#### B. Test Webhook Locally (Development)
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
3. This gives you a test webhook secret starting with `whsec_`

---

### 5. Configure Environment Variables

Add these to your `.env.local` file (development) and Vercel (production):

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# Stripe Price IDs (from Step 3)
NEXT_PUBLIC_STRIPE_PRICE_CREW=price_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_TEAM=price_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_CORE=price_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_EXECUTIVE=price_xxxxxxxxxxxxxxxxxxxxx

# App URL (for redirect URLs)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### Add to Vercel:
1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable above
4. Redeploy your app

---

### 6. Test the Integration

#### Test Mode Flow:
1. Try selecting a paid plan in onboarding
2. Use Stripe test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0025 0000 3155`
3. Use any future expiry date (e.g., `12/34`)
4. Use any 3-digit CVC (e.g., `123`)
5. Use any ZIP code

#### Verify Webhook Events:
1. Complete a test checkout
2. Go to **Developers** → **Webhooks** → Your endpoint
3. Check that events are being received successfully
4. View event details to debug issues

---

### 7. Handle Subscription Lifecycle

Your app already has code to handle these webhook events:

**Location**: `/src/app/api/webhooks/stripe/route.ts`

Events handled:
- ✅ `checkout.session.completed` - User completes checkout
- ✅ `customer.subscription.updated` - Subscription changes (upgrade/downgrade)
- ✅ `customer.subscription.deleted` - Subscription canceled
- ✅ `invoice.payment_succeeded` - Successful payment
- ✅ `invoice.payment_failed` - Failed payment

---

### 8. Enable Customer Portal

The Customer Portal allows users to manage their subscription, update payment methods, and view invoices.

1. Go to **Settings** → **Billing** → **Customer portal**
2. Configure:
   - ✅ Enable customer portal
   - ✅ Allow customers to update payment methods
   - ✅ Allow customers to cancel subscriptions
   - ✅ Allow customers to switch plans
3. Set the portal URL for your domain
4. Save changes

Users can access this via: `/settings/billing` in your app

---

### 9. Production Checklist

Before going live:

- [ ] Switch to Live mode in Stripe Dashboard
- [ ] Create products and prices in Live mode (repeat Step 3)
- [ ] Update webhook endpoint to production URL
- [ ] Update environment variables with live keys
- [ ] Test with real card in test environment
- [ ] Complete Stripe account verification
- [ ] Set up payout schedule
- [ ] Configure email notifications
- [ ] Review tax settings (if applicable)
- [ ] Enable fraud detection rules
- [ ] Set up billing email templates

---

### 10. Common Issues & Solutions

#### Issue: "Payment processing is not configured"
**Solution**: Environment variables are missing. Check that all `STRIPE_*` variables are set in Vercel.

#### Issue: "Invalid payment configuration"
**Solution**: Price IDs don't match. Verify `NEXT_PUBLIC_STRIPE_PRICE_*` variables match your Stripe Dashboard.

#### Issue: Webhooks not working
**Solution**: 
- Verify webhook URL is correct
- Check webhook signing secret matches
- Ensure webhook events are selected
- Check server logs for errors

#### Issue: Customer not redirected after checkout
**Solution**: Check `NEXT_PUBLIC_APP_URL` is set correctly and matches your domain.

---

## File Structure

Your Stripe integration files:

```
src/
├── lib/
│   └── stripe/
│       ├── config.ts              # Stripe configuration & keys
│       └── service.ts             # Stripe service methods
├── app/
│   └── api/
│       ├── subscriptions/
│       │   └── create-checkout/
│       │       └── route.ts       # Create checkout session
│       └── webhooks/
│           └── stripe/
│               └── route.ts       # Handle webhook events
└── components/
    └── settings/
        └── billing-tab.tsx        # Customer billing UI
```

---

## Support Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Testing**: https://stripe.com/docs/testing
- **Webhook Testing**: https://stripe.com/docs/webhooks/test
- **Customer Portal**: https://stripe.com/docs/billing/subscriptions/customer-portal
- **Stripe CLI**: https://stripe.com/docs/stripe-cli

---

## Next Steps

1. **Complete Steps 1-5** to configure Stripe
2. **Test in development** using test mode
3. **Deploy and test on Vercel** with test keys
4. **Go live** by switching to production keys

Once configured, users will be able to:
- ✅ Select paid plans during onboarding
- ✅ Complete checkout with 14-day free trial
- ✅ Manage subscriptions via Customer Portal
- ✅ Upgrade/downgrade plans
- ✅ Update payment methods
- ✅ View invoices and payment history

---

## Questions?

If you encounter issues:
1. Check server logs in Vercel
2. Check Stripe logs in Dashboard → Developers → Logs
3. Verify all environment variables are set
4. Test with Stripe CLI for local debugging
