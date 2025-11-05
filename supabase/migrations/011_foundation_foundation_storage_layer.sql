-- =============================================
-- LAYER 2: STORAGE LAYER
-- Supabase Storage RLS Policies
-- Migration: 009
-- =============================================

-- =============================================
-- IMPORTANT: STORAGE BUCKET CREATION
-- =============================================
-- Storage buckets cannot be created via SQL migrations in Supabase.
-- Buckets must be created using the Supabase Dashboard or CLI.
-- 
-- See supabase/storage-buckets-config.sql for bucket configurations
-- to create manually via Dashboard > Storage or using Supabase CLI
-- =============================================

-- =============================================
-- STORAGE RLS POLICIES
-- =============================================

-- AVATARS BUCKET (Public Read, User Write Own)
CREATE POLICY "Public can view avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' 
        AND (SELECT (SELECT auth.uid()))::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars' 
        AND (SELECT (SELECT auth.uid()))::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars' 
        AND (SELECT (SELECT auth.uid()))::text = (storage.foldername(name))[1]
    );

-- LOGOS BUCKET (Public Read, Admin Write)
CREATE POLICY "Public can view logos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'logos');

CREATE POLICY "Admins can upload logos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'logos'
        AND (SELECT (SELECT auth.uid())) IN (
            SELECT user_id FROM organization_members 
            WHERE role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Admins can update logos"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'logos'
        AND (SELECT (SELECT auth.uid())) IN (
            SELECT user_id FROM organization_members 
            WHERE role IN ('owner', 'admin')
        )
    );

-- DOCUMENTS BUCKET (Workspace-based access)
CREATE POLICY "Users can view documents in their workspaces"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'documents'
        AND (storage.foldername(name))[1]::uuid IN (
            SELECT w.id FROM workspaces w
            WHERE w.organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
            )
        )
    );

CREATE POLICY "Users can upload documents to their workspaces"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'documents'
        AND (storage.foldername(name))[1]::uuid IN (
            SELECT w.id FROM workspaces w
            WHERE w.organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
            )
        )
    );

CREATE POLICY "Users can update documents in their workspaces"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'documents'
        AND (storage.foldername(name))[1]::uuid IN (
            SELECT w.id FROM workspaces w
            WHERE w.organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
            )
        )
    );

CREATE POLICY "Users can delete documents in their workspaces"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'documents'
        AND (storage.foldername(name))[1]::uuid IN (
            SELECT w.id FROM workspaces w
            WHERE w.organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
            )
        )
    );

-- MEDIA BUCKET (Same workspace-based pattern)
CREATE POLICY "Users can view media in their workspaces"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'media'
        AND (storage.foldername(name))[1]::uuid IN (
            SELECT w.id FROM workspaces w
            WHERE w.organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
            )
        )
    );

CREATE POLICY "Users can upload media to their workspaces"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'media'
        AND (storage.foldername(name))[1]::uuid IN (
            SELECT w.id FROM workspaces w
            WHERE w.organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
            )
        )
    );

-- PROJECT FILES BUCKET
CREATE POLICY "Users can view project files in their workspaces"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'project-files'
        AND (storage.foldername(name))[1]::uuid IN (
            SELECT w.id FROM workspaces w
            WHERE w.organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
            )
        )
    );

CREATE POLICY "Users can manage project files in their workspaces"
    ON storage.objects FOR ALL
    USING (
        bucket_id = 'project-files'
        AND (storage.foldername(name))[1]::uuid IN (
            SELECT w.id FROM workspaces w
            WHERE w.organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
            )
        )
    );

-- CONTRACTS BUCKET (Admin only)
CREATE POLICY "Admins can view contracts"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'contracts'
        AND (SELECT (SELECT auth.uid())) IN (
            SELECT user_id FROM organization_members 
            WHERE role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Admins can manage contracts"
    ON storage.objects FOR ALL
    USING (
        bucket_id = 'contracts'
        AND (SELECT (SELECT auth.uid())) IN (
            SELECT user_id FROM organization_members 
            WHERE role IN ('owner', 'admin')
        )
    );

-- REPORTS BUCKET
CREATE POLICY "Users can view reports in their workspaces"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'reports'
        AND (storage.foldername(name))[1]::uuid IN (
            SELECT w.id FROM workspaces w
            WHERE w.organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
            )
        )
    );

CREATE POLICY "Users can upload reports to their workspaces"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'reports'
        AND (storage.foldername(name))[1]::uuid IN (
            SELECT w.id FROM workspaces w
            WHERE w.organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
            )
        )
    );

-- =============================================
-- STORAGE HELPER FUNCTIONS
-- =============================================
-- Note: Custom storage functions would require permissions on the storage schema.
-- If needed, these can be created in the public schema instead.

-- =============================================
-- FOLDER STRUCTURE DOCUMENTATION
-- =============================================

-- Expected folder structure:
-- 
-- avatars/
--   {user_id}/
--     avatar.jpg
--
-- logos/
--   {organization_id}/
--     logo.png
--
-- documents/
--   {workspace_id}/
--     contracts/
--     riders/
--     tech-specs/
--     permits/
--     insurance/
--
-- media/
--   {workspace_id}/
--     {production_id}/
--       photos/
--       videos/
--       audio/
--
-- project-files/
--   {workspace_id}/
--     {production_id}/
--       planning/
--       designs/
--       deliverables/
--
-- event-assets/
--   {workspace_id}/
--     {event_id}/
--       run-of-show/
--       cue-sheets/
--       stage-plots/
--
-- technical-drawings/
--   {workspace_id}/
--     {location_id}/
--       floor-plans/
--       site-maps/
--       cad/
--
-- contracts/
--   {workspace_id}/
--     vendor/
--     client/
--     employment/
--
-- reports/
--   {workspace_id}/
--     financial/
--     analytics/
--     compliance/
--
-- receipts/
--   {workspace_id}/
--     {expense_report_id}/
