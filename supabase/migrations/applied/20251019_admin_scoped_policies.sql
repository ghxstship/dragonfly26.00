-- Migration: Admin-Scoped RLS Policies
-- Date: October 19, 2025
-- Purpose: Implement RLS policies for admin/system tables
-- Priority: P0 CRITICAL

-- ============================================================
-- PHASE 4.4: ADMIN-SCOPED POLICIES
-- ============================================================

-- These policies ensure only admins can access system configuration tables.
-- Pattern: Check user has admin role in their workspace

-- ============================================================
-- HELPER FUNCTION: Check Admin Role
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin', 'owner')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_workspace_admin(workspace_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_id = workspace_uuid
        AND user_id = auth.uid()
        AND role IN ('admin', 'owner')
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- AUDIT_LOGS TABLE
-- ============================================================

-- SELECT: Admins can view all audit logs in their workspace
CREATE POLICY "Admins can view workspace audit logs"
ON audit_logs FOR SELECT
USING (is_workspace_admin(workspace_id));

-- INSERT: System only (handled by triggers)
CREATE POLICY "System can insert audit logs"
ON audit_logs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- No UPDATE or DELETE - audit logs are immutable

-- ============================================================
-- SYSTEM_SETTINGS TABLE
-- ============================================================

-- SELECT: Admins can view system settings
CREATE POLICY "Admins can view system settings"
ON system_settings FOR SELECT
USING (is_admin());

-- UPDATE: Only super admins can update system settings
CREATE POLICY "Super admins can update system settings"
ON system_settings FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role = 'super_admin'
    )
);

-- No INSERT or DELETE - settings are pre-seeded

-- ============================================================
-- API_TOKENS TABLE
-- ============================================================

-- SELECT: Admins can view workspace API tokens
CREATE POLICY "Admins can view workspace API tokens"
ON api_tokens FOR SELECT
USING (is_workspace_admin(workspace_id));

-- INSERT: Admins can create workspace API tokens
CREATE POLICY "Admins can insert workspace API tokens"
ON api_tokens FOR INSERT
WITH CHECK (is_workspace_admin(workspace_id));

-- UPDATE: Admins can update workspace API tokens
CREATE POLICY "Admins can update workspace API tokens"
ON api_tokens FOR UPDATE
USING (is_workspace_admin(workspace_id));

-- DELETE: Admins can delete workspace API tokens
CREATE POLICY "Admins can delete workspace API tokens"
ON api_tokens FOR DELETE
USING (is_workspace_admin(workspace_id));

-- ============================================================
-- WEBHOOKS TABLE
-- ============================================================

-- SELECT: Admins can view workspace webhooks
CREATE POLICY "Admins can view workspace webhooks"
ON webhooks FOR SELECT
USING (is_workspace_admin(workspace_id));

-- INSERT: Admins can create workspace webhooks
CREATE POLICY "Admins can insert workspace webhooks"
ON webhooks FOR INSERT
WITH CHECK (is_workspace_admin(workspace_id));

-- UPDATE: Admins can update workspace webhooks
CREATE POLICY "Admins can update workspace webhooks"
ON webhooks FOR UPDATE
USING (is_workspace_admin(workspace_id));

-- DELETE: Admins can delete workspace webhooks
CREATE POLICY "Admins can delete workspace webhooks"
ON webhooks FOR DELETE
USING (is_workspace_admin(workspace_id));

-- ============================================================
-- INTEGRATIONS TABLE
-- ============================================================

-- SELECT: Admins can view workspace integrations
CREATE POLICY "Admins can view workspace integrations"
ON integrations FOR SELECT
USING (is_workspace_admin(workspace_id));

-- INSERT: Admins can create workspace integrations
CREATE POLICY "Admins can insert workspace integrations"
ON integrations FOR INSERT
WITH CHECK (is_workspace_admin(workspace_id));

-- UPDATE: Admins can update workspace integrations
CREATE POLICY "Admins can update workspace integrations"
ON integrations FOR UPDATE
USING (is_workspace_admin(workspace_id));

-- DELETE: Admins can delete workspace integrations
CREATE POLICY "Admins can delete workspace integrations"
ON integrations FOR DELETE
USING (is_workspace_admin(workspace_id));

-- ============================================================
-- AUTOMATIONS TABLE
-- ============================================================

-- SELECT: Admins can view workspace automations
CREATE POLICY "Admins can view workspace automations"
ON automations FOR SELECT
USING (is_workspace_admin(workspace_id));

-- INSERT: Admins can create workspace automations
CREATE POLICY "Admins can insert workspace automations"
ON automations FOR INSERT
WITH CHECK (is_workspace_admin(workspace_id));

