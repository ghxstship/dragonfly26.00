#!/usr/bin/env node

/**
 * Generate migration 126 to resolve ALL remaining linter issues
 * This handles created_by, updated_by, deleted_by foreign keys and removes newly unused indexes
 */

const fs = require('fs');
const path = require('path');

// Extract column name from foreign key constraint name
function getColumnFromFkeyName(fkeyName) {
  // Pattern: tablename_columnname_fkey or fk_tablename_columnname
  return fkeyName
    .replace(/^fk_/, '')
    .replace(/_fkey$/, '')
    .split('_')
    .slice(-2)
    .join('_');
}

// All unindexed foreign keys from the linter report
const unindexedFKeys = [
  // location_zones
  { table: 'location_zones', column: 'created_by' },
  { table: 'location_zones', column: 'deleted_by' },
  { table: 'location_zones', column: 'updated_by' },
  
  // marketplace tables
  { table: 'marketplace_favorites', column: 'created_by' },
  { table: 'marketplace_favorites', column: 'deleted_by' },
  { table: 'marketplace_favorites', column: 'updated_by' },
  { table: 'marketplace_lists', column: 'deleted_by' },
  { table: 'marketplace_lists', column: 'updated_by' },
  { table: 'marketplace_orders', column: 'deleted_by' },
  { table: 'marketplace_products', column: 'deleted_by' },
  { table: 'marketplace_purchases', column: 'created_by' },
  { table: 'marketplace_purchases', column: 'deleted_by' },
  { table: 'marketplace_purchases', column: 'updated_by' },
  { table: 'marketplace_reviews', column: 'created_by' },
  { table: 'marketplace_reviews', column: 'deleted_by' },
  { table: 'marketplace_reviews', column: 'updated_by' },
  { table: 'marketplace_sales', column: 'created_by' },
  { table: 'marketplace_sales', column: 'deleted_by' },
  { table: 'marketplace_sales', column: 'updated_by' },
  { table: 'marketplace_services', column: 'created_by' },
  { table: 'marketplace_services', column: 'deleted_by' },
  { table: 'marketplace_services', column: 'updated_by' },
  { table: 'marketplace_vendors', column: 'created_by' },
  { table: 'marketplace_vendors', column: 'deleted_by' },
  { table: 'marketplace_vendors', column: 'updated_by' },
  
  // objectives
  { table: 'objectives', column: 'created_by' },
  
  // opportunity tables
  { table: 'opportunity_careers', column: 'created_by' },
  { table: 'opportunity_careers', column: 'posted_by' },
  { table: 'opportunity_careers', column: 'updated_by' },
  { table: 'opportunity_featured', column: 'created_by' },
  { table: 'opportunity_grants', column: 'created_by' },
  { table: 'opportunity_grants', column: 'updated_by' },
  { table: 'opportunity_jobs', column: 'created_by' },
  { table: 'opportunity_jobs', column: 'posted_by' },
  { table: 'opportunity_jobs', column: 'updated_by' },
  { table: 'opportunity_sponsorships', column: 'created_by' },
  { table: 'opportunity_sponsorships', column: 'posted_by' },
  { table: 'opportunity_sponsorships', column: 'updated_by' },
  
  // order_items
  { table: 'order_items', column: 'order_id' },
  { table: 'order_items', column: 'product_id' },
  
  // organization_members
  { table: 'organization_members', column: 'invited_by' },
  
  // payment tables
  { table: 'payment_milestones', column: 'payment_transaction_id' },
  { table: 'payment_schedules', column: 'created_by' },
  { table: 'payment_schedules', column: 'purchase_order_id' },
  
  // payroll
  { table: 'payroll', column: 'processed_by' },
  { table: 'payroll', column: 'production_id' },
  
  // people tables
  { table: 'people_availability', column: 'created_by' },
  { table: 'people_availability', column: 'deleted_by' },
  { table: 'people_availability', column: 'updated_by' },
  { table: 'people_availability', column: 'workspace_id' },
  { table: 'people_certifications', column: 'created_by' },
  { table: 'people_certifications', column: 'deleted_by' },
  { table: 'people_certifications', column: 'updated_by' },
  { table: 'people_certifications', column: 'workspace_id' },
  { table: 'people_departments', column: 'created_by' },
  { table: 'people_departments', column: 'deleted_by' },
  { table: 'people_departments', column: 'updated_by' },
  { table: 'people_departments', column: 'workspace_id' },
  { table: 'people_directory', column: 'created_by' },
  { table: 'people_directory', column: 'deleted_by' },
  { table: 'people_directory', column: 'updated_by' },
  { table: 'people_directory', column: 'workspace_id' },
  { table: 'people_skills', column: 'created_by' },
  { table: 'people_skills', column: 'deleted_by' },
  { table: 'people_skills', column: 'updated_by' },
  { table: 'people_skills', column: 'workspace_id' },
  { table: 'people_teams', column: 'created_by' },
  { table: 'people_teams', column: 'deleted_by' },
  { table: 'people_teams', column: 'updated_by' },
  { table: 'people_teams', column: 'workspace_id' },
];

