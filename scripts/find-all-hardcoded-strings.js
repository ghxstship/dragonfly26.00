#!/usr/bin/env node

/**
 * COMPREHENSIVE HARDCODED STRING DETECTOR
 * Opens and reads EVERY SINGLE TAB FILE to find hardcoded English strings
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 SCANNING EVERY SINGLE FILE FOR HARDCODED STRINGS');
console.log('='.repeat(80));

// Get all tab files
const tabFiles = execSync(
  `find src/components/{dashboard,projects,events,people,assets,locations,files,community,marketplace,resources,companies,jobs,procurement,finance,analytics,reports,insights,admin,settings,profile} -name "*-tab.tsx" -type f | sort`,
  { encoding: 'utf-8', cwd: process.cwd() }
).trim().split('\n');

console.log(`Total files to scan: ${tabFiles.length}\n`);

const issues = [];
let filesScanned = 0;
let filesWithIssues = 0;

// Patterns to detect hardcoded strings
const patterns = [
  // CardTitle with hardcoded text
  {
    name: 'CardTitle with hardcoded text',
    regex: /<CardTitle[^>]*>([A-Z][^<{]+)</g,
    extract: (match) => match[1]
  },
  // Hardcoded text in JSX
  {
    name: 'Hardcoded JSX text',
    regex: />([A-Z][a-z]{3,}[^<{]*)</g,
    extract: (match) => match[1]
  },
  // Hardcoded placeholder
  {
    name: 'Hardcoded placeholder',
    regex: /placeholder="([A-Z][^"]+)"/g,
    extract: (match) => match[1]
  },
  // Hardcoded aria-label
  {
    name: 'Hardcoded aria-label',
    regex: /aria-label="([A-Z][^"]+)"/g,
    extract: (match) => match[1]
  }
];

tabFiles.forEach((file, index) => {
  if (!file) return;
  
  filesScanned++;
  const filePath = path.join(process.cwd(), file);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fileIssues = [];
    
    lines.forEach((line, lineNum) => {
      // Skip comments and imports
      if (line.trim().startsWith('//') || line.trim().startsWith('import')) return;
      if (line.includes('aria-hidden="true"')) return; // Skip decorative elements
      
      patterns.forEach(pattern => {
        let match;
        const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
        
        while ((match = regex.exec(line)) !== null) {
          const text = pattern.extract(match);
          
          // Filter out false positives
          if (text && 
              !text.includes('t(') && 
              !text.includes('{') && 
              !text.includes('$') &&
              !text.includes('className') &&
              !text.includes('aria-') &&
              text.length > 2 &&
              text.length < 100) {
            
            fileIssues.push({
              line: lineNum + 1,
              text: text.trim(),
              pattern: pattern.name,
              code: line.trim()
            });
          }
        }
      });
    });
    
    if (fileIssues.length > 0) {
      filesWithIssues++;
      issues.push({
        file: file.replace('src/components/', ''),
        count: fileIssues.length,
        issues: fileIssues
      });
    }
    
    // Progress indicator
    if ((index + 1) % 20 === 0) {
      console.log(`Scanned ${index + 1}/${tabFiles.length} files...`);
    }
    
  } catch (error) {
    console.error(`Error reading ${file}:`, error.message);
  }
});

console.log('\n' + '='.repeat(80));
console.log('📊 SCAN COMPLETE');
console.log('='.repeat(80));
console.log();
console.log(`Files Scanned: ${filesScanned}`);
console.log(`Files with Issues: ${filesWithIssues}`);
console.log(`Total Issues Found: ${issues.reduce((sum, f) => sum + f.count, 0)}`);
console.log();

if (issues.length > 0) {
  console.log('🔴 FILES WITH HARDCODED STRINGS:\n');
  
  // Group by hub
  const byHub = {};
  issues.forEach(issue => {
    const hub = issue.file.split('/')[0];
    if (!byHub[hub]) byHub[hub] = [];
    byHub[hub].push(issue);
  });
  
  Object.entries(byHub).forEach(([hub, files]) => {
    console.log(`\n📦 ${hub.toUpperCase()} (${files.length} files)`);
    console.log('-'.repeat(80));
    
    files.forEach(file => {
      console.log(`\n  📄 ${file.file} (${file.count} issues)`);
      file.issues.slice(0, 5).forEach(issue => {
        console.log(`     Line ${issue.line}: "${issue.text}"`);
      });
      if (file.issues.length > 5) {
        console.log(`     ... and ${file.issues.length - 5} more`);
      }
    });
  });
  
  // Save detailed results
  fs.writeFileSync(
    'HARDCODED_STRINGS_DETAILED.json',
    JSON.stringify(issues, null, 2)
  );
  
  console.log('\n\n📄 Detailed results saved to: HARDCODED_STRINGS_DETAILED.json');
  console.log();
  
  process.exit(1);
} else {
  console.log('✅ NO HARDCODED STRINGS FOUND!');
  process.exit(0);
}
