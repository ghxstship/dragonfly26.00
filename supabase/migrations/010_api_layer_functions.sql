-- =============================================
-- LAYER 3: API LAYER - Custom RPC Functions
-- Database Functions for Business Logic & Complex Queries
-- Migration: 010
-- =============================================

-- =============================================
-- PERMISSION CHECK FUNCTIONS
-- =============================================

-- Check if user has specific permission
CREATE OR REPLACE FUNCTION has_permission(
    p_user_id UUID,
    p_permission_category TEXT,
    p_permission_action TEXT,
    p_resource TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    user_role_level INTEGER;
    has_perm BOOLEAN;
BEGIN
    -- Get user's highest role level
    SELECT MIN(r.level) INTO user_role_level
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = p_user_id
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW());
    
    -- Legend (level 1) has all permissions
    IF user_role_level = 1 THEN
        RETURN TRUE;
    END IF;
    
    -- Check specific permissions
    SELECT EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN role_permissions rp ON rp.role_id = ur.role_id
        JOIN permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = p_user_id
        AND p.category = p_permission_category
        AND p.action = p_permission_action
        AND (p_resource IS NULL OR p.resource = p_resource)
        AND rp.access_level != 'none'
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    ) INTO has_perm;
    
    RETURN COALESCE(has_perm, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can access workspace
CREATE OR REPLACE FUNCTION can_access_workspace(
    p_user_id UUID,
    p_workspace_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM workspaces w
        JOIN organization_members om ON om.organization_id = w.organization_id
        WHERE w.id = p_workspace_id
        AND om.user_id = p_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's role in workspace
CREATE OR REPLACE FUNCTION get_user_role_in_workspace(
    p_user_id UUID,
    p_workspace_id UUID
)
RETURNS TABLE (
    role_name TEXT,
    role_level INTEGER,
    access_level TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.name,
        r.level,
        'full'::TEXT as access_level
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    JOIN workspaces w ON w.id = p_workspace_id
    WHERE ur.user_id = p_user_id
    AND (
        ur.workspace_id = p_workspace_id
        OR ur.organization_id = w.organization_id
    )
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    ORDER BY r.level ASC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PROJECT / PRODUCTION FUNCTIONS
-- =============================================

-- Get production summary with stats
CREATE OR REPLACE FUNCTION get_production_summary(p_production_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'production', row_to_json(p.*),
        'stats', json_build_object(
            'tasks_total', (SELECT COUNT(*) FROM project_tasks WHERE production_id = p_production_id),
            'tasks_completed', (SELECT COUNT(*) FROM project_tasks WHERE production_id = p_production_id AND status = 'done'),
            'milestones_total', (SELECT COUNT(*) FROM project_milestones WHERE production_id = p_production_id),
            'milestones_completed', (SELECT COUNT(*) FROM project_milestones WHERE production_id = p_production_id AND status = 'completed'),
            'budget_spent_percent', CASE WHEN p.budget > 0 THEN (p.budget_spent / p.budget * 100) ELSE 0 END,
            'team_size', array_length(p.team_members, 1)
        )
    ) INTO result
    FROM productions p
    WHERE p.id = p_production_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate production health score
CREATE OR REPLACE FUNCTION calculate_production_health(p_production_id UUID)
RETURNS TEXT AS $$
DECLARE
    overdue_tasks INTEGER;
    budget_variance DECIMAL;
    days_to_deadline INTEGER;
    health_score INTEGER := 100;
BEGIN
    -- Check overdue tasks
    SELECT COUNT(*) INTO overdue_tasks
    FROM project_tasks
    WHERE production_id = p_production_id
    AND due_date < NOW()
    AND status NOT IN ('done', 'cancelled');
    
    -- Check budget variance
    SELECT 
        CASE 
            WHEN budget > 0 THEN ((budget_spent - budget) / budget * 100)
            ELSE 0
        END INTO budget_variance
    FROM productions
    WHERE id = p_production_id;
    
    -- Check days to deadline
    SELECT 
        EXTRACT(DAY FROM (end_date - NOW()))::INTEGER INTO days_to_deadline
    FROM productions
    WHERE id = p_production_id;
    
    -- Calculate health score
    health_score := health_score - (overdue_tasks * 10);
    health_score := health_score - (CASE WHEN budget_variance > 10 THEN 20 ELSE 0 END);
    health_score := health_score - (CASE WHEN days_to_deadline < 7 THEN 15 ELSE 0 END);
    
    -- Return health status
    RETURN CASE
        WHEN health_score >= 80 THEN 'healthy'
        WHEN health_score >= 50 THEN 'at_risk'
        ELSE 'critical'
    END;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- FINANCIAL FUNCTIONS
-- =============================================

-- Calculate budget variance
CREATE OR REPLACE FUNCTION get_budget_variance(p_budget_id UUID)
RETURNS TABLE (
    category TEXT,
    budgeted DECIMAL,
    actual DECIMAL,
    variance DECIMAL,
    variance_percent DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bli.category,
        bli.budgeted_amount,
        bli.actual_amount,
        (bli.actual_amount - bli.budgeted_amount) as variance,
        CASE 
            WHEN bli.budgeted_amount > 0 
            THEN ((bli.actual_amount - bli.budgeted_amount) / bli.budgeted_amount * 100)
            ELSE 0
        END as variance_percent
    FROM budget_line_items bli
    WHERE bli.budget_id = p_budget_id
    ORDER BY bli.category;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get financial summary for production
CREATE OR REPLACE FUNCTION get_production_financials(p_production_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'budget', (SELECT total_amount FROM budgets WHERE production_id = p_production_id ORDER BY created_at DESC LIMIT 1),
        'spent', (SELECT SUM(amount) FROM financial_transactions WHERE production_id = p_production_id AND type = 'expense'),
        'income', (SELECT SUM(amount) FROM financial_transactions WHERE production_id = p_production_id AND type = 'income'),
        'pending_invoices', (SELECT COUNT(*) FROM invoices WHERE production_id = p_production_id AND status NOT IN ('paid', 'cancelled')),
        'pending_pos', (SELECT COUNT(*) FROM purchase_orders WHERE production_id = p_production_id AND status NOT IN ('fulfilled', 'cancelled'))
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PERSONNEL & TIME TRACKING FUNCTIONS
-- =============================================

-- Calculate total hours worked by personnel
CREATE OR REPLACE FUNCTION get_personnel_hours(
    p_personnel_id UUID,
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS DECIMAL AS $$
DECLARE
    total_hours DECIMAL;
BEGIN
    SELECT COALESCE(SUM(EXTRACT(EPOCH FROM duration) / 3600), 0) INTO total_hours
    FROM time_entries
    WHERE personnel_id = p_personnel_id
    AND (p_start_date IS NULL OR start_time >= p_start_date)
    AND (p_end_date IS NULL OR end_time <= p_end_date);
    
    RETURN total_hours;
END;
$$ LANGUAGE plpgsql;

-- Get team availability
CREATE OR REPLACE FUNCTION get_team_availability(
    p_team_id UUID,
    p_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    personnel_id UUID,
    name TEXT,
    is_available BOOLEAN,
    current_assignment TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.first_name || ' ' || p.last_name as name,
        NOT EXISTS (
            SELECT 1 FROM time_entries te
            WHERE te.personnel_id = p.id
            AND te.start_time <= p_date
            AND (te.end_time IS NULL OR te.end_time >= p_date)
        ) as is_available,
        (
            SELECT pr.name 
            FROM personnel_assignments pa
            JOIN productions pr ON pr.id = pa.production_id
            WHERE pa.personnel_id = p.id
            AND pa.status = 'active'
            ORDER BY pa.start_date DESC
            LIMIT 1
        ) as current_assignment
    FROM personnel p
    WHERE p.id = ANY((SELECT members FROM teams WHERE id = p_team_id));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- EVENT & SCHEDULING FUNCTIONS
-- =============================================

-- Check for scheduling conflicts
CREATE OR REPLACE FUNCTION check_schedule_conflict(
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_location_id UUID DEFAULT NULL,
    p_exclude_event_id UUID DEFAULT NULL
)
RETURNS TABLE (
    event_id UUID,
    event_name TEXT,
    conflict_type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.name,
        'location_conflict'::TEXT as conflict_type
    FROM events e
    WHERE e.location_id = p_location_id
    AND e.id != COALESCE(p_exclude_event_id, '00000000-0000-0000-0000-000000000000'::UUID)
    AND e.status NOT IN ('cancelled', 'completed')
    AND (
        (e.start_time <= p_start_time AND e.end_time > p_start_time)
        OR (e.start_time < p_end_time AND e.end_time >= p_end_time)
        OR (e.start_time >= p_start_time AND e.end_time <= p_end_time)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate run of show from template
CREATE OR REPLACE FUNCTION generate_run_of_show(
    p_event_id UUID,
    p_template_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    rows_inserted INTEGER;
BEGIN
    -- This would copy from a template - simplified version
    INSERT INTO run_of_show (event_id, workspace_id, sequence_number, action, description)
    SELECT 
        p_event_id,
        e.workspace_id,
        row_number() OVER (ORDER BY created_at),
        'Placeholder Action',
        'Generated from template'
    FROM events e
    WHERE e.id = p_event_id
    LIMIT 10; -- Placeholder
    
    GET DIAGNOSTICS rows_inserted = ROW_COUNT;
    RETURN rows_inserted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ASSET MANAGEMENT FUNCTIONS
-- =============================================

-- Get asset availability
CREATE OR REPLACE FUNCTION get_asset_availability(
    p_asset_id UUID,
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM asset_transactions
        WHERE asset_id = p_asset_id
        AND type = 'check_out'
        AND checked_out_at <= p_end_date
        AND (expected_return_at IS NULL OR expected_return_at >= p_start_date)
        AND checked_in_at IS NULL
    );
END;
$$ LANGUAGE plpgsql;

-- Calculate asset utilization rate
CREATE OR REPLACE FUNCTION get_asset_utilization(
    p_asset_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS DECIMAL AS $$
DECLARE
    total_days DECIMAL := p_days;
    days_in_use DECIMAL;
BEGIN
    SELECT COALESCE(SUM(
        EXTRACT(DAY FROM (
            COALESCE(checked_in_at, NOW()) - checked_out_at
        ))
    ), 0) INTO days_in_use
    FROM asset_transactions
    WHERE asset_id = p_asset_id
    AND type = 'check_out'
    AND checked_out_at >= (NOW() - (p_days || ' days')::INTERVAL);
    
    RETURN (days_in_use / total_days * 100);
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- ANALYTICS & REPORTING FUNCTIONS
-- =============================================

-- Get workspace dashboard stats
CREATE OR REPLACE FUNCTION get_workspace_dashboard(p_workspace_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'productions', json_build_object(
            'total', (SELECT COUNT(*) FROM productions WHERE workspace_id = p_workspace_id),
            'active', (SELECT COUNT(*) FROM productions WHERE workspace_id = p_workspace_id AND status = 'active'),
            'planning', (SELECT COUNT(*) FROM productions WHERE workspace_id = p_workspace_id AND status = 'planning')
        ),
        'events', json_build_object(
            'upcoming', (SELECT COUNT(*) FROM events WHERE workspace_id = p_workspace_id AND start_time > NOW() AND status = 'scheduled'),
            'today', (SELECT COUNT(*) FROM events WHERE workspace_id = p_workspace_id AND DATE(start_time) = CURRENT_DATE)
        ),
        'tasks', json_build_object(
            'open', (SELECT COUNT(*) FROM project_tasks WHERE workspace_id = p_workspace_id AND status NOT IN ('done', 'cancelled')),
            'overdue', (SELECT COUNT(*) FROM project_tasks WHERE workspace_id = p_workspace_id AND due_date < NOW() AND status NOT IN ('done', 'cancelled'))
        ),
        'personnel', json_build_object(
            'total', (SELECT COUNT(*) FROM personnel WHERE workspace_id = p_workspace_id AND employment_status = 'active')
        ),
        'budget', json_build_object(
            'total_allocated', (SELECT COALESCE(SUM(total_amount), 0) FROM budgets WHERE workspace_id = p_workspace_id AND status = 'active'),
            'total_spent', (SELECT COALESCE(SUM(amount), 0) FROM financial_transactions WHERE workspace_id = p_workspace_id AND type = 'expense')
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SEARCH FUNCTIONS
-- =============================================

-- Global search across modules
CREATE OR REPLACE FUNCTION global_search(
    p_workspace_id UUID,
    p_query TEXT,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    type TEXT,
    id UUID,
    title TEXT,
    subtitle TEXT,
    url TEXT,
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    -- Search productions
    SELECT 
        'production'::TEXT,
        p.id,
        p.name,
        p.type::TEXT,
        '/productions/' || p.id::TEXT,
        ts_rank(to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')), plainto_tsquery('english', p_query))
    FROM productions p
    WHERE p.workspace_id = p_workspace_id
    AND to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', p_query)
    
    UNION ALL
    
    -- Search events
    SELECT 
        'event'::TEXT,
        e.id,
        e.name,
        e.type::TEXT,
        '/events/' || e.id::TEXT,
        ts_rank(to_tsvector('english', e.name || ' ' || COALESCE(e.description, '')), plainto_tsquery('english', p_query))
    FROM events e
    WHERE e.workspace_id = p_workspace_id
    AND to_tsvector('english', e.name || ' ' || COALESCE(e.description, '')) @@ plainto_tsquery('english', p_query)
    
    UNION ALL
    
    -- Search personnel
    SELECT 
        'person'::TEXT,
        pe.id,
        pe.first_name || ' ' || pe.last_name,
        COALESCE(pe.role, ''),
        '/people/' || pe.id::TEXT,
        ts_rank(to_tsvector('english', pe.first_name || ' ' || pe.last_name || ' ' || COALESCE(pe.email, '')), plainto_tsquery('english', p_query))
    FROM personnel pe
    WHERE pe.workspace_id = p_workspace_id
    AND to_tsvector('english', pe.first_name || ' ' || pe.last_name || ' ' || COALESCE(pe.email, '')) @@ plainto_tsquery('english', p_query)
    
    ORDER BY relevance DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON FUNCTION has_permission IS 'Check if user has specific permission based on their role';
COMMENT ON FUNCTION get_production_summary IS 'Get complete production overview with statistics';
COMMENT ON FUNCTION calculate_production_health IS 'Calculate production health based on tasks, budget, and timeline';
COMMENT ON FUNCTION get_budget_variance IS 'Calculate budget variance by category';
COMMENT ON FUNCTION global_search IS 'Global search across all modules in a workspace';
