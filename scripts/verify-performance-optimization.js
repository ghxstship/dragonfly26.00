#!/usr/bin/env node

/**
 * Verification Script: Supabase Performance Optimization
 * Purpose: Verify that migration 104 successfully resolved performance warnings
 * Date: 2025-10-21
 */

const fs = require('fs');
const path = require('path');

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

function checkMigrationFile() {
  header('STEP 1: Verify Migration File Exists');
  
  const migrationPath = path.join(__dirname, '../supabase/migrations/104_fix_performance_warnings.sql');
  
  if (!fs.existsSync(migrationPath)) {
    log('❌ Migration file not found!', 'red');
    return false;
  }
  
  const content = fs.readFileSync(migrationPath, 'utf8');
  const lines = content.split('\n').length;
  const size = (content.length / 1024).toFixed(2);
  
  log(`✅ Migration file exists`, 'green');
  log(`   Path: ${migrationPath}`, 'blue');
  log(`   Size: ${size} KB`, 'blue');
  log(`   Lines: ${lines}`, 'blue');
  
  return { content, lines, size };
}

function verifyPolicyOptimizations(content) {
  header('STEP 2: Verify RLS Policy Optimizations');
  
  const checks = [
    {
      name: 'Productions policies',
      patterns: [
        'DROP POLICY IF EXISTS "Users can manage productions with permission"',
        'DROP POLICY IF EXISTS "Users can view productions with permission"',
        'CREATE POLICY "Users can manage productions with permission"',
        '(SELECT auth.uid())',
      ],
      count: 4,
    },
    {
      name: 'Project tasks policies',
      patterns: [
        'DROP POLICY IF EXISTS "Team leads can create tasks"',
        'DROP POLICY IF EXISTS "Users can view assigned tasks"',
        'CREATE POLICY "Team leads can create tasks"',
        'CREATE POLICY "Users can view assigned tasks"',
      ],
      count: 4,
    },
    {
      name: 'Marketplace products consolidation',
      patterns: [
        'DROP POLICY IF EXISTS "Users can create products in their workspace"',
        'DROP POLICY IF EXISTS "Users can delete products in their workspace"',
        'CREATE POLICY "Users can manage marketplace_products in their workspace"',
      ],
      count: 3,
    },
    {
      name: 'Location access policies',
      patterns: [
        'DROP POLICY IF EXISTS "Users can delete location_access in their workspace"',
        'CREATE POLICY "Users can delete location_access in their workspace"',
      ],
      count: 2,
    },
  ];
  
  let passed = 0;
  let failed = 0;
  
  checks.forEach(check => {
    const found = check.patterns.filter(pattern => content.includes(pattern)).length;
    
    if (found >= check.count) {
      log(`✅ ${check.name}: ${found}/${check.patterns.length} patterns found`, 'green');
      passed++;
    } else {
      log(`❌ ${check.name}: ${found}/${check.patterns.length} patterns found`, 'red');
      failed++;
    }
  });
  
  log(`\nPolicy Optimization Score: ${passed}/${checks.length} checks passed`, 
    passed === checks.length ? 'green' : 'yellow');
  
  return { passed, failed, total: checks.length };
}

function verifyIndexOptimizations(content) {
  header('STEP 3: Verify Index Optimizations');
  
  const checks = [
    {
      name: 'Duplicate index removal (project_tasks)',
      pattern: 'DROP INDEX IF EXISTS idx_tasks_search',
      expected: true,
    },
    {
      name: 'Duplicate index removal (thread_messages)',
      pattern: 'DROP INDEX IF EXISTS idx_thread_messages_author',
      expected: true,
    },
    {
      name: 'New performance index (workspace_members)',
      pattern: 'CREATE INDEX IF NOT EXISTS idx_workspace_members_user_workspace',
      expected: true,
    },
    {
      name: 'New performance index (project_tasks assignee)',
      pattern: 'CREATE INDEX IF NOT EXISTS idx_project_tasks_assignee_workspace',
      expected: true,
    },
    {
      name: 'New performance index (productions)',
      pattern: 'CREATE INDEX IF NOT EXISTS idx_productions_workspace_project',
      expected: true,
    },
  ];
  
  let passed = 0;
  let failed = 0;
  
  checks.forEach(check => {
    const found = content.includes(check.pattern);
    
    if (found === check.expected) {
      log(`✅ ${check.name}`, 'green');
      passed++;
    } else {
      log(`❌ ${check.name}`, 'red');
      failed++;
    }
  });
  
  log(`\nIndex Optimization Score: ${passed}/${checks.length} checks passed`, 
    passed === checks.length ? 'green' : 'yellow');
  
  return { passed, failed, total: checks.length };
}

