-- Real-time Presence System

CREATE TABLE IF NOT EXISTS user_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID,
  page_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT user_presence_user_workspace_unique UNIQUE (user_id, workspace_id)
);

-- Add columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_presence' AND column_name = 'is_active') THEN
    ALTER TABLE user_presence ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_presence' AND column_name = 'page_url') THEN
    ALTER TABLE user_presence ADD COLUMN page_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_presence' AND column_name = 'last_seen_at') THEN
    ALTER TABLE user_presence ADD COLUMN last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_presence' AND column_name = 'metadata') THEN
    ALTER TABLE user_presence ADD COLUMN metadata JSONB DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_presence' AND column_name = 'organization_id') THEN
    ALTER TABLE user_presence ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_presence_workspace ON user_presence(workspace_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_presence_last_seen ON user_presence(last_seen_at DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_presence_org ON user_presence(organization_id);

ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_presence' AND policyname = 'Users can view presence in their organization') THEN
    CREATE POLICY "Users can view presence in their organization"
      ON user_presence FOR SELECT
      USING (organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid()));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_presence' AND policyname = 'Users can update their own presence') THEN
    CREATE POLICY "Users can update their own presence"
      ON user_presence FOR ALL
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Function to update presence
CREATE OR REPLACE FUNCTION update_user_presence(
  p_workspace_id UUID,
  p_page_url TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_presence_id UUID;
  v_org_id UUID;
BEGIN
  SELECT organization_id INTO v_org_id
  FROM organization_members
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  INSERT INTO user_presence (user_id, workspace_id, page_url, metadata, organization_id)
  VALUES (auth.uid(), p_workspace_id, p_page_url, p_metadata, v_org_id)
  ON CONFLICT (user_id, workspace_id)
  DO UPDATE SET
    page_url = EXCLUDED.page_url,
    is_active = true,
    last_seen_at = NOW(),
    metadata = EXCLUDED.metadata
  RETURNING id INTO v_presence_id;
  
  RETURN v_presence_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-cleanup inactive presence (5 minutes)
CREATE OR REPLACE FUNCTION cleanup_inactive_presence()
RETURNS void AS $$
BEGIN
  UPDATE user_presence
  SET is_active = false
  WHERE last_seen_at < NOW() - INTERVAL '5 minutes'
    AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Add to realtime publication if not already added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'user_presence'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_presence;
  END IF;
END $$;

GRANT SELECT, INSERT, UPDATE ON user_presence TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_presence TO authenticated;
