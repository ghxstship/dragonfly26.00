#!/usr/bin/env node

/**
 * Comprehensive Codebase Architecture Audit
 * Analyzes directory structure, identifies issues, and generates optimization recommendations
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Issues to track
const issues = {
  duplicateFiles: [],
  obsoleteFiles: [],
  misplacedFiles: [],
  unnecessaryDirectories: [],
  largeFiles: [],
  emptyDirectories: [],
  buildArtifacts: [],
  temporaryFiles: [],
  inconsistentNaming: [],
  deepNesting: [],
  scriptOrganization: [],
  docOrganization: []
};

const stats = {
  totalFiles: 0,
  totalDirectories: 0,
  totalSize: 0,
  filesByExtension: {},
  filesByDirectory: {}
};

// Patterns to identify
const OBSOLETE_PATTERNS = [
  /\.log$/,
  /\.bak$/,
  /\.old$/,
  /\.backup$/,
  /-old\./,
  /-backup\./,
  /\.temp$/,
  /\.tmp$/,
  /~$/
];

const BUILD_ARTIFACTS = [
  '.next',
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  '.turbo',
  '.cache'
];

const SCRIPT_CATEGORIES = {
  accessibility: /accessibility|aria|wcag/i,
  i18n: /i18n|translation|translate|language|locale/i,
  database: /database|migration|supabase|sql|schema/i,
  responsive: /responsive|mobile|breakpoint/i,
  typography: /typography|font|heading/i,
  marketing: /marketing|landing|pricing/i,
  audit: /audit|verify|validate|check/i,
  fix: /fix|repair|remediate/i,
  generation: /generate|create/i,
  testing: /test|spec/i,
  deployment: /deploy|build|production/i
};

const DOC_CATEGORIES = {
  audits: /audit|report|analysis/i,
  guides: /guide|tutorial|how-to/i,
  specifications: /spec|specification|requirement/i,
  completion: /complete|certification|100.*percent/i,
  architecture: /architecture|design|pattern/i,
  business: /business|pricing|marketing/i,
  developer: /developer|api|technical/i
};

function scanDirectory(dir, depth = 0, relativePath = '') {
  if (BUILD_ARTIFACTS.some(artifact => dir.includes(artifact))) {
    return;
  }

  try {
    const items = fs.readdirSync(dir);
    
    if (items.length === 0) {
      issues.emptyDirectories.push(relativePath || dir);
    }

    stats.totalDirectories++;

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relPath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (depth > 6) {
          issues.deepNesting.push(relPath);
        }
        scanDirectory(fullPath, depth + 1, relPath);
      } else {
        stats.totalFiles++;
        stats.totalSize += stat.size;

        const ext = path.extname(item);
        stats.filesByExtension[ext] = (stats.filesByExtension[ext] || 0) + 1;

        const dirName = path.dirname(relPath);
        stats.filesByDirectory[dirName] = (stats.filesByDirectory[dirName] || 0) + 1;

        // Check for obsolete files
        if (OBSOLETE_PATTERNS.some(pattern => pattern.test(item))) {
          issues.obsoleteFiles.push(relPath);
        }

        // Check for large files (> 1MB, excluding node_modules)
        if (stat.size > 1024 * 1024) {
          issues.largeFiles.push({
            path: relPath,
            size: (stat.size / 1024 / 1024).toFixed(2) + ' MB'
          });
        }

        // Check for build artifacts in root
        if (depth === 0 && /\.(log|tsbuildinfo)$/.test(item)) {
          issues.buildArtifacts.push(relPath);
        }

        // Check naming consistency
        if (/[A-Z]/.test(item) && !/^[A-Z_]+\.(md|txt|json)$/.test(item) && !item.includes('README')) {
          const dir = path.dirname(relPath);
          if (!dir.includes('public') && !dir.includes('email-templates')) {
            issues.inconsistentNaming.push(relPath);
          }
        }
      }
    }
  } catch (error) {
    // Skip inaccessible directories
  }
}

function analyzeScripts() {
  const scriptsDir = path.join(ROOT, 'scripts');
  const scripts = fs.readdirSync(scriptsDir).filter(f => !fs.statSync(path.join(scriptsDir, f)).isDirectory());
  
  const categorized = {};
  const uncategorized = [];

  for (const script of scripts) {
    let category = null;
    for (const [cat, pattern] of Object.entries(SCRIPT_CATEGORIES)) {
      if (pattern.test(script)) {
        category = cat;
        break;
      }
    }

    if (category) {
      categorized[category] = categorized[category] || [];
      categorized[category].push(script);
    } else {
      uncategorized.push(script);
    }
  }

  issues.scriptOrganization = {
    total: scripts.length,
    categorized,
    uncategorized,
    recommendation: 'Organize scripts into subdirectories by category'
  };
}

function analyzeDocs() {
  const docsDir = path.join(ROOT, 'docs');
  const docs = fs.readdirSync(docsDir).filter(f => {
    const fullPath = path.join(docsDir, f);
    return fs.statSync(fullPath).isFile();
  });

  const categorized = {};
  const uncategorized = [];

  for (const doc of docs) {
    let category = null;
    for (const [cat, pattern] of Object.entries(DOC_CATEGORIES)) {
      if (pattern.test(doc)) {
        category = cat;
        break;
      }
    }

    if (category) {
      categorized[category] = categorized[category] || [];
      categorized[category].push(doc);
    } else {
      uncategorized.push(doc);
    }
  }

  issues.docOrganization = {
    total: docs.length,
    categorized,
    uncategorized,
    recommendation: 'Many docs already in subdirectories, but root has 46+ files'
  };
}

function identifyDuplicates() {
  const scriptsDir = path.join(ROOT, 'scripts');
  const scripts = fs.readdirSync(scriptsDir).filter(f => !fs.statSync(path.join(scriptsDir, f)).isDirectory());
  
  // Group by similar names
  const groups = {};
  
  for (const script of scripts) {
    const base = script
      .replace(/-(v\d+|final|complete|comprehensive|ultimate|true|perfect|100-percent)/, '')
      .replace(/\.(js|ts|sh|py)$/, '');
    
    groups[base] = groups[base] || [];
    groups[base].push(script);
  }

  for (const [base, files] of Object.entries(groups)) {
    if (files.length > 1) {
      issues.duplicateFiles.push({
        base,
        files,
        count: files.length
      });
    }
  }
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('COMPREHENSIVE CODEBASE ARCHITECTURE AUDIT');
  console.log('='.repeat(80) + '\n');

  console.log('📊 STATISTICS');
  console.log('-'.repeat(80));
  console.log(`Total Files: ${stats.totalFiles.toLocaleString()}`);
  console.log(`Total Directories: ${stats.totalDirectories.toLocaleString()}`);
  console.log(`Total Size: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`\nFiles by Extension:`);
  Object.entries(stats.filesByExtension)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([ext, count]) => {
      console.log(`  ${ext || '(no ext)'}: ${count}`);
    });

  console.log('\n🔍 ISSUES IDENTIFIED');
  console.log('-'.repeat(80));

  // Build Artifacts
  if (issues.buildArtifacts.length > 0) {
    console.log(`\n❌ Build Artifacts in Root (${issues.buildArtifacts.length}):`);
    issues.buildArtifacts.forEach(file => console.log(`  - ${file}`));
    console.log('  → RECOMMENDATION: Move to .gitignore or archive');
  }

  // Obsolete Files
  if (issues.obsoleteFiles.length > 0) {
    console.log(`\n❌ Obsolete Files (${issues.obsoleteFiles.length}):`);
    issues.obsoleteFiles.slice(0, 10).forEach(file => console.log(`  - ${file}`));
    if (issues.obsoleteFiles.length > 10) {
      console.log(`  ... and ${issues.obsoleteFiles.length - 10} more`);
    }
    console.log('  → RECOMMENDATION: Delete or archive');
  }

  // Large Files
  if (issues.largeFiles.length > 0) {
    console.log(`\n⚠️  Large Files (${issues.largeFiles.length}):`);
    issues.largeFiles.slice(0, 10).forEach(({ path, size }) => {
      console.log(`  - ${path} (${size})`);
    });
    if (issues.largeFiles.length > 10) {
      console.log(`  ... and ${issues.largeFiles.length - 10} more`);
    }
    console.log('  → RECOMMENDATION: Review necessity, consider compression or external storage');
  }

  // Duplicate Scripts
  if (issues.duplicateFiles.length > 0) {
    console.log(`\n❌ Duplicate/Similar Scripts (${issues.duplicateFiles.length} groups):`);
    issues.duplicateFiles.slice(0, 10).forEach(({ base, files, count }) => {
      console.log(`  - ${base} (${count} versions):`);
      files.forEach(f => console.log(`    • ${f}`));
    });
    if (issues.duplicateFiles.length > 10) {
      console.log(`  ... and ${issues.duplicateFiles.length - 10} more groups`);
    }
    console.log('  → RECOMMENDATION: Keep latest version, archive others');
  }

  // Script Organization
  console.log(`\n📁 Script Organization (${issues.scriptOrganization.total} scripts):`);
  console.log('  Categorized:');
  Object.entries(issues.scriptOrganization.categorized)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([cat, scripts]) => {
      console.log(`    ${cat}: ${scripts.length} scripts`);
    });
  console.log(`  Uncategorized: ${issues.scriptOrganization.uncategorized.length} scripts`);
  console.log(`  → RECOMMENDATION: ${issues.scriptOrganization.recommendation}`);

  // Doc Organization
  console.log(`\n📄 Documentation Organization (${issues.docOrganization.total} root docs):`);
  console.log('  Categorized:');
  Object.entries(issues.docOrganization.categorized)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([cat, docs]) => {
      console.log(`    ${cat}: ${docs.length} docs`);
    });
  console.log(`  → RECOMMENDATION: ${issues.docOrganization.recommendation}`);

  // Empty Directories
  if (issues.emptyDirectories.length > 0) {
    console.log(`\n⚠️  Empty Directories (${issues.emptyDirectories.length}):`);
    issues.emptyDirectories.slice(0, 5).forEach(dir => console.log(`  - ${dir}`));
    if (issues.emptyDirectories.length > 5) {
      console.log(`  ... and ${issues.emptyDirectories.length - 5} more`);
    }
    console.log('  → RECOMMENDATION: Remove or add .gitkeep');
  }

  // Deep Nesting
  if (issues.deepNesting.length > 0) {
    console.log(`\n⚠️  Deep Nesting (${issues.deepNesting.length} paths > 6 levels):`);
    issues.deepNesting.slice(0, 5).forEach(p => console.log(`  - ${p}`));
    if (issues.deepNesting.length > 5) {
      console.log(`  ... and ${issues.deepNesting.length - 5} more`);
    }
    console.log('  → RECOMMENDATION: Consider flattening structure');
  }

  console.log('\n' + '='.repeat(80));
  console.log('OPTIMIZATION RECOMMENDATIONS');
  console.log('='.repeat(80) + '\n');

  console.log('1. ROOT CLEANUP:');
  console.log('   - Remove build artifacts (*.log, *.tsbuildinfo)');
  console.log('   - Keep only essential config files');
  console.log('   - Move "Full Stack Audit" to docs/');
  console.log('');
  console.log('2. SCRIPTS ORGANIZATION:');
  console.log('   - Create subdirectories: accessibility/, i18n/, database/, etc.');
  console.log('   - Archive obsolete scripts to scripts/archive/');
  console.log('   - Keep only latest versions of duplicate scripts');
  console.log('   - Estimated reduction: 100-150 files → organized structure');
  console.log('');
  console.log('3. DOCS ORGANIZATION:');
  console.log('   - Move root docs to appropriate subdirectories');
  console.log('   - Create docs/archive/ for historical reports');
  console.log('   - Keep only latest completion reports');
  console.log('   - Estimated: 46 root files → organized structure');
  console.log('');
  console.log('4. COMPONENT STRUCTURE:');
  console.log('   - Verify atomic design organization');
  console.log('   - Ensure consistent naming conventions');
  console.log('   - Review deep nesting in src/');
  console.log('');
  console.log('5. MIGRATION CLEANUP:');
  console.log('   - Review 154 migration files');
  console.log('   - Archive .skip files');
  console.log('   - Document migration history');

  // Save detailed report
  const reportPath = path.join(ROOT, 'docs', 'CODEBASE_ARCHITECTURE_AUDIT_2025_11_06.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    stats,
    issues,
    recommendations: {
      priority1: 'Root cleanup - remove build artifacts',
      priority2: 'Scripts organization - create subdirectories',
      priority3: 'Docs organization - move to subdirectories',
      priority4: 'Archive obsolete files',
      priority5: 'Review and consolidate duplicates'
    }
  }, null, 2));

  console.log(`\n✅ Detailed report saved to: ${reportPath}`);
  console.log('\n' + '='.repeat(80) + '\n');
}

// Run audit
console.log('🔍 Scanning codebase...\n');
scanDirectory(ROOT);
analyzeScripts();
analyzeDocs();
identifyDuplicates();
generateReport();
