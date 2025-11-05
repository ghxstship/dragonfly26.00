-- =============================================
-- CATALOG SUBCATEGORIES & ORGANIZATION OPTIMIZATION
-- Migration: 057
-- Purpose: Add proper subcategory structure and fix miscategorizations
-- =============================================

-- =============================================
-- PART 1: Add subcategory column if not exists
-- =============================================

ALTER TABLE assets ADD COLUMN IF NOT EXISTS subcategory TEXT;

CREATE INDEX IF NOT EXISTS idx_assets_subcategory ON assets(subcategory);

COMMENT ON COLUMN assets.subcategory IS 'Detailed subcategory for better organization (e.g., "C-Stands", "Power Distribution", "Steam Tables")';

-- =============================================
-- PART 2: Update existing items with subcategories
-- =============================================

-- Site Infrastructure subcategories
UPDATE assets SET subcategory = 'Office Containers' WHERE category = 'Containers' AND name LIKE '%Office Container%';
UPDATE assets SET subcategory = 'Storage Containers' WHERE category = 'Containers' AND name LIKE '%Storage Container%';
UPDATE assets SET subcategory = 'Refrigerated Containers' WHERE category = 'Containers' AND name LIKE '%Refrigerated%';
UPDATE assets SET subcategory = 'Chain Link Fencing' WHERE category = 'Fencing' AND name LIKE '%Chain Link%';
UPDATE assets SET subcategory = 'Privacy Fencing' WHERE category = 'Fencing' AND name LIKE '%Privacy%';
UPDATE assets SET subcategory = 'Gates' WHERE category = 'Fencing' AND name LIKE '%Gate%';
UPDATE assets SET subcategory = 'Water Barricades' WHERE category = 'Barriers' AND name LIKE '%Water%';
UPDATE assets SET subcategory = 'Crowd Control Barriers' WHERE category = 'Barriers' AND name LIKE '%Crowd%';
UPDATE assets SET subcategory = 'Frame Tents' WHERE category = 'Tents' AND name LIKE '%Frame Tent%';
UPDATE assets SET subcategory = 'Pole Tents' WHERE category = 'Tents' AND name LIKE '%Pole Tent%';
UPDATE assets SET subcategory = 'Canopies' WHERE category = 'Tents' AND name LIKE '%Canopy%' OR name LIKE '%Pop-Up%';
UPDATE assets SET subcategory = 'Tent Accessories' WHERE category = 'Tent Accessories';

-- Site Services subcategories - Power
UPDATE assets SET subcategory = 'Portable Generators' WHERE category = 'Generators' AND name LIKE '%Portable%';
UPDATE assets SET subcategory = 'Towable Generators' WHERE category = 'Generators' AND name LIKE '%Towable%';
UPDATE assets SET subcategory = 'Industrial Generators' WHERE category = 'Generators' AND (name LIKE '%100kW%' OR name LIKE '%200kW%' OR name LIKE '%500kW%');
UPDATE assets SET subcategory = 'Power Distribution Boxes' WHERE category = 'Power Distribution';
UPDATE assets SET subcategory = 'Light Towers' WHERE category = 'Light Towers';

-- Site Services subcategories - HVAC
UPDATE assets SET subcategory = 'Portable Air Conditioning' WHERE category = 'HVAC' AND name LIKE '%AC%';
UPDATE assets SET subcategory = 'Portable Heaters' WHERE category = 'HVAC' AND name LIKE '%Heater%';
UPDATE assets SET subcategory = 'Industrial Fans' WHERE category = 'Fans';

-- Site Services subcategories - Refrigeration
UPDATE assets SET subcategory = 'Reach-In Refrigerators' WHERE category = 'Refrigeration' AND name LIKE '%Reach-In%';
UPDATE assets SET subcategory = 'Walk-In Coolers' WHERE category = 'Refrigeration' AND name LIKE '%Walk-In Cooler%';
UPDATE assets SET subcategory = 'Walk-In Freezers' WHERE category = 'Refrigeration' AND name LIKE '%Walk-In Freezer%';
UPDATE assets SET subcategory = 'Chest Freezers' WHERE category = 'Refrigeration' AND name LIKE '%Chest%';
UPDATE assets SET subcategory = 'Prep Tables' WHERE category = 'Refrigeration' AND name LIKE '%Prep Table%';

