-- =============================================
-- DATA SOURCES TABLE RLS POLICIES
-- =============================================
-- Migration: 20251014030000_add_data_sources_rls_policies.sql
-- Purpose: Add missing RLS policies for data_sources table
-- Issue: Table had RLS enabled but no policies, causing "Error Loading Data"
-- Used By: Analytics module (Data Sources tab) and Reports module
-- =============================================

-- SELECT: Users can view data sources in their workspace
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'data_sources' 
        AND policyname = 'Users can view data sources in their workspace'
    ) THEN
        DROP POLICY IF EXISTS "Users can view data sources in their workspace" ON data_sources;
CREATE POLICY "Users can view data sources in their workspace"
            ON data_sources FOR SELECT
            USING (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- INSERT: Users can create data sources in their workspace
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'data_sources' 
        AND policyname = 'Users can create data sources in their workspace'
    ) THEN
        DROP POLICY IF EXISTS "Users can create data sources in their workspace" ON data_sources;
CREATE POLICY "Users can create data sources in their workspace"
            ON data_sources FOR INSERT
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- UPDATE: Users can update data sources in their workspace
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'data_sources' 
        AND policyname = 'Users can update data sources in their workspace'
    ) THEN
        DROP POLICY IF EXISTS "Users can update data sources in their workspace" ON data_sources;
CREATE POLICY "Users can update data sources in their workspace"
            ON data_sources FOR UPDATE
            USING (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- DELETE: Admins can delete data sources in their workspace
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'data_sources' 
        AND policyname = 'Admins can delete data sources in their workspace'
    ) THEN
        DROP POLICY IF EXISTS "Admins can delete data sources in their workspace" ON data_sources;
CREATE POLICY "Admins can delete data sources in their workspace"
            ON data_sources FOR DELETE
            USING (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members
                    WHERE user_id = (SELECT auth.uid())
                    AND role IN ('owner', 'admin')
                )
            );
    END IF;
END $$;

-- =============================================
-- VERIFICATION
-- =============================================
-- Run: SELECT policyname, cmd FROM pg_policies WHERE tablename = 'data_sources' ORDER BY cmd;
-- Expected: 4 policies (SELECT, INSERT, UPDATE, DELETE)
