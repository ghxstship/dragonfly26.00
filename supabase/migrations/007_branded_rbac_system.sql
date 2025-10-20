-- =====================================================
-- BRANDED RBAC SYSTEM - COMPREHENSIVE IMPLEMENTATION
-- =====================================================
-- Creates the full role-based access control system with:
-- - 11 branded roles (Legend → Ambassador)
-- - 12 permission categories
-- - Role hierarchy and inheritance
-- - Time-limited access support
-- - Scope-based permissions (organization, project, team)
-- =====================================================

-- Drop existing tables to ensure clean migration
DROP TABLE IF EXISTS role_hierarchy CASCADE;
DROP TABLE IF EXISTS user_role_assignments CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS permission_categories CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- =====================================================
-- 1. ROLES TABLE - Branded Role Definitions
-- =====================================================
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  level INTEGER NOT NULL, -- Hierarchy level (1=highest, 11=lowest)
  scope TEXT NOT NULL, -- 'platform', 'organization', 'project', 'team', 'custom'
  is_system BOOLEAN DEFAULT true, -- System roles cannot be deleted
  can_be_time_limited BOOLEAN DEFAULT false,
  color TEXT, -- Brand color for UI
  icon TEXT, -- Icon identifier for UI
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert branded roles
INSERT INTO roles (slug, name, description, level, scope, is_system, can_be_time_limited, color, icon) VALUES
  -- Level 1: Platform Super Admin
  ('legend', 'Legend', 'Platform super admin - ultimate authority across all organizations', 1, 'platform', true, false, '#8B5CF6', 'crown'),
  
  -- Level 2: Organization Super Admin
  ('phantom', 'Phantom', 'Organization super admin - full control within their organization', 2, 'organization', true, false, '#7C3AED', 'shield'),
  
  -- Level 3: Strategic Leader
  ('aviator', 'Aviator', 'Strategic leader - multi-project oversight and organization admin', 3, 'organization', true, false, '#6D28D9', 'plane'),
  
  -- Level 4: Project Manager
  ('gladiator', 'Gladiator', 'Project manager - full authority over assigned projects', 4, 'project', true, false, '#5B21B6', 'sword'),
  
  -- Level 5: Department Manager
  ('navigator', 'Navigator', 'Department/area manager - zone operations and team coordination', 5, 'project', true, false, '#4C1D95', 'compass'),
  
  -- Level 6: Team Lead
  ('deviator', 'Deviator', 'Team lead - crew coordination and task management', 6, 'team', true, false, '#3B0764', 'users'),
  
  -- Level 7: Team Member
  ('raider', 'Raider', 'Team member - task execution and deliverables', 7, 'team', true, false, '#2E1065', 'user'),
  
  -- Level 8: External Contractor
  ('merchant', 'Merchant', 'External contractor - vendor services and deliverables', 8, 'custom', true, false, '#059669', 'briefcase'),
  
  -- Level 9: Temporary Access (Custom)
  ('visitor', 'Visitor', 'Temporary custom access - configurable permissions with expiration', 9, 'custom', true, true, '#0891B2', 'user-plus'),
  
  -- Level 10: Read-Only Stakeholder
  ('passenger', 'Passenger', 'Read-only stakeholder - temporary visibility access', 10, 'custom', true, true, '#6366F1', 'eye'),
  
  -- Level 11: Marketing Affiliate
  ('ambassador', 'Ambassador', 'Marketing affiliate - promotional and brand assets only', 11, 'custom', true, false, '#EC4899', 'megaphone');

