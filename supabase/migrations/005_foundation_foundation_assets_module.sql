-- =============================================
-- ASSETS MODULE - Equipment, Inventory, Maintenance, Production Advances
-- Migration: 004
-- =============================================

-- =============================================
-- ASSET CATALOG
-- =============================================

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN (
        'infrastructure', 'equipment', 'vehicle', 'tool', 'credential', 'consumable'
    )),
    category TEXT,
    subcategory TEXT,
    
    -- Identification
    asset_tag TEXT,
    serial_number TEXT,
    model_number TEXT,
    manufacturer TEXT,
    
    -- Financial
    purchase_price DECIMAL(12, 2),
    purchase_date DATE,
    current_value DECIMAL(12, 2),
    depreciation_rate DECIMAL(5, 2),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN (
        'available', 'in_use', 'maintenance', 'retired', 'lost', 'damaged'
    )),
    condition TEXT CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
    
    -- Location
    location_id UUID, -- Will reference locations(id)
    current_location TEXT,
    
    -- Ownership
    ownership TEXT CHECK (ownership IN ('owned', 'rented', 'leased')),
    vendor_id UUID, -- Will reference companies(id)
    
    -- Metadata
    specifications JSONB DEFAULT '{}'::jsonb,
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ASSET TRANSACTIONS (Check-in/Check-out)
-- =============================================

CREATE TABLE asset_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN (
        'check_out', 'check_in', 'transfer', 'maintenance', 'inspection'
    )),
    
    checked_out_to UUID REFERENCES personnel(id) ON DELETE SET NULL,
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    checked_out_at TIMESTAMPTZ,
    expected_return_at TIMESTAMPTZ,
    checked_in_at TIMESTAMPTZ,
    
    from_location_id UUID, -- Will reference locations(id)
    to_location_id UUID, -- Will reference locations(id)
    
    condition_at_checkout TEXT,
    condition_at_return TEXT,
    
    notes TEXT,
    
    performed_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- MAINTENANCE RECORDS
-- =============================================

CREATE TABLE asset_maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN (
        'preventive', 'corrective', 'inspection', 'repair', 'upgrade'
    )),
    title TEXT NOT NULL,
    description TEXT,
    
    scheduled_date TIMESTAMPTZ,
    completed_date TIMESTAMPTZ,
    next_maintenance_date TIMESTAMPTZ,
    
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'in_progress', 'completed', 'cancelled'
    )),
    
    performed_by UUID REFERENCES personnel(id) ON DELETE SET NULL,
    vendor_id UUID, -- Will reference companies(id)
    
    cost DECIMAL(10, 2),
    parts_used TEXT[] DEFAULT '{}',
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PRODUCTION ADVANCES (Equipment/Material Requests)
-- =============================================

CREATE TABLE production_advances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    production_id UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN (
        'equipment', 'materials', 'credentials', 'vehicle', 'tools'
    )),
    title TEXT NOT NULL,
    description TEXT,
    
    requested_by UUID NOT NULL REFERENCES auth.users(id),
    requested_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    needed_by TIMESTAMPTZ,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'denied', 'fulfilled', 'returned'
    )),
    
    approved_by UUID REFERENCES auth.users(id),
    approved_date TIMESTAMPTZ,
    
    items JSONB DEFAULT '[]'::jsonb, -- Array of requested items
    quantity INTEGER,
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Assets
CREATE INDEX idx_assets_workspace ON assets(workspace_id);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_location ON assets(location_id);
CREATE INDEX idx_assets_vendor ON assets(vendor_id);
CREATE INDEX idx_assets_tag ON assets(asset_tag);

-- Transactions
CREATE INDEX idx_asset_trans_workspace ON asset_transactions(workspace_id);
CREATE INDEX idx_asset_trans_asset ON asset_transactions(asset_id);
CREATE INDEX idx_asset_trans_type ON asset_transactions(type);
CREATE INDEX idx_asset_trans_person ON asset_transactions(checked_out_to);
CREATE INDEX idx_asset_trans_production ON asset_transactions(production_id);
CREATE INDEX idx_asset_trans_event ON asset_transactions(event_id);

-- Maintenance
CREATE INDEX idx_asset_maint_workspace ON asset_maintenance(workspace_id);
CREATE INDEX idx_asset_maint_asset ON asset_maintenance(asset_id);
CREATE INDEX idx_asset_maint_status ON asset_maintenance(status);
CREATE INDEX idx_asset_maint_scheduled ON asset_maintenance(scheduled_date);
CREATE INDEX idx_asset_maint_next ON asset_maintenance(next_maintenance_date);

-- Production Advances
CREATE INDEX idx_prod_advances_workspace ON production_advances(workspace_id);
CREATE INDEX idx_prod_advances_production ON production_advances(production_id);
CREATE INDEX idx_prod_advances_status ON production_advances(status);
CREATE INDEX idx_prod_advances_requested ON production_advances(requested_by);

-- =============================================
-- FULL-TEXT SEARCH
-- =============================================

CREATE INDEX idx_assets_search ON assets 
    USING GIN (to_tsvector('english', 
        name || ' ' || COALESCE(description, '') || ' ' || COALESCE(asset_tag, '')
    ));

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_production_advances_updated_at
    BEFORE UPDATE ON production_advances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_advances ENABLE ROW LEVEL SECURITY;

-- Standard workspace policies
CREATE POLICY "Users can view assets in their workspaces"
    ON assets FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage assets in their workspaces"
    ON assets FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can view asset transactions in their workspaces"
    ON asset_transactions FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage asset transactions in their workspaces"
    ON asset_transactions FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can view maintenance in their workspaces"
    ON asset_maintenance FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage maintenance in their workspaces"
    ON asset_maintenance FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can view production advances in their workspaces"
    ON production_advances FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage production advances in their workspaces"
    ON production_advances FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE assets;
ALTER PUBLICATION supabase_realtime ADD TABLE asset_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE asset_maintenance;
ALTER PUBLICATION supabase_realtime ADD TABLE production_advances;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE assets IS 'Asset catalog - equipment, vehicles, tools, credentials';
COMMENT ON TABLE asset_transactions IS 'Asset check-in/check-out and transfer history';
COMMENT ON TABLE asset_maintenance IS 'Maintenance schedules and service records';
COMMENT ON TABLE production_advances IS 'Production equipment and material requests';
