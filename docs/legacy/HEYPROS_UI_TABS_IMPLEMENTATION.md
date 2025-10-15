# HeyPros UI Tabs Implementation Guide
**Date:** October 15, 2025  
**Status:** ✅ Complete - Ready for Testing  
**Scope:** Add Cross-Module Tabs for New HeyPros Features

## Overview

Following the database schema enhancements for HeyPros-competitive features, this implementation adds UI tabs across Projects, Jobs, and Companies modules to expose the new functionality without creating redundancies.

---

## Implementation Summary

### **System Consolidation**
- ✅ Removed old `job_*` tables (job_work_orders, job_estimates, job_invoices, etc.)
- ✅ Migrated to general-purpose tables (work_orders, estimates, subcontractor_invoices, etc.)
- ✅ Single source of truth across all modules
- ✅ Consistent data model for cross-module workflows

### **Files Modified: 4**

1. **Migration:** `supabase/migrations/20251015000006_consolidate_remove_job_tables.sql`
2. **Data Layer:** `src/hooks/use-module-data.ts`
3. **Tab Registry:** `src/lib/modules/tabs-registry.ts`
4. **Table Mappings:** `src/components/workspace/tab-page-content.tsx`

---

## New Tabs Added

### **Projects Module** (+3 tabs)

| Tab | Slug | Table | Description |
|-----|------|-------|-------------|
| **Work Orders** | `projects-work-orders` | `work_orders` | Dispatch work to subcontractors |
| **Costs** | `costs` | `project_costs` | Auto-tracked project costs and budget |
| **Checklists** | `projects-checklists` | `checklists` | Project checklists and reminders |

**Total:** 8 → **11 tabs**

---

### **Jobs Module** (+7 tabs)

| Tab | Slug | Table | Description |
|-----|------|-------|-------------|
| **Work Orders** | `work-orders` | `work_orders` | Dispatch and track subcontractor work |
| **Dispatch** | `dispatch` | `work_orders` | Fast work order dispatching (board view) |
| **Estimates** | `estimates` | `estimates` | Client quotes and proposals |
| **Invoices** | `jobs-invoices` | `subcontractor_invoices` | Subcontractor invoicing and approvals |
| **Compliance** | `jobs-compliance` | `subcontractor_compliance_docs` | Contractor compliance tracking |
| **Checklists** | `checklists` | `checklists` | Job checklists and workflows |
| **Recruiting** | `recruiting` | `hiring_applications` | Hire and recruit subcontractors |

**Total:** 8 → **15 tabs**

---

### **Companies Module** (+5 tabs)

| Tab | Slug | Table | Description |
|-----|------|-------|-------------|
| **Compliance** | `companies-compliance` | `subcontractor_compliance_docs` | Licenses, insurance, certifications with expiration |
| **Work Orders** | `companies-work-orders` | `work_orders` | Work assigned to this company |
| **Invoices** | `companies-invoices` | `subcontractor_invoices` | Invoice submissions and payments |
| **Reviews** | `companies-reviews` | `subcontractor_reviews` | Performance ratings and reviews |
| **Profile** | `subcontractor-profile` | `subcontractor_profiles` | Subcontractor profile and metrics |

**Total:** 6 → **11 tabs**

---

## Data Mappings Added

### Projects Module
```typescript
'projects-work-orders': { 
  table: 'work_orders', 
  select: '*, company:companies!company_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)', 
  orderBy: 'scheduled_start' 
},
'costs': { 
  table: 'project_costs', 
  select: '*, production:productions!production_id(name), category:project_cost_categories!category_id(name, code), company:companies!company_id(name), created_by_user:profiles!created_by(first_name, last_name)', 
  orderBy: 'cost_date' 
},
'projects-checklists': { 
  table: 'checklists', 
  select: '*, template:checklist_templates!template_id(name)', 
  orderBy: 'created_at' 
},
```

