#!/usr/bin/env node

/**
 * Verification script to ensure all translation keys used in FinancialDashboardOrganism
 * are properly defined in the translation files
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying translation keys for FinancialDashboardOrganism...\n');

// Load the business.json translation file
const businessJsonPath = path.join(process.cwd(), 'src/i18n/messages/en/business.json');
const businessJson = JSON.parse(fs.readFileSync(businessJsonPath, 'utf-8'));

// Expected keys for FinancialDashboardOrganism
const expectedKeys = [
  'business.finance.dashboard.title',
  'business.finance.dashboard.month',
  'business.finance.dashboard.quarter',
  'business.finance.dashboard.year',
  'business.finance.dashboard.revenue',
  'business.finance.dashboard.expenses',
  'business.finance.dashboard.profit',
  'business.finance.dashboard.budget',
  'business.finance.dashboard.topExpenses',
  'business.finance.dashboard.recentTransactions'
];

console.log('📋 Checking for required translation keys:\n');

let allKeysPresent = true;
const missingKeys = [];

expectedKeys.forEach(keyPath => {
  const parts = keyPath.split('.');
  let current = businessJson;
  let found = true;
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      found = false;
      break;
    }
  }
  
  if (found && typeof current === 'string') {
    console.log(`✅ ${keyPath}: "${current}"`);
  } else {
    console.log(`❌ ${keyPath}: MISSING`);
    allKeysPresent = false;
    missingKeys.push(keyPath);
  }
});

console.log('\n' + '='.repeat(80));

if (allKeysPresent) {
  console.log('\n✅ SUCCESS: All translation keys are properly defined!');
  console.log('\n📊 Summary:');
  console.log(`   - Total keys checked: ${expectedKeys.length}`);
  console.log(`   - Keys found: ${expectedKeys.length}`);
  console.log(`   - Keys missing: 0`);
  console.log('\n🎉 FinancialDashboardOrganism is ready for production!');
  process.exit(0);
} else {
  console.log('\n❌ FAILURE: Some translation keys are missing!');
  console.log('\n📊 Summary:');
  console.log(`   - Total keys checked: ${expectedKeys.length}`);
  console.log(`   - Keys found: ${expectedKeys.length - missingKeys.length}`);
  console.log(`   - Keys missing: ${missingKeys.length}`);
  console.log('\n🔧 Missing keys:');
  missingKeys.forEach(key => console.log(`   - ${key}`));
  console.log('\nPlease add these keys to src/i18n/messages/en/business.json');
  process.exit(1);
}
