#!/usr/bin/env node

/**
 * Automated Fix for Overflow Handling Issues
 * Adds overflow-x-auto and proper scrolling for wide content
 */

const fs = require('fs');
const path = require('path');

let totalFiles = 0;
let totalFixes = 0;
const fixLog = [];

// Overflow patterns that can be automated
const OVERFLOW_FIXES = [
  // Tables without overflow wrapper
  {
    pattern: /<div className="([^"]*)">\s*<table/g,
    fix: (match, className) => {
      // Check if already has overflow handling
      if (className.includes('overflow-x-auto') || className.includes('overflow-auto')) {
        return match;
      }
      return `<div className="${className} overflow-x-auto">\n        <table`;
    },
    description: 'Add overflow-x-auto to table containers'
  },
  
  // Wide content containers
  {
    pattern: /<div className="([^"]*\s)?min-w-\[(\d+)px\]([^"]*)?">/g,
    fix: (match, before, width, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      
      // If min-width is large, ensure parent has overflow
      if (parseInt(width) > 640 && !afterClass.includes('overflow')) {
        return `<div className="${beforeClass}min-w-[${width}px]${afterClass} overflow-x-auto">`;
      }
      return match;
    },
    description: 'Add overflow to wide content'
  },
  
  // Flex containers with nowrap
  {
    pattern: /className="([^"]*\s)?flex\s+flex-nowrap(\s[^"]*)?">/g,
    fix: (match, before, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      
      // Add overflow-x-auto if not present
      if (!afterClass.includes('overflow')) {
        return `className="${beforeClass}flex flex-nowrap overflow-x-auto${afterClass}">`;
      }
      return match;
    },
    description: 'Add overflow to flex-nowrap containers'
  },
  
  // Whitespace-nowrap without overflow
  {
    pattern: /className="([^"]*\s)?whitespace-nowrap(\s[^"]*)?">/g,
    fix: (match, before, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      
      // Check if parent or element has overflow
      if (!afterClass.includes('overflow') && !afterClass.includes('truncate')) {
        return `className="${beforeClass}whitespace-nowrap overflow-hidden text-ellipsis${afterClass}">`;
      }
      return match;
    },
    description: 'Add overflow handling to whitespace-nowrap'
  },
  
  // Code blocks without overflow
  {
    pattern: /<pre className="([^"]*)">|<code className="([^"]*)block([^"]*)">/g,
    fix: (match) => {
      if (match.includes('overflow')) {
        return match;
      }
      if (match.startsWith('<pre')) {
        return match.replace('className="', 'className="overflow-x-auto ');
      } else {
        return match.replace('className="', 'className="overflow-x-auto ');
      }
    },
    description: 'Add overflow to code blocks'
  }
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fileFixes = 0;
  
  OVERFLOW_FIXES.forEach(fix => {
    const matches = content.match(fix.pattern);
    if (matches) {
      const newContent = content.replace(fix.pattern, fix.fix);
      if (newContent !== content) {
        content = newContent;
        modified = true;
        fileFixes += matches.length;
        fixLog.push({
          file: filePath,
          fix: fix.description,
          count: matches.length
        });
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    totalFiles++;
    totalFixes += fileFixes;
    return fileFixes;
  }
  
  return 0;
}

function processDirectory(dir, extensions = ['.tsx', '.jsx']) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        processDirectory(filePath, extensions);
      }
    } else if (extensions.some(ext => file.endsWith(ext))) {
      fixFile(filePath);
    }
  });
}

console.log('\n' + '='.repeat(80));
console.log('AUTOMATED OVERFLOW HANDLING FIXES');
console.log('='.repeat(80));

console.log('\n📁 Processing src/components...');
processDirectory(path.join(__dirname, '../src/components'));

console.log('📁 Processing src/marketing...');
processDirectory(path.join(__dirname, '../src/marketing'));

console.log('📁 Processing src/app...');
processDirectory(path.join(__dirname, '../src/app'));

console.log('\n' + '='.repeat(80));
console.log('RESULTS');
console.log('='.repeat(80));
console.log(`✅ Files Modified: ${totalFiles}`);
console.log(`✅ Total Fixes Applied: ${totalFixes}`);

const fixesByType = {};
fixLog.forEach(log => {
  if (!fixesByType[log.fix]) {
    fixesByType[log.fix] = { count: 0, files: [] };
  }
  fixesByType[log.fix].count += log.count;
  fixesByType[log.fix].files.push(log.file);
});

console.log('\n📊 FIXES BY TYPE');
console.log('-'.repeat(80));
Object.entries(fixesByType).forEach(([type, data]) => {
  console.log(`${type}: ${data.count} fixes in ${data.files.length} files`);
});

const logPath = path.join(__dirname, '../docs/RESPONSIVE_OVERFLOW_FIXES_LOG.json');
fs.writeFileSync(logPath, JSON.stringify(fixLog, null, 2));
console.log(`\n✅ Fix log saved to: ${logPath}`);

console.log('\n' + '='.repeat(80) + '\n');
