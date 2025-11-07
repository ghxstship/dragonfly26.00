#!/usr/bin/env node

/**
 * Apply Migration to Supabase
 * Purpose: Directly apply migration 110 to Supabase database (Fix ALL 422 RLS warnings)
 * Date: 2025-10-21
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(text) {
  log('\n' + '='.repeat(80), 'cyan');
  log(text, 'bold');
  log('='.repeat(80), 'cyan');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  log('❌ Error: Supabase credentials not found', 'red');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSqlFile() {
  header('Applying Migration to Supabase');
  
  const migrationPath = path.join(__dirname, '../supabase/migrations/110_fix_all_422_rls_warnings.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  
  log('📄 Migration file loaded', 'blue');
  log(`   Size: ${(migrationSql.length / 1024).toFixed(2)} KB`, 'blue');
  
  // Split into individual statements
  const statements = migrationSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  log(`\n📊 Found ${statements.length} SQL statements`, 'cyan');
  log('⚠️  Note: Executing via REST API (some statements may need manual execution)', 'yellow');
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    
    // Skip comments and empty statements
    if (statement.trim().startsWith('--') || statement.trim().length < 5) {
      continue;
    }
    
    try {
      // Use rpc to execute SQL
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        errorCount++;
        errors.push({ statement: statement.substring(0, 100), error: error.message });
        log(`   ❌ Statement ${i + 1}: ${error.message}`, 'red');
      } else {
        successCount++;
        if (i % 10 === 0) {
          log(`   ✅ Progress: ${i + 1}/${statements.length}`, 'green');
        }
      }
    } catch (err) {
      errorCount++;
      errors.push({ statement: statement.substring(0, 100), error: err.message });
    }
  }
  
  log(`\n📊 Execution Summary:`, 'cyan');
  log(`   Total Statements: ${statements.length}`, 'blue');
  log(`   Successful: ${successCount}`, 'green');
  log(`   Errors: ${errorCount}`, errorCount > 0 ? 'red' : 'green');
  
  if (errors.length > 0) {
    log(`\n⚠️  Errors encountered (may require manual execution):`, 'yellow');
    errors.slice(0, 5).forEach((err, i) => {
      log(`   ${i + 1}. ${err.error}`, 'yellow');
    });
    
    if (errors.length > 5) {
      log(`   ... and ${errors.length - 5} more errors`, 'yellow');
    }
  }
  
  return { successCount, errorCount, errors };
}

async function main() {
  log('\n🚀 Supabase Migration Application', 'bold');
  log('Migration: 107_fix_final_rls_warnings.sql\n', 'cyan');
  
  try {
    const result = await executeSqlFile();
    
    if (result.errorCount > 0) {
      log('\n⚠️  Migration completed with errors', 'yellow');
      log('   Please apply migration manually via Supabase Dashboard', 'yellow');
      log('   Dashboard URL: https://app.supabase.com', 'blue');
      process.exit(1);
    } else {
      log('\n✅ Migration applied successfully!', 'green');
      process.exit(0);
    }
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
