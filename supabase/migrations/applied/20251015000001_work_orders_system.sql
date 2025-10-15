-- =============================================
-- WORK ORDERS SYSTEM - Core HeyPros Feature
-- Migration: 20251015000001
-- =============================================
-- Fast dispatching, scheduling, and subcontractor management

-- =============================================
-- WORK ORDERS
-- =============================================

CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Reference
    work_order_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    
    -- Relationships
    production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
    job_contract_id UUID REFERENCES job_contracts(id) ON DELETE SET NULL,
    project_task_id UUID REFERENCES project_tasks(id) ON DELETE SET NULL,
    
    -- Assignment (Subcontractor/Vendor)
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    assigned_contacts UUID[] DEFAULT '{}', -- company_contacts.id array
    
    -- Scope
    scope_of_work TEXT NOT NULL,
    deliverables TEXT[] DEFAULT '{}',
    location_details JSONB DEFAULT '{}'::jsonb,
    
    -- Scheduling
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    duration_hours DECIMAL(8, 2),
    
    -- Financial
    estimated_cost DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2),
    currency TEXT DEFAULT 'USD',
    
    -- Status & Progress
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'pending_approval', 'approved', 'dispatched', 'in_progress',
        'on_hold', 'completed', 'cancelled', 'invoiced'
    )),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Compliance
    requires_compliance_check BOOLEAN DEFAULT true,
    compliance_verified BOOLEAN DEFAULT false,
    compliance_verified_by UUID REFERENCES auth.users(id),
    compliance_verified_at TIMESTAMPTZ,
    
    -- Notifications
    notifications_sent_at TIMESTAMPTZ,
    reminder_sent_at TIMESTAMPTZ,
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Work Order Offers (for competitive bidding)
CREATE TABLE work_order_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    offered_price DECIMAL(15, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    estimated_duration_hours DECIMAL(8, 2),
    proposed_start_date TIMESTAMPTZ,
    notes TEXT,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'accepted', 'rejected', 'withdrawn'
    )),
    
    responded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    decided_at TIMESTAMPTZ,
    decided_by UUID REFERENCES auth.users(id)
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_work_orders_workspace ON work_orders(workspace_id);
CREATE INDEX idx_work_orders_production ON work_orders(production_id);
CREATE INDEX idx_work_orders_company ON work_orders(company_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_scheduled_start ON work_orders(scheduled_start);
CREATE INDEX idx_work_order_offers_work_order ON work_order_offers(work_order_id);
CREATE INDEX idx_work_order_offers_company ON work_order_offers(company_id);

-- =============================================
-- FULL-TEXT SEARCH
-- =============================================

CREATE INDEX idx_work_orders_search ON work_orders 
    USING GIN (to_tsvector('english', 
        work_order_number || ' ' || title || ' ' || COALESCE(description, '') || ' ' || COALESCE(scope_of_work, '')
    ));

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_work_orders_updated_at
    BEFORE UPDATE ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Trigger to update actual_cost when status changes to invoiced
CREATE OR REPLACE FUNCTION update_work_order_actual_cost()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'invoiced' AND OLD.status != 'invoiced' THEN
        -- Get total from approved invoices for this work order
        SELECT COALESCE(SUM(total), 0)
        INTO NEW.actual_cost
        FROM subcontractor_invoices
        WHERE work_order_id = NEW.id
        AND status IN ('approved', 'paid');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_work_order_actual_cost
    BEFORE UPDATE ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_work_order_actual_cost();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_offers ENABLE ROW LEVEL SECURITY;

-- Work Orders policies
CREATE POLICY "Users can view work orders in their workspaces"
    ON work_orders FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can create work orders in their workspaces"
    ON work_orders FOR INSERT
    WITH CHECK (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can update work orders in their workspaces"
    ON work_orders FOR UPDATE
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can delete work orders in their workspaces"
    ON work_orders FOR DELETE
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- Work Order Offers policies
CREATE POLICY "Users can view offers in their workspaces"
    ON work_order_offers FOR SELECT
    USING (work_order_id IN (
        SELECT id FROM work_orders WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Users can manage offers in their workspaces"
    ON work_order_offers FOR ALL
    USING (work_order_id IN (
        SELECT id FROM work_orders WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE work_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE work_order_offers;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE work_orders IS 'Work orders for fast dispatching and scheduling subcontractors';
COMMENT ON TABLE work_order_offers IS 'Competitive offers/bids on work orders';
