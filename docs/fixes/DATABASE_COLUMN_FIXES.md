# Database Column Fixes - October 13, 2025

## Overview
Fixed multiple database schema mismatches where application code expected columns that didn't exist in the database tables.

## Root Cause
The application code in `src/hooks/use-module-data.ts` applies `.eq('workspace_id', workspaceId)` filter to ALL table queries (line 142), but some tables were missing the `workspace_id` column.

## Issues Fixed

### 1. Missing workspace_id Columns
**Error Messages:**
- `column grants.workspace_id does not exist`
- `column courses.workspace_id does not exist`
- `column marketplace_products.workspace_id does not exist`

**Solution:** Created migration `20251013192000_add_workspace_id_to_resources.sql`
- Added `workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE` to:
  - `courses` table
  - `grants` table
  - `marketplace_products` table
- Added indexes for efficient querying
- Added RLS policies for all three tables

**Status:** ✅ Applied to database

### 2. Incorrect Column References in use-module-data.ts

#### grants.deadline → grants.application_deadline
**File:** `src/hooks/use-module-data.ts` (line 88)
- **Before:** `'grants': { table: 'grants', select: '*', orderBy: 'deadline' }`
- **After:** `'grants': { table: 'grants', select: '*', orderBy: 'application_deadline' }`
- **Reason:** The `grants` table has `application_deadline`, not `deadline`

**Status:** ✅ Fixed

#### marketplace_orders.order_date → marketplace_orders.created_at
**File:** `src/hooks/use-module-data.ts` (line 83)
- **Before:** `'purchases': { table: 'marketplace_orders', select: '*', orderBy: 'order_date' }`
- **After:** `'purchases': { table: 'marketplace_orders', select: '*', orderBy: 'created_at' }`
- **Reason:** The `marketplace_orders` table doesn't have an `order_date` column

**Status:** ✅ Fixed

#### purchase_orders.order_date → purchase_orders.issue_date
**File:** `src/hooks/use-module-data.ts` (line 72)
- **Before:** `'orders': { table: 'purchase_orders', select: '*, company:vendor_id(name)', orderBy: 'order_date' }`
- **After:** `'orders': { table: 'purchase_orders', select: '*, company:company_id(name)', orderBy: 'issue_date' }`
- **Reason:** The `purchase_orders` table has `issue_date`, not `order_date`

**Status:** ✅ Fixed

#### purchase_orders.vendor_id → purchase_orders.company_id
**File:** `src/hooks/use-module-data.ts` (line 72)
- **Before:** `select: '*, company:vendor_id(name)'`
- **After:** `select: '*, company:company_id(name)'`
- **Reason:** The `purchase_orders` table uses `company_id`, not `vendor_id`

**Status:** ✅ Fixed

## Files Modified
1. `/supabase/migrations/20251013192000_add_workspace_id_to_resources.sql` (created)
2. `/src/hooks/use-module-data.ts` (4 fixes)

## Testing Required
- [ ] Test Grants page in Resources module
- [ ] Test Courses page in Resources module
- [ ] Test Marketplace Products page
- [ ] Test Purchase Orders page in Procurement module
- [ ] Verify RLS policies work correctly for all three tables

## Prevention
Consider adding:
1. Database schema validation tests
2. TypeScript types generated from database schema
3. Automated column reference validation in hooks

## Related Issues
These errors were causing "Error loading data" messages on:
- Resources > Grants tab
- Resources > Courses tab
- Marketplace > Products tab (if used)
