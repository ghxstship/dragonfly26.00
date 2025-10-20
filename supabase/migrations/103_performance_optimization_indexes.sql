-- Migration 103: Performance Optimization Indexes
-- Created: 2025-01-20
-- Purpose: Add additional performance indexes for frequently queried tables

-- ============================================================================
-- PERFORMANCE INDEXES FOR COMMON QUERIES
-- ============================================================================

-- Index for workspace-based queries (most common filter)
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_status ON tasks(workspace_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_events_workspace_date ON events(workspace_id, start_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_assets_workspace_type ON assets(workspace_id, type) WHERE deleted_at IS NULL;

-- Index for user-based queries
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_status ON tasks(assigned_to, status) WHERE deleted_at IS NULL AND assigned_to IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read_at) WHERE read_at IS NULL;

-- Index for date range queries (common in reports)
CREATE INDEX IF NOT EXISTS idx_time_entries_date_range ON time_entries(start_time, end_time) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_expenses_date_range ON expenses(expense_date) WHERE deleted_at IS NULL;

-- Index for search queries (GIN indexes for full-text search)
CREATE INDEX IF NOT EXISTS idx_tasks_search ON tasks USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_assets_search ON assets USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_personnel_search ON personnel USING GIN(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(email, '')));

-- Index for hierarchy queries
CREATE INDEX IF NOT EXISTS idx_workspaces_production ON workspaces(production_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_productions_project ON productions(project_id) WHERE deleted_at IS NULL;

-- Index for financial queries
CREATE INDEX IF NOT EXISTS idx_transactions_workspace_date ON transactions(workspace_id, transaction_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_invoices_status_date ON invoices(status, due_date) WHERE deleted_at IS NULL;

-- Partial indexes for active records (most queries filter out deleted)
CREATE INDEX IF NOT EXISTS idx_active_tasks ON tasks(workspace_id, created_at DESC) WHERE deleted_at IS NULL AND status != 'completed';
CREATE INDEX IF NOT EXISTS idx_active_events ON events(workspace_id, start_date) WHERE deleted_at IS NULL AND status = 'active';

-- ============================================================================
-- STATISTICS UPDATE
-- ============================================================================

-- Update statistics for better query planning
ANALYZE tasks;
ANALYZE events;
ANALYZE assets;
ANALYZE personnel;
ANALYZE workspaces;
ANALYZE productions;
ANALYZE transactions;
ANALYZE invoices;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON INDEX idx_tasks_workspace_status IS 'Optimizes workspace task filtering by status';
COMMENT ON INDEX idx_events_workspace_date IS 'Optimizes event queries by workspace and date';
COMMENT ON INDEX idx_assets_workspace_type IS 'Optimizes asset filtering by workspace and type';
COMMENT ON INDEX idx_tasks_search IS 'Full-text search index for tasks';
COMMENT ON INDEX idx_assets_search IS 'Full-text search index for assets';
COMMENT ON INDEX idx_personnel_search IS 'Full-text search index for personnel';
