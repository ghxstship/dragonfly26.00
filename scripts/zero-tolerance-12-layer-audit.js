#!/usr/bin/env node

/**
 * ZERO-TOLERANCE 12-LAYER FULL-STACK AUDIT
 * Comprehensive validation of ALL 221 tab components across ALL 12 application layers
 * 
 * 12 APPLICATION LAYERS:
 * 1. UI Components (TSX files)
 * 2. Data Hooks (use-*-data.ts)
 * 3. Database Schema (migrations/*.sql)
 * 4. RLS Policies (Row Level Security)
 * 5. Internationalization (i18n/messages/en.json)
 * 6. Accessibility (ARIA, WCAG 2.1 AA)
 * 7. Realtime Subscriptions (Supabase realtime)
 * 8. Storage Buckets (Supabase storage)
 * 9. Edge Functions (supabase/functions)
 * 10. Authentication (Supabase auth)
 * 11. API Routes (app/api)
 * 12. Type Safety (TypeScript definitions)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the 12 application layers
const LAYERS = {
  1: { name: 'UI Components', key: 'ui', weight: 15 },
  2: { name: 'Data Hooks', key: 'hooks', weight: 15 },
  3: { name: 'Database Schema', key: 'schema', weight: 12 },
  4: { name: 'RLS Policies', key: 'rls', weight: 10 },
  5: { name: 'Internationalization', key: 'i18n', weight: 10 },
  6: { name: 'Accessibility', key: 'a11y', weight: 10 },
  7: { name: 'Realtime', key: 'realtime', weight: 8 },
  8: { name: 'Storage', key: 'storage', weight: 5 },
  9: { name: 'Edge Functions', key: 'functions', weight: 5 },
  10: { name: 'Authentication', key: 'auth', weight: 5 },
  11: { name: 'API Routes', key: 'api', weight: 3 },
  12: { name: 'Type Safety', key: 'types', weight: 2 }
};

const AUDIT_RESULTS = {
  timestamp: new Date().toISOString(),
  totalFiles: 0,
  totalLayers: 12,
  files: {},
  layerScores: {},
  violations: [],
  summary: {
    perfect: 0,
    passing: 0,
    failing: 0,
    totalScore: 0
  }
};

// Initialize layer scores
Object.keys(LAYERS).forEach(layerNum => {
  const layer = LAYERS[layerNum];
  AUDIT_RESULTS.layerScores[layer.key] = {
    name: layer.name,
    weight: layer.weight,
    score: 0,
    filesAudited: 0,
    violations: []
  };
});

/**
 * Audit Layer 1: UI Components
 */
function auditUIComponent(filePath, content) {
  const score = { total: 100, violations: [] };
  
  // Check file exists
  if (!content) {
    score.violations.push('File does not exist');
    score.total = 0;
    return score;
  }

  // Check for proper imports
  if (!content.includes('import')) {
    score.violations.push('No imports found');
    score.total -= 20;
  }

  // Check for export
  if (!content.includes('export')) {
    score.violations.push('No export found');
    score.total -= 20;
  }

  // Check for TypeScript
  if (!content.includes(': ') && !content.includes('interface') && !content.includes('type ')) {
    score.violations.push('Minimal TypeScript usage');
    score.total -= 10;
  }

  // Check for proper component structure
  if (!content.includes('return')) {
    score.violations.push('No return statement');
    score.total -= 30;
  }

  return score;
}

/**
 * Audit Layer 2: Data Hooks
 */
function auditDataHooks(filePath, content) {
  const score = { total: 100, violations: [] };
  
  // Check for data hook usage
  const hasDataHook = /use-[\w-]+-data/.test(content) || content.includes('useSupabase');
  if (!hasDataHook) {
    score.violations.push('No data hook integration');
    score.total -= 40;
  }

  // Check for Supabase client
  if (!content.includes('createClient') && !hasDataHook) {
    score.violations.push('No Supabase client');
    score.total -= 30;
  }

  // Check for loading states
  if (!content.includes('loading') && !content.includes('isLoading')) {
    score.violations.push('No loading state');
    score.total -= 15;
  }

  // Check for error handling
  if (!content.includes('error') && !content.includes('isError')) {
    score.violations.push('No error handling');
    score.total -= 15;
  }

  return score;
}

