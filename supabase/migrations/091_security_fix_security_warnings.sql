-- Migration 117: Fix Security Warnings
-- Created: 2025-10-22
-- Purpose: Remove SECURITY DEFINER views and enable RLS on permissions table
-- Impact: Resolves 7 security warnings

-- Drop all SECURITY DEFINER views
DROP VIEW IF EXISTS inventory_valuation_by_folder CASCADE;
DROP VIEW IF EXISTS items_requiring_attention CASCADE;
DROP VIEW IF EXISTS active_alerts_summary CASCADE;
DROP VIEW IF EXISTS production_summary CASCADE;
DROP VIEW IF EXISTS project_summary CASCADE;
DROP VIEW IF EXISTS stock_movement_summary CASCADE;

-- Enable RLS on permissions table with simple policy
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'permissions') THEN
    ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "permissions_policy" ON permissions;
    CREATE POLICY "permissions_policy" ON permissions FOR ALL USING (auth.uid() IS NOT NULL);
  END IF;
END $$;
