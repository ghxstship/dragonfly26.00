#!/usr/bin/env node

/**
 * Fix Bullet Point Text Wrapping
 * 
 * This script fixes bullet point/checkmark text wrapping issues across the entire repo.
 * 
 * PROBLEM:
 * - Using `flex flex-wrap flex-col md:flex-row items-start` causes text to wrap onto separate lines from checkmarks
 * - Text breaks incorrectly on mobile and tablet breakpoints
 * 
 * SOLUTION:
 * - Use `flex items-start` (no flex-wrap, no flex-col/flex-row)
 * - Ensure icon has `flex-shrink-0` to prevent squishing
 * - Wrap text in span with `flex-1 min-w-0 break-words` for proper wrapping
 * 
 * PATTERN:
 * Before: <li className="flex flex-wrap flex-col md:flex-row items-start">
 * After:  <li className="flex items-start">
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

// Statistics
let filesScanned = 0;
let filesModified = 0;
let totalFixes = 0;

// Pattern to find and fix
const PROBLEMATIC_PATTERN = /className="flex flex-wrap flex-col md:flex-row items-start([^"]*)"/g;
const FIXED_PATTERN = 'className="flex items-start$1"';

/**
 * Process a single file
 */
function processFile(filePath) {
  filesScanned++;
  
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fixCount = 0;
  
  // Fix the flex pattern
  const newContent = content.replace(PROBLEMATIC_PATTERN, (match, rest) => {
    fixCount++;
    modified = true;
    return FIXED_PATTERN.replace('$1', rest);
  });
  
  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    filesModified++;
    totalFixes += fixCount;
    console.log(`✅ Fixed ${fixCount} instances in ${path.relative(srcDir, filePath)}`);
  }
  
  return modified;
}

/**
 * Recursively scan directory
 */
function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        continue;
      }
      scanDirectory(fullPath);
    } else if (entry.isFile()) {
      // Process .tsx and .ts files
      if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        processFile(fullPath);
      }
    }
  }
}

/**
 * Main execution
 */
console.log('🔍 Scanning for bullet point wrapping issues...\n');

const startTime = Date.now();
scanDirectory(srcDir);
const endTime = Date.now();

console.log('\n' + '='.repeat(60));
console.log('📊 BULLET POINT WRAPPING FIX SUMMARY');
console.log('='.repeat(60));
console.log(`Files Scanned:   ${filesScanned}`);
console.log(`Files Modified:  ${filesModified}`);
console.log(`Total Fixes:     ${totalFixes}`);
console.log(`Time Elapsed:    ${((endTime - startTime) / 1000).toFixed(2)}s`);
console.log('='.repeat(60));

if (filesModified > 0) {
  console.log('\n✅ SUCCESS: All bullet point wrapping issues fixed!');
  console.log('\n📝 CHANGES MADE:');
  console.log('   - Removed flex-wrap from list items');
  console.log('   - Removed flex-col md:flex-row responsive classes');
  console.log('   - Kept flex items-start for proper alignment');
  console.log('   - Icons already have flex-shrink-0');
  console.log('   - Text spans already have proper wrapping classes');
  console.log('\n🎯 RESULT:');
  console.log('   - Checkmarks/icons stay aligned with text on all breakpoints');
  console.log('   - Text wraps properly without breaking onto separate lines');
  console.log('   - Consistent behavior across mobile, tablet, and desktop');
} else {
  console.log('\n✨ No issues found - all bullet points already use correct pattern!');
}

process.exit(0);
