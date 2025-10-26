#!/usr/bin/env node

/**
 * Fix Typography Violations
 * 
 * Removes redundant font-weight classes when font-heading or font-title is present
 */

const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, '../src/marketing/components/sections');

const filesToFix = [
  'HowItWorksSection.tsx',
  'ProblemSection.tsx',
  'SecuritySection.tsx',
  'SolutionSection.tsx',
  'TestimonialsSection.tsx',
  'PricingSection.tsx',
  'DetailedPricingSection.tsx'
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  let changes = 0;
  
  // Remove font-semibold when font-heading is present
  const semiboldHeadingPattern = /className="([^"]*?)font-semibold([^"]*?)font-heading([^"]*?)"/g;
  const semiboldHeadingPattern2 = /className="([^"]*?)font-heading([^"]*?)font-semibold([^"]*?)"/g;
  
  content = content.replace(semiboldHeadingPattern, (match, before, middle, after) => {
    changes++;
    return `className="${before}${middle}font-heading${after}"`;
  });
  
  content = content.replace(semiboldHeadingPattern2, (match, before, middle, after) => {
    changes++;
    return `className="${before}font-heading${middle}${after}"`;
  });
  
  // Remove font-bold from step numbers (keep for badges)
  if (fileName === 'HowItWorksSection.tsx') {
    content = content.replace(/rounded-full flex items-center justify-center text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold/g, (match) => {
      changes++;
      return match.replace(' font-bold', '');
    });
  }
  
  // Remove font-semibold from testimonial authors (replace with font-heading uppercase)
  if (fileName === 'TestimonialsSection.tsx') {
    content = content.replace(/className="font-semibold text-gray-900 dark:text-white"/g, (match) => {
      changes++;
      return 'className="font-heading uppercase text-gray-900 dark:text-white"';
    });
  }
  
  // Remove font-semibold from pricing link
  if (fileName === 'PricingSection.tsx') {
    content = content.replace(/className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"/g, (match) => {
      changes++;
      return 'className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"';
    });
  }
  
  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${fileName}: ${changes} fixes applied`);
  } else {
    console.log(`⏭️  ${fileName}: No changes needed`);
  }
  
  return changes;
}

function main() {
  console.log('🔧 Fixing Typography Violations...\n');
  
  let totalChanges = 0;
  
  filesToFix.forEach(fileName => {
    const filePath = path.join(sectionsDir, fileName);
    if (fs.existsSync(filePath)) {
      totalChanges += fixFile(filePath);
    } else {
      console.log(`⚠️  ${fileName}: File not found`);
    }
  });
  
  console.log(`\n📊 Total fixes applied: ${totalChanges}`);
  console.log('\n✨ Typography violations fixed!');
  console.log('Run final-typography-audit.js to verify 100% compliance.');
}

main();
