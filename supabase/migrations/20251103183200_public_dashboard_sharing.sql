-- Public Dashboard Sharing System
-- Allows dashboards to be shared publicly with unique URLs

CREATE TABLE IF NOT EXISTS public_dashboard_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dashboard reference
  dashboard_id UUID NOT NULL,
  
  -- Unique share token
  share_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'base64'),
  
  -- Share settings
  is_active BOOLEAN NOT NULL DEFAULT true,
  password_hash TEXT,
  expires_at TIMESTAMPTZ,
  
  -- Access tracking
  view_count INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  
  -- Creator
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Organization context
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  CONSTRAINT public_dashboard_shares_dashboard_unique UNIQUE (dashboard_id, share_token)
);

CREATE INDEX idx_public_dashboard_shares_token ON public_dashboard_shares(share_token) WHERE is_active = true;
CREATE INDEX idx_public_dashboard_shares_dashboard ON public_dashboard_shares(dashboard_id) WHERE is_active = true;
CREATE INDEX idx_public_dashboard_shares_org ON public_dashboard_shares(organization_id);

ALTER TABLE public_dashboard_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their organization's public shares"
  ON public_dashboard_shares FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create public shares in their organization"
  ON public_dashboard_shares FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own public shares"
  ON public_dashboard_shares FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own public shares"
  ON public_dashboard_shares FOR DELETE
  USING (created_by = auth.uid());

-- Function to validate share access
CREATE OR REPLACE FUNCTION validate_public_share_access(
  p_share_token TEXT,
  p_password TEXT DEFAULT NULL
)
RETURNS TABLE (
  is_valid BOOLEAN,
  dashboard_id UUID,
  message TEXT
) AS $$
DECLARE
  v_share RECORD;
BEGIN
  SELECT * INTO v_share
  FROM public_dashboard_shares
  WHERE share_token = p_share_token
    AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Share not found or inactive';
    RETURN;
  END IF;
  
  IF v_share.expires_at IS NOT NULL AND v_share.expires_at < NOW() THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Share has expired';
    RETURN;
  END IF;
  
  IF v_share.password_hash IS NOT NULL THEN
    IF p_password IS NULL OR crypt(p_password, v_share.password_hash) != v_share.password_hash THEN
      RETURN QUERY SELECT false, NULL::UUID, 'Invalid password';
      RETURN;
    END IF;
  END IF;
  
  -- Update view count
  UPDATE public_dashboard_shares
  SET view_count = view_count + 1,
      last_viewed_at = NOW()
  WHERE id = v_share.id;
  
  RETURN QUERY SELECT true, v_share.dashboard_id, 'Access granted'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER PUBLICATION supabase_realtime ADD TABLE public_dashboard_shares;
GRANT SELECT, INSERT, UPDATE, DELETE ON public_dashboard_shares TO authenticated;
GRANT EXECUTE ON FUNCTION validate_public_share_access TO anon, authenticated;
