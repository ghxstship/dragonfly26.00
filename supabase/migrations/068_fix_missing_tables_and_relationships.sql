-- =============================================
-- FIX MISSING TABLES AND RELATIONSHIPS
-- Migration: 068
-- Date: 2025-10-15
-- =============================================
-- This migration adds missing tables that are referenced in the UI:
-- 1. location_bim_models - BIM Models for locations
-- 2. location_bim_clashes - Clash detection and coordination issues
-- 3. location_features - Spatial features and GIS layers
-- 4. file_folders - File organization system
-- =============================================

-- =============================================
-- LOCATION BIM MODELS
-- =============================================

CREATE TABLE location_bim_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    model_type TEXT CHECK (model_type IN (
        'architectural', 'structural', 'mechanical', 'electrical', 
        'plumbing', 'site', 'interior', 'other'
    )),
    
    -- File Reference
    file_id UUID REFERENCES files(id) ON DELETE SET NULL,
    file_format TEXT, -- e.g., 'IFC', 'RVT', 'DWG', 'OBJ'
    file_size_bytes BIGINT,
    
    -- Model Properties
    lod TEXT, -- Level of Detail: LOD100, LOD200, etc.
    discipline TEXT,
    trade TEXT,
    
    -- Version Control
    version TEXT,
    revision TEXT,
    is_latest BOOLEAN DEFAULT true,
    parent_model_id UUID REFERENCES location_bim_models(id) ON DELETE SET NULL,
    
    -- Dates
    model_date DATE,
    uploaded_date TIMESTAMPTZ DEFAULT NOW(),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'active', 'archived', 'superseded', 'under_review'
    )),
    
    -- Metadata
    coordinate_system TEXT,
    units TEXT DEFAULT 'imperial',
    bounding_box JSONB, -- {minX, minY, minZ, maxX, maxY, maxZ}
    custom_properties JSONB DEFAULT '{}'::jsonb,
    tags TEXT[] DEFAULT '{}',
    
    -- Audit
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- LOCATION BIM CLASHES (COORDINATION)
-- =============================================

CREATE TABLE location_bim_clashes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Clash Details
    clash_name TEXT NOT NULL,
    clash_type TEXT NOT NULL CHECK (clash_type IN (
        'hard_clash', 'soft_clash', 'clearance_clash', 
        'duplicate_clash', 'workflow_clash'
    )),
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN (
        'critical', 'high', 'medium', 'low', 'info'
    )),
    
    -- Models Involved
    model_a_id UUID REFERENCES location_bim_models(id) ON DELETE SET NULL,
    model_b_id UUID REFERENCES location_bim_models(id) ON DELETE SET NULL,
    
    -- Elements Involved
    element_a_id TEXT, -- Element ID in BIM model
    element_a_type TEXT,
    element_b_id TEXT,
    element_b_type TEXT,
    
    -- Spatial Info
    clash_point JSONB, -- {x, y, z} coordinates
    clash_distance DECIMAL(10, 4), -- Distance/clearance in model units
    
    -- Resolution
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
        'new', 'active', 'reviewing', 'approved', 'resolved', 
        'rejected', 'deferred'
    )),
    resolution_type TEXT CHECK (resolution_type IN (
        'design_change', 'tolerance_acceptable', 'false_positive', 
        'field_coordination', 'other'
    )),
    resolution_notes TEXT,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ,
    
    -- Assignment
    assigned_to UUID REFERENCES auth.users(id),
    assigned_discipline TEXT,
    due_date DATE,
    
    -- Detection Info
    detected_date TIMESTAMPTZ DEFAULT NOW(),
    detection_run_id UUID, -- Reference to clash detection batch
    
    -- Metadata
    priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    -- Audit
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- LOCATION FEATURES (SPATIAL/GIS)
-- =============================================

CREATE TABLE location_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Feature Info
    name TEXT NOT NULL,
    description TEXT,
    feature_type TEXT NOT NULL CHECK (feature_type IN (
        'point', 'line', 'polygon', 'multipoint', 
        'multiline', 'multipolygon', 'circle', 'rectangle'
    )),
    
    -- Category
    category TEXT CHECK (category IN (
        'boundary', 'building', 'parking', 'landscape', 
        'infrastructure', 'utility', 'zone', 'annotation', 'other'
    )),
    layer_name TEXT,
    
    -- Geometry (GeoJSON format)
    geometry JSONB NOT NULL,
    -- Example: {"type": "Point", "coordinates": [-122.4194, 37.7749]}
    -- Example: {"type": "Polygon", "coordinates": [[[lng1, lat1], [lng2, lat2], ...]]}
    
    -- Properties
    area DECIMAL(15, 4), -- Square units
    perimeter DECIMAL(15, 4), -- Linear units
    elevation DECIMAL(10, 4),
    
    -- Style
    stroke_color TEXT DEFAULT '#3388ff',
    stroke_width INTEGER DEFAULT 3,
    stroke_opacity DECIMAL(3, 2) DEFAULT 1.0,
    fill_color TEXT DEFAULT '#3388ff',
    fill_opacity DECIMAL(3, 2) DEFAULT 0.2,
    
    -- Behavior
    is_visible BOOLEAN DEFAULT true,
    is_interactive BOOLEAN DEFAULT true,
    z_index INTEGER DEFAULT 1,
    
    -- Relationships
    parent_feature_id UUID REFERENCES location_features(id) ON DELETE SET NULL,
    related_asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'active', 'inactive', 'proposed', 'archived'
    )),
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    properties JSONB DEFAULT '{}'::jsonb, -- Custom properties
    
    -- Audit
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- FILE FOLDERS
-- =============================================

