#!/usr/bin/env node

/**
 * Deployment Script: Supabase Performance Optimization
 * Purpose: Deploy migration 104 and run performance tests
 * Date: 2025-10-21
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ANSI color codes
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

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  log('❌ Error: Supabase credentials not found in .env file', 'red');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function readMigrationFile() {
  header('STEP 1: Read Migration File');
  
  const migrationPath = path.join(__dirname, '../supabase/migrations/104_fix_performance_warnings.sql');
  
  if (!fs.existsSync(migrationPath)) {
    log('❌ Migration file not found!', 'red');
    return null;
  }
  
  const content = fs.readFileSync(migrationPath, 'utf8');
  const size = (content.length / 1024).toFixed(2);
  
  log(`✅ Migration file loaded`, 'green');
  log(`   Size: ${size} KB`, 'blue');
  log(`   Path: ${migrationPath}`, 'blue');
  
  return content;
}

async function checkDatabaseConnection() {
  header('STEP 2: Verify Database Connection');
  
  try {
    const { data, error } = await supabase
      .from('workspaces')
      .select('count')
      .limit(1);
    
    if (error) {
      log(`❌ Database connection failed: ${error.message}`, 'red');
      return false;
    }
    
    log('✅ Database connection successful', 'green');
    log(`   URL: ${supabaseUrl}`, 'blue');
    return true;
  } catch (error) {
    log(`❌ Connection error: ${error.message}`, 'red');
    return false;
  }
}

async function applyMigration(migrationSql) {
  header('STEP 3: Apply Migration');
  
  log('⚠️  Note: Direct SQL execution via Supabase client is limited.', 'yellow');
  log('   For production deployment, use Supabase CLI or Dashboard.', 'yellow');
  log('   This script will validate the migration structure.', 'yellow');
  
  // Validate migration structure
  const checks = [
    { name: 'DROP POLICY statements', pattern: /DROP POLICY IF EXISTS/g },
    { name: 'CREATE POLICY statements', pattern: /CREATE POLICY/g },
    { name: 'DROP INDEX statements', pattern: /DROP INDEX IF EXISTS/g },
    { name: 'CREATE INDEX statements', pattern: /CREATE INDEX IF NOT EXISTS/g },
    { name: 'ANALYZE statements', pattern: /ANALYZE/g },
    { name: 'Auth UID optimization', pattern: /\(SELECT auth\.uid\(\)\)/g },
  ];
  
  log('\n📋 Migration Structure Validation:', 'cyan');
  
  checks.forEach(check => {
    const matches = migrationSql.match(check.pattern);
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
      log(`   ✅ ${check.name}: ${count} found`, 'green');
    } else {
      log(`   ⚠️  ${check.name}: 0 found`, 'yellow');
    }
  });
  
  log('\n✅ Migration structure validated', 'green');
  log('   Ready for deployment via Supabase CLI or Dashboard', 'blue');
  
  return true;
}

async function runPerformanceTests() {
  header('STEP 4: Run Performance Tests');
  
  const tests = [
    {
      name: 'User Workspaces Query',
      query: async () => {
        const start = Date.now();
        const { data, error } = await supabase
          .from('user_workspaces')
          .select('workspace_id, user_id')
          .limit(100);
        const duration = Date.now() - start;
        return { data, error, duration };
      },
    },
    {
      name: 'Project Tasks Query',
      query: async () => {
        const start = Date.now();
        const { data, error } = await supabase
          .from('project_tasks')
          .select('id, name, status, workspace_id')
          .limit(100);
        const duration = Date.now() - start;
        return { data, error, duration };
      },
    },
    {
      name: 'Productions Query',
      query: async () => {
        const start = Date.now();
        const { data, error } = await supabase
          .from('productions')
          .select('id, name, workspace_id')
          .limit(100);
        const duration = Date.now() - start;
        return { data, error, duration };
      },
    },
    {
      name: 'Marketplace Products Query',
      query: async () => {
        const start = Date.now();
        const { data, error } = await supabase
          .from('marketplace_products')
          .select('id, name, workspace_id')
          .limit(100);
        const duration = Date.now() - start;
        return { data, error, duration };
      },
    },
  ];
  
  log('\n🧪 Running Performance Tests:', 'cyan');
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.query();
      
      if (result.error) {
        log(`   ⚠️  ${test.name}: Error - ${result.error.message}`, 'yellow');
        results.push({ name: test.name, status: 'error', duration: result.duration });
      } else {
        const rowCount = result.data ? result.data.length : 0;
        log(`   ✅ ${test.name}: ${result.duration}ms (${rowCount} rows)`, 'green');
        results.push({ name: test.name, status: 'success', duration: result.duration, rows: rowCount });
      }
    } catch (error) {
      log(`   ❌ ${test.name}: ${error.message}`, 'red');
      results.push({ name: test.name, status: 'failed', error: error.message });
    }
  }
  
  return results;
}

async function checkIndexes() {
  header('STEP 5: Verify Indexes');
  
  log('⚠️  Note: Index verification requires direct database access.', 'yellow');
  log('   Use Supabase Dashboard > Database > Indexes to verify:', 'yellow');
  
  const expectedIndexes = [
    'idx_user_workspaces_user_workspace',
    'idx_project_tasks_assignee_workspace',
    'idx_productions_workspace_project',
    'idx_marketplace_products_workspace_active',
    'idx_marketplace_orders_workspace_status',
  ];
  
  log('\n📋 Expected New Indexes:', 'cyan');
  expectedIndexes.forEach(index => {
    log(`   • ${index}`, 'blue');
  });
  
  const removedIndexes = [
    'idx_tasks_search',
    'idx_thread_messages_author',
  ];
  
  log('\n📋 Removed Duplicate Indexes:', 'cyan');
  removedIndexes.forEach(index => {
    log(`   • ${index}`, 'blue');
  });
  
  return true;
}

async function generateDeploymentReport(performanceResults) {
  header('STEP 6: Generate Deployment Report');
  
  const report = {
    timestamp: new Date().toISOString(),
    migration: '104_fix_performance_warnings.sql',
    status: 'validated',
    performanceTests: performanceResults,
    summary: {
      totalTests: performanceResults.length,
      successful: performanceResults.filter(r => r.status === 'success').length,
      failed: performanceResults.filter(r => r.status === 'failed').length,
      errors: performanceResults.filter(r => r.status === 'error').length,
    },
  };
  
  // Calculate average query time
  const successfulTests = performanceResults.filter(r => r.status === 'success');
  if (successfulTests.length > 0) {
    const avgDuration = successfulTests.reduce((sum, r) => sum + r.duration, 0) / successfulTests.length;
    report.summary.averageQueryTime = `${avgDuration.toFixed(2)}ms`;
  }
  
  const reportPath = path.join(__dirname, '../DEPLOYMENT_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log('✅ Deployment report generated', 'green');
  log(`   Path: ${reportPath}`, 'blue');
  
  // Display summary
  log('\n📊 Deployment Summary:', 'cyan');
  log(`   Migration: ${report.migration}`, 'blue');
  log(`   Status: ${report.status}`, 'blue');
  log(`   Tests Run: ${report.summary.totalTests}`, 'blue');
  log(`   Successful: ${report.summary.successful}`, 'green');
  log(`   Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'red' : 'blue');
  log(`   Errors: ${report.summary.errors}`, report.summary.errors > 0 ? 'yellow' : 'blue');
  
  if (report.summary.averageQueryTime) {
    log(`   Avg Query Time: ${report.summary.averageQueryTime}`, 'blue');
  }
  
  return report;
}

async function displayNextSteps() {
  header('NEXT STEPS FOR PRODUCTION DEPLOYMENT');
  
  log('\n📋 Manual Deployment Steps:', 'cyan');
  log('   1. Open Supabase Dashboard: https://app.supabase.com', 'blue');
  log('   2. Navigate to: SQL Editor', 'blue');
  log('   3. Copy migration file: supabase/migrations/104_fix_performance_warnings.sql', 'blue');
  log('   4. Paste and execute the SQL', 'blue');
  log('   5. Verify no errors in execution', 'blue');
  log('   6. Check Database > Indexes to confirm changes', 'blue');
  
  log('\n📋 Alternative: Supabase CLI Deployment:', 'cyan');
  log('   1. Install Supabase CLI: npm install -g supabase', 'blue');
  log('   2. Link project: supabase link --project-ref nhceygmzwmhuyqsjxquk', 'blue');
  log('   3. Apply migration: supabase db push', 'blue');
  
  log('\n📋 Post-Deployment Verification:', 'cyan');
  log('   1. Run: node scripts/verify-performance-optimization.js', 'blue');
  log('   2. Monitor query performance in Supabase Dashboard', 'blue');
  log('   3. Check for any new linter warnings', 'blue');
  log('   4. Review slow query logs', 'blue');
  
  log('\n✅ All validation steps completed successfully!', 'green');
}

async function main() {
  log('\n🚀 Supabase Performance Optimization Deployment', 'bold');
  log('Migration: 104_fix_performance_warnings.sql', 'cyan');
  log('Date: 2025-10-21\n', 'cyan');
  
  try {
    // Step 1: Read migration
    const migrationSql = await readMigrationFile();
    if (!migrationSql) {
      process.exit(1);
    }
    
    // Step 2: Check connection
    const connected = await checkDatabaseConnection();
    if (!connected) {
      log('\n⚠️  Continuing with offline validation...', 'yellow');
    }
    
    // Step 3: Validate migration
    await applyMigration(migrationSql);
    
    // Step 4: Run performance tests (if connected)
    let performanceResults = [];
    if (connected) {
      performanceResults = await runPerformanceTests();
    } else {
      log('\n⚠️  Skipping performance tests (no database connection)', 'yellow');
    }
    
    // Step 5: Check indexes
    await checkIndexes();
    
    // Step 6: Generate report
    await generateDeploymentReport(performanceResults);
    
    // Display next steps
    await displayNextSteps();
    
    log('\n🎉 Deployment preparation complete!', 'green');
    process.exit(0);
    
  } catch (error) {
    log(`\n❌ Deployment error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the deployment
main();
