-- =============================================
-- CHECKLISTS & APPROVAL WORKFLOWS
-- Migration: 20251015000004
-- =============================================
-- Automated checklists, reminders, and standardized approval processes

-- =============================================
-- CHECKLIST TEMPLATES
-- =============================================

CREATE TABLE checklist_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    -- Context where this applies
    applies_to TEXT NOT NULL CHECK (applies_to IN (
        'work_order', 'project', 'job_contract', 'event'
    )),
    
    -- Auto-application rules
    auto_apply_when JSONB DEFAULT '{}'::jsonb, -- Conditions for auto-apply
    
    is_active BOOLEAN DEFAULT true,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE checklist_template_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES checklist_templates(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    
    -- Ordering
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    -- Assignment
    assign_to_role TEXT, -- e.g., 'project_manager', 'subcontractor'
    
    -- Timing
    due_relative_to TEXT, -- 'start', 'end', 'milestone'
    due_offset_days INTEGER DEFAULT 0,
    
    -- Reminders
    reminder_enabled BOOLEAN DEFAULT false,
    reminder_days_before INTEGER DEFAULT 1,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- CHECKLIST INSTANCES
-- =============================================

CREATE TABLE checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    template_id UUID REFERENCES checklist_templates(id) ON DELETE SET NULL,
    
    -- Context
    context_type TEXT NOT NULL CHECK (context_type IN (
        'work_order', 'project', 'job_contract', 'event'
    )),
    context_id UUID NOT NULL,
    
    name TEXT NOT NULL,
    
    -- Status
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id UUID NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    -- Assignment
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Status
    is_completed BOOLEAN DEFAULT false,
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ,
    
    -- Due date
    due_date TIMESTAMPTZ,
    
    -- Reminders
    reminder_sent_at TIMESTAMPTZ,
    
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- APPROVAL WORKFLOWS
-- =============================================

CREATE TABLE IF NOT EXISTS approval_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    -- What needs approval
    entity_type TEXT NOT NULL CHECK (entity_type IN (
        'work_order', 'job_contract', 'invoice', 'expense', 'purchase_order', 'estimate'
    )),
    
    -- Conditions for when this workflow applies
    trigger_conditions JSONB DEFAULT '{}'::jsonb,
    
    -- Workflow steps (ordered)
    steps JSONB NOT NULL, -- [{step: 1, approver_role: 'manager', approver_user_id: uuid}]
    
    -- Settings
    require_all_approvers BOOLEAN DEFAULT true,
    allow_parallel_approval BOOLEAN DEFAULT false,
    
    is_active BOOLEAN DEFAULT true,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES approval_workflows(id) ON DELETE SET NULL,
    
    -- What needs approval
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    
    title TEXT NOT NULL,
    description TEXT,
    
    -- Requester
    requested_by UUID NOT NULL REFERENCES auth.users(id),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Current Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'cancelled'
    )),
    current_step INTEGER DEFAULT 1,
    
    -- Resolution
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES auth.users(id),
    resolution_notes TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approval_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_request_id UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
    
    step_number INTEGER NOT NULL,
    approver_id UUID NOT NULL REFERENCES auth.users(id),
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'skipped'
    )),
    
    decision_at TIMESTAMPTZ,
    decision_notes TEXT,
    
    notified_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Checklists
CREATE INDEX idx_checklist_templates_workspace ON checklist_templates(workspace_id);
CREATE INDEX idx_checklist_template_items_template ON checklist_template_items(template_id);
CREATE INDEX idx_checklists_workspace ON checklists(workspace_id);
CREATE INDEX idx_checklists_context ON checklists(context_type, context_id);
CREATE INDEX idx_checklist_items_checklist ON checklist_items(checklist_id);
CREATE INDEX idx_checklist_items_assigned_to ON checklist_items(assigned_to);
CREATE INDEX idx_checklist_items_due_date ON checklist_items(due_date);

-- Approvals
CREATE INDEX idx_approval_workflows_workspace ON approval_workflows(workspace_id);
CREATE INDEX idx_approval_workflows_entity_type ON approval_workflows(entity_type);
CREATE INDEX idx_approval_requests_workspace ON approval_requests(workspace_id);
CREATE INDEX idx_approval_requests_entity ON approval_requests(entity_type, entity_id);
CREATE INDEX idx_approval_requests_status ON approval_requests(status);
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'approval_steps' AND column_name = 'approval_request_id') THEN
        CREATE INDEX IF NOT EXISTS idx_approval_steps_request ON approval_steps(approval_request_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'approval_steps' AND column_name = 'approver_id') THEN
        CREATE INDEX IF NOT EXISTS idx_approval_steps_approver ON approval_steps(approver_id);
    END IF;
