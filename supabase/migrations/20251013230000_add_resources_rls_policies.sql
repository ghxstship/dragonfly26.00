-- =============================================
-- Add RLS Policies for Resources Table
-- Migration: 026
-- =============================================
-- The resources table has RLS enabled but was missing policies
-- This was causing "Error Loading Data" for all resources module tabs

-- Resources policies
DROP POLICY IF EXISTS "Users can view resources in their workspace" ON resources;
CREATE POLICY "Users can view resources in their workspace"
    ON resources FOR SELECT
    USING (
        workspace_id IS NULL OR
        is_public = true OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can create resources in their workspace" ON resources;
CREATE POLICY "Users can create resources in their workspace"
    ON resources FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can update resources in their workspace" ON resources;
CREATE POLICY "Users can update resources in their workspace"
    ON resources FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can delete resources in their workspace" ON resources;
CREATE POLICY "Users can delete resources in their workspace"
    ON resources FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON POLICY "Users can view resources in their workspace" ON resources IS 'Allow users to view public resources or resources in their workspace';
COMMENT ON POLICY "Users can create resources in their workspace" ON resources IS 'Allow users to create resources in their workspace';
COMMENT ON POLICY "Users can update resources in their workspace" ON resources IS 'Allow users to update resources in their workspace';
COMMENT ON POLICY "Users can delete resources in their workspace" ON resources IS 'Allow users to delete resources in their workspace';
