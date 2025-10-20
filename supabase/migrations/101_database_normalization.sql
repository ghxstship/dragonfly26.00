-- =============================================
-- DATABASE NORMALIZATION & OPTIMIZATION
-- Migration: 101
-- Date: January 20, 2025
-- Purpose: Normalize all relationships, eliminate redundancies, standardize patterns
-- =============================================

-- =============================================
-- PART 1: STANDARDIZED ENUMS
-- =============================================

-- Unified status enum
CREATE TYPE entity_status AS ENUM (
    'draft',
    'planning',
    'active',
    'in_progress',
    'review',
    'completed',
    'on_hold',
    'cancelled',
    'archived'
);

-- Unified priority enum
CREATE TYPE priority_level AS ENUM (
    'low',
    'normal',
    'high',
    'urgent',
    'critical'
);

-- =============================================
-- PART 2: REMOVE REDUNDANT WORKSPACE_ID
-- =============================================

-- These tables have production_id, so workspace_id is redundant (derived via hierarchy)
-- We'll keep workspace_id for now but mark as deprecated, remove in future migration

-- Add computed workspace_id function
CREATE OR REPLACE FUNCTION get_workspace_from_production(production_uuid UUID)
RETURNS UUID AS $$
DECLARE
    workspace_uuid UUID;
BEGIN
    SELECT w.id INTO workspace_uuid
    FROM productions pr
    JOIN activations a ON a.production_id = pr.id
    JOIN workspaces w ON w.activation_id = a.id
    WHERE pr.id = production_uuid
    LIMIT 1;
    
    RETURN workspace_uuid;
END;
$$ LANGUAGE plpgsql STABLE;

-- Mark redundant columns (will remove in phase 2)
COMMENT ON COLUMN project_tasks.workspace_id IS 'DEPRECATED: Use production_id, workspace derived via hierarchy';
COMMENT ON COLUMN project_milestones.workspace_id IS 'DEPRECATED: Use production_id, workspace derived via hierarchy';
COMMENT ON COLUMN project_compliance.workspace_id IS 'DEPRECATED: Use production_id, workspace derived via hierarchy';
COMMENT ON COLUMN project_safety.workspace_id IS 'DEPRECATED: Use production_id, workspace derived via hierarchy';

-- =============================================
-- PART 3: STANDARDIZE USER REFERENCES
-- =============================================

-- Standardize naming convention across all tables
-- Pattern: {role}_id for specific roles, user_id for generic user reference

-- Already standardized tables (no changes needed):
-- - activities.user_id ✓
-- - comments.user_id ✓
-- - productions.project_manager_id ✓
-- - productions.created_by ✓

-- Add missing user references
ALTER TABLE projects ADD COLUMN updated_by UUID REFERENCES auth.users(id);
ALTER TABLE productions ADD COLUMN updated_by UUID REFERENCES auth.users(id);
ALTER TABLE activations ADD COLUMN updated_by UUID REFERENCES auth.users(id);
ALTER TABLE workspaces ADD COLUMN updated_by UUID REFERENCES auth.users(id);

-- =============================================
-- PART 4: STANDARDIZE METADATA FIELDS
-- =============================================

-- Rename inconsistent JSONB fields to standard names
-- Pattern: metadata for flexible data, settings for configuration

-- Update comments table (already has proper pattern)
COMMENT ON COLUMN activities.metadata IS 'Flexible JSON storage for activity-specific data';

-- =============================================
-- PART 5: ENSURE ALL TABLES HAVE TIMESTAMPS
-- =============================================

-- Audit and add missing updated_at columns
-- (Most tables already have this from foundation migration)

