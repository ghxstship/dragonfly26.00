#!/usr/bin/env node

/**
 * Automated Fix for Safe Responsive Layout Patterns
 * Fixes common layout responsiveness issues that can be safely automated
 */

const fs = require('fs');
const path = require('path');

let totalFiles = 0;
let totalFixes = 0;
const fixLog = [];

// Safe patterns that can be automated
const SAFE_FIXES = [
  // Fixed width containers -> responsive
  {
    pattern: /className="([^"]*\s)?w-\[(\d+)px\](\s[^"]*)?">/g,
    fix: (match, before, width, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      // Convert to max-w with responsive breakpoints
      if (parseInt(width) > 768) {
        return `className="${beforeClass}w-full max-w-${width}px lg:w-[${width}px]${afterClass}">`;
      }
      return `className="${beforeClass}w-full max-w-[${width}px]${afterClass}">`;
    },
    description: 'Fixed width containers to responsive'
  },
  
  // Absolute positioning without responsive adjustments
  {
    pattern: /className="([^"]*\s)?absolute\s+([^"]*?)"/g,
    fix: (match, before, rest) => {
      const beforeClass = before || '';
      // Add responsive positioning if not already present
      if (!rest.includes('sm:') && !rest.includes('md:') && !rest.includes('lg:')) {
        return `className="${beforeClass}absolute ${rest} sm:relative sm:inset-auto"`;
      }
      return match;
    },
    description: 'Absolute positioning with responsive fallback'
  },
  
  // Fixed heights that should be auto on mobile
  {
    pattern: /className="([^"]*\s)?h-\[(\d+)px\](\s[^"]*)?">/g,
    fix: (match, before, height, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      // Heights over 400px should be auto on mobile
      if (parseInt(height) > 400) {
        return `className="${beforeClass}h-auto md:h-[${height}px]${afterClass}">`;
      }
      return match;
    },
    description: 'Fixed heights to responsive'
  },
  
  // Flex containers without wrap
  {
    pattern: /className="([^"]*\s)?flex(\s+(?!flex-wrap)[^"]*)?">/g,
    fix: (match, before, rest) => {
      const beforeClass = before || '';
      const restClass = rest || '';
      // Add flex-wrap if not present
      if (!restClass.includes('flex-wrap') && !restClass.includes('flex-nowrap')) {
        return `className="${beforeClass}flex flex-wrap${restClass}">`;
      }
      return match;
    },
    description: 'Flex containers with wrap'
  },
  
  // Grid with fixed columns -> responsive columns
  {
    pattern: /className="([^"]*\s)?grid\s+grid-cols-(\d+)(\s[^"]*)?">/g,
    fix: (match, before, cols, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      const numCols = parseInt(cols);
      
      // Already has responsive breakpoints?
      if (afterClass && (afterClass.includes('sm:') || afterClass.includes('md:') || afterClass.includes('lg:'))) {
        return match;
      }
      
      // Add responsive breakpoints
      if (numCols >= 4) {
        return `className="${beforeClass}grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols}${afterClass}">`;
      } else if (numCols === 3) {
        return `className="${beforeClass}grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3${afterClass}">`;
      } else if (numCols === 2) {
        return `className="${beforeClass}grid grid-cols-1 md:grid-cols-2${afterClass}">`;
      }
      return match;
    },
    description: 'Grid columns to responsive'
  },
  
  // Gap spacing without responsive adjustments
  {
    pattern: /className="([^"]*\s)?gap-(\d+)(\s[^"]*)?">/g,
    fix: (match, before, gap, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      const gapSize = parseInt(gap);
      
      // Large gaps should be smaller on mobile
      if (gapSize >= 8) {
        return `className="${beforeClass}gap-4 md:gap-${gap}${afterClass}">`;
      }
      return match;
    },
    description: 'Gap spacing to responsive'
  },
  
  // Padding without responsive adjustments
  {
    pattern: /className="([^"]*\s)?p-(\d+)(\s[^"]*)?">/g,
    fix: (match, before, padding, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      const padSize = parseInt(padding);
      
      // Already has responsive padding?
      if (afterClass && (afterClass.includes('sm:p-') || afterClass.includes('md:p-') || afterClass.includes('lg:p-'))) {
        return match;
      }
      
      // Large padding should be smaller on mobile
      if (padSize >= 12) {
        return `className="${beforeClass}p-4 md:p-8 lg:p-${padding}${afterClass}">`;
      } else if (padSize >= 8) {
        return `className="${beforeClass}p-4 md:p-${padding}${afterClass}">`;
      }
      return match;
    },
    description: 'Padding to responsive'
  }
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fileFixes = 0;
  
  SAFE_FIXES.forEach(fix => {
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
      // Skip node_modules, .next, etc.
      if (!file.startsWith('.') && file !== 'node_modules') {
        processDirectory(filePath, extensions);
      }
    } else if (extensions.some(ext => file.endsWith(ext))) {
      fixFile(filePath);
    }
  });
}

console.log('\n' + '='.repeat(80));
console.log('AUTOMATED RESPONSIVE LAYOUT FIXES');
console.log('='.repeat(80));

// Process components
console.log('\n📁 Processing src/components...');
processDirectory(path.join(__dirname, '../src/components'));

// Process marketing
console.log('📁 Processing src/marketing...');
processDirectory(path.join(__dirname, '../src/marketing'));

// Process app
console.log('📁 Processing src/app...');
processDirectory(path.join(__dirname, '../src/app'));

console.log('\n' + '='.repeat(80));
console.log('RESULTS');
console.log('='.repeat(80));
console.log(`✅ Files Modified: ${totalFiles}`);
console.log(`✅ Total Fixes Applied: ${totalFixes}`);

// Group by fix type
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

// Save log
const logPath = path.join(__dirname, '../docs/RESPONSIVE_AUTOMATED_FIXES_LOG.json');
fs.writeFileSync(logPath, JSON.stringify(fixLog, null, 2));
console.log(`\n✅ Fix log saved to: ${logPath}`);

console.log('\n' + '='.repeat(80) + '\n');
