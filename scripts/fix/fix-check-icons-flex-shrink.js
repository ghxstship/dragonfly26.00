#!/usr/bin/env node

/**
 * Fix Check Icons - Add flex-shrink-0
 * 
 * This script adds flex-shrink-0 to all Check icons to ensure they don't
 * get squished when text wraps, maintaining proper alignment.
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

let filesScanned = 0;
let filesModified = 0;
let totalFixes = 0;

function processFile(filePath) {
  filesScanned++;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fixCount = 0;
  
  // Pattern: <Check ... className="..." /> where className doesn't have flex-shrink-0
  const checkPattern = /<Check\s+([^>]*?)className="([^"]*?)"([^>]*?)\/>/g;
  
  content = content.replace(checkPattern, (match, before, className, after) => {
    // Skip if already has flex-shrink-0
    if (className.includes('flex-shrink-0')) {
      return match;
    }
    
    // Add flex-shrink-0 to className
    fixCount++;
    modified = true;
    const newClassName = className.trim() + ' flex-shrink-0';
    return `<Check ${before}className="${newClassName}"${after}/>`;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesModified++;
    totalFixes += fixCount;
    console.log(`✅ Fixed ${fixCount} Check icons in ${path.relative(srcDir, filePath)}`);
  }
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        continue;
      }
      scanDirectory(fullPath);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        processFile(fullPath);
      }
    }
  }
}

console.log('🔍 Adding flex-shrink-0 to Check icons...\n');

const startTime = Date.now();
scanDirectory(srcDir);
const endTime = Date.now();

console.log('\n' + '='.repeat(60));
console.log('📊 CHECK ICON FIX SUMMARY');
console.log('='.repeat(60));
console.log(`Files Scanned:   ${filesScanned}`);
console.log(`Files Modified:  ${filesModified}`);
console.log(`Total Fixes:     ${totalFixes}`);
console.log(`Time Elapsed:    ${((endTime - startTime) / 1000).toFixed(2)}s`);
console.log('='.repeat(60));

if (filesModified > 0) {
  console.log('\n✅ SUCCESS: All Check icons now have flex-shrink-0!');
  console.log('\n🎯 BENEFIT:');
  console.log('   - Icons maintain consistent size when text wraps');
  console.log('   - Better alignment across all breakpoints');
} else {
  console.log('\n✨ All Check icons already have flex-shrink-0!');
}

process.exit(0);
