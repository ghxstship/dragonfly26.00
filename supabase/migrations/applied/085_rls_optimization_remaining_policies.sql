-- Migration: RLS Optimization - Remaining Policies
-- Date: October 19, 2025
-- Purpose: Fix remaining unoptimized policies found after migration 083

-- ============================================================
-- FIX REMAINING UNOPTIMIZED POLICIES
-- ============================================================

-- User Role Assignments
DROP POLICY IF EXISTS "User role assignments viewable by organization members" ON user_role_assignments;
CREATE POLICY "User role assignments viewable by organization members"
ON user_role_assignments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM organization_members om
        WHERE om.organization_id = user_role_assignments.organization_id
        AND om.user_id = (select (SELECT (SELECT auth.uid())))
        AND om.status = 'active'
    )
);

DROP POLICY IF EXISTS "Only admins can modify role assignments" ON user_role_assignments;
CREATE POLICY "Only admins can modify role assignments"
ON user_role_assignments FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM organization_members om
        WHERE om.organization_id = user_role_assignments.organization_id
        AND om.user_id = (select (SELECT (SELECT auth.uid())))
        AND om.role IN ('owner', 'admin')
        AND om.status = 'active'
    )
);

DROP POLICY IF EXISTS "Users can view their role assignments" ON user_role_assignments;
CREATE POLICY "Users can view their role assignments"
ON user_role_assignments FOR SELECT
USING (user_id = (select (SELECT (SELECT auth.uid()))));

-- Workspace Members
DROP POLICY IF EXISTS "Users can view workspace members in their workspaces" ON workspace_members;
CREATE POLICY "Users can view workspace members in their workspaces"
ON workspace_members FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM organization_members om
        WHERE om.organization_id = workspace_members.organization_id
        AND om.user_id = (select (SELECT (SELECT auth.uid())))
        AND om.status = 'active'
    )
);

-- Production Advances
DROP POLICY IF EXISTS "Users can view production advances in their workspaces" ON production_advances;
CREATE POLICY "Users can view production advances in their workspaces"
ON production_advances FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM productions p
        WHERE p.id = production_advances.production_id
        AND is_workspace_member_optimized(p.workspace_id)
    )
);

DROP POLICY IF EXISTS "Users can update production advances" ON production_advances;
CREATE POLICY "Users can update production advances"
ON production_advances FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM productions p
        WHERE p.id = production_advances.production_id
        AND is_workspace_member_optimized(p.workspace_id)
    )
);

DROP POLICY IF EXISTS "Users can delete their own pending advances" ON production_advances;
CREATE POLICY "Users can delete their own pending advances"
ON production_advances FOR DELETE
USING (
    requestor_id = (select (SELECT (SELECT auth.uid())))
    AND status = 'pending'
);

-- Organizations (already in 083 but may have been skipped)
DROP POLICY IF EXISTS "Owners and admins can update their organizations" ON organizations;
CREATE POLICY "Owners and admins can update their organizations"
ON organizations FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM organization_members om
        WHERE om.organization_id = organizations.id
        AND om.user_id = (select (SELECT (SELECT auth.uid())))
        AND om.role IN ('owner', 'admin')
        AND om.status = 'active'
    )
);

-- Workspaces (already in 083 but may have been skipped)
DROP POLICY IF EXISTS "Users can view workspaces in their organizations" ON workspaces;
CREATE POLICY "Users can view workspaces in their organizations"
ON workspaces FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM organization_members om
        WHERE om.organization_id = workspaces.organization_id
        AND om.user_id = (select (SELECT (SELECT auth.uid())))
        AND om.status = 'active'
    )
);

DROP POLICY IF EXISTS "Admins can manage workspaces" ON workspaces;
CREATE POLICY "Admins can manage workspaces"
ON workspaces FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM organization_members om
        WHERE om.organization_id = workspaces.organization_id
        AND om.user_id = (select (SELECT (SELECT auth.uid())))
        AND om.role IN ('owner', 'admin')
        AND om.status = 'active'
    )
);

-- ============================================================
-- VERIFICATION
-- ============================================================

DO $$
DECLARE
    unoptimized_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO unoptimized_count
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND qual LIKE '%(SELECT (SELECT auth.uid()))%'
    AND qual NOT LIKE '%(select (SELECT (SELECT auth.uid())))%';
    
    RAISE NOTICE 'Remaining unoptimized policies: %', unoptimized_count;
    
    IF unoptimized_count = 0 THEN
        RAISE NOTICE '✅ All policies optimized successfully!';
    END IF;
END $$;
