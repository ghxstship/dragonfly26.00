# Migration Guide: HeyPros Competitive Enhancements
**Date:** October 15, 2025  
**Target Modules:** Projects, Jobs, Companies

## Quick Start

### Prerequisites
- Supabase CLI installed
- Database connection configured
- Backup completed

### Apply All Migrations

```bash
cd supabase
supabase db push
```

This will apply migrations in order:
1. `20251015000001_work_orders_system.sql`
2. `20251015000002_subcontractor_compliance.sql`
3. `20251015000003_communication_invoicing.sql`
4. `20251015000004_checklists_workflows.sql`
5. `20251015000005_cost_tracking_recruiting.sql`

---

## Migration Details

### Migration 1: Work Orders System
**File:** `20251015000001_work_orders_system.sql`

**Creates:**
- `work_orders` table (core dispatching system)
- `work_order_offers` table (competitive bidding)

**Triggers:**
- Auto-update work order actual_cost from invoices

**Indexes:** 7 performance indexes  
**RLS Policies:** 6 policies  
**Realtime:** Enabled

---

### Migration 2: Subcontractor Compliance
**File:** `20251015000002_subcontractor_compliance.sql`

**Creates:**
- `subcontractor_profiles` table
- `subcontractor_compliance_docs` table
- `work_authorization_rules` table
- `subcontractor_reviews` table

**Triggers:**
- Auto-update compliance doc status on expiration
- Auto-update subcontractor rating from reviews

**Indexes:** 11 performance indexes  
**RLS Policies:** 8 policies  
**Realtime:** Enabled for profiles and compliance docs

---

### Migration 3: Communication & Invoicing
**File:** `20251015000003_communication_invoicing.sql`

**Creates:**
- `communication_threads` table
- `thread_messages` table
- `subcontractor_invoices` table
- `invoice_line_items` table
- `estimates` table
- `estimate_line_items` table

**Triggers:**
- Auto-create communication thread on work order creation

**Indexes:** 15 performance indexes  
**RLS Policies:** 12 policies  
**Realtime:** Enabled for threads, messages, invoices, estimates

---

### Migration 4: Checklists & Workflows
**File:** `20251015000004_checklists_workflows.sql`

**Creates:**
- `checklist_templates` table
- `checklist_template_items` table
- `checklists` table
- `checklist_items` table
- `approval_workflows` table
- `approval_requests` table
- `approval_steps` table

**Triggers:**
- Auto-complete checklist when all items done
- Auto-update approval request on step completion

**Indexes:** 17 performance indexes  
**RLS Policies:** 14 policies  
**Realtime:** Enabled for checklists and approvals

---

### Migration 5: Cost Tracking & Recruiting
**File:** `20251015000005_cost_tracking_recruiting.sql`

**Creates:**
- `project_cost_categories` table
- `project_costs` table
- `hiring_applications` table
- `hiring_application_responses` table

**Triggers:**
- Auto-create cost from completed work orders
- Auto-create cost from approved invoices
- Auto-update production budget_spent
- Auto-update hiring application counts

**Indexes:** 15 performance indexes  
**RLS Policies:** 8 policies  
**Realtime:** Enabled for costs and hiring

---

## Verification Queries

### Check All Tables Created

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'work_orders',
    'work_order_offers',
    'subcontractor_profiles',
    'subcontractor_compliance_docs',
    'work_authorization_rules',
    'subcontractor_reviews',
    'communication_threads',
    'thread_messages',
    'subcontractor_invoices',
    'invoice_line_items',
    'estimates',
    'estimate_line_items',
    'checklist_templates',
    'checklist_template_items',
    'checklists',
    'checklist_items',
    'approval_workflows',
    'approval_requests',
    'approval_steps',
    'project_cost_categories',
    'project_costs',
    'hiring_applications',
    'hiring_application_responses'
)
ORDER BY table_name;
```

Expected: 23 tables

---

### Check All Triggers Created

```sql
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name IN (
    'update_work_orders_updated_at',
    'trigger_update_work_order_actual_cost',
    'update_subcontractor_profiles_updated_at',
    'update_subcontractor_compliance_docs_updated_at',
    'update_subcontractor_reviews_updated_at',
    'trigger_update_compliance_doc_status',
    'trigger_update_subcontractor_rating',
    'update_communication_threads_updated_at',
    'update_subcontractor_invoices_updated_at',
    'update_estimates_updated_at',
    'trigger_create_work_order_thread',
    'update_checklist_templates_updated_at',
    'update_checklist_items_updated_at',
    'update_approval_workflows_updated_at',
    'trigger_check_checklist_completion',
    'trigger_check_approval_completion',
    'update_project_costs_updated_at',
    'update_hiring_applications_updated_at',
    'update_hiring_application_responses_updated_at',
    'trigger_create_cost_from_work_order',
    'trigger_create_cost_from_invoice',
    'trigger_update_production_budget_spent',
    'trigger_update_hiring_application_counts'
);
```

Expected: 23 triggers

---

### Check RLS Policies

```sql
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename LIKE '%work_order%'
   OR tablename LIKE '%subcontractor%'
   OR tablename LIKE '%communication%'
   OR tablename LIKE '%invoice%'
   OR tablename LIKE '%estimate%'
   OR tablename LIKE '%checklist%'
   OR tablename LIKE '%approval%'
   OR tablename LIKE '%project_cost%'
   OR tablename LIKE '%hiring%'
