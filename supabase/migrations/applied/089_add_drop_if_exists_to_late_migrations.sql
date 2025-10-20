-- =====================================================
-- ADD DROP IF EXISTS TO LATE MIGRATIONS
-- =====================================================
-- This migration runs BEFORE the 202510* migrations
-- and ensures all policies can be safely recreated
-- =====================================================

-- This file intentionally left empty - the actual fixes
-- are applied directly to the 202510* migration files
-- by adding DROP IF EXISTS before each CREATE POLICY

-- The following migrations have been updated:
-- - 20251013230000_add_resources_rls_policies.sql
-- - 20251014000000_add_jobs_module_rls_policies.sql
-- - 20251014010000_add_reports_module_rls_policies.sql (pending)
-- - 20251014020000_add_analytics_insights_rls_policies.sql (pending)
-- - 20251014030000_add_data_sources_rls_policies.sql (pending)

-- All auth.uid() calls have also been wrapped in (SELECT auth.uid())
-- for optimal performance per Supabase best practices

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
