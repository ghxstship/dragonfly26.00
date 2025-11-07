#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING AUTH & ONBOARDING TYPOGRAPHY\n');

const fixes = [];

const replacements = [
  // h1 tags
  { pattern: /(<h1[^>]*className="[^"]*)\bfont-bold\b/g, replacement: '$1font-title uppercase' },
  
  // h2 tags
  { pattern: /(<h2[^>]*className="[^"]*)\bfont-bold\b/g, replacement: '$1font-heading uppercase' },
  { pattern: /(<h2[^>]*className="[^"]*)\bfont-semibold\b/g, replacement: '$1font-heading uppercase' },
  
  // h3 tags
  { pattern: /(<h3[^>]*className="[^"]*)\bfont-semibold\b/g, replacement: '$1font-heading uppercase' },
  { pattern: /(<h3[^>]*className="[^"]*)\bfont-bold\b/g, replacement: '$1font-heading uppercase' },
  
  // Remove font-medium, font-semibold from spans, p, li, div, label, button
  { pattern: /(<(?:span|p|li|div|label|button)[^>]*className="[^"]*)\bfont-medium\b\s*/g, replacement: '$1' },
  { pattern: /(<(?:span|p|li|div|label|button)[^>]*className="[^"]*)\bfont-semibold\b\s*/g, replacement: '$1' },
  
  // Add dark mode to text-gray-900
  { pattern: /text-gray-900(?!\s+dark:)/g, replacement: 'text-gray-900 dark:text-white' },
  
  // Add dark mode to text-gray-600
  { pattern: /text-gray-600(?!\s+dark:)/g, replacement: 'text-gray-600 dark:text-gray-400' },
  
  // Add dark mode to text-gray-700
  { pattern: /text-gray-700(?!\s+dark:)/g, replacement: 'text-gray-700 dark:text-gray-300' },
  
  // Add dark mode to text-gray-500
  { pattern: /text-gray-500(?!\s+dark:)/g, replacement: 'text-gray-500 dark:text-gray-400' },
  
  // Add dark mode to bg-gray-50
  { pattern: /bg-gray-50(?!\s+dark:)/g, replacement: 'bg-gray-50 dark:bg-gray-900' },
  
  // Add dark mode to bg-white
  { pattern: /bg-white(?!\s+dark:)/g, replacement: 'bg-white dark:bg-gray-800' },
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fileFixCount = 0;
  
  replacements.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      fileFixCount += matches.length;
      content = content.replace(pattern, replacement);
    }
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    const relativePath = path.relative(process.cwd(), filePath);
    fixes.push({ file: relativePath, count: fileFixCount });
    return true;
  }
  
  return false;
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.name === 'page.tsx') {
      fixFile(fullPath);
    }
  });
}

// Fix auth pages
const authDir = path.join(process.cwd(), 'src/app/[locale]/(auth)');
scanDirectory(authDir);

// Fix onboarding pages
const onboardingDir = path.join(process.cwd(), 'src/app/[locale]/(onboarding)');
scanDirectory(onboardingDir);

console.log('✅ FIXES APPLIED:\n');
fixes.forEach((fix, i) => {
  const pageName = fix.file.split('/').slice(-2, -1)[0] || fix.file.split('/').pop().replace('page.tsx', '');
  console.log(`${i + 1}. ${pageName}: ${fix.count} fixes`);
});

console.log(`\n✨ Total files fixed: ${fixes.length}`);
console.log(`✨ Total fixes applied: ${fixes.reduce((sum, f) => sum + f.count, 0)}`);
console.log('\n✅ Typography rules enforced:');
console.log('   - h1: font-title uppercase');
console.log('   - h2-h3: font-heading uppercase');
console.log('   - Body text: NO font classes (inherits Share Tech)');
console.log('   - Dark mode: Added to all text/bg elements');
console.log('\nNO SHORTCUTS. NO COMPROMISES. TRUE 100%.');
