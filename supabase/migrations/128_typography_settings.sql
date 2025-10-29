-- =====================================================================================
-- TYPOGRAPHY SETTINGS MIGRATION
-- =====================================================================================
-- Description: Add typography customization at organization and user levels
-- Version: 128
-- Created: 2025-01-25
-- Dependencies: Requires organizations and user_profiles tables
-- =====================================================================================

-- =====================================================================================
-- PART 1: ORGANIZATION-LEVEL TYPOGRAPHY SETTINGS
-- =====================================================================================

-- Add typography_settings column to organizations table
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS typography_settings JSONB DEFAULT '{
  "headingFont": "Inter",
  "bodyFont": "Inter",
  "monoFont": "JetBrains Mono",
  "fontWeights": {
    "light": 300,
    "normal": 400,
    "medium": 500,
    "semibold": 600,
    "bold": 700
  },
  "fontSizes": {
    "xs": "0.75rem",
    "sm": "0.875rem",
    "base": "1rem",
    "lg": "1.125rem",
    "xl": "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem"
  },
  "lineHeights": {
    "tight": 1.25,
    "normal": 1.5,
    "relaxed": 1.75
  },
  "letterSpacing": {
    "tight": "-0.025em",
    "normal": "0em",
    "wide": "0.025em"
  }
}'::jsonb;

COMMENT ON COLUMN organizations.typography_settings IS 'Organization-wide typography settings including fonts, weights, sizes, and spacing';

-- =====================================================================================
-- PART 2: USER-LEVEL TYPOGRAPHY OVERRIDE
-- =====================================================================================

-- Add typography_override column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS typography_override JSONB DEFAULT NULL;

COMMENT ON COLUMN profiles.typography_override IS 'User-specific typography override. NULL means inherit from organization settings';

-- =====================================================================================
-- PART 3: HELPER FUNCTIONS
-- =====================================================================================