-- =====================================================
-- 2. PERMISSION CATEGORIES TABLE
-- =====================================================
CREATE TABLE permission_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO permission_categories (slug, name, description, sort_order, icon) VALUES
  ('organization', 'Organization Management', 'Create, manage, and configure organizations', 1, 'building'),
  ('users', 'User Management', 'Invite, manage, and control user access', 2, 'users'),
  ('projects', 'Project Management', 'Create and manage projects, teams, and settings', 3, 'folder'),
  ('finance', 'Budget & Finance', 'Manage budgets, expenses, invoices, and payments', 4, 'dollar-sign'),
  ('scheduling', 'Scheduling & Timeline', 'Manage schedules, tasks, milestones, and deadlines', 5, 'calendar'),
  ('resources', 'Resource Management', 'Manage equipment, venues, personnel, and bookings', 6, 'package'),
  ('documents', 'Document Management', 'Upload, edit, share, and version control documents', 7, 'file-text'),
  ('communication', 'Communication & Collaboration', 'Comments, messages, announcements, and discussions', 8, 'message-circle'),
  ('vendors', 'Vendor & External Relations', 'Manage vendors, contracts, and external partnerships', 9, 'truck'),
  ('reporting', 'Reporting & Analytics', 'Dashboards, reports, data export, and audit logs', 10, 'bar-chart'),
  ('marketing', 'Marketing & Promotional Assets', 'Brand assets, promotional content, and social media', 11, 'megaphone'),
  ('system', 'System Administration', 'Platform configuration, integrations, and API management', 12, 'settings');

