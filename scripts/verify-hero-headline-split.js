#!/usr/bin/env node

/**
 * Verify hero headline split implementation across all languages
 */

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../src/i18n/messages');

const languageFiles = [
  'ar.json', 'bn.json', 'de.json', 'en.json', 'es.json', 'fr.json',
  'hi.json', 'id.json', 'ja.json', 'ko.json', 'mr.json', 'pt.json',
  'ru.json', 'sw.json', 'ta.json', 'te.json', 'tr.json', 'ur.json',
  'vi.json', 'zh.json'
];

const generationalVariants = ['baby-boomer', 'gen-x', 'millennial', 'gen-z', 'gen-alpha'];

console.log('🔍 Verifying hero headline split implementation...\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

languageFiles.forEach(filename => {
  const filepath = path.join(messagesDir, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`⏭️  Skipping ${filename} (not found)`);
    return;
  }

  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(content);
    
    const lang = filename.replace('.json', '');
    console.log(`\n📝 ${lang.toUpperCase()}`);
    
    // Check main marketing.hero
    totalChecks++;
    if (data.marketing?.hero?.headlineHighlightPrefix !== undefined && 
        data.marketing?.hero?.headlineHighlightMain !== undefined) {
      console.log(`  ✅ marketing.hero: "${data.marketing.hero.headlineHighlightPrefix}" + "${data.marketing.hero.headlineHighlightMain}"`);
      passedChecks++;
    } else {
      console.log(`  ❌ marketing.hero: Missing split keys`);
      failedChecks++;
    }
    
    // Check generational variants
    generationalVariants.forEach(variant => {
      totalChecks++;
      const heroPath = data.marketing?.generational?.[variant]?.hero;
      
      if (heroPath?.headlineHighlightPrefix !== undefined && 
          heroPath?.headlineHighlightMain !== undefined) {
        console.log(`  ✅ ${variant}: "${heroPath.headlineHighlightPrefix}" + "${heroPath.headlineHighlightMain}"`);
        passedChecks++;
      } else {
        console.log(`  ❌ ${variant}: Missing split keys`);
        failedChecks++;
      }
    });
    
  } catch (error) {
    console.error(`  ❌ Error reading ${filename}:`, error.message);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`📊 VERIFICATION RESULTS`);
console.log('='.repeat(60));
console.log(`Total checks: ${totalChecks}`);
console.log(`✅ Passed: ${passedChecks} (${((passedChecks/totalChecks)*100).toFixed(1)}%)`);
console.log(`❌ Failed: ${failedChecks} (${((failedChecks/totalChecks)*100).toFixed(1)}%)`);
console.log('='.repeat(60));

if (failedChecks === 0) {
  console.log('\n🎉 ALL CHECKS PASSED! Implementation is complete.\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Please review the output above.\n');
  process.exit(1);
}
