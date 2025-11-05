-- =====================================================================================
-- Migration: 124_resolve_remaining_linter_issues.sql
-- Description: Resolve remaining Supabase database linter issues
-- - Add indexes for unindexed foreign keys (performance)
-- - Remove unused indexes (reduce write overhead)
-- =====================================================================================

-- =====================================================================================
-- PART 1: ADD INDEXES FOR UNINDEXED FOREIGN KEYS
-- =====================================================================================

-- job_contracts table
CREATE INDEX IF NOT EXISTS idx_job_contracts_client_id
  ON public.job_contracts(client_id);

CREATE INDEX IF NOT EXISTS idx_job_contracts_production_id
  ON public.job_contracts(production_id);

-- job_interviews table
CREATE INDEX IF NOT EXISTS idx_job_interviews_created_by
  ON public.job_interviews(created_by);

CREATE INDEX IF NOT EXISTS idx_job_interviews_deleted_by
  ON public.job_interviews(deleted_by);

CREATE INDEX IF NOT EXISTS idx_job_interviews_updated_by
  ON public.job_interviews(updated_by);

-- job_offers table
CREATE INDEX IF NOT EXISTS idx_job_offers_created_by
  ON public.job_offers(created_by);

CREATE INDEX IF NOT EXISTS idx_job_offers_deleted_by
  ON public.job_offers(deleted_by);

CREATE INDEX IF NOT EXISTS idx_job_offers_updated_by
  ON public.job_offers(updated_by);

-- job_onboarding table
CREATE INDEX IF NOT EXISTS idx_job_onboarding_created_by
  ON public.job_onboarding(created_by);

CREATE INDEX IF NOT EXISTS idx_job_onboarding_deleted_by
  ON public.job_onboarding(deleted_by);

CREATE INDEX IF NOT EXISTS idx_job_onboarding_updated_by
  ON public.job_onboarding(updated_by);

-- job_openings table
CREATE INDEX IF NOT EXISTS idx_job_openings_location_id
  ON public.job_openings(location_id);

CREATE INDEX IF NOT EXISTS idx_job_openings_created_by
  ON public.job_openings(created_by);

-- job_postings table
CREATE INDEX IF NOT EXISTS idx_job_postings_created_by
  ON public.job_postings(created_by);

CREATE INDEX IF NOT EXISTS idx_job_postings_deleted_by
  ON public.job_postings(deleted_by);

CREATE INDEX IF NOT EXISTS idx_job_postings_updated_by
  ON public.job_postings(updated_by);

-- job_requisitions table
CREATE INDEX IF NOT EXISTS idx_job_requisitions_created_by
  ON public.job_requisitions(created_by);

CREATE INDEX IF NOT EXISTS idx_job_requisitions_deleted_by
  ON public.job_requisitions(deleted_by);

CREATE INDEX IF NOT EXISTS idx_job_requisitions_updated_by
  ON public.job_requisitions(updated_by);

-- key_results table
CREATE INDEX IF NOT EXISTS idx_key_results_owner_id
  ON public.key_results(owner_id);

-- location_access table
CREATE INDEX IF NOT EXISTS idx_location_access_deleted_by
  ON public.location_access(deleted_by);

-- location_amenities table
CREATE INDEX IF NOT EXISTS idx_location_amenities_created_by
  ON public.location_amenities(created_by);

CREATE INDEX IF NOT EXISTS idx_location_amenities_deleted_by
  ON public.location_amenities(deleted_by);

CREATE INDEX IF NOT EXISTS idx_location_amenities_updated_by
  ON public.location_amenities(updated_by);

-- location_bim_clashes table
CREATE INDEX IF NOT EXISTS idx_location_bim_clashes_assigned_to
  ON public.location_bim_clashes(assigned_to);

CREATE INDEX IF NOT EXISTS idx_location_bim_clashes_created_by
  ON public.location_bim_clashes(created_by);

CREATE INDEX IF NOT EXISTS idx_location_bim_clashes_location_id
  ON public.location_bim_clashes(location_id);

CREATE INDEX IF NOT EXISTS idx_location_bim_clashes_model_a_id
  ON public.location_bim_clashes(model_a_id);

CREATE INDEX IF NOT EXISTS idx_location_bim_clashes_model_b_id
  ON public.location_bim_clashes(model_b_id);

CREATE INDEX IF NOT EXISTS idx_location_bim_clashes_resolved_by
  ON public.location_bim_clashes(resolved_by);

CREATE INDEX IF NOT EXISTS idx_location_bim_clashes_workspace_id
  ON public.location_bim_clashes(workspace_id);

