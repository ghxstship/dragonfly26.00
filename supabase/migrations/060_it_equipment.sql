-- =============================================
-- IT EQUIPMENT CATALOG
-- Migration: 060
-- Purpose: Add IT infrastructure (networking, power, computers)
-- Based on: Cisco, Ubiquiti, TP-Link, APC, CyberPower, Dell, HP
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, subcategory, manufacturer, model_number, related_names, tags, industry_tags, specifications, created_by) VALUES

-- =============================================
-- WIRELESS NETWORKING (Ubiquiti, Cisco, TP-Link)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Wireless Access Point Dual-Band', 'Professional dual-band wireless access point.', 'equipment', 'site_services', 'IT Equipment', 'Wireless Networking', 'Ubiquiti', 'UAP-AC-PRO', 
ARRAY['wifi access point', 'wap', 'wireless ap', 'wifi hotspot', 'access point', 'ubiquiti ap', 'wireless router'], 
ARRAY['it', 'networking', 'wifi', 'wireless', 'access-point'], 
ARRAY['corporate-events', 'conferences', 'film-production', 'all-industries'], 
'{"type": "ceiling mount WAP", "bands": "dual-band 2.4/5 GHz", "speed": "1300 Mbps total (450+867)", "range": "400 ft radius", "clients": "250+ concurrent", "power": "802.3af PoE", "mounting": "ceiling or wall", "managed": "UniFi controller", "outdoor_rating": "indoor", "accessories": ["PoE injector", "mounting bracket", "ethernet cable"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Wireless Access Point Outdoor', 'Weatherproof outdoor wireless access point.', 'equipment', 'site_services', 'IT Equipment', 'Wireless Networking', 'Ubiquiti', 'UAP-AC-M', 
ARRAY['outdoor access point', 'outdoor wifi', 'weatherproof ap', 'mesh ap', 'outdoor wap'], 
ARRAY['it', 'wifi', 'outdoor', 'weatherproof'], 
ARRAY['events', 'outdoor-events', 'construction', 'film-production'], 
'{"type": "outdoor mesh AP", "bands": "dual-band", "speed": "1200 Mbps", "range": "600 ft", "rating": "IP67 weatherproof", "power": "PoE", "mounting": "pole or wall", "accessories": ["mounting kit", "PoE injector"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Wireless Mesh System 3-Pack', 'Whole-venue mesh WiFi system.', 'equipment', 'site_services', 'IT Equipment', 'Wireless Networking', 'TP-Link', 'Deco X60', 
ARRAY['mesh wifi', 'mesh system', 'whole home wifi', 'mesh network', 'wifi system'], 
ARRAY['it', 'wifi', 'mesh', 'system'], 
ARRAY['corporate-events', 'hospitality'], 
'{"nodes": "3 mesh nodes", "coverage": "up to 7000 sq ft", "speed": "AX3000 dual-band", "setup": "app-based setup", "features": "roaming, parental controls", "accessories": ["3 nodes", "power adapters", "ethernet cables"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- NETWORK SWITCHES (Ubiquiti, Cisco)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Network Switch 8-Port PoE', 'Managed 8-port gigabit PoE switch.', 'equipment', 'site_services', 'IT Equipment', 'Network Switches', 'Ubiquiti', 'US-8-150W', 
ARRAY['network switch', 'poe switch', '8 port switch', 'ethernet switch', 'gigabit switch', 'managed switch'], 
ARRAY['it', 'networking', 'switch', 'poe', '8-port'], 
ARRAY['corporate-events', 'conferences', 'all-industries'], 
'{"ports": "8 gigabit ports", "poe": "802.3af/at PoE+", "poe_budget": "150W total", "speed": "1 Gbps per port", "uplink": "2 SFP uplink ports", "managed": "UniFi managed", "mounting": "rack mount or desktop", "accessories": ["rack ears", "power cable"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Network Switch 24-Port PoE', 'Managed 24-port gigabit PoE switch.', 'equipment', 'site_services', 'IT Equipment', 'Network Switches', 'Cisco', 'SG250-26HP', 
ARRAY['24 port switch', 'large poe switch', 'enterprise switch', '24 port gigabit'], 
ARRAY['it', 'switch', '24-port', 'poe'], 
ARRAY['corporate-events', 'large-venues'], 
'{"ports": "24 gigabit + 2 combo SFP", "poe": "PoE+ 195W budget", "managed": true, "mounting": "1U rack mount", "accessories": ["rack mount kit", "power cable"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Network Switch 5-Port Unmanaged', 'Desktop 5-port unmanaged switch.', 'equipment', 'site_services', 'IT Equipment', 'Network Switches', 'TP-Link', 'TL-SG105', 
ARRAY['5 port switch', 'small switch', 'desktop switch', 'unmanaged switch'], 
ARRAY['it', 'switch', '5-port', 'desktop'], 
ARRAY['offices', 'small-venues'], 
'{"ports": "5 gigabit ports", "type": "unmanaged plug-and-play", "speed": "1 Gbps", "power": "external adapter", "size": "desktop compact", "accessories": ["power adapter"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- ROUTERS & FIREWALLS (Ubiquiti)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Router Dual-WAN Business', 'Business router with dual-WAN failover.', 'equipment', 'site_services', 'IT Equipment', 'Routers', 'Ubiquiti', 'ER-X', 
ARRAY['router', 'network router', 'gateway', 'edge router', 'internet router', 'business router'], 
ARRAY['it', 'router', 'networking', 'gateway'], 
ARRAY['corporate-events', 'offices', 'all-industries'], 
'{"ports": "5 gigabit ports", "wan": "dual-WAN support", "throughput": "1 Gbps", "features": "VLAN, firewall, VPN", "power": "passive PoE or adapter", "mounting": "desktop", "accessories": ["power adapter", "ethernet cables"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Firewall Security Appliance', 'Network security firewall appliance.', 'equipment', 'site_services', 'IT Equipment', 'Firewalls', 'Ubiquiti', 'USG-PRO-4', 
ARRAY['firewall', 'security gateway', 'network firewall', 'usg', 'security appliance'], 
ARRAY['it', 'firewall', 'security', 'gateway'], 
ARRAY['corporate-events', 'secure-environments'], 
'{"wan_ports": "2", "lan_ports": "2", "throughput": "1 Gbps", "features": "DPI, IPS, firewall, VPN", "mounting": "rack mount 1U", "accessories": ["rack kit", "power cable"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- UPS & POWER (APC, CyberPower, Tripp Lite)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'UPS 1500VA Tower', 'Uninterruptible power supply 1500VA.', 'equipment', 'site_services', 'IT Equipment', 'UPS Systems', 'APC', 'BR1500MS', 
ARRAY['ups', 'battery backup', 'uninterruptible power supply', 'power backup', '1500va ups', 'backup battery'], 
ARRAY['it', 'ups', 'battery-backup', '1500va'], 
ARRAY['corporate-events', 'offices', 'all-industries'], 
'{"capacity": "1500VA / 900W", "battery": "12V sealed lead acid", "runtime": "5-15 minutes typical load", "outlets": "10 outlets (5 battery+surge, 5 surge only)", "ports": "USB, serial", "display": "LCD display", "form": "tower", "accessories": ["USB cable", "power cord", "software CD"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'UPS 3000VA Rackmount', 'Rackmount UPS 3000VA for servers.', 'equipment', 'site_services', 'IT Equipment', 'UPS Systems', 'APC', 'SMT3000RM2U', 
ARRAY['rackmount ups', '3000va ups', 'server ups', 'rack ups', '2u ups'], 
ARRAY['it', 'ups', 'rackmount', '3000va'], 
ARRAY['corporate-events', 'data-centers'], 
'{"capacity": "3000VA / 2700W", "form": "2U rackmount", "outlets": "8 outlets", "runtime": "extended runtime capable", "network": "network management card optional", "mounting": "rack mount", "accessories": ["rack kit", "network card optional", "battery pack"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'PDU Rackmount 8-Outlet', 'Rackmount power distribution unit.', 'equipment', 'site_services', 'IT Equipment', 'PDUs', 'Tripp Lite', 'PDUMH15', 
ARRAY['pdu', 'rack pdu', 'power distribution unit', 'power strip rack', 'rack power'], 
ARRAY['it', 'pdu', 'rackmount', 'power'], 
ARRAY['corporate-events', 'data-centers'], 
'{"outlets": "8 x NEMA 5-15/20R", "input": "NEMA 5-15P", "amperage": "15A 120V", "mounting": "horizontal 1U", "cord": "15 ft", "accessories": ["mounting hardware"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- MONITORS (Dell, HP, Samsung)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Monitor 24" LED Full HD', 'Professional 24-inch LED monitor.', 'equipment', 'event_rentals', 'IT Equipment', 'Monitors', 'Dell', 'P2422H', 
ARRAY['computer monitor', '24 inch monitor', 'led monitor', 'display', 'screen', '24 display'], 
ARRAY['monitor', 'display', '24-inch', 'led'], 
ARRAY['corporate-events', 'offices', 'registration'], 
'{"size": "24 inches diagonal", "resolution": "1920x1080 Full HD", "panel": "IPS", "brightness": "250 nits", "ports": "HDMI, DisplayPort, VGA, USB", "stand": "height adjustable", "vesa": "100x100mm", "accessories": ["power cable", "HDMI cable", "stand"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Monitor 27" LED QHD', 'Large 27-inch QHD monitor.', 'equipment', 'event_rentals', 'IT Equipment', 'Monitors', 'Dell', 'U2720Q', 
ARRAY['27 inch monitor', 'large monitor', 'qhd monitor', '4k monitor', '27 display'], 
ARRAY['monitor', '27-inch', 'qhd'], 
ARRAY['corporate-events', 'design', 'video'], 
'{"size": "27 inches", "resolution": "2560x1440 QHD", "panel": "IPS", "color": "99% sRGB", "ports": "HDMI, DisplayPort, USB-C", "accessories": ["cables", "stand"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- COMPUTERS (HP, Dell, Lenovo)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Laptop Business i5 8GB', 'Business laptop with i5 processor.', 'equipment', 'event_rentals', 'IT Equipment', 'Computers', 'HP', 'ProBook 450', 
ARRAY['laptop', 'notebook', 'computer', 'business laptop', 'portable computer', 'i5 laptop'], 
ARRAY['laptop', 'computer', 'portable', 'i5'], 
ARRAY['corporate-events', 'offices', 'registration'], 
'{"processor": "Intel Core i5", "ram": "8GB DDR4", "storage": "256GB SSD", "screen": "15.6 inch Full HD", "os": "Windows 10 Pro", "ports": "USB 3.0, HDMI, ethernet", "battery": "8+ hours", "accessories": ["power adapter", "carrying case", "mouse"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Laptop Business i7 16GB', 'High-performance business laptop.', 'equipment', 'event_rentals', 'IT Equipment', 'Computers', 'Dell', 'Latitude 5520', 
ARRAY['i7 laptop', 'high performance laptop', 'business laptop i7', 'powerful laptop'], 
ARRAY['laptop', 'i7', 'high-performance'], 
ARRAY['corporate-events', 'video-editing'], 
'{"processor": "Intel Core i7", "ram": "16GB DDR4", "storage": "512GB NVMe SSD", "screen": "15.6 inch Full HD", "graphics": "integrated", "accessories": ["power adapter", "docking station optional", "case"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Desktop Computer Workstation', 'Desktop workstation computer.', 'equipment', 'event_rentals', 'IT Equipment', 'Computers', 'Dell', 'OptiPlex 7090', 
ARRAY['desktop computer', 'desktop pc', 'workstation', 'desktop tower', 'computer tower', 'pc'], 
ARRAY['desktop', 'computer', 'workstation', 'tower'], 
ARRAY['corporate-events', 'offices'], 
'{"processor": "Intel Core i5/i7", "ram": "8-16GB", "storage": "256-512GB SSD", "form": "tower or small form factor", "os": "Windows 10 Pro", "ports": "USB 3.0, DisplayPort, ethernet", "accessories": ["keyboard", "mouse", "power cable"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- PERIPHERALS & ACCESSORIES
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Keyboard Wireless', 'Wireless keyboard and mouse combo.', 'equipment', 'event_rentals', 'IT Equipment', 'Peripherals', 'Logitech', 'MK270', 
ARRAY['keyboard', 'wireless keyboard', 'keyboard mouse combo', 'keyboard and mouse', 'computer keyboard'], 
ARRAY['keyboard', 'wireless', 'peripheral'], 
ARRAY['offices', 'corporate-events'], 
'{"type": "wireless keyboard + mouse combo", "connection": "USB receiver", "battery": "AA batteries", "features": "spill-resistant", "accessories": ["USB receiver", "batteries"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Mouse Wireless Optical', 'Wireless optical mouse.', 'equipment', 'event_rentals', 'IT Equipment', 'Peripherals', 'Logitech', 'M510', 
ARRAY['mouse', 'wireless mouse', 'computer mouse', 'optical mouse'], 
ARRAY['mouse', 'wireless', 'peripheral'], 
ARRAY['offices', 'corporate-events'], 
'{"type": "wireless optical mouse", "connection": "USB receiver", "battery": "2 AA (1 year)", "buttons": "5 buttons", "scrollwheel": "yes", "accessories": ["USB receiver", "battery"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Webcam HD 1080p', 'HD webcam for video conferencing.', 'equipment', 'event_rentals', 'IT Equipment', 'Peripherals', 'Logitech', 'C920', 
ARRAY['webcam', 'web camera', 'video camera', 'conference camera', '1080p webcam'], 
ARRAY['webcam', 'camera', '1080p', 'video'], 
ARRAY['corporate-events', 'video-conferencing'], 
'{"resolution": "1080p Full HD", "fps": "30 fps", "mic": "stereo microphones", "mount": "universal clip", "connection": "USB", "accessories": ["USB cable", "mount clip", "privacy cover"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'USB Hub 7-Port', 'Powered USB hub with 7 ports.', 'equipment', 'event_rentals', 'IT Equipment', 'Peripherals', 'Anker', 'AH231', 
ARRAY['usb hub', '7 port hub', 'usb splitter', 'usb expander', 'powered hub'], 
ARRAY['usb-hub', '7-port', 'peripheral'], 
ARRAY['offices', 'registration'], 
'{"ports": "7 USB 3.0 ports", "power": "powered with adapter", "speed": "5 Gbps USB 3.0", "leds": "individual LED per port", "accessories": ["power adapter", "USB cable"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');
