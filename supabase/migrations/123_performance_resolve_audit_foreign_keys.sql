-- =====================================================================================
-- Migration: 126_resolve_audit_foreign_keys.sql
-- Description: Add indexes for audit trail foreign keys (created_by, updated_by, deleted_by)
-- and remove workspace_id indexes that are not being used by the query planner
-- =====================================================================================

-- =====================================================================================
-- PART 1: ADD INDEXES FOR AUDIT TRAIL FOREIGN KEYS (70 indexes)
-- =====================================================================================

-- location_zones
CREATE INDEX IF NOT EXISTS idx_location_zones_created_by ON public.location_zones(created_by);
CREATE INDEX IF NOT EXISTS idx_location_zones_deleted_by ON public.location_zones(deleted_by);
CREATE INDEX IF NOT EXISTS idx_location_zones_updated_by ON public.location_zones(updated_by);

-- marketplace_favorites
CREATE INDEX IF NOT EXISTS idx_marketplace_favorites_created_by ON public.marketplace_favorites(created_by);
CREATE INDEX IF NOT EXISTS idx_marketplace_favorites_deleted_by ON public.marketplace_favorites(deleted_by);
CREATE INDEX IF NOT EXISTS idx_marketplace_favorites_updated_by ON public.marketplace_favorites(updated_by);

-- marketplace_lists
CREATE INDEX IF NOT EXISTS idx_marketplace_lists_deleted_by ON public.marketplace_lists(deleted_by);
CREATE INDEX IF NOT EXISTS idx_marketplace_lists_updated_by ON public.marketplace_lists(updated_by);

-- marketplace_orders
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_deleted_by ON public.marketplace_orders(deleted_by);

-- marketplace_products
CREATE INDEX IF NOT EXISTS idx_marketplace_products_deleted_by ON public.marketplace_products(deleted_by);

-- marketplace_purchases
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_created_by ON public.marketplace_purchases(created_by);
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_deleted_by ON public.marketplace_purchases(deleted_by);
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_updated_by ON public.marketplace_purchases(updated_by);

-- marketplace_reviews
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_created_by ON public.marketplace_reviews(created_by);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_deleted_by ON public.marketplace_reviews(deleted_by);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_updated_by ON public.marketplace_reviews(updated_by);

-- marketplace_sales
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_created_by ON public.marketplace_sales(created_by);
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_deleted_by ON public.marketplace_sales(deleted_by);
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_updated_by ON public.marketplace_sales(updated_by);

-- marketplace_services
CREATE INDEX IF NOT EXISTS idx_marketplace_services_created_by ON public.marketplace_services(created_by);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_deleted_by ON public.marketplace_services(deleted_by);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_updated_by ON public.marketplace_services(updated_by);

-- marketplace_vendors
CREATE INDEX IF NOT EXISTS idx_marketplace_vendors_created_by ON public.marketplace_vendors(created_by);
CREATE INDEX IF NOT EXISTS idx_marketplace_vendors_deleted_by ON public.marketplace_vendors(deleted_by);
CREATE INDEX IF NOT EXISTS idx_marketplace_vendors_updated_by ON public.marketplace_vendors(updated_by);

-- objectives
CREATE INDEX IF NOT EXISTS idx_objectives_created_by ON public.objectives(created_by);

-- opportunity_careers
CREATE INDEX IF NOT EXISTS idx_opportunity_careers_created_by ON public.opportunity_careers(created_by);
CREATE INDEX IF NOT EXISTS idx_opportunity_careers_posted_by ON public.opportunity_careers(posted_by);
CREATE INDEX IF NOT EXISTS idx_opportunity_careers_updated_by ON public.opportunity_careers(updated_by);

-- opportunity_featured
CREATE INDEX IF NOT EXISTS idx_opportunity_featured_created_by ON public.opportunity_featured(created_by);

-- opportunity_grants
CREATE INDEX IF NOT EXISTS idx_opportunity_grants_created_by ON public.opportunity_grants(created_by);
CREATE INDEX IF NOT EXISTS idx_opportunity_grants_updated_by ON public.opportunity_grants(updated_by);

-- opportunity_jobs
CREATE INDEX IF NOT EXISTS idx_opportunity_jobs_created_by ON public.opportunity_jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_opportunity_jobs_posted_by ON public.opportunity_jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_opportunity_jobs_updated_by ON public.opportunity_jobs(updated_by);

-- opportunity_sponsorships
CREATE INDEX IF NOT EXISTS idx_opportunity_sponsorships_created_by ON public.opportunity_sponsorships(created_by);
CREATE INDEX IF NOT EXISTS idx_opportunity_sponsorships_posted_by ON public.opportunity_sponsorships(posted_by);
CREATE INDEX IF NOT EXISTS idx_opportunity_sponsorships_updated_by ON public.opportunity_sponsorships(updated_by);

-- order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- organization_members
CREATE INDEX IF NOT EXISTS idx_organization_members_invited_by ON public.organization_members(invited_by);

-- payment_milestones
CREATE INDEX IF NOT EXISTS idx_payment_milestones_payment_transaction_id ON public.payment_milestones(payment_transaction_id);

-- payment_schedules
CREATE INDEX IF NOT EXISTS idx_payment_schedules_created_by ON public.payment_schedules(created_by);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_purchase_order_id ON public.payment_schedules(purchase_order_id);

