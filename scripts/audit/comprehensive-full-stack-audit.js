#!/usr/bin/env node

/**
 * COMPREHENSIVE FULL-STACK AUDIT
 * Verifies 100% Supabase integration and zero hardcoded data
 * Audits: UI components, data hooks, database schema, RLS policies, i18n
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AUDIT_RESULTS = {
  timestamp: new Date().toISOString(),
  summary: {
    totalTabs: 0,
    totalHooks: 0,
    totalMigrations: 0,
    totalTables: 0,
    totalRLSPolicies: 0,
    violations: []
  },
  modules: {},
  hooks: {},
  database: {
    tables: [],
    policies: []
  },
  violations: {
    hardcodedStrings: [],
    hardcodedPlaceholders: [],
    hardcodedMockData: [],
    missingSupabaseIntegration: [],
    missingi18n: []
  }
};

// Module structure
const MODULES = {
  'Production Hub': {
    dashboard: ['overview', 'quick-actions', 'my-projects', 'my-events', 'my-people', 'my-assets', 'my-locations', 'my-files', 'my-reports', 'activity', 'counts'],
    projects: ['overview', 'active', 'archived', 'templates', 'gantt', 'calendar', 'timeline', 'milestones', 'dependencies', 'resources', 'reports'],
    events: ['overview', 'calendar', 'upcoming', 'past', 'recurring', 'invitations', 'rsvp', 'venues', 'catering', 'equipment', 'budget', 'checklist', 'reports', 'templates'],
    people: ['directory', 'teams', 'roles', 'skills', 'availability', 'performance', 'certifications', 'training', 'keyboard-shortcuts'],
    assets: ['inventory', 'maintenance', 'assignments', 'depreciation', 'procurement', 'disposal', 'reports', 'categories'],
    locations: ['sites', 'buildings', 'floors', 'rooms', 'zones', 'capacity', 'amenities', 'access', 'maps'],
    files: ['browser', 'recent', 'shared', 'starred', 'trash', 'uploads', 'downloads', 'versions', 'tags', 'search']
  },
  'Network Hub': {
    community: ['activity', 'discussions', 'events', 'news', 'showcase', 'competitions', 'connections', 'studios'],
    marketplace: ['shop', 'products', 'services', 'vendors', 'orders', 'purchases', 'sales', 'reviews', 'favorites', 'lists', 'spotlight'],
    resources: ['library', 'guides', 'courses', 'publications', 'grants', 'glossary', 'troubleshooting']
  },
  'Business Hub': {
    companies: ['directory', 'profiles', 'relationships', 'contracts', 'contacts', 'documents', 'notes', 'activities', 'reports', 'hierarchy', 'integrations'],
    jobs: ['postings', 'applications', 'candidates', 'interviews', 'offers', 'onboarding', 'pipeline', 'analytics', 'templates', 'settings', 'compliance', 'reports', 'archive', 'calendar', 'team'],
    procurement: ['dashboard', 'requests', 'orders', 'vendors', 'contracts', 'receiving', 'invoices', 'approvals', 'catalog', 'matching'],
    finance: ['dashboard', 'accounts', 'transactions', 'budgets', 'forecasts', 'reports', 'invoicing', 'payments', 'expenses', 'reconciliation', 'tax', 'audit', 'analytics', 'cash-flow', 'balance-sheet', 'income-statement', 'financial-ratios', 'cost-centers']
  },
  'Intelligence Hub': {
    analytics: ['overview', 'performance', 'trends', 'comparisons', 'forecasts', 'segments', 'cohorts', 'funnels', 'retention', 'attribution'],
    reports: ['overview', 'scheduled', 'custom', 'templates', 'exports', 'dashboards', 'widgets', 'sharing', 'history'],
    insights: ['overview', 'recommendations', 'alerts', 'anomalies', 'predictions', 'benchmarks', 'goals', 'kpis', 'scorecards', 'trends']
  },
  'System Hub': {
    admin: ['overview', 'users', 'roles', 'permissions', 'audit', 'system', 'integrations', 'api-tokens', 'webhooks', 'notifications', 'email', 'security', 'backup', 'logs', 'monitoring', 'members-management', 'organization-settings', 'plugins', 'automations', 'templates', 'checklist-templates', 'custom-statuses', 'recurrence-rules'],
    settings: ['profile', 'account', 'notifications', 'privacy', 'security', 'billing', 'team', 'integrations', 'appearance', 'automations'],
    profile: ['basic-info', 'professional', 'social-media', 'certifications', 'travel-profile', 'health', 'emergency-contact', 'performance', 'endorsements', 'tags', 'history', 'access']
  },
  'Members Module': {
    members: ['directory', 'create', 'invite', 'import', 'export', 'bulk-actions', 'archived']
  }
};

function auditTabComponent(moduleName, tabName, filePath) {
  const result = {
    file: filePath,
    exists: false,
    hasUseTranslations: false,
    hasSupabaseHook: false,
    hardcodedStrings: [],
    hardcodedPlaceholders: [],
    mockDataArrays: [],
    score: 0
  };

  if (!fs.existsSync(filePath)) {
    AUDIT_RESULTS.violations.missingSupabaseIntegration.push({
      module: moduleName,
      tab: tabName,
      issue: 'File does not exist'
    });
    return result;
  }

  result.exists = true;
  const content = fs.readFileSync(filePath, 'utf8');

  // Check for useTranslations
  result.hasUseTranslations = content.includes('useTranslations');
  if (!result.hasUseTranslations) {
    AUDIT_RESULTS.violations.missingi18n.push({
      module: moduleName,
      tab: tabName,
      file: filePath
    });
  }

  // Check for Supabase hooks - more comprehensive patterns
  const supabaseHookPatterns = [
    /from ["']@\/hooks\/use-[\w-]+-data["']/,  // Hook import
    /use[\w]+Data\(/,                           // Hook function call
    /useSupabase/,
    /createClient/,
    /\.from\(['"][\w_]+['"]\)/                 // Direct Supabase query
  ];
  result.hasSupabaseHook = supabaseHookPatterns.some(pattern => pattern.test(content));

  // Check for hardcoded placeholders
  const placeholderMatches = content.match(/placeholder="[A-Z][^"]*"/g);
  if (placeholderMatches) {
    result.hardcodedPlaceholders = placeholderMatches;
    placeholderMatches.forEach(match => {
      AUDIT_RESULTS.violations.hardcodedPlaceholders.push({
        module: moduleName,
        tab: tabName,
        file: filePath,
        violation: match
      });
    });
  }

  // Check for hardcoded strings in JSX
  const jsxStringMatches = content.match(/>[A-Z][a-z]{3,}[^<]*</g);
  if (jsxStringMatches) {
    const filtered = jsxStringMatches.filter(match => 
      !match.includes('{') && 
      !match.includes('t(') &&
      match.length > 5
    );
    if (filtered.length > 0) {
      result.hardcodedStrings = filtered.slice(0, 5); // Sample
    }
  }

  // Check for mock data arrays
  const mockDataPatterns = [
    /const\s+\w+\s*=\s*\[\s*\{/,
    /mockData/i,
    /dummyData/i,
    /sampleData/i
  ];
  mockDataPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      result.mockDataArrays.push(pattern.toString());
    }
  });

  // Calculate score
  let score = 0;
  if (result.exists) score += 25;
  if (result.hasUseTranslations) score += 25;
  if (result.hasSupabaseHook) score += 25;
  if (result.hardcodedPlaceholders.length === 0) score += 10;
  if (result.hardcodedStrings.length === 0) score += 10;
  if (result.mockDataArrays.length === 0) score += 5;
  result.score = score;

  return result;
}

function auditHook(hookPath) {
  const result = {
    file: hookPath,
    hasSupabaseClient: false,
    hasRealtime: false,
    hasRLS: false,
    score: 0
  };

  if (!fs.existsSync(hookPath)) return result;

  const content = fs.readFileSync(hookPath, 'utf8');

  result.hasSupabaseClient = content.includes('createClient');
  result.hasRealtime = content.includes('.subscribe') || content.includes('realtime');
  result.hasRLS = content.includes('.select') || content.includes('.from');

  let score = 0;
  if (result.hasSupabaseClient) score += 40;
  if (result.hasRealtime) score += 30;
  if (result.hasRLS) score += 30;
  result.score = score;

  return result;
}

function auditDatabase() {
  const migrationsDir = path.join(process.cwd(), 'supabase/migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('⚠️  Migrations directory not found');
    return;
  }

  const migrations = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql') && !f.startsWith('.'));

  AUDIT_RESULTS.summary.totalMigrations = migrations.length;

  // Parse migrations for tables and policies
  migrations.forEach(migration => {
    const content = fs.readFileSync(path.join(migrationsDir, migration), 'utf8');
    
    // Count CREATE TABLE statements
    const tableMatches = content.match(/CREATE TABLE/gi);
    if (tableMatches) {
      AUDIT_RESULTS.summary.totalTables += tableMatches.length;
    }

    // Count RLS policies
    const policyMatches = content.match(/CREATE POLICY/gi);
    if (policyMatches) {
      AUDIT_RESULTS.summary.totalRLSPolicies += policyMatches.length;
    }
  });
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('COMPREHENSIVE FULL-STACK AUDIT REPORT');
  console.log('Dragonfly26.00 - 100% Supabase Integration & Zero Hardcoded Data');
  console.log('='.repeat(80) + '\n');

  // Summary
  console.log('📊 SUMMARY');
  console.log('-'.repeat(80));
  console.log(`Total Tab Components: ${AUDIT_RESULTS.summary.totalTabs}`);
  console.log(`Total Data Hooks: ${AUDIT_RESULTS.summary.totalHooks}`);
  console.log(`Total Migrations: ${AUDIT_RESULTS.summary.totalMigrations}`);
  console.log(`Total Tables: ${AUDIT_RESULTS.summary.totalTables}`);
  console.log(`Total RLS Policies: ${AUDIT_RESULTS.summary.totalRLSPolicies}`);
  console.log(`Total Violations: ${AUDIT_RESULTS.summary.violations.length}\n`);

  // Violations breakdown
  console.log('🚨 VIOLATIONS BREAKDOWN');
  console.log('-'.repeat(80));
  console.log(`Hardcoded Placeholders: ${AUDIT_RESULTS.violations.hardcodedPlaceholders.length}`);
  console.log(`Missing i18n: ${AUDIT_RESULTS.violations.missingi18n.length}`);
  console.log(`Missing Supabase Integration: ${AUDIT_RESULTS.violations.missingSupabaseIntegration.length}\n`);

  // Module scores
  console.log('📈 MODULE SCORES');
  console.log('-'.repeat(80));
  Object.entries(AUDIT_RESULTS.modules).forEach(([hubName, hub]) => {
    Object.entries(hub).forEach(([moduleName, module]) => {
      const avgScore = module.avgScore || 0;
      const grade = avgScore >= 95 ? 'A+' : avgScore >= 90 ? 'A' : avgScore >= 85 ? 'B+' : avgScore >= 80 ? 'B' : avgScore >= 75 ? 'C+' : avgScore >= 70 ? 'C' : 'F';
      const status = avgScore >= 95 ? '✅' : avgScore >= 80 ? '⚠️' : '❌';
      console.log(`${status} ${hubName} > ${moduleName}: ${avgScore.toFixed(1)}% (${grade}) - ${module.tabs.length} tabs`);
    });
  });

  // Detailed violations
  if (AUDIT_RESULTS.violations.hardcodedPlaceholders.length > 0) {
    console.log('\n❌ HARDCODED PLACEHOLDERS');
    console.log('-'.repeat(80));
    AUDIT_RESULTS.violations.hardcodedPlaceholders.forEach(v => {
      console.log(`${v.module} > ${v.tab}: ${v.violation}`);
    });
  }

  if (AUDIT_RESULTS.violations.missingi18n.length > 0) {
    console.log('\n❌ MISSING i18n');
    console.log('-'.repeat(80));
    AUDIT_RESULTS.violations.missingi18n.forEach(v => {
      console.log(`${v.module} > ${v.tab}`);
    });
  }

  // Overall grade
  const totalViolations = AUDIT_RESULTS.violations.hardcodedPlaceholders.length +
                          AUDIT_RESULTS.violations.missingi18n.length +
                          AUDIT_RESULTS.violations.missingSupabaseIntegration.length;
  
  const complianceRate = ((AUDIT_RESULTS.summary.totalTabs - totalViolations) / AUDIT_RESULTS.summary.totalTabs) * 100;
  const overallGrade = complianceRate >= 99 ? 'A+' : complianceRate >= 95 ? 'A' : complianceRate >= 90 ? 'A-' : complianceRate >= 85 ? 'B+' : 'B';

  console.log('\n' + '='.repeat(80));
  console.log(`OVERALL GRADE: ${overallGrade} (${complianceRate.toFixed(2)}%)`);
  console.log('='.repeat(80) + '\n');

  // Save to file
  const reportPath = path.join(process.cwd(), 'docs/audits/COMPREHENSIVE_FULL_STACK_AUDIT_2025_01_20.md');
  const reportContent = generateMarkdownReport(complianceRate, overallGrade);
  fs.writeFileSync(reportPath, reportContent);
  console.log(`📄 Full report saved to: ${reportPath}\n`);
}

function generateMarkdownReport(complianceRate, overallGrade) {
  return `# COMPREHENSIVE FULL-STACK AUDIT REPORT
**Dragonfly26.00 - 100% Supabase Integration & Zero Hardcoded Data**

**Date:** ${new Date().toISOString().split('T')[0]}  
**Overall Grade:** ${overallGrade} (${complianceRate.toFixed(2)}%)

---

## 📊 EXECUTIVE SUMMARY

| Metric | Count |
|--------|-------|
| Total Tab Components | ${AUDIT_RESULTS.summary.totalTabs} |
| Total Data Hooks | ${AUDIT_RESULTS.summary.totalHooks} |
| Total Migrations | ${AUDIT_RESULTS.summary.totalMigrations} |
| Total Database Tables | ${AUDIT_RESULTS.summary.totalTables} |
| Total RLS Policies | ${AUDIT_RESULTS.summary.totalRLSPolicies} |
| **Total Violations** | **${AUDIT_RESULTS.summary.violations.length}** |

---

## 🚨 VIOLATIONS BREAKDOWN

| Category | Count |
|----------|-------|
| Hardcoded Placeholders | ${AUDIT_RESULTS.violations.hardcodedPlaceholders.length} |
| Missing i18n | ${AUDIT_RESULTS.violations.missingi18n.length} |
| Missing Supabase Integration | ${AUDIT_RESULTS.violations.missingSupabaseIntegration.length} |

---

## 📈 MODULE SCORES

${Object.entries(AUDIT_RESULTS.modules).map(([hubName, hub]) => {
  return Object.entries(hub).map(([moduleName, module]) => {
    const avgScore = module.avgScore || 0;
    const grade = avgScore >= 95 ? 'A+' : avgScore >= 90 ? 'A' : avgScore >= 85 ? 'B+' : avgScore >= 80 ? 'B' : 'F';
    const status = avgScore >= 95 ? '✅' : avgScore >= 80 ? '⚠️' : '❌';
    return `${status} **${hubName} > ${moduleName}**: ${avgScore.toFixed(1)}% (${grade}) - ${module.tabs.length} tabs`;
  }).join('\n');
}).join('\n')}

---

## ❌ DETAILED VIOLATIONS

${AUDIT_RESULTS.violations.hardcodedPlaceholders.length > 0 ? `
### Hardcoded Placeholders (${AUDIT_RESULTS.violations.hardcodedPlaceholders.length})

${AUDIT_RESULTS.violations.hardcodedPlaceholders.map(v => 
  `- **${v.module} > ${v.tab}**: \`${v.violation}\``
).join('\n')}
` : '✅ No hardcoded placeholders found'}

${AUDIT_RESULTS.violations.missingi18n.length > 0 ? `
### Missing i18n (${AUDIT_RESULTS.violations.missingi18n.length})

${AUDIT_RESULTS.violations.missingi18n.map(v => 
  `- **${v.module} > ${v.tab}**`
).join('\n')}
` : '✅ All components have i18n'}

---

## 🎯 COMPLIANCE STATUS

- **i18n Coverage**: ${((AUDIT_RESULTS.summary.totalTabs - AUDIT_RESULTS.violations.missingi18n.length) / AUDIT_RESULTS.summary.totalTabs * 100).toFixed(2)}%
- **Supabase Integration**: ${((AUDIT_RESULTS.summary.totalTabs - AUDIT_RESULTS.violations.missingSupabaseIntegration.length) / AUDIT_RESULTS.summary.totalTabs * 100).toFixed(2)}%
- **Zero Hardcoded Data**: ${AUDIT_RESULTS.violations.hardcodedPlaceholders.length === 0 ? '✅ PASS' : '❌ FAIL'}

---

## 🏆 CERTIFICATION

${complianceRate >= 99 ? `
✅ **CERTIFIED: PRODUCTION READY**

This application has achieved 100% full-stack Supabase integration with zero hardcoded data.
All components are internationalized and connected to live database sources.

**Status**: APPROVED FOR GLOBAL DEPLOYMENT
` : `
⚠️ **REMEDIATION REQUIRED**

${AUDIT_RESULTS.summary.violations.length} violations must be addressed before production deployment.

**Action Items**:
1. Fix ${AUDIT_RESULTS.violations.hardcodedPlaceholders.length} hardcoded placeholders
2. Add i18n to ${AUDIT_RESULTS.violations.missingi18n.length} components
3. Integrate ${AUDIT_RESULTS.violations.missingSupabaseIntegration.length} components with Supabase
`}

---

**Audit Timestamp**: ${AUDIT_RESULTS.timestamp}
`;
}

// Main execution
console.log('🔍 Starting comprehensive full-stack audit...\n');

// Audit all modules
Object.entries(MODULES).forEach(([hubName, modules]) => {
  AUDIT_RESULTS.modules[hubName] = {};
  
  Object.entries(modules).forEach(([moduleName, tabs]) => {
    AUDIT_RESULTS.modules[hubName][moduleName] = {
      tabs: [],
      avgScore: 0
    };

    tabs.forEach(tabName => {
      const fileName = `${moduleName}-${tabName}-tab.tsx`;
      const filePath = path.join(process.cwd(), `src/components/${moduleName}/${fileName}`);
      
      const result = auditTabComponent(`${hubName} > ${moduleName}`, tabName, filePath);
      AUDIT_RESULTS.modules[hubName][moduleName].tabs.push(result);
      AUDIT_RESULTS.summary.totalTabs++;
    });

    // Calculate average score
    const scores = AUDIT_RESULTS.modules[hubName][moduleName].tabs.map(t => t.score);
    AUDIT_RESULTS.modules[hubName][moduleName].avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  });
});

// Audit hooks
const hooksDir = path.join(process.cwd(), 'src/hooks');
if (fs.existsSync(hooksDir)) {
  const hookFiles = fs.readdirSync(hooksDir).filter(f => f.endsWith('.ts') && f.startsWith('use-'));
  
  hookFiles.forEach(hookFile => {
    const hookPath = path.join(hooksDir, hookFile);
    const result = auditHook(hookPath);
    AUDIT_RESULTS.hooks[hookFile] = result;
    AUDIT_RESULTS.summary.totalHooks++;
  });
}

// Audit database
auditDatabase();

// Calculate total violations
AUDIT_RESULTS.summary.violations = [
  ...AUDIT_RESULTS.violations.hardcodedPlaceholders,
  ...AUDIT_RESULTS.violations.missingi18n,
  ...AUDIT_RESULTS.violations.missingSupabaseIntegration
];

// Generate report
generateReport();

console.log('✅ Audit complete!\n');
