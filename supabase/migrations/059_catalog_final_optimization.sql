-- =============================================
-- FINAL CATALOG OPTIMIZATION & CLEANUP
-- Migration: 059
-- Purpose: Fix duplicates, add industry terms, complete multi-industry coverage
-- =============================================

-- =============================================
-- PART 1: Remove Duplicate Items
-- =============================================

-- Remove duplicate wet floor sign from janitorial (keep in safety)
DELETE FROM assets 
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND name = 'Wet Floor Caution Sign'
AND category = 'Janitorial Supplies';

-- =============================================
-- PART 2: Add Industry-Specific Terms to Existing Items
-- =============================================

-- Film/TV Industry Terms
UPDATE assets SET related_names = array_append(related_names, 'basecamp')
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND name LIKE '%Office Container%'
AND NOT 'basecamp' = ANY(related_names);

UPDATE assets SET related_names = array_append(related_names, 'honey wagon')
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND name LIKE '%Portable Restroom%'
AND NOT 'honey wagon' = ANY(related_names);

UPDATE assets SET related_names = array_cat(related_names, ARRAY['spider box', 'lunch box', 'distro'])
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND category = 'Power Distribution'
AND name LIKE '%Distribution%'
AND NOT 'spider box' = ANY(related_names);

UPDATE assets SET related_names = array_cat(related_names, ARRAY['genny', 'gennie', 'gen set'])
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND category = 'Generators'
AND NOT 'genny' = ANY(related_names);

UPDATE assets SET related_names = array_append(related_names, 'crafty table')
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND name LIKE '%Work Table%'
AND category = 'Restaurant Equipment'
AND NOT 'crafty table' = ANY(related_names);

UPDATE assets SET related_names = array_cat(related_names, ARRAY['tag along', 'tag-along'])
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND category = 'Trailers'
AND NOT 'tag along' = ANY(related_names);

-- Broadcast Industry Terms
UPDATE assets SET related_names = array_cat(related_names, ARRAY['eng truck', 'ob van', 'remote truck'])
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND name LIKE '%Box Truck%'
AND NOT 'eng truck' = ANY(related_names);

-- Hospitality Industry Terms
UPDATE assets SET related_names = array_cat(related_names, ARRAY['f&b station', 'food and beverage'])
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND category = 'Restaurant Equipment'
AND name LIKE '%Steam Table%'
AND NOT 'f&b station' = ANY(related_names);

-- =============================================
-- PART 3: Add Industry Tags
-- =============================================

ALTER TABLE assets ADD COLUMN IF NOT EXISTS industry_tags TEXT[];

CREATE INDEX IF NOT EXISTS idx_assets_industry_tags ON assets USING GIN(industry_tags);

COMMENT ON COLUMN assets.industry_tags IS 'Industry-specific tags (e.g., film-production, broadcast, hospitality, corporate-events)';

-- Tag items by industry
UPDATE assets SET industry_tags = ARRAY['film-production', 'tv-production', 'commercial-production']
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND category IN ('Grip Equipment', 'Camera Support', 'Production Supplies', 'Backdrops');

UPDATE assets SET industry_tags = ARRAY['film-production', 'tv-production', 'broadcast', 'corporate-events']
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND category IN ('Power Distribution', 'Electrical', 'Cable Management');

UPDATE assets SET industry_tags = ARRAY['hospitality', 'corporate-events', 'catering']
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND category IN ('Restaurant Equipment', 'Bar Equipment');

UPDATE assets SET industry_tags = ARRAY['corporate-events', 'weddings', 'social-events']
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND (name LIKE '%Chiavari%' OR name LIKE '%Round Table%' OR category = 'Linens');

UPDATE assets SET industry_tags = ARRAY['film-production', 'tv-production', 'broadcast', 'live-events', 'concerts']
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND category IN ('Drums', 'Amplifiers', 'DJ Equipment', 'Microphones');

UPDATE assets SET industry_tags = ARRAY['construction', 'film-production', 'events', 'industrial']
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND asset_category IN ('heavy_equipment', 'site_vehicles');

UPDATE assets SET industry_tags = ARRAY['all-industries', 'general']
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND category IN ('PPE - Head', 'PPE - Eye', 'PPE - Hearing', 'PPE - Respiratory', 'Fire Safety', 'First Aid');

-- =============================================
-- PART 4: Add Missing Critical Items
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, subcategory, manufacturer, model_number, related_names, tags, industry_tags, specifications, created_by) VALUES

