#!/usr/bin/env node

/**
 * Verify Marketing i18n Implementation
 * 
 * This script verifies that all 20 language files have the marketing section
 * and provides detailed statistics about the implementation.
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages');

const locales = [
  'en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'ru', 'pt', 'id',
  'ur', 'de', 'ja', 'sw', 'mr', 'te', 'tr', 'ta', 'vi', 'ko'
];

console.log('🔍 Verifying Marketing i18n Implementation\n');
console.log('='.repeat(70));

let totalFiles = 0;
let filesWithMarketing = 0;
let errors = [];
let stats = {
  totalKeys: 0,
  minKeys: Infinity,
  maxKeys: 0,
  languages: {}
};

// Check each language file
locales.forEach((locale) => {
  try {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    
    if (!fs.existsSync(filePath)) {
      errors.push(`❌ ${locale}.json - File not found`);
      return;
    }
    
    totalFiles++;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.marketing) {
      errors.push(`❌ ${locale}.json - Missing marketing section`);
      return;
    }
    
    filesWithMarketing++;
    
    // Count keys in marketing section
    const countKeys = (obj) => {
      let count = 0;
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          count += countKeys(obj[key]);
        } else {
          count++;
        }
      }
      return count;
    };
    
    const keyCount = countKeys(data.marketing);
    stats.languages[locale] = keyCount;
    stats.totalKeys += keyCount;
    stats.minKeys = Math.min(stats.minKeys, keyCount);
    stats.maxKeys = Math.max(stats.maxKeys, keyCount);
    
    console.log(`✅ ${locale}.json - ${keyCount} translation keys`);
    
  } catch (error) {
    errors.push(`❌ ${locale}.json - Error: ${error.message}`);
  }
});

// Summary
console.log('\n' + '='.repeat(70));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(70));
console.log(`Total Language Files: ${totalFiles}/${locales.length}`);
console.log(`Files with Marketing: ${filesWithMarketing}/${locales.length}`);
console.log(`Success Rate: ${((filesWithMarketing / locales.length) * 100).toFixed(1)}%`);

if (errors.length > 0) {
  console.log(`\n⚠️  ERRORS (${errors.length}):`);
  errors.forEach(err => console.log(err));
} else {
  console.log('\n✅ NO ERRORS - All files verified successfully!');
}

console.log('\n📈 TRANSLATION KEY STATISTICS:');
console.log(`Total Keys Across All Languages: ${stats.totalKeys.toLocaleString()}`);
console.log(`Average Keys Per Language: ${Math.round(stats.totalKeys / filesWithMarketing)}`);
console.log(`Min Keys: ${stats.minKeys}`);
console.log(`Max Keys: ${stats.maxKeys}`);

// Check consistency
const enKeys = stats.languages['en'];
const inconsistent = [];
Object.entries(stats.languages).forEach(([locale, count]) => {
  if (count !== enKeys && locale !== 'en') {
    inconsistent.push(`${locale}: ${count} (expected ${enKeys})`);
  }
});

if (inconsistent.length > 0) {
  console.log('\n⚠️  KEY COUNT INCONSISTENCIES:');
  inconsistent.forEach(msg => console.log(`  ${msg}`));
} else {
  console.log('\n✅ All languages have consistent key counts!');
}

// Final status
console.log('\n' + '='.repeat(70));
if (filesWithMarketing === locales.length && errors.length === 0) {
  console.log('🎉 VERIFICATION PASSED - 100% COMPLETE');
  console.log('✅ All 20 languages have marketing i18n support');
  console.log('✅ Ready for global deployment');
  process.exit(0);
} else {
  console.log('❌ VERIFICATION FAILED');
  console.log(`${filesWithMarketing}/${locales.length} files have marketing section`);
  process.exit(1);
}
