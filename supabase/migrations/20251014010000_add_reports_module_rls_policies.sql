-- =============================================
-- REPORTS MODULE RLS POLICIES
-- =============================================
-- Migration: 20251014010000_add_reports_module_rls_policies.sql
-- Purpose: Add missing RLS policies for Reports module tables
-- Issue: RLS was enabled but no policies were created, causing "Error Loading Data"
-- Tables: report_templates, data_sources, custom_metrics
-- =============================================

-- =============================================
-- REPORT_TEMPLATES POLICIES
-- =============================================

-- SELECT: Users can view report templates in their workspace
DROP POLICY IF EXISTS "Users can view report templates in their workspace" ON report_templates;

DROP POLICY IF EXISTS "Users can view report templates in their workspace" ON report_templates;
CREATE POLICY "Users can view report templates in their workspace"
    ON report_templates FOR SELECT
    USING (
        workspace_id IS NULL OR
        is_public = true OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- INSERT: Users can create report templates in their workspace

DROP POLICY IF EXISTS "Users can create report templates in their workspace" ON report_templates;
CREATE POLICY "Users can create report templates in their workspace"
    ON report_templates FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- UPDATE: Users can update report templates in their workspace

DROP POLICY IF EXISTS "Users can update report templates in their workspace" ON report_templates;
CREATE POLICY "Users can update report templates in their workspace"
    ON report_templates FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- DELETE: Users can delete report templates in their workspace

DROP POLICY IF EXISTS "Users can delete report templates in their workspace" ON report_templates;
CREATE POLICY "Users can delete report templates in their workspace"
    ON report_templates FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- =============================================
-- DATA_SOURCES POLICIES
-- =============================================

-- SELECT: Users can view data sources in their workspace

DROP POLICY IF EXISTS "Users can view data sources in their workspace" ON data_sources;
CREATE POLICY "Users can view data sources in their workspace"
    ON data_sources FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- INSERT: Users can create data sources in their workspace

DROP POLICY IF EXISTS "Users can create data sources in their workspace" ON data_sources;
CREATE POLICY "Users can create data sources in their workspace"
    ON data_sources FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- UPDATE: Users can update data sources in their workspace

DROP POLICY IF EXISTS "Users can update data sources in their workspace" ON data_sources;
CREATE POLICY "Users can update data sources in their workspace"
    ON data_sources FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- DELETE: Users can delete data sources in their workspace

DROP POLICY IF EXISTS "Users can delete data sources in their workspace" ON data_sources;
CREATE POLICY "Users can delete data sources in their workspace"
    ON data_sources FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- =============================================
-- CUSTOM_METRICS POLICIES
-- =============================================

-- SELECT: Users can view custom metrics in their workspace

DROP POLICY IF EXISTS "Users can view custom metrics in their workspace" ON custom_metrics;
CREATE POLICY "Users can view custom metrics in their workspace"
    ON custom_metrics FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- INSERT: Users can create custom metrics in their workspace

DROP POLICY IF EXISTS "Users can create custom metrics in their workspace" ON custom_metrics;
CREATE POLICY "Users can create custom metrics in their workspace"
    ON custom_metrics FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- UPDATE: Users can update custom metrics in their workspace

DROP POLICY IF EXISTS "Users can update custom metrics in their workspace" ON custom_metrics;
CREATE POLICY "Users can update custom metrics in their workspace"
    ON custom_metrics FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- DELETE: Users can delete custom metrics in their workspace

DROP POLICY IF EXISTS "Users can delete custom metrics in their workspace" ON custom_metrics;
CREATE POLICY "Users can delete custom metrics in their workspace"
    ON custom_metrics FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify policies were created successfully
-- Run: SELECT tablename, policyname, cmd FROM pg_policies WHERE tablename IN ('report_templates', 'data_sources', 'custom_metrics') ORDER BY tablename, cmd;
-- Expected: 12 policies total (4 per table: SELECT, INSERT, UPDATE, DELETE)
