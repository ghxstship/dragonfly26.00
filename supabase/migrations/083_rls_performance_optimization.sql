-- Migration: RLS Performance Optimization
-- Date: October 19, 2025
-- Purpose: Fix auth_rls_initplan warnings by wrapping auth functions in subqueries
-- Issue: auth.<function>() calls are re-evaluated for each row causing performance degradation
-- Solution: Replace (SELECT (SELECT auth.uid())) with (select (SELECT (SELECT auth.uid()))) to evaluate once per query

-- ============================================================
-- PART 0: ADD STATUS COLUMNS TO MEMBERSHIP TABLES
-- ============================================================

-- Add status to workspace_members if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'workspace_members' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE workspace_members 
        ADD COLUMN status TEXT NOT NULL DEFAULT 'active' 
        CHECK (status IN ('pending', 'active', 'inactive', 'suspended'));
    END IF;
END $$;

-- Add status to organization_members if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'organization_members' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE organization_members 
        ADD COLUMN status TEXT NOT NULL DEFAULT 'active' 
        CHECK (status IN ('pending', 'active', 'inactive', 'suspended'));
    END IF;
END $$;

-- Set existing records to active
UPDATE workspace_members SET status = 'active' WHERE status IS NULL;
UPDATE organization_members SET status = 'active' WHERE status IS NULL;

-- Create indexes for status queries
CREATE INDEX IF NOT EXISTS idx_workspace_members_status_active 
ON workspace_members(workspace_id, user_id) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_organization_members_status_active 
ON organization_members(organization_id, user_id) WHERE status = 'active';

-- ============================================================
-- PART 1: DROP EXISTING POLICIES THAT NEED OPTIMIZATION
-- ============================================================

-- Organizations
DROP POLICY IF EXISTS "Owners and admins can update their organizations" ON organizations;

-- Workspaces
DROP POLICY IF EXISTS "Users can view workspaces in their organizations" ON workspaces;
DROP POLICY IF EXISTS "Admins can manage workspaces" ON workspaces;

-- Organization Members
DROP POLICY IF EXISTS "Authenticated users can join organizations" ON organization_members;

-- User Roles
DROP POLICY IF EXISTS "Users can view their own role assignments" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles in their org" ON user_roles;

-- Notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

-- Productions
DROP POLICY IF EXISTS "Users can view productions in their workspaces" ON productions;
DROP POLICY IF EXISTS "Users can create productions in their workspaces" ON productions;
DROP POLICY IF EXISTS "Users can update productions in their workspaces" ON productions;
DROP POLICY IF EXISTS "Users can delete productions in their workspaces" ON productions;

-- Project Tasks
DROP POLICY IF EXISTS "Users can view tasks in their workspaces" ON project_tasks;
DROP POLICY IF EXISTS "Users can manage tasks in their workspaces" ON project_tasks;

-- Project Milestones
DROP POLICY IF EXISTS "Users can view milestones in their workspaces" ON project_milestones;
DROP POLICY IF EXISTS "Users can manage milestones in their workspaces" ON project_milestones;

-- Project Compliance
DROP POLICY IF EXISTS "Users can view compliance in their workspaces" ON project_compliance;
DROP POLICY IF EXISTS "Users can manage compliance in their workspaces" ON project_compliance;

-- Project Safety
DROP POLICY IF EXISTS "Users can view safety in their workspaces" ON project_safety;
DROP POLICY IF EXISTS "Users can manage safety in their workspaces" ON project_safety;

-- Events
DROP POLICY IF EXISTS "Users can view events in their workspaces" ON events;
DROP POLICY IF EXISTS "Users can manage events in their workspaces" ON events;

-- Run of Show
DROP POLICY IF EXISTS "Users can view run of show in their workspaces" ON run_of_show;
DROP POLICY IF EXISTS "Users can manage run of show in their workspaces" ON run_of_show;

-- Bookings
DROP POLICY IF EXISTS "Users can view bookings in their workspaces" ON bookings;
DROP POLICY IF EXISTS "Users can manage bookings in their workspaces" ON bookings;

-- Incidents
DROP POLICY IF EXISTS "Users can view incidents in their workspaces" ON incidents;
DROP POLICY IF EXISTS "Users can manage incidents in their workspaces" ON incidents;

