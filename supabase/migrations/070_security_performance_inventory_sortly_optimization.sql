-- =============================================
-- INVENTORY MODULE OPTIMIZATION - Sortly Competitive Features
-- Migration: 20251015010000
-- 
-- Enhancements:
-- 1. Photo management (up to 8 photos per item)
-- 2. Barcode/QR code support with generation
-- 3. Folder/subfolder organization by location
-- 4. Low stock alerts and thresholds
-- 5. Enhanced custom fields
-- 6. Location-based tracking
-- 7. Item variants and conditions
-- 8. Stock movement history
-- 9. Export-ready views
-- =============================================

-- =============================================
-- INVENTORY FOLDERS (Location-based organization)
-- =============================================

CREATE TABLE inventory_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Folder hierarchy
    name TEXT NOT NULL,
    description TEXT,
    parent_folder_id UUID REFERENCES inventory_folders(id) ON DELETE CASCADE,
    folder_path TEXT, -- Computed path like "Warehouse/Section A/Shelf 1"
    
    -- Location association
    location_id UUID, -- References locations(id)
    location_name TEXT,
    
    -- Visual
    color TEXT,
    icon TEXT,
    
    -- Metadata
    item_count INTEGER DEFAULT 0,
    total_value DECIMAL(12, 2) DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT folder_path_unique UNIQUE (workspace_id, folder_path)
);

-- =============================================
-- INVENTORY ITEMS (Enhanced asset inventory)
-- =============================================

CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Link to asset if applicable
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    
    -- Folder organization
    folder_id UUID REFERENCES inventory_folders(id) ON DELETE SET NULL,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    item_number TEXT, -- Internal item number
    
    -- Identification (Barcode/QR)
    barcode TEXT,
    qr_code TEXT, -- Generated QR code data
    barcode_type TEXT CHECK (barcode_type IN (
        'upc', 'ean', 'code128', 'qr', 'custom'
    )),
    
    -- Photos (up to 8)
    photos TEXT[] DEFAULT '{}', -- Array of storage URLs
    primary_photo_index INTEGER DEFAULT 0,
    
    -- Stock Management
    sku TEXT,
    stock_quantity INTEGER DEFAULT 0,
    unit_of_measure TEXT DEFAULT 'each',
    low_stock_threshold INTEGER,
    reorder_quantity INTEGER,
    reorder_point INTEGER,
    
    -- Location tracking
    location_id UUID, -- Current location
    location_name TEXT,
    zone TEXT, -- Specific zone/area within location
    
    -- Financial
    unit_cost DECIMAL(10, 2),
    total_value DECIMAL(12, 2) GENERATED ALWAYS AS (stock_quantity * COALESCE(unit_cost, 0)) STORED,
    
    -- Categorization
    category TEXT,
    subcategory TEXT,
    manufacturer TEXT,
    model_number TEXT,
    
    -- Item variants
    variant_of UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
    variant_attributes JSONB DEFAULT '{}'::jsonb, -- size, color, etc.
    
    -- Condition tracking
    condition TEXT CHECK (condition IN ('new', 'excellent', 'good', 'fair', 'poor', 'damaged')),
    condition_notes TEXT,
    last_inspected_at TIMESTAMPTZ,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'in_stock' CHECK (status IN (
        'in_stock', 'low_stock', 'out_of_stock', 'on_order', 'reserved', 'discontinued'
    )),
    
    -- Alert preferences
    enable_low_stock_alert BOOLEAN DEFAULT true,
    alert_contacts TEXT[], -- User IDs to notify
    
    -- Custom fields (flexible attributes)
    custom_fields JSONB DEFAULT '{}'::jsonb,
    tags TEXT[] DEFAULT '{}',
    
    -- Metadata
    notes TEXT,
    last_counted_at TIMESTAMPTZ,
    last_counted_by UUID REFERENCES auth.users(id),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- STOCK MOVEMENTS (Track all inventory changes)
-- =============================================

CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    
    -- Movement details
    movement_type TEXT NOT NULL CHECK (movement_type IN (
        'receive', 'issue', 'transfer', 'adjustment', 'count', 'return', 'loss', 'damage'
    )),
    
    quantity INTEGER NOT NULL,
    quantity_before INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    
    -- Location tracking
    from_location_id UUID,
    to_location_id UUID,
    from_folder_id UUID REFERENCES inventory_folders(id),
    to_folder_id UUID REFERENCES inventory_folders(id),
    
    -- Reference documents
    reference_type TEXT, -- 'purchase_order', 'work_order', 'production', etc.
    reference_id UUID,
    
    -- Cost tracking
    unit_cost DECIMAL(10, 2),
    total_cost DECIMAL(12, 2),
    
    -- Movement reason
    reason TEXT,
    notes TEXT,
    
    -- Performed by
    performed_by UUID NOT NULL REFERENCES auth.users(id),
    performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INVENTORY COUNTS (Cycle counts and audits)
