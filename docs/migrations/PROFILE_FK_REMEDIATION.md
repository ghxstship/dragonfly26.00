# PostgREST Relationship Errors - Profile Foreign Keys Fix

**Date:** October 15, 2025  
**Issue:** Multiple "Could not find a relationship between [table] and 'profiles'" errors  
**Status:** ⚠️ **FIX READY - AWAITING APPLICATION**

---

## Problem Summary

Multiple views across the application are showing database relationship errors:

| View | Error Message |
|------|---------------|
| Companies > Work Orders | `Could not find a relationship between 'work_orders' and 'profiles'` |
| Companies > Reviews | `Could not find a relationship between 'subcontractor_reviews' and 'profiles'` |
| Jobs > Work Orders | `Could not find a relationship between 'work_orders' and 'profiles'` |
| Jobs > Dispatch | `Could not find a relationship between 'work_orders' and 'profiles'` |
| Jobs > Estimates | `Could not find a relationship between 'estimates' and 'profiles'` |

### Root Cause

Tables have user reference columns (e.g., `created_by`, `reviewed_by`, `approved_by`) that reference `auth.users(id)`, but PostgREST cannot automatically discover relationships to the `profiles` table because:

1. The application uses `profiles` table for user data display
2. Tables reference `auth.users(id)` directly
3. No explicit foreign keys exist from these columns to `profiles(id)`
4. PostgREST requires explicit foreign keys to discover relationships

---

## Solution Implemented

Created a comprehensive SQL migration script that adds explicit foreign keys from all user-referencing columns to `profiles(id)`.

### Files Created

1. **`APPLY_PROFILE_FK_FIX.sql`** - Standalone SQL script (410 lines)
   - Can be run directly in Supabase SQL Editor
   - Idempotent - safe to run multiple times
   - Checks for existing constraints before adding new ones

2. **`FIX_INSTRUCTIONS.md`** - Step-by-step guide
   - Two methods to apply the fix
   - Verification steps
   - Technical explanation

3. **`PROFILE_FK_REMEDIATION.md`** (this file) - Summary and status

### Modules Fixed

The fix adds **40+ foreign key relationships** across:

#### Core Operations
- ✅ Work Orders (created_by, compliance_verified_by)
- ✅ Work Order Offers (decided_by)
- ✅ Estimates (created_by)
- ✅ Subcontractor Reviews (reviewed_by)
- ✅ Subcontractor Invoices (created_by, approved_by)
- ✅ Compliance Docs (verified_by)

#### Communication & Collaboration
- ✅ Communication Threads (created_by)
- ✅ Thread Messages (author_id)

#### Analytics & Planning
- ✅ Analytics Integrations (created_by)
- ✅ Saved Reports (created_by)
- ✅ Business Goals (created_by, owner_id)
- ✅ Key Results (owner_id)
- ✅ Initiatives (owner_id)
- ✅ Strategic Reviews (facilitator_id)
- ✅ AI Insights (reviewed_by)

#### Events & Operations
- ✅ Events (organizer_id, created_by)
- ✅ Event Tasks (responsible_person_id)
- ✅ Event Logistics (created_by)
- ✅ Event Incidents (reported_by)

#### Asset Management
- ✅ Files (uploaded_by)
- ✅ File Versions (uploaded_by)
- ✅ Companies (created_by)
- ✅ Locations (created_by)
- ✅ Location Versions (created_by)

#### Tours & Finance
- ✅ Tours (tour_manager_id, created_by)
- ✅ Tour Settlements (created_by)
- ✅ Settlement Reconciliations (reconciled_by, approved_by)
- ✅ Purchase Requisitions (requested_by, approved_by)

#### Compliance & Controls
- ✅ Expense Policy Rules (created_by)
- ✅ Policy Violations (violated_by, resolved_by)
- ✅ Virtual Cards (card_holder_id, created_by)
- ✅ Approval Steps (approver_id)
- ✅ Approval Requests (requested_by, resolved_by)
- ✅ Approval Workflows (created_by)
- ✅ Production Advances (requestor_id, approver_id, created_by)
- ✅ Project Costs (created_by, approved_by)

---

## How to Apply

### Option 1: Supabase SQL Editor (Recommended)

1. Open Supabase Dashboard → SQL Editor
2. Create new query
3. Copy contents of `APPLY_PROFILE_FK_FIX.sql`
4. Click **Run**
5. Verify success messages in output

### Option 2: Migration Script

If database connection is configured:

```bash
node scripts/apply-migrations.js
```

---

## Expected Results

After applying the fix:

### ✅ Immediate Benefits
- All "Could not find relationship" errors will be resolved
- PostgREST will discover relationships between tables and profiles
- Views will load user data correctly

### ✅ Data Display
- Work Orders will show creator and verifier information
- Reviews will show reviewer information
- Estimates will show creator information
- Invoices will show creator and approver information
- All user-referencing fields will display correctly

### ✅ API Improvements
- PostgREST will automatically include profile data in responses
- Relationship traversal will work correctly
- No code changes required in the application

---

## Verification Steps

After applying the fix:

1. **Refresh the application** (hard refresh: Cmd+Shift+R)
2. **Test the failing views:**
   - Navigate to Companies → Select a company → Work Orders tab
   - Navigate to Companies → Select a company → Reviews tab
   - Navigate to Jobs → Work Orders tab
   - Navigate to Jobs → Estimates tab
3. **Verify data loads** without errors
4. **Check user information displays** correctly

---

## Technical Details

### Why This Works

```sql
-- Before: Direct reference to auth.users
created_by UUID REFERENCES auth.users(id)

-- After: Also add explicit FK to profiles
ALTER TABLE table_name
  ADD CONSTRAINT fk_table_created_by_profile
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
```

Since `profiles.id` is the same UUID as `auth.users.id`, both constraints can coexist. PostgREST now sees the explicit path from tables → profiles.

### Safety Features

- ✅ **Idempotent**: Checks for existing constraints before adding
- ✅ **Non-destructive**: Only adds constraints, doesn't modify data
- ✅ **Transaction-wrapped**: All changes in a single atomic transaction
- ✅ **Table existence checks**: Only adds FKs to tables that exist
- ✅ **Informative output**: Clear success messages for each FK added

---

## Status

- [x] Issue identified and analyzed
- [x] Comprehensive fix script created
- [x] Instructions documented
- [ ] **Fix applied to database** ← **NEXT STEP**
- [ ] Application tested and verified
- [ ] Issue marked as resolved

---

## Next Actions

**TO RESOLVE THIS ISSUE:**

1. Open Supabase Dashboard
2. Navigate to SQL Editor
3. Copy contents of `APPLY_PROFILE_FK_FIX.sql`
4. Run the script
5. Refresh your application
6. Verify the views now load correctly

**Estimated time:** 2-3 minutes

---

## Support

If you encounter any issues:

- Script is idempotent - safe to run multiple times
- Check Supabase logs for any constraint conflicts
- Verify `profiles` table exists and has data
- Ensure no orphaned user references exist in the tables

---

## Migration Integration

For production deployment, the same constraints should be added to your migration system:

- Migration file: `supabase/migrations/069_comprehensive_profile_foreign_keys.sql`
- Contents: Same as `APPLY_PROFILE_FK_FIX.sql`
- Apply via: Your standard migration workflow

---

**Ready to apply?** See `FIX_INSTRUCTIONS.md` for detailed steps.
