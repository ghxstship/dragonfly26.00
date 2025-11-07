#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Tables from warnings - we'll use DROP POLICY IF EXISTS which won't fail
const tables = [
  "marketplace_favorites", "marketplace_lists", "marketplace_purchases",
  "marketplace_reviews", "marketplace_sales", "marketplace_services", "marketplace_vendors",
  "people_availability", "people_certifications", "people_departments",
  "people_directory", "people_skills", "people_teams",
  "project_budgets", "project_dependencies", "project_documents",
  "project_gantt", "project_milestones", "project_phases",
  "project_resources", "project_risks", "project_timelines",
  "report_builder", "report_dashboards", "report_exports", "report_schedules",
  "resource_courses", "resource_glossary", "resource_grants",
  "resource_guides", "resource_library", "resource_publications", "resource_troubleshooting"
];

let sql = `-- Migration: Fix All Remaining Auth RLS Warnings (Safe Version)
-- Generated: 2025-10-21
-- 
-- This migration fixes auth.uid() warnings using conditional logic
-- Only creates policies for tables that exist
--
-- Total: ${tables.length} potential tables × 4 policies = ${tables.length * 4} policy updates

`;

tables.forEach(table => {
  sql += `
-- Fix ${table} policies (4 warnings) - only if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '${table}') THEN
    DROP POLICY IF EXISTS "Users can view ${table} in their workspace" ON public.${table};
    DROP POLICY IF EXISTS "Users can insert ${table} in their workspace" ON public.${table};
    DROP POLICY IF EXISTS "Users can update ${table} in their workspace" ON public.${table};
    DROP POLICY IF EXISTS "Users can delete ${table} in their workspace" ON public.${table};

    EXECUTE format('
      CREATE POLICY "Users can view ${table} in their workspace"
        ON public.${table} FOR SELECT TO authenticated
        USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = (SELECT auth.uid())) AND deleted_at IS NULL)
    ');

    EXECUTE format('
      CREATE POLICY "Users can insert ${table} in their workspace"
        ON public.${table} FOR INSERT TO authenticated
        WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = (SELECT auth.uid())))
    ');

    EXECUTE format('
      CREATE POLICY "Users can update ${table} in their workspace"
        ON public.${table} FOR UPDATE TO authenticated
        USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = (SELECT auth.uid())) AND deleted_at IS NULL)
        WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = (SELECT auth.uid())))
    ');

    EXECUTE format('
      CREATE POLICY "Users can delete ${table} in their workspace"
        ON public.${table} FOR DELETE TO authenticated
        USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = (SELECT auth.uid())))
    ');
  END IF;
END $$;
`;
});

sql += `
-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- This migration safely handles non-existent tables
-- Only updates policies for tables that actually exist
-- 
-- Expected: All remaining auth.uid() warnings resolved
-- Remaining: Multiple permissive policies (~49 - intentional RBAC design)
`;

const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '112_fix_all_remaining_auth_warnings.sql');
fs.writeFileSync(migrationPath, sql);

console.log(`✅ Migration 112 created (SAFE VERSION): ${migrationPath}`);
console.log(`📊 Tables to check: ${tables.length}`);
console.log(`📊 Max policies: ${tables.length * 4}`);
console.log(`\n✨ This version uses IF EXISTS checks`);
console.log(`   Will only update tables that actually exist`);
console.log(`   Won't fail on missing tables`);
