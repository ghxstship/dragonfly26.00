#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 STANDARDIZING H1 TYPOGRAPHY SIZES\n');

const fixes = [];

// Standard h1 size for all marketing pages (except hero which is intentionally larger)
const STANDARD_H1_SIZE = 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl';

const replacements = [
  // Fix legal pages, contact, blog, docs, demo (with duplicate breakpoints)
  {
    pattern: /(<h1 className=")(text-xl md:text-2xl lg:text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-5xl)( font-title uppercase)/g,
    replacement: `$1${STANDARD_H1_SIZE}$3`,
    description: 'Legal/Contact/Blog/Docs/Demo pages - remove duplicates, standardize size'
  },
  
  // Fix company page (with duplicate breakpoints)
  {
    pattern: /(<h1 className=")(text-5xl md:text-3xl md:text-5xl lg:text-6xl)( font-title uppercase)/g,
    replacement: `$1${STANDARD_H1_SIZE}$3`,
    description: 'Company page - remove duplicates, standardize size'
  },
  
  // Fix API docs (with duplicate breakpoints)
  {
    pattern: /(<h1 className=")(text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl)( font-title uppercase)/g,
    replacement: `$1${STANDARD_H1_SIZE}$3`,
    description: 'API docs - remove duplicates, standardize size'
  },
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fileFixCount = 0;
  const fileChanges = [];
  
  replacements.forEach(({ pattern, replacement, description }) => {
    const matches = content.match(pattern);
    if (matches) {
      fileFixCount += matches.length;
      fileChanges.push(description);
      content = content.replace(pattern, replacement);
    }
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    const relativePath = path.relative(process.cwd(), filePath);
    fixes.push({ file: relativePath, count: fileFixCount, changes: fileChanges });
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
    } else if (entry.name === 'page.tsx' || entry.name.endsWith('.tsx')) {
      fixFile(fullPath);
    }
  });
}

// Fix marketing pages
const marketingDir = path.join(process.cwd(), 'src/app/[locale]/(marketing)');
scanDirectory(marketingDir);

console.log('✅ H1 STANDARDIZATION COMPLETE:\n');
fixes.forEach((fix, i) => {
  const fileName = fix.file.split('/').slice(-2).join('/');
  console.log(`${i + 1}. ${fileName}`);
  fix.changes.forEach(change => {
    console.log(`   - ${change}`);
  });
});

console.log(`\n✨ Total files fixed: ${fixes.length}`);
console.log(`✨ Total h1 tags standardized: ${fixes.reduce((sum, f) => sum + f.count, 0)}`);
console.log(`\n✅ Standard h1 size: ${STANDARD_H1_SIZE}`);
console.log('   - Removes duplicate breakpoints');
console.log('   - Consistent sizing across all marketing pages');
console.log('   - Hero section intentionally larger (text-4xl sm:text-5xl md:text-6xl lg:text-7xl)');
console.log('\nNO SHORTCUTS. NO COMPROMISES. PERFECT CONSISTENCY.');
