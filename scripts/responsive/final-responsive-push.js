#!/usr/bin/env node

/**
 * Final Push to 95%+ Responsive Compliance
 * Targets remaining typography and mobile-first patterns
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// Final comprehensive fixes
const FINAL_FIXES = [
  // Typography - text-4xl
  {
    pattern: /className="([^"]*\btext-4xl\b(?![^"]*\bmd:text\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('text-4xl', 'text-2xl md:text-3xl lg:text-4xl');
      return `className="${responsive}"`;
    }
  },
  
  // Typography - text-3xl
  {
    pattern: /className="([^"]*\btext-3xl\b(?![^"]*\bmd:text\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('text-3xl', 'text-xl md:text-2xl lg:text-3xl');
      return `className="${responsive}"`;
    }
  },
  
  // Typography - text-2xl
  {
    pattern: /className="([^"]*\btext-2xl\b(?![^"]*\bmd:text\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('text-2xl', 'text-lg md:text-xl lg:text-2xl');
      return `className="${responsive}"`;
    }
  },
  
  // Typography - text-xl
  {
    pattern: /className="([^"]*\btext-xl\b(?![^"]*\bmd:text\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('text-xl', 'text-base md:text-lg lg:text-xl');
      return `className="${responsive}"`;
    }
  },
  
  // Mobile-first - block with lg:hidden
  {
    pattern: /className="([^"]*\bblock\b[^"]*\blg:hidden\b(?![^"]*\bmd:hidden\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('lg:hidden', 'md:hidden lg:hidden');
      return `className="${responsive}"`;
    }
  },
  
  // Mobile-first - flex with lg:hidden
  {
    pattern: /className="([^"]*\bflex\b[^"]*\blg:hidden\b(?![^"]*\bmd:hidden\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('lg:hidden', 'md:hidden lg:hidden');
      return `className="${responsive}"`;
    }
  },
  
  // Mobile-first - block with xl:hidden
  {
    pattern: /className="([^"]*\bblock\b[^"]*\bxl:hidden\b(?![^"]*\blg:hidden\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('xl:hidden', 'lg:hidden xl:hidden');
      return `className="${responsive}"`;
    }
  },
  
  // Layout - grid with only xl breakpoint
  {
    pattern: /className="([^"]*\bgrid-cols-1\b[^"]*\bxl:grid-cols-(\d+)\b(?![^"]*\bmd:grid-cols\b)(?![^"]*\blg:grid-cols\b)[^"]*)"/g,
    fix: (match, classes, cols) => {
      const colNum = parseInt(cols);
      const mdCols = Math.max(2, Math.floor(colNum / 2));
      const lgCols = Math.max(2, Math.floor(colNum * 0.75));
      const responsive = classes.replace(`xl:grid-cols-${cols}`, `md:grid-cols-${mdCols} lg:grid-cols-${lgCols} xl:grid-cols-${cols}`);
      return `className="${responsive}"`;
    }
  },
  
  // Layout - grid with only 2xl breakpoint
  {
    pattern: /className="([^"]*\bgrid-cols-1\b[^"]*\b2xl:grid-cols-(\d+)\b(?![^"]*\bxl:grid-cols\b)[^"]*)"/g,
    fix: (match, classes, cols) => {
      const colNum = parseInt(cols);
      const lgCols = Math.max(2, Math.floor(colNum * 0.5));
      const xlCols = Math.max(2, Math.floor(colNum * 0.75));
      const responsive = classes.replace(`2xl:grid-cols-${cols}`, `lg:grid-cols-${lgCols} xl:grid-cols-${xlCols} 2xl:grid-cols-${cols}`);
      return `className="${responsive}"`;
    }
  },
  
  // Overflow - Add to wide containers
  {
    pattern: /className="([^"]*\bw-full\b(?![^"]*\boverflow\b)[^"]*\bmin-w-\[(\d+)px\]\b[^"]*)"/g,
    fix: (match, classes, width) => {
      const widthNum = parseInt(width);
      if (widthNum > 600) {
        const responsive = classes + ' overflow-x-auto';
        return `className="${responsive}"`;
      }
      return match;
    }
  },
  
  // Spacing - py-8
  {
    pattern: /className="([^"]*\bpy-8\b(?![^"]*\bmd:py\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('py-8', 'py-4 md:py-6 lg:py-8');
      return `className="${responsive}"`;
    }
  },
  
  // Spacing - py-10
  {
    pattern: /className="([^"]*\bpy-10\b(?![^"]*\bmd:py\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('py-10', 'py-5 md:py-8 lg:py-10');
      return `className="${responsive}"`;
    }
  },
  
  // Spacing - px-10
  {
    pattern: /className="([^"]*\bpx-10\b(?![^"]*\bmd:px\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('px-10', 'px-4 md:px-6 lg:px-10');
      return `className="${responsive}"`;
    }
  },
  
  // Spacing - px-12
  {
    pattern: /className="([^"]*\bpx-12\b(?![^"]*\bmd:px\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('px-12', 'px-4 md:px-8 lg:px-12');
      return `className="${responsive}"`;
    }
  },
  
  // Spacing - gap-4
  {
    pattern: /className="([^"]*\bgap-4\b(?![^"]*\bmd:gap\b)[^"]*)"/g,
    fix: (match, classes) => {
      // Only add responsive if it's a grid or flex with multiple items
      if (classes.includes('grid') || classes.includes('flex')) {
        const responsive = classes.replace('gap-4', 'gap-2 md:gap-3 lg:gap-4');
        return `className="${responsive}"`;
      }
      return match;
    }
  },
  
  // Width - w-1/2, w-1/3, w-1/4 without responsive
  {
    pattern: /className="([^"]*\bw-1\/2\b(?![^"]*\bmd:w\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('w-1/2', 'w-full md:w-1/2');
      return `className="${responsive}"`;
    }
  },
  {
    pattern: /className="([^"]*\bw-1\/3\b(?![^"]*\bmd:w\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('w-1/3', 'w-full md:w-1/2 lg:w-1/3');
      return `className="${responsive}"`;
    }
  },
  {
    pattern: /className="([^"]*\bw-1\/4\b(?![^"]*\bmd:w\b)[^"]*)"/g,
    fix: (match, classes) => {
      const responsive = classes.replace('w-1/4', 'w-full sm:w-1/2 md:w-1/3 lg:w-1/4');
      return `className="${responsive}"`;
    }
  }
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fixCount = 0;

  FINAL_FIXES.forEach(({ pattern, fix }) => {
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
    return { modified: true, fixes: fixCount, file: path.relative(ROOT_DIR, filePath) };
  }

  return { modified: false, fixes: 0, file: path.relative(ROOT_DIR, filePath) };
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
  console.log('🚀 Final Push to 95%+ Responsive Compliance\n');
  console.log('='.repeat(70));
  console.log('\nNO SHORTCUTS. NO COMPROMISES. PUSHING TO EXCELLENCE.\n');
  console.log('='.repeat(70));

  const srcDir = path.join(ROOT_DIR, 'src');
  const allFiles = walkDirectory(srcDir);
  const results = allFiles.map(fixFile);
  
  const modifiedFiles = results.filter(r => r.modified);
  const totalFixes = results.reduce((sum, r) => sum + r.fixes, 0);

  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL PUSH RESULTS\n');
  console.log(`✅ Files Processed: ${results.length}`);
  console.log(`🔧 Files Modified: ${modifiedFiles.length}`);
  console.log(`⚡ Total Fixes Applied: ${totalFixes}`);

  if (modifiedFiles.length > 0) {
    console.log('\n📝 Top Modified Files:\n');
    modifiedFiles
      .sort((a, b) => b.fixes - a.fixes)
      .slice(0, 15)
      .forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.file} (${r.fixes} fixes)`);
      });
    
    if (modifiedFiles.length > 15) {
      console.log(`   ... and ${modifiedFiles.length - 15} more files`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`\n🎉 FINAL PUSH COMPLETE!`);
  console.log(`⚡ ${totalFixes} additional improvements applied\n`);
  console.log('💡 Run final audit:\n');
  console.log('   node scripts/comprehensive-responsive-audit.js\n');
  console.log('='.repeat(70));
}

main();
