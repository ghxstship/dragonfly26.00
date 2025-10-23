-- Migration 118: Fix Function Search Path Security
-- Created: 2025-10-22
-- Purpose: Add search_path to all functions and fix materialized view security
-- Impact: Resolves 44 security warnings

-- Set search_path for all functions using their full signatures from pg_proc
DO $$
DECLARE
  func_record RECORD;
BEGIN
  FOR func_record IN
    SELECT 
      p.oid,
      n.nspname as schema_name,
      p.proname as func_name,
      pg_get_function_identity_arguments(p.oid) as func_args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname IN (
      'update_opportunities_updated_at',
      'user_has_permission',
      'assign_all_permissions_to_role',
      'get_user_permissions',
      'validate_role_assignment',
      'update_subcontractor_rating',
      'create_work_order_thread',
      'update_work_order_actual_cost',
      'update_compliance_doc_status',
      'check_checklist_completion',
      'check_approval_completion',
      'create_cost_from_work_order',
      'create_cost_from_invoice',
      'update_production_budget_spent',
      'transfer_inventory_stock',
      'update_hiring_application_counts',
      'update_folder_path',
      'update_folder_item_count',
      'update_item_status_on_stock_change',
      'create_low_stock_alert',
      'adjust_inventory_stock',
      'fix_auth_uid_in_policies',
      'has_permission',
      'generate_item_qr_code',
      'get_workspace_hierarchy',
      'get_hierarchy_workspaces',
      'get_entity_organization',
      'refresh_hierarchy_rollup',
      'get_workspace_from_production',
      'get_hierarchy_team_members',
      'get_budget_rollup',
      'audit_trigger',
      'search_inventory_by_code',
      'update_inventory_photos',
      'get_inventory_dashboard_metrics',
      'export_inventory_data',
      'get_item_movement_history',
      'bulk_create_inventory_items',
      'get_low_stock_report',
      'cleanup_inventory_photos'
    )
  LOOP
    BEGIN
      EXECUTE format(
        'ALTER FUNCTION %I.%I(%s) SET search_path = public, pg_temp',
        func_record.schema_name,
        func_record.func_name,
        func_record.func_args
      );
      RAISE NOTICE 'Set search_path for: %.%(%)', 
        func_record.schema_name, func_record.func_name, func_record.func_args;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to set search_path for %.%(%): %', 
        func_record.schema_name, func_record.func_name, func_record.func_args, SQLERRM;
    END;
  END LOOP;
END $$;

-- Fix materialized view security
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_matviews 
    WHERE schemaname = 'public' AND matviewname = 'hierarchy_rollup'
  ) THEN
    REVOKE ALL ON public.hierarchy_rollup FROM anon;
    REVOKE ALL ON public.hierarchy_rollup FROM authenticated;
    GRANT SELECT ON public.hierarchy_rollup TO authenticated;
  END IF;
END $$;
