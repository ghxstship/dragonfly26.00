#!/usr/bin/env node

/**
 * Add Marketing i18n to All Languages
 * 
 * This script extracts the marketing section from en.json and adds it to all
 * other language files (19 languages) to achieve full ecosystem internationalization.
 * 
 * Languages: zh, hi, es, fr, ar, bn, ru, pt, id, ur, de, ja, sw, mr, te, tr, ta, vi, ko
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages');

// All locales from config.ts
const locales = [
  'zh', // Mandarin Chinese
  'hi', // Hindi
  'es', // Spanish
  'fr', // French
  'ar', // Arabic
  'bn', // Bengali
  'ru', // Russian
  'pt', // Portuguese
  'id', // Indonesian
  'ur', // Urdu
  'de', // German
  'ja', // Japanese
  'sw', // Swahili
  'mr', // Marathi
  'te', // Telugu
  'tr', // Turkish
  'ta', // Tamil
  'vi', // Vietnamese
  'ko', // Korean
];

console.log('🌍 Adding Marketing i18n to All Languages\n');

// Step 1: Read the English marketing section
console.log('📖 Reading English marketing section...');
const enPath = path.join(MESSAGES_DIR, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

if (!enData.marketing) {
  console.error('❌ ERROR: No marketing section found in en.json');
  process.exit(1);
}

const marketingSection = enData.marketing;
console.log(`✅ Found marketing section with ${Object.keys(marketingSection).length} top-level keys\n`);

// Step 2: Add marketing section to each language file
let successCount = 0;
let errorCount = 0;

locales.forEach((locale) => {
  try {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    
    // Read existing file
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${locale}.json does not exist, skipping...`);
      errorCount++;
      return;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Check if marketing already exists
    if (data.marketing) {
      console.log(`ℹ️  ${locale}.json already has marketing section, updating...`);
    }
    
    // Add marketing section (will use English as base - to be translated later)
    data.marketing = marketingSection;
    
    // Write back to file with proper formatting
    fs.writeFileSync(
      filePath,
      JSON.stringify(data, null, 2) + '\n',
      'utf8'
    );
    
    console.log(`✅ ${locale}.json - Marketing section added`);
    successCount++;
    
  } catch (error) {
    console.error(`❌ ${locale}.json - Error: ${error.message}`);
    errorCount++;
  }
});

// Step 3: Summary
console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Successfully updated: ${successCount}/${locales.length} files`);
console.log(`❌ Errors: ${errorCount}`);
console.log('\n🎯 NEXT STEPS:');
console.log('1. Marketing section added to all language files (using English as base)');
console.log('2. Professional translation needed for each language');
console.log('3. Consider using translation service or native speakers');
console.log('4. RTL languages (ar, ur) may need layout adjustments');
console.log('\n💡 NOTE: All files currently contain English marketing text.');
console.log('   This provides immediate functionality while translations are prepared.');
console.log('\n✨ Marketing pages are now ready for full internationalization!');
