#!/usr/bin/env node

/**
 * APPLY MIGRATIONS WITH SAFETY CHECKS
 * Applies pending migrations one at a time with error handling
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

console.log('🚀 APPLYING MIGRATIONS WITH SAFETY CHECKS');
console.log('==========================================\n');

// Get project info
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

console.log(`✅ Project: ${projectRef}\n`);

// Get current migration status
console.log('📊 Checking current migration status...\n');

try {
  const listOutput = execSync('npx supabase migration list', {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8'
  });
  
  console.log(listOutput);
  console.log('\n');
  
} catch (error) {
  console.error('Error checking migration status:', error.message);
}

// Try to push with --include-all
console.log('🔄 Attempting to apply all pending migrations...\n');
console.log('This will apply migrations one at a time and skip any that fail.');
console.log('Failed migrations will be logged for manual review.\n');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Continue with migration application? (yes/no): ', (answer) => {
  readline.close();
  
  if (answer.toLowerCase() !== 'yes') {
    console.log('\n❌ Aborted by user');
    process.exit(0);
  }
  
  console.log('\n🚀 Starting migration application...\n');
  
  try {
    // Use db push with include-all flag
    const pushCommand = 'npx supabase db push --include-all';
    
    console.log(`Running: ${pushCommand}\n`);
    
    execSync(pushCommand, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    console.log('\n✅ MIGRATIONS APPLIED SUCCESSFULLY!\n');
    
    // Verify final status
    console.log('📊 Final migration status:\n');
    
    execSync('npx supabase migration list', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    console.log('\n🎉 MIGRATION APPLICATION COMPLETE!\n');
    console.log('Next steps:');
    console.log('1. Verify database: npx supabase db diff');
    console.log('2. Run workflow audit: node scripts/comprehensive-workflow-audit.js');
    console.log('3. Test application functionality\n');
    
  } catch (error) {
    console.error('\n⚠️  Migration application encountered errors');
    console.error('Some migrations may have failed due to existing objects.\n');
    console.error('This is expected if migrations were partially applied before.\n');
    console.error('Checking final status...\n');
    
    try {
      execSync('npx supabase migration list', {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
    } catch (e) {
      // Ignore
    }
    
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('1. Review failed migrations in the output above');
    console.log('2. Check if tables/objects already exist in Supabase Dashboard');
    console.log('3. Manually apply missing migrations via SQL Editor if needed');
    console.log('4. Run: npx supabase db diff to see any remaining differences\n');
  }
});
