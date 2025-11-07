#!/usr/bin/env node

/**
 * Audit Realtime Implementation in Data Hooks
 * 
 * Checks all data hooks to see which ones have realtime subscriptions
 * and which ones need them added.
 */

const fs = require('fs');
const path = require('path');

const HOOKS_DIR = path.join(__dirname, '../src/hooks');

// Data hooks that should have realtime subscriptions
const DATA_HOOKS = [
  'use-admin-data.ts',
  'use-analytics-data.ts',
  'use-asset-catalog.ts',
  'use-assets-data.ts',
  'use-community-data.ts',
  'use-companies-data.ts',
  'use-dashboard-data.ts',
  'use-events-data.ts',
  'use-files-data.ts',
  'use-finance-data.ts',
  'use-insights-data.ts',
  'use-jobs-data.ts',
  'use-locations-data.ts',
  'use-marketplace-data.ts',
  'use-people-data.ts',
  'use-procurement-data.ts',
  'use-profile-data.ts',
  'use-projects-data.ts',
  'use-reports-data.ts',
  'use-resources-data.ts',
  'use-settings-data.ts',
  'use-module-data.ts'
];

// Utility hooks that don't need realtime
const UTILITY_HOOKS = [
  'use-is-mobile.ts',
  'use-pwa.ts',
  'use-workspace.ts',
  'use-notifications.ts',
  'use-dashboard-widgets.ts',
  'use-people-dashboard.ts',
  'use-file-collaboration.ts',
  'use-file-enterprise.ts',
  'use-file-upload.ts',
  'use-marketplace-collections.ts',
  'use-marketplace-discounts.ts',
  'use-marketplace-gift-cards.ts',
  'use-marketplace-reviews.ts',
  'use-marketplace-variants.ts',
  'use-marketplace-wishlists.ts',
  'use-member-level.ts',
  'use-optimized-realtime.ts',
  'use-debounced-realtime.ts'
];

function checkRealtimeInHook(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for various realtime patterns
  const hasChannel = content.includes('.channel(');
  const hasSubscribe = content.includes('.subscribe(');
  const hasUseOptimizedRealtime = content.includes('useOptimizedRealtime');
  const hasUseWorkspaceRealtime = content.includes('useWorkspaceRealtime');
  const hasUseFileRealtime = content.includes('useFileRealtime');
  const hasUseGlobalRealtime = content.includes('useGlobalRealtime');
  const hasUseMultiTableRealtime = content.includes('useMultiTableRealtime');
  const hasPostgresChanges = content.includes('postgres_changes');
  
  const hasRealtime = hasChannel || hasSubscribe || hasUseOptimizedRealtime || 
                      hasUseWorkspaceRealtime || hasUseFileRealtime || 
                      hasUseGlobalRealtime || hasUseMultiTableRealtime;
  
  return {
    hasRealtime,
    patterns: {
      channel: hasChannel,
      subscribe: hasSubscribe,
      useOptimizedRealtime: hasUseOptimizedRealtime,
      useWorkspaceRealtime: hasUseWorkspaceRealtime,
      useFileRealtime: hasUseFileRealtime,
      useGlobalRealtime: hasUseGlobalRealtime,
      useMultiTableRealtime: hasUseMultiTableRealtime,
      postgresChanges: hasPostgresChanges
    }
  };
}

function auditRealtimeHooks() {
  console.log('🔍 REALTIME HOOKS AUDIT\n');
  console.log('=' .repeat(80));
  
  const results = {
    withRealtime: [],
    withoutRealtime: [],
    utility: []
  };
  
  // Check data hooks
  DATA_HOOKS.forEach(hookFile => {
    const filePath = path.join(HOOKS_DIR, hookFile);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${hookFile} - FILE NOT FOUND`);
      return;
    }
    
    const check = checkRealtimeInHook(filePath);
    
    if (check.hasRealtime) {
      results.withRealtime.push({ file: hookFile, patterns: check.patterns });
    } else {
      results.withoutRealtime.push({ file: hookFile });
    }
  });
  
  // Note utility hooks
  UTILITY_HOOKS.forEach(hookFile => {
    const filePath = path.join(HOOKS_DIR, hookFile);
    if (fs.existsSync(filePath)) {
      results.utility.push(hookFile);
    }
  });
  
  // Print results
  console.log('\n✅ DATA HOOKS WITH REALTIME:');
  console.log('-'.repeat(80));
  results.withRealtime.forEach(({ file, patterns }) => {
    const patternList = Object.entries(patterns)
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(', ');
    console.log(`  ✓ ${file}`);
    console.log(`    Patterns: ${patternList}`);
  });
  
  console.log('\n❌ DATA HOOKS WITHOUT REALTIME:');
  console.log('-'.repeat(80));
  results.withoutRealtime.forEach(({ file }) => {
    console.log(`  ✗ ${file}`);
  });
  
  console.log('\n📊 SUMMARY:');
  console.log('-'.repeat(80));
  console.log(`  Total Data Hooks: ${DATA_HOOKS.length}`);
  console.log(`  With Realtime: ${results.withRealtime.length} (${Math.round(results.withRealtime.length / DATA_HOOKS.length * 100)}%)`);
  console.log(`  Without Realtime: ${results.withoutRealtime.length} (${Math.round(results.withoutRealtime.length / DATA_HOOKS.length * 100)}%)`);
  console.log(`  Utility Hooks (excluded): ${results.utility.length}`);
  
  console.log('\n🎯 REALTIME LAYER SCORE:');
  console.log('-'.repeat(80));
  const score = Math.round(results.withRealtime.length / DATA_HOOKS.length * 100);
  console.log(`  ${score}/100`);
  
  if (score === 100) {
    console.log('  Status: ✅ PERFECT - All data hooks have realtime!');
  } else if (score >= 90) {
    console.log('  Status: ✅ EXCELLENT - Almost there!');
  } else if (score >= 75) {
    console.log('  Status: ⚠️  GOOD - Needs improvement');
  } else if (score >= 50) {
    console.log('  Status: ⚠️  FAIR - Significant work needed');
  } else {
    console.log('  Status: ❌ CRITICAL - Major implementation required');
  }
  
  console.log('\n' + '='.repeat(80));
  
  return results;
}

// Run audit
const results = auditRealtimeHooks();

// Exit with error code if not 100%
process.exit(results.withoutRealtime.length > 0 ? 1 : 0);
