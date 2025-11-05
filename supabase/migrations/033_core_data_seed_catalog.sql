-- =============================================
-- SEED GLOBAL ASSET CATALOG - PART 2
-- Migration: 037
-- Continuation of comprehensive asset catalog
-- =============================================

-- =============================================
-- SITE VEHICLES CATALOG
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, tags, specifications, created_by) VALUES
-- Golf Carts
('00000000-0000-0000-0000-000000000001', 'Golf Cart Electric 4-Passenger', 'Electric golf cart. Also: utility cart, people mover, site buggy', 'vehicle', 'site_vehicles', 'Golf Carts', 'Club Car', 'Precedent', ARRAY['golf cart', 'electric', '4-passenger'], '{"passengers": "4", "power": "48V electric", "range": "30 miles", "accessories": ["windshield", "cargo box", "lights", "horn", "charger"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Golf Cart Gas 6-Passenger', 'Gas powered golf cart. Alt: crew cart, personnel carrier, site transport', 'vehicle', 'site_vehicles', 'Golf Carts', 'Yamaha', 'Drive2', ARRAY['golf cart', 'gas', '6-passenger'], '{"passengers": "6", "engine": "13.5HP gas", "accessories": ["weather enclosure", "cooler", "ball washer", "rear seat"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
-- Utility Vehicles
('00000000-0000-0000-0000-000000000001', 'UTV Side-by-Side 4x4', 'Utility terrain vehicle. Also: rzr, side by side, utility vehicle, 4-wheeler', 'vehicle', 'site_vehicles', 'UTVs', 'Polaris', 'Ranger 1000', ARRAY['utv', 'side-by-side', '4x4', 'utility'], '{"passengers": "3", "bed_capacity": "1000 lbs", "4wd": true, "accessories": ["windshield", "roof", "winch", "cargo net", "ramps"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Gator Utility Vehicle', 'John Deere utility vehicle. Alt: mule, gator, work cart, farm utility vehicle', 'vehicle', 'site_vehicles', 'UTVs', 'John Deere', 'XUV835M', ARRAY['gator', 'utv', 'utility', '4x4'], '{"passengers": "3", "bed_capacity": "1200 lbs", "accessories": ["cargo box liner", "tool box", "gun rack", "plow mount"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
-- Trucks
('00000000-0000-0000-0000-000000000001', 'Pickup Truck 1-Ton', 'Heavy duty pickup truck. Also: dually, work truck, crew cab truck', 'vehicle', 'site_vehicles', 'Trucks', 'Ford', 'F-350', ARRAY['truck', 'pickup', '1-ton', 'heavy-duty'], '{"payload": "7640 lbs", "towing": "21000 lbs", "passengers": "6", "accessories": ["toolbox", "hitch", "bed liner", "ladder rack"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Box Truck 26ft', 'Large box truck for equipment transport. Alt: cube truck, moving truck, cargo truck', 'vehicle', 'site_vehicles', 'Trucks', 'Isuzu', 'NPR-HD', ARRAY['box truck', 'cargo', '26ft'], '{"box_size": "26 ft", "capacity": "10000 lbs", "ramp": true, "accessories": ["liftgate", "dolly", "straps", "furniture pads"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Cargo Van', 'Full-size cargo van. Also: work van, delivery van, sprinter van', 'vehicle', 'site_vehicles', 'Vans', 'Mercedes', 'Sprinter 2500', ARRAY['van', 'cargo', 'sprinter'], '{"cargo": "319 cu ft", "payload": "3880 lbs", "accessories": ["shelving", "ladder rack", "partition", "running boards"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
-- Trailers
('00000000-0000-0000-0000-000000000001', 'Enclosed Trailer 7x14', 'Enclosed cargo trailer. Alt: cargo trailer, equipment trailer, hauling trailer', 'vehicle', 'site_vehicles', 'Trailers', 'Haulmark', 'PPT714', ARRAY['trailer', 'enclosed', 'cargo'], '{"size": "7x14 ft", "capacity": "7000 lbs", "accessories": ["ramp door", "tie-downs", "e-track", "spare tire"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Flatbed Trailer 20ft', 'Open flatbed trailer. Also: equipment trailer, flat trailer, utility trailer', 'vehicle', 'site_vehicles', 'Trailers', 'PJ Trailers', 'F8', ARRAY['trailer', 'flatbed', 'equipment'], '{"size": "20 ft", "capacity": "14000 lbs", "accessories": ["ramps", "winch", "toolbox", "d-rings", "chains"]}'::jsonb, '00000000-0000-0000-0000-000000000001');

-- =============================================
-- HEAVY EQUIPMENT CATALOG
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, tags, specifications, created_by) VALUES
-- Forklifts
('00000000-0000-0000-0000-000000000001', 'Forklift 5000lb Propane', 'Standard propane forklift. Also: lift truck, propane lift, warehouse forklift', 'equipment', 'heavy_equipment', 'Forklifts', 'Toyota', '8FGU25', ARRAY['forklift', 'propane', '5000lb'], '{"capacity": "5000 lbs", "lift_height": "189 inches", "fuel": "propane", "accessories": ["propane tank", "side shift", "fork extensions", "work light"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Forklift 10000lb Diesel', 'Heavy duty diesel forklift. Alt: large forklift, outdoor forklift, rough terrain forklift', 'equipment', 'heavy_equipment', 'Forklifts', 'Hyster', 'H10XM-12', ARRAY['forklift', 'diesel', '10000lb', 'heavy-duty'], '{"capacity": "10000 lbs", "lift_height": "240 inches", "accessories": ["fork positioner", "cab enclosure", "lights"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
-- Scissor Lifts
('00000000-0000-0000-0000-000000000001', 'Scissor Lift 19ft Electric', 'Indoor electric scissor lift. Also: man lift, aerial lift, work platform', 'equipment', 'heavy_equipment', 'Lifts', 'Genie', 'GS-1932', ARRAY['scissor lift', 'electric', '19ft'], '{"height": "19 ft", "capacity": "500 lbs", "power": "24V electric", "accessories": ["extension deck", "gate", "platform rails", "charger"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Scissor Lift 32ft Diesel', 'Outdoor rough terrain scissor lift. Alt: rt scissor lift, diesel lift, all-terrain lift', 'equipment', 'heavy_equipment', 'Lifts', 'JLG', '3246ES', ARRAY['scissor lift', 'diesel', '32ft', 'rough-terrain'], '{"height": "32 ft", "capacity": "1000 lbs", "4wd": true, "accessories": ["platform extension", "generator", "outriggers"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
-- Boom Lifts
('00000000-0000-0000-0000-000000000001', 'Boom Lift 45ft Articulating', 'Articulating boom lift. Also: knuckle boom, cherry picker, aerial work platform', 'equipment', 'heavy_equipment', 'Lifts', 'Genie', 'Z-45/25J', ARRAY['boom lift', 'articulating', '45ft'], '{"height": "45 ft", "reach": "25 ft", "capacity": "500 lbs", "accessories": ["jib", "platform leveling", "generator", "beacon light"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Boom Lift 60ft Telescopic', 'Straight boom lift. Alt: stick boom, telescoping boom, man lift', 'equipment', 'heavy_equipment', 'Lifts', 'JLG', '600S', ARRAY['boom lift', 'telescopic', '60ft'], '{"height": "60 ft", "reach": "47 ft", "capacity": "500 lbs", "accessories": ["rotating platform", "platform gate", "work lights"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
// Aerial Lifts
('00000000-0000-0000-0000-000000000001', 'Personnel Lift Push-Around', 'Manual push aerial lift. Also: vertical lift, push lift, personal lift', 'equipment', 'heavy_equipment', 'Lifts', 'Ballymore', 'AWP-30', ARRAY['personnel lift', 'push', 'vertical'], '{"height": "30 ft", "capacity": "350 lbs", "manual": true, "accessories": ["outriggers", "tool tray", "safety rails"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
-- Telehandlers
('00000000-0000-0000-0000-000000000001', 'Telehandler 10000lb', 'Telescopic handler. Also: reach forklift, zoom boom, lull, telescopic forklift', 'equipment', 'heavy_equipment', 'Telehandlers', 'JLG', 'G10-55A', ARRAY['telehandler', 'reach forklift', '10000lb'], '{"capacity": "10000 lbs", "reach": "55 ft", "accessories": ["carriage", "bucket", "truss boom", "work platform"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
-- Loaders
('00000000-0000-0000-0000-000000000001', 'Skid Steer Loader', 'Compact skid steer. Also: bobcat, skid loader, compact loader', 'equipment', 'heavy_equipment', 'Loaders', 'Bobcat', 'S570', ARRAY['skid steer', 'loader', 'compact'], '{"capacity": "2200 lbs", "power": "74 HP", "accessories": ["bucket", "pallet forks", "auger", "grapple", "sweeper"]}'::jsonb, '00000000-0000-0000-0000-000000000001');

-- =============================================
-- CONSUMABLES CATALOG
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, tags, specifications, created_by) VALUES
-- Tape & Adhesives
('00000000-0000-0000-0000-000000000001', 'Gaffer Tape 2" Black (Case of 24)', 'Professional gaffer tape. Also: gaff tape, stage tape, grip tape, cloth tape', 'consumable', 'consumables', 'Tape', 'ProTapes', 'PRO-46', ARRAY['gaffer tape', 'tape', 'black', 'case'], '{"width": "2 inches", "length": "55 yards", "color": "black", "quantity": "24 rolls"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Spike Tape 1/2" Assorted Colors (Pack of 12)', 'Narrow spike tape. Also: floor tape, marking tape, console tape', 'consumable', 'consumables', 'Tape', 'ProTapes', 'PRO-SPIKE', ARRAY['spike tape', 'tape', 'marking', 'colors'], '{"width": "0.5 inches", "colors": "12 colors", "removable": true}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Duct Tape 2" Silver (Case of 24)', 'Heavy duty duct tape. Also: duck tape, cloth tape, utility tape', 'consumable', 'consumables', 'Tape', '3M', '3939', ARRAY['duct tape', 'tape', 'silver'], '{"width": "2 inches", "length": "60 yards", "quantity": "24 rolls"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
// Cable Management
('00000000-0000-0000-0000-000000000001', 'Zip Ties Assorted Pack (1000 pcs)', 'Cable ties assorted sizes. Also: cable ties, wire ties, ty-raps, tie wraps', 'consumable', 'consumables', 'Cable Management', 'Gardner Bender', 'ZT-ASST', ARRAY['zip ties', 'cable ties', 'assorted'], '{"sizes": "4\", 6\", 8\", 11\"", "quantity": "1000", "color": "black/white"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Velcro Cable Wraps 8" (Pack of 100)', 'Reusable velcro straps. Also: cable wraps, hook and loop, velcro ties', 'consumable', 'consumables', 'Cable Management', 'Velcro', 'VEK90303', ARRAY['velcro', 'cable wrap', 'reusable'], '{"length": "8 inches", "quantity": "100", "reusable": true}'::jsonb, '00000000-0000-0000-0000-000000000001'),
-- Marking & Paint
('00000000-0000-0000-0000-000000000001', 'Spray Paint Marking (Case of 12)', 'Inverted marking spray paint. Also: field marking paint, layout paint, striping paint', 'consumable', 'consumables', 'Paint', 'Rust-Oleum', 'M1800', ARRAY['spray paint', 'marking', 'paint'], '{"type": "inverted spray", "colors": "various", "quantity": "12 cans"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Chalk Line Set', 'Chalk line and refills. Also: snap line, string line, marking line', 'consumable', 'consumables', 'Marking', 'Tajima', 'PZB', ARRAY['chalk line', 'marking', 'layout'], '{"accessories": ["chalk line reel", "chalk refill (red, blue, white)", "braided line"]}'::jsonb, '00000000-0000-0000-0000-000000000001'),
-- Fasteners
('00000000-0000-0000-0000-000000000001', 'Screws Assorted Kit', 'Hardware assortment. Also: fastener kit, screw set, hardware set', 'consumable', 'consumables', 'Fasteners', 'GRK', 'ASST-KIT', ARRAY['screws', 'fasteners', 'assorted'], '{"types": "wood screws, machine screws, sheet metal", "quantity": "1500+ pieces"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Nuts Bolts Washers Kit', 'Metric and SAE hardware. Also: hardware kit, bolt set, nut assortment', 'consumable', 'consumables', 'Fasteners', 'Neiko', '53417A', ARRAY['nuts', 'bolts', 'hardware'], '{"sizes": "metric + SAE", "quantity": "1000+ pieces", "includes": "nuts, bolts, washers, lock washers"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
-- Batteries
('00000000-0000-0000-0000-000000000001', 'Batteries AA (Box of 144)', 'Alkaline AA batteries bulk. Also: double a batteries, aa cells, alkaline batteries', 'consumable', 'consumables', 'Batteries', 'Duracell', 'MN1500', ARRAY['batteries', 'aa', 'alkaline'], '{"type": "AA alkaline", "quantity": "144", "voltage": "1.5V"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Batteries 9V (Box of 72)', '9-volt alkaline batteries. Also: 9 volt batteries, pp3 batteries, square batteries', 'consumable', 'consumables', 'Batteries', 'Duracell', 'MN1604', ARRAY['batteries', '9v', 'alkaline'], '{"type": "9V alkaline", "quantity": "72", "voltage": "9V"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
-- Cleaning
('00000000-0000-0000-0000-000000000001', 'Shop Rags (Box of 200)', 'Industrial shop towels. Also: mechanic rags, cleaning rags, shop towels', 'consumable', 'consumables', 'Cleaning', 'Scott', 'Shop Towels', ARRAY['rags', 'towels', 'cleaning'], '{"quantity": "200", "material": "absorbent paper", "size": "10x12 inches"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Trash Bags 55 Gallon (Box of 100)', 'Heavy duty trash bags. Also: garbage bags, contractor bags, lawn bags', 'consumable', 'consumables', 'Cleaning', 'Glad', 'Heavy Duty', ARRAY['trash bags', 'garbage bags', '55-gallon'], '{"size": "55 gallon", "quantity": "100", "thickness": "2 mil", "type": "heavy duty"}'::jsonb, '00000000-0000-0000-0000-000000000001');

-- Continue with Event Rentals, Signage, Backline, etc...
