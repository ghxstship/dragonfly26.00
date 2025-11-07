#!/usr/bin/env node

/**
 * PUSH MIGRATIONS TO REMOTE SUPABASE
 * Uses child_process to run npx supabase commands
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

console.log('🚀 PUSHING MIGRATIONS TO REMOTE SUPABASE');
console.log('==========================================\n');

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

// Check if already linked
const configPath = path.join(__dirname, '../supabase/.temp/project-ref');
let needsLink = true;

if (fs.existsSync(configPath)) {
  const existingRef = fs.readFileSync(configPath, 'utf8').trim();
  if (existingRef === projectRef) {
    console.log('✅ Already linked to project\n');
    needsLink = false;
  }
}

try {
  // Link to project if needed
  if (needsLink) {
    console.log('🔗 Linking to Supabase project...');
    execSync(`npx supabase link --project-ref ${projectRef}`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ Successfully linked\n');
  }

  // Show pending migrations
  console.log('📋 Checking pending migrations...');
  execSync('node scripts/check-remote-migrations.js', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('');

  // Push migrations
  console.log('🚀 Pushing migrations to remote database...\n');
  execSync('npx supabase db push', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log('\n✅ SUCCESS! Migrations applied\n');

  // Verify
  console.log('📊 Verifying database state...\n');
  execSync('npx supabase db diff', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log('\n🎉 Your remote database is now at 100%!\n');
  console.log('Next steps:');
  console.log('  1. Run: node scripts/comprehensive-workflow-audit.js');
  console.log('  2. Test your application');
  console.log('  3. Deploy to production\n');

} catch (error) {
  console.error('\n❌ Error applying migrations:', error.message);
  console.error('\nTroubleshooting:');
  console.error('  1. Make sure you are logged in: npx supabase login');
  console.error('  2. Check your database credentials');
  console.error('  3. Try applying migrations manually via Supabase Dashboard');
  process.exit(1);
}