-- Site Services subcategories - Ice & Beverage
UPDATE assets SET subcategory = 'Ice Machines' WHERE category = 'Ice Machines';
UPDATE assets SET subcategory = 'Beverage Dispensers' WHERE category = 'Beverage Equipment';

-- Site Services subcategories - Water & Sanitation
UPDATE assets SET subcategory = 'Water Tanks' WHERE category = 'Water Tanks';
UPDATE assets SET subcategory = 'Portable Restrooms' WHERE category = 'Sanitation';

-- Site Services subcategories - Janitorial
UPDATE assets SET subcategory = 'Vacuums' WHERE category = 'Janitorial Equipment' AND name LIKE '%Vacuum%';
UPDATE assets SET subcategory = 'Floor Care Equipment' WHERE category = 'Janitorial Equipment' AND (name LIKE '%Floor%' OR name LIKE '%Carpet%');
UPDATE assets SET subcategory = 'Pressure Washers' WHERE category = 'Janitorial Equipment' AND name LIKE '%Pressure%';
UPDATE assets SET subcategory = 'Cleaning Tools' WHERE category = 'Janitorial Supplies' AND (name LIKE '%Mop%' OR name LIKE '%Broom%' OR name LIKE '%Bucket%');
UPDATE assets SET subcategory = 'Waste Management' WHERE category = 'Janitorial Supplies' AND (name LIKE '%Trash%' OR name LIKE '%Garbage%');
UPDATE assets SET subcategory = 'Cleaning Chemicals' WHERE category = 'Janitorial Supplies' AND (name LIKE '%Cleaner%' OR name LIKE '%Disinfectant%' OR name LIKE '%Spray%');

-- Site Safety subcategories
UPDATE assets SET subcategory = 'ABC Fire Extinguishers' WHERE category = 'Fire Safety' AND name LIKE '%ABC%';
UPDATE assets SET subcategory = 'CO2 Fire Extinguishers' WHERE category = 'Fire Safety' AND name LIKE '%CO2%';
UPDATE assets SET subcategory = 'Specialty Fire Extinguishers' WHERE category = 'Fire Safety' AND name LIKE '%Class K%';
UPDATE assets SET subcategory = 'First Aid Kits' WHERE category = 'First Aid' AND name LIKE '%Kit%';
UPDATE assets SET subcategory = 'Medical Equipment' WHERE category = 'Medical Equipment';
UPDATE assets SET subcategory = 'Hard Hats' WHERE category = 'PPE - Head';
UPDATE assets SET subcategory = 'Safety Glasses' WHERE category = 'PPE - Eye' AND name LIKE '%Glasses%';
UPDATE assets SET subcategory = 'Safety Goggles' WHERE category = 'PPE - Eye' AND name LIKE '%Goggles%';
UPDATE assets SET subcategory = 'Welding Protection' WHERE category = 'PPE - Face';
UPDATE assets SET subcategory = 'Ear Protection' WHERE category = 'PPE - Hearing';
UPDATE assets SET subcategory = 'Respiratory Protection' WHERE category = 'PPE - Respiratory';
UPDATE assets SET subcategory = 'Hi-Visibility Clothing' WHERE category = 'PPE - Visibility';