### Jobs Module
```typescript
'work-orders': { 
  table: 'work_orders', 
  select: '*, company:companies!company_id(name), production:productions!production_id(name), job_contract:job_contracts!job_contract_id(title, contract_number), created_by_user:profiles!created_by(first_name, last_name)', 
  orderBy: 'scheduled_start' 
},
'estimates': { 
  table: 'estimates', 
  select: '*, client_company:companies!client_company_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)', 
  orderBy: 'created_at' 
},
'jobs-invoices': { 
  table: 'subcontractor_invoices', 
  select: '*, company:companies!company_id(name), work_order:work_orders!work_order_id(title, work_order_number), job_contract:job_contracts!job_contract_id(title, contract_number), created_by_user:profiles!created_by(first_name, last_name)', 
  orderBy: 'invoice_date' 
},
'jobs-compliance': { 
  table: 'subcontractor_compliance_docs', 
  select: '*, company:companies!company_id(name), verified_by_user:profiles!verified_by(first_name, last_name)', 
  orderBy: 'expiration_date' 
},
'checklists': { 
  table: 'checklists', 
  select: '*, template:checklist_templates!template_id(name)', 
  orderBy: 'created_at' 
},
'recruiting': { 
  table: 'hiring_applications', 
  select: '*, created_by_user:profiles!created_by(first_name, last_name)', 
  orderBy: 'created_at' 
},
```

### Companies Module
```typescript
'companies-compliance': { 
  table: 'subcontractor_compliance_docs', 
  select: '*, company:companies!company_id(name), verified_by_user:profiles!verified_by(first_name, last_name)', 
  orderBy: 'expiration_date' 
},
'companies-work-orders': { 
  table: 'work_orders', 
  select: '*, company:companies!company_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)', 
  orderBy: 'scheduled_start' 
},
'companies-invoices': { 
  table: 'subcontractor_invoices', 
  select: '*, company:companies!company_id(name), work_order:work_orders!work_order_id(work_order_number)', 
  orderBy: 'invoice_date' 
},
'companies-reviews': { 
  table: 'subcontractor_reviews', 
  select: '*, company:companies!company_id(name), work_order:work_orders!work_order_id(work_order_number), reviewed_by_user:profiles!reviewed_by(first_name, last_name)', 
  orderBy: 'created_at' 
},
'subcontractor-profile': { 
  table: 'subcontractor_profiles', 
  select: '*, company:companies!company_id(name)', 
  orderBy: 'company_id' 
},
```

---

## Deployment Steps

### 1. Apply Database Migration

```bash
cd supabase
supabase db push

# Or manually:
psql -f migrations/20251015000006_consolidate_remove_job_tables.sql
```

**This will remove old job_* tables that are now replaced by general tables.**

---

### 2. Restart Development Server

```bash
npm run dev
```

---

### 3. Verify Tabs Appear

**Projects Module:**
- Navigate to `/workspace/{workspaceId}/projects/`
- Verify 3 new tabs appear: Work Orders, Costs, Checklists

**Jobs Module:**
- Navigate to `/workspace/{workspaceId}/jobs/`
- Verify 7 new tabs appear: Work Orders, Dispatch, Estimates, Invoices, Compliance, Checklists, Recruiting

**Companies Module:**
- Navigate to `/workspace/{workspaceId}/companies/`
- Verify 5 new tabs appear: Compliance, Work Orders, Invoices, Reviews, Profile

---

### 4. Test Data Loading

For each new tab:
- ✅ Tab loads without errors
- ✅ No "Error Loading Data" message
- ✅ Empty state shows if no data
- ✅ Data displays correctly if present
- ✅ Related data (company names, user names) show correctly

---

## Table References Consolidated

### Old System (Removed)
```
job_work_orders → work_orders
job_estimates → estimates
job_invoices → subcontractor_invoices
job_compliance_documents → subcontractor_compliance_docs
job_communications → communication_threads
job_checklists → checklists
job_workflows → approval_workflows
job_recruitment_campaigns → hiring_applications
```

### New System (General Purpose)
```
work_orders - Used by: Projects, Jobs, Companies
estimates - Used by: Jobs
subcontractor_invoices - Used by: Jobs, Companies
subcontractor_compliance_docs - Used by: Jobs, Companies
subcontractor_reviews - Used by: Companies
subcontractor_profiles - Used by: Companies
communication_threads - Used by: All modules
checklists - Used by: Projects, Jobs
approval_workflows - Used by: All modules
project_costs - Used by: Projects
hiring_applications - Used by: Jobs
```

---

## Cross-Module Workflows

### Workflow 1: Project → Work Order → Invoice → Cost
1. **Projects** module: Create work order for subcontractor
2. **Work order** dispatched to company
3. **Companies** module: Subcontractor sees work order
4. Work completed, subcontractor submits invoice
5. **Jobs/Companies** module: Approve invoice
6. **Projects** module: Cost auto-aggregates in Costs tab

