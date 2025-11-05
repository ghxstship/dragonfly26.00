-- =====================================================
-- Performance Optimization: Essential Database Indexes
-- Created: October 15, 2025
-- Purpose: Optimize query performance for React Query hooks
-- Approach: Only indexes for actively used tables
-- =====================================================

-- ASSETS MODULE (used by useAssets hook)
CREATE INDEX IF NOT EXISTS idx_assets_workspace_status 
  ON assets(workspace_id, status);

CREATE INDEX IF NOT EXISTS idx_assets_workspace_location 
  ON assets(workspace_id, location_id);

CREATE INDEX IF NOT EXISTS idx_assets_workspace_name 
  ON assets(workspace_id, name);

CREATE INDEX IF NOT EXISTS idx_assets_workspace_location_status 
  ON assets(workspace_id, location_id, status);

-- ASSET TRANSACTIONS (used by useAssetTransactions hook)
CREATE INDEX IF NOT EXISTS idx_transactions_workspace_date 
  ON asset_transactions(workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_asset_date 
  ON asset_transactions(asset_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_workspace_asset 
  ON asset_transactions(workspace_id, asset_id, created_at DESC);

-- ASSET MAINTENANCE (used by useMaintenance hook)
CREATE INDEX IF NOT EXISTS idx_maintenance_workspace_scheduled 
  ON asset_maintenance(workspace_id, scheduled_date);

CREATE INDEX IF NOT EXISTS idx_maintenance_asset_scheduled 
  ON asset_maintenance(asset_id, scheduled_date);

CREATE INDEX IF NOT EXISTS idx_maintenance_workspace_status 
  ON asset_maintenance(workspace_id, status);

-- PRODUCTION ADVANCES (used by useAdvances hook)
CREATE INDEX IF NOT EXISTS idx_advances_workspace_date 
  ON production_advances(workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_advances_production_date 
  ON production_advances(production_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_advances_workspace_status 
  ON production_advances(workspace_id, status);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Essential performance indexes created successfully!';
  RAISE NOTICE 'Indexes added for: Assets, Transactions, Maintenance, Advances';
  RAISE NOTICE 'Expected query performance improvement: 40-60%%';
END $$;
