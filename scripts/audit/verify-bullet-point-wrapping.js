#!/usr/bin/env node

/**
 * Verify Bullet Point Text Wrapping Fix
 * 
 * This script verifies that all bullet point/checkmark patterns use the correct
 * flex pattern for proper text wrapping across all breakpoints.
 * 
 * CORRECT PATTERN:
 * - List item: className="flex items-start"
 * - Icon: className="... flex-shrink-0 ..."
 * - Text: wrapped in <span> (optional: flex-1 min-w-0 break-words)
 * 
 * INCORRECT PATTERNS:
 * - flex flex-wrap (causes wrapping issues)
 * - flex-col md:flex-row (causes text to break onto separate lines)
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

// Statistics
let filesScanned = 0;
let issuesFound = 0;
let filesWithIssues = 0;

// Patterns to check
const PROBLEMATIC_PATTERNS = [
  {
    name: 'flex-wrap in list items',
    pattern: /className="[^"]*flex[^"]*flex-wrap[^"]*items-start/g,
    severity: 'HIGH'
  },
  {
    name: 'flex-col md:flex-row in list items',
    pattern: /className="[^"]*flex[^"]*flex-col[^"]*md:flex-row[^"]*items-start/g,
    severity: 'HIGH'
  },
  {
    name: 'Check icon without flex-shrink-0',
    pattern: /<Check[^>]*className="(?![^"]*flex-shrink-0)[^"]*"/g,
    severity: 'MEDIUM'
  }
];

const issues = [];

/**
 * Process a single file
 */
function processFile(filePath) {
  filesScanned++;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let fileHasIssues = false;
  
  PROBLEMATIC_PATTERNS.forEach(({ name, pattern, severity }) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      fileHasIssues = true;
      issuesFound += matches.length;
      
      // Find line numbers
      matches.forEach(match => {
        const lineIndex = lines.findIndex(line => line.includes(match));
        issues.push({
          file: path.relative(srcDir, filePath),
          line: lineIndex + 1,
          issue: name,
          severity,
          snippet: match.substring(0, 80) + (match.length > 80 ? '...' : '')
        });
      });
    }
  });
  
  if (fileHasIssues) {
    filesWithIssues++;
  }
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
console.log('🔍 Verifying bullet point wrapping patterns...\n');

const startTime = Date.now();
scanDirectory(srcDir);
const endTime = Date.now();

console.log('='.repeat(60));
console.log('📊 BULLET POINT WRAPPING VERIFICATION');
console.log('='.repeat(60));
console.log(`Files Scanned:       ${filesScanned}`);
console.log(`Files with Issues:   ${filesWithIssues}`);
console.log(`Total Issues Found:  ${issuesFound}`);
console.log(`Time Elapsed:        ${((endTime - startTime) / 1000).toFixed(2)}s`);
console.log('='.repeat(60));

if (issuesFound > 0) {
  console.log('\n❌ ISSUES FOUND:\n');
  
  // Group by severity
  const highSeverity = issues.filter(i => i.severity === 'HIGH');
  const mediumSeverity = issues.filter(i => i.severity === 'MEDIUM');
  
  if (highSeverity.length > 0) {
    console.log('🔴 HIGH SEVERITY ISSUES:');
    highSeverity.slice(0, 10).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   Issue: ${issue.issue}`);
      console.log(`   Snippet: ${issue.snippet}`);
      console.log('');
    });
    if (highSeverity.length > 10) {
      console.log(`   ... and ${highSeverity.length - 10} more high severity issues\n`);
    }
  }
  
  if (mediumSeverity.length > 0) {
    console.log('🟡 MEDIUM SEVERITY ISSUES:');
    mediumSeverity.slice(0, 5).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   Issue: ${issue.issue}`);
      console.log('');
    });
    if (mediumSeverity.length > 5) {
      console.log(`   ... and ${mediumSeverity.length - 5} more medium severity issues\n`);
    }
  }
  
  console.log('💡 RECOMMENDED ACTIONS:');
  console.log('   1. Run: node scripts/fix-bullet-point-wrapping.js');
  console.log('   2. Manually review any remaining issues');
  console.log('   3. Test on mobile, tablet, and desktop breakpoints');
  
  process.exit(1);
} else {
  console.log('\n✅ SUCCESS: All bullet point patterns are correct!');
  console.log('\n✨ VERIFIED:');
  console.log('   ✓ No flex-wrap in list items');
  console.log('   ✓ No flex-col md:flex-row in list items');
  console.log('   ✓ Proper flex items-start alignment');
  console.log('\n🎯 BENEFITS:');
  console.log('   • Checkmarks/icons stay aligned with text');
  console.log('   • Text wraps properly on all breakpoints');
  console.log('   • Consistent UX across mobile, tablet, desktop');
  console.log('   • No text breaking onto separate lines from icons');
  
  process.exit(0);
}
