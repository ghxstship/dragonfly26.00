-- =============================================
-- PHASE 2: ADVANCED FEATURES
-- Automations, Goals/OKRs, Sprints, Version Control, Search
-- =============================================

-- =============================================
-- 1. AUTOMATIONS ENGINE
-- =============================================

-- Automation rules (organization-level)
CREATE TABLE automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, -- Optional: workspace-specific
    
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    
    -- Trigger configuration
    trigger_type TEXT NOT NULL CHECK (trigger_type IN (
        'status_change',
        'field_updated',
        'item_created',
        'item_deleted',
        'date_reached',
        'assignee_changed',
        'time_elapsed',
        'checklist_completed',
        'dependency_completed',
        'comment_added'
    )),
    trigger_config JSONB DEFAULT '{}'::jsonb, -- Trigger-specific settings
    
    -- Conditions (AND logic)
    conditions JSONB DEFAULT '[]'::jsonb, -- Array of condition objects
    
    -- Actions to perform
    actions JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of action objects
    
    -- Execution settings
    run_once_per_item BOOLEAN DEFAULT false,
    delay_minutes INTEGER DEFAULT 0,
    
    -- Stats
    execution_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMPTZ,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_automations_org ON automations(organization_id);
CREATE INDEX idx_automations_workspace ON automations(workspace_id);
CREATE INDEX idx_automations_trigger ON automations(trigger_type) WHERE is_active = true;

-- Automation execution log
CREATE TABLE automation_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
    
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'skipped')),
    error_message TEXT,
    
    -- What was changed
    actions_performed JSONB,
    execution_time_ms INTEGER,
    
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_automation_executions_automation ON automation_executions(automation_id);
CREATE INDEX idx_automation_executions_item ON automation_executions(item_id, item_type);
CREATE INDEX idx_automation_executions_date ON automation_executions(executed_at);

-- =============================================
-- 2. GOALS & OKRs
-- =============================================

-- Goals (Objectives and Key Results)
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    
    parent_goal_id UUID REFERENCES goals(id) ON DELETE CASCADE, -- For hierarchical goals
    
    name TEXT NOT NULL,
    description TEXT,
    
    -- Goal type
    type TEXT NOT NULL CHECK (type IN ('number', 'currency', 'percentage', 'boolean', 'task_completion')),
    
    -- Target values
    target_value DECIMAL,
    current_value DECIMAL DEFAULT 0,
    unit TEXT, -- e.g., "users", "MRR", "%"
    
    -- Time frame
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'on_track', 'at_risk', 'behind', 'completed')),
    
    -- Ownership
    owner_id UUID REFERENCES auth.users(id),
    
    -- Linked items (tasks that contribute to this goal)
    linked_items JSONB DEFAULT '[]'::jsonb,
    
    -- Progress calculation method
    progress_calc_method TEXT DEFAULT 'manual' CHECK (progress_calc_method IN ('manual', 'auto_sum', 'auto_avg', 'linked_tasks')),
    
    -- Visibility
    is_public BOOLEAN DEFAULT true,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_goals_org ON goals(organization_id);
CREATE INDEX idx_goals_workspace ON goals(workspace_id);
CREATE INDEX idx_goals_parent ON goals(parent_goal_id);
CREATE INDEX idx_goals_owner ON goals(owner_id);
CREATE INDEX idx_goals_dates ON goals(start_date, end_date);

-- Goal progress history (for charting)
CREATE TABLE goal_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    
    value DECIMAL NOT NULL,
    note TEXT,
    
    recorded_by UUID REFERENCES auth.users(id),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_goal_progress_goal ON goal_progress(goal_id);
CREATE INDEX idx_goal_progress_date ON goal_progress(recorded_at);

-- =============================================
-- 3. SPRINTS (AGILE)
-- =============================================

-- Sprints
CREATE TABLE sprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    goal TEXT, -- Sprint goal/objective
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
    
    -- Capacity planning
    team_capacity_hours DECIMAL,
    committed_points INTEGER DEFAULT 0,
    completed_points INTEGER DEFAULT 0,
    
    -- Velocity tracking
    velocity INTEGER, -- Points completed in this sprint
    
    -- Settings
    default_status_on_start TEXT,
    default_status_on_complete TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sprints_workspace ON sprints(workspace_id);
CREATE INDEX idx_sprints_dates ON sprints(start_date, end_date);
CREATE INDEX idx_sprints_status ON sprints(status);

-- Sprint items (link tasks to sprints)
CREATE TABLE sprint_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_id UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
    
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    
    -- Story points
    story_points INTEGER,
    
    -- When added/completed
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    -- Carried over from previous sprint?
    is_carryover BOOLEAN DEFAULT false,
    previous_sprint_id UUID REFERENCES sprints(id),
    
    UNIQUE(sprint_id, item_id, item_type)
);

