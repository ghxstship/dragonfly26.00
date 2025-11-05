-- =============================================
-- SITE POWER - NEMA ELECTRICAL EQUIPMENT
-- Migration: 058
-- Purpose: Add NEMA plugs, outlets, receptacles, adapters and complete electrical distribution
-- Based on: Hubbell, Leviton, Pass & Seymour, Legrand electrical catalogs
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- NEMA RECEPTACLES/OUTLETS (Based on Hubbell, Leviton)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Receptacle NEMA 5-15R Duplex', 'Standard 120V 15A duplex receptacle.', 'equipment', 'site_services', 'Power Distribution', 'Leviton', '5320', 
ARRAY['5-15r', 'duplex outlet', 'standard outlet', '15 amp receptacle', '120v outlet', 'wall outlet'], 
ARRAY['electrical', 'receptacle', 'nema', '5-15r', '15a'], 
'{"nema_type": "5-15R", "voltage": "125V", "amperage": "15A", "poles": "2 pole", "wires": "3 wire", "grounding": "grounded", "outlets": "2 (duplex)", "color": "ivory or white", "mounting": "wall box", "use": "standard household/office power"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Receptacle NEMA 5-20R Duplex', '120V 20A T-slot duplex receptacle.', 'equipment', 'site_services', 'Power Distribution', 'Leviton', '5362', 
ARRAY['5-20r', '20 amp outlet', 't-slot receptacle', '20a duplex', 'commercial outlet'], 
ARRAY['electrical', 'receptacle', 'nema', '5-20r', '20a'], 
'{"nema_type": "5-20R", "voltage": "125V", "amperage": "20A", "poles": "2 pole 3 wire", "slot": "T-slot accepts 5-15P and 5-20P", "grounding": true, "use": "higher amperage circuits", "color": "white or ivory"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Receptacle NEMA L5-20R Twist-Lock', '120V 20A locking receptacle.', 'equipment', 'site_services', 'Power Distribution', 'Hubbell', 'HBL2320', 
ARRAY['l5-20r', 'twist lock', 'locking receptacle', '20a twist lock', 'twist lock outlet'], 
ARRAY['electrical', 'receptacle', 'twist-lock', 'l5-20r'], 
'{"nema_type": "L5-20R", "voltage": "125V", "amperage": "20A", "locking": "twist-lock", "poles": "2P 3W", "use": "portable generators, temporary power", "mounting": "surface or flush"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Receptacle NEMA L6-20R Twist-Lock 240V', '240V 20A locking receptacle.', 'equipment', 'site_services', 'Power Distribution', 'Hubbell', 'HBL2410', 
ARRAY['l6-20r', '240v twist lock', 'l6 twist lock', '240v 20a receptacle'], 
ARRAY['electrical', 'receptacle', 'twist-lock', 'l6-20r', '240v'], 
'{"nema_type": "L6-20R", "voltage": "250V", "amperage": "20A", "locking": "twist-lock", "poles": "2P 3W", "use": "240V equipment"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Receptacle NEMA L6-30R Twist-Lock 240V', '240V 30A locking receptacle.', 'equipment', 'site_services', 'Power Distribution', 'Hubbell', 'HBL2420', 
ARRAY['l6-30r', '240v 30a twist lock', 'l6-30 receptacle'], 
ARRAY['electrical', 'receptacle', 'twist-lock', 'l6-30r', '30a'], 
'{"nema_type": "L6-30R", "voltage": "250V", "amperage": "30A", "locking": "twist-lock", "use": "larger 240V loads"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Receptacle NEMA 14-50R 50A RV/Welder', '125/250V 50A receptacle for RVs and welders.', 'equipment', 'site_services', 'Power Distribution', 'Leviton', '279', 
ARRAY['14-50r', '50 amp outlet', 'rv outlet', 'welder outlet', '50a receptacle'], 
ARRAY['electrical', 'receptacle', 'nema', '14-50r', '50a'], 
'{"nema_type": "14-50R", "voltage": "125/250V", "amperage": "50A", "poles": "3P 4W", "grounding": true, "use": "RVs, welders, heavy equipment", "surface": "flush mount"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- NEMA PLUGS/CONNECTORS (Based on Hubbell, Pass & Seymour)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Plug NEMA 5-15P Straight Blade', 'Standard 120V 15A plug.', 'equipment', 'site_services', 'Power Distribution', 'Leviton', '515PR', 
ARRAY['5-15p', 'standard plug', '15 amp plug', '120v plug', 'edison plug', 'cord cap'], 
ARRAY['electrical', 'plug', 'nema', '5-15p', '15a'], 
'{"nema_type": "5-15P", "voltage": "125V", "amperage": "15A", "poles": "2P 3W", "grounding": true, "wire_range": "14-18 AWG", "use": "standard extension cords, power cords"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Plug NEMA 5-20P Straight Blade', '120V 20A plug with T-blade.', 'equipment', 'site_services', 'Power Distribution', 'Hubbell', 'HBL5366C', 
ARRAY['5-20p', '20 amp plug', 't-blade plug', '20a cord cap'], 
ARRAY['electrical', 'plug', 'nema', '5-20p', '20a'], 
'{"nema_type": "5-20P", "voltage": "125V", "amperage": "20A", "blade": "T-blade", "wire_range": "12-16 AWG", "use": "20A circuits"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Plug NEMA L5-20P Twist-Lock', '120V 20A locking plug.', 'equipment', 'site_services', 'Power Distribution', 'Hubbell', 'HBL2321', 
ARRAY['l5-20p', 'twist lock plug', '20a locking plug', 'l5 plug'], 
ARRAY['electrical', 'plug', 'twist-lock', 'l5-20p'], 
'{"nema_type": "L5-20P", "voltage": "125V", "amperage": "20A", "locking": "twist-lock", "poles": "2P 3W", "use": "generators, temporary power"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Plug NEMA L6-30P Twist-Lock 240V', '240V 30A locking plug.', 'equipment', 'site_services', 'Power Distribution', 'Hubbell', 'HBL2421', 
ARRAY['l6-30p', '240v twist lock plug', 'l6-30 plug', '30a 240v plug'], 
ARRAY['electrical', 'plug', 'twist-lock', 'l6-30p', '240v'], 
'{"nema_type": "L6-30P", "voltage": "250V", "amperage": "30A", "locking": "twist-lock", "wire_range": "10 AWG", "use": "240V equipment connections"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- NEMA ADAPTERS (Based on industry standard)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Adapter 5-15P to 5-20R', 'Plug adapter 15A plug to 20A receptacle.', 'equipment', 'site_services', 'Power Distribution', 'Parkworld', '885550', 
ARRAY['5-15 to 5-20 adapter', 'plug adapter', '15a to 20a adapter', 'outlet adapter'], 
ARRAY['electrical', 'adapter', 'nema', '5-15', '5-20'], 
'{"input": "NEMA 5-15P plug", "output": "NEMA 5-20R receptacle", "voltage": "125V", "max_amps": "15A", "use": "connect 15A plug to 20A outlet", "warning": "do not exceed 15A load"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Adapter L5-20P to 5-20R', 'Twist-lock to straight blade adapter.', 'equipment', 'site_services', 'Power Distribution', 'Conntek', '30122', 
ARRAY['l5-20 to 5-20 adapter', 'twist lock adapter', 'generator adapter'], 
ARRAY['electrical', 'adapter', 'twist-lock', 'l5-20'], 
'{"input": "NEMA L5-20P twist-lock", "output": "NEMA 5-20R straight blade", "voltage": "125V", "amperage": "20A", "use": "generator to household outlet", "portable": true}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Adapter L5-30P to 5-15/20R Duplex', 'Generator twist-lock to dual outlets.', 'equipment', 'site_services', 'Power Distribution', 'Conntek', 'L530PR', 
ARRAY['l5-30 adapter', 'generator adapter', 'twist to duplex', '30a to 15/20a adapter'], 
ARRAY['electrical', 'adapter', 'generator', 'l5-30'], 
'{"input": "NEMA L5-30P twist-lock", "output": "2x NEMA 5-15/20R outlets", "voltage": "125V", "input_amps": "30A", "output_amps": "15/20A per outlet", "use": "generator power distribution"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Adapter 14-50P to 5-15/20R Quad', '50A RV plug to quad outlets.', 'equipment', 'site_services', 'Power Distribution', 'Conntek', '1450PR', 
ARRAY['14-50 adapter', 'rv adapter', '50a to quad outlet', 'rv power adapter'], 
ARRAY['electrical', 'adapter', '14-50', 'rv'], 
'{"input": "NEMA 14-50P (RV/welder)", "output": "4x NEMA 5-15/20R outlets", "voltage": "125V from 125/250V", "total_amps": "50A input", "use": "RV hookup to household power"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- POWER STRIPS & SURGE PROTECTORS (Commercial Grade)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Power Strip 6-Outlet Metal Industrial', 'Heavy-duty 6-outlet metal power strip.', 'equipment', 'site_services', 'Power Distribution', 'Tripp Lite', 'RS-615-HG', 
ARRAY['power strip', 'outlet strip', '6 outlet strip', 'surge protector', 'metal power strip'], 
ARRAY['electrical', 'power-strip', 'surge', '6-outlet'], 
'{"outlets": "6 x NEMA 5-15R", "cord": "15 ft", "amperage": "15A 120V", "housing": "all-metal", "mounting": "wall mount or desktop", "circuit_breaker": "15A", "spacing": "wide outlet spacing", "accessories": ["mounting hardware", "cord management"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Power Strip 12-Outlet Rackmount', 'Rackmount 12-outlet power distribution.', 'equipment', 'site_services', 'Power Distribution', 'Tripp Lite', 'RS1215-RA', 
ARRAY['rackmount power', '12 outlet strip', 'rack power strip', 'server power strip'], 
ARRAY['electrical', 'power-strip', 'rackmount', '12-outlet'], 
'{"outlets": "12 x NEMA 5-15/20R", "mount": "1U rackmount", "cord": "15 ft", "amperage": "15A 120V", "breaker": "circuit breaker", "use": "rack equipment, server rooms"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Surge Protector 8-Outlet 2160J', 'Commercial surge protector with 2160 joules.', 'equipment', 'site_services', 'Power Distribution', 'Tripp Lite', 'TLP808', 
ARRAY['surge protector', '8 outlet surge', 'surge suppressor', 'power protection'], 
ARRAY['electrical', 'surge-protector', '8-outlet'], 
'{"outlets": "8 x NEMA 5-15R", "joules": "2160 joules", "cord": "8 ft", "protection": "surge, EMI/RFI filter", "indicator": "protection status lights", "warranty": "lifetime + $150K insurance", "use": "computers, AV equipment"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- CAMLOCK CONNECTORS (Professional Power Distribution)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Camlock Connector Male 400A', 'Camlock male connector for power distribution.', 'equipment', 'site_services', 'Power Distribution', 'Lex Products', 'CAM-400M', 
ARRAY['camlock', 'cam lock', 'camlock male', '400 amp camlock', 'power camlock'], 
ARRAY['electrical', 'camlock', 'connector', '400a'], 
'{"type": "male camlock", "amperage": "400A", "cable_range": "4/0 to 500 MCM", "material": "aluminum body", "contact": "copper", "colors": "coded by phase (black, red, blue, white, green)", "use": "high-amperage temporary power", "standard": "UL listed"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Camlock Connector Female 400A', 'Camlock female connector for power distribution.', 'equipment', 'site_services', 'Power Distribution', 'Lex Products', 'CAM-400F', 
ARRAY['camlock female', 'cam lock female', '400 amp camlock female'], 
ARRAY['electrical', 'camlock', 'connector', '400a', 'female'], 
'{"type": "female camlock", "amperage": "400A", "cable_range": "4/0 to 500 MCM", "material": "aluminum body", "contact": "copper", "colors": "coded by phase", "use": "generator tie-in, distribution"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Camlock Cable 4/0 AWG 25ft Set', 'Camlock cable set with connectors.', 'equipment', 'site_services', 'Power Distribution', 'Lex Products', 'CAMSET-25', 
ARRAY['camlock cable', 'cam lock cable', '4/0 cable', 'power feeder cable'], 
ARRAY['electrical', 'camlock', 'cable', '4/0'], 
'{"length": "25 ft", "gauge": "4/0 AWG", "amperage": "400A", "connectors": "male + female camlocks", "jacket": "SOOW portable cord", "colors": "5-wire set (black, red, blue, white, green)", "use": "generator to distro, high-amp feeds"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- PORTABLE POWER BOXES (Upgraded from existing)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Portable Power Box 30A Single Phase', 'Portable power distribution box with NEMA inputs/outputs.', 'equipment', 'site_services', 'Power Distribution', 'Lex Products', 'PDB-30', 
ARRAY['power box', 'portable distro', 'spider box 30a', 'breakout box'], 
ARRAY['electrical', 'distribution', 'portable', '30a'], 
'{"input": "NEMA L5-30P twist-lock", "outputs": "6x NEMA 5-15/20R duplex (12 total outlets)", "amperage": "30A input", "breakers": "individual 20A breakers per circuit", "metering": "volt meter", "housing": "impact resistant", "portable": true, "accessories": ["input cord 25ft", "mounting bracket", "rain cover"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Portable Power Box 50A Single Phase', 'Heavy-duty 50A power distribution.', 'equipment', 'site_services', 'Power Distribution', 'Lex Products', 'PDB-50', 
ARRAY['50a power box', 'spider box 50a', '50 amp distro'], 
ARRAY['electrical', 'distribution', '50a'], 
'{"input": "NEMA 14-50P or L5-50P", "outputs": "8x duplex 5-15/20R", "amperage": "50A", "breakers": "individual circuit breakers", "metering": "digital volt/amp", "accessories": ["input cord", "weatherproof cover"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- Move existing extension cords to proper subcategory (already exist in migration 056)
-- Add cable ramps (already exist in migration 056)

