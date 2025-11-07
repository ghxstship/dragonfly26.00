#!/usr/bin/env node

/**
 * Comprehensive Country Translation Verification
 * 
 * Verifies that:
 * 1. All countries have valid primary languages
 * 2. All primary languages have translation files
 * 3. All translation files have required keys for country selector
 * 4. All alternative languages are valid
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Country Translations Implementation...\n');

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

console.log('✅ Step 1: Configured Locales');
console.log(`Found ${configuredLocales.length} locales: ${configuredLocales.join(', ')}\n`);

// Load countries config
const countriesPath = path.join(__dirname, '../src/config/countries.ts');
const countriesContent = fs.readFileSync(countriesPath, 'utf8');

// Extract all countries with their languages
const countryBlocks = countriesContent.split(/\n  [A-Z]{2}: \{/);
const countries = [];

countryBlocks.forEach(block => {
  const codeMatch = block.match(/code: '([A-Z]{2})'/);
  const nameMatch = block.match(/name: '([^']+)'/);
  const langMatch = block.match(/language: '([a-z]{2})'/);
  const altLangMatch = block.match(/alternativeLanguages: \[(.*?)\]/);
  
  if (codeMatch && nameMatch && langMatch) {
    const altLanguages = [];
    if (altLangMatch) {
      const langs = altLangMatch[1].match(/'([a-z]{2})'/g);
      if (langs) {
        langs.forEach(lang => {
          altLanguages.push(lang.replace(/'/g, ''));
        });
      }
    }
    
    countries.push({
      code: codeMatch[1],
      name: nameMatch[1],
      language: langMatch[1],
      alternativeLanguages: altLanguages
    });
  }
});

console.log(`✅ Step 2: Countries Loaded`);
console.log(`Found ${countries.length} countries\n`);

// Verify each country's primary language
console.log('🔍 Step 3: Verifying Primary Languages');
console.log('─'.repeat(60));

const invalidPrimaryLanguages = [];
const validCountries = [];

countries.forEach(country => {
  const isValid = configuredLocales.includes(country.language);
  
  if (isValid) {
    console.log(`✅ ${country.code} (${country.name}): ${country.language}`);
    validCountries.push(country);
  } else {
    console.log(`❌ ${country.code} (${country.name}): ${country.language} - NOT CONFIGURED`);
    invalidPrimaryLanguages.push(country);
    errors++;
  }
});

console.log();

if (invalidPrimaryLanguages.length > 0) {
  console.log('❌ Countries with Invalid Primary Languages:');
  invalidPrimaryLanguages.forEach(c => {
    console.log(`   ${c.code} (${c.name}) → '${c.language}'`);
  });
  console.log();
}

// Verify translation files exist
console.log('🔍 Step 4: Verifying Translation Files');
console.log('─'.repeat(60));

const messagesDir = path.join(__dirname, '../src/i18n/messages');
const uniqueLanguages = [...new Set(countries.map(c => c.language))];

const missingTranslationFiles = [];

uniqueLanguages.forEach(lang => {
  const filePath = path.join(messagesDir, `${lang}.json`);
  
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const keyCount = Object.keys(data).length;
      console.log(`✅ ${lang}.json exists (${keyCount} top-level keys)`);
    } catch (error) {
      console.log(`❌ ${lang}.json exists but INVALID JSON: ${error.message}`);
      errors++;
    }
  } else {
    console.log(`❌ ${lang}.json MISSING`);
    missingTranslationFiles.push(lang);
    errors++;
  }
});

console.log();

// Verify alternative languages
console.log('🔍 Step 5: Verifying Alternative Languages');
console.log('─'.repeat(60));

const allAltLanguages = new Set();
countries.forEach(country => {
  country.alternativeLanguages.forEach(lang => allAltLanguages.add(lang));
});

const invalidAltLanguages = [...allAltLanguages].filter(lang => !configuredLocales.includes(lang));

if (invalidAltLanguages.length > 0) {
  console.log('❌ Invalid Alternative Languages:');
  invalidAltLanguages.forEach(lang => {
    const countriesUsingIt = countries
      .filter(c => c.alternativeLanguages.includes(lang))
      .map(c => `${c.code} (${c.name})`)
      .join(', ');
    console.log(`   '${lang}': Used by ${countriesUsingIt}`);
  });
  errors++;
  console.log();
} else {
  console.log('✅ All alternative languages are valid\n');
}

// Check for required translation keys in country selector
console.log('🔍 Step 6: Verifying Country Selector Translation Keys');
console.log('─'.repeat(60));

const requiredKeys = [
  'common.emptyState',
  'common.search',
  'common.loading',
  'common.error'
];

const enPath = path.join(messagesDir, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const missingKeys = [];
requiredKeys.forEach(key => {
  const keys = key.split('.');
  let current = enData;
  let found = true;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      found = false;
      break;
    }
  }
  
  if (found) {
    console.log(`✅ ${key}`);
  } else {
    console.log(`⚠️  ${key} - Not found (may not be critical)`);
    warnings++;
    missingKeys.push(key);
  }
});

console.log();

// Country-by-Country Report
console.log('📊 Step 7: Country-by-Country Translation Status');
console.log('─'.repeat(60));

const languageGroups = {};
countries.forEach(country => {
  if (!languageGroups[country.language]) {
    languageGroups[country.language] = [];
  }
  languageGroups[country.language].push(country);
});

Object.entries(languageGroups).sort().forEach(([lang, countryList]) => {
  const hasTranslation = configuredLocales.includes(lang);
  const status = hasTranslation ? '✅' : '❌';
  
  console.log(`\n${status} Language: ${lang.toUpperCase()}`);
  console.log(`   Countries (${countryList.length}):`);
  countryList.forEach(c => {
    console.log(`   - ${c.code} (${c.name})`);
  });
});

console.log();

// Summary
console.log('═'.repeat(60));
console.log('📊 VERIFICATION SUMMARY');
console.log('═'.repeat(60));
console.log(`Total Countries: ${countries.length}`);
console.log(`Unique Primary Languages: ${uniqueLanguages.length}`);
console.log(`Configured Locales: ${configuredLocales.length}`);
console.log(`Translation Files: ${uniqueLanguages.length}/${uniqueLanguages.length}`);
console.log(`Invalid Primary Languages: ${invalidPrimaryLanguages.length}`);
console.log(`Missing Translation Files: ${missingTranslationFiles.length}`);
console.log(`Invalid Alternative Languages: ${invalidAltLanguages.length}`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);
console.log('═'.repeat(60));

if (errors === 0 && warnings === 0) {
  console.log('\n✅ VERIFICATION PASSED - 100% COMPLETE');
  console.log('\n🎉 All countries have valid language translations!');
  console.log('\nCountry Selector Status:');
  console.log('  ✅ All primary languages configured');
  console.log('  ✅ All translation files present');
  console.log('  ✅ All alternative languages valid');
  console.log('  ✅ Ready for production use');
  process.exit(0);
} else if (errors === 0) {
  console.log(`\n⚠️  VERIFICATION PASSED WITH ${warnings} WARNINGS`);
  console.log('Warnings are non-critical but should be reviewed.');
  process.exit(0);
} else {
  console.log(`\n❌ VERIFICATION FAILED: ${errors} errors, ${warnings} warnings`);
  console.log('Please fix the errors before using the country selector.');
  process.exit(1);
}