CREATE INDEX idx_sprint_items_sprint ON sprint_items(sprint_id);
CREATE INDEX idx_sprint_items_item ON sprint_items(item_id, item_type);

-- Sprint daily snapshots (for burndown chart)
CREATE TABLE sprint_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_id UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
    
    snapshot_date DATE NOT NULL,
    
    -- Points tracking
    remaining_points INTEGER NOT NULL,
    completed_points INTEGER NOT NULL,
    added_points INTEGER DEFAULT 0, -- Scope creep
    removed_points INTEGER DEFAULT 0,
    
    -- Ideal burndown
    ideal_remaining_points INTEGER,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(sprint_id, snapshot_date)
);

CREATE INDEX idx_sprint_snapshots_sprint ON sprint_snapshots(sprint_id);
CREATE INDEX idx_sprint_snapshots_date ON sprint_snapshots(snapshot_date);

-- =============================================
-- 4. VERSION CONTROL
-- =============================================

-- Item versions (track all changes)
CREATE TABLE item_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    version INTEGER NOT NULL,
    
    -- Full snapshot of item at this version
    data JSONB NOT NULL,
    
    -- What changed (for diff view)
    changes JSONB, -- { field: { old: value, new: value } }
    change_summary TEXT, -- Human-readable: "Updated status from To Do to Done"
    
    -- Who and when
    changed_by UUID NOT NULL REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Change metadata
    change_type TEXT CHECK (change_type IN ('created', 'updated', 'deleted', 'restored')),
    ip_address INET,
    user_agent TEXT,
    
    UNIQUE(item_id, item_type, version)
);

CREATE INDEX idx_item_versions_item ON item_versions(item_id, item_type);
CREATE INDEX idx_item_versions_changed_by ON item_versions(changed_by);
CREATE INDEX idx_item_versions_date ON item_versions(changed_at);
CREATE INDEX idx_item_versions_type ON item_versions(change_type);

-- Version restore history
CREATE TABLE version_restores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    
    from_version INTEGER NOT NULL,
    to_version INTEGER NOT NULL,
    
    restored_by UUID NOT NULL REFERENCES auth.users(id),
    restored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    reason TEXT
);

CREATE INDEX idx_version_restores_item ON version_restores(item_id, item_type);

-- =============================================
-- 5. ADVANCED SEARCH INDEX
-- =============================================

-- Full-text search index table
CREATE TABLE search_index (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Searchable content
    title TEXT,
    content TEXT,
    tags TEXT[],
    
    -- Metadata for filtering
    status TEXT,
    priority TEXT,
    assignee_ids UUID[],
    created_by UUID,
    
    -- Dates
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    
    -- Full-text search vector
    search_vector tsvector,
    
    -- Last indexed
    indexed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(item_id, item_type)
);

CREATE INDEX idx_search_workspace ON search_index(workspace_id);
CREATE INDEX idx_search_type ON search_index(item_type);
CREATE INDEX idx_search_vector ON search_index USING GIN(search_vector);
CREATE INDEX idx_search_assignees ON search_index USING GIN(assignee_ids);
CREATE INDEX idx_search_tags ON search_index USING GIN(tags);

-- Saved searches
CREATE TABLE saved_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    query TEXT NOT NULL,
    filters JSONB DEFAULT '{}'::jsonb,
    
    is_pinned BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX idx_saved_searches_workspace ON saved_searches(workspace_id);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Automations
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org automations"
    ON automations FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage automations"
    ON automations FOR ALL
    USING (organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ));

-- Goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workspace goals"
    ON goals FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
        AND (is_public = true OR owner_id = auth.uid())
    );

