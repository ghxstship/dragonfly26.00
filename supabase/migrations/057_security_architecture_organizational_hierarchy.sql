-- =============================================
-- ORGANIZATIONAL HIERARCHY IMPLEMENTATION
-- Migration: 100
-- Date: January 20, 2025
-- Purpose: Implement 5-level hierarchy: Organization → Projects → Productions → Activations → Workspace
-- =============================================

-- =============================================
-- LEVEL 2: PROJECTS (Strategic Initiatives)
-- =============================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    code TEXT, -- Project code (e.g., "FESTIVALS", "TOURS")
    description TEXT,
    type TEXT NOT NULL CHECK (type IN (
        'festivals', 'tours', 'concerts', 'activations', 'campaigns',
        'film_tv', 'theater', 'corporate', 'community', 'other'
    )),
    
    -- Status & Timeline
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN (
        'draft', 'planning', 'active', 'on_hold', 'completed', 'cancelled', 'archived'
    )),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    
    -- Leadership
    project_lead_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    executive_sponsor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Financial
    total_budget DECIMAL(15, 2),
    budget_currency TEXT DEFAULT 'USD',
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Tracking
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- =============================================
-- LEVEL 4: ACTIVATIONS (Specific Events/Campaigns)
-- =============================================

CREATE TABLE activations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_id UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    code TEXT, -- Activation code (e.g., "EDC-LV-2025")
    description TEXT,
    type TEXT NOT NULL CHECK (type IN (
        'event', 'campaign', 'experience', 'installation', 'popup',
        'tour_stop', 'festival_edition', 'show', 'activation', 'other'
    )),
    
    -- Status & Timeline
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN (
        'draft', 'planning', 'active', 'in_progress', 'completed', 'cancelled', 'archived'
    )),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    
    -- Location
    venue_id UUID, -- References locations(id)
    location_details JSONB DEFAULT '{}'::jsonb,
    
    -- Leadership
    activation_manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Financial
    budget DECIMAL(15, 2),
    budget_spent DECIMAL(15, 2) DEFAULT 0,
    budget_currency TEXT DEFAULT 'USD',
    
    -- Capacity & Attendance
    expected_attendance INTEGER,
    actual_attendance INTEGER,
    capacity INTEGER,
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Tracking
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
    CONSTRAINT valid_attendance CHECK (actual_attendance IS NULL OR actual_attendance >= 0),
    CONSTRAINT valid_capacity CHECK (capacity IS NULL OR capacity > 0)
);

-- =============================================
-- UPDATE LEVEL 3: PRODUCTIONS (Execution Phase)
-- =============================================

-- Add project_id to productions table
ALTER TABLE productions ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE;

-- Add activation relationship
ALTER TABLE productions ADD COLUMN parent_production_id UUID REFERENCES productions(id) ON DELETE SET NULL;

-- Update productions to match new hierarchy
COMMENT ON TABLE productions IS 'Level 3: Productions - Execution phase of projects (e.g., EDC, specific tour)';

-- =============================================
-- UPDATE LEVEL 5: WORKSPACES (Operational Container)
-- =============================================

-- Add activation_id to workspaces table
ALTER TABLE workspaces ADD COLUMN activation_id UUID REFERENCES activations(id) ON DELETE CASCADE;

-- Add parent workspace for sub-workspaces
ALTER TABLE workspaces ADD COLUMN parent_workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL;

-- Update workspaces to match new hierarchy
COMMENT ON TABLE workspaces IS 'Level 5: Workspaces - Operational containers within activations (e.g., Kinetic Field, Site Operations)';

-- =============================================
-- HIERARCHY HELPER FUNCTIONS
-- =============================================