CREATE TABLE file_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Folder Info
    name TEXT NOT NULL,
    description TEXT,
    
    -- Hierarchy
    parent_folder_id UUID REFERENCES file_folders(id) ON DELETE CASCADE,
    path TEXT, -- Computed path like '/Documents/Contracts/2024'
    level INTEGER DEFAULT 0, -- Depth in hierarchy
    
    -- Relationships
    production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Access Control
    is_shared BOOLEAN DEFAULT false,
    shared_with UUID[] DEFAULT '{}',
    permissions JSONB DEFAULT '{}'::jsonb,
    
    -- Properties
    color TEXT, -- For UI visualization
    icon TEXT, -- Icon identifier
    is_favorite BOOLEAN DEFAULT false,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'active', 'archived', 'deleted'
    )),
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    -- Stats (can be computed)
    file_count INTEGER DEFAULT 0,
    total_size_bytes BIGINT DEFAULT 0,
    
    -- Audit
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add folder reference to files table
ALTER TABLE files 
ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES file_folders(id) ON DELETE SET NULL;

-- =============================================
-- INDEXES
-- =============================================

-- BIM Models
CREATE INDEX idx_location_bim_models_location ON location_bim_models(location_id);
CREATE INDEX idx_location_bim_models_workspace ON location_bim_models(workspace_id);
CREATE INDEX idx_location_bim_models_status ON location_bim_models(status);
CREATE INDEX idx_location_bim_models_type ON location_bim_models(model_type);
CREATE INDEX idx_location_bim_models_latest ON location_bim_models(is_latest);

-- BIM Clashes
CREATE INDEX idx_location_bim_clashes_location ON location_bim_clashes(location_id);
CREATE INDEX idx_location_bim_clashes_workspace ON location_bim_clashes(workspace_id);
CREATE INDEX idx_location_bim_clashes_status ON location_bim_clashes(status);
CREATE INDEX idx_location_bim_clashes_severity ON location_bim_clashes(severity);
CREATE INDEX idx_location_bim_clashes_assigned ON location_bim_clashes(assigned_to);
CREATE INDEX idx_location_bim_clashes_model_a ON location_bim_clashes(model_a_id);
CREATE INDEX idx_location_bim_clashes_model_b ON location_bim_clashes(model_b_id);
CREATE INDEX idx_location_bim_clashes_due_date ON location_bim_clashes(due_date);

-- Location Features
CREATE INDEX idx_location_features_location ON location_features(location_id);
CREATE INDEX idx_location_features_workspace ON location_features(workspace_id);
CREATE INDEX idx_location_features_type ON location_features(feature_type);
CREATE INDEX idx_location_features_category ON location_features(category);
CREATE INDEX idx_location_features_status ON location_features(status);
CREATE INDEX idx_location_features_visible ON location_features(is_visible);
CREATE INDEX idx_location_features_parent ON location_features(parent_feature_id);

-- File Folders
CREATE INDEX idx_file_folders_workspace ON file_folders(workspace_id);
CREATE INDEX idx_file_folders_parent ON file_folders(parent_folder_id);
CREATE INDEX idx_file_folders_status ON file_folders(status);
CREATE INDEX idx_file_folders_production ON file_folders(production_id);
CREATE INDEX idx_file_folders_event ON file_folders(event_id);
CREATE INDEX idx_file_folders_location ON file_folders(location_id);
CREATE INDEX idx_file_folders_company ON file_folders(company_id);
CREATE INDEX idx_file_folders_path ON file_folders(path);

-- Files folder reference
CREATE INDEX idx_files_folder ON files(folder_id);

-- =============================================
-- FULL-TEXT SEARCH
-- =============================================

CREATE INDEX idx_location_bim_models_search ON location_bim_models 
    USING GIN (to_tsvector('english', 
        name || ' ' || COALESCE(description, '')
    ));

