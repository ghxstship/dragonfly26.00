#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════');
console.log('   COMPREHENSIVE FULL-STACK CODEBASE AUDIT - DRAGONFLY26.00');
console.log('═══════════════════════════════════════════════════════════════\n');

const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const componentsDir = path.join(srcDir, 'components');
const modulesDir = path.join(srcDir, 'lib', 'modules');
const hooksDir = path.join(srcDir, 'hooks');
const migrationsDir = path.join(rootDir, 'supabase', 'migrations');

// Utility functions
function countFiles(dir, ext) {
  if (!fs.existsSync(dir)) return { count: 0, files: [] };
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      const result = countFiles(fullPath, ext);
      files.push(...result.files);
    } else if (item.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  
  return { count: files.length, files };
}

function countLinesInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (e) {
    return 0;
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (e) {
    return 0;
  }
}

function analyzeMockData(mockDataFile) {
  if (!fs.existsSync(mockDataFile)) {
    return { exists: false, dataTypes: [], exportCount: 0, lines: 0 };
  }
  
  const content = fs.readFileSync(mockDataFile, 'utf8');
  const lines = content.split('\n').length;
  const exports = (content.match(/export const/g) || []).length;
  
  return {
    exists: true,
    exportCount: exports,
    lines,
    hasData: lines > 50, // Arbitrary threshold
  };
}

function analyzeComponentDirectory(componentDir) {
  if (!fs.existsSync(componentDir)) {
    return { exists: false, components: [] };
  }
  
  const components = [];
  const items = fs.readdirSync(componentDir, { withFileTypes: true });
  
  for (const item of items) {
    if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) {
      const fullPath = path.join(componentDir, item.name);
      const lines = countLinesInFile(fullPath);
      const size = getFileSize(fullPath);
      components.push({ name: item.name, lines, size });
    }
  }
  
  return {
    exists: true,
    componentCount: components.length,
    totalLines: components.reduce((sum, c) => sum + c.lines, 0),
    components,
  };
}

function checkSupabaseIntegration(componentFile) {
  if (!fs.existsSync(componentFile)) return { hasSupabase: false, hasMock: false };
  
  const content = fs.readFileSync(componentFile, 'utf8');
  return {
    hasSupabase: content.includes('supabase') || content.includes('createClient'),
    hasMock: content.includes('mock') || content.includes('DEMO_MODE'),
    hasQuery: content.includes('useQuery') || content.includes('from('),
  };
}

// === MAIN AUDIT ===

const audit = {
  timestamp: new Date().toISOString(),
  modules: {},
  summary: {
    totalModules: 0,
    totalTabs: 0,
    totalComponents: 0,
    totalMockDataFiles: 0,
    totalHooks: 0,
    totalMigrations: 0,
    totalLines: 0,
  },
  gaps: [],
  warnings: [],
};

// Read tabs registry
console.log('📋 Analyzing tabs registry...\n');
const tabsRegistryPath = path.join(modulesDir, 'tabs-registry.ts');
let tabsRegistry = {};

