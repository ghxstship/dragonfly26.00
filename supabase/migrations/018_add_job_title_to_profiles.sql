-- =====================================================
-- ADD JOB_TITLE TO PROFILES
-- Adds job_title column to profiles table for onboarding
-- =====================================================

-- Add job_title column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS job_title TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_job_title ON profiles(job_title);

-- Comment on the column
COMMENT ON COLUMN profiles.job_title IS 'User job title or role in their organization';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
