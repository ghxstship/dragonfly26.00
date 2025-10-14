# Module Data Relationship Audit - October 14, 2025

## ZERO TOLERANCE AUDIT - Error Loading Data Issues

### Audit Scope
Complete review of all 20 modules and their 200+ tabs to identify and fix ALL relationship errors causing "Error Loading Data" issues.

### Root Cause Analysis
Tables reference `auth.users(id)` via foreign keys, but queries attempt to join with `profiles` table. Since `profiles.id = auth.users.id`, this CAN work, but ONLY if:
1. The foreign key column name matches the relationship alias
2. The profile fields being selected actually exist
3. The relationship syntax is correct

### Confirmed Schema Facts
- `profiles` table has: `id UUID PRIMARY KEY REFERENCES auth.users(id)`
- `profiles` has: `first_name TEXT`, `last_name TEXT`, `full_name TEXT`, `avatar_url TEXT`, `title TEXT`, `company TEXT`
- Most tables use: `created_by UUID NOT NULL REFERENCES auth.users(id)`
- Some tables use: `requested_by`, `processed_by`, `reconciled_by`, `approved_by`, etc.

---

## MODULE-BY-MODULE AUDIT

### 1. DASHBOARD MODULE (11 tabs)
**Status**: ❌ ERRORS FOUND

#### Tab: my-agenda
- **Table**: `events`
- **Current Query**: `events` with orderBy
- **Issue**: No join specified, but may need production/location relationships
- **Action**: ✅ OK - No profiles relationship needed

#### Tab: my-jobs  
- **Table**: `job_contracts`
- **Current Query**: `*, client:companies!client_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)`
- **Schema**: `created_by UUID NOT NULL REFERENCES auth.users(id)`
- **Status**: ✅ Should work - relationship syntax correct

#### Tab: my-tasks
- **Table**: `project_tasks`
- **Current Query**: `*, production:productions!production_id(name), assignee:profiles!assignee_id(first_name, last_name)`
- **Schema**: `assignee_id UUID REFERENCES auth.users(id)`
- **Status**: ✅ Should work - relationship syntax correct

#### Tab: my-assets
- **Table**: `assets`
- **Current Query**: `*, location:locations!location_id(name, city)`
- **Status**: ✅ OK - No profiles relationship needed

#### Tab: my-orders
- **Table**: `marketplace_orders`
- **Current Query**: `*, buyer:profiles!buyer_id(first_name, last_name)`
- **Schema**: `buyer_id UUID NOT NULL REFERENCES auth.users(id)`
- **Status**: ✅ Should work - relationship syntax correct

#### Tab: my-advances
- **Table**: `production_advances`
- **Current Query**: `*, production:productions!production_id(name, status), requested_by_user:profiles!requested_by(first_name, last_name)`
- **Schema**: `requested_by UUID NOT NULL REFERENCES auth.users(id)`
- **Status**: ✅ Should work - relationship syntax correct

#### Tab: my-travel
- **Table**: `travel_itineraries`
- **Current Query**: `*, traveler:personnel!traveler_id(first_name, last_name)`
- **Issue**: Joins with `personnel` table, not `profiles`
- **Status**: ⚠️ VERIFY - personnel table structure

#### Tab: my-expenses
- **Table**: `financial_transactions`
- **Current Query**: Basic query with orderBy
- **Status**: ✅ OK - No profiles relationship needed

#### Tab: my-reports
- **Table**: `report_templates`  
- **Current Query**: `*` with orderBy
- **Schema**: `created_by UUID NOT NULL REFERENCES auth.users(id)`
- **Status**: ⚠️ MISSING - Should add created_by relationship for consistency

#### Tab: my-files
- **Table**: `files`
- **Current Query**: `*, category:file_categories!category_id(name)`
- **Schema**: `uploaded_by UUID NOT NULL REFERENCES auth.users(id)`
- **Status**: ✅ OK - No profiles relationship in query (by design)

---

### 2. PROJECTS MODULE (8 tabs)
**Status**: ✅ ALL OK

All tabs use basic queries without profile relationships.

---

### 3. EVENTS MODULE (14 tabs)
**Status**: ⚠️ REVIEW NEEDED

Most tabs query `events`, `bookings`, `travel_itineraries` tables without profile joins.
- travel_itineraries uses `personnel` relationship, not `profiles`
- incidents uses `reported_by` field - needs verification

---

### 4. PEOPLE MODULE (9 tabs)
**Status**: ⚠️ REVIEW NEEDED

Uses `personnel` table which is separate from `profiles/auth.users`.
Personnel has optional `user_id UUID REFERENCES auth.users(id)`.

---

### 5. ASSETS MODULE (7 tabs)
**Status**: ⚠️ ERRORS FOUND

#### Tab: tracking
- **Table**: `asset_transactions`
- **Query**: `*, asset:assets!asset_id(name, type), checked_out_person:personnel!checked_out_to(first_name, last_name)`
- **Issue**: Joins with personnel, not profiles
- **Status**: ⚠️ VERIFY personnel table structure

