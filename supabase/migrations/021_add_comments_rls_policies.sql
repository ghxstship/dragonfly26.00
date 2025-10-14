-- =============================================
-- MIGRATION: Add RLS Policies for Comments Table
-- =============================================
-- Date: October 13, 2025
-- Description: Add missing Row Level Security policies for the comments table
--              to allow workspace members to read and write comments

-- =============================================
-- COMMENTS TABLE RLS POLICIES
-- =============================================

-- Policy: Allow users to view comments in workspaces they are members of
CREATE POLICY "Users can view comments in their workspaces"
ON comments FOR SELECT
TO authenticated
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- Policy: Allow users to create comments in workspaces they are members of
CREATE POLICY "Users can create comments in their workspaces"
ON comments FOR INSERT
TO authenticated
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
  AND user_id = auth.uid()
);

-- Policy: Allow users to update their own comments
CREATE POLICY "Users can update their own comments"
ON comments FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Allow users to delete their own comments
CREATE POLICY "Users can delete their own comments"
ON comments FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- =============================================
-- VERIFICATION
-- =============================================

-- Verify policies were created
DO $$
BEGIN
  RAISE NOTICE 'Comments RLS policies created successfully';
  RAISE NOTICE 'Total policies on comments table: %', (
    SELECT COUNT(*) 
    FROM pg_policies 
    WHERE tablename = 'comments'
  );
END $$;
