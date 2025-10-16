#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing duplicate className props...\n');

const tabFiles = glob.sync('src/components/**/*-tab.tsx', { cwd: process.cwd() });

let totalFixed = 0;

tabFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Fix pattern: <Icon className="h-4 w-4" className="..." />
  // Should be: <Icon className="h-4 w-4 ..." />
  content = content.replace(
    /(<\w+[^>]*className="[^"]+")(\s+className="([^"]+)")/g,
    (match, first, second, secondClass) => {
      // Extract first className value
      const firstMatch = first.match(/className="([^"]+)"/);
      if (firstMatch) {
        const firstClass = firstMatch[1];
        const combined = `${firstClass} ${secondClass}`.trim();
        return first.replace(/className="[^"]+"/, `className="${combined}"`);
      }
      return match;
    }
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file}`);
    totalFixed++;
  }
});

console.log(`\n✅ Fixed ${totalFixed} files with duplicate className props`);