// Unused indexes that were just created in migration 125
const unusedIndexes = [
  'idx_insight_forecasts_workspace_id',
  'idx_insight_patterns_workspace_id',
  'idx_insight_recommendations_workspace_id',
  'idx_insight_scenarios_workspace_id',
  'idx_insight_segments_workspace_id',
  'idx_insight_summaries_workspace_id',
  'idx_insight_what_if_workspace_id',
  'idx_job_applications_workspace_id',
  'idx_job_candidates_workspace_id',
  'idx_job_interviews_workspace_id',
  'idx_job_offers_workspace_id',
  'idx_job_onboarding_workspace_id',
  'idx_job_postings_workspace_id',
  'idx_job_requisitions_workspace_id',
  'idx_location_amenities_workspace_id',
  'idx_location_bookings_workspace_id',
  'idx_location_capacity_workspace_id',
  'idx_location_equipment_workspace_id',
  'idx_location_floor_plans_workspace_id',
  'idx_location_zones_workspace_id',
  'idx_marketplace_favorites_workspace_id',
  'idx_marketplace_lists_workspace_id',
  'idx_marketplace_purchases_workspace_id',
  'idx_marketplace_reviews_workspace_id',
  'idx_marketplace_sales_workspace_id',
  'idx_marketplace_services_workspace_id',
  'idx_marketplace_vendors_workspace_id',
  'idx_location_utilities_vendor_id',
  'idx_marketplace_orders_production_id',
];

console.log(`\n📊 MIGRATION 126 SUMMARY:`);
console.log(`  Unindexed Foreign Keys: ${unindexedFKeys.length}`);
console.log(`  Unused Indexes to Remove: ${unusedIndexes.length}\n`);

let sql = `-- =====================================================================================
-- Migration: 126_resolve_audit_foreign_keys.sql
-- Description: Add indexes for audit trail foreign keys (created_by, updated_by, deleted_by)
-- and remove workspace_id indexes that are not being used by the query planner
-- =====================================================================================

-- =====================================================================================
-- PART 1: ADD INDEXES FOR AUDIT TRAIL FOREIGN KEYS (${unindexedFKeys.length} indexes)
-- =====================================================================================

`;

// Group by table
const fkeysByTable = {};
unindexedFKeys.forEach(fk => {
  if (!fkeysByTable[fk.table]) {
    fkeysByTable[fk.table] = [];
  }
  fkeysByTable[fk.table].push(fk.column);
});

// Generate CREATE INDEX statements
Object.keys(fkeysByTable).sort().forEach(table => {
  sql += `-- ${table}\n`;
  fkeysByTable[table].forEach(column => {
    const indexName = `idx_${table}_${column}`;
    sql += `CREATE INDEX IF NOT EXISTS ${indexName} ON public.${table}(${column});\n`;
  });
  sql += '\n';
});

sql += `-- =====================================================================================
-- PART 2: REMOVE UNUSED WORKSPACE_ID INDEXES (${unusedIndexes.length} indexes)
-- =====================================================================================
-- These indexes were created in migration 125 but are not being used by the query planner.
-- The query planner prefers other indexes for workspace-based queries.
-- =====================================================================================

`;

unusedIndexes.forEach(indexName => {
  sql += `DROP INDEX IF EXISTS public.${indexName};\n`;
});

// Write migration file
const migrationPath = path.join(__dirname, '../supabase/migrations/126_resolve_audit_foreign_keys.sql');
fs.writeFileSync(migrationPath, sql);

console.log(`✅ Migration generated: ${migrationPath}`);
console.log(`\n📝 STATISTICS:`);
console.log(`  Tables with new indexes: ${Object.keys(fkeysByTable).length}`);
console.log(`  Total CREATE INDEX: ${unindexedFKeys.length}`);
console.log(`  Total DROP INDEX: ${unusedIndexes.length}`);
console.log(`  Total SQL lines: ${sql.split('\n').length}`);
