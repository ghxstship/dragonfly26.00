-- Migration: User-Scoped RLS Policies
-- Date: October 19, 2025
-- Purpose: Implement RLS policies for user-scoped tables (personal data)
-- Priority: P0 CRITICAL

-- ============================================================
-- PHASE 4.2: USER-SCOPED POLICIES
-- ============================================================

-- These policies ensure users can only access their own personal data.
-- Pattern: auth.uid() = user_id

-- ============================================================
-- PROFILES TABLE
-- ============================================================

-- SELECT: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- UPDATE: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Note: INSERT handled by trigger on auth.users
-- Note: DELETE not allowed (use soft delete via status field)

-- ============================================================
-- USER_PREFERENCES TABLE
-- ============================================================

-- SELECT: Users can view their own preferences
CREATE POLICY "Users can view own preferences"
ON user_preferences FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Users can create their own preferences
CREATE POLICY "Users can insert own preferences"
ON user_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own preferences
CREATE POLICY "Users can update own preferences"
ON user_preferences FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE: Users can delete their own preferences
CREATE POLICY "Users can delete own preferences"
ON user_preferences FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- USER_INTEGRATIONS TABLE
-- ============================================================

-- SELECT: Users can view their own integrations
CREATE POLICY "Users can view own integrations"
ON user_integrations FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Users can create their own integrations
CREATE POLICY "Users can insert own integrations"
ON user_integrations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own integrations
CREATE POLICY "Users can update own integrations"
ON user_integrations FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE: Users can delete their own integrations
CREATE POLICY "Users can delete own integrations"
ON user_integrations FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- USER_AUTOMATIONS TABLE
-- ============================================================

-- SELECT: Users can view their own automations
CREATE POLICY "Users can view own automations"
ON user_automations FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Users can create their own automations
CREATE POLICY "Users can insert own automations"
ON user_automations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own automations
CREATE POLICY "Users can update own automations"
ON user_automations FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE: Users can delete their own automations
CREATE POLICY "Users can delete own automations"
ON user_automations FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- NOTIFICATION_SETTINGS TABLE
-- ============================================================

-- SELECT: Users can view their own notification settings
CREATE POLICY "Users can view own notification settings"
ON notification_settings FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Users can create their own notification settings
CREATE POLICY "Users can insert own notification settings"
ON notification_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own notification settings
CREATE POLICY "Users can update own notification settings"
ON notification_settings FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE: Users can delete their own notification settings
CREATE POLICY "Users can delete own notification settings"
ON notification_settings FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- APPEARANCE_SETTINGS TABLE
-- ============================================================

-- SELECT: Users can view their own appearance settings
CREATE POLICY "Users can view own appearance settings"
ON appearance_settings FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Users can create their own appearance settings
CREATE POLICY "Users can insert own appearance settings"
ON appearance_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own appearance settings
CREATE POLICY "Users can update own appearance settings"
ON appearance_settings FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE: Users can delete their own appearance settings
CREATE POLICY "Users can delete own appearance settings"
ON appearance_settings FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- BILLING_INFO TABLE
-- ============================================================

-- SELECT: Users can view their own billing info
CREATE POLICY "Users can view own billing info"
ON billing_info FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Users can create their own billing info
CREATE POLICY "Users can insert own billing info"
ON billing_info FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own billing info
CREATE POLICY "Users can update own billing info"
ON billing_info FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE: Users can delete their own billing info
CREATE POLICY "Users can delete own billing info"
ON billing_info FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Count policies created
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN (
        'profiles', 'user_preferences', 'user_integrations',
        'user_automations', 'notification_settings', 'appearance_settings',
        'billing_info'
    );
    
    -- Expected: 7 tables × 4 policies (except profiles with 2) = 26 policies
    IF policy_count >= 26 THEN
        RAISE NOTICE 'SUCCESS: % user-scoped policies created', policy_count;
    ELSE
        RAISE WARNING 'Only % policies created, expected at least 26', policy_count;
    END IF;
END $$;

-- ============================================================
-- NOTES
-- ============================================================

-- These policies ensure complete user data isolation.
-- Users can ONLY access their own personal data.
-- No cross-user data access is possible.
--
-- Next steps:
--   1. Test user isolation
--   2. Verify users cannot see other users' data
--   3. Apply workspace-scoped policies next
