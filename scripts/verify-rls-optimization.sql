-- RLS Performance Optimization Verification Script
-- Run this after applying migrations 080 and 081

-- ============================================================
-- 1. CHECK FOR REMAINING auth.uid() ISSUES
-- ============================================================

SELECT 
    tablename,
    policyname,
    qual as policy_definition
FROM pg_policies 
WHERE schemaname = 'public' 
AND qual LIKE '%auth.uid()%'
AND qual NOT LIKE '%(select auth.uid())%'
ORDER BY tablename, policyname;

-- Expected: 0 rows
-- If any rows returned, those policies still need optimization

-- ============================================================
-- 2. CHECK FOR DUPLICATE INDEXES
-- ============================================================

SELECT 
    t.schemaname,
    t.tablename,
    array_agg(t.indexname ORDER BY t.indexname) as duplicate_indexes,
    t.indexdef as index_definition
FROM pg_indexes t
JOIN pg_indexes t2 ON 
    t.schemaname = t2.schemaname 
    AND t.tablename = t2.tablename 
    AND t.indexdef = t2.indexdef 
    AND t.indexname < t2.indexname
WHERE t.schemaname = 'public'
GROUP BY t.schemaname, t.tablename, t.indexdef
ORDER BY t.tablename;

-- Expected: 0 rows
-- If any rows returned, those are duplicate indexes that should be dropped

-- ============================================================
-- 3. VERIFY HELPER FUNCTIONS EXIST
-- ============================================================

SELECT 
    proname as function_name,
    pg_get_functiondef(oid) as function_definition
FROM pg_proc
WHERE proname IN (
    'is_workspace_member_optimized',
    'is_org_member_optimized', 
    'is_org_admin_optimized'
)
ORDER BY proname;

-- Expected: 3 rows
-- Should see all three helper functions

-- ============================================================
-- 4. COUNT POLICIES PER TABLE
-- ============================================================

SELECT 
    tablename,
    COUNT(*) as policy_count,
    array_agg(policyname ORDER BY policyname) as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
HAVING COUNT(*) > 3
ORDER BY policy_count DESC, tablename;

-- Most tables should have 2-3 policies now (down from 4-5)
-- Tables with >3 policies may need consolidation

-- ============================================================
-- 5. VERIFY SPECIFIC OPTIMIZED POLICIES
-- ============================================================

-- Check a sample of critical tables
SELECT 
    tablename,
    policyname,
    CASE 
        WHEN qual LIKE '%is_workspace_member_optimized%' THEN '✅ Optimized'
        WHEN qual LIKE '%is_org_member_optimized%' THEN '✅ Optimized'
        WHEN qual LIKE '%is_org_admin_optimized%' THEN '✅ Optimized'
        WHEN qual LIKE '%(select auth.uid())%' THEN '✅ Optimized'
        WHEN qual LIKE '%auth.uid()%' THEN '❌ Needs optimization'
        ELSE '⚠️  Unknown'
    END as optimization_status
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN (
    'productions',
    'events', 
    'personnel',
    'assets',
    'companies',
    'invoices',
    'workspaces',
    'organizations'
)
ORDER BY tablename, policyname;

-- All should show ✅ Optimized

-- ============================================================
-- 6. TEST QUERY PERFORMANCE
-- ============================================================

-- Enable timing
\timing on

-- Test workspace member check (should be fast)
EXPLAIN ANALYZE
SELECT is_workspace_member_optimized('00000000-0000-0000-0000-000000000000'::uuid);

-- Test production query (should show InitPlan at top, not per-row)
EXPLAIN ANALYZE
SELECT * FROM productions
WHERE is_workspace_member_optimized(workspace_id)
LIMIT 100;

-- Look for:
-- ✅ "InitPlan" appears once at query start
-- ❌ No "SubPlan" in row filters
-- ✅ Execution time reasonable (<100ms for 100 rows)

-- ============================================================
-- 7. VERIFY INDEXES WERE DROPPED
-- ============================================================

SELECT 
    indexname,
    tablename
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname IN (
    'idx_community_posts_author',
    'idx_connections_user',
    'idx_events_organizer',
    'idx_files_uploader',
    'idx_marketplace_orders_buyer',
    'idx_prod_adv_requestor',
    'idx_thread_messages_author'
)
ORDER BY tablename, indexname;

-- Expected: 0 rows
-- These duplicate indexes should be gone

-- ============================================================
-- 8. SUMMARY STATISTICS
-- ============================================================

SELECT 
    'Total Tables with RLS' as metric,
    COUNT(DISTINCT tablename)::text as value
FROM pg_policies
WHERE schemaname = 'public'

UNION ALL

SELECT 
    'Total RLS Policies' as metric,
    COUNT(*)::text as value
FROM pg_policies
WHERE schemaname = 'public'

UNION ALL

SELECT 
    'Policies using optimized functions' as metric,
    COUNT(*)::text as value
FROM pg_policies
WHERE schemaname = 'public'
AND (
    qual LIKE '%is_workspace_member_optimized%'
    OR qual LIKE '%is_org_member_optimized%'
    OR qual LIKE '%is_org_admin_optimized%'
    OR (qual LIKE '%(select auth.uid())%' AND qual NOT LIKE '%auth.uid()%auth.uid()%')
)

UNION ALL

SELECT 
    'Policies needing optimization' as metric,
    COUNT(*)::text as value
FROM pg_policies
WHERE schemaname = 'public'
AND qual LIKE '%auth.uid()%'
AND qual NOT LIKE '%(select auth.uid())%'

UNION ALL

SELECT 
    'Duplicate indexes remaining' as metric,
    COUNT(DISTINCT t.tablename || '.' || t.indexname)::text as value
FROM pg_indexes t
JOIN pg_indexes t2 ON 
    t.schemaname = t2.schemaname 
    AND t.tablename = t2.tablename 
    AND t.indexdef = t2.indexdef 
    AND t.indexname < t2.indexname
WHERE t.schemaname = 'public';

-- ============================================================
-- EXPECTED RESULTS SUMMARY
-- ============================================================

/*
✅ PASS CRITERIA:

1. auth.uid() issues: 0 rows
2. Duplicate indexes: 0 rows  
3. Helper functions: 3 functions exist
4. Most tables: 2-3 policies (down from 4-5)
5. Sample policies: All show ✅ Optimized
6. Query performance: InitPlan once, no SubPlan per row
7. Dropped indexes: 0 rows (all removed)
8. Summary stats:
   - Policies needing optimization: 0
   - Duplicate indexes remaining: 0
   - Policies using optimized functions: >100

If any checks fail, review the migration files and re-apply.
*/
