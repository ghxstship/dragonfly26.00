#!/usr/bin/env node

/**
 * Apply Generational Marketing Hook to Section
 * 
 * Helper script to update a marketing section to use the generational language system.
 * 
 * Usage: node scripts/apply-generational-to-section.js <section-name>
 * Example: node scripts/apply-generational-to-section.js ProblemSection
 */

const fs = require('fs');
const path = require('path');

const sectionName = process.argv[2];

if (!sectionName) {
  console.error('❌ Error: Please provide a section name');
  console.log('\nUsage: node scripts/apply-generational-to-section.js <section-name>');
  console.log('Example: node scripts/apply-generational-to-section.js ProblemSection');
  process.exit(1);
}

const SECTIONS_DIR = path.join(__dirname, '../src/marketing/components/sections');
const sectionFile = path.join(SECTIONS_DIR, `${sectionName}.tsx`);

if (!fs.existsSync(sectionFile)) {
  console.error(`❌ Error: Section file not found: ${sectionFile}`);
  console.log('\nAvailable sections:');
  const files = fs.readdirSync(SECTIONS_DIR);
  files.forEach(file => {
    if (file.endsWith('.tsx')) {
      console.log(`  - ${file.replace('.tsx', '')}`);
    }
  });
  process.exit(1);
}

console.log(`🎯 Updating ${sectionName} to use generational marketing...\n`);

try {
  let content = fs.readFileSync(sectionFile, 'utf8');
  let modified = false;

  // Step 1: Check if already using generational marketing
  if (content.includes('useGenerationalMarketing')) {
    console.log('✅ Section already uses generational marketing hook');
    process.exit(0);
  }

  // Step 2: Replace useTranslations import
  if (content.includes("import { useTranslations } from 'next-intl'")) {
    content = content.replace(
      "import { useTranslations } from 'next-intl'",
      "import { useGenerationalMarketing } from '@/hooks/use-generational-marketing'"
    );
    modified = true;
    console.log('✅ Updated import statement');
  } else if (content.includes('import { useTranslations } from "next-intl"')) {
    content = content.replace(
      'import { useTranslations } from "next-intl"',
      "import { useGenerationalMarketing } from '@/hooks/use-generational-marketing'"
    );
    modified = true;
    console.log('✅ Updated import statement');
  }

  // Step 3: Replace hook usage
  const hookPattern = /const t = useTranslations\(['"]marketing\.(\w+)['"]\)/;
  const match = content.match(hookPattern);
  
  if (match) {
    const sectionKey = match[1];
    content = content.replace(
      hookPattern,
      'const { tGen } = useGenerationalMarketing()'
    );
    modified = true;
    console.log(`✅ Updated hook usage (section: ${sectionKey})`);

    // Step 4: Replace t() calls with tGen()
    const tCallPattern = new RegExp(`t\\((['"\`])([^'"]+)\\1\\)`, 'g');
    const matches = [...content.matchAll(tCallPattern)];
    
    if (matches.length > 0) {
      content = content.replace(tCallPattern, (match, quote, key) => {
        return `tGen(${quote}${sectionKey}.${key}${quote})`;
      });
      console.log(`✅ Updated ${matches.length} translation calls`);
      modified = true;
    }
  }

  if (modified) {
    // Write back to file
    fs.writeFileSync(sectionFile, content, 'utf8');
    console.log(`\n✅ Successfully updated ${sectionName}`);
    console.log('\nNext steps:');
    console.log('1. Verify the section still works correctly');
    console.log('2. Add generational variants to en.json if not already present');
    console.log('3. Test all generational variants');
  } else {
    console.log('⚠️  No changes made - section may already be updated or use a different pattern');
  }

} catch (error) {
  console.error('❌ Error updating section:', error.message);
  process.exit(1);
}
