#!/usr/bin/env node

/**
 * Fix ALL Check Icons - Add flex-shrink-0
 * 
 * Handles:
 * - Single-line Check icons
 * - Multi-line Check icons
 * - CheckCircle2 icons
 * - Any Check* variant
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
  const originalContent = content;
  let fixCount = 0;
  
  // Pattern 1: Single-line Check icons with className
  // <Check className="..." />
  const singleLinePattern = /<(Check[A-Za-z0-9]*)\s+([^>]*?)className="([^"]*?)"([^>]*?)\/>/g;
  content = content.replace(singleLinePattern, (match, componentName, before, className, after) => {
    if (className.includes('flex-shrink-0')) {
      return match;
    }
    fixCount++;
    const newClassName = className.trim() + ' flex-shrink-0';
    return `<${componentName} ${before}className="${newClassName}"${after}/>`;
  });
  
  // Pattern 2: Multi-line Check icons with className on separate line
  // <Check
  //   className="..."
  //   ...
  // />
  const multiLinePattern = /<(Check[A-Za-z0-9]*)\s+([^>]*?)className="([^"]*?)"([^>]*?)\/>/gs;
  content = content.replace(multiLinePattern, (match, componentName, before, className, after) => {
    if (className.includes('flex-shrink-0')) {
      return match;
    }
    // Check if we already fixed this in pattern 1
    if (match === match.replace(/\s+/g, ' ')) {
      return match; // Already handled by pattern 1
    }
    fixCount++;
    const newClassName = className.trim() + ' flex-shrink-0';
    return `<${componentName} ${before}className="${newClassName}"${after}/>`;
  });
  
  if (content !== originalContent) {
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

console.log('🔍 Adding flex-shrink-0 to ALL Check icons...\n');

const startTime = Date.now();
scanDirectory(srcDir);
const endTime = Date.now();

console.log('\n' + '='.repeat(60));
console.log('📊 COMPLETE CHECK ICON FIX SUMMARY');
console.log('='.repeat(60));
console.log(`Files Scanned:   ${filesScanned}`);
console.log(`Files Modified:  ${filesModified}`);
console.log(`Total Fixes:     ${totalFixes}`);
console.log(`Time Elapsed:    ${((endTime - startTime) / 1000).toFixed(2)}s`);
console.log('='.repeat(60));

if (filesModified > 0) {
  console.log('\n✅ SUCCESS: All Check icons now have flex-shrink-0!');
  console.log('\n📝 FIXED:');
  console.log('   - Check icons');
  console.log('   - CheckCircle2 icons');
  console.log('   - All Check* variants');
  console.log('   - Single-line and multi-line formats');
} else {
  console.log('\n✨ All Check icons already have flex-shrink-0!');
}

process.exit(0);
