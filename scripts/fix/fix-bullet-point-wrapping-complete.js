#!/usr/bin/env node

/**
 * Complete Bullet Point Text Wrapping Fix
 * 
 * This script fixes ALL bullet point/checkmark text wrapping issues including:
 * - List items with flex-wrap
 * - Divs/other elements with flex-wrap flex-col md:flex-row
 * - Any element with items-start that has problematic flex patterns
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

// Statistics
let filesScanned = 0;
let filesModified = 0;
let totalFixes = 0;

/**
 * Process a single file
 */
function processFile(filePath) {
  filesScanned++;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fixCount = 0;
  
  // Pattern 1: flex flex-wrap flex-col md:flex-row items-start
  const pattern1 = /className="([^"]*?)flex\s+flex-wrap\s+flex-col\s+md:flex-row\s+([^"]*?)items-start([^"]*)"/g;
  content = content.replace(pattern1, (match, before, middle, after) => {
    fixCount++;
    modified = true;
    // Remove flex-wrap, flex-col, md:flex-row but keep everything else
    const cleaned = `${before}${middle}${after}`.replace(/\s+/g, ' ').trim();
    return `className="flex ${cleaned} items-start"`;
  });
  
  // Pattern 2: flex flex-wrap ... items-start (without flex-col md:flex-row)
  const pattern2 = /className="([^"]*?)flex\s+([^"]*?)flex-wrap\s+([^"]*?)items-start([^"]*)"/g;
  content = content.replace(pattern2, (match, before, middle, after, end) => {
    // Skip if already processed by pattern1
    if (match.includes('flex-col') && match.includes('md:flex-row')) {
      return match;
    }
    fixCount++;
    modified = true;
    // Remove flex-wrap but keep everything else
    const cleaned = `${before}${middle}${after}${end}`.replace(/flex-wrap\s*/g, '').replace(/\s+/g, ' ').trim();
    return `className="flex ${cleaned} items-start"`;
  });
  
  // Pattern 3: flex flex-col md:flex-row items-start (without flex-wrap)
  const pattern3 = /className="([^"]*?)flex\s+flex-col\s+md:flex-row\s+([^"]*?)items-start([^"]*)"/g;
  content = content.replace(pattern3, (match, before, middle, after) => {
    // Skip if it has flex-wrap (already handled)
    if (match.includes('flex-wrap')) {
      return match;
    }
    fixCount++;
    modified = true;
    // Remove flex-col md:flex-row but keep everything else
    const cleaned = `${before}${middle}${after}`.replace(/\s+/g, ' ').trim();
    return `className="flex ${cleaned} items-start"`;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
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

/**
 * Main execution
 */
console.log('🔍 Scanning for ALL bullet point wrapping issues...\n');

const startTime = Date.now();
scanDirectory(srcDir);
const endTime = Date.now();

console.log('\n' + '='.repeat(60));
console.log('📊 COMPLETE BULLET POINT WRAPPING FIX SUMMARY');
console.log('='.repeat(60));
console.log(`Files Scanned:   ${filesScanned}`);
console.log(`Files Modified:  ${filesModified}`);
console.log(`Total Fixes:     ${totalFixes}`);
console.log(`Time Elapsed:    ${((endTime - startTime) / 1000).toFixed(2)}s`);
console.log('='.repeat(60));

if (filesModified > 0) {
  console.log('\n✅ SUCCESS: All remaining bullet point wrapping issues fixed!');
  console.log('\n📝 PATTERNS FIXED:');
  console.log('   1. flex flex-wrap flex-col md:flex-row items-start');
  console.log('   2. flex flex-wrap ... items-start');
  console.log('   3. flex flex-col md:flex-row items-start');
  console.log('\n🎯 RESULT:');
  console.log('   - All elements now use: flex items-start');
  console.log('   - Text wraps properly on all breakpoints');
  console.log('   - Icons stay aligned with text');
} else {
  console.log('\n✨ No additional issues found!');
}

process.exit(0);
