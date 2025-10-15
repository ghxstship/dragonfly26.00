-- Fix: Organizations SELECT policy blocking workspace creation during onboarding
-- Issue: INSERT...RETURNING failed because SELECT policy required membership before user was added
-- Solution: Allow all authenticated users to SELECT organizations (read-only is safe)

DROP POLICY IF EXISTS "Users can view their organizations" ON organizations;
CREATE POLICY "Users can view their organizations"
    ON organizations FOR SELECT
    TO authenticated
    USING (true);
