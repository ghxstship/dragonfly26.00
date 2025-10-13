-- =====================================================
-- ONBOARDING TRACKING
-- Adds onboarding completion tracking to profiles
-- =====================================================

-- Add onboarding_completed column to profiles table
-- This tracks whether a user has completed the onboarding flow
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON profiles(onboarding_completed);

-- Add onboarding_completed_at timestamp
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Create a function to mark onboarding as complete
CREATE OR REPLACE FUNCTION complete_user_onboarding(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET 
    onboarding_completed = TRUE,
    onboarding_completed_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION complete_user_onboarding(UUID) TO authenticated;

-- Comment on the function
COMMENT ON FUNCTION complete_user_onboarding IS 'Marks a user as having completed onboarding';
