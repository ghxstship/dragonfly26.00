-- =============================================
-- PHASE 1: CORE CLICKUP FEATURES
-- Organization-level configurations
-- =============================================

-- =============================================
-- ORGANIZATION SETTINGS
-- =============================================

-- Organization-level feature configurations
CREATE TABLE organization_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Feature toggles
    enable_multiple_assignees BOOLEAN DEFAULT true,
    enable_watchers BOOLEAN DEFAULT true,
    enable_custom_statuses BOOLEAN DEFAULT true,
    enable_dependencies BOOLEAN DEFAULT true,
    enable_recurring_tasks BOOLEAN DEFAULT true,
    enable_checklists BOOLEAN DEFAULT true,
    
    -- Limits
    max_assignees_per_item INTEGER DEFAULT 10,
    max_watchers_per_item INTEGER DEFAULT 50,
    max_checklist_items INTEGER DEFAULT 100,
    
    -- Defaults
    default_assignee_behavior TEXT DEFAULT 'manual' CHECK (default_assignee_behavior IN ('manual', 'round_robin', 'least_busy')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(organization_id)
);

-- =============================================
-- CUSTOM STATUSES (ORGANIZATION-LEVEL)
-- =============================================

-- Custom status definitions per organization
CREATE TABLE custom_statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, -- Optional: workspace-specific override
    
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#94a3b8',
    type TEXT NOT NULL DEFAULT 'custom' CHECK (type IN ('open', 'in_progress', 'closed', 'custom')),
    icon TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    is_default BOOLEAN DEFAULT false,
    
    -- Automation triggers
    on_enter_action TEXT, -- Action to trigger when item enters this status
    on_exit_action TEXT,  -- Action to trigger when item exits this status
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_statuses_org ON custom_statuses(organization_id);
CREATE INDEX idx_custom_statuses_workspace ON custom_statuses(workspace_id);

-- =============================================
-- ASSIGNEES & WATCHERS
-- =============================================

-- Item assignees (many-to-many)
CREATE TABLE item_assignees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL, -- 'project', 'task', etc.
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(item_id, item_type, user_id)
);

CREATE INDEX idx_item_assignees_item ON item_assignees(item_id, item_type);
CREATE INDEX idx_item_assignees_user ON item_assignees(user_id);

-- Item watchers (many-to-many)
CREATE TABLE item_watchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    watch_type TEXT DEFAULT 'all' CHECK (watch_type IN ('all', 'mentions', 'status_changes')),
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(item_id, item_type, user_id)
);

CREATE INDEX idx_item_watchers_item ON item_watchers(item_id, item_type);
CREATE INDEX idx_item_watchers_user ON item_watchers(user_id);

-- =============================================
-- DEPENDENCIES
-- =============================================

-- Item dependencies
CREATE TABLE dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_item_id UUID NOT NULL,
    from_item_type TEXT NOT NULL,
    to_item_id UUID NOT NULL,
    to_item_type TEXT NOT NULL,
    
    dependency_type TEXT NOT NULL DEFAULT 'blocks' CHECK (
        dependency_type IN ('blocks', 'blocked_by', 'relates_to', 'duplicates', 'parent_of', 'child_of')
    ),
    
    -- For scheduling
    lag_days INTEGER DEFAULT 0,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Prevent circular dependencies
    CHECK (from_item_id != to_item_id),
    UNIQUE(from_item_id, to_item_id, dependency_type)
);

CREATE INDEX idx_dependencies_from ON dependencies(from_item_id, from_item_type);
CREATE INDEX idx_dependencies_to ON dependencies(to_item_id, to_item_type);

-- =============================================
-- CHECKLISTS
-- =============================================

-- Checklist templates (organization-level)
CREATE TABLE checklist_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checklist_templates_org ON checklist_templates(organization_id);

-- Checklists on items
CREATE TABLE checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    name TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checklists_item ON checklists(item_id, item_type);

-- Checklist items (nested support)
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_id UUID NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES checklist_items(id) ON DELETE CASCADE, -- For nesting
    
    content TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    assignee UUID REFERENCES auth.users(id),
    due_date TIMESTAMPTZ,
    
    "order" INTEGER DEFAULT 0,
    
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checklist_items_checklist ON checklist_items(checklist_id);
CREATE INDEX idx_checklist_items_parent ON checklist_items(parent_id);

-- =============================================
-- RECURRING TASKS
-- =============================================

-- Recurrence rules (organization-level templates)
CREATE TABLE recurrence_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL, -- e.g., "Weekly on Mondays"
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly', 'custom')),
    interval INTEGER NOT NULL DEFAULT 1,
    
    -- Weekly: which days (0=Sunday, 6=Saturday)
    by_weekday INTEGER[],
    
    -- Monthly: which day of month
    by_monthday INTEGER,
    
    -- Monthly: which week (1-4, -1 for last)
    by_setpos INTEGER,
    
    -- Yearly: which month
    by_month INTEGER,
    
    -- Custom cron expression
    cron_expression TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recurrence_rules_org ON recurrence_rules(organization_id);

