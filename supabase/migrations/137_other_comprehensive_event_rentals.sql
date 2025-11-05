-- =============================================
-- COMPREHENSIVE EVENT RENTALS CATALOG - PART 2
-- Migration: 048
-- Linens, Draping, Staging, Dance Floors, Stanchions
-- Based on: CV Linens, BBJ Linen, Rose Brand, Intellistage, Snap Drape
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- LINENS - TABLECLOTHS ROUND (Based on CV Linens, BBJ Linen)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Tablecloth 90" Round', '90-inch round tablecloth for 48-inch tables.', 'equipment', 'event_rentals', 'Linens', 'CV Linens', 'TCR-90', 
ARRAY['90 inch linen', 'round tablecloth', 'table linen', '90 round', 'lap length linen'], 
ARRAY['linen', 'tablecloth', 'round', '90-inch'], 
'{"size": "90 inches diameter", "fits": "48 inch round table (lap length)", "material": "polyester", "colors": "white, ivory, black, 50+ colors", "care": "machine washable", "accessories": ["table clips", "overlay option", "napkins to match"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Tablecloth 108" Round', '108-inch round tablecloth for 48-60 inch tables.', 'equipment', 'event_rentals', 'Linens', 'CV Linens', 'TCR-108', 
ARRAY['108 inch linen', 'round linen 108', '108 round tablecloth', 'lap length 60 inch'], 
ARRAY['linen', 'tablecloth', 'round', '108-inch'], 
'{"size": "108 inches", "fits": "48 inch (floor) or 60 inch (lap length)", "material": "polyester", "colors": "extensive color options", "accessories": ["clips", "overlay", "table runner"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Tablecloth 120" Round', 'Standard 120-inch floor-length round linen.', 'equipment', 'event_rentals', 'Linens', 'CV Linens', 'TCR-120', 
ARRAY['120 inch linen', 'round tablecloth 120', 'floor length linen', '120 round', 'wedding linen'], 
ARRAY['linen', 'tablecloth', 'round', '120-inch', 'floor-length'], 
'{"size": "120 inches", "fits": "60 inch round table (floor length)", "drop": "30 inch drop", "most_popular": true, "material": "polyester", "colors": "50+ colors available", "accessories": ["table clips", "overlay", "skirting clips", "napkins"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Tablecloth 132" Round', 'Large 132-inch round tablecloth for 72-inch tables.', 'equipment', 'event_rentals', 'Linens', 'CV Linens', 'TCR-132', 
ARRAY['132 inch linen', '132 round tablecloth', 'large round linen', '72 inch table linen'], 
ARRAY['linen', 'tablecloth', 'round', '132-inch'], 
'{"size": "132 inches", "fits": "72 inch round table (floor length)", "accessories": ["clips", "overlay", "napkins", "table runner"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- LINENS - TABLECLOTHS RECTANGLE (Based on CV Linens)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Tablecloth 60x102" Rectangle', 'Rectangle tablecloth for 6ft tables lap length.', 'equipment', 'event_rentals', 'Linens', 'CV Linens', 'TCR-60102', 
ARRAY['60x102 linen', 'rectangle linen', '6 foot table linen', '6ft tablecloth'], 
ARRAY['linen', 'tablecloth', 'rectangle', '60x102'], 
'{"size": "60x102 inches", "fits": "6ft table (lap length)", "material": "polyester", "colors": "50+ options", "accessories": ["clips", "runner", "overlay"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Tablecloth 90x132" Rectangle', 'Standard rectangle floor-length linen for 6ft tables.', 'equipment', 'event_rentals', 'Linens', 'CV Linens', 'TCR-90132', 
ARRAY['90x132 linen', 'rectangle tablecloth', '6ft floor length linen', 'banquet linen'], 
ARRAY['linen', 'tablecloth', 'rectangle', '90x132', 'floor-length'], 
'{"size": "90x132 inches", "fits": "6ft table (floor length)", "most_popular": true, "material": "polyester", "colors": "extensive", "accessories": ["table skirt", "clips", "runner", "overlay"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Tablecloth 90x156" Rectangle', 'Floor-length rectangle linen for 8ft tables.', 'equipment', 'event_rentals', 'Linens', 'CV Linens', 'TCR-90156', 
ARRAY['90x156 linen', '8 foot table linen', '8ft tablecloth', 'long rectangle linen'], 
ARRAY['linen', 'tablecloth', 'rectangle', '90x156'], 
'{"size": "90x156 inches", "fits": "8ft table (floor length)", "accessories": ["skirt", "clips", "runner"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- LINENS - COCKTAIL TABLE COVERS (Based on Your Chair Covers)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Cocktail Table Spandex Cover 30"', 'Stretch spandex cover for 30-inch cocktail tables.', 'equipment', 'event_rentals', 'Linens', 'Your Chair Covers', 'STC-30', 
ARRAY['spandex cover', 'stretch cover', 'cocktail table cover', '30 inch spandex', 'lycra cover', 'fitted cover'], 
ARRAY['linen', 'spandex', 'cocktail-table', 'stretch'], 
'{"fits": "30 inch cocktail table", "material": "spandex/lycra", "style": "form-fitting stretch", "colors": "black, white, ivory, 20+ colors", "washable": true, "wrinkle_free": true, "accessories": ["top cap option", "sash option"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Cocktail Table Spandex Cover 36"', 'Stretch cover for 36-inch high-top tables.', 'equipment', 'event_rentals', 'Linens', 'Your Chair Covers', 'STC-36', 
ARRAY['36 inch spandex', 'high top cover', 'bar table cover', '36 cocktail cover'], 
ARRAY['linen', 'spandex', '36-inch'], 
'{"fits": "36 inch cocktail table", "material": "spandex", "colors": "20+ colors", "accessories": ["top cap", "sash", "led light base"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- LINENS - TABLE SKIRTS & ACCESSORIES (Based on Snap Drape)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Table Skirt 14ft Pleated', 'Pleated table skirt for 6ft tables.', 'equipment', 'event_rentals', 'Linens', 'Snap Drape', 'SKT-14', 
ARRAY['table skirt', '14 foot skirt', 'pleated skirt', 'table skirting', '6ft table skirt'], 
ARRAY['table-skirt', 'skirting', 'pleated', '14ft'], 
'{"length": "14 ft (fits 6ft table on 3 sides)", "height": "29 inches", "style": "pleated", "material": "polyester", "colors": "white, black, ivory, colors", "accessories": ["skirting clips", "velcro", "pins"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Table Skirt 21ft Pleated', 'Pleated table skirt for 6ft tables all sides.', 'equipment', 'event_rentals', 'Linens', 'Snap Drape', 'SKT-21', 
ARRAY['21 foot skirt', 'full table skirt', 'all sides skirting', '21ft skirt'], 
ARRAY['table-skirt', '21ft', 'full-coverage'], 
'{"length": "21 ft (fits 6ft table on all 4 sides)", "height": "29 inches", "accessories": ["clips", "velcro"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Table Runner 14x108"', 'Decorative table runner for 6-8ft tables.', 'equipment', 'event_rentals', 'Linens', 'CV Linens', 'RUN-14108', 
ARRAY['table runner', 'decorative runner', 'table accent', 'linen runner'], 
ARRAY['table-runner', 'linen', 'accent'], 
'{"size": "14x108 inches", "fits": "6ft or 8ft tables", "material": "polyester or satin", "colors": "50+ colors", "use": "decorative accent over tablecloth"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Table Overlay 72x72"', 'Square overlay for round or rectangle tables.', 'equipment', 'event_rentals', 'Linens', 'CV Linens', 'OVL-7272', 
ARRAY['table overlay', 'linen overlay', 'square overlay', 'table topper', 'accent overlay'], 
ARRAY['overlay', 'linen', 'square'], 
'{"size": "72x72 inches", "use": "decorative layer over tablecloth", "material": "polyester, satin, or specialty", "colors": "extensive", "popular_use": "diamond pattern on round tables"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- LINENS - NAPKINS (Based on CV Linens)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Napkins Cloth 20x20" Pack of 12', 'Polyester cloth napkins.', 'equipment', 'event_rentals', 'Linens', 'CV Linens', 'NAP-20', 
ARRAY['cloth napkins', 'table napkins', 'dinner napkins', 'fabric napkins', '20 inch napkins'], 
ARRAY['napkins', 'linen', 'cloth'], 
'{"size": "20x20 inches", "quantity": "12 per pack", "material": "polyester", "colors": "match tablecloth colors", "care": "machine washable", "accessories": ["napkin rings", "napkin folds"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- PIPE & DRAPE (Based on Snap Drape, Rose Brand)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Pipe and Drape Kit 8ft High', 'Complete pipe and drape backdrop system.', 'equipment', 'event_rentals', 'Draping', 'Snap Drape', 'PD-8FT-KIT', 
ARRAY['pipe and drape', 'backdrop', 'pipe drape', 'event draping', 'room divider', 'background drape'], 
ARRAY['pipe-drape', 'backdrop', 'draping', '8ft'], 
'{"height": "8 ft adjustable", "includes": "uprights, crossbars, bases", "upright": "3-piece adjustable 4-8 ft", "crossbar": "varies 3-12 ft", "base": "weighted bases", "drape": "sold separately", "accessories": ["drape panels", "valance", "tie-backs", "storage cart", "carrying bags"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Pipe and Drape Kit 12ft High', 'Tall pipe and drape system for high ceilings.', 'equipment', 'event_rentals', 'Draping', 'Snap Drape', 'PD-12FT-KIT', 
ARRAY['12 foot pipe drape', 'tall backdrop', 'high pipe and drape', 'ceiling drape'], 
ARRAY['pipe-drape', '12ft', 'tall'], 
'{"height": "12 ft", "includes": "uprights, crossbars, bases", "use": "high ceiling venues", "accessories": ["extra tall upright poles", "heavy duty bases", "drape panels"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Drape Panel 8x4 Polyester', 'Standard drape panel for pipe and drape.', 'equipment', 'event_rentals', 'Draping', 'Premier', 'DRP-8X4', 
ARRAY['drape panel', 'backdrop drape', 'fabric panel', 'pipe drape fabric', 'curtain panel'], 
ARRAY['drape', 'panel', '8x4', 'fabric'], 
'{"size": "8ft high x 4ft wide", "material": "polyester", "colors": "white, black, ivory, colors", "fullness": "100% fullness (2x fabric width)", "accessories": ["hooks", "tie line", "pins", "weights"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Drape Panel 8x4 Velour', 'Premium velour drape panel.', 'equipment', 'event_rentals', 'Draping', 'Rose Brand', 'VEL-8X4', 
ARRAY['velour drape', 'velvet drape', 'stage curtain', 'theater drape', 'premium backdrop'], 
ARRAY['drape', 'velour', 'premium'], 
'{"size": "8x4 ft", "material": "velour (cotton-backed)", "colors": "black, burgundy, royal blue, white", "use": "stage, premium events", "accessories": ["grommets", "tie line", "weights"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Drape Panel 8x10 Sheer', 'Sheer voile drape panel for elegant backdrops.', 'equipment', 'event_rentals', 'Draping', 'Premier', 'SHR-810', 
ARRAY['sheer drape', 'voile drape', 'sheer curtain', 'elegant backdrop', 'translucent drape'], 
ARRAY['drape', 'sheer', 'voile'], 
'{"size": "8x10 ft", "material": "sheer voile", "colors": "white, ivory, pastels", "light": "translucent", "popular_use": "weddings, elegant events", "accessories": ["uplighting behind", "fairy lights", "flowers"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- STAGING & PLATFORMS (Based on Intellistage, Wenger)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Stage Platform 4x4 Adjustable Height', 'Modular stage deck 4x4 feet.', 'equipment', 'event_rentals', 'Staging', 'Intellistage', 'STG-44', 
ARRAY['stage platform', 'stage deck', 'portable stage', 'modular staging', '4x4 stage', 'platform deck'], 
ARRAY['stage', 'platform', '4x4', 'modular'], 
'{"size": "4x4 ft", "height": "8, 16, 24, or 32 inches adjustable", "capacity": "250 lbs per sq ft", "material": "aluminum frame with plywood deck", "surface": "black or carpeted", "accessories": ["legs (various heights)", "skirting", "stairs", "guardrails", "connectors"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Stage Platform 4x8 Adjustable Height', 'Standard 4x8 foot modular stage.', 'equipment', 'event_rentals', 'Staging', 'Intellistage', 'STG-48', 
ARRAY['4x8 stage', '4x8 platform', 'standard stage deck', '4 by 8 stage'], 
ARRAY['stage', 'platform', '4x8', 'standard'], 
'{"size": "4x8 ft", "height": "8-32 inches adjustable", "capacity": "250 lbs/sq ft", "most_popular": true, "accessories": ["leg sets", "skirting 4 sides", "stairs 3-4 step", "guardrails", "carpet finish"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Stage Stairs 3-Step with Railing', 'Stage access stairs with handrail.', 'equipment', 'event_rentals', 'Staging', 'Intellistage', 'STR-3', 
ARRAY['stage steps', 'stage stairs', 'platform stairs', 'stage access', '3 step stairs'], 
ARRAY['stairs', 'stage', '3-step', 'access'], 
'{"steps": "3 steps", "height": "24 inches total", "width": "36 inches", "handrail": "one side", "capacity": "500 lbs", "accessories": ["non-slip surface", "adjustable legs"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Stage Stairs 4-Step with Railing', 'Four-step stage stairs with handrail.', 'equipment', 'event_rentals', 'Staging', 'Intellistage', 'STR-4', 
ARRAY['4 step stairs', 'stage steps 4', 'platform stairs tall'], 
ARRAY['stairs', 'stage', '4-step'], 
'{"steps": "4 steps", "height": "32 inches", "handrail": "one or both sides", "accessories": ["adjustable", "non-slip"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Stage Skirting 8ft Section', 'Stage skirt panel for platform concealment.', 'equipment', 'event_rentals', 'Staging', 'Snap Drape', 'STG-SKT-8', 
ARRAY['stage skirting', 'platform skirting', 'stage skirt', 'stage drape', 'deck skirting'], 
ARRAY['skirting', 'stage', 'drape'], 
'{"length": "8 ft", "height": "matches stage height (16, 24, 32 inch)", "material": "polyester", "colors": "black, white, colors", "attachment": "velcro or clips", "accessories": ["velcro", "clips", "weights"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Riser 18" Round', 'Round display riser for centerpieces or cakes.', 'equipment', 'event_rentals', 'Staging', 'EventPro', 'RSR-18', 
ARRAY['display riser', 'cake riser', 'centerpiece riser', 'pedestal', 'display stand'], 
ARRAY['riser', 'display', 'round'], 
'{"diameter": "18 inches", "heights": "6, 12, 18, 24 inch options", "material": "acrylic or wood", "use": "cakes, centerpieces, displays", "colors": "clear, white, black"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- DANCE FLOORS (Based on Greatmats, Rosco)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Dance Floor Black White Checkered 3x3', 'Interlocking checkered dance floor tile.', 'equipment', 'event_rentals', 'Dance Floors', 'Greatmats', 'DF-CHK-33', 
ARRAY['dance floor', 'checkered floor', 'black white floor', 'portable dance floor', 'modular floor', 'checker floor'], 
ARRAY['dance-floor', 'checkered', 'modular', '3x3'], 
'{"size": "3x3 ft per tile", "pattern": "black and white checkered", "material": "vinyl over plywood", "interlocking": true, "accessories": ["edge pieces", "ramp", "dolly", "storage cart", "subfloor"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Dance Floor Solid Wood 3x3', 'Solid wood dance floor tiles.', 'equipment', 'event_rentals', 'Dance Floors', 'Rosco', 'DF-WOOD-33', 
ARRAY['wood dance floor', 'hardwood floor', 'wooden floor', 'natural wood floor'], 
ARRAY['dance-floor', 'wood', '3x3'], 
'{"size": "3x3 ft", "material": "maple hardwood", "finish": "sealed", "interlocking": true, "accessories": ["edge trim", "ramp", "subfloor panels"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Dance Floor White Vinyl 4x4', 'White vinyl dance floor panels.', 'equipment', 'event_rentals', 'Dance Floors', 'Greatmats', 'DF-WHT-44', 
ARRAY['white dance floor', 'vinyl floor', 'white floor panels', 'seamless floor'], 
ARRAY['dance-floor', 'white', 'vinyl'], 
'{"size": "4x4 ft", "color": "white", "material": "vinyl", "seamless": "taped seams", "accessories": ["edge trim", "subfloor", "tape"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Dance Floor LED Lighted 2x2', 'LED illuminated dance floor tiles.', 'equipment', 'event_rentals', 'Dance Floors', 'LED Floor Pro', 'DF-LED-22', 
ARRAY['led dance floor', 'light up floor', 'illuminated floor', 'disco floor', 'lit floor'], 
ARRAY['dance-floor', 'led', 'illuminated'], 
'{"size": "2x2 ft per tile", "lights": "RGB LED", "control": "DMX or sound activated", "colors": "16 million colors", "power": "110V daisy chain", "accessories": ["controller", "cables", "flight case"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- STANCHIONS & CROWD CONTROL (Based on Tensator, VIP Crowd Control)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Stanchion Chrome with Velvet Rope', 'Chrome post with velvet rope.', 'equipment', 'event_rentals', 'Stanchions', 'Tensator', 'STN-CHR-VEL', 
ARRAY['stanchion', 'chrome stanchion', 'velvet rope stanchion', 'vip rope', 'post and rope', 'queue barrier', 'red carpet stanchion'], 
ARRAY['stanchion', 'chrome', 'velvet-rope', 'crowd-control'], 
'{"height": "38 inches", "base": "weighted dome base", "finish": "polished chrome", "rope": "velvet 6 ft", "rope_colors": "red, black, blue, burgundy", "accessories": ["velvet ropes", "weighted base", "sign holder", "storage cart"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Stanchion Black with Retractable Belt', 'Black post with retractable belt barrier.', 'equipment', 'event_rentals', 'Stanchions', 'Tensator', 'STN-BLK-BLT', 
ARRAY['retractable barrier', 'belt stanchion', 'black stanchion', 'belt barrier', 'queue post', 'retractable stanchion'], 
ARRAY['stanchion', 'black', 'retractable-belt'], 
'{"height": "38 inches", "belt_length": "13 ft retractable", "belt_colors": "black, red, yellow", "finish": "black powder coat", "base": "heavy weighted", "accessories": ["belt cassette", "wall mount receiver", "sign frame", "cart"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Stanchion Gold Brass with Rope', 'Premium brass/gold stanchion.', 'equipment', 'event_rentals', 'Stanchions', 'VIP Crowd Control', 'STN-GLD', 
ARRAY['gold stanchion', 'brass stanchion', 'premium stanchion', 'vip stanchion gold'], 
ARRAY['stanchion', 'gold', 'brass', 'premium'], 
'{"height": "38 inches", "finish": "polished brass/gold", "rope": "velvet 6 ft", "use": "upscale events, vip areas", "accessories": ["rope", "sign holder", "cart"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');
