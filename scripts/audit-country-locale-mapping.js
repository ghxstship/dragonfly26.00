#!/usr/bin/env node

/**
 * Comprehensive Country-Locale Mapping Audit
 * 
 * Identifies and reports:
 * 1. Countries with invalid language codes (not in i18n config)
 * 2. Missing translation files for configured locales
 * 3. Extra translation files not in i18n config
 * 4. Middleware matcher issues
 */

const fs = require('fs');
const path = require('path');

// Load i18n config
const i18nConfigPath = path.join(__dirname, '../src/i18n/config.ts');
const i18nConfig = fs.readFileSync(i18nConfigPath, 'utf8');

// Extract locales from config
const localesMatch = i18nConfig.match(/export const locales = \[([\s\S]*?)\] as const/);
const configuredLocales = localesMatch[1]
  .split('\n')
  .map(line => {
    const match = line.match(/'([a-z]{2})'/);
    return match ? match[1] : null;
  })
  .filter(Boolean);

console.log('📋 CONFIGURED LOCALES IN i18n/config.ts:');
console.log(configuredLocales.join(', '));
console.log(`Total: ${configuredLocales.length}\n`);

// Load countries config
const countriesPath = path.join(__dirname, '../src/config/countries.ts');
const countriesContent = fs.readFileSync(countriesPath, 'utf8');

// Extract all language codes from countries
const languageMatches = [...countriesContent.matchAll(/language: '([a-z]{2})'/g)];
const altLanguageMatches = [...countriesContent.matchAll(/alternativeLanguages: \[(.*?)\]/g)];

const usedLanguages = new Set();
const countryLanguageMap = {};

// Parse primary languages
languageMatches.forEach(match => {
  usedLanguages.add(match[1]);
});

// Parse alternative languages
altLanguageMatches.forEach(match => {
  const langs = match[1].match(/'([a-z]{2})'/g);
  if (langs) {
    langs.forEach(lang => {
      const code = lang.replace(/'/g, '');
      usedLanguages.add(code);
    });
  }
});

// Extract country-specific mappings
const countryBlocks = countriesContent.split(/\n  [A-Z]{2}: \{/);
countryBlocks.forEach(block => {
  const codeMatch = block.match(/code: '([A-Z]{2})'/);
  const nameMatch = block.match(/name: '([^']+)'/);
  const langMatch = block.match(/language: '([a-z]{2})'/);
  
  if (codeMatch && nameMatch && langMatch) {
    const code = codeMatch[1];
    const name = nameMatch[1];
    const lang = langMatch[1];
    
    countryLanguageMap[code] = {
      name,
      language: lang,
      valid: configuredLocales.includes(lang)
    };
  }
});

console.log('🌍 LANGUAGES USED IN COUNTRIES CONFIG:');
console.log([...usedLanguages].sort().join(', '));
console.log(`Total: ${usedLanguages.size}\n`);

// Check for invalid languages
const invalidLanguages = [...usedLanguages].filter(lang => !configuredLocales.includes(lang));

if (invalidLanguages.length > 0) {
  console.log('❌ INVALID LANGUAGES (not in i18n config):');
  invalidLanguages.forEach(lang => {
    console.log(`  - ${lang}`);
    
    // Find which countries use this language
    const countries = Object.entries(countryLanguageMap)
      .filter(([_, data]) => data.language === lang)
      .map(([code, data]) => `${code} (${data.name})`);
    
    if (countries.length > 0) {
      console.log(`    Used by: ${countries.join(', ')}`);
    }
  });
  console.log();
}

// Check translation files
const messagesDir = path.join(__dirname, '../src/i18n/messages');
const translationFiles = fs.readdirSync(messagesDir)
  .filter(f => f.endsWith('.json'))
  .map(f => f.replace('.json', ''));

console.log('📁 TRANSLATION FILES PRESENT:');
console.log(translationFiles.join(', '));
console.log(`Total: ${translationFiles.length}\n`);

// Check for missing translation files
const missingTranslations = configuredLocales.filter(locale => !translationFiles.includes(locale));

if (missingTranslations.length > 0) {
  console.log('❌ MISSING TRANSLATION FILES:');
  missingTranslations.forEach(locale => {
    console.log(`  - ${locale}.json`);
  });
  console.log();
}

// Check for extra translation files
const extraTranslations = translationFiles.filter(file => !configuredLocales.includes(file));

if (extraTranslations.length > 0) {
  console.log('⚠️  EXTRA TRANSLATION FILES (not in i18n config):');
  extraTranslations.forEach(file => {
    console.log(`  - ${file}.json`);
  });
  console.log();
}

// Check middleware matcher
const middlewarePath = path.join(__dirname, '../src/middleware.ts');
const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
const matcherMatch = middlewareContent.match(/\/\(([a-z|]+)\)\/:\path\*/);

if (matcherMatch) {
  const matcherLocales = matcherMatch[1].split('|');
  console.log('🔧 MIDDLEWARE MATCHER LOCALES:');
  console.log(matcherLocales.join(', '));
  console.log(`Total: ${matcherLocales.length}\n`);
  
  const missingFromMatcher = configuredLocales.filter(locale => !matcherLocales.includes(locale));
  const extraInMatcher = matcherLocales.filter(locale => !configuredLocales.includes(locale));
  
  if (missingFromMatcher.length > 0) {
    console.log('❌ LOCALES MISSING FROM MIDDLEWARE MATCHER:');
    missingFromMatcher.forEach(locale => {
      console.log(`  - ${locale}`);
    });
    console.log();
  }
  
  if (extraInMatcher.length > 0) {
    console.log('⚠️  EXTRA LOCALES IN MIDDLEWARE MATCHER:');
    extraInMatcher.forEach(locale => {
      console.log(`  - ${locale}`);
    });
    console.log();
  }
}

// Countries with invalid language mappings
console.log('🚨 COUNTRIES WITH INVALID LANGUAGE MAPPINGS:');
const invalidCountries = Object.entries(countryLanguageMap)
  .filter(([_, data]) => !data.valid);

if (invalidCountries.length > 0) {
  invalidCountries.forEach(([code, data]) => {
    console.log(`  - ${code} (${data.name}): language='${data.language}' ❌`);
  });
  console.log(`\nTotal: ${invalidCountries.length} countries affected\n`);
} else {
  console.log('  ✅ All countries have valid language mappings\n');
}

// Summary
console.log('=' .repeat(60));
console.log('📊 SUMMARY');
console.log('=' .repeat(60));
console.log(`Configured Locales: ${configuredLocales.length}`);
console.log(`Translation Files: ${translationFiles.length}`);
console.log(`Languages Used in Countries: ${usedLanguages.size}`);
console.log(`Invalid Languages: ${invalidLanguages.length}`);
console.log(`Missing Translation Files: ${missingTranslations.length}`);
console.log(`Extra Translation Files: ${extraTranslations.length}`);
console.log(`Countries with Invalid Mappings: ${invalidCountries.length}`);
console.log('=' .repeat(60));

// Exit with error if issues found
if (invalidLanguages.length > 0 || missingTranslations.length > 0 || invalidCountries.length > 0) {
  console.log('\n❌ AUDIT FAILED: Issues found that need remediation');
  process.exit(1);
} else {
  console.log('\n✅ AUDIT PASSED: All country-locale mappings are valid');
  process.exit(0);
}
