-- =====================================================
-- GATED INVITE & WAITLIST SYSTEM
-- =====================================================
-- Implements comprehensive waitlist and invite code system
-- to restrict platform access to invited users only
-- Version: 1.0
-- Created: 2025-01-24
-- =====================================================

-- =====================================================
-- 1. WAITLIST TABLE
-- =====================================================
-- Stores waitlist applications from prospective users
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User Information
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  company TEXT,
  role TEXT, -- Their current role/position
  use_case TEXT, -- How they plan to use the platform
  
  -- Status Tracking
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected', 'invited')),
  priority INTEGER DEFAULT 0, -- Higher = more priority (for queue management)
  
  -- Metadata
  referral_source TEXT, -- How they heard about us
  metadata JSONB DEFAULT '{}',
  
  -- Admin Notes
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  
  -- Invitation Tracking
  invited_at TIMESTAMPTZ,
  invitation_id UUID REFERENCES invitations(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_status ON waitlist(status);
CREATE INDEX idx_waitlist_priority ON waitlist(priority DESC);
CREATE INDEX idx_waitlist_created ON waitlist(created_at DESC);
CREATE INDEX idx_waitlist_reviewed_by ON waitlist(reviewed_by);

-- Comments
COMMENT ON TABLE waitlist IS 'Stores waitlist applications for gated platform access';
COMMENT ON COLUMN waitlist.status IS 'pending: awaiting review, approved: approved but not yet invited, rejected: denied access, invited: invitation sent';
COMMENT ON COLUMN waitlist.priority IS 'Higher values = higher priority in queue (0 = normal)';

-- =====================================================
-- 2. INVITE CODES TABLE
-- =====================================================
-- Shareable codes that allow users to bypass waitlist
CREATE TABLE IF NOT EXISTS invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Code Details
  code TEXT UNIQUE NOT NULL, -- e.g., "LAUNCH2025"
  description TEXT,
  
  -- Usage Limits
  max_uses INTEGER, -- NULL = unlimited
  current_uses INTEGER DEFAULT 0,
  
  -- Validity Period
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  -- Restrictions
  allowed_domains TEXT[], -- e.g., ['@company.com'] - NULL = any domain
  auto_approve BOOLEAN DEFAULT false, -- Skip waitlist and auto-create invitation
  
  -- Default Role Assignment (when auto_approve = true)
  default_role_slug TEXT REFERENCES roles(slug),
  
  -- Tracking
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_active ON invite_codes(is_active) WHERE is_active = true;
CREATE INDEX idx_invite_codes_created_by ON invite_codes(created_by);

-- Comments
COMMENT ON TABLE invite_codes IS 'Shareable invite codes for bypassing waitlist';
COMMENT ON COLUMN invite_codes.code IS 'Unique alphanumeric code (case-insensitive)';
COMMENT ON COLUMN invite_codes.auto_approve IS 'If true, creates invitation automatically without waitlist';
COMMENT ON COLUMN invite_codes.allowed_domains IS 'Email domain restrictions (e.g., @company.com)';

-- =====================================================
-- 3. INVITE CODE USAGE TABLE
-- =====================================================
-- Tracks usage of invite codes
CREATE TABLE IF NOT EXISTS invite_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  invite_code_id UUID NOT NULL REFERENCES invite_codes(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_invite_code_usage_code ON invite_code_usage(invite_code_id);
CREATE INDEX idx_invite_code_usage_email ON invite_code_usage(email);
CREATE INDEX idx_invite_code_usage_user ON invite_code_usage(user_id);

-- Comments
COMMENT ON TABLE invite_code_usage IS 'Tracks invite code redemptions';

-- =====================================================
-- 4. UPDATE INVITATIONS TABLE
-- =====================================================
-- Add source tracking and waitlist reference to existing invitations table

-- Add source column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invitations' AND column_name = 'source'
  ) THEN
    ALTER TABLE invitations 
    ADD COLUMN source TEXT DEFAULT 'manual' 
      CHECK (source IN ('manual', 'waitlist', 'invite_code', 'referral'));
  END IF;
END $$;

-- Add waitlist reference if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invitations' AND column_name = 'waitlist_id'
  ) THEN
    ALTER TABLE invitations
    ADD COLUMN waitlist_id UUID REFERENCES waitlist(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add index for waitlist_id
CREATE INDEX IF NOT EXISTS idx_invitations_waitlist ON invitations(waitlist_id);

-- Comments
COMMENT ON COLUMN invitations.source IS 'Origin of invitation: manual, waitlist, invite_code, or referral';
COMMENT ON COLUMN invitations.waitlist_id IS 'Reference to waitlist entry if invitation came from waitlist approval';

-- =====================================================
-- 5. DATABASE FUNCTIONS
-- =====================================================

-- Function: Check if email is authorized to signup
CREATE OR REPLACE FUNCTION is_email_authorized(p_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_pending_invite BOOLEAN;
BEGIN
  -- Check for pending invitation that hasn't expired
  SELECT EXISTS(
    SELECT 1 FROM invitations
    WHERE LOWER(email) = LOWER(p_email)
      AND status = 'pending'
      AND expires_at > NOW()
  ) INTO v_has_pending_invite;
  
  RETURN v_has_pending_invite;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION is_email_authorized IS 'Check if email has valid pending invitation';

-- Function: Validate and process invite code
CREATE OR REPLACE FUNCTION validate_invite_code(
  p_code TEXT,
  p_email TEXT
) RETURNS JSONB AS $$
DECLARE
  v_code_record RECORD;
  v_email_domain TEXT;
BEGIN
  -- Normalize code (uppercase, trim)
  p_code := UPPER(TRIM(p_code));
  p_email := LOWER(TRIM(p_email));
  
  -- Extract email domain
  v_email_domain := '@' || split_part(p_email, '@', 2);
  
  -- Get invite code details
  SELECT * INTO v_code_record
  FROM invite_codes
  WHERE UPPER(code) = p_code
    AND is_active = true
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_until IS NULL OR valid_until > NOW())
    AND (max_uses IS NULL OR current_uses < max_uses);
  
  -- Check if code exists and is valid
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Invalid or expired invite code'
    );
  END IF;
  
  -- Check domain restrictions
  IF v_code_record.allowed_domains IS NOT NULL THEN
    IF NOT (v_email_domain = ANY(v_code_record.allowed_domains)) THEN
      RETURN jsonb_build_object(
        'valid', false,
        'error', 'Email domain not allowed for this code'
      );
    END IF;
  END IF;
  
  -- Code is valid
  RETURN jsonb_build_object(
    'valid', true,
    'code_id', v_code_record.id,
    'auto_approve', v_code_record.auto_approve,
    'default_role_slug', v_code_record.default_role_slug
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION validate_invite_code IS 'Validate invite code and return details';

-- Function: Record invite code usage
CREATE OR REPLACE FUNCTION record_invite_code_usage(
  p_code_id UUID,
  p_email TEXT,
  p_user_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  -- Insert usage record
  INSERT INTO invite_code_usage (
    invite_code_id,
    email,
    user_id,
    ip_address,
    user_agent
  ) VALUES (
    p_code_id,
    LOWER(TRIM(p_email)),
    p_user_id,
    p_ip_address,
    p_user_agent
  );
  
  -- Increment usage count
  UPDATE invite_codes
  SET current_uses = current_uses + 1,
      updated_at = NOW()
  WHERE id = p_code_id;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION record_invite_code_usage IS 'Record invite code usage and increment counter';

-- Function: Get waitlist position
CREATE OR REPLACE FUNCTION get_waitlist_position(p_email TEXT)
RETURNS INTEGER AS $$
DECLARE
  v_position INTEGER;
BEGIN
  -- Get position in queue (ordered by priority DESC, created_at ASC)
  SELECT position INTO v_position
  FROM (
    SELECT 
      email,
      ROW_NUMBER() OVER (ORDER BY priority DESC, created_at ASC) as position
    FROM waitlist
    WHERE status = 'pending'
  ) ranked
  WHERE LOWER(email) = LOWER(p_email);
  
  RETURN COALESCE(v_position, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_waitlist_position IS 'Get user position in waitlist queue';

-- Function: Get waitlist statistics
CREATE OR REPLACE FUNCTION get_waitlist_stats()
RETURNS JSONB AS $$
DECLARE
  v_stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total', COUNT(*),
    'pending', COUNT(*) FILTER (WHERE status = 'pending'),
    'approved', COUNT(*) FILTER (WHERE status = 'approved'),
    'invited', COUNT(*) FILTER (WHERE status = 'invited'),
    'rejected', COUNT(*) FILTER (WHERE status = 'rejected'),
    'avg_wait_hours', EXTRACT(EPOCH FROM AVG(
      CASE 
        WHEN status = 'invited' AND invited_at IS NOT NULL 
        THEN invited_at - created_at 
        ELSE NULL 
      END
    )) / 3600
  ) INTO v_stats
  FROM waitlist;
  
  RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_waitlist_stats IS 'Get aggregate waitlist statistics';

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_code_usage ENABLE ROW LEVEL SECURITY;

-- WAITLIST POLICIES

-- Public can insert (submit waitlist application)
CREATE POLICY "Anyone can submit to waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (true);

-- Users can view their own entry
CREATE POLICY "Users can view their own waitlist entry"
  ON waitlist FOR SELECT
  USING (
    LOWER(email) = LOWER((SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- Legend users (level 1) can view all entries
CREATE POLICY "Legend can view all waitlist entries"
  ON waitlist FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN roles r ON ura.role_id = r.id
      WHERE ura.user_id = auth.uid()
        AND r.level = 1 -- Legend only
    )
  );

-- Legend users can update entries
CREATE POLICY "Legend can update waitlist entries"
  ON waitlist FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN roles r ON ura.role_id = r.id
      WHERE ura.user_id = auth.uid()
        AND r.level = 1 -- Legend only
    )
  );

-- Legend users can delete entries
CREATE POLICY "Legend can delete waitlist entries"
  ON waitlist FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN roles r ON ura.role_id = r.id
      WHERE ura.user_id = auth.uid()
        AND r.level = 1 -- Legend only
    )
  );

