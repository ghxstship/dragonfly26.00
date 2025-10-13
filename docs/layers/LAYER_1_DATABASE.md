# Layer 1: Database Architecture

**Consolidated from**: DATABASE_ARCHITECTURE_PLAN.md  
**Status**: ✅ Complete - All migrations deployed  
**Last Updated**: October 13, 2025

---

## Overview

Complete PostgreSQL database architecture for a multi-tenant production management platform with 120+ tables supporting 20 modules and 174 tabs.

---

## Core Architecture

### Multi-Tenancy Model
- Organization-level isolation
- Workspace subdivisions within organizations
- User roles and permissions per organization
- Shared nothing architecture for data security

### Key Principles
1. **Universal Data Architecture**: Generic schema adaptable to any table
2. **Extensibility**: JSONB custom fields on all entity tables
3. **Audit Trail**: Comprehensive activity tracking
4. **Real-time Ready**: All tables configured for subscriptions
5. **Performance**: Strategic indexes on frequently queried columns

---

## Foundation Tables

### Organizations
```sql
organizations
├── id (uuid, pk)
├── name (text)
├── slug (text, unique)
├── plan (text) -- free, pro, business, enterprise
├── status (text)
├── stripe_customer_id (text)
├── stripe_subscription_id (text)
└── metadata (jsonb)
```

### Workspaces
```sql
workspaces
├── id (uuid, pk)
├── organization_id (uuid, fk → organizations)
├── name (text)
├── slug (text)
├── settings (jsonb)
└── metadata (jsonb)
```

### Organization Members
```sql
organization_members
├── id (uuid, pk)
├── organization_id (uuid, fk → organizations)
├── user_id (uuid, fk → auth.users)
├── role (text) -- owner, admin, member, guest
├── status (text)
└── joined_at (timestamptz)
```

---

## Module Tables (120+ tables)

### 1. Dashboard Module
- `dashboards` - User dashboard configurations
- `dashboard_widgets` - Customizable widgets

### 2. Projects Module (Productions)
- `productions` - Main project/production entities
- `project_tasks` - Task management
- `project_milestones` - Milestone tracking
- `project_compliance` - Licenses, permits, certifications
- `project_safety` - Risk assessments, safety plans

### 3. Events Module
- `events` - All event types (performances, rehearsals, meetings)
- `run_of_show` - Cue sheets and show sequences
- `bookings` - Venue and resource bookings
- `incidents` - Incident reports

### 4. People Module
- `personnel` - Staff and crew directory
- `teams` - Team management
- `personnel_assignments` - Project assignments
- `time_entries` - Time tracking
- `training_records` - Certifications and training
- `job_openings` - Recruitment
- `job_applicants` - Applicant tracking

### 5. Assets Module
- `assets` - Equipment inventory
- `asset_transactions` - Check-in/check-out tracking
- `asset_maintenance` - Maintenance records
- `production_advances` - Equipment/material requests

### 6. Locations Module
- `locations` - Venues, offices, warehouses
- `site_maps` - Floor plans and technical drawings
- `location_access` - Access control points
- `location_utilities` - Infrastructure tracking

### 7. Files Module
- `file_categories` - Document categorization
- `files` - Document management
- `file_versions` - Version control

### 8. Admin Module
- `roles` - Custom role definitions
- `api_tokens` - API access tokens
- `webhooks` - Webhook configurations
- `audit_logs` - System audit trail

### 9. Profile Module
- `user_profiles` - Extended user information
- `endorsements` - Skill endorsements
- `work_history` - Employment history

### 10. Companies Module
- `companies` - Vendors, clients, partners
- `company_contacts` - Contact management
- `contracts` - Contract tracking

### 11. Community Module
- `community_posts` - Discussion posts
- `post_reactions` - Reactions and engagement
- `connections` - User connections

### 12. Marketplace Module
- `marketplace_listings` - Product listings
- `marketplace_orders` - Order management
- `marketplace_reviews` - Product reviews

### 13. Finance Module
- `budgets` - Budget management
- `budget_line_items` - Budget breakdown
- `financial_transactions` - All transactions
- `invoices` - Invoice management
- `invoice_items` - Invoice line items
- `purchase_orders` - PO management
- `po_items` - PO line items
- `payment_methods` - Payment tracking
- `expense_reports` - Expense management
- `expense_items` - Expense details
- `payroll_records` - Payroll tracking
- `payroll_items` - Payroll details

### 14. Procurement Module
- `requisitions` - Purchase requests
- `requisition_items` - Request details
- `rfqs` - Request for quotes
- `approval_requests` - Approval workflow

### Plus: Resources, Jobs, Reports, Analytics, and Insights modules

---

## Universal Systems

### Custom Fields
```sql
custom_fields
├── id (uuid, pk)
├── workspace_id (uuid, fk)
├── module_name (text)
├── field_name (text)
├── field_type (text) -- text, number, date, select, etc.
├── options (jsonb)
└── is_required (boolean)
```

**Usage**: All entity tables include `custom_fields JSONB` column

### Views System
```sql
views
├── id (uuid, pk)
├── workspace_id (uuid, fk)
├── module_name (text)
├── view_type (text) -- list, board, table, calendar, timeline, etc.
├── name (text)
├── filters (jsonb)
├── sort_by (jsonb)
├── group_by (text)
├── config (jsonb)
└── is_shared (boolean)
```

