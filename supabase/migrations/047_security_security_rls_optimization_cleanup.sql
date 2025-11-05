-- Migration: RLS Optimization - Final Cleanup
-- Date: October 19, 2025
-- Purpose: Optimize ALL remaining unoptimized policies (final pass)
-- Target: 100% optimization rate

-- ============================================================
-- OPTIMIZE ALL REMAINING TABLES WITH DYNAMIC SQL
-- ============================================================

DO $$
DECLARE
    policy_record RECORD;
    new_qual TEXT;
BEGIN
    -- Loop through all unoptimized policies
    FOR policy_record IN 
        SELECT 
            schemaname,
            tablename,
            policyname,
            qual,
            cmd
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND qual LIKE '%(SELECT (SELECT auth.uid()))%'
        AND qual NOT LIKE '%(select (SELECT (SELECT auth.uid())))%'
    LOOP
        -- Replace (SELECT (SELECT auth.uid())) with (select (SELECT (SELECT auth.uid())))
        new_qual := REPLACE(policy_record.qual, '(SELECT (SELECT auth.uid()))', '(select (SELECT (SELECT auth.uid())))');
        
        -- Drop the old policy
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
            policy_record.policyname,
            policy_record.schemaname,
            policy_record.tablename
        );
        
        -- Recreate with optimized qual
        EXECUTE format('CREATE POLICY %I ON %I.%I FOR %s USING (%s)',
            policy_record.policyname,
            policy_record.schemaname,
            policy_record.tablename,
            policy_record.cmd,
            new_qual
        );
        
        RAISE NOTICE 'Optimized: %.% - %', 
            policy_record.tablename, 
            policy_record.policyname,
            policy_record.cmd;
            
    END LOOP;
END $$;

-- ============================================================
-- FINAL VERIFICATION
-- ============================================================

DO $$
DECLARE
    unoptimized_count INTEGER;
    total_policies INTEGER;
    optimization_pct NUMERIC;
BEGIN
    SELECT COUNT(*) INTO unoptimized_count
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND qual LIKE '%(SELECT (SELECT auth.uid()))%'
    AND qual NOT LIKE '%(select (SELECT (SELECT auth.uid())))%';
    
    SELECT COUNT(*) INTO total_policies
    FROM pg_policies 
    WHERE schemaname = 'public';
    
    optimization_pct := ((total_policies - unoptimized_count)::NUMERIC / total_policies * 100);
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE '🎯 FINAL RLS OPTIMIZATION STATUS';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Total policies: %', total_policies;
    RAISE NOTICE 'Optimized policies: %', (total_policies - unoptimized_count);
    RAISE NOTICE 'Unoptimized policies: %', unoptimized_count;
    RAISE NOTICE 'Optimization rate: % percent', ROUND(optimization_pct, 1);
    RAISE NOTICE '============================================';
    
    IF unoptimized_count = 0 THEN
        RAISE NOTICE '✅ PERFECT: 100 percent optimization achieved!';
        RAISE NOTICE '🎉 All % RLS policies are now optimized!', total_policies;
    ELSIF unoptimized_count < 5 THEN
        RAISE NOTICE '✅ EXCELLENT: % percent optimized!', ROUND(optimization_pct, 1);
    ELSIF optimization_pct >= 95 THEN
        RAISE NOTICE '✅ GREAT: Over 95 percent optimized!';
    ELSE
        RAISE NOTICE '⚠️  % policies still need optimization', unoptimized_count;
    END IF;
    
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
END $$;
