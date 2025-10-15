-- =============================================
-- ENHANCED COST TRACKING & RECRUITING
-- Migration: 20251015000005
-- =============================================
-- Automatic cost aggregation and subcontractor recruiting/hiring

-- =============================================
-- ENHANCED COST TRACKING
-- =============================================

CREATE TABLE project_cost_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    code TEXT,
    description TEXT,
    
    parent_category_id UUID REFERENCES project_cost_categories(id) ON DELETE SET NULL,
    
    -- Budget settings
    default_budget DECIMAL(15, 2),
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    production_id UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
    category_id UUID REFERENCES project_cost_categories(id) ON DELETE SET NULL,
    
    -- Cost Details
    description TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Date
    cost_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Source
    source_type TEXT CHECK (source_type IN (
        'work_order', 'invoice', 'expense', 'manual'
    )),
    source_id UUID, -- ID of work_order, invoice, etc.
    
    -- Vendor
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    
    -- Status
    status TEXT DEFAULT 'actual' CHECK (status IN (
        'estimated', 'committed', 'actual', 'paid'
    )),
    
    -- Approval
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    
    -- Notes
    notes TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- RECRUITING & HIRING
-- =============================================

CREATE TABLE hiring_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- Requirements
    work_category TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    required_certifications TEXT[] DEFAULT '{}',
    location TEXT,
    states TEXT[] DEFAULT '{}',
    
    -- Work Details
    work_type TEXT CHECK (work_type IN (
        'one_time', 'ongoing', 'seasonal', 'emergency'
    )),
    estimated_start_date DATE,
    estimated_duration TEXT,
    
    -- Compensation
    compensation_type TEXT CHECK (compensation_type IN (
        'hourly', 'fixed', 'per_project'
    )),
    compensation_min DECIMAL(15, 2),
    compensation_max DECIMAL(15, 2),
    currency TEXT DEFAULT 'USD',
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'active', 'paused', 'closed', 'filled'
    )),
    
    -- Boosting (HeyPros feature - promote to area subcontractors)
    is_boosted BOOLEAN DEFAULT false,
    boosted_until TIMESTAMPTZ,
    boost_radius_miles INTEGER DEFAULT 50,
    
    -- Application deadline
    application_deadline TIMESTAMPTZ,
    
    -- Response tracking
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE hiring_application_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hiring_application_id UUID NOT NULL REFERENCES hiring_applications(id) ON DELETE CASCADE,
    
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES company_contacts(id) ON DELETE SET NULL,
    
    -- Interest level
    interest_level TEXT DEFAULT 'interested' CHECK (interest_level IN (
        'very_interested', 'interested', 'maybe'
    )),
    
    -- Availability
    available_start_date DATE,
    
    -- Proposed rate
    proposed_rate DECIMAL(15, 2),
    rate_type TEXT CHECK (rate_type IN ('hourly', 'fixed', 'per_project')),
    
    -- Message
    cover_message TEXT,
    
    -- Attachments
    resume_file_id UUID REFERENCES files(id) ON DELETE SET NULL,
    portfolio_urls TEXT[] DEFAULT '{}',
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'under_review', 'shortlisted', 'accepted', 'rejected'
    )),
    
    -- Response
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Cost Tracking
CREATE INDEX idx_project_cost_categories_workspace ON project_cost_categories(workspace_id);
CREATE INDEX idx_project_cost_categories_parent ON project_cost_categories(parent_category_id);
CREATE INDEX idx_project_costs_workspace ON project_costs(workspace_id);
CREATE INDEX idx_project_costs_production ON project_costs(production_id);
CREATE INDEX idx_project_costs_category ON project_costs(category_id);
CREATE INDEX idx_project_costs_company ON project_costs(company_id);
CREATE INDEX idx_project_costs_status ON project_costs(status);
CREATE INDEX idx_project_costs_source ON project_costs(source_type, source_id);
CREATE INDEX idx_project_costs_date ON project_costs(cost_date);

-- Recruiting
CREATE INDEX idx_hiring_applications_workspace ON hiring_applications(workspace_id);
CREATE INDEX idx_hiring_applications_status ON hiring_applications(status);
CREATE INDEX idx_hiring_applications_work_category ON hiring_applications(work_category);
CREATE INDEX idx_hiring_application_responses_application ON hiring_application_responses(hiring_application_id);
CREATE INDEX idx_hiring_application_responses_company ON hiring_application_responses(company_id);
CREATE INDEX idx_hiring_application_responses_status ON hiring_application_responses(status);

-- =============================================
-- FULL-TEXT SEARCH
-- =============================================

