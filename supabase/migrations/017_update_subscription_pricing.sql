-- =====================================================
-- UPDATE SUBSCRIPTION PRICING TIERS
-- =====================================================
-- Updates subscription plans with new pricing structure:
-- - Network: Free Forever (Ambassador, Passenger)
-- - Crew: $10/$12 monthly/annual (+ Merchant, Raider, Visitor)
-- - Team: $20/$24 monthly/annual (+ Deviator)
-- - Pro: $30/$36 monthly/annual (+ Navigator)
-- - Core: $50/$60 monthly/annual (+ Aviator)
-- - Executive: $100/$120 monthly/annual (+ Phantom)
-- =====================================================
-- PREREQUISITE: Migration 008_subscriptions_and_invitations.sql must be applied first
-- =====================================================

-- Verify that subscription_plans table exists (created in migration 008)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscription_plans') THEN
    RAISE EXCEPTION 'subscription_plans table does not exist. Please apply migration 008_subscriptions_and_invitations.sql first.';
  END IF;
END $$;

-- Delete existing plans
DELETE FROM subscription_plans WHERE id IN ('free', 'pro', 'enterprise');

-- Insert updated pricing tiers
INSERT INTO subscription_plans (id, name, description, price, interval, max_projects, max_members, max_storage_gb, available_roles, available_modules, sort_order, features) VALUES
  -- Network - Free Forever
  ('network', 'Network', 'Free Forever - Perfect for individuals getting started', 0, 'month', 3, 5, 5, 
   ARRAY['ambassador', 'passenger'],
   ARRAY['projects', 'events', 'people'],
   1,
   '{"analytics": false, "integrations": false, "customBranding": false, "prioritySupport": false}'::jsonb
  ),
  
  -- Crew - $10 monthly
  ('crew-monthly', 'Crew', 'For small teams and freelancers', 1000, 'month', 10, 15, 25,
   ARRAY['merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
   ARRAY['projects', 'events', 'people', 'assets', 'files', 'locations'],
   2,
   '{"analytics": false, "integrations": true, "customBranding": false, "prioritySupport": false}'::jsonb
  ),
  
  -- Crew - $12 annual (billed monthly equivalent)
  ('crew-annual', 'Crew', 'For small teams and freelancers (Annual)', 1200, 'year', 10, 15, 25,
   ARRAY['merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
   ARRAY['projects', 'events', 'people', 'assets', 'files', 'locations'],
   2,
   '{"analytics": false, "integrations": true, "customBranding": false, "prioritySupport": false}'::jsonb
  ),
  
  -- Team - $20 monthly
  ('team-monthly', 'Team', 'For growing teams', 2000, 'month', 25, 30, 50,
   ARRAY['deviator', 'merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
   ARRAY['projects', 'events', 'people', 'assets', 'files', 'locations', 'companies', 'resources'],
   3,
   '{"analytics": true, "integrations": true, "customBranding": false, "prioritySupport": false, "advancedReporting": false}'::jsonb
  ),
  
  -- Team - $24 annual
  ('team-annual', 'Team', 'For growing teams (Annual)', 2400, 'year', 25, 30, 50,
   ARRAY['deviator', 'merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
   ARRAY['projects', 'events', 'people', 'assets', 'files', 'locations', 'companies', 'resources'],
   3,
   '{"analytics": true, "integrations": true, "customBranding": false, "prioritySupport": false, "advancedReporting": false}'::jsonb
  ),
  
  -- Pro - $30 monthly
  ('pro-monthly', 'Pro', 'For professional teams with advanced needs', 3000, 'month', 50, 50, 100,
   ARRAY['navigator', 'deviator', 'merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
   ARRAY['projects', 'events', 'people', 'assets', 'files', 'locations', 'companies', 'finance', 'procurement', 'resources', 'jobs'],
   4,
   '{"analytics": true, "integrations": true, "customBranding": false, "prioritySupport": false, "advancedReporting": true}'::jsonb
  ),
  
  -- Pro - $36 annual
  ('pro-annual', 'Pro', 'For professional teams with advanced needs (Annual)', 3600, 'year', 50, 50, 100,
   ARRAY['navigator', 'deviator', 'merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
   ARRAY['projects', 'events', 'people', 'assets', 'files', 'locations', 'companies', 'finance', 'procurement', 'resources', 'jobs'],
   4,
   '{"analytics": true, "integrations": true, "customBranding": false, "prioritySupport": false, "advancedReporting": true}'::jsonb
  ),
  
  -- Core - $50 monthly
  ('core-monthly', 'Core', 'Core capabilities for established organizations', 5000, 'month', 100, 100, 250,
   ARRAY['aviator', 'navigator', 'deviator', 'merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
   ARRAY['projects', 'events', 'people', 'assets', 'files', 'locations', 'companies', 'finance', 'procurement', 'resources', 'jobs', 'community', 'marketplace', 'reports', 'analytics', 'insights'],
   5,
   '{"analytics": true, "integrations": true, "customBranding": true, "prioritySupport": false, "advancedReporting": true, "customWorkflows": true}'::jsonb
  ),
  
  -- Core - $60 annual
  ('core-annual', 'Core', 'Core capabilities for established organizations (Annual)', 6000, 'year', 100, 100, 250,
   ARRAY['aviator', 'navigator', 'deviator', 'merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
   ARRAY['projects', 'events', 'people', 'assets', 'files', 'locations', 'companies', 'finance', 'procurement', 'resources', 'jobs', 'community', 'marketplace', 'reports', 'analytics', 'insights'],
   5,
   '{"analytics": true, "integrations": true, "customBranding": true, "prioritySupport": false, "advancedReporting": true, "customWorkflows": true}'::jsonb
  ),
  
  -- Executive - $100 monthly
  ('executive-monthly', 'Executive', 'For large organizations with executive oversight', 10000, 'month', -1, -1, 1000,
   ARRAY['phantom', 'aviator', 'navigator', 'deviator', 'merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
   ARRAY['all'],
   6,
   '{"analytics": true, "integrations": true, "customBranding": true, "prioritySupport": true, "advancedReporting": true, "sso": true, "dedicatedSupport": true, "customization": true, "whiteLabel": true, "api": true}'::jsonb
  ),
  
  -- Executive - $120 annual
  ('executive-annual', 'Executive', 'For large organizations with executive oversight (Annual)', 12000, 'year', -1, -1, 1000,
   ARRAY['phantom', 'aviator', 'navigator', 'deviator', 'merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
   ARRAY['all'],
   6,
   '{"analytics": true, "integrations": true, "customBranding": true, "prioritySupport": true, "advancedReporting": true, "sso": true, "dedicatedSupport": true, "customization": true, "whiteLabel": true, "api": true}'::jsonb
  );

-- Update any existing subscriptions to use the new plan IDs
-- Map old plans to new plans (assuming monthly as default)
UPDATE subscriptions 
SET plan_id = 'network' 
WHERE plan_id = 'free';

UPDATE subscriptions 
SET plan_id = 'pro-monthly' 
WHERE plan_id = 'pro';

UPDATE subscriptions 
SET plan_id = 'executive-monthly' 
WHERE plan_id = 'enterprise';

-- =====================================================
-- SUBSCRIPTION PRICING UPDATE COMPLETE
-- =====================================================

COMMENT ON TABLE subscription_plans IS 'Subscription tiers: Network (Free), Crew ($10/$12), Team ($20/$24), Pro ($30/$36), Core ($50/$60), Executive ($100/$120)';
