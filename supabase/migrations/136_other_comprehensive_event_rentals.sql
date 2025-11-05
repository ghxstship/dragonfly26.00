-- =============================================
-- COMPREHENSIVE EVENT RENTALS CATALOG - PART 1
-- Migration: 047
-- Tables, Chairs, Linens
-- Based on: Classic Party Rentals, CORT Events, Chiavari Company, Lifetime, CV Linens
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- TABLES - ROUND (Based on Lifetime, Classic Party Rentals)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Round Table 24" Cocktail', 'Small 24-inch round cocktail table.', 'equipment', 'event_rentals', 'Tables', 'Lifetime', 'RT24', 
ARRAY['24 inch round table', 'small cocktail table', 'cake table', 'display table'], 
ARRAY['table', 'round', '24-inch', 'cocktail'], 
'{"diameter": "24 inches", "height": "30 inches", "seats": "2", "use": "cocktails, cake, display", "accessories": ["linen 90 inch floor length", "table clips", "riser"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Round Table 36" Cocktail', 'Standard 36-inch cocktail table.', 'equipment', 'event_rentals', 'Tables', 'Lifetime', 'RT36', 
ARRAY['36 inch round', 'cocktail table', 'high top table', 'standing table'], 
ARRAY['table', 'round', '36-inch', 'cocktail'], 
'{"diameter": "36 inches", "height": "42 inches bar height", "seats": "3-4 standing", "accessories": ["spandex cover", "linen 108 inch", "led base option"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Round Table 48" Dining', '48-inch round dining table seats 6.', 'equipment', 'event_rentals', 'Tables', 'Lifetime', 'RT48', 
ARRAY['48 inch round', '4 foot round table', 'small dining table', 'guest table'], 
ARRAY['table', 'round', '48-inch', 'dining'], 
'{"diameter": "48 inches", "height": "30 inches", "seats": "6", "accessories": ["linen 108 inch lap length or 120 inch floor length", "table clips", "overlay"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Round Table 54" Dining', '54-inch round table seats 6-8.', 'equipment', 'event_rentals', 'Tables', 'Lifetime', 'RT54', 
ARRAY['54 inch round', 'medium round table', 'guest table 54'], 
ARRAY['table', 'round', '54-inch'], 
'{"diameter": "54 inches", "height": "30 inches", "seats": "6-8", "accessories": ["linen 120 inch floor length", "overlay", "skirting"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Round Table 60" Dining', 'Standard 60-inch round banquet table.', 'equipment', 'event_rentals', 'Tables', 'Lifetime', 'RT60', 
ARRAY['60 inch round', '5 foot round table', 'round banquet table', 'guest table', 'dinner table', 'wedding table'], 
ARRAY['table', 'round', '60-inch', 'banquet', 'wedding'], 
'{"diameter": "60 inches", "height": "30 inches", "seats": "8-10", "most_popular": true, "accessories": ["linen 120 inch floor length", "table clips", "skirting 20 ft", "overlay", "centerpiece riser"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Round Table 72" Dining', 'Large 72-inch round table seats 10-12.', 'equipment', 'event_rentals', 'Tables', 'Lifetime', 'RT72', 
ARRAY['72 inch round', '6 foot round table', 'large round table', 'king table'], 
ARRAY['table', 'round', '72-inch', 'large'], 
'{"diameter": "72 inches", "height": "30 inches", "seats": "10-12", "accessories": ["linen 132 inch floor length", "napkins", "table runner", "centerpiece"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- TABLES - RECTANGLE (Based on Lifetime, Classic Party Rentals)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Rectangle Table 4ft Banquet', 'Four-foot folding banquet table.', 'equipment', 'event_rentals', 'Tables', 'Lifetime', 'BT4', 
ARRAY['4 foot table', 'small rectangle table', '48 inch table', 'folding table 4ft'], 
ARRAY['table', 'rectangle', '4ft', 'folding'], 
'{"size": "48x30 inches", "height": "30 inches", "seats": "4-6", "folding": true, "weight": "35 lbs", "accessories": ["table cover", "clips", "skirt 10 ft"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Rectangle Table 6ft Banquet', 'Standard 6-foot folding table.', 'equipment', 'event_rentals', 'Tables', 'Lifetime', 'BT6', 
ARRAY['6 foot table', 'rectangle table', 'folding table', 'conference table', 'banquet table 6ft'], 
ARRAY['table', 'rectangle', '6ft', 'folding', 'banquet'], 
'{"size": "72x30 inches", "height": "30 inches", "seats": "6-8", "folding": true, "weight": "40 lbs", "most_popular": true, "accessories": ["table cover 90x132", "skirting 14 ft", "clips", "runner"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Rectangle Table 8ft Banquet', 'Large 8-foot folding table.', 'equipment', 'event_rentals', 'Tables', 'Lifetime', 'BT8', 
ARRAY['8 foot table', '8ft rectangle table', 'long table', 'buffet table', 'banquet table 8ft'], 
ARRAY['table', 'rectangle', '8ft', 'folding'], 
'{"size": "96x30 inches", "height": "30 inches", "seats": "8-10", "folding": true, "accessories": ["linen 90x156", "riser blocks", "table skirt 16 ft", "clips"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Rectangle Table 18x96 King', 'Narrow 18-inch wide king table for long rows.', 'equipment', 'event_rentals', 'Tables', 'Classic Party Rentals', 'KING-96', 
ARRAY['king table', 'narrow table', 'classroom table', 'conference table narrow'], 
ARRAY['table', 'rectangle', 'king', 'narrow'], 
'{"size": "96x18 inches", "height": "30 inches", "seats": "6 on one side", "use": "classroom, conference rows", "accessories": ["narrow linen 72x18", "clips"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Serpentine Table Half Round', 'Curved half-round table for buffets.', 'equipment', 'event_rentals', 'Tables', 'Classic Party Rentals', 'SERP-HALF', 
ARRAY['serpentine table', 'curved table', 'buffet table curved', 'half round table'], 
ARRAY['table', 'serpentine', 'curved'], 
'{"size": "60 inches wide curve", "height": "30 inches", "use": "buffets, bars, curved displays", "sets_of": "2 make full circle", "accessories": ["fitted linen", "skirting", "clips"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- COCKTAIL TABLES (Based on event rental catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Cocktail Table 24" High Top', 'Small 24-inch high-top cocktail table.', 'equipment', 'event_rentals', 'Tables', 'EventPro', 'CT24', 
ARRAY['24 inch cocktail', 'small high top', '24 inch bar table', 'standing table 24'], 
ARRAY['cocktail-table', 'high-top', '24-inch'], 
'{"diameter": "24 inches", "height": "42 inches bar height", "seats": "2 standing", "accessories": ["spandex cover", "linen", "led light base option"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Cocktail Table 30" High Top', 'Standard 30-inch high-top table.', 'equipment', 'event_rentals', 'Tables', 'EventPro', 'CT30', 
ARRAY['30 inch cocktail', 'bistro table', 'bar table', 'high top table', 'standing table'], 
ARRAY['cocktail-table', 'high-top', '30-inch', 'bistro'], 
'{"diameter": "30 inches", "height": "42 inches bar height", "seats": "2-3 standing", "most_popular": true, "accessories": ["spandex cover various colors", "linen 108 inch", "led light base", "bar stool seating"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Cocktail Table 36" High Top', 'Large 36-inch high-top cocktail table.', 'equipment', 'event_rentals', 'Tables', 'EventPro', 'CT36', 
ARRAY['36 inch cocktail', 'large high top', '36 bar table'], 
ARRAY['cocktail-table', '36-inch', 'high-top'], 
'{"diameter": "36 inches", "height": "42 inches", "seats": "4 standing", "accessories": ["spandex cover", "linen 120 inch", "led base"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- CHAIRS - CHIAVARI (Based on Chiavari Company catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Chiavari Chair Gold', 'Gold chiavari banquet chair.', 'equipment', 'event_rentals', 'Chairs', 'Chiavari Company', 'GOLD-STD', 
ARRAY['chiavari chair', 'gold chair', 'tiffany chair', 'ballroom chair', 'wedding chair', 'banquet chair gold'], 
ARRAY['chair', 'chiavari', 'gold', 'banquet', 'wedding'], 
'{"color": "gold", "material": "wood", "weight_capacity": "300 lbs", "stackable": true, "weight": "9 lbs", "most_popular": true, "accessories": ["cushion ivory or white", "chair tie sash", "chair cover", "bow"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Chiavari Chair Silver', 'Silver chiavari banquet chair.', 'equipment', 'event_rentals', 'Chairs', 'Chiavari Company', 'SILV-STD', 
ARRAY['silver chiavari', 'silver chair', 'chrome chiavari', 'metallic chair', 'formal chair'], 
ARRAY['chair', 'chiavari', 'silver', 'formal'], 
'{"color": "silver/chrome", "material": "wood", "weight_capacity": "300 lbs", "accessories": ["cushion pad", "sash", "chair jacket", "bow"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Chiavari Chair White', 'White chiavari chair for elegant events.', 'equipment', 'event_rentals', 'Chairs', 'Chiavari Company', 'WHT-STD', 
ARRAY['white chiavari', 'white chair', 'ivory chair', 'white wedding chair'], 
ARRAY['chair', 'chiavari', 'white', 'elegant'], 
'{"color": "white", "material": "wood", "weight_capacity": "300 lbs", "accessories": ["cushion", "sash", "cover"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Chiavari Chair Natural Wood', 'Natural wood chiavari chair.', 'equipment', 'event_rentals', 'Chairs', 'Chiavari Company', 'NAT-STD', 
ARRAY['natural chiavari', 'wood chair', 'natural wood chair', 'fruitwood chair'], 
ARRAY['chair', 'chiavari', 'natural', 'wood'], 
'{"color": "natural wood", "material": "wood finish", "accessories": ["cushion", "sash"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Chiavari Chair Mahogany', 'Mahogany wood chiavari chair.', 'equipment', 'event_rentals', 'Chairs', 'Chiavari Company', 'MAH-STD', 
ARRAY['mahogany chiavari', 'dark wood chair', 'mahogany chair'], 
ARRAY['chair', 'chiavari', 'mahogany', 'dark'], 
'{"color": "mahogany", "material": "wood finish", "accessories": ["cushion", "sash"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Chiavari Chair Black', 'Black chiavari chair for modern events.', 'equipment', 'event_rentals', 'Chairs', 'Chiavari Company', 'BLK-STD', 
ARRAY['black chiavari', 'black chair', 'modern chair'], 
ARRAY['chair', 'chiavari', 'black', 'modern'], 
'{"color": "black", "material": "wood", "accessories": ["cushion", "sash"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- CHAIRS - FOLDING (Based on National Public Seating, Lifetime)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Folding Chair White Plastic', 'White plastic folding chair for events.', 'equipment', 'event_rentals', 'Chairs', 'Lifetime', 'FC-WHT', 
ARRAY['white folding chair', 'plastic chair', 'garden chair', 'resin chair', 'outdoor chair', 'ceremony chair'], 
ARRAY['chair', 'folding', 'white', 'plastic', 'outdoor'], 
'{"color": "white", "material": "plastic resin", "weight_capacity": "350 lbs", "stackable": true, "weight": "9 lbs", "use": "outdoor ceremonies, casual events", "accessories": ["chair cover", "cushion pad", "storage cart"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Folding Chair Black Metal', 'Black metal folding chair for conferences.', 'equipment', 'event_rentals', 'Chairs', 'National Public Seating', 'FC-BLK', 
ARRAY['black folding chair', 'metal folding chair', 'samsonite chair', 'conference chair', 'banquet chair metal'], 
ARRAY['chair', 'folding', 'black', 'metal'], 
'{"color": "black", "material": "steel frame with padded seat/back", "weight_capacity": "300 lbs", "stackable": true, "weight": "11 lbs", "accessories": ["chair dolly (holds 30-40)", "storage cart", "chair cover"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Folding Chair Brown Wood', 'Wood folding chair for upscale events.', 'equipment', 'event_rentals', 'Chairs', 'Advantage', 'FC-WOOD', 
ARRAY['wood folding chair', 'wooden chair', 'brown folding chair', 'garden chair wood'], 
ARRAY['chair', 'folding', 'wood', 'brown'], 
'{"color": "brown wood", "material": "wood", "padded_seat": true, "weight_capacity": "300 lbs", "accessories": ["cushion", "chair tie"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- CHAIRS - SPECIALTY (Bar stools, Cross-back, Ghost)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Bar Stool Black Metal', 'Black metal bar stool for cocktail tables.', 'equipment', 'event_rentals', 'Chairs', 'Flash Furniture', 'BS-BLK-30', 
ARRAY['bar stool', 'counter stool', 'high chair', 'bar seat', 'stool black'], 
ARRAY['bar-stool', 'stool', 'counter-height', 'black'], 
'{"height": "30 inches seat height", "color": "black", "material": "metal frame", "backrest": "yes", "weight_capacity": "300 lbs", "use": "cocktail tables, bars", "accessories": ["cushion pad", "backrest"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Bar Stool Natural Wood', 'Natural wood bar stool with back.', 'equipment', 'event_rentals', 'Chairs', 'CrossBack', 'BS-NAT-30', 
ARRAY['wood bar stool', 'wooden stool', 'counter stool wood', 'crossback stool'], 
ARRAY['bar-stool', 'wood', 'natural'], 
'{"height": "30 inches", "material": "natural wood", "style": "cross-back design", "accessories": ["cushion"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Cross-Back Chair Natural Wood', 'Rustic cross-back chair for weddings.', 'equipment', 'event_rentals', 'Chairs', 'CrossBack', 'XB-NAT', 
ARRAY['crossback chair', 'cross back chair', 'x back chair', 'farm chair', 'vineyard chair', 'rustic chair'], 
ARRAY['chair', 'cross-back', 'wood', 'rustic', 'wedding'], 
'{"material": "natural wood", "style": "cross-back farmhouse", "weight_capacity": "300 lbs", "popular_for": "rustic weddings, barn events", "accessories": ["cushion", "chair tie"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Ghost Chair Clear Acrylic', 'Modern clear acrylic ghost chair.', 'equipment', 'event_rentals', 'Chairs', 'Design Within Reach', 'GHOST-CLR', 
ARRAY['ghost chair', 'clear chair', 'acrylic chair', 'invisible chair', 'modern chair', 'louis ghost'], 
ARRAY['chair', 'ghost', 'acrylic', 'clear', 'modern'], 
'{"material": "clear polycarbonate", "style": "modern louis ghost", "weight_capacity": "300 lbs", "stackable": true, "popular_for": "modern weddings, upscale events", "accessories": ["cushion optional"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');

-- Part 2 will continue with linens, draping, staging...