-- Get full hierarchy path for a workspace
CREATE OR REPLACE FUNCTION get_workspace_hierarchy(workspace_uuid UUID)
RETURNS TABLE (
    organization_id UUID,
    organization_name TEXT,
    project_id UUID,
    project_name TEXT,
    production_id UUID,
    production_name TEXT,
    activation_id UUID,
    activation_name TEXT,
    workspace_id UUID,
    workspace_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id AS organization_id,
        o.name AS organization_name,
        p.id AS project_id,
        p.name AS project_name,
        pr.id AS production_id,
        pr.name AS production_name,
        a.id AS activation_id,
        a.name AS activation_name,
        w.id AS workspace_id,
        w.name AS workspace_name
    FROM workspaces w
    LEFT JOIN activations a ON w.activation_id = a.id
    LEFT JOIN productions pr ON a.production_id = pr.id OR w.organization_id = pr.workspace_id
    LEFT JOIN projects p ON pr.project_id = p.id
    LEFT JOIN organizations o ON w.organization_id = o.id OR p.organization_id = o.id
    WHERE w.id = workspace_uuid;
END;
$$ LANGUAGE plpgsql;

-- Get all workspaces in hierarchy
CREATE OR REPLACE FUNCTION get_hierarchy_workspaces(
    entity_type TEXT,
    entity_uuid UUID
)
RETURNS TABLE (workspace_id UUID) AS $$
BEGIN
    IF entity_type = 'organization' THEN
        RETURN QUERY
        SELECT id FROM workspaces WHERE organization_id = entity_uuid;
    ELSIF entity_type = 'project' THEN
        RETURN QUERY
        SELECT w.id 
        FROM workspaces w
        JOIN activations a ON w.activation_id = a.id
        JOIN productions pr ON a.production_id = pr.id
        WHERE pr.project_id = entity_uuid;
    ELSIF entity_type = 'production' THEN
        RETURN QUERY
        SELECT w.id
        FROM workspaces w
        JOIN activations a ON w.activation_id = a.id
        WHERE a.production_id = entity_uuid;
    ELSIF entity_type = 'activation' THEN
        RETURN QUERY
        SELECT id FROM workspaces WHERE activation_id = entity_uuid;
    ELSE
        RETURN QUERY
        SELECT NULL::UUID WHERE FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Get organization from any entity in hierarchy
CREATE OR REPLACE FUNCTION get_entity_organization(
    entity_type TEXT,
    entity_uuid UUID
)
RETURNS UUID AS $$
DECLARE
    org_id UUID;
BEGIN
    CASE entity_type
        WHEN 'organization' THEN
            org_id := entity_uuid;
        WHEN 'project' THEN
            SELECT organization_id INTO org_id FROM projects WHERE id = entity_uuid;
        WHEN 'production' THEN
            SELECT p.organization_id INTO org_id 
            FROM productions pr
            JOIN projects p ON pr.project_id = p.id
            WHERE pr.id = entity_uuid;
        WHEN 'activation' THEN
            SELECT p.organization_id INTO org_id
            FROM activations a
            JOIN productions pr ON a.production_id = pr.id
            JOIN projects p ON pr.project_id = p.id
            WHERE a.id = entity_uuid;
        WHEN 'workspace' THEN
            SELECT organization_id INTO org_id FROM workspaces WHERE id = entity_uuid;
        ELSE
            org_id := NULL;
    END CASE;
    
    RETURN org_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- MATERIALIZED VIEWS FOR PERFORMANCE
-- =============================================

-- Hierarchy rollup for reporting
CREATE MATERIALIZED VIEW hierarchy_rollup AS
WITH workspace_counts AS (
    SELECT 
        o.id AS organization_id,
        p.id AS project_id,
        pr.id AS production_id,
        a.id AS activation_id,
        COUNT(DISTINCT w.id) FILTER (WHERE w.organization_id = o.id OR w.activation_id IN (
            SELECT a2.id FROM activations a2 
            JOIN productions pr2 ON a2.production_id = pr2.id 
            JOIN projects p2 ON pr2.project_id = p2.id 
            WHERE p2.organization_id = o.id
        )) AS org_workspace_count,
        COUNT(DISTINCT w.id) FILTER (WHERE w.activation_id IN (
            SELECT a2.id FROM activations a2 
            JOIN productions pr2 ON a2.production_id = pr2.id 
            WHERE pr2.project_id = p.id
        )) AS project_workspace_count,
        COUNT(DISTINCT w.id) FILTER (WHERE w.activation_id IN (
            SELECT a2.id FROM activations a2 WHERE a2.production_id = pr.id
        )) AS production_workspace_count,
        COUNT(DISTINCT w.id) FILTER (WHERE w.activation_id = a.id) AS activation_workspace_count
    FROM organizations o
    LEFT JOIN projects p ON p.organization_id = o.id
    LEFT JOIN productions pr ON pr.project_id = p.id
    LEFT JOIN activations a ON a.production_id = pr.id
    LEFT JOIN workspaces w ON TRUE
    GROUP BY o.id, p.id, pr.id, a.id
)
SELECT 
    o.id AS organization_id,
    o.name AS organization_name,
    p.id AS project_id,
    p.name AS project_name,
    pr.id AS production_id,
    pr.name AS production_name,
    a.id AS activation_id,
    a.name AS activation_name,
    w.id AS workspace_id,
    w.name AS workspace_name,
    wc.org_workspace_count,
    wc.project_workspace_count,
    wc.production_workspace_count,
    wc.activation_workspace_count
FROM organizations o
LEFT JOIN projects p ON p.organization_id = o.id
LEFT JOIN productions pr ON pr.project_id = p.id
LEFT JOIN activations a ON a.production_id = pr.id
LEFT JOIN workspaces w ON w.activation_id = a.id OR w.organization_id = o.id
LEFT JOIN workspace_counts wc ON wc.organization_id = o.id 
    AND (wc.project_id = p.id OR (wc.project_id IS NULL AND p.id IS NULL))
    AND (wc.production_id = pr.id OR (wc.production_id IS NULL AND pr.id IS NULL))
    AND (wc.activation_id = a.id OR (wc.activation_id IS NULL AND a.id IS NULL));

CREATE UNIQUE INDEX idx_hierarchy_rollup_workspace ON hierarchy_rollup(workspace_id);
CREATE INDEX idx_hierarchy_rollup_org ON hierarchy_rollup(organization_id);
CREATE INDEX idx_hierarchy_rollup_project ON hierarchy_rollup(project_id);
CREATE INDEX idx_hierarchy_rollup_production ON hierarchy_rollup(production_id);
CREATE INDEX idx_hierarchy_rollup_activation ON hierarchy_rollup(activation_id);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_hierarchy_rollup()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY hierarchy_rollup;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Projects indexes
CREATE INDEX idx_projects_organization ON projects(organization_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);
CREATE INDEX idx_projects_lead ON projects(project_lead_id);
CREATE INDEX idx_projects_deleted ON projects(deleted_at) WHERE deleted_at IS NULL;

-- Activations indexes
CREATE INDEX idx_activations_production ON activations(production_id);
CREATE INDEX idx_activations_status ON activations(status);
CREATE INDEX idx_activations_type ON activations(type);
CREATE INDEX idx_activations_dates ON activations(start_date, end_date);
CREATE INDEX idx_activations_venue ON activations(venue_id);
CREATE INDEX idx_activations_manager ON activations(activation_manager_id);
CREATE INDEX idx_activations_deleted ON activations(deleted_at) WHERE deleted_at IS NULL;

-- Productions new indexes
CREATE INDEX idx_productions_project ON productions(project_id);
CREATE INDEX idx_productions_parent ON productions(parent_production_id);

-- Workspaces new indexes
CREATE INDEX idx_workspaces_activation ON workspaces(activation_id);
CREATE INDEX idx_workspaces_parent ON workspaces(parent_workspace_id);

-- =============================================
-- TRIGGERS
-- =============================================

-- Update timestamp triggers
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_activations_updated_at BEFORE UPDATE ON activations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Refresh hierarchy rollup on changes
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

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activations ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view projects in their organizations"
    ON projects FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage projects"
    ON projects FOR ALL
    USING (organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ));

-- Activations policies
CREATE POLICY "Users can view activations in their organizations"
    ON activations FOR SELECT
    USING (
        get_entity_organization('activation', id) IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage activations"
    ON activations FOR ALL
    USING (
        get_entity_organization('activation', id) IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE activations;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE projects IS 'Level 2: Strategic initiatives within organizations (e.g., Festivals, Tours)';
COMMENT ON TABLE activations IS 'Level 4: Specific events or campaigns within productions (e.g., EDC Las Vegas 2025)';
COMMENT ON COLUMN productions.project_id IS 'Parent project in organizational hierarchy';
COMMENT ON COLUMN workspaces.activation_id IS 'Parent activation in organizational hierarchy';
COMMENT ON FUNCTION get_workspace_hierarchy IS 'Returns complete hierarchy path for a workspace';
COMMENT ON FUNCTION get_hierarchy_workspaces IS 'Returns all workspaces under a given entity in hierarchy';
COMMENT ON FUNCTION get_entity_organization IS 'Returns organization ID for any entity in hierarchy';