-- =============================================
-- GROUND FAULT EQUIPMENT (Safety)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'GFCI Outlet 20A Weather-Resistant', 'Ground fault circuit interrupter receptacle.', 'equipment', 'site_services', 'Power Distribution', 'Leviton', 'GFNT2-W', 
ARRAY['gfci outlet', 'gfi outlet', 'ground fault outlet', 'safety outlet', 'trip outlet'], 
ARRAY['electrical', 'gfci', 'safety', '20a'], 
'{"type": "GFCI receptacle", "amperage": "20A", "voltage": "125V", "nema": "5-20R", "weather_resistant": true, "tamper_resistant": true, "test_button": true, "reset_button": true, "use": "outdoor, wet locations, safety required", "protection": "ground fault 4-6mA trip"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'GFCI Cord 25ft Inline', 'Extension cord with inline GFCI protection.', 'equipment', 'site_services', 'Electrical', 'Woods', '04146', 
ARRAY['gfci cord', 'gfi extension cord', 'safety extension cord', 'ground fault cord'], 
ARRAY['electrical', 'extension', 'gfci', '25ft'], 
'{"length": "25 ft", "gauge": "12 AWG", "amperage": "15A", "plug": "NEMA 5-15P", "outlet": "NEMA 5-15R with GFCI", "protection": "inline ground fault protection", "indicator": "test/reset buttons", "use": "outdoor power tools, wet conditions"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- POWER DISTRIBUTION ACCESSORIES
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Outlet Box Weatherproof Single Gang', 'Weatherproof outlet box for outdoor use.', 'equipment', 'site_services', 'Power Distribution', 'Hubbell', 'RB201W', 
ARRAY['weatherproof box', 'outdoor outlet box', 'wet location box', 'outlet cover'], 
ARRAY['electrical', 'outlet-box', 'weatherproof'], 
'{"gang": "single gang", "material": "die-cast aluminum", "rating": "weatherproof in-use", "cover": "spring-loaded self-closing", "outlets": "fits duplex receptacle", "mounting": "wall mount", "use": "outdoor power", "gasket": "foam gasket included"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Cord Grip Strain Relief', 'Cord grip for cable strain relief.', 'equipment', 'site_services', 'Cable Management', 'Hubbell', 'CG-1', 
ARRAY['cord grip', 'strain relief', 'cable grip', 'cord connector'], 
ARRAY['electrical', 'cord-grip', 'strain-relief'], 
'{"size": "fits 0.5 to 0.75 inch cable", "material": "nylon", "threads": "NPT threads", "use": "strain relief for power cords entering boxes", "rating": "wet location rated"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Bushing Insulated Throat', 'Insulated throat bushing for conduit protection.', 'equipment', 'site_services', 'Power Distribution', 'Hubbell', 'IB-100', 
ARRAY['insulated bushing', 'throat bushing', 'conduit bushing', 'wire protection'], 
ARRAY['electrical', 'bushing', 'conduit'], 
'{"size": "1 inch conduit", "material": "insulated thermoplastic", "use": "protect wire insulation at conduit ends", "standard": "UL listed"}'::jsonb, 
'00000000-0000-0000-0000-000000000001');

