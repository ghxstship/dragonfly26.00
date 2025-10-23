-- Migration 114: Drop Duplicate Policies
-- Created: 2025-10-21
-- Purpose: Remove old duplicate policies that are causing "multiple permissive policies" warnings
-- Impact: Resolves remaining 68 duplicate policy warnings

-- Drop old "manage" and "view" policies - keep only consolidated policies from migration 113
DROP POLICY IF EXISTS "Users can manage activations with permission" ON activations;
DROP POLICY IF EXISTS "Users can view activations with permission" ON activations;

DROP POLICY IF EXISTS "Users can manage approval requests in their workspaces" ON approval_requests;
DROP POLICY IF EXISTS "Users can view approval requests in their workspaces" ON approval_requests;

DROP POLICY IF EXISTS "Users can manage maintenance in their workspaces" ON asset_maintenance;
DROP POLICY IF EXISTS "Users can view maintenance in their workspaces" ON asset_maintenance;

DROP POLICY IF EXISTS "Users can manage asset transactions in their workspaces" ON asset_transactions;
DROP POLICY IF EXISTS "Users can view asset transactions in their workspaces" ON asset_transactions;

DROP POLICY IF EXISTS "Users can manage assets in their workspaces" ON assets;
DROP POLICY IF EXISTS "Users can view assets in their workspaces" ON assets;

DROP POLICY IF EXISTS "Users can manage bids in their workspace" ON bids;
DROP POLICY IF EXISTS "Users can view bids in their workspace" ON bids;

DROP POLICY IF EXISTS "Users can manage bookings in their workspaces" ON bookings;
DROP POLICY IF EXISTS "Users can view bookings in their workspaces" ON bookings;

DROP POLICY IF EXISTS "Users can manage budgets in their workspace" ON budgets;
DROP POLICY IF EXISTS "Users can view budgets in their workspace" ON budgets;

DROP POLICY IF EXISTS "Users can manage community_posts in their workspace" ON community_posts;
DROP POLICY IF EXISTS "Users can view community_posts in their workspace" ON community_posts;

DROP POLICY IF EXISTS "Admins can delete data sources in their workspace" ON data_sources;
DROP POLICY IF EXISTS "Users can delete data sources in their workspace" ON data_sources;

DROP POLICY IF EXISTS "Users can view invitations sent to their email" ON invitations;
DROP POLICY IF EXISTS "Users can view invitations they sent" ON invitations;

DROP POLICY IF EXISTS "Users can delete location_access in their workspace" ON location_access;
DROP POLICY IF EXISTS "Users can insert location_access in their workspace" ON location_access;
DROP POLICY IF EXISTS "Users can update location_access in their workspace" ON location_access;
DROP POLICY IF EXISTS "Users can view location_access in their workspace" ON location_access;

DROP POLICY IF EXISTS "Users can delete project_milestones in their workspace" ON project_milestones;
DROP POLICY IF EXISTS "Users can insert project_milestones in their workspace" ON project_milestones;
DROP POLICY IF EXISTS "Users can update project_milestones in their workspace" ON project_milestones;
DROP POLICY IF EXISTS "Users can view project_milestones in their workspace" ON project_milestones;

DROP POLICY IF EXISTS "Organization owners can create initial subscriptions" ON subscriptions;

DROP POLICY IF EXISTS "Users can be assigned roles in their organizations" ON user_role_assignments;

DROP POLICY IF EXISTS "System can assign roles during onboarding" ON user_roles;
