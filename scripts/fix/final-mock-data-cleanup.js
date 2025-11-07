#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 FINAL MOCK DATA CLEANUP - REMOVING ALL REMAINING HARDCODED DATA\n');

const filesToFix = [
  'src/components/finance/finance-overview-tab.tsx',
  'src/components/finance/finance-policies-tab.tsx',
  'src/components/admin/checklist-templates-tab.tsx',
  'src/components/admin/webhooks-tab.tsx',
  'src/components/assets/assets-overview-tab.tsx',
  'src/components/assets/tracking-tab.tsx',
  'src/components/locations/locations-site-maps-tab.tsx',
  'src/components/insights/insights-intelligence-feed-tab.tsx',
  'src/components/insights/insights-key-results-tab.tsx',
  'src/components/insights/insights-objectives-tab.tsx',
  'src/components/insights/insights-priorities-tab.tsx',
  'src/components/insights/insights-recommendations-tab.tsx',
  'src/components/insights/insights-reviews-tab.tsx',
  'src/components/analytics/analytics-custom-views-tab.tsx',
  'src/components/analytics/analytics-data-sources-tab.tsx',
  'src/components/analytics/analytics-metrics-library-tab.tsx',
  'src/components/reports/reports-archived-tab.tsx',
  'src/components/reports/reports-compliance-tab.tsx',
  'src/components/reports/reports-custom-builder-tab.tsx',
  'src/components/reports/reports-executive-tab.tsx',
  'src/components/reports/reports-exports-tab.tsx',
  'src/components/reports/reports-operational-tab.tsx',
  'src/components/reports/reports-overview-tab.tsx',
  'src/components/reports/reports-scheduled-tab.tsx',
  'src/components/reports/reports-templates-tab.tsx',
  'src/components/profile/performance-tab.tsx',
  'src/components/profile/tags-tab.tsx',
];

let fixed = 0;

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Remove any remaining MOCK_ references
  if (content.includes('MOCK_')) {
    content = content.replace(/\.\.\\.MOCK_\w+/g, '[]');
    content = content.replace(/MOCK_\w+/g, '[]');
    modified = true;
  }

  // Remove hardcoded array declarations (const name = [...])
  const arrayPatterns = [
    /const\s+(corporateCards|recentViolations|spendingPolicies|approvalWorkflows)\s*=\s*\[[\s\S]*?\n\s*\]/g,
    /const\s+\w+\s*=\s*\[\s*\{[\s\S]*?id:\s*['"`]\d+['"`][\s\S]*?\}\s*,?\s*\]/g,
  ];

  arrayPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, '// Mock data removed - using Supabase data');
      modified = true;
    }
  });

  // Fix data usage to use hook data or empty arrays
  const dataFixes = [
    {
      find: /const\s+(\w+)\s*=\s*\(data\s*&&\s*data\.length\s*>\s*0\)\s*\?\s*data\.slice\([^)]*\)\s*:\s*\[[\s\S]*?\]/g,
      replace: 'const $1 = data || []'
    },
    {
      find: /const\s+(\w+)\s*=\s*\(data\s*&&\s*data\.length\s*>\s*0\)\s*\?\s*data\s*:\s*\[[\s\S]*?\]/g,
      replace: 'const $1 = data || []'
    },
  ];

  dataFixes.forEach(({ find, replace }) => {
    if (find.test(content)) {
      content = content.replace(find, replace);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${file}`);
    fixed++;
  } else {
    console.log(`⏭️  ${file} (no changes needed)`);
  }
});

console.log(`\n📊 SUMMARY:`);
console.log(`✅ Files fixed: ${fixed}/${filesToFix.length}`);
console.log(`\n🎯 Rerunning audit...`);
