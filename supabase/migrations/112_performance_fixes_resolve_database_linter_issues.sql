-- =====================================================
-- Migration: 110_resolve_database_linter_issues_safe.sql
-- Description: Safely resolve Supabase database linter issues
-- - Add indexes for unindexed foreign keys (performance)
-- - Remove unused indexes (reduce write overhead)
-- - All operations wrapped in table existence checks
-- =====================================================

-- =====================================================
-- PART 1: ADD INDEXES FOR UNINDEXED FOREIGN KEYS (SAFE)
-- =====================================================

-- Function to safely create index if table exists
CREATE OR REPLACE FUNCTION create_index_if_table_exists(
  p_index_name TEXT,
  p_table_name TEXT,
  p_column_name TEXT
) RETURNS VOID AS $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = p_table_name) THEN
    EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON public.%I(%I)', p_index_name, p_table_name, p_column_name);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply all indexes safely
DO $$
BEGIN
  -- hiring tables
  PERFORM create_index_if_table_exists('idx_hiring_application_responses_reviewed_by', 'hiring_application_responses', 'reviewed_by');
  PERFORM create_index_if_table_exists('idx_hiring_application_responses_contact_id', 'hiring_application_responses', 'contact_id');
  PERFORM create_index_if_table_exists('idx_hiring_application_responses_resume_file_id', 'hiring_application_responses', 'resume_file_id');
  PERFORM create_index_if_table_exists('idx_hiring_applications_created_by', 'hiring_applications', 'created_by');
  
  -- hospitality tables
  PERFORM create_index_if_table_exists('idx_hospitality_reservations_location_id', 'hospitality_reservations', 'location_id');
  
  -- incidents table
  PERFORM create_index_if_table_exists('idx_incidents_location', 'incidents', 'location_id');
  
  -- insight tables
  PERFORM create_index_if_table_exists('idx_insight_alerts_deleted_by', 'insight_alerts', 'deleted_by');
  PERFORM create_index_if_table_exists('idx_insight_alerts_updated_by', 'insight_alerts', 'updated_by');
  PERFORM create_index_if_table_exists('idx_insight_anomalies_deleted_by', 'insight_anomalies', 'deleted_by');
  PERFORM create_index_if_table_exists('idx_insight_anomalies_updated_by', 'insight_anomalies', 'updated_by');
  PERFORM create_index_if_table_exists('idx_insight_correlations_created_by', 'insight_correlations', 'created_by');
  PERFORM create_index_if_table_exists('idx_insight_correlations_deleted_by', 'insight_correlations', 'deleted_by');
  PERFORM create_index_if_table_exists('idx_insight_correlations_updated_by', 'insight_correlations', 'updated_by');
  PERFORM create_index_if_table_exists('idx_insight_forecasts_deleted_by', 'insight_forecasts', 'deleted_by');
  PERFORM create_index_if_table_exists('idx_insight_forecasts_updated_by', 'insight_forecasts', 'updated_by');
  PERFORM create_index_if_table_exists('idx_insight_patterns_created_by', 'insight_patterns', 'created_by');
  PERFORM create_index_if_table_exists('idx_insight_patterns_deleted_by', 'insight_patterns', 'deleted_by');
  PERFORM create_index_if_table_exists('idx_insight_patterns_updated_by', 'insight_patterns', 'updated_by');
  PERFORM create_index_if_table_exists('idx_insight_recommendations_deleted_by', 'insight_recommendations', 'deleted_by');
  PERFORM create_index_if_table_exists('idx_insight_recommendations_updated_by', 'insight_recommendations', 'updated_by');
  PERFORM create_index_if_table_exists('idx_insight_scenarios_created_by', 'insight_scenarios', 'created_by');
  PERFORM create_index_if_table_exists('idx_insight_scenarios_deleted_by', 'insight_scenarios', 'deleted_by');
  PERFORM create_index_if_table_exists('idx_insight_scenarios_updated_by', 'insight_scenarios', 'updated_by');
  PERFORM create_index_if_table_exists('idx_insight_segments_created_by', 'insight_segments', 'created_by');
  PERFORM create_index_if_table_exists('idx_insight_segments_deleted_by', 'insight_segments', 'deleted_by');
  PERFORM create_index_if_table_exists('idx_insight_segments_updated_by', 'insight_segments', 'updated_by');
  PERFORM create_index_if_table_exists('idx_insight_summaries_created_by', 'insight_summaries', 'created_by');
  PERFORM create_index_if_table_exists('idx_insight_summaries_deleted_by', 'insight_summaries', 'deleted_by');
  PERFORM create_index_if_table_exists('idx_insight_summaries_updated_by', 'insight_summaries', 'updated_by');
  PERFORM create_index_if_table_exists('idx_insight_what_if_created_by', 'insight_what_if', 'created_by');
  PERFORM create_index_if_table_exists('idx_insight_what_if_deleted_by', 'insight_what_if', 'deleted_by');
  PERFORM create_index_if_table_exists('idx_insight_what_if_updated_by', 'insight_what_if', 'updated_by');
  
  -- inventory tables
  PERFORM create_index_if_table_exists('idx_inventory_alerts_acknowledged_by', 'inventory_alerts', 'acknowledged_by');
  PERFORM create_index_if_table_exists('idx_inventory_counts_completed_by', 'inventory_counts', 'completed_by');
  PERFORM create_index_if_table_exists('idx_inventory_counts_created_by', 'inventory_counts', 'created_by');
  PERFORM create_index_if_table_exists('idx_inventory_folders_created_by', 'inventory_folders', 'created_by');
  PERFORM create_index_if_table_exists('idx_inventory_items_created_by', 'inventory_items', 'created_by');
  PERFORM create_index_if_table_exists('idx_inventory_items_last_counted_by', 'inventory_items', 'last_counted_by');
  
  -- invitations table
  PERFORM create_index_if_table_exists('idx_invitations_accepted_by', 'invitations', 'accepted_by');
  PERFORM create_index_if_table_exists('idx_invitations_invited_by', 'invitations', 'invited_by');
  PERFORM create_index_if_table_exists('idx_invitations_organization_id', 'invitations', 'organization_id');
  PERFORM create_index_if_table_exists('idx_invitations_role_slug', 'invitations', 'role_slug');
  PERFORM create_index_if_table_exists('idx_invitations_workspace_id', 'invitations', 'workspace_id');
  
  -- invoice tables
  PERFORM create_index_if_table_exists('idx_invoice_line_items_project_task_id', 'invoice_line_items', 'project_task_id');
  PERFORM create_index_if_table_exists('idx_invoice_line_items_work_order_id', 'invoice_line_items', 'work_order_id');
  PERFORM create_index_if_table_exists('idx_invoices_production_id', 'invoices', 'production_id');
  
  -- job tables
  PERFORM create_index_if_table_exists('idx_job_applications_created_by', 'job_applications', 'created_by');
  PERFORM create_index_if_table_exists('idx_job_applications_deleted_by', 'job_applications', 'deleted_by');
  PERFORM create_index_if_table_exists('idx_job_applications_updated_by', 'job_applications', 'updated_by');
  PERFORM create_index_if_table_exists('idx_job_candidates_created_by', 'job_candidates', 'created_by');
  PERFORM create_index_if_table_exists('idx_job_candidates_deleted_by', 'job_candidates', 'deleted_by');
  PERFORM create_index_if_table_exists('idx_job_candidates_updated_by', 'job_candidates', 'updated_by');