-- Item recurrence configuration
CREATE TABLE item_recurrence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    
    recurrence_rule_id UUID REFERENCES recurrence_rules(id),
    
    -- Override with custom rule
    frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    interval INTEGER DEFAULT 1,
    by_weekday INTEGER[],
    
    -- End conditions
    end_date TIMESTAMPTZ,
    end_after_occurrences INTEGER,
    
    -- Tracking
    last_generated_at TIMESTAMPTZ,
    next_occurrence_at TIMESTAMPTZ,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(item_id, item_type)
);

CREATE INDEX idx_item_recurrence_next ON item_recurrence(next_occurrence_at) WHERE is_active = true;

-- Track generated instances
CREATE TABLE recurring_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_item_id UUID NOT NULL,
    original_item_type TEXT NOT NULL,
    instance_item_id UUID NOT NULL,
    instance_item_type TEXT NOT NULL,
    occurrence_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recurring_instances_original ON recurring_instances(original_item_id, original_item_type);

-- =============================================
-- UPDATE EXISTING TABLES
-- =============================================

-- Update projects table to support new features
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status_id UUID REFERENCES custom_statuses(id);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS checklist_progress JSONB DEFAULT '{"completed": 0, "total": 0}'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;

-- Update people table
ALTER TABLE people ADD COLUMN IF NOT EXISTS status_id UUID REFERENCES custom_statuses(id);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Organization settings
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org settings"
    ON organization_settings FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage org settings"
    ON organization_settings FOR ALL
    USING (organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ));

-- Custom statuses
ALTER TABLE custom_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org custom statuses"
    ON custom_statuses FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage custom statuses"
    ON custom_statuses FOR ALL
    USING (organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ));

-- Assignees & Watchers
ALTER TABLE item_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_watchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assignees in their workspace"
    ON item_assignees FOR SELECT
    USING (true); -- TODO: Add workspace check

CREATE POLICY "Users can manage assignees"
    ON item_assignees FOR ALL
    USING (true); -- TODO: Add proper permissions

CREATE POLICY "Users can view watchers"
    ON item_watchers FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own watch status"
    ON item_watchers FOR ALL
    USING (user_id = auth.uid());

-- Dependencies
ALTER TABLE dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view dependencies"
    ON dependencies FOR SELECT
    USING (true);

CREATE POLICY "Users can manage dependencies"
    ON dependencies FOR ALL
    USING (true);

-- Checklists
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org checklist templates"
    ON checklist_templates FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage checklist templates"
    ON checklist_templates FOR ALL
    USING (organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ));

-- Recurrence
ALTER TABLE recurrence_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_recurrence ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org recurrence rules"
    ON recurrence_rules FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to get all assignees for an item
CREATE OR REPLACE FUNCTION get_item_assignees(p_item_id UUID, p_item_type TEXT)
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    name TEXT,
    avatar_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email::TEXT,
        u.raw_user_meta_data->>'full_name' AS name,
        u.raw_user_meta_data->>'avatar_url' AS avatar_url
    FROM item_assignees ia
    JOIN auth.users u ON ia.user_id = u.id
    WHERE ia.item_id = p_item_id AND ia.item_type = p_item_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check dependencies before status change
CREATE OR REPLACE FUNCTION check_dependencies_before_complete(p_item_id UUID, p_item_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    blocked_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO blocked_count
    FROM dependencies d
    WHERE d.to_item_id = p_item_id 
    AND d.to_item_type = p_item_type
    AND d.dependency_type = 'blocked_by';
    
    RETURN blocked_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Function to generate recurring task instances
CREATE OR REPLACE FUNCTION generate_recurring_instances()
RETURNS INTEGER AS $$
DECLARE
    instance_count INTEGER := 0;
BEGIN
    -- This would be called by a cron job
    -- Generate instances for next 30 days
    -- Implementation details...
    RETURN instance_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Update checklist progress when items change
CREATE OR REPLACE FUNCTION update_checklist_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_items INTEGER;
    completed_items INTEGER;
    parent_item_id UUID;
    parent_item_type TEXT;
BEGIN
    -- Get the parent item
    SELECT c.item_id, c.item_type INTO parent_item_id, parent_item_type
    FROM checklists c
    WHERE c.id = NEW.checklist_id;
    
    -- Count total and completed
    SELECT COUNT(*), COUNT(*) FILTER (WHERE completed = true)
    INTO total_items, completed_items
    FROM checklist_items
    WHERE checklist_id = NEW.checklist_id;
    
    -- Update the parent item's checklist_progress field
    -- (This would need to be customized per table)
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER checklist_item_updated
AFTER INSERT OR UPDATE OR DELETE ON checklist_items
FOR EACH ROW EXECUTE FUNCTION update_checklist_progress();

-- =============================================
-- SEED DEFAULT STATUSES
-- =============================================

-- Insert default statuses for new organizations
-- (This would be done in application code during org creation)
