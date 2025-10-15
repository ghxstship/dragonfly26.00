-- =============================================
-- LOCATIONS MODULE - Venues, Facilities, Site Maps
-- Migration: 005
-- =============================================

-- =============================================
-- LOCATIONS
-- =============================================

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'venue', 'office', 'warehouse', 'studio', 'stage', 'room', 'facility', 'site'
    )),
    description TEXT,
    
    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'US',
    
    -- Geo
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone TEXT,
    
    -- Details
    capacity INTEGER,
    size_sqft INTEGER,
    
    -- Contact
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    
    -- Parent/Child
    parent_location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'active', 'inactive', 'under_construction'
    )),
    
    -- Metadata
    amenities TEXT[] DEFAULT '{}',
    restrictions TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- SITE MAPS
-- =============================================

CREATE TABLE site_maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    type TEXT CHECK (type IN (
        'floor_plan', 'site_map', 'seating_chart', 'technical_drawing'
    )),
    
    file_url TEXT NOT NULL,
    scale TEXT,
    dimensions TEXT,
    
    version INTEGER DEFAULT 1,
    is_current BOOLEAN DEFAULT true,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ACCESS CONTROL
-- =============================================

CREATE TABLE location_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN (
        'entry_point', 'security_checkpoint', 'restricted_area'
    )),
    name TEXT NOT NULL,
    
    access_level TEXT NOT NULL CHECK (access_level IN (
        'public', 'staff', 'crew', 'vip', 'restricted'
    )),
    
    requires_credential BOOLEAN DEFAULT false,
    credential_type TEXT,
    
    hours_of_operation JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- UTILITIES & INFRASTRUCTURE
-- =============================================

CREATE TABLE location_utilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN (
        'power', 'water', 'internet', 'hvac', 'lighting', 'audio', 'other'
    )),
    name TEXT NOT NULL,
    description TEXT,
    
    capacity TEXT, -- e.g., "200A 3-phase", "1Gbps"
    location_details TEXT,
    
    status TEXT NOT NULL DEFAULT 'operational' CHECK (status IN (
        'operational', 'limited', 'offline', 'maintenance'
    )),
    
    vendor_id UUID, -- Will reference companies(id)
    contact_info TEXT,
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_locations_workspace ON locations(workspace_id);
CREATE INDEX idx_locations_type ON locations(type);
CREATE INDEX idx_locations_status ON locations(status);
CREATE INDEX idx_locations_parent ON locations(parent_location_id);
CREATE INDEX idx_locations_geo ON locations(latitude, longitude);

CREATE INDEX idx_site_maps_location ON site_maps(location_id);
CREATE INDEX idx_site_maps_workspace ON site_maps(workspace_id);

CREATE INDEX idx_location_access_location ON location_access(location_id);
CREATE INDEX idx_location_access_workspace ON location_access(workspace_id);

CREATE INDEX idx_location_utils_location ON location_utilities(location_id);
CREATE INDEX idx_location_utils_workspace ON location_utilities(workspace_id);
CREATE INDEX idx_location_utils_status ON location_utilities(status);

-- =============================================
-- FULL-TEXT SEARCH
-- =============================================

CREATE INDEX idx_locations_search ON locations 
    USING GIN (to_tsvector('english', 
        name || ' ' || COALESCE(description, '') || ' ' || COALESCE(city, '')
    ));

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_location_utilities_updated_at
    BEFORE UPDATE ON location_utilities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_utilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view locations in their workspaces"
    ON locations FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage locations in their workspaces"
    ON locations FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view site maps in their workspaces"
    ON site_maps FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage site maps in their workspaces"
    ON site_maps FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view location access in their workspaces"
    ON location_access FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage location access in their workspaces"
    ON location_access FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view utilities in their workspaces"
    ON location_utilities FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage utilities in their workspaces"
    ON location_utilities FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- Update foreign keys in other tables now that locations exists
ALTER TABLE productions ADD CONSTRAINT fk_productions_venue 
    FOREIGN KEY (venue_id) REFERENCES locations(id) ON DELETE SET NULL;

ALTER TABLE events ADD CONSTRAINT fk_events_location 
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL;

ALTER TABLE bookings ADD CONSTRAINT fk_bookings_location 
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL;

ALTER TABLE incidents ADD CONSTRAINT fk_incidents_location 
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL;

ALTER TABLE job_openings ADD CONSTRAINT fk_job_openings_location 
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL;

ALTER TABLE assets ADD CONSTRAINT fk_assets_location 
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL;

ALTER TABLE asset_transactions ADD CONSTRAINT fk_asset_trans_from_location 
    FOREIGN KEY (from_location_id) REFERENCES locations(id) ON DELETE SET NULL;

ALTER TABLE asset_transactions ADD CONSTRAINT fk_asset_trans_to_location 
    FOREIGN KEY (to_location_id) REFERENCES locations(id) ON DELETE SET NULL;

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE locations;
ALTER PUBLICATION supabase_realtime ADD TABLE location_utilities;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE locations IS 'Venues, offices, warehouses, studios, and facilities';
COMMENT ON TABLE site_maps IS 'Floor plans, site maps, and technical drawings';
COMMENT ON TABLE location_access IS 'Access control points and security checkpoints';
COMMENT ON TABLE location_utilities IS 'Utilities and infrastructure (power, internet, HVAC)';
