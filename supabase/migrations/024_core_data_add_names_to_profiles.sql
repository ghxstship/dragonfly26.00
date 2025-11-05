-- =====================================================
-- ADD FIRST_NAME AND LAST_NAME TO PROFILES
-- Fixes relationship errors for user joins
-- Migration: 020
-- =====================================================

-- Add first_name and last_name columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_first_name ON profiles(first_name);
CREATE INDEX IF NOT EXISTS idx_profiles_last_name ON profiles(last_name);
CREATE INDEX IF NOT EXISTS idx_profiles_names ON profiles(first_name, last_name);

-- Migrate existing full_name data to first_name/last_name
-- Split full_name on first space
UPDATE profiles
SET 
  first_name = COALESCE(SPLIT_PART(full_name, ' ', 1), ''),
  last_name = COALESCE(SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1), '')
WHERE full_name IS NOT NULL 
  AND (first_name IS NULL OR last_name IS NULL);

-- Update the handle_new_user function to populate first_name and last_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
        first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
        last_name = COALESCE(EXCLUDED.last_name, profiles.last_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON COLUMN profiles.first_name IS 'User first name for relationship queries';
COMMENT ON COLUMN profiles.last_name IS 'User last name for relationship queries';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
