-- Migration: Cleanup Unused Indexes
-- Description: Removes unused indexes identified by Supabase Performance Advisor
-- This reduces index maintenance overhead and improves write performance
-- Date: 2025-10-19

-- ============================================================================
-- ANALYSIS NOTES
-- ============================================================================
-- The following indexes have never been used according to pg_stat_user_indexes
-- Removing them will:
-- 1. Reduce storage overhead
-- 2. Improve INSERT/UPDATE/DELETE performance
-- 3. Reduce index maintenance cost
-- 4. Free up resources for actively used indexes
--
-- IMPORTANT: This migration should be reviewed carefully in production
-- Consider monitoring query patterns for 30 days before dropping indexes
-- ============================================================================

-- ============================================================================
-- SUBSCRIPTIONS MODULE - UNUSED INDEXES
-- ============================================================================

-- These indexes were created but never used by queries
DROP INDEX IF EXISTS public.idx_subscriptions_status;
DROP INDEX IF EXISTS public.idx_subscriptions_period_end;

-- ============================================================================
-- SUBSCRIPTION USAGE MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_usage_subscription;
DROP INDEX IF EXISTS public.idx_usage_metric;
DROP INDEX IF EXISTS public.idx_usage_period;

-- ============================================================================
-- INVITATIONS MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_invitations_email;
DROP INDEX IF EXISTS public.idx_invitations_token;
DROP INDEX IF EXISTS public.idx_invitations_status;
DROP INDEX IF EXISTS public.idx_invitations_workspace;
DROP INDEX IF EXISTS public.idx_invitations_expires;

-- ============================================================================
-- PROFILES MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_profiles_stripe_customer;

-- ============================================================================
-- ASSETS MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_assets_subcategory;
DROP INDEX IF EXISTS public.idx_assets_industry_tags;

-- ============================================================================
-- WORK ORDERS MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_work_orders_created_by;

-- ============================================================================
-- PROJECT COSTS MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_project_costs_created_by;

-- ============================================================================
-- SUBCONTRACTOR MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_subcontractor_reviews_reviewed_by;
DROP INDEX IF EXISTS public.idx_subcontractor_invoices_created_by;

-- ============================================================================
-- ESTIMATES MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_estimates_created_by;

-- ============================================================================
-- COMMUNICATION MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_communication_threads_created_by;
DROP INDEX IF EXISTS public.idx_thread_messages_author_id;

-- ============================================================================
-- RBAC MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_role_permissions_role;
DROP INDEX IF EXISTS public.idx_role_permissions_permission;
DROP INDEX IF EXISTS public.idx_user_roles_workspace;
DROP INDEX IF EXISTS public.idx_user_roles_active;
DROP INDEX IF EXISTS public.idx_user_roles_expiry;

-- ============================================================================
-- PRODUCTION ADVANCES MODULE - UNUSED INDEXES
-- ============================================================================

-- These are overly specific indexes that are never used
DROP INDEX IF EXISTS public.idx_prod_adv_production;
DROP INDEX IF EXISTS public.idx_prod_adv_company;
DROP INDEX IF EXISTS public.idx_prod_adv_status;
DROP INDEX IF EXISTS public.idx_prod_adv_category;
DROP INDEX IF EXISTS public.idx_prod_adv_requestor;
DROP INDEX IF EXISTS public.idx_prod_adv_approver;
DROP INDEX IF EXISTS public.idx_prod_adv_dates;
DROP INDEX IF EXISTS public.idx_prod_adv_asset;
DROP INDEX IF EXISTS public.idx_prod_adv_location;
DROP INDEX IF EXISTS public.idx_prod_adv_assigned_users;
DROP INDEX IF EXISTS public.idx_prod_adv_tags;
DROP INDEX IF EXISTS public.idx_prod_adv_search;
DROP INDEX IF EXISTS public.idx_production_advances_requestor;
DROP INDEX IF EXISTS public.idx_production_advances_created_by;

