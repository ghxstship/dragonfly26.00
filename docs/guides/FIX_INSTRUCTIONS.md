# Fix PostgREST Relationship Errors

## Problem
Multiple views showing "Error loading data - Could not find a relationship" errors:
- Companies > Work Orders: `work_orders` → `profiles`
- Companies > Reviews: `subcontractor_reviews` → `profiles`  
- Jobs > Work Orders: `work_orders` → `profiles`
- Jobs > Dispatch: `work_orders` → `profiles`
- Jobs > Estimates: `estimates` → `profiles`

## Root Cause
Tables have foreign keys to `auth.users(id)` but PostgREST cannot discover relationships to the `profiles` table. The fix adds explicit foreign keys from user columns to `profiles(id)`.

## Solution

### Option 1: Apply via Supabase SQL Editor (Recommended)

1. Open your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the contents of `APPLY_PROFILE_FK_FIX.sql`
5. Click **Run**
6. Verify success messages in the output

### Option 2: Apply via Migration Script

If you have valid database credentials in `.env`:

```bash
node scripts/apply-migrations.js
```

This will apply migration `067_fix_profile_foreign_keys.sql` automatically.

## What This Fixes

The fix adds foreign key constraints across **all modules** in your system:

### Work Orders & Subcontractors
- ✅ `work_orders.created_by` → `profiles(id)`
- ✅ `work_orders.compliance_verified_by` → `profiles(id)`
- ✅ `work_order_offers.decided_by` → `profiles(id)`
- ✅ `subcontractor_reviews.reviewed_by` → `profiles(id)`
- ✅ `subcontractor_compliance_docs.verified_by` → `profiles(id)`

### Estimates & Invoices
- ✅ `estimates.created_by` → `profiles(id)`
- ✅ `subcontractor_invoices.created_by` → `profiles(id)`
- ✅ `subcontractor_invoices.approved_by` → `profiles(id)`

### Communication
- ✅ `communication_threads.created_by` → `profiles(id)`
- ✅ `thread_messages.author_id` → `profiles(id)`

### Analytics & Business Intelligence
- ✅ `analytics_integrations.created_by` → `profiles(id)`
- ✅ `saved_reports.created_by` → `profiles(id)`
- ✅ `business_goals.created_by` → `profiles(id)`
- ✅ `business_goals.owner_id` → `profiles(id)`

### Events Management
- ✅ `events.organizer_id` → `profiles(id)`
- ✅ `events.created_by` → `profiles(id)`
- ✅ `event_tasks.responsible_person_id` → `profiles(id)`
- ✅ `event_logistics.created_by` → `profiles(id)`
- ✅ `event_incidents.reported_by` → `profiles(id)`

### Files & Documents
- ✅ `files.uploaded_by` → `profiles(id)`
- ✅ `file_versions.uploaded_by` → `profiles(id)`

### Companies & Locations
- ✅ `companies.created_by` → `profiles(id)`
- ✅ `locations.created_by` → `profiles(id)`
- ✅ `location_versions.created_by` → `profiles(id)`

### Tours & Settlements
- ✅ `tours.tour_manager_id` → `profiles(id)`
- ✅ `tours.created_by` → `profiles(id)`
- ✅ `tour_settlements.created_by` → `profiles(id)`
- ✅ `settlement_reconciliations.reconciled_by` → `profiles(id)`
- ✅ `settlement_reconciliations.approved_by` → `profiles(id)`

### Procurement
- ✅ `purchase_requisitions.requested_by` → `profiles(id)`
- ✅ `purchase_requisitions.approved_by` → `profiles(id)`

### Expense Policies & Compliance
- ✅ `expense_policy_rules.created_by` → `profiles(id)`
- ✅ `policy_violations.violated_by` → `profiles(id)`
- ✅ `policy_violations.resolved_by` → `profiles(id)`
- ✅ `virtual_cards.card_holder_id` → `profiles(id)`
- ✅ `virtual_cards.created_by` → `profiles(id)`

**Total: 40+ foreign key relationships established**

## Verification

After applying, refresh your application and check the previously failing views:
- Companies > Work Orders
- Companies > Reviews
- Jobs > Work Orders
- Jobs > Estimates

All should now load data correctly.

## Technical Details

PostgREST discovers relationships through foreign keys. When a table references `auth.users(id)` directly, PostgREST cannot automatically link it to `profiles(id)`. By adding explicit FKs to `profiles(id)`, we enable PostgREST's relationship discovery mechanism.

The migration is idempotent - it checks for existing constraints before adding them, so it's safe to run multiple times.