-- Site Vehicles subcategories
UPDATE assets SET subcategory = 'Electric Golf Carts' WHERE category = 'Golf Carts' AND name LIKE '%Electric%';
UPDATE assets SET subcategory = 'Gas Golf Carts' WHERE category = 'Golf Carts' AND name LIKE '%Gas%';
UPDATE assets SET subcategory = 'Utility Carts' WHERE category = 'Utility Carts';
UPDATE assets SET subcategory = 'Side-by-Sides' WHERE category = 'UTVs';
UPDATE assets SET subcategory = 'Pickup Trucks' WHERE category = 'Trucks' AND name LIKE '%Pickup%';
UPDATE assets SET subcategory = 'Box Trucks' WHERE category = 'Trucks' AND name LIKE '%Box%';
UPDATE assets SET subcategory = 'Cargo Vans' WHERE category = 'Vans' AND name LIKE '%Cargo%';
UPDATE assets SET subcategory = 'Passenger Vans' WHERE category = 'Vans' AND name LIKE '%Passenger%';
UPDATE assets SET subcategory = 'Utility Trailers' WHERE category = 'Trailers' AND name LIKE '%Utility%';
UPDATE assets SET subcategory = 'Enclosed Trailers' WHERE category = 'Trailers' AND name LIKE '%Enclosed%';
UPDATE assets SET subcategory = 'Flatbed Trailers' WHERE category = 'Trailers' AND name LIKE '%Flatbed%';
UPDATE assets SET subcategory = 'Dump Trailers' WHERE category = 'Trailers' AND name LIKE '%Dump%';

-- Heavy Equipment subcategories
UPDATE assets SET subcategory = 'Electric Forklifts' WHERE category = 'Forklifts' AND name LIKE '%Electric%';
UPDATE assets SET subcategory = 'Propane Forklifts' WHERE category = 'Forklifts' AND name LIKE '%Propane%';
UPDATE assets SET subcategory = 'Diesel Forklifts' WHERE category = 'Forklifts' AND name LIKE '%Diesel%';
UPDATE assets SET subcategory = 'Electric Scissor Lifts' WHERE category = 'Scissor Lifts' AND name LIKE '%Electric%';
UPDATE assets SET subcategory = 'Rough Terrain Scissor Lifts' WHERE category = 'Scissor Lifts' AND name LIKE '%Rough Terrain%';
UPDATE assets SET subcategory = 'Articulating Boom Lifts' WHERE category = 'Boom Lifts' AND name LIKE '%Articulating%';
UPDATE assets SET subcategory = 'Telescopic Boom Lifts' WHERE category = 'Boom Lifts' AND name LIKE '%Telescopic%';
UPDATE assets SET subcategory = 'Telehandlers' WHERE category = 'Telehandlers';
UPDATE assets SET subcategory = 'Skid Steers' WHERE category = 'Skid Steers';
UPDATE assets SET subcategory = 'Track Loaders' WHERE category = 'Track Loaders';

-- Grip Equipment subcategories
UPDATE assets SET subcategory = 'C-Stands' WHERE category = 'Grip Equipment' AND name LIKE '%C-Stand%';
UPDATE assets SET subcategory = 'Combo Stands' WHERE category = 'Grip Equipment' AND name LIKE '%Combo%';
UPDATE assets SET subcategory = 'Apple Boxes' WHERE category = 'Grip Equipment' AND name LIKE '%Apple Box%';
UPDATE assets SET subcategory = 'Sandbags' WHERE category = 'Grip Equipment' AND name LIKE '%Sandbag%';
UPDATE assets SET subcategory = 'Grip Hardware' WHERE category = 'Grip Equipment' AND (name LIKE '%Grip Head%' OR name LIKE '%Clamp%');
UPDATE assets SET subcategory = 'Flags & Frames' WHERE category = 'Grip Equipment' AND (name LIKE '%Flag%' OR name LIKE '%Frame%');

