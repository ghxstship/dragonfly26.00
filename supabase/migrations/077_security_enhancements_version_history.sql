-- Version History System

CREATE TABLE IF NOT EXISTS version_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  changes JSONB NOT NULL,
  previous_data JSONB,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT version_history_unique UNIQUE (table_name, record_id, version_number)
);

CREATE INDEX idx_version_history_record ON version_history(table_name, record_id, version_number DESC);
CREATE INDEX idx_version_history_user ON version_history(user_id);
CREATE INDEX idx_version_history_created ON version_history(created_at DESC);

ALTER TABLE version_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view version history in their organization"
  ON version_history FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid()));

-- Function to create version snapshot
CREATE OR REPLACE FUNCTION create_version_snapshot(
  p_table_name TEXT,
  p_record_id UUID,
  p_changes JSONB,
  p_previous_data JSONB
)
RETURNS UUID AS $$
DECLARE
  v_version_number INTEGER;
  v_version_id UUID;
  v_org_id UUID;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO v_version_number
  FROM version_history
  WHERE table_name = p_table_name AND record_id = p_record_id;
  
  SELECT organization_id INTO v_org_id
  FROM organization_members
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  INSERT INTO version_history (
    table_name, record_id, version_number, changes, previous_data, user_id, organization_id
  ) VALUES (
    p_table_name, p_record_id, v_version_number, p_changes, p_previous_data, auth.uid(), v_org_id
  ) RETURNING id INTO v_version_id;
  
  RETURN v_version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER PUBLICATION supabase_realtime ADD TABLE version_history;
GRANT SELECT ON version_history TO authenticated;
GRANT EXECUTE ON FUNCTION create_version_snapshot TO authenticated;
