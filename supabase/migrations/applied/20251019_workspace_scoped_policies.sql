-- Migration: Workspace-Scoped RLS Policies
-- Date: October 19, 2025
-- Purpose: Implement RLS policies for workspace/organization-scoped tables
-- Priority: P0 CRITICAL

-- ============================================================
-- PHASE 4.3: WORKSPACE-SCOPED POLICIES
-- ============================================================

-- These policies ensure users can only access data within their workspace/organization.
-- Pattern: workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())

-- ============================================================
-- HELPER FUNCTION: Check Workspace Membership
-- ============================================================

CREATE OR REPLACE FUNCTION is_workspace_member(workspace_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_id = workspace_uuid
        AND user_id = auth.uid()
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PROJECTS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace projects"
ON projects FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace projects"
ON projects FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace projects"
ON projects FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace projects"
ON projects FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- TASKS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace tasks"
ON tasks FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace tasks"
ON tasks FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace tasks"
ON tasks FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace tasks"
ON tasks FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- EVENTS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace events"
ON events FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace events"
ON events FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace events"
ON events FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace events"
ON events FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- PEOPLE TABLE
-- ============================================================

CREATE POLICY "Users can view workspace people"
ON people FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace people"
ON people FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace people"
ON people FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace people"
ON people FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- ASSETS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace assets"
ON assets FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace assets"
ON assets FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace assets"
ON assets FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace assets"
ON assets FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- ASSET_TRANSACTIONS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace asset transactions"
ON asset_transactions FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace asset transactions"
ON asset_transactions FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace asset transactions"
ON asset_transactions FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace asset transactions"
ON asset_transactions FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- ASSET_MAINTENANCE TABLE
-- ============================================================

CREATE POLICY "Users can view workspace asset maintenance"
ON asset_maintenance FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace asset maintenance"
ON asset_maintenance FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace asset maintenance"
ON asset_maintenance FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace asset maintenance"
ON asset_maintenance FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- LOCATIONS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace locations"
ON locations FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace locations"
ON locations FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace locations"
ON locations FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace locations"
ON locations FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- LOCATION_ACCESS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace location access"
ON location_access FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace location access"
ON location_access FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace location access"
ON location_access FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace location access"
ON location_access FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- BIM_MODELS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace BIM models"
ON bim_models FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace BIM models"
ON bim_models FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace BIM models"
ON bim_models FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace BIM models"
ON bim_models FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- LOCATION_ZONES TABLE
-- ============================================================

CREATE POLICY "Users can view workspace location zones"
ON location_zones FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace location zones"
ON location_zones FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace location zones"
ON location_zones FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace location zones"
ON location_zones FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- FILES TABLE
-- ============================================================

CREATE POLICY "Users can view workspace files"
ON files FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace files"
ON files FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace files"
ON files FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace files"
ON files FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- FILE_VERSIONS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace file versions"
ON file_versions FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace file versions"
ON file_versions FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace file versions"
ON file_versions FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace file versions"
ON file_versions FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- FILE_SHARES TABLE
-- ============================================================

CREATE POLICY "Users can view workspace file shares"
ON file_shares FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace file shares"
ON file_shares FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace file shares"
ON file_shares FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace file shares"
ON file_shares FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- FOLDERS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace folders"
ON folders FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace folders"
ON folders FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace folders"
ON folders FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace folders"
ON folders FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- COMPANIES TABLE
-- ============================================================

CREATE POLICY "Users can view workspace companies"
ON companies FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace companies"
ON companies FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace companies"
ON companies FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace companies"
ON companies FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- COMPANY_CONTACTS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace company contacts"
ON company_contacts FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace company contacts"
ON company_contacts FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace company contacts"
ON company_contacts FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace company contacts"
ON company_contacts FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- COMPANY_CONTRACTS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace company contracts"
ON company_contracts FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace company contracts"
ON company_contracts FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace company contracts"
ON company_contracts FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace company contracts"
ON company_contracts FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- COMPANY_DOCUMENTS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace company documents"
ON company_documents FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace company documents"
ON company_documents FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace company documents"
ON company_documents FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace company documents"
ON company_documents FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- COMPANY_NOTES TABLE
-- ============================================================

CREATE POLICY "Users can view workspace company notes"
ON company_notes FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace company notes"
ON company_notes FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace company notes"
ON company_notes FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace company notes"
ON company_notes FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- JOBS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace jobs"
ON jobs FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace jobs"
ON jobs FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace jobs"
ON jobs FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace jobs"
ON jobs FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- JOB_PIPELINES TABLE
-- ============================================================

CREATE POLICY "Users can view workspace job pipelines"
ON job_pipelines FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace job pipelines"
ON job_pipelines FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace job pipelines"
ON job_pipelines FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace job pipelines"
ON job_pipelines FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- JOB_OFFERS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace job offers"
ON job_offers FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace job offers"
ON job_offers FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace job offers"
ON job_offers FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace job offers"
ON job_offers FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- JOB_INVOICES TABLE
-- ============================================================

CREATE POLICY "Users can view workspace job invoices"
ON job_invoices FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace job invoices"
ON job_invoices FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace job invoices"
ON job_invoices FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace job invoices"
ON job_invoices FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- JOB_TEAM_MEMBERS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace job team members"
ON job_team_members FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace job team members"
ON job_team_members FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace job team members"
ON job_team_members FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace job team members"
ON job_team_members FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- PURCHASE_ORDERS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace purchase orders"
ON purchase_orders FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace purchase orders"
ON purchase_orders FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace purchase orders"
ON purchase_orders FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace purchase orders"
ON purchase_orders FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- PURCHASE_REQUISITIONS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace purchase requisitions"
ON purchase_requisitions FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace purchase requisitions"
ON purchase_requisitions FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace purchase requisitions"
ON purchase_requisitions FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace purchase requisitions"
ON purchase_requisitions FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- GOODS_RECEIPTS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace goods receipts"
ON goods_receipts FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace goods receipts"
ON goods_receipts FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace goods receipts"
ON goods_receipts FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace goods receipts"
ON goods_receipts FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- VENDORS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace vendors"
ON vendors FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace vendors"
ON vendors FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace vendors"
ON vendors FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace vendors"
ON vendors FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- FINANCE_TRANSACTIONS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace finance transactions"
ON finance_transactions FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace finance transactions"
ON finance_transactions FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace finance transactions"
ON finance_transactions FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace finance transactions"
ON finance_transactions FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- INVOICES TABLE
-- ============================================================

CREATE POLICY "Users can view workspace invoices"
ON invoices FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace invoices"
ON invoices FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace invoices"
ON invoices FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace invoices"
ON invoices FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- EXPENSES TABLE
-- ============================================================

CREATE POLICY "Users can view workspace expenses"
ON expenses FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace expenses"
ON expenses FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace expenses"
ON expenses FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace expenses"
ON expenses FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- BUDGETS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace budgets"
ON budgets FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace budgets"
ON budgets FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace budgets"
ON budgets FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace budgets"
ON budgets FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- PRODUCTION_ADVANCES TABLE
-- ============================================================

CREATE POLICY "Users can view workspace production advances"
ON production_advances FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace production advances"
ON production_advances FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace production advances"
ON production_advances FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace production advances"
ON production_advances FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- ANALYTICS_METRICS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace analytics metrics"
ON analytics_metrics FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace analytics metrics"
ON analytics_metrics FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace analytics metrics"
ON analytics_metrics FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace analytics metrics"
ON analytics_metrics FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- ANALYTICS_DASHBOARDS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace analytics dashboards"
ON analytics_dashboards FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace analytics dashboards"
ON analytics_dashboards FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace analytics dashboards"
ON analytics_dashboards FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace analytics dashboards"
ON analytics_dashboards FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- ANALYTICS_REPORTS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace analytics reports"
ON analytics_reports FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace analytics reports"
ON analytics_reports FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace analytics reports"
ON analytics_reports FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace analytics reports"
ON analytics_reports FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- REPORTS TABLE
-- ============================================================

CREATE POLICY "Users can view workspace reports"
ON reports FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace reports"
ON reports FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace reports"
ON reports FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace reports"
ON reports FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- REPORT_TEMPLATES TABLE
-- ============================================================

CREATE POLICY "Users can view workspace report templates"
ON report_templates FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace report templates"
ON report_templates FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace report templates"
ON report_templates FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace report templates"
ON report_templates FOR DELETE
USING (is_workspace_member(workspace_id));

-- ============================================================
-- REPORT_SCHEDULES TABLE
-- ============================================================

CREATE POLICY "Users can view workspace report schedules"
ON report_schedules FOR SELECT
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can insert workspace report schedules"
ON report_schedules FOR INSERT
WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Users can update workspace report schedules"
ON report_schedules FOR UPDATE
USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can delete workspace report schedules"
ON report_schedules FOR DELETE
USING (is_workspace_member(workspace_id));

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
    AND policyname LIKE '%workspace%';
    
    -- Expected: 44 tables × 4 policies = 176 policies
    IF policy_count >= 176 THEN
        RAISE NOTICE 'SUCCESS: % workspace-scoped policies created', policy_count;
    ELSE
        RAISE WARNING 'Only % policies created, expected at least 176', policy_count;
    END IF;
END $$;

-- ============================================================
-- NOTES
-- ============================================================

-- These policies ensure complete workspace data isolation.
-- Users can ONLY access data within their workspace.
-- No cross-workspace data access is possible.
--
-- Next steps:
--   1. Test workspace isolation
--   2. Verify users cannot see other workspaces' data
--   3. Apply admin policies next