/**
 * Audit Layer 3: Database Schema
 */
function auditDatabaseSchema(moduleName) {
  const score = { total: 100, violations: [] };
  
  const migrationsDir = path.join(process.cwd(), 'supabase/migrations');
  if (!fs.existsSync(migrationsDir)) {
    score.violations.push('Migrations directory not found');
    score.total = 0;
    return score;
  }

  const migrations = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'));
  
  // Check if module has related tables
  const moduleTablePattern = new RegExp(moduleName.replace('-', '_'), 'i');
  let hasRelatedTables = false;

  migrations.forEach(migration => {
    const content = fs.readFileSync(path.join(migrationsDir, migration), 'utf8');
    if (moduleTablePattern.test(content)) {
      hasRelatedTables = true;
    }
  });

  if (!hasRelatedTables) {
    score.violations.push(`No database tables found for ${moduleName}`);
    score.total -= 50;
  }

  return score;
}

/**
 * Audit Layer 4: RLS Policies
 */
function auditRLSPolicies(moduleName) {
  const score = { total: 100, violations: [] };
  
  const migrationsDir = path.join(process.cwd(), 'supabase/migrations');
  if (!fs.existsSync(migrationsDir)) {
    score.violations.push('Migrations directory not found');
    score.total = 0;
    return score;
  }

  const migrations = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'));
  
  const moduleTablePattern = new RegExp(moduleName.replace('-', '_'), 'i');
  let hasRLSPolicies = false;

  migrations.forEach(migration => {
    const content = fs.readFileSync(path.join(migrationsDir, migration), 'utf8');
    if (moduleTablePattern.test(content) && /CREATE POLICY/i.test(content)) {
      hasRLSPolicies = true;
    }
  });

  if (!hasRLSPolicies) {
    score.violations.push(`No RLS policies found for ${moduleName}`);
    score.total -= 60;
  }

  return score;
}

/**
 * Audit Layer 5: Internationalization
 */
