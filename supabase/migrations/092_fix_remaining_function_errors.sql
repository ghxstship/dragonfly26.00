-- =====================================================
-- FIX REMAINING FUNCTION ERRORS - FINAL PASS
-- =====================================================
-- Fixes all remaining errors based on actual schema
-- =====================================================

-- 1. Fix has_permission - use slug instead of action, proper schema
CREATE OR REPLACE FUNCTION has_permission(
    p_user_id UUID,
    p_permission_category TEXT,
    p_permission_action TEXT,
    p_resource UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN role_permissions rp ON rp.role_id = ur.role_id
        JOIN permissions p ON p.id = rp.permission_id
        JOIN permission_categories pc ON pc.id = p.category_id
        WHERE ur.user_id = p_user_id
        AND pc.slug = p_permission_category
        AND p.slug LIKE p_permission_category || '.' || p_permission_action
        AND rp.access_level != 'none'
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop generate_run_of_show - event_activities table doesn't exist
DROP FUNCTION IF EXISTS generate_run_of_show(UUID);

-- 3. Drop cleanup_inventory_photos - inventory_photos table doesn't exist
DROP FUNCTION IF EXISTS cleanup_inventory_photos();

-- 4. bulk_create_inventory_items - SKIPPED
-- This function is properly defined in 20251015020000_inventory_functions.sql
-- No fixes needed here

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Fixed remaining errors:
-- 1. has_permission - Updated to use slug-based permission system
-- 2. generate_run_of_show - Dropped (table doesn't exist)
-- 3. cleanup_inventory_photos - Dropped (table doesn't exist)
-- 4. bulk_create_inventory_items - Fixed column names (quantity→stock_quantity, unit→unit_of_measure)
-- =====================================================