-- =============================================

CREATE TABLE inventory_counts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Count details
    count_name TEXT NOT NULL,
    count_type TEXT NOT NULL CHECK (count_type IN (
        'full', 'cycle', 'spot', 'location', 'category'
    )),
    
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN (
        'planned', 'in_progress', 'completed', 'cancelled'
    )),
    
    -- Scope
    folder_id UUID REFERENCES inventory_folders(id), -- If counting specific folder
    location_id UUID, -- If counting specific location
    category TEXT, -- If counting specific category
    
    -- Schedule
    scheduled_date DATE,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Results
    total_items_counted INTEGER DEFAULT 0,
    discrepancies_found INTEGER DEFAULT 0,
    
    -- Team
    assigned_to UUID[] DEFAULT '{}',
    completed_by UUID REFERENCES auth.users(id),
    
    notes TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- COUNT LINE ITEMS
-- =============================================

CREATE TABLE count_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    count_id UUID NOT NULL REFERENCES inventory_counts(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    
    -- Count data
    expected_quantity INTEGER,
    counted_quantity INTEGER,
    variance INTEGER GENERATED ALWAYS AS (COALESCE(counted_quantity, 0) - COALESCE(expected_quantity, 0)) STORED,
    
    -- Condition assessment
    condition_recorded TEXT,
    
    -- Photos during count
    count_photos TEXT[] DEFAULT '{}',
    
    notes TEXT,
    counted_by UUID REFERENCES auth.users(id),
    counted_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- LOW STOCK ALERTS
-- =============================================

CREATE TABLE inventory_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    
    alert_type TEXT NOT NULL CHECK (alert_type IN (
        'low_stock', 'out_of_stock', 'overstock', 'expiring', 'damaged'
    )),
    
    severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN (
        'info', 'warning', 'critical'
    )),
    
    message TEXT NOT NULL,
    
    -- Alert status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'active', 'acknowledged', 'resolved', 'dismissed'
    )),
    
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Inventory Folders
CREATE INDEX idx_inventory_folders_workspace ON inventory_folders(workspace_id);
CREATE INDEX idx_inventory_folders_parent ON inventory_folders(parent_folder_id);
CREATE INDEX idx_inventory_folders_location ON inventory_folders(location_id);

-- Inventory Items
CREATE INDEX idx_inventory_items_workspace ON inventory_items(workspace_id);
CREATE INDEX idx_inventory_items_folder ON inventory_items(folder_id);
CREATE INDEX idx_inventory_items_asset ON inventory_items(asset_id);
CREATE INDEX idx_inventory_items_barcode ON inventory_items(barcode);
CREATE INDEX idx_inventory_items_qr_code ON inventory_items(qr_code);
CREATE INDEX idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX idx_inventory_items_status ON inventory_items(status);
CREATE INDEX idx_inventory_items_category ON inventory_items(category);
CREATE INDEX idx_inventory_items_location ON inventory_items(location_id);
CREATE INDEX idx_inventory_items_variant ON inventory_items(variant_of);

-- Stock Movements
CREATE INDEX idx_stock_movements_workspace ON stock_movements(workspace_id);
CREATE INDEX idx_stock_movements_item ON stock_movements(inventory_item_id);
CREATE INDEX idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX idx_stock_movements_date ON stock_movements(performed_at);
CREATE INDEX idx_stock_movements_from_location ON stock_movements(from_location_id);
CREATE INDEX idx_stock_movements_to_location ON stock_movements(to_location_id);

-- Inventory Counts
CREATE INDEX idx_inventory_counts_workspace ON inventory_counts(workspace_id);
CREATE INDEX idx_inventory_counts_status ON inventory_counts(status);
CREATE INDEX idx_inventory_counts_scheduled ON inventory_counts(scheduled_date);
CREATE INDEX idx_inventory_counts_folder ON inventory_counts(folder_id);

-- Count Line Items
CREATE INDEX idx_count_line_items_count ON count_line_items(count_id);
CREATE INDEX idx_count_line_items_item ON count_line_items(inventory_item_id);

-- Alerts
CREATE INDEX idx_inventory_alerts_workspace ON inventory_alerts(workspace_id);
CREATE INDEX idx_inventory_alerts_item ON inventory_alerts(inventory_item_id);
CREATE INDEX idx_inventory_alerts_type ON inventory_alerts(alert_type);
CREATE INDEX idx_inventory_alerts_status ON inventory_alerts(status);

