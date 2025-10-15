-- =============================================
-- COMPREHENSIVE SITE SERVICES CATALOG
-- Migration: 042
-- Based on: Generac, Cummins, Atlas Copco, Progress Solar, MovinCool, Mr. Heater, SpaceX StarLink
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- GENERATORS (Based on Generac, Cummins, Kohler, Cat catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Generator 3.5kW Portable Gas', 'Small portable gas generator for basic power needs.', 'equipment', 'site_services', 'Generators', 'Honda', 'EU3000iS', 
ARRAY['3500 watt generator', 'portable generator', 'small generator', 'gas generator', 'inverter generator', '3.5kw genset'], 
ARRAY['generator', 'portable', 'gas', '3.5kw', 'inverter'], 
'{"power_output": "3500W peak / 3000W running", "fuel": "gasoline", "runtime": "7-20 hours on 3.4 gal tank", "noise": "49-58 dB", "weight": "131 lbs", "outlets": "2x120V 20A, 1x12V DC", "inverter": true, "parallel_ready": true, "accessories": ["wheel kit", "cover", "fuel can", "oil", "spark plugs"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Generator 6kW Portable Gas', 'Mid-size portable generator for home/job site backup.', 'equipment', 'site_services', 'Generators', 'Generac', 'GP6500', 
ARRAY['6000 watt generator', '6kw generator', 'portable genset', 'backup generator', 'gas generator 6kw'], 
ARRAY['generator', 'portable', 'gas', '6kw'], 
'{"power_output": "8125W peak / 6500W running", "fuel": "gasoline", "runtime": "10 hours at 50% load", "tank": "6.9 gallons", "noise": "69 dB", "outlets": "4x120V, 1x120/240V twist-lock", "accessories": ["wheel kit", "battery", "oil", "manual"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Generator 10kW Portable Diesel', 'Portable 10kW diesel generator for job sites.', 'equipment', 'site_services', 'Generators', 'Generac', 'MDG10', 
ARRAY['10kw generator', 'diesel generator 10kw', 'portable diesel genset', 'job site generator'], 
ARRAY['generator', 'portable', 'diesel', '10kw'], 
'{"power_output": "10kW", "fuel": "diesel", "runtime": "24 hours on full tank", "noise": "72 dB at 23 ft", "outlets": "multiple 120/240V", "mobility": "trailer mounted", "accessories": ["fuel tank", "power cables", "distribution box", "weather cover"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Generator 20kW Diesel Towable', 'Towable 20kW diesel generator for construction and events.', 'equipment', 'site_services', 'Generators', 'Generac', 'MDG20-D', 
ARRAY['20kw generator', 'towable generator', 'diesel genset 20kw', 'portable power 20kw', 'construction generator'], 
ARRAY['generator', 'diesel', '20kw', 'towable'], 
'{"power_output": "20kW", "fuel": "diesel", "runtime": "12-24 hours depending on load", "noise": "75 dB at 23 ft", "voltage": "120/240V", "mobility": "DOT approved trailer", "accessories": ["50 ft power cord", "camlock connectors", "distribution panel", "fuel gauge", "hour meter"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Generator 50kW Diesel', 'Industrial 50kW diesel generator for large events and construction.', 'equipment', 'site_services', 'Generators', 'Cummins', 'C50D6', 
ARRAY['50kw generator', 'industrial generator', 'diesel genset 50kw', 'large generator', 'event power'], 
ARRAY['generator', 'diesel', '50kw', 'industrial'], 
'{"power_output": "50kW", "fuel": "diesel", "voltage": "120/208V or 277/480V 3-phase", "fuel_consumption": "3.4 gal/hr at full load", "enclosure": "sound attenuated", "accessories": ["ATS ready", "remote monitoring", "fuel tank", "weather enclosure"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Generator 100kW Diesel', 'Heavy-duty 100kW three-phase generator for large facilities.', 'equipment', 'site_services', 'Generators', 'Generac', 'MDG100-D', 
ARRAY['100kw generator', 'large diesel generator', 'industrial power 100kw', 'three phase generator'], 
ARRAY['generator', 'diesel', '100kw', 'industrial', '3-phase'], 
'{"power_output": "100kW", "fuel": "diesel", "voltage": "277/480V 3-phase", "runtime": "24 hours continuous", "noise": "78 dB at 23 ft", "enclosure": "sound attenuated weatherproof", "accessories": ["fuel transfer pump", "power distribution", "remote start", "monitoring system"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Generator 200kW Diesel', 'Very large 200kW diesel generator for major events and facilities.', 'equipment', 'site_services', 'Generators', 'Cummins', 'C200D6', 
ARRAY['200kw generator', 'mega generator', 'large event power', '200kw diesel genset'], 
ARRAY['generator', 'diesel', '200kw', 'mega'], 
'{"power_output": "200kW", "fuel": "diesel", "voltage": "480V 3-phase", "fuel_consumption": "14 gal/hr", "size": "requires flatbed delivery", "accessories": ["load bank", "camlock cables 4/0", "fuel monitoring", "paralleling capability"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Generator 500kW Diesel', 'Industrial grade 500kW for large venues and data centers.', 'equipment', 'site_services', 'Generators', 'Caterpillar', 'XQ500', 
ARRAY['500kw generator', 'industrial power plant', 'mega generator', 'large venue power'], 
ARRAY['generator', 'diesel', '500kw', 'industrial'], 
'{"power_output": "500kW", "fuel": "diesel", "voltage": "480V 3-phase", "enclosure": "containerized", "use": "large venues, data centers, hospitals", "accessories": ["paralleling switchgear", "fuel polishing", "remote monitoring"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- POWER DISTRIBUTION (Based on Lex Products, Morris, temp power catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Power Distribution Box 60A Single Phase', 'Portable 60A power distro for small events.', 'equipment', 'site_services', 'Power Distribution', 'Lex Products', 'PD-60-1P', 
ARRAY['60 amp distro', 'spider box', 'power box', 'electrical distribution', 'distro box'], 
ARRAY['distribution', 'power', '60A', 'single-phase'], 
'{"amperage": "60A", "input": "Twist-lock L6-60", "outputs": "6x 120V 20A duplex", "voltage": "120/240V single phase", "breakers": "individual circuit breakers", "accessories": ["input cable 25ft", "breakout cables", "cord caps", "rain cover"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Power Distribution Box 100A Single Phase', 'Standard 100A distro for medium events and productions.', 'equipment', 'site_services', 'Power Distribution', 'Morris', 'PD-100-1P', 
ARRAY['100 amp distro', 'spider box 100a', 'power distribution 100a', 'temp power box'], 
ARRAY['distribution', 'power', '100A', 'single-phase'], 
'{"amperage": "100A", "input": "Cam-lock single phase", "outputs": "12x 120V 20A circuits", "voltage": "120/240V", "metering": "volt/amp meter", "accessories": ["camlock input cables", "edison breakouts", "GFCI outlets"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Power Distribution Box 200A Three Phase', 'Large 200A 3-phase distro for major events.', 'equipment', 'site_services', 'Power Distribution', 'Lex Products', 'PD-200-3P', 
ARRAY['200 amp distro', '200a distribution', 'three phase distro', 'event power distro'], 
ARRAY['distribution', 'power', '200A', '3-phase'], 
'{"amperage": "200A", "input": "Cam-lock 3-phase", "voltage": "120/208V 3-phase", "outputs": "multiple 120V and 208V circuits", "metering": "digital volt/amp per phase", "accessories": ["camlock cables set", "breakout cables", "ground rod", "rain tent"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Power Distribution Box 400A Three Phase', 'Heavy-duty 400A 3-phase for large productions.', 'equipment', 'site_services', 'Power Distribution', 'Lex Products', 'PD-400-3P', 
ARRAY['400 amp distro', '400a power box', 'large event power', 'concert power distro'], 
ARRAY['distribution', 'power', '400A', '3-phase', 'heavy-duty'], 
'{"amperage": "400A", "input": "4/0 camlock 3-phase", "voltage": "120/208V or 277/480V", "outputs": "multiple sub-feed circuits", "metering": "advanced digital metering", "accessories": ["4/0 camlock cables", "sub-feed breakouts", "grounding kit", "rain cover", "locking hardware"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- LIGHTING TOWERS (Based on Atlas Copco, Progress Solar, Allmand, Wacker Neuson)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Light Tower Diesel 4x1000W Metal Halide', 'Standard diesel light tower with 4 metal halide lights.', 'equipment', 'site_services', 'Light Towers', 'Atlas Copco', 'HiLight V5+', 
ARRAY['light tower', 'lighting tower', 'site lighting', 'diesel light tower', 'work lights', '4000 watt light tower'], 
ARRAY['light-tower', 'diesel', '4x1000w', 'metal-halide'], 
'{"lights": "4x1000W metal halide", "tower_height": "30 ft pneumatic mast", "coverage": "5-7 acres", "fuel": "diesel", "runtime": "70 hours on 43 gal tank", "noise": "68 dB at 23 ft", "mobility": "trailer mounted DOT", "accessories": ["fuel tank", "trailer hitch", "remote control", "spare bulbs", "leveling jacks"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Light Tower LED 4x320W Solar Hybrid', 'Eco-friendly solar/battery LED light tower.', 'equipment', 'site_services', 'Light Towers', 'Progress Solar', 'SLT-4LED', 
ARRAY['solar light tower', 'led light tower', 'eco light tower', 'battery light tower', 'green lighting'], 
ARRAY['light-tower', 'solar', 'led', 'hybrid', 'eco'], 
'{"lights": "4x320W LED (equiv 4x1000W MH)", "power": "solar panels + battery", "runtime": "10+ hours per charge", "tower_height": "25 ft", "charging": "solar or shore power", "noise": "silent operation", "accessories": ["solar panels", "battery bank", "remote monitoring", "tilt mast", "ground stakes"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Light Tower LED 6x150W Electric', 'Electric LED light tower for events and productions.', 'equipment', 'site_services', 'Light Towers', 'Allmand', 'Maxi-Lite LED', 
ARRAY['electric light tower', 'led tower', 'event lighting tower', 'plug-in light tower'], 
ARRAY['light-tower', 'led', 'electric', '6-light'], 
'{"lights": "6x150W LED", "power": "110V electric plug-in", "tower_height": "20 ft manual crank", "weight": "380 lbs", "mobility": "4-wheel trailer", "accessories": ["50 ft power cord", "stabilizer jacks", "adjustable heads"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- HVAC & CLIMATE CONTROL (Based on MovinCool, Mr. Heater, Big Ass Fans)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Portable AC Unit 1 Ton', 'Small portable air conditioner for offices and small spaces.', 'equipment', 'site_services', 'HVAC', 'MovinCool', 'Classic 12', 
ARRAY['1 ton ac', 'portable air conditioner', 'spot cooler', 'portable cooling', 'ac unit 12000 btu'], 
ARRAY['hvac', 'ac', 'cooling', 'portable', '1-ton'], 
'{"cooling_capacity": "1 ton (12000 BTU)", "power": "115V", "coverage": "300 sq ft", "airflow": "300 CFM", "weight": "147 lbs", "mobility": "casters", "accessories": ["ducting 25ft", "window kit", "condensate pump", "filters"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Portable AC Unit 3 Ton', 'Medium capacity portable AC for larger spaces.', 'equipment', 'site_services', 'HVAC', 'MovinCool', 'Office Pro 36', 
ARRAY['3 ton ac', 'portable ac 36000 btu', 'medium spot cooler', 'office air conditioner'], 
ARRAY['hvac', 'ac', 'cooling', '3-ton'], 
'{"cooling_capacity": "3 ton (36000 BTU)", "power": "230V", "coverage": "900 sq ft", "airflow": "900 CFM", "accessories": ["ducting", "condensate pump", "thermostat", "filters"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Portable AC Unit 5 Ton', 'Large portable air conditioning unit for tents and large spaces.', 'equipment', 'site_services', 'HVAC', 'MovinCool', 'CM60', 
ARRAY['5 ton ac', 'portable ac 60000 btu', 'large spot cooler', 'tent air conditioner', 'event cooling'], 
ARRAY['hvac', 'ac', 'cooling', '5-ton', 'large'], 
'{"cooling_capacity": "5 ton (60000 BTU)", "power": "230V", "coverage": "1500 sq ft", "airflow": "1500 CFM", "ducting": "12 inch flexible", "accessories": ["ducting 50ft", "condensate pump", "remote thermostat", "filters", "distribution plenum"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Portable Heater Propane 60K BTU', 'Small portable propane heater for spot heating.', 'equipment', 'site_services', 'HVAC', 'Mr. Heater', 'MH60QFAV', 
ARRAY['propane heater', 'portable heater 60k', 'construction heater', 'torpedo heater'], 
ARRAY['heater', 'propane', 'heating', 'portable', '60k-btu'], 
'{"output": "60000 BTU", "fuel": "propane", "coverage": "1500 sq ft", "runtime": "14 hours on 20lb tank", "safety": "tip-over shutoff, ODS pilot", "accessories": ["propane hose 10ft", "regulator", "20lb propane tank"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Portable Heater Propane 125K BTU', 'Medium propane heater for construction and events.', 'equipment', 'site_services', 'HVAC', 'Mr. Heater', 'MH125V', 
ARRAY['propane heater 125k', 'construction heater 125k', 'forced air heater', 'job site heater'], 
ARRAY['heater', 'propane', '125k-btu'], 
'{"output": "125000 BTU", "fuel": "propane", "coverage": "3100 sq ft", "accessories": ["propane hose 20ft", "regulator", "thermostat"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Portable Heater Propane 250K BTU', 'Large propane heater for big spaces and construction.', 'equipment', 'site_services', 'HVAC', 'Mr. Heater', 'MH250T', 
ARRAY['propane heater 250k', 'large construction heater', 'torpedo heater 250k', 'job site heater large'], 
ARRAY['heater', 'propane', '250k-btu', 'large'], 
'{"output": "250000 BTU", "fuel": "propane", "coverage": "6250 sq ft", "accessories": ["propane hose 25ft", "regulator", "remote thermostat", "safety shutoff"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Portable Heater Electric 10kW', 'Electric heater for indoor use without emissions.', 'equipment', 'site_services', 'HVAC', 'Dimplex', 'EUH10B34T', 
ARRAY['electric heater', '10kw heater', 'indoor heater', 'electric heat 10000 watt'], 
ARRAY['heater', 'electric', '10kw', 'indoor'], 
'{"output": "10kW (34120 BTU)", "power": "240V", "coverage": "1000 sq ft", "emissions": "none - safe for indoor", "accessories": ["power cord 50ft", "thermostat", "fan control"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Industrial Fan 36" High Velocity', 'Large drum fan for air circulation and cooling.', 'equipment', 'site_services', 'Fans', 'Big Ass Fans', 'Yellow Jacket 36', 
ARRAY['drum fan', '36 inch fan', 'industrial fan', 'high velocity fan', 'air mover', 'cooling fan'], 
ARRAY['fan', 'industrial', '36-inch', 'high-velocity'], 
'{"diameter": "36 inches", "airflow": "10500 CFM", "power": "120V", "speeds": "2-speed", "noise": "78 dB", "accessories": ["power cord 25ft", "transport wheels", "tilt adjustment"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- WATER & PLUMBING (Based on Norwesco, PolyJohn catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Water Tank 250 Gallon', 'Portable water storage tank for construction and events.', 'equipment', 'site_services', 'Water Tanks', 'Norwesco', 'WT-250', 
ARRAY['water tank', '250 gallon tank', 'water buffalo', 'water storage', 'water tote'], 
ARRAY['water-tank', 'storage', '250-gallon', 'portable'], 
'{"capacity": "250 gallons", "material": "polyethylene", "dimensions": "60x38x36 inches", "weight_empty": "55 lbs", "weight_full": "2140 lbs", "fittings": "2 inch drain", "accessories": ["transfer pump", "fill hose", "drain hose", "fittings", "cap with vent"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Water Tank 500 Gallon', 'Large portable water tank for job sites.', 'equipment', 'site_services', 'Water Tanks', 'Norwesco', 'WT-500', 
ARRAY['water tank 500', '500 gallon water', 'water buffalo 500', 'large water tank'], 
ARRAY['water-tank', '500-gallon'], 
'{"capacity": "500 gallons", "material": "FDA approved polyethylene", "dimensions": "73x48x48 inches", "accessories": ["pump", "hoses", "fittings", "fill cap", "drain valve"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Portable Restroom Standard', 'Standard portable toilet for construction and events.', 'equipment', 'site_services', 'Sanitation', 'PolyJohn', 'PJN3', 
ARRAY['porta potty', 'portable toilet', 'port-a-john', 'job site toilet', 'construction toilet', 'porta john'], 
ARRAY['restroom', 'toilet', 'portable', 'sanitation', 'porta-potty'], 
'{"type": "standard portable restroom", "capacity": "60 gallon waste tank", "features": "urinal, toilet, vent", "dimensions": "44x44x90 inches", "weight": "190 lbs", "accessories": ["hand sanitizer", "toilet paper", "deodorizer", "tank treatment", "servicing"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Portable Restroom Deluxe', 'Upgraded portable restroom with hand wash station.', 'equipment', 'site_services', 'Sanitation', 'PolyJohn', 'PJN3-DELUXE', 
ARRAY['deluxe porta potty', 'upgraded portable toilet', 'restroom with sink', 'fancy porta john'], 
ARRAY['restroom', 'deluxe', 'portable', 'sink'], 
'{"type": "deluxe with hand wash", "features": "toilet, urinal, sink, mirror, soap", "water_tank": "fresh water for washing", "accessories": ["hand soap", "paper towels", "toilet paper", "air freshener", "weekly service"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Portable Restroom ADA Compliant', 'ADA accessible portable restroom with ramp.', 'equipment', 'site_services', 'Sanitation', 'PolyJohn', 'PJN3-ADA', 
ARRAY['ada porta potty', 'handicap portable toilet', 'accessible restroom', 'wheelchair porta john', 'ada compliant restroom'], 
ARRAY['restroom', 'ada', 'accessible', 'handicap'], 
'{"type": "ADA compliant", "dimensions": "larger interior 60x60 inches", "features": "handrails, spacious interior, ramp access", "accessories": ["ramp", "handrails", "signage", "sanitizer", "weekly service"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- INTERNET & COMMUNICATIONS (Based on Netgear, SpaceX, Ubiquiti)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Portable WiFi Hotspot', 'Mobile 4G/5G internet hotspot device.', 'equipment', 'site_services', 'Internet', 'Netgear', 'MR1100', 
ARRAY['mobile hotspot', 'mifi', 'portable wifi', 'mobile internet', '4g hotspot', '5g hotspot'], 
ARRAY['wifi', 'hotspot', 'mobile', 'internet'], 
'{"speed": "up to 1 Gbps", "connections": "20 devices", "battery": "24 hours", "connectivity": "4G LTE / 5G", "size": "pocket sized", "accessories": ["car charger", "usb cable", "ethernet cable", "external antenna option", "data plan"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'StarLink Portable Kit', 'Satellite internet system for remote locations.', 'equipment', 'site_services', 'Internet', 'SpaceX', 'STARLINK-PRT', 
ARRAY['starlink', 'satellite internet', 'satellite wifi', 'portable internet', 'remote internet', 'space internet'], 
ARRAY['starlink', 'satellite', 'internet', 'wifi', 'portable'], 
'{"speed": "100-200 Mbps download / 20-40 Mbps upload", "latency": "20-40ms", "coverage": "global (check availability)", "power": "120W", "setup": "plug and play", "accessories": ["dish antenna", "wifi router", "power supply", "cables 75ft", "mounting pole", "ethernet adapter", "app for alignment"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Wireless Network Bridge 5GHz', 'Long-range wireless bridge for site networking.', 'equipment', 'site_services', 'Internet', 'Ubiquiti', 'NanoBeam', 
ARRAY['wireless bridge', 'network bridge', 'point to point wifi', 'long range wifi', '5ghz bridge'], 
ARRAY['wireless', 'bridge', 'network', '5ghz'], 
'{"range": "up to 10 miles line of sight", "speed": "450+ Mbps", "frequency": "5GHz", "use": "connecting buildings, extending network", "accessories": ["mounting bracket", "poe injector", "ethernet cable", "alignment tools"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');
