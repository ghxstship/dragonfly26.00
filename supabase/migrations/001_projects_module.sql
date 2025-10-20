-- =============================================
-- PROJECTS MODULE - Productions, Tasks, Milestones, Compliance
-- Migration: 001
-- =============================================

-- =============================================
-- PRODUCTIONS (Main Projects Table)
-- =============================================

CREATE TABLE productions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    code TEXT, -- Internal project code
    description TEXT,
    type TEXT NOT NULL CHECK (type IN (
        'concert', 'festival', 'tour', 'film', 'tv', 'theater', 'immersive',
        'activation', 'trade_show', 'corporate', 'conference', 'convention',
        'health', 'community', 'educational', 'philanthropic'
    )),
    
    -- Status & Timeline
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN (
        'planning', 'active', 'on_hold', 'completed', 'cancelled', 'archived'
    )),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    
    -- Location
    venue_id UUID, -- Will reference locations(id) when that table exists
    location_details JSONB DEFAULT '{}'::jsonb,
    
    -- Team
    project_manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    team_members UUID[] DEFAULT '{}', -- Array of user IDs
    
    -- Financial
    budget DECIMAL(15, 2),
    budget_spent DECIMAL(15, 2) DEFAULT 0,
    budget_currency TEXT DEFAULT 'USD',
    
    -- Health Indicators
    health TEXT DEFAULT 'healthy' CHECK (health IN ('healthy', 'at_risk', 'critical')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    -- Tracking
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PROJECT TASKS
-- =============================================

CREATE TABLE project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_id UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN (
        'todo', 'in_progress', 'review', 'blocked', 'done'
    )),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Assignment
    assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assignees UUID[] DEFAULT '{}', -- Multiple assignees
    
    -- Timeline
    start_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    estimated_hours DECIMAL(8, 2),
    actual_hours DECIMAL(8, 2),
    
    -- Relationships
    parent_task_id UUID REFERENCES project_tasks(id) ON DELETE SET NULL,
    depends_on UUID[] DEFAULT '{}', -- Task dependencies
    
    -- Tracking
    custom_fields JSONB DEFAULT '{}'::jsonb,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PROJECT MILESTONES
-- =============================================

CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_id UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'in_progress', 'completed', 'missed'
    )),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- COMPLIANCE & SAFETY
-- =============================================

CREATE TABLE project_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_id UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN (
        'license', 'permit', 'inspection', 'insurance', 'certification'
    )),
    name TEXT NOT NULL,
    issuing_authority TEXT,
    reference_number TEXT,
    issue_date TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'denied', 'expired'
    )),
    document_url TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project_safety (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_id UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN (
        'risk_assessment', 'safety_plan', 'emergency_procedure', 'incident_report'
    )),
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'review', 'approved', 'archived'
    )),
    mitigation_steps TEXT,
    responsible_person_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    document_url TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Productions indexes
CREATE INDEX idx_productions_workspace ON productions(workspace_id);
CREATE INDEX idx_productions_status ON productions(status);
CREATE INDEX idx_productions_type ON productions(type);
CREATE INDEX idx_productions_project_manager ON productions(project_manager_id);
CREATE INDEX idx_productions_dates ON productions(start_date, end_date);

-- Tasks indexes
CREATE INDEX idx_project_tasks_production ON project_tasks(production_id);
CREATE INDEX idx_project_tasks_workspace ON project_tasks(workspace_id);
CREATE INDEX idx_project_tasks_status ON project_tasks(status);
CREATE INDEX idx_project_tasks_assignee ON project_tasks(assignee_id);
CREATE INDEX idx_project_tasks_due_date ON project_tasks(due_date);
CREATE INDEX idx_project_tasks_parent ON project_tasks(parent_task_id);

-- Milestones indexes
CREATE INDEX idx_milestones_production ON project_milestones(production_id);
CREATE INDEX idx_milestones_workspace ON project_milestones(workspace_id);
CREATE INDEX idx_milestones_due_date ON project_milestones(due_date);

-- Compliance indexes
CREATE INDEX idx_compliance_production ON project_compliance(production_id);
CREATE INDEX idx_compliance_type ON project_compliance(type);
CREATE INDEX idx_compliance_expiry ON project_compliance(expiry_date);

-- Safety indexes
CREATE INDEX idx_safety_production ON project_safety(production_id);
CREATE INDEX idx_safety_type ON project_safety(type);

-- =============================================
-- FULL-TEXT SEARCH
-- =============================================

-- Productions search
CREATE INDEX idx_productions_search ON productions 
    USING GIN (to_tsvector('english', 
        name || ' ' || COALESCE(description, '') || ' ' || COALESCE(code, '')
    ));

-- Tasks search
CREATE INDEX idx_tasks_search ON project_tasks 
    USING GIN (to_tsvector('english', 
        name || ' ' || COALESCE(description, '')
    ));

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE TRIGGER update_productions_updated_at
    BEFORE UPDATE ON productions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_project_tasks_updated_at
    BEFORE UPDATE ON project_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_project_milestones_updated_at
    BEFORE UPDATE ON project_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_project_compliance_updated_at
    BEFORE UPDATE ON project_compliance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_project_safety_updated_at
    BEFORE UPDATE ON project_safety
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE productions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_safety ENABLE ROW LEVEL SECURITY;

-- Productions policies
CREATE POLICY "Users can view productions in their workspaces"
    ON productions FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can create productions in their workspaces"
    ON productions FOR INSERT
    WITH CHECK (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can update productions in their workspaces"
    ON productions FOR UPDATE
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can delete productions in their workspaces"
    ON productions FOR DELETE
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

-- Tasks policies (same pattern)
CREATE POLICY "Users can view tasks in their workspaces"
    ON project_tasks FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage tasks in their workspaces"
    ON project_tasks FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

-- Milestones policies
CREATE POLICY "Users can view milestones in their workspaces"
    ON project_milestones FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage milestones in their workspaces"
    ON project_milestones FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

-- Compliance policies
CREATE POLICY "Users can view compliance in their workspaces"
    ON project_compliance FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage compliance in their workspaces"
    ON project_compliance FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

-- Safety policies
CREATE POLICY "Users can view safety in their workspaces"
    ON project_safety FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage safety in their workspaces"
    ON project_safety FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE productions;
ALTER PUBLICATION supabase_realtime ADD TABLE project_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE project_milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE project_compliance;
ALTER PUBLICATION supabase_realtime ADD TABLE project_safety;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE productions IS 'Main projects/productions - concerts, festivals, activations, events';
COMMENT ON TABLE project_tasks IS 'Tasks associated with productions';
COMMENT ON TABLE project_milestones IS 'Key milestones and deadlines for productions';
COMMENT ON TABLE project_compliance IS 'Licensing, permits, insurance, and regulatory compliance';
COMMENT ON TABLE project_safety IS 'Safety assessments, plans, and incident reports';

-- Update user_roles table to add foreign key constraint now that productions exists
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_project 
    FOREIGN KEY (project_id) REFERENCES productions(id) ON DELETE CASCADE;
