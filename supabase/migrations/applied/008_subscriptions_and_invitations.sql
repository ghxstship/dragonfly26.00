-- =====================================================
-- SUBSCRIPTIONS & INVITATIONS SYSTEM
-- =====================================================
-- Adds support for:
-- - Stripe subscription management
-- - Team invitations (within and outside organization)
-- - Usage tracking and limits
-- =====================================================

-- =====================================================
-- 1. SUBSCRIPTION PLANS (Static reference data)
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- In cents
  interval TEXT NOT NULL, -- 'month' or 'year'
  stripe_price_id TEXT,
  
  -- Limits
  max_projects INTEGER,
  max_members INTEGER,
  max_storage_gb INTEGER,
  
  -- Features
  features JSONB NOT NULL DEFAULT '{}',
  available_roles TEXT[] DEFAULT ARRAY['raider', 'deviator'],
  available_modules TEXT[] DEFAULT ARRAY['projects', 'events', 'people'],
  
  -- Metadata
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default plans
INSERT INTO subscription_plans (id, name, description, price, interval, max_projects, max_members, max_storage_gb, available_roles, available_modules, sort_order, features) VALUES
  ('free', 'Starter', 'Perfect for trying out the platform', 0, 'month', 3, 10, 5, 
   ARRAY['raider', 'deviator'],
   ARRAY['projects', 'events', 'people'],
   1,
   '{"analytics": false, "integrations": false, "customBranding": false, "prioritySupport": false}'::jsonb
  ),
  
  ('pro', 'Professional', 'For growing teams and production companies', 4900, 'month', 25, 50, 100,
   ARRAY['raider', 'deviator', 'navigator', 'gladiator'],
   ARRAY['projects', 'events', 'people', 'assets', 'locations', 'files', 'companies', 'finance', 'procurement', 'community', 'marketplace', 'resources', 'jobs', 'reports', 'analytics', 'insights'],
   2,
   '{"analytics": true, "integrations": true, "customBranding": false, "prioritySupport": false, "advancedReporting": true}'::jsonb
  ),
  
  ('enterprise', 'Enterprise', 'For large organizations with advanced needs', 14900, 'month', -1, -1, 1000,
   ARRAY['legend', 'phantom', 'aviator', 'gladiator', 'navigator', 'deviator', 'raider', 'merchant', 'visitor', 'passenger', 'ambassador'],
   ARRAY['all'],
   3,
   '{"analytics": true, "integrations": true, "customBranding": true, "prioritySupport": true, "advancedReporting": true, "sso": true, "dedicatedSupport": true, "customization": true}'::jsonb
  );

-- =====================================================
-- 2. SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Stripe integration
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  
  -- Plan details
  plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'trialing', 'past_due', 'canceled', 'incomplete'
  
  -- Billing period
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  
  -- Trial
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- Usage tracking
  seats_used INTEGER DEFAULT 1,
  seats_included INTEGER,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired'))
);

-- Indexes
CREATE INDEX idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_workspace ON subscriptions(workspace_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);

-- =====================================================
-- 3. SUBSCRIPTION USAGE TRACKING
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  
  -- Usage metrics
  metric TEXT NOT NULL, -- 'projects', 'members', 'storage_gb', 'api_calls'
  value NUMERIC NOT NULL,
  limit_value NUMERIC,
  
  -- Time period
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_metric CHECK (metric IN ('projects', 'members', 'storage_gb', 'api_calls', 'custom'))
);

CREATE INDEX idx_usage_subscription ON subscription_usage(subscription_id);
CREATE INDEX idx_usage_metric ON subscription_usage(metric);
CREATE INDEX idx_usage_period ON subscription_usage(period_start, period_end);

-- =====================================================
-- 4. INVITATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Who sent it
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Who is invited
  email TEXT NOT NULL,
  role_slug TEXT NOT NULL REFERENCES roles(slug),
  
  -- Invitation details
  token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'expired', 'revoked'
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  
  -- Optional scope (for scoped roles)
  project_id UUID,
  team_id UUID,
  department_id UUID,
  
  -- Personalization
  message TEXT,
  inviter_name TEXT,
  
  -- Acceptance tracking
  accepted_at TIMESTAMPTZ,
  accepted_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'expired', 'revoked'))
);

-- Indexes
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_status ON invitations(status) WHERE status = 'pending';
CREATE INDEX idx_invitations_workspace ON invitations(workspace_id);
CREATE INDEX idx_invitations_expires ON invitations(expires_at) WHERE status = 'pending';

-- Unique constraint for pending invitations (partial unique index)
CREATE UNIQUE INDEX unique_pending_invite ON invitations(email, workspace_id) WHERE status = 'pending';

-- =====================================================
-- 5. PROFILES TABLE UPDATES
-- =====================================================
-- Create profiles table if it doesn't exist
-- This extends auth.users with additional user data
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic profile info
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    
    -- Preferences
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    
    -- Notifications
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create basic indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- Enable RLS if not already enabled
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'profiles' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create RLS policies if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile"
            ON profiles FOR SELECT
            USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile"
            ON profiles FOR UPDATE
            USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile"
            ON profiles FOR INSERT
            WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();

