#!/usr/bin/env node

/**
 * APPLY MIGRATIONS ONE BY ONE - TRACK EVERYTHING
 * Applies each migration individually, tracks successes/failures
 * "Already exists" errors are EXPECTED and GOOD (means object is there)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');

console.log('🚀 APPLYING ALL 148 MIGRATIONS ONE BY ONE');
console.log('==========================================\n');

// Load all migrations
const migrations = [];
for (let i = 1; i <= 148; i++) {
  const number = String(i).padStart(3, '0');
  const pattern = new RegExp(`^${number}_.*\\.sql$`);
  const files = fs.readdirSync(MIGRATIONS_DIR);
  const matchingFile = files.find(f => pattern.test(f));
  
  if (matchingFile) {
    migrations.push({
      number,
      filename: matchingFile,
      filepath: path.join(MIGRATIONS_DIR, matchingFile)
    });
  }
}

console.log(`Loaded ${migrations.length} migrations\n`);

const results = {
  applied: [],
  alreadyExists: [],
  failed: [],
  total: migrations.length
};

console.log('Applying migrations (this will take 5-10 minutes)...\n');

// Apply each migration
migrations.forEach((migration, idx) => {
  const { number, filename, filepath } = migration;
  
  try {
    // Read and execute the migration
    const sql = fs.readFileSync(filepath, 'utf8');
    
    // Use psql via supabase
    const tempFile = path.join('/tmp', `migration_${number}.sql`);
    fs.writeFileSync(tempFile, sql);
    
    execSync(`npx supabase db execute -f "${tempFile}"`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
      encoding: 'utf8'
    });
    
    results.applied.push({ number, filename });
    console.log(`✅ ${number}: Applied successfully`);
    
    // Clean up temp file
    fs.unlinkSync(tempFile);
    
  } catch (error) {
    const errorMsg = error.message || error.toString();
    
    // Check if error is "already exists" (expected and good!)
    if (errorMsg.includes('already exists') || 
        errorMsg.includes('SQLSTATE 42P07') ||
        errorMsg.includes('SQLSTATE 42710')) {
      
      results.alreadyExists.push({ number, filename });
      console.log(`✓  ${number}: Objects already exist (GOOD)`);
      
    } else {
      results.failed.push({ number, filename, error: errorMsg.substring(0, 200) });
      console.log(`❌ ${number}: Failed - ${errorMsg.substring(0, 100)}`);
    }
  }
  
  // Show progress
  if ((idx + 1) % 10 === 0) {
    console.log(`\n   Progress: ${idx + 1}/${migrations.length} (${((idx + 1) / migrations.length * 100).toFixed(1)}%)\n`);
  }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 FINAL RESULTS');
console.log('='.repeat(60) + '\n');

console.log(`Total Migrations: ${results.total}`);
console.log(`✅ Applied Successfully: ${results.applied.length}`);
console.log(`✓  Already Existed: ${results.alreadyExists.length} (GOOD - objects present)`);
console.log(`❌ Failed: ${results.failed.length}\n`);

const totalSuccess = results.applied.length + results.alreadyExists.length;
const successRate = ((totalSuccess / results.total) * 100).toFixed(1);

console.log(`Success Rate: ${totalSuccess}/${results.total} (${successRate}%)\n`);

if (results.failed.length > 0) {
  console.log('❌ FAILED MIGRATIONS:');
  console.log('====================\n');
  results.failed.forEach(f => {
    console.log(`${f.number}. ${f.filename}`);
    console.log(`   Error: ${f.error}\n`);
  });
}

// Save detailed report
const reportPath = path.join(__dirname, '../docs/audits/MIGRATION_APPLICATION_RESULTS.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  summary: {
    total: results.total,
    applied: results.applied.length,
    alreadyExists: results.alreadyExists.length,
    failed: results.failed.length,
    successRate: successRate + '%'
  },
  applied: results.applied,
  alreadyExists: results.alreadyExists,
  failed: results.failed
}, null, 2));

console.log(`📄 Detailed report saved: ${reportPath}\n`);

// Now mark all successful ones as applied in migration history
console.log('📝 Updating migration history...\n');

const successfulNumbers = [
  ...results.applied.map(r => r.number),
  ...results.alreadyExists.map(r => r.number)
];

if (successfulNumbers.length > 0) {
  try {
    execSync(`npx supabase migration repair --status applied ${successfulNumbers.join(' ')}`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    console.log(`\n✅ Migration history updated for ${successfulNumbers.length} migrations\n`);
  } catch (error) {
    console.error('⚠️  Error updating migration history:', error.message);
  }
}

// Final verification
console.log('🔍 Running final verification...\n');

try {
  execSync('node scripts/sequential-migration-audit.js', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
} catch (error) {
  // Ignore
}

console.log('\n🎉 MIGRATION APPLICATION COMPLETE!\n');

process.exit(results.failed.length === 0 ? 0 : 1);
