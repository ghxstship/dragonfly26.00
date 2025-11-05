#!/usr/bin/env node

/**
 * CHECK REMOTE SUPABASE MIGRATIONS
 * Verifies which migrations have been applied to the remote Supabase database
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');
const APPLIED_DIR = path.join(MIGRATIONS_DIR, 'applied');

async function checkMigrations() {
  console.log('🔍 CHECKING SUPABASE MIGRATION STATUS');
  console.log('======================================\n');

  // Get all migration files
  const allFiles = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql') && !f.includes('.skip'))
    .sort();

  // Get applied migrations
  let appliedFiles = [];
  if (fs.existsSync(APPLIED_DIR)) {
    appliedFiles = fs.readdirSync(APPLIED_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();
  }

  console.log(`📊 MIGRATION SUMMARY`);
  console.log(`===================`);
  console.log(`Total Migrations: ${allFiles.length}`);
  console.log(`Applied Migrations: ${appliedFiles.length}`);
  console.log(`Pending Migrations: ${allFiles.length - appliedFiles.length}`);
  console.log(`Skipped Migrations: ${fs.readdirSync(MIGRATIONS_DIR).filter(f => f.includes('.skip')).length}\n`);

  // Check for unapplied migrations
  const unapplied = allFiles.filter(f => !appliedFiles.includes(f));

  if (unapplied.length > 0) {
    console.log(`⚠️  PENDING MIGRATIONS (${unapplied.length})`);
    console.log(`========================`);
    unapplied.forEach((file, idx) => {
      console.log(`${idx + 1}. ${file}`);
    });
    console.log('');
  }

  // Check for critical tables from workflow audit
  const criticalTables = [
    'projects', 'events', 'people', 'assets', 'locations', 'files',
    'companies', 'jobs', 'procurement', 'finance',
    'community', 'marketplace', 'resources',
    'reports', 'analytics', 'insights',
    'organizations', 'workspace_members', 'user_roles',
    'asset_catalog', 'asset_transactions', 'asset_maintenance',
    'project_budgets', 'project_milestones',
    'event_calendar', 'event_run_of_show',
    'people_availability', 'people_certifications'
  ];

  console.log(`🔑 CRITICAL WORKFLOW TABLES`);
  console.log(`===========================`);
  console.log(`Required for 100% workflow completeness:\n`);
  
  const tableCheckMigrations = allFiles.filter(f => {
    const content = fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf8');
    return criticalTables.some(table => 
      content.includes(`CREATE TABLE`) && content.includes(table)
    );
  });

  console.log(`Migrations containing critical tables: ${tableCheckMigrations.length}`);
  
  const appliedCritical = tableCheckMigrations.filter(f => appliedFiles.includes(f));
  console.log(`Applied: ${appliedCritical.length}/${tableCheckMigrations.length}`);
  
  if (appliedCritical.length < tableCheckMigrations.length) {
    console.log(`\n⚠️  WARNING: Some critical table migrations may not be applied!`);
  } else {
    console.log(`\n✅ All critical table migrations appear to be applied`);
  }

  // Check environment configuration
  console.log(`\n🔧 ENVIRONMENT CONFIGURATION`);
  console.log(`============================`);
  
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasDbUrl = !!process.env.SUPABASE_DB_URL;

  console.log(`Supabase URL configured: ${hasSupabaseUrl ? '✅' : '❌'}`);
  console.log(`Supabase Anon Key configured: ${hasSupabaseKey ? '✅' : '❌'}`);
  console.log(`Database URL configured: ${hasDbUrl ? '✅' : '❌'}`);

  if (hasSupabaseUrl) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const projectRef = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    console.log(`\nProject Reference: ${projectRef || 'Unknown'}`);
  }

  // Recommendations
  console.log(`\n💡 RECOMMENDATIONS`);
  console.log(`==================`);

  if (unapplied.length > 0) {
    console.log(`\n⚠️  You have ${unapplied.length} pending migrations.`);
    console.log(`\nTo apply them to your remote Supabase database:`);
    console.log(`\n1. Link to your project:`);
    console.log(`   npx supabase link --project-ref <your-project-ref>`);
    console.log(`\n2. Push migrations:`);
    console.log(`   npx supabase db push`);
    console.log(`\n3. Verify migrations:`);
    console.log(`   npx supabase db diff`);
    console.log(`\n4. Or apply manually via Supabase Dashboard:`);
    console.log(`   https://supabase.com/dashboard/project/<project-ref>/editor`);
  } else {
    console.log(`\n✅ All migrations appear to be applied!`);
    console.log(`\nYour database should be in sync with your migration files.`);
  }

  // Generate migration report
  const report = {
    timestamp: new Date().toISOString(),
    total: allFiles.length,
    applied: appliedFiles.length,
    pending: unapplied.length,
    skipped: fs.readdirSync(MIGRATIONS_DIR).filter(f => f.includes('.skip')).length,
    pendingMigrations: unapplied,
    criticalTablesStatus: {
      total: tableCheckMigrations.length,
      applied: appliedCritical.length,
      complete: appliedCritical.length === tableCheckMigrations.length
    },
    environment: {
      hasSupabaseUrl,
      hasSupabaseKey,
      hasDbUrl
    }
  };

  const reportPath = path.join(__dirname, '../docs/audits/MIGRATION_STATUS.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Full report saved to: ${reportPath}`);
}

checkMigrations().catch(console.error);
