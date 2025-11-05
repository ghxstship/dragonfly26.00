-- =============================================
-- ANALYTICS & INSIGHTS MODULES (MISSING FROM ORIGINAL)
-- Migration: 011
-- =============================================

-- =============================================
-- ANALYTICS MODULE
-- =============================================

-- Custom Metrics (already exists, but adding more fields)
-- Already created in 008_remaining_modules.sql

-- Data Sources
CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'database', 'api', 'file', 'spreadsheet', 'external'
    )),
    
    connection_config JSONB NOT NULL,
    refresh_frequency TEXT, -- 'hourly', 'daily', 'weekly', 'manual'
    last_synced_at TIMESTAMPTZ,
    
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'active', 'paused', 'error', 'disconnected'
    )),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Saved Analytics Views
CREATE TABLE analytics_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN (
        'dashboard', 'chart', 'pivot', 'comparison', 'trend', 'realtime'
    )),
    
    config JSONB NOT NULL, -- Chart config, filters, aggregations
    data_source_id UUID REFERENCES data_sources(id) ON DELETE SET NULL,
    
    is_public BOOLEAN DEFAULT false,
    is_realtime BOOLEAN DEFAULT false,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Benchmarks
CREATE TABLE benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    metric TEXT NOT NULL,
    
    target_value DECIMAL(15, 2) NOT NULL,
    current_value DECIMAL(15, 2),
    industry_average DECIMAL(15, 2),
    
    unit TEXT,
    period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    
    status TEXT CHECK (status IN ('above_target', 'on_target', 'below_target')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INSIGHTS MODULE (Strategic Intelligence)
-- =============================================

-- Strategic Objectives (OKRs)
CREATE TABLE objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    period TEXT NOT NULL CHECK (period IN ('quarterly', 'yearly', 'custom')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'draft', 'active', 'completed', 'abandoned'
    )),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Key Results
CREATE TABLE key_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    objective_id UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    
    metric_type TEXT NOT NULL CHECK (metric_type IN (
        'percentage', 'number', 'currency', 'boolean'
    )),
    
    current_value DECIMAL(15, 2) DEFAULT 0,
    target_value DECIMAL(15, 2) NOT NULL,
    unit TEXT,
    
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status TEXT NOT NULL DEFAULT 'on_track' CHECK (status IN (
        'on_track', 'at_risk', 'off_track', 'completed'
    )),
    
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Strategic Priorities
CREATE TABLE strategic_priorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    
    priority_rank INTEGER NOT NULL,
    category TEXT,
    
    impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 10),
    effort_score INTEGER CHECK (effort_score >= 1 AND effort_score <= 10),
    
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'active', 'completed', 'deferred', 'cancelled'
    )),
    
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Strategic Reviews
CREATE TABLE strategic_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'quarterly_review', 'annual_review', 'retrospective', 'planning_session'
    )),
    
    review_date DATE NOT NULL,
    
    attendees UUID[] DEFAULT '{}',
    facilitator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    summary TEXT,
    action_items JSONB DEFAULT '[]'::jsonb,
    
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'in_progress', 'completed'
    )),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI-Generated Recommendations
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    
    confidence_score DECIMAL(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    impact_level TEXT CHECK (impact_level IN ('low', 'medium', 'high', 'critical')),
    
    data_sources JSONB,
    
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
        'new', 'reviewing', 'accepted', 'implemented', 'rejected'
    )),
    
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Intelligence Feed Items
CREATE TABLE intelligence_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT NOT NULL,
    
    category TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    related_entity_type TEXT,
    related_entity_id UUID,
    
    is_read BOOLEAN DEFAULT false,
    is_actionable BOOLEAN DEFAULT false,
    
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Analytics
CREATE INDEX idx_data_sources_workspace ON data_sources(workspace_id);
CREATE INDEX idx_data_sources_status ON data_sources(status);
CREATE INDEX idx_analytics_views_workspace ON analytics_views(workspace_id);
CREATE INDEX idx_benchmarks_workspace ON benchmarks(workspace_id);
CREATE INDEX idx_benchmarks_category ON benchmarks(category);

-- Insights
CREATE INDEX idx_objectives_workspace ON objectives(workspace_id);
CREATE INDEX idx_objectives_owner ON objectives(owner_id);
CREATE INDEX idx_objectives_period ON objectives(period, start_date, end_date);
CREATE INDEX idx_key_results_objective ON key_results(objective_id);
CREATE INDEX idx_key_results_workspace ON key_results(workspace_id);
CREATE INDEX idx_priorities_workspace ON strategic_priorities(workspace_id);
CREATE INDEX idx_priorities_rank ON strategic_priorities(priority_rank);
CREATE INDEX idx_reviews_workspace ON strategic_reviews(workspace_id);
CREATE INDEX idx_recommendations_workspace ON ai_recommendations(workspace_id);
CREATE INDEX idx_recommendations_status ON ai_recommendations(status);
CREATE INDEX idx_intelligence_workspace ON intelligence_feed(workspace_id);
CREATE INDEX idx_intelligence_priority ON intelligence_feed(priority);

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_data_sources_updated_at
    BEFORE UPDATE ON data_sources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_analytics_views_updated_at
    BEFORE UPDATE ON analytics_views
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_benchmarks_updated_at
    BEFORE UPDATE ON benchmarks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_objectives_updated_at
    BEFORE UPDATE ON objectives
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_key_results_updated_at
    BEFORE UPDATE ON key_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_priorities_updated_at
    BEFORE UPDATE ON strategic_priorities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON strategic_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_feed ENABLE ROW LEVEL SECURITY;

-- Standard workspace policies (abbreviated - same pattern as other modules)

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE analytics_views;
ALTER PUBLICATION supabase_realtime ADD TABLE benchmarks;
ALTER PUBLICATION supabase_realtime ADD TABLE objectives;
ALTER PUBLICATION supabase_realtime ADD TABLE key_results;
ALTER PUBLICATION supabase_realtime ADD TABLE ai_recommendations;
ALTER PUBLICATION supabase_realtime ADD TABLE intelligence_feed;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE data_sources IS 'External data source connections for analytics';
COMMENT ON TABLE analytics_views IS 'Saved analytics dashboards and visualizations';
COMMENT ON TABLE benchmarks IS 'Performance benchmarks and KPIs';
COMMENT ON TABLE objectives IS 'Strategic objectives (OKR framework)';
COMMENT ON TABLE key_results IS 'Measurable key results for objectives';
COMMENT ON TABLE strategic_priorities IS 'Ranked strategic priorities';
COMMENT ON TABLE strategic_reviews IS 'Quarterly and annual strategic reviews';
COMMENT ON TABLE ai_recommendations IS 'AI-generated strategic recommendations';
COMMENT ON TABLE intelligence_feed IS 'Curated intelligence from all data sources';
