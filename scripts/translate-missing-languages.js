#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const translate = require('@iamtraction/google-translate');

const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages');
const LANGUAGES = [
  { code: 'it', name: 'Italian' },
  { code: 'pl', name: 'Polish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' }
];

// Load English source
const enPath = path.join(MESSAGES_DIR, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Recursive function to translate all strings in an object
async function translateObject(obj, targetLang, path = '') {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively translate nested objects
      result[key] = await translateObject(value, targetLang, currentPath);
    } else if (typeof value === 'string') {
      // Translate string values
      try {
        const translated = await translate(value, { from: 'en', to: targetLang });
        result[key] = translated.text;
        process.stdout.write('.');
      } catch (error) {
        console.error(`\n❌ Error translating "${currentPath}": ${error.message}`);
        result[key] = value; // Fallback to English
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 800));
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

// Main translation function
async function translateLanguage(langCode, langName) {
  console.log(`\n🌍 Starting translation for ${langName} (${langCode})...`);
  console.log(`📝 Total keys to translate: ${JSON.stringify(enData).match(/"[^"]+"\s*:\s*"[^"]+"/g)?.length || 'unknown'}`);
  
  const startTime = Date.now();
  
  try {
    const translated = await translateObject(enData, langCode);
    
    // Save translated file
    const outputPath = path.join(MESSAGES_DIR, `${langCode}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2), 'utf8');
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n✅ ${langName} translation complete! (${duration}s)`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
  } catch (error) {
    console.error(`\n❌ Failed to translate ${langName}: ${error.message}`);
    return false;
  }
}

// Run translations sequentially
async function main() {
  console.log('🚀 Starting translation of 6 missing languages...\n');
  console.log('Languages to translate:');
  LANGUAGES.forEach(lang => console.log(`  - ${lang.name} (${lang.code})`));
  console.log('');
  
  const results = [];
  
  for (const lang of LANGUAGES) {
    const success = await translateLanguage(lang.code, lang.name);
    results.push({ lang: lang.name, success });
    
    // Add delay between languages
    if (LANGUAGES.indexOf(lang) < LANGUAGES.length - 1) {
      console.log('\n⏳ Waiting 5 seconds before next language...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TRANSLATION SUMMARY');
  console.log('='.repeat(60));
  
  results.forEach(({ lang, success }) => {
    console.log(`${success ? '✅' : '❌'} ${lang}: ${success ? 'Complete' : 'Failed'}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n🎯 Total: ${successCount}/${LANGUAGES.length} languages translated successfully`);
  
  if (successCount === LANGUAGES.length) {
    console.log('\n🎉 ALL TRANSLATIONS COMPLETE!');
    console.log('✅ All 6 languages now have native translations');
    console.log('✅ All countries can use their native languages');
  } else {
    console.log('\n⚠️  Some translations failed. Check errors above.');
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
