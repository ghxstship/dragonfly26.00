-- =============================================
-- DEMO ISOLATION VERIFICATION SCRIPT
-- Purpose: Verify demo data is properly isolated
-- =============================================

-- Test 1: Check demo flag exists on all tables
SELECT 
    'organizations' as table_name,
    COUNT(*) FILTER (WHERE is_demo = true) as demo_count,
    COUNT(*) FILTER (WHERE is_demo = false OR is_demo IS NULL) as real_count
FROM organizations
UNION ALL
SELECT 
    'profiles',
    COUNT(*) FILTER (WHERE is_demo = true),
    COUNT(*) FILTER (WHERE is_demo = false OR is_demo IS NULL)
FROM profiles
UNION ALL
SELECT 
    'workspaces',
    COUNT(*) FILTER (WHERE is_demo = true),
    COUNT(*) FILTER (WHERE is_demo = false OR is_demo IS NULL)
FROM workspaces
UNION ALL
SELECT 
    'projects',
    COUNT(*) FILTER (WHERE is_demo = true),
    COUNT(*) FILTER (WHERE is_demo = false OR is_demo IS NULL)
FROM projects
UNION ALL
SELECT 
    'productions',
    COUNT(*) FILTER (WHERE is_demo = true),
    COUNT(*) FILTER (WHERE is_demo = false OR is_demo IS NULL)
FROM productions
UNION ALL
SELECT 
    'activations',
    COUNT(*) FILTER (WHERE is_demo = true),
    COUNT(*) FILTER (WHERE is_demo = false OR is_demo IS NULL)
FROM activations;

-- Expected Results:
-- organizations: demo_count = 1 (Starlight Productions), real_count = 0 (or your real orgs)
-- profiles: demo_count = 11 (fictional characters), real_count = 0 (or your real users)
-- workspaces: demo_count = 1 (Nebula Nights), real_count = 0 (or your real workspaces)
-- projects: demo_count = 1 (Galactic Festivals), real_count = 0 (or your real projects)
-- productions: demo_count = 1 (Nebula Nights Festival), real_count = 0 (or your real productions)
-- activations: demo_count = 1 (Quantum Stage), real_count = 0 (or your real activations)

-- Test 2: Verify no real company names in demo data
SELECT 
    'Real company names found in demo data' as issue,
    COUNT(*) as violations
FROM (
    SELECT name FROM organizations WHERE is_demo = true AND (
        name ILIKE '%insomniac%' OR
        name ILIKE '%live nation%' OR
        name ILIKE '%prg%' OR
        name ILIKE '%production resource%'
    )
    UNION ALL
    SELECT name FROM companies WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE is_demo = true
    ) AND (
        name ILIKE '%insomniac%' OR
        name ILIKE '%live nation%' OR
        name ILIKE '%prg%' OR
        name ILIKE '%production resource%'
    )
) violations;

-- Expected: violations = 0

-- Test 3: Verify no real event names in demo data
SELECT 
    'Real event names found in demo data' as issue,
    COUNT(*) as violations
FROM (
    SELECT name FROM productions WHERE is_demo = true AND (
        name ILIKE '%edc%' OR
        name ILIKE '%electric daisy%' OR
        name ILIKE '%beyond wonderland%' OR
        name ILIKE '%nocturnal%'
    )
    UNION ALL
    SELECT name FROM activations WHERE is_demo = true AND (
        name ILIKE '%kinetic field%' OR
        name ILIKE '%edc%'
    )
    UNION ALL
    SELECT title FROM events WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE is_demo = true
    ) AND (
        title ILIKE '%edc%' OR
        title ILIKE '%kinetic%'
    )
) violations;

-- Expected: violations = 0

-- Test 4: Verify no real person names in demo data
SELECT 
    'Real person names found in demo data' as issue,
    COUNT(*) as violations
FROM profiles
WHERE is_demo = true AND (
    first_name IN ('Sarah', 'Marcus', 'Jennifer', 'David', 'Lisa', 'James', 'Emily', 'Michael', 'Rachel', 'Robert', 'Sophia') OR
    last_name IN ('Chen', 'Rodriguez', 'Park', 'Thompson', 'Martinez', 'Wilson', 'Johnson', 'Brown', 'Green', 'Taylor', 'Davis')
);

-- Expected: violations = 0

-- Test 5: Verify all demo users have fictional email domains
SELECT 
    'Real email domains found in demo users' as issue,
    COUNT(*) as violations
FROM profiles
WHERE is_demo = true AND (
    email ILIKE '%@atlvs.io' OR
    email ILIKE '%@insomniac.com' OR
    email ILIKE '%@prg.com' OR
    email ILIKE '%@livenation.com' OR
    email ILIKE '%@clarkcounty.gov' OR
    email NOT ILIKE '%.demo'
);

-- Expected: violations = 0

-- Test 6: Verify helper functions exist
SELECT 
    'Helper functions' as category,
    proname as function_name,
    'EXISTS' as status
FROM pg_proc
WHERE proname IN ('is_demo_user', 'get_user_demo_mode');

-- Expected: 2 rows (both functions exist)

-- Test 7: Verify RLS policies are updated
SELECT 
    schemaname,
    tablename,
    policyname,
    'EXISTS' as status
FROM pg_policies
WHERE policyname ILIKE '%demo%' OR policyname ILIKE '%organization%'
ORDER BY tablename, policyname;

-- Expected: Multiple policies with demo filtering

-- Test 8: List all demo users
SELECT 
    first_name || ' ' || last_name as character_name,
    email,
    job_title,
    is_demo
FROM profiles
WHERE is_demo = true
ORDER BY id;

-- Expected: 11 fictional characters with .demo email addresses

-- Test 9: List all demo organizations
SELECT 
    name,
    slug,
    subscription_tier,
    is_demo
FROM organizations
WHERE is_demo = true;

-- Expected: Starlight Productions

-- Test 10: Verify demo data relationships
SELECT 
    o.name as organization,
    p.name as project,
    pr.name as production,
    a.name as activation,
    w.name as workspace
FROM organizations o
LEFT JOIN projects p ON p.organization_id = o.id
LEFT JOIN productions pr ON pr.project_id = p.id
LEFT JOIN activations a ON a.production_id = pr.id
LEFT JOIN workspaces w ON w.activation_id = a.id
WHERE o.is_demo = true;

-- Expected: Complete hierarchy from Starlight Productions → Galactic Festivals → Nebula Nights → Quantum Stage → Quantum Operations

-- =============================================
-- SUMMARY
-- =============================================

SELECT 
    '✅ VERIFICATION COMPLETE' as status,
    'Check all tests above for 0 violations' as instruction,
    'Demo data should be completely isolated from real data' as note;