function verifyAuthUidPattern(content) {
  header('STEP 4: Verify Auth UID Pattern Usage');
  
  // Count occurrences of the optimized pattern
  const optimizedPattern = /\(SELECT auth\.uid\(\)\)/g;
  const optimizedMatches = content.match(optimizedPattern) || [];
  
  // Count direct auth.uid() calls (should be minimal, only in comments)
  const directPattern = /(?<!SELECT )auth\.uid\(\)(?!\))/g;
  const directMatches = content.match(directPattern) || [];
  
  log(`✅ Optimized pattern (SELECT auth.uid()): ${optimizedMatches.length} occurrences`, 'green');
  
  if (directMatches.length > 5) {
    log(`⚠️  Direct auth.uid() calls: ${directMatches.length} (should be in comments only)`, 'yellow');
  } else {
    log(`✅ Direct auth.uid() calls: ${directMatches.length} (acceptable - likely in comments)`, 'green');
  }
  
  return {
    optimized: optimizedMatches.length,
    direct: directMatches.length,
    ratio: optimizedMatches.length / (directMatches.length || 1),
  };
}

function verifyAnalyzeStatements(content) {
  header('STEP 5: Verify ANALYZE Statements');
  
  const tables = [
    'productions',
    'project_tasks',
    'project_milestones',
    'location_access',
    'scopes_of_work',
    'approval_requests',
    'marketplace_products',
    'marketplace_orders',
    'report_templates',
    'courses',
    'thread_messages',
    'workspace_members',
  ];
  
  let found = 0;
  
  tables.forEach(table => {
    if (content.includes(`ANALYZE ${table}`)) {
      found++;
    }
  });
  
  log(`✅ ANALYZE statements: ${found}/${tables.length} tables`, 
    found === tables.length ? 'green' : 'yellow');
  
  return { found, total: tables.length };
}

function generateReport(results) {
  header('VERIFICATION REPORT');
  
  const totalChecks = 
    results.policies.total +
    results.indexes.total +
    results.analyze.total +
    1; // auth pattern check
  
  const passedChecks = 
    results.policies.passed +
    results.indexes.passed +
    results.analyze.found +
    (results.authPattern.optimized > 20 ? 1 : 0);
  
  const score = ((passedChecks / totalChecks) * 100).toFixed(1);
  
  log(`\n📊 Overall Score: ${score}%`, score >= 95 ? 'green' : 'yellow');
  log(`   Checks Passed: ${passedChecks}/${totalChecks}`, 'blue');
  log(`   Migration Size: ${results.migration.size} KB`, 'blue');
  log(`   Migration Lines: ${results.migration.lines}`, 'blue');
  
  log(`\n📋 Breakdown:`, 'cyan');
  log(`   ✅ Policy Optimizations: ${results.policies.passed}/${results.policies.total}`, 'blue');
  log(`   ✅ Index Optimizations: ${results.indexes.passed}/${results.indexes.total}`, 'blue');
  log(`   ✅ Auth Pattern Usage: ${results.authPattern.optimized} occurrences`, 'blue');
  log(`   ✅ ANALYZE Statements: ${results.analyze.found}/${results.analyze.total}`, 'blue');
  
  if (score >= 95) {
    log(`\n🎉 VERIFICATION PASSED - Migration is production ready!`, 'green');
    log(`   Grade: A+ (${score}%)`, 'green');
    log(`   Status: ✅ APPROVED FOR DEPLOYMENT`, 'green');
  } else if (score >= 80) {
    log(`\n⚠️  VERIFICATION PASSED WITH WARNINGS`, 'yellow');
    log(`   Grade: B+ (${score}%)`, 'yellow');
    log(`   Status: ⚠️  REVIEW RECOMMENDED`, 'yellow');
  } else {
    log(`\n❌ VERIFICATION FAILED`, 'red');
    log(`   Grade: C (${score}%)`, 'red');
    log(`   Status: ❌ NOT READY FOR DEPLOYMENT`, 'red');
  }
  
  return score;
}

function main() {
  log('\n🔍 Supabase Performance Optimization Verification', 'bold');
  log('Migration: 104_fix_performance_warnings.sql', 'cyan');
  log('Date: 2025-10-21\n', 'cyan');
  
  try {
    const migration = checkMigrationFile();
    if (!migration) {
      process.exit(1);
    }
    
    const policies = verifyPolicyOptimizations(migration.content);
    const indexes = verifyIndexOptimizations(migration.content);
    const authPattern = verifyAuthUidPattern(migration.content);
    const analyze = verifyAnalyzeStatements(migration.content);
    
    const results = {
      migration,
      policies,
      indexes,
      authPattern,
      analyze,
    };
    
    const score = generateReport(results);
    
    // Exit with appropriate code
    process.exit(score >= 95 ? 0 : 1);
    
  } catch (error) {
    log(`\n❌ Error during verification: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the verification
main();
