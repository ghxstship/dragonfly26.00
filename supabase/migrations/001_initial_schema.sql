-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- =============================================
-- ORGANIZATIONS & WORKSPACES
-- =============================================

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business', 'enterprise')),
    subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'trialing')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#7c3aed',
    icon TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organization members table
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
    invited_by UUID REFERENCES auth.users(id),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- =============================================
-- CUSTOM FIELDS & CONFIGURATION
-- =============================================

-- Custom fields table
CREATE TABLE custom_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'number', 'date', 'select', 'multi-select', 'checkbox', 'url', 'email', 'phone', 'currency', 'percent', 'duration', 'rating', 'file', 'user', 'relation')),
    options JSONB,
    required BOOLEAN DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Module configuration table
CREATE TABLE module_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    table_name TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workspace_id, module_id)
);

-- =============================================
-- VIEWS & TEMPLATES
-- =============================================

-- Views table
CREATE TABLE views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('list', 'board', 'table', 'calendar', 'timeline', 'workload', 'map', 'mind-map', 'form', 'activity', 'box', 'embed', 'chat', 'dashboard', 'doc', 'financial', 'portfolio', 'pivot')),
    config JSONB DEFAULT '{}'::jsonb,
    permission TEXT NOT NULL DEFAULT 'private' CHECK (permission IN ('private', 'team', 'public')),
    is_default BOOLEAN DEFAULT false,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    module_type TEXT,
    view_type TEXT,
    preview_url TEXT,
    price INTEGER DEFAULT 0,
    is_free BOOLEAN DEFAULT true,
    vendor_id UUID REFERENCES auth.users(id),
    downloads INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ACTIVITY & COLLABORATION
-- =============================================

-- Activities table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User presence table
CREATE TABLE user_presence (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    location TEXT NOT NULL,
    cursor JSONB,
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- GENERIC DATA TABLES (EXAMPLES)
-- =============================================

-- Projects table (example module)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo',
    priority TEXT DEFAULT 'normal',
    assignee UUID REFERENCES auth.users(id),
    start_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}'::jsonb,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- People table (example module)
CREATE TABLE people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT,
    department TEXT,
    status TEXT DEFAULT 'active',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE views ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view their organizations"
    ON organizations FOR SELECT
    USING (id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Owners and admins can update their organizations"
    ON organizations FOR UPDATE
    USING (id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ));

-- Workspaces policies
CREATE POLICY "Users can view workspaces in their organizations"
    ON workspaces FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage workspaces"
    ON workspaces FOR ALL
    USING (organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ));

-- Projects policies (example)
CREATE POLICY "Users can view projects in their workspaces"
    ON projects FOR SELECT
    USING (workspace_id IN (
        SELECT w.id FROM workspaces w
        JOIN organization_members om ON w.organization_id = om.organization_id
        WHERE om.user_id = auth.uid()
    ));

CREATE POLICY "Users can create projects in their workspaces"
    ON projects FOR INSERT
    WITH CHECK (workspace_id IN (
        SELECT w.id FROM workspaces w
        JOIN organization_members om ON w.organization_id = om.organization_id
        WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin', 'member')
    ));

CREATE POLICY "Users can update their own projects or if they're admin"
    ON projects FOR UPDATE
    USING (
        created_by = auth.uid() OR
        workspace_id IN (
            SELECT w.id FROM workspaces w
            JOIN organization_members om ON w.organization_id = om.organization_id
            WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can delete their own projects or if they're admin"
    ON projects FOR DELETE
    USING (
        created_by = auth.uid() OR
        workspace_id IN (
            SELECT w.id FROM workspaces w
            JOIN organization_members om ON w.organization_id = om.organization_id
            WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
        )
    );

-- Similar policies for other tables...

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to get table schema
CREATE OR REPLACE FUNCTION get_table_schema(table_name TEXT)
RETURNS TABLE (
    column_name TEXT,
    data_type TEXT,
    is_nullable BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.column_name::TEXT,
        c.data_type::TEXT,
        (c.is_nullable = 'YES') AS is_nullable
    FROM information_schema.columns c
    WHERE c.table_schema = 'public' AND c.table_name = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all tables
CREATE OR REPLACE FUNCTION get_all_tables()
RETURNS TABLE (
    table_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT t.table_name::TEXT
    FROM information_schema.tables t
    WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INDEXES
-- =============================================

-- Performance indexes
CREATE INDEX idx_workspaces_organization_id ON workspaces(organization_id);
CREATE INDEX idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX idx_organization_members_organization_id ON organization_members(organization_id);
CREATE INDEX idx_views_workspace_id ON views(workspace_id);
CREATE INDEX idx_activities_workspace_id ON activities(workspace_id);
CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_projects_workspace_id ON projects(workspace_id);
CREATE INDEX idx_people_workspace_id ON people(workspace_id);

-- =============================================
-- SEED DATA (OPTIONAL)
-- =============================================

-- Insert example organization (for development)
-- INSERT INTO organizations (name, slug, subscription_tier) 
-- VALUES ('Demo Organization', 'demo-org', 'free');
