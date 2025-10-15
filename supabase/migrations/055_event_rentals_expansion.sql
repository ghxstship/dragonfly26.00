-- =============================================
-- EVENT RENTALS EXPANSION - Lounge, Bars, Decor
-- Migration: 055
-- Based on: EventsTable, Herc Rentals, Classic Party Rentals, CORT Events
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- LOUNGE FURNITURE (Based on EventsTable, CORT Events)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Sofa 3-Seat Modern White Leather', 'Modern white leather sofa for lounge areas.', 'equipment', 'event_rentals', 'Lounge Furniture', 'CORT', 'Milano White', 
ARRAY['white sofa', 'leather sofa', 'lounge sofa', '3 seat couch', 'modern couch', 'event sofa'], 
ARRAY['sofa', 'lounge', 'white', 'leather', '3-seat'], 
'{"seats": "3 people", "material": "white leather", "style": "modern", "dimensions": "84x36x32 inches", "weight_capacity": "750 lbs", "accessories": ["throw pillows"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Sofa 2-Seat Loveseat Black Leather', 'Black leather loveseat.', 'equipment', 'event_rentals', 'Lounge Furniture', 'CORT', 'Milano Black', 
ARRAY['loveseat', 'black sofa', '2 seat sofa', 'leather loveseat', 'small couch'], 
ARRAY['sofa', 'loveseat', 'black', 'leather', '2-seat'], 
'{"seats": "2 people", "material": "black leather", "dimensions": "60x36x32 inches", "accessories": ["pillows"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Armchair Leather Accent', 'Leather accent chair for lounge.', 'equipment', 'event_rentals', 'Lounge Furniture', 'CORT', 'Accent Chair', 
ARRAY['accent chair', 'armchair', 'lounge chair', 'leather chair', 'single chair'], 
ARRAY['chair', 'armchair', 'lounge', 'accent'], 
'{"seats": "1 person", "material": "leather", "dimensions": "32x34x36 inches", "style": "modern", "accessories": ["accent pillow"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Ottoman Square Tufted', 'Square tufted ottoman for seating or table.', 'equipment', 'event_rentals', 'Lounge Furniture', 'EventPro', 'OT-SQ', 
ARRAY['ottoman', 'tufted ottoman', 'square ottoman', 'lounge ottoman', 'pouf'], 
ARRAY['ottoman', 'lounge', 'tufted', 'square'], 
'{"size": "24x24x18 inches", "material": "tufted vinyl", "colors": "white, black, various", "use": "seating or coffee table", "weight_capacity": "300 lbs"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Coffee Table Acrylic Clear', 'Modern clear acrylic coffee table.', 'equipment', 'event_rentals', 'Lounge Furniture', 'EventPro', 'ACR-COFFEE', 
ARRAY['coffee table', 'acrylic table', 'clear table', 'modern table', 'lucite table'], 
ARRAY['table', 'coffee-table', 'acrylic', 'clear'], 
'{"size": "48x24x18 inches", "material": "clear acrylic", "style": "modern minimalist", "weight_capacity": "150 lbs", "use": "lounge areas"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Coffee Table Wood Rustic', 'Rustic wood coffee table.', 'equipment', 'event_rentals', 'Lounge Furniture', 'Classic Party Rentals', 'Rustic Wood', 
ARRAY['wood coffee table', 'rustic table', 'wooden table', 'farmhouse table'], 
ARRAY['table', 'coffee-table', 'wood', 'rustic'], 
'{"size": "48x28x18 inches", "material": "reclaimed wood look", "style": "rustic farmhouse", "finish": "distressed wood"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'End Table Square Modern', 'Modern square end table.', 'equipment', 'event_rentals', 'Lounge Furniture', 'EventPro', 'END-SQ', 
ARRAY['end table', 'side table', 'accent table', 'small table'], 
ARRAY['table', 'end-table', 'square', 'modern'], 
'{"size": "20x20x22 inches", "material": "various finishes", "use": "next to sofas/chairs"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Bench Tufted 6ft', 'Long tufted bench for seating.', 'equipment', 'event_rentals', 'Lounge Furniture', 'CORT', 'Tufted Bench', 
ARRAY['bench', 'tufted bench', 'seating bench', 'long bench', '6 foot bench'], 
ARRAY['bench', 'tufted', 'seating', '6ft'], 
'{"length": "72 inches", "material": "tufted vinyl", "seats": "3-4 people", "height": "18 inches", "colors": "white, black, colors"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- BAR FURNITURE (Based on EventsTable, Party Rentals)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Bar Portable 6ft Folding', 'Portable folding bar for events.', 'equipment', 'event_rentals', 'Bar Furniture', 'Cambro', 'BAR650', 
ARRAY['portable bar', 'folding bar', 'event bar', 'mobile bar', 'pop up bar'], 
ARRAY['bar', 'portable', 'folding', '6ft'], 
'{"size": "72 inches long", "features": "ice bin, bottle wells, speed rail", "folding": true, "mobility": "casters", "accessories": ["skirting", "bar mat", "bottle opener"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Bar Top Wood 8ft', 'Wooden bar top for building custom bars.', 'equipment', 'event_rentals', 'Bar Furniture', 'Classic Party Rentals', 'BAR-TOP-8', 
ARRAY['bar top', 'wood bar', 'bar surface', 'counter top'], 
ARRAY['bar-top', 'wood', '8ft'], 
'{"size": "96x24 inches", "material": "wood or laminate", "finish": "stained wood", "use": "place on risers or bases"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Bar Riser Modular', 'Modular riser for building custom bars.', 'equipment', 'event_rentals', 'Bar Furniture', 'EventPro', 'BAR-RISER', 
ARRAY['bar riser', 'bar base', 'bar platform', 'riser'], 
ARRAY['riser', 'bar', 'modular'], 
'{"size": "various sizes available", "height": "42 inches bar height", "material": "wood frame", "stackable": "modular system", "accessories": ["bar top", "skirting", "shelving"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Bar Back 8ft with Shelving', 'Back bar with glass shelving and lighting.', 'equipment', 'event_rentals', 'Bar Furniture', 'Classic Party Rentals', 'BACKBAR-8', 
ARRAY['back bar', 'bar shelving', 'bottle display', 'bar shelf'], 
ARRAY['bar', 'back-bar', 'shelving', '8ft'], 
'{"size": "8 ft", "shelves": "3 glass shelves", "lighting": "LED backlit", "mirror": "mirrored back", "accessories": ["power cord", "shelves"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- HIGHBOY & BISTRO TABLES (EventsTable)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Highboy Table 24" with Cover', 'Small highboy cocktail table with spandex cover.', 'equipment', 'event_rentals', 'Tables', 'EventPro', 'HB-24', 
ARRAY['highboy', 'highboy table', 'bistro table', 'standing table', 'cocktail highboy'], 
ARRAY['table', 'highboy', '24-inch', 'bistro'], 
'{"diameter": "24 inches", "height": "42 inches bar height", "top": "round", "cover": "spandex cover included", "colors": "white, black, colors", "accessories": ["topper optional"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Highboy Table 30" Wood Top', 'Wooden top highboy table.', 'equipment', 'event_rentals', 'Tables', 'EventPro', 'HB-30-WOOD', 
ARRAY['30 inch highboy', 'wood bistro table', 'cocktail table wood'], 
ARRAY['table', 'highboy', '30-inch', 'wood'], 
'{"diameter": "30 inches", "height": "42 inches", "top": "wood or laminate", "finish": "natural or dark", "accessories": ["stools"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- SPECIALTY SEATING (EventsTable, Party Rentals)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Throne Chair King Gold', 'Ornate gold king throne chair.', 'equipment', 'event_rentals', 'Specialty Seating', 'EventPro', 'THRONE-KING', 
ARRAY['throne chair', 'king chair', 'royal chair', 'gold throne', 'ornate chair'], 
ARRAY['chair', 'throne', 'king', 'gold', 'ornate'], 
'{"style": "king throne", "finish": "gold", "material": "wood with velvet cushion", "height": "6 ft tall", "use": "weddings, special events", "accessories": ["cushion", "matching queen throne"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Church Pew Bench 6ft', 'Wooden church pew for ceremonies.', 'equipment', 'event_rentals', 'Specialty Seating', 'Classic Party Rentals', 'PEW-6', 
ARRAY['church pew', 'pew bench', 'ceremony bench', 'wooden pew'], 
ARRAY['pew', 'bench', 'church', '6ft', 'ceremony'], 
'{"length": "6 ft", "material": "wood", "seats": "4-5 people", "use": "ceremonies, rustic events", "finish": "natural wood"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Rocking Chair Wooden', 'Wooden rocking chair for events.', 'equipment', 'event_rentals', 'Specialty Seating', 'Classic Party Rentals', 'ROCK-CHAIR', 
ARRAY['rocking chair', 'rocker', 'wooden rocker', 'porch rocker'], 
ARRAY['chair', 'rocking-chair', 'wood'], 
'{"material": "wood", "style": "traditional rocking chair", "use": "rustic events, photo ops"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- LIGHTING & DECOR (EventsTable, Party Rentals)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Chandelier Crystal 3-Tier', 'Elegant crystal chandelier for events.', 'equipment', 'event_rentals', 'Lighting', 'EventPro', 'CHAND-3T', 
ARRAY['chandelier', 'crystal chandelier', 'hanging light', 'ceiling light', 'elegant lighting'], 
ARRAY['chandelier', 'lighting', 'crystal', 'elegant'], 
'{"tiers": "3 tiers", "material": "crystal beads", "height": "36 inches", "width": "24 inches", "power": "electric or battery LED", "accessories": ["chain", "power cord", "hook", "remote"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'String Lights Edison Bulb 50ft', 'Edison bulb string lights.', 'equipment', 'event_rentals', 'Lighting', 'EventPro', 'EDISON-50', 
ARRAY['string lights', 'edison lights', 'bistro lights', 'cafe lights', 'hanging lights'], 
ARRAY['string-lights', 'edison', 'bistro', '50ft'], 
'{"length": "50 ft", "bulbs": "25 bulbs", "style": "Edison vintage bulbs", "spacing": "24 inch spacing", "power": "110V plug in", "outdoor": "weather resistant", "accessories": ["spare bulbs", "extension cord"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Uplighting LED Par Can RGBW', 'LED uplight with color mixing.', 'equipment', 'event_rentals', 'Lighting', 'Chauvet', 'SlimPAR', 
ARRAY['uplight', 'led uplight', 'par can', 'wash light', 'color light', 'pin spot'], 
ARRAY['uplight', 'led', 'par-can', 'rgbw'], 
'{"type": "LED par can", "colors": "RGBW color mixing", "power": "12 watts", "control": "DMX or wireless", "power": "110V", "accessories": ["power cord", "remote", "carrying bag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Gobo Projector Monogram', 'Gobo projector for custom monograms.', 'equipment', 'event_rentals', 'Lighting', 'Chauvet', 'GoboZoom', 
ARRAY['gobo projector', 'monogram light', 'image projector', 'logo light'], 
ARRAY['gobo', 'projector', 'monogram', 'lighting'], 
'{"type": "gobo projector", "use": "project custom image or monogram", "zoom": "adjustable zoom lens", "power": "LED", "accessories": ["gobo slide custom", "stand", "clamp", "dimmer"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Candelabra 5-Arm Silver', 'Five-arm silver candelabra.', 'equipment', 'event_rentals', 'Decor', 'EventPro', 'CAND-5ARM', 
ARRAY['candelabra', 'candle holder', '5 arm candelabra', 'centerpiece candelabra'], 
ARRAY['candelabra', 'candle-holder', '5-arm', 'silver'], 
'{"arms": "5 arms", "height": "24-30 inches", "finish": "silver or gold", "material": "metal", "use": "centerpiece, decor", "accessories": ["candles", "floral rings"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Pillar Pedestal White 42"', 'White decorative pillar pedestal.', 'equipment', 'event_rentals', 'Decor', 'EventPro', 'PIL-42', 
ARRAY['pillar', 'pedestal', 'column', 'white pillar', 'display stand'], 
ARRAY['pillar', 'pedestal', 'column', '42-inch'], 
'{"height": "42 inches", "material": "resin or fiberglass", "color": "white", "top": "flat top for displays", "use": "floral displays, decor", "accessories": ["top cap", "weighted base"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Mirror Full Length 6ft', 'Full-length standing mirror.', 'equipment', 'event_rentals', 'Decor', 'EventPro', 'MIR-6FT', 
ARRAY['mirror', 'full length mirror', 'standing mirror', 'floor mirror'], 
ARRAY['mirror', 'full-length', '6ft', 'standing'], 
'{"size": "72 inches tall", "type": "full length", "frame": "ornate or simple", "stand": "free standing", "use": "photo booth, dressing area"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- TENTS & STRUCTURES EXPANSION (Herc, Sunbelt)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Pole Tent 20x30', 'Traditional pole tent with center poles.', 'equipment', 'event_rentals', 'Tents', 'Celina', 'PT-20X30', 
ARRAY['pole tent', '20x30 tent', 'center pole tent', 'traditional tent'], 
ARRAY['tent', 'pole', '20x30'], 
'{"size": "20x30 ft", "sq_ft": "600", "capacity": "60 standing / 48 seated", "poles": "center poles required", "stakes": "requires staking", "accessories": ["stakes", "ropes", "sidewalls", "lighting"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Canopy Pop-Up 10x10', 'Instant pop-up canopy tent.', 'equipment', 'event_rentals', 'Tents', 'EZ-Up', 'Instant 10x10', 
ARRAY['pop up tent', 'canopy', 'ez up', 'instant tent', '10x10 canopy', 'vendor canopy'], 
ARRAY['canopy', 'pop-up', '10x10', 'instant'], 
'{"size": "10x10 ft", "type": "instant pop-up", "frame": "aluminum", "setup": "tool-free instant", "height": "adjustable legs", "portable": "includes roller bag", "accessories": ["stakes", "weights", "sidewalls", "roller bag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Tent Sidewall 20ft Clear Window', 'Clear window sidewall panel for tents.', 'equipment', 'event_rentals', 'Tent Accessories', 'Celina', 'SW-20-WIN', 
ARRAY['tent sidewall', 'tent wall', 'window wall', 'clear wall', 'tent panel'], 
ARRAY['sidewall', 'tent', 'clear', '20ft'], 
'{"length": "20 ft", "height": "7-8 ft", "material": "vinyl with clear windows", "attachment": "velcro or straps", "windows": "clear vinyl windows", "use": "weatherproofing tents"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Tent Weight Water Bag 40-lb', 'Water-filled weight bag for tent legs.', 'equipment', 'event_rentals', 'Tent Accessories', 'Abba Patio', 'WB-40', 
ARRAY['tent weight', 'water bag', 'tent sandbag', 'tent anchor', 'weight bag'], 
ARRAY['tent-weight', 'water-bag', '40lb'], 
'{"capacity": "40 lbs when filled", "material": "heavy duty PVC", "fill": "water fillable", "attachment": "velcro strap", "use": "weighting tent legs on hard surfaces"}'::jsonb, 
'00000000-0000-0000-0000-000000000001');
