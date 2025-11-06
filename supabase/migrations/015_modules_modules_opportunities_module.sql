-- =====================================================
-- OPPORTUNITIES MODULE - Database Schema
-- =====================================================
-- New module for Jobs, Careers, Sponsorship, and Grants
-- Includes web scraping support for global grant discovery
-- Date: 2025-01-20
-- =====================================================

-- =====================================================
-- OPPORTUNITY JOBS TABLE
-- =====================================================
-- Contractor and subcontractor job opportunities
CREATE TABLE IF NOT EXISTS opportunity_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Job Details
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('contractor', 'subcontractor', 'freelance')),
  location TEXT NOT NULL,
  rate TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  requirements TEXT[],
  
  -- Status
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'filled', 'closed')),
  posted_by UUID REFERENCES auth.users(id),
  posted_date TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- OPPORTUNITY CAREERS TABLE
-- =====================================================
-- Staffing and permanent career opportunities
CREATE TABLE IF NOT EXISTS opportunity_careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Career Details
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  department TEXT,
  level TEXT NOT NULL CHECK (level IN ('entry', 'mid', 'senior', 'executive')),
  salary TEXT NOT NULL,
  benefits TEXT[],
  description TEXT,
  requirements TEXT[],
  
  -- Application Tracking
  applicants_count INTEGER DEFAULT 0,
  posted_date TIMESTAMPTZ DEFAULT NOW(),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'filled', 'closed')),
  posted_by UUID REFERENCES auth.users(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- OPPORTUNITY SPONSORSHIPS TABLE
-- =====================================================
-- Brand sponsorship opportunities (inspired by onbrand.com)
CREATE TABLE IF NOT EXISTS opportunity_sponsorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Sponsorship Details
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  value TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  benefits TEXT[],
  requirements TEXT[],
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'closed')),
  posted_by UUID REFERENCES auth.users(id),
  posted_date TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- OPPORTUNITY GRANTS TABLE
-- =====================================================
-- Global grant opportunities (moved from Resources)
-- Supports web scraping for global grant discovery
CREATE TABLE IF NOT EXISTS opportunity_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Grant Details
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  amount TEXT NOT NULL,
  region TEXT NOT NULL,
  category TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  description TEXT,
  eligibility TEXT[],
  
  -- Source Tracking (for web scraping)
  source_url TEXT,
  source_name TEXT,
  scraped_at TIMESTAMPTZ,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closing-soon', 'closed')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- OPPORTUNITY FEATURED TABLE
