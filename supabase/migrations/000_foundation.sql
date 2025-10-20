-- =============================================
-- FOUNDATION MIGRATION - Complete Database Setup
-- Version: 000
-- =============================================

-- =============================================
-- EXTENSIONS
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For encryption

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Validate user_roles scope constraint
CREATE OR REPLACE FUNCTION validate_user_role_scope()
RETURNS TRIGGER AS $$
DECLARE
    role_name TEXT;
BEGIN
    -- Get the role name for this role_id
    SELECT name INTO role_name FROM roles WHERE id = NEW.role_id;
    
    -- Legend role can have NULL organization_id, all others require it
    IF role_name != 'legend' AND NEW.organization_id IS NULL THEN
        RAISE EXCEPTION 'organization_id is required for role: %', role_name;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- ORGANIZATIONS & WORKSPACES
-- =============================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    
    -- Subscription
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business', 'enterprise')),
    subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'trialing')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#7c3aed',
    icon TEXT,
    is_default BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ROLE-BASED PERMISSIONS SYSTEM
-- =============================================

-- System Roles (11 roles as specified)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    level INTEGER NOT NULL UNIQUE,
    scope TEXT NOT NULL CHECK (scope IN ('platform', 'organization', 'project', 'department', 'team', 'individual', 'external', 'custom', 'observer', 'marketing')),
    description TEXT,
    is_system_role BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert the 11 system roles
INSERT INTO roles (name, level, scope, description) VALUES
('legend', 1, 'platform', 'Platform super admin - ultimate authority'),
('phantom', 2, 'organization', 'Organization super admin - full org control'),
('aviator', 3, 'organization', 'Strategic leader - multi-project oversight'),
('gladiator', 4, 'project', 'Project manager - full project authority'),
('navigator', 5, 'department', 'Department/area manager'),
('deviator', 6, 'team', 'Team lead - crew coordination'),
('raider', 7, 'individual', 'Team member - task execution'),
('merchant', 8, 'external', 'External contractor - limited vendor access'),
('visitor', 9, 'custom', 'Temporary custom access with expiration'),
('passenger', 10, 'observer', 'Read-only stakeholder'),
('ambassador', 11, 'marketing', 'Marketing affiliate - promotional only');

-- Permission Categories and Actions
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    description TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(category, action, resource)
);

-- Role Permissions Matrix
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    access_level TEXT NOT NULL CHECK (access_level IN ('full', 'manage', 'edit', 'create', 'view', 'limited', 'none', 'custom')),
    conditions JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- User Role Assignments
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    
    -- Scope
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID, -- Will reference projects(id) when that table exists
    department_id UUID,
    team_id UUID,
    
    -- Time-limited access (for Visitor, Passenger)
    expires_at TIMESTAMPTZ,
    
    -- Custom permissions override (for Visitor role)
    custom_permissions JSONB DEFAULT '{}'::jsonb,
    
    -- Audit
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organization Members (legacy/simplified access)
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'text', 'number', 'date', 'select', 'multi-select', 'checkbox',
        'url', 'email', 'phone', 'currency', 'percent', 'duration',
        'rating', 'file', 'user', 'relation'
    )),
    options JSONB,
    required BOOLEAN DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE module_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    module_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'list', 'board', 'table', 'calendar', 'timeline', 'workload',
        'map', 'mind-map', 'form', 'activity', 'box', 'embed',
        'chat', 'dashboard', 'doc', 'financial', 'portfolio', 'pivot'
    )),
    config JSONB DEFAULT '{}'::jsonb,
    permission TEXT NOT NULL DEFAULT 'private' CHECK (permission IN ('private', 'team', 'public')),
    is_default BOOLEAN DEFAULT false,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
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

CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_presence (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    location TEXT NOT NULL,
    cursor JSONB,
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- Workspaces
CREATE INDEX idx_workspaces_organization ON workspaces(organization_id);

-- Roles & Permissions
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);
CREATE INDEX idx_user_roles_org ON user_roles(organization_id);
CREATE INDEX idx_user_roles_project ON user_roles(project_id);
CREATE INDEX idx_user_roles_expires ON user_roles(expires_at);
CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- Organization members
CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);

-- Activities
CREATE INDEX idx_activities_workspace ON activities(workspace_id);
CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_entity ON activities(entity_type, entity_id);
CREATE INDEX idx_activities_created ON activities(created_at DESC);

-- Comments
CREATE INDEX idx_comments_workspace ON comments(workspace_id);
CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_comments_user ON comments(user_id);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- =============================================
-- TRIGGERS
-- =============================================

-- Validation triggers
CREATE TRIGGER validate_user_role_scope_trigger
    BEFORE INSERT OR UPDATE ON user_roles
    FOR EACH ROW EXECUTE FUNCTION validate_user_role_scope();

-- Update timestamp triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_module_configs_updated_at BEFORE UPDATE ON module_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_views_updated_at BEFORE UPDATE ON views
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE views ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view their organizations"
    ON organizations FOR SELECT
    USING (id IN (
        SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
    ));

CREATE POLICY "Owners and admins can update their organizations"
    ON organizations FOR UPDATE
    USING (id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = (SELECT (SELECT auth.uid())) AND role IN ('owner', 'admin')
    ));

-- Workspaces policies
CREATE POLICY "Users can view workspaces in their organizations"
    ON workspaces FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
    ));

CREATE POLICY "Admins can manage workspaces"
    ON workspaces FOR ALL
    USING (organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = (SELECT (SELECT auth.uid())) AND role IN ('owner', 'admin')
    ));

-- Roles (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view roles"
    ON roles FOR SELECT
    TO authenticated
    USING (true);

-- Permissions (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view permissions"
    ON permissions FOR SELECT
    TO authenticated
    USING (true);

-- User Roles
CREATE POLICY "Users can view their own role assignments"
    ON user_roles FOR SELECT
    USING (user_id = (SELECT (SELECT auth.uid())));

CREATE POLICY "Admins can manage user roles in their org"
    ON user_roles FOR ALL
    USING (
        organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = (SELECT (SELECT auth.uid())) AND role IN ('owner', 'admin')
        )
    );

-- Notifications
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (user_id = (SELECT (SELECT auth.uid())));

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (user_id = (SELECT (SELECT auth.uid())));

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE organizations;
ALTER PUBLICATION supabase_realtime ADD TABLE workspaces;
ALTER PUBLICATION supabase_realtime ADD TABLE user_roles;
ALTER PUBLICATION supabase_realtime ADD TABLE activities;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE user_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE organizations IS 'Top-level organizations - multitenant isolation';
COMMENT ON TABLE workspaces IS 'Workspaces within organizations - project grouping';
COMMENT ON TABLE roles IS 'System roles - 11 hierarchical roles from Legend to Ambassador';
COMMENT ON TABLE permissions IS 'Granular permissions across all modules';
COMMENT ON TABLE role_permissions IS 'Role-permission mappings with access levels';
COMMENT ON TABLE user_roles IS 'User role assignments with scope and expiration';
COMMENT ON TABLE organization_members IS 'Legacy organization membership (simplified)';
