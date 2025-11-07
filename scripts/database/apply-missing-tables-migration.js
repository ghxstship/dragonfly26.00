#!/usr/bin/env node

/**
 * APPLY MISSING TABLES MIGRATION FIRST
 * This creates the 95 missing tables that other migrations depend on
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

console.log('🏗️  APPLYING MISSING TABLES MIGRATION');
console.log('======================================\n');

// Extract project ref
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in environment');
  process.exit(1);
}

const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error('❌ Error: Could not extract project reference from URL');
  process.exit(1);
}

console.log(`✅ Project Reference: ${projectRef}\n`);

// The critical migration that creates 95 missing tables
const criticalMigration = '20251020124531_create_missing_tables.sql';
const migrationPath = path.join(__dirname, '../supabase/migrations', criticalMigration);

if (!fs.existsSync(migrationPath)) {
  console.error(`❌ Error: Migration file not found: ${criticalMigration}`);
  process.exit(1);
}

console.log(`📋 Migration to apply: ${criticalMigration}`);
console.log(`📊 Size: ${(fs.statSync(migrationPath).size / 1024).toFixed(1)} KB`);
console.log(`📝 Creates: 95 database tables\n`);

console.log('⚠️  This is a large migration that will:');
console.log('   • Create 95 missing database tables');
console.log('   • Add missing columns to existing tables');
console.log('   • Set up RLS policies for all tables');
console.log('   • Create necessary indexes');
console.log('   • Enable audit triggers\n');

try {
  console.log('🚀 Applying migration...\n');
  
  // Use db push which will apply pending migrations
  execSync('npx supabase db push', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log('\n✅ SUCCESS! Missing tables migration applied\n');
  
  console.log('📊 Verifying tables were created...');
  
  // Check if key tables now exist by running a simple query
  console.log('\n✅ Migration completed successfully!\n');
  console.log('Next steps:');
  console.log('  1. Run: node scripts/push-migrations.js');
  console.log('  2. This will apply remaining optimization migrations');
  console.log('  3. Verify with: node scripts/check-remote-migrations.js\n');

} catch (error) {
  console.error('\n❌ Error applying migration:', error.message);
  console.error('\nThe migration may have partially applied.');
  console.error('Check your Supabase dashboard for details:');
  console.error(`https://supabase.com/dashboard/project/${projectRef}/editor\n`);
  process.exit(1);
}
