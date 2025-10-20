-- =============================================
-- FILES & COMPANIES MODULES
-- Migration: 006
-- =============================================

-- =============================================
-- FILES MODULE
-- =============================================

-- File Categories
CREATE TABLE file_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    parent_id UUID REFERENCES file_categories(id) ON DELETE SET NULL,
    icon TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workspace_id, slug)
);

-- Files
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- MIME type
    category_id UUID REFERENCES file_categories(id) ON DELETE SET NULL,
    
    -- Storage (Supabase Storage path)
    storage_path TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    checksum TEXT,
    
    -- Classification
    file_type TEXT CHECK (file_type IN (
        'contract', 'rider', 'tech_spec', 'drawing', 'call_sheet',
        'insurance', 'permit', 'media', 'report', 'other'
    )),
    
    -- Relationships
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    -- Versioning
    version INTEGER DEFAULT 1,
    parent_file_id UUID REFERENCES files(id) ON DELETE SET NULL,
    is_latest BOOLEAN DEFAULT true,
    
    -- Access
    is_shared BOOLEAN DEFAULT false,
    shared_with UUID[] DEFAULT '{}',
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- File Versions
CREATE TABLE file_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    
    version INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    
    changes_description TEXT,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(file_id, version)
);

-- =============================================
-- COMPANIES MODULE
-- =============================================

-- Companies (Vendors, Clients, Partners)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    legal_name TEXT,
    type TEXT CHECK (type IN ('vendor', 'client', 'partner', 'supplier', 'contractor')),
    industry TEXT,
    
    -- Contact
    email TEXT,
    phone TEXT,
    website TEXT,
    
    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT,
    
    -- Financial
    tax_id TEXT,
    payment_terms TEXT,
    currency TEXT DEFAULT 'USD',
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Company Contacts
CREATE TABLE company_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    title TEXT,
    role TEXT,
    
    email TEXT,
    phone TEXT,
    is_primary BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scopes of Work
CREATE TABLE scopes_of_work (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    deliverables TEXT[] DEFAULT '{}',
    
    start_date DATE,
    end_date DATE,
    
    value DECIMAL(12, 2),
    currency TEXT DEFAULT 'USD',
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'pending_approval', 'approved', 'in_progress', 'completed', 'cancelled'
    )),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bids & Quotes
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    title TEXT NOT NULL,
    description TEXT,
    
    bid_amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    submitted_date TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'accepted', 'rejected', 'expired'
    )),
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Files
CREATE INDEX idx_files_workspace ON files(workspace_id);
CREATE INDEX idx_files_category ON files(category_id);
CREATE INDEX idx_files_production ON files(production_id);
CREATE INDEX idx_files_event ON files(event_id);
CREATE INDEX idx_files_status ON files(status);
CREATE INDEX idx_files_uploader ON files(uploaded_by);
CREATE INDEX idx_file_versions_file ON file_versions(file_id);

-- Companies
CREATE INDEX idx_companies_workspace ON companies(workspace_id);
CREATE INDEX idx_companies_type ON companies(type);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_company_contacts_company ON company_contacts(company_id);
CREATE INDEX idx_sow_workspace ON scopes_of_work(workspace_id);
CREATE INDEX idx_sow_company ON scopes_of_work(company_id);
CREATE INDEX idx_sow_production ON scopes_of_work(production_id);
CREATE INDEX idx_bids_workspace ON bids(workspace_id);
CREATE INDEX idx_bids_company ON bids(company_id);

-- =============================================
-- FULL-TEXT SEARCH
-- =============================================

CREATE INDEX idx_files_search ON files 
    USING GIN (to_tsvector('english', 
        name || ' ' || COALESCE(description, '')
    ));

CREATE INDEX idx_companies_search ON companies 
    USING GIN (to_tsvector('english', 
        name || ' ' || COALESCE(legal_name, '')
    ));

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_files_updated_at
    BEFORE UPDATE ON files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sow_updated_at
    BEFORE UPDATE ON scopes_of_work
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE file_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scopes_of_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- File policies
CREATE POLICY "Users can view files in their workspaces"
    ON files FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage files in their workspaces"
    ON files FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

-- Company policies
CREATE POLICY "Users can view companies in their workspaces"
    ON companies FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage companies in their workspaces"
    ON companies FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

-- Update foreign keys for vendor references
ALTER TABLE assets ADD CONSTRAINT fk_assets_vendor 
    FOREIGN KEY (vendor_id) REFERENCES companies(id) ON DELETE SET NULL;

ALTER TABLE asset_maintenance ADD CONSTRAINT fk_asset_maint_vendor 
    FOREIGN KEY (vendor_id) REFERENCES companies(id) ON DELETE SET NULL;

ALTER TABLE location_utilities ADD CONSTRAINT fk_location_utils_vendor 
    FOREIGN KEY (vendor_id) REFERENCES companies(id) ON DELETE SET NULL;

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE files;
ALTER PUBLICATION supabase_realtime ADD TABLE companies;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE files IS 'Document management - contracts, riders, media, reports';
COMMENT ON TABLE companies IS 'Vendors, clients, partners, and suppliers';
COMMENT ON TABLE scopes_of_work IS 'Work scopes and deliverables for vendors';
COMMENT ON TABLE bids IS 'Bids and quotes from vendors';