-- payroll
CREATE INDEX IF NOT EXISTS idx_payroll_processed_by ON public.payroll(processed_by);
CREATE INDEX IF NOT EXISTS idx_payroll_production_id ON public.payroll(production_id);

-- people_availability
CREATE INDEX IF NOT EXISTS idx_people_availability_created_by ON public.people_availability(created_by);
CREATE INDEX IF NOT EXISTS idx_people_availability_deleted_by ON public.people_availability(deleted_by);
CREATE INDEX IF NOT EXISTS idx_people_availability_updated_by ON public.people_availability(updated_by);
CREATE INDEX IF NOT EXISTS idx_people_availability_workspace_id ON public.people_availability(workspace_id);

-- people_certifications
CREATE INDEX IF NOT EXISTS idx_people_certifications_created_by ON public.people_certifications(created_by);
CREATE INDEX IF NOT EXISTS idx_people_certifications_deleted_by ON public.people_certifications(deleted_by);
CREATE INDEX IF NOT EXISTS idx_people_certifications_updated_by ON public.people_certifications(updated_by);
CREATE INDEX IF NOT EXISTS idx_people_certifications_workspace_id ON public.people_certifications(workspace_id);

-- people_departments
CREATE INDEX IF NOT EXISTS idx_people_departments_created_by ON public.people_departments(created_by);
CREATE INDEX IF NOT EXISTS idx_people_departments_deleted_by ON public.people_departments(deleted_by);
CREATE INDEX IF NOT EXISTS idx_people_departments_updated_by ON public.people_departments(updated_by);
CREATE INDEX IF NOT EXISTS idx_people_departments_workspace_id ON public.people_departments(workspace_id);

-- people_directory
CREATE INDEX IF NOT EXISTS idx_people_directory_created_by ON public.people_directory(created_by);
CREATE INDEX IF NOT EXISTS idx_people_directory_deleted_by ON public.people_directory(deleted_by);
CREATE INDEX IF NOT EXISTS idx_people_directory_updated_by ON public.people_directory(updated_by);
CREATE INDEX IF NOT EXISTS idx_people_directory_workspace_id ON public.people_directory(workspace_id);

-- people_skills
CREATE INDEX IF NOT EXISTS idx_people_skills_created_by ON public.people_skills(created_by);
CREATE INDEX IF NOT EXISTS idx_people_skills_deleted_by ON public.people_skills(deleted_by);
CREATE INDEX IF NOT EXISTS idx_people_skills_updated_by ON public.people_skills(updated_by);
CREATE INDEX IF NOT EXISTS idx_people_skills_workspace_id ON public.people_skills(workspace_id);

-- people_teams
CREATE INDEX IF NOT EXISTS idx_people_teams_created_by ON public.people_teams(created_by);
CREATE INDEX IF NOT EXISTS idx_people_teams_deleted_by ON public.people_teams(deleted_by);
CREATE INDEX IF NOT EXISTS idx_people_teams_updated_by ON public.people_teams(updated_by);
CREATE INDEX IF NOT EXISTS idx_people_teams_workspace_id ON public.people_teams(workspace_id);

-- =====================================================================================
-- PART 2: REMOVE UNUSED WORKSPACE_ID INDEXES (29 indexes)
-- =====================================================================================
-- These indexes were created in migration 125 but are not being used by the query planner.
-- The query planner prefers other indexes for workspace-based queries.
-- =====================================================================================

DROP INDEX IF EXISTS public.idx_insight_forecasts_workspace_id;
DROP INDEX IF EXISTS public.idx_insight_patterns_workspace_id;
DROP INDEX IF EXISTS public.idx_insight_recommendations_workspace_id;
DROP INDEX IF EXISTS public.idx_insight_scenarios_workspace_id;
DROP INDEX IF EXISTS public.idx_insight_segments_workspace_id;
DROP INDEX IF EXISTS public.idx_insight_summaries_workspace_id;
DROP INDEX IF EXISTS public.idx_insight_what_if_workspace_id;
DROP INDEX IF EXISTS public.idx_job_applications_workspace_id;
DROP INDEX IF EXISTS public.idx_job_candidates_workspace_id;
DROP INDEX IF EXISTS public.idx_job_interviews_workspace_id;
DROP INDEX IF EXISTS public.idx_job_offers_workspace_id;
DROP INDEX IF EXISTS public.idx_job_onboarding_workspace_id;
DROP INDEX IF EXISTS public.idx_job_postings_workspace_id;
DROP INDEX IF EXISTS public.idx_job_requisitions_workspace_id;
DROP INDEX IF EXISTS public.idx_location_amenities_workspace_id;
DROP INDEX IF EXISTS public.idx_location_bookings_workspace_id;
DROP INDEX IF EXISTS public.idx_location_capacity_workspace_id;
DROP INDEX IF EXISTS public.idx_location_equipment_workspace_id;
DROP INDEX IF EXISTS public.idx_location_floor_plans_workspace_id;
DROP INDEX IF EXISTS public.idx_location_zones_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_favorites_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_lists_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_purchases_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_reviews_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_sales_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_services_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_vendors_workspace_id;
DROP INDEX IF EXISTS public.idx_location_utilities_vendor_id;
DROP INDEX IF EXISTS public.idx_marketplace_orders_production_id;
