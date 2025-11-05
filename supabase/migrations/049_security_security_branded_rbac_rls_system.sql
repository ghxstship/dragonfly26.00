-- =============================================
-- BRANDED RBAC/RLS SYSTEM WITH HIERARCHY INTEGRATION
-- Migration: 102
-- Date: January 20, 2025
-- Purpose: Implement 11 branded roles with hierarchy-aware permissions
-- =============================================

-- =============================================
-- PART 1: UPDATE ROLES TABLE WITH BRANDED ROLES
-- =============================================

-- Update existing roles with new branded definitions
UPDATE roles SET 
    description = 'Platform super admin - ultimate authority across all organizations',
    scope = 'platform'
WHERE name = 'legend';

UPDATE roles SET 
    description = 'Organization super admin - full control within assigned organizations',
    scope = 'organization'
WHERE name = 'phantom';

UPDATE roles SET 
    description = 'Strategic leader - full access to assigned projects, cross-project reporting',
    scope = 'organization'
WHERE name = 'aviator';

UPDATE roles SET 
    description = 'Project manager - full access to assigned projects, team assignment, budget approval',
    scope = 'project'
WHERE name = 'gladiator';

UPDATE roles SET 
    description = 'Department/area manager - manage assigned department/zone within project',
    scope = 'department'
WHERE name = 'navigator';

UPDATE roles SET 
    description = 'Team lead - manage assigned team, task assignment, team scheduling',
    scope = 'team'
WHERE name = 'deviator';

UPDATE roles SET 
    description = 'Team member - edit access to assigned tasks and deliverables',
    scope = 'individual'
WHERE name = 'raider';

-- Rename merchant to vendor
UPDATE roles SET 
    name = 'vendor',
    description = 'External contractor - limited access to vendor-specific project areas',
    scope = 'external'
WHERE name = 'merchant';

UPDATE roles SET 
    description = 'Temporary custom access with expiration date - configurable permissions',
    scope = 'custom'
WHERE name = 'visitor';

-- Rename passenger to partner
UPDATE roles SET 
    name = 'partner',
    description = 'Read-only stakeholder - view-only access to assigned project elements',
    scope = 'observer'
WHERE name = 'passenger';

UPDATE roles SET 
    description = 'Marketing affiliate - access only to marketing and promotional content',
    scope = 'marketing'
WHERE name = 'ambassador';

-- =============================================
-- PART 2: PERMISSION CATEGORIES & ACTIONS
-- =============================================

-- Drop and recreate permissions table with correct structure
DROP TABLE IF EXISTS permissions CASCADE;

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(category, action, resource)
);

-- Organization-level permissions
INSERT INTO permissions (category, action, resource, description) VALUES
('organization', 'view', 'settings', 'View organization settings'),
('organization', 'edit', 'settings', 'Edit organization settings'),
('organization', 'delete', 'organization', 'Delete organization'),
('organization', 'manage', 'billing', 'Manage billing and subscriptions'),
('organization', 'view', 'analytics', 'View organization-wide analytics'),
('organization', 'manage', 'members', 'Manage organization members');

-- Project-level permissions
INSERT INTO permissions (category, action, resource, description) VALUES
('project', 'create', 'project', 'Create new projects'),
('project', 'view', 'project', 'View project details'),
('project', 'edit', 'project', 'Edit project details'),
('project', 'delete', 'project', 'Delete projects'),
('project', 'manage', 'team', 'Manage project team members'),
('project', 'approve', 'budget', 'Approve project budgets'),
('project', 'view', 'reports', 'View project reports');

-- Production-level permissions
INSERT INTO permissions (category, action, resource, description) VALUES
('production', 'create', 'production', 'Create new productions'),
('production', 'view', 'production', 'View production details'),
('production', 'edit', 'production', 'Edit production details'),
('production', 'delete', 'production', 'Delete productions'),
('production', 'manage', 'team', 'Manage production team'),
('production', 'manage', 'schedule', 'Manage production schedule'),
('production', 'view', 'budget', 'View production budget');

