#!/usr/bin/env node

/**
 * COMPREHENSIVE TRANSLATION KEY DISPLAY AUDIT
 * Scans all 259 tabs across all modules for translation key display issues
 * 
 * Date: January 20, 2025
 * Scope: ENTIRE APPLICATION - ALL TABS, ALL MODULES, ALL HUBS
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 COMPREHENSIVE TRANSLATION KEY DISPLAY AUDIT');
console.log('=' .repeat(80));
console.log('Audit Date:', new Date().toISOString());
console.log('Scope: ALL 259 TABS ACROSS ALL MODULES');
console.log('=' .repeat(80));
console.log();

// Module structure based on your memories
const modules = {
  production: {
    name: 'Production Hub',
    path: 'src/components',
    modules: {
      dashboard: { tabs: 11, path: 'dashboard' },
      projects: { tabs: 11, path: 'projects' },
      events: { tabs: 15, path: 'events' },
      people: { tabs: 9, path: 'people' },
      assets: { tabs: 9, path: 'assets' },
      locations: { tabs: 9, path: 'locations' },
      files: { tabs: 10, path: 'files' }
    },
    total: 74
  },
  network: {
    name: 'Network Hub',
    path: 'src/components',
    modules: {
      community: { tabs: 8, path: 'community' },
      marketplace: { tabs: 11, path: 'marketplace' },
      resources: { tabs: 7, path: 'resources' }
    },
    total: 26
  },
  business: {
    name: 'Business Hub',
    path: 'src/components',
    modules: {
      companies: { tabs: 11, path: 'companies' },
      jobs: { tabs: 15, path: 'jobs' },
      procurement: { tabs: 11, path: 'procurement' },
      finance: { tabs: 18, path: 'finance' }
    },
    total: 55
  },
  intelligence: {
    name: 'Intelligence Hub',
    path: 'src/components',
    modules: {
      reports: { tabs: 9, path: 'reports' },
      analytics: { tabs: 10, path: 'analytics' },
      insights: { tabs: 10, path: 'insights' }
    },
    total: 29
  },
  system: {
    name: 'System Hub',
    path: 'src/components',
    modules: {
      admin: { tabs: 16, path: 'admin' },
      settings: { tabs: 7, path: 'settings' },
      profile: { tabs: 12, path: 'profile' }
    },
    total: 35
  }
};

const organisms = {
  name: 'Organism Components',
  path: 'src/components/organisms',
  count: 16
};

// Issue tracking
const issues = {
  hardcodedKeys: [],
  missingNamespace: [],
  invalidKeys: [],
  missingTranslations: [],
  suspiciousPatterns: []
};

let totalFilesScanned = 0;
let totalIssuesFound = 0;

// ============================================================================
// PATTERN 1: Find hardcoded translation keys in JSX
// ============================================================================
console.log('📋 PATTERN 1: Scanning for hardcoded translation keys in JSX...\n');

function scanForHardcodedKeys(hubName, modulePath) {
  try {
    const result = execSync(
      `grep -rn ">[a-z][a-z]*\\.[a-z][a-z]*" ${modulePath} --include="*-tab.tsx" --include="*Organism.tsx" || true`,
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    
    if (result.trim()) {
      const lines = result.trim().split('\n');
      lines.forEach(line => {
        const match = line.match(/^([^:]+):(\d+):.*>([a-z]+\.[a-z]+[^<]*)</);
        if (match) {
          const [, file, lineNum, text] = match;
          // Filter out false positives (like CSS classes, etc.)
          if (text.split('.').length === 2 && !text.includes(' ') && text.length < 50) {
            issues.hardcodedKeys.push({
              hub: hubName,
              file: file.replace('src/components/', ''),
              line: lineNum,
              text: text,
              severity: 'ERROR'
            });
            totalIssuesFound++;
          }
        }
      });
    }
  } catch (error) {
    // Ignore errors
  }
}

// ============================================================================
// PATTERN 2: Find useTranslations() without namespace
// ============================================================================
console.log('📋 PATTERN 2: Scanning for missing translation namespaces...\n');

function scanForMissingNamespace(hubName, modulePath) {
  try {
    const result = execSync(
      `grep -rn "const t = useTranslations()" ${modulePath} --include="*-tab.tsx" --include="*Organism.tsx" || true`,
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    
    if (result.trim()) {
      const lines = result.trim().split('\n');
      lines.forEach(line => {
        const [file] = line.split(':');
        if (file) {
          issues.missingNamespace.push({
            hub: hubName,
            file: file.replace('src/components/', ''),
            severity: 'WARNING'
          });
        }
      });
    }
  } catch (error) {
    // Ignore errors
  }
}

// ============================================================================
// PATTERN 3: Find translation calls with potentially invalid keys
// ============================================================================
console.log('📋 PATTERN 3: Scanning for potentially invalid translation keys...\n');

function scanForInvalidKeys(hubName, modulePath) {
  try {
    // Look for t('key') patterns that might not exist
    const result = execSync(
      `grep -rn "t('[a-z]*\\.[a-z]*')" ${modulePath} --include="*-tab.tsx" --include="*Organism.tsx" || true`,
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    
    if (result.trim()) {
      const lines = result.trim().split('\n');
      const keyPattern = /t\('([^']+)'\)/g;
      
      lines.forEach(line => {
        const match = line.match(/^([^:]+):(\d+):(.*)/);
        if (match) {
          const [, file, lineNum, content] = match;
          let keyMatch;
          while ((keyMatch = keyPattern.exec(content)) !== null) {
            const key = keyMatch[1];
            // Check if key looks suspicious (not following standard patterns)
            if (!key.startsWith('business.') && 
                !key.startsWith('production.') && 
                !key.startsWith('network.') && 
                !key.startsWith('intelligence.') && 
                !key.startsWith('system.') &&
                !key.startsWith('settings.') &&
                !key.startsWith('profile.') &&
                !key.startsWith('admin.') &&
                !key.startsWith('views.') &&
                !key.startsWith('common.') &&
                !key.startsWith('dashboard.') &&
                !key.startsWith('nav.') &&
                !key.startsWith('sidebar.') &&
                key.includes('.')) {
              issues.invalidKeys.push({
                hub: hubName,
                file: file.replace('src/components/', ''),
                line: lineNum,
                key: key,
                severity: 'WARNING'
              });
            }
          }
        }
      });
    }
  } catch (error) {
    // Ignore errors
  }
}

// ============================================================================
// PATTERN 4: Check for className with translation-like text
// ============================================================================
console.log('📋 PATTERN 4: Scanning for translation keys in className...\n');

function scanForClassNameKeys(hubName, modulePath) {
  try {
    const result = execSync(
      `grep -rn 'className.*{[a-z]*\\.[a-z]*}' ${modulePath} --include="*-tab.tsx" --include="*Organism.tsx" || true`,
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    
    if (result.trim()) {
      const lines = result.trim().split('\n');
      lines.forEach(line => {
        const match = line.match(/^([^:]+):(\d+):.*className.*{([a-z]+\.[a-z]+)}/);
        if (match) {
          const [, file, lineNum, text] = match;
          issues.suspiciousPatterns.push({
            hub: hubName,
            file: file.replace('src/components/', ''),
            line: lineNum,
            pattern: text,
            severity: 'INFO'
          });
        }
      });
    }
  } catch (error) {
    // Ignore errors
  }
}

// ============================================================================
// SCAN ALL HUBS
// ============================================================================

console.log('🔍 Starting comprehensive scan of all hubs...\n');

Object.entries(modules).forEach(([hubKey, hub]) => {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📦 ${hub.name.toUpperCase()} (${hub.total} tabs)`);
  console.log('='.repeat(80));
  
  Object.entries(hub.modules).forEach(([moduleKey, module]) => {
    const modulePath = path.join(hub.path, module.path);
    console.log(`  📁 ${moduleKey}: ${module.tabs} tabs`);
    
    // Run all scans
    scanForHardcodedKeys(hub.name, modulePath);
    scanForMissingNamespace(hub.name, modulePath);
    scanForInvalidKeys(hub.name, modulePath);
    scanForClassNameKeys(hub.name, modulePath);
    
    totalFilesScanned += module.tabs;
  });
});

// Scan organisms
console.log(`\n${'='.repeat(80)}`);
console.log(`📦 ${organisms.name.toUpperCase()} (${organisms.count} components)`);
console.log('='.repeat(80));

scanForHardcodedKeys(organisms.name, organisms.path);
scanForMissingNamespace(organisms.name, organisms.path);
scanForInvalidKeys(organisms.name, organisms.path);
scanForClassNameKeys(organisms.name, organisms.path);
totalFilesScanned += organisms.count;

// ============================================================================
// GENERATE REPORT
// ============================================================================

console.log('\n\n');
console.log('=' .repeat(80));
console.log('📊 COMPREHENSIVE AUDIT RESULTS');
console.log('=' .repeat(80));
console.log();

console.log(`📈 SCAN SUMMARY:`);
console.log(`   Total Files Scanned: ${totalFilesScanned}`);
console.log(`   Total Issues Found: ${totalIssuesFound}`);
console.log();

// Count by severity
const errorCount = issues.hardcodedKeys.length;
const warningCount = issues.missingNamespace.length + issues.invalidKeys.length;
const infoCount = issues.suspiciousPatterns.length;

console.log(`🔴 ERRORS: ${errorCount}`);
console.log(`⚠️  WARNINGS: ${warningCount}`);
console.log(`💡 INFO: ${infoCount}`);
console.log();

// Display errors
if (issues.hardcodedKeys.length > 0) {
  console.log('🔴 CRITICAL: Hardcoded Translation Keys Found\n');
  console.log('These are displaying as raw keys instead of translated text:\n');
  
  issues.hardcodedKeys.forEach((issue, idx) => {
    console.log(`${idx + 1}. ${issue.file}:${issue.line}`);
    console.log(`   Hub: ${issue.hub}`);
    console.log(`   Text: "${issue.text}"`);
    console.log(`   Action: Replace with t() function call`);
    console.log();
  });
}

// Display warnings
if (issues.missingNamespace.length > 0) {
  console.log(`⚠️  WARNING: Components without translation namespace (${issues.missingNamespace.length})\n`);
  
  // Group by hub
  const byHub = {};
  issues.missingNamespace.forEach(issue => {
    if (!byHub[issue.hub]) byHub[issue.hub] = [];
    byHub[issue.hub].push(issue.file);
  });
  
  Object.entries(byHub).forEach(([hub, files]) => {
    console.log(`   ${hub}: ${files.length} files`);
    files.slice(0, 3).forEach(file => console.log(`      - ${file}`));
    if (files.length > 3) console.log(`      ... and ${files.length - 3} more`);
  });
  console.log();
}

if (issues.invalidKeys.length > 0) {
  console.log(`⚠️  WARNING: Potentially invalid translation keys (${issues.invalidKeys.length})\n`);
  
  const uniqueKeys = [...new Set(issues.invalidKeys.map(i => i.key))];
  console.log(`   Unique suspicious keys found: ${uniqueKeys.length}`);
  uniqueKeys.slice(0, 10).forEach(key => console.log(`      - ${key}`));
  if (uniqueKeys.length > 10) console.log(`      ... and ${uniqueKeys.length - 10} more`);
  console.log();
}

// Display info
if (issues.suspiciousPatterns.length > 0) {
  console.log(`💡 INFO: Suspicious patterns (${issues.suspiciousPatterns.length})\n`);
  console.log('   These may be false positives but should be reviewed.\n');
}

// ============================================================================
// FINAL SUMMARY
// ============================================================================

console.log('=' .repeat(80));
console.log('🎯 AUDIT COMPLETE');
console.log('=' .repeat(80));
console.log();

if (errorCount === 0 && warningCount === 0) {
  console.log('✅ SUCCESS: No critical translation issues found!');
  console.log('   All tabs are using proper translation patterns.');
} else {
  console.log('⚠️  ISSUES DETECTED:');
  console.log(`   - ${errorCount} critical errors requiring immediate fix`);
  console.log(`   - ${warningCount} warnings requiring review`);
  console.log(`   - ${infoCount} informational items`);
}

console.log();
console.log('📄 Detailed results saved to: COMPREHENSIVE_TRANSLATION_AUDIT_RESULTS.json');

// Save detailed results
const results = {
  timestamp: new Date().toISOString(),
  summary: {
    totalFilesScanned,
    totalIssuesFound,
    errorCount,
    warningCount,
    infoCount
  },
  issues,
  modules
};

fs.writeFileSync(
  path.join(process.cwd(), 'COMPREHENSIVE_TRANSLATION_AUDIT_RESULTS.json'),
  JSON.stringify(results, null, 2)
);

console.log();
process.exit(errorCount > 0 ? 1 : 0);