if (fs.existsSync(tabsRegistryPath)) {
  const content = fs.readFileSync(tabsRegistryPath, 'utf8');
  
  // Extract module names from MODULE_TABS
  const moduleRegex = /(\w+):\s*\[/g;
  let match;
  while ((match = moduleRegex.exec(content)) !== null) {
    const moduleName = match[1];
    
    // Count tabs for this module
    const tabPattern = new RegExp(`${moduleName}:\\s*\\[([\\s\\S]*?)\\]`, 'g');
    const tabMatch = tabPattern.exec(content);
    if (tabMatch) {
      const tabContent = tabMatch[1];
      const tabCount = (tabContent.match(/createTab\(/g) || []).length;
      tabsRegistry[moduleName] = { tabs: tabCount };
      audit.summary.totalTabs += tabCount;
    }
  }
  
  audit.summary.totalModules = Object.keys(tabsRegistry).length;
  console.log(`✓ Found ${audit.summary.totalModules} modules with ${audit.summary.totalTabs} total tabs\n`);
} else {
  audit.warnings.push('tabs-registry.ts not found');
}

// Analyze each module
console.log('🔍 Auditing modules...\n');

for (const moduleName of Object.keys(tabsRegistry)) {
  const moduleData = {
    name: moduleName,
    tabs: tabsRegistry[moduleName].tabs,
    mockData: {},
    components: {},
    supabaseIntegration: false,
    status: 'complete',
    issues: [],
  };
  
  // Check mock data file
  const mockDataFile = path.join(modulesDir, `${moduleName}-mock-data.ts`);
  moduleData.mockData = analyzeMockData(mockDataFile);
  
  if (moduleData.mockData.exists) {
    audit.summary.totalMockDataFiles++;
  } else {
    moduleData.issues.push('Missing mock data file');
    audit.gaps.push(`${moduleName}: No mock data file found`);
  }
  
  // Check component directory
  const componentDir = path.join(componentsDir, moduleName);
  moduleData.components = analyzeComponentDirectory(componentDir);
  
  if (moduleData.components.exists) {
    audit.summary.totalComponents += moduleData.components.componentCount;
    audit.summary.totalLines += moduleData.components.totalLines;
    
    // Check for Supabase integration in main component files
    const mainComponentFile = path.join(componentDir, `${moduleName}-list.tsx`);
    moduleData.supabaseIntegration = checkSupabaseIntegration(mainComponentFile);
  } else {
    moduleData.issues.push('Missing component directory');
    audit.gaps.push(`${moduleName}: No component directory found`);
  }
  
  // Determine status
  if (moduleData.issues.length > 0) {
    moduleData.status = 'incomplete';
  } else if (!moduleData.mockData.hasData) {
    moduleData.status = 'minimal-mock-data';
  } else if (!moduleData.supabaseIntegration.hasSupabase && !moduleData.supabaseIntegration.hasMock) {
    moduleData.status = 'no-data-layer';
  }
  
  audit.modules[moduleName] = moduleData;
  
  // Progress output
  const statusIcon = moduleData.status === 'complete' ? '✓' : moduleData.status === 'incomplete' ? '✗' : '⚠';
  console.log(`${statusIcon} ${moduleName.padEnd(15)} | Tabs: ${String(moduleData.tabs).padEnd(3)} | Components: ${String(moduleData.components.componentCount || 0).padEnd(3)} | Mock: ${moduleData.mockData.exists ? '✓' : '✗'} | Status: ${moduleData.status}`);
}

// Analyze hooks
console.log('\n🎣 Analyzing hooks...\n');
const hooksResult = countFiles(hooksDir, '.ts');
audit.summary.totalHooks = hooksResult.count;
console.log(`✓ Found ${audit.summary.totalHooks} custom hooks\n`);

// Analyze migrations
console.log('🗄️  Analyzing Supabase migrations...\n');
const migrationsResult = countFiles(migrationsDir, '.sql');
audit.summary.totalMigrations = migrationsResult.count;
console.log(`✓ Found ${audit.summary.totalMigrations} migration files\n`);

// === SUMMARY REPORT ===

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('                      AUDIT SUMMARY                            ');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('📊 STATISTICS:');
console.log(`   Total Modules:        ${audit.summary.totalModules}`);
console.log(`   Total Tabs:           ${audit.summary.totalTabs}`);
console.log(`   Total Components:     ${audit.summary.totalComponents}`);
console.log(`   Total Mock Data Files: ${audit.summary.totalMockDataFiles}`);
console.log(`   Total Hooks:          ${audit.summary.totalHooks}`);
console.log(`   Total Migrations:     ${audit.summary.totalMigrations}`);
console.log(`   Total Lines of Code:  ${audit.summary.totalLines.toLocaleString()}`);

const completeModules = Object.values(audit.modules).filter(m => m.status === 'complete').length;
const incompleteModules = Object.values(audit.modules).filter(m => m.status === 'incomplete').length;
const minimalModules = Object.values(audit.modules).filter(m => m.status === 'minimal-mock-data').length;

console.log(`\n✅ Complete Modules:     ${completeModules} (${Math.round(completeModules/audit.summary.totalModules*100)}%)`);
console.log(`⚠️  Minimal Mock Data:    ${minimalModules}`);
console.log(`❌ Incomplete Modules:   ${incompleteModules}`);

if (audit.gaps.length > 0) {
  console.log(`\n⚠️  IDENTIFIED GAPS (${audit.gaps.length}):`);
  audit.gaps.forEach(gap => console.log(`   • ${gap}`));
}

if (audit.warnings.length > 0) {
  console.log(`\n⚠️  WARNINGS (${audit.warnings.length}):`);
  audit.warnings.forEach(warning => console.log(`   • ${warning}`));
}

// Deployment readiness
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('              DEPLOYMENT READINESS ASSESSMENT                  ');
console.log('═══════════════════════════════════════════════════════════════\n');

const deploymentScore = Math.round(
  (completeModules / audit.summary.totalModules) * 100
);

console.log(`🎯 Deployment Readiness Score: ${deploymentScore}%\n`);

if (deploymentScore >= 95) {
  console.log('✅ STATUS: DEPLOYMENT READY - Enterprise grade quality achieved');
} else if (deploymentScore >= 85) {
  console.log('⚠️  STATUS: NEAR READY - Minor gaps remain');
} else if (deploymentScore >= 70) {
  console.log('⚠️  STATUS: SUBSTANTIAL PROGRESS - Significant work remaining');
} else {
  console.log('❌ STATUS: NOT READY - Major implementation gaps');
}

// Save audit report
const reportPath = path.join(rootDir, 'AUDIT_REPORT.json');
fs.writeFileSync(reportPath, JSON.stringify(audit, null, 2));
console.log(`\n📄 Full audit report saved to: AUDIT_REPORT.json`);

console.log('\n═══════════════════════════════════════════════════════════════\n');

// Exit code based on deployment readiness
process.exit(deploymentScore >= 95 ? 0 : 1);