END $$;

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_checklist_templates_updated_at
    BEFORE UPDATE ON checklist_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_checklist_items_updated_at
    BEFORE UPDATE ON checklist_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_approval_workflows_updated_at
    BEFORE UPDATE ON approval_workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Auto-complete checklist when all items are completed
CREATE OR REPLACE FUNCTION check_checklist_completion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE checklists
    SET 
        is_completed = NOT EXISTS (
            SELECT 1 FROM checklist_items
            WHERE checklist_id = NEW.checklist_id
            AND is_completed = false
        ),
        completed_at = CASE
            WHEN NOT EXISTS (
                SELECT 1 FROM checklist_items
                WHERE checklist_id = NEW.checklist_id
                AND is_completed = false
            ) THEN NOW()
            ELSE NULL
        END
    WHERE id = NEW.checklist_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_checklist_completion
    AFTER UPDATE OF is_completed ON checklist_items
    FOR EACH ROW
    EXECUTE FUNCTION check_checklist_completion();

-- Update approval request status when all steps approved
CREATE OR REPLACE FUNCTION check_approval_completion()
RETURNS TRIGGER AS $$
DECLARE
    all_approved BOOLEAN;
    any_rejected BOOLEAN;
BEGIN
    SELECT
        NOT EXISTS (SELECT 1 FROM approval_steps WHERE approval_request_id = NEW.approval_request_id AND status = 'pending'),
        EXISTS (SELECT 1 FROM approval_steps WHERE approval_request_id = NEW.approval_request_id AND status = 'rejected')
    INTO all_approved, any_rejected;
    
    IF any_rejected THEN
        UPDATE approval_requests
        SET status = 'rejected', resolved_at = NOW(), resolved_by = NEW.approver_id
        WHERE id = NEW.approval_request_id;
    ELSIF all_approved THEN
        UPDATE approval_requests
        SET status = 'approved', resolved_at = NOW(), resolved_by = NEW.approver_id
        WHERE id = NEW.approval_request_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'approval_steps' AND column_name = 'approval_request_id') THEN
        DROP TRIGGER IF EXISTS trigger_check_approval_completion ON approval_steps;
        CREATE TRIGGER trigger_check_approval_completion
            AFTER UPDATE OF status ON approval_steps
            FOR EACH ROW
            EXECUTE FUNCTION check_approval_completion();
    END IF;
END $$;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_steps ENABLE ROW LEVEL SECURITY;

-- Checklist policies
CREATE POLICY "Users can view checklist templates in their workspaces"
    ON checklist_templates FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage checklist templates in their workspaces"
    ON checklist_templates FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view checklist template items"
    ON checklist_template_items FOR SELECT
    USING (template_id IN (
        SELECT id FROM checklist_templates WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Users can manage checklist template items"
    ON checklist_template_items FOR ALL
    USING (template_id IN (
        SELECT id FROM checklist_templates WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Users can view checklists in their workspaces"
    ON checklists FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage checklists in their workspaces"
    ON checklists FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view checklist items"
    ON checklist_items FOR SELECT
    USING (checklist_id IN (
        SELECT id FROM checklists WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Users can manage checklist items"
    ON checklist_items FOR ALL
    USING (checklist_id IN (
        SELECT id FROM checklists WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

-- Approval policies
CREATE POLICY "Users can view approval workflows in their workspaces"
    ON approval_workflows FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage approval workflows in their workspaces"
    ON approval_workflows FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view approval requests in their workspaces"
    ON approval_requests FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage approval requests in their workspaces"
    ON approval_requests FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'approval_steps' AND column_name = 'approval_request_id') THEN
        DROP POLICY IF EXISTS "Users can view approval steps" ON approval_steps;
        CREATE POLICY "Users can view approval steps"
            ON approval_steps FOR SELECT
            USING (approval_request_id IN (
                SELECT id FROM approval_requests WHERE workspace_id IN (
                    SELECT id FROM workspaces WHERE organization_id IN (
                        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
                    )
                )
            ));
        
        DROP POLICY IF EXISTS "Users can manage approval steps" ON approval_steps;
        CREATE POLICY "Users can manage approval steps"
            ON approval_steps FOR ALL
            USING (approval_request_id IN (
                SELECT id FROM approval_requests WHERE workspace_id IN (
                    SELECT id FROM workspaces WHERE organization_id IN (
                        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
                    )
                )
            ));
    END IF;
END $$;

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE checklists;
    EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE checklist_items;
    EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE approval_requests;
    EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE approval_steps;
    EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE checklist_templates IS 'Reusable checklist templates with auto-apply rules';
COMMENT ON TABLE checklists IS 'Checklist instances for work orders, projects, etc.';
COMMENT ON TABLE approval_workflows IS 'Standardized approval process definitions';
COMMENT ON TABLE approval_requests IS 'Active approval requests';