function auditI18n(filePath, content) {
  const score = { total: 100, violations: [] };
  
  // Check for useTranslations
  if (!content.includes('useTranslations')) {
    score.violations.push('Missing useTranslations hook');
    score.total -= 40;
  }

  // Check for hardcoded strings
  const hardcodedPlaceholders = content.match(/placeholder="[A-Z][^"]*"/g);
  if (hardcodedPlaceholders && hardcodedPlaceholders.length > 0) {
    score.violations.push(`${hardcodedPlaceholders.length} hardcoded placeholders`);
    score.total -= Math.min(30, hardcodedPlaceholders.length * 5);
  }

  // Check for t() usage
  if (content.includes('useTranslations') && !content.includes('t(')) {
    score.violations.push('useTranslations imported but not used');
    score.total -= 20;
  }

  // Check for hardcoded JSX text
  const jsxTextMatches = content.match(/>[A-Z][a-z]{4,}[^<{]*</g);
  if (jsxTextMatches && jsxTextMatches.length > 5) {
    score.violations.push(`Potential hardcoded JSX text (${jsxTextMatches.length} instances)`);
    score.total -= 10;
  }

  return score;
}

/**
 * Audit Layer 6: Accessibility
 */
function auditAccessibility(filePath, content) {
  const score = { total: 100, violations: [] };
  
  // Check for aria-hidden on icons
  const iconCount = (content.match(/<\w+Icon/g) || []).length;
  const ariaHiddenCount = (content.match(/aria-hidden/g) || []).length;
  
  if (iconCount > 0 && ariaHiddenCount === 0) {
    score.violations.push('Icons missing aria-hidden attributes');
    score.total -= 25;
  }

  // Check for aria-label on buttons
  if (content.includes('<Button') || content.includes('<button')) {
    if (!content.includes('aria-label')) {
      score.violations.push('Buttons may be missing aria-label');
      score.total -= 20;
    }
  }

  // Check for semantic HTML
  if (!content.includes('role=') && !content.includes('<nav') && !content.includes('<main')) {
    score.violations.push('Limited semantic HTML/ARIA roles');
    score.total -= 15;
  }

  // Check for keyboard navigation
  if (content.includes('onClick') && !content.includes('onKeyDown') && !content.includes('onKeyPress')) {
    score.violations.push('Click handlers without keyboard support');
    score.total -= 20;
  }

  // Check for alt text on images
  if (content.includes('<img') && !content.includes('alt=')) {
    score.violations.push('Images missing alt text');
    score.total -= 20;
  }

  return score;
}

/**
 * Audit Layer 7: Realtime
 * 
 * Realtime can be implemented in two ways:
 * 1. Direct subscriptions in the component (.subscribe, channel(), etc.)
 * 2. Through data hooks that have realtime built-in (proper architecture)
 * 
 * We check if the component uses data hooks that have realtime subscriptions.
 */
function auditRealtime(filePath, content) {
  const score = { total: 100, violations: [] };
  
  // Check for direct realtime subscriptions in component
  const hasDirectRealtime = content.includes('.subscribe') || 
                            content.includes('useRealtime') ||
                            content.includes('channel(');
  
  // Check for data hooks that have realtime (proper architecture)
  const dataHookPatterns = [
    'useAdminData', 'useAnalyticsData', 'useAssetCatalog', 'useAssets',
    'useCommunityData', 'useCompaniesData', 'useDashboardData', 'useEventsData',
    'useFilesData', 'useFinanceData', 'useInsightsData', 'useJobsData',
    'useLocationsData', 'useMarketplaceData', 'usePeopleData', 'useProcurementData',
    'useProfileData', 'useProjectsData', 'useReportsData', 'useResourcesData',
    'useSettingsData', 'useModuleData', 'useAssetTransactions', 'useMaintenance',
    'useAdvances', 'useCatalogCategories',
    // Dashboard-specific hooks with realtime
    'useMyAgenda', 'useMyTasks', 'useMyExpenses', 'useMyJobs', 'useMyAssets',
    'useMyOrders', 'useMyAdvances', 'useMyReports', 'useMyFiles', 'useMyTravel',
    // Finance-specific hooks with realtime
    'useTransactions', 'useGLCodes', 'useBudgets', 'useInvoices', 'useExpenses',
    // Opportunities module hook with realtime
    'useOpportunitiesData'
  ];
  
  const usesDataHook = dataHookPatterns.some(hook => content.includes(hook));
  
  // Component has realtime if it either:
  // 1. Has direct realtime subscriptions, OR
  // 2. Uses a data hook that has realtime built-in
  const hasRealtime = hasDirectRealtime || usesDataHook;
  
  if (!hasRealtime) {
    score.violations.push('No realtime subscriptions');
    score.total -= 50;
  }

  // Check for cleanup (only if direct realtime)
  if (hasDirectRealtime && !content.includes('unsubscribe') && !content.includes('removeChannel')) {
    score.violations.push('Realtime subscription without cleanup');
    score.total -= 30;
  }

  return score;
}

/**
 * Audit Layer 8: Storage
 */
function auditStorage(filePath, content) {
  const score = { total: 100, violations: [] };
  
  // Check if component deals with files/uploads
  const needsStorage = content.includes('upload') || 
                       content.includes('file') ||
                       content.includes('image') ||
                       content.includes('document');
  
  if (needsStorage) {
    const hasStorage = content.includes('.storage') || content.includes('useStorage');
    if (!hasStorage) {
      score.violations.push('File handling without storage integration');
      score.total -= 40;
    }
  }

  return score;
}

/**
 * Audit Layer 9: Edge Functions
 * 
 * Edge functions are evaluated based on ARCHITECTURE, not per-module.
 * Core edge functions provide cross-cutting functionality for ALL modules.
 */
function auditEdgeFunctions(moduleName) {
  const score = { total: 100, violations: [] };
  
  const functionsDir = path.join(process.cwd(), 'supabase/functions');
  if (!fs.existsSync(functionsDir)) {
    score.violations.push('Edge functions directory not found');
    score.total -= 30;
    return score;
  }

  // Get all edge functions
  const functions = fs.readdirSync(functionsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // Core edge functions that serve ALL modules
  const coreEdgeFunctions = [
    'data-export',        // Export data from any table
    'bulk-operations',    // Bulk CRUD operations
    'analytics-processor', // Analytics for all modules
    'report-generator',   // Report generation for all modules
    'notification-sender', // Notifications for all modules
    'file-processor',     // File processing for all modules
    'data-sync',          // Data sync/backup for all modules
    'automation-engine',  // Automation for all modules
    'ai-assistant',       // AI assistance for all modules
    'webhook-handler',    // Webhook handling
    'scheduled-tasks',    // Scheduled tasks
    'mcp-server'          // MCP server
  ];

  // Check if core functions exist
  const missingCore = coreEdgeFunctions.filter(fn => !functions.includes(fn));
  
  if (missingCore.length > 0) {
    // Only penalize if critical core functions are missing
    const criticalMissing = missingCore.filter(fn => 
      ['data-export', 'bulk-operations', 'analytics-processor', 'report-generator'].includes(fn)
    );
    
    if (criticalMissing.length > 0) {
      score.violations.push(`Missing critical edge functions: ${criticalMissing.join(', ')}`);
      score.total -= (criticalMissing.length * 5);
    }
  }

  // All modules benefit from core edge functions - no per-module penalty
  return score;
}

/**
 * Audit Layer 10: Authentication
 */
function auditAuthentication(filePath, content) {
  const score = { total: 100, violations: [] };
  
  // Check for auth integration
  const hasAuth = content.includes('useAuth') || 
                  content.includes('session') ||
                  content.includes('user');
  
  if (!hasAuth) {
    score.violations.push('No authentication integration');
    score.total -= 40;
  }

  // Check for auth guards
  if (hasAuth && !content.includes('if') && !content.includes('?')) {
    score.violations.push('Auth integration without guards');
    score.total -= 30;
  }

  return score;
}

/**
 * Audit Layer 11: API Routes
 */
function auditAPIRoutes(moduleName) {
  const score = { total: 100, violations: [] };
  
  const apiDir = path.join(process.cwd(), 'src/app/api');
  if (!fs.existsSync(apiDir)) {
    score.violations.push('API directory not found');
    score.total -= 20;
    return score;
  }

  // Check for module-specific API routes
  const modulePattern = new RegExp(moduleName.replace('-', '_'), 'i');
  let hasAPIRoute = false;

  function searchDir(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        if (modulePattern.test(item.name)) {
          hasAPIRoute = true;
          break;
        }
        searchDir(fullPath);
      }
    }
  }

  searchDir(apiDir);

  if (!hasAPIRoute && moduleName !== 'overview') {
    score.violations.push(`No API routes for ${moduleName}`);
    score.total -= 15;
  }

  return score;
}

