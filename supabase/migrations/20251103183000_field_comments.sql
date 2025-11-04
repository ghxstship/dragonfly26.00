-- Field-Level Comments System
-- Allows users to comment on specific fields within records

-- Create field_comments table
CREATE TABLE IF NOT EXISTS field_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference to the record and field
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  
  -- Comment content
  content TEXT NOT NULL,
  
  -- User who created the comment
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  
  -- Organization context
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Indexes
  CONSTRAINT field_comments_table_record_field_idx UNIQUE (table_name, record_id, field_name, id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_field_comments_record ON field_comments(table_name, record_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_field_comments_user ON field_comments(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_field_comments_org ON field_comments(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_field_comments_created ON field_comments(created_at DESC) WHERE deleted_at IS NULL;

-- Enable RLS
ALTER TABLE field_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'field_comments' AND policyname = 'Users can view field comments in their organization') THEN
    CREATE POLICY "Users can view field comments in their organization"
      ON field_comments FOR SELECT
      USING (
        organization_id IN (
          SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'field_comments' AND policyname = 'Users can create field comments in their organization') THEN
    CREATE POLICY "Users can create field comments in their organization"
      ON field_comments FOR INSERT
      WITH CHECK (
        user_id = auth.uid() AND
        organization_id IN (
          SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'field_comments' AND policyname = 'Users can update their own field comments') THEN
    CREATE POLICY "Users can update their own field comments"
      ON field_comments FOR UPDATE
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'field_comments' AND policyname = 'Users can soft delete their own field comments') THEN
    CREATE POLICY "Users can soft delete their own field comments"
      ON field_comments FOR UPDATE
      USING (user_id = auth.uid() AND deleted_at IS NULL)
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_field_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'field_comments_updated_at' 
    AND tgrelid = 'field_comments'::regclass
  ) THEN
    CREATE TRIGGER field_comments_updated_at
      BEFORE UPDATE ON field_comments
      FOR EACH ROW
      EXECUTE FUNCTION update_field_comments_updated_at();
  END IF;
END $$;

-- Function to get field comments count
CREATE OR REPLACE FUNCTION get_field_comments_count(
  p_table_name TEXT,
  p_record_id UUID,
  p_field_name TEXT
)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM field_comments
    WHERE table_name = p_table_name
      AND record_id = p_record_id
      AND field_name = p_field_name
      AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all field comments for a record
CREATE OR REPLACE FUNCTION get_record_field_comments(
  p_table_name TEXT,
  p_record_id UUID
)
RETURNS TABLE (
  field_name TEXT,
  comment_count INTEGER,
  latest_comment_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fc.field_name,
    COUNT(*)::INTEGER as comment_count,
    MAX(fc.created_at) as latest_comment_at
  FROM field_comments fc
  WHERE fc.table_name = p_table_name
    AND fc.record_id = p_record_id
    AND fc.deleted_at IS NULL
  GROUP BY fc.field_name
  ORDER BY latest_comment_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'field_comments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE field_comments;
  END IF;
END $$;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON field_comments TO authenticated;
GRANT EXECUTE ON FUNCTION get_field_comments_count TO authenticated;
GRANT EXECUTE ON FUNCTION get_record_field_comments TO authenticated;