-- Personnel
DROP POLICY IF EXISTS "Users can view personnel in their workspaces" ON personnel;
DROP POLICY IF EXISTS "Users can manage personnel in their workspaces" ON personnel;

-- Teams
DROP POLICY IF EXISTS "Users can view teams in their workspaces" ON teams;
DROP POLICY IF EXISTS "Users can manage teams in their workspaces" ON teams;

-- Personnel Assignments
DROP POLICY IF EXISTS "Users can view assignments in their workspaces" ON personnel_assignments;
DROP POLICY IF EXISTS "Users can manage assignments in their workspaces" ON personnel_assignments;

-- Time Entries
DROP POLICY IF EXISTS "Users can view time entries in their workspaces" ON time_entries;
DROP POLICY IF EXISTS "Users can manage time entries in their workspaces" ON time_entries;

-- Training Records
DROP POLICY IF EXISTS "Users can view training in their workspaces" ON training_records;
DROP POLICY IF EXISTS "Users can manage training in their workspaces" ON training_records;

-- Job Openings
DROP POLICY IF EXISTS "Users can view job openings in their workspaces" ON job_openings;
DROP POLICY IF EXISTS "Users can manage job openings in their workspaces" ON job_openings;

-- Job Applicants
DROP POLICY IF EXISTS "Users can view applicants in their workspaces" ON job_applicants;
DROP POLICY IF EXISTS "Users can manage applicants in their workspaces" ON job_applicants;

-- Assets
DROP POLICY IF EXISTS "Users can view assets in their workspaces" ON assets;
DROP POLICY IF EXISTS "Users can manage assets in their workspaces" ON assets;

-- ============================================================
-- PART 2: CREATE OPTIMIZED HELPER FUNCTIONS
-- ============================================================

-- Function to check if user is workspace member (optimized)
CREATE OR REPLACE FUNCTION is_workspace_member_optimized(workspace_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_id = workspace_uuid
        AND user_id = (select (SELECT (SELECT auth.uid())))
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if user is organization member (optimized)
CREATE OR REPLACE FUNCTION is_org_member_optimized(org_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_id = org_uuid
        AND user_id = (select (SELECT (SELECT auth.uid())))
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if user is organization admin (optimized)
CREATE OR REPLACE FUNCTION is_org_admin_optimized(org_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_id = org_uuid
        AND user_id = (select (SELECT (SELECT auth.uid())))
        AND role IN ('owner', 'admin')
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- PART 3: RECREATE POLICIES WITH OPTIMIZED AUTH CALLS
-- ============================================================

-- Organizations
CREATE POLICY "Owners and admins can update their organizations"
ON organizations FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_id = organizations.id
        AND user_id = (select (SELECT (SELECT auth.uid())))
        AND role IN ('owner', 'admin')
        AND status = 'active'
    )
);

-- Workspaces
CREATE POLICY "Users can view workspaces in their organizations"
ON workspaces FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_id = workspaces.organization_id
        AND user_id = (select (SELECT (SELECT auth.uid())))
        AND status = 'active'
    )
);

CREATE POLICY "Admins can manage workspaces"
ON workspaces FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_id = workspaces.organization_id
        AND user_id = (select (SELECT (SELECT auth.uid())))
        AND role IN ('owner', 'admin')
        AND status = 'active'
    )
);

-- Organization Members
CREATE POLICY "Authenticated users can join organizations"
ON organization_members FOR INSERT
WITH CHECK ((select (SELECT (SELECT auth.uid()))) = user_id);

-- User Roles
CREATE POLICY "Users can view their own role assignments"
ON user_roles FOR SELECT
USING (user_id = (select (SELECT (SELECT auth.uid()))));

CREATE POLICY "Admins can manage user roles in their org"
ON user_roles FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM organization_members om
        WHERE om.organization_id = user_roles.organization_id
        AND om.user_id = (select (SELECT (SELECT auth.uid())))
        AND om.role IN ('owner', 'admin')
        AND om.status = 'active'
    )
);

-- Notifications
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (user_id = (select (SELECT (SELECT auth.uid()))));

CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (user_id = (select (SELECT (SELECT auth.uid()))));