-- Lectern/Podium (Hospitality/Corporate gap)
('00000000-0000-0000-0000-000000000001', 'Lectern Wood Full-Size', 'Full-size wooden lectern with shelf.', 'equipment', 'event_rentals', 'Presentation', 'Lecterns', 'Oklahoma Sound', '111PLS', 
ARRAY['lectern', 'podium', 'speaking podium', 'presentation stand', 'speaker stand'], 
ARRAY['lectern', 'podium', 'presentation', 'speaking'], 
ARRAY['corporate-events', 'hospitality', 'conferences'], 
'{"size": "47x23x20 inches", "material": "wood laminate", "features": "reading surface 23x14 inches, bottom shelf, pen/pencil tray", "mic_hole": "microphone grommet", "portable": "semi-portable", "accessories": ["microphone not included", "optional light"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Lectern Acrylic Clear', 'Modern clear acrylic lectern.', 'equipment', 'event_rentals', 'Presentation', 'Lecterns', 'FixtureDisplays', 'Acrylic', 
ARRAY['acrylic lectern', 'clear podium', 'modern lectern', 'lucite podium', 'ghost podium'], 
ARRAY['lectern', 'acrylic', 'modern', 'clear'], 
ARRAY['corporate-events', 'conferences'], 
'{"size": "46x20x15 inches", "material": "clear acrylic", "style": "modern minimalist", "weight": "lightweight", "features": "open design, easy to move"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- Microphone Stand (Major gap)
('00000000-0000-0000-0000-000000000001', 'Microphone Stand Boom', 'Professional boom microphone stand.', 'equipment', 'backline', 'Microphones', 'Microphone Stands', 'On-Stage', 'MS7701B', 
ARRAY['mic stand', 'microphone stand', 'boom stand', 'mic boom', 'floor stand'], 
ARRAY['microphone', 'stand', 'boom', 'audio'], 
ARRAY['film-production', 'live-events', 'concerts', 'corporate-events'], 
'{"type": "tripod boom stand", "height": "35 to 63 inches", "boom": "30 inch boom arm", "base": "tripod base", "thread": "5/8 inch-27 thread", "weight": "6 lbs", "accessories": ["mic clip included"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Microphone Stand Desktop', 'Desktop microphone stand.', 'equipment', 'backline', 'Microphones', 'Microphone Stands', 'On-Stage', 'DS7200B', 
ARRAY['desktop mic stand', 'table mic stand', 'desk stand', 'short mic stand'], 
ARRAY['microphone', 'stand', 'desktop', 'table'], 
ARRAY['corporate-events', 'podcasts', 'broadcasting'], 
'{"type": "desktop stand", "height": "9 to 13 inches adjustable", "base": "weighted round base", "thread": "5/8 inch-27", "compact": true}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- Projector Screen (AV gap)
('00000000-0000-0000-0000-000000000001', 'Projector Screen 100" Tripod', 'Portable tripod projection screen.', 'equipment', 'event_rentals', 'AV Equipment', 'Projection Screens', 'Elite Screens', 'T100UWH', 
ARRAY['projector screen', 'projection screen', 'tripod screen', '100 inch screen', 'portable screen'], 
ARRAY['projector', 'screen', 'projection', '100-inch'], 
ARRAY['corporate-events', 'presentations', 'conferences'], 
'{"size": "100 inch diagonal (49x87 inch viewing)", "aspect": "16:9 widescreen", "material": "MaxWhite matte white", "gain": "1.1 gain", "type": "tripod portable", "height": "adjustable up to 100 inches", "case": "carry bag included", "accessories": ["carry bag", "keystone eliminator"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Projector Screen 120" Tripod', 'Large tripod projection screen.', 'equipment', 'event_rentals', 'AV Equipment', 'Projection Screens', 'Elite Screens', 'T120UWH', 
ARRAY['120 inch screen', 'large projector screen', '120 projection screen'], 
ARRAY['projector', 'screen', '120-inch', 'large'], 
ARRAY['corporate-events', 'large-venues'], 
'{"size": "120 inch diagonal (59x104 inch viewing)", "aspect": "16:9", "type": "tripod", "accessories": ["carry bag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- Projector (AV gap)
('00000000-0000-0000-0000-000000000001', 'Projector 3500 Lumens LCD', 'Portable LCD projector 3500 lumens.', 'equipment', 'event_rentals', 'AV Equipment', 'Projectors', 'Epson', 'PowerLite 2250U', 
ARRAY['projector', 'lcd projector', 'video projector', 'presentation projector', '3500 lumen'], 
ARRAY['projector', 'lcd', '3500-lumen', 'presentation'], 
ARRAY['corporate-events', 'presentations'], 
'{"brightness": "3500 lumens", "resolution": "1920x1200 WUXGA", "type": "3LCD", "contrast": "15000:1", "lamp_life": "10000 hours", "inputs": "HDMI, VGA, USB", "wireless": "optional wireless", "weight": "8 lbs", "accessories": ["remote", "power cable", "VGA cable", "HDMI cable", "lens cap", "carrying case"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Projector 5500 Lumens High Brightness', 'High brightness projector for large venues.', 'equipment', 'event_rentals', 'AV Equipment', 'Projectors', 'Epson', 'PowerLite 5530U', 
ARRAY['5500 lumen projector', 'bright projector', 'large venue projector', 'high brightness'], 
ARRAY['projector', '5500-lumen', 'high-brightness'], 
ARRAY['corporate-events', 'large-venues'], 
'{"brightness": "5500 lumens", "resolution": "1920x1200", "type": "3LCD", "use": "large venues, bright rooms", "accessories": ["remote", "cables", "case"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- Housekeeping Cart (Hospitality gap)
('00000000-0000-0000-0000-000000000001', 'Housekeeping Cart Standard', 'Commercial housekeeping cart with bags.', 'equipment', 'event_rentals', 'Hospitality', 'Housekeeping Carts', 'Rubbermaid', '6173-88', 
ARRAY['housekeeping cart', 'maid cart', 'janitorial cart', 'room service cart', 'cleaning cart'], 
ARRAY['housekeeping', 'cart', 'hospitality', 'cleaning'], 
ARRAY['hospitality', 'facilities'], 
'{"type": "traditional housekeeping cart", "platform": "3-shelf platform", "bags": "25 gallon vinyl bag", "capacity": "200 lbs", "wheels": "8 inch non-marking casters", "material": "structural web plastic", "features": "locking hood, storage compartments", "accessories": ["vinyl bag", "caddy basket"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- Registration Table (Corporate gap)
('00000000-0000-0000-0000-000000000001', 'Registration Table 8ft Skirted', 'Pre-skirted registration table.', 'equipment', 'event_rentals', 'Tables', 'Registration Tables', 'EventPro', 'REG-8FT', 
ARRAY['registration table', 'check in table', 'reg table', 'skirted table', 'reception table'], 
ARRAY['table', 'registration', 'skirted', '8ft'], 
ARRAY['corporate-events', 'conferences', 'weddings'], 
'{"size": "96x30 inches", "height": "30 inches", "skirting": "pre-attached skirting included", "color": "black or white skirting", "top": "folding table with skirting", "use": "event check-in, registration desks", "accessories": ["name badge holders", "signage clips"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- Easel Sign (Corporate/Events gap)
('00000000-0000-0000-0000-000000000001', 'Easel Wood Display 72"', 'Wooden display easel for signs.', 'equipment', 'event_rentals', 'Signage', 'Display Easels', 'Studio Designs', 'CLASSIC', 
ARRAY['easel', 'display easel', 'sign easel', 'wooden easel', 'floor easel', 'presentation easel'], 
ARRAY['easel', 'display', 'wooden', '72-inch'], 
ARRAY['corporate-events', 'weddings', 'galleries'], 
'{"height": "72 inches", "material": "wood", "type": "A-frame easel", "capacity": "holds 48 inch canvas or sign", "adjustable": "adjustable height", "portable": "folds flat", "use": "welcome signs, seating charts, signage"}'::jsonb, 
'00000000-0000-0000-0000-000000000001');

-- =============================================
-- PART 5: Enhanced Search Function with Industry Tags
-- =============================================

CREATE OR REPLACE FUNCTION search_assets(
    search_query TEXT,
    category_filter TEXT DEFAULT NULL,
    workspace_filter UUID DEFAULT NULL,
    industry_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    asset_category TEXT,
    category TEXT,
    subcategory TEXT,
    manufacturer TEXT,
    model_number TEXT,
    relevance FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.name,
        a.description,
        a.asset_category,
        a.category,
        a.subcategory,
        a.manufacturer,
        a.model_number,
        GREATEST(
            similarity(a.name, search_query) * 3.0,
            similarity(array_to_string(a.related_names, ' '), search_query) * 2.0,
            similarity(a.description, search_query) * 1.0,
            similarity(array_to_string(a.tags, ' '), search_query) * 1.5
        ) as relevance
    FROM assets a
    WHERE
        (workspace_filter IS NULL OR a.workspace_id = workspace_filter)
        AND (category_filter IS NULL OR a.asset_category = category_filter)
        AND (industry_filter IS NULL OR industry_filter = ANY(a.industry_tags))
        AND (
            a.name % search_query
            OR array_to_string(a.related_names, ' ') % search_query
            OR a.description % search_query
            OR array_to_string(a.tags, ' ') % search_query
        )
    ORDER BY relevance DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION search_assets IS 'Comprehensive fuzzy search with optional industry filtering';

-- =============================================
-- PART 6: Create Catalog Statistics View
-- =============================================

CREATE OR REPLACE VIEW catalog_statistics AS
SELECT 
    COUNT(*) as total_items,
    COUNT(DISTINCT asset_category) as asset_categories,
    COUNT(DISTINCT category) as categories,
    COUNT(DISTINCT subcategory) as subcategories,
    COUNT(DISTINCT manufacturer) as manufacturers,
    SUM(array_length(related_names, 1)) as total_related_names,
    AVG(array_length(related_names, 1)) as avg_related_names_per_item
FROM assets
WHERE workspace_id = '00000000-0000-0000-0000-000000000001';

COMMENT ON VIEW catalog_statistics IS 'Overall catalog statistics and metrics';

-- =============================================
-- PART 7: Create Category Summary View
-- =============================================

CREATE OR REPLACE VIEW catalog_by_category AS
SELECT 
    asset_category,
    category,
    subcategory,
    COUNT(*) as item_count,
    array_agg(DISTINCT manufacturer) as manufacturers,
    array_agg(DISTINCT industry_tags) as industries_served
FROM assets
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
GROUP BY asset_category, category, subcategory
ORDER BY asset_category, category, subcategory;

COMMENT ON VIEW catalog_by_category IS 'Catalog items grouped by category hierarchy';
