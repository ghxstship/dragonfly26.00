#!/usr/bin/env node

/**
 * Manual Fixes for CRITICAL Responsive Files
 * Targets the 8 files with 5+ issues each
 */

const fs = require('fs');
const path = require('path');

const CRITICAL_FILES = [
  'src/components/shared/create-item-dialog-enhanced.tsx',
  'src/marketing/components/sections/RolesSection.tsx',
  'src/components/marketplace/marketplace-review-form.tsx',
  'src/app/[locale]/(auth)/verify-email/page.tsx',
  'src/components/assets/barcode-scanner-overlay.tsx',
  'src/components/layout/workspace-switcher.tsx',
  'src/components/shared/photo-tab-content.tsx',
  'src/components/shared/create-item-dialog.tsx'
];

let totalFixes = 0;
const fixLog = [];

// Advanced layout fixes for complex components
const ADVANCED_FIXES = [
  // Dialog/Modal content - make responsive
  {
    pattern: /<DialogContent className="([^"]*)">/g,
    fix: (match, className) => {
      if (!className.includes('max-w-') || !className.includes('sm:')) {
        return `<DialogContent className="${className} max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl">`;
      }
      return match;
    },
    description: 'Responsive dialog widths'
  },
  
  // Form grids - responsive columns
  {
    pattern: /<div className="([^"]*grid[^"]*grid-cols-2[^"]*)">/g,
    fix: (match, className) => {
      if (!className.includes('sm:') && !className.includes('md:')) {
        return `<div className="${className.replace('grid-cols-2', 'grid-cols-1 md:grid-cols-2')}">`;
      }
      return match;
    },
    description: 'Responsive form grids'
  },
  
  // Button groups - stack on mobile
  {
    pattern: /<div className="([^"]*flex[^"]*gap-[^"]*)">\s*<Button/g,
    fix: (match, className) => {
      if (!className.includes('flex-col') && !className.includes('sm:flex-row')) {
        return `<div className="${className} flex-col sm:flex-row">\n        <Button`;
      }
      return match;
    },
    description: 'Responsive button groups'
  },
  
  // Image containers - responsive sizing
  {
    pattern: /<div className="([^"]*w-\[\d+px\][^"]*)">\s*<Image/g,
    fix: (match, className) => {
      if (!className.includes('sm:w-') && !className.includes('md:w-')) {
        const widthMatch = className.match(/w-\[(\d+)px\]/);
        if (widthMatch) {
          const width = widthMatch[1];
          return match.replace(
            `w-[${width}px]`,
            `w-full sm:w-[${Math.min(parseInt(width), 400)}px] md:w-[${width}px]`
          );
        }
      }
      return match;
    },
    description: 'Responsive image containers'
  },
  
  // Card grids - responsive
  {
    pattern: /<div className="([^"]*grid[^"]*grid-cols-3[^"]*)">/g,
    fix: (match, className) => {
      if (!className.includes('sm:') && !className.includes('md:')) {
        return `<div className="${className.replace('grid-cols-3', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')}">`;
      }
      return match;
    },
    description: 'Responsive card grids'
  },
  
  // Sidebar layouts - responsive
  {
    pattern: /<div className="([^"]*flex[^"]*)">\s*<aside className="([^"]*w-64[^"]*)"/g,
    fix: (match, flexClass, asideClass) => {
      if (!asideClass.includes('hidden') && !asideClass.includes('lg:')) {
        return match.replace(
          `aside className="${asideClass}"`,
          `aside className="${asideClass} hidden lg:block"`
        );
      }
      return match;
    },
    description: 'Responsive sidebar layouts'
  },
  
  // Text sizing - responsive
  {
    pattern: /className="([^"]*text-\d+xl[^"]*)"/g,
    fix: (match, className) => {
      if (!className.includes('sm:text-') && !className.includes('md:text-')) {
        const sizeMatch = className.match(/text-(\d+)xl/);
        if (sizeMatch) {
          const size = parseInt(sizeMatch[1]);
          if (size >= 4) {
            return match.replace(
              `text-${size}xl`,
              `text-2xl sm:text-3xl md:text-${size}xl`
            );
          } else if (size === 3) {
            return match.replace(
              `text-3xl`,
              `text-xl sm:text-2xl md:text-3xl`
            );
          }
        }
      }
      return match;
    },
    description: 'Responsive text sizing'
  },
  
  // Spacing - responsive padding/margin
  {
    pattern: /className="([^"]*p-12[^"]*)"/g,
    fix: (match, className) => {
      if (!className.includes('sm:p-') && !className.includes('md:p-')) {
        return match.replace('p-12', 'p-4 sm:p-6 md:p-8 lg:p-12');
      }
      return match;
    },
    description: 'Responsive large padding'
  },
  
  // Max-width containers
  {
    pattern: /className="([^"]*max-w-7xl[^"]*)"/g,
    fix: (match, className) => {
      if (!className.includes('px-')) {
        return match.replace(
          `max-w-7xl`,
          `max-w-7xl px-4 sm:px-6 lg:px-8`
        );
      }
      return match;
    },
    description: 'Responsive container padding'
  }
];

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return 0;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fileFixes = 0;
  
  ADVANCED_FIXES.forEach(fix => {
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
    totalFixes += fileFixes;
    return fileFixes;
  }
  
  return 0;
}

console.log('\n' + '='.repeat(80));
console.log('CRITICAL RESPONSIVE FILES - MANUAL FIXES');
console.log('='.repeat(80));

console.log('\n🎯 Processing 8 CRITICAL files...\n');

CRITICAL_FILES.forEach((file, index) => {
  const filePath = path.join(__dirname, '..', file);
  console.log(`${index + 1}. ${file}`);
  const fixes = fixFile(filePath);
  if (fixes > 0) {
    console.log(`   ✅ Applied ${fixes} fixes`);
  } else {
    console.log(`   ℹ️  No automated fixes available (manual review needed)`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('RESULTS');
console.log('='.repeat(80));
console.log(`✅ Total Fixes Applied: ${totalFixes}`);

if (fixLog.length > 0) {
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

  const logPath = path.join(__dirname, '../docs/RESPONSIVE_CRITICAL_FIXES_LOG.json');
  fs.writeFileSync(logPath, JSON.stringify(fixLog, null, 2));
  console.log(`\n✅ Fix log saved to: ${logPath}`);
}

console.log('\n' + '='.repeat(80));
console.log('NEXT: Manual review of remaining complex layouts');
console.log('='.repeat(80) + '\n');