-- Activation-level permissions
INSERT INTO permissions (category, action, resource, description) VALUES
('activation', 'create', 'activation', 'Create new activations'),
('activation', 'view', 'activation', 'View activation details'),
('activation', 'edit', 'activation', 'Edit activation details'),
('activation', 'delete', 'activation', 'Delete activations'),
('activation', 'manage', 'team', 'Manage activation team'),
('activation', 'manage', 'resources', 'Manage activation resources');

-- Task-level permissions
INSERT INTO permissions (category, action, resource, description) VALUES
('task', 'create', 'task', 'Create tasks'),
('task', 'view', 'task', 'View tasks'),
('task', 'edit', 'task', 'Edit tasks'),
('task', 'delete', 'task', 'Delete tasks'),
('task', 'assign', 'task', 'Assign tasks to others'),
('task', 'complete', 'task', 'Mark tasks as complete');

-- Document permissions
INSERT INTO permissions (category, action, resource, description) VALUES
('document', 'create', 'document', 'Upload documents'),
('document', 'view', 'document', 'View documents'),
('document', 'edit', 'document', 'Edit documents'),
('document', 'delete', 'document', 'Delete documents'),
('document', 'download', 'document', 'Download documents');

-- Financial permissions
INSERT INTO permissions (category, action, resource, description) VALUES
('finance', 'view', 'budget', 'View budgets'),
('finance', 'edit', 'budget', 'Edit budgets'),
('finance', 'approve', 'expense', 'Approve expenses'),
('finance', 'view', 'invoice', 'View invoices'),
('finance', 'create', 'invoice', 'Create invoices');

-- Vendor-specific permissions
INSERT INTO permissions (category, action, resource, description) VALUES
('vendor', 'submit', 'deliverable', 'Submit deliverables'),
('vendor', 'manage', 'invoice', 'Manage vendor invoices'),
('vendor', 'view', 'contract', 'View contracts');

-- Marketing permissions
INSERT INTO permissions (category, action, resource, description) VALUES
('marketing', 'view', 'assets', 'View brand assets'),
('marketing', 'download', 'assets', 'Download brand assets'),
('marketing', 'view', 'schedule', 'View promotional schedule'),
('marketing', 'track', 'referrals', 'Track referrals');

-- =============================================
-- PART 3: ROLE PERMISSIONS MATRIX
-- =============================================

-- Helper function to assign all permissions to a role
CREATE OR REPLACE FUNCTION assign_all_permissions_to_role(role_name TEXT, access_level TEXT)
RETURNS VOID AS $$
DECLARE
    role_uuid UUID;
    perm_record RECORD;
BEGIN
    SELECT id INTO role_uuid FROM roles WHERE name = role_name;
    
    FOR perm_record IN SELECT id FROM permissions LOOP
        INSERT INTO role_permissions (role_id, permission_id, access_level)
        VALUES (role_uuid, perm_record.id, access_level)
        ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = EXCLUDED.access_level;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- LEGEND: Full access to everything
SELECT assign_all_permissions_to_role('legend', 'full');

-- PHANTOM: Full access within organization
DO $$
DECLARE
    phantom_id UUID;
    perm_record RECORD;
BEGIN
    SELECT id INTO phantom_id FROM roles WHERE name = 'phantom';
    
    -- All organization permissions
    FOR perm_record IN SELECT id FROM permissions WHERE category IN ('organization', 'project', 'production', 'activation', 'task', 'document', 'finance') LOOP
        INSERT INTO role_permissions (role_id, permission_id, access_level)
        VALUES (phantom_id, perm_record.id, 'full')
        ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'full';
    END LOOP;
END $$;

-- AVIATOR: Full project access, limited organization access
DO $$
DECLARE
    aviator_id UUID;
    perm_record RECORD;
BEGIN
    SELECT id INTO aviator_id FROM roles WHERE name = 'aviator';
    
    -- View organization settings
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT aviator_id, id, 'view'
    FROM permissions 
    WHERE category = 'organization' AND action = 'view'
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'view';
    
    -- Full project access
    FOR perm_record IN SELECT id FROM permissions WHERE category IN ('project', 'production', 'activation', 'task', 'document') LOOP
        INSERT INTO role_permissions (role_id, permission_id, access_level)
        VALUES (aviator_id, perm_record.id, 'full')
        ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'full';
    END LOOP;
    
    -- View finance
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT aviator_id, id, 'view'
    FROM permissions 
    WHERE category = 'finance'
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'view';
END $$;