CREATE INDEX idx_hiring_applications_search ON hiring_applications 
    USING GIN (to_tsvector('english', 
        title || ' ' || description
    ));

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_project_costs_updated_at
    BEFORE UPDATE ON project_costs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hiring_applications_updated_at
    BEFORE UPDATE ON hiring_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hiring_application_responses_updated_at
    BEFORE UPDATE ON hiring_application_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Auto-create project cost from work order
CREATE OR REPLACE FUNCTION create_cost_from_work_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND NEW.actual_cost IS NOT NULL AND NEW.actual_cost > 0 THEN
        INSERT INTO project_costs (
            workspace_id,
            production_id,
            description,
            amount,
            currency,
            cost_date,
            source_type,
            source_id,
            company_id,
            status,
            created_by
        ) VALUES (
            NEW.workspace_id,
            NEW.production_id,
            'Work Order: ' || NEW.title,
            NEW.actual_cost,
            NEW.currency,
            CURRENT_DATE,
            'work_order',
            NEW.id,
            NEW.company_id,
            'actual',
            NEW.created_by
        )
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_cost_from_work_order
    AFTER UPDATE OF status, actual_cost ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION create_cost_from_work_order();

-- Auto-create project cost from approved invoice
CREATE OR REPLACE FUNCTION create_cost_from_invoice()
RETURNS TRIGGER AS $$
DECLARE
    wo_production_id UUID;
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        -- Get production_id from work_order if linked
        IF NEW.work_order_id IS NOT NULL THEN
            SELECT production_id INTO wo_production_id
            FROM work_orders
            WHERE id = NEW.work_order_id;
        END IF;
        
        -- Create cost entry
        INSERT INTO project_costs (
            workspace_id,
            production_id,
            description,
            amount,
            currency,
            cost_date,
            source_type,
            source_id,
            company_id,
            status,
            approved_by,
            approved_at,
            created_by
        ) VALUES (
            NEW.workspace_id,
            wo_production_id,
            'Invoice: ' || NEW.invoice_number,
            NEW.total,
            NEW.currency,
            NEW.invoice_date,
            'invoice',
            NEW.id,
            NEW.company_id,
            'actual',
            NEW.approved_by,
            NEW.approved_at,
            NEW.created_by
        )
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_cost_from_invoice
    AFTER UPDATE OF status ON subcontractor_invoices
    FOR EACH ROW
    EXECUTE FUNCTION create_cost_from_invoice();

-- Update production budget_spent when costs change
CREATE OR REPLACE FUNCTION update_production_budget_spent()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.production_id IS NOT NULL THEN
        UPDATE productions
        SET budget_spent = (
            SELECT COALESCE(SUM(amount), 0)
            FROM project_costs
            WHERE production_id = NEW.production_id
            AND status IN ('actual', 'paid')
        )
        WHERE id = NEW.production_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_production_budget_spent
    AFTER INSERT OR UPDATE OR DELETE ON project_costs
    FOR EACH ROW
    EXECUTE FUNCTION update_production_budget_spent();

-- Update hiring application counts
CREATE OR REPLACE FUNCTION update_hiring_application_counts()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE hiring_applications
    SET applications_count = (
        SELECT COUNT(*)
        FROM hiring_application_responses
        WHERE hiring_application_id = NEW.hiring_application_id
    )
    WHERE id = NEW.hiring_application_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_hiring_application_counts
    AFTER INSERT ON hiring_application_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_hiring_application_counts();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE project_cost_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiring_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiring_application_responses ENABLE ROW LEVEL SECURITY;

-- Cost Categories policies
CREATE POLICY "Users can view cost categories in their workspaces"
    ON project_cost_categories FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage cost categories in their workspaces"
    ON project_cost_categories FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- Project Costs policies
CREATE POLICY "Users can view project costs in their workspaces"
    ON project_costs FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage project costs in their workspaces"
    ON project_costs FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- Hiring Applications policies
CREATE POLICY "Users can view hiring applications in their workspaces"
    ON hiring_applications FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage hiring applications in their workspaces"
    ON hiring_applications FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- Hiring Responses policies
CREATE POLICY "Users can view hiring responses in their workspaces"
    ON hiring_application_responses FOR SELECT
    USING (hiring_application_id IN (
        SELECT id FROM hiring_applications WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Users can manage hiring responses in their workspaces"
    ON hiring_application_responses FOR ALL
    USING (hiring_application_id IN (
        SELECT id FROM hiring_applications WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE project_costs;
ALTER PUBLICATION supabase_realtime ADD TABLE hiring_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE hiring_application_responses;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE project_cost_categories IS 'Cost categories for budget tracking';
COMMENT ON TABLE project_costs IS 'Automatic cost aggregation from work orders, invoices, etc.';
COMMENT ON TABLE hiring_applications IS 'Job postings to recruit new subcontractors';
COMMENT ON TABLE hiring_application_responses IS 'Responses from subcontractors to hiring posts';
