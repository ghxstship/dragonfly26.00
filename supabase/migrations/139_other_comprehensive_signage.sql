-- =============================================
-- COMPREHENSIVE SIGNAGE CATALOG
-- Migration: 050
-- Based on: ULine, Brady, Plasticade, Displays2go, BackdropOutlet, VistaPrint
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- SIGN HOLDERS - ACRYLIC (Based on ULine, Displays2go)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Sign Holder 8.5x11 Acrylic Portrait', 'Clear acrylic letter-size sign holder.', 'equipment', 'signage', 'Sign Holders', 'ULine', 'H-3892', 
ARRAY['8.5x11 sign holder', 'letter size holder', 'acrylic holder', 'brochure holder', 'display stand', 'menu holder'], 
ARRAY['sign-holder', 'acrylic', '8.5x11', 'portrait'], 
'{"size": "8.5x11 inches", "orientation": "portrait (vertical)", "material": "clear acrylic", "thickness": "1/8 inch", "sides": "double-sided option", "mount": "countertop or wall", "accessories": ["adhesive tape", "mounting screws"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Sign Holder 11x17 Acrylic Landscape', 'Tabloid-size acrylic sign holder.', 'equipment', 'signage', 'Sign Holders', 'ULine', 'H-3894', 
ARRAY['11x17 sign holder', 'tabloid holder', 'acrylic frame', 'landscape holder', 'literature holder'], 
ARRAY['sign-holder', 'acrylic', '11x17', 'landscape'], 
'{"size": "11x17 inches", "orientation": "landscape (horizontal)", "material": "clear acrylic", "insert": "top-loading", "accessories": ["mounting hardware", "cleaning cloth"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Sign Holder 11x14 Acrylic', 'Mid-size acrylic sign frame.', 'equipment', 'signage', 'Sign Holders', 'Displays2go', 'ACR-1114', 
ARRAY['11x14 sign holder', 'medium sign holder', 'acrylic frame 11x14'], 
ARRAY['sign-holder', 'acrylic', '11x14'], 
'{"size": "11x14 inches", "material": "acrylic", "orientation": "portrait or landscape", "accessories": ["mounting options"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Sign Holder 18x24 Floor Stand', 'Floor-standing poster frame with telescoping pole.', 'equipment', 'signage', 'Sign Holders', 'ULine', 'H-4531', 
ARRAY['18x24 floor stand', 'poster stand', 'sign stand', 'display stand floor', 'standing sign holder', 'pedestal sign'], 
ARRAY['sign-holder', 'floor-stand', '18x24', 'standing'], 
'{"size": "18x24 inches", "type": "floor standing", "height": "adjustable 24-66 inches", "base": "weighted round base 12 inches", "frame": "snap-open aluminum", "orientation": "portrait or landscape", "accessories": ["weighted base", "snap frame", "leveling feet", "wheels option"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Sign Holder 22x28 Floor Stand', 'Large floor-standing sign holder.', 'equipment', 'signage', 'Sign Holders', 'Displays2go', 'FS-2228', 
ARRAY['22x28 floor stand', 'large poster stand', 'big sign stand'], 
ARRAY['sign-holder', 'floor-stand', '22x28'], 
'{"size": "22x28 inches", "height": "adjustable", "type": "floor stand", "accessories": ["weighted base", "snap frame"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Sign Holder 24x36 Easel Back', 'Large easel-style sign holder.', 'equipment', 'signage', 'Sign Holders', 'ULine', 'H-5287', 
ARRAY['24x36 easel', 'poster easel', 'display easel', 'sign easel', 'presentation easel', 'easel sign holder'], 
ARRAY['sign-holder', 'easel', '24x36', 'large'], 
'{"size": "24x36 inches", "type": "easel back self-standing", "material": "aluminum snap frame", "orientation": "portrait or landscape", "legs": "fold-out easel legs", "portability": "lightweight folding", "accessories": ["carrying case", "snap frame"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- A-FRAME SIGNS (Based on Plasticade, Brady)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'A-Frame Sidewalk Sign 18x24', 'Small double-sided A-frame sign.', 'equipment', 'signage', 'A-Frames', 'Plasticade', 'AF-1824', 
ARRAY['a-frame sign', 'sidewalk sign', 'sandwich board', 'pavement sign', 'a board', '18x24 a-frame'], 
ARRAY['a-frame', 'sidewalk', 'double-sided', '18x24'], 
'{"size": "18x24 inches per side", "sides": "2 (double-sided)", "material": "plastic or aluminum frame", "inserts": "coroplast or poster", "outdoor": true, "accessories": ["poster inserts", "wind clips", "weight bags", "stakes"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'A-Frame Sidewalk Sign 24x36', 'Standard double-sided sidewalk A-frame.', 'equipment', 'signage', 'A-Frames', 'Plasticade', 'AF-2436', 
ARRAY['24x36 a-frame', 'large sidewalk sign', 'sandwich board 24x36', 'pavement a-frame'], 
ARRAY['a-frame', 'sidewalk', '24x36', 'standard'], 
'{"size": "24x36 inches per side", "sides": "2", "frame": "aluminum or steel", "most_popular": true, "weather": "all-weather", "accessories": ["coroplast inserts", "wind stabilizers", "weights", "stake kit"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'A-Frame Chalkboard Sign', 'Double-sided chalkboard A-frame.', 'equipment', 'signage', 'A-Frames', 'Rustic', 'AF-CHALK', 
ARRAY['chalkboard a-frame', 'menu board', 'chalk sign', 'bistro sign', 'restaurant board'], 
ARRAY['a-frame', 'chalkboard', 'menu'], 
'{"size": "20x40 inches typical", "surface": "chalkboard both sides", "frame": "wood or metal", "use": "restaurants, cafes, menus", "accessories": ["chalk", "eraser", "markers", "decorative trim"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Wet Floor Caution Sign A-Frame', 'Yellow wet floor warning sign.', 'equipment', 'signage', 'Safety Signs', 'Rubbermaid', 'FG611277YEL', 
ARRAY['wet floor sign', 'caution sign', 'safety sign', 'hazard sign', 'slippery floor sign', 'yellow caution'], 
ARRAY['safety-sign', 'wet-floor', 'caution', 'warning'], 
'{"height": "26 inches", "color": "yellow", "languages": "multi-lingual caution wet floor", "type": "folding A-frame", "bright": "high-visibility yellow", "accessories": ["storage hook"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- DIRECTIONAL & WAYFINDING SIGNS (Based on Brady, SmartSign)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Directional Arrow Sign 12x18', 'Directional arrow sign with stake.', 'equipment', 'signage', 'Directional', 'Brady', 'DIR-1218', 
ARRAY['directional sign', 'arrow sign', 'wayfinding sign', 'navigation sign', '12x18 arrow', 'pointing sign'], 
ARRAY['directional', 'arrow', 'wayfinding', '12x18'], 
'{"size": "12x18 inches", "with_stake": true, "arrow": "customizable direction", "material": "coroplast or aluminum", "colors": "various", "reflective": "reflective options", "accessories": ["ground stake 24 inch", "mounting hardware", "h-stake"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Directional Arrow Sign 18x24', 'Large directional arrow sign.', 'equipment', 'signage', 'Directional', 'Brady', 'DIR-1824', 
ARRAY['18x24 arrow', 'large directional', 'big arrow sign', 'wayfinding 18x24'], 
ARRAY['directional', 'arrow', '18x24'], 
'{"size": "18x24 inches", "stake": "included", "visibility": "high", "accessories": ["stake", "mounting options"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Parking Sign 12x18 Reserved', 'Reserved parking designation sign.', 'equipment', 'signage', 'Parking', 'Brady', 'PKG-1218-RSV', 
ARRAY['parking sign', 'reserved parking', 'parking lot sign', 'reserved sign', '12x18 parking'], 
ARRAY['parking', 'sign', 'reserved', '12x18'], 
'{"size": "12x18 inches", "type": "reserved parking", "types_available": "reserved, handicap, visitor, loading, customer only", "material": "aluminum or coroplast", "weather": "outdoor rated", "accessories": ["post", "mounting brackets", "u-channel post"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Parking Sign 18x24 Handicap ADA', 'ADA compliant handicap parking sign.', 'equipment', 'signage', 'Parking', 'Brady', 'PKG-1824-HC', 
ARRAY['handicap parking sign', 'ada parking sign', 'accessible parking', 'disability sign', 'handicap sign'], 
ARRAY['parking', 'handicap', 'ada', '18x24'], 
'{"size": "18x24 inches", "compliant": "ADA/DOT compliant", "reflective": "engineer grade reflective", "material": "aluminum", "accessories": ["post", "brackets", "fine text sign"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- BANNERS & STANDS (Based on Displays2go, BackdropOutlet)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Retractable Banner Stand 33x80', 'Pull-up retractable banner stand.', 'equipment', 'signage', 'Banners', 'Displays2go', 'RBS-3380', 
ARRAY['retractable banner', 'pull up banner', 'roll up banner', 'pop up banner', 'standing banner', 'banner stand'], 
ARRAY['banner', 'retractable', 'stand', '33x80'], 
'{"size": "33x80 inches", "type": "retractable pull-up", "base": "weighted aluminum base", "height": "adjustable pole", "portability": "lightweight with carrying case", "setup": "tool-free 1 minute", "accessories": ["carrying case", "banner print included", "extra banner option", "travel bag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Retractable Banner Stand 48x80', 'Wide retractable banner stand.', 'equipment', 'signage', 'Banners', 'Displays2go', 'RBS-4880', 
ARRAY['48 inch banner', 'wide retractable banner', 'large banner stand', '4 foot banner'], 
ARRAY['banner', 'retractable', '48x80', 'wide'], 
'{"size": "48x80 inches", "type": "retractable", "base": "heavy duty", "accessories": ["carrying case", "banner print"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'X-Banner Stand 24x63', 'Portable X-frame banner stand.', 'equipment', 'signage', 'Banners', 'Displays2go', 'XBS-2463', 
ARRAY['x banner stand', 'x stand', 'tripod banner', 'portable banner stand', 'x frame banner'], 
ARRAY['banner', 'x-stand', 'portable'], 
'{"size": "24x63 inches", "type": "X-frame tension", "frame": "collapsible X-frame", "weight": "3 lbs", "budget_friendly": true, "accessories": ["carrying bag", "banner with grommets"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Step and Repeat Banner 8x8', 'Photo backdrop step and repeat banner.', 'equipment', 'signage', 'Banners', 'BackdropOutlet', 'SNR-88', 
ARRAY['step and repeat', 'photo backdrop', 'media wall', 'press wall', 'red carpet backdrop', 'logo wall'], 
ARRAY['banner', 'step-repeat', 'backdrop', '8x8'], 
'{"size": "8x8 ft", "material": "vinyl banner", "print": "repeating logo pattern", "grommets": true, "use": "photo ops, red carpet events", "accessories": ["banner stand", "pipe and drape stand", "clips", "storage bag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Step and Repeat Banner 8x10', 'Large step and repeat banner.', 'equipment', 'signage', 'Banners', 'BackdropOutlet', 'SNR-810', 
ARRAY['8x10 step and repeat', 'large media wall', 'photo wall 8x10'], 
ARRAY['banner', 'step-repeat', '8x10'], 
'{"size": "8x10 ft", "material": "vinyl", "use": "large events, conferences", "accessories": ["banner stand", "clips", "storage"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Vinyl Banner 3x6 Custom', 'Custom printed vinyl banner.', 'equipment', 'signage', 'Banners', 'VistaPrint', 'VB-36', 
ARRAY['vinyl banner', 'custom banner', '3x6 banner', 'outdoor banner', 'mesh banner'], 
ARRAY['banner', 'vinyl', 'custom', '3x6'], 
'{"size": "3x6 ft", "material": "13 oz vinyl", "print": "full color custom", "grommets": "every 2 ft", "outdoor": "weather resistant", "accessories": ["grommets", "pole pockets", "wind slits option", "bungee cords", "zip ties"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Vinyl Banner 4x8 Custom', 'Large custom vinyl banner.', 'equipment', 'signage', 'Banners', 'VistaPrint', 'VB-48', 
ARRAY['4x8 banner', 'large vinyl banner', 'big banner', 'building banner'], 
ARRAY['banner', 'vinyl', '4x8', 'large'], 
'{"size": "4x8 ft", "material": "vinyl", "print": "full color", "outdoor": true, "accessories": ["grommets", "pole pocket", "mounting"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- YARD SIGNS (Based on Visibility Signage, Coroplast Direct)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Yard Sign 12x18 with H-Stake', 'Small corrugated plastic yard sign.', 'equipment', 'signage', 'Yard Signs', 'Visibility Signage', 'YS-1218', 
ARRAY['yard sign', '12x18 sign', 'lawn sign', 'coroplast sign', 'political sign', 'real estate sign'], 
ARRAY['yard-sign', 'coroplast', '12x18', 'outdoor'], 
'{"size": "12x18 inches", "material": "4mm corrugated plastic (coroplast)", "thickness": "4mm", "outdoor": "weather resistant", "stake": "h-stake included", "print": "single or double-sided", "accessories": ["wire h-stake", "sign rider"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Yard Sign 18x24 with H-Stake', 'Standard yard sign with stake.', 'equipment', 'signage', 'Yard Signs', 'Visibility Signage', 'YS-1824', 
ARRAY['18x24 yard sign', 'coroplast 18x24', 'lawn sign 18x24', 'political sign 18x24'], 
ARRAY['yard-sign', '18x24', 'coroplast'], 
'{"size": "18x24 inches", "material": "coroplast 4mm", "most_popular": true, "stake": "h-stake", "accessories": ["wire stake", "sign rider", "zip ties"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Yard Sign 24x18 Horizontal', 'Horizontal yard sign.', 'equipment', 'signage', 'Yard Signs', 'Visibility Signage', 'YS-2418', 
ARRAY['24x18 yard sign', 'horizontal yard sign', 'landscape yard sign'], 
ARRAY['yard-sign', '24x18', 'horizontal'], 
'{"size": "24x18 inches", "orientation": "horizontal landscape", "material": "coroplast", "stake": "included", "accessories": ["h-stake", "rider"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Yard Sign 24x24 Square', 'Square yard sign.', 'equipment', 'signage', 'Yard Signs', 'Visibility Signage', 'YS-2424', 
ARRAY['24x24 yard sign', 'square yard sign', 'large yard sign'], 
ARRAY['yard-sign', '24x24', 'square'], 
'{"size": "24x24 inches", "shape": "square", "material": "coroplast", "accessories": ["stake"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- FEATHER FLAGS (Based on BeachFlag, FeatherFlag)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Feather Flag 8ft Small', 'Small feather flag with ground stake.', 'equipment', 'signage', 'Flags', 'BeachFlag', 'FF-8', 
ARRAY['feather flag', 'teardrop flag', 'beach flag', 'swooper flag', 'advertising flag', 'tall flag'], 
ARRAY['feather-flag', 'flag', '8ft', 'outdoor'], 
'{"height": "8 ft", "type": "feather/teardrop shape", "material": "polyester flag", "pole": "fiberglass pole", "base": "ground stake or water base", "print": "single sided", "outdoor": "wind resistant", "accessories": ["ground stake", "carrying bag", "water base option", "cross base option"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Feather Flag 12ft Medium', 'Medium feather flag banner.', 'equipment', 'signage', 'Flags', 'BeachFlag', 'FF-12', 
ARRAY['12ft feather flag', 'medium beach flag', '12 foot flag'], 
ARRAY['feather-flag', '12ft', 'medium'], 
'{"height": "12 ft", "type": "feather shape", "material": "polyester", "most_popular": true, "accessories": ["pole", "ground stake", "cross base", "water base", "carrying bag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Feather Flag 15ft Large', 'Large tall feather flag.', 'equipment', 'signage', 'Flags', 'BeachFlag', 'FF-15', 
ARRAY['15ft feather flag', 'large feather flag', 'tall advertising flag'], 
ARRAY['feather-flag', '15ft', 'large'], 
'{"height": "15 ft", "type": "feather", "visibility": "high visibility", "accessories": ["pole kit", "ground stake", "heavy duty base"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- SAFETY & REGULATORY SIGNS (Based on Brady, OSHA Signs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Safety Sign Emergency Exit 12x18', 'Emergency exit directional sign.', 'equipment', 'signage', 'Safety Signs', 'Brady', 'SAFE-EXIT', 
ARRAY['exit sign', 'emergency exit', 'egress sign', 'fire exit', 'safety exit sign'], 
ARRAY['safety-sign', 'exit', 'emergency'], 
'{"size": "12x18 inches", "text": "EXIT with arrow", "colors": "green and white", "glow": "photoluminescent option", "compliant": "OSHA compliant", "accessories": ["mounting hardware", "glow in dark version"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Safety Sign Fire Extinguisher 8x12', 'Fire extinguisher location sign.', 'equipment', 'signage', 'Safety Signs', 'Brady', 'SAFE-FIRE', 
ARRAY['fire extinguisher sign', 'fire safety sign', 'extinguisher location'], 
ARRAY['safety-sign', 'fire', 'extinguisher'], 
'{"size": "8x12 inches", "text": "FIRE EXTINGUISHER with symbol", "colors": "red and white", "mount": "wall mount", "accessories": ["mounting hardware"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Safety Sign First Aid 10x14', 'First aid station sign.', 'equipment', 'signage', 'Safety Signs', 'Brady', 'SAFE-AID', 
ARRAY['first aid sign', 'medical sign', 'first aid station'], 
ARRAY['safety-sign', 'first-aid', 'medical'], 
'{"size": "10x14 inches", "symbol": "white cross on green", "text": "FIRST AID", "accessories": ["mounting"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Safety Sign No Smoking 10x14', 'No smoking warning sign.', 'equipment', 'signage', 'Safety Signs', 'Brady', 'SAFE-NOSMK', 
ARRAY['no smoking sign', 'smoking prohibited', 'no cigarettes', 'smoke free sign'], 
ARRAY['safety-sign', 'no-smoking', 'warning'], 
'{"size": "10x14 inches", "symbol": "cigarette with red circle slash", "text": "NO SMOKING", "accessories": ["mounting hardware"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');