-- GLADIATOR: Full project access
DO $$
DECLARE
    gladiator_id UUID;
    perm_record RECORD;
BEGIN
    SELECT id INTO gladiator_id FROM roles WHERE name = 'gladiator';
    
    -- Full project, production, activation access
    FOR perm_record IN SELECT id FROM permissions WHERE category IN ('project', 'production', 'activation', 'task', 'document') LOOP
        INSERT INTO role_permissions (role_id, permission_id, access_level)
        VALUES (gladiator_id, perm_record.id, 'manage')
        ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'manage';
    END LOOP;
    
    -- View and approve finance
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT gladiator_id, id, 'manage'
    FROM permissions 
    WHERE category = 'finance' AND action IN ('view', 'approve')
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'manage';
END $$;

-- NAVIGATOR: Department/area management
DO $$
DECLARE
    navigator_id UUID;
    perm_record RECORD;
BEGIN
    SELECT id INTO navigator_id FROM roles WHERE name = 'navigator';
    
    -- View project/production
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT navigator_id, id, 'view'
    FROM permissions 
    WHERE category IN ('project', 'production') AND action = 'view'
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'view';
    
    -- Manage activation, tasks, documents
    FOR perm_record IN SELECT id FROM permissions WHERE category IN ('activation', 'task', 'document') LOOP
        INSERT INTO role_permissions (role_id, permission_id, access_level)
        VALUES (navigator_id, perm_record.id, 'manage')
        ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'manage';
    END LOOP;
    
    -- View finance
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT navigator_id, id, 'view'
    FROM permissions 
    WHERE category = 'finance' AND action = 'view'
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'view';
END $$;

-- DEVIATOR: Team lead
DO $$
DECLARE
    deviator_id UUID;
BEGIN
    SELECT id INTO deviator_id FROM roles WHERE name = 'deviator';
    
    -- View project/production/activation
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT deviator_id, id, 'view'
    FROM permissions 
    WHERE category IN ('project', 'production', 'activation') AND action = 'view'
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'view';
    
    -- Manage tasks
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT deviator_id, id, 'manage'
    FROM permissions 
    WHERE category = 'task'
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'manage';
    
    -- Edit documents
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT deviator_id, id, 'edit'
    FROM permissions 
    WHERE category = 'document'
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'edit';
END $$;

-- RAIDER: Team member
DO $$
DECLARE
    raider_id UUID;
BEGIN
    SELECT id INTO raider_id FROM roles WHERE name = 'raider';
    
    -- View project/production/activation
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT raider_id, id, 'view'
    FROM permissions 
    WHERE category IN ('project', 'production', 'activation') AND action = 'view'
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'view';
    
    -- Edit assigned tasks
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT raider_id, id, 'edit'
    FROM permissions 
    WHERE category = 'task' AND action IN ('view', 'edit', 'complete')
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'edit';
    
    -- View and create documents
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT raider_id, id, 'edit'
    FROM permissions 
    WHERE category = 'document' AND action IN ('view', 'create', 'download')
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'edit';
END $$;

-- VENDOR: External contractor
DO $$
DECLARE
    vendor_id UUID;
BEGIN
    SELECT id INTO vendor_id FROM roles WHERE name = 'vendor';
    
    -- View assigned project areas
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT vendor_id, id, 'limited'
    FROM permissions 
    WHERE category IN ('project', 'production', 'activation') AND action = 'view'
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'limited';
    
    -- Vendor-specific permissions
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT vendor_id, id, 'manage'
    FROM permissions 
    WHERE category = 'vendor'
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'manage';
    
    -- View and upload documents
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT vendor_id, id, 'edit'
    FROM permissions 
    WHERE category = 'document' AND action IN ('view', 'create', 'download')
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'edit';
END $$;

-- VISITOR: Custom permissions (set per-instance)
-- No default permissions - configured by grantor

-- PARTNER: Read-only stakeholder
DO $$
DECLARE
    partner_id UUID;
