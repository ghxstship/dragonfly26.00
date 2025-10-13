-- =============================================
-- REMAINING MODULES - Community, Marketplace, Jobs, Reports, Resources
-- Migration: 008
-- =============================================

-- =============================================
-- COMMUNITY MODULE
-- =============================================

-- Community Posts
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN ('news', 'showcase', 'activity', 'announcement')),
    
    author_id UUID NOT NULL REFERENCES auth.users(id),
    title TEXT,
    content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT '{}',
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    
    -- Visibility
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN (
        'public', 'connections', 'workspace', 'private'
    )),
    
    tags TEXT[] DEFAULT '{}',
    
    -- Moderation
    is_featured BOOLEAN DEFAULT false,
    is_sponsored BOOLEAN DEFAULT false,
    moderation_status TEXT DEFAULT 'approved' CHECK (moderation_status IN (
        'pending', 'approved', 'rejected'
    )),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Post Reactions
CREATE TABLE post_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN ('like', 'love', 'celebrate', 'insightful')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Connections (Professional Network)
CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    connected_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'accepted', 'rejected'
    )),
    
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    
    UNIQUE(user_id, connected_user_id)
);

-- =============================================
-- MARKETPLACE MODULE
-- =============================================

-- Marketplace Products
CREATE TABLE marketplace_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    vendor_id UUID NOT NULL REFERENCES companies(id),
    
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    
    -- Pricing
    price DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    pricing_model TEXT CHECK (pricing_model IN (
        'one_time', 'recurring', 'usage_based'
    )),
    
    -- Inventory
    sku TEXT UNIQUE,
    stock_quantity INTEGER,
    low_stock_threshold INTEGER,
    
    -- Media
    images TEXT[] DEFAULT '{}',
    videos TEXT[] DEFAULT '{}',
    
    -- Specs
    specifications JSONB DEFAULT '{}'::jsonb,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'active', 'out_of_stock', 'discontinued'
    )),
    
    -- Ratings
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    tags TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Marketplace Orders
CREATE TABLE marketplace_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    order_number TEXT UNIQUE NOT NULL,
    
    buyer_id UUID NOT NULL REFERENCES auth.users(id),
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
    )),
    
    subtotal DECIMAL(12, 2) NOT NULL,
    tax DECIMAL(12, 2) DEFAULT 0,
    shipping DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    shipping_address JSONB,
    billing_address JSONB,
    
    payment_method TEXT,
    payment_status TEXT CHECK (payment_status IN (
        'pending', 'paid', 'failed', 'refunded'
    )),
    
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Line Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES marketplace_orders(id) ON DELETE CASCADE,
    
    product_id UUID REFERENCES marketplace_products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- JOBS MODULE
-- =============================================

-- Job Contracts
CREATE TABLE job_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    contract_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    
    client_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    -- Scope
    scope_of_work TEXT,
    deliverables TEXT[] DEFAULT '{}',
    
    -- Financial
    contract_value DECIMAL(15, 2),
    currency TEXT DEFAULT 'USD',
    payment_terms TEXT,
    
    -- Timeline
    start_date DATE,
    end_date DATE,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'proposal', 'negotiation', 'pending_approval',
        'active', 'completed', 'cancelled', 'archived'
    )),
    
    -- Documents
    contract_document_url TEXT,
    signed_document_url TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RFPs (Request for Proposals)