-- ============================================================================
-- DASHBOARD WIDGETS MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_user_dashboard_widgets_workspace;
DROP INDEX IF EXISTS public.idx_user_dashboard_widgets_user;
DROP INDEX IF EXISTS public.idx_user_dashboard_widgets_enabled;

-- ============================================================================
-- LOCATION BIM MODULE - UNUSED INDEXES
-- ============================================================================

-- BIM Models
DROP INDEX IF EXISTS public.idx_location_bim_models_location;
DROP INDEX IF EXISTS public.idx_location_bim_models_workspace;
DROP INDEX IF EXISTS public.idx_location_bim_models_status;
DROP INDEX IF EXISTS public.idx_location_bim_models_type;
DROP INDEX IF EXISTS public.idx_location_bim_models_latest;
DROP INDEX IF EXISTS public.idx_location_bim_models_search;

-- BIM Clashes
DROP INDEX IF EXISTS public.idx_location_bim_clashes_location;
DROP INDEX IF EXISTS public.idx_location_bim_clashes_workspace;
DROP INDEX IF EXISTS public.idx_location_bim_clashes_status;
DROP INDEX IF EXISTS public.idx_location_bim_clashes_severity;
DROP INDEX IF EXISTS public.idx_location_bim_clashes_assigned;
DROP INDEX IF EXISTS public.idx_location_bim_clashes_model_a;
DROP INDEX IF EXISTS public.idx_location_bim_clashes_model_b;
DROP INDEX IF EXISTS public.idx_location_bim_clashes_due_date;
DROP INDEX IF EXISTS public.idx_location_bim_clashes_search;

-- ============================================================================
-- LOCATION FEATURES MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_location_features_location;
DROP INDEX IF EXISTS public.idx_location_features_workspace;
DROP INDEX IF EXISTS public.idx_location_features_type;
DROP INDEX IF EXISTS public.idx_location_features_category;
DROP INDEX IF EXISTS public.idx_location_features_status;
DROP INDEX IF EXISTS public.idx_location_features_visible;
DROP INDEX IF EXISTS public.idx_location_features_parent;
DROP INDEX IF EXISTS public.idx_location_features_search;

-- ============================================================================
-- FILE FOLDERS MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_file_folders_workspace;
DROP INDEX IF EXISTS public.idx_file_folders_parent;
DROP INDEX IF EXISTS public.idx_file_folders_status;
DROP INDEX IF EXISTS public.idx_file_folders_production;
DROP INDEX IF EXISTS public.idx_file_folders_event;
DROP INDEX IF EXISTS public.idx_file_folders_location;
DROP INDEX IF EXISTS public.idx_file_folders_company;
DROP INDEX IF EXISTS public.idx_file_folders_path;
DROP INDEX IF EXISTS public.idx_file_folders_search;

-- ============================================================================
-- FILES MODULE - UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_files_folder;

-- ============================================================================
-- PERFORMANCE OPTIMIZATION NOTES
-- ============================================================================

-- After dropping these unused indexes:
-- 1. Monitor query performance for any regressions
-- 2. Check slow query logs for missing index warnings
-- 3. Re-create specific indexes if usage patterns change
-- 4. Run VACUUM ANALYZE to update statistics

-- To monitor index usage in the future, use:
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan ASC;

-- To find duplicate indexes:
-- SELECT pg_size_pretty(SUM(pg_relation_size(idx))::BIGINT) AS size,
--        (array_agg(idx))[1] AS idx1, (array_agg(idx))[2] AS idx2,
--        (array_agg(idx))[3] AS idx3, (array_agg(idx))[4] AS idx4
-- FROM (
--     SELECT indexrelid::regclass AS idx, (indrelid::text ||E'\n'|| indclass::text ||E'\n'|| indkey::text ||E'\n'||
--                                          COALESCE(indexprs::text,'')||E'\n' || COALESCE(indpred::text,'')) AS KEY
--     FROM pg_index) sub
-- GROUP BY KEY HAVING COUNT(*)>1
-- ORDER BY SUM(pg_relation_size(idx)) DESC;

COMMENT ON SCHEMA public IS 'Unused indexes removed on 2025-10-19 - Monitor for 30 days before considering permanent';