**Supports**: 18 view types across all modules

### Activity Feed
```sql
activities
├── id (uuid, pk)
├── workspace_id (uuid, fk)
├── user_id (uuid, fk)
├── action (text) -- created, updated, deleted, commented, etc.
├── entity_type (text)
├── entity_id (uuid)
├── metadata (jsonb)
└── created_at (timestamptz)
```

### Comments System
```sql
comments
├── id (uuid, pk)
├── workspace_id (uuid, fk)
├── entity_type (text)
├── entity_id (uuid)
├── user_id (uuid, fk)
├── content (text)
├── parent_comment_id (uuid, fk) -- for threading
└── created_at (timestamptz)
```

### Notifications
```sql
notifications
├── id (uuid, pk)
├── user_id (uuid, fk)
├── type (text)
├── title (text)
├── message (text)
├── entity_type (text)
├── entity_id (uuid)
├── read (boolean)
├── action_url (text)
└── created_at (timestamptz)
```

### User Presence
```sql
user_presence
├── id (uuid, pk)
├── user_id (uuid, fk)
├── workspace_id (uuid, fk)
├── location (text) -- Current page/module
├── status (text) -- online, away, busy
├── last_seen (timestamptz)
└── metadata (jsonb)
```

---

## Indexes & Performance

### Strategic Indexes
- Foreign key indexes on all relationships
- Composite indexes for common query patterns
- GIN indexes on JSONB columns for custom fields
- Text search indexes for search functionality
- Partial indexes for status filtering

### Example Indexes
```sql
-- Fast workspace-scoped queries
CREATE INDEX idx_productions_workspace ON productions(workspace_id);

-- Status filtering
CREATE INDEX idx_productions_status ON productions(workspace_id, status);

-- Date range queries
CREATE INDEX idx_events_dates ON events(workspace_id, start_time, end_time);

-- Full-text search
CREATE INDEX idx_productions_search ON productions USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Custom fields search
CREATE INDEX idx_custom_fields ON productions USING GIN (custom_fields);
```

---

## Migrations

### Deployment Status
- **Total Migrations**: 13 files
- **Status**: ✅ All deployed to Supabase
- **Location**: `/supabase/migrations/`

### Migration Files
1. `000_foundation.sql` - Core tables
2. `001_projects_module.sql` - Productions and tasks
3. `002_events_module.sql` - Events and bookings
4. `003_people_module.sql` - Personnel and teams
5. `004_assets_module.sql` - Equipment inventory
6. `005_locations_module.sql` - Venues and facilities
7. `006_files_module.sql` - Document management
8. `007_branded_rbac_system.sql` - Role-based access control
9. `008_finance_module.sql` - Financial management
10. `009_marketplace_community.sql` - Marketplace and community
11. `010_analytics_insights.sql` - Analytics and insights
12. `011_storage_buckets.sql` - File storage configuration
13. `013_onboarding_tracking.sql` - Onboarding system

---

## Data Types & Conventions

### Naming Conventions
- Tables: `snake_case`, plural nouns
- Columns: `snake_case`
- Foreign keys: `{table}_id`
- Junction tables: `{table1}_{table2}`

### Standard Columns
All entity tables include:
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
workspace_id UUID REFERENCES workspaces(id)
created_by UUID REFERENCES auth.users(id)
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
custom_fields JSONB DEFAULT '{}'::jsonb
```

### Status Enums
Common status patterns:
- Planning → Active → Completed → Archived
- Draft → Published → Archived
- Pending → Approved → Denied
- Todo → In Progress → Done

---

## Database Functions (RPC)

### 14 Custom Functions

1. **get_budget_variance** - Calculate budget vs actual
2. **get_production_health** - Calculate project health score
3. **check_event_conflicts** - Detect scheduling conflicts
4. **global_search** - Full-text search across all modules
5. **get_user_workload** - Calculate user capacity
6. **calculate_asset_utilization** - Asset usage metrics
7. **get_payroll_summary** - Payroll calculations
8. **get_invoice_aging** - Accounts receivable aging
9. **get_dashboard_metrics** - Dashboard KPIs
10. **check_compliance_expiry** - Expiring certifications
11. **get_availability** - Resource availability
12. **calculate_overtime** - Time tracking calculations
13. **get_production_timeline** - Critical path analysis
14. **get_financial_summary** - Financial reporting

---

## Scalability Considerations

### Current Capacity
- **Tables**: 120+
- **Indexes**: 100+
- **RPC Functions**: 14
- **Storage Buckets**: 10
- **Concurrent Users**: Scales to thousands
- **Data Volume**: Handles millions of records

### Performance Optimizations
- Connection pooling via PgBouncer
- Query optimization with EXPLAIN ANALYZE
- Materialized views for complex aggregations
- Partitioning strategy for high-volume tables
- Read replicas for reporting workloads

---

## Next Steps

1. **Monitoring**: Set up query performance monitoring
2. **Optimization**: Identify and optimize slow queries
3. **Archival**: Implement data archival strategy
4. **Backups**: Configure automated backups
5. **Scaling**: Plan for horizontal scaling as needed

---

## References

- **Supabase Instance**: `https://nhceygmzwmhuyqsjxquk.supabase.co`
- **Migration Files**: `/supabase/migrations/`
- **RPC Functions**: Defined in migration files
- **Schema Docs**: Auto-generated via Supabase Dashboard

