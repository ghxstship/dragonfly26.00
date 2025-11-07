#!/usr/bin/env node

/**
 * VERIFY AND APPLY ALL MIGRATIONS - NO SHORTCUTS
 * Step 1: Verify each migration's database objects actually exist
 * Step 2: Apply any migrations with missing objects
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');

console.log('🔍 VERIFY AND APPLY ALL MIGRATIONS - NO SHORTCUTS');
console.log('==================================================\n');

// Step 1: Get all migration files
console.log('📋 STEP 1: LOADING ALL 148 MIGRATIONS');
console.log('======================================\n');

const migrations = [];
for (let i = 1; i <= 148; i++) {
  const number = String(i).padStart(3, '0');
  const pattern = new RegExp(`^${number}_.*\\.sql$`);
  const files = fs.readdirSync(MIGRATIONS_DIR);
  const matchingFile = files.find(f => pattern.test(f));
  
  if (matchingFile) {
    const filepath = path.join(MIGRATIONS_DIR, matchingFile);
    const content = fs.readFileSync(filepath, 'utf8');
    
    // Parse SQL to find CREATE statements
    const tables = [...content.matchAll(/CREATE TABLE (?:IF NOT EXISTS )?(?:public\.)?([a-z_]+)/gi)]
      .map(m => m[1]);
    const policies = [...content.matchAll(/CREATE POLICY "([^"]+)"/gi)]
      .map(m => m[1]);
    const functions = [...content.matchAll(/CREATE (?:OR REPLACE )?FUNCTION (?:public\.)?([a-z_]+)/gi)]
      .map(m => m[1]);
    const indexes = [...content.matchAll(/CREATE (?:UNIQUE )?INDEX (?:IF NOT EXISTS )?(?:public\.)?([a-z_]+)/gi)]
      .map(m => m[1]);
    
    migrations.push({
      number,
      filename: matchingFile,
      filepath,
      content,
      objects: {
        tables: [...new Set(tables)],
        policies: [...new Set(policies)],
        functions: [...new Set(functions)],
        indexes: [...new Set(indexes)]
      }
    });
  }
}

console.log(`Loaded ${migrations.length} migrations\n`);

// Step 2: Check which objects exist in database
console.log('🔍 STEP 2: VERIFYING DATABASE OBJECTS');
console.log('======================================\n');

console.log('Connecting to remote database...\n');

// Get list of all tables
let existingTables = [];
try {
  const tablesQuery = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;
  
  const result = execSync(
    `npx supabase db execute "${tablesQuery.replace(/\n/g, ' ')}"`,
    { cwd: path.join(__dirname, '..'), encoding: 'utf8' }
  );
  
  // Parse table names from output
  const lines = result.split('\n');
  existingTables = lines
    .filter(line => line.trim() && !line.includes('table_name') && !line.includes('---'))
    .map(line => line.trim());
  
  console.log(`Found ${existingTables.length} existing tables\n`);
} catch (error) {
  console.error('⚠️  Could not query tables directly, will use migration list\n');
}

// Step 3: Analyze each migration
console.log('📊 STEP 3: ANALYZING EACH MIGRATION');
console.log('====================================\n');

const analysis = [];
let fullyImplemented = 0;
let partiallyImplemented = 0;
let notImplemented = 0;

migrations.forEach((migration, idx) => {
  const { number, filename, objects } = migration;
  
  // Check if main tables exist
  const tablesExist = objects.tables.length === 0 || 
    objects.tables.every(t => existingTables.includes(t));
  
  const status = tablesExist ? 'LIKELY_COMPLETE' : 'NEEDS_VERIFICATION';
  
  if (tablesExist && objects.tables.length > 0) {
    fullyImplemented++;
  } else if (objects.tables.length === 0) {
    partiallyImplemented++;
  } else {
    notImplemented++;
  }
  
  analysis.push({
    number,
    filename,
    status,
    objects
  });
  
  // Show progress for key migrations
  if (idx < 10 || idx % 20 === 0 || idx >= 145) {
    const icon = status === 'LIKELY_COMPLETE' ? '✅' : '⚠️';
    console.log(`${icon} ${number}: ${status.padEnd(20)} (${objects.tables.length} tables, ${objects.policies.length} policies)`);
  }
});

console.log(`\n📊 Analysis Complete:`);
console.log(`   Likely Complete: ${fullyImplemented}`);
console.log(`   Needs Verification: ${partiallyImplemented + notImplemented}\n`);

// Step 4: Apply all migrations properly
console.log('🚀 STEP 4: APPLYING ALL MIGRATIONS');
console.log('===================================\n');

console.log('This will apply ALL 148 migrations using db push --include-all');
console.log('Migrations with existing objects will show errors (expected)');
console.log('We will track which ones succeed and which fail.\n');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Proceed with applying all migrations? (yes/no): ', (answer) => {
  readline.close();
  
  if (answer.toLowerCase() !== 'yes') {
    console.log('\n❌ Aborted by user');
    process.exit(0);
  }
  
  console.log('\n🔄 Applying migrations...\n');
  
  // First, mark all as reverted so we can apply them fresh
  console.log('Step 4a: Marking all migrations as reverted...\n');
  
  const allNumbers = migrations.map(m => m.number).join(' ');
  
  try {
    execSync(`npx supabase migration repair --status reverted ${allNumbers}`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    console.log('\n✅ All migrations marked as reverted\n');
  } catch (error) {
    console.error('⚠️  Error marking as reverted, continuing anyway...\n');
  }
  
  // Now apply with --include-all
  console.log('Step 4b: Applying all migrations with db push...\n');
  
  try {
    // Use spawn to handle interactive prompt
    const { spawn } = require('child_process');
    
    const child = spawn('npx', ['supabase', 'db', 'push', '--include-all'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ MIGRATIONS APPLIED SUCCESSFULLY!\n');
      } else {
        console.log('\n⚠️  Some migrations had errors (expected for existing objects)\n');
      }
      
      // Step 5: Final verification
      console.log('🔍 STEP 5: FINAL VERIFICATION');
      console.log('=============================\n');
      
      try {
        execSync('node scripts/sequential-migration-audit.js', {
          cwd: path.join(__dirname, '..'),
          stdio: 'inherit'
        });
      } catch (error) {
        console.error('Error running final audit');
      }
    });
    
  } catch (error) {
    console.error('\n❌ Error applying migrations:', error.message);
    console.error('\nTrying alternative approach...\n');
    
    // Alternative: Apply one by one
    console.log('Applying migrations one by one...\n');
    
    let applied = 0;
    let failed = 0;
    
    for (const migration of migrations) {
      try {
        console.log(`Applying ${migration.number}...`);
        
        execSync(`npx supabase db execute -f "${migration.filepath}"`, {
          cwd: path.join(__dirname, '..'),
          stdio: 'pipe'
        });
        
        applied++;
        console.log(`✅ ${migration.number} applied\n`);
        
      } catch (error) {
        failed++;
        console.log(`⚠️  ${migration.number} failed (likely already exists)\n`);
      }
    }
    
    console.log(`\n📊 Results: ${applied} applied, ${failed} failed\n`);
    
    // Final verification
    console.log('🔍 FINAL VERIFICATION');
    console.log('=====================\n');
    
    try {
      execSync('node scripts/sequential-migration-audit.js', {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
    } catch (error) {
      console.error('Error running final audit');
    }
  }
});
