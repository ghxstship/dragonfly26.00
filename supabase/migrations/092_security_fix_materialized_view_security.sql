-- Migration 119: Fix Materialized View Security
-- Created: 2025-10-22
-- Purpose: Properly secure hierarchy_rollup materialized view
-- Impact: Resolves materialized view API exposure warning

-- The issue is that materialized views are exposed via PostgREST by default
-- We need to completely revoke access from the API roles (anon, authenticated)
-- and only allow access through specific functions or service role

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_matviews 
    WHERE schemaname = 'public' AND matviewname = 'hierarchy_rollup'
  ) THEN
    -- Revoke ALL privileges from public API roles
    REVOKE ALL ON public.hierarchy_rollup FROM PUBLIC;
    REVOKE ALL ON public.hierarchy_rollup FROM anon;
    REVOKE ALL ON public.hierarchy_rollup FROM authenticated;
    REVOKE ALL ON public.hierarchy_rollup FROM service_role;
    
    -- Only grant to postgres (owner) and service_role for internal use
    GRANT SELECT ON public.hierarchy_rollup TO service_role;
    
    RAISE NOTICE 'Secured materialized view: hierarchy_rollup (removed from API)';
  END IF;
END $$;