-- Productions
CREATE POLICY "Users can view productions in their workspaces"
ON productions FOR SELECT
USING (is_workspace_member_optimized(workspace_id));

CREATE POLICY "Users can create productions in their workspaces"
ON productions FOR INSERT
WITH CHECK (is_workspace_member_optimized(workspace_id));

CREATE POLICY "Users can update productions in their workspaces"
ON productions FOR UPDATE
USING (is_workspace_member_optimized(workspace_id));

CREATE POLICY "Users can delete productions in their workspaces"
ON productions FOR DELETE
USING (is_workspace_member_optimized(workspace_id));

-- Project Tasks
CREATE POLICY "Users can view tasks in their workspaces"
ON project_tasks FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM productions p
        WHERE p.id = project_tasks.production_id
        AND is_workspace_member_optimized(p.workspace_id)
    )
);

CREATE POLICY "Users can manage tasks in their workspaces"
ON project_tasks FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM productions p
        WHERE p.id = project_tasks.production_id
        AND is_workspace_member_optimized(p.workspace_id)
    )
);

-- Project Milestones
CREATE POLICY "Users can view milestones in their workspaces"
ON project_milestones FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM productions p
        WHERE p.id = project_milestones.production_id
        AND is_workspace_member_optimized(p.workspace_id)
    )
);

CREATE POLICY "Users can manage milestones in their workspaces"
ON project_milestones FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM productions p
        WHERE p.id = project_milestones.production_id
        AND is_workspace_member_optimized(p.workspace_id)
    )
);

-- Project Compliance
CREATE POLICY "Users can view compliance in their workspaces"
ON project_compliance FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM productions p
        WHERE p.id = project_compliance.production_id
        AND is_workspace_member_optimized(p.workspace_id)
    )
);

CREATE POLICY "Users can manage compliance in their workspaces"
ON project_compliance FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM productions p
        WHERE p.id = project_compliance.production_id
        AND is_workspace_member_optimized(p.workspace_id)
    )
);

-- Project Safety
CREATE POLICY "Users can view safety in their workspaces"
ON project_safety FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM productions p
        WHERE p.id = project_safety.production_id
        AND is_workspace_member_optimized(p.workspace_id)
    )
);

CREATE POLICY "Users can manage safety in their workspaces"
ON project_safety FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM productions p
        WHERE p.id = project_safety.production_id
        AND is_workspace_member_optimized(p.workspace_id)
    )
);

-- Events
CREATE POLICY "Users can view events in their workspaces"
ON events FOR SELECT
USING (is_workspace_member_optimized(workspace_id));

CREATE POLICY "Users can manage events in their workspaces"
ON events FOR ALL
USING (is_workspace_member_optimized(workspace_id));

-- Run of Show
CREATE POLICY "Users can view run of show in their workspaces"
ON run_of_show FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM events e
        WHERE e.id = run_of_show.event_id
        AND is_workspace_member_optimized(e.workspace_id)
    )
);

CREATE POLICY "Users can manage run of show in their workspaces"
ON run_of_show FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM events e
        WHERE e.id = run_of_show.event_id
        AND is_workspace_member_optimized(e.workspace_id)
    )
);

-- Bookings
CREATE POLICY "Users can view bookings in their workspaces"
ON bookings FOR SELECT
USING (is_workspace_member_optimized(workspace_id));

CREATE POLICY "Users can manage bookings in their workspaces"
ON bookings FOR ALL
USING (is_workspace_member_optimized(workspace_id));

-- Incidents
CREATE POLICY "Users can view incidents in their workspaces"
ON incidents FOR SELECT
USING (is_workspace_member_optimized(workspace_id));

CREATE POLICY "Users can manage incidents in their workspaces"
ON incidents FOR ALL
USING (is_workspace_member_optimized(workspace_id));

-- Personnel
CREATE POLICY "Users can view personnel in their workspaces"
ON personnel FOR SELECT
USING (is_workspace_member_optimized(workspace_id));

CREATE POLICY "Users can manage personnel in their workspaces"
ON personnel FOR ALL
USING (is_workspace_member_optimized(workspace_id));

-- Teams
CREATE POLICY "Users can view teams in their workspaces"
ON teams FOR SELECT
USING (is_workspace_member_optimized(workspace_id));

