#!/usr/bin/env node

/**
 * Split hero headline highlight into two parts:
 * - headlineHighlightPrefix: "FOR" (will be black)
 * - headlineHighlightMain: "EXPERIENTIAL TEAMS" (will be colored)
 * 
 * This applies to all translations and generational variants
 */

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../src/i18n/messages');

// Language files to process (excluding en/business.json)
const languageFiles = [
  'ar.json', 'bn.json', 'de.json', 'en.json', 'es.json', 'fr.json',
  'hi.json', 'id.json', 'ja.json', 'ko.json', 'mr.json', 'pt.json',
  'ru.json', 'sw.json', 'ta.json', 'te.json', 'tr.json', 'ur.json',
  'vi.json', 'zh.json'
];

function splitHeadlineHighlight(text) {
  // Common patterns to split on (case-insensitive)
  const patterns = [
    /^(for)\s+(.+)$/i,           // English: "For Experiential Teams"
    /^(para)\s+(.+)$/i,          // Spanish/Portuguese: "Para Equipos Experienciales"
    /^(pour)\s+(.+)$/i,          // French: "Pour Équipes Expérientielles"
    /^(für)\s+(.+)$/i,           // German: "Für Erlebnisteams"
    /^(के लिए)\s+(.+)$/i,       // Hindi
    /^(untuk)\s+(.+)$/i,         // Indonesian
    /^(のための)\s*(.+)$/i,      // Japanese
    /^(위한)\s+(.+)$/i,          // Korean
    /^(для)\s+(.+)$/i,           // Russian
    /^(kwa)\s+(.+)$/i,           // Swahili
    /^(için)\s+(.+)$/i,          // Turkish
    /^(کے لیے)\s+(.+)$/i,       // Urdu
    /^(cho)\s+(.+)$/i,           // Vietnamese
    /^(为)\s*(.+)$/i,            // Chinese (simplified)
    /^(用於)\s*(.+)$/i,          // Chinese (traditional)
    /^(साठी)\s+(.+)$/i,         // Marathi
    /^(కోసం)\s+(.+)$/i,         // Telugu
    /^(জন্য)\s+(.+)$/i,         // Bengali
    /^(க்காக)\s+(.+)$/i,        // Tamil
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        prefix: match[1],
        main: match[2]
      };
    }
  }

  // If no pattern matches, return original as main with empty prefix
  console.warn(`  ⚠️  Could not split: "${text}"`);
  return {
    prefix: '',
    main: text
  };
}

function processHeroSection(hero) {
  if (!hero || !hero.headlineHighlight) {
    return hero;
  }

  const split = splitHeadlineHighlight(hero.headlineHighlight);
  
  return {
    ...hero,
    headlineHighlightPrefix: split.prefix,
    headlineHighlightMain: split.main,
    // Keep original for backward compatibility
    headlineHighlight: hero.headlineHighlight
  };
}

function processTranslations(data) {
  let modified = false;

  // Process main marketing.hero
  if (data.marketing && data.marketing.hero) {
    const originalHighlight = data.marketing.hero.headlineHighlight;
    data.marketing.hero = processHeroSection(data.marketing.hero);
    if (data.marketing.hero.headlineHighlightPrefix) {
      console.log(`  ✓ marketing.hero: "${originalHighlight}" → "${data.marketing.hero.headlineHighlightPrefix}" + "${data.marketing.hero.headlineHighlightMain}"`);
      modified = true;
    }
  }

  // Process generational variants
  const generationalVariants = ['baby-boomer', 'gen-x', 'millennial', 'gen-z', 'gen-alpha'];
  
  if (data.marketing && data.marketing.generational) {
    generationalVariants.forEach(variant => {
      if (data.marketing.generational[variant] && data.marketing.generational[variant].hero) {
        const originalHighlight = data.marketing.generational[variant].hero.headlineHighlight;
        data.marketing.generational[variant].hero = processHeroSection(data.marketing.generational[variant].hero);
        if (data.marketing.generational[variant].hero.headlineHighlightPrefix) {
          console.log(`  ✓ marketing.generational.${variant}.hero: "${originalHighlight}" → "${data.marketing.generational[variant].hero.headlineHighlightPrefix}" + "${data.marketing.generational[variant].hero.headlineHighlightMain}"`);
          modified = true;
        }
      }
    });
  }

  // Also check marketingGenerational (alternate structure)
  if (data.marketingGenerational) {
    generationalVariants.forEach(variant => {
      if (data.marketingGenerational[variant] && data.marketingGenerational[variant].hero) {
        const originalHighlight = data.marketingGenerational[variant].hero.headlineHighlight;
        data.marketingGenerational[variant].hero = processHeroSection(data.marketingGenerational[variant].hero);
        if (data.marketingGenerational[variant].hero.headlineHighlightPrefix) {
          console.log(`  ✓ marketingGenerational.${variant}.hero: "${originalHighlight}" → "${data.marketingGenerational[variant].hero.headlineHighlightPrefix}" + "${data.marketingGenerational[variant].hero.headlineHighlightMain}"`);
          modified = true;
        }
      }
    });
  }

  return { data, modified };
}

// Main execution
console.log('🎨 Splitting hero headline highlights across all translations...\n');

let totalFiles = 0;
let modifiedFiles = 0;
let totalSplits = 0;

languageFiles.forEach(filename => {
  const filepath = path.join(messagesDir, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`⏭️  Skipping ${filename} (not found)`);
    return;
  }

  console.log(`📝 Processing ${filename}...`);
  totalFiles++;

  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(content);
    
    const result = processTranslations(data);
    
    if (result.modified) {
      fs.writeFileSync(filepath, JSON.stringify(result.data, null, 2) + '\n', 'utf8');
      modifiedFiles++;
      console.log(`  ✅ Updated ${filename}\n`);
    } else {
      console.log(`  ⏭️  No changes needed\n`);
    }
  } catch (error) {
    console.error(`  ❌ Error processing ${filename}:`, error.message);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Complete!`);
console.log(`   Files processed: ${totalFiles}`);
console.log(`   Files modified: ${modifiedFiles}`);
console.log('='.repeat(60));
