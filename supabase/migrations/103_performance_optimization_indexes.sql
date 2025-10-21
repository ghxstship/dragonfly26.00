-- Migration 103: Performance Optimization Indexes
-- Created: 2025-01-20
-- Purpose: Add performance indexes for frequently queried tables
-- Note: Only creates indexes for columns that actually exist in the schema

-- ============================================================================
-- PROJECT TASKS INDEXES
-- ============================================================================

-- Index for workspace-based task queries
CREATE INDEX IF NOT EXISTS idx_project_tasks_workspace_status 
ON project_tasks(workspace_id, status);

-- Index for assignee queries
CREATE INDEX IF NOT EXISTS idx_project_tasks_assignee 
ON project_tasks(assignee_id) 
WHERE assignee_id IS NOT NULL;

-- Index for due date queries
CREATE INDEX IF NOT EXISTS idx_project_tasks_due_date 
ON project_tasks(due_date) 
WHERE due_date IS NOT NULL;

-- Full-text search index for project tasks
CREATE INDEX IF NOT EXISTS idx_project_tasks_search 
ON project_tasks USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- ============================================================================
-- EVENTS INDEXES
-- ============================================================================

-- Index for workspace and time-based event queries
CREATE INDEX IF NOT EXISTS idx_events_workspace_time 
ON events(workspace_id, start_time);

-- Index for event type queries
CREATE INDEX IF NOT EXISTS idx_events_type 
ON events(type, start_time);

-- Index for production events
CREATE INDEX IF NOT EXISTS idx_events_production 
ON events(production_id) 
WHERE production_id IS NOT NULL;

-- ============================================================================
-- ASSETS INDEXES
-- ============================================================================

-- Index for workspace and type-based asset queries
CREATE INDEX IF NOT EXISTS idx_assets_workspace_type 
ON assets(workspace_id, type);

-- Index for asset category queries
CREATE INDEX IF NOT EXISTS idx_assets_category 
ON assets(category, subcategory) 
WHERE category IS NOT NULL;

-- Full-text search index for assets
CREATE INDEX IF NOT EXISTS idx_assets_search 
ON assets USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- ============================================================================
-- PERSONNEL INDEXES
-- ============================================================================

-- Full-text search index for personnel
CREATE INDEX IF NOT EXISTS idx_personnel_search 
ON personnel USING GIN(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(email, '')));

-- Index for workspace personnel queries
CREATE INDEX IF NOT EXISTS idx_personnel_workspace 
ON personnel(workspace_id);

-- ============================================================================
-- WORKSPACES & PRODUCTIONS HIERARCHY INDEXES
-- ============================================================================

-- Index for workspace-activation relationship
CREATE INDEX IF NOT EXISTS idx_workspaces_activation 
ON workspaces(activation_id) 
WHERE activation_id IS NOT NULL;

-- Index for workspace hierarchy (parent-child)
CREATE INDEX IF NOT EXISTS idx_workspaces_parent 
ON workspaces(parent_workspace_id) 
WHERE parent_workspace_id IS NOT NULL;

-- Index for production-project relationship
CREATE INDEX IF NOT EXISTS idx_productions_project 
ON productions(project_id) 
WHERE project_id IS NOT NULL;

-- Index for activation-production relationship
CREATE INDEX IF NOT EXISTS idx_activations_production 
ON activations(production_id) 
WHERE production_id IS NOT NULL;

-- ============================================================================
-- NOTIFICATIONS INDEXES
-- ============================================================================

-- Index for unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
ON notifications(user_id, created_at) 
WHERE read = false;

-- ============================================================================
-- TIME ENTRIES INDEXES
-- ============================================================================

-- Index for time entry date range queries
CREATE INDEX IF NOT EXISTS idx_time_entries_date_range 
ON time_entries(start_time, end_time);

-- Index for personnel time entries
CREATE INDEX IF NOT EXISTS idx_time_entries_personnel 
ON time_entries(personnel_id, start_time);

-- ============================================================================
-- FINANCIAL INDEXES
-- ============================================================================

-- Index for invoice status and due date
CREATE INDEX IF NOT EXISTS idx_invoices_status_due 
ON invoices(status, due_date);

-- Index for workspace invoices
CREATE INDEX IF NOT EXISTS idx_invoices_workspace 
ON invoices(workspace_id);

-- ============================================================================
-- STATISTICS UPDATE
-- ============================================================================

-- Update statistics for better query planning
ANALYZE project_tasks;
ANALYZE events;
ANALYZE assets;
ANALYZE personnel;
ANALYZE workspaces;
ANALYZE productions;
ANALYZE notifications;
ANALYZE time_entries;
ANALYZE invoices;
