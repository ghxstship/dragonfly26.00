-- =============================================
-- COMPREHENSIVE BACKLINE EQUIPMENT CATALOG
-- Migration: 049
-- Based on: Sweetwater, Guitar Center, Pearl, Roland, Fender, Marshall, Ampeg, Pioneer, Technics, Shure, Sennheiser
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, related_names, tags, specifications, created_by) VALUES

-- =============================================
-- DRUM KITS (Based on Pearl, Roland, Yamaha catalogs)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Drum Kit 5-Piece Acoustic', 'Complete 5-piece acoustic drum kit with hardware.', 'equipment', 'backline', 'Drums', 'Pearl', 'Export EXX725', 
ARRAY['drum kit', 'drum set', 'acoustic drums', '5 piece drums', 'shell pack', 'drumset'], 
ARRAY['drums', 'drum-kit', 'acoustic', '5-piece'], 
'{"pieces": "22 inch bass drum, 14 inch snare, 10 + 12 inch toms, 16 inch floor tom", "hardware": "hi-hat stand, snare stand, cymbal stands, bass pedal", "finish": "various colors", "accessories": ["cymbals (hi-hats 14 inch, crash 16 inch, ride 20 inch)", "drum throne", "sticks", "tuning key", "soft cases", "drum rug"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Drum Kit 7-Piece Acoustic', 'Professional 7-piece acoustic drum kit.', 'equipment', 'backline', 'Drums', 'Pearl', 'Session Studio Select', 
ARRAY['7 piece drums', 'large drum kit', 'professional drums', 'double bass drums'], 
ARRAY['drums', '7-piece', 'professional'], 
'{"pieces": "22 inch bass, 14 inch snare, 8 + 10 + 12 inch toms, 14 + 16 inch floor toms", "hardware": "complete double-braced hardware", "accessories": ["extended cymbal set", "throne", "cases", "rug"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Electronic Drum Kit', 'Electronic drum set with mesh heads and module.', 'equipment', 'backline', 'Drums', 'Roland', 'TD-17KVX', 
ARRAY['electronic drums', 'e-drums', 'digital drums', 'electric drum kit', 'mesh drums', 'roland drums'], 
ARRAY['drums', 'electronic', 'digital', 'mesh'], 
'{"type": "electronic", "pads": "mesh head pads", "module": "TD-17 sound module", "sounds": "310+ sounds", "kits": "50 preset kits", "outputs": "stereo out, phones, USB", "accessories": ["all cables", "drum throne", "sticks", "headphones", "monitor amp option"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Cajon Drum Box', 'Portable cajon box drum for acoustic performances.', 'equipment', 'backline', 'Drums', 'Meinl', 'HCAJ1AWA', 
ARRAY['cajon', 'box drum', 'percussion cajon', 'hand drum', 'acoustic percussion'], 
ARRAY['cajon', 'percussion', 'portable'], 
'{"type": "stringed cajon", "size": "19.75 x 11.75 x 11.75 inches", "material": "hardwood", "sound": "bass and snare tones", "portable": true, "accessories": ["bag", "seat cushion"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- GUITAR AMPLIFIERS (Based on Fender, Marshall, Mesa, Vox)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Guitar Amp Combo 15W Practice', 'Small practice guitar amplifier.', 'equipment', 'backline', 'Amplifiers', 'Fender', 'Frontman 15R', 
ARRAY['practice amp', '15 watt amp', 'small guitar amp', 'bedroom amp', 'combo amp'], 
ARRAY['guitar-amp', 'combo', '15w', 'practice'], 
'{"power": "15W", "speaker": "8 inch", "channels": "2 (clean + drive)", "effects": "reverb", "inputs": "1/4 inch + aux in", "headphone_out": true, "accessories": ["power cable", "footswitch optional"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Guitar Amp Combo 40W', 'Medium powered combo amp for rehearsals.', 'equipment', 'backline', 'Amplifiers', 'Fender', 'Champion 40', 
ARRAY['40 watt amp', 'combo amp 40w', 'rehearsal amp', 'practice combo'], 
ARRAY['guitar-amp', 'combo', '40w'], 
'{"power": "40W", "speaker": "12 inch", "channels": "2", "effects": "multiple", "accessories": ["footswitch", "cover", "cables"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Guitar Amp Fender Twin Reverb', 'Classic Fender 85W tube amplifier.', 'equipment', 'backline', 'Amplifiers', 'Fender', '68 Custom Twin Reverb', 
ARRAY['twin reverb', 'fender twin', 'tube amp', 'fender amp', 'classic amp', '85 watt fender'], 
ARRAY['guitar-amp', 'fender', 'tube', 'twin-reverb', '85w'], 
'{"power": "85W", "type": "tube amplifier", "speakers": "2x12 inch", "channels": "2 (normal + vibrato)", "effects": "reverb, vibrato", "tubes": "4x6L6, 5x12AX7, 2x12AT7", "weight": "65 lbs", "accessories": ["footswitch", "amp cover", "instrument cables"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Guitar Amp Marshall JCM800 Head', 'Legendary Marshall JCM800 tube head.', 'equipment', 'backline', 'Amplifiers', 'Marshall', 'JCM800 2203', 
ARRAY['marshall amp', 'jcm800', 'marshall head', 'tube head', 'british amp', 'rock amp', '100w marshall'], 
ARRAY['guitar-amp', 'marshall', 'head', 'tube', 'jcm800'], 
'{"power": "100W", "type": "tube head", "channels": "2", "tubes": "ECC83, EL34", "cabinet": "sold separately", "weight": "50 lbs", "accessories": ["head cover", "speaker cable", "footswitch", "4x12 cabinet recommended"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Guitar Amp Cabinet Marshall 4x12', 'Marshall 4x12 speaker cabinet for half stacks.', 'equipment', 'backline', 'Amplifiers', 'Marshall', '1960A', 
ARRAY['marshall cabinet', '4x12 cab', 'speaker cabinet', 'guitar cabinet', 'half stack cab'], 
ARRAY['cabinet', '4x12', 'marshall', 'speaker'], 
'{"speakers": "4x12 inch Celestion G12T-75", "power_handling": "300W", "impedance": "16 ohm mono or 4 ohm stereo", "weight": "95 lbs", "angled": "straight front", "accessories": ["cab cover", "speaker cables"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Guitar Amp Mesa Boogie Dual Rectifier', 'High-gain Mesa Boogie amp head.', 'equipment', 'backline', 'Amplifiers', 'Mesa Boogie', 'Dual Rectifier', 
ARRAY['mesa boogie', 'dual rectifier', 'high gain amp', 'mesa amp', 'metal amp'], 
ARRAY['guitar-amp', 'mesa-boogie', 'head', 'high-gain'], 
'{"power": "100W", "channels": "3", "tubes": "tube", "use": "high gain rock/metal", "accessories": ["footswitch", "cover", "speaker cable"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- BASS AMPLIFIERS (Based on Ampeg, Markbass, Gallien-Krueger)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Bass Amp Combo 100W', 'Portable 100W bass combo amp.', 'equipment', 'backline', 'Amplifiers', 'Fender', 'Rumble 100', 
ARRAY['bass combo', '100w bass amp', 'bass amplifier combo', 'practice bass amp'], 
ARRAY['bass-amp', 'combo', '100w'], 
'{"power": "100W", "speaker": "12 inch", "channels": "1", "eq": "3-band EQ", "effects": "overdrive", "weight": "35 lbs", "accessories": ["cover", "instrument cable"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Bass Amp Ampeg SVT Classic Head', 'Legendary Ampeg SVT all-tube bass head.', 'equipment', 'backline', 'Amplifiers', 'Ampeg', 'SVT-CL', 
ARRAY['ampeg svt', 'svt bass amp', 'ampeg head', 'tube bass amp', 'bass head', '300w bass'], 
ARRAY['bass-amp', 'ampeg', 'svt', 'head', 'tube'], 
'{"power": "300W", "type": "all-tube", "tubes": "6x6550, 5x12AX7, 2x12AU7", "channels": "1", "eq": "ultra hi/lo + 3-band", "weight": "86 lbs", "cabinet": "8x10 recommended", "accessories": ["head cover", "speaker cable", "footswitch"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Bass Cabinet Ampeg 8x10', 'Classic Ampeg 8x10 bass cabinet.', 'equipment', 'backline', 'Amplifiers', 'Ampeg', 'SVT-810E', 
ARRAY['ampeg 8x10', 'bass cabinet', '8x10 cab', 'fridge cabinet', 'ampeg cab'], 
ARRAY['bass-cabinet', '8x10', 'ampeg'], 
'{"speakers": "8x10 inch", "power_handling": "800W", "impedance": "4 ohm", "weight": "165 lbs", "sealed": "sealed back design", "accessories": ["cab cover", "speaker cable", "casters"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Bass Amp Combo 450W', 'Lightweight powerful bass combo.', 'equipment', 'backline', 'Amplifiers', 'Markbass', 'CMD 121H', 
ARRAY['450w bass combo', 'markbass amp', 'portable bass amp', 'lightweight bass amp'], 
ARRAY['bass-amp', 'combo', '450w', 'lightweight'], 
'{"power": "450W", "speaker": "12 inch + horn", "weight": "37 lbs", "channels": "1", "eq": "4-band", "accessories": ["cover", "instrument cable"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- KEYBOARD AMPLIFIERS (Based on Roland, Behringer)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Keyboard Amp 100W', 'Stereo keyboard amplifier 100W.', 'equipment', 'backline', 'Amplifiers', 'Roland', 'KC-200', 
ARRAY['keyboard amp', 'keys amp', 'keyboard speaker', 'kb amp', '100w keyboard'], 
ARRAY['keyboard-amp', 'keys', '100w'], 
'{"power": "100W (50W x 2)", "speakers": "12 inch + tweeter stereo", "channels": "4", "inputs": "XLR + 1/4 inch", "effects": "chorus", "accessories": ["stand", "cables", "cover"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Keyboard Amp 200W Stereo', 'Professional 200W stereo keyboard amp.', 'equipment', 'backline', 'Amplifiers', 'Roland', 'KC-600', 
ARRAY['200w keyboard amp', 'stereo keyboard amp', 'professional keys amp'], 
ARRAY['keyboard-amp', '200w', 'stereo'], 
'{"power": "200W (100W x 2)", "speakers": "4-channel", "inputs": "multiple", "accessories": ["stand", "cables", "cover"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- DJ EQUIPMENT (Based on Pioneer, Technics, Numark)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'DJ Controller Entry Level', 'Compact DJ controller for beginners.', 'equipment', 'backline', 'DJ Equipment', 'Pioneer', 'DDJ-400', 
ARRAY['dj controller', 'beginner dj controller', 'dj deck', 'mixing controller', 'dj board'], 
ARRAY['dj', 'controller', 'entry-level'], 
'{"channels": "2-channel", "jog_wheels": "touch-sensitive", "software": "Rekordbox DJ included", "size": "compact portable", "outputs": "master + headphone", "accessories": ["usb cable", "software license", "laptop stand option", "case", "headphones"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'DJ Controller Professional', 'Professional 4-channel DJ controller.', 'equipment', 'backline', 'DJ Equipment', 'Pioneer', 'DDJ-1000', 
ARRAY['professional dj controller', '4 channel controller', 'club dj controller', 'pro dj deck'], 
ARRAY['dj', 'controller', 'professional', '4-channel'], 
'{"channels": "4-channel", "jog_wheels": "large touch-sensitive", "software": "Rekordbox DJ", "display": "color LCD screens", "outputs": "master, booth, 4 channels", "effects": "built-in", "accessories": ["usb cable", "laptop stand", "flight case", "headphones", "booth monitor"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'DJ Mixer 2-Channel', 'Professional 2-channel DJ mixer.', 'equipment', 'backline', 'DJ Equipment', 'Pioneer', 'DJM-450', 
ARRAY['dj mixer', '2 channel mixer', 'dj console', 'mixing desk', 'battle mixer'], 
ARRAY['dj', 'mixer', '2-channel'], 
'{"channels": "2-channel", "effects": "beat effects", "inputs": "phono/line switchable", "outputs": "master, booth, rec", "accessories": ["power cable", "rca cables", "adapters", "booth monitor"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'DJ Mixer 4-Channel', 'Professional 4-channel club mixer.', 'equipment', 'backline', 'DJ Equipment', 'Pioneer', 'DJM-900NXS2', 
ARRAY['4 channel mixer', 'club mixer', 'professional dj mixer', 'nexus mixer'], 
ARRAY['dj', 'mixer', '4-channel', 'professional'], 
'{"channels": "4-channel", "effects": "multiple beat + sound color", "display": "color LCD", "usb": "USB recording", "connectivity": "Pro DJ Link", "accessories": ["power cable", "booth monitor", "flight case available"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Turntable Direct Drive', 'Professional DJ turntable.', 'equipment', 'backline', 'DJ Equipment', 'Technics', 'SL-1200MK7', 
ARRAY['turntable', 'dj turntable', 'record player', 'decks', 'technics', 'vinyl player', '1200'], 
ARRAY['turntable', 'dj', 'vinyl', 'direct-drive'], 
'{"type": "direct drive", "speeds": "33/45/78 RPM", "pitch": "+/- 8% or 16%", "motor": "high torque", "start_time": "0.7 seconds", "platter": "aluminum die cast", "accessories": ["slipmats", "headshell", "stylus/needle", "cartridge", "rca cables", "flight case"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Turntable Pair with Mixer', 'Complete DJ turntable setup with mixer.', 'equipment', 'backline', 'DJ Equipment', 'Technics + Pioneer', 'SETUP-TT2', 
ARRAY['turntable setup', 'dj setup', 'turntables with mixer', 'vinyl dj setup', 'complete dj kit'], 
ARRAY['turntable', 'dj', 'complete-setup'], 
'{"includes": "2x Technics SL-1200MK7 + Pioneer DJM-450 mixer", "cables": "all cables included", "accessories": ["2x slipmats", "needles", "headshell", "cartridges", "mixer", "all cables", "headphones", "cases"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- MICROPHONES - WIRED (Based on Shure, Sennheiser, Audio-Technica)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Microphone Vocal Dynamic', 'Standard vocal dynamic microphone.', 'equipment', 'backline', 'Microphones', 'Shure', 'SM58', 
ARRAY['sm58', 'vocal mic', 'dynamic microphone', 'stage mic', 'singing mic', 'handheld mic'], 
ARRAY['microphone', 'vocal', 'dynamic', 'wired', 'sm58'], 
'{"type": "dynamic", "pattern": "cardioid", "use": "vocals", "frequency": "50-15000 Hz", "impedance": "300 ohms", "connector": "XLR", "legendary": "industry standard", "accessories": ["mic clip", "stand adapter", "windscreen", "xlr cable 25ft", "mic stand"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Microphone Instrument Dynamic', 'Dynamic microphone for instruments.', 'equipment', 'backline', 'Microphones', 'Shure', 'SM57', 
ARRAY['sm57', 'instrument mic', 'snare mic', 'guitar amp mic', 'dynamic mic'], 
ARRAY['microphone', 'instrument', 'dynamic', 'sm57'], 
'{"type": "dynamic", "pattern": "cardioid", "use": "instruments, snare, guitar amps", "frequency": "40-15000 Hz", "accessories": ["mic clip", "windscreen", "xlr cable", "stand"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Microphone Kit Wired 3-Pack', 'Three-piece vocal microphone kit.', 'equipment', 'backline', 'Microphones', 'Shure', 'SM58-KIT', 
ARRAY['microphone kit', 'mic kit', '3 mic kit', 'vocal mic set', 'microphone set'], 
ARRAY['microphone', 'kit', 'vocal', 'wired'], 
'{"quantity": "3 mics", "type": "SM58 dynamic mics", "includes": "3x SM58, 3x stands, 3x cables", "accessories": ["3x mic clips", "3x cables 25ft", "3x boom stands", "3x windscreens", "carrying case"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Microphone Drum Kit 7-Piece', 'Seven-piece drum microphone kit.', 'equipment', 'backline', 'Microphones', 'Shure', 'PGADRUMKIT7', 
ARRAY['drum mic kit', 'drum microphones', '7 piece drum mics', 'drum mic set'], 
ARRAY['microphone', 'drum-kit', 'instrument'], 
'{"quantity": "7 mics", "includes": "kick, snare, 3x toms, 2x overheads", "types": "dynamic + condenser", "accessories": ["mic clips", "drum rim mounts", "cables", "case"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

