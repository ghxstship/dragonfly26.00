-- =============================================
-- UPDATE ASSET CATEGORIES
-- Migration: 035
-- Purpose: Add new asset categories for procurement-style advances
-- =============================================

-- Update assets table to include new category types
ALTER TABLE assets DROP CONSTRAINT IF EXISTS assets_type_check;
ALTER TABLE assets ADD CONSTRAINT assets_type_check CHECK (type IN (
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
    'rental_cars',
    'infrastructure',
    'equipment',
    'vehicle',
    'tool',
    'credential',
    'consumable'
));

-- Add new category field with specific asset categories
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_category TEXT;

-- Update existing data to map old types to new categories
UPDATE assets SET asset_category = 
    CASE 
        WHEN type = 'infrastructure' THEN 'site_infrastructure'
        WHEN type = 'vehicle' THEN 'site_vehicles'
        WHEN type = 'equipment' THEN 'heavy_equipment'
        WHEN type = 'consumable' THEN 'consumables'
        ELSE type
    END
WHERE asset_category IS NULL;

-- Add index for new asset_category field
CREATE INDEX IF NOT EXISTS idx_assets_asset_category ON assets(asset_category);

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON COLUMN assets.asset_category IS 'Specific asset category: site_infrastructure, site_services, site_safety, site_vehicles, heavy_equipment, consumables, event_rentals, signage, backline, access, credentials, parking, meals, flights, lodging, rental_cars';
