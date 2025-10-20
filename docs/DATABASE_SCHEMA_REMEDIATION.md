# Database Schema Remediation Report
**Generated:** 2025-10-20T12:45:31.490Z

## Summary

- **Total Missing Tables:** 95
- **Migration File:** 20251020124531_create_missing_tables.sql
- **Location:** /Users/julianclarkson/Documents/Dragonfly26.00/supabase/migrations/20251020124531_create_missing_tables.sql

## Tables by Module

### Admin Module (3 tables)

- `automations` - Workflow automation rules and triggers
- `custom_statuses` - Custom status definitions for workflows
- `plugins` - Third-party plugin integrations

### Analytics Module (5 tables)

- `analytics_comparisons` - Comparative analytics views
- `analytics_custom_views` - User-defined analytics views
- `analytics_metrics_library` - Reusable metric definitions
- `analytics_pivot_tables` - Pivot table configurations
- `analytics_trends` - Trend analysis data

### Community Module (1 tables)

- `competitions` - Community competitions and challenges

### Companies Module (4 tables)

- `company_compliance` - Company compliance records
- `company_invoices` - Company invoicing data
- `company_reviews` - Company reviews and ratings
- `company_work_orders` - Work orders for companies

### Dashboard Module (10 tables)

- `user_advances` - User production advances
- `user_agenda` - User personal agenda
- `user_assets` - User-assigned assets
- `user_expenses` - User expense tracking
- `user_files` - User file access
- `user_jobs` - User job assignments
- `user_orders` - User purchase orders
- `user_reports` - User-specific reports
- `user_tasks` - User task assignments
- `user_travel` - User travel bookings

### Events Module (4 tables)

- `event_calendar` - Event calendar views
- `event_run_of_show` - Event run of show schedules
- `event_shipping_receiving` - Event shipping and receiving
- `event_trainings` - Event-specific training sessions

### Files Module (6 tables)

- `document_library` - Centralized document library
- `file_folders` - File folder structure
- `file_recent` - Recently accessed files
- `file_shared` - Shared file tracking
- `file_starred` - User-starred files
- `file_trash` - Deleted files (soft delete)

### Insights Module (10 tables)

- `insight_alerts` - Automated insight alerts
- `insight_anomalies` - Anomaly detection results
- `insight_correlations` - Data correlation analysis
- `insight_forecasts` - Predictive forecasts
- `insight_patterns` - Pattern recognition results
- `insight_recommendations` - AI-generated recommendations
- `insight_scenarios` - What-if scenario modeling
- `insight_segments` - Data segmentation analysis
- `insight_summaries` - Executive summaries
- `insight_what_if` - What-if analysis data

### Jobs Module (7 tables)

- `job_applications` - Job application tracking
- `job_candidates` - Candidate profiles
- `job_interviews` - Interview scheduling and notes
- `job_offers` - Job offer management
- `job_onboarding` - New hire onboarding
- `job_postings` - Active job postings
- `job_requisitions` - Job requisition requests

### Locations Module (7 tables)

- `location_access` - Location access control
- `location_amenities` - Location amenities
- `location_bookings` - Location booking system
- `location_capacity` - Location capacity tracking
- `location_equipment` - Location-specific equipment
- `location_floor_plans` - Location floor plans
- `location_zones` - Location zone definitions

### Marketplace Module (9 tables)

- `marketplace_favorites` - User favorite items
- `marketplace_lists` - User shopping lists
- `marketplace_orders` - Marketplace orders
- `marketplace_products` - Product catalog
- `marketplace_purchases` - Purchase history
- `marketplace_reviews` - Product reviews
- `marketplace_sales` - Sales tracking
- `marketplace_services` - Service offerings
- `marketplace_vendors` - Vendor management

### People Module (8 tables)

- `people_availability` - Staff availability calendar
- `people_certifications` - Staff certifications
- `people_departments` - Department structure
- `people_directory` - Staff directory
- `people_keyboard_shortcuts` - User keyboard shortcuts
- `people_org_chart` - Organization chart data
- `people_skills` - Staff skills matrix
- `people_teams` - Team assignments

### Procurement Module (1 tables)

- `scopes_of_work` - Scope of work documents

### Projects Module (8 tables)

- `project_budgets` - Project budget tracking
- `project_calendar` - Project calendar views
- `project_gantt` - Gantt chart data
- `project_milestones` - Project milestones
- `project_resources` - Project resource allocation
- `project_risks` - Project risk register
- `project_tasks` - Project task management
- `project_timelines` - Project timeline data

### Reports Module (5 tables)

- `report_builder` - Custom report builder
- `report_dashboards` - Report dashboard layouts
- `report_exports` - Report export history
- `report_schedules` - Scheduled report runs
- `report_templates` - Report templates

### Resources Module (7 tables)

- `resource_courses` - Training courses
- `resource_glossary` - Industry glossary
- `resource_grants` - Grant opportunities
- `resource_guides` - How-to guides
- `resource_library` - Resource library
- `resource_publications` - Industry publications
- `resource_troubleshooting` - Troubleshooting guides


## Migration Features

Each table includes:

✅ **Standard Fields**
- `id` (UUID primary key)
- `workspace_id` (foreign key to workspaces)
- `name`, `description`, `status`

✅ **Flexible Data Storage**
- `data` (JSONB) - Main data storage
- `metadata` (JSONB) - Additional metadata

✅ **Audit Trail**
- `created_at`, `updated_at`
- `created_by`, `updated_by`

✅ **Soft Delete**
- `deleted_at`, `deleted_by`

✅ **Performance Indexes**
- Workspace ID index
- Status index
- Created_at index
- JSONB GIN index

✅ **Row Level Security**
- View policy (workspace members)
- Insert policy (workspace members)
- Update policy (workspace members)
- Delete policy (workspace members)

✅ **Triggers**
- Auto-update `updated_at` timestamp

## Next Steps

1. Review the generated migration file
2. Apply the migration: `npm run db:migrate`
3. Verify tables were created: `npm run db:verify`
4. Re-run the audit to confirm 100% compliance

## Status

🎯 **Database Schema Layer:** 86.2% → 100% (Target)