ORDER BY tablename, cmd;
```

Expected: 68+ policies

---

### Check Indexes

```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND (
    tablename LIKE '%work_order%'
    OR tablename LIKE '%subcontractor%'
    OR tablename LIKE '%communication%'
    OR tablename LIKE '%invoice%'
    OR tablename LIKE '%estimate%'
    OR tablename LIKE '%checklist%'
    OR tablename LIKE '%approval%'
    OR tablename LIKE '%project_cost%'
    OR tablename LIKE '%hiring%'
)
ORDER BY tablename, indexname;
```

Expected: 65+ indexes

---

## Test Data Creation

### Create Test Work Order

```sql
-- First, ensure you have a production, company, and user
INSERT INTO work_orders (
    workspace_id,
    work_order_number,
    title,
    description,
    production_id,
    company_id,
    scope_of_work,
    estimated_cost,
    currency,
    scheduled_start,
    scheduled_end,
    status,
    created_by
) VALUES (
    '{your_workspace_id}',
    'WO-2025-001',
    'Stage Setup and Lighting',
    'Complete stage setup including lighting rig installation',
    '{your_production_id}',
    '{your_company_id}',
    'Install lighting truss, hang fixtures, run cables, program lighting board',
    15000.00,
    'USD',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '8 days',
    'draft',
    '{your_user_id}'
);
```

### Create Test Subcontractor Profile

```sql
INSERT INTO subcontractor_profiles (
    company_id,
    workspace_id,
    is_available,
    availability_status,
    authorized_categories,
    authorized_states,
    specializations
) VALUES (
    '{your_company_id}',
    '{your_workspace_id}',
    true,
    'available',
    ARRAY['lighting', 'rigging', 'electrical'],
    ARRAY['CA', 'NY', 'TX'],
    ARRAY['LED lighting', 'Moving lights', 'Intelligent fixtures']
);
```

### Create Test Compliance Document

```sql
INSERT INTO subcontractor_compliance_docs (
    company_id,
    workspace_id,
    document_type,
    name,
    issue_date,
    expiration_date,
    status
) VALUES (
    '{your_company_id}',
    '{your_workspace_id}',
    'license',
    'Electrical Contractor License',
    CURRENT_DATE - INTERVAL '1 year',
    CURRENT_DATE + INTERVAL '1 year',
    'active'
);
```

### Create Test Estimate

```sql
INSERT INTO estimates (
    workspace_id,
    estimate_number,
    title,
    description,
    client_company_id,
    production_id,
    subtotal,
    tax,
    total,
    valid_until,
    status,
    created_by
) VALUES (
    '{your_workspace_id}',
    'EST-2025-001',
    'Concert Production Services',
    'Full production services for 3-day music festival',
    '{your_client_company_id}',
    '{your_production_id}',
    150000.00,
    13500.00,
    163500.00,
    CURRENT_DATE + INTERVAL '30 days',
    'draft',
    '{your_user_id}'
);
```

---

## Rollback Instructions

If you need to rollback these migrations:

### Rollback All Tables

```sql
-- WARNING: This will delete all data in these tables
DROP TABLE IF EXISTS hiring_application_responses CASCADE;
DROP TABLE IF EXISTS hiring_applications CASCADE;
DROP TABLE IF EXISTS project_costs CASCADE;
DROP TABLE IF EXISTS project_cost_categories CASCADE;
DROP TABLE IF EXISTS approval_steps CASCADE;
DROP TABLE IF EXISTS approval_requests CASCADE;
DROP TABLE IF EXISTS approval_workflows CASCADE;
DROP TABLE IF EXISTS checklist_items CASCADE;
DROP TABLE IF EXISTS checklists CASCADE;
DROP TABLE IF EXISTS checklist_template_items CASCADE;
DROP TABLE IF EXISTS checklist_templates CASCADE;
DROP TABLE IF EXISTS estimate_line_items CASCADE;
DROP TABLE IF EXISTS estimates CASCADE;
DROP TABLE IF EXISTS invoice_line_items CASCADE;
DROP TABLE IF EXISTS subcontractor_invoices CASCADE;
DROP TABLE IF EXISTS thread_messages CASCADE;
DROP TABLE IF EXISTS communication_threads CASCADE;
DROP TABLE IF EXISTS subcontractor_reviews CASCADE;
DROP TABLE IF EXISTS work_authorization_rules CASCADE;
DROP TABLE IF EXISTS subcontractor_compliance_docs CASCADE;
DROP TABLE IF EXISTS subcontractor_profiles CASCADE;
DROP TABLE IF EXISTS work_order_offers CASCADE;
DROP TABLE IF EXISTS work_orders CASCADE;
```

### Rollback Triggers Only

```sql
-- Drop all triggers
DROP TRIGGER IF EXISTS trigger_update_hiring_application_counts ON hiring_application_responses;
DROP TRIGGER IF EXISTS trigger_update_production_budget_spent ON project_costs;
DROP TRIGGER IF EXISTS trigger_create_cost_from_invoice ON subcontractor_invoices;
DROP TRIGGER IF EXISTS trigger_create_cost_from_work_order ON work_orders;
DROP TRIGGER IF EXISTS trigger_check_approval_completion ON approval_steps;
DROP TRIGGER IF EXISTS trigger_check_checklist_completion ON checklist_items;
DROP TRIGGER IF EXISTS trigger_create_work_order_thread ON work_orders;
DROP TRIGGER IF EXISTS trigger_update_subcontractor_rating ON subcontractor_reviews;
DROP TRIGGER IF EXISTS trigger_update_compliance_doc_status ON subcontractor_compliance_docs;
DROP TRIGGER IF EXISTS trigger_update_work_order_actual_cost ON work_orders;