-- Add Stripe customer ID to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Check if organization has reached plan limits
CREATE OR REPLACE FUNCTION check_plan_limit(
  p_organization_id UUID,
  p_limit_type TEXT -- 'projects', 'members', 'storage'
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_count INTEGER;
  v_limit INTEGER;
  v_plan_id TEXT;
BEGIN
  -- Get current subscription and plan
  SELECT s.plan_id INTO v_plan_id
  FROM subscriptions s
  WHERE s.organization_id = p_organization_id
    AND s.status IN ('active', 'trialing')
  ORDER BY s.created_at DESC
  LIMIT 1;

  IF v_plan_id IS NULL THEN
    -- No subscription, use free tier limits
    v_plan_id := 'free';
  END IF;

  -- Get plan limit
  IF p_limit_type = 'projects' THEN
    SELECT max_projects INTO v_limit FROM subscription_plans WHERE id = v_plan_id;
    SELECT COUNT(*) INTO v_current_count FROM projects WHERE organization_id = p_organization_id;
  ELSIF p_limit_type = 'members' THEN
    SELECT max_members INTO v_limit FROM subscription_plans WHERE id = v_plan_id;
    SELECT COUNT(*) INTO v_current_count FROM organization_members 
    WHERE organization_id = p_organization_id;
  ELSE
    RETURN true; -- Unknown limit type, allow
  END IF;

  -- -1 means unlimited
  IF v_limit = -1 THEN
    RETURN true;
  END IF;

  RETURN v_current_count < v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get active subscription for organization
CREATE OR REPLACE FUNCTION get_active_subscription(p_organization_id UUID)
RETURNS TABLE (
  subscription_id UUID,
  plan_id TEXT,
  plan_name TEXT,
  status TEXT,
  current_period_end TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.plan_id,
    sp.name,
    s.status,
    s.current_period_end
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.organization_id = p_organization_id
    AND s.status IN ('active', 'trialing')
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if role is available in current plan
CREATE OR REPLACE FUNCTION role_available_in_plan(
  p_organization_id UUID,
  p_role_slug TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_available_roles TEXT[];
BEGIN
  SELECT sp.available_roles INTO v_available_roles
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.organization_id = p_organization_id
    AND s.status IN ('active', 'trialing')
  ORDER BY s.created_at DESC
  LIMIT 1;

  IF v_available_roles IS NULL THEN
    -- No subscription, use free tier
    SELECT available_roles INTO v_available_roles 
    FROM subscription_plans WHERE id = 'free';
  END IF;

  -- Check if 'all' is in array (enterprise plan)
  IF 'all' = ANY(v_available_roles) THEN
    RETURN true;
  END IF;

  RETURN p_role_slug = ANY(v_available_roles);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-expire invitations
CREATE OR REPLACE FUNCTION expire_invitations()
RETURNS void AS $$
BEGIN
  UPDATE invitations
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. RLS POLICIES
-- =====================================================

-- Subscription Plans (public read)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are viewable by everyone"
  ON subscription_plans FOR SELECT
  USING (is_active = true);

-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view subscriptions in their organization"
  ON subscriptions FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization admins can manage subscriptions"
  ON subscriptions FOR ALL
  USING (
    organization_id IN (
      SELECT om.organization_id 
      FROM organization_members om
      JOIN user_role_assignments ura ON om.user_id = ura.user_id
      JOIN roles r ON ura.role_id = r.id
      WHERE om.user_id = auth.uid()
        AND r.level <= 2 -- Phantom or Legend only
    )
  );

-- Subscription Usage
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view usage in their subscription"
  ON subscription_usage FOR SELECT
  USING (
    subscription_id IN (
      SELECT s.id FROM subscriptions s
      WHERE s.organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

-- Invitations
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invitations they sent"
  ON invitations FOR SELECT
  USING (invited_by = auth.uid());

CREATE POLICY "Users can view invitations sent to their email"
  ON invitations FOR SELECT
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users with permission can send invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    invited_by = auth.uid()
    AND organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own invitations"
  ON invitations FOR UPDATE
  USING (invited_by = auth.uid());

-- =====================================================
-- 8. TRIGGERS
-- =====================================================

-- Auto-update timestamps
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 9. COMMENTS
-- =====================================================

COMMENT ON TABLE subscription_plans IS 'Available subscription tiers (Free, Pro, Enterprise)';
COMMENT ON TABLE subscriptions IS 'Active subscriptions with Stripe integration';
COMMENT ON TABLE subscription_usage IS 'Usage tracking for plan limits enforcement';
COMMENT ON TABLE invitations IS 'Team invitations (within and outside organization)';

COMMENT ON COLUMN subscriptions.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN subscriptions.stripe_subscription_id IS 'Stripe subscription ID';
COMMENT ON COLUMN invitations.token IS 'Secure random token for invitation acceptance';
COMMENT ON COLUMN invitations.expires_at IS 'Invitation expiration (default 7 days)';

-- =====================================================
-- SUBSCRIPTIONS & INVITATIONS MIGRATION COMPLETE
-- =====================================================
