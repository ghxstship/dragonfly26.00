-- Rollup & Aggregation Fields System

CREATE TABLE IF NOT EXISTS rollup_field_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  source_table TEXT NOT NULL,
  target_table TEXT NOT NULL,
  link_field TEXT NOT NULL,
  aggregation_type TEXT NOT NULL CHECK (aggregation_type IN ('SUM', 'AVG', 'COUNT', 'MIN', 'MAX', 'CONCAT')),
  source_field TEXT,
  filter_conditions JSONB,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rollup_definitions_org ON rollup_field_definitions(organization_id);
CREATE INDEX idx_rollup_definitions_tables ON rollup_field_definitions(source_table, target_table);

ALTER TABLE rollup_field_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view rollup definitions in their organization"
  ON rollup_field_definitions FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid()));

-- Function to calculate rollup value
CREATE OR REPLACE FUNCTION calculate_rollup(
  p_definition_id UUID,
  p_target_record_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
  v_def RECORD;
  v_result NUMERIC;
  v_query TEXT;
BEGIN
  SELECT * INTO v_def FROM rollup_field_definitions WHERE id = p_definition_id;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  v_query := format(
    'SELECT %s(%s) FROM %I WHERE %I = $1',
    v_def.aggregation_type,
    COALESCE(v_def.source_field, '*'),
    v_def.source_table,
    v_def.link_field
  );
  
  EXECUTE v_query INTO v_result USING p_target_record_id;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT SELECT ON rollup_field_definitions TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_rollup TO authenticated;