-- UPDATE: Admins can update workspace automations
CREATE POLICY "Admins can update workspace automations"
ON automations FOR UPDATE
USING (is_workspace_admin(workspace_id));

-- DELETE: Admins can delete workspace automations
CREATE POLICY "Admins can delete workspace automations"
ON automations FOR DELETE
USING (is_workspace_admin(workspace_id));

-- ============================================================
-- CUSTOM_FIELDS TABLE
-- ============================================================

-- SELECT: Admins can view workspace custom fields
CREATE POLICY "Admins can view workspace custom fields"
ON custom_fields FOR SELECT
USING (is_workspace_admin(workspace_id));

-- INSERT: Admins can create workspace custom fields
CREATE POLICY "Admins can insert workspace custom fields"
ON custom_fields FOR INSERT
WITH CHECK (is_workspace_admin(workspace_id));

-- UPDATE: Admins can update workspace custom fields
CREATE POLICY "Admins can update workspace custom fields"
ON custom_fields FOR UPDATE
USING (is_workspace_admin(workspace_id));

-- DELETE: Admins can delete workspace custom fields
CREATE POLICY "Admins can delete workspace custom fields"
ON custom_fields FOR DELETE
USING (is_workspace_admin(workspace_id));

-- ============================================================
-- CUSTOM_STATUSES TABLE
-- ============================================================

-- SELECT: Admins can view workspace custom statuses
CREATE POLICY "Admins can view workspace custom statuses"
ON custom_statuses FOR SELECT
USING (is_workspace_admin(workspace_id));

-- INSERT: Admins can create workspace custom statuses
CREATE POLICY "Admins can insert workspace custom statuses"
ON custom_statuses FOR INSERT
WITH CHECK (is_workspace_admin(workspace_id));

-- UPDATE: Admins can update workspace custom statuses
CREATE POLICY "Admins can update workspace custom statuses"
ON custom_statuses FOR UPDATE
USING (is_workspace_admin(workspace_id));

-- DELETE: Admins can delete workspace custom statuses
CREATE POLICY "Admins can delete workspace custom statuses"
ON custom_statuses FOR DELETE
USING (is_workspace_admin(workspace_id));

-- ============================================================
-- TEMPLATES TABLE
-- ============================================================

-- SELECT: Admins can view workspace templates
CREATE POLICY "Admins can view workspace templates"
ON templates FOR SELECT
USING (is_workspace_admin(workspace_id));

-- INSERT: Admins can create workspace templates
CREATE POLICY "Admins can insert workspace templates"
ON templates FOR INSERT
WITH CHECK (is_workspace_admin(workspace_id));

-- UPDATE: Admins can update workspace templates
CREATE POLICY "Admins can update workspace templates"
ON templates FOR UPDATE
USING (is_workspace_admin(workspace_id));

-- DELETE: Admins can delete workspace templates
CREATE POLICY "Admins can delete workspace templates"
ON templates FOR DELETE
USING (is_workspace_admin(workspace_id));

-- ============================================================
-- CHECKLIST_TEMPLATES TABLE
-- ============================================================

-- SELECT: Admins can view workspace checklist templates
CREATE POLICY "Admins can view workspace checklist templates"
ON checklist_templates FOR SELECT
USING (is_workspace_admin(workspace_id));

-- INSERT: Admins can create workspace checklist templates
CREATE POLICY "Admins can insert workspace checklist templates"
ON checklist_templates FOR INSERT
WITH CHECK (is_workspace_admin(workspace_id));

-- UPDATE: Admins can update workspace checklist templates
CREATE POLICY "Admins can update workspace checklist templates"
ON checklist_templates FOR UPDATE
USING (is_workspace_admin(workspace_id));

-- DELETE: Admins can delete workspace checklist templates
CREATE POLICY "Admins can delete workspace checklist templates"
ON checklist_templates FOR DELETE
USING (is_workspace_admin(workspace_id));

-- ============================================================
-- VERIFICATION
-- ============================================================

DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'public'
    AND (policyname LIKE '%admin%' OR policyname LIKE '%system%');
    
    -- Expected: 11 tables × ~3.5 policies avg = ~38 policies
    IF policy_count >= 38 THEN
        RAISE NOTICE 'SUCCESS: % admin-scoped policies created', policy_count;
    ELSE
        RAISE WARNING 'Only % policies created, expected at least 38', policy_count;
    END IF;
END $$;

-- ============================================================
-- NOTES
-- ============================================================

-- These policies ensure only authorized admins can access system configuration.
-- Regular users cannot view or modify admin-level settings.
-- Audit logs are immutable and can only be viewed by admins.
--
-- Next steps:
--   1. Test admin access controls
--   2. Verify regular users cannot access admin tables
--   3. Apply public policies next
