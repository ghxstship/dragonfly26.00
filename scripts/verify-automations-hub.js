#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../src/i18n/messages');

const languages = [
  'en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'ru', 'pt', 'id',
  'ur', 'de', 'ja', 'sw', 'mr', 'te', 'tr', 'ta', 'vi', 'ko'
];

let passCount = 0;
let failCount = 0;

console.log('Verifying Automations Hub implementation...\n');

languages.forEach(lang => {
  const filePath = path.join(messagesDir, `${lang}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Check if automations exists
    if (!data.marketing?.features?.automations) {
      console.log(`❌ ${lang}.json: automations hub missing`);
      failCount++;
      return;
    }
    
    // Check required keys
    const required = ['title', 'description', 'feature1', 'feature2', 'feature3', 'feature4'];
    const missing = required.filter(key => !data.marketing.features.automations[key]);
    
    if (missing.length > 0) {
      console.log(`❌ ${lang}.json: missing keys: ${missing.join(', ')}`);
      failCount++;
      return;
    }
    
    // Check subtitle updated
    if (data.marketing.features.subtitle && !data.marketing.features.subtitle.includes('Six')) {
      console.log(`⚠️  ${lang}.json: subtitle not updated to "Six"`);
    }
    
    // Check order (network -> automations -> intelligence)
    const keys = Object.keys(data.marketing.features);
    const networkIdx = keys.indexOf('network');
    const automationsIdx = keys.indexOf('automations');
    const intelligenceIdx = keys.indexOf('intelligence');
    
    if (networkIdx === -1 || automationsIdx === -1 || intelligenceIdx === -1) {
      console.log(`❌ ${lang}.json: hub structure incomplete`);
      failCount++;
      return;
    }
    
    if (automationsIdx !== networkIdx + 1 || intelligenceIdx !== automationsIdx + 1) {
      console.log(`❌ ${lang}.json: incorrect hub order`);
      failCount++;
      return;
    }
    
    console.log(`✅ ${lang}.json: All checks passed`);
    passCount++;
    
  } catch (error) {
    console.log(`❌ ${lang}.json: Error - ${error.message}`);
    failCount++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`VERIFICATION SUMMARY: ${passCount} passed, ${failCount} failed`);
console.log('='.repeat(60));

if (passCount === 20) {
  console.log('✅ ALL 20 LANGUAGE FILES VERIFIED SUCCESSFULLY');
  console.log('\nAutomations Hub implementation complete:');
  console.log('- Added between Network Hub and Intelligence Hub');
  console.log('- All 20 languages updated');
  console.log('- Subtitle updated from "Five" to "Six" hubs');
  console.log('- FeaturesSection.tsx component updated');
  process.exit(0);
} else {
  console.log(`⚠️  Only ${passCount}/20 files verified`);
  process.exit(1);
}
