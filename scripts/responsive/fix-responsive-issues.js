#!/usr/bin/env node

/**
 * Automated Responsive Design Fixes
 * Applies responsive variants to common patterns
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const MARKETING_DIR = path.join(__dirname, '../src/marketing');

// Responsive fix patterns
const RESPONSIVE_FIXES = [
  // Grid layouts - add responsive columns
  {
    pattern: /className="([^"]*\bgrid\b[^"]*\bgrid-cols-(\d+)\b[^"]*)"/g,
    fix: (match, classes, cols) => {
      if (classes.includes('md:grid-cols') || classes.includes('lg:grid-cols')) {
        return match; // Already has responsive variants
      }
      
      // Add responsive breakpoints based on column count
      let responsive = classes;
      if (parseInt(cols) >= 4) {
        responsive = classes.replace('grid-cols-' + cols, `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols}`);
      } else if (parseInt(cols) >= 3) {
        responsive = classes.replace('grid-cols-' + cols, `grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols}`);
      } else if (parseInt(cols) === 2) {
        responsive = classes.replace('grid-cols-2', 'grid-cols-1 md:grid-cols-2');
      }
      
      return `className="${responsive}"`;
    }
  },
  
  // Large text - add responsive sizing
  {
    pattern: /className="([^"]*\btext-([4-9]xl|[1-9]\dxl)\b[^"]*)"/g,
    fix: (match, classes, size) => {
      if (classes.includes('sm:text') || classes.includes('md:text') || classes.includes('lg:text')) {
        return match; // Already has responsive variants
      }
      
      // Add responsive text sizing
      const sizeNum = parseInt(size);
      let responsive = classes;
      
      if (sizeNum >= 6 || size.includes('xl')) {
        responsive = classes.replace(`text-${size}`, `text-3xl md:text-4xl lg:text-${size}`);
      } else if (sizeNum >= 4) {
        responsive = classes.replace(`text-${size}`, `text-2xl md:text-3xl lg:text-${size}`);
      }
      
      return `className="${responsive}"`;
    }
  },
  
  // Flex layouts - add responsive direction
  {
    pattern: /className="([^"]*\bflex\b[^"]*\bflex-row\b[^"]*)"/g,
    fix: (match, classes) => {
      if (classes.includes('md:flex-row') || classes.includes('lg:flex-row')) {
        return match;
      }
      
      const responsive = classes.replace('flex-row', 'flex-col md:flex-row');
      return `className="${responsive}"`;
    }
  },
  
  // Fixed widths - add max-width and responsive variants
  {
    pattern: /className="([^"]*\bw-\[(\d+)px\]\b[^"]*)"/g,
    fix: (match, classes, width) => {
      if (classes.includes('max-w-') || classes.includes('md:w-') || classes.includes('lg:w-')) {
        return match;
      }
      
      const widthNum = parseInt(width);
      if (widthNum > 600) {
        const responsive = classes.replace(`w-[${width}px]`, `w-full md:w-[${Math.floor(widthNum * 0.8)}px] lg:w-[${width}px]`);
        return `className="${responsive}"`;
      }
      
      return match;
    }
  },
  
  // Large padding - add responsive variants
  {
    pattern: /className="([^"]*\bp-(\d{2,})\b[^"]*)"/g,
    fix: (match, classes, padding) => {
      if (classes.includes('md:p-') || classes.includes('lg:p-')) {
        return match;
      }
      
      const paddingNum = parseInt(padding);
      if (paddingNum >= 12) {
        const responsive = classes.replace(`p-${padding}`, `p-6 md:p-8 lg:p-${padding}`);
        return `className="${responsive}"`;
      }
      
      return match;
    }
  },
  
  // Hidden elements - ensure mobile-first approach
  {
    pattern: /className="([^"]*\bhidden\b(?![^"]*\bmd:block\b)(?![^"]*\bmd:flex\b)[^"]*)"/g,
    fix: (match, classes) => {
      // Add md:block if it's just hidden without responsive variant
      if (!classes.includes('md:') && !classes.includes('lg:')) {
        const responsive = classes.replace('hidden', 'hidden md:block');
        return `className="${responsive}"`;
      }
      return match;
    }
  },
  
  // Space between - add responsive variants
  {
    pattern: /className="([^"]*\bspace-x-(\d+)\b[^"]*)"/g,
    fix: (match, classes, space) => {
      if (classes.includes('md:space-x-') || classes.includes('lg:space-x-')) {
        return match;
      }
      
      const spaceNum = parseInt(space);
      if (spaceNum >= 6) {
        const responsive = classes.replace(`space-x-${space}`, `space-x-2 md:space-x-4 lg:space-x-${space}`);
        return `className="${responsive}"`;
      }
      
      return match;
    }
  }
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fixCount = 0;

  RESPONSIVE_FIXES.forEach(({ pattern, fix }) => {
    const newContent = content.replace(pattern, (...args) => {
      const result = fix(...args);
      if (result !== args[0]) {
        fixCount++;
      }
      return result;
    });
    
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return { modified: true, fixes: fixCount, file: path.relative(path.join(__dirname, '..'), filePath) };
  }

  return { modified: false, fixes: 0, file: path.relative(path.join(__dirname, '..'), filePath) };
}

function walkDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        walkDirectory(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function main() {
  console.log('🔧 Automated Responsive Design Fixes\n');
  console.log('='.repeat(70));

  // Fix components
  console.log('\n📁 Fixing Components...');
  const componentFiles = walkDirectory(COMPONENTS_DIR);
  const componentResults = componentFiles.map(fixFile);

  // Fix marketing
  console.log('📁 Fixing Marketing Pages...');
  const marketingFiles = walkDirectory(MARKETING_DIR);
  const marketingResults = marketingFiles.map(fixFile);

  // Combine results
  const allResults = [...componentResults, ...marketingResults];
  const modifiedFiles = allResults.filter(r => r.modified);
  const totalFixes = allResults.reduce((sum, r) => sum + r.fixes, 0);

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 FIX SUMMARY\n');
  console.log(`✅ Files Modified: ${modifiedFiles.length}/${allResults.length}`);
  console.log(`🔧 Total Fixes Applied: ${totalFixes}`);

  if (modifiedFiles.length > 0) {
    console.log('\n📝 Modified Files:\n');
    modifiedFiles.slice(0, 20).forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.file} (${r.fixes} fixes)`);
    });
    
    if (modifiedFiles.length > 20) {
      console.log(`   ... and ${modifiedFiles.length - 20} more files`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`\n✅ Responsive fixes complete! ${totalFixes} improvements applied.\n`);
  console.log('💡 Run the audit script again to verify improvements:\n');
  console.log('   node scripts/comprehensive-responsive-audit.js\n');
}

main();
