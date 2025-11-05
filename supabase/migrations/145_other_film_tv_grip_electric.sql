-- =============================================
-- FILM/TV GRIP & ELECTRIC EQUIPMENT CATALOG
-- Migration: 056
-- Critical equipment for film/TV production
-- Based on: Industry standard grip/electric packages, Matthews Studio Equipment, Modern Studio Equipment
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- GRIP STANDS & SUPPORT (Based on Matthews, MSE)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'C-Stand 20" with Grip Head', 'Standard 20-inch C-stand with grip head and arm.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Matthews', '366000', 
ARRAY['c stand', 'century stand', 'grip stand', '20 inch c stand', 'cstand', 'c-stand combo'], 
ARRAY['grip', 'c-stand', 'stand', 'film', 'production'], 
'{"height": "20 inches base / 10.5 ft extended", "legs": "3 legs with turtle base", "weight": "11 lbs", "capacity": "22 lbs on arm", "includes": "grip head 2.5 inch and 40 inch arm", "material": "chrome steel", "accessories": ["grip head", "arm 40 inch", "sandbag recommended"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'C-Stand 40" with Grip Head', 'Tall 40-inch C-stand for higher mounting.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Matthews', '366040', 
ARRAY['40 inch c stand', 'tall c stand', 'high c stand', 'cstand 40'], 
ARRAY['grip', 'c-stand', '40-inch', 'tall'], 
'{"height": "40 inches base / 10.5 ft extended", "weight": "15 lbs", "capacity": "22 lbs", "includes": "grip head and arm", "accessories": ["grip head", "arm", "sandbag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Combo Stand Triple Riser', 'Combo stand with triple riser for lights.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Matthews', '366080', 
ARRAY['combo stand', 'mombo combo', 'light stand', 'triple riser', 'baby combo'], 
ARRAY['grip', 'combo-stand', 'light-stand'], 
'{"height": "13 ft extended", "risers": "3 risers", "base": "5.5 ft wide", "weight": "16 lbs", "capacity": "30 lbs", "pin": "5/8 inch baby pin", "accessories": ["sandbag required for stability"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Low Boy Combo Stand', 'Low combo stand for low-angle lighting.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Matthews', 'LowBoy', 
ARRAY['low boy', 'lowboy stand', 'low combo', 'short combo stand'], 
ARRAY['grip', 'combo-stand', 'low'], 
'{"height": "6 ft 9 inch max", "weight": "12 lbs", "use": "low angle lighting", "accessories": ["sandbag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Hi-Roller Stand', 'Heavy-duty rolling stand for large lights.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Matthews', '366500', 
ARRAY['hi roller', 'rolling stand', 'heavy duty combo', 'crank stand'], 
ARRAY['grip', 'stand', 'rolling', 'heavy-duty'], 
'{"height": "14 ft 6 inch", "wheels": "3 heavy duty casters", "weight": "50 lbs", "capacity": "100 lbs", "crank": "geared crank system", "accessories": ["sandbags (2)", "safety chain"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- APPLE BOXES & CRIBBING (Industry Standard)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Apple Box Full', 'Full size apple box 20x12x8 inches.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Custom Grip', 'FULL-APPLE', 
ARRAY['full apple', 'apple box full', 'full apple box', '20x12x8 box', 'full crate'], 
ARRAY['grip', 'apple-box', 'full', 'cribbing'], 
'{"size": "20x12x8 inches", "weight": "8 lbs", "capacity": "2000 lbs", "material": "plywood construction", "use": "actor standby, camera leveling, cribbing", "stacks_with": "half, quarter, pancake"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Apple Box Half', 'Half apple box 20x12x4 inches.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Custom Grip', 'HALF-APPLE', 
ARRAY['half apple', 'apple box half', '20x12x4 box', 'half crate'], 
ARRAY['grip', 'apple-box', 'half'], 
'{"size": "20x12x4 inches", "weight": "4 lbs", "capacity": "2000 lbs", "use": "actor standby, leveling", "stacks_with": "full, quarter, pancake"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Apple Box Quarter', 'Quarter apple box 20x12x2 inches.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Custom Grip', 'QUARTER-APPLE', 
ARRAY['quarter apple', 'apple box quarter', '20x12x2 box', 'thin apple'], 
ARRAY['grip', 'apple-box', 'quarter'], 
'{"size": "20x12x2 inches", "weight": "2 lbs", "capacity": "2000 lbs", "use": "fine leveling adjustments"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Apple Box Pancake', 'Pancake apple box 20x12x1 inch.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Custom Grip', 'PANCAKE-APPLE', 
ARRAY['pancake', 'apple box pancake', 'thin apple box', '1 inch apple'], 
ARRAY['grip', 'apple-box', 'pancake'], 
'{"size": "20x12x1 inch", "weight": "1 lb", "capacity": "2000 lbs", "use": "minimal leveling, shims"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- SANDBAGS (Industry Standard)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Sandbag 15-lb', 'Standard 15-pound sandbag for light weighting.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Modern Studio', 'SB-15', 
ARRAY['sandbag', 'sand bag', '15 lb sandbag', 'shot bag', 'weight bag'], 
ARRAY['grip', 'sandbag', '15lb', 'weight'], 
'{"weight": "15 lbs", "material": "canvas with velcro closure", "fill": "sand or steel shot", "use": "weighting c-stands, light stands", "color": "tan or black"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Sandbag 25-lb', 'Heavy-duty 25-pound sandbag.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Modern Studio', 'SB-25', 
ARRAY['25 lb sandbag', 'heavy sandbag', 'shot bag 25'], 
ARRAY['grip', 'sandbag', '25lb'], 
'{"weight": "25 lbs", "material": "heavy canvas", "use": "heavy lights, wind protection"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Sandbag 35-lb', 'Extra heavy 35-pound sandbag.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Modern Studio', 'SB-35', 
ARRAY['35 lb sandbag', 'extra heavy sandbag', 'shot bag 35'], 
ARRAY['grip', 'sandbag', '35lb', 'heavy'], 
'{"weight": "35 lbs", "use": "outdoor rigging, high wind conditions"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- GRIP HEADS & HARDWARE (Matthews, Modern Studio)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Grip Head 2.5"', 'Standard 2.5-inch grip head.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Matthews', '429601', 
ARRAY['grip head', 'gobo head', '2.5 inch head', 'grip arm head'], 
ARRAY['grip', 'grip-head', 'hardware'], 
'{"size": "2.5 inch receiver", "capacity": "22 lbs", "adjustments": "360 degree rotation", "knobs": "large grip knobs", "material": "cast aluminum", "accessories": ["used with c-stand arms"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Cardellini Clamp End Jaw', 'Cardellini clamp with end jaw.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Cardellini', 'End Jaw', 
ARRAY['cardellini', 'cardellini clamp', 'end jaw clamp', 'grip clamp'], 
ARRAY['grip', 'clamp', 'cardellini'], 
'{"type": "end jaw", "capacity": "150 lbs", "jaw": "1 to 2 inch grip range", "pin": "5/8 inch baby pin", "use": "clamping to pipes, stands, truss", "material": "forged steel"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Mafer Clamp', 'Variable pressure clamp with baby pin.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Modern Studio', 'MAFER', 
ARRAY['mafer', 'mafer clamp', 'super clamp', 'variable clamp'], 
ARRAY['grip', 'clamp', 'mafer'], 
'{"jaw": "variable 0.5 to 2 inch", "pin": "5/8 inch baby pin", "use": "versatile clamping", "capacity": "30 lbs"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- ELECTRICAL/CABLE MANAGEMENT (Film production standard)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Extension Cord 25ft 12-Gauge', 'Heavy-duty 25-foot extension cord.', 'equipment', 'site_services', 'Electrical', 'Yellow Jacket', '2889', 
ARRAY['extension cord', 'stinger', '25 ft cord', 'power cord', '25 foot stinger'], 
ARRAY['electrical', 'extension', 'stinger', '25ft'], 
'{"length": "25 ft", "gauge": "12 AWG", "amps": "15A", "outlets": "3 grounded outlets", "plug": "NEMA 5-15", "jacket": "SJTW vinyl", "temp_rating": "-40 to 140°F", "lighted_end": true, "accessories": ["cord organizer"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Extension Cord 50ft 12-Gauge', 'Heavy-duty 50-foot extension cord.', 'equipment', 'site_services', 'Electrical', 'Yellow Jacket', '2890', 
ARRAY['50 ft extension', 'stinger 50', '50 foot cord', 'long stinger'], 
ARRAY['electrical', 'extension', '50ft'], 
'{"length": "50 ft", "gauge": "12 AWG", "amps": "15A", "outlets": "3 grounded", "lighted_end": true, "accessories": ["cord wrap"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Extension Cord 100ft 12-Gauge', 'Extra long 100-foot extension cord.', 'equipment', 'site_services', 'Electrical', 'Yellow Jacket', '2891', 
ARRAY['100 ft extension', 'stinger 100', '100 foot cord', 'extra long stinger'], 
ARRAY['electrical', 'extension', '100ft'], 
'{"length": "100 ft", "gauge": "12 AWG", "amps": "15A", "weight": "10 lbs", "accessories": ["cord reel"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Quad Box Power Tap', 'Four-outlet power distribution box.', 'equipment', 'site_services', 'Electrical', 'Lex Products', 'QUAD', 
ARRAY['quad box', 'quad tap', 'power tap', '4 way box', 'gang box', 'edison splitter'], 
ARRAY['electrical', 'distribution', 'quad-box'], 
'{"outlets": "4 grounded outlets", "input": "1 inlet", "amps": "15A total", "breaker": "15A circuit breaker", "housing": "molded rubber", "use": "on-set power distribution", "accessories": ["mounting bracket"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Cube Tap Triple Outlet', 'Three-way outlet splitter.', 'equipment', 'site_services', 'Electrical', 'Woods', 'Cube Tap', 
ARRAY['cube tap', 'triple tap', '3 way splitter', 'outlet splitter', 'three way adapter'], 
ARRAY['electrical', 'splitter', 'cube-tap'], 
'{"outlets": "3 grounded outlets", "amps": "15A", "compact": true, "use": "splitting single outlet"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Cable Ramp 3-Channel', 'Cable protector ramp for walkways.', 'equipment', 'site_services', 'Cable Management', 'Guard Dog', 'GD3X125', 
ARRAY['cable ramp', 'cord cover', 'cable protector', 'cord ramp', 'cable guard', 'yellow jacket'], 
ARRAY['cable', 'ramp', 'protector', '3-channel'], 
'{"channels": "3 channels", "capacity": "1 inch cables", "size": "36 inch length", "load": "20000 lbs vehicle", "material": "rubber", "color": "yellow and black", "connectable": true, "accessories": ["connectors", "end caps"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Cable Ties Velcro 12" Pack of 25', 'Reusable velcro cable ties.', 'consumable', 'site_services', 'Cable Management', 'VELCRO', 'ONE-WRAP', 
ARRAY['cable ties', 'velcro ties', 'cable straps', 'velcro wraps', 'cord organizers'], 
ARRAY['cable', 'velcro', 'ties', 'organizer'], 
'{"length": "12 inches", "width": "0.75 inch", "quantity": "25 ties", "reusable": true, "color": "black", "use": "cable management, bundling"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- FLAGS & DIFFUSION FRAMES (Grip)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Flag 18x24" Solid', 'Solid flag for light control.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Matthews', '149003', 
ARRAY['flag', 'solid flag', 'cutter', '18x24 flag', 'black flag'], 
ARRAY['grip', 'flag', 'solid', '18x24'], 
'{"size": "18x24 inches", "type": "solid black", "material": "black duvetyne fabric on frame", "use": "blocking light, creating negative fill", "mount": "5/8 inch pin", "accessories": ["c-stand and grip head required"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Flag 24x36" Solid', 'Large solid flag.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Matthews', '149004', 
ARRAY['24x36 flag', 'large flag', 'big solid', 'cutter 24x36'], 
ARRAY['grip', 'flag', '24x36', 'large'], 
'{"size": "24x36 inches", "type": "solid", "use": "blocking large light sources"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Floppy Flag 18x24"', 'Flag with floppy top for variable control.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Matthews', '149013', 
ARRAY['floppy', 'floppy flag', 'floppy cutter', '18x24 floppy'], 
ARRAY['grip', 'flag', 'floppy'], 
'{"size": "18x24 inches + 18 inch floppy", "type": "solid with hinged extension", "use": "variable light control", "floppy": "18 inch hinged top"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Frame 4x4 Empty', 'Empty 4x4-foot frame for diffusion or bounce.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Matthews', '159001', 
ARRAY['4x4 frame', 'floppy frame', 'open frame', 'diffusion frame', '48x48 frame'], 
ARRAY['grip', 'frame', '4x4', 'diffusion'], 
'{"size": "4x4 ft (48x48 inches)", "type": "empty frame", "material": "aluminum", "corners": "hinged corners for fabric", "use": "hold diffusion, bounce, or nets", "mount": "grip arm or c-stand", "fabric": "not included - separate rental"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Frame 6x6 Empty', 'Empty 6x6-foot frame for large diffusion.', 'equipment', 'heavy_equipment', 'Grip Equipment', 'Matthews', '159002', 
ARRAY['6x6 frame', 'large frame', 'diffusion frame 6x6', '72x72 frame'], 
ARRAY['grip', 'frame', '6x6', 'large'], 
'{"size": "6x6 ft", "type": "empty frame", "use": "large diffusion or bounce", "weight": "8 lbs"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- CAMERA SUPPORT (Basic)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Tripod Video Fluid Head', 'Professional video tripod with fluid head.', 'equipment', 'backline', 'Camera Support', 'Sachtler', 'Ace L', 
ARRAY['video tripod', 'fluid head tripod', 'camera tripod', 'sachtler tripod', 'film tripod'], 
ARRAY['camera', 'tripod', 'fluid-head', 'video'], 
'{"head": "fluid head", "capacity": "17.6 lbs", "height": "24 to 63 inches", "legs": "2-stage carbon fiber or aluminum", "bowl": "75mm ball leveling", "use": "video cameras, cinema cameras", "accessories": ["quick release plate", "pan bar", "carrying case", "spreader"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Hi-Hat Camera Mount', 'Low-angle camera mounting platform.', 'equipment', 'backline', 'Camera Support', 'Matthews', 'HiHat', 
ARRAY['hi hat', 'high hat', 'low angle mount', 'floor mount', 'camera base'], 
ARRAY['camera', 'hi-hat', 'mount', 'low-angle'], 
'{"height": "6 inches", "bowl": "100mm or 150mm bowl", "use": "extremely low angle shots", "mounting": "floor or apple boxes", "capacity": "50 lbs", "accessories": ["sandbag", "leveling wedges"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Baby Plate Camera Mount', 'Baby pin to camera screw adapter plate.', 'equipment', 'backline', 'Camera Support', 'Matthews', 'Baby Plate', 
ARRAY['baby plate', 'camera plate', 'mitchell mount', 'pin mount'], 
ARRAY['camera', 'mount', 'baby-plate'], 
'{"pin": "5/8 inch baby pin receiver", "top": "3/8-16 or 1/4-20 camera screw", "use": "mounting cameras to grip equipment", "capacity": "30 lbs"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- PRODUCTION EXPENDABLES (Consumables)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Camera Tape 1" Black Roll', 'Paper camera tape for marking.', 'consumable', 'event_rentals', 'Production Supplies', 'ProTapes', '001UPCAM160MBLA', 
ARRAY['camera tape', 'paper tape', 'marking tape', 'console tape', '1 inch black tape'], 
ARRAY['tape', 'camera-tape', 'production', 'expendable'], 
'{"width": "1 inch", "length": "60 yards", "color": "black", "type": "paper tape", "use": "labeling, marking focus, temporary holds", "removable": true, "residue_free": true}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Dulling Spray Matte', 'Anti-glare dulling spray for shiny surfaces.', 'consumable', 'event_rentals', 'Production Supplies', 'Kryolan', 'Dulling Spray', 
ARRAY['dulling spray', 'matte spray', 'anti shine spray', 'reflection killer', 'dull spray'], 
ARRAY['spray', 'dulling', 'production', 'expendable'], 
'{"size": "14 oz aerosol", "finish": "matte", "use": "reducing reflections on shiny surfaces", "removable": "wipes off with cloth", "dry_time": "instant", "caution": "use in ventilated area"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'White Seamless Paper 9ft Roll', 'White paper backdrop seamless roll.', 'consumable', 'event_rentals', 'Backdrops', 'Savage', 'Super White', 
ARRAY['white seamless', 'white paper', 'backdrop paper', 'seamless paper', 'white background', 'infinity wall paper'], 
ARRAY['backdrop', 'seamless', 'paper', 'white'], 
'{"width": "107 inches (9 ft)", "length": "36 ft roll", "color": "super white", "weight": "80 lb paper", "use": "photography, video backgrounds", "mounting": "requires background stand or wall mount"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Black Seamless Paper 9ft Roll', 'Black paper backdrop seamless roll.', 'consumable', 'event_rentals', 'Backdrops', 'Savage', 'Black', 
ARRAY['black seamless', 'black paper', 'black backdrop', 'black background'], 
ARRAY['backdrop', 'seamless', 'paper', 'black'], 
'{"width": "107 inches (9 ft)", "length": "36 ft roll", "color": "black", "use": "photography, video backgrounds"}'::jsonb, 
'00000000-0000-0000-0000-000000000001');
