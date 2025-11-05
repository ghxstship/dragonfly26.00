-- =====================================================
-- ADD BILLING CYCLE TO SUBSCRIPTIONS
-- =====================================================
-- Add billing_cycle field to track monthly vs annual billing
-- =====================================================

-- Add billing_cycle column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' 
    AND column_name = 'billing_cycle'
  ) THEN
    ALTER TABLE subscriptions 
    ADD COLUMN billing_cycle TEXT NOT NULL DEFAULT 'monthly' 
    CHECK (billing_cycle IN ('monthly', 'annual'));
  END IF;
END $$;

-- Add index for billing_cycle
CREATE INDEX IF NOT EXISTS idx_subscriptions_billing_cycle ON subscriptions(billing_cycle);

-- Update the status constraint to include all possible Stripe statuses
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE subscriptions ADD CONSTRAINT valid_status 
  CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid'));

-- Add comment
COMMENT ON COLUMN subscriptions.billing_cycle IS 'Billing cycle: monthly or annual';