-- =============================================
-- MICROPHONES - WIRELESS (Based on Shure, Sennheiser)
-- =============================================

('00000000-0000-0000-0000-000000000001', 'Wireless Microphone System Single Handheld', 'Single channel wireless handheld system.', 'equipment', 'backline', 'Microphones', 'Shure', 'BLX24/PG58', 
ARRAY['wireless mic', 'wireless microphone', 'uhf wireless', 'handheld wireless', 'cordless mic'], 
ARRAY['wireless', 'microphone', 'handheld', 'uhf'], 
'{"channels": "1", "type": "handheld wireless", "range": "300 ft", "frequency": "UHF", "battery": "AA x2 (up to 14 hours)", "receiver": "single channel", "accessories": ["receiver", "handheld transmitter", "antennas", "power supply", "batteries", "xlr cable"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Wireless Microphone System Dual Handheld', 'Dual channel wireless handheld system.', 'equipment', 'backline', 'Microphones', 'Shure', 'BLX288/PG58', 
ARRAY['dual wireless mic', '2 channel wireless', 'dual handheld wireless', 'two wireless mics'], 
ARRAY['wireless', 'microphone', 'dual', 'handheld'], 
'{"channels": "2", "type": "dual handheld", "range": "300 ft", "frequency": "UHF", "battery": "AA batteries", "accessories": ["dual receiver", "2x handheld transmitters", "antennas", "rack mount kit", "power supply", "batteries"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Wireless Lavalier Mic System', 'Wireless lavalier/bodypack system.', 'equipment', 'backline', 'Microphones', 'Sennheiser', 'EW 112P G4', 
ARRAY['wireless lav', 'lavalier mic', 'bodypack wireless', 'lapel mic wireless', 'presentation mic'], 
ARRAY['wireless', 'microphone', 'lavalier', 'bodypack'], 
'{"channels": "1", "type": "bodypack with lavalier", "range": "330 ft", "battery": "AA batteries", "use": "presentations, theater, video", "accessories": ["receiver", "bodypack transmitter", "lavalier mic", "belt clip", "power supply", "batteries"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001'),

('00000000-0000-0000-0000-000000000001', 'Wireless Headset Mic System', 'Wireless headset microphone system.', 'equipment', 'backline', 'Microphones', 'Shure', 'BLX14/SM31', 
ARRAY['wireless headset', 'headset mic', 'fitness mic', 'presenter headset', 'hands free mic'], 
ARRAY['wireless', 'microphone', 'headset', 'hands-free'], 
'{"channels": "1", "type": "bodypack with headset", "range": "300 ft", "headset": "SM31FH fitness headset", "use": "fitness, presentations, theater", "accessories": ["receiver", "bodypack", "headset mic", "power supply", "batteries"]}'::jsonb, 
'00000000-0000-0000-0000-000000000001');
