#!/usr/bin/env node

/**
 * Verify which tables from the linter report exist in the database
 */

const { execSync } = require('child_process');

// Tables mentioned in the linter report
const linterTables = [
  'hiring_application_responses',
  'hiring_applications',
  'hospitality_reservations',
  'incidents',
  'insight_alerts',
  'insight_anomalies',
  'insight_correlations',
  'insight_forecasts',
  'insight_patterns',
  'insight_recommendations',
  'insight_scenarios',
  'insight_segments',
  'insight_summaries',
  'insight_what_if',
  'inventory_alerts',
  'inventory_counts',
  'inventory_folders',
  'inventory_items',
  'invitations',
  'invoice_line_items',
  'invoices',
  'job_applications',
  'job_candidates',
  'location_floor_plans',
  'location_zones',
  'marketplace_favorites',
  'marketplace_lists',
  'marketplace_orders',
  'marketplace_products',
  'marketplace_purchases',
  'marketplace_reviews',
  'marketplace_sales',
  'marketplace_services',
  'marketplace_vendors',
  'people_availability',
  'people_certifications',
  'people_departments',
  'people_directory',
  'people_skills',
  'people_teams',
  'scopes_of_work',
  'project_budgets'
];

console.log('Checking which tables exist in the database...\n');

try {
  // Get list of all tables
  const result = execSync(
    `npx supabase db dump --schema public --data-only=false | grep "CREATE TABLE" | sed 's/.*"public"."\\([^"]*\\)".*/\\1/'`,
    { encoding: 'utf-8', cwd: process.cwd() }
  );
  
  const existingTables = result.trim().split('\n').map(t => t.trim());
  
  const existing = [];
  const missing = [];
  
  linterTables.forEach(table => {
    if (existingTables.includes(table)) {
      existing.push(table);
    } else {
      missing.push(table);
    }
  });
  
  console.log(`✅ EXISTING TABLES (${existing.length}):`);
  existing.forEach(t => console.log(`  - ${t}`));
  
  console.log(`\n❌ MISSING TABLES (${missing.length}):`);
  missing.forEach(t => console.log(`  - ${t}`));
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`  Total in linter report: ${linterTables.length}`);
  console.log(`  Existing: ${existing.length}`);
  console.log(`  Missing: ${missing.length}`);
  console.log(`  Coverage: ${Math.round((existing.length / linterTables.length) * 100)}%`);
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
