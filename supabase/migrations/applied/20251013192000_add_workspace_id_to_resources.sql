-- =============================================
-- Fix missing workspace_id columns
-- Migration: 020
-- =============================================
-- Adds workspace_id to courses, grants, and marketplace_products tables
-- These tables were missing workspace_id but the application code expects it

-- Add workspace_id to courses table
ALTER TABLE courses
ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

-- Add workspace_id to grants table
ALTER TABLE grants
ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

-- Add workspace_id to marketplace_products table
ALTER TABLE marketplace_products
ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

-- Create indexes for efficient querying
CREATE INDEX idx_courses_workspace ON courses(workspace_id);
CREATE INDEX idx_grants_workspace ON grants(workspace_id);
CREATE INDEX idx_marketplace_products_workspace ON marketplace_products(workspace_id);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Courses policies
CREATE POLICY "Users can view courses in their workspace"
    ON courses FOR SELECT
    USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create courses in their workspace"
    ON courses FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update courses in their workspace"
    ON courses FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete courses in their workspace"
    ON courses FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid()
        )
    );

-- Grants policies
CREATE POLICY "Users can view grants in their workspace"
    ON grants FOR SELECT
    USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create grants in their workspace"
    ON grants FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update grants in their workspace"
    ON grants FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete grants in their workspace"
    ON grants FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid()
        )
    );

-- Marketplace products policies
CREATE POLICY "Users can view products in their workspace"
    ON marketplace_products FOR SELECT
    USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create products in their workspace"
    ON marketplace_products FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update products in their workspace"
    ON marketplace_products FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete products in their workspace"
    ON marketplace_products FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid()
        )
    );

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON COLUMN courses.workspace_id IS 'Workspace that owns this course';
COMMENT ON COLUMN grants.workspace_id IS 'Workspace that owns this grant';
COMMENT ON COLUMN marketplace_products.workspace_id IS 'Workspace that owns this product';
