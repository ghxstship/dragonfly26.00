#!/usr/bin/env node

/**
 * Marketing Card Alignment Fix Script
 * 
 * Applies responsive center alignment to marketing page cards
 * following industry best practices (Stripe, Vercel, Linear, etc.)
 */

const fs = require('fs');
const path = require('path');

const results = {
  filesProcessed: 0,
  filesModified: 0,
  cardsFixed: 0,
  errors: [],
};

// Files to process (remaining marketing pages)
const filesToProcess = [
  'src/app/[locale]/(marketing)/careers/page.tsx',
  'src/app/[locale]/(marketing)/careers/[id]/page.tsx',
  'src/app/[locale]/(marketing)/case-studies/page.tsx',
  'src/app/[locale]/(marketing)/changelog/page.tsx',
  'src/app/[locale]/(marketing)/compare/page.tsx',
  'src/app/[locale]/(marketing)/demo/page.tsx',
  'src/app/[locale]/(marketing)/docs/page.tsx',
  'src/app/[locale]/(marketing)/security/page.tsx',
  'src/app/[locale]/(marketing)/status/page.tsx',
  'src/marketing/components/MarketingNav.tsx',
];

// Patterns to fix
const patterns = [
  // Pattern 1: Card-like divs with border and rounded corners
  {
    name: 'Card with border and rounded',
    regex: /className="([^"]*\bborder\b[^"]*\brounded[^"]*)"/g,
    shouldFix: (className) => {
      // Only fix if it doesn't already have mx-auto and max-w
      return !className.includes('mx-auto') && !className.includes('max-w-');
    },
    fix: (className) => {
      // Add mx-auto and max-w-sm md:max-w-none
      if (!className.includes('mx-auto')) {
        className = 'mx-auto ' + className;
      }
      if (!className.includes('max-w-')) {
        className = className + ' max-w-sm md:max-w-none';
      }
      // Make padding responsive if it's fixed
      if (className.includes(' p-6 ') && !className.includes('md:p-')) {
        className = className.replace(' p-6 ', ' p-4 md:p-6 ');
      }
      if (className.includes(' p-8 ') && !className.includes('md:p-')) {
        className = className.replace(' p-8 ', ' p-4 md:p-6 lg:p-8 ');
      }
      return className;
    }
  },
  // Pattern 2: Grid containers without explicit grid-cols-1
  {
    name: 'Grid without grid-cols-1',
    regex: /className="([^"]*\bgrid\b[^"]*\bmd:grid-cols-[^"]*)"/g,
    shouldFix: (className) => {
      return !className.includes('grid-cols-1') && className.includes('grid ');
    },
    fix: (className) => {
      // Add grid-cols-1 after 'grid '
      className = className.replace(/\bgrid\s/, 'grid grid-cols-1 ');
      // Make gaps responsive
      if (className.includes(' gap-8') && !className.includes('md:gap-')) {
        className = className.replace(' gap-8', ' gap-4 md:gap-8');
      }
      if (className.includes(' gap-6') && !className.includes('md:gap-')) {
        className = className.replace(' gap-6', ' gap-4 md:gap-6');
      }
      return className;
    }
  },
];

function processFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Skipping ${filePath} (not found)`);
      return;
    }

    results.filesProcessed++;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    let fixCount = 0;

    // Apply each pattern
    patterns.forEach(pattern => {
      const matches = [...content.matchAll(pattern.regex)];
      
      matches.forEach(match => {
        const originalClassName = match[1];
        
        if (pattern.shouldFix(originalClassName)) {
          const fixedClassName = pattern.fix(originalClassName);
          
          if (fixedClassName !== originalClassName) {
            content = content.replace(
              `className="${originalClassName}"`,
              `className="${fixedClassName}"`
            );
            modified = true;
            fixCount++;
          }
        }
      });
    });

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      results.filesModified++;
      results.cardsFixed += fixCount;
      console.log(`✅ Fixed ${filePath} (${fixCount} cards)`);
    } else {
      console.log(`⏭️  Skipped ${filePath} (no changes needed)`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    results.errors.push({ file: filePath, error: error.message });
  }
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('MARKETING CARD ALIGNMENT FIX - RESULTS');
  console.log('='.repeat(80) + '\n');

  console.log('📊 SUMMARY');
  console.log('-'.repeat(80));
  console.log(`Files Processed: ${results.filesProcessed}`);
  console.log(`Files Modified: ${results.filesModified}`);
  console.log(`Cards Fixed: ${results.cardsFixed}`);
  console.log(`Errors: ${results.errors.length}`);
  console.log('');

  if (results.errors.length > 0) {
    console.log('❌ ERRORS:');
    results.errors.forEach(({ file, error }) => {
      console.log(`  ${file}: ${error}`);
    });
    console.log('');
  }

  console.log('✅ COMPLETE!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Review changes in git diff');
  console.log('2. Test responsive behavior across breakpoints');
  console.log('3. Verify no visual regressions');
  console.log('');
}

// Main execution
console.log('Starting marketing card alignment fixes...\n');

filesToProcess.forEach(processFile);

generateReport();