BEGIN
    SELECT id INTO partner_id FROM roles WHERE name = 'partner';
    
    -- View-only access
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT partner_id, id, 'view'
    FROM permissions 
    WHERE action IN ('view', 'download')
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'view';
END $$;

-- AMBASSADOR: Marketing affiliate
DO $$
DECLARE
    ambassador_id UUID;
BEGIN
    SELECT id INTO ambassador_id FROM roles WHERE name = 'ambassador';
    
    -- Marketing permissions only
    INSERT INTO role_permissions (role_id, permission_id, access_level)
    SELECT ambassador_id, id, 'full'
    FROM permissions 
    WHERE category = 'marketing'
    ON CONFLICT (role_id, permission_id) DO UPDATE SET access_level = 'full';
END $$;

-- =============================================
-- PART 5: HIERARCHY-AWARE PERMISSION FUNCTIONS
-- =============================================

-- Drop existing function with different signature
DROP FUNCTION IF EXISTS user_has_permission(UUID, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS user_has_permission(UUID, TEXT, TEXT, UUID, UUID);

-- Check if user has permission at any level in hierarchy
CREATE OR REPLACE FUNCTION user_has_permission(
    user_uuid UUID,
    permission_category TEXT,
    permission_action TEXT,
    entity_type TEXT DEFAULT NULL,
    entity_uuid UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    has_perm BOOLEAN := FALSE;
    user_role_record RECORD;
    org_id UUID;
BEGIN
    -- Get organization for entity if provided
    IF entity_type IS NOT NULL AND entity_uuid IS NOT NULL THEN
        org_id := get_entity_organization(entity_type, entity_uuid);
    END IF;
    
    -- Check each role assignment for the user
    FOR user_role_record IN 
        SELECT ur.role_id, ur.organization_id, ur.project_id, r.name, r.scope
        FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = user_uuid
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    LOOP
        -- Legend has all permissions
        IF user_role_record.name = 'legend' THEN
            RETURN TRUE;
        END IF;
        
        -- Check if role has the permission
        IF EXISTS (
            SELECT 1 FROM role_permissions rp
            JOIN permissions p ON p.id = rp.permission_id
            WHERE rp.role_id = user_role_record.role_id
            AND p.category = permission_category
            AND p.action = permission_action
            AND rp.access_level != 'none'
        ) THEN
            -- Check scope matches
            IF org_id IS NULL OR user_role_record.organization_id = org_id THEN
                has_perm := TRUE;
            END IF;
        END IF;
    END LOOP;
    
    RETURN has_perm;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get user's effective permissions for an entity
CREATE OR REPLACE FUNCTION get_user_permissions(
    user_uuid UUID,
    entity_type TEXT,
    entity_uuid UUID
)
RETURNS TABLE (
    category TEXT,
    action TEXT,
    resource TEXT,
    access_level TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        p.category,
        p.action,
        p.resource,
        rp.access_level
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN permissions p ON p.id = rp.permission_id
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = user_uuid
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    AND (
        r.name = 'legend' OR
        ur.organization_id = get_entity_organization(entity_type, entity_uuid)
    )
    ORDER BY p.category, p.action;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- =============================================
-- PART 5: ENHANCED RLS POLICIES
-- =============================================

-- Projects: Hierarchy-aware access
DROP POLICY IF EXISTS "Users can view projects in their organizations" ON projects;
CREATE POLICY "Users can view projects in their organizations"
    ON projects FOR SELECT
    USING (
        user_has_permission(auth.uid(), 'project', 'view', 'project', id)
    );

DROP POLICY IF EXISTS "Admins can manage projects" ON projects;
CREATE POLICY "Users can manage projects with permission"
    ON projects FOR ALL
    USING (
        user_has_permission(auth.uid(), 'project', 'edit', 'project', id)
    );

-- Productions: Hierarchy-aware access
DROP POLICY IF EXISTS "Users can view their productions" ON productions;
CREATE POLICY "Users can view productions with permission"
    ON productions FOR SELECT
    USING (
        user_has_permission(auth.uid(), 'production', 'view', 'production', id)
    );

CREATE POLICY "Users can manage productions with permission"
    ON productions FOR ALL
    USING (
        user_has_permission(auth.uid(), 'production', 'edit', 'production', id)
    );

-- Activations: Hierarchy-aware access
DROP POLICY IF EXISTS "Users can view activations in their organizations" ON activations;
CREATE POLICY "Users can view activations with permission"
    ON activations FOR SELECT
    USING (
        user_has_permission(auth.uid(), 'activation', 'view', 'activation', id)
    );

DROP POLICY IF EXISTS "Admins can manage activations" ON activations;
CREATE POLICY "Users can manage activations with permission"
    ON activations FOR ALL
    USING (
        user_has_permission(auth.uid(), 'activation', 'edit', 'activation', id)
    );

-- Tasks: Assignment-based access
CREATE POLICY "Users can view assigned tasks"
    ON project_tasks FOR SELECT
    USING (
        assignee_id = auth.uid() OR
        auth.uid() = ANY(assignees) OR
        user_has_permission(auth.uid(), 'task', 'view', 'production', production_id)
    );

CREATE POLICY "Users can edit assigned tasks"
    ON project_tasks FOR UPDATE
    USING (
        (assignee_id = auth.uid() OR auth.uid() = ANY(assignees)) OR
        user_has_permission(auth.uid(), 'task', 'edit', 'production', production_id)
    );

CREATE POLICY "Team leads can create tasks"
    ON project_tasks FOR INSERT
    WITH CHECK (
        user_has_permission(auth.uid(), 'task', 'create', 'production', production_id)
    );

-- =============================================
-- PART 6: ROLE ASSIGNMENT VALIDATION
-- =============================================

-- Validate role assignment based on grantor's permissions
CREATE OR REPLACE FUNCTION validate_role_assignment()
RETURNS TRIGGER AS $$
DECLARE
    grantor_role TEXT;
    target_role TEXT;
    role_level INTEGER;
    grantor_level INTEGER;
BEGIN
    -- Get role names
    SELECT name, level INTO target_role, role_level FROM roles WHERE id = NEW.role_id;
    
    -- Legend can assign any role
    IF EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = NEW.granted_by
        AND r.name = 'legend'
    ) THEN
        RETURN NEW;
    END IF;
    
    -- Get grantor's highest role level
    SELECT MIN(r.level) INTO grantor_level
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = NEW.granted_by
    AND ur.organization_id = NEW.organization_id;
    
    -- Grantor must have higher or equal authority
    IF grantor_level IS NULL OR grantor_level > role_level THEN
        RAISE EXCEPTION 'Insufficient permissions to assign role: %', target_role;
    END IF;
    
    -- Visitor role can only be assigned by Gladiator or higher
    IF target_role = 'visitor' AND grantor_level > 4 THEN
        RAISE EXCEPTION 'Only Gladiator or higher can assign Visitor role';
    END IF;
    
    -- Visitor role must have expiration
    IF target_role = 'visitor' AND NEW.expires_at IS NULL THEN
        RAISE EXCEPTION 'Visitor role must have expiration date';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_role_assignment_trigger
    BEFORE INSERT OR UPDATE ON user_roles
    FOR EACH ROW EXECUTE FUNCTION validate_role_assignment();

-- =============================================
-- PART 7: AUDIT LOGGING FOR ROLE CHANGES
-- =============================================

CREATE TRIGGER audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON user_roles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- =============================================
-- COMMENTS & DOCUMENTATION
-- =============================================

COMMENT ON FUNCTION user_has_permission(UUID, TEXT, TEXT, TEXT, UUID) IS 'Check if user has specific permission at any level in hierarchy';
COMMENT ON FUNCTION get_user_permissions(UUID, TEXT, UUID) IS 'Get all effective permissions for user on an entity';
COMMENT ON FUNCTION validate_role_assignment() IS 'Validate role assignment based on grantor permissions';

COMMENT ON COLUMN roles.scope IS 'Hierarchy scope: platform, organization, project, department, team, individual, external, custom, observer, marketing';
COMMENT ON COLUMN user_roles.expires_at IS 'Expiration date for time-limited roles (required for Visitor)';
COMMENT ON COLUMN user_roles.custom_permissions IS 'Custom permission overrides for Visitor role';
