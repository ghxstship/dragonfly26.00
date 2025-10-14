-- =====================================================
-- PROFILE FIELDS COMPLETION
-- Adds all necessary fields for complete profile management
-- =====================================================

-- Add name fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Add contact fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Add professional fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hire_date DATE;

-- Add address fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country TEXT;

-- Add emergency contact fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_email TEXT;

-- Add health fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS blood_type TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS allergies TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medical_conditions TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medications TEXT;

-- Add travel fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS passport_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS passport_expiry DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS passport_country TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tsa_precheck TEXT;

-- Add social media fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Add JSONB fields for complex data
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS work_experience JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS endorsements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- Create indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_first_name ON profiles(first_name);
CREATE INDEX IF NOT EXISTS idx_profiles_last_name ON profiles(last_name);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_profiles_company ON profiles(company);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department);

-- Create text search index for profile search
CREATE INDEX IF NOT EXISTS idx_profiles_search ON profiles USING gin(
  to_tsvector('english', 
    coalesce(full_name, '') || ' ' ||
    coalesce(first_name, '') || ' ' ||
    coalesce(last_name, '') || ' ' ||
    coalesce(job_title, '') || ' ' ||
    coalesce(company, '') || ' ' ||
    coalesce(bio, '')
  )
);

-- Function to sync full_name with first/last name
CREATE OR REPLACE FUNCTION sync_profile_full_name()
RETURNS TRIGGER AS $$
BEGIN
  -- If first_name or last_name changed, update full_name
  IF (NEW.first_name IS DISTINCT FROM OLD.first_name) OR 
     (NEW.last_name IS DISTINCT FROM OLD.last_name) THEN
    NEW.full_name := TRIM(CONCAT(NEW.first_name, ' ', NEW.last_name));
  END IF;
  
  -- If full_name changed but first/last are empty, try to split
  IF (NEW.full_name IS DISTINCT FROM OLD.full_name) AND 
     NEW.first_name IS NULL AND NEW.last_name IS NULL THEN
    -- Simple split on first space
    NEW.first_name := SPLIT_PART(NEW.full_name, ' ', 1);
    NEW.last_name := TRIM(SUBSTRING(NEW.full_name FROM POSITION(' ' IN NEW.full_name)));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for name synchronization
DROP TRIGGER IF EXISTS sync_profile_full_name_trigger ON profiles;
CREATE TRIGGER sync_profile_full_name_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_full_name();

COMMENT ON TABLE profiles IS 'User profile information including personal, professional, health, and travel data';
COMMENT ON COLUMN profiles.skills IS 'Array of skill names';
COMMENT ON COLUMN profiles.certifications IS 'Array of certification objects with name, issuer, date, expiry';
COMMENT ON COLUMN profiles.education IS 'Array of education objects with degree, institution, field, year';
COMMENT ON COLUMN profiles.work_experience IS 'Array of experience objects with title, company, dates, description';
COMMENT ON COLUMN profiles.endorsements IS 'Array of endorsement objects from other users';
COMMENT ON COLUMN profiles.tags IS 'Array of tag strings for categorization';