-- =====================================================
-- 3. PERMISSIONS TABLE - Granular Permissions
-- =====================================================
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES permission_categories(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization Management Permissions
INSERT INTO permissions (category_id, slug, name, description, sort_order)
SELECT id, 'org.create', 'Create Organizations', 'Create new organizations on the platform', 1 FROM permission_categories WHERE slug = 'organization'
UNION ALL
SELECT id, 'org.edit', 'Edit Organization Settings', 'Modify organization settings and branding', 2 FROM permission_categories WHERE slug = 'organization'
UNION ALL
SELECT id, 'org.delete', 'Delete Organizations', 'Delete organizations and all associated data', 3 FROM permission_categories WHERE slug = 'organization'
UNION ALL
SELECT id, 'org.view_analytics', 'View Organization Analytics', 'Access organization-level analytics and reports', 4 FROM permission_categories WHERE slug = 'organization'
UNION ALL
SELECT id, 'org.manage_billing', 'Manage Billing', 'Access billing, subscriptions, and payment settings', 5 FROM permission_categories WHERE slug = 'organization'
UNION ALL
SELECT id, 'org.export_data', 'Export Organization Data', 'Export all organization data in various formats', 6 FROM permission_categories WHERE slug = 'organization';

-- User Management Permissions
INSERT INTO permissions (category_id, slug, name, description, sort_order)
SELECT id, 'users.invite', 'Invite Users', 'Send invitations to new users', 1 FROM permission_categories WHERE slug = 'users'
UNION ALL
SELECT id, 'users.remove', 'Remove Users', 'Remove users from organization or projects', 2 FROM permission_categories WHERE slug = 'users'
UNION ALL
SELECT id, 'users.assign_roles', 'Assign Roles', 'Assign and modify user roles', 3 FROM permission_categories WHERE slug = 'users'
UNION ALL
SELECT id, 'users.view_activity', 'View User Activity', 'Access user activity logs and audit trails', 4 FROM permission_categories WHERE slug = 'users'
UNION ALL
SELECT id, 'users.manage_permissions', 'Manage Permissions', 'Configure custom user permissions', 5 FROM permission_categories WHERE slug = 'users'
UNION ALL
SELECT id, 'users.deactivate', 'Deactivate/Reactivate Users', 'Suspend or restore user access', 6 FROM permission_categories WHERE slug = 'users';

-- Project Management Permissions
INSERT INTO permissions (category_id, slug, name, description, sort_order)
SELECT id, 'projects.create', 'Create Projects', 'Create new projects', 1 FROM permission_categories WHERE slug = 'projects'
UNION ALL
SELECT id, 'projects.edit', 'Edit Projects', 'Modify project details and settings', 2 FROM permission_categories WHERE slug = 'projects'
UNION ALL
SELECT id, 'projects.delete', 'Delete Projects', 'Delete projects permanently', 3 FROM permission_categories WHERE slug = 'projects'
UNION ALL
SELECT id, 'projects.archive', 'Archive Projects', 'Archive and restore projects', 4 FROM permission_categories WHERE slug = 'projects'
UNION ALL
SELECT id, 'projects.manage_teams', 'Manage Teams', 'Assign and manage project teams', 5 FROM permission_categories WHERE slug = 'projects'
UNION ALL
SELECT id, 'projects.view_dashboard', 'View Dashboards', 'Access project dashboards and overviews', 6 FROM permission_categories WHERE slug = 'projects'
UNION ALL
SELECT id, 'projects.export_data', 'Export Project Data', 'Export project data in various formats', 7 FROM permission_categories WHERE slug = 'projects';

-- Budget & Finance Permissions
INSERT INTO permissions (category_id, slug, name, description, sort_order)
SELECT id, 'finance.create_budget', 'Create Budgets', 'Create new budgets and financial plans', 1 FROM permission_categories WHERE slug = 'finance'
UNION ALL
SELECT id, 'finance.edit_budget', 'Edit Budgets', 'Modify existing budgets', 2 FROM permission_categories WHERE slug = 'finance'
UNION ALL
SELECT id, 'finance.approve_expenses', 'Approve Expenses', 'Approve expense requests and reimbursements', 3 FROM permission_categories WHERE slug = 'finance'
UNION ALL
SELECT id, 'finance.view_reports', 'View Financial Reports', 'Access financial reports and analytics', 4 FROM permission_categories WHERE slug = 'finance'
UNION ALL
SELECT id, 'finance.process_payments', 'Process Payments', 'Process vendor payments and invoices', 5 FROM permission_categories WHERE slug = 'finance'
UNION ALL
SELECT id, 'finance.manage_invoices', 'Manage Invoices', 'Create, edit, and track invoices', 6 FROM permission_categories WHERE slug = 'finance'
UNION ALL
SELECT id, 'finance.export_data', 'Export Financial Data', 'Export financial data for accounting', 7 FROM permission_categories WHERE slug = 'finance';

-- Scheduling & Timeline Permissions
INSERT INTO permissions (category_id, slug, name, description, sort_order)
SELECT id, 'scheduling.create', 'Create Schedules', 'Create new schedules and timelines', 1 FROM permission_categories WHERE slug = 'scheduling'
UNION ALL
SELECT id, 'scheduling.edit', 'Edit Schedules', 'Modify schedules and timelines', 2 FROM permission_categories WHERE slug = 'scheduling'
UNION ALL
SELECT id, 'scheduling.assign_tasks', 'Assign Tasks', 'Assign tasks and deadlines to team members', 3 FROM permission_categories WHERE slug = 'scheduling'
UNION ALL
SELECT id, 'scheduling.manage_milestones', 'Manage Milestones', 'Create and track project milestones', 4 FROM permission_categories WHERE slug = 'scheduling'
UNION ALL
SELECT id, 'scheduling.view_gantt', 'View Gantt Charts', 'Access Gantt charts and calendars', 5 FROM permission_categories WHERE slug = 'scheduling'
UNION ALL
SELECT id, 'scheduling.notifications', 'Receive Notifications', 'Get schedule and deadline notifications', 6 FROM permission_categories WHERE slug = 'scheduling'
UNION ALL
SELECT id, 'scheduling.export', 'Export Schedules', 'Export schedules in various formats', 7 FROM permission_categories WHERE slug = 'scheduling';

-- Resource Management Permissions
INSERT INTO permissions (category_id, slug, name, description, sort_order)
SELECT id, 'resources.add', 'Add Resources', 'Add new resources (equipment, venues, personnel)', 1 FROM permission_categories WHERE slug = 'resources'
UNION ALL
SELECT id, 'resources.edit', 'Edit Resources', 'Modify resource details and availability', 2 FROM permission_categories WHERE slug = 'resources'
UNION ALL
SELECT id, 'resources.remove', 'Remove Resources', 'Remove resources from the system', 3 FROM permission_categories WHERE slug = 'resources'
UNION ALL
SELECT id, 'resources.book', 'Book Resources', 'Reserve and book resources', 4 FROM permission_categories WHERE slug = 'resources'
UNION ALL
SELECT id, 'resources.view_availability', 'View Availability', 'Check resource availability and calendars', 5 FROM permission_categories WHERE slug = 'resources'
UNION ALL
SELECT id, 'resources.approve_requests', 'Approve Requests', 'Approve resource booking requests', 6 FROM permission_categories WHERE slug = 'resources'
UNION ALL
SELECT id, 'resources.manage_conflicts', 'Manage Conflicts', 'Resolve resource booking conflicts', 7 FROM permission_categories WHERE slug = 'resources';

-- Document Management Permissions
INSERT INTO permissions (category_id, slug, name, description, sort_order)
SELECT id, 'documents.upload', 'Upload Documents', 'Upload new documents and files', 1 FROM permission_categories WHERE slug = 'documents'
UNION ALL
SELECT id, 'documents.download', 'Download Documents', 'Download documents and files', 2 FROM permission_categories WHERE slug = 'documents'
UNION ALL
SELECT id, 'documents.edit', 'Edit Documents', 'Edit document contents', 3 FROM permission_categories WHERE slug = 'documents'
UNION ALL
SELECT id, 'documents.delete', 'Delete Documents', 'Delete documents permanently', 4 FROM permission_categories WHERE slug = 'documents'
UNION ALL
SELECT id, 'documents.share_external', 'Share Externally', 'Share documents with external parties', 5 FROM permission_categories WHERE slug = 'documents'
UNION ALL
SELECT id, 'documents.manage_versions', 'Manage Versions', 'Control document versioning', 6 FROM permission_categories WHERE slug = 'documents'
UNION ALL
SELECT id, 'documents.set_permissions', 'Set Permissions', 'Configure document-level permissions', 7 FROM permission_categories WHERE slug = 'documents';

-- Communication & Collaboration Permissions
INSERT INTO permissions (category_id, slug, name, description, sort_order)
SELECT id, 'communication.post', 'Post Updates', 'Post comments and updates', 1 FROM permission_categories WHERE slug = 'communication'
UNION ALL
SELECT id, 'communication.tag', 'Tag Members', 'Tag and mention team members', 2 FROM permission_categories WHERE slug = 'communication'
UNION ALL
SELECT id, 'communication.announcements', 'Create Announcements', 'Create organization-wide announcements', 3 FROM permission_categories WHERE slug = 'communication'
UNION ALL
SELECT id, 'communication.dm', 'Send Messages', 'Send direct messages to users', 4 FROM permission_categories WHERE slug = 'communication'
UNION ALL
SELECT id, 'communication.participate', 'Participate in Discussions', 'Join and participate in discussions', 5 FROM permission_categories WHERE slug = 'communication'
UNION ALL
SELECT id, 'communication.view_feed', 'View Activity Feed', 'Access project and organization activity feeds', 6 FROM permission_categories WHERE slug = 'communication';

-- Vendor & External Relations Permissions
INSERT INTO permissions (category_id, slug, name, description, sort_order)
SELECT id, 'vendors.add', 'Add Vendors', 'Add new vendors and contractors', 1 FROM permission_categories WHERE slug = 'vendors'
UNION ALL
SELECT id, 'vendors.edit', 'Edit Vendors', 'Modify vendor information and contracts', 2 FROM permission_categories WHERE slug = 'vendors'
UNION ALL
SELECT id, 'vendors.assign_contracts', 'Assign Contracts', 'Assign and manage vendor contracts', 3 FROM permission_categories WHERE slug = 'vendors'
UNION ALL
SELECT id, 'vendors.review_deliverables', 'Review Deliverables', 'Review and approve vendor deliverables', 4 FROM permission_categories WHERE slug = 'vendors'
UNION ALL
SELECT id, 'vendors.approve_payments', 'Approve Payments', 'Approve vendor payment requests', 5 FROM permission_categories WHERE slug = 'vendors'
UNION ALL
SELECT id, 'vendors.view_performance', 'View Performance', 'Access vendor performance metrics', 6 FROM permission_categories WHERE slug = 'vendors';

-- Reporting & Analytics Permissions
INSERT INTO permissions (category_id, slug, name, description, sort_order)
SELECT id, 'reporting.view_dashboards', 'View Dashboards', 'Access real-time dashboards', 1 FROM permission_categories WHERE slug = 'reporting'
UNION ALL
SELECT id, 'reporting.create_reports', 'Create Reports', 'Generate custom reports', 2 FROM permission_categories WHERE slug = 'reporting'
UNION ALL
SELECT id, 'reporting.export_data', 'Export Data', 'Export data in CSV, PDF, Excel formats', 3 FROM permission_categories WHERE slug = 'reporting'
UNION ALL
SELECT id, 'reporting.view_audit_logs', 'View Audit Logs', 'Access system audit logs', 4 FROM permission_categories WHERE slug = 'reporting'
UNION ALL
SELECT id, 'reporting.historical_data', 'Access Historical Data', 'View archived and historical data', 5 FROM permission_categories WHERE slug = 'reporting';

-- Marketing & Promotional Assets Permissions
INSERT INTO permissions (category_id, slug, name, description, sort_order)
SELECT id, 'marketing.access_materials', 'Access Materials', 'Access marketing materials and brand assets', 1 FROM permission_categories WHERE slug = 'marketing'
UNION ALL
SELECT id, 'marketing.download_content', 'Download Content', 'Download promotional content and assets', 2 FROM permission_categories WHERE slug = 'marketing'
UNION ALL
SELECT id, 'marketing.view_guidelines', 'View Guidelines', 'Access brand guidelines and standards', 3 FROM permission_categories WHERE slug = 'marketing'
UNION ALL
SELECT id, 'marketing.share_social', 'Share Social Assets', 'Share social media assets and content', 4 FROM permission_categories WHERE slug = 'marketing'
UNION ALL
SELECT id, 'marketing.track_metrics', 'Track Metrics', 'View promotional performance metrics', 5 FROM permission_categories WHERE slug = 'marketing';

-- System Administration Permissions
INSERT INTO permissions (category_id, slug, name, description, sort_order)
SELECT id, 'system.configure', 'Configure System', 'Configure system-wide settings', 1 FROM permission_categories WHERE slug = 'system'
UNION ALL
SELECT id, 'system.integrations', 'Manage Integrations', 'Configure third-party integrations', 2 FROM permission_categories WHERE slug = 'system'
UNION ALL
SELECT id, 'system.webhooks', 'Setup Webhooks', 'Configure webhooks and event listeners', 3 FROM permission_categories WHERE slug = 'system'
UNION ALL
SELECT id, 'system.notifications', 'Configure Notifications', 'Manage notification settings and templates', 4 FROM permission_categories WHERE slug = 'system'
UNION ALL
SELECT id, 'system.api', 'Manage API Access', 'Control API keys and access tokens', 5 FROM permission_categories WHERE slug = 'system'
UNION ALL
SELECT id, 'system.logs', 'View System Logs', 'Access system logs and error reports', 6 FROM permission_categories WHERE slug = 'system';

-- =====================================================
-- 4. ROLE PERMISSIONS TABLE - Permission Matrix
-- =====================================================
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  access_level TEXT NOT NULL, -- 'full', 'manage', 'edit', 'create', 'view', 'limited', 'none', 'custom'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- Create index for fast permission lookups
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission_id);

