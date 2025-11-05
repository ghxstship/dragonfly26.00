-- =============================================
-- DEMO DATA ISOLATION SYSTEM (Simplified)
-- Migration: 201
-- Date: January 2025
-- Purpose: Add demo flags and helper functions only
-- =============================================

-- Add is_demo flag to core tables (IF NOT EXISTS to be safe)
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE productions ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE activations ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Create helper function to check if current user is demo user
CREATE OR REPLACE FUNCTION is_demo_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_demo = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to get user's demo mode
CREATE OR REPLACE FUNCTION get_user_demo_mode()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(
        (SELECT is_demo FROM profiles WHERE id = auth.uid()),
        false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for demo flag queries
CREATE INDEX IF NOT EXISTS idx_organizations_is_demo ON organizations(is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_profiles_is_demo ON profiles(is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_workspaces_is_demo ON workspaces(is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_projects_is_demo ON projects(is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_productions_is_demo ON productions(is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_activations_is_demo ON activations(is_demo) WHERE is_demo = true;

-- Add comments
COMMENT ON COLUMN organizations.is_demo IS 'Flag indicating this is demo/seed data for testing and demonstrations';
COMMENT ON COLUMN profiles.is_demo IS 'Flag indicating this is a demo user account';
COMMENT ON COLUMN workspaces.is_demo IS 'Flag indicating this workspace contains demo data';
COMMENT ON FUNCTION is_demo_user() IS 'Returns true if the current authenticated user is a demo user';
COMMENT ON FUNCTION get_user_demo_mode() IS 'Returns the demo mode status of the current user';
