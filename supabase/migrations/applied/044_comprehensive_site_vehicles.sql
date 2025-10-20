-- =============================================
-- COMPREHENSIVE SITE VEHICLES CATALOG
-- Migration: 044
-- Based on: Club Car, Yamaha, Polaris, John Deere, Ford, Isuzu, Mercedes, U-Haul
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- GOLF CARTS (Based on Club Car, Yamaha, EZ-GO catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Golf Cart Electric 2-Passenger', 'Standard 2-passenger electric golf cart.', 'vehicle', 'site_vehicles', 'Golf Carts', 'Club Car', 'Precedent i2', 
ARRAY['2 person golf cart', 'electric golf cart', 'utility cart', '2 seater cart', 'golf buggy'], 
ARRAY['golf-cart', 'electric', '2-passenger'], 
'{"passengers": "2", "power": "48V electric", "range": "30-40 miles per charge", "top_speed": "19 mph", "weight": "900 lbs", "cargo": "small rear basket", "accessories": ["charger", "windshield", "weather enclosure", "lights", "horn", "mirrors", "cup holders"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Golf Cart Electric 4-Passenger', 'Four-passenger electric golf cart for crew transport.', 'vehicle', 'site_vehicles', 'Golf Carts', 'Club Car', 'Precedent i4', 
ARRAY['4 person golf cart', 'electric golf cart 4 seater', 'crew cart', 'people mover', 'site buggy'], 
ARRAY['golf-cart', 'electric', '4-passenger'], 
'{"passengers": "4", "power": "48V electric battery", "range": "30 miles", "seating": "2 front + 2 rear facing", "charge_time": "8-10 hours", "accessories": ["charger 110V", "windshield", "cargo box", "light kit", "horn", "seat belts"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Golf Cart Gas 2-Passenger', 'Gas-powered 2-passenger golf cart.', 'vehicle', 'site_vehicles', 'Golf Carts', 'Yamaha', 'Drive2 PTV', 
ARRAY['gas golf cart', '2 person gas cart', 'gasoline golf cart', 'petrol cart'], 
ARRAY['golf-cart', 'gas', '2-passenger'], 
'{"passengers": "2", "engine": "13.5HP gas", "fuel_tank": "6 gallons", "range": "100+ miles", "top_speed": "19 mph", "accessories": ["weather enclosure", "windshield", "cargo bed", "lights"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Golf Cart Gas 6-Passenger', 'Large 6-passenger gas golf cart for crew transport.', 'vehicle', 'site_vehicles', 'Golf Carts', 'Yamaha', 'Drive2 Concierge', 
ARRAY['6 person golf cart', 'gas golf cart 6 seater', 'crew transport cart', 'large golf cart'], 
ARRAY['golf-cart', 'gas', '6-passenger'], 
'{"passengers": "6", "engine": "13.5HP gas", "seating": "2 front + 4 rear", "accessories": ["weather enclosure", "cooler", "ball washer", "rear seat kit", "windshield"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Utility Cart Electric Flatbed', 'Electric utility cart with flatbed for materials.', 'vehicle', 'site_vehicles', 'Utility Carts', 'Club Car', 'Carryall 500', 
ARRAY['utility cart', 'electric utility vehicle', 'flatbed cart', 'material cart', 'cargo cart'], 
ARRAY['utility-cart', 'electric', 'flatbed'], 
'{"bed_capacity": "800 lbs", "bed_size": "42 x 48 inches", "power": "48V electric", "passengers": "2", "use": "hauling materials and equipment", "accessories": ["dump bed option", "cargo sides", "tool box", "roof"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- UTVs & SIDE-BY-SIDES (Based on Polaris, Yamaha, John Deere)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'UTV Side-by-Side 2-Seat 4x4', 'Compact 2-seat utility terrain vehicle with 4WD.', 'vehicle', 'site_vehicles', 'UTVs', 'Polaris', 'Ranger 570', 
ARRAY['utv', 'side by side', 'rzr', 'utility vehicle', '4 wheeler', 'sxs', 'off road vehicle'], 
ARRAY['utv', 'side-by-side', '4x4', '2-seat'], 
'{"passengers": "2", "engine": "44HP ProStar", "bed_capacity": "1000 lbs", "towing": "1500 lbs", "4wd": true, "ground_clearance": "10 inches", "accessories": ["windshield", "roof", "winch", "cargo net", "ramps", "toolbox"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'UTV Side-by-Side 3-Seat 4x4', 'Full-size 3-seat UTV for crew and equipment.', 'vehicle', 'site_vehicles', 'UTVs', 'Polaris', 'Ranger 1000', 
ARRAY['3 seat utv', 'crew utv', 'large side by side', 'work utv'], 
ARRAY['utv', '3-seat', '4x4', 'crew'], 
'{"passengers": "3", "engine": "82HP twin", "bed_capacity": "1000 lbs", "towing": "2500 lbs", "4wd": true, "transmission": "automatic", "accessories": ["windshield", "roof", "doors", "winch 3500lb", "cargo box liner", "tool storage"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Gator Utility Vehicle 4x4', 'John Deere Gator utility vehicle for job sites.', 'vehicle', 'site_vehicles', 'UTVs', 'John Deere', 'XUV835M', 
ARRAY['gator', 'john deere gator', 'utility vehicle', 'mule', 'work cart'], 
ARRAY['gator', 'utv', 'john-deere', '4x4'], 
'{"passengers": "3", "engine": "23HP diesel", "bed_capacity": "1200 lbs", "towing": "2000 lbs", "bed": "power dump bed", "accessories": ["cargo box liner", "tool box", "gun rack", "plow mount", "windshield"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- TRUCKS (Based on Ford, Chevy, Isuzu)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Pickup Truck 1/2-Ton 4x4', 'Half-ton pickup truck for light hauling.', 'vehicle', 'site_vehicles', 'Trucks', 'Ford', 'F-150 4x4', 
ARRAY['pickup truck', 'half ton truck', 'work truck', 'f150', 'crew cab truck'], 
ARRAY['truck', 'pickup', 'half-ton', '4x4'], 
'{"payload": "2000 lbs", "towing": "11000 lbs", "passengers": "5-6", "bed": "6.5 ft", "cab": "crew cab", "drive": "4x4", "accessories": ["toolbox", "hitch", "bed liner", "tonneau cover", "ladder rack"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Pickup Truck 3/4-Ton Diesel 4x4', 'Heavy duty 3/4-ton diesel truck for towing.', 'vehicle', 'site_vehicles', 'Trucks', 'Ford', 'F-250 Diesel 4x4', 
ARRAY['3/4 ton truck', 'heavy duty truck', 'diesel truck', 'f250', 'super duty'], 
ARRAY['truck', 'pickup', '3/4-ton', 'diesel', '4x4'], 
'{"payload": "3500 lbs", "towing": "15000 lbs", "passengers": "6", "bed": "8 ft", "engine": "diesel", "accessories": ["gooseneck hitch", "toolbox", "bed liner", "ladder rack", "running boards"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Pickup Truck 1-Ton Dually Diesel', 'One-ton dually pickup for maximum towing capacity.', 'vehicle', 'site_vehicles', 'Trucks', 'Ford', 'F-350 Dually', 
ARRAY['1 ton truck', 'dually', 'super duty truck', 'f350', 'heavy duty pickup'], 
ARRAY['truck', 'pickup', '1-ton', 'dually', 'diesel'], 
'{"payload": "7640 lbs", "towing": "21000 lbs", "passengers": "6", "bed": "8 ft", "wheels": "dual rear wheels", "accessories": ["5th wheel hitch", "toolbox", "bed liner", "ladder rack", "work lights"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Box Truck 12ft', 'Small box truck for equipment transport.', 'vehicle', 'site_vehicles', 'Trucks', 'Isuzu', 'NPR 12ft', 
ARRAY['box truck', 'cube truck', 'moving truck', 'cargo truck', '12 foot truck'], 
ARRAY['truck', 'box', 'cargo', '12ft'], 
'{"box_size": "12 ft x 7 ft x 6 ft", "capacity": "3000 lbs", "ramp": "rear roll-up door", "diesel": true, "accessories": ["liftgate option", "dolly", "straps", "furniture pads"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Box Truck 16ft', 'Medium box truck for equipment and materials.', 'vehicle', 'site_vehicles', 'Trucks', 'Isuzu', 'NPR 16ft', 
ARRAY['box truck 16ft', '16 foot truck', 'medium cargo truck'], 
ARRAY['truck', 'box', '16ft'], 
'{"box_size": "16 ft", "capacity": "5000 lbs", "diesel": true, "accessories": ["liftgate", "dolly", "straps"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Box Truck 26ft', 'Large box truck for major equipment transport.', 'vehicle', 'site_vehicles', 'Trucks', 'Isuzu', 'NPR-HD 26ft', 
ARRAY['box truck 26ft', 'large moving truck', '26 foot truck', 'big cargo truck'], 
ARRAY['truck', 'box', 'cargo', '26ft', 'large'], 
'{"box_size": "26 ft x 8 ft x 8 ft", "capacity": "10000 lbs", "volume": "1700 cu ft", "ramp": "roll-up door + ramp", "accessories": ["liftgate", "appliance dolly", "furniture dolly", "tie-down straps", "furniture pads"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Cargo Van Full-Size', 'Full-size cargo van for equipment and tools.', 'vehicle', 'site_vehicles', 'Vans', 'Mercedes', 'Sprinter 2500', 
ARRAY['cargo van', 'work van', 'delivery van', 'sprinter van', 'panel van'], 
ARRAY['van', 'cargo', 'full-size', 'sprinter'], 
'{"cargo_volume": "319 cu ft", "payload": "3880 lbs", "height": "high roof", "length": "extended", "doors": "rear + side sliding", "accessories": ["shelving system", "ladder rack", "partition", "running boards", "backup camera"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Passenger Van 12-Seat', 'Passenger van for crew transport.', 'vehicle', 'site_vehicles', 'Vans', 'Ford', 'Transit 350 Wagon', 
ARRAY['passenger van', 'crew van', '12 passenger van', 'transit van', 'people carrier'], 
ARRAY['van', 'passenger', '12-seat'], 
'{"passengers": "12", "configuration": "3 rows of seats", "cargo": "behind 3rd row", "roof": "high roof", "accessories": ["tow hitch", "roof rack", "running boards", "backup camera"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Passenger Van 15-Seat', 'Large passenger van for big crew transport.', 'vehicle', 'site_vehicles', 'Vans', 'Ford', 'Transit 350 XL', 
ARRAY['15 passenger van', 'large crew van', 'shuttle van', '15 seater'], 
ARRAY['van', 'passenger', '15-seat', 'large'], 
'{"passengers": "15", "configuration": "4 rows of seats", "length": "extended", "accessories": ["luggage rack", "tow hitch", "backup camera", "steps"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- TRAILERS (Based on U-Haul, PJ Trailers, Haulmark)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Utility Trailer 5x8 Open', 'Small open utility trailer for light hauling.', 'vehicle', 'site_vehicles', 'Trailers', 'U-Haul', 'UT-5x8', 
ARRAY['utility trailer', 'open trailer', 'small trailer', '5x8 trailer', 'landscape trailer'], 
ARRAY['trailer', 'utility', 'open', '5x8'], 
'{"size": "5x8 ft", "capacity": "1800 lbs", "sides": "12 inch mesh sides", "gate": "rear ramp gate", "towing": "requires 2 inch ball", "accessories": ["spare tire", "tie-down points", "ramps", "cover"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Utility Trailer 6x12 Open', 'Medium open trailer for equipment transport.', 'vehicle', 'site_vehicles', 'Trailers', 'PJ Trailers', 'U6-12', 
ARRAY['6x12 trailer', 'open utility trailer', 'equipment trailer'], 
ARRAY['trailer', 'utility', '6x12', 'open'], 
'{"size": "6x12 ft", "capacity": "2990 lbs", "sides": "15 inch solid sides", "accessories": ["ramps", "spare tire", "tie-downs", "toolbox"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Enclosed Trailer 6x12', 'Enclosed cargo trailer for secure transport.', 'vehicle', 'site_vehicles', 'Trailers', 'Haulmark', 'PPT612', 
ARRAY['enclosed trailer', 'cargo trailer', 'box trailer', '6x12 enclosed'], 
ARRAY['trailer', 'enclosed', 'cargo', '6x12'], 
'{"size": "6x12 ft", "height": "6.5 ft interior", "capacity": "2700 lbs", "door": "rear ramp door", "accessories": ["side door", "interior lights", "tie-downs", "e-track", "spare tire"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Enclosed Trailer 7x14', 'Large enclosed trailer for equipment and materials.', 'vehicle', 'site_vehicles', 'Trailers', 'Haulmark', 'PPT714', 
ARRAY['7x14 trailer', 'large enclosed trailer', 'equipment trailer enclosed'], 
ARRAY['trailer', 'enclosed', '7x14', 'large'], 
'{"size": "7x14 ft", "height": "7 ft interior", "capacity": "7000 lbs", "door": "rear ramp door", "accessories": ["side door", "e-track", "interior lighting", "spare tire", "d-rings"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Flatbed Trailer 16ft', 'Open flatbed trailer for heavy equipment.', 'vehicle', 'site_vehicles', 'Trailers', 'PJ Trailers', 'F8-16', 
ARRAY['flatbed trailer', 'equipment trailer', 'flat trailer', 'deck trailer'], 
ARRAY['trailer', 'flatbed', 'equipment', '16ft'], 
'{"size": "16 ft x 83 inches", "capacity": "9990 lbs", "deck_height": "18 inches", "gate": "2 ft dovetail + ramps", "accessories": ["fold-up ramps", "d-rings", "spare tire", "toolbox"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Flatbed Trailer 20ft', 'Large flatbed for heavy equipment and vehicles.', 'vehicle', 'site_vehicles', 'Trailers', 'PJ Trailers', 'F8-20', 
ARRAY['20ft flatbed', 'large equipment trailer', 'car hauler', 'heavy duty trailer'], 
ARRAY['trailer', 'flatbed', '20ft', 'heavy-duty'], 
'{"size": "20 ft x 83 inches", "capacity": "14000 lbs", "deck": "wood deck", "accessories": ["ramps", "winch", "toolbox", "d-rings", "chains", "binders", "spare tire"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Dump Trailer 6x10', 'Hydraulic dump trailer for materials.', 'vehicle', 'site_vehicles', 'Trailers', 'PJ Trailers', 'D5-10', 
ARRAY['dump trailer', 'hydraulic trailer', 'tipping trailer', 'material trailer'], 
ARRAY['trailer', 'dump', 'hydraulic', '6x10'], 
'{"size": "6x10 ft", "capacity": "9990 lbs", "sides": "24 inch sides", "dump": "hydraulic dump", "power": "12V battery", "accessories": ["tarp", "spare tire", "wireless remote", "stabilizer jack"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');