-- Event Rentals subcategories - Tables
UPDATE assets SET subcategory = 'Round Dining Tables' WHERE category = 'Tables' AND name LIKE '%Round%' AND name NOT LIKE '%Cocktail%';
UPDATE assets SET subcategory = 'Cocktail Tables' WHERE category = 'Tables' AND name LIKE '%Cocktail%';
UPDATE assets SET subcategory = 'Rectangle Tables' WHERE category = 'Tables' AND name LIKE '%Rectangle%';
UPDATE assets SET subcategory = 'Specialty Tables' WHERE category = 'Tables' AND (name LIKE '%Serpentine%' OR name LIKE '%King%');
UPDATE assets SET subcategory = 'Highboy Tables' WHERE name LIKE '%Highboy%';
UPDATE assets SET subcategory = 'Bar Tables' WHERE name LIKE '%Bar Table%';

-- Event Rentals subcategories - Chairs
UPDATE assets SET subcategory = 'Chiavari Chairs' WHERE name LIKE '%Chiavari%';
UPDATE assets SET subcategory = 'Folding Chairs' WHERE name LIKE '%Folding Chair%';
UPDATE assets SET subcategory = 'Bar Stools' WHERE name LIKE '%Bar Stool%';
UPDATE assets SET subcategory = 'Specialty Chairs' WHERE category = 'Specialty Seating' OR name LIKE '%Cross-Back%' OR name LIKE '%Ghost%' OR name LIKE '%Throne%';

-- Event Rentals subcategories - Linens
UPDATE assets SET subcategory = 'Round Tablecloths' WHERE category = 'Linens' AND name LIKE '%Round%';
UPDATE assets SET subcategory = 'Rectangle Tablecloths' WHERE category = 'Linens' AND name LIKE '%Rectangle%';
UPDATE assets SET subcategory = 'Spandex Covers' WHERE category = 'Linens' AND name LIKE '%Spandex%';
UPDATE assets SET subcategory = 'Table Accessories' WHERE category = 'Linens' AND (name LIKE '%Skirt%' OR name LIKE '%Runner%' OR name LIKE '%Overlay%' OR name LIKE '%Napkin%');

-- Event Rentals subcategories - Staging & Draping
UPDATE assets SET subcategory = 'Stage Platforms' WHERE category = 'Staging' AND name LIKE '%Platform%';
UPDATE assets SET subcategory = 'Stage Stairs' WHERE category = 'Staging' AND name LIKE '%Stairs%';
UPDATE assets SET subcategory = 'Stage Accessories' WHERE category = 'Staging' AND (name LIKE '%Skirting%' OR name LIKE '%Riser%');
UPDATE assets SET subcategory = 'Pipe & Drape Systems' WHERE category = 'Draping' AND name LIKE '%Pipe%';
UPDATE assets SET subcategory = 'Drape Panels' WHERE category = 'Draping' AND name LIKE '%Panel%';
UPDATE assets SET subcategory = 'Dance Floors' WHERE category = 'Dance Floors';
UPDATE assets SET subcategory = 'Stanchions' WHERE category = 'Stanchions' OR name LIKE '%Stanchion%';

-- Restaurant Equipment subcategories
UPDATE assets SET subcategory = 'Ranges & Ovens' WHERE category = 'Restaurant Equipment' AND (name LIKE '%Range%' OR name LIKE '%Oven%');
UPDATE assets SET subcategory = 'Griddles & Charbroilers' WHERE category = 'Restaurant Equipment' AND (name LIKE '%Griddle%' OR name LIKE '%Charbroiler%');
UPDATE assets SET subcategory = 'Fryers' WHERE category = 'Restaurant Equipment' AND name LIKE '%Fryer%';
UPDATE assets SET subcategory = 'Steamers & Hot Plates' WHERE category = 'Restaurant Equipment' AND (name LIKE '%Steamer%' OR name LIKE '%Hot Plate%');
UPDATE assets SET subcategory = 'Steam Tables' WHERE category = 'Restaurant Equipment' AND name LIKE '%Steam Table%';
UPDATE assets SET subcategory = 'Holding Cabinets' WHERE category = 'Restaurant Equipment' AND name LIKE '%Holding%';
UPDATE assets SET subcategory = 'Chafing Dishes' WHERE category = 'Restaurant Equipment' AND name LIKE '%Chafing%';
UPDATE assets SET subcategory = 'Food Prep Equipment' WHERE category = 'Restaurant Equipment' AND (name LIKE '%Work Table%' OR name LIKE '%Mixer%' OR name LIKE '%Processor%' OR name LIKE '%Slicer%');
UPDATE assets SET subcategory = 'Dishwashing' WHERE category = 'Restaurant Equipment' AND (name LIKE '%Sink%' OR name LIKE '%Dish%');