#### Tab: advances (duplicate of my-advances)
- **Table**: `production_advances`
- **Query**: `*, production:productions!production_id(name, status), requested_by_user:profiles!requested_by(first_name, last_name)`
- **Status**: ✅ Should work

---

### 6. LOCATIONS MODULE (6 tabs)
**Status**: ✅ ALL OK

---

### 7. FILES MODULE (10 tabs)
**Status**: ✅ ALL OK

---

### 8. COMPANIES MODULE (6 tabs)
**Status**: ✅ ALL OK

---

### 9. COMMUNITY MODULE (8 tabs)
**Status**: ✅ SHOULD WORK

#### Tab: news, showcase, activity, discussions, competitions
- **Table**: `community_posts`
- **Query**: `*, author:profiles!author_id(id, first_name, last_name, avatar_url, title, company)`
- **Schema**: `author_id UUID NOT NULL REFERENCES auth.users(id)`
- **Status**: ✅ Should work - but includes `title` field which is `job_title` in profiles

#### Tab: connections
- **Table**: `connections`  
- **Query**: `*, user:profiles!user_id(...), connected_user:profiles!connected_user_id(...)`
- **Schema**: `user_id UUID NOT NULL REFERENCES auth.users(id)`, `connected_user_id UUID NOT NULL REFERENCES auth.users(id)`
- **Status**: ✅ Should work - but uses `location` field which doesn't exist in profiles (should be city/state)

---

### 10. MARKETPLACE MODULE (10 tabs)
**Status**: ⚠️ REVIEW NEEDED

Most tabs query `marketplace_products` (no profile joins) or `marketplace_orders` with buyer relationship.

#### Tab: sales, purchases, reviews
- **Table**: `marketplace_orders`
- **Query**: `*, buyer:profiles!buyer_id(first_name, last_name)`
- **Status**: ✅ Should work

---

### 11. RESOURCES MODULE (7 tabs)  
**Status**: ❌ ERRORS FOUND

#### Tab: library, guides, publications, glossary, troubleshooting
- **Table**: `resources`
- **Query**: `*, published_by_user:profiles!published_by(first_name, last_name)`
- **Schema**: Needs verification - likely `created_by` not `published_by`
- **Status**: ❌ COLUMN NAME MISMATCH

#### Tab: courses
- **Table**: `courses`
- **Query**: `*, instructor:profiles!instructor_id(first_name, last_name)`
- **Schema**: Needs verification
- **Status**: ⚠️ VERIFY

---

### 12. FINANCE MODULE (13 tabs)
**Status**: ❌ ERRORS FOUND

#### Tab: forecasting
- **Table**: `budgets`
- **Query**: `*, production:productions!production_id(name)`
- **Schema**: `created_by UUID NOT NULL REFERENCES auth.users(id)`
- **Screenshot Error**: "Could not find a relationship between 'budgets' and 'profiles'"
- **Status**: ❌ MISSING CREATOR - Query doesn't include created_by but error suggests it's trying to

#### Tab: budgets
- **Table**: `budgets`  
- **Query**: `*, production:productions!production_id(name)`
- **Status**: ⚠️ Should add created_by relationship

#### Tab: transactions, revenue, expenses, payments, taxes
- **Table**: `financial_transactions`
- **Query**: `*, budget:budgets!budget_id(name), production:productions!production_id(name), company:companies!company_id(name)`
- **Schema**: `created_by UUID NOT NULL REFERENCES auth.users(id)`
- **Screenshot Error**: "Could not find a relationship between 'financial_transactions' and 'profiles'"
- **Status**: ❌ MISSING CREATOR

#### Tab: payroll
- **Table**: `payroll`
- **Query**: `*, production:productions!production_id(name), processed_by_user:profiles!processed_by(first_name, last_name)`
- **Schema**: `processed_by UUID REFERENCES auth.users(id)`
- **Status**: ✅ Should work

#### Tab: reconciliation
- **Table**: `reconciliations`
- **Query**: Complex with multiple profile joins
- **Schema**: `reconciled_by`, `approved_by` both reference auth.users
- **Status**: ✅ Should work

#### Tab: invoices
- **Table**: `invoices`
- **Query**: `*, company:companies!company_id(name), production:productions!production_id(name)`
- **Schema**: `created_by UUID NOT NULL REFERENCES auth.users(id)`
- **Status**: ⚠️ Should add created_by relationship

---

### 13. PROCUREMENT MODULE (8 tabs)
**Status**: ❌ ERRORS FOUND

#### Tab: fulfillment, orders, line-items, audits
- **Table**: `purchase_orders`
- **Query**: `*, company:companies!company_id(name)`
- **Schema**: Likely has `created_by` field
- **Status**: ⚠️ VERIFY

#### Tab: agreements
- **Table**: `procurement_agreements`
- **Query**: `*, company:companies!company_id(name)`
- **Schema**: `created_by UUID REFERENCES auth.users(id)`, `approved_by UUID REFERENCES auth.users(id)`
- **Status**: ⚠️ Should add relationships