-- Function to get effective typography settings for a user
CREATE OR REPLACE FUNCTION get_user_typography_settings(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_override JSONB;
  v_org_settings JSONB;
  v_organization_id UUID;
BEGIN
  -- Get user's organization and typography override
  SELECT 
    p.typography_override,
    om.organization_id
  INTO 
    v_user_override,
    v_organization_id
  FROM profiles p
  LEFT JOIN organization_members om ON om.user_id = p.id
  WHERE p.id = p_user_id
  LIMIT 1;

  -- If user has override, return it
  IF v_user_override IS NOT NULL THEN
    RETURN v_user_override;
  END IF;

  -- Otherwise, get organization settings
  SELECT typography_settings
  INTO v_org_settings
  FROM organizations
  WHERE id = v_organization_id;

  RETURN COALESCE(v_org_settings, '{
    "headingFont": "Inter",
    "bodyFont": "Inter",
    "monoFont": "JetBrains Mono",
    "fontWeights": {"light": 300, "normal": 400, "medium": 500, "semibold": 600, "bold": 700},
    "fontSizes": {"xs": "0.75rem", "sm": "0.875rem", "base": "1rem", "lg": "1.125rem", "xl": "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem"},
    "lineHeights": {"tight": 1.25, "normal": 1.5, "relaxed": 1.75},
    "letterSpacing": {"tight": "-0.025em", "normal": "0em", "wide": "0.025em"}
  }'::jsonb);
END;
$$;

COMMENT ON FUNCTION get_user_typography_settings IS 'Get effective typography settings for a user (user override or organization default)';

-- Function to validate typography settings JSON structure
CREATE OR REPLACE FUNCTION validate_typography_settings(settings JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check required top-level keys
  IF NOT (
    settings ? 'headingFont' AND
    settings ? 'bodyFont' AND
    settings ? 'monoFont' AND
    settings ? 'fontWeights' AND
    settings ? 'fontSizes'
  ) THEN
    RETURN FALSE;
  END IF;

  -- Check fontWeights structure
  IF NOT (
    settings->'fontWeights' ? 'light' AND
    settings->'fontWeights' ? 'normal' AND
    settings->'fontWeights' ? 'medium' AND
    settings->'fontWeights' ? 'semibold' AND
    settings->'fontWeights' ? 'bold'
  ) THEN
    RETURN FALSE;
  END IF;

  -- Check fontSizes structure
  IF NOT (
    settings->'fontSizes' ? 'xs' AND
    settings->'fontSizes' ? 'sm' AND
    settings->'fontSizes' ? 'base' AND
    settings->'fontSizes' ? 'lg' AND
    settings->'fontSizes' ? 'xl'
  ) THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION validate_typography_settings IS 'Validate typography settings JSON structure';

-- =====================================================================================
-- PART 4: CONSTRAINTS
-- =====================================================================================

-- Add constraint to validate organization typography settings
ALTER TABLE organizations
ADD CONSTRAINT valid_typography_settings
CHECK (
  typography_settings IS NULL OR
  validate_typography_settings(typography_settings)
);

-- Add constraint to validate user typography override
ALTER TABLE profiles
ADD CONSTRAINT valid_typography_override
CHECK (
  typography_override IS NULL OR
  validate_typography_settings(typography_override)
);

-- =====================================================================================
-- PART 5: RLS POLICIES
-- =====================================================================================

-- Organization typography settings policies
-- Users can read their organization's typography settings
CREATE POLICY "Users can read organization typography settings"
ON organizations
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Only Phantom and Aviator can update organization typography settings
CREATE POLICY "Phantom and Aviator can update organization typography"
ON organizations
FOR UPDATE
TO authenticated
USING (
  user_has_permission(auth.uid(), 'organization.settings.update')
)
WITH CHECK (
  user_has_permission(auth.uid(), 'organization.settings.update')
);

-- User typography override policies
-- Users can read their own typography override
CREATE POLICY "Users can read own typography override"
ON profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can update their own typography override
CREATE POLICY "Users can update own typography override"
ON profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- =====================================================================================
-- PART 6: INDEXES
-- =====================================================================================

-- Index for faster typography settings lookups
CREATE INDEX IF NOT EXISTS idx_organizations_typography_settings 
ON organizations USING GIN (typography_settings);

CREATE INDEX IF NOT EXISTS idx_profiles_typography_override 
ON profiles USING GIN (typography_override);

-- =====================================================================================
-- PART 7: REALTIME PUBLICATION
-- =====================================================================================

-- Enable realtime for typography changes
-- Organizations table should already be published
-- User_profiles table should already be published

-- =====================================================================================
-- PART 8: AUDIT LOGGING
-- =====================================================================================

-- Typography changes will be automatically logged by existing audit triggers
-- on organizations and user_profiles tables

-- =====================================================================================
-- PART 9: DEFAULT DATA
-- =====================================================================================

-- Update existing organizations with default typography settings if NULL
UPDATE organizations
SET typography_settings = '{
  "headingFont": "Inter",
  "bodyFont": "Inter",
  "monoFont": "JetBrains Mono",
  "fontWeights": {
    "light": 300,
    "normal": 400,
    "medium": 500,
    "semibold": 600,
    "bold": 700
  },
  "fontSizes": {
    "xs": "0.75rem",
    "sm": "0.875rem",
    "base": "1rem",
    "lg": "1.125rem",
    "xl": "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem"
  },
  "lineHeights": {
    "tight": 1.25,
    "normal": 1.5,
    "relaxed": 1.75
  },
  "letterSpacing": {
    "tight": "-0.025em",
    "normal": "0em",
    "wide": "0.025em"
  }
}'::jsonb
WHERE typography_settings IS NULL;

-- =====================================================================================
-- MIGRATION COMPLETE
-- =====================================================================================
-- Summary:
-- ✅ Added typography_settings to organizations table
-- ✅ Added typography_override to user_profiles table
-- ✅ Created helper functions for getting effective settings
-- ✅ Added validation constraints
-- ✅ Created RLS policies for proper access control
-- ✅ Added indexes for performance
-- ✅ Updated existing organizations with defaults
-- =====================================================================================
