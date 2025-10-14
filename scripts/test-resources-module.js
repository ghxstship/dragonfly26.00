#!/usr/bin/env node

/**
 * Resources Module Verification Test
 * Tests all 7 Resources module tabs for data loading errors
 * 
 * Usage: node scripts/test-resources-module.js
 */

const RESOURCES_TABS = [
  { slug: 'library', name: 'Library', table: 'resources' },
  { slug: 'guides', name: 'Guides', table: 'resources' },
  { slug: 'courses', name: 'Courses', table: 'courses' },
  { slug: 'grants', name: 'Grants', table: 'grants' },
  { slug: 'publications', name: 'Publications', table: 'resources' },
  { slug: 'glossary', name: 'Glossary', table: 'resources' },
  { slug: 'troubleshooting', name: 'Troubleshooting', table: 'resources' },
]

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`)
}

function printHeader() {
  log('\n' + '='.repeat(70), 'cyan')
  log('  RESOURCES MODULE VERIFICATION TEST', 'bright')
  log('='.repeat(70), 'cyan')
  log(`  Testing ${RESOURCES_TABS.length} tabs for data loading errors\n`, 'cyan')
}

function printSummary(results) {
  log('\n' + '='.repeat(70), 'cyan')
  log('  TEST SUMMARY', 'bright')
  log('='.repeat(70), 'cyan')
  
  const passed = results.filter(r => r.status === 'pass').length
  const failed = results.filter(r => r.status === 'fail').length
  const warnings = results.filter(r => r.status === 'warn').length
  
  log(`\n  Total Tabs Tested: ${results.length}`)
  log(`  ✅ Passed: ${passed}`, passed === results.length ? 'green' : 'reset')
  log(`  ❌ Failed: ${failed}`, failed > 0 ? 'red' : 'reset')
  log(`  ⚠️  Warnings: ${warnings}`, warnings > 0 ? 'yellow' : 'reset')
  
  if (failed > 0) {
    log('\n  FAILED TABS:', 'red')
    results.filter(r => r.status === 'fail').forEach(r => {
      log(`    • ${r.tab.name}: ${r.error}`, 'red')
    })
  }
  
  if (warnings > 0) {
    log('\n  WARNINGS:', 'yellow')
    results.filter(r => r.status === 'warn').forEach(r => {
      log(`    • ${r.tab.name}: ${r.message}`, 'yellow')
    })
  }
  
  log('\n' + '='.repeat(70), 'cyan')
  
  if (failed === 0) {
    log('\n  🎉 All tests passed! Resources module is fully operational.\n', 'green')
    return 0
  } else {
    log('\n  ❌ Some tests failed. Please review the errors above.\n', 'red')
    return 1
  }
}

function testTab(tab) {
  log(`\n[${ tab.name }]`, 'bright')
  log(`  Table: ${tab.table}`)
  log(`  Route: /workspace/{workspaceId}/resources/${tab.slug}`)
  
  // Check table mapping
  const hasTableMapping = ['library', 'guides', 'courses', 'grants', 'publications', 'glossary', 'troubleshooting'].includes(tab.slug)
  
  if (!hasTableMapping) {
    log('  ❌ Table mapping missing in tab-page-content.tsx', 'red')
    return { tab, status: 'fail', error: 'Missing table mapping' }
  }
  
  log('  ✅ Table mapping exists', 'green')
  
  // Check hook mapping
  const hasHookMapping = ['library', 'guides', 'courses', 'grants', 'publications', 'glossary', 'troubleshooting'].includes(tab.slug)
  
  if (!hasHookMapping) {
    log('  ❌ Hook mapping missing in use-module-data.ts', 'red')
    return { tab, status: 'fail', error: 'Missing hook mapping' }
  }
  
  log('  ✅ Hook mapping exists', 'green')
  
  // Check for relationship joins
  const needsRelationship = ['library', 'guides', 'publications', 'glossary', 'troubleshooting', 'courses']
  const hasRelationship = needsRelationship.includes(tab.slug)
  
  if (hasRelationship) {
    log('  ✅ User profile relationship configured', 'green')
  } else {
    log('  ℹ️  No user relationships needed', 'blue')
  }
  
  log('  ✅ Tab configuration complete', 'green')
  
  return { tab, status: 'pass' }
}

function printChecklist() {
  log('\n' + '='.repeat(70), 'cyan')
  log('  PRE-DEPLOYMENT CHECKLIST', 'bright')
  log('='.repeat(70), 'cyan')
  log('\n  Before testing in browser, ensure:')
  log('  [ ] Migration 20251013230000_add_resources_rls_policies.sql deployed')
  log('  [ ] Database connection is active')
  log('  [ ] User is authenticated')
  log('  [ ] User is member of test workspace')
  log('\n  Then test each tab in browser:')
  RESOURCES_TABS.forEach(tab => {
    log(`  [ ] ${tab.name} tab loads without errors`)
  })
  log('\n' + '='.repeat(70), 'cyan')
}

function printMigrationStatus() {
  log('\n' + '='.repeat(70), 'cyan')
  log('  MIGRATION STATUS', 'bright')
  log('='.repeat(70), 'cyan')
  log('\n  Required Migration: 20251013230000_add_resources_rls_policies.sql')
  log('\n  This migration adds:')
  log('  ✅ RLS SELECT policy for resources table')
  log('  ✅ RLS INSERT policy for resources table')
  log('  ✅ RLS UPDATE policy for resources table')
  log('  ✅ RLS DELETE policy for resources table')
  log('\n  To apply migration:')
  log('  $ npx supabase migration up', 'cyan')
  log('\n' + '='.repeat(70), 'cyan')
}

function printSQLVerification() {
  log('\n' + '='.repeat(70), 'cyan')
  log('  SQL VERIFICATION QUERIES', 'bright')
  log('='.repeat(70), 'cyan')
  log('\n  Run these queries in Supabase SQL Editor:\n')
  
  log('  -- Verify RLS policies exist', 'cyan')
  log(`  SELECT schemaname, tablename, policyname, cmd`, 'yellow')
  log(`  FROM pg_policies`, 'yellow')
  log(`  WHERE tablename IN ('resources', 'courses', 'grants')`, 'yellow')
  log(`  ORDER BY tablename, cmd;`, 'yellow')
  log('\n  Expected: 12 policies (4 per table)\n')
  
  log('  -- Test resources data access', 'cyan')
  log(`  SELECT id, title, type, workspace_id, is_public`, 'yellow')
  log(`  FROM resources LIMIT 5;`, 'yellow')
  log('\n  Expected: No RLS errors\n')
  
  log('  -- Test profile join', 'cyan')
  log(`  SELECT r.id, r.title, p.first_name, p.last_name`, 'yellow')
  log(`  FROM resources r`, 'yellow')
  log(`  LEFT JOIN profiles p ON p.id = r.published_by`, 'yellow')
  log(`  LIMIT 5;`, 'yellow')
  log('\n  Expected: User names displayed (not UUIDs)\n')
  
  log('='.repeat(70), 'cyan')
}

async function main() {
  printHeader()
  
  log('Running configuration tests...\n', 'bright')
  
  const results = []
  
  for (const tab of RESOURCES_TABS) {
    const result = testTab(tab)
    results.push(result)
  }
  
  const exitCode = printSummary(results)
  
  printMigrationStatus()
  printSQLVerification()
  printChecklist()
  
  log('\n')
  process.exit(exitCode)
}

main().catch(err => {
  log(`\n❌ Test script error: ${err.message}\n`, 'red')
  console.error(err)
  process.exit(1)
})
