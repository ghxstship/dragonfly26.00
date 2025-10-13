# Onboarding Plan Selection Update

## Issue
The onboarding plan selection page was showing outdated pricing:
- Starter ($0)
- Professional ($49)
- Enterprise ($149)

## Resolution
Updated to match the new 6-tier pricing structure defined in `PRICING_STRUCTURE.md`:

### New Plans
1. **Network** - $0/month (Free Forever)
   - 5 users, 3 projects, 5GB storage
   - Ambassador & Passenger roles

2. **Crew** - $10/month ($12 annual)
   - 15 users, 10 projects, 25GB storage
   - Merchant, Raider, Visitor roles + lower

3. **Team** - $20/month ($24 annual) ⭐ Most Popular
   - 30 users, 25 projects, 50GB storage
   - Deviator role + all lower roles
   - Analytics & reporting

4. **Pro** - $30/month ($36 annual)
   - 50 users, 50 projects, 100GB storage
   - Navigator role + all lower roles
   - Finance & procurement modules

5. **Core** - $50/month ($60 annual)
   - 100 users, 100 projects, 250GB storage
   - Aviator role + all lower roles
   - Custom branding & workflows

6. **Executive** - $100/month ($120 annual)
   - Unlimited users & projects, 1TB storage
   - Phantom role (all roles)
   - White-label, SSO, API access, 24/7 support

## Files Modified

### 1. `/src/lib/subscriptions/plans.ts`
- Updated `SubscriptionPlan` interface to include new plan IDs
- Added `dbId` field to map frontend IDs to database plan IDs
- Replaced old 3-tier structure (free/pro/enterprise) with 6-tier structure
- Updated plan definitions with correct pricing, features, and role mappings
- Added new feature flags: `whiteLabel`, `apiAccess`, `auditLogs`
- Updated `formatPlanFeatures()` to display features in correct order

### 2. `/src/app/[locale]/(onboarding)/onboarding/plan/page.tsx`
- Changed default selected plan from `'free'` to `'network'`
- Updated plan ID checks from `'free'` to `'network'`
- Now displays all 6 plans in a 3-column grid (2 rows)

### 3. `/src/types/index.ts`
- Updated `SubscriptionTier` type from `'free' | 'pro' | 'business' | 'enterprise'`
- Changed to `'network' | 'crew' | 'team' | 'pro' | 'core' | 'executive'`

### 4. `/src/lib/schemas/admin-schemas.ts`
- Updated billing schema plan options to include all 6 new plans
- Replaced old plan labels with: Network, Crew, Team, Pro, Core, Executive

## Database Compatibility
The frontend plan IDs map to database plan IDs as follows:
- `network` → `network`
- `crew` → `crew-monthly`
- `team` → `team-monthly`
- `pro` → `pro-monthly`
- `core` → `core-monthly`
- `executive` → `executive-monthly`

Annual plan variants exist in the database but are not currently exposed in the onboarding flow.

## Layout
The onboarding page uses a responsive grid:
- Mobile: 1 column
- Tablet+: 3 columns
- Result: 6 plans displayed in 2 rows of 3

## Notes
- Database migration `017_update_subscription_pricing.sql` already contains the correct plan structure
- Stripe price IDs should be configured via environment variables:
  - `NEXT_PUBLIC_STRIPE_PRICE_CREW`
  - `NEXT_PUBLIC_STRIPE_PRICE_TEAM`
  - `NEXT_PUBLIC_STRIPE_PRICE_PRO`
  - `NEXT_PUBLIC_STRIPE_PRICE_CORE`
  - `NEXT_PUBLIC_STRIPE_PRICE_EXECUTIVE`
- The checkout API already uses `SUBSCRIPTION_PLANS` and will automatically use the new structure