-- INVITE CODES POLICIES

-- Public can view active codes (for validation)
CREATE POLICY "Anyone can view active invite codes"
  ON invite_codes FOR SELECT
  USING (is_active = true);

-- Legend users can manage invite codes
CREATE POLICY "Legend can manage invite codes"
  ON invite_codes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN roles r ON ura.role_id = r.id
      WHERE ura.user_id = auth.uid()
        AND r.level = 1 -- Legend only
    )
  );

-- INVITE CODE USAGE POLICIES

-- Legend users can view all usage
CREATE POLICY "Legend can view invite code usage"
  ON invite_code_usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN roles r ON ura.role_id = r.id
      WHERE ura.user_id = auth.uid()
        AND r.level = 1 -- Legend only
    )
  );

-- System can insert usage records
CREATE POLICY "System can record invite code usage"
  ON invite_code_usage FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- 7. TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp on waitlist
CREATE TRIGGER update_waitlist_updated_at
  BEFORE UPDATE ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Auto-update updated_at timestamp on invite_codes
CREATE TRIGGER update_invite_codes_updated_at
  BEFORE UPDATE ON invite_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 8. INITIAL DATA
-- =====================================================

-- Insert default invite codes (optional - can be created via admin UI)
-- Uncomment to create default codes:

-- INSERT INTO invite_codes (code, description, max_uses, auto_approve, default_role_slug)
-- VALUES 
--   ('EARLYACCESS', 'Early access program', 100, false, NULL),
--   ('BETA2025', 'Beta testing program', 50, true, 'raider')
-- ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 9. GRANTS & PERMISSIONS
-- =====================================================

-- Grant necessary permissions to authenticated users
GRANT SELECT ON waitlist TO authenticated;
GRANT INSERT ON waitlist TO authenticated;
GRANT SELECT ON invite_codes TO authenticated;
GRANT SELECT ON invite_code_usage TO authenticated;

-- Grant permissions to service role (for API operations)
GRANT ALL ON waitlist TO service_role;
GRANT ALL ON invite_codes TO service_role;
GRANT ALL ON invite_code_usage TO service_role;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Add migration record
DO $$
BEGIN
  -- Log migration completion
  RAISE NOTICE 'Gated Invite & Waitlist System migration completed successfully';
  RAISE NOTICE 'Tables created: waitlist, invite_codes, invite_code_usage';
  RAISE NOTICE 'Functions created: is_email_authorized, validate_invite_code, record_invite_code_usage, get_waitlist_position, get_waitlist_stats';
  RAISE NOTICE 'RLS policies enabled on all tables';
END $$;
