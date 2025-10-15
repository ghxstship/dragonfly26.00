-- =============================================
-- COMMUNICATIONS EQUIPMENT CATALOG
-- Migration: 061
-- Purpose: Add communications equipment (radios, intercoms, paging)
-- Based on: Motorola, Kenwood, BaoFeng, Midland, RCA, Pyle
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, subcategory, manufacturer, model_number, related_names, tags, industry_tags, specifications, created_by) VALUES

-- =============================================
-- TWO-WAY RADIOS - CONSUMER (Motorola, Midland)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Two-Way Radio FRS 2-Pack', 'Consumer FRS two-way radios 2-pack.', 'equipment', 'site_services', 'Communications', 'Two-Way Radios', 'Motorola', 'T600', 
ARRAY['walkie talkie', 'two way radio', 'frs radio', 'handheld radio', 'walkie talkies', 'walky talky'], 
ARRAY['radio', 'walkie-talkie', 'two-way', 'frs', 'communication'], 
ARRAY['events', 'corporate-events', 'construction', 'all-industries'], 
'{"type": "FRS consumer radio", "channels": "22 channels", "range": "up to 35 miles (optimal)", "realistic_range": "1-2 miles typical", "power": "rechargeable battery", "features": "VOX, NOAA weather, flashlight", "license": "no license required", "quantity": "2 radios per pack", "accessories": ["belt clips", "charger", "batteries", "earbuds"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Two-Way Radio FRS 6-Pack', 'Six-pack FRS radios for teams.', 'equipment', 'site_services', 'Communications', 'Two-Way Radios', 'Motorola', 'T600-6PK', 
ARRAY['6 pack radios', 'team radios', 'walkie talkie set', '6 walkie talkies', 'radio set'], 
ARRAY['radio', 'two-way', '6-pack', 'team'], 
ARRAY['events', 'corporate-events', 'construction'], 
'{"type": "FRS radio 6-pack", "channels": "22 channels", "range": "35 miles optimal", "quantity": "6 radios", "accessories": ["6 chargers", "6 belt clips", "carrying case"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Two-Way Radio FRS Long Range', 'Long-range FRS/GMRS radio.', 'equipment', 'site_services', 'Communications', 'Two-Way Radios', 'Midland', 'GXT1000VP4', 
ARRAY['long range walkie talkie', 'gmrs radio', '36 mile radio', 'extended range radio'], 
ARRAY['radio', 'frs', 'gmrs', 'long-range'], 
ARRAY['outdoor-events', 'construction'], 
'{"type": "FRS/GMRS", "channels": "50 channels", "range": "up to 36 miles", "power": "rechargeable + AA backup", "features": "NOAA weather, SOS, flashlight", "accessories": ["charger", "earbuds", "batteries"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- TWO-WAY RADIOS - COMMERCIAL (Motorola, Kenwood)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Two-Way Radio Commercial UHF', 'Professional UHF commercial radio.', 'equipment', 'site_services', 'Communications', 'Two-Way Radios', 'Motorola', 'CP200d', 
ARRAY['commercial radio', 'uhf radio', 'business radio', 'professional radio', 'motorola radio', 'business walkie talkie'], 
ARRAY['radio', 'uhf', 'commercial', 'professional'], 
ARRAY['events', 'corporate-events', 'film-production', 'construction'], 
'{"type": "commercial UHF radio", "channels": "16 channels programmable", "frequency": "UHF 403-470 MHz", "range": "5-10 miles typical", "power": "4-5W", "battery": "Li-ion rechargeable", "durability": "IP54 rated", "features": "programmable buttons, emergency button", "license": "FCC license may be required", "accessories": ["charger", "belt clip", "antenna", "earpiece optional"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Two-Way Radio VHF Long Range', 'Long-range VHF radio for open areas.', 'equipment', 'site_services', 'Communications', 'Two-Way Radios', 'Kenwood', 'TK-3402U16P', 
ARRAY['vhf radio', 'long range radio', 'kenwood radio', 'outdoor radio', 'vhf walkie talkie'], 
ARRAY['radio', 'vhf', 'long-range'], 
ARRAY['construction', 'outdoor-events', 'film-production'], 
'{"type": "VHF commercial radio", "frequency": "VHF 136-174 MHz", "channels": "16", "power": "5W", "range": "10-15 miles open area", "battery": "Li-ion", "accessories": ["charger", "belt clip", "antenna"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Two-Way Radio Digital DMR', 'Digital DMR two-way radio.', 'equipment', 'site_services', 'Communications', 'Two-Way Radios', 'Motorola', 'XPR7550', 
ARRAY['dmr radio', 'digital radio', 'motorola dmr', 'professional digital radio', 'digital walkie talkie'], 
ARRAY['radio', 'dmr', 'digital', 'professional'], 
ARRAY['film-production', 'broadcast', 'professional-events'], 
'{"type": "digital DMR radio", "modes": "analog + digital DMR", "channels": "1000 channels", "power": "5W", "features": "GPS, Bluetooth, text messaging", "display": "full color display", "durability": "IP67", "accessories": ["charger", "antenna", "Bluetooth earpiece"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Two-Way Radio Heavy-Duty Waterproof', 'Rugged waterproof construction radio.', 'equipment', 'site_services', 'Communications', 'Two-Way Radios', 'Kenwood', 'NX-P1302AUK', 
ARRAY['waterproof radio', 'rugged radio', 'construction radio', 'heavy duty radio', 'ip68 radio'], 
ARRAY['radio', 'waterproof', 'rugged', 'heavy-duty'], 
ARRAY['construction', 'industrial', 'outdoor-events'], 
'{"type": "commercial UHF", "durability": "IP68 waterproof, MIL-STD-810", "power": "5W", "channels": "512", "battery": "Li-ion high capacity", "use": "harsh environments", "accessories": ["charger", "antenna", "heavy duty clip"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- RADIO ACCESSORIES (Motorola, Kenwood)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Radio Earpiece Single-Wire', 'Single-wire radio earpiece with PTT.', 'equipment', 'site_services', 'Communications', 'Radio Accessories', 'Motorola', 'PMLN7189', 
ARRAY['earpiece', 'radio earpiece', 'ptt earpiece', 'surveillance earpiece', 'single wire earpiece', 'acoustic tube'], 
ARRAY['earpiece', 'radio', 'ptt', 'accessory'], 
ARRAY['events', 'security', 'all-industries'], 
'{"type": "single-wire surveillance earpiece", "connector": "2-pin Motorola", "ptt": "inline PTT button", "ear": "acoustic tube to ear", "mic": "inline microphone", "cable": "reinforced cable", "use": "discreet communication", "compatible": "Motorola radios"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Radio Earpiece 2-Wire', 'Two-wire security earpiece.', 'equipment', 'site_services', 'Communications', 'Radio Accessories', 'Kenwood', 'KHS-7A', 
ARRAY['2 wire earpiece', 'security earpiece', 'two wire earpiece', 'covert earpiece'], 
ARRAY['earpiece', '2-wire', 'security'], 
ARRAY['security', 'events'], 
'{"type": "2-wire earpiece", "mic": "lapel microphone", "ear": "acoustic tube", "ptt": "separate PTT button", "use": "security, covert ops", "accessories": ["spare acoustic tubes"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Radio Headset Over-Ear Heavy-Duty', 'Heavy-duty over-ear radio headset.', 'equipment', 'site_services', 'Communications', 'Radio Accessories', 'Motorola', 'RMN5058', 
ARRAY['radio headset', 'over ear headset', 'heavy duty headset', 'noise cancelling headset', 'industrial headset'], 
ARRAY['headset', 'radio', 'over-ear', 'heavy-duty'], 
ARRAY['construction', 'industrial', 'loud-environments'], 
'{"type": "over-ear headset", "noise": "noise cancelling", "ptt": "heavy-duty PTT", "boom": "flexible boom mic", "ear_cups": "padded ear cups", "use": "loud environments", "accessories": ["windscreen", "cable"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Radio Speaker Microphone', 'Remote speaker microphone for radio.', 'equipment', 'site_services', 'Communications', 'Radio Accessories', 'Motorola', 'PMMN4013', 
ARRAY['speaker mic', 'radio speaker mic', 'remote speaker', 'shoulder mic', 'lapel mic'], 
ARRAY['speaker-mic', 'radio', 'accessory'], 
ARRAY['events', 'security', 'all-industries'], 
'{"type": "remote speaker microphone", "features": "large speaker, PTT button, mic", "clip": "clothing clip", "cable": "coiled cord", "connector": "radio specific", "use": "hands-free operation"}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Radio Charger 6-Bay Multi-Unit', 'Six-bay multi-unit radio charger.', 'equipment', 'site_services', 'Communications', 'Radio Accessories', 'Motorola', 'WPLN4212', 
ARRAY['6 bay charger', 'multi unit charger', 'gang charger', 'radio charging station', '6 slot charger'], 
ARRAY['charger', 'radio', '6-bay', 'multi-unit'], 
ARRAY['events', 'rental-houses'], 
'{"bays": "6 charging bays", "charge": "charges radio + spare battery", "speed": "rapid charge", "indicators": "LED status per bay", "power": "110V AC", "use": "charging multiple radios", "accessories": ["power cord", "international adapters"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Radio Battery Spare Li-Ion', 'Spare lithium-ion radio battery.', 'consumable', 'site_services', 'Communications', 'Radio Accessories', 'Motorola', 'PMNN4468', 
ARRAY['radio battery', 'spare battery', 'replacement battery', 'li-ion battery', 'walkie talkie battery'], 
ARRAY['battery', 'radio', 'li-ion', 'spare'], 
ARRAY['events', 'all-industries'], 
'{"type": "Li-ion rechargeable", "capacity": "2300 mAh", "voltage": "7.4V", "runtime": "12 hours typical", "compatible": "Motorola CP series", "accessories": ["battery only, charger separate"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- BASE STATIONS & REPEATERS (Motorola)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Radio Base Station UHF', 'UHF radio base station for office.', 'equipment', 'site_services', 'Communications', 'Base Stations', 'Motorola', 'CM300d', 
ARRAY['base station', 'radio base', 'mobile radio', 'desk radio', 'office radio', 'dispatch radio'], 
ARRAY['radio', 'base-station', 'uhf', 'desktop'], 
ARRAY['offices', 'security', 'dispatch'], 
'{"type": "UHF base station mobile radio", "channels": "32", "power": "25-45W", "frequency": "UHF 403-470 MHz", "mounting": "desktop", "mic": "desktop microphone", "features": "scan, priority scan", "accessories": ["power supply", "microphone", "antenna", "mounting bracket"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Radio Repeater UHF 50W', 'UHF repeater for extended range.', 'equipment', 'site_services', 'Communications', 'Repeaters', 'Motorola', 'SLR5700', 
ARRAY['repeater', 'radio repeater', 'uhf repeater', 'range extender', 'signal booster'], 
ARRAY['radio', 'repeater', 'uhf', 'range-extender'], 
ARRAY['large-venues', 'campuses', 'construction'], 
'{"type": "UHF repeater", "power": "50W", "channels": "programmable", "coverage": "extends range 2-3x", "duplexer": "integrated", "mounting": "rack mount or wall", "power_supply": "110V AC or 12V DC", "use": "extending radio coverage", "accessories": ["antennas (2)", "power supply", "cables", "mounting hardware"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- INTERCOMS (RCA, Hosmart)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Intercom System Wired 2-Station', 'Wired intercom system 2-station.', 'equipment', 'site_services', 'Communications', 'Intercom Systems', 'RCA', 'RC-926', 
ARRAY['intercom', 'wired intercom', 'intercom system', 'talk back system', 'communication system', '2 station intercom'], 
ARRAY['intercom', 'wired', '2-station'], 
ARRAY['offices', 'studios', 'security'], 
'{"stations": "2 stations", "type": "wired intercom", "cable": "4-conductor wire", "power": "9V battery or AC adapter", "features": "talk/listen, call button", "mounting": "wall mount", "use": "room to room communication", "accessories": ["mounting hardware", "wire", "power adapter"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Wireless Intercom System', 'Wireless digital intercom system.', 'equipment', 'site_services', 'Communications', 'Intercom Systems', 'Hosmart', '1/2 Mile', 
ARRAY['wireless intercom', 'cordless intercom', 'portable intercom', 'long range intercom'], 
ARRAY['intercom', 'wireless', 'portable'], 
ARRAY['events', 'construction'], 
'{"range": "up to 1/2 mile", "channels": "10 channels", "units": "expandable system", "power": "rechargeable batteries", "features": "hands-free, group call", "accessories": ["chargers", "belt clips"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Video Intercom Doorbell', 'Video intercom door station.', 'equipment', 'site_services', 'Communications', 'Intercom Systems', 'Ring', 'Video Doorbell', 
ARRAY['video doorbell', 'doorbell camera', 'video intercom', 'door camera', 'smart doorbell'], 
ARRAY['intercom', 'video', 'doorbell', 'camera'], 
ARRAY['security', 'offices'], 
'{"type": "video doorbell intercom", "camera": "1080p HD video", "features": "two-way audio, motion detection", "power": "battery or wired", "connectivity": "WiFi", "app": "smartphone app", "accessories": ["mounting bracket", "chime", "battery"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- PUBLIC ADDRESS (Pyle, TOA)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Megaphone Handheld 25W', 'Handheld megaphone with siren.', 'equipment', 'site_services', 'Communications', 'Public Address', 'Pyle', 'PMP52BT', 
ARRAY['megaphone', 'bullhorn', 'loud speaker', 'portable pa', 'handheld speaker', 'bull horn'], 
ARRAY['megaphone', 'pa', 'public-address', 'handheld'], 
ARRAY['events', 'security', 'crowd-control'], 
'{"power": "25W", "range": "800 yards", "features": "siren, adjustable volume, record/playback", "battery": "rechargeable + 8D batteries", "handle": "pistol grip handle", "strap": "shoulder strap", "use": "crowd control, announcements", "accessories": ["battery", "charger", "strap"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Megaphone Shoulder Mount 50W', 'Large shoulder-mount megaphone.', 'equipment', 'site_services', 'Communications', 'Public Address', 'Pyle', 'PMP59IR', 
ARRAY['50w megaphone', 'large megaphone', 'shoulder megaphone', 'powerful megaphone'], 
ARRAY['megaphone', '50w', 'shoulder-mount'], 
ARRAY['large-events', 'protests', 'emergencies'], 
'{"power": "50W", "range": "1 mile", "features": "siren, USB, SD card, recording", "mount": "shoulder strap", "battery": "rechargeable", "accessories": ["strap", "battery", "charger"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- PAGING & NOTIFICATION (Retekess)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Paging System Wireless', 'Wireless paging notification system.', 'equipment', 'site_services', 'Communications', 'Paging Systems', 'Retekess', 'TD158', 
ARRAY['pager system', 'paging system', 'wireless pager', 'notification system', 'restaurant pager', 'guest pager'], 
ARRAY['pager', 'paging', 'wireless', 'notification'], 
ARRAY['hospitality', 'restaurants', 'clinics'], 
'{"pagers": "20 pagers included", "range": "1000 ft", "modes": "vibrate, beep, flash", "rechargeable": true, "transmitter": "1 transmitter keypad", "use": "customer notification, staff paging", "accessories": ["charging base", "transmitter", "20 pagers"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Wireless Calling System Restaurant', 'Restaurant guest calling system.', 'equipment', 'site_services', 'Communications', 'Paging Systems', 'Retekess', 'T111', 
ARRAY['calling system', 'table buzzer', 'restaurant buzzer', 'guest buzzer', 'table pager'], 
ARRAY['calling', 'restaurant', 'buzzer', 'guest'], 
ARRAY['hospitality', 'restaurants'], 
'{"buzzers": "10 buzzers", "buttons": "call buttons for tables", "range": "500 ft", "power": "rechargeable buzzers", "use": "table service notification", "accessories": ["call buttons", "buzzers", "charging base"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');
