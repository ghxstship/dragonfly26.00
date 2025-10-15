-- =============================================
-- Add RLS Policies for Jobs Module
-- Migration: 20251014000000
-- =============================================
-- 
-- ISSUE: Tables job_contracts and rfps have RLS enabled but ZERO policies defined
-- IMPACT: Complete data access blockage on all Jobs module tabs
-- FIX: Create comprehensive RLS policies for both tables
--
-- =============================================

-- =============================================
-- JOB CONTRACTS RLS POLICIES
-- =============================================

-- SELECT: Users can view job contracts in their workspace
CREATE POLICY "Users can view job contracts in their workspace"
    ON job_contracts FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id 
            FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- INSERT: Users can create job contracts in their workspace
CREATE POLICY "Users can create job contracts in their workspace"
    ON job_contracts FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id 
            FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- UPDATE: Users can update job contracts in their workspace
CREATE POLICY "Users can update job contracts in their workspace"
    ON job_contracts FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id 
            FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- DELETE: Users can delete job contracts in their workspace
CREATE POLICY "Users can delete job contracts in their workspace"
    ON job_contracts FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id 
            FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- =============================================
-- RFPS RLS POLICIES
-- =============================================

-- SELECT: Users can view RFPs in their workspace
CREATE POLICY "Users can view rfps in their workspace"
    ON rfps FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id 
            FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- INSERT: Users can create RFPs in their workspace
CREATE POLICY "Users can create rfps in their workspace"
    ON rfps FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id 
            FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- UPDATE: Users can update RFPs in their workspace
CREATE POLICY "Users can update rfps in their workspace"
    ON rfps FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id 
            FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- DELETE: Users can delete RFPs in their workspace
CREATE POLICY "Users can delete rfps in their workspace"
    ON rfps FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id 
            FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify policies were created
-- SELECT schemaname, tablename, policyname, cmd 
-- FROM pg_policies 
-- WHERE tablename IN ('job_contracts', 'rfps')
-- ORDER BY tablename, cmd;

-- Expected result: 8 policies total
-- - job_contracts: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - rfps: 4 policies (SELECT, INSERT, UPDATE, DELETE)