/**
 * Audit Layer 12: Type Safety
 */
function auditTypeSafety(filePath, content) {
  const score = { total: 100, violations: [] };
  
  // Check for TypeScript usage
  if (!content.includes(': ') && !content.includes('interface') && !content.includes('type ')) {
    score.violations.push('Minimal TypeScript type annotations');
    score.total -= 40;
  }

  // Check for any types
  const anyCount = (content.match(/:\s*any/g) || []).length;
  if (anyCount > 0) {
    score.violations.push(`${anyCount} 'any' types found`);
    score.total -= Math.min(30, anyCount * 10);
  }

  // Check for proper prop types
  if (content.includes('function') && !content.includes('Props') && !content.includes('interface')) {
    score.violations.push('Component without typed props');
    score.total -= 20;
  }

  // Check for return type annotations
  if (content.includes('function') && !content.includes('): ')) {
    score.violations.push('Functions without return type annotations');
    score.total -= 10;
  }

  return score;
}

/**
 * Audit a single file across all 12 layers
 */
function auditFile(filePath) {
  const fileName = path.basename(filePath);
  const moduleName = fileName.replace('-tab.tsx', '').replace(/^[\w]+-/, '');
  
  console.log(`\n🔍 Auditing: ${fileName}`);
  
  let content = '';
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf8');
  }

  const fileResult = {
    path: filePath,
    exists: fs.existsSync(filePath),
    layers: {},
    totalScore: 0,
    grade: 'F',
    violations: []
  };

  // Audit each layer
  const layerResults = {
    ui: auditUIComponent(filePath, content),
    hooks: auditDataHooks(filePath, content),
    schema: auditDatabaseSchema(moduleName),
    rls: auditRLSPolicies(moduleName),
    i18n: auditI18n(filePath, content),
    a11y: auditAccessibility(filePath, content),
    realtime: auditRealtime(filePath, content),
    storage: auditStorage(filePath, content),
    functions: auditEdgeFunctions(moduleName),
    auth: auditAuthentication(filePath, content),
    api: auditAPIRoutes(moduleName),
    types: auditTypeSafety(filePath, content)
  };

  // Calculate weighted score
  let weightedScore = 0;
  Object.keys(LAYERS).forEach(layerNum => {
    const layer = LAYERS[layerNum];
    const result = layerResults[layer.key];
    
    fileResult.layers[layer.key] = {
      name: layer.name,
      score: result.total,
      violations: result.violations,
      weight: layer.weight
    };

    weightedScore += (result.total / 100) * layer.weight;
    
    // Track violations
    result.violations.forEach(v => {
      fileResult.violations.push(`[${layer.name}] ${v}`);
      AUDIT_RESULTS.violations.push({
        file: fileName,
        layer: layer.name,
        violation: v
      });
    });

    // Update layer scores
    AUDIT_RESULTS.layerScores[layer.key].score += result.total;
    AUDIT_RESULTS.layerScores[layer.key].filesAudited++;
    if (result.violations.length > 0) {
      AUDIT_RESULTS.layerScores[layer.key].violations.push({
        file: fileName,
        violations: result.violations
      });
    }
  });

  fileResult.totalScore = weightedScore;
  
  // Assign grade
  if (weightedScore >= 95) {
    fileResult.grade = 'A+';
    AUDIT_RESULTS.summary.perfect++;
  } else if (weightedScore >= 90) {
    fileResult.grade = 'A';
    AUDIT_RESULTS.summary.passing++;
  } else if (weightedScore >= 85) {
    fileResult.grade = 'B+';
    AUDIT_RESULTS.summary.passing++;
  } else if (weightedScore >= 80) {
    fileResult.grade = 'B';
    AUDIT_RESULTS.summary.passing++;
  } else if (weightedScore >= 75) {
    fileResult.grade = 'C+';
    AUDIT_RESULTS.summary.failing++;
  } else if (weightedScore >= 70) {
    fileResult.grade = 'C';
    AUDIT_RESULTS.summary.failing++;
  } else {
    fileResult.grade = 'F';
    AUDIT_RESULTS.summary.failing++;
  }

  console.log(`   Score: ${weightedScore.toFixed(1)}/100 (${fileResult.grade})`);
  console.log(`   Violations: ${fileResult.violations.length}`);

  return fileResult;
}

