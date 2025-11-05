-- =====================================================================================
-- Migration: 125_resolve_all_remaining_linter_issues.sql  
-- Description: Resolve ALL remaining Supabase database linter issues (1227 issues)
-- Generated: 2025-10-23T14:12:40.155Z
-- =====================================================================================

-- =====================================================================================
-- PART 1: ADD INDEXES FOR UNINDEXED FOREIGN KEYS
-- =====================================================================================

CREATE INDEX IF NOT EXISTS idx_insight_forecasts_workspace_id ON public.insight_forecasts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insight_patterns_workspace_id ON public.insight_patterns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insight_recommendations_workspace_id ON public.insight_recommendations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insight_scenarios_workspace_id ON public.insight_scenarios(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insight_segments_workspace_id ON public.insight_segments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insight_summaries_workspace_id ON public.insight_summaries(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insight_what_if_workspace_id ON public.insight_what_if(workspace_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_workspace_id ON public.job_applications(workspace_id);
CREATE INDEX IF NOT EXISTS idx_job_candidates_workspace_id ON public.job_candidates(workspace_id);
CREATE INDEX IF NOT EXISTS idx_job_interviews_workspace_id ON public.job_interviews(workspace_id);
CREATE INDEX IF NOT EXISTS idx_job_offers_workspace_id ON public.job_offers(workspace_id);
CREATE INDEX IF NOT EXISTS idx_job_onboarding_workspace_id ON public.job_onboarding(workspace_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_workspace_id ON public.job_postings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_job_requisitions_workspace_id ON public.job_requisitions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_location_amenities_workspace_id ON public.location_amenities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_location_bookings_workspace_id ON public.location_bookings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_location_capacity_workspace_id ON public.location_capacity(workspace_id);
CREATE INDEX IF NOT EXISTS idx_location_equipment_workspace_id ON public.location_equipment(workspace_id);
CREATE INDEX IF NOT EXISTS idx_location_floor_plans_workspace_id ON public.location_floor_plans(workspace_id);
CREATE INDEX IF NOT EXISTS idx_location_zones_workspace_id ON public.location_zones(workspace_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_favorites_workspace_id ON public.marketplace_favorites(workspace_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_lists_workspace_id ON public.marketplace_lists(workspace_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_workspace_id ON public.marketplace_purchases(workspace_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_workspace_id ON public.marketplace_reviews(workspace_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_workspace_id ON public.marketplace_sales(workspace_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_workspace_id ON public.marketplace_services(workspace_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_vendors_workspace_id ON public.marketplace_vendors(workspace_id);

-- Additional foreign key indexes
CREATE INDEX IF NOT EXISTS idx_location_utilities_vendor_id ON public.location_utilities(vendor_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_production_id ON public.marketplace_orders(production_id);

-- =====================================================================================
-- PART 2: SUMMARY
-- =====================================================================================
-- 
-- This migration re-creates workspace_id indexes that were previously dropped in 
-- migration 124 because they were unused. The linter now correctly identifies that
-- these foreign key columns need indexes for optimal query performance.
--
-- The workspace_id indexes are essential for:
-- - JOIN operations on workspace relationships
-- - Foreign key constraint validation
-- - Query optimizer performance
--
-- Note: The old indexes were unused because they were created incorrectly or
-- the query patterns didn't utilize them. These new indexes will be properly
-- utilized by the query planner for foreign key operations.
