-- =====================================================================================
-- Migration: 127_restore_workspace_indexes.sql
-- Description: Re-create workspace_id indexes that were incorrectly dropped in migration 126
-- 
-- EXPLANATION: Migration 126 dropped workspace_id indexes based on pg_stat_user_indexes
-- showing idx_scan = 0. However, this is misleading because:
-- 1. The database has no production traffic yet
-- 2. Foreign key indexes are ALWAYS needed for referential integrity checks
-- 3. The query planner will use these indexes when the tables have data
--
-- This migration restores all workspace_id indexes for foreign key constraints.
-- =====================================================================================

-- =====================================================================================
-- RE-CREATE WORKSPACE_ID INDEXES FOR FOREIGN KEY CONSTRAINTS
-- =====================================================================================

-- Insight tables (7)
CREATE INDEX IF NOT EXISTS idx_insight_forecasts_workspace_id ON public.insight_forecasts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insight_patterns_workspace_id ON public.insight_patterns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insight_recommendations_workspace_id ON public.insight_recommendations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insight_scenarios_workspace_id ON public.insight_scenarios(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insight_segments_workspace_id ON public.insight_segments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insight_summaries_workspace_id ON public.insight_summaries(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insight_what_if_workspace_id ON public.insight_what_if(workspace_id);

-- Job tables (7)
CREATE INDEX IF NOT EXISTS idx_job_applications_workspace_id ON public.job_applications(workspace_id);
CREATE INDEX IF NOT EXISTS idx_job_candidates_workspace_id ON public.job_candidates(workspace_id);
CREATE INDEX IF NOT EXISTS idx_job_interviews_workspace_id ON public.job_interviews(workspace_id);
CREATE INDEX IF NOT EXISTS idx_job_offers_workspace_id ON public.job_offers(workspace_id);
CREATE INDEX IF NOT EXISTS idx_job_onboarding_workspace_id ON public.job_onboarding(workspace_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_workspace_id ON public.job_postings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_job_requisitions_workspace_id ON public.job_requisitions(workspace_id);

-- Location tables (6)
CREATE INDEX IF NOT EXISTS idx_location_amenities_workspace_id ON public.location_amenities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_location_bookings_workspace_id ON public.location_bookings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_location_capacity_workspace_id ON public.location_capacity(workspace_id);
CREATE INDEX IF NOT EXISTS idx_location_equipment_workspace_id ON public.location_equipment(workspace_id);
CREATE INDEX IF NOT EXISTS idx_location_floor_plans_workspace_id ON public.location_floor_plans(workspace_id);
CREATE INDEX IF NOT EXISTS idx_location_zones_workspace_id ON public.location_zones(workspace_id);

-- Marketplace tables (6)
CREATE INDEX IF NOT EXISTS idx_marketplace_favorites_workspace_id ON public.marketplace_favorites(workspace_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_lists_workspace_id ON public.marketplace_lists(workspace_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_workspace_id ON public.marketplace_purchases(workspace_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_workspace_id ON public.marketplace_reviews(workspace_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_workspace_id ON public.marketplace_sales(workspace_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_workspace_id ON public.marketplace_services(workspace_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_vendors_workspace_id ON public.marketplace_vendors(workspace_id);

-- Additional foreign keys
CREATE INDEX IF NOT EXISTS idx_location_utilities_vendor_id ON public.location_utilities(vendor_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_production_id ON public.marketplace_orders(production_id);

-- =====================================================================================
-- SUMMARY
-- =====================================================================================
-- Total indexes restored: 29
-- 
-- These indexes are essential for:
-- - Foreign key constraint validation performance
-- - JOIN operations on workspace relationships
-- - Query optimizer when tables contain data
-- 
-- NOTE: Indexes may show idx_scan = 0 in pg_stat_user_indexes when there is no
-- production traffic, but they are still required for optimal database performance.
-- =====================================================================================
