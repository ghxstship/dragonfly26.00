-- =============================================
-- SEED GLOBAL ASSET CATALOG - PART 4
-- Migration: 039
-- Administrative & Logistics Categories (Access, Credentials, Parking, Meals, Flights, Lodging, Rental Cars)
-- =============================================

-- =============================================
-- ACCESS (Business/Operations Apps) CATALOG
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, tags, specifications, created_by) VALUES
-- Project Management & Communication
('00000000-0000-0000-0000-000000000001', 'Asana Team License - Annual', 'Project management software. Also: asana subscription, task management, project tracking', 'credential', 'access', 'Project Management', 'Asana', 'TEAM-ANNUAL', ARRAY['asana', 'project management', 'saas'], '{"users": "up to 25", "duration": "12 months"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Monday.com Pro License', 'Work management platform. Alt: monday, workflow software', 'credential', 'access', 'Project Management', 'Monday', 'PRO-PLAN', ARRAY['monday', 'workflow'], '{"users": "up to 10", "duration": "monthly"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Slack Pro License', 'Team messaging. Alt: slack subscription, team chat, workspace communication', 'credential', 'access', 'Communication', 'Slack', 'PRO-PLAN', ARRAY['slack', 'messaging', 'chat'], '{"users": "per seat", "duration": "monthly"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Microsoft Teams License', 'Collaboration platform. Also: ms teams, office 365 teams', 'credential', 'access', 'Communication', 'Microsoft', 'TEAMS-STD', ARRAY['teams', 'microsoft'], '{"users": "per user", "duration": "annual"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Zoom Pro License', 'Video conferencing. Alt: zoom subscription, video calls', 'credential', 'access', 'Communication', 'Zoom', 'PRO', ARRAY['zoom', 'video'], '{"users": "per host", "meeting_duration": "unlimited"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Adobe Creative Cloud All Apps', 'Adobe creative suite. Also: adobe subscription, creative suite', 'credential', 'access', 'Design', 'Adobe', 'CC-ALL', ARRAY['adobe', 'creative cloud'], '{"users": "per user", "duration": "annual"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Google Workspace Business', 'Google productivity suite. Alt: g suite, google drive', 'credential', 'access', 'Productivity', 'Google', 'BUSINESS-STD', ARRAY['google', 'workspace'], '{"storage": "2TB per user", "duration": "annual"}'::jsonb, '00000000-0000-0000-0000-000000000001');

-- =============================================
-- CREDENTIALS CATALOG
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, tags, specifications, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'All-Access Crew Badge', 'Full access credential. Also: aaa pass, crew pass, all areas pass', 'credential', 'credentials', 'Badges', 'BadgeMakers', 'AAA-001', ARRAY['badge', 'all-access', 'crew'], '{"access": "all areas", "duration": "event"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Production Staff Badge', 'Standard production access. Alt: staff pass, production credential', 'credential', 'credentials', 'Badges', 'BadgeMakers', 'PROD-001', ARRAY['badge', 'production', 'staff'], '{"access": "production areas"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'VIP Guest Pass', 'VIP credential. Also: vip badge, guest pass, hospitality pass', 'credential', 'credentials', 'Badges', 'BadgeMakers', 'VIP-001', ARRAY['badge', 'vip'], '{"access": "vip areas"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Festival Wristband 3-Day', 'Multi-day wristband. Also: event wristband, festival pass', 'credential', 'credentials', 'Wristbands', 'Tyvek Plus', 'FEST-3D', ARRAY['wristband', 'festival'], '{"duration": "3 days", "tamper-proof": true}'::jsonb, '00000000-0000-0000-0000-000000000001');

-- =============================================
-- PARKING CATALOG
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, tags, specifications, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'VIP Parking Pass - Lot A', 'Premium parking. Also: preferred parking, vip lot, prime parking', 'credential', 'parking', 'Parking Passes', 'ParkingCo', 'VIP-LOT-A', ARRAY['parking', 'vip'], '{"location": "Lot A", "proximity": "closest"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Staff Parking Pass - Lot B', 'Staff parking. Alt: employee parking, crew parking', 'credential', 'parking', 'Parking Passes', 'ParkingCo', 'STAFF-LOT-B', ARRAY['parking', 'staff'], '{"location": "Lot B", "duration": "event dates"}'::jsonb, '00000000-0000-0000-0000-000000000001');

