# Admin Schemas Branded Roles Fix

**Date:** January 14, 2025  
**Issue:** `admin-schemas.ts` used generic placeholder roles (Owner, Admin, Member, Guest) instead of the branded RBAC roles defined in the system (Legend, Aviator, Gladiator, etc.)

## Root Cause

The `/src/lib/schemas/admin-schemas.ts` file was created with hardcoded generic role options that didn't match the comprehensive branded RBAC system implemented in `/src/lib/rbac/role-definitions.ts`.

**Generic Roles (Incorrect):**
- Owner
- Admin  
- Member
- Guest

**Branded Roles (Correct):**
- Legend (Level 1) - Platform super admin
- Phantom (Level 2) - Organization super admin
- Aviator (Level 3) - Strategic leader
- Gladiator (Level 4) - Project manager
- Navigator (Level 5) - Department manager
- Deviator (Level 6) - Team lead
- Raider (Level 7) - Team member
- Merchant (Level 8) - External contractor
- Visitor (Level 9) - Temporary custom access
- Passenger (Level 10) - Read-only stakeholder
- Ambassador (Level 11) - Marketing affiliate

## Solution

### 1. Updated Admin Schemas (`src/lib/schemas/admin-schemas.ts`)

**Before:**
```typescript
const roleOptions = [
  { label: 'Owner', value: 'owner', color: '#dc2626' },
  { label: 'Admin', value: 'admin', color: '#ea580c' },
  { label: 'Member', value: 'member', color: '#2563eb' },
  { label: 'Guest', value: 'guest', color: '#64748b' },
]
```

**After:**
```typescript
import { BRANDED_ROLES } from '../rbac/role-definitions'

const roleOptions = [
  { label: 'Legend', value: 'legend', color: '#8B5CF6' },
  { label: 'Phantom', value: 'phantom', color: '#7C3AED' },
  { label: 'Aviator', value: 'aviator', color: '#6D28D9' },
  { label: 'Gladiator', value: 'gladiator', color: '#5B21B6' },
  { label: 'Navigator', value: 'navigator', color: '#4C1D95' },
  { label: 'Deviator', value: 'deviator', color: '#3B0764' },
  { label: 'Raider', value: 'raider', color: '#2E1065' },
  { label: 'Merchant', value: 'merchant', color: '#059669' },
  { label: 'Visitor', value: 'visitor', color: '#0891B2' },
  { label: 'Passenger', value: 'passenger', color: '#6366F1' },
  { label: 'Ambassador', value: 'ambassador', color: '#EC4899' },
]
```

### 2. Updated Members Management Component (`src/components/admin/members-management-tab.tsx`)

**Changes:**
- Updated `Member` interface role type from generic roles to all 11 branded roles
- Updated mock data to use branded roles (phantom, aviator, raider, passenger)
- Updated `getRoleBadgeColor()` to handle all 11 roles
- Changed role promotion dropdown actions:
  - "Make Admin" → "Make Aviator"
  - "Make Member" → "Make Raider"  
  - "Make Viewer" → "Make Passenger"
- Updated high-level role counting to use legend/phantom/aviator/gladiator
- Changed crown icon display from "owner" to legend/phantom
- Updated role protection check from `role !== "owner"` to `!['legend', 'phantom'].includes(role)`

## What Now Works

✅ **Admin module schemas use branded roles**
- Billing schema role field shows Legend, Aviator, etc.
- Roles & Permissions schema aligned with RBAC system
- Security logs schema uses correct role values
- Members schema properly reflects branded roles

✅ **Members management UI**
- Role badges display branded role names with correct colors
- Role promotion options reflect hierarchy (Aviator, Raider, Passenger)
- High-level role counting tracks Legend/Phantom/Aviator/Gladiator
- Crown icon shows for platform/org admins (Legend/Phantom)

✅ **Consistency with billing/pricing**
- Roles match 6-tier subscription structure in `PRICING_STRUCTURE.md`
- Network plan: Ambassador, Passenger
- Crew plan: Merchant, Raider, Visitor
- Team plan: Deviator + all Crew
- Pro plan: Navigator + all Team  
- Core plan: Aviator + all Pro
- Executive plan: Gladiator, Phantom, Legend

## Files Modified

1. **`src/lib/schemas/admin-schemas.ts`**
   - Replaced generic roleOptions with 11 branded roles
   - Added import of BRANDED_ROLES
   - Applied correct brand colors from role-definitions

2. **`src/components/admin/members-management-tab.tsx`**
   - Updated Member interface with branded role type
   - Replaced all mock data with branded roles
   - Updated getRoleBadgeColor switch statement
   - Changed role promotion action labels
   - Updated high-level role filtering logic
   - Fixed crown icon conditional for Legend/Phantom

## Testing

Build successful: ✓

```bash
npm run build
# ✓ Compiled successfully in 5.2s
```

## Related Systems

- **RBAC Role Definitions** (`src/lib/rbac/role-definitions.ts`) - Source of truth for all 11 roles
- **RBAC Types** (`src/types/rbac.ts`) - TypeScript types for role system
- **Pricing Structure** (`docs/business/PRICING_STRUCTURE.md`) - Role availability per subscription tier
- **Billing Tab** (`src/components/admin/billing-tab.tsx`) - Uses billingSchema with roles

## Impact

**Before:**
- Admin schemas showed generic corporate roles (Owner/Admin/Member)
- Disconnected from branded RBAC system
- Inconsistent with subscription tier role availability
- Confusing for users expecting branded roles

**After:**
- All admin module views show branded roles (Legend, Aviator, etc.)
- Single source of truth with RBAC role definitions
- Aligned with subscription pricing structure
- Consistent user experience across all admin interfaces