-- Add soft delete support to key tables
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE productions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE activations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Create soft delete indexes
CREATE INDEX idx_projects_not_deleted ON projects(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_productions_not_deleted ON productions(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_activations_not_deleted ON activations(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_workspaces_not_deleted ON workspaces(id) WHERE deleted_at IS NULL;

-- =============================================
-- PART 6: EXPLICIT CASCADE RULES
-- =============================================

-- Update foreign keys with explicit cascade behavior
-- Pattern: Parent-child = CASCADE, Optional = SET NULL, Protected = RESTRICT

-- Projects: Cascade to children
ALTER TABLE productions DROP CONSTRAINT IF EXISTS productions_project_id_fkey;
ALTER TABLE productions ADD CONSTRAINT productions_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- Activations: Cascade to children
ALTER TABLE workspaces DROP CONSTRAINT IF EXISTS workspaces_activation_id_fkey;
ALTER TABLE workspaces ADD CONSTRAINT workspaces_activation_id_fkey 
    FOREIGN KEY (activation_id) REFERENCES activations(id) ON DELETE CASCADE;

-- User references: SET NULL (preserve data if user deleted)
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_project_lead_id_fkey;
ALTER TABLE projects ADD CONSTRAINT projects_project_lead_id_fkey 
    FOREIGN KEY (project_lead_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_executive_sponsor_id_fkey;
ALTER TABLE projects ADD CONSTRAINT projects_executive_sponsor_id_fkey 
    FOREIGN KEY (executive_sponsor_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- =============================================
-- PART 7: ADD MISSING CONSTRAINTS
-- =============================================

-- Budget constraints
ALTER TABLE projects ADD CONSTRAINT projects_budget_positive 
    CHECK (total_budget IS NULL OR total_budget >= 0);

ALTER TABLE productions ADD CONSTRAINT productions_budget_positive 
    CHECK (budget IS NULL OR budget >= 0);

ALTER TABLE productions ADD CONSTRAINT productions_budget_spent_valid 
    CHECK (budget_spent >= 0 AND (budget IS NULL OR budget_spent <= budget * 1.1)); -- Allow 10% overage

ALTER TABLE activations ADD CONSTRAINT activations_budget_positive 
    CHECK (budget IS NULL OR budget >= 0);

ALTER TABLE activations ADD CONSTRAINT activations_budget_spent_valid 
    CHECK (budget_spent >= 0 AND (budget IS NULL OR budget_spent <= budget * 1.1));

-- Progress constraints
ALTER TABLE productions ADD CONSTRAINT productions_progress_valid 
    CHECK (progress >= 0 AND progress <= 100);

-- =============================================
-- PART 8: COMPOSITE INDEXES FOR COMMON QUERIES
-- =============================================

-- Hierarchy navigation indexes
CREATE INDEX idx_projects_org_status ON projects(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_productions_project_status ON productions(project_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_activations_production_status ON activations(production_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_workspaces_activation_status ON workspaces(activation_id, is_default);

-- Date range queries
CREATE INDEX idx_projects_date_range ON projects(start_date, end_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_productions_date_range ON productions(start_date, end_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_activations_date_range ON activations(start_date, end_date) WHERE deleted_at IS NULL;

-- User assignment queries
CREATE INDEX idx_projects_lead_status ON projects(project_lead_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_productions_manager_status ON productions(project_manager_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_activations_manager_status ON activations(activation_manager_id, status) WHERE deleted_at IS NULL;

-- Financial queries
CREATE INDEX idx_projects_budget ON projects(organization_id, total_budget) WHERE deleted_at IS NULL AND total_budget IS NOT NULL;
CREATE INDEX idx_productions_budget ON productions(project_id, budget) WHERE deleted_at IS NULL AND budget IS NOT NULL;
CREATE INDEX idx_activations_budget ON activations(production_id, budget) WHERE deleted_at IS NULL AND budget IS NOT NULL;

-- =============================================
-- PART 9: FULL-TEXT SEARCH OPTIMIZATION
-- =============================================

-- Add GiST indexes for full-text search
CREATE INDEX idx_projects_name_search ON projects USING gin(to_tsvector('english', name));
CREATE INDEX idx_projects_description_search ON projects USING gin(to_tsvector('english', coalesce(description, '')));

CREATE INDEX idx_productions_name_search ON productions USING gin(to_tsvector('english', name));
CREATE INDEX idx_productions_description_search ON productions USING gin(to_tsvector('english', coalesce(description, '')));

CREATE INDEX idx_activations_name_search ON activations USING gin(to_tsvector('english', name));
CREATE INDEX idx_activations_description_search ON activations USING gin(to_tsvector('english', coalesce(description, '')));

-- =============================================
-- PART 10: JUNCTION TABLES FOR MANY-TO-MANY
-- =============================================

-- Project team members (many-to-many)
CREATE TABLE project_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('lead', 'member', 'contributor', 'observer')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(project_id, user_id)
);

CREATE INDEX idx_project_team_project ON project_team_members(project_id);
CREATE INDEX idx_project_team_user ON project_team_members(user_id);

-- Production team members (many-to-many)
CREATE TABLE production_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_id UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('manager', 'coordinator', 'member', 'contributor')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(production_id, user_id)
);

CREATE INDEX idx_production_team_production ON production_team_members(production_id);
CREATE INDEX idx_production_team_user ON production_team_members(user_id);

-- Activation team members (many-to-many)
CREATE TABLE activation_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activation_id UUID NOT NULL REFERENCES activations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('manager', 'coordinator', 'staff', 'volunteer')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(activation_id, user_id)
);

CREATE INDEX idx_activation_team_activation ON activation_team_members(activation_id);
CREATE INDEX idx_activation_team_user ON activation_team_members(user_id);

-- =============================================
-- PART 11: HELPER FUNCTIONS FOR QUERIES
-- =============================================

-- Get all team members in hierarchy
CREATE OR REPLACE FUNCTION get_hierarchy_team_members(
    entity_type TEXT,
    entity_uuid UUID
)
RETURNS TABLE (
    user_id UUID,
    role TEXT,
    level TEXT
) AS $$
BEGIN
    IF entity_type = 'project' THEN
        RETURN QUERY
        SELECT ptm.user_id, ptm.role, 'project'::TEXT AS level
        FROM project_team_members ptm
        WHERE ptm.project_id = entity_uuid;
    ELSIF entity_type = 'production' THEN
        RETURN QUERY
        SELECT ptm.user_id, ptm.role, 'production'::TEXT AS level
        FROM production_team_members ptm
        WHERE ptm.production_id = entity_uuid;
    ELSIF entity_type = 'activation' THEN
        RETURN QUERY
        SELECT atm.user_id, atm.role, 'activation'::TEXT AS level
        FROM activation_team_members atm
        WHERE atm.activation_id = entity_uuid;
    ELSE
        RETURN QUERY
        SELECT NULL::UUID, NULL::TEXT, NULL::TEXT WHERE FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get budget rollup
CREATE OR REPLACE FUNCTION get_budget_rollup(
    entity_type TEXT,
    entity_uuid UUID
)
RETURNS TABLE (
    total_budget DECIMAL,
    total_spent DECIMAL,
    remaining DECIMAL,
    percent_spent DECIMAL
) AS $$
BEGIN
    IF entity_type = 'project' THEN
        RETURN QUERY
        SELECT 
            COALESCE(SUM(pr.budget), 0) AS total_budget,
            COALESCE(SUM(pr.budget_spent), 0) AS total_spent,
            COALESCE(SUM(pr.budget), 0) - COALESCE(SUM(pr.budget_spent), 0) AS remaining,
            CASE 
                WHEN COALESCE(SUM(pr.budget), 0) > 0 
                THEN (COALESCE(SUM(pr.budget_spent), 0) / SUM(pr.budget) * 100)
                ELSE 0 
            END AS percent_spent
        FROM productions pr
        WHERE pr.project_id = entity_uuid;
    ELSIF entity_type = 'production' THEN
        RETURN QUERY
        SELECT 
            COALESCE(SUM(a.budget), 0) AS total_budget,
            COALESCE(SUM(a.budget_spent), 0) AS total_spent,
            COALESCE(SUM(a.budget), 0) - COALESCE(SUM(a.budget_spent), 0) AS remaining,
            CASE 
                WHEN COALESCE(SUM(a.budget), 0) > 0 
                THEN (COALESCE(SUM(a.budget_spent), 0) / SUM(a.budget) * 100)
                ELSE 0 
            END AS percent_spent
        FROM activations a
        WHERE a.production_id = entity_uuid;
    ELSIF entity_type = 'activation' THEN
        RETURN QUERY
        SELECT 
            a.budget AS total_budget,
            a.budget_spent AS total_spent,
            a.budget - a.budget_spent AS remaining,
            CASE 
                WHEN a.budget > 0 
                THEN (a.budget_spent / a.budget * 100)
                ELSE 0 
            END AS percent_spent
        FROM activations a
        WHERE a.id = entity_uuid;
    ELSE
        RETURN QUERY
        SELECT 0::DECIMAL, 0::DECIMAL, 0::DECIMAL, 0::DECIMAL WHERE FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================
-- PART 12: AUDIT LOGGING
-- =============================================

-- Audit log table for tracking changes
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_table ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user ON audit_log(changed_by);
CREATE INDEX idx_audit_log_date ON audit_log(changed_at DESC);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_data, changed_by)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), auth.uid());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_data, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), auth.uid());
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers to key tables
CREATE TRIGGER audit_projects AFTER INSERT OR UPDATE OR DELETE ON projects
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_productions AFTER INSERT OR UPDATE OR DELETE ON productions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_activations AFTER INSERT OR UPDATE OR DELETE ON activations
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- =============================================
-- PART 13: PERFORMANCE VIEWS
-- =============================================

-- Project summary view
CREATE VIEW project_summary AS
SELECT 
    p.id,
    p.organization_id,
    p.name,
    p.status,
    p.priority,
    COUNT(DISTINCT pr.id) AS production_count,
    COUNT(DISTINCT a.id) AS activation_count,
    COUNT(DISTINCT w.id) AS workspace_count,
    COALESCE(SUM(pr.budget), 0) AS total_budget,
    COALESCE(SUM(pr.budget_spent), 0) AS total_spent,
    COUNT(DISTINCT ptm.user_id) AS team_member_count
FROM projects p
LEFT JOIN productions pr ON pr.project_id = p.id AND pr.deleted_at IS NULL
LEFT JOIN activations a ON a.production_id = pr.id AND a.deleted_at IS NULL
LEFT JOIN workspaces w ON w.activation_id = a.id AND w.deleted_at IS NULL
LEFT JOIN project_team_members ptm ON ptm.project_id = p.id
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.organization_id, p.name, p.status, p.priority;

-- Production summary view
CREATE VIEW production_summary AS
SELECT 
    pr.id,
    pr.project_id,
    pr.name,
    pr.status,
    pr.priority,
    COUNT(DISTINCT a.id) AS activation_count,
    COUNT(DISTINCT w.id) AS workspace_count,
    COALESCE(SUM(a.budget), 0) AS total_budget,
    COALESCE(SUM(a.budget_spent), 0) AS total_spent,
    COUNT(DISTINCT ptm.user_id) AS team_member_count
FROM productions pr
LEFT JOIN activations a ON a.production_id = pr.id AND a.deleted_at IS NULL
LEFT JOIN workspaces w ON w.activation_id = a.id AND w.deleted_at IS NULL
LEFT JOIN production_team_members ptm ON ptm.production_id = pr.id
WHERE pr.deleted_at IS NULL
GROUP BY pr.id, pr.project_id, pr.name, pr.status, pr.priority;

-- =============================================
-- PART 14: RLS POLICIES FOR NEW TABLES
-- =============================================

ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Team members can view their own memberships
CREATE POLICY "Users can view their team memberships"
    ON project_team_members FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can view their team memberships"
    ON production_team_members FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can view their team memberships"
    ON activation_team_members FOR SELECT
    USING (user_id = auth.uid());

-- Admins can manage team memberships
CREATE POLICY "Admins can manage project teams"
    ON project_team_members FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            JOIN organization_members om ON om.organization_id = p.organization_id
            WHERE p.id = project_team_members.project_id
            AND om.user_id = auth.uid()
            AND om.role IN ('owner', 'admin')
        )
    );

-- Audit log policies
CREATE POLICY "Users can view audit logs for their organizations"
    ON audit_log FOR SELECT
    USING (
        changed_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM organization_members
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- =============================================
-- PART 15: REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE project_team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE production_team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE activation_team_members;

-- =============================================
-- COMMENTS & DOCUMENTATION
-- =============================================

COMMENT ON TABLE project_team_members IS 'Many-to-many: Project team member assignments';
COMMENT ON TABLE production_team_members IS 'Many-to-many: Production team member assignments';
COMMENT ON TABLE activation_team_members IS 'Many-to-many: Activation team member assignments';
COMMENT ON TABLE audit_log IS 'Audit trail for all changes to key entities';

COMMENT ON FUNCTION get_hierarchy_team_members IS 'Returns all team members for an entity in hierarchy';
COMMENT ON FUNCTION get_budget_rollup IS 'Returns budget summary for an entity in hierarchy';
