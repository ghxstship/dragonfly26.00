#!/usr/bin/env node

/**
 * Final Push to TRUE 100% Responsive Design
 * Comprehensive fixes for all remaining layout issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let totalFiles = 0;
let totalFixes = 0;
const fixLog = [];

// Comprehensive fix patterns for TRUE 100%
const COMPREHENSIVE_FIXES = [
  // 1. Grid columns without responsive breakpoints
  {
    pattern: /className="([^"]*\s)?grid\s+grid-cols-(\d+)(?!\s+(?:sm|md|lg):)([^"]*)"/g,
    fix: (match, before, cols, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      const numCols = parseInt(cols);
      
      if (numCols === 1) return match; // Already mobile-first
      
      if (numCols >= 4) {
        return `className="${beforeClass}grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols}${afterClass}"`;
      } else if (numCols === 3) {
        return `className="${beforeClass}grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3${afterClass}"`;
      } else if (numCols === 2) {
        return `className="${beforeClass}grid grid-cols-1 md:grid-cols-2${afterClass}"`;
      }
      return match;
    },
    description: 'Grid columns responsive'
  },
  
  // 2. Flex containers without responsive direction
  {
    pattern: /className="([^"]*\s)?flex\s+(?:flex-row\s+)?gap-(\d+)(?!\s+(?:flex-col|sm:|md:|lg:))([^"]*)"/g,
    fix: (match, before, gap, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      
      // Check if it's a simple row that should stack on mobile
      if (!afterClass.includes('items-center') && !afterClass.includes('justify-')) {
        return `className="${beforeClass}flex flex-col sm:flex-row gap-${gap}${afterClass}"`;
      }
      return match;
    },
    description: 'Flex direction responsive'
  },
  
  // 3. Fixed widths without responsive variants
  {
    pattern: /className="([^"]*\s)?w-\[(\d+)px\](?!\s+(?:sm:|md:|lg:))([^"]*)"/g,
    fix: (match, before, width, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      const widthNum = parseInt(width);
      
      if (widthNum > 768) {
        return `className="${beforeClass}w-full lg:w-[${width}px]${afterClass}"`;
      } else if (widthNum > 640) {
        return `className="${beforeClass}w-full md:w-[${width}px]${afterClass}"`;
      } else if (widthNum > 384) {
        return `className="${beforeClass}w-full sm:w-[${width}px]${afterClass}"`;
      }
      return match;
    },
    description: 'Fixed widths responsive'
  },
  
  // 4. Fixed heights without responsive variants
  {
    pattern: /className="([^"]*\s)?h-\[(\d+)px\](?!\s+(?:sm:|md:|lg:))([^"]*)"/g,
    fix: (match, before, height, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      const heightNum = parseInt(height);
      
      if (heightNum > 500) {
        return `className="${beforeClass}h-auto md:h-[${height}px]${afterClass}"`;
      }
      return match;
    },
    description: 'Fixed heights responsive'
  },
  
  // 5. Large padding without responsive variants
  {
    pattern: /className="([^"]*\s)?p-(\d{2,})(?!\s+(?:sm:|md:|lg:))([^"]*)"/g,
    fix: (match, before, padding, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      const padNum = parseInt(padding);
      
      if (padNum >= 12) {
        return `className="${beforeClass}p-4 sm:p-6 md:p-8 lg:p-${padding}${afterClass}"`;
      } else if (padNum >= 8) {
        return `className="${beforeClass}p-4 md:p-${padding}${afterClass}"`;
      }
      return match;
    },
    description: 'Large padding responsive'
  },
  
  // 6. Large gaps without responsive variants
  {
    pattern: /className="([^"]*\s)?gap-(\d{2,})(?!\s+(?:sm:|md:|lg:))([^"]*)"/g,
    fix: (match, before, gap, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      const gapNum = parseInt(gap);
      
      if (gapNum >= 8) {
        return `className="${beforeClass}gap-4 md:gap-${gap}${afterClass}"`;
      }
      return match;
    },
    description: 'Large gaps responsive'
  },
  
  // 7. Large text without responsive variants
  {
    pattern: /className="([^"]*\s)?text-([4-9])xl(?!\s+(?:sm:|md:|lg:))([^"]*)"/g,
    fix: (match, before, size, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      const sizeNum = parseInt(size);
      
      if (sizeNum >= 5) {
        return `className="${beforeClass}text-2xl sm:text-3xl md:text-4xl lg:text-${size}xl${afterClass}"`;
      } else if (sizeNum === 4) {
        return `className="${beforeClass}text-xl sm:text-2xl md:text-3xl lg:text-4xl${afterClass}"`;
      }
      return match;
    },
    description: 'Large text responsive'
  },
  
  // 8. Absolute positioning without responsive fallback
  {
    pattern: /className="([^"]*\s)?absolute(?!\s+(?:sm:|md:|lg:))([^"]*)"/g,
    fix: (match, before, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      
      // Only add responsive if it doesn't have positioning classes
      if (!afterClass.includes('inset-') && !afterClass.includes('top-') && !afterClass.includes('left-')) {
        return match; // Skip if no positioning
      }
      
      // Add mobile-friendly alternative
      return `className="${beforeClass}absolute sm:relative sm:inset-auto${afterClass}"`;
    },
    description: 'Absolute positioning responsive'
  },
  
  // 9. Min-width without responsive variants
  {
    pattern: /className="([^"]*\s)?min-w-\[(\d+)px\](?!\s+(?:sm:|md:|lg:))([^"]*)"/g,
    fix: (match, before, width, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      const widthNum = parseInt(width);
      
      if (widthNum > 640) {
        return `className="${beforeClass}min-w-0 md:min-w-[${width}px]${afterClass}"`;
      }
      return match;
    },
    description: 'Min-width responsive'
  },
  
  // 10. Max-width containers without padding
  {
    pattern: /className="([^"]*\s)?max-w-([2-7]xl)(?!\s+(?:px-|p-))([^"]*)"/g,
    fix: (match, before, size, after) => {
      const beforeClass = before || '';
      const afterClass = after || '';
      
      return `className="${beforeClass}max-w-${size} px-4 sm:px-6 lg:px-8${afterClass}"`;
    },
    description: 'Container padding'
  }
];

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return 0;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fileFixes = 0;
  
  COMPREHENSIVE_FIXES.forEach(fix => {
    const matches = content.match(fix.pattern);
    if (matches) {
      const newContent = content.replace(fix.pattern, fix.fix);
      if (newContent !== content) {
        content = newContent;
        fileFixes += matches.length;
        fixLog.push({
          file: filePath,
          fix: fix.description,
          count: matches.length
        });
      }
    }
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    totalFiles++;
    totalFixes += fileFixes;
    return fileFixes;
  }
  
  return 0;
}

function processDirectory(dir, extensions = ['.tsx', '.jsx']) {
  if (!fs.existsSync(dir)) return;
  
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
console.log('FINAL PUSH TO TRUE 100% RESPONSIVE DESIGN');
console.log('='.repeat(80));

console.log('\n📁 Processing all source files...\n');

// Process all directories
['src/components', 'src/marketing', 'src/app'].forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  console.log(`Processing ${dir}...`);
  processDirectory(fullPath);
});

console.log('\n' + '='.repeat(80));
console.log('AUTOMATED FIXES COMPLETE');
console.log('='.repeat(80));
console.log(`✅ Files Modified: ${totalFiles}`);
console.log(`✅ Total Fixes Applied: ${totalFixes}`);

if (fixLog.length > 0) {
  const fixesByType = {};
  fixLog.forEach(log => {
    if (!fixesByType[log.fix]) {
      fixesByType[log.fix] = { count: 0, files: [] };
    }
    fixesByType[log.fix].count += log.count;
    if (!fixesByType[log.fix].files.includes(log.file)) {
      fixesByType[log.fix].files.push(log.file);
    }
  });

  console.log('\n📊 FIXES BY TYPE');
  console.log('-'.repeat(80));
  Object.entries(fixesByType).forEach(([type, data]) => {
    console.log(`${type}: ${data.count} fixes in ${data.files.length} files`);
  });

  const logPath = path.join(__dirname, '../docs/RESPONSIVE_TRUE_100_PERCENT_FIXES_LOG.json');
  fs.writeFileSync(logPath, JSON.stringify(fixLog, null, 2));
  console.log(`\n✅ Fix log saved to: ${logPath}`);
}

// Run audit to verify
console.log('\n' + '='.repeat(80));
console.log('RUNNING VERIFICATION AUDIT...');
console.log('='.repeat(80));

try {
  execSync('node scripts/comprehensive-responsive-audit.js', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Audit failed:', error.message);
}

console.log('\n' + '='.repeat(80) + '\n');