CREATE TABLE rfps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    rfp_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    
    issuer_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    
    issue_date DATE NOT NULL,
    submission_deadline TIMESTAMPTZ NOT NULL,
    
    budget_min DECIMAL(12, 2),
    budget_max DECIMAL(12, 2),
    currency TEXT DEFAULT 'USD',
    
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
        'draft', 'open', 'closed', 'awarded'
    )),
    
    awarded_to UUID REFERENCES companies(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- REPORTS & ANALYTICS MODULE
-- =============================================

-- Report Templates
CREATE TABLE report_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    
    -- Configuration
    data_sources JSONB NOT NULL,
    filters JSONB DEFAULT '{}'::jsonb,
    grouping JSONB DEFAULT '{}'::jsonb,
    aggregations JSONB DEFAULT '{}'::jsonb,
    
    -- Visualization
    chart_type TEXT CHECK (chart_type IN (
        'table', 'bar', 'line', 'pie', 'scatter', 'heatmap', 'pivot'
    )),
    chart_config JSONB,
    
    -- Access
    is_public BOOLEAN DEFAULT false,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Custom Metrics
CREATE TABLE custom_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    -- Calculation
    metric_type TEXT NOT NULL CHECK (metric_type IN (
        'count', 'sum', 'average', 'percentage', 'ratio', 'custom'
    )),
    source_table TEXT NOT NULL,
    calculation_formula JSONB NOT NULL,
    
    -- Display
    unit TEXT,
    format TEXT,
    
    -- Thresholds
    target_value DECIMAL(15, 2),
    warning_threshold DECIMAL(15, 2),
    critical_threshold DECIMAL(15, 2),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- RESOURCES MODULE
-- =============================================

-- Resource Library
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    
    type TEXT NOT NULL CHECK (type IN (
        'guide', 'tutorial', 'course', 'publication', 'article', 'video', 'document'
    )),
    category TEXT,
    
    -- Media
    thumbnail_url TEXT,
    file_url TEXT,
    video_url TEXT,
    
    -- Learning
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER,
    
    -- Access
    is_public BOOLEAN DEFAULT true,
    requires_subscription BOOLEAN DEFAULT false,
    
    -- Engagement
    views_count INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    author TEXT,
    
    published_by UUID REFERENCES auth.users(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    syllabus TEXT,
    
    instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    duration_hours DECIMAL(5, 2),
    level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    
    -- Pricing
    price DECIMAL(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'published', 'archived'
    )),
    
    enrollment_count INTEGER DEFAULT 0,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Grants & Funding
CREATE TABLE grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    organization TEXT NOT NULL,
    
    amount_min DECIMAL(12, 2),
    amount_max DECIMAL(12, 2),
    currency TEXT DEFAULT 'USD',
    
    eligibility_criteria TEXT,
    application_url TEXT,
    
    application_deadline DATE,
    
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
        'upcoming', 'open', 'closed'
    )),
    
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Community
CREATE INDEX idx_community_posts_workspace ON community_posts(workspace_id);
CREATE INDEX idx_community_posts_author ON community_posts(author_id);
CREATE INDEX idx_post_reactions_post ON post_reactions(post_id);
CREATE INDEX idx_connections_user ON connections(user_id);

-- Marketplace
CREATE INDEX idx_marketplace_products_vendor ON marketplace_products(vendor_id);
CREATE INDEX idx_marketplace_orders_workspace ON marketplace_orders(workspace_id);
CREATE INDEX idx_marketplace_orders_buyer ON marketplace_orders(buyer_id);

-- Jobs
CREATE INDEX idx_job_contracts_workspace ON job_contracts(workspace_id);
CREATE INDEX idx_rfps_workspace ON rfps(workspace_id);

-- Reports
CREATE INDEX idx_report_templates_workspace ON report_templates(workspace_id);
CREATE INDEX idx_custom_metrics_workspace ON custom_metrics(workspace_id);

-- Resources
CREATE INDEX idx_resources_workspace ON resources(workspace_id);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_community_posts_updated_at
    BEFORE UPDATE ON community_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_marketplace_products_updated_at
    BEFORE UPDATE ON marketplace_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_marketplace_orders_updated_at
    BEFORE UPDATE ON marketplace_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_job_contracts_updated_at
    BEFORE UPDATE ON job_contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_report_templates_updated_at
    BEFORE UPDATE ON report_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfps ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE marketplace_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE connections;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE community_posts IS 'Community news, showcases, and announcements';
COMMENT ON TABLE marketplace_products IS 'Marketplace products and services';
COMMENT ON TABLE marketplace_orders IS 'Marketplace orders and transactions';
COMMENT ON TABLE job_contracts IS 'Job contracts and client agreements';
COMMENT ON TABLE rfps IS 'Request for Proposals';
COMMENT ON TABLE report_templates IS 'Custom report templates';
COMMENT ON TABLE resources IS 'Learning resources and documentation';
COMMENT ON TABLE courses IS 'Training courses';
COMMENT ON TABLE grants IS 'Grant opportunities and funding';
