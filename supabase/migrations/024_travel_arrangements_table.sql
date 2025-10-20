-- =============================================
-- TRAVEL ARRANGEMENTS TABLE
-- For My Travel dashboard tab
-- =============================================

CREATE TABLE travel_arrangements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- User and Project
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    -- Basic Info
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    purpose TEXT,
    type TEXT CHECK (type IN (
        'Site Visit', 'Production', 'Meeting', 'Logistics', 'Training', 'Other'
    )),
    
    -- Dates
    departure_date TIMESTAMPTZ NOT NULL,
    return_date TIMESTAMPTZ NOT NULL,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
    )),
    
    -- Flight Details (JSONB)
    flight_details JSONB DEFAULT '{}'::jsonb,
    -- Example structure:
    -- {
    --   "departure": "JFK → LAX • AA 123 • 9:00 AM",
    --   "return": "LAX → JFK • AA 456 • 6:00 PM",
    --   "cost": 450.00
    -- }
    
    -- Hotel Details (JSONB)
    hotel_details JSONB,
    -- Example structure:
    -- {
    --   "name": "Marriott Downtown",
    --   "checkIn": "Oct 18, 3:00 PM",
    --   "checkOut": "Oct 20, 11:00 AM",
    --   "cost": 320.00
    -- }
    
    -- Ground Transport (JSONB)
    ground_transport JSONB,
    -- Example structure:
    -- {
    --   "type": "Rental Car",
    --   "details": "Economy • Enterprise",
    --   "cost": 120.00
    -- }
    
    -- Financial
    total_cost DECIMAL(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    
    -- Approval
    requires_approval BOOLEAN DEFAULT true,
    approved_by UUID REFERENCES auth.users(id),
    approved_date TIMESTAMPTZ,
    
    -- Notes
    notes TEXT,
    
    -- Metadata
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_travel_workspace ON travel_arrangements(workspace_id);
CREATE INDEX idx_travel_user ON travel_arrangements(user_id);
CREATE INDEX idx_travel_production ON travel_arrangements(production_id);
CREATE INDEX idx_travel_status ON travel_arrangements(status);
CREATE INDEX idx_travel_departure ON travel_arrangements(departure_date);

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_travel_arrangements_updated_at
    BEFORE UPDATE ON travel_arrangements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE travel_arrangements ENABLE ROW LEVEL SECURITY;

-- Users can view travel in their workspaces
CREATE POLICY "Users can view travel in their workspaces"
    ON travel_arrangements FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT (SELECT (SELECT auth.uid()))))
        )
    ));

-- Users can manage travel in their workspaces
CREATE POLICY "Users can manage travel in their workspaces"
    ON travel_arrangements FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT (SELECT (SELECT auth.uid()))))
        )
    ));

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE travel_arrangements;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE travel_arrangements IS 'User travel arrangements and itineraries';
COMMENT ON COLUMN travel_arrangements.flight_details IS 'Flight information stored as JSONB';
COMMENT ON COLUMN travel_arrangements.hotel_details IS 'Hotel booking details stored as JSONB';
COMMENT ON COLUMN travel_arrangements.ground_transport IS 'Ground transportation details stored as JSONB';