### Workflow 2: Job → Estimate → Contract → Work Order
1. **Jobs** module: Create estimate for client
2. Client accepts estimate
3. Convert to job contract
4. Create work orders from contract
5. **Companies** module: Subcontractors see work orders
6. Track progress across modules

### Workflow 3: Company Compliance Check
1. **Companies** module: Upload license/insurance
2. Compliance status: pending → active
3. Expiration alert 30 days before expiry
4. **Jobs** module: Work orders blocked if non-compliant
5. **Projects** module: Can't assign work to non-compliant companies

---

## Benefits of Consolidation

### ✅ Single Source of Truth
- One set of tables for all modules
- No data duplication
- Consistent data model

### ✅ Cross-Module Visibility
- Projects can see all work orders (including job-related)
- Companies see all work across projects AND jobs
- Finance auto-aggregates costs from any source

### ✅ Simplified Maintenance
- One set of APIs
- One set of UI components
- Fewer tables to maintain

### ✅ Better Reporting
- Simple queries across modules
- No need to union job_work_orders + project_work_orders
- Cross-module analytics work automatically

### ✅ Future-Proof
- New modules can reuse same tables
- Add new workflow? Just update approval_workflows
- No need to create module-specific copies

---

## Testing Checklist

### For Each New Tab

#### Navigation
- [ ] Tab appears in module sidebar
- [ ] Tab loads without errors
- [ ] Breadcrumbs display correctly
- [ ] Back button works

#### Data Display
- [ ] Data loads or shows empty state
- [ ] No "Error Loading Data" message
- [ ] Related data shows (company names, user names, etc.)
- [ ] Filters work correctly
- [ ] Search works
- [ ] Sorting works

#### Views
- [ ] List view works
- [ ] Table view works
- [ ] Board view works (for dispatch tab)
- [ ] Financial view works (for costs tab)

#### CRUD Operations
- [ ] Create button appears
- [ ] Create dialog opens
- [ ] New items can be created
- [ ] Items can be viewed
- [ ] Items can be edited
- [ ] Items can be deleted

#### Real-time
- [ ] Changes reflect immediately
- [ ] Item count updates live
- [ ] Status changes propagate

---

## Known Limitations

1. **UI Components Not Built Yet**
   - Tabs are registered and data loads
   - Custom UI components for each tab need to be built
   - Currently will use generic table/list views

2. **Filters Not Contextual**
   - Work orders show all, not filtered by context
   - Need to add context filters (e.g., filter by production_id in Projects)

3. **Permissions Not Granular**
   - All workspace members can see all data
   - Need role-based filtering in future

---

## Next Steps

### Phase 1: Custom UI Components (Priority)
1. Work order management interface
2. Compliance dashboard with expiration alerts
3. Invoice approval workflow UI
4. Estimate builder
5. Cost tracking dashboard
6. Subcontractor profile view

### Phase 2: Context Filtering
1. Add production_id filter to Projects work orders
2. Add company_id filter to Companies tabs
3. Add job_contract_id filter to Jobs tabs

### Phase 3: Advanced Features
1. Calendar integration for work orders
2. Bulk actions (approve multiple invoices)
3. Export functionality
4. Advanced search/filters
5. Custom views and saved filters

---

## Troubleshooting

### Tab not appearing
**Check:** Is it in tabs-registry.ts with correct module_id?  
**Check:** Is `enabled: true` in the tab definition?

### "Error Loading Data"
**Check:** Is table mapping in tab-page-content.tsx?  
**Check:** Does table exist in database?  
**Check:** Are RLS policies set up correctly?

### Data not loading
**Check:** Is data mapping in use-module-data.ts?  
**Check:** Are foreign key relationships correct?  
**Check:** Do you have data in the table?

### Duplicate key errors
**Use module-specific keys:** `'projects-work-orders'` not just `'work-orders'`  
**Check moduleSpecificMap:** in tab-page-content.tsx

---

## Documentation References

- [HeyPros Competitive Enhancements](./HEYPROS_COMPETITIVE_ENHANCEMENTS.md) - Database schema
- [Migration Guide](./MIGRATION_GUIDE_HEYPROS_ENHANCEMENTS.md) - Migration instructions
- [Optimization Summary](../HEYPROS_OPTIMIZATION_SUMMARY.md) - Executive summary

---

**Implementation Completed:** October 15, 2025  
**Status:** ✅ Ready for UI development  
**Total New Tabs:** 15 across 3 modules  
**Tables Removed:** 15+ old job_* tables  
**Architecture:** Single general-purpose system
