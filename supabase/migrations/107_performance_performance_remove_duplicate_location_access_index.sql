-- Migration: Remove Duplicate Index on location_access
-- Issue: Table location_access has duplicate indexes on location_id column
-- Resolution: Drop idx_location_access_location_id (from migration 121)
--            Keep idx_location_access_location (from migration 005)
-- Created: 2025-10-23

-- Drop the duplicate index
DROP INDEX IF EXISTS idx_location_access_location_id;

-- Verify the original index still exists
-- idx_location_access_location (from migration 005) remains active
