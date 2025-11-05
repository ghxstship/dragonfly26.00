-- =============================================
-- COMPREHENSIVE HEAVY EQUIPMENT CATALOG
-- Migration: 045
-- Based on: Genie, JLG, Toyota Forklifts, Hyster, Crown, Skyjack, Haulotte, Bobcat, Caterpillar
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- FORKLIFTS (Based on Toyota, Hyster, Crown, Yale catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Forklift 3000lb Electric', 'Compact 3000lb capacity electric forklift for indoor warehouse use.', 'equipment', 'heavy_equipment', 'Forklifts', 'Crown', 'FC 4500', 
ARRAY['3000lb forklift', 'electric forklift', 'warehouse forklift', '1.5 ton forklift', 'indoor forklift', 'battery forklift'], 
ARRAY['forklift', 'electric', '3000lb', 'warehouse', 'indoor'], 
'{"capacity": "3000 lbs", "lift_height": "189 inches", "power": "36V electric", "type": "sit-down rider", "fuel": "battery", "tires": "cushion", "operator": "sit-down", "use": "indoor only", "runtime": "6-8 hours per charge", "accessories": ["battery", "charger", "side shift", "fork extensions", "load backrest", "overhead guard"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Forklift 5000lb Propane', 'Standard 5000lb capacity propane forklift for indoor/outdoor use.', 'equipment', 'heavy_equipment', 'Forklifts', 'Toyota', '8FGU25', 
ARRAY['5000lb forklift', 'propane forklift', 'lpg forklift', 'lift truck', '2.5 ton forklift', 'warehouse lift'], 
ARRAY['forklift', 'propane', '5000lb', 'indoor-outdoor'], 
'{"capacity": "5000 lbs", "lift_height": "189 inches (15.75 ft)", "power": "propane/LPG", "engine": "4-cylinder", "type": "pneumatic tire", "transmission": "automatic", "turning_radius": "87 inches", "accessories": ["propane tank", "side shift", "fork positioner", "fork extensions 60-72 inches", "work lights", "backup alarm", "fire extinguisher"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Forklift 5000lb Diesel', 'Rugged 5000lb diesel forklift for outdoor/rough terrain.', 'equipment', 'heavy_equipment', 'Forklifts', 'Hyster', 'H50FT', 
ARRAY['5000lb diesel forklift', 'outdoor forklift', 'diesel lift truck', 'rough terrain forklift'], 
ARRAY['forklift', 'diesel', '5000lb', 'outdoor', 'rough-terrain'], 
'{"capacity": "5000 lbs", "lift_height": "189 inches", "fuel": "diesel", "tires": "pneumatic", "use": "outdoor/rough terrain", "accessories": ["cab enclosure option", "lights package", "strobe light"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Forklift 8000lb Propane', 'Heavy-duty 8000lb capacity for large loads.', 'equipment', 'heavy_equipment', 'Forklifts', 'Toyota', '8FGU35', 
ARRAY['8000lb forklift', 'large forklift', '4 ton forklift', 'heavy-duty forklift'], 
ARRAY['forklift', 'propane', '8000lb', 'heavy-duty'], 
'{"capacity": "8000 lbs", "lift_height": "189-240 inches", "power": "propane", "accessories": ["heavy duty forks", "side shift", "fork positioner"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Forklift 10000lb Diesel', 'Large capacity 10000lb diesel forklift for heavy industrial use.', 'equipment', 'heavy_equipment', 'Forklifts', 'Hyster', 'H10XM-12', 
ARRAY['10000lb forklift', 'large capacity forklift', '5 ton forklift', 'big forklift', 'heavy forklift'], 
ARRAY['forklift', 'diesel', '10000lb', 'industrial', 'heavy'], 
'{"capacity": "10000 lbs", "lift_height": "240 inches (20 ft)", "fuel": "diesel", "engine": "turbo diesel", "operator": "enclosed cab option", "accessories": ["heavy duty mast", "fork positioner", "cab with heat/AC", "work lights", "strobes"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Forklift 15000lb Diesel', 'Extra heavy 15000lb capacity for industrial and construction.', 'equipment', 'heavy_equipment', 'Forklifts', 'Toyota', '8FD75', 
ARRAY['15000lb forklift', 'extra heavy forklift', '7.5 ton forklift', 'industrial forklift'], 
ARRAY['forklift', 'diesel', '15000lb', 'industrial'], 
'{"capacity": "15000 lbs", "lift_height": "189-240 inches", "use": "heavy industrial, construction", "accessories": ["heavy duty forks", "operator cab", "lights"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- SCISSOR LIFTS (Based on Genie, JLG, Skyjack catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Scissor Lift 12ft Electric Micro', 'Compact 12ft electric scissor lift for tight spaces.', 'equipment', 'heavy_equipment', 'Scissor Lifts', 'Genie', 'GS-1330m', 
ARRAY['12ft scissor lift', 'micro scissor lift', 'compact lift', 'narrow scissor lift', 'mini lift'], 
ARRAY['scissor-lift', 'electric', '12ft', 'micro', 'compact'], 
'{"platform_height": "12 ft", "working_height": "18 ft", "width": "30 inches", "capacity": "350 lbs", "power": "12V battery", "weight": "1280 lbs", "use": "indoor, tight spaces", "accessories": ["battery charger", "extension deck", "pipe cradle", "tool tray"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Scissor Lift 19ft Electric', 'Standard 19ft electric scissor lift for indoor work.', 'equipment', 'heavy_equipment', 'Scissor Lifts', 'Genie', 'GS-1932', 
ARRAY['19ft scissor lift', 'slab scissor lift', 'electric scissor', 'indoor lift', 'warehouse lift'], 
ARRAY['scissor-lift', 'electric', '19ft', 'indoor'], 
'{"platform_height": "19 ft", "working_height": "25 ft", "platform_size": "32 x 70 inches", "capacity": "500 lbs", "power": "24V battery", "weight": "2565 lbs", "tires": "non-marking", "drive_speed": "3 mph", "accessories": ["battery + charger", "extension deck 2ft", "platform gate", "pipe cradle", "tool tray", "AC power to platform"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Scissor Lift 26ft Electric', 'Mid-height 26ft electric scissor for indoor applications.', 'equipment', 'heavy_equipment', 'Scissor Lifts', 'JLG', '2646ES', 
ARRAY['26ft scissor lift', 'electric scissor lift', 'mid-height lift', 'indoor scissor'], 
ARRAY['scissor-lift', 'electric', '26ft', 'indoor'], 
'{"platform_height": "26 ft", "working_height": "32 ft", "capacity": "500 lbs", "power": "24V battery", "accessories": ["charger", "platform extension", "tool tray"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Scissor Lift 32ft Electric', 'High-reach 32ft electric scissor for tall indoor work.', 'equipment', 'heavy_equipment', 'Scissor Lifts', 'Skyjack', 'SJ3226', 
ARRAY['32ft scissor lift', 'tall scissor lift', 'high electric scissor'], 
ARRAY['scissor-lift', 'electric', '32ft', 'tall'], 
'{"platform_height": "32 ft", "working_height": "38 ft", "capacity": "500 lbs", "accessories": ["battery charger", "extension deck"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Scissor Lift 19ft Rough Terrain Diesel', 'Rugged 19ft diesel scissor for outdoor use.', 'equipment', 'heavy_equipment', 'Scissor Lifts', 'Genie', 'GS-1932m RT', 
ARRAY['19ft rt scissor', 'rough terrain scissor', 'diesel scissor lift', 'outdoor scissor lift', 'rt scissor'], 
ARRAY['scissor-lift', 'diesel', '19ft', 'rough-terrain', 'outdoor'], 
'{"platform_height": "19 ft", "working_height": "25 ft", "capacity": "500 lbs", "fuel": "diesel", "4wd": true, "tires": "foam-filled pneumatic", "grade_ability": "45%", "use": "outdoor/rough terrain", "accessories": ["platform extension", "generator option", "work lights", "beacon"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Scissor Lift 26ft Rough Terrain Diesel', 'Heavy-duty 26ft diesel scissor for construction sites.', 'equipment', 'heavy_equipment', 'Scissor Lifts', 'JLG', '2646R', 
ARRAY['26ft rt scissor', '26ft rough terrain', 'diesel scissor 26ft', 'construction scissor lift'], 
ARRAY['scissor-lift', 'diesel', '26ft', 'rough-terrain'], 
'{"platform_height": "26 ft", "working_height": "32 ft", "capacity": "1000 lbs", "fuel": "diesel", "4wd": true, "accessories": ["platform extension", "generator", "outriggers", "lights"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Scissor Lift 32ft Rough Terrain Diesel', 'Large 32ft RT diesel scissor for high outdoor work.', 'equipment', 'heavy_equipment', 'Scissor Lifts', 'JLG', '3246ES', 
ARRAY['32ft rt scissor', '32ft rough terrain scissor', 'diesel scissor 32ft', 'outdoor scissor 32ft'], 
ARRAY['scissor-lift', 'diesel', '32ft', 'rough-terrain'], 
'{"platform_height": "32 ft", "working_height": "38 ft", "capacity": "1000 lbs", "4wd": true, "grade_ability": "45%", "accessories": ["platform extension 6ft", "generator", "beacon light", "work lights"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Scissor Lift 40ft Rough Terrain Diesel', 'Extra tall 40ft RT scissor for high construction work.', 'equipment', 'heavy_equipment', 'Scissor Lifts', 'Genie', 'GS-4047', 
ARRAY['40ft rt scissor', '40ft rough terrain', 'tall diesel scissor', 'high scissor lift'], 
ARRAY['scissor-lift', 'diesel', '40ft', 'tall', 'rough-terrain'], 
'{"platform_height": "40 ft", "working_height": "46 ft", "capacity": "1000 lbs", "accessories": ["platform extension", "generator", "lights package"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- BOOM LIFTS - Articulating (Based on Genie, JLG catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Boom Lift 30ft Articulating Electric', 'Compact 30ft electric articulating boom for indoor use.', 'equipment', 'heavy_equipment', 'Boom Lifts', 'Genie', 'Z-30/20N', 
ARRAY['30ft boom lift', 'articulating boom', 'knuckle boom', 'electric boom lift', 'indoor boom', 'z-boom'], 
ARRAY['boom-lift', 'articulating', 'electric', '30ft', 'indoor'], 
'{"platform_height": "30 ft", "working_height": "36 ft", "horizontal_reach": "20 ft", "capacity": "500 lbs", "power": "24V electric battery", "width": "46 inches", "non_marking_tires": true, "accessories": ["battery charger", "jib option", "platform rotation", "AC power to platform", "pipe cradle"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Boom Lift 34ft Articulating Electric', 'Narrow 34ft electric boom for tight indoor access.', 'equipment', 'heavy_equipment', 'Boom Lifts', 'JLG', 'E300AJP', 
ARRAY['34ft boom', 'narrow boom lift', 'articulating electric boom', 'indoor boom 34ft'], 
ARRAY['boom-lift', 'articulating', 'electric', '34ft'], 
'{"platform_height": "34 ft", "working_height": "40 ft", "horizontal_reach": "18 ft", "capacity": "500 lbs", "width": "30 inches ultra-narrow", "accessories": ["charger", "jib", "platform leveling"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Boom Lift 45ft Articulating', 'Standard 45ft articulating boom for indoor/outdoor use.', 'equipment', 'heavy_equipment', 'Boom Lifts', 'Genie', 'Z-45/25J', 
ARRAY['45ft boom', 'z-45', 'articulating boom 45ft', 'knuckle boom 45ft', 'cherry picker'], 
ARRAY['boom-lift', 'articulating', '45ft', 'dual-fuel'], 
'{"platform_height": "45 ft", "working_height": "51 ft", "horizontal_reach": "25 ft", "capacity": "500 lbs", "power": "dual fuel (gas/battery)", "jib": "6 ft articulating jib", "accessories": ["jib included", "platform rotation", "generator option", "work lights", "beacon"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Boom Lift 60ft Articulating', 'Large 60ft articulating boom for high exterior work.', 'equipment', 'heavy_equipment', 'Boom Lifts', 'JLG', '600AJ', 
ARRAY['60ft boom', 'articulating boom 60ft', 'large boom lift', 'z-60'], 
ARRAY['boom-lift', 'articulating', '60ft', 'large'], 
'{"platform_height": "60 ft", "working_height": "66 ft", "horizontal_reach": "38 ft", "capacity": "500 lbs", "fuel": "diesel", "4wd": true, "accessories": ["jib", "platform rotation", "generator", "beacon", "work lights"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Boom Lift 80ft Articulating', 'Extra tall 80ft articulating boom for high-reach applications.', 'equipment', 'heavy_equipment', 'Boom Lifts', 'Genie', 'Z-80/60', 
ARRAY['80ft boom', 'tall boom lift', 'articulating boom 80ft', 'high reach boom'], 
ARRAY['boom-lift', 'articulating', '80ft', 'tall'], 
'{"platform_height": "80 ft", "working_height": "86 ft", "horizontal_reach": "60 ft", "capacity": "500 lbs", "accessories": ["jib", "generator", "lights package"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- BOOM LIFTS - Telescopic/Straight (Based on Genie, JLG catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Boom Lift 40ft Telescopic', 'Straight telescopic boom 40ft with maximum reach.', 'equipment', 'heavy_equipment', 'Boom Lifts', 'Genie', 'S-40', 
ARRAY['40ft telescopic boom', 'straight boom', 'stick boom', 's-40', 'telescope boom'], 
ARRAY['boom-lift', 'telescopic', '40ft', 'straight'], 
'{"platform_height": "40 ft", "working_height": "46 ft", "horizontal_reach": "34 ft", "capacity": "500 lbs", "fuel": "diesel", "4wd": false, "accessories": ["jib option", "platform rotation", "work lights"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Boom Lift 60ft Telescopic', 'Large 60ft telescopic boom for high straight reach.', 'equipment', 'heavy_equipment', 'Boom Lifts', 'JLG', '600S', 
ARRAY['60ft telescopic', 'straight boom 60ft', 'stick boom 60ft', 'telescope 60'], 
ARRAY['boom-lift', 'telescopic', '60ft'], 
'{"platform_height": "60 ft", "working_height": "66 ft", "horizontal_reach": "47 ft", "capacity": "500 lbs", "fuel": "diesel", "accessories": ["rotating platform", "jib", "work lights", "beacon"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Boom Lift 80ft Telescopic', 'Extra tall 80ft telescopic boom for maximum height.', 'equipment', 'heavy_equipment', 'Boom Lifts', 'Genie', 'S-80', 
ARRAY['80ft telescopic', 'straight boom 80ft', 'tall stick boom', 's-80'], 
ARRAY['boom-lift', 'telescopic', '80ft', 'tall'], 
'{"platform_height": "80 ft", "working_height": "86 ft", "horizontal_reach": "65 ft", "capacity": "500 lbs", "accessories": ["jib", "platform rotation", "generator", "lights"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Boom Lift 125ft Telescopic', 'Ultra tall 125ft telescopic boom for extreme heights.', 'equipment', 'heavy_equipment', 'Boom Lifts', 'JLG', '1250AJP', 
ARRAY['125ft boom', 'ultra tall boom', 'extreme height boom', 'giant boom lift'], 
ARRAY['boom-lift', 'telescopic', '125ft', 'ultra-tall'], 
'{"platform_height": "125 ft", "working_height": "131 ft", "horizontal_reach": "68 ft", "capacity": "500 lbs", "use": "bridge work, tall buildings", "accessories": ["jib", "platform rotation", "stabilizers"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- TELEHANDLERS (Based on JLG, Genie, Caterpillar catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Telehandler 6000lb 42ft', 'Compact 6000lb telehandler with 42ft reach.', 'equipment', 'heavy_equipment', 'Telehandlers', 'JLG', 'G6-42A', 
ARRAY['6000lb telehandler', 'reach forklift', 'telescopic forklift', 'zoom boom', 'lull', 'tele-handler'], 
ARRAY['telehandler', 'reach-forklift', '6000lb', '42ft'], 
'{"capacity": "6000 lbs", "max_reach": "42 ft", "max_height": "42 ft", "fuel": "diesel", "4wd": true, "accessories": ["carriage", "bucket", "truss boom", "work platform", "pallet forks", "winch"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Telehandler 10000lb 55ft', 'Heavy-duty 10000lb telehandler with 55ft reach.', 'equipment', 'heavy_equipment', 'Telehandlers', 'JLG', 'G10-55A', 
ARRAY['10000lb telehandler', 'large telehandler', 'reach forklift 10k', '5 ton telehandler'], 
ARRAY['telehandler', '10000lb', '55ft', 'heavy-duty'], 
'{"capacity": "10000 lbs", "max_reach": "55 ft", "max_height": "55 ft", "fuel": "diesel", "enclosed_cab": true, "accessories": ["multiple attachments", "carriage", "bucket", "man basket", "forks"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- SKID STEERS & LOADERS (Based on Bobcat, Caterpillar, Case catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Skid Steer Loader Small', 'Compact skid steer for tight spaces.', 'equipment', 'heavy_equipment', 'Skid Steers', 'Bobcat', 'S450', 
ARRAY['skid steer', 'bobcat', 'skid loader', 'compact loader', 'ssl'], 
ARRAY['skid-steer', 'loader', 'compact', 'bobcat'], 
'{"capacity": "1300 lbs", "power": "49 HP", "weight": "6150 lbs", "width": "66 inches", "accessories": ["bucket", "pallet forks", "auger", "trencher", "grapple", "sweeper", "snow blade"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Skid Steer Loader Standard', 'Standard capacity skid steer for general use.', 'equipment', 'heavy_equipment', 'Skid Steers', 'Bobcat', 'S570', 
ARRAY['standard skid steer', 'bobcat loader', 'skid steer standard'], 
ARRAY['skid-steer', 'loader', 'standard'], 
'{"capacity": "2200 lbs", "power": "74 HP", "weight": "8370 lbs", "accessories": ["bucket", "forks", "attachments (20+ available)"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Track Loader Compact', 'Compact track loader for soft terrain.', 'equipment', 'heavy_equipment', 'Track Loaders', 'Caterpillar', '257D', 
ARRAY['track loader', 'compact track loader', 'ctl', 'tracked skid steer', 'multi terrain loader'], 
ARRAY['track-loader', 'ctl', 'tracked', 'compact'], 
'{"capacity": "2000 lbs", "power": "74 HP", "tracks": "rubber tracks", "use": "soft terrain, low ground pressure", "accessories": ["bucket", "forks", "multiple attachments"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');

-- More categories to follow in subsequent migration files...
