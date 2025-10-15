-- =============================================
-- INVENTORY MODULE FUNCTIONS
-- Migration: 20251015020000
--
-- Database functions for inventory operations:
-- 1. Stock adjustments and movements
-- 2. Barcode/QR search and lookup
-- 3. Inventory reports and exports
-- 4. Batch operations
-- =============================================

-- =============================================
-- STOCK ADJUSTMENT FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION adjust_inventory_stock(
    p_inventory_item_id UUID,
    p_quantity_change INTEGER,
    p_movement_type TEXT,
    p_reason TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT auth.uid(),
    p_reference_type TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_to_location_id UUID DEFAULT NULL,
    p_to_folder_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_workspace_id UUID;
    v_current_quantity INTEGER;
    v_new_quantity INTEGER;
    v_movement_id UUID;
BEGIN
    -- Get current item details
    SELECT workspace_id, stock_quantity 
    INTO v_workspace_id, v_current_quantity
    FROM inventory_items
    WHERE id = p_inventory_item_id;
    
    IF v_workspace_id IS NULL THEN
        RAISE EXCEPTION 'Inventory item not found';
    END IF;
    
    -- Calculate new quantity
    v_new_quantity := v_current_quantity + p_quantity_change;
    
    IF v_new_quantity < 0 THEN
        RAISE EXCEPTION 'Insufficient stock. Current: %, Requested: %', v_current_quantity, ABS(p_quantity_change);
    END IF;
    
    -- Update inventory item
    UPDATE inventory_items
    SET 
        stock_quantity = v_new_quantity,
        last_counted_at = NOW(),
        last_counted_by = p_user_id
    WHERE id = p_inventory_item_id;
    
    -- Record stock movement
    INSERT INTO stock_movements (
        workspace_id,
        inventory_item_id,
        movement_type,
        quantity,
        quantity_before,
        quantity_after,
        to_location_id,
        to_folder_id,
        reference_type,
        reference_id,
        reason,
        performed_by
    ) VALUES (
        v_workspace_id,
        p_inventory_item_id,
        p_movement_type,
        p_quantity_change,
        v_current_quantity,
        v_new_quantity,
        p_to_location_id,
        p_to_folder_id,
        p_reference_type,
        p_reference_id,
        p_reason,
        p_user_id
    ) RETURNING id INTO v_movement_id;
    
    -- Return result
    RETURN jsonb_build_object(
        'success', true,
        'movement_id', v_movement_id,
        'previous_quantity', v_current_quantity,
        'new_quantity', v_new_quantity,
        'change', p_quantity_change
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRANSFER STOCK BETWEEN LOCATIONS/FOLDERS
-- =============================================

CREATE OR REPLACE FUNCTION transfer_inventory_stock(
    p_inventory_item_id UUID,
    p_quantity INTEGER,
    p_from_location_id UUID DEFAULT NULL,
    p_to_location_id UUID DEFAULT NULL,
    p_from_folder_id UUID DEFAULT NULL,
    p_to_folder_id UUID DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS JSONB AS $$
DECLARE
    v_workspace_id UUID;
    v_current_quantity INTEGER;
    v_movement_id UUID;
BEGIN
    -- Get current item details
    SELECT workspace_id, stock_quantity 
    INTO v_workspace_id, v_current_quantity
    FROM inventory_items
    WHERE id = p_inventory_item_id;
    
    IF v_workspace_id IS NULL THEN
        RAISE EXCEPTION 'Inventory item not found';
    END IF;
    
    IF p_quantity > v_current_quantity THEN
        RAISE EXCEPTION 'Insufficient stock for transfer. Available: %, Requested: %', v_current_quantity, p_quantity;
    END IF;
    
    -- Update item location/folder if transferring all stock
    IF p_quantity = v_current_quantity THEN
        UPDATE inventory_items
        SET 
            location_id = COALESCE(p_to_location_id, location_id),
            folder_id = COALESCE(p_to_folder_id, folder_id)
        WHERE id = p_inventory_item_id;
    END IF;
    
    -- Record transfer movement
    INSERT INTO stock_movements (
        workspace_id,
        inventory_item_id,
        movement_type,
        quantity,
        quantity_before,
        quantity_after,
        from_location_id,
        to_location_id,
        from_folder_id,
        to_folder_id,
        notes,
        performed_by
    ) VALUES (
        v_workspace_id,
        p_inventory_item_id,
        'transfer',
        p_quantity,
        v_current_quantity,
        v_current_quantity, -- Quantity doesn't change in transfer
        p_from_location_id,
        p_to_location_id,
        p_from_folder_id,
        p_to_folder_id,
        p_notes,
        p_user_id
    ) RETURNING id INTO v_movement_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'movement_id', v_movement_id,
        'quantity_transferred', p_quantity
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SEARCH INVENTORY BY BARCODE/QR CODE
-- =============================================

CREATE OR REPLACE FUNCTION search_inventory_by_code(
    p_code TEXT,
    p_workspace_id UUID
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    barcode TEXT,
    qr_code TEXT,
    stock_quantity INTEGER,
    status TEXT,
    folder_id UUID,
    folder_name TEXT,
    location_name TEXT,
    primary_photo TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.name,
        i.description,
        i.barcode,
        i.qr_code,
        i.stock_quantity,
        i.status,
        i.folder_id,
        f.name as folder_name,
        i.location_name,
        CASE 
            WHEN i.photos IS NOT NULL AND array_length(i.photos, 1) > 0 
            THEN i.photos[i.primary_photo_index + 1]
            ELSE NULL
        END as primary_photo
    FROM inventory_items i
    LEFT JOIN inventory_folders f ON f.id = i.folder_id
    WHERE i.workspace_id = p_workspace_id
      AND (i.barcode = p_code OR i.qr_code = p_code);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- GENERATE QR CODE DATA FOR ITEM
-- =============================================

CREATE OR REPLACE FUNCTION generate_item_qr_code(
    p_inventory_item_id UUID
)
RETURNS TEXT AS $$
DECLARE
    v_qr_data TEXT;
    v_workspace_id UUID;
    v_item_number TEXT;
BEGIN
    -- Get item details
    SELECT workspace_id, item_number
    INTO v_workspace_id, v_item_number
    FROM inventory_items
    WHERE id = p_inventory_item_id;
    
    -- Generate QR code data (URL format for deep linking)
    v_qr_data := 'dragonfly://inventory/' || p_inventory_item_id || '?ws=' || v_workspace_id;
    
    -- Update item with QR code
    UPDATE inventory_items
    SET qr_code = v_qr_data
    WHERE id = p_inventory_item_id;
    
    RETURN v_qr_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- BATCH UPDATE INVENTORY PHOTOS
-- =============================================

CREATE OR REPLACE FUNCTION update_inventory_photos(
    p_inventory_item_id UUID,
    p_photo_urls TEXT[],
    p_primary_photo_index INTEGER DEFAULT 0
)
RETURNS JSONB AS $$
DECLARE
    v_photo_count INTEGER;
BEGIN
    v_photo_count := array_length(p_photo_urls, 1);
    
    -- Limit to 8 photos (Sortly standard)
    IF v_photo_count > 8 THEN
        RAISE EXCEPTION 'Maximum 8 photos allowed per item';
    END IF;
    
    -- Validate primary photo index
    IF p_primary_photo_index < 0 OR p_primary_photo_index >= v_photo_count THEN
        RAISE EXCEPTION 'Invalid primary photo index';
    END IF;
    
    -- Update photos
    UPDATE inventory_items
    SET 
        photos = p_photo_urls,
        primary_photo_index = p_primary_photo_index
    WHERE id = p_inventory_item_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'photo_count', v_photo_count,
        'primary_index', p_primary_photo_index
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- GET INVENTORY DASHBOARD METRICS
-- =============================================

CREATE OR REPLACE FUNCTION get_inventory_dashboard_metrics(
    p_workspace_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_total_items INTEGER;
    v_total_value DECIMAL;
    v_low_stock_count INTEGER;
    v_out_of_stock_count INTEGER;
    v_active_alerts INTEGER;
    v_recent_movements INTEGER;
BEGIN
    -- Total items and value
    SELECT COUNT(*), COALESCE(SUM(total_value), 0)
    INTO v_total_items, v_total_value
    FROM inventory_items
    WHERE workspace_id = p_workspace_id;
    
    -- Low stock items
    SELECT COUNT(*)
    INTO v_low_stock_count
    FROM inventory_items
    WHERE workspace_id = p_workspace_id
      AND status = 'low_stock';
    
    -- Out of stock items
    SELECT COUNT(*)
    INTO v_out_of_stock_count
    FROM inventory_items
    WHERE workspace_id = p_workspace_id
      AND status = 'out_of_stock';
    
    -- Active alerts
    SELECT COUNT(*)
    INTO v_active_alerts
    FROM inventory_alerts
    WHERE workspace_id = p_workspace_id
      AND status = 'active';
    
    -- Recent movements (last 7 days)
    SELECT COUNT(*)
    INTO v_recent_movements
    FROM stock_movements
    WHERE workspace_id = p_workspace_id
      AND performed_at > NOW() - INTERVAL '7 days';
    
    RETURN jsonb_build_object(
        'total_items', v_total_items,
        'total_value', v_total_value,
        'low_stock_count', v_low_stock_count,
        'out_of_stock_count', v_out_of_stock_count,
        'active_alerts', v_active_alerts,
        'recent_movements', v_recent_movements
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- EXPORT INVENTORY TO CSV FORMAT
-- =============================================

CREATE OR REPLACE FUNCTION export_inventory_data(
    p_workspace_id UUID,
    p_folder_id UUID DEFAULT NULL,
    p_category TEXT DEFAULT NULL
)
RETURNS TABLE (
    item_number TEXT,
    name TEXT,
    description TEXT,
    sku TEXT,
    barcode TEXT,
    category TEXT,
    folder_path TEXT,
    location_name TEXT,
    stock_quantity INTEGER,
    unit_cost DECIMAL,
    total_value DECIMAL,
    status TEXT,
    condition TEXT,
    last_counted_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.item_number,
        i.name,
        i.description,
        i.sku,
        i.barcode,
        i.category,
        f.folder_path,
        i.location_name,
        i.stock_quantity,
        i.unit_cost,
        i.total_value,
        i.status,
        i.condition,
        i.last_counted_at
    FROM inventory_items i
    LEFT JOIN inventory_folders f ON f.id = i.folder_id
    WHERE i.workspace_id = p_workspace_id
      AND (p_folder_id IS NULL OR i.folder_id = p_folder_id)
      AND (p_category IS NULL OR i.category = p_category)
    ORDER BY f.folder_path, i.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- GET STOCK MOVEMENT HISTORY FOR ITEM
-- =============================================

CREATE OR REPLACE FUNCTION get_item_movement_history(
    p_inventory_item_id UUID,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    movement_id UUID,
    movement_type TEXT,
    quantity INTEGER,
    quantity_before INTEGER,
    quantity_after INTEGER,
    from_location TEXT,
    to_location TEXT,
    performed_by_name TEXT,
    performed_at TIMESTAMPTZ,
    reason TEXT,
    notes TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sm.id as movement_id,
        sm.movement_type,
        sm.quantity,
        sm.quantity_before,
        sm.quantity_after,
        fl.name as from_location,
        tl.name as to_location,
        p.full_name as performed_by_name,
        sm.performed_at,
        sm.reason,
        sm.notes
    FROM stock_movements sm
    LEFT JOIN locations fl ON fl.id = sm.from_location_id
    LEFT JOIN locations tl ON tl.id = sm.to_location_id
    LEFT JOIN profiles p ON p.id = sm.performed_by
    WHERE sm.inventory_item_id = p_inventory_item_id
    ORDER BY sm.performed_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- BULK CREATE INVENTORY ITEMS FROM IMPORT
-- =============================================

CREATE OR REPLACE FUNCTION bulk_create_inventory_items(
    p_workspace_id UUID,
    p_items JSONB,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS JSONB AS $$
DECLARE
    v_item JSONB;
    v_created_count INTEGER := 0;
    v_error_count INTEGER := 0;
    v_errors JSONB := '[]'::jsonb;
    v_created_ids UUID[] := '{}';
    v_new_id UUID;
BEGIN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        BEGIN
            INSERT INTO inventory_items (
                workspace_id,
                name,
                description,
                sku,
                barcode,
                category,
                subcategory,
                stock_quantity,
                unit_cost,
                low_stock_threshold,
                created_by
            ) VALUES (
                p_workspace_id,
                v_item->>'name',
                v_item->>'description',
                v_item->>'sku',
                v_item->>'barcode',
                v_item->>'category',
                v_item->>'subcategory',
                COALESCE((v_item->>'stock_quantity')::INTEGER, 0),
                (v_item->>'unit_cost')::DECIMAL,
                (v_item->>'low_stock_threshold')::INTEGER,
                p_user_id
            ) RETURNING id INTO v_new_id;
            
            v_created_count := v_created_count + 1;
            v_created_ids := array_append(v_created_ids, v_new_id);
        EXCEPTION WHEN OTHERS THEN
            v_error_count := v_error_count + 1;
            v_errors := v_errors || jsonb_build_object(
                'item', v_item,
                'error', SQLERRM
            );
        END;
    END LOOP;
    
    RETURN jsonb_build_object(
        'success', true,
        'created_count', v_created_count,
        'error_count', v_error_count,
        'created_ids', v_created_ids,
        'errors', v_errors
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- GET LOW STOCK REPORT
-- =============================================

CREATE OR REPLACE FUNCTION get_low_stock_report(
    p_workspace_id UUID
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    sku TEXT,
    current_stock INTEGER,
    low_stock_threshold INTEGER,
    reorder_quantity INTEGER,
    folder_path TEXT,
    location_name TEXT,
    unit_cost DECIMAL,
    reorder_cost DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.name,
        i.sku,
        i.stock_quantity as current_stock,
        i.low_stock_threshold,
        i.reorder_quantity,
        f.folder_path,
        i.location_name,
        i.unit_cost,
        (i.reorder_quantity * i.unit_cost) as reorder_cost
    FROM inventory_items i
    LEFT JOIN inventory_folders f ON f.id = i.folder_id
    WHERE i.workspace_id = p_workspace_id
      AND i.low_stock_threshold IS NOT NULL
      AND i.stock_quantity <= i.low_stock_threshold
    ORDER BY 
        CASE 
            WHEN i.stock_quantity = 0 THEN 0
            ELSE 1
        END,
        i.stock_quantity ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON FUNCTION adjust_inventory_stock IS 'Adjust inventory stock levels and create movement record';
COMMENT ON FUNCTION transfer_inventory_stock IS 'Transfer stock between locations/folders with movement tracking';
COMMENT ON FUNCTION search_inventory_by_code IS 'Search inventory items by barcode or QR code';
COMMENT ON FUNCTION generate_item_qr_code IS 'Generate QR code data for an inventory item';
COMMENT ON FUNCTION update_inventory_photos IS 'Update photos for an inventory item (max 8)';
COMMENT ON FUNCTION get_inventory_dashboard_metrics IS 'Get dashboard metrics for inventory module';
COMMENT ON FUNCTION export_inventory_data IS 'Export inventory data in CSV-ready format';
COMMENT ON FUNCTION get_item_movement_history IS 'Get complete movement history for an item';
COMMENT ON FUNCTION bulk_create_inventory_items IS 'Bulk import inventory items from JSON data';
COMMENT ON FUNCTION get_low_stock_report IS 'Get report of items that are low on stock or need reordering';
