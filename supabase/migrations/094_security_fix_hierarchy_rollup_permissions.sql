-- Migration 120: Fix Materialized View Refresh Permissions
-- Created: 2025-10-23
-- Purpose: Grant necessary permissions for hierarchy_rollup refresh triggers
-- Impact: Resolves "permission denied for materialized view hierarchy_rollup" error

-- The issue: Triggers need to refresh the materialized view, but the refresh function
-- runs with the privileges of the user who triggered it (authenticated users).
-- Solution: Make the refresh function run with SECURITY DEFINER so it executes
-- with the privileges of the function owner (postgres/service_role).

-- Drop existing triggers
DROP TRIGGER IF EXISTS refresh_hierarchy_on_project_change ON projects;
DROP TRIGGER IF EXISTS refresh_hierarchy_on_production_change ON productions;
DROP TRIGGER IF EXISTS refresh_hierarchy_on_activation_change ON activations;
DROP TRIGGER IF EXISTS refresh_hierarchy_on_workspace_change ON workspaces;

-- Recreate the refresh function with SECURITY DEFINER
-- This allows it to run with elevated privileges regardless of who triggers it
CREATE OR REPLACE FUNCTION refresh_hierarchy_rollup()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY hierarchy_rollup;
    RETURN NULL;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the transaction
        RAISE WARNING 'Failed to refresh hierarchy_rollup: %', SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION refresh_hierarchy_rollup() TO authenticated;

-- Recreate triggers
CREATE TRIGGER refresh_hierarchy_on_project_change
    AFTER INSERT OR UPDATE OR DELETE ON projects
    FOR EACH STATEMENT EXECUTE FUNCTION refresh_hierarchy_rollup();

CREATE TRIGGER refresh_hierarchy_on_production_change
    AFTER INSERT OR UPDATE OR DELETE ON productions
    FOR EACH STATEMENT EXECUTE FUNCTION refresh_hierarchy_rollup();

CREATE TRIGGER refresh_hierarchy_on_activation_change
    AFTER INSERT OR UPDATE OR DELETE ON activations
    FOR EACH STATEMENT EXECUTE FUNCTION refresh_hierarchy_rollup();

CREATE TRIGGER refresh_hierarchy_on_workspace_change
    AFTER INSERT OR UPDATE OR DELETE ON workspaces
    FOR EACH STATEMENT EXECUTE FUNCTION refresh_hierarchy_rollup();

-- Grant SELECT permission to authenticated users for read access
-- (This is needed if any queries directly access the materialized view)
GRANT SELECT ON public.hierarchy_rollup TO authenticated;

-- Add comment
COMMENT ON FUNCTION refresh_hierarchy_rollup IS 'Refreshes hierarchy_rollup materialized view. Runs with SECURITY DEFINER to allow authenticated users to trigger refresh via INSERT/UPDATE/DELETE operations.';
