#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const pattern = path.join(__dirname, '../src/components/**/*-tab.tsx');
const files = glob.sync(pattern);

let totalFixed = 0;

console.log('🔧 Fixing orphaned closing tags\n');

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Fix pattern 1: Orphaned </div></main> after loading return
  content = content.replace(
    /(<\/div>\s*<\/div>\s*)\s+<\/div>\s+<\/main>\s+(\)[\s]*\})/g,
    '$1$2'
  );
  
  // Fix pattern 2: Orphaned </main> after loading div
  content = content.replace(
    /(<div className="text-muted-foreground">.*?<\/div>\s*<\/div>\s*)\s+<\/div>\s+<\/main>\s+(\)[\s]*\})/gs,
    '$1$2'
  );
  
  // Fix pattern 3: Just orphaned </main>
  content = content.replace(
    /(return\s*\(\s*<div[^>]*>\s*<div[^>]*>.*?<\/div>\s*<\/div>\s*)\s+<\/main>\s+(\)[\s]*\})/gs,
    '$1$2'
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFixed++;
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    console.log(`✅ Fixed: ${relativePath}`);
  }
});

console.log(`\n✨ Fixed ${totalFixed} files with orphaned tags`);
