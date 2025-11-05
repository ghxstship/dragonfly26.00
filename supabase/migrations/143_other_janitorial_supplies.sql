-- =============================================
-- JANITORIAL SUPPLIES CATALOG
-- Migration: 054
-- Based on: WebstaurantStore, Staples, Sunbelt Rentals
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- CLEANING EQUIPMENT (Based on WebstaurantStore, Sunbelt)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Vacuum Commercial Upright', 'Heavy-duty commercial upright vacuum.', 'equipment', 'site_services', 'Janitorial Equipment', 'Hoover', 'C1800', 
ARRAY['commercial vacuum', 'upright vacuum', 'vacuum cleaner', 'hoover', 'floor vacuum'], 
ARRAY['vacuum', 'upright', 'commercial', 'cleaner'], 
'{"type": "upright commercial", "cord": "50 ft cord", "path": "15 inch cleaning path", "filter": "HEPA filter", "capacity": "18 quart bag", "features": "on-board tools", "accessories": ["bags", "filters", "attachments", "belt"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Vacuum Wet/Dry 16-Gallon', 'Commercial wet/dry shop vacuum.', 'equipment', 'site_services', 'Janitorial Equipment', 'Shop-Vac', '16 Gal', 
ARRAY['wet dry vacuum', 'shop vac', 'wet vac', 'shop vacuum', 'commercial vac'], 
ARRAY['vacuum', 'wet-dry', '16-gallon', 'shop'], 
'{"capacity": "16 gallon", "type": "wet/dry", "power": "6.5 HP", "hose": "10 ft hose", "filters": "foam sleeve + cartridge filter", "accessories": ["hose", "wands", "floor nozzle", "crevice tool", "filters"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Backpack Vacuum Commercial', 'Lightweight backpack vacuum cleaner.', 'equipment', 'site_services', 'Janitorial Equipment', 'ProTeam', 'Super CoachVac', 
ARRAY['backpack vacuum', 'commercial backpack vac', 'portable vacuum'], 
ARRAY['vacuum', 'backpack', 'commercial'], 
'{"type": "backpack style", "weight": "11 lbs", "cord": "50 ft", "capacity": "6 quart", "filter": "HEPA", "accessories": ["shoulder straps", "wand", "floor tool", "bags"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Floor Scrubber Auto Walk-Behind', 'Walk-behind automatic floor scrubber.', 'equipment', 'site_services', 'Janitorial Equipment', 'Advance', 'SC500', 
ARRAY['floor scrubber', 'auto scrubber', 'floor machine', 'floor cleaner', 'walk behind scrubber'], 
ARRAY['floor-scrubber', 'auto', 'walk-behind'], 
'{"type": "walk-behind auto scrubber", "path": "20 inch", "capacity": "solution 13 gal, recovery 14 gal", "power": "24V battery", "runtime": "2.5 hours", "accessories": ["battery charger", "squeegee", "brushes", "recovery tank filter"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Floor Buffer 20" High-Speed', 'High-speed floor buffer/burnisher.', 'equipment', 'site_services', 'Janitorial Equipment', 'Clarke', 'Ultra Speed', 
ARRAY['floor buffer', 'burnisher', 'floor polisher', 'high speed buffer', 'floor machine'], 
ARRAY['floor-buffer', 'burnisher', '20-inch', 'high-speed'], 
'{"type": "high-speed burnisher", "pad": "20 inch", "speed": "1500-2000 RPM", "power": "1.5 HP", "cord": "50 ft", "accessories": ["pads", "dust mop", "pad driver"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Carpet Extractor Commercial', 'Commercial carpet extractor/shampooer.', 'equipment', 'site_services', 'Janitorial Equipment', 'Hoover', 'C3820', 
ARRAY['carpet extractor', 'carpet cleaner', 'carpet shampooer', 'steam cleaner', 'carpet washer'], 
ARRAY['carpet-extractor', 'cleaner', 'commercial'], 
'{"type": "carpet extractor", "path": "12 inch", "tanks": "solution + recovery tanks", "capacity": "9 gal solution", "power": "dual motors", "accessories": ["hose", "wand", "upholstery tool", "solution"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Pressure Washer 3000 PSI Gas', 'Gas-powered pressure washer.', 'equipment', 'site_services', 'Janitorial Equipment', 'Simpson', 'MSH3125-S', 
ARRAY['pressure washer', 'power washer', 'high pressure washer', 'gas pressure washer'], 
ARRAY['pressure-washer', 'gas', '3000-psi'], 
'{"psi": "3000 PSI", "gpm": "2.5 GPM", "engine": "Honda GCV190 gas", "pump": "axial cam pump", "hose": "25 ft high pressure hose", "accessories": ["spray wand", "nozzles (5)", "detergent tank", "gun"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Leaf Blower Backpack Gas', 'Commercial backpack leaf blower.', 'equipment', 'site_services', 'Janitorial Equipment', 'Echo', 'PB-580T', 
ARRAY['leaf blower', 'backpack blower', 'gas blower', 'commercial blower'], 
ARRAY['leaf-blower', 'backpack', 'gas'], 
'{"type": "backpack style", "power": "58.2cc 2-stroke engine", "air_speed": "215 MPH", "air_volume": "510 CFM", "fuel": "gas/oil mix", "accessories": ["tube", "backpack straps", "fuel can"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- CLEANING SUPPLIES & CHEMICALS (WebstaurantStore, Staples)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Mop Bucket Wringer Combo 35-Quart', 'Commercial mop bucket with side-press wringer.', 'equipment', 'site_services', 'Janitorial Supplies', 'Rubbermaid', 'WaveBrake', 
ARRAY['mop bucket', 'mop wringer', 'janitor bucket', 'cleaning bucket', 'wringer bucket'], 
ARRAY['mop-bucket', 'wringer', '35-quart'], 
'{"capacity": "35 quart", "wringer": "side-press wringer", "wheels": "non-marking casters", "handle": "tubular steel", "color": "yellow", "accessories": ["mop", "wet floor sign", "caddy"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Wet Mop Cotton Loop', 'Large cotton loop wet mop head.', 'consumable', 'site_services', 'Janitorial Supplies', 'Rubbermaid', 'Loop Mop', 
ARRAY['mop head', 'wet mop', 'cotton mop', 'loop mop', 'floor mop'], 
ARRAY['mop', 'wet-mop', 'cotton', 'loop'], 
'{"size": "large", "material": "cotton", "type": "loop end", "handle": "fits standard handles", "washable": true, "accessories": ["mop handle", "mop bucket"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Dust Mop 48" Commercial', 'Commercial 48-inch dust mop.', 'equipment', 'site_services', 'Janitorial Supplies', 'Boardwalk', '1648', 
ARRAY['dust mop', 'dry mop', 'floor duster', '48 inch mop', 'commercial mop'], 
ARRAY['dust-mop', '48-inch', 'commercial'], 
'{"size": "48 inch", "type": "dust mop", "material": "cotton blend", "frame": "wire frame", "handle": "60 inch handle", "washable": true, "accessories": ["handle", "frame", "dust treatment"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Broom Commercial Heavy-Duty', 'Heavy-duty angle broom.', 'equipment', 'site_services', 'Janitorial Supplies', 'Rubbermaid', 'Heavy Duty', 
ARRAY['broom', 'push broom', 'angle broom', 'commercial broom', 'floor broom'], 
ARRAY['broom', 'commercial', 'heavy-duty'], 
'{"type": "angle broom", "bristles": "flagged polypropylene", "handle": "60 inch handle", "use": "indoor/outdoor", "accessories": ["dustpan"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Dustpan Commercial Large', 'Large commercial dustpan with handle.', 'equipment', 'site_services', 'Janitorial Supplies', 'Rubbermaid', 'Lobby Pro', 
ARRAY['dustpan', 'dust pan', 'commercial dustpan', 'lobby dustpan'], 
ARRAY['dustpan', 'commercial'], 
'{"type": "lobby dustpan", "handle": "35 inch handle", "material": "polypropylene", "features": "foot pedal, cover", "use": "with broom", "accessories": ["broom"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Trash Can 32-Gallon Commercial', 'Heavy-duty 32-gallon trash can with lid.', 'equipment', 'site_services', 'Janitorial Supplies', 'Rubbermaid', 'BRUTE 32', 
ARRAY['trash can', 'garbage can', 'waste bin', 'trash barrel', 'brute can'], 
ARRAY['trash-can', '32-gallon', 'commercial'], 
'{"capacity": "32 gallon", "material": "polyethylene", "lid": "snap-on lid", "handles": "venting channels", "features": "reinforced rim, uv resistant", "accessories": ["lid", "dolly", "trash bags"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Trash Can 44-Gallon Commercial', 'Extra large 44-gallon trash can.', 'equipment', 'site_services', 'Janitorial Supplies', 'Rubbermaid', 'BRUTE 44', 
ARRAY['44 gallon trash can', 'large trash can', 'big garbage can'], 
ARRAY['trash-can', '44-gallon', 'large'], 
'{"capacity": "44 gallon", "material": "polyethylene", "features": "heavy duty", "accessories": ["lid", "dolly", "trash bags"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Trash Bags 55-Gallon Heavy-Duty Box', 'Heavy-duty trash bags for 55-gallon cans.', 'consumable', 'site_services', 'Janitorial Supplies', 'Glad', 'Heavy Duty', 
ARRAY['trash bags', 'garbage bags', 'heavy duty bags', '55 gallon bags', 'waste bags'], 
ARRAY['trash-bags', '55-gallon', 'heavy-duty'], 
'{"size": "55 gallon", "thickness": "1.5 mil", "quantity": "100 bags per box", "color": "black", "strength": "heavy duty", "use": "commercial waste"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'All-Purpose Cleaner Concentrate Gallon', 'Multi-purpose cleaning solution concentrate.', 'consumable', 'site_services', 'Janitorial Supplies', 'Simple Green', 'SMP13005', 
ARRAY['all purpose cleaner', 'multi purpose cleaner', 'cleaning solution', 'floor cleaner', 'surface cleaner'], 
ARRAY['cleaner', 'all-purpose', 'concentrate', 'gallon'], 
'{"size": "1 gallon concentrate", "dilution": "up to 30:1", "use": "floors, walls, equipment", "biodegradable": true, "fragrance": "sassafras", "accessories": ["spray bottles", "dilution chart"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Glass Cleaner Spray Case of 12', 'Glass and surface cleaner spray bottles.', 'consumable', 'site_services', 'Janitorial Supplies', 'Windex', 'Case 12', 
ARRAY['glass cleaner', 'windex', 'window cleaner', 'spray cleaner'], 
ARRAY['glass-cleaner', 'spray', 'case'], 
'{"size": "32 oz per bottle", "quantity": "12 bottles", "formula": "ammonia-free option", "use": "glass, mirrors, windows", "spray": "trigger sprayer"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Disinfectant Spray Case of 12', 'Disinfectant spray for surfaces.', 'consumable', 'site_services', 'Janitorial Supplies', 'Lysol', 'Case 12', 
ARRAY['disinfectant', 'lysol', 'sanitizer spray', 'antibacterial spray'], 
ARRAY['disinfectant', 'spray', 'sanitizer'], 
'{"size": "19 oz per can", "quantity": "12 cans", "kills": "99.9% of bacteria and viruses", "use": "hard surfaces", "fragrance": "various scents"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Paper Towels Roll Case of 12', 'Roll paper towels bulk case.', 'consumable', 'site_services', 'Janitorial Supplies', 'Bounty', 'Case 12', 
ARRAY['paper towels', 'paper towel rolls', 'cleaning towels', 'shop towels'], 
ARRAY['paper-towels', 'rolls', 'case'], 
'{"quantity": "12 rolls", "sheets": "select-a-size", "ply": "2-ply", "absorbent": "strong and absorbent", "perforated": true}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Toilet Paper Case of 96 Rolls', 'Commercial toilet paper bulk case.', 'consumable', 'site_services', 'Janitorial Supplies', 'Scott', 'Case 96', 
ARRAY['toilet paper', 'bathroom tissue', 'tp', 'toilet tissue'], 
ARRAY['toilet-paper', 'rolls', 'case', 'bulk'], 
'{"quantity": "96 rolls", "ply": "1 or 2-ply", "sheets": "1000 sheets per roll", "septic_safe": true, "use": "commercial restrooms"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Hand Soap Dispenser Refill Gallon', 'Liquid hand soap refill.', 'consumable', 'site_services', 'Janitorial Supplies', 'Softsoap', 'Gallon Refill', 
ARRAY['hand soap', 'liquid soap', 'soap refill', 'hand wash'], 
ARRAY['soap', 'hand-soap', 'refill', 'gallon'], 
'{"size": "1 gallon", "type": "liquid hand soap", "formula": "moisturizing", "fragrance": "various", "use": "refill dispensers"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Microfiber Cleaning Cloths Pack of 24', 'Reusable microfiber cleaning cloths.', 'consumable', 'site_services', 'Janitorial Supplies', 'Zwipes', '24-Pack', 
ARRAY['microfiber cloths', 'cleaning cloths', 'microfiber towels', 'cleaning rags'], 
ARRAY['microfiber', 'cloths', 'cleaning'], 
'{"quantity": "24 cloths", "size": "12x16 inches", "material": "microfiber", "colors": "various", "washable": "machine washable", "use": "dusting, cleaning, polishing"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Caution Sign Wet Floor Yellow', 'Yellow wet floor caution sign.', 'equipment', 'site_services', 'Janitorial Supplies', 'Rubbermaid', 'FG611277YEL', 
ARRAY['wet floor sign', 'caution sign', 'yellow warning sign', 'safety sign'], 
ARRAY['sign', 'wet-floor', 'caution', 'safety'], 
'{"height": "25 inches", "color": "yellow", "languages": "multi-lingual", "type": "folding A-frame", "storage": "folds flat", "accessories": ["storage hook"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');