END $$;

-- Drop the helper function
DROP FUNCTION IF EXISTS create_index_if_table_exists(TEXT, TEXT, TEXT);

-- =====================================================
-- PART 2: REMOVE UNUSED INDEXES (SAFE)
-- =====================================================

-- Drop unused indexes (IF EXISTS already handles safety)
DROP INDEX IF EXISTS public.idx_location_floor_plans_workspace_id;
DROP INDEX IF EXISTS public.idx_location_floor_plans_status;
DROP INDEX IF EXISTS public.idx_location_floor_plans_created_at;
DROP INDEX IF EXISTS public.idx_location_floor_plans_data;
DROP INDEX IF EXISTS public.idx_location_zones_workspace_id;
DROP INDEX IF EXISTS public.idx_location_zones_status;
DROP INDEX IF EXISTS public.idx_location_zones_created_at;
DROP INDEX IF EXISTS public.idx_location_zones_data;
DROP INDEX IF EXISTS public.idx_marketplace_favorites_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_favorites_status;
DROP INDEX IF EXISTS public.idx_marketplace_favorites_created_at;
DROP INDEX IF EXISTS public.idx_marketplace_favorites_data;
DROP INDEX IF EXISTS public.idx_marketplace_lists_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_lists_status;
DROP INDEX IF EXISTS public.idx_marketplace_lists_created_at;
DROP INDEX IF EXISTS public.idx_marketplace_lists_data;
DROP INDEX IF EXISTS public.idx_marketplace_orders_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_orders_status;
DROP INDEX IF EXISTS public.idx_marketplace_orders_created_at;
DROP INDEX IF EXISTS public.idx_marketplace_orders_data;
DROP INDEX IF EXISTS public.idx_marketplace_products_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_products_status;
DROP INDEX IF EXISTS public.idx_marketplace_products_created_at;
DROP INDEX IF EXISTS public.idx_marketplace_products_data;
DROP INDEX IF EXISTS public.idx_marketplace_purchases_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_purchases_status;
DROP INDEX IF EXISTS public.idx_marketplace_purchases_created_at;
DROP INDEX IF EXISTS public.idx_marketplace_purchases_data;
DROP INDEX IF EXISTS public.idx_marketplace_reviews_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_reviews_status;
DROP INDEX IF EXISTS public.idx_marketplace_reviews_created_at;
DROP INDEX IF EXISTS public.idx_marketplace_reviews_data;
DROP INDEX IF EXISTS public.idx_marketplace_sales_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_sales_status;
DROP INDEX IF EXISTS public.idx_marketplace_sales_created_at;
DROP INDEX IF EXISTS public.idx_marketplace_sales_data;
DROP INDEX IF EXISTS public.idx_marketplace_services_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_services_status;
DROP INDEX IF EXISTS public.idx_marketplace_services_created_at;
DROP INDEX IF EXISTS public.idx_marketplace_services_data;
DROP INDEX IF EXISTS public.idx_marketplace_vendors_workspace_id;
DROP INDEX IF EXISTS public.idx_marketplace_vendors_status;
DROP INDEX IF EXISTS public.idx_marketplace_vendors_created_at;
DROP INDEX IF EXISTS public.idx_marketplace_vendors_data;
DROP INDEX IF EXISTS public.idx_people_availability_workspace_id;
DROP INDEX IF EXISTS public.idx_people_availability_status;
DROP INDEX IF EXISTS public.idx_people_availability_created_at;
DROP INDEX IF EXISTS public.idx_people_availability_data;
DROP INDEX IF EXISTS public.idx_people_certifications_workspace_id;
DROP INDEX IF EXISTS public.idx_people_certifications_status;
DROP INDEX IF EXISTS public.idx_people_certifications_created_at;
DROP INDEX IF EXISTS public.idx_people_certifications_data;
DROP INDEX IF EXISTS public.idx_people_departments_workspace_id;
DROP INDEX IF EXISTS public.idx_people_departments_status;
DROP INDEX IF EXISTS public.idx_people_departments_created_at;
DROP INDEX IF EXISTS public.idx_people_departments_data;
DROP INDEX IF EXISTS public.idx_people_directory_workspace_id;
DROP INDEX IF EXISTS public.idx_people_directory_status;
DROP INDEX IF EXISTS public.idx_people_directory_created_at;
DROP INDEX IF EXISTS public.idx_people_directory_data;
DROP INDEX IF EXISTS public.idx_people_skills_workspace_id;
DROP INDEX IF EXISTS public.idx_people_skills_status;
DROP INDEX IF EXISTS public.idx_people_skills_created_at;
DROP INDEX IF EXISTS public.idx_people_skills_data;
DROP INDEX IF EXISTS public.idx_people_teams_workspace_id;
DROP INDEX IF EXISTS public.idx_people_teams_status;
DROP INDEX IF EXISTS public.idx_people_teams_created_at;
DROP INDEX IF EXISTS public.idx_people_teams_data;
DROP INDEX IF EXISTS public.idx_scopes_of_work_workspace_id;
DROP INDEX IF EXISTS public.idx_scopes_of_work_status;
DROP INDEX IF EXISTS public.idx_scopes_of_work_created_at;
DROP INDEX IF EXISTS public.idx_scopes_of_work_data;
DROP INDEX IF EXISTS public.idx_project_budgets_workspace_id;
DROP INDEX IF EXISTS public.idx_project_budgets_status;
DROP INDEX IF EXISTS public.idx_project_budgets_created_at;
DROP INDEX IF EXISTS public.idx_project_budgets_data;

-- =====================================================
-- VERIFICATION COMMENTS
-- =====================================================

-- This migration safely resolves Supabase database linter issues:
-- 
-- PART 1: Added indexes for unindexed foreign keys (only if tables exist)
-- - Improves JOIN performance
-- - Reduces query execution time
-- - Supports referential integrity checks
--
-- PART 2: Removed unused indexes
-- - Reduces storage overhead
-- - Improves INSERT/UPDATE/DELETE performance
-- - Eliminates maintenance burden
--
-- All operations are safe and will not fail if tables don't exist