-- Bar Equipment subcategories
UPDATE assets SET subcategory = 'Bar Coolers' WHERE category = 'Bar Equipment' AND name LIKE '%Cooler%';
UPDATE assets SET subcategory = 'Draft Beer Systems' WHERE category = 'Bar Equipment' AND (name LIKE '%Beer%' OR name LIKE '%Keg%' OR name LIKE '%Draft%');
UPDATE assets SET subcategory = 'Bar Appliances' WHERE category = 'Bar Equipment' AND (name LIKE '%Blender%' OR name LIKE '%Ice Bin%' OR name LIKE '%Glass Washer%');
UPDATE assets SET subcategory = 'Bar Stations' WHERE category = 'Bar Equipment' AND name LIKE '%Station%';

-- Lounge & Bar Furniture subcategories
UPDATE assets SET subcategory = 'Lounge Seating' WHERE category = 'Lounge Furniture' AND (name LIKE '%Sofa%' OR name LIKE '%Loveseat%' OR name LIKE '%Armchair%' OR name LIKE '%Ottoman%' OR name LIKE '%Bench%');
UPDATE assets SET subcategory = 'Lounge Tables' WHERE category = 'Lounge Furniture' AND name LIKE '%Table%';
UPDATE assets SET subcategory = 'Portable Bars' WHERE category = 'Bar Furniture' AND name LIKE '%Bar%';

-- Office subcategories
UPDATE assets SET subcategory = 'Desks' WHERE category = 'Office Furniture' AND name LIKE '%Desk%';
UPDATE assets SET subcategory = 'Office Chairs' WHERE category = 'Office Furniture' AND name LIKE '%Chair%';
UPDATE assets SET subcategory = 'Conference Furniture' WHERE category = 'Office Furniture' AND name LIKE '%Conference%';
UPDATE assets SET subcategory = 'Storage Furniture' WHERE category = 'Office Furniture' AND (name LIKE '%Filing%' OR name LIKE '%Bookshelf%');
UPDATE assets SET subcategory = 'Office Machines' WHERE category = 'Office Equipment' AND (name LIKE '%Printer%' OR name LIKE '%Copier%' OR name LIKE '%Shredder%' OR name LIKE '%Laminator%');
UPDATE assets SET subcategory = 'Presentation Equipment' WHERE category = 'Office Equipment' AND (name LIKE '%Whiteboard%' OR name LIKE '%Easel%');
UPDATE assets SET subcategory = 'Office Consumables' WHERE category = 'Office Supplies';

-- Backline subcategories
UPDATE assets SET subcategory = 'Drum Kits' WHERE category = 'Drums' AND name LIKE '%Drum Kit%';
UPDATE assets SET subcategory = 'Percussion' WHERE category = 'Drums' AND name LIKE '%Cajon%';
UPDATE assets SET subcategory = 'Guitar Amplifiers' WHERE category = 'Amplifiers' AND name LIKE '%Guitar Amp%';
UPDATE assets SET subcategory = 'Bass Amplifiers' WHERE category = 'Amplifiers' AND name LIKE '%Bass Amp%';
UPDATE assets SET subcategory = 'Keyboard Amplifiers' WHERE category = 'Amplifiers' AND name LIKE '%Keyboard Amp%';
UPDATE assets SET subcategory = 'Speaker Cabinets' WHERE name LIKE '%Cabinet%' AND category = 'Amplifiers';
UPDATE assets SET subcategory = 'DJ Controllers' WHERE category = 'DJ Equipment' AND name LIKE '%Controller%';
UPDATE assets SET subcategory = 'DJ Mixers' WHERE category = 'DJ Equipment' AND name LIKE '%Mixer%';
UPDATE assets SET subcategory = 'Turntables' WHERE category = 'DJ Equipment' AND name LIKE '%Turntable%';
UPDATE assets SET subcategory = 'Wired Microphones' WHERE category = 'Microphones' AND name NOT LIKE '%Wireless%';
UPDATE assets SET subcategory = 'Wireless Microphones' WHERE category = 'Microphones' AND name LIKE '%Wireless%';

