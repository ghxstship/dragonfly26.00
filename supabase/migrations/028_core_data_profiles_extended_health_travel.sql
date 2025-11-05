-- =====================================================
-- PROFILE EXTENDED FIELDS - Health & Travel
-- Adds comprehensive health and travel management fields
-- =====================================================

-- =============================================
-- HEALTH INFORMATION EXTENSIONS
-- =============================================

-- Add detailed health tracking fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dietary_restrictions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS special_accommodations TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS doctor_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS doctor_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS insurance_provider TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS policy_number TEXT;

-- =============================================
-- TRAVEL INFORMATION EXTENSIONS
-- =============================================

-- Add travel preference and loyalty program fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS visa_information TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS global_entry TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS known_traveler_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS seat_preference TEXT DEFAULT 'no-preference';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS meal_preference TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS frequent_flyer_programs TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hotel_preferences TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS loyalty_programs TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mobility_assistance BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wheelchair_required BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS other_travel_needs TEXT;

-- =============================================
-- INDEXES
-- =============================================

-- Create indexes for health searches
CREATE INDEX IF NOT EXISTS idx_profiles_insurance_provider ON profiles(insurance_provider);
CREATE INDEX IF NOT EXISTS idx_profiles_doctor_name ON profiles(doctor_name);

-- Create indexes for travel searches
CREATE INDEX IF NOT EXISTS idx_profiles_tsa_precheck ON profiles(tsa_precheck);
CREATE INDEX IF NOT EXISTS idx_profiles_passport_expiry ON profiles(passport_expiry);

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON COLUMN profiles.dietary_restrictions IS 'Array of dietary restriction strings (e.g., ["Vegetarian", "Gluten-free"])';
COMMENT ON COLUMN profiles.special_accommodations IS 'Special accessibility or accommodation needs';
COMMENT ON COLUMN profiles.doctor_name IS 'Primary healthcare provider name';
COMMENT ON COLUMN profiles.doctor_phone IS 'Primary healthcare provider contact number';
COMMENT ON COLUMN profiles.insurance_provider IS 'Health insurance company name';
COMMENT ON COLUMN profiles.policy_number IS 'Health insurance policy or member ID';

COMMENT ON COLUMN profiles.visa_information IS 'Valid visas and expiry information';
COMMENT ON COLUMN profiles.global_entry IS 'Global Entry trusted traveler number';
COMMENT ON COLUMN profiles.known_traveler_number IS 'Known Traveler Number (KTN)';
COMMENT ON COLUMN profiles.seat_preference IS 'Preferred airplane seating (window, aisle, middle, no-preference)';
COMMENT ON COLUMN profiles.meal_preference IS 'Dietary meal preferences for travel';
COMMENT ON COLUMN profiles.frequent_flyer_programs IS 'Airline loyalty programs and membership numbers';
COMMENT ON COLUMN profiles.hotel_preferences IS 'Hotel room and accommodation preferences';
COMMENT ON COLUMN profiles.loyalty_programs IS 'Hotel loyalty programs and membership numbers';
COMMENT ON COLUMN profiles.mobility_assistance IS 'Requires mobility assistance at airports';
COMMENT ON COLUMN profiles.wheelchair_required IS 'Requires wheelchair accommodation';
COMMENT ON COLUMN profiles.other_travel_needs IS 'Additional special travel requirements';
