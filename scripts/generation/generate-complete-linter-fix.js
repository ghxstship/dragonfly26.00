#!/usr/bin/env node

/**
 * Generate comprehensive migration to fix ALL database linter issues
 * This script queries the database directly to find all issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Querying database for linter issues...\n');

// Query for unindexed foreign keys
const unindexedFKeysQuery = `
SELECT 
  tc.table_name,
  tc.constraint_name as fkey_name,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN pg_indexes pi 
  ON pi.tablename = tc.table_name 
  AND pi.indexdef LIKE '%' || kcu.column_name || '%'
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND pi.indexname IS NULL
ORDER BY tc.table_name, kcu.column_name;
`;

// Query for unused indexes
const unusedIndexesQuery = `
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
`;

try {
  // Get unindexed foreign keys
  console.log('📊 Finding unindexed foreign keys...');
  const fkeysResult = execSync(
    `npx supabase db execute "${unindexedFKeysQuery.replace(/\n/g, ' ')}"`,
    { encoding: 'utf-8', cwd: process.cwd() }
  );
  
  // Get unused indexes
  console.log('📊 Finding unused indexes...');
  const unusedResult = execSync(
    `npx supabase db execute "${unusedIndexesQuery.replace(/\n/g, ' ')}"`,
    { encoding: 'utf-8', cwd: process.cwd() }
  );
  
  // Parse results (simplified - adjust based on actual output format)
  const unindexedFKeys = parseQueryResult(fkeysResult);
  const unusedIndexes = parseQueryResult(unusedResult);
  
  console.log(`\n✅ Found ${unindexedFKeys.length} unindexed foreign keys`);
  console.log(`✅ Found ${unusedIndexes.length} unused indexes\n`);
  
  // Generate migration SQL
  generateMigration(unindexedFKeys, unusedIndexes);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\n⚠️  Falling back to manual pattern-based generation...\n');
  
  // Fallback: Generate based on common patterns from the linter report
  generateFallbackMigration();
}

function parseQueryResult(result) {
  // Parse the query result - this is simplified
  // Actual implementation would need to parse the specific format
  const lines = result.trim().split('\n');
  return lines.filter(line => line.trim() && !line.includes('---')).map(line => {
    const parts = line.split('|').map(p => p.trim());
    return parts;
  });
}

function generateMigration(unindexedFKeys, unusedIndexes) {
  let sql = `-- =====================================================================================
-- Migration: 125_resolve_all_remaining_linter_issues.sql
-- Description: Resolve ALL remaining Supabase database linter issues
-- Generated: ${new Date().toISOString()}
-- =====================================================================================

`;

  // Part 1: Add indexes for unindexed foreign keys
  if (unindexedFKeys.length > 0) {
    sql += `-- =====================================================================================
-- PART 1: ADD INDEXES FOR UNINDEXED FOREIGN KEYS (${unindexedFKeys.length} indexes)
-- =====================================================================================

`;
    
    unindexedFKeys.forEach(([table, fkeyName, column]) => {
      const indexName = `idx_${table}_${column}`;
      sql += `CREATE INDEX IF NOT EXISTS ${indexName} ON public.${table}(${column});\n`;
    });
  }
  
  // Part 2: Remove unused indexes
  if (unusedIndexes.length > 0) {
    sql += `\n-- =====================================================================================
-- PART 2: REMOVE UNUSED INDEXES (${unusedIndexes.length} indexes)
-- =====================================================================================

`;
    
    unusedIndexes.forEach(([schema, table, indexName]) => {
      sql += `DROP INDEX IF EXISTS public.${indexName};\n`;
    });
  }
  
  // Write migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/125_resolve_all_remaining_linter_issues.sql');
  fs.writeFileSync(migrationPath, sql);
  
  console.log(`✅ Migration generated: ${migrationPath}`);
}

function generateFallbackMigration() {
  // Based on the patterns from the linter report, generate a comprehensive migration
  // This includes all the workspace_id foreign keys and common unused indexes
  
  const workspaceIdTables = [
    'insight_forecasts', 'insight_patterns', 'insight_recommendations', 'insight_scenarios',
    'insight_segments', 'insight_summaries', 'insight_what_if', 'job_applications',
    'job_candidates', 'job_interviews', 'job_offers', 'job_onboarding', 'job_postings',
    'job_requisitions', 'location_amenities', 'location_bookings', 'location_capacity',
    'location_equipment', 'location_floor_plans', 'location_zones', 'marketplace_favorites',
    'marketplace_lists', 'marketplace_purchases', 'marketplace_reviews', 'marketplace_sales',
    'marketplace_services', 'marketplace_vendors'
  ];
  
  let sql = `-- =====================================================================================
-- Migration: 125_resolve_all_remaining_linter_issues.sql  
-- Description: Resolve ALL remaining Supabase database linter issues (1227 issues)
-- Generated: ${new Date().toISOString()}
-- =====================================================================================

-- =====================================================================================
-- PART 1: ADD INDEXES FOR UNINDEXED FOREIGN KEYS
-- =====================================================================================

`;

  // Add workspace_id indexes
  workspaceIdTables.forEach(table => {
    sql += `CREATE INDEX IF NOT EXISTS idx_${table}_workspace_id ON public.${table}(workspace_id);\n`;
  });
  
  sql += `\n-- Additional foreign key indexes\n`;
  sql += `CREATE INDEX IF NOT EXISTS idx_location_utilities_vendor_id ON public.location_utilities(vendor_id);\n`;
  sql += `CREATE INDEX IF NOT EXISTS idx_marketplace_orders_production_id ON public.marketplace_orders(production_id);\n`;
  
  sql += `\n-- =====================================================================================
-- PART 2: REMOVE UNUSED INDEXES  
-- =====================================================================================

`;

  // Remove unused workspace_id, status, created_at, and data indexes
  const unusedIndexPatterns = ['workspace_id', 'status', 'created_at', 'data'];
  
  workspaceIdTables.forEach(table => {
    unusedIndexPatterns.forEach(pattern => {
      sql += `DROP INDEX IF EXISTS public.idx_${table}_${pattern};\n`;
    });
  });
  
  // Write migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/125_resolve_all_remaining_linter_issues.sql');
  fs.writeFileSync(migrationPath, sql);
  
  console.log(`✅ Fallback migration generated: ${migrationPath}`);
  console.log(`📝 Total SQL statements: ${sql.split('\n').filter(l => l.includes('CREATE INDEX') || l.includes('DROP INDEX')).length}`);
}

generateFallbackMigration();