-- =====================================================
-- Featured opportunities for spotlight page
CREATE TABLE IF NOT EXISTS opportunity_featured (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Reference to opportunity
  opportunity_type TEXT NOT NULL CHECK (opportunity_type IN ('job', 'career', 'sponsorship', 'grant')),
  opportunity_id UUID NOT NULL,
  
  -- Featured Settings
  active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  featured_until TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Opportunity Jobs Indexes
CREATE INDEX idx_opportunity_jobs_workspace ON opportunity_jobs(workspace_id);
CREATE INDEX idx_opportunity_jobs_status ON opportunity_jobs(status);
CREATE INDEX idx_opportunity_jobs_type ON opportunity_jobs(type);
CREATE INDEX idx_opportunity_jobs_posted_date ON opportunity_jobs(posted_date DESC);

-- Opportunity Careers Indexes
CREATE INDEX idx_opportunity_careers_workspace ON opportunity_careers(workspace_id);
CREATE INDEX idx_opportunity_careers_status ON opportunity_careers(status);
CREATE INDEX idx_opportunity_careers_level ON opportunity_careers(level);
CREATE INDEX idx_opportunity_careers_posted_date ON opportunity_careers(posted_date DESC);

-- Opportunity Sponsorships Indexes
CREATE INDEX idx_opportunity_sponsorships_workspace ON opportunity_sponsorships(workspace_id);
CREATE INDEX idx_opportunity_sponsorships_status ON opportunity_sponsorships(status);
CREATE INDEX idx_opportunity_sponsorships_category ON opportunity_sponsorships(category);

-- Opportunity Grants Indexes
CREATE INDEX idx_opportunity_grants_workspace ON opportunity_grants(workspace_id);
CREATE INDEX idx_opportunity_grants_status ON opportunity_grants(status);
CREATE INDEX idx_opportunity_grants_deadline ON opportunity_grants(deadline);
CREATE INDEX idx_opportunity_grants_region ON opportunity_grants(region);
CREATE INDEX idx_opportunity_grants_category ON opportunity_grants(category);

-- Opportunity Featured Indexes
CREATE INDEX idx_opportunity_featured_workspace ON opportunity_featured(workspace_id);
CREATE INDEX idx_opportunity_featured_active ON opportunity_featured(active);
CREATE INDEX idx_opportunity_featured_priority ON opportunity_featured(priority DESC);

-- =====================================================
-- WORKSPACE MEMBERS TABLE (if not exists)
-- =====================================================
-- Create workspace_members table if it doesn't exist yet
-- (will be created properly in migration 021, but we need it now)
CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
    invited_by UUID REFERENCES auth.users(id),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE opportunity_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_featured ENABLE ROW LEVEL SECURITY;

-- Opportunity Jobs RLS Policies
CREATE POLICY "Users can view jobs in their workspace"
  ON opportunity_jobs FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can create jobs in their workspace"
  ON opportunity_jobs FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update jobs in their workspace"
  ON opportunity_jobs FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete jobs in their workspace"
  ON opportunity_jobs FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Opportunity Careers RLS Policies
CREATE POLICY "Users can view careers in their workspace"
  ON opportunity_careers FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can create careers in their workspace"
  ON opportunity_careers FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update careers in their workspace"
  ON opportunity_careers FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete careers in their workspace"
  ON opportunity_careers FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Opportunity Sponsorships RLS Policies
CREATE POLICY "Users can view sponsorships in their workspace"
  ON opportunity_sponsorships FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can create sponsorships in their workspace"
  ON opportunity_sponsorships FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update sponsorships in their workspace"
  ON opportunity_sponsorships FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete sponsorships in their workspace"
  ON opportunity_sponsorships FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Opportunity Grants RLS Policies
CREATE POLICY "Users can view grants in their workspace"
  ON opportunity_grants FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can create grants in their workspace"
  ON opportunity_grants FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update grants in their workspace"
  ON opportunity_grants FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete grants in their workspace"
  ON opportunity_grants FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Opportunity Featured RLS Policies
CREATE POLICY "Users can view featured opportunities in their workspace"
  ON opportunity_featured FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can create featured opportunities in their workspace"
  ON opportunity_featured FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update featured opportunities in their workspace"
  ON opportunity_featured FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete featured opportunities in their workspace"
  ON opportunity_featured FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp on row update
CREATE OR REPLACE FUNCTION update_opportunities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_opportunity_jobs_updated_at
  BEFORE UPDATE ON opportunity_jobs
  FOR EACH ROW EXECUTE FUNCTION update_opportunities_updated_at();

CREATE TRIGGER update_opportunity_careers_updated_at
  BEFORE UPDATE ON opportunity_careers
  FOR EACH ROW EXECUTE FUNCTION update_opportunities_updated_at();

CREATE TRIGGER update_opportunity_sponsorships_updated_at
  BEFORE UPDATE ON opportunity_sponsorships
  FOR EACH ROW EXECUTE FUNCTION update_opportunities_updated_at();

CREATE TRIGGER update_opportunity_grants_updated_at
  BEFORE UPDATE ON opportunity_grants
  FOR EACH ROW EXECUTE FUNCTION update_opportunities_updated_at();

CREATE TRIGGER update_opportunity_featured_updated_at
  BEFORE UPDATE ON opportunity_featured
  FOR EACH ROW EXECUTE FUNCTION update_opportunities_updated_at();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE opportunity_jobs IS 'Contractor and subcontractor job opportunities';
COMMENT ON TABLE opportunity_careers IS 'Staffing and permanent career opportunities';
COMMENT ON TABLE opportunity_sponsorships IS 'Brand sponsorship opportunities';
COMMENT ON TABLE opportunity_grants IS 'Global grant opportunities with web scraping support';
COMMENT ON TABLE opportunity_featured IS 'Featured opportunities for spotlight page';
