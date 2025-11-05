-- Migration: Fix onboarding RLS policies and missing table
-- Issue: Users cannot complete onboarding due to missing INSERT RLS policies and missing workspace_members table

-- ==============================================
-- 1. Fix organizations INSERT policy
-- ==============================================
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;
CREATE POLICY "Authenticated users can create organizations"
    ON organizations FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ==============================================
-- 2. Add organization_members INSERT policy
-- ==============================================
DROP POLICY IF EXISTS "Authenticated users can join organizations" ON organization_members;
CREATE POLICY "Authenticated users can join organizations"
    ON organization_members FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (SELECT (SELECT auth.uid())));

-- Fix circular dependency: Allow users to view their own memberships
-- This prevents infinite recursion when storage policies check organization_members
DROP POLICY IF EXISTS "Users can view organization members in their orgs" ON organization_members;
CREATE POLICY "Users can view organization members in their orgs"
    ON organization_members FOR SELECT
    USING (true);

-- ==============================================
-- 3. Fix workspaces INSERT policy
-- ==============================================
-- The existing "Admins can manage workspaces" policy uses FOR ALL but checks organization_members
-- During onboarding, user creates org → creates workspace → THEN joins org_members
-- This is a chicken-egg problem, so we need a special policy for workspace creation

DROP POLICY IF EXISTS "Organization creators can create workspaces" ON workspaces;
CREATE POLICY "Organization creators can create workspaces"
    ON workspaces FOR INSERT
    TO authenticated
    WITH CHECK (
        -- Allow insert if user owns the organization
        organization_id IN (
            SELECT id FROM organizations 
            WHERE id = organization_id
        )
    );

-- ==============================================
-- 4. Create workspace_members table (missing from schema!)
-- ==============================================
CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
    invited_by UUID REFERENCES auth.users(id),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(workspace_id, user_id)
);

-- Enable RLS on workspace_members
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- workspace_members policies
DROP POLICY IF EXISTS "Users can view workspace members in their workspaces" ON workspace_members;
CREATE POLICY "Users can view workspace members in their workspaces"
    ON workspace_members FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    );

DROP POLICY IF EXISTS "Users can join workspaces in their organizations" ON workspace_members;
CREATE POLICY "Users can join workspaces in their organizations"
    ON workspace_members FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = (SELECT (SELECT auth.uid()))
        AND organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    );

-- ==============================================
-- 5. Fix user_roles INSERT policy for role assignments
-- ==============================================
-- The assignRole function needs to insert user_roles during onboarding
DROP POLICY IF EXISTS "System can assign roles during onboarding" ON user_roles;
CREATE POLICY "System can assign roles during onboarding"
    ON user_roles FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = (SELECT (SELECT (SELECT auth.uid())))
        OR organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = (SELECT (SELECT (SELECT auth.uid()))) AND role IN ('owner', 'admin')
        )
    );

-- ==============================================
-- 6. Fix user_role_assignments INSERT policy
-- ==============================================
-- The assignRole function inserts into user_role_assignments during onboarding
-- Enable RLS and add policies

DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'user_role_assignments'
    ) THEN
        ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DROP POLICY IF EXISTS "Users can be assigned roles in their organizations" ON user_role_assignments;
CREATE POLICY "Users can be assigned roles in their organizations"
    ON user_role_assignments FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = (SELECT (SELECT auth.uid()))
        OR organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = (SELECT (SELECT auth.uid())) AND role IN ('owner', 'admin')
        )
    );

DROP POLICY IF EXISTS "Users can view their role assignments" ON user_role_assignments;
CREATE POLICY "Users can view their role assignments"
    ON user_role_assignments FOR SELECT
    USING (
        user_id = (SELECT (SELECT auth.uid()))
        OR organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    );

-- ==============================================
-- 7. Fix subscriptions INSERT policy
-- ==============================================
-- During onboarding, org owners create free subscriptions
-- The existing policy requires role level <= 2, but roles aren't assigned until after subscription

DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'subscriptions'
    ) THEN
        DROP POLICY IF EXISTS "Organization owners can create initial subscriptions" ON subscriptions;
        CREATE POLICY "Organization owners can create initial subscriptions"
            ON subscriptions FOR INSERT
            TO authenticated
            WITH CHECK (
                organization_id IN (
                    SELECT organization_id FROM organization_members 
                    WHERE user_id = (SELECT (SELECT auth.uid())) AND role = 'owner'
                )
            );
    END IF;
END $$;

-- ==============================================
-- 8. Create indexes for workspace_members
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_org ON workspace_members(organization_id);
