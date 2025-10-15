-- =============================================
-- COMPREHENSIVE SITE SAFETY CATALOG
-- Migration: 043
-- Based on: Amerex, Ansul, MediTac, 3M, Honeywell, MSA, Moldex, Brady, Lithonia
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- FIRE EXTINGUISHERS (Based on Amerex, Ansul, Badger catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Fire Extinguisher ABC 2.5lb', 'Small ABC dry chemical extinguisher for vehicles and small areas.', 'equipment', 'site_safety', 'Fire Safety', 'Amerex', 'B417T', 
ARRAY['2.5lb fire extinguisher', 'abc extinguisher small', 'car fire extinguisher', 'vehicle extinguisher'], 
ARRAY['fire-extinguisher', 'abc', '2.5lb', 'portable'], 
'{"type": "ABC dry chemical", "size": "2.5 lbs", "class": "A, B, C", "rating": "1-A:10-B:C", "discharge_time": "9 seconds", "range": "8-12 ft", "rechargeable": true, "accessories": ["vehicle bracket", "inspection tag", "pin lock"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Fire Extinguisher ABC 5lb', 'Standard ABC extinguisher for homes and small offices.', 'equipment', 'site_safety', 'Fire Safety', 'Amerex', 'B402', 
ARRAY['5lb fire extinguisher', 'abc extinguisher 5lb', 'home fire extinguisher', 'office extinguisher'], 
ARRAY['fire-extinguisher', 'abc', '5lb'], 
'{"type": "ABC dry chemical", "size": "5 lbs", "class": "A, B, C", "rating": "3-A:40-B:C", "discharge_time": "14 seconds", "range": "15 ft", "accessories": ["wall bracket", "inspection tag", "maintenance kit"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Fire Extinguisher ABC 10lb', 'Large ABC extinguisher for commercial and industrial use.', 'equipment', 'site_safety', 'Fire Safety', 'Amerex', 'B456', 
ARRAY['10lb fire extinguisher', 'abc extinguisher 10lb', 'commercial fire extinguisher', 'industrial extinguisher'], 
ARRAY['fire-extinguisher', 'abc', '10lb', 'commercial'], 
'{"type": "ABC dry chemical", "size": "10 lbs", "class": "A, B, C", "rating": "4-A:80-B:C", "discharge_time": "17 seconds", "range": "15-20 ft", "weight": "15 lbs loaded", "accessories": ["wall bracket with strap", "inspection tag", "maintenance kit", "signage"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Fire Extinguisher ABC 20lb', 'Extra large ABC extinguisher for warehouses and large areas.', 'equipment', 'site_safety', 'Fire Safety', 'Amerex', 'B456', 
ARRAY['20lb fire extinguisher', 'large abc extinguisher', 'warehouse fire extinguisher'], 
ARRAY['fire-extinguisher', 'abc', '20lb', 'large'], 
'{"type": "ABC dry chemical", "size": "20 lbs", "class": "A, B, C", "rating": "10-A:120-B:C", "discharge_time": "25 seconds", "mobility": "wheeled unit", "accessories": ["wheeled cart", "hose", "inspection tag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Fire Extinguisher CO2 5lb', 'CO2 extinguisher for electrical fires.', 'equipment', 'site_safety', 'Fire Safety', 'Amerex', 'B330', 
ARRAY['co2 fire extinguisher', 'carbon dioxide extinguisher', 'electrical fire extinguisher', '5lb co2'], 
ARRAY['fire-extinguisher', 'co2', '5lb', 'electrical'], 
'{"type": "CO2 carbon dioxide", "size": "5 lbs", "class": "B, C", "rating": "5-B:C", "use": "electrical fires, computers, electronics", "discharge_time": "10 seconds", "accessories": ["wall hook", "horn", "inspection tag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Fire Extinguisher CO2 10lb', 'Standard CO2 extinguisher for data centers and electrical rooms.', 'equipment', 'site_safety', 'Fire Safety', 'Amerex', 'B355', 
ARRAY['co2 extinguisher 10lb', 'data center fire extinguisher', 'server room extinguisher'], 
ARRAY['fire-extinguisher', 'co2', '10lb'], 
'{"type": "CO2", "size": "10 lbs", "class": "B, C", "rating": "10-B:C", "accessories": ["wall bracket", "hose with horn", "inspection tag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Fire Extinguisher CO2 20lb', 'Large CO2 extinguisher for industrial electrical equipment.', 'equipment', 'site_safety', 'Fire Safety', 'Amerex', 'B374', 
ARRAY['co2 extinguisher 20lb', 'large co2 extinguisher', 'industrial co2'], 
ARRAY['fire-extinguisher', 'co2', '20lb', 'industrial'], 
'{"type": "CO2", "size": "20 lbs", "class": "B, C", "rating": "20-B:C", "weight": "65 lbs", "accessories": ["wheeled cart", "long hose", "horn", "inspection tag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Fire Extinguisher Class K 6L', 'Class K wet chemical extinguisher for kitchen fires.', 'equipment', 'site_safety', 'Fire Safety', 'Amerex', 'B260', 
ARRAY['class k extinguisher', 'kitchen fire extinguisher', 'grease fire extinguisher', 'wet chemical extinguisher'], 
ARRAY['fire-extinguisher', 'class-k', 'kitchen', 'wet-chemical'], 
'{"type": "Class K wet chemical", "size": "6 liters", "class": "K (kitchen fires)", "use": "cooking oils, grease fires", "rating": "2-A:K", "accessories": ["wall bracket", "spray nozzle", "inspection tag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Fire Blanket 40x60', 'Fire suppression blanket for emergency use.', 'equipment', 'site_safety', 'Fire Safety', 'JJ Keller', 'FB-4060', 
ARRAY['fire blanket', 'safety blanket', 'welding blanket', 'fire suppression blanket', 'emergency blanket'], 
ARRAY['fire-blanket', 'safety', 'emergency'], 
'{"size": "40x60 inches", "material": "fiberglass", "use": "smothering small fires, wrapping person", "temp_rating": "1000°F", "reusable": false, "accessories": ["wall mount case", "instruction label", "quick-release tabs"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- FIRST AID (Based on MediTac, First Aid Only, PhysiciansCare)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'First Aid Kit 10 Person', 'Small first aid kit for vehicles and offices.', 'consumable', 'site_safety', 'First Aid', 'First Aid Only', 'FAO-112', 
ARRAY['small first aid kit', '10 person kit', 'vehicle first aid', 'office first aid kit'], 
ARRAY['first-aid', 'medical', 'small', '10-person'], 
'{"capacity": "10 people", "items": "62 pieces", "container": "plastic case", "contents": "bandages, gauze, tape, antiseptic, gloves, scissors", "accessories": ["wall mount bracket", "refill packs available"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'First Aid Kit 25 Person', 'Standard first aid kit for small businesses.', 'consumable', 'site_safety', 'First Aid', 'MediTac', 'FAK-25', 
ARRAY['25 person first aid', 'small business first aid', 'office first aid 25'], 
ARRAY['first-aid', 'medical', '25-person'], 
'{"capacity": "25 people", "items": "150+ pieces", "container": "metal cabinet", "ANSI_compliant": "ANSI Z308.1-2021", "contents": "bandages, gauze, tape, scissors, gloves, antiseptic, burn gel, cold pack", "accessories": ["wall mount", "inventory list", "refills"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'First Aid Kit 50 Person', 'Medium first aid kit for job sites and facilities.', 'consumable', 'site_safety', 'First Aid', 'MediTac', 'FAK-50', 
ARRAY['50 person first aid', 'job site first aid', 'construction first aid'], 
ARRAY['first-aid', 'medical', '50-person', 'job-site'], 
'{"capacity": "50 people", "items": "225+ pieces", "container": "metal wall cabinet", "ANSI_compliant": true, "contents": "complete trauma supplies, eye wash, splints, emergency blanket", "accessories": ["wall mount hardware", "inspection tag", "refill service"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'First Aid Kit 100 Person Industrial', 'Large industrial first aid kit for warehouses and plants.', 'consumable', 'site_safety', 'First Aid', 'MediTac', 'FAK-100', 
ARRAY['100 person first aid', 'industrial first aid kit', 'warehouse first aid', 'large first aid kit'], 
ARRAY['first-aid', 'medical', '100-person', 'industrial'], 
'{"capacity": "100 people", "items": "500+ pieces", "container": "large metal cabinet", "OSHA_compliant": true, "contents": "trauma supplies, eye wash station, CPR mask, splints, emergency blanket, burn treatment", "accessories": ["wall mount", "inspection log", "AED compatible", "refill program"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'First Aid Kit Trauma', 'Professional trauma kit for emergency response.', 'consumable', 'site_safety', 'First Aid', 'MediTac', 'TRAUMA-PRO', 
ARRAY['trauma kit', 'emergency medical kit', 'ems kit', 'paramedic kit'], 
ARRAY['first-aid', 'trauma', 'emergency', 'medical'], 
'{"type": "trauma response", "items": "200+ pieces", "container": "backpack", "contents": "tourniquets, hemostatic gauze, chest seals, airways, splints, bandages", "accessories": ["waterproof bag", "molle compatible", "gloves", "shears"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'AED Automated External Defibrillator', 'Automatic AED for cardiac emergencies.', 'equipment', 'site_safety', 'Medical Equipment', 'Philips', 'HeartStart FRx', 
ARRAY['aed', 'defibrillator', 'automated defibrillator', 'cardiac emergency device', 'heart device'], 
ARRAY['aed', 'defibrillator', 'medical', 'emergency', 'cardiac'], 
'{"type": "automatic AED", "guidance": "voice prompts", "battery_life": "4 years", "pediatric": "infant/child key included", "rugged": "IP55 rated", "weight": "3.5 lbs", "accessories": ["electrode pads (2 sets)", "battery pack", "rescue kit", "wall mount case with alarm", "cpr coaching"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Eye Wash Station Portable', 'Portable eye wash station for emergency eye flushing.', 'equipment', 'site_safety', 'Medical Equipment', 'Honeywell', 'FendAll-1000', 
ARRAY['eye wash', 'eyewash station', 'emergency eye wash', 'portable eye wash', 'safety shower'], 
ARRAY['eyewash', 'eye-wash', 'emergency', 'medical'], 
'{"capacity": "16 gallons", "flow_rate": "0.4 GPM per eye", "duration": "15 minutes", "type": "gravity fed", "solution": "preserved saline or water", "portability": "wall mount or portable", "accessories": ["mounting bracket", "dust covers", "inspection tag", "replacement solution"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- PPE - HEAD PROTECTION (Based on 3M, MSA, Honeywell)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Hard Hat Type 1 Class E', 'Standard hard hat with electrical protection.', 'equipment', 'site_safety', 'PPE - Head', '3M', 'H-700', 
ARRAY['hard hat', 'safety helmet', 'construction helmet', 'bump cap', 'type 1 hard hat'], 
ARRAY['hard-hat', 'ppe', 'head-protection', 'helmet'], 
'{"type": "Type 1 Class E", "protection": "top impact + electrical 20kV", "material": "HDPE", "suspension": "4-point ratchet", "ANSI_standard": "ANSI Z89.1", "colors": "white, yellow, orange, blue, green, red", "accessories": ["chin strap", "sweatband", "hard hat stickers", "reflective tape"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Hard Hat Type 2 Class E', 'Full brim hard hat with enhanced side impact protection.', 'equipment', 'site_safety', 'PPE - Head', 'MSA', 'V-Gard', 
ARRAY['full brim hard hat', 'type 2 hard hat', 'cowboy hard hat', 'sun shade hard hat'], 
ARRAY['hard-hat', 'ppe', 'full-brim', 'type-2'], 
'{"type": "Type 2 Class E", "protection": "top + side impact + electrical", "brim": "full brim sun protection", "material": "polyethylene", "accessories": ["ratchet suspension", "chin strap", "sweatband"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Hard Hat Vented', 'Vented hard hat for hot weather work.', 'equipment', 'site_safety', 'PPE - Head', '3M', 'H-701V', 
ARRAY['vented hard hat', 'ventilated helmet', 'cool hard hat', 'summer hard hat'], 
ARRAY['hard-hat', 'vented', 'ppe'], 
'{"type": "Type 1 Class E vented", "ventilation": "front and rear vents", "use": "hot weather conditions", "accessories": ["sweatband", "chin strap"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- PPE - EYE PROTECTION (Based on 3M, Pyramex, Honeywell)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Safety Glasses Clear', 'Clear safety glasses for general use.', 'equipment', 'site_safety', 'PPE - Eye', 'Pyramex', 'S2510S', 
ARRAY['safety glasses', 'clear safety glasses', 'protective eyewear', 'eye protection', 'safety specs'], 
ARRAY['safety-glasses', 'ppe', 'eye-protection', 'clear'], 
'{"lens": "clear polycarbonate", "standard": "ANSI Z87.1+", "protection": "impact, 99.9% UV", "features": "anti-scratch coating", "fit": "universal", "accessories": ["neck cord", "cleaning cloth", "carrying case", "foam inserts"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Safety Glasses Tinted', 'Tinted safety glasses for outdoor work.', 'equipment', 'site_safety', 'PPE - Eye', 'Pyramex', 'SB1820S', 
ARRAY['tinted safety glasses', 'sunglasses safety', 'outdoor eye protection', 'smoke safety glasses'], 
ARRAY['safety-glasses', 'ppe', 'tinted', 'outdoor'], 
'{"lens": "smoke/gray polycarbonate", "standard": "ANSI Z87.1+", "protection": "impact, UV, glare reduction", "use": "outdoor work", "accessories": ["neck cord", "case"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Safety Goggles Chemical Splash', 'Chemical splash goggles for lab and industrial use.', 'equipment', 'site_safety', 'PPE - Eye', '3M', '334AF', 
ARRAY['safety goggles', 'chemical goggles', 'splash goggles', 'lab goggles', 'protective goggles'], 
ARRAY['goggles', 'ppe', 'chemical', 'splash'], 
'{"type": "indirect vent goggles", "standard": "ANSI Z87.1", "protection": "chemical splash, impact", "features": "anti-fog coating", "fit": "over glasses capable", "accessories": ["elastic strap", "cleaning cloth"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Welding Helmet Auto-Darkening', 'Auto-darkening welding helmet for arc welding.', 'equipment', 'site_safety', 'PPE - Face', 'Miller', 'Digital Elite', 
ARRAY['welding helmet', 'auto darkening helmet', 'welding mask', 'welder helmet', 'arc welding helmet'], 
ARRAY['welding-helmet', 'ppe', 'auto-darkening', 'face'], 
'{"type": "auto-darkening", "shade_range": "8-13", "reaction_time": "1/25000 second", "power": "solar + battery", "viewing_area": "3.93 x 2.36 inches", "accessories": ["headgear", "batteries", "lens covers", "carrying bag"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- PPE - HEARING PROTECTION (Based on 3M, Howard Leight, Moldex)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Ear Plugs Disposable Foam 100 Pairs', 'Disposable foam ear plugs for noise reduction.', 'consumable', 'site_safety', 'PPE - Hearing', '3M', '1100', 
ARRAY['ear plugs', 'foam earplugs', 'disposable ear plugs', 'hearing protection', 'noise plugs'], 
ARRAY['ear-plugs', 'ppe', 'hearing', 'disposable'], 
'{"type": "disposable foam", "nrr": "29 dB", "quantity": "100 pairs", "material": "polyurethane foam", "features": "tapered design, smooth surface", "standard": "ANSI S3.19", "individually wrapped": true}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Ear Plugs Reusable Corded', 'Reusable corded ear plugs with carrying case.', 'equipment', 'site_safety', 'PPE - Hearing', 'Howard Leight', 'MAX-30', 
ARRAY['reusable ear plugs', 'corded earplugs', 'washable ear plugs'], 
ARRAY['ear-plugs', 'reusable', 'ppe'], 
'{"type": "reusable with cord", "nrr": "30 dB", "material": "TPE thermoplastic", "washable": true, "accessories": ["cord", "carrying case"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Ear Muffs Over-Ear', 'Over-ear hearing protection muffs.', 'equipment', 'site_safety', 'PPE - Hearing', '3M', 'Peltor X5A', 
ARRAY['ear muffs', 'hearing muffs', 'over ear protection', 'noise muffs', 'hearing protectors'], 
ARRAY['ear-muffs', 'ppe', 'hearing', 'over-ear'], 
'{"type": "over-ear muffs", "nrr": "31 dB", "features": "cushioned ear cups, adjustable headband", "weight": "12 oz", "use": "high noise environments", "accessories": ["replacement ear cushions", "hygiene kit"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- PPE - RESPIRATORY (Based on 3M, Moldex, MSA)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Dust Mask N95 Box of 20', 'N95 particulate respirator for dust and particles.', 'consumable', 'site_safety', 'PPE - Respiratory', '3M', '8210', 
ARRAY['n95 mask', 'dust mask', 'respirator', 'particulate mask', 'n95 respirator'], 
ARRAY['dust-mask', 'n95', 'ppe', 'respiratory'], 
'{"type": "N95 particulate respirator", "filtration": "95% of 0.3 micron particles", "standard": "NIOSH N95", "quantity": "20 masks", "features": "cushioned nose clip, elastic straps", "use": "dust, pollen, non-oil particles"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Respirator Half-Face Reusable', 'Reusable half-face respirator with replaceable cartridges.', 'equipment', 'site_safety', 'PPE - Respiratory', '3M', '6200', 
ARRAY['half face respirator', 'reusable respirator', 'cartridge respirator', 'half mask respirator'], 
ARRAY['respirator', 'half-face', 'reusable', 'ppe'], 
'{"type": "half-face reusable", "sizes": "small, medium, large", "cartridges": "sold separately - various types", "material": "soft silicone face piece", "standard": "NIOSH approved", "accessories": ["head straps", "cartridge retainers", "filters (organic vapor, P100, etc)"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Respirator Full-Face', 'Full-face respirator for maximum protection.', 'equipment', 'site_safety', 'PPE - Respiratory', 'MSA', 'Advantage 3200', 
ARRAY['full face respirator', 'full mask respirator', 'face shield respirator'], 
ARRAY['respirator', 'full-face', 'ppe'], 
'{"type": "full-face reusable", "protection": "eyes, nose, mouth", "lens": "polycarbonate", "sizes": "small, medium, large", "accessories": ["head harness", "cartridges sold separately", "lens covers", "carrying case"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- PPE - HI-VIS CLOTHING (Based on ML Kishigo, Occunomix, PIP)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Safety Vest Class 2 Mesh', 'High visibility mesh safety vest.', 'equipment', 'site_safety', 'PPE - Visibility', 'ML Kishigo', '1191', 
ARRAY['safety vest', 'hi vis vest', 'reflective vest', 'visibility vest', 'traffic vest', 'construction vest'], 
ARRAY['safety-vest', 'ppe', 'hi-vis', 'class-2', 'reflective'], 
'{"class": "ANSI Class 2", "material": "breathable mesh", "colors": "lime, orange", "sizes": "S, M, L, XL, 2XL, 3XL, 4XL, 5XL", "features": "2-inch reflective tape, hook & loop closure", "pockets": "2 lower pockets", "accessories": ["id badge holder option"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Safety Vest Class 3 Heavy Duty', 'Heavy duty Class 3 safety vest for high-risk areas.', 'equipment', 'site_safety', 'PPE - Visibility', 'ML Kishigo', '1513', 
ARRAY['class 3 vest', 'heavy duty safety vest', 'surveyor vest', 'premium safety vest'], 
ARRAY['safety-vest', 'class-3', 'heavy-duty'], 
'{"class": "ANSI Class 3", "material": "heavy duty polyester", "reflective": "360° visibility", "sizes": "S-5XL", "features": "zipper closure, multiple pockets", "accessories": ["d-ring for fall protection", "mic tab", "radio pocket"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- Continuing in next section due to length...
