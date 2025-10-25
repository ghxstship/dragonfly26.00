# Stripe Integration Guide

## Overview

This guide covers the complete Stripe integration for ATLVS subscription management using Stripe's hosted checkout pages.

## Pricing Structure (Aligned with Marketing)

| Plan | Monthly | Annual (billed monthly) | Seats | Roles |
|------|---------|------------------------|-------|-------|
| **Community** | Free | Free | 1 | Raider |
| **Pro** | $12 | $10 ($120/year) | 1 | Deviator, Raider |
| **Team** | $120 | $100 ($1,200/year) | 2-10 | Gladiator, Navigator, Deviator, Raider, Visitor, Merchant, Ambassador |
| **Enterprise** | $1,200 | $1,000 ($12,000/year) | 2-20 | All 11 roles |

**Additional Seats:** $12/month ($10/month annual) for Team and Enterprise plans

---

## Step 1: Create Products in Stripe Dashboard

### 1.1 Log into Stripe Dashboard

Go to [https://dashboard.stripe.com](https://dashboard.stripe.com) → **Products** → **Add Product**

### 1.2 Create ATLVS Pro Product

**Product Details:**
- Name: `ATLVS Pro`
- Description: `Independent Contractor Plan - Single Seat`
- Statement descriptor: `ATLVS PRO`

**Pricing:**
1. **Monthly Price:**
   - Price: `$12.00 USD`
   - Billing period: `Monthly`
   - Price ID: Copy this (format: `price_xxxxxxxxxxxxx`)

2. **Annual Price:**
   - Price: `$120.00 USD`
   - Billing period: `Yearly`
   - Price ID: Copy this

### 1.3 Create ATLVS Team Product

**Product Details:**
- Name: `ATLVS Team`
- Description: `Vendor Plan - 2-10 Seats`
- Statement descriptor: `ATLVS TEAM`

**Pricing:**
1. **Monthly Price:**
   - Price: `$120.00 USD`
   - Billing period: `Monthly`
   - Price ID: Copy this

2. **Annual Price:**
   - Price: `$1,200.00 USD`
   - Billing period: `Yearly`
   - Price ID: Copy this

### 1.4 Create ATLVS Enterprise Product

**Product Details:**
- Name: `ATLVS Enterprise`
- Description: `Producer Plan - 2-20 Seats`
- Statement descriptor: `ATLVS ENTERPRISE`

**Pricing:**
1. **Monthly Price:**
   - Price: `$1,200.00 USD`
   - Billing period: `Monthly`
   - Price ID: Copy this

2. **Annual Price:**
   - Price: `$12,000.00 USD`
   - Billing period: `Yearly`
   - Price ID: Copy this

### 1.5 Create Additional Seat Product

**Product Details:**
- Name: `ATLVS Additional Seat`
- Description: `Additional seat for Team and Enterprise plans`
- Statement descriptor: `ATLVS SEAT`

**Pricing:**
1. **Monthly Price:**
   - Price: `$12.00 USD`
   - Billing period: `Monthly`
   - Price ID: Copy this

2. **Annual Price:**
   - Price: `$120.00 USD`
   - Billing period: `Yearly`
   - Price ID: Copy this

---

## Step 2: Configure Environment Variables

### 2.1 Get Stripe API Keys

1. Go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_`)
3. Copy your **Secret key** (starts with `sk_`)

### 2.2 Update .env.local

Create or update your `.env.local` file:

```bash
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx

# Stripe Price IDs - Pro Plan
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL=price_xxxxx

# Stripe Price IDs - Team Plan
NEXT_PUBLIC_STRIPE_PRICE_TEAM_MONTHLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_TEAM_ANNUAL=price_xxxxx

# Stripe Price IDs - Enterprise Plan
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL=price_xxxxx

# Stripe Price IDs - Additional Seats
NEXT_PUBLIC_STRIPE_PRICE_ADDITIONAL_SEAT_MONTHLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ADDITIONAL_SEAT_ANNUAL=price_xxxxx

# Stripe Webhook Secret (set this after creating webhook in Step 3)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

---

## Step 3: Set Up Stripe Webhook

### 3.1 Create Webhook Endpoint

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL:** `https://yourdomain.com/api/webhooks/stripe`
   - For local testing: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) or [ngrok](https://ngrok.com/)
3. **Description:** `ATLVS Subscription Events`

### 3.2 Select Events to Listen To

Select the following events:

- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.paid`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

### 3.3 Get Webhook Signing Secret

1. After creating the webhook, click on it
2. Copy the **Signing secret** (starts with `whsec_`)
3. Add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

---

## Step 4: Run Database Migration

### 4.1 Apply Subscriptions Table Migration

```bash
# Using Supabase CLI
supabase db push

# Or apply the migration file directly
psql -h your-db-host -U postgres -d your-db-name -f supabase/migrations/110_subscriptions_table.sql
```

### 4.2 Verify Migration

```sql
-- Check if subscriptions table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'subscriptions';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'subscriptions';
```

---

## Step 5: Test the Integration

### 5.1 Test Stripe Checkout Flow

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Go to onboarding:**
   - Navigate to `/onboarding/plan`
   - Toggle between Monthly and Annual billing
   - Select a paid plan (Pro, Team, or Enterprise)

3. **Complete checkout:**
   - You'll be redirected to Stripe's hosted checkout page
   - Use Stripe test cards:
     - Success: `4242 4242 4242 4242`
     - Decline: `4000 0000 0000 0002`
   - Any future date for expiry
   - Any 3-digit CVC

4. **Verify redirect:**
   - After successful payment, you should be redirected to `/onboarding/invite`
   - Check the URL for `session_id` parameter

### 5.2 Test Webhook Locally

**Option A: Using Stripe CLI (Recommended)**

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This will give you a webhook signing secret starting with whsec_
# Add it to your .env.local
```

**Option B: Using ngrok**

```bash
# Install ngrok
brew install ngrok

# Start ngrok tunnel
ngrok http 3000

# Use the HTTPS URL in Stripe webhook settings
# Example: https://abc123.ngrok.io/api/webhooks/stripe
```

### 5.3 Verify Subscription Creation

```sql
-- Check subscriptions table
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 5;

-- Check active subscriptions
SELECT 
  s.*,
  o.name as organization_name
FROM subscriptions s
JOIN organizations o ON o.id = s.organization_id
WHERE s.status IN ('active', 'trialing');
```

---

## Step 6: Production Deployment

### 6.1 Update Environment Variables

In your production environment (Vercel, Railway, etc.):

1. Add all Stripe environment variables
2. Use **live mode** keys (starts with `pk_live_` and `sk_live_`)
3. Use **live mode** price IDs
4. Update webhook URL to production domain

### 6.2 Create Production Webhook

1. In Stripe Dashboard, switch to **Live mode**
2. Create a new webhook endpoint with your production URL
3. Select the same events as in test mode
4. Copy the **live mode** webhook signing secret
5. Update `STRIPE_WEBHOOK_SECRET` in production environment

### 6.3 Test Production Flow

1. Make a real purchase (you can refund it later)
2. Verify webhook events are received
3. Check subscription is created in database
4. Test subscription cancellation
5. Test subscription upgrade/downgrade

---

## Step 7: Customer Portal (Optional)

### 7.1 Enable Customer Portal

1. Go to **Settings** → **Billing** → **Customer portal**
2. Enable the portal
3. Configure allowed actions:
   - ✅ Update payment method
   - ✅ Cancel subscription
   - ✅ Update subscription (upgrade/downgrade)
   - ✅ View invoices

### 7.2 Add Portal Link to Settings

The customer portal link is already configured in `/settings/billing`. Users can:
- Update payment methods
- View billing history
- Cancel subscriptions
- Download invoices

---

## Troubleshooting

### Issue: Webhook signature verification failed

**Solution:**
- Ensure `STRIPE_WEBHOOK_SECRET` is set correctly
- Check that you're using the correct secret for your environment (test vs live)
- Verify the webhook endpoint URL matches exactly

### Issue: Price ID not found

**Solution:**
- Verify all price IDs are copied correctly from Stripe Dashboard
- Ensure you're using the correct mode (test vs live)
- Check that price IDs match the billing cycle (monthly vs annual)

### Issue: Subscription not created in database

**Solution:**
- Check webhook logs in Stripe Dashboard
- Verify database migration was applied successfully
- Check Supabase logs for RLS policy errors
- Ensure metadata is being passed correctly in checkout session

### Issue: Trial period not working

**Solution:**
- Trial period is set to 14 days in `stripeConfig.trialPeriodDays`
- Verify trial settings in Stripe product configuration
- Check `trial_start` and `trial_end` in subscriptions table

---

## Security Best Practices

1. **Never expose secret keys:**
   - Only use `NEXT_PUBLIC_` prefix for publishable keys
   - Keep secret keys in environment variables only

2. **Always verify webhook signatures:**
   - The webhook handler already does this
   - Never skip signature verification

3. **Use HTTPS in production:**
   - Stripe requires HTTPS for webhooks
   - Use a valid SSL certificate

4. **Implement proper RLS policies:**
   - The migration includes RLS policies
   - Users can only view their organization's subscriptions

5. **Log webhook events:**
   - Monitor webhook failures in Stripe Dashboard
   - Set up alerts for payment failures

---

## Support & Resources

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe API Reference:** https://stripe.com/docs/api
- **Stripe Testing:** https://stripe.com/docs/testing
- **Stripe CLI:** https://stripe.com/docs/stripe-cli
- **Webhook Testing:** https://stripe.com/docs/webhooks/test

---

## Summary

✅ **Pricing aligned** with marketing pages
✅ **Stripe products** created with monthly and annual pricing
✅ **Environment variables** configured
✅ **Webhook endpoint** set up and verified
✅ **Database migration** applied
✅ **Checkout flow** uses Stripe's hosted pages (most scalable)
✅ **Subscription management** automated via webhooks
✅ **Customer portal** enabled for self-service

Your Stripe integration is now complete and production-ready!