CREATE INDEX idx_location_bim_clashes_search ON location_bim_clashes 
    USING GIN (to_tsvector('english', 
        clash_name || ' ' || COALESCE(resolution_notes, '')
    ));

CREATE INDEX idx_location_features_search ON location_features 
    USING GIN (to_tsvector('english', 
        name || ' ' || COALESCE(description, '')
    ));

CREATE INDEX idx_file_folders_search ON file_folders 
    USING GIN (to_tsvector('english', 
        name || ' ' || COALESCE(description, '')
    ));

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_location_bim_models_updated_at
    BEFORE UPDATE ON location_bim_models
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_location_bim_clashes_updated_at
    BEFORE UPDATE ON location_bim_clashes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_location_features_updated_at
    BEFORE UPDATE ON location_features
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_file_folders_updated_at
    BEFORE UPDATE ON file_folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Auto-compute folder path
CREATE OR REPLACE FUNCTION compute_folder_path()
RETURNS TRIGGER AS $$
DECLARE
    parent_path TEXT;
BEGIN
    IF NEW.parent_folder_id IS NULL THEN
        NEW.path = '/' || NEW.name;
        NEW.level = 0;
    ELSE
        SELECT path, level INTO parent_path, NEW.level 
        FROM file_folders 
        WHERE id = NEW.parent_folder_id;
        
        NEW.path = parent_path || '/' || NEW.name;
        NEW.level = NEW.level + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_compute_folder_path
    BEFORE INSERT OR UPDATE OF parent_folder_id, name ON file_folders
    FOR EACH ROW
    EXECUTE FUNCTION compute_folder_path();

-- Update folder stats when files are added/removed
CREATE OR REPLACE FUNCTION update_folder_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update old folder
    IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.folder_id IS NOT NULL) THEN
        UPDATE file_folders
        SET 
            file_count = (SELECT COUNT(*) FROM files WHERE folder_id = OLD.folder_id AND status != 'deleted'),
            total_size_bytes = (SELECT COALESCE(SUM(size_bytes), 0) FROM files WHERE folder_id = OLD.folder_id AND status != 'deleted')
        WHERE id = OLD.folder_id;
    END IF;
    
    -- Update new folder
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.folder_id IS NOT NULL) THEN
        UPDATE file_folders
        SET 
            file_count = (SELECT COUNT(*) FROM files WHERE folder_id = NEW.folder_id AND status != 'deleted'),
            total_size_bytes = (SELECT COALESCE(SUM(size_bytes), 0) FROM files WHERE folder_id = NEW.folder_id AND status != 'deleted')
        WHERE id = NEW.folder_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_folder_stats
    AFTER INSERT OR UPDATE OF folder_id, status, size_bytes OR DELETE ON files
    FOR EACH ROW
    EXECUTE FUNCTION update_folder_stats();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE location_bim_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_bim_clashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_folders ENABLE ROW LEVEL SECURITY;

-- BIM Models policies
CREATE POLICY "Users can view BIM models in their workspaces"
    ON location_bim_models FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage BIM models in their workspaces"
    ON location_bim_models FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

-- BIM Clashes policies
CREATE POLICY "Users can view BIM clashes in their workspaces"
    ON location_bim_clashes FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage BIM clashes in their workspaces"
    ON location_bim_clashes FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

-- Location Features policies
CREATE POLICY "Users can view location features in their workspaces"
    ON location_features FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage location features in their workspaces"
    ON location_features FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

-- File Folders policies
CREATE POLICY "Users can view file folders in their workspaces"
    ON file_folders FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

CREATE POLICY "Users can manage file folders in their workspaces"
    ON file_folders FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
        )
    ));

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE location_bim_models;
ALTER PUBLICATION supabase_realtime ADD TABLE location_bim_clashes;
ALTER PUBLICATION supabase_realtime ADD TABLE location_features;
ALTER PUBLICATION supabase_realtime ADD TABLE file_folders;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE location_bim_models IS 'BIM models (IFC, RVT, etc.) linked to locations';
COMMENT ON TABLE location_bim_clashes IS 'BIM clash detection results and coordination issues';
COMMENT ON TABLE location_features IS 'Spatial features, GIS layers, and map annotations';
COMMENT ON TABLE file_folders IS 'Hierarchical folder structure for file organization';

COMMENT ON COLUMN location_bim_models.lod IS 'Level of Detail (LOD100, LOD200, LOD300, LOD400, LOD500)';
COMMENT ON COLUMN location_bim_models.bounding_box IS 'Model extents in 3D space';
COMMENT ON COLUMN location_bim_clashes.clash_type IS 'Type of clash: hard (physical), soft (tolerance), clearance, duplicate, or workflow';
COMMENT ON COLUMN location_features.geometry IS 'GeoJSON geometry object';
COMMENT ON COLUMN file_folders.path IS 'Computed full path from root';