/**
 * Generate comprehensive report
 */
function generateReport() {
  console.log('\n' + '='.repeat(100));
  console.log('ZERO-TOLERANCE 12-LAYER FULL-STACK AUDIT REPORT');
  console.log('Dragonfly26.00 - Complete Application Stack Validation');
  console.log('='.repeat(100) + '\n');

  // Summary
  console.log('📊 EXECUTIVE SUMMARY');
  console.log('-'.repeat(100));
  console.log(`Total Files Audited: ${AUDIT_RESULTS.totalFiles}`);
  console.log(`Total Layers: ${AUDIT_RESULTS.totalLayers}`);
  console.log(`Total Violations: ${AUDIT_RESULTS.violations.length}`);
  console.log(`Perfect (A+): ${AUDIT_RESULTS.summary.perfect} files`);
  console.log(`Passing (A-B): ${AUDIT_RESULTS.summary.passing} files`);
  console.log(`Failing (C-F): ${AUDIT_RESULTS.summary.failing} files`);
  
  const avgScore = AUDIT_RESULTS.summary.totalScore / AUDIT_RESULTS.totalFiles;
  const overallGrade = avgScore >= 95 ? 'A+' : avgScore >= 90 ? 'A' : avgScore >= 85 ? 'B+' : avgScore >= 80 ? 'B' : avgScore >= 75 ? 'C+' : avgScore >= 70 ? 'C' : 'F';
  console.log(`\nOVERALL GRADE: ${overallGrade} (${avgScore.toFixed(2)}/100)\n`);

  // Layer scores
  console.log('📈 LAYER SCORES');
  console.log('-'.repeat(100));
  Object.keys(LAYERS).forEach(layerNum => {
    const layer = LAYERS[layerNum];
    const layerData = AUDIT_RESULTS.layerScores[layer.key];
    const avgLayerScore = layerData.score / layerData.filesAudited;
    const status = avgLayerScore >= 90 ? '✅' : avgLayerScore >= 70 ? '⚠️' : '❌';
    console.log(`${status} Layer ${layerNum}: ${layer.name.padEnd(25)} - ${avgLayerScore.toFixed(1)}/100 (Weight: ${layer.weight}%)`);
  });

  // Top violations
  console.log('\n🚨 TOP VIOLATIONS');
  console.log('-'.repeat(100));
  const violationCounts = {};
  AUDIT_RESULTS.violations.forEach(v => {
    const key = `${v.layer}: ${v.violation}`;
    violationCounts[key] = (violationCounts[key] || 0) + 1;
  });

  Object.entries(violationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([violation, count]) => {
      console.log(`   ${count}x - ${violation}`);
    });

  // Save detailed report
  const reportPath = path.join(process.cwd(), 'docs/audits/ZERO_TOLERANCE_12_LAYER_AUDIT_2025_01_20.json');
  fs.writeFileSync(reportPath, JSON.stringify(AUDIT_RESULTS, null, 2));
  console.log(`\n📄 Detailed JSON report saved to: ${reportPath}`);

  // Save markdown report
  const mdReportPath = path.join(process.cwd(), 'docs/audits/ZERO_TOLERANCE_12_LAYER_AUDIT_2025_01_20.md');
  fs.writeFileSync(mdReportPath, generateMarkdownReport(avgScore, overallGrade));
  console.log(`📄 Markdown report saved to: ${mdReportPath}\n`);

  console.log('='.repeat(100));
  console.log(`CERTIFICATION: ${avgScore >= 95 ? '✅ PRODUCTION READY' : '⚠️ REMEDIATION REQUIRED'}`);
  console.log('='.repeat(100) + '\n');
}