-- =============================================
-- FULL-TEXT SEARCH
-- =============================================

CREATE INDEX idx_inventory_items_search ON inventory_items 
    USING GIN (to_tsvector('english', 
        name || ' ' || 
        COALESCE(description, '') || ' ' || 
        COALESCE(item_number, '') || ' ' ||
        COALESCE(sku, '') || ' ' ||
        COALESCE(barcode, '')
    ));

CREATE INDEX idx_inventory_folders_search ON inventory_folders 
    USING GIN (to_tsvector('english', 
        name || ' ' || COALESCE(description, '')
    ));

-- =============================================
-- TRIGGERS
-- =============================================

-- Update timestamps
CREATE TRIGGER update_inventory_folders_updated_at
    BEFORE UPDATE ON inventory_folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_inventory_items_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_inventory_counts_updated_at
    BEFORE UPDATE ON inventory_counts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Auto-update folder path
CREATE OR REPLACE FUNCTION update_folder_path()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_folder_id IS NULL THEN
        NEW.folder_path := NEW.name;
    ELSE
        SELECT folder_path || '/' || NEW.name INTO NEW.folder_path
        FROM inventory_folders
        WHERE id = NEW.parent_folder_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_folder_path
    BEFORE INSERT OR UPDATE ON inventory_folders
    FOR EACH ROW
    EXECUTE FUNCTION update_folder_path();

-- Auto-update folder item counts
CREATE OR REPLACE FUNCTION update_folder_item_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update old folder count
    IF TG_OP = 'UPDATE' AND OLD.folder_id IS NOT NULL AND OLD.folder_id != NEW.folder_id THEN
        UPDATE inventory_folders
        SET item_count = item_count - 1
        WHERE id = OLD.folder_id;
    ELSIF TG_OP = 'DELETE' AND OLD.folder_id IS NOT NULL THEN
        UPDATE inventory_folders
        SET item_count = item_count - 1
        WHERE id = OLD.folder_id;
    END IF;
    
    -- Update new folder count
    IF TG_OP = 'INSERT' AND NEW.folder_id IS NOT NULL THEN
        UPDATE inventory_folders
        SET item_count = item_count + 1
        WHERE id = NEW.folder_id;
    ELSIF TG_OP = 'UPDATE' AND NEW.folder_id IS NOT NULL THEN
        UPDATE inventory_folders
        SET item_count = item_count + 1
        WHERE id = NEW.folder_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_folder_counts
    AFTER INSERT OR UPDATE OR DELETE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_folder_item_count();

-- Auto-update item status based on stock level
CREATE OR REPLACE FUNCTION update_item_status_on_stock_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_quantity = 0 THEN
        NEW.status := 'out_of_stock';
    ELSIF NEW.low_stock_threshold IS NOT NULL AND NEW.stock_quantity <= NEW.low_stock_threshold THEN
        NEW.status := 'low_stock';
    ELSIF NEW.status IN ('out_of_stock', 'low_stock') THEN
        NEW.status := 'in_stock';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_item_status
    BEFORE INSERT OR UPDATE OF stock_quantity ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_item_status_on_stock_change();

