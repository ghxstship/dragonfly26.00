#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// All Production Hub directories
const modules = [
  'dashboard',
  'projects',
  'events',
  'people',
  'assets',
  'locations',
  'files'
];

const componentsDir = path.join(__dirname, '../src/components');
let totalFixed = 0;
let filesModified = 0;

console.log('🔧 Production Hub ARIA Attribute Fix\n');

modules.forEach(module => {
  const moduleDir = path.join(componentsDir, module);
  
  if (!fs.existsSync(moduleDir)) {
    console.log(`⚠️  Skipping ${module} - directory not found`);
    return;
  }
  
  const files = fs.readdirSync(moduleDir).filter(f => f.endsWith('-tab.tsx'));
  
  files.forEach(file => {
    const filePath = path.join(moduleDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileFixCount = 0;
    
    // Fix all malformed aria-hidden attributes with double quotes
    const ariaHiddenPattern = /aria-hidden="true""/g;
    const matches = content.match(ariaHiddenPattern);
    if (matches) {
      fileFixCount += matches.length;
      content = content.replace(ariaHiddenPattern, 'aria-hidden="true"');
    }
    
    // Fix malformed className patterns with aria-hidden
    const classNameAriaPattern = /aria-hidden="true""\s+aria-hidden="true"/g;
    if (classNameAriaPattern.test(content)) {
      content = content.replace(classNameAriaPattern, 'aria-hidden="true"');
      fileFixCount++;
    }
    
    // Fix patterns like: className="..." aria-hidden="true"" />
    const trailingDoubleQuote = /(\s+aria-hidden="true")"/g;
    content = content.replace(trailingDoubleQuote, '$1');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesModified++;
      totalFixed += fileFixCount;
      console.log(`✅ ${module}/${file} - Fixed ${fileFixCount} ARIA attributes`);
    }
  });
});

console.log(`\n✨ Complete! Fixed ${totalFixed} malformed ARIA attributes in ${filesModified} files.`);