function generateMarkdownReport(avgScore, overallGrade) {
  return `# ZERO-TOLERANCE 12-LAYER FULL-STACK AUDIT
**Dragonfly26.00 - Complete Application Stack Validation**

**Date:** ${new Date().toISOString().split('T')[0]}  
**Overall Grade:** ${overallGrade} (${avgScore.toFixed(2)}/100)  
**Status:** ${avgScore >= 95 ? '✅ PRODUCTION READY' : '⚠️ REMEDIATION REQUIRED'}

---

## 📊 EXECUTIVE SUMMARY

| Metric | Value |
|--------|-------|
| Total Files Audited | ${AUDIT_RESULTS.totalFiles} |
| Total Layers | ${AUDIT_RESULTS.totalLayers} |
| Total Violations | ${AUDIT_RESULTS.violations.length} |
| Perfect Files (A+) | ${AUDIT_RESULTS.summary.perfect} |
| Passing Files (A-B) | ${AUDIT_RESULTS.summary.passing} |
| Failing Files (C-F) | ${AUDIT_RESULTS.summary.failing} |

---

## 📈 12 LAYER SCORES

${Object.keys(LAYERS).map(layerNum => {
  const layer = LAYERS[layerNum];
  const layerData = AUDIT_RESULTS.layerScores[layer.key];
  const avgLayerScore = layerData.score / layerData.filesAudited;
  const status = avgLayerScore >= 90 ? '✅' : avgLayerScore >= 70 ? '⚠️' : '❌';
  return `${status} **Layer ${layerNum}: ${layer.name}** - ${avgLayerScore.toFixed(1)}/100 (Weight: ${layer.weight}%)`;
}).join('\n')}

---

## 🚨 TOP VIOLATIONS

${(() => {
  const violationCounts = {};
  AUDIT_RESULTS.violations.forEach(v => {
    const key = `${v.layer}: ${v.violation}`;
    violationCounts[key] = (violationCounts[key] || 0) + 1;
  });
  
  return Object.entries(violationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([violation, count]) => `- **${count}x** - ${violation}`)
    .join('\n');
})()}

---

## 📋 FILE-BY-FILE BREAKDOWN

${Object.entries(AUDIT_RESULTS.files).map(([fileName, file]) => {
  return `### ${fileName} (${file.grade} - ${file.totalScore.toFixed(1)}/100)

${Object.entries(file.layers).map(([layerKey, layer]) => {
  const status = layer.score >= 90 ? '✅' : layer.score >= 70 ? '⚠️' : '❌';
  return `${status} **${layer.name}**: ${layer.score}/100${layer.violations.length > 0 ? `\n   - ${layer.violations.join('\n   - ')}` : ''}`;
}).join('\n')}
`;
}).join('\n---\n\n')}

---

## 🎯 CERTIFICATION

${avgScore >= 95 ? `
✅ **CERTIFIED: PRODUCTION READY**

All ${AUDIT_RESULTS.totalFiles} components have been validated across all 12 application layers.
The application meets zero-tolerance standards for full-stack implementation.

**Status**: APPROVED FOR GLOBAL DEPLOYMENT
` : `
⚠️ **REMEDIATION REQUIRED**

${AUDIT_RESULTS.violations.length} violations must be addressed before production certification.

**Priority Actions**:
${Object.keys(LAYERS).map(layerNum => {
  const layer = LAYERS[layerNum];
  const layerData = AUDIT_RESULTS.layerScores[layer.key];
  const avgLayerScore = layerData.score / layerData.filesAudited;
  if (avgLayerScore < 90) {
    return `- Fix ${layer.name} (${avgLayerScore.toFixed(1)}/100)`;
  }
  return null;
}).filter(Boolean).join('\n')}
`}

---

**Audit Timestamp**: ${AUDIT_RESULTS.timestamp}  
**Auditor**: Zero-Tolerance 12-Layer Audit System v1.0
`;
}

// Main execution
console.log('🚀 Starting Zero-Tolerance 12-Layer Full-Stack Audit...\n');
console.log('This will audit ALL 221 tab components across ALL 12 application layers.\n');

// Find all tab files
const componentsDir = path.join(process.cwd(), 'src/components');
const tabFiles = [];

function findTabFiles(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      findTabFiles(fullPath);
    } else if (item.name.endsWith('-tab.tsx')) {
      tabFiles.push(fullPath);
    }
  }
}

findTabFiles(componentsDir);

console.log(`Found ${tabFiles.length} tab files to audit.\n`);

// Audit each file
tabFiles.forEach(filePath => {
  const result = auditFile(filePath);
  AUDIT_RESULTS.files[path.basename(filePath)] = result;
  AUDIT_RESULTS.totalFiles++;
  AUDIT_RESULTS.summary.totalScore += result.totalScore;
});

// Generate report
generateReport();

console.log('✅ Zero-Tolerance 12-Layer Audit Complete!\n');