CREATE POLICY "Users can manage teams in their workspaces"
ON teams FOR ALL
USING (is_workspace_member_optimized(workspace_id));

-- Personnel Assignments
CREATE POLICY "Users can view assignments in their workspaces"
ON personnel_assignments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM personnel p
        WHERE p.id = personnel_assignments.personnel_id
        AND is_workspace_member_optimized(p.workspace_id)
    )
);

CREATE POLICY "Users can manage assignments in their workspaces"
ON personnel_assignments FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM personnel p
        WHERE p.id = personnel_assignments.personnel_id
        AND is_workspace_member_optimized(p.workspace_id)
    )
);

-- Time Entries
CREATE POLICY "Users can view time entries in their workspaces"
ON time_entries FOR SELECT
USING (is_workspace_member_optimized(workspace_id));

CREATE POLICY "Users can manage time entries in their workspaces"
ON time_entries FOR ALL
USING (is_workspace_member_optimized(workspace_id));

-- Training Records
CREATE POLICY "Users can view training in their workspaces"
ON training_records FOR SELECT
USING (is_workspace_member_optimized(workspace_id));

CREATE POLICY "Users can manage training in their workspaces"
ON training_records FOR ALL
USING (is_workspace_member_optimized(workspace_id));

-- Job Openings
CREATE POLICY "Users can view job openings in their workspaces"
ON job_openings FOR SELECT
USING (is_workspace_member_optimized(workspace_id));

CREATE POLICY "Users can manage job openings in their workspaces"
ON job_openings FOR ALL
USING (is_workspace_member_optimized(workspace_id));

-- Job Applicants
CREATE POLICY "Users can view applicants in their workspaces"
ON job_applicants FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM job_openings jo
        WHERE jo.id = job_applicants.job_opening_id
        AND is_workspace_member_optimized(jo.workspace_id)
    )
);

CREATE POLICY "Users can manage applicants in their workspaces"
ON job_applicants FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM job_openings jo
        WHERE jo.id = job_applicants.job_opening_id
        AND is_workspace_member_optimized(jo.workspace_id)
    )
);

-- Assets
CREATE POLICY "Users can view assets in their workspaces"
ON assets FOR SELECT
USING (is_workspace_member_optimized(workspace_id));

CREATE POLICY "Users can manage assets in their workspaces"
ON assets FOR ALL
USING (is_workspace_member_optimized(workspace_id));

-- ============================================================
-- PART 4: DROP DUPLICATE INDEXES
-- ============================================================

-- Community Posts - keep idx_community_posts_author_id, drop idx_community_posts_author
DROP INDEX IF EXISTS idx_community_posts_author;

-- Connections - keep idx_connections_user_id, drop idx_connections_user
DROP INDEX IF EXISTS idx_connections_user;

-- Events - keep idx_events_organizer_id, drop idx_events_organizer
DROP INDEX IF EXISTS idx_events_organizer;

-- Files - keep idx_files_uploaded_by, drop idx_files_uploader
DROP INDEX IF EXISTS idx_files_uploader;

-- Marketplace Orders - keep idx_marketplace_orders_buyer_id, drop idx_marketplace_orders_buyer
DROP INDEX IF EXISTS idx_marketplace_orders_buyer;

-- Production Advances - keep idx_production_advances_requestor, drop idx_prod_adv_requestor
DROP INDEX IF EXISTS idx_prod_adv_requestor;

-- Thread Messages - keep idx_thread_messages_author_id, drop idx_thread_messages_author
DROP INDEX IF EXISTS idx_thread_messages_author;

-- ============================================================
-- VERIFICATION QUERIES (commented out - for manual testing)
-- ============================================================

-- To verify the optimization worked, run:
-- EXPLAIN ANALYZE SELECT * FROM productions WHERE workspace_id = 'some-uuid';
-- Look for "InitPlan" in the query plan - it should appear once, not per row

-- Check that policies are using the optimized functions:
-- SELECT schemaname, tablename, policyname, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- AND qual LIKE '%(SELECT (SELECT auth.uid()))%';
-- This should return 0 rows (all should use (select (SELECT (SELECT auth.uid()))) or helper functions)
