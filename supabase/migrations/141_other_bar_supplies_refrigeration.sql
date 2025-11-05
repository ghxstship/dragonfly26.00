-- =============================================
-- BAR SUPPLIES & REFRIGERATION CATALOG
-- Migration: 052
-- Based on: WebstaurantStore, Sunbelt Rentals, Herc Rentals
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- BAR EQUIPMENT (Based on WebstaurantStore)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Back Bar Cooler 2-Door', 'Two-door back bar refrigerator.', 'equipment', 'event_rentals', 'Bar Equipment', 'True', 'TBB-2G-LD', 
ARRAY['back bar cooler', 'bar fridge', 'beer cooler', 'bottle cooler', 'back bar refrigerator'], 
ARRAY['cooler', 'bar', 'refrigerator', '2-door'], 
'{"doors": "2 glass swing doors", "capacity": "49 cu ft", "shelves": "adjustable shelves", "temp": "33-38°F", "lighting": "LED interior", "finish": "stainless steel", "accessories": ["bottle opener", "drip tray", "leg levelers"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Beer Keg Cooler 2-Keg', 'Two-keg beer cooler refrigerator.', 'equipment', 'event_rentals', 'Bar Equipment', 'Beverage-Air', 'DD50HC', 
ARRAY['keg cooler', 'kegerator', 'beer cooler', 'keg refrigerator', 'draft cooler'], 
ARRAY['keg-cooler', 'beer', '2-keg'], 
'{"capacity": "2 half kegs", "doors": "2 solid doors", "temp": "36-38°F", "tower": "dual tap tower", "CO2": "CO2 tank storage", "accessories": ["tap handles (2)", "drip tray", "CO2 tank", "regulator", "couplers"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Draft Beer Dispenser Portable', 'Portable draft beer jockey box.', 'equipment', 'event_rentals', 'Bar Equipment', 'Micro Matic', 'JBD-2', 
ARRAY['jockey box', 'draft dispenser', 'portable beer tap', 'beer jockey box', 'cooler tap'], 
ARRAY['jockey-box', 'draft', 'portable', 'beer'], 
'{"taps": "2 taps", "type": "coil in cooler", "cooler": "48 qt cooler", "ice": "requires ice", "mobility": "portable", "accessories": ["taps (2)", "couplers", "CO2 regulator", "gas lines", "beer lines"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Ice Bin Stainless 100-lb', 'Stainless steel ice storage bin.', 'equipment', 'event_rentals', 'Bar Equipment', 'Advance Tabco', 'IB-100', 
ARRAY['ice bin', 'ice chest', 'ice caddy', 'bar ice bin', 'ice storage'], 
ARRAY['ice-bin', 'storage', 'stainless', '100lb'], 
'{"capacity": "100 lbs ice", "material": "stainless steel", "insulation": "foam insulated", "drain": "bottom drain", "lid": "sliding lid", "accessories": ["ice scoop", "drain hose"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Blender Commercial Bar', 'High-power commercial bar blender.', 'equipment', 'event_rentals', 'Bar Equipment', 'Vitamix', 'Advance 48', 
ARRAY['bar blender', 'commercial blender', 'drink blender', 'smoothie blender', 'vitamix'], 
ARRAY['blender', 'commercial', 'bar', 'drinks'], 
'{"power": "3 HP motor", "container": "48 oz container", "speed": "variable speed", "controls": "toggle controls", "blades": "stainless steel", "accessories": ["container", "lid", "tamper", "sound enclosure"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Glass Washer Undercounter', 'Undercounter glass washing machine.', 'equipment', 'event_rentals', 'Bar Equipment', 'CMA', 'L-1X16', 
ARRAY['glass washer', 'bar glass washer', 'glasswasher', 'dish machine', 'undercounter washer'], 
ARRAY['glass-washer', 'undercounter', 'bar'], 
'{"type": "low temp chemical sanitizing", "capacity": "30 racks per hour", "cycle": "90 second cycle", "size": "undercounter", "power": "120V", "accessories": ["glass racks", "rinse aid", "detergent dispenser"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Bar Cocktail Station Portable', 'Mobile portable bar station.', 'equipment', 'event_rentals', 'Bar Equipment', 'Cambro', 'BAR650', 
ARRAY['portable bar', 'mobile bar', 'cocktail station', 'service bar', 'pop-up bar'], 
ARRAY['bar', 'portable', 'mobile', 'cocktail'], 
'{"size": "67 inches wide", "features": "ice bin, bottle wells, speed rail", "mobility": "casters", "material": "polyethylene", "accessories": ["drip tray", "bottle holders", "storage shelf", "casters"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- REFRIGERATION - COMMERCIAL (WebstaurantStore, Herc Rentals)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Reach-In Refrigerator 1-Door', 'Single door reach-in refrigerator.', 'equipment', 'site_services', 'Refrigeration', 'True', 'T-23', 
ARRAY['reach in cooler', 'commercial refrigerator', 'upright cooler', '1 door fridge', 'standing refrigerator'], 
ARRAY['refrigerator', 'reach-in', '1-door', 'commercial'], 
'{"capacity": "23 cu ft", "doors": "1 solid door", "shelves": "3 adjustable shelves", "temp": "33-38°F", "material": "stainless steel exterior", "accessories": ["shelf brackets", "legs", "thermometer"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Reach-In Refrigerator 2-Door', 'Two-door reach-in refrigerator.', 'equipment', 'site_services', 'Refrigeration', 'True', 'T-49', 
ARRAY['2 door cooler', 'double door refrigerator', 'two door reach in', 'commercial fridge 2 door'], 
ARRAY['refrigerator', 'reach-in', '2-door'], 
'{"capacity": "49 cu ft", "doors": "2 solid doors", "shelves": "6 adjustable shelves", "temp": "33-38°F", "compressor": "bottom mounted", "accessories": ["shelves (6)", "casters", "thermometer"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Reach-In Refrigerator 3-Door Glass', 'Three-door glass refrigerator merchandiser.', 'equipment', 'site_services', 'Refrigeration', 'True', 'GDM-72', 
ARRAY['3 door glass cooler', 'merchandiser', 'display refrigerator', 'glass door cooler'], 
ARRAY['refrigerator', 'glass-door', '3-door', 'merchandiser'], 
'{"capacity": "72 cu ft", "doors": "3 glass swing doors", "lighting": "LED lighting", "shelves": "9 adjustable", "visibility": "clear for merchandising", "accessories": ["shelves (9)", "digital thermometer", "casters"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Walk-In Cooler 8x10', 'Walk-in refrigeration unit.', 'equipment', 'site_services', 'Refrigeration', 'Kolpak', 'QS6-0810-CT', 
ARRAY['walk in cooler', 'walk in refrigerator', 'cold storage', 'walkin', 'cold room'], 
ARRAY['walk-in', 'cooler', 'refrigeration', '8x10'], 
'{"size": "8x10 ft interior", "height": "7 ft 6 inch", "temp": "35-38°F", "floor": "insulated floor", "door": "self-closing door", "construction": "modular panels", "accessories": ["shelving", "thermometer", "door heater", "interior light"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Walk-In Freezer 8x10', 'Walk-in freezer unit.', 'equipment', 'site_services', 'Refrigeration', 'Kolpak', 'QS6-0810-CF', 
ARRAY['walk in freezer', 'cold storage freezer', 'walk in frozen', 'walkin freezer'], 
ARRAY['walk-in', 'freezer', '8x10'], 
'{"size": "8x10 ft", "temp": "-10°F to 0°F", "floor": "insulated floor", "door": "heavy duty freezer door", "accessories": ["shelving", "thermometer", "strip curtain", "heater"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Chest Freezer 20 Cu Ft', 'Commercial chest freezer.', 'equipment', 'site_services', 'Refrigeration', 'True', 'TCF-87', 
ARRAY['chest freezer', 'top load freezer', 'commercial freezer', 'deep freezer'], 
ARRAY['freezer', 'chest', '20-cu-ft'], 
'{"capacity": "20 cu ft", "temp": "-10°F to 0°F", "lid": "sliding glass lids", "baskets": "wire baskets included", "defrost": "manual defrost", "accessories": ["baskets (3)", "dividers", "locks"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Refrigerated Prep Table 48"', 'Refrigerated sandwich/pizza prep table.', 'equipment', 'site_services', 'Refrigeration', 'Turbo Air', 'TPR-48SD', 
ARRAY['prep table cooler', 'sandwich prep table', 'pizza prep cooler', 'refrigerated table'], 
ARRAY['prep-table', 'refrigerated', '48-inch'], 
'{"size": "48 inches", "pans": "8 or 12 pan capacity", "drawers": "2 drawers below", "temp": "33-38°F", "top": "cutting board", "accessories": ["pans", "lids", "cutting board", "drawers"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- ICE MACHINES (WebstaurantStore)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Ice Machine 250-lb Modular', 'Modular ice machine head 250 lbs per day.', 'equipment', 'site_services', 'Ice Machines', 'Manitowoc', 'IYT0420A', 
ARRAY['ice maker', 'ice machine', 'commercial ice maker', 'cube ice machine', 'ice producer'], 
ARRAY['ice-machine', 'modular', '250lb', 'commercial'], 
'{"production": "250 lbs per 24 hours", "ice_type": "half cube", "cooling": "air cooled", "bin": "requires separate bin", "power": "115V", "accessories": ["ice bin sold separately", "water filter", "scoop"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Ice Machine 500-lb Modular', 'Large modular ice maker 500 lbs daily.', 'equipment', 'site_services', 'Ice Machines', 'Manitowoc', 'IYT0500A', 
ARRAY['500 lb ice machine', 'large ice maker', 'high capacity ice machine'], 
ARRAY['ice-machine', '500lb', 'modular'], 
'{"production": "500 lbs per day", "ice_type": "half cube", "accessories": ["bin", "water filter", "scoop"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Ice Machine Undercounter', 'Undercounter ice machine with bin.', 'equipment', 'site_services', 'Ice Machines', 'Scotsman', 'CU50GA', 
ARRAY['undercounter ice maker', 'small ice machine', 'compact ice maker'], 
ARRAY['ice-machine', 'undercounter', 'compact'], 
'{"production": "65 lbs per day", "storage": "26 lbs bin", "ice_type": "gourmet cube", "size": "undercounter", "accessories": ["bin", "scoop", "filter"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Ice Bin Storage 500-lb', 'Ice storage bin for modular ice machines.', 'equipment', 'site_services', 'Ice Machines', 'Manitowoc', 'B-500', 
ARRAY['ice bin', 'ice storage', 'ice hopper', 'bin for ice machine'], 
ARRAY['ice-bin', 'storage', '500lb'], 
'{"capacity": "500 lbs ice storage", "material": "polyethylene", "insulation": "foam insulated", "door": "sliding door", "accessories": ["ice scoop", "drain"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- BEVERAGE EQUIPMENT (WebstaurantStore)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Coffee Brewer Commercial 3-Burner', 'Commercial pourover coffee maker.', 'equipment', 'event_rentals', 'Beverage Equipment', 'Bunn', 'CWTF35-3', 
ARRAY['coffee maker', 'commercial coffee brewer', 'coffee machine', 'bunn brewer', 'pourover coffee'], 
ARRAY['coffee', 'brewer', 'commercial', '3-burner'], 
'{"burners": "3 burners (upper + 2 lower)", "capacity": "3.9 gal per hour", "type": "automatic pourover", "power": "120V", "decanters": "decanters sold separately", "accessories": ["decanters (3)", "filters", "cleaning supplies"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Coffee Urn 100-Cup', 'Large capacity coffee urn.', 'equipment', 'event_rentals', 'Beverage Equipment', 'Hamilton Beach', 'D50065', 
ARRAY['coffee urn', 'large coffee maker', '100 cup coffee', 'percolator', 'coffee dispenser'], 
ARRAY['coffee-urn', '100-cup', 'dispenser'], 
'{"capacity": "100 cups (2.5 gallons)", "type": "automatic percolator", "material": "stainless steel", "features": "sight glass, drip tray", "power": "120V", "accessories": ["drip tray", "cups", "coffee filters"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Beverage Dispenser 5-Gallon', 'Insulated beverage dispenser.', 'equipment', 'event_rentals', 'Beverage Equipment', 'Cambro', 'CSR5', 
ARRAY['drink dispenser', 'beverage container', 'juice dispenser', 'iced tea dispenser', '5 gallon jug'], 
ARRAY['beverage-dispenser', '5-gallon', 'insulated'], 
'{"capacity": "5 gallons", "insulation": "foam insulated", "spigot": "bottom faucet", "material": "polyethylene", "stackable": true, "accessories": ["spigot", "lid", "ladle"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Water Cooler 5-Gallon Jug', 'Water cooler dispenser for 5-gallon bottles.', 'equipment', 'site_services', 'Beverage Equipment', 'Primo', 'hTRIO', 
ARRAY['water cooler', 'water dispenser', 'bottled water cooler', 'drinking fountain'], 
ARRAY['water-cooler', 'dispenser', '5-gallon'], 
'{"type": "hot and cold", "bottle": "5 gallon bottle", "hot_temp": "185°F", "cold_temp": "39°F", "features": "bottom load or top load", "accessories": ["drip tray", "bottle"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Soda Fountain Dispenser 8-Valve', 'Commercial soda fountain machine.', 'equipment', 'event_rentals', 'Beverage Equipment', 'Cornelius', 'ED-300', 
ARRAY['soda fountain', 'soft drink dispenser', 'soda machine', 'fountain dispenser'], 
ARRAY['soda-fountain', 'dispenser', '8-valve'], 
'{"valves": "8 flavor valves", "type": "drop-in countertop", "cooling": "cold plate system", "syrup": "bag-in-box syrup", "CO2": "requires CO2 tank", "accessories": ["drip tray", "syrup lines", "CO2 regulator", "nozzles"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');