-- Drop trigger functions
DROP FUNCTION IF EXISTS update_hiring_application_counts();
DROP FUNCTION IF EXISTS update_production_budget_spent();
DROP FUNCTION IF EXISTS create_cost_from_invoice();
DROP FUNCTION IF EXISTS create_cost_from_work_order();
DROP FUNCTION IF EXISTS check_approval_completion();
DROP FUNCTION IF EXISTS check_checklist_completion();
DROP FUNCTION IF EXISTS create_work_order_thread();
DROP FUNCTION IF EXISTS update_subcontractor_rating();
DROP FUNCTION IF EXISTS update_compliance_doc_status();
DROP FUNCTION IF EXISTS update_work_order_actual_cost();
```

---

## Common Issues & Solutions

### Issue 1: Migration Fails on Foreign Key
**Error:** `relation "X" does not exist`

**Solution:** Ensure migrations run in correct order. Check that referenced tables exist.

```sql
-- Verify referenced tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('workspaces', 'productions', 'companies', 'auth.users');
```

---

### Issue 2: RLS Policy Blocks Access
**Error:** `new row violates row-level security policy`

**Solution:** Ensure user is member of workspace organization

```sql
-- Check user membership
SELECT * FROM organization_members WHERE user_id = auth.uid();
SELECT * FROM workspaces WHERE organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
);
```

---

### Issue 3: Trigger Not Firing
**Error:** Automated action not happening

**Solution:** Check trigger is enabled and function exists

```sql
-- Check trigger status
SELECT trigger_name, event_object_table, action_timing, event_manipulation, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'your_trigger_name';

-- Test function manually
SELECT your_function_name();
```

---

### Issue 4: Realtime Not Working
**Error:** Not receiving real-time updates

**Solution:** Verify table added to realtime publication

```sql
-- Check realtime publication
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Add table to realtime if missing
ALTER PUBLICATION supabase_realtime ADD TABLE your_table_name;
```

---

## Performance Monitoring

### Monitor Index Usage

```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
AND tablename LIKE '%work_order%'
ORDER BY idx_scan DESC;
```

### Monitor Table Sizes

```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS data_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
AND (
    tablename LIKE '%work_order%'
    OR tablename LIKE '%subcontractor%'
    OR tablename LIKE '%invoice%'
)
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Monitor Trigger Performance

```sql
-- Enable timing
\timing on

-- Test trigger performance
INSERT INTO work_orders (...) VALUES (...);
-- Check how long it takes

-- Check for slow functions
SELECT 
    schemaname,
    funcname,
    calls,
    total_time,
    self_time,
    avg_time
FROM pg_stat_user_functions
WHERE schemaname = 'public'
ORDER BY total_time DESC;
```

---

## Post-Migration Checklist

- [ ] All 5 migrations applied successfully
- [ ] All 23 tables created
- [ ] All 23 triggers created
- [ ] All 68+ RLS policies created
- [ ] All 65+ indexes created
- [ ] Realtime enabled for 14 tables
- [ ] Test data created successfully
- [ ] Queries execute without errors
- [ ] Triggers fire as expected
- [ ] RLS policies allow/block correctly
- [ ] Performance is acceptable
- [ ] Backup completed and verified

---

## Next Steps

1. **API Development**
   - Create API endpoints for new tables
   - Add validation logic
   - Implement business rules

2. **UI Components**
   - Work order management interface
   - Compliance dashboard
   - Invoice approval workflow
   - Estimate builder

3. **Integrations**
   - Accounting software (QuickBooks, Xero)
   - Calendar sync (Google, Outlook)
   - Payment processing

4. **Notifications**
   - Email notifications for approvals
   - SMS alerts for compliance expiration
   - In-app notifications

---

**Migration Guide Version:** 1.0  
**Last Updated:** October 15, 2025  
**Status:** Ready for Production
