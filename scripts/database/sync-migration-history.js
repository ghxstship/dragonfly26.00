#!/usr/bin/env node

/**
 * SYNC MIGRATION HISTORY
 * Marks all local migrations as applied in remote database
 * Use this when migrations were applied manually or tables already exist
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');

console.log('🔄 SYNC MIGRATION HISTORY');
console.log('=========================\n');

// Get all local migrations
const localMigrations = fs.readdirSync(MIGRATIONS_DIR)
  .filter(f => f.match(/^[0-9]{3}_/) && f.endsWith('.sql'))
  .sort();

console.log(`📋 Found ${localMigrations.length} local migrations\n`);

// Get current remote status
console.log('📊 Checking remote migration status...\n');

let migrationList;
try {
  migrationList = execSync('npx supabase migration list', {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8'
  });
  
  console.log(migrationList);
  
} catch (error) {
  console.error('Error checking migration status:', error.message);
  process.exit(1);
}

// Parse the migration list to find pending migrations
const lines = migrationList.split('\n');
const pendingMigrations = [];

lines.forEach(line => {
  // Look for lines with empty Remote column
  if (line.includes('|') && !line.includes('Local | Remote')) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 2 && parts[0] && !parts[1]) {
      pendingMigrations.push(parts[0]);
    }
  }
});

console.log(`\n⏳ Pending migrations: ${pendingMigrations.length}\n`);

if (pendingMigrations.length === 0) {
  console.log('✅ All migrations are already applied!\n');
  process.exit(0);
}

console.log('Pending migration numbers:');
pendingMigrations.slice(0, 20).forEach(num => console.log(`  - ${num}`));
if (pendingMigrations.length > 20) {
  console.log(`  ... (${pendingMigrations.length - 20} more)`);
}
console.log('');

// Ask for confirmation
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('⚠️  WARNING: This will mark all pending migrations as "applied"');
console.log('in the remote database WITHOUT actually running them.\n');
console.log('Only use this if:');
console.log('1. The tables/objects already exist in the remote database');
console.log('2. Migrations were applied manually');
console.log('3. You want to sync the migration history\n');

readline.question('Mark all pending migrations as applied? (yes/no): ', (answer) => {
  readline.close();
  
  if (answer.toLowerCase() !== 'yes') {
    console.log('\n❌ Aborted by user');
    process.exit(0);
  }
  
  console.log('\n🔄 Marking migrations as applied...\n');
  
  try {
    // Use migration repair to mark as applied
    const repairCommand = `npx supabase migration repair --status applied ${pendingMigrations.join(' ')}`;
    
    console.log(`Running: ${repairCommand.substring(0, 100)}...\n`);
    
    execSync(repairCommand, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    console.log('\n✅ MIGRATION HISTORY SYNCED!\n');
    
    // Verify final status
    console.log('📊 Final migration status:\n');
    
    execSync('npx supabase migration list', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    console.log('\n🎉 SYNC COMPLETE!\n');
    console.log('All local migrations are now marked as applied in remote database.\n');
    
    console.log('Next steps:');
    console.log('1. Verify: npx supabase db diff (should show no differences)');
    console.log('2. Test: node scripts/check-remote-migrations.js');
    console.log('3. Audit: node scripts/comprehensive-workflow-audit.js\n');
    
  } catch (error) {
    console.error('\n❌ Error syncing migration history:');
    console.error(error.message);
    console.error('\nTry running the repair command manually or in smaller batches.\n');
    process.exit(1);
  }
});
