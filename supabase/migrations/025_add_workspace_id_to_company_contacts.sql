-- =============================================
-- Add workspace_id to company_contacts table
-- Migration: 025
-- Date: 2025-10-13
-- =============================================

-- Add workspace_id column to company_contacts
ALTER TABLE company_contacts 
ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

-- Populate workspace_id from the parent company
UPDATE company_contacts cc
SET workspace_id = c.workspace_id
FROM companies c
WHERE cc.company_id = c.id;

-- Make workspace_id NOT NULL after data migration
ALTER TABLE company_contacts 
ALTER COLUMN workspace_id SET NOT NULL;

-- Add index for performance
CREATE INDEX idx_company_contacts_workspace ON company_contacts(workspace_id);

-- Update RLS policies to include workspace check
DROP POLICY IF EXISTS "Users can view company contacts in their workspaces" ON company_contacts;
DROP POLICY IF EXISTS "Users can manage company contacts in their workspaces" ON company_contacts;

CREATE POLICY "Users can view company contacts in their workspaces"
    ON company_contacts FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT (SELECT (SELECT auth.uid()))))
        )
    ));

CREATE POLICY "Users can manage company contacts in their workspaces"
    ON company_contacts FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT (SELECT (SELECT auth.uid()))))
        )
    ));

-- Add comment
COMMENT ON COLUMN company_contacts.workspace_id IS 'Denormalized workspace_id for efficient querying';
