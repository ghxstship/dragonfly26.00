#!/usr/bin/env node

/**
 * Fix Remaining Responsive Issues
 * Targets specific patterns that need manual attention
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const APP_DIR = path.join(__dirname, '../src/app');

// Advanced responsive fixes
const ADVANCED_FIXES = [
  // Flex with items-center - add responsive stacking
  {
    pattern: /className="([^"]*\bflex\b[^"]*\bitems-center\b(?![^"]*\bflex-col\b)(?![^"]*\bmd:flex-row\b)[^"]*)"/g,
    fix: (match, classes) => {
      // Add flex-col on mobile, flex-row on desktop for complex layouts
      if (classes.includes('justify-between') || classes.includes('gap-')) {
        const responsive = classes.replace('flex', 'flex flex-col md:flex-row');
        return `className="${responsive}"`;
      }
      return match;
    }
  },
  
  // Grid with many columns - ensure mobile stacking
  {
    pattern: /className="([^"]*\bgrid\b[^"]*\bgrid-cols-1\b[^"]*\blg:grid-cols-(\d+)\b(?![^"]*\bmd:grid-cols\b)[^"]*)"/g,
    fix: (match, classes, cols) => {
      const colNum = parseInt(cols);
      if (colNum >= 3) {
        const responsive = classes.replace(`lg:grid-cols-${cols}`, `md:grid-cols-2 lg:grid-cols-${cols}`);
        return `className="${responsive}"`;
      }
      return match;
    }
  },
  
  // Width constraints - add responsive max-width
  {
    pattern: /className="([^"]*\bw-full\b(?![^"]*\bmax-w-\b)[^"]*)"/g,
    fix: (match, classes) => {
      // Add max-width for full-width containers
      if (classes.includes('container') || classes.includes('mx-auto')) {
        return match; // Already constrained
      }
      const responsive = classes + ' max-w-full';
      return `className="${responsive}"`;
    }
  },
  
  // Typography - ensure readable line lengths
  {
    pattern: /className="([^"]*\btext-base\b[^"]*\bw-full\b(?![^"]*\bmax-w-\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('w-full', 'w-full max-w-prose');
      return `className="${responsive}"`;
    }
  },
  
  // Spacing - responsive gap
  {
    pattern: /className="([^"]*\bgap-8\b(?![^"]*\bmd:gap\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('gap-8', 'gap-4 md:gap-6 lg:gap-8');
      return `className="${responsive}"`;
    }
  },
  
  // Container padding - responsive
  {
    pattern: /className="([^"]*\bpx-8\b(?![^"]*\bmd:px\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('px-8', 'px-4 md:px-6 lg:px-8');
      return `className="${responsive}"`;
    }
  },
  
  // Large margins - responsive
  {
    pattern: /className="([^"]*\bmy-12\b(?![^"]*\bmd:my\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('my-12', 'my-6 md:my-8 lg:my-12');
      return `className="${responsive}"`;
    }
  },
  
  // Overflow handling for tables/wide content
  {
    pattern: /className="([^"]*\bw-full\b[^"]*\btable\b(?![^"]*\boverflow\b)[^"]*)"/g,
    fix: (match, classes) => {
      // Wrap tables in overflow container
      return match; // This needs wrapper div, skip for now
    }
  }
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fixCount = 0;

  ADVANCED_FIXES.forEach(({ pattern, fix }) => {
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
  console.log('🔧 Advanced Responsive Design Fixes\n');
  console.log('='.repeat(70));

  // Fix components
  console.log('\n📁 Fixing Components...');
  const componentFiles = walkDirectory(COMPONENTS_DIR);
  const componentResults = componentFiles.map(fixFile);

  // Fix app pages
  console.log('📁 Fixing App Pages...');
  const appFiles = walkDirectory(APP_DIR);
  const appResults = appFiles.map(fixFile);

  // Combine results
  const allResults = [...componentResults, ...appResults];
  const modifiedFiles = allResults.filter(r => r.modified);
  const totalFixes = allResults.reduce((sum, r) => sum + r.fixes, 0);

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 FIX SUMMARY\n');
  console.log(`✅ Files Modified: ${modifiedFiles.length}/${allResults.length}`);
  console.log(`🔧 Total Fixes Applied: ${totalFixes}`);

  if (modifiedFiles.length > 0) {
    console.log('\n📝 Modified Files:\n');
    modifiedFiles.slice(0, 15).forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.file} (${r.fixes} fixes)`);
    });
    
    if (modifiedFiles.length > 15) {
      console.log(`   ... and ${modifiedFiles.length - 15} more files`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`\n✅ Advanced responsive fixes complete! ${totalFixes} improvements applied.\n`);
}

main();
