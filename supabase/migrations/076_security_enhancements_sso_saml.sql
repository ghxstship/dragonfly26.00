-- SSO/SAML Configuration System

CREATE TABLE IF NOT EXISTS sso_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('SAML', 'OIDC', 'OAuth2')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sso_providers_org_name_unique UNIQUE (organization_id, name)
);

CREATE INDEX idx_sso_providers_org ON sso_providers(organization_id) WHERE is_active = true;
CREATE INDEX idx_sso_providers_type ON sso_providers(provider_type);

ALTER TABLE sso_providers ENABLE ROW LEVEL SECURITY;

-- Simplified policy - users can manage SSO providers in their organization
CREATE POLICY "Users can manage SSO providers in their organization"
  ON sso_providers FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- SSO login attempts tracking
CREATE TABLE IF NOT EXISTS sso_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES sso_providers(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sso_attempts_provider ON sso_login_attempts(provider_id, created_at DESC);
CREATE INDEX idx_sso_attempts_email ON sso_login_attempts(email, created_at DESC);

ALTER TABLE sso_login_attempts ENABLE ROW LEVEL SECURITY;

-- Simplified policy - users can view SSO login attempts for their organization
CREATE POLICY "Users can view SSO login attempts in their organization"
  ON sso_login_attempts FOR SELECT
  USING (
    provider_id IN (
      SELECT sp.id FROM sso_providers sp
      WHERE sp.organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

GRANT SELECT, INSERT, UPDATE ON sso_providers TO authenticated;
GRANT SELECT, INSERT ON sso_login_attempts TO authenticated;
