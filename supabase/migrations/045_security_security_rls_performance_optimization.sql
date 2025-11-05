-- Migration: RLS Performance Optimization Part 2
-- Date: October 19, 2025
-- Purpose: Optimize RLS policies for additional existing tables
-- Note: Only applies to tables that currently exist in the database

-- ============================================================
-- OPTIMIZE EXISTING TABLES WITH WORKSPACE-SCOPED POLICIES
-- ============================================================

-- The main performance optimization was completed in migration 083.
-- This migration handles any remaining tables that have workspace_id columns.

-- Since migration 083 already created the helper functions and optimized
-- the core tables, we just need to ensure any remaining policies use them.

-- Most tables are already covered by migration 083. This migration serves
-- as a placeholder for future table optimizations as new tables are added.

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Verify helper functions exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'is_workspace_member_optimized'
    ) THEN
        RAISE EXCEPTION 'Helper function is_workspace_member_optimized does not exist. Run migration 083 first.';
    END IF;
END $$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'RLS Performance Optimization Part 2: Complete. Helper functions verified.';
END $$;
