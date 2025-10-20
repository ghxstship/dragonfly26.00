-- =============================================
-- COMPREHENSIVE RESTAURANT EQUIPMENT CATALOG
-- Migration: 051
-- Based on: WebstaurantStore, Sunbelt Rentals, Herc Rentals
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- COOKING EQUIPMENT (Based on WebstaurantStore)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Range 6-Burner Gas with Oven', 'Commercial 6-burner gas range with standard oven.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Vulcan', '60SS-6B24G', 
ARRAY['6 burner range', 'commercial range', 'gas stove', 'restaurant stove', 'cooking range', 'commercial oven'], 
ARRAY['range', 'gas', '6-burner', 'oven', 'cooking'], 
'{"burners": "6 open burners 30000 BTU each", "oven": "standard oven below", "size": "60 inches wide", "output": "180000 BTU total", "fuel": "natural gas or propane", "material": "stainless steel", "legs": "adjustable stainless legs", "accessories": ["griddle option", "charbroiler option", "casters", "backsplash"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Griddle Flat Top 36" Gas', 'Commercial flat top griddle.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Star', '636TF', 
ARRAY['flat top griddle', 'commercial griddle', 'gas griddle', 'flat grill', 'griddle top', 'plancha'], 
ARRAY['griddle', 'flat-top', 'gas', '36-inch'], 
'{"size": "36 inches wide", "surface": "1 inch thick steel plate", "burners": "3 burners", "output": "90000 BTU", "controls": "thermostatic controls", "grease": "front grease trough", "accessories": ["splash guard", "cover", "scraper"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Charbroiler Gas 36"', 'Heavy-duty gas charbroiler.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Vulcan', 'VACB36', 
ARRAY['charbroiler', 'char grill', 'commercial grill', 'gas grill', 'radiant charbroiler'], 
ARRAY['charbroiler', 'grill', 'gas', '36-inch'], 
'{"size": "36 inches", "type": "radiant charbroiler", "grates": "cast iron grates", "output": "120000 BTU", "radiants": "stainless steel radiants", "accessories": ["grease pan", "stand"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Deep Fryer Double Basket Gas', 'Commercial double basket deep fryer.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Pitco', 'SG14S', 
ARRAY['deep fryer', 'commercial fryer', 'gas fryer', 'double basket fryer', 'fry station'], 
ARRAY['fryer', 'deep-fryer', 'gas', 'double-basket'], 
'{"capacity": "40-50 lbs oil", "baskets": "2 full size baskets", "output": "90000 BTU", "temp_range": "200-400°F", "material": "stainless steel", "filtration": "built-in filtration", "accessories": ["baskets (2)", "fry scoop", "cover"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Convection Oven Gas Full-Size', 'Full-size commercial convection oven.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Vulcan', 'VC4GD', 
ARRAY['convection oven', 'commercial oven', 'bakery oven', 'full size oven', 'gas oven'], 
ARRAY['oven', 'convection', 'gas', 'full-size'], 
'{"size": "full size (holds 5 pans)", "racks": "5 racks", "doors": "double doors", "controls": "digital controls", "temp_range": "150-500°F", "output": "54000 BTU", "accessories": ["sheet pans (5)", "racks", "steam injection option"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Pizza Oven Deck Gas Single', 'Single deck pizza oven.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Bakers Pride', 'Y-600', 
ARRAY['pizza oven', 'deck oven', 'stone deck oven', 'commercial pizza oven'], 
ARRAY['pizza-oven', 'deck-oven', 'gas'], 
'{"decks": "1 deck", "capacity": "4-6 pizzas 16 inch", "deck": "ceramic deck", "temp": "up to 650°F", "output": "120000 BTU", "accessories": ["pizza peels", "stone", "pans"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Steamer Commercial 3-Pan', 'Commercial food steamer.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Cleveland', 'SteamChef 3', 
ARRAY['food steamer', 'commercial steamer', 'steam cooker', 'vegetable steamer'], 
ARRAY['steamer', 'commercial', '3-pan'], 
'{"capacity": "3 full pans", "type": "electric or gas", "controls": "digital timer", "output": "boilerless design", "accessories": ["pans (3)", "perforated pans", "drain"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Hot Plate Double Burner Electric', 'Portable electric hot plate.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Waring', 'WDB600', 
ARRAY['hot plate', 'electric burner', 'portable burner', 'countertop burner', 'cooking plate'], 
ARRAY['hot-plate', 'electric', 'portable', '2-burner'], 
'{"burners": "2 burners", "power": "1800W per burner", "controls": "infinite controls", "surface": "cast iron", "portable": true, "accessories": ["power cord"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- FOOD HOLDING & WARMING (Based on WebstaurantStore)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Food Warmer Steam Table 3-Well', 'Electric steam table food warmer.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'APW Wyott', 'PST-3S', 
ARRAY['steam table', 'food warmer', 'buffet warmer', 'hot food table', 'serving table'], 
ARRAY['steam-table', 'food-warmer', '3-well', 'electric'], 
'{"wells": "3 wells", "capacity": "full size pans", "type": "sealed well electric", "controls": "infinite controls", "power": "120V", "accessories": ["pans (3)", "pan lids", "sneeze guard", "cutting board"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Food Warmer Steam Table 5-Well', 'Large 5-well steam table.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Vollrath', 'ServeWell 5', 
ARRAY['5 well steam table', 'large steam table', 'buffet table 5 well'], 
ARRAY['steam-table', '5-well', 'large'], 
'{"wells": "5 wells", "size": "77 inches long", "pans": "full size pans", "accessories": ["pans (5)", "lids", "sneeze guard", "cutting boards"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Heated Holding Cabinet Full-Size', 'Insulated heated holding cabinet.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Metro', 'C5 9 Series', 
ARRAY['holding cabinet', 'hot box', 'food warmer cabinet', 'heated cabinet', 'hot holding'], 
ARRAY['holding-cabinet', 'warmer', 'full-size'], 
'{"capacity": "full size (holds 18 pans)", "temp_range": "up to 200°F", "insulation": "full insulation", "doors": "full height door", "power": "electric", "mobile": "casters", "accessories": ["sheet pan slides", "universal slides", "pan rails"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Heat Lamp Dual Bulb', 'Overhead food heat lamp.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Hatco', 'DL-400', 
ARRAY['heat lamp', 'food lamp', 'warming lamp', 'infrared lamp', 'hot lamp'], 
ARRAY['heat-lamp', 'warming', 'infrared'], 
'{"bulbs": "2x 250W infrared bulbs", "mounting": "adjustable bracket", "cords": "6 ft power cord", "height": "adjustable", "accessories": ["spare bulbs", "cord", "mounting hardware"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Chafing Dish 8-Quart Full-Size', 'Stainless steel chafing dish.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Choice', 'CFULL', 
ARRAY['chafing dish', 'chafer', 'buffet chafer', 'food warmer', 'serving dish'], 
ARRAY['chafing-dish', 'chafer', '8-quart', 'full-size'], 
'{"capacity": "8 quart full size", "pans": "full size pan + water pan", "fuel": "sterno cans", "material": "stainless steel", "lid": "roll-top lid", "accessories": ["serving utensils", "water pan", "food pan", "sterno cans (2)", "drip tray"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- FOOD PREP EQUIPMENT (Based on WebstaurantStore)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Work Table Stainless 30x72"', 'Commercial stainless steel work table.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Advance Tabco', 'TAG-3012', 
ARRAY['work table', 'prep table', 'stainless table', 'commercial table', 'kitchen table'], 
ARRAY['work-table', 'prep', 'stainless', '30x72'], 
'{"size": "30x72 inches", "material": "18 gauge stainless steel", "shelf": "galvanized undershelf", "legs": "adjustable legs", "capacity": "800 lbs", "accessories": ["overshelf option", "backsplash option", "casters"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Work Table Stainless 48x30"', 'Medium stainless prep table.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Advance Tabco', 'TAG-4830', 
ARRAY['48 inch work table', 'medium prep table', '4 foot table'], 
ARRAY['work-table', '48x30', 'stainless'], 
'{"size": "48x30 inches", "material": "stainless steel", "shelf": "undershelf", "accessories": ["backsplash", "casters"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Mixer Commercial 20-Quart', 'Commercial planetary mixer.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Hobart', 'A200', 
ARRAY['commercial mixer', '20 quart mixer', 'planetary mixer', 'hobart mixer', 'stand mixer'], 
ARRAY['mixer', 'commercial', '20-quart', 'planetary'], 
'{"capacity": "20 quart bowl", "speeds": "4 speeds", "power": "1/2 HP motor", "attachments": "whip, beater, dough hook", "bowl": "stainless steel bowl", "accessories": ["bowl", "whip", "beater", "dough hook", "bowl guard"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Food Processor Commercial', 'Heavy-duty food processor.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Robot Coupe', 'R2N', 
ARRAY['food processor', 'commercial processor', 'robot coupe', 'food chopper'], 
ARRAY['food-processor', 'commercial', 'chopper'], 
'{"capacity": "3 quart bowl", "power": "1 HP motor", "speeds": "continuous", "blades": "S-blade included", "accessories": ["bowl", "lid", "S-blade", "disk holder", "disks"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Meat Slicer 12" Electric', 'Commercial meat and cheese slicer.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Hobart', '1612E', 
ARRAY['meat slicer', 'deli slicer', 'cheese slicer', 'food slicer', 'commercial slicer'], 
ARRAY['slicer', 'meat', 'deli', '12-inch'], 
'{"blade": "12 inch blade", "power": "1/3 HP", "thickness": "0 to 9/16 inch", "material": "aluminum", "sharpener": "built-in sharpener", "accessories": ["blade", "guard", "cleaning tools"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Can Opener Commercial Electric', 'Heavy-duty electric can opener.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Edlund', '270B', 
ARRAY['can opener', 'electric can opener', 'commercial opener', 'heavy duty can opener'], 
ARRAY['can-opener', 'electric', 'commercial'], 
'{"type": "electric heavy duty", "capacity": "up to #10 cans", "mount": "counter or wall mount", "power": "120V", "accessories": ["mounting bracket", "extra blade"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- DISHWASHING & SANITATION
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Dish Sink 3-Compartment Stainless', 'Three-compartment commercial sink.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Regency', '3-Bowl-Sink', 
ARRAY['3 compartment sink', 'dish sink', 'commercial sink', 'three bowl sink', 'washing sink'], 
ARRAY['sink', '3-compartment', 'stainless', 'dish'], 
'{"compartments": "3 compartments 18x18x12 each", "material": "stainless steel", "drainboards": "left and right drainboards", "faucet": "deck mount faucet", "legs": "adjustable legs", "accessories": ["faucet", "drain boards", "baskets"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Handwash Sink Portable', 'Portable hand washing station.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'PolyJohn', 'HandStand', 
ARRAY['hand wash sink', 'portable sink', 'hand washing station', 'mobile sink'], 
ARRAY['sink', 'handwash', 'portable', 'mobile'], 
'{"tanks": "fresh water + waste water tanks", "capacity": "fresh 20 gal, waste 22 gal", "pump": "foot pump operation", "accessories": ["soap dispenser", "paper towel holder", "mirror"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Dish Rack Full-Size', 'Commercial dish rack for washing.', 'equipment', 'event_rentals', 'Restaurant Equipment', 'Cambro', 'BR578', 
ARRAY['dish rack', 'dish crate', 'dishwasher rack', 'glass rack', 'plate rack'], 
ARRAY['dish-rack', 'commercial', 'full-size'], 
'{"size": "full size 20x20 inches", "capacity": "plates, glasses, or flatware", "material": "polypropylene", "color": "various", "stackable": true, "accessories": ["extenders", "dividers"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');
