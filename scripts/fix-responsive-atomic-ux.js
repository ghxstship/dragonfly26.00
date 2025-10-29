#!/usr/bin/env node

/**
 * Automated Responsive UX Remediation Script
 * Applies atomic-level responsive best practices across the codebase
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const DRY_RUN = process.argv.includes('--dry-run');

const fixes = {
  applied: 0,
  skipped: 0,
  errors: 0,
  byType: {}
};

// Fix patterns with their transformations
const FIXES = [
  {
    name: 'grid-mobile-first',
    description: 'Convert grids to mobile-first approach',
    pattern: /className="([^"]*)\bgrid grid-cols-(\d+)(?!\s+grid-cols-1)([^"]*)"/g,
    replacement: (match, before, cols, after) => {
      // Don't fix if already has grid-cols-1
      if (before.includes('grid-cols-1') || after.includes('grid-cols-1')) {
        return match;
      }
      return `className="${before}grid grid-cols-1 sm:grid-cols-${cols}${after}"`;
    },
    priority: 'MEDIUM'
  },
  {
    name: 'bullet-point-wrapping',
    description: 'Fix bullet point list wrapping',
    pattern: /className="([^"]*)\bflex items-start gap-2(?!\s+min-w-0)([^"]*)"/g,
    replacement: (match, before, after) => {
      if (before.includes('min-w-0') || after.includes('min-w-0')) {
        return match;
      }
      return `className="${before}flex items-start gap-2 min-w-0${after}"`;
    },
    priority: 'HIGH'
  },
  {
    name: 'responsive-padding-p8',
    description: 'Make p-8 responsive',
    pattern: /className="([^"]*)\bp-8(?!\s+sm:p-)(?!\s+md:p-)([^"]*)"/g,
    replacement: (match, before, after) => {
      if (before.includes('sm:p-') || after.includes('sm:p-') || 
          before.includes('md:p-') || after.includes('md:p-')) {
        return match;
      }
      return `className="${before}p-4 sm:p-6 md:p-8${after}"`;
    },
    priority: 'MEDIUM'
  },
  {
    name: 'responsive-padding-p6',
    description: 'Make p-6 responsive',
    pattern: /className="([^"]*)\bp-6(?!\s+sm:p-)(?!\s+md:p-)([^"]*)"/g,
    replacement: (match, before, after) => {
      if (before.includes('sm:p-') || after.includes('sm:p-') ||
          before.includes('md:p-') || after.includes('md:p-')) {
        return match;
      }
      return `className="${before}p-4 sm:p-6${after}"`;
    },
    priority: 'MEDIUM'
  },
  {
    name: 'dialog-content-padding',
    description: 'Fix DialogContent padding',
    pattern: /(<DialogContent[^>]*className="[^"]*)\bp-6(?!\s+sm:p-)([^"]*")/g,
    replacement: (match, before, after) => {
      if (before.includes('sm:p-') || after.includes('sm:p-')) {
        return match;
      }
      return `${before}p-4 sm:p-6 md:p-8${after}`;
    },
    priority: 'HIGH'
  },
  {
    name: 'dialog-max-height',
    description: 'Add max-height to DialogContent',
    pattern: /(<DialogContent[^>]*className="(?![^"]*max-h-)(?![^"]*overflow-y-auto)([^"]*)")/g,
    replacement: (match, before, classes) => {
      if (classes.includes('max-h-') || classes.includes('overflow-y-auto')) {
        return match;
      }
      return `${before} max-h-[90vh] overflow-y-auto"`;
    },
    priority: 'HIGH'
  }
];

function findFiles(dir) {
  let results = [];
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        results = results.concat(findFiles(filePath));
      } else if (file.endsWith('.tsx')) {
        results.push(filePath);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }
  return results;
}

function applyFixes(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let fileModified = false;
    const appliedFixes = [];

    for (const fix of FIXES) {
      let matchCount = 0;
      const newContent = content.replace(fix.pattern, (...args) => {
        matchCount++;
        return fix.replacement(...args);
      });

      if (newContent !== content) {
        content = newContent;
        fileModified = true;
        appliedFixes.push({ name: fix.name, count: matchCount, priority: fix.priority });
        
        if (!fixes.byType[fix.name]) {
          fixes.byType[fix.name] = 0;
        }
        fixes.byType[fix.name] += matchCount;
      }
    }

    if (fileModified) {
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, content, 'utf-8');
      }
      fixes.applied++;
      return { modified: true, fixes: appliedFixes };
    } else {
      fixes.skipped++;
      return { modified: false };
    }
  } catch (err) {
    fixes.errors++;
    console.error(`Error processing ${filePath}:`, err.message);
    return { modified: false, error: err.message };
  }
}

function main() {
  console.log('🔧 Starting Responsive UX Remediation...\n');
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  const files = findFiles(COMPONENTS_DIR);
  console.log(`Found ${files.length} component files\n`);

  const results = [];
  let processed = 0;

  for (const file of files) {
    const result = applyFixes(file);
    if (result.modified) {
      const relativePath = path.relative(COMPONENTS_DIR, file);
      results.push({ file: relativePath, ...result });
    }
    processed++;
    
    if (processed % 50 === 0) {
      process.stdout.write(`\rProcessed: ${processed}/${files.length}`);
    }
  }

  console.log(`\rProcessed: ${processed}/${files.length} ✓\n`);

  // Print summary
  console.log('='.repeat(80));
  console.log('REMEDIATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`\nFiles Modified: ${fixes.applied}`);
  console.log(`Files Skipped: ${fixes.skipped}`);
  console.log(`Errors: ${fixes.errors}`);
  console.log(`\nFixes Applied by Type:`);
  
  Object.entries(fixes.byType).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    const fix = FIXES.find(f => f.name === type);
    console.log(`  ${type}: ${count} (${fix.priority})`);
  });

  // Show modified files
  if (results.length > 0 && results.length <= 50) {
    console.log(`\n${'='.repeat(80)}`);
    console.log('MODIFIED FILES');
    console.log('='.repeat(80));
    results.forEach(r => {
      console.log(`\n📄 ${r.file}`);
      r.fixes.forEach(f => {
        console.log(`   ✓ ${f.name} (${f.count} instances) [${f.priority}]`);
      });
    });
  } else if (results.length > 50) {
    console.log(`\n${results.length} files modified (too many to display)`);
  }

  // Save detailed report
  const reportPath = path.join(__dirname, '../docs/audits/RESPONSIVE_UX_REMEDIATION_REPORT.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    summary: fixes,
    modifiedFiles: results
  }, null, 2));

  console.log(`\n📊 Detailed report saved to: ${reportPath}`);
  console.log('\n' + '='.repeat(80));
  
  if (DRY_RUN) {
    console.log('\n⚠️  DRY RUN COMPLETE - Run without --dry-run to apply changes\n');
  } else {
    console.log('\n✅ REMEDIATION COMPLETE\n');
  }

  return fixes.errors > 0 ? 1 : 0;
}

process.exit(main());
