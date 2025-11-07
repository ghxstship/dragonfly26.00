-- Database Index Verification Script
-- Run this to check current index status before and after optimization
-- Date: 2025-10-19

-- ============================================================================
-- 1. UNINDEXED FOREIGN KEYS CHECK
-- ============================================================================
-- This should return 0 rows after migration 080 is applied

SELECT 
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
            AND tablename = tc.table_name
            AND indexdef LIKE '%' || kcu.column_name || '%'
    )
ORDER BY tc.table_name, kcu.column_name;

-- ============================================================================
-- 2. INDEX USAGE STATISTICS
-- ============================================================================
-- Shows which indexes are being used and which are not

SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched,
    pg_size_pretty(pg_relation_size(indexrelid)) as size,
    CASE 
        WHEN idx_scan = 0 THEN '⚠️  UNUSED'
        WHEN idx_scan < 10 THEN '⚡ LOW USAGE'
        WHEN idx_scan < 100 THEN '✅ MODERATE'
        ELSE '🚀 HIGH USAGE'
    END as usage_status
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC;

-- ============================================================================
-- 3. TABLE SIZE AND INDEX OVERHEAD
-- ============================================================================
-- Shows how much space indexes are taking per table

SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as indexes_size,
    ROUND(
        100.0 * (pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) / 
        NULLIF(pg_total_relation_size(schemaname||'.'||tablename), 0),
        2
    ) as index_percentage
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 30;

-- ============================================================================
-- 4. DUPLICATE INDEXES CHECK
-- ============================================================================
-- Identifies potentially duplicate indexes

SELECT 
    pg_size_pretty(SUM(pg_relation_size(idx))::BIGINT) AS total_size,
    array_agg(idx) AS duplicate_indexes,
    COUNT(*) as duplicate_count
FROM (
    SELECT 
        indexrelid::regclass AS idx,
        (indrelid::text ||E'\n'|| indclass::text ||E'\n'|| indkey::text ||E'\n'||
         COALESCE(indexprs::text,'')||E'\n' || COALESCE(indpred::text,'')) AS KEY
    FROM pg_index
) sub
GROUP BY KEY 
HAVING COUNT(*) > 1
ORDER BY SUM(pg_relation_size(idx)) DESC;

-- ============================================================================
-- 5. FOREIGN KEY CONSTRAINTS SUMMARY
-- ============================================================================
-- Count of foreign keys per table

SELECT 
    tc.table_name,
    COUNT(*) as fk_count,
    array_agg(tc.constraint_name) as constraint_names
FROM information_schema.table_constraints AS tc
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
GROUP BY tc.table_name
ORDER BY COUNT(*) DESC;

-- ============================================================================
-- 6. INDEX COUNT PER TABLE
-- ============================================================================
-- Shows how many indexes each table has

SELECT 
    schemaname,
    tablename,
    COUNT(*) as index_count,
    pg_size_pretty(SUM(pg_relation_size(indexrelid))) as total_index_size,
    array_agg(indexname ORDER BY indexname) as index_names
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY COUNT(*) DESC;

-- ============================================================================
-- 7. RECENTLY CREATED INDEXES
-- ============================================================================
-- Shows indexes created in the last 7 days (if tracking is enabled)

SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY indexname DESC
LIMIT 50;

-- ============================================================================
-- 8. BLOATED INDEXES CHECK
-- ============================================================================
-- Identifies indexes that may need reindexing

SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as size,
    idx_scan,
    CASE 
        WHEN idx_scan = 0 THEN 'Consider dropping'
        WHEN pg_relation_size(indexrelid) > 100000000 THEN 'Consider reindexing'
        ELSE 'OK'
    END as recommendation
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
    AND (idx_scan = 0 OR pg_relation_size(indexrelid) > 100000000)
ORDER BY pg_relation_size(indexrelid) DESC;

-- ============================================================================
-- 9. MISSING INDEXES ON FREQUENTLY QUERIED COLUMNS
-- ============================================================================
-- This requires pg_stat_statements extension

-- First check if extension is enabled
SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
) as pg_stat_statements_enabled;

-- ============================================================================
-- 10. SUMMARY STATISTICS
-- ============================================================================

SELECT 
    'Total Tables' as metric,
    COUNT(DISTINCT tablename)::text as value
FROM pg_tables
WHERE schemaname = 'public'

UNION ALL

SELECT 
    'Total Indexes' as metric,
    COUNT(*)::text as value
FROM pg_indexes
WHERE schemaname = 'public'

UNION ALL

SELECT 
    'Unused Indexes' as metric,
    COUNT(*)::text as value
FROM pg_stat_user_indexes
WHERE schemaname = 'public' AND idx_scan = 0

UNION ALL

SELECT 
    'Total Index Size' as metric,
    pg_size_pretty(SUM(pg_relation_size(indexrelid))) as value
FROM pg_stat_user_indexes
WHERE schemaname = 'public'

UNION ALL

SELECT 
    'Total Database Size' as metric,
    pg_size_pretty(pg_database_size(current_database())) as value;

-- ============================================================================
-- USAGE INSTRUCTIONS
-- ============================================================================

/*
To run this verification script:

1. Before optimization:
   supabase db execute -f scripts/verify-database-indexes.sql > reports/indexes_before.txt

2. After optimization:
   supabase db execute -f scripts/verify-database-indexes.sql > reports/indexes_after.txt

3. Compare results:
   diff reports/indexes_before.txt reports/indexes_after.txt

Expected changes after optimization:
- Section 1 (Unindexed FKs): Should show 0 rows
- Section 2 (Index Usage): Should show new indexes with 0 scans initially
- Section 3 (Table Sizes): Index sizes should increase slightly
- Section 8 (Bloated Indexes): Unused indexes should be removed

Monitor Section 2 over the next week to ensure new indexes are being used.
*/
