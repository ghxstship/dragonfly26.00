#!/usr/bin/env node

/**
 * Language Switching Diagnostic Script
 * Tests the i18n setup and translation availability
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 LANGUAGE SWITCHING DIAGNOSTIC\n');
console.log('='.repeat(60));

// 1. Check all translation files exist
console.log('\n📁 Checking translation files...');
const messagesDir = path.join(__dirname, '../src/i18n/messages');
const locales = [
  'en', 'es', 'fr', 'zh', 'hi', 'ar', 'ko', 'vi', 'pt', 'de',
  'ja', 'ru', 'id', 'ur', 'bn', 'ta', 'te', 'mr', 'tr', 'sw'
];

let allFilesExist = true;
locales.forEach(locale => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${locale}.json ${exists ? '' : '(MISSING)'}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n❌ ERROR: Some translation files are missing!');
  process.exit(1);
}

// 2. Check marketing translations exist in all files
console.log('\n📝 Checking marketing translations...');
let allHaveMarketing = true;
let marketingKeyCount = {};

locales.forEach(locale => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const hasMarketing = !!content.marketing;
  const hasNav = hasMarketing && !!content.marketing.nav;
  const navKeys = hasNav ? Object.keys(content.marketing.nav).length : 0;
  
  marketingKeyCount[locale] = navKeys;
  
  console.log(`  ${hasMarketing && hasNav ? '✅' : '❌'} ${locale}: ${navKeys} nav keys`);
  
  if (!hasMarketing || !hasNav) {
    allHaveMarketing = false;
  }
});

if (!allHaveMarketing) {
  console.log('\n⚠️  WARNING: Some files missing marketing.nav translations!');
}

// 3. Compare key counts
console.log('\n🔢 Translation key consistency...');
const enKeys = marketingKeyCount['en'];
const inconsistent = [];

locales.forEach(locale => {
  if (locale === 'en') return;
  const count = marketingKeyCount[locale];
  if (count !== enKeys) {
    inconsistent.push(`${locale} (${count} vs ${enKeys})`);
  }
});

if (inconsistent.length > 0) {
  console.log(`  ⚠️  Inconsistent key counts: ${inconsistent.join(', ')}`);
} else {
  console.log(`  ✅ All locales have ${enKeys} nav keys (consistent)`);
}

// 4. Sample translation test
console.log('\n🌍 Sample translations for "solutions":');
locales.slice(0, 5).forEach(locale => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const value = content.marketing?.nav?.solutions || 'MISSING';
  console.log(`  ${locale}: "${value}"`);
});

// 5. Check middleware configuration
console.log('\n⚙️  Checking middleware configuration...');
const middlewarePath = path.join(__dirname, '../src/middleware.ts');
const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');

const hasIntlMiddleware = middlewareContent.includes('createIntlMiddleware');
const hasLocalePrefix = middlewareContent.includes("localePrefix: 'always'");
const hasAllLocales = locales.every(locale => middlewareContent.includes(`'${locale}'`));

console.log(`  ${hasIntlMiddleware ? '✅' : '❌'} createIntlMiddleware imported`);
console.log(`  ${hasLocalePrefix ? '✅' : '❌'} localePrefix: 'always' configured`);
console.log(`  ${hasAllLocales ? '✅' : '❌'} All locales in matcher`);

// 6. Check next.config.js
console.log('\n📦 Checking next.config.js...');
const configPath = path.join(__dirname, '../next.config.js');
const configContent = fs.readFileSync(configPath, 'utf8');

const hasWithNextIntl = configContent.includes('withNextIntl');
const hasRequestConfig = configContent.includes('./src/i18n/request.ts');

console.log(`  ${hasWithNextIntl ? '✅' : '❌'} withNextIntl plugin configured`);
console.log(`  ${hasRequestConfig ? '✅' : '❌'} request.ts path configured`);

// 7. Check i18n/request.ts
console.log('\n🔧 Checking i18n/request.ts...');
const requestPath = path.join(__dirname, '../src/i18n/request.ts');
const requestContent = fs.readFileSync(requestPath, 'utf8');

const hasGetRequestConfig = requestContent.includes('getRequestConfig');
const hasDynamicImport = requestContent.includes('await import');

console.log(`  ${hasGetRequestConfig ? '✅' : '❌'} getRequestConfig used`);
console.log(`  ${hasDynamicImport ? '✅' : '❌'} Dynamic imports configured`);

// 8. Final summary
console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY\n');

const allChecks = [
  allFilesExist,
  allHaveMarketing,
  inconsistent.length === 0,
  hasIntlMiddleware,
  hasLocalePrefix,
  hasAllLocales,
  hasWithNextIntl,
  hasRequestConfig,
  hasGetRequestConfig,
  hasDynamicImport
];

const passedChecks = allChecks.filter(Boolean).length;
const totalChecks = allChecks.length;
const percentage = Math.round((passedChecks / totalChecks) * 100);

console.log(`Status: ${passedChecks}/${totalChecks} checks passed (${percentage}%)`);

if (passedChecks === totalChecks) {
  console.log('\n✅ All checks passed! i18n setup is correct.');
  console.log('\n💡 If languages still not changing, try:');
  console.log('   1. Clear browser cache and cookies');
  console.log('   2. Check browser console for errors');
  console.log('   3. Verify you\'re testing on a page under /[locale]/ route');
  console.log('   4. Check Network tab to see if correct locale files are loaded');
  console.log('   5. Try: npm run dev (restart dev server)');
} else {
  console.log('\n❌ Some checks failed. Review the issues above.');
}

console.log('\n' + '='.repeat(60));
