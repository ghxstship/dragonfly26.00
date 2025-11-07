#!/usr/bin/env node

/**
 * Comprehensive Locale Testing Script
 * 
 * Tests:
 * 1. All translation files are valid JSON
 * 2. All translation files have required keys
 * 3. All locales match between config, middleware, and files
 * 4. Country-to-locale mappings are valid
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Comprehensive Locale Testing...\n');

let errors = 0;
let warnings = 0;

// Load i18n config
const i18nConfigPath = path.join(__dirname, '../src/i18n/config.ts');
const i18nConfig = fs.readFileSync(i18nConfigPath, 'utf8');

const localesMatch = i18nConfig.match(/export const locales = \[([\s\S]*?)\] as const/);
const configuredLocales = localesMatch[1]
  .split('\n')
  .map(line => {
    const match = line.match(/'([a-z]{2})'/);
    return match ? match[1] : null;
  })
  .filter(Boolean);

console.log('📋 Test 1: Configured Locales');
console.log(`Found ${configuredLocales.length} locales in i18n/config.ts`);
console.log(`Locales: ${configuredLocales.join(', ')}\n`);

// Test 2: Validate all translation files
console.log('📋 Test 2: Translation File Validation');

const messagesDir = path.join(__dirname, '../src/i18n/messages');
const translationFiles = fs.readdirSync(messagesDir)
  .filter(f => f.endsWith('.json'));

console.log(`Found ${translationFiles.length} translation files\n`);

// Load English as reference
const enPath = path.join(messagesDir, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Get all top-level keys from English
const requiredTopLevelKeys = Object.keys(enData);
console.log(`Reference keys from en.json: ${requiredTopLevelKeys.length} top-level keys\n`);

configuredLocales.forEach(locale => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${locale}.json: FILE MISSING`);
    errors++;
    return;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keys = Object.keys(data);
    
    // Check for missing top-level keys
    const missingKeys = requiredTopLevelKeys.filter(key => !keys.includes(key));
    
    if (missingKeys.length > 0) {
      console.log(`⚠️  ${locale}.json: Missing ${missingKeys.length} top-level keys`);
      if (missingKeys.length <= 5) {
        console.log(`   Missing: ${missingKeys.join(', ')}`);
      }
      warnings++;
    } else {
      console.log(`✅ ${locale}.json: Valid (${keys.length} top-level keys)`);
    }
  } catch (error) {
    console.log(`❌ ${locale}.json: INVALID JSON - ${error.message}`);
    errors++;
  }
});

console.log();

// Test 3: Middleware matcher validation
console.log('📋 Test 3: Middleware Matcher Validation');

const middlewarePath = path.join(__dirname, '../src/middleware.ts');
const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
const matcherMatch = middlewareContent.match(/\/\(([a-z|]+)\)\/:\path\*/);

if (matcherMatch) {
  const matcherLocales = matcherMatch[1].split('|');
  console.log(`Middleware matcher has ${matcherLocales.length} locales\n`);
  
  const missingFromMatcher = configuredLocales.filter(locale => !matcherLocales.includes(locale));
  const extraInMatcher = matcherLocales.filter(locale => !configuredLocales.includes(locale));
  
  if (missingFromMatcher.length > 0) {
    console.log(`❌ Locales in config but NOT in middleware matcher:`);
    console.log(`   ${missingFromMatcher.join(', ')}`);
    errors++;
  }
  
  if (extraInMatcher.length > 0) {
    console.log(`❌ Locales in middleware matcher but NOT in config:`);
    console.log(`   ${extraInMatcher.join(', ')}`);
    errors++;
  }
  
  if (missingFromMatcher.length === 0 && extraInMatcher.length === 0) {
    console.log(`✅ Middleware matcher matches config perfectly`);
  }
} else {
  console.log(`❌ Could not find middleware matcher pattern`);
  errors++;
}

console.log();

// Test 4: Language names validation
console.log('📋 Test 4: Language Names Validation');

const languageNamesMatch = i18nConfig.match(/export const languageNames: Record<Locale, \{ native: string; english: string; flag: string \}> = \{([\s\S]*?)\}/);

