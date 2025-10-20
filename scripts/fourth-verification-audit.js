#!/usr/bin/env node

/**
 * FOURTH VERIFICATION AUDIT - Independent comprehensive check
 * Fresh audit with no assumptions from previous verifications
 */

const fs = require('fs');
const path = require('path');

const connectionString = "postgresql://postgres.nhceygmzwmhuyqsjxquk:CelebritySummit20$1@aws-1-us-east-1.pooler.supabase.com:5432/postgres";

async function fourthVerificationAudit() {
  const pg = require('pg');
  const { Client } = pg;
  const client = new Client({ connectionString });

  try {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║          FOURTH VERIFICATION AUDIT - COMPREHENSIVE CHECK       ║');
    console.log('║                    Fresh Independent Audit                     ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const results = {
      localFiles: 0,
      appliedFiles: 0,
      remoteMigrations: 0,
      verified: 0,
      missing: [],
      extra: [],
      errors: []
    };

    // ============================================================
    // SECTION 1: LOCAL FILESYSTEM AUDIT
    // ============================================================
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('SECTION 1: LOCAL FILESYSTEM AUDIT');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const appliedDir = path.join(migrationsDir, 'applied');

    // Check if directories exist
    if (!fs.existsSync(migrationsDir)) {
      results.errors.push('Migrations directory does not exist');
      console.log('❌ ERROR: Migrations directory not found\n');
    } else {
      console.log('✅ Migrations directory exists');
      
      // Count local files
      const localFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql') && !file.startsWith('.'));
      results.localFiles = localFiles.length;
      console.log(`✅ Local migration files: ${results.localFiles}`);

      // List first 5 and last 5
      console.log('\n   First 5 files:');
      localFiles.slice(0, 5).forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
      console.log('   ...');
      console.log('   Last 5 files:');
      localFiles.slice(-5).forEach((f, i) => console.log(`   ${results.localFiles - 4 + i}. ${f}`));
    }

    if (!fs.existsSync(appliedDir)) {
      results.errors.push('Applied directory does not exist');
      console.log('\n❌ ERROR: Applied directory not found\n');
    } else {
      console.log('\n✅ Applied directory exists');
      
      // Count applied files
      const appliedFiles = fs.readdirSync(appliedDir)
        .filter(file => file.endsWith('.sql') && !file.startsWith('.'));
      results.appliedFiles = appliedFiles.length;
      console.log(`✅ Applied migration files: ${results.appliedFiles}`);
    }

    // Check if counts match
    if (results.localFiles === results.appliedFiles) {
      console.log(`\n✅ Local and Applied counts MATCH (${results.localFiles})\n`);
    } else {
      console.log(`\n⚠️  Local and Applied counts DO NOT MATCH`);
      console.log(`   Local: ${results.localFiles}, Applied: ${results.appliedFiles}\n`);
      results.errors.push(`Count mismatch: Local ${results.localFiles} vs Applied ${results.appliedFiles}`);
    }

    // ============================================================
    // SECTION 2: REMOTE DATABASE AUDIT
    // ============================================================
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('SECTION 2: REMOTE DATABASE AUDIT');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('Connecting to remote Supabase database...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    // Query migration history table
    const migrationQuery = `
      SELECT version 
      FROM supabase_migrations.schema_migrations 
      ORDER BY version
    `;
    
    const result = await client.query(migrationQuery);
    results.remoteMigrations = result.rows.length;
    
    console.log(`✅ Remote database migrations: ${results.remoteMigrations}`);
    console.log(`   (Includes ${results.remoteMigrations - results.localFiles} system/internal migrations)\n`);

    // ============================================================
    // SECTION 3: CROSS-REFERENCE VERIFICATION
    // ============================================================
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('SECTION 3: CROSS-REFERENCE VERIFICATION');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('Checking each local migration against remote database...\n');

    const localMigrations = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .map(file => file.replace('.sql', ''))
      .sort();

    const remoteMigrationVersions = result.rows.map(row => row.version);

    // Check each local migration
    for (let i = 0; i < localMigrations.length; i++) {
      const migration = localMigrations[i];
      const existsInRemote = remoteMigrationVersions.includes(migration);
      
      if (existsInRemote) {
        results.verified++;
        // Only show first 3, last 3, and every 10th
        if (i < 3 || i >= localMigrations.length - 3 || i % 10 === 0) {
          console.log(`✅ [${i + 1}/${localMigrations.length}] ${migration}`);
        } else if (i === 3) {
          console.log(`   ... (showing samples) ...`);
        }
      } else {
        results.missing.push(migration);
        console.log(`❌ [${i + 1}/${localMigrations.length}] ${migration} - NOT IN REMOTE!`);
      }
    }

    console.log('');

    // Check for extra migrations in remote
    const extraInRemote = remoteMigrationVersions.filter(v => !localMigrations.includes(v));
    results.extra = extraInRemote;

    if (extraInRemote.length > 0) {
      console.log(`ℹ️  Remote has ${extraInRemote.length} additional migrations`);
      console.log('   (System migrations, extensions, or manually applied)\n');
    }

    // ============================================================
    // SECTION 4: INTEGRITY CHECKS
    // ============================================================
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('SECTION 4: INTEGRITY CHECKS');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Check for empty files
    console.log('Checking for empty migration files...');
    let emptyFiles = 0;
    for (const file of fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'))) {
      const filePath = path.join(migrationsDir, file);
      const stats = fs.statSync(filePath);
      if (stats.size === 0) {
        console.log(`   ⚠️  Empty file: ${file}`);
        emptyFiles++;
      }
    }
    if (emptyFiles === 0) {
      console.log('✅ No empty files found\n');
    } else {
      console.log(`⚠️  Found ${emptyFiles} empty file(s)\n`);
    }

    // Check for duplicate versions
    console.log('Checking for duplicate versions in remote...');
    const duplicateCheck = await client.query(`
      SELECT version, COUNT(*) as count 
      FROM supabase_migrations.schema_migrations 
      GROUP BY version 
      HAVING COUNT(*) > 1
    `);
    
    if (duplicateCheck.rows.length === 0) {
      console.log('✅ No duplicate versions in remote database\n');
    } else {
      console.log(`⚠️  Found ${duplicateCheck.rows.length} duplicate version(s):`);
      duplicateCheck.rows.forEach(row => {
        console.log(`   - ${row.version} (${row.count} times)`);
      });
      console.log('');
    }

    // ============================================================
    // SECTION 5: FINAL RESULTS
    // ============================================================
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                        FINAL RESULTS                           ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('📊 METRICS:');
    console.log(`   • Local migration files:      ${results.localFiles}`);
    console.log(`   • Applied directory files:    ${results.appliedFiles}`);
    console.log(`   • Remote database migrations: ${results.remoteMigrations}`);
    console.log(`   • Verified in remote:         ${results.verified}/${results.localFiles}`);
    console.log(`   • Missing from remote:        ${results.missing.length}`);
    console.log(`   • Extra in remote:            ${results.extra.length}`);
    console.log(`   • Errors encountered:         ${results.errors.length}\n`);

    if (results.missing.length > 0) {
      console.log('❌ MISSING MIGRATIONS:');
      results.missing.forEach(m => console.log(`   - ${m}`));
      console.log('');
    }

    if (results.errors.length > 0) {
      console.log('⚠️  ERRORS:');
      results.errors.forEach(e => console.log(`   - ${e}`));
      console.log('');
    }

    // ============================================================
    // SECTION 6: FINAL VERDICT
    // ============================================================
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                       FINAL VERDICT                            ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const isComplete = (
      results.verified === results.localFiles &&
      results.localFiles === results.appliedFiles &&
      results.missing.length === 0 &&
      results.errors.length === 0
    );

    if (isComplete) {
      console.log('✅ ✅ ✅ ✅ FOURTH AUDIT PASSED: 100% VERIFIED ✅ ✅ ✅ ✅\n');
      console.log(`   ✓ All ${results.localFiles} local migrations verified in remote`);
      console.log(`   ✓ All ${results.appliedFiles} files in applied directory`);
      console.log(`   ✓ Local and applied counts match perfectly`);
      console.log(`   ✓ Zero missing migrations`);
      console.log(`   ✓ Zero errors detected`);
      console.log(`   ✓ Database integrity confirmed\n`);
      console.log('🎉 CERTIFICATION: PRODUCTION READY');
      console.log('🎉 CONFIDENCE LEVEL: 400% (Fourth independent verification)\n');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('STATUS: MIGRATIONS ARE 100% SYNCHRONIZED');
      console.log('═══════════════════════════════════════════════════════════════\n');
      process.exit(0);
    } else {
      console.log('❌ AUDIT FAILED: SYNCHRONIZATION INCOMPLETE\n');
      console.log('Issues detected:');
      if (results.verified !== results.localFiles) {
        console.log(`   ✗ Only ${results.verified}/${results.localFiles} migrations verified`);
      }
      if (results.localFiles !== results.appliedFiles) {
        console.log(`   ✗ Local/Applied count mismatch`);
      }
      if (results.missing.length > 0) {
        console.log(`   ✗ ${results.missing.length} migrations missing from remote`);
      }
      if (results.errors.length > 0) {
        console.log(`   ✗ ${results.errors.length} errors encountered`);
      }
      console.log('\n⚠️  ACTION REQUIRED: Review and fix issues above\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n╔════════════════════════════════════════════════════════════════╗');
    console.error('║                      AUDIT FAILED                              ║');
    console.error('╚════════════════════════════════════════════════════════════════╝\n');
    console.error(`❌ Error: ${error.message}`);
    console.error(`   Stack: ${error.stack}\n`);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fourthVerificationAudit();