-- location_bim_models table
CREATE INDEX IF NOT EXISTS idx_location_bim_models_file_id
  ON public.location_bim_models(file_id);

CREATE INDEX IF NOT EXISTS idx_location_bim_models_location_id
  ON public.location_bim_models(location_id);

CREATE INDEX IF NOT EXISTS idx_location_bim_models_parent_model_id
  ON public.location_bim_models(parent_model_id);

CREATE INDEX IF NOT EXISTS idx_location_bim_models_uploaded_by
  ON public.location_bim_models(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_location_bim_models_workspace_id
  ON public.location_bim_models(workspace_id);

-- location_bookings table
CREATE INDEX IF NOT EXISTS idx_location_bookings_created_by
  ON public.location_bookings(created_by);

CREATE INDEX IF NOT EXISTS idx_location_bookings_deleted_by
  ON public.location_bookings(deleted_by);

CREATE INDEX IF NOT EXISTS idx_location_bookings_updated_by
  ON public.location_bookings(updated_by);

-- location_capacity table
CREATE INDEX IF NOT EXISTS idx_location_capacity_created_by
  ON public.location_capacity(created_by);

CREATE INDEX IF NOT EXISTS idx_location_capacity_deleted_by
  ON public.location_capacity(deleted_by);

CREATE INDEX IF NOT EXISTS idx_location_capacity_updated_by
  ON public.location_capacity(updated_by);

-- location_equipment table
CREATE INDEX IF NOT EXISTS idx_location_equipment_created_by
  ON public.location_equipment(created_by);

CREATE INDEX IF NOT EXISTS idx_location_equipment_deleted_by
  ON public.location_equipment(deleted_by);

CREATE INDEX IF NOT EXISTS idx_location_equipment_updated_by
  ON public.location_equipment(updated_by);

-- location_features table
CREATE INDEX IF NOT EXISTS idx_location_features_created_by
  ON public.location_features(created_by);

CREATE INDEX IF NOT EXISTS idx_location_features_location_id
  ON public.location_features(location_id);

CREATE INDEX IF NOT EXISTS idx_location_features_parent_feature_id
  ON public.location_features(parent_feature_id);

CREATE INDEX IF NOT EXISTS idx_location_features_related_asset_id
  ON public.location_features(related_asset_id);

CREATE INDEX IF NOT EXISTS idx_location_features_workspace_id
  ON public.location_features(workspace_id);

-- location_floor_plans table
CREATE INDEX IF NOT EXISTS idx_location_floor_plans_created_by
  ON public.location_floor_plans(created_by);

CREATE INDEX IF NOT EXISTS idx_location_floor_plans_deleted_by
  ON public.location_floor_plans(deleted_by);

CREATE INDEX IF NOT EXISTS idx_location_floor_plans_updated_by
  ON public.location_floor_plans(updated_by);

-- =====================================================================================
-- PART 2: REMOVE UNUSED INDEXES
-- =====================================================================================

-- insight_forecasts unused indexes
DROP INDEX IF EXISTS public.idx_insight_forecasts_workspace_id;
DROP INDEX IF EXISTS public.idx_insight_forecasts_status;
DROP INDEX IF EXISTS public.idx_insight_forecasts_created_at;
DROP INDEX IF EXISTS public.idx_insight_forecasts_data;

-- insight_patterns unused indexes
DROP INDEX IF EXISTS public.idx_insight_patterns_workspace_id;
DROP INDEX IF EXISTS public.idx_insight_patterns_status;
DROP INDEX IF EXISTS public.idx_insight_patterns_created_at;
DROP INDEX IF EXISTS public.idx_insight_patterns_data;

-- insight_recommendations unused indexes
DROP INDEX IF EXISTS public.idx_insight_recommendations_workspace_id;
DROP INDEX IF EXISTS public.idx_insight_recommendations_status;
DROP INDEX IF EXISTS public.idx_insight_recommendations_created_at;
DROP INDEX IF EXISTS public.idx_insight_recommendations_data;

-- insight_scenarios unused indexes
DROP INDEX IF EXISTS public.idx_insight_scenarios_workspace_id;
DROP INDEX IF EXISTS public.idx_insight_scenarios_status;
DROP INDEX IF EXISTS public.idx_insight_scenarios_created_at;
DROP INDEX IF EXISTS public.idx_insight_scenarios_data;

-- insight_segments unused indexes
DROP INDEX IF EXISTS public.idx_insight_segments_workspace_id;
DROP INDEX IF EXISTS public.idx_insight_segments_status;
DROP INDEX IF EXISTS public.idx_insight_segments_created_at;
DROP INDEX IF EXISTS public.idx_insight_segments_data;

-- insight_summaries unused indexes
DROP INDEX IF EXISTS public.idx_insight_summaries_workspace_id;
DROP INDEX IF EXISTS public.idx_insight_summaries_status;
DROP INDEX IF EXISTS public.idx_insight_summaries_created_at;
DROP INDEX IF EXISTS public.idx_insight_summaries_data;

-- insight_what_if unused indexes
DROP INDEX IF EXISTS public.idx_insight_what_if_workspace_id;
DROP INDEX IF EXISTS public.idx_insight_what_if_status;
DROP INDEX IF EXISTS public.idx_insight_what_if_created_at;
DROP INDEX IF EXISTS public.idx_insight_what_if_data;

-- job_applications unused indexes
DROP INDEX IF EXISTS public.idx_job_applications_workspace_id;
DROP INDEX IF EXISTS public.idx_job_applications_status;
DROP INDEX IF EXISTS public.idx_job_applications_created_at;
DROP INDEX IF EXISTS public.idx_job_applications_data;

-- job_candidates unused indexes
DROP INDEX IF EXISTS public.idx_job_candidates_workspace_id;
DROP INDEX IF EXISTS public.idx_job_candidates_status;
DROP INDEX IF EXISTS public.idx_job_candidates_created_at;
DROP INDEX IF EXISTS public.idx_job_candidates_data;

-- job_interviews unused indexes
DROP INDEX IF EXISTS public.idx_job_interviews_workspace_id;
DROP INDEX IF EXISTS public.idx_job_interviews_status;
DROP INDEX IF EXISTS public.idx_job_interviews_created_at;
DROP INDEX IF EXISTS public.idx_job_interviews_data;

-- job_offers unused indexes
DROP INDEX IF EXISTS public.idx_job_offers_workspace_id;
DROP INDEX IF EXISTS public.idx_job_offers_status;
DROP INDEX IF EXISTS public.idx_job_offers_created_at;
DROP INDEX IF EXISTS public.idx_job_offers_data;

-- job_onboarding unused indexes
DROP INDEX IF EXISTS public.idx_job_onboarding_workspace_id;
DROP INDEX IF EXISTS public.idx_job_onboarding_status;
DROP INDEX IF EXISTS public.idx_job_onboarding_created_at;
DROP INDEX IF EXISTS public.idx_job_onboarding_data;

-- job_postings unused indexes
DROP INDEX IF EXISTS public.idx_job_postings_workspace_id;
DROP INDEX IF EXISTS public.idx_job_postings_status;
DROP INDEX IF EXISTS public.idx_job_postings_created_at;
DROP INDEX IF EXISTS public.idx_job_postings_data;

-- job_requisitions unused indexes
DROP INDEX IF EXISTS public.idx_job_requisitions_workspace_id;
DROP INDEX IF EXISTS public.idx_job_requisitions_status;
DROP INDEX IF EXISTS public.idx_job_requisitions_created_at;
DROP INDEX IF EXISTS public.idx_job_requisitions_data;

-- location_access unused indexes
DROP INDEX IF EXISTS public.idx_location_access_workspace_id;
DROP INDEX IF EXISTS public.idx_location_access_status;
DROP INDEX IF EXISTS public.idx_location_access_created_at;
DROP INDEX IF EXISTS public.idx_location_access_data;

-- location_amenities unused indexes
DROP INDEX IF EXISTS public.idx_location_amenities_workspace_id;
DROP INDEX IF EXISTS public.idx_location_amenities_status;
DROP INDEX IF EXISTS public.idx_location_amenities_created_at;
DROP INDEX IF EXISTS public.idx_location_amenities_data;

-- location_bookings unused indexes
DROP INDEX IF EXISTS public.idx_location_bookings_workspace_id;
DROP INDEX IF EXISTS public.idx_location_bookings_status;
DROP INDEX IF EXISTS public.idx_location_bookings_created_at;
DROP INDEX IF EXISTS public.idx_location_bookings_data;

-- location_capacity unused indexes
DROP INDEX IF EXISTS public.idx_location_capacity_workspace_id;
DROP INDEX IF EXISTS public.idx_location_capacity_status;
DROP INDEX IF EXISTS public.idx_location_capacity_created_at;
DROP INDEX IF EXISTS public.idx_location_capacity_data;

-- location_equipment unused indexes
DROP INDEX IF EXISTS public.idx_location_equipment_workspace_id;
DROP INDEX IF EXISTS public.idx_location_equipment_status;
DROP INDEX IF EXISTS public.idx_location_equipment_created_at;
DROP INDEX IF EXISTS public.idx_location_equipment_data;
