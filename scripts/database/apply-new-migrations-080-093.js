#!/usr/bin/env node

/**
 * Apply new migrations 080-093 to remote database
 */

const fs = require('fs');
const path = require('path');

const connectionString = "postgresql://postgres.nhceygmzwmhuyqsjxquk:CelebritySummit20$1@aws-1-us-east-1.pooler.supabase.com:5432/postgres";

// New migrations to apply (excluding empty 080)
const newMigrations = [
  '081_cleanup_unused_indexes',
  '083_rls_performance_optimization',
  '084_rls_performance_optimization_part2',
  '085_rls_optimization_remaining_policies',
  '087_rls_optimization_final_cleanup',
  '089_add_drop_if_exists_to_late_migrations',
  '090_fix_rls_linter_warnings_complete',
  '091_fix_all_function_errors',
  '092_fix_remaining_function_errors',
  '093_fix_security_warnings_complete',
];

async function applyNewMigrations() {
  const pg = require('pg');
  const { Client } = pg;
  const client = new Client({ connectionString });

  try {
    console.log('=== APPLYING NEW MIGRATIONS (080-093) ===\n');
    console.log(`Processing ${newMigrations.length} migrations...\n`);
    
    await client.connect();
    console.log('✅ Connected to database\n');

    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    for (let i = 0; i < newMigrations.length; i++) {
      const migration = newMigrations[i];
      const migrationPath = path.join(__dirname, '../supabase/migrations', `${migration}.sql`);
      
      console.log(`[${i + 1}/${newMigrations.length}] ${migration}`);

      // Check if file exists
      if (!fs.existsSync(migrationPath)) {
        console.log('   ⚠️  File not found, skipping\n');
        skipCount++;
        continue;
      }

      // Check if file is empty
      const stats = fs.statSync(migrationPath);
      if (stats.size === 0) {
        console.log('   ⚠️  File is empty, skipping\n');
        skipCount++;
        continue;
      }

      try {
        // Read migration SQL
        const sql = fs.readFileSync(migrationPath, 'utf8');
        
        // Apply migration
        await client.query(sql);
        console.log('   ✅ Migration applied');

        // Record in migration history
        await client.query(
          `INSERT INTO supabase_migrations.schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING`,
          [migration]
        );
        console.log('   📝 Recorded in migration history');
        
        // Copy to applied directory
        const appliedPath = path.join(__dirname, '../supabase/migrations/applied', `${migration}.sql`);
        fs.copyFileSync(migrationPath, appliedPath);
        console.log('   📁 Copied to applied/\n');
        
        successCount++;
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        console.log(`   Details: ${error.detail || 'N/A'}\n`);
        failCount++;
      }
    }

    console.log('=== SUMMARY ===');
    console.log(`✅ Successfully applied: ${successCount}`);
    console.log(`⚠️  Skipped: ${skipCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📊 Total: ${newMigrations.length}\n`);

    if (successCount + skipCount === newMigrations.length) {
      console.log('🎉 All applicable migrations completed!');
    } else {
      console.log(`⚠️  ${failCount} migration(s) failed - review errors above`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyNewMigrations();
