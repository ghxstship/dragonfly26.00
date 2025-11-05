-- =============================================
-- OFFICE & ADMIN SUPPLIES CATALOG
-- Migration: 053
-- Based on: Staples, Sunbelt Rentals, EquipmentShare
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- OFFICE FURNITURE (Based on Staples)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Desk Office 60" Executive', 'Executive office desk with drawers.', 'equipment', 'event_rentals', 'Office Furniture', 'HON', 'H10573', 
ARRAY['office desk', 'executive desk', 'computer desk', 'work desk', 'writing desk'], 
ARRAY['desk', 'office', 'executive', '60-inch'], 
'{"size": "60x30 inches", "drawers": "box/box/file pedestals", "material": "laminate over engineered wood", "finish": "various finishes", "assembly": "some assembly", "accessories": ["keyboard tray option", "hutch option", "filing cabinets"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Desk Computer L-Shaped', 'L-shaped corner desk for home office.', 'equipment', 'event_rentals', 'Office Furniture', 'Bush', 'WC81430K', 
ARRAY['l shaped desk', 'corner desk', 'l desk', 'computer workstation'], 
ARRAY['desk', 'l-shaped', 'computer', 'corner'], 
'{"configuration": "L-shaped corner", "size": "60x60 inches", "material": "laminate", "features": "wire management", "accessories": ["hutch", "file cabinet", "bookshelf"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Office Chair Ergonomic Mesh', 'Ergonomic mesh back office chair.', 'equipment', 'event_rentals', 'Office Furniture', 'Staples', 'Hyken', 
ARRAY['office chair', 'desk chair', 'computer chair', 'ergonomic chair', 'task chair', 'swivel chair'], 
ARRAY['chair', 'office', 'ergonomic', 'mesh'], 
'{"back": "breathable mesh", "arms": "adjustable arms", "seat": "contoured seat", "adjustments": "height, tilt, lumbar", "weight_capacity": "250 lbs", "wheels": "5 casters", "accessories": ["replacement casters", "chair mat"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Office Chair Executive Leather', 'Executive leather office chair.', 'equipment', 'event_rentals', 'Office Furniture', 'La-Z-Boy', 'Delano', 
ARRAY['executive chair', 'leather chair', 'managers chair', 'boss chair'], 
ARRAY['chair', 'executive', 'leather', 'office'], 
'{"material": "bonded leather", "back": "high back", "features": "memory foam cushion", "arms": "padded arms", "weight_capacity": "300 lbs", "accessories": ["footrest option"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Conference Table 8ft Boat-Shaped', 'Eight-foot conference room table.', 'equipment', 'event_rentals', 'Office Furniture', 'HON', 'BT3696', 
ARRAY['conference table', 'meeting table', 'boardroom table', '8 foot table'], 
ARRAY['table', 'conference', '8ft', 'boat-shaped'], 
'{"size": "96x42 inches", "shape": "boat shaped", "seats": "8-10 people", "material": "laminate", "cable": "grommet wire management", "accessories": ["power modules", "chairs sold separately"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Filing Cabinet 2-Drawer Lateral', 'Two-drawer lateral file cabinet.', 'equipment', 'event_rentals', 'Office Furniture', 'HON', '782LS', 
ARRAY['file cabinet', 'filing cabinet', 'lateral file', '2 drawer file', 'storage cabinet'], 
ARRAY['filing-cabinet', '2-drawer', 'lateral', 'storage'], 
'{"drawers": "2 drawers", "type": "lateral file", "size": "36 inch wide", "capacity": "letter or legal", "locking": "lock and key", "material": "steel", "accessories": ["dividers", "label holders"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Filing Cabinet 4-Drawer Vertical', 'Four-drawer vertical file cabinet.', 'equipment', 'event_rentals', 'Office Furniture', 'HON', '514PP', 
ARRAY['4 drawer file', 'vertical file cabinet', 'tall filing cabinet'], 
ARRAY['filing-cabinet', '4-drawer', 'vertical'], 
'{"drawers": "4 drawers", "type": "vertical file", "size": "15 inch wide", "capacity": "letter size", "accessories": ["lock", "dividers"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Bookshelf 5-Shelf', 'Five-shelf bookcase.', 'equipment', 'event_rentals', 'Office Furniture', 'Sauder', '5-Shelf', 
ARRAY['bookshelf', 'bookcase', '5 shelf bookcase', 'storage shelf', 'office shelf'], 
ARRAY['bookshelf', '5-shelf', 'storage'], 
'{"shelves": "5 adjustable shelves", "size": "71 inch tall x 30 inch wide", "material": "engineered wood", "capacity": "30 lbs per shelf", "accessories": ["wall anchor"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- OFFICE EQUIPMENT (Based on Staples)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Printer Laser Multifunction', 'Black and white laser multifunction printer.', 'equipment', 'event_rentals', 'Office Equipment', 'HP', 'LaserJet Pro MFP', 
ARRAY['laser printer', 'multifunction printer', 'copier', 'scanner', 'printer copier scanner', 'mfp'], 
ARRAY['printer', 'laser', 'multifunction', 'copier'], 
'{"type": "laser multifunction", "functions": "print, copy, scan, fax", "speed": "40 ppm", "duplex": "automatic duplex", "capacity": "250 sheet tray", "connectivity": "USB, Ethernet, WiFi", "accessories": ["toner cartridge", "power cable", "USB cable", "extra tray"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Copier Commercial Floor Model', 'High-volume commercial copier.', 'equipment', 'event_rentals', 'Office Equipment', 'Xerox', 'WorkCentre', 
ARRAY['commercial copier', 'floor copier', 'office copier', 'xerox machine', 'copy machine'], 
ARRAY['copier', 'commercial', 'floor-model'], 
'{"type": "commercial copier/printer", "speed": "50-70 ppm", "capacity": "high volume", "features": "copy, print, scan, fax, staple, hole punch", "accessories": ["finisher", "extra trays", "toner", "service contract"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Paper Shredder Commercial', 'Commercial cross-cut paper shredder.', 'equipment', 'event_rentals', 'Office Equipment', 'Fellowes', 'Powershred 99Ci', 
ARRAY['paper shredder', 'document shredder', 'office shredder', 'cross cut shredder'], 
ARRAY['shredder', 'paper', 'commercial', 'cross-cut'], 
'{"type": "cross-cut", "capacity": "18 sheets", "bin": "6 gallon bin", "features": "jam proof, continuous duty", "shreds": "paper, staples, credit cards", "accessories": ["waste bags", "oil sheets"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Laminator Thermal 13"', 'Thermal laminating machine.', 'equipment', 'event_rentals', 'Office Equipment', 'Scotch', 'TL1302', 
ARRAY['laminator', 'laminating machine', 'thermal laminator', 'pouch laminator'], 
ARRAY['laminator', 'thermal', '13-inch'], 
'{"width": "13 inch max", "type": "thermal pouch", "speed": "warm up 5 min", "thickness": "3-5 mil pouches", "accessories": ["laminating pouches", "carrier"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Whiteboard 6x4 Magnetic', 'Magnetic dry erase whiteboard.', 'equipment', 'event_rentals', 'Office Equipment', 'Quartet', 'SM536', 
ARRAY['whiteboard', 'dry erase board', 'white board', 'marker board', 'magnetic board'], 
ARRAY['whiteboard', 'dry-erase', '6x4', 'magnetic'], 
'{"size": "6x4 ft (72x48 inches)", "surface": "magnetic porcelain", "frame": "aluminum frame", "mount": "wall mount", "accessories": ["markers (4)", "eraser", "magnets", "tray", "mounting hardware"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Whiteboard Mobile 6x4 Double-Sided', 'Mobile double-sided whiteboard on stand.', 'equipment', 'event_rentals', 'Office Equipment', 'Quartet', 'ECM64', 
ARRAY['mobile whiteboard', 'rolling whiteboard', 'portable whiteboard', 'standing whiteboard'], 
ARRAY['whiteboard', 'mobile', 'double-sided', '6x4'], 
'{"size": "6x4 ft per side", "sides": "2 sides", "mobility": "rolling casters", "frame": "steel frame", "height": "adjustable", "accessories": ["markers", "erasers", "magnets", "tray"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Easel Pad Flip Chart', 'Flip chart easel with pad.', 'equipment', 'event_rentals', 'Office Equipment', 'Quartet', 'EU350TE', 
ARRAY['flip chart', 'easel', 'chart stand', 'presentation easel', 'meeting easel'], 
ARRAY['easel', 'flip-chart', 'presentation'], 
'{"height": "adjustable 38-72 inches", "pad": "27x34 inch pads", "legs": "tripod legs", "features": "pad holder clips", "portable": "folds flat", "accessories": ["chart pad", "markers", "carrying bag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- OFFICE SUPPLIES (Based on Staples)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Paper Copy 8.5x11 Case', 'Case of copy paper 10 reams.', 'consumable', 'event_rentals', 'Office Supplies', 'Staples', 'Copy Paper', 
ARRAY['copy paper', 'printer paper', 'office paper', 'white paper', 'letter paper'], 
ARRAY['paper', 'copy', 'case', '8.5x11'], 
'{"size": "8.5x11 inches", "weight": "20 lb", "brightness": "92", "quantity": "10 reams (5000 sheets)", "use": "copiers, printers, fax"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Pens Ballpoint Black Box of 60', 'Ballpoint pens black ink bulk box.', 'consumable', 'event_rentals', 'Office Supplies', 'BIC', 'Round Stic', 
ARRAY['pens', 'ballpoint pens', 'black pens', 'writing pens', 'bic pens'], 
ARRAY['pens', 'ballpoint', 'black', 'bulk'], 
'{"color": "black ink", "type": "ballpoint", "quantity": "60 pens", "tip": "medium 1.0mm", "brand": "BIC Round Stic"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Folders File Letter Manila Box of 100', 'Manila file folders letter size.', 'consumable', 'event_rentals', 'Office Supplies', 'Staples', 'File Folders', 
ARRAY['file folders', 'manila folders', 'filing folders', 'folders', 'document folders'], 
ARRAY['folders', 'file', 'manila', 'letter'], 
'{"size": "letter size", "color": "manila", "tabs": "1/3 cut tabs", "quantity": "100 folders", "material": "11 pt stock"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Binders 3-Ring 2" White Box of 12', 'Three-ring binders 2-inch capacity.', 'consumable', 'event_rentals', 'Office Supplies', 'Avery', '79182', 
ARRAY['binders', '3 ring binders', 'three ring binders', 'notebook binders', 'white binders'], 
ARRAY['binders', '3-ring', '2-inch', 'white'], 
'{"rings": "3 round rings", "capacity": "2 inch (375 sheets)", "size": "fits 8.5x11 paper", "color": "white", "quantity": "12 binders", "features": "clear overlay, spine label"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Stapler Heavy-Duty', 'Heavy-duty desktop stapler.', 'equipment', 'event_rentals', 'Office Supplies', 'Swingline', '747', 
ARRAY['stapler', 'heavy duty stapler', 'desk stapler', 'swingline stapler'], 
ARRAY['stapler', 'heavy-duty', 'desktop'], 
'{"capacity": "25 sheets", "type": "desktop", "staples": "standard staples", "features": "die cast metal", "accessories": ["staples", "staple remover"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Tape Dispenser Desktop with Tape', 'Weighted desktop tape dispenser.', 'equipment', 'event_rentals', 'Office Supplies', 'Scotch', 'C60', 
ARRAY['tape dispenser', 'desk tape dispenser', 'scotch tape dispenser'], 
ARRAY['tape-dispenser', 'desktop'], 
'{"type": "desktop weighted", "tape": "3/4 inch tape", "features": "non-slip base", "includes": "1 roll tape", "accessories": ["tape refills"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Scissors 8" Office', 'Stainless steel office scissors.', 'equipment', 'event_rentals', 'Office Supplies', 'Fiskars', '8" Office', 
ARRAY['scissors', 'office scissors', 'desk scissors', 'paper scissors'], 
ARRAY['scissors', '8-inch', 'office'], 
'{"length": "8 inches", "blade": "stainless steel", "handles": "contoured handles", "use": "paper, cardboard"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Clipboard Letter Size', 'Standard letter size clipboard.', 'equipment', 'event_rentals', 'Office Supplies', 'Saunders', '21601', 
ARRAY['clipboard', 'clip board', 'writing clipboard', 'paper holder'], 
ARRAY['clipboard', 'letter-size'], 
'{"size": "letter (8.5x11)", "material": "hardboard or plastic", "clip": "spring clip", "features": "hanging hole"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Calculator Desktop 12-Digit', 'Desktop calculator with large display.', 'equipment', 'event_rentals', 'Office Equipment', 'Canon', 'TS-1200TSC', 
ARRAY['calculator', 'desk calculator', 'office calculator', 'adding machine'], 
ARRAY['calculator', 'desktop', '12-digit'], 
'{"digits": "12 digit display", "type": "desktop", "features": "large keys, dual power", "functions": "basic math, tax, memory", "power": "solar + battery", "accessories": ["battery"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Label Maker Portable', 'Handheld electronic label maker.', 'equipment', 'event_rentals', 'Office Equipment', 'Brother', 'P-Touch', 
ARRAY['label maker', 'label printer', 'labelmaker', 'p-touch', 'handheld labeler'], 
ARRAY['label-maker', 'portable', 'handheld'], 
'{"type": "handheld electronic", "tape_width": "1/4 to 3/4 inch", "display": "LCD display", "memory": "stores labels", "power": "6 AAA batteries", "accessories": ["label tape", "batteries", "carrying case"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');
