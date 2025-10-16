#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const pattern = path.join(__dirname, '../src/components/**/*-tab.tsx');
const files = glob.sync(pattern);

let totalFixed = 0;

console.log('🔧 Comprehensive ARIA Fix\n');

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fileChanges = 0;
  
  // Fix duplicate aria-hidden attributes
  const duplicatePattern = /aria-hidden="true"\s+aria-hidden="true"/g;
  if (duplicatePattern.test(content)) {
    content = content.replace(duplicatePattern, 'aria-hidden="true"');
    fileChanges++;
  }
  
  // Fix patterns with extra text like: aria-hidden="true" text-green-600" />
  content = content.replace(/aria-hidden="true"\s+(\w+-[\w-]+)"\s*\/>/g, 'aria-hidden="true" className="$1" />');
  
  // Fix patterns like: aria-hidden="true" mr-2" />
  content = content.replace(/aria-hidden="true"\s+([\w-]+)"\s*\/>/g, 'aria-hidden="true" className="$1" />');
  
  // Fix malformed className patterns
  content = content.replace(/className="([^"]*?)"\s+aria-hidden="true"\s+([\w-]+)"\s*\/>/g, 'className="$1 $2" aria-hidden="true" />');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFixed++;
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    console.log(`✅ Fixed: ${relativePath}`);
  }
});

console.log(`\n✨ Fixed ${totalFixed} files`);
