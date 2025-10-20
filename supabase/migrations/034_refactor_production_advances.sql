-- =============================================
-- REFACTOR PRODUCTION ADVANCES MODULE
-- Migration: 034
-- Purpose: Refactor from financial advances to procurement-style production advances
-- =============================================

-- Drop existing production_advances table
DROP TABLE IF EXISTS production_advances CASCADE;

-- Create new production_advances table with procurement fields
CREATE TABLE production_advances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Core References
    production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    department_team TEXT, -- Department or Team name
    
    -- Asset Information
    asset_category TEXT NOT NULL CHECK (asset_category IN (
        'site_infrastructure',
        'site_services',
        'site_safety',
        'site_vehicles',
        'heavy_equipment',
        'consumables',
        'event_rentals',
        'signage',
        'backline',
        'access',
        'credentials',
        'parking',
        'meals',
        'flights',
        'lodging',
        'rental_cars'
    )),
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL, -- Link to catalog asset
    asset_item TEXT NOT NULL, -- Asset/Item name
    accessories TEXT[], -- Array of accessory items
    quantity INTEGER NOT NULL DEFAULT 1,
    
    -- Rental/Usage Period
    start_date DATE NOT NULL,
    end_date DATE,
    
    -- Location & Purpose
    site_location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    site_location_name TEXT, -- Text field for location if not in locations table
    operational_purpose TEXT NOT NULL,
    special_considerations TEXT,
    additional_information TEXT,
    
    -- People
    requestor_id UUID NOT NULL REFERENCES auth.users(id),
    assigned_user_ids UUID[] DEFAULT '{}', -- Array of user IDs approved to collect/use items
    approver_id UUID REFERENCES auth.users(id),
    
    -- Status & Tracking
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Waiting for approval
        'approved',     -- Approved by approver
        'fulfilled',    -- Items issued/ready for pickup
        'active',       -- Items checked out and in use
        'returned',     -- Items returned
        'partially_returned', -- Some items returned
        'overdue',      -- Past return date
        'cancelled',    -- Request cancelled
        'denied'        -- Request denied
    )),
    
    -- Dates
    approved_at TIMESTAMPTZ,
    fulfilled_at TIMESTAMPTZ,
    checked_out_at TIMESTAMPTZ,
    returned_at TIMESTAMPTZ,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_prod_adv_workspace ON production_advances(workspace_id);
CREATE INDEX idx_prod_adv_production ON production_advances(production_id);
CREATE INDEX idx_prod_adv_company ON production_advances(company_id);
CREATE INDEX idx_prod_adv_status ON production_advances(status);
CREATE INDEX idx_prod_adv_category ON production_advances(asset_category);
CREATE INDEX idx_prod_adv_requestor ON production_advances(requestor_id);
CREATE INDEX idx_prod_adv_approver ON production_advances(approver_id);
CREATE INDEX idx_prod_adv_dates ON production_advances(start_date, end_date);
CREATE INDEX idx_prod_adv_asset ON production_advances(asset_id);
CREATE INDEX idx_prod_adv_location ON production_advances(site_location_id);

-- GIN index for array fields
CREATE INDEX idx_prod_adv_assigned_users ON production_advances USING GIN(assigned_user_ids);
CREATE INDEX idx_prod_adv_tags ON production_advances USING GIN(tags);

-- =============================================
-- FULL-TEXT SEARCH
-- =============================================

CREATE INDEX idx_prod_adv_search ON production_advances 
    USING GIN (to_tsvector('english', 
        asset_item || ' ' || 
        COALESCE(operational_purpose, '') || ' ' || 
        COALESCE(special_considerations, '') || ' ' ||
        COALESCE(notes, '')
    ));

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_production_advances_updated_at
    BEFORE UPDATE ON production_advances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Auto-update status based on dates
CREATE OR REPLACE FUNCTION check_advance_overdue()
RETURNS TRIGGER AS $$
BEGIN
    -- If active and past end date, mark as overdue
    IF NEW.status IN ('active', 'fulfilled') AND NEW.end_date IS NOT NULL AND NEW.end_date < CURRENT_DATE THEN
        NEW.status := 'overdue';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_advance_status_on_date
    BEFORE INSERT OR UPDATE ON production_advances
    FOR EACH ROW
    EXECUTE FUNCTION check_advance_overdue();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE production_advances ENABLE ROW LEVEL SECURITY;

-- Users can view advances in their workspaces
CREATE POLICY "Users can view production advances in their workspaces"
    ON production_advances FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

-- Users can create advances in their workspaces
CREATE POLICY "Users can create production advances in their workspaces"
    ON production_advances FOR INSERT
    WITH CHECK (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ) AND created_by = (SELECT (SELECT auth.uid())));

-- Users can update their own advances or if they're the approver
CREATE POLICY "Users can update production advances"
    ON production_advances FOR UPDATE
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ) AND (
        created_by = (SELECT (SELECT auth.uid())) OR 
        approver_id = (SELECT (SELECT auth.uid())) OR
        requestor_id = (SELECT (SELECT auth.uid()))
    ));

-- Users can delete their own pending advances
CREATE POLICY "Users can delete their own pending advances"
    ON production_advances FOR DELETE
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ) AND created_by = (SELECT (SELECT auth.uid())) AND status = 'pending');

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE production_advances;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE production_advances IS 'Procurement-style production advances for equipment, materials, and asset rentals';
COMMENT ON COLUMN production_advances.asset_category IS 'Primary asset category: site infrastructure, services, safety, vehicles, equipment, consumables, rentals, signage, backline, access, credentials, parking, meals, flights, lodging, rental_cars';
COMMENT ON COLUMN production_advances.assigned_user_ids IS 'Array of user IDs approved to collect/use the items once approved';
COMMENT ON COLUMN production_advances.accessories IS 'Array of accessory items that come with the main asset';
COMMENT ON COLUMN production_advances.operational_purpose IS 'Business justification and intended use of the assets';