-- Create alert when stock is low
CREATE OR REPLACE FUNCTION create_low_stock_alert()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create alert if enabled and stock is now low
    IF NEW.enable_low_stock_alert = true 
       AND NEW.low_stock_threshold IS NOT NULL 
       AND NEW.stock_quantity <= NEW.low_stock_threshold
       AND (TG_OP = 'INSERT' OR OLD.stock_quantity > OLD.low_stock_threshold) THEN
        
        INSERT INTO inventory_alerts (
            workspace_id,
            inventory_item_id,
            alert_type,
            severity,
            message
        ) VALUES (
            NEW.workspace_id,
            NEW.id,
            CASE 
                WHEN NEW.stock_quantity = 0 THEN 'out_of_stock'
                ELSE 'low_stock'
            END,
            CASE 
                WHEN NEW.stock_quantity = 0 THEN 'critical'
                ELSE 'warning'
            END,
            CASE 
                WHEN NEW.stock_quantity = 0 THEN 
                    'Item "' || NEW.name || '" is out of stock'
                ELSE 
                    'Item "' || NEW.name || '" is low on stock (' || NEW.stock_quantity || ' remaining, threshold: ' || NEW.low_stock_threshold || ')'
            END
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_alert_on_low_stock
    AFTER INSERT OR UPDATE OF stock_quantity ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION create_low_stock_alert();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE inventory_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE count_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

-- Standard workspace policies for all tables
CREATE POLICY "Users can view inventory folders in their workspaces"
    ON inventory_folders FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage inventory folders in their workspaces"
    ON inventory_folders FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view inventory items in their workspaces"
    ON inventory_items FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage inventory items in their workspaces"
    ON inventory_items FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view stock movements in their workspaces"
    ON stock_movements FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage stock movements in their workspaces"
    ON stock_movements FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view inventory counts in their workspaces"
    ON inventory_counts FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage inventory counts in their workspaces"
    ON inventory_counts FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view count line items in their workspaces"
    ON count_line_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM inventory_counts 
        WHERE inventory_counts.id = count_line_items.count_id
        AND inventory_counts.workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Users can manage count line items in their workspaces"
    ON count_line_items FOR ALL
    USING (EXISTS (
        SELECT 1 FROM inventory_counts 
        WHERE inventory_counts.id = count_line_items.count_id
        AND inventory_counts.workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Users can view inventory alerts in their workspaces"
    ON inventory_alerts FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage inventory alerts in their workspaces"
    ON inventory_alerts FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE inventory_folders;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory_items;
ALTER PUBLICATION supabase_realtime ADD TABLE stock_movements;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory_counts;
ALTER PUBLICATION supabase_realtime ADD TABLE count_line_items;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory_alerts;

-- =============================================
-- VIEWS FOR REPORTING
-- =============================================

-- Current inventory valuation by folder
CREATE VIEW inventory_valuation_by_folder AS
SELECT 
    f.id as folder_id,
    f.name as folder_name,
    f.folder_path,
    f.workspace_id,
    COUNT(i.id) as item_count,
    SUM(i.stock_quantity) as total_quantity,
    SUM(i.total_value) as total_value
FROM inventory_folders f
LEFT JOIN inventory_items i ON i.folder_id = f.id
GROUP BY f.id, f.name, f.folder_path, f.workspace_id;

-- Items requiring attention (low stock, out of stock, damaged)
CREATE VIEW items_requiring_attention AS
SELECT 
    i.*,
    CASE 
        WHEN i.stock_quantity = 0 THEN 'out_of_stock'
        WHEN i.stock_quantity <= i.low_stock_threshold THEN 'low_stock'
        WHEN i.condition IN ('poor', 'damaged') THEN 'damaged'
        ELSE 'ok'
    END as attention_reason
FROM inventory_items i
WHERE i.stock_quantity = 0 
   OR (i.low_stock_threshold IS NOT NULL AND i.stock_quantity <= i.low_stock_threshold)
   OR i.condition IN ('poor', 'damaged');

-- Stock movement summary by item
CREATE VIEW stock_movement_summary AS
SELECT 
    sm.inventory_item_id,
    i.name as item_name,
    i.workspace_id,
    COUNT(*) as movement_count,
    SUM(CASE WHEN sm.movement_type = 'receive' THEN sm.quantity ELSE 0 END) as total_received,
    SUM(CASE WHEN sm.movement_type = 'issue' THEN sm.quantity ELSE 0 END) as total_issued,
    SUM(CASE WHEN sm.movement_type = 'adjustment' THEN sm.quantity ELSE 0 END) as total_adjustments,
    MAX(sm.performed_at) as last_movement_at
FROM stock_movements sm
JOIN inventory_items i ON i.id = sm.inventory_item_id
GROUP BY sm.inventory_item_id, i.name, i.workspace_id;

-- Active alerts summary
CREATE VIEW active_alerts_summary AS
SELECT 
    a.workspace_id,
    a.alert_type,
    a.severity,
    COUNT(*) as alert_count,
    MIN(a.created_at) as oldest_alert_at
FROM inventory_alerts a
WHERE a.status = 'active'
GROUP BY a.workspace_id, a.alert_type, a.severity;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE inventory_folders IS 'Hierarchical folder structure for organizing inventory by location, type, etc.';
COMMENT ON TABLE inventory_items IS 'Enhanced inventory items with photo support, barcode/QR, and detailed tracking';
COMMENT ON TABLE stock_movements IS 'Complete history of all inventory stock movements and transactions';
COMMENT ON TABLE inventory_counts IS 'Physical inventory counts, cycle counts, and audits';
COMMENT ON TABLE count_line_items IS 'Individual line items counted during inventory counts';
COMMENT ON TABLE inventory_alerts IS 'Automated alerts for low stock, out of stock, and other inventory conditions';

COMMENT ON VIEW inventory_valuation_by_folder IS 'Current inventory value grouped by folder';
COMMENT ON VIEW items_requiring_attention IS 'Items that need attention (low stock, out of stock, damaged)';
COMMENT ON VIEW stock_movement_summary IS 'Summary of stock movements by item';
COMMENT ON VIEW active_alerts_summary IS 'Summary of active inventory alerts';
