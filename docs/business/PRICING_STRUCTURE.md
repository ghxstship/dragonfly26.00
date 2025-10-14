# Subscription Pricing Structure

## Overview
Updated pricing tiers with role-based access control and module availability.

## Pricing Tiers

### 🆓 Network - Free Forever
- **Monthly**: $0
- **Annual**: $0
- **Users**: Up to 5
- **Storage**: 5GB
- **Projects**: Up to 3
- **Available Roles**: 
  - Ambassador (Level 11)
  - Passenger (Level 10)
- **Modules**: Projects, Events, People
- **Features**:
  - Basic project management
  - Event tracking
  - People directory
  - Email support

---

### 👥 Crew - $10/month or $12/year
- **Monthly**: $10
- **Annual**: $12 (billed annually)
- **Users**: Up to 15
- **Storage**: 25GB
- **Projects**: Up to 10
- **Available Roles**:
  - Merchant (Level 8)
  - Raider (Level 7)
  - Visitor (Level 9)
  - Ambassador (Level 11)
  - Passenger (Level 10)
- **Modules**: Projects, Events, People, Assets, Files, Locations
- **Features**:
  - All Network features
  - Asset management
  - File management
  - Location tracking
  - Integrations
  - Email support

---

### 🎯 Team - $20/month or $24/year
- **Monthly**: $20
- **Annual**: $24 (billed annually)
- **Users**: Up to 30
- **Storage**: 50GB
- **Projects**: Up to 25
- **Available Roles**:
  - Deviator (Level 6)
  - All Crew roles
- **Modules**: All Crew modules + Companies, Resources
- **Features**:
  - All Crew features
  - Team lead capabilities
  - Analytics & reporting
  - Company management
  - Resource booking
  - Advanced integrations
  - Priority support

---

### 💼 Pro - $30/month or $36/year
- **Monthly**: $30
- **Annual**: $36 (billed annually)
- **Users**: Up to 50
- **Storage**: 100GB
- **Projects**: Up to 50
- **Available Roles**:
  - Navigator (Level 5)
  - All Team roles
- **Modules**: All Team modules + Finance, Procurement, Jobs
- **Features**:
  - All Team features
  - Department management
  - Financial management
  - Procurement workflows
  - Job postings
  - Advanced reporting
  - Priority support

---

### 🏆 Core - $50/month or $60/year
- **Monthly**: $50
- **Annual**: $60 (billed annually)
- **Users**: Up to 100
- **Storage**: 250GB
- **Projects**: Up to 100
- **Available Roles**:
  - Aviator (Level 3)
  - All Pro roles
- **Modules**: All modules (Community, Marketplace, Reports, Analytics, Insights)
- **Features**:
  - All Pro features
  - Strategic leadership tools
  - Multi-project oversight
  - Custom branding
  - Custom workflows
  - Full analytics suite
  - Priority support

---

### 👑 Executive - $100/month or $120/year
- **Monthly**: $100
- **Annual**: $120 (billed annually)
- **Users**: Unlimited
- **Storage**: 1TB
- **Projects**: Unlimited
- **Available Roles**:
  - Phantom (Level 2)
  - All Core roles
- **Modules**: All modules
- **Features**:
  - All Core features
  - Organization super admin
  - White-label options
  - SSO & SAML
  - API access
  - Dedicated support (24/7)
  - Custom integrations
  - Full customization
  - Audit logs

---

## Role Hierarchy

| Level | Role | Scope | Description |
|-------|------|-------|-------------|
| 1 | Legend | Platform | Platform super admin (not included in subscriptions) |
| 2 | Phantom | Organization | Organization super admin |
| 3 | Aviator | Organization | Strategic leader with multi-project oversight |
| 4 | Gladiator | Project | Project manager (not included in standard tiers) |
| 5 | Navigator | Project | Department/area manager |
| 6 | Deviator | Team | Team lead |
| 7 | Raider | Team | Team member |
| 8 | Merchant | Custom | External contractor |
| 9 | Visitor | Custom | Temporary access with custom permissions |
| 10 | Passenger | Custom | Read-only stakeholder |
| 11 | Ambassador | Custom | Marketing affiliate |

## Plan Comparison

| Feature | Network | Crew | Team | Pro | Core | Executive |
|---------|---------|------|------|-----|------|-----------|
| **Price (Monthly)** | $0 | $10 | $20 | $30 | $50 | $100 |
| **Price (Annual)** | $0 | $12 | $24 | $36 | $60 | $120 |
| **Users** | 5 | 15 | 30 | 50 | 100 | ∞ |
| **Storage** | 5GB | 25GB | 50GB | 100GB | 250GB | 1TB |
| **Projects** | 3 | 10 | 25 | 50 | 100 | ∞ |
| **Highest Role** | Passenger | Merchant | Deviator | Navigator | Aviator | Phantom |
| **Analytics** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Integrations** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Custom Branding** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Priority Support** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **White-label** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **SSO/SAML** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **API Access** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **24/7 Support** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

## Migration Notes

### Database Changes
- New migration file: `014_update_subscription_pricing.sql`
- Deletes old plans: `free`, `pro`, `enterprise`
- Creates new plans with monthly/annual variants
- Updates existing subscriptions to map to new plan IDs

### Frontend Changes
- Updated `/src/components/settings/billing-tab.tsx`:
  - Added billing cycle toggle (Monthly/Annual)
  - Updated plan cards with new pricing
  - Added role information to features
- Updated `/src/components/admin/billing-tab.tsx`:
  - Changed plan from "Enterprise" to "Executive"
  - Updated pricing to $100/month
  - Fixed unlimited seats display

### Implementation Steps
1. **Apply Database Migration**:
   ```bash
   supabase db reset # or apply migration manually
   ```

2. **Verify Frontend**:
   - Check Settings > Billing tab for pricing display
   - Verify billing cycle toggle works
   - Confirm plan cards show correct information

3. **Test Stripe Integration** (if configured):
   - Ensure Stripe price IDs are updated
   - Test subscription creation/updates
   - Verify webhook handling

## Notes
- Annual pricing represents monthly equivalent (not total annual cost)
- All prices in USD
- Unlimited (-1) values for Executive tier projects and users
- Role levels determine access hierarchy (lower number = higher access)