CREATE POLICY "Goal owners and admins can manage goals"
    ON goals FOR ALL
    USING (
        owner_id = auth.uid() OR
        organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Sprints
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprint_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprint_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workspace sprints"
    ON sprints FOR SELECT
    USING (workspace_id IN (
        SELECT w.id FROM workspaces w
        JOIN organization_members om ON w.organization_id = om.organization_id
        WHERE om.user_id = auth.uid()
    ));

-- Version Control
ALTER TABLE item_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view item versions"
    ON item_versions FOR SELECT
    USING (true); -- TODO: Add proper workspace check

-- Search Index
ALTER TABLE search_index ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can search in their workspaces"
    ON search_index FOR SELECT
    USING (workspace_id IN (
        SELECT w.id FROM workspaces w
        JOIN organization_members om ON w.organization_id = om.organization_id
        WHERE om.user_id = auth.uid()
    ));

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to update search index
CREATE OR REPLACE FUNCTION update_search_index()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO search_index (
        item_id,
        item_type,
        workspace_id,
        title,
        content,
        status,
        priority,
        created_by,
        created_at,
        updated_at,
        search_vector
    )
    VALUES (
        NEW.id,
        TG_TABLE_NAME,
        NEW.workspace_id,
        COALESCE(NEW.name, NEW.title),
        NEW.description,
        NEW.status,
        NEW.priority,
        NEW.created_by,
        NEW.created_at,
        NEW.updated_at,
        to_tsvector('english', 
            COALESCE(NEW.name, NEW.title, '') || ' ' || 
            COALESCE(NEW.description, '')
        )
    )
    ON CONFLICT (item_id, item_type) 
    DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        status = EXCLUDED.status,
        priority = EXCLUDED.priority,
        updated_at = EXCLUDED.updated_at,
        search_vector = EXCLUDED.search_vector,
        indexed_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create version on update
CREATE OR REPLACE FUNCTION create_item_version()
RETURNS TRIGGER AS $$
DECLARE
    version_num INTEGER;
    changes_json JSONB;
BEGIN
    -- Get next version number
    SELECT COALESCE(MAX(version), 0) + 1 INTO version_num
    FROM item_versions
    WHERE item_id = NEW.id AND item_type = TG_TABLE_NAME;
    
    -- Calculate changes (simplified)
    changes_json = jsonb_build_object(
        'old', to_jsonb(OLD),
        'new', to_jsonb(NEW)
    );
    
    -- Insert version
    INSERT INTO item_versions (
        item_id,
        item_type,
        version,
        data,
        changes,
        changed_by,
        change_type
    ) VALUES (
        NEW.id,
        TG_TABLE_NAME,
        version_num,
        to_jsonb(NEW),
        changes_json,
        auth.uid(),
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'created'
            WHEN TG_OP = 'UPDATE' THEN 'updated'
            WHEN TG_OP = 'DELETE' THEN 'deleted'
        END
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to execute automation
CREATE OR REPLACE FUNCTION execute_automation(
    p_automation_id UUID,
    p_item_id UUID,
    p_item_type TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    automation_record RECORD;
    execution_success BOOLEAN := true;
BEGIN
    -- Get automation
    SELECT * INTO automation_record
    FROM automations
    WHERE id = p_automation_id AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check conditions (simplified - would need full implementation)
    -- ... condition checking logic ...
    
    -- Execute actions (simplified - would need full implementation)
    -- ... action execution logic ...
    
    -- Log execution
    INSERT INTO automation_executions (
        automation_id,
        item_id,
        item_type,
        status
    ) VALUES (
        p_automation_id,
        p_item_id,
        p_item_type,
        CASE WHEN execution_success THEN 'success' ELSE 'failed' END
    );
    
    -- Update automation stats
    UPDATE automations
    SET execution_count = execution_count + 1,
        last_executed_at = NOW()
    WHERE id = p_automation_id;
    
    RETURN execution_success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Full-text search function
CREATE OR REPLACE FUNCTION search_items(
    p_workspace_id UUID,
    p_query TEXT,
    p_filters JSONB DEFAULT '{}'::jsonb
) RETURNS TABLE (
    item_id UUID,
    item_type TEXT,
    title TEXT,
    content TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        si.item_id,
        si.item_type,
        si.title,
        si.content,
        ts_rank(si.search_vector, plainto_tsquery('english', p_query)) AS rank
    FROM search_index si
    WHERE si.workspace_id = p_workspace_id
    AND si.search_vector @@ plainto_tsquery('english', p_query)
    ORDER BY rank DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS
-- =============================================

-- Enable versioning on projects table
CREATE TRIGGER projects_versioning
AFTER INSERT OR UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION create_item_version();

-- Enable search indexing on projects table
CREATE TRIGGER projects_search_index
AFTER INSERT OR UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_search_index();

-- Calculate goal progress on updates
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.progress_calc_method = 'auto_sum' THEN
        -- Calculate from child goals
        SELECT COALESCE(SUM(current_value), 0) INTO NEW.current_value
        FROM goals
        WHERE parent_goal_id = NEW.id;
    END IF;
    
    -- Update status based on progress
    IF NEW.current_value >= NEW.target_value THEN
        NEW.status = 'completed';
    ELSIF NEW.current_value >= NEW.target_value * 0.7 THEN
        NEW.status = 'on_track';
    ELSIF NEW.current_value >= NEW.target_value * 0.5 THEN
        NEW.status = 'at_risk';
    ELSE
        NEW.status = 'behind';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER goal_progress_calculation
BEFORE UPDATE ON goals
FOR EACH ROW EXECUTE FUNCTION update_goal_progress();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_automation_executions_status ON automation_executions(status);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_sprints_active ON sprints(status) WHERE status = 'active';