-- =====================================================
-- 5. USER ROLE ASSIGNMENTS TABLE
-- =====================================================
CREATE TABLE user_role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Scope fields
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID, -- References projects table when created
  team_id UUID, -- References teams table when created
  department_id UUID, -- For Navigator role scope
  
  -- Time-limited access (for Visitor and Passenger roles)
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  -- Custom permissions for Visitor role
  custom_permissions JSONB, -- Stores custom permission overrides
  
  -- Metadata
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_role_assignments(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_workspace ON user_role_assignments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_org ON user_role_assignments(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON user_role_assignments(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_roles_expiry ON user_role_assignments(valid_until) WHERE valid_until IS NOT NULL;

-- =====================================================
-- 6. ROLE HIERARCHY TABLE - Role Inheritance
-- =====================================================
CREATE TABLE role_hierarchy (
  parent_role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  child_role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  inherits_permissions BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (parent_role_id, child_role_id)
);

-- Define role hierarchy (higher roles inherit from lower roles)
-- This allows for cascading permissions
INSERT INTO role_hierarchy (parent_role_id, child_role_id, inherits_permissions)
SELECT 
  r1.id as parent_role_id,
  r2.id as child_role_id,
  true as inherits_permissions
FROM roles r1
CROSS JOIN roles r2
WHERE r1.level < r2.level;

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_permission_slug TEXT,
  p_workspace_id UUID DEFAULT NULL,
  p_project_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  has_perm BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM user_role_assignments ura
    JOIN role_permissions rp ON ura.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ura.user_id = p_user_id
      AND p.slug = p_permission_slug
      AND ura.is_active = true
      AND (ura.valid_until IS NULL OR ura.valid_until > NOW())
      AND (p_workspace_id IS NULL OR ura.workspace_id = p_workspace_id)
      AND (p_project_id IS NULL OR ura.project_id = p_project_id OR ura.project_id IS NULL)
      AND rp.access_level NOT IN ('none')
  ) INTO has_perm;
  
  RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's highest role level
CREATE OR REPLACE FUNCTION get_user_highest_role_level(
  p_user_id UUID,
  p_workspace_id UUID DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
  highest_level INTEGER;
BEGIN
  SELECT MIN(r.level)
  INTO highest_level
  FROM user_role_assignments ura
  JOIN roles r ON ura.role_id = r.id
  WHERE ura.user_id = p_user_id
    AND ura.is_active = true
    AND (ura.valid_until IS NULL OR ura.valid_until > NOW())
    AND (p_workspace_id IS NULL OR ura.workspace_id = p_workspace_id);
  
  RETURN COALESCE(highest_level, 999);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically expire time-limited roles
CREATE OR REPLACE FUNCTION expire_time_limited_roles()
RETURNS void AS $$
BEGIN
  UPDATE user_role_assignments
  SET is_active = false
  WHERE valid_until IS NOT NULL
    AND valid_until < NOW()
    AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. RLS POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_hierarchy ENABLE ROW LEVEL SECURITY;

-- Everyone can read roles and permissions (needed for UI)
CREATE POLICY "Roles are viewable by everyone"
  ON roles FOR SELECT
  USING (true);

CREATE POLICY "Permission categories are viewable by everyone"
  ON permission_categories FOR SELECT
  USING (true);

CREATE POLICY "Permissions are viewable by everyone"
  ON permissions FOR SELECT
  USING (true);

CREATE POLICY "Role permissions are viewable by everyone"
  ON role_permissions FOR SELECT
  USING (true);

-- User role assignments viewable by organization members
CREATE POLICY "User role assignments viewable by organization members"
  ON user_role_assignments FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = (SELECT (SELECT auth.uid()))
    )
    OR user_id = (SELECT (SELECT auth.uid())) -- Users can always see their own role assignments
  );

-- Only admins can modify role assignments
CREATE POLICY "Only admins can modify role assignments"
  ON user_role_assignments FOR ALL
  USING (
    user_has_permission((SELECT auth.uid()), 'users.assign_roles', workspace_id)
  );

-- =====================================================
-- 9. TRIGGERS
-- =====================================================

-- Auto-expire roles (runs daily via pg_cron or manually)
-- Note: pg_cron extension would be ideal, but we can also call this from edge functions
CREATE OR REPLACE FUNCTION trigger_expire_roles()
RETURNS trigger AS $$
BEGIN
  PERFORM expire_time_limited_roles();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_role_assignments_updated_at
  BEFORE UPDATE ON user_role_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 10. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE roles IS 'Branded role definitions with hierarchy levels';
COMMENT ON TABLE permission_categories IS '12 permission categories for the platform';
COMMENT ON TABLE permissions IS 'Granular permissions within each category';
COMMENT ON TABLE role_permissions IS 'Permission matrix mapping roles to permissions with access levels';
COMMENT ON TABLE user_role_assignments IS 'User role assignments with scope and time limits';
COMMENT ON TABLE role_hierarchy IS 'Role inheritance structure for cascading permissions';

COMMENT ON COLUMN roles.level IS 'Hierarchy level: 1=Legend (highest), 11=Ambassador (lowest)';
COMMENT ON COLUMN roles.scope IS 'Permission scope: platform, organization, project, team, or custom';
COMMENT ON COLUMN user_role_assignments.valid_until IS 'Expiration timestamp for time-limited roles (Visitor, Passenger)';
COMMENT ON COLUMN user_role_assignments.custom_permissions IS 'JSONB object storing custom permission overrides for Visitor role';

-- =====================================================
-- BRANDED RBAC SYSTEM MIGRATION COMPLETE
-- =====================================================
