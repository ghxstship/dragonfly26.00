#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Language codes for all 20 supported languages
const languages = [
  'en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'ru', 'pt', 'id',
  'ur', 'de', 'ja', 'sw', 'mr', 'te', 'tr', 'ta', 'vi', 'ko'
];

// Paths to update
const marketingI18nPath = path.join(__dirname, '../src/marketing/i18n/messages');
const mainI18nPath = path.join(__dirname, '../src/i18n/messages');

let totalUpdates = 0;
let errors = 0;

console.log('🔄 Updating "About" to "Company" in all language files...\n');

// Update marketing i18n files
console.log('📁 Updating marketing i18n files...');
languages.forEach(lang => {
  const filePath = path.join(marketingI18nPath, `${lang}.json`);
  
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let updated = false;
      
      // Update nav.about to nav.company
      if (content.includes('"about": "About"')) {
        content = content.replace('"about": "About"', '"company": "Company"');
        updated = true;
      }
      
      // Update footer.about to footer.company
      if (content.includes('"about": "About Us"') || content.includes('"about": "About"')) {
        content = content.replace(/"about": "About Us?"/g, '"company": "Company"');
        updated = true;
      }
      
      // Update the "about" section to "company"
      if (content.includes('"about": {')) {
        content = content.replace('"about": {', '"company": {');
        updated = true;
      }
      
      // Update metadata keys
      if (content.includes('"aboutTitle"')) {
        content = content.replace('"aboutTitle"', '"companyTitle"');
        updated = true;
      }
      if (content.includes('"aboutDescription"')) {
        content = content.replace('"aboutDescription"', '"companyDescription"');
        updated = true;
      }
      
      if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ Updated ${lang}.json (marketing)`);
        totalUpdates++;
      }
    }
  } catch (error) {
    console.error(`  ❌ Error updating ${lang}.json (marketing):`, error.message);
    errors++;
  }
});

// Update main i18n files
console.log('\n📁 Updating main i18n files...');
languages.forEach(lang => {
  const filePath = path.join(mainI18nPath, `${lang}.json`);
  
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let updated = false;
      
      // Check if this file has the marketing section
      if (content.includes('"marketing"')) {
        // Update nav.about to nav.company
        if (content.includes('"about": "About"')) {
          content = content.replace(/"about": "About"/g, '"company": "Company"');
          updated = true;
        }
        
        // Update footer.about to footer.company
        if (content.includes('"about": "About Us"')) {
          content = content.replace('"about": "About Us"', '"company": "Company"');
          updated = true;
        }
        
        // Update the "about" section to "company"
        const aboutSectionRegex = /"about":\s*{[^}]*"title":\s*"About[^"]*"/g;
        if (aboutSectionRegex.test(content)) {
          content = content.replace(/"about":\s*{/g, '"company": {');
          updated = true;
        }
        
        // Update metadata keys
        if (content.includes('"aboutTitle"')) {
          content = content.replace('"aboutTitle"', '"companyTitle"');
          updated = true;
        }
        if (content.includes('"aboutDescription"')) {
          content = content.replace('"aboutDescription"', '"companyDescription"');
          updated = true;
        }
        
        if (updated) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`  ✅ Updated ${lang}.json (main)`);
          totalUpdates++;
        }
      }
    }
  } catch (error) {
    console.error(`  ❌ Error updating ${lang}.json (main):`, error.message);
    errors++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✨ Update complete!`);
console.log(`   Files updated: ${totalUpdates}`);
console.log(`   Errors: ${errors}`);
console.log('='.repeat(60));

if (errors === 0) {
  console.log('\n✅ All language files successfully updated!');
  console.log('   "About" has been changed to "Company" across all 20 languages.');
} else {
  console.log('\n⚠️  Some errors occurred. Please review the output above.');
  process.exit(1);
}