-- =============================================
-- MEALS CATALOG
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, tags, specifications, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'Catering Package - Production Crew (25 people)', 'Hot meal catering. Also: crew catering, production meals', 'consumable', 'meals', 'Catering', 'CaterCo', 'CREW-25', ARRAY['catering', 'meals', 'crew'], '{"serves": "25 people", "meals": "breakfast, lunch, dinner"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Craft Services - Full Day (50 people)', 'All-day snacks. Also: craft service, crafty, snack table', 'consumable', 'meals', 'Craft Services', 'CaterCo', 'CS-FULL-50', ARRAY['craft services', 'snacks'], '{"serves": "50 people", "duration": "full day"}'::jsonb, '00000000-0000-0000-0000-000000000001');

-- =============================================
-- FLIGHTS CATALOG
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, tags, specifications, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'Flight Ticket - Domestic Coach Round Trip', 'Standard domestic airfare. Also: plane ticket, economy flight', 'consumable', 'flights', 'Air Travel', 'AirlineCo', 'DOM-COACH-RT', ARRAY['flight', 'domestic', 'coach'], '{"class": "economy", "route": "domestic US"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Flight Ticket - International Coach Round Trip', 'International economy. Also: overseas flight, international travel', 'consumable', 'flights', 'Air Travel', 'AirlineCo', 'INTL-COACH-RT', ARRAY['flight', 'international'], '{"class": "economy", "route": "international"}'::jsonb, '00000000-0000-0000-0000-000000000001');

-- =============================================
-- LODGING CATALOG
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, tags, specifications, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'Hotel Room - Standard Queen (1 Night)', 'Standard hotel room. Also: hotel accommodation, guest room', 'consumable', 'lodging', 'Hotels', 'HotelChain', 'STD-QUEEN', ARRAY['hotel', 'room'], '{"bed": "1 queen", "occupancy": "1-2 guests", "nights": "1"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Hotel Block - 10 Rooms (1 Night)', 'Room block reservation. Alt: group booking, room block', 'consumable', 'lodging', 'Hotels', 'HotelChain', 'BLOCK-10', ARRAY['hotel', 'room block'], '{"rooms": "10 rooms mix", "rate": "group rate"}'::jsonb, '00000000-0000-0000-0000-000000000001');

-- =============================================
-- RENTAL CARS CATALOG
-- =============================================

INSERT INTO assets (workspace_id, name, description, type, asset_category, category, manufacturer, model_number, tags, specifications, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'Rental Car - Economy Sedan (Daily)', 'Compact car rental. Also: compact car, economy rental', 'vehicle', 'rental_cars', 'Cars', 'RentalCo', 'ECON-DAY', ARRAY['rental car', 'economy'], '{"class": "economy", "passengers": "5", "rate": "daily"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Rental Car - SUV Full-Size (Daily)', 'Full-size SUV. Alt: large suv, family suv, ford explorer', 'vehicle', 'rental_cars', 'SUVs', 'RentalCo', 'SUV-DAY', ARRAY['rental car', 'suv'], '{"class": "full-size SUV", "passengers": "7", "rate": "daily"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', 'Rental Van - 12 Passenger (Daily)', 'Passenger van rental. Also: crew van, passenger van, transit van', 'vehicle', 'rental_cars', 'Vans', 'RentalCo', 'VAN12-DAY', ARRAY['rental', 'van', '12-passenger'], '{"class": "passenger van", "passengers": "12", "rate": "daily"}'::jsonb, '00000000-0000-0000-0000-000000000001');

-- =============================================
-- CREATE INDEXES FOR FUZZY SEARCH
-- =============================================

-- Full-text search indexes for fuzzy matching
CREATE INDEX IF NOT EXISTS idx_assets_name_trgm ON assets USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_assets_description_trgm ON assets USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_assets_tags_gin ON assets USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_assets_category_search ON assets(asset_category, category);

-- Enable pg_trgm extension for fuzzy search if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;

COMMENT ON TABLE assets IS 'Global pre-seeded asset catalog with fuzzy search support for alternative names and accessories';