-- Update subcategories for new items
UPDATE assets SET subcategory = 'NEMA Receptacles' WHERE category = 'Power Distribution' AND name LIKE '%Receptacle NEMA%';
UPDATE assets SET subcategory = 'NEMA Plugs' WHERE category = 'Power Distribution' AND name LIKE '%Plug NEMA%';
UPDATE assets SET subcategory = 'NEMA Adapters' WHERE category = 'Power Distribution' AND name LIKE '%Adapter%';
UPDATE assets SET subcategory = 'Power Strips' WHERE category = 'Power Distribution' AND (name LIKE '%Power Strip%' OR name LIKE '%Surge Protector%');
UPDATE assets SET subcategory = 'Camlock Connectors' WHERE category = 'Power Distribution' AND name LIKE '%Camlock%';
UPDATE assets SET subcategory = 'Portable Power Boxes' WHERE category = 'Power Distribution' AND name LIKE '%Portable Power Box%';
UPDATE assets SET subcategory = 'GFCI Safety Equipment' WHERE category = 'Power Distribution' AND name LIKE '%GFCI%';
UPDATE assets SET subcategory = 'Electrical Accessories' WHERE category = 'Power Distribution' AND (name LIKE '%Box%' OR name LIKE '%Grip%' OR name LIKE '%Bushing%');
