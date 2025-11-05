-- Migration 120: Fix Permissions RLS Performance
-- Created: 2025-10-22
-- Purpose: Optimize permissions table RLS policy to prevent per-row auth.uid() evaluation
-- Impact: Resolves auth_rls_initplan warning for permissions table

-- Drop the existing policy that causes per-row evaluation
DROP POLICY IF EXISTS "permissions_policy" ON permissions;

-- Recreate with optimized (SELECT auth.uid()) syntax
-- This ensures auth.uid() is evaluated once per query, not per row
CREATE POLICY "permissions_policy" ON permissions
  FOR ALL
  USING ((SELECT auth.uid()) IS NOT NULL);
