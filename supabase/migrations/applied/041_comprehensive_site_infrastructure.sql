-- =============================================
-- COMPREHENSIVE SITE INFRASTRUCTURE CATALOG
-- Migration: 041
-- Based on: ULine, Conex, ModSpace, Mobile Mini, Temps Only, Temps Unlimited
-- =============================================

-- Create global catalog organization and workspace for system-wide asset data
INSERT INTO organizations (id, name, slug, created_at) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Global Catalog System',
    'global-catalog',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO workspaces (id, organization_id, name, created_at) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Global Asset Catalog',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Insert asset catalog data
INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- OFFICE CONTAINERS (Based on ModSpace, Mobile Mini catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Office Container 10ft', '10-foot basic office container with door and window. Compact workspace for 1-2 people.', 'infrastructure', 'site_infrastructure', 'Containers', 'Conex', 'OFF-10', 
ARRAY['10ft office container', 'small office container', 'portable office', 'job site office', 'mini office'], 
ARRAY['container', 'office', 'portable', '10ft', 'compact'], 
'{"dimensions": "10x8x8.6 ft", "weight": "2500 lbs", "capacity": "1-2 people", "power": "110V", "door": "36 inch standard", "windows": "1", "floor": "plywood", "insulation": "optional", "accessories": ["desk", "chair", "outlet strips", "heater"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Office Container 20ft Standard', 'Standard 20-foot office container with windows, door, electrical outlets. Professional workspace for 2-4 people.', 'infrastructure', 'site_infrastructure', 'Containers', 'ModSpace', 'MS-20-STD', 
ARRAY['20ft office container', 'job site office', 'portable office', 'shipping container office', 'construction office'], 
ARRAY['container', 'office', 'portable', '20ft', 'modular'], 
'{"dimensions": "20x8x8.6 ft", "weight": "5000 lbs", "capacity": "2-4 people", "power": "110V/220V", "door": "36 inch standard", "windows": "2-4", "floor": "vinyl or carpet", "insulation": "R-11 walls, R-19 roof", "hvac": "wall mount AC/heat", "accessories": ["desks (2-4)", "chairs", "filing cabinets", "whiteboard", "coffee station", "mini-fridge", "phone system ready"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Office Container 20ft Executive', 'Premium 20-foot executive office with upgraded finishes and amenities.', 'infrastructure', 'site_infrastructure', 'Containers', 'ModSpace', 'MS-20-EXEC', 
ARRAY['executive office container', 'premium office', 'luxury portable office', 'upgraded office container'], 
ARRAY['container', 'office', 'executive', '20ft', 'premium'], 
'{"dimensions": "20x8x8.6 ft", "capacity": "2-3 people", "finishes": "upgraded", "flooring": "luxury vinyl or carpet", "walls": "painted drywall", "ceiling": "drop ceiling with lighting", "furniture": "executive desk, chairs, shelving", "hvac": "split system AC/heat", "accessories": ["built-in storage", "ethernet wiring", "phone system", "window treatments", "artwork"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Office Container 40ft Single Office', 'Large 40-foot office container providing spacious workspace for 6-8 people.', 'infrastructure', 'site_infrastructure', 'Containers', 'Mobile Mini', 'MM-40-OFF', 
ARRAY['40ft office container', 'double office container', 'large portable office', 'crew office'], 
ARRAY['container', 'office', 'portable', '40ft', 'large'], 
'{"dimensions": "40x8x8.6 ft", "weight": "8000 lbs", "capacity": "6-8 people", "layout": "open floor plan", "door": "36 inch entry door", "windows": "4-6", "power": "200A service", "lighting": "LED fixtures", "accessories": ["conference table", "office chairs (8)", "storage cabinets", "phone system", "network wiring", "coffee bar"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Office Container 40ft Multi-Room', '40-foot office with 2-3 separate offices and reception area.', 'infrastructure', 'site_infrastructure', 'Containers', 'ModSpace', 'MS-40-MULTI', 
ARRAY['multi-room office', '40ft office with rooms', 'divided office container', 'office suite'], 
ARRAY['container', 'office', 'multi-room', '40ft'], 
'{"dimensions": "40x8x8.6 ft", "layout": "2-3 private offices + reception", "walls": "interior partition walls", "doors": "interior office doors with privacy", "capacity": "4-6 people", "accessories": ["reception desk", "waiting chairs", "office furniture package", "phone system", "signage"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Office Container 60ft Double Wide', '60-foot double-wide office created from two 20ft units. Spacious open layout for 10-12 people.', 'infrastructure', 'site_infrastructure', 'Containers', 'ModSpace', 'MS-60-DW', 
ARRAY['60ft office', 'double wide office', 'large office container', 'combo office'], 
ARRAY['container', 'office', '60ft', 'double-wide', 'combo'], 
'{"dimensions": "60x16x8.6 ft", "construction": "two 20ft units combined", "capacity": "10-12 people", "layout": "open floor plan or divided", "power": "400A service", "hvac": "multi-zone", "accessories": ["conference area", "multiple workstations", "kitchenette", "restroom option"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- STORAGE CONTAINERS (Based on industry standards)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Storage Container 10ft', '10-foot cargo container for small equipment storage.', 'infrastructure', 'site_infrastructure', 'Containers', 'Conex', 'STG-10', 
ARRAY['10ft storage', 'small storage container', 'mini container', 'compact storage'], 
ARRAY['container', 'storage', '10ft', 'cargo'], 
'{"dimensions": "10x8x8.6 ft", "capacity": "560 cu ft", "weight": "2200 lbs", "doors": "double doors", "floor": "marine plywood", "lockable": true, "weatherproof": true, "accessories": ["shelving units", "ventilation", "padlocks", "ramps"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Storage Container 20ft Standard', 'Standard 20-foot ISO shipping container for secure equipment storage.', 'infrastructure', 'site_infrastructure', 'Containers', 'Conex', 'STG-20-STD', 
ARRAY['20ft storage container', 'shipping container', 'cargo container', 'sea container', 'conex box'], 
ARRAY['container', 'storage', '20ft', 'iso', 'secure'], 
'{"dimensions": "20x8x8.6 ft", "capacity": "1172 cu ft", "weight": "5000 lbs", "payload": "62790 lbs", "doors": "double doors 7.8ft x 7.6ft", "floor": "marine plywood", "construction": "corten steel", "weatherproof": true, "accessories": ["shelving", "ventilation vents", "heavy-duty padlock", "loading ramp", "interior lighting"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Storage Container 20ft High Cube', '20-foot high cube container with extra vertical clearance (9.6ft vs 8.6ft).', 'infrastructure', 'site_infrastructure', 'Containers', 'Conex', 'STG-20-HC', 
ARRAY['20ft high cube', 'high cube container', 'tall storage container', 'hc container'], 
ARRAY['container', 'storage', '20ft', 'high-cube', 'tall'], 
'{"dimensions": "20x8x9.6 ft", "capacity": "1319 cu ft", "extra_height": "12 inches", "doors": "double doors 7.8ft x 8.5ft", "accessories": ["tall shelving", "vertical racks", "climate control option"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Storage Container 40ft Standard', 'Full-size 40-foot ISO container for large equipment and materials.', 'infrastructure', 'site_infrastructure', 'Containers', 'Conex', 'STG-40-STD', 
ARRAY['40ft storage', '40ft container', 'large shipping container', '40 foot cargo container'], 
ARRAY['container', 'storage', '40ft', 'large', 'iso'], 
'{"dimensions": "40x8x8.6 ft", "capacity": "2390 cu ft", "weight": "8200 lbs", "payload": "59040 lbs", "doors": "double doors 7.8ft x 7.6ft", "accessories": ["heavy-duty shelving", "forklift pockets", "tie-down points", "ventilation", "interior LED lights"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Storage Container 40ft High Cube', 'Extra tall 40-foot container with 9.6ft interior height.', 'infrastructure', 'site_infrastructure', 'Containers', 'Conex', 'STG-40-HC', 
ARRAY['40ft high cube', '40 foot tall container', 'hc 40', 'jumbo container'], 
ARRAY['container', 'storage', '40ft', 'high-cube'], 
'{"dimensions": "40x8x9.6 ft", "capacity": "2694 cu ft", "extra_height": "12 inches", "common_use": "oversized equipment", "accessories": ["pallet racks", "mezzanine floor option", "roll-up door option"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Refrigerated Container 20ft', '20-foot refrigerated shipping container for temperature-controlled storage.', 'infrastructure', 'site_infrastructure', 'Containers', 'Carrier', 'REEFER-20', 
ARRAY['reefer container', 'refrigerated storage', 'cold storage container', 'cooler container', 'freezer container'], 
ARRAY['container', 'refrigerated', 'reefer', '20ft', 'cold-storage'], 
'{"dimensions": "20x8x8.6 ft", "temperature_range": "-25°F to +25°F", "power": "460V 3-phase", "insulation": "4 inch polyurethane", "unit": "Carrier or Thermo King", "capacity": "1000 cu ft", "accessories": ["temperature monitoring", "backup power", "shelving", "thermometer"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- FENCING & BARRIERS (Based on Temp Fence, National Rent-a-Fence)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Chain Link Fence Panel 6ft x 12ft', '6-foot tall x 12-foot wide temporary chain link fence panel with galvanized steel frame.', 'infrastructure', 'site_infrastructure', 'Fencing', 'National Rent-a-Fence', 'CLF-6X12', 
ARRAY['chain link fence', 'temporary fence', 'construction fence', 'cyclone fence', 'wire fence', 'security fence', 'perimeter fence'], 
ARRAY['fence', 'chain-link', 'temporary', '6ft', 'galvanized'], 
'{"height": "6 ft", "width": "12 ft", "frame": "1-3/8 inch galvanized steel", "mesh": "9-gauge wire", "mesh_size": "2 inch diamond", "weight": "55 lbs", "accessories": ["concrete fence feet (35 lbs each)", "coupling pins", "tension wire", "privacy slats", "windscreen", "barbed wire topper", "gate panels"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Chain Link Fence Panel 8ft x 12ft', 'Taller 8-foot chain link for enhanced security.', 'infrastructure', 'site_infrastructure', 'Fencing', 'National Rent-a-Fence', 'CLF-8X12', 
ARRAY['8ft chain link', 'tall temporary fence', '8 foot fence', 'high security fence'], 
ARRAY['fence', 'chain-link', '8ft', 'tall', 'security'], 
'{"height": "8 ft", "width": "12 ft", "frame": "1-5/8 inch galvanized steel", "use_case": "high security areas", "weight": "68 lbs", "accessories": ["heavy duty feet", "top rail", "barbed wire arm", "privacy screening"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Fence Gate 4ft Single Swing', 'Single swing gate for chain link fence systems.', 'infrastructure', 'site_infrastructure', 'Fencing', 'National Rent-a-Fence', 'GATE-4-SW', 
ARRAY['fence gate', 'chain link gate', 'swing gate', 'access gate', 'walk through gate'], 
ARRAY['fence', 'gate', 'chain-link', '4ft', 'swing'], 
'{"width": "4 ft", "height": "6 ft", "type": "single swing", "frame": "galvanized steel", "latch": "fork latch with padlock hasp", "hinges": "heavy duty", "accessories": ["padlock", "gate closer", "signage"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Fence Gate 10ft Double Swing', 'Double swing gate for vehicle access.', 'infrastructure', 'site_infrastructure', 'Fencing', 'National Rent-a-Fence', 'GATE-10-DW', 
ARRAY['double gate', 'vehicle gate', '10ft gate', 'drive through gate', 'entry gate'], 
ARRAY['fence', 'gate', 'double-swing', '10ft', 'vehicle'], 
'{"width": "10 ft (5ft per panel)", "height": "6 ft", "type": "double swing", "clearance": "suitable for vehicles", "accessories": ["drop pin", "cane bolt", "chain with padlock", "caution tape"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Privacy Fence Panel 6ft x 8ft Wood', 'Solid wood privacy fence panel.', 'infrastructure', 'site_infrastructure', 'Fencing', 'Temps Unlimited', 'PF-6X8-WOOD', 
ARRAY['wood privacy fence', 'privacy fence', 'solid fence', 'wooden fence', 'privacy screening'], 
ARRAY['fence', 'privacy', 'wood', '6ft'], 
'{"height": "6 ft", "width": "8 ft", "material": "pressure treated pine", "style": "dog ear pickets", "opacity": "100% privacy", "accessories": ["posts", "concrete", "gate option", "stain/paint"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Barricade Water-Filled 6ft', 'Plastic water-fillable traffic barricade for crowd and vehicle control.', 'infrastructure', 'site_infrastructure', 'Barriers', 'Plasticade', 'BAR-WF-6', 
ARRAY['water barricade', 'jersey barrier', 'traffic barrier', 'water filled barrier', 'concrete barrier alternative', 'safety barrier', 'crowd barrier'], 
ARRAY['barricade', 'water-filled', 'traffic', 'plastic', '6ft'], 
'{"length": "6 ft", "height": "32 inches", "weight_empty": "40 lbs", "weight_filled": "300 lbs", "material": "HDPE polyethylene", "color": "white (reflective tape optional)", "fill_capacity": "32 gallons", "accessories": ["reflective tape", "solar lights", "chains", "feet extensions", "dolly for moving"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Crowd Control Barrier 8.5ft Steel', 'Heavy duty interlocking steel crowd control barrier.', 'infrastructure', 'site_infrastructure', 'Barriers', 'CrowdMaster', 'CCB-8.5-STL', 
ARRAY['crowd barrier', 'bike rack barrier', 'pedestrian barrier', 'police barrier', 'barricade', 'concert barrier', 'festival barrier'], 
ARRAY['barrier', 'crowd-control', 'steel', '8.5ft', 'interlocking'], 
'{"length": "8.5 ft", "height": "3.5 ft (42 inches)", "weight": "35 lbs", "material": "14-gauge steel tubing", "finish": "powder coated", "feet": "flat feet design", "connection": "hook connection", "accessories": ["bridge clips", "wheel kit", "banner brackets", "sign holders", "storage dolly"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- TENTS & STRUCTURES (Based on Aztec, Celina, American Tent)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Frame Tent 10x10', 'Small frame tent, no center poles. Perfect for vendor booths.', 'infrastructure', 'site_infrastructure', 'Tents', 'Aztec', 'FT-10X10', 
ARRAY['10x10 tent', 'vendor tent', 'booth tent', 'small frame tent', 'pop-up frame tent'], 
ARRAY['tent', 'frame', '10x10', 'vendor'], 
'{"size": "10x10 ft", "height": "8 ft center", "capacity": "10 people standing", "frame": "aluminum", "no_center_poles": true, "fabric": "vinyl", "accessories": ["sidewalls", "weights", "stakes", "ropes", "lighting", "flooring"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Frame Tent 20x20', 'Medium frame tent suitable for events and gatherings.', 'infrastructure', 'site_infrastructure', 'Tents', 'Aztec', 'FT-20X20', 
ARRAY['20x20 tent', 'party tent', 'event tent', 'frame tent', 'clear span tent'], 
ARRAY['tent', 'frame', '20x20', 'event', 'party'], 
'{"size": "20x20 ft", "height": "12 ft center", "sq_ft": "400", "capacity": "40 standing / 32 seated", "frame": "aluminum", "fabric": "vinyl top", "accessories": ["leg drapes", "clear sidewalls", "cathedral windows", "lighting package", "heating/cooling", "dance floor", "tables/chairs"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Frame Tent 20x30', 'Versatile 20x30 frame tent for medium events.', 'infrastructure', 'site_infrastructure', 'Tents', 'Celina', 'FT-20X30', 
ARRAY['20x30 tent', 'wedding tent', 'graduation tent', 'rectangle tent'], 
ARRAY['tent', 'frame', '20x30', 'wedding'], 
'{"size": "20x30 ft", "sq_ft": "600", "capacity": "60 standing / 48 seated", "accessories": ["french doors", "window walls", "heaters", "fans", "chandeliers", "uplighting"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Frame Tent 30x60', 'Large frame tent for weddings and corporate events.', 'infrastructure', 'site_infrastructure', 'Tents', 'Celina', 'FT-30X60', 
ARRAY['30x60 tent', 'large wedding tent', 'corporate tent', 'big frame tent'], 
ARRAY['tent', 'frame', '30x60', 'large', 'wedding'], 
'{"size": "30x60 ft", "sq_ft": "1800", "capacity": "180 standing / 144 seated", "height": "12-16 ft", "accessories": ["tent liner", "leg curtains", "glass doors", "hvac system", "full lighting", "stage", "dance floor"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Frame Tent 40x80', 'Extra large tent for major events.', 'infrastructure', 'site_infrastructure', 'Tents', 'American Tent', 'FT-40X80', 
ARRAY['40x80 tent', 'giant tent', 'festival tent', 'concert tent', 'large event tent'], 
ARRAY['tent', 'frame', '40x80', 'extra-large', 'festival'], 
'{"size": "40x80 ft", "sq_ft": "3200", "capacity": "320 standing / 256 seated", "multiple_uses": "weddings, festivals, corporate", "accessories": ["tent liner", "perimeter lighting", "professional lighting", "large hvac", "staging", "power distribution"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');

-- More to come in next migration files...