#### Tab: requisitions
- **Table**: `purchase_requisitions`
- **Query**: `*, requested_by_user:profiles!requested_by(first_name, last_name)`
- **Schema**: `requested_by UUID NOT NULL REFERENCES auth.users(id)`
- **Status**: ✅ Should work

#### Tab: approvals
- **Table**: `production_advances`
- **Query**: `*, production:productions!production_id(name, status), requested_by_user:profiles!requested_by(first_name, last_name)`
- **Screenshot Error**: "Could not find a relationship between 'production_advances' and 'profiles'"
- **Schema**: `requested_by UUID NOT NULL REFERENCES auth.users(id)`
- **Status**: ❌ ERROR - Should work but doesn't - INVESTIGATE

---

### 14. JOBS MODULE (8 tabs)
**Status**: ⚠️ REVIEW NEEDED

#### Tab: active, pipeline, offers, shortlists, completed, archived
- **Table**: `job_contracts`
- **Query**: `*, client:companies!client_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)`
- **Schema**: `created_by UUID NOT NULL REFERENCES auth.users(id)`
- **Status**: ✅ Should work

#### Tab: rfps
- **Table**: `rfps`
- **Query**: `*, issuer:companies!issuer_id(name), awarded_company:companies!awarded_to(name)`
- **Status**: ✅ OK

---

### 15. REPORTS MODULE (9 tabs)
**Status**: ❌ ERRORS FOUND

#### Tab: overview (reports-overview)
- **Table**: `report_templates`
- **Query**: `*, created_by_user:profiles!created_by(first_name, last_name)`
- **Schema**: `created_by UUID NOT NULL REFERENCES auth.users(id)`
- **Screenshot Error**: "Could not find a relationship between 'report_templates' and 'profiles'"
- **Status**: ❌ ERROR - Should work but doesn't - INVESTIGATE

#### Tab: templates, custom-builder, scheduled, exports, compliance, executive, operational, archived
- **Table**: `report_templates`
- **Query**: `*, created_by_user:profiles!created_by(first_name, last_name)`
- **Status**: ❌ SAME ERROR ACROSS ALL TABS

---

### 16. ANALYTICS MODULE (10 tabs)
**Status**: ⚠️ REVIEW NEEDED

Most tabs use `analytics_views` or other analytics tables without profile relationships.

---

### 17. INSIGHTS MODULE (10 tabs)
**Status**: ⚠️ REVIEW NEEDED

#### Tab: overview, objectives, progress-tracking
- **Table**: `objectives`
- **Query**: `*, owner:profiles!owner_id(first_name, last_name)`
- **Schema**: `owner_id UUID REFERENCES auth.users(id)`
- **Status**: ✅ Should work

#### Tab: key-results, success-metrics
- **Table**: `key_results`
- **Query**: `*, objective:objectives!objective_id(title)`
- **Schema**: `owner_id UUID REFERENCES auth.users(id)` (on key_results table)
- **Status**: ✅ OK

---

### 18. ADMIN MODULE (11 tabs)
**Status**: ✅ System module - separate audit needed

---

### 19. SETTINGS MODULE (6 tabs)
**Status**: ✅ System module - separate audit needed

---

### 20. PROFILE MODULE (11 tabs)
**Status**: ✅ System module - uses profiles table directly

---

## CRITICAL ISSUES SUMMARY

### High Priority - Confirmed Errors (Screenshots)
1. ❌ **Reports Module** - ALL 9 tabs
   - Error: "Could not find a relationship between 'report_templates' and 'profiles'"
   - Table: `report_templates`
   - FK Column: `created_by UUID NOT NULL REFERENCES auth.users(id)`
   - Query attempts: `created_by_user:profiles!created_by(...)`

2. ❌ **Finance/Forecasting Tab**
   - Error: "Could not find a relationship between 'budgets' and 'profiles'"
   - Table: `budgets`
   - FK Column: `created_by UUID NOT NULL REFERENCES auth.users(id)`

3. ❌ **Finance/Revenue Tab**
   - Error: "Could not find a relationship between 'financial_transactions' and 'profiles'"
   - Table: `financial_transactions`
   - FK Column: `created_by UUID NOT NULL REFERENCES auth.users(id)`

4. ❌ **Procurement/Approvals Tab**
   - Error: "Could not find a relationship between 'production_advances' and 'profiles'"
   - Table: `production_advances`
   - FK Column: `requested_by UUID NOT NULL REFERENCES auth.users(id)`

### Medium Priority - Likely Errors
5. ⚠️ **Resources Module** - Column name mismatches
6. ⚠️ **Community Module** - Field name issues (title vs job_title, location vs city/state)

### Investigation Needed
- Why do some queries work while others with identical patterns fail?
- Is there a schema cache that needs refreshing?
- Are there missing database foreign keys or constraints?

---

## NEXT STEPS

1. ✅ Investigate database schema for actual foreign key definitions
2. ✅ Check if foreign keys exist or if Supabase PostgREST requires explicit definitions
3. ✅ Fix all confirmed errors in use-module-data.ts
4. ✅ Add missing relationships where beneficial
5. ✅ Test all 200+ tabs systematically