if (languageNamesMatch) {
  const languageNamesContent = languageNamesMatch[1];
  const definedLanguages = [...languageNamesContent.matchAll(/([a-z]{2}): \{/g)].map(m => m[1]);
  
  console.log(`Found ${definedLanguages.length} language name definitions\n`);
  
  const missingLanguageNames = configuredLocales.filter(locale => !definedLanguages.includes(locale));
  const extraLanguageNames = definedLanguages.filter(locale => !configuredLocales.includes(locale));
  
  if (missingLanguageNames.length > 0) {
    console.log(`❌ Locales missing from languageNames:`);
    console.log(`   ${missingLanguageNames.join(', ')}`);
    errors++;
  }
  
  if (extraLanguageNames.length > 0) {
    console.log(`⚠️  Extra entries in languageNames:`);
    console.log(`   ${extraLanguageNames.join(', ')}`);
    warnings++;
  }
  
  if (missingLanguageNames.length === 0 && extraLanguageNames.length === 0) {
    console.log(`✅ All locales have language name definitions`);
  }
} else {
  console.log(`❌ Could not find languageNames definition`);
  errors++;
}

console.log();

// Test 5: Country language mappings
console.log('📋 Test 5: Country Language Mappings');

const countriesPath = path.join(__dirname, '../src/config/countries.ts');
const countriesContent = fs.readFileSync(countriesPath, 'utf8');

const primaryLanguages = [...countriesContent.matchAll(/language: '([a-z]{2})'/g)].map(m => m[1]);
const uniquePrimaryLanguages = [...new Set(primaryLanguages)];

console.log(`Found ${uniquePrimaryLanguages.length} unique primary languages in countries\n`);

const invalidPrimaryLanguages = uniquePrimaryLanguages.filter(lang => !configuredLocales.includes(lang));

if (invalidPrimaryLanguages.length > 0) {
  console.log(`❌ Countries using invalid primary languages:`);
  invalidPrimaryLanguages.forEach(lang => {
    const countries = [];
    const countryBlocks = countriesContent.split(/\n  [A-Z]{2}: \{/);
    countryBlocks.forEach(block => {
      if (block.includes(`language: '${lang}'`)) {
        const nameMatch = block.match(/name: '([^']+)'/);
        const codeMatch = block.match(/code: '([A-Z]{2})'/);
        if (nameMatch && codeMatch) {
          countries.push(`${codeMatch[1]} (${nameMatch[1]})`);
        }
      }
    });
    console.log(`   '${lang}': ${countries.join(', ')}`);
  });
  errors++;
} else {
  console.log(`✅ All countries use valid primary languages`);
}

console.log();

// Test 6: Alternative languages validation
console.log('📋 Test 6: Alternative Languages Validation');

const altLanguageMatches = [...countriesContent.matchAll(/alternativeLanguages: \[(.*?)\]/g)];
const allAltLanguages = new Set();

altLanguageMatches.forEach(match => {
  const langs = match[1].match(/'([a-z]{2})'/g);
  if (langs) {
    langs.forEach(lang => {
      const code = lang.replace(/'/g, '');
      allAltLanguages.add(code);
    });
  }
});

const invalidAltLanguages = [...allAltLanguages].filter(lang => !configuredLocales.includes(lang));

if (invalidAltLanguages.length > 0) {
  console.log(`❌ Invalid alternative languages found:`);
  console.log(`   ${invalidAltLanguages.join(', ')}`);
  errors++;
} else {
  console.log(`✅ All alternative languages are valid`);
}

console.log();

// Summary
console.log('=' .repeat(60));
console.log('📊 TEST SUMMARY');
console.log('=' .repeat(60));
console.log(`Total Locales: ${configuredLocales.length}`);
console.log(`Translation Files: ${translationFiles.length}`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);
console.log('=' .repeat(60));

if (errors === 0 && warnings === 0) {
  console.log('\n✅ ALL TESTS PASSED - 100% VALID');
  console.log('\n🎉 All locales are properly configured and ready for use!');
  process.exit(0);
} else if (errors === 0) {
  console.log(`\n⚠️  ALL TESTS PASSED WITH ${warnings} WARNINGS`);
  console.log('Warnings are non-critical but should be addressed.');
  process.exit(0);
} else {
  console.log(`\n❌ TESTS FAILED: ${errors} errors, ${warnings} warnings`);
  console.log('Please fix the errors before deploying.');
  process.exit(1);
}