-- Signage subcategories
UPDATE assets SET subcategory = 'Sign Holders' WHERE category = 'Sign Holders';
UPDATE assets SET subcategory = 'A-Frame Signs' WHERE category = 'A-Frames';
UPDATE assets SET subcategory = 'Directional Signs' WHERE category = 'Directional';
UPDATE assets SET subcategory = 'Parking Signs' WHERE category = 'Parking';
UPDATE assets SET subcategory = 'Banner Stands' WHERE category = 'Banners';
UPDATE assets SET subcategory = 'Yard Signs' WHERE category = 'Yard Signs';
UPDATE assets SET subcategory = 'Feather Flags' WHERE category = 'Flags';
UPDATE assets SET subcategory = 'Safety Signs' WHERE category = 'Safety Signs';

-- Lighting & Decor subcategories
UPDATE assets SET subcategory = 'Chandeliers' WHERE category = 'Lighting' AND name LIKE '%Chandelier%';
UPDATE assets SET subcategory = 'String Lights' WHERE category = 'Lighting' AND name LIKE '%String%';
UPDATE assets SET subcategory = 'Uplighting' WHERE category = 'Lighting' AND name LIKE '%Uplight%';
UPDATE assets SET subcategory = 'Specialty Lighting' WHERE category = 'Lighting' AND name LIKE '%Gobo%';
UPDATE assets SET subcategory = 'Decorative Accessories' WHERE category = 'Decor';

-- Camera Support subcategories
UPDATE assets SET subcategory = 'Tripods' WHERE category = 'Camera Support' AND name LIKE '%Tripod%';
UPDATE assets SET subcategory = 'Camera Mounts' WHERE category = 'Camera Support' AND (name LIKE '%Hi-Hat%' OR name LIKE '%Plate%');

-- Production Supplies subcategories
UPDATE assets SET subcategory = 'Production Tape' WHERE category = 'Production Supplies' AND name LIKE '%Tape%';
UPDATE assets SET subcategory = 'Production Chemicals' WHERE category = 'Production Supplies' AND name LIKE '%Spray%';
UPDATE assets SET subcategory = 'Backdrops' WHERE category = 'Backdrops';

-- Electrical subcategories
UPDATE assets SET subcategory = 'Extension Cords' WHERE category = 'Electrical' AND name LIKE '%Extension Cord%';
UPDATE assets SET subcategory = 'Power Taps' WHERE category = 'Electrical' AND (name LIKE '%Quad%' OR name LIKE '%Cube%');
UPDATE assets SET subcategory = 'Cable Management' WHERE category = 'Cable Management';

-- =============================================
-- PART 3: Create helper function for category/subcategory search
-- =============================================

CREATE OR REPLACE FUNCTION search_assets_by_category(
    category_filter TEXT DEFAULT NULL,
    subcategory_filter TEXT DEFAULT NULL,
    workspace_filter UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    asset_category TEXT,
    category TEXT,
    subcategory TEXT,
    manufacturer TEXT
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
        a.manufacturer
    FROM assets a
    WHERE 
        (workspace_filter IS NULL OR a.workspace_id = workspace_filter)
        AND (category_filter IS NULL OR a.category = category_filter)
        AND (subcategory_filter IS NULL OR a.subcategory = subcategory_filter)
    ORDER BY a.category, a.subcategory, a.name;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION search_assets_by_category IS 'Browse assets by category and subcategory filters';
