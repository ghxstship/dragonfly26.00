#!/usr/bin/env node

/**
 * DEEP-DIVE GAP ANALYSIS
 * Performs atomic-level analysis of data flows, integrations, error handling,
 * and role-specific workflow completeness
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(REPO_ROOT, 'src');

const gaps = {
  critical: [],
  high: [],
  medium: [],
  low: []
};

function addGap(severity, category, title, description, affectedRoles, remediation, impact) {
  gaps[severity.toLowerCase()].push({
    severity,
    category,
    title,
    description,
    affectedRoles,
    remediation,
    impact
  });
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function getAllFiles(dir, ext) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results = results.concat(getAllFiles(filePath, ext));
    } else if (file.endsWith(ext)) {
      results.push(filePath);
    }
  });
  
  return results;
}

console.log('🔬 DEEP-DIVE GAP ANALYSIS\n');

// 1. AUDIT DATA HOOKS FOR REALTIME AND ERROR HANDLING
console.log('1️⃣  Auditing data hooks...');
const hooks = getAllFiles(path.join(SRC_DIR, 'hooks'), '.ts');
let hooksWithoutRealtime = 0;
let hooksWithoutErrorHandling = 0;

hooks.forEach(hookPath => {
  const content = readFile(hookPath);
  const hookName = path.basename(hookPath, '.ts');
  
  if (content && hookName.includes('use-') && hookName.includes('-data')) {
    const hasRealtime = content.includes('.on(') && content.includes('subscribe');
    const hasErrorHandling = content.includes('try') && content.includes('catch');
    
    if (!hasRealtime) {
      hooksWithoutRealtime++;
      addGap(
        'MEDIUM',
        'Realtime Sync',
        `Hook ${hookName} missing realtime subscriptions`,
        `Data hook does not implement realtime subscriptions, causing stale data in multi-user scenarios.`,
        ['All'],
        `Add realtime subscription with channel().on().subscribe() pattern and proper cleanup.`,
        'Users see outdated data, leading to conflicts and confusion in collaborative workflows.'
      );
    }
    
    if (!hasErrorHandling) {
      hooksWithoutErrorHandling++;
      addGap(
        'HIGH',
        'Error Handling',
        `Hook ${hookName} missing error handling`,
        `Data hook lacks try-catch blocks, potentially causing unhandled promise rejections.`,
        ['All'],
        `Add comprehensive error handling with user-friendly error states.`,
        'Application crashes or silent failures when data operations fail.'
      );
    }
  }
});

console.log(`   ✓ Found ${hooksWithoutRealtime} hooks without realtime`);
console.log(`   ✓ Found ${hooksWithoutErrorHandling} hooks without error handling`);

// 2. AUDIT API ENDPOINTS
console.log('\n2️⃣  Auditing API endpoints...');
const apiDir = path.join(SRC_DIR, 'app', 'api');
if (!fs.existsSync(apiDir)) {
  addGap(
    'CRITICAL',
    'API Infrastructure',
    'No API endpoints defined',
    'The application has no API routes, preventing external integrations and webhooks.',
    ['All'],
    'Create API directory structure with authentication, webhooks, and external integration endpoints.',
    'Cannot integrate with external systems, limiting platform extensibility and automation capabilities.'
  );
  console.log('   ⚠️  No API directory found - CRITICAL GAP');
} else {
  const apiFiles = getAllFiles(apiDir, '.ts');
  console.log(`   ✓ Found ${apiFiles.length} API endpoints`);
  
  if (apiFiles.length === 0) {
    addGap(
      'HIGH',
      'API Infrastructure',
      'No API routes implemented',
      'API directory exists but contains no route handlers.',
      ['All'],
      'Implement API routes for webhooks, external integrations, and third-party access.',
      'Limited ability to integrate with external systems and automate workflows.'
    );
  }
}

// 3. AUDIT CROSS-MODULE DATA FLOWS
console.log('\n3️⃣  Auditing cross-module data flows...');
const components = getAllFiles(path.join(SRC_DIR, 'components'), '.tsx');
const crossModuleImports = new Map();

components.forEach(compPath => {
  const content = readFile(compPath);
  if (!content) return;
  
  const moduleName = compPath.split('/components/')[1]?.split('/')[0];
  if (!moduleName) return;
  
  const importMatches = content.match(/from ['"]@\/hooks\/(use-[^'"]+)['"]/g) || [];
  importMatches.forEach(match => {
    const hookName = match.match(/use-[^'"]+/)[0];
    const hookModule = hookName.replace('use-', '').replace('-data', '');
    
    if (hookModule !== moduleName && hookModule !== 'admin' && hookModule !== 'settings') {
      const key = `${moduleName} → ${hookModule}`;
      crossModuleImports.set(key, (crossModuleImports.get(key) || 0) + 1);
    }
  });
});

console.log(`   ✓ Found ${crossModuleImports.size} cross-module data flow patterns`);

// Check for missing data flow hooks
const criticalFlows = [
  { from: 'dashboard', to: 'tasks', hook: 'use-dashboard-data' },
  { from: 'events', to: 'assets', hook: 'use-events-data' },
  { from: 'procurement', to: 'finance', hook: 'use-procurement-data' },
  { from: 'jobs', to: 'people', hook: 'use-jobs-data' }
];

criticalFlows.forEach(flow => {
  const hookPath = path.join(SRC_DIR, 'hooks', `${flow.hook}.ts`);
  if (!fs.existsSync(hookPath)) {
    addGap(
      'HIGH',
      'Data Flow',
      `Missing data flow hook: ${flow.hook}`,
      `Critical data flow from ${flow.from} to ${flow.to} lacks dedicated hook.`,
      ['All'],
      `Create ${flow.hook} hook to manage data flow between ${flow.from} and ${flow.to} modules.`,
      'Broken workflows that span multiple modules, forcing manual data entry and duplication.'
    );
  }
});

// 4. AUDIT RLS POLICIES
console.log('\n4️⃣  Auditing RLS policies...');
const migrations = getAllFiles(path.join(REPO_ROOT, 'supabase', 'migrations'), '.sql');
const allMigrationContent = migrations.map(f => readFile(f)).filter(Boolean).join('\n');

const tables = [...new Set((allMigrationContent.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)/gi) || [])
  .map(m => m.split(/\s+/).pop()))];

const rlsPolicies = (allMigrationContent.match(/CREATE POLICY\s+"([^"]+)"\s+ON\s+(\w+)/gi) || [])
  .map(m => {
    const match = m.match(/CREATE POLICY\s+"([^"]+)"\s+ON\s+(\w+)/i);
    return { policy: match[1], table: match[2] };
  });

console.log(`   ✓ Found ${tables.length} tables`);
console.log(`   ✓ Found ${rlsPolicies.length} RLS policies`);

// Check for tables without RLS
const tablesWithoutRLS = tables.filter(table => 
  !rlsPolicies.some(p => p.table === table)
);

if (tablesWithoutRLS.length > 0) {
  addGap(
    'CRITICAL',
    'Security',
    `${tablesWithoutRLS.length} tables without RLS policies`,
    `Tables without RLS: ${tablesWithoutRLS.slice(0, 5).join(', ')}${tablesWithoutRLS.length > 5 ? '...' : ''}`,
    ['All'],
    'Create RLS policies for all tables to enforce row-level security based on user roles.',
    'SEVERE SECURITY RISK: Unauthorized data access, potential data breaches, compliance violations.'
  );
}

// 5. AUDIT ROLE-SPECIFIC WORKFLOWS
console.log('\n5️⃣  Auditing role-specific workflows...');

const roles = [
  { name: 'Legend', level: 1, requiredModules: ['admin', 'settings', 'analytics', 'reports'] },
  { name: 'Phantom', level: 2, requiredModules: ['admin', 'settings', 'projects', 'finance'] },
  { name: 'Gladiator', level: 4, requiredModules: ['projects', 'events', 'people', 'assets', 'finance'] },
  { name: 'Navigator', level: 5, requiredModules: ['people', 'assets', 'locations', 'finance'] },
  { name: 'Deviator', level: 6, requiredModules: ['dashboard', 'events', 'people'] },
  { name: 'Raider', level: 7, requiredModules: ['dashboard', 'files', 'profile'] },
  { name: 'Vendor', level: 8, requiredModules: ['jobs', 'finance', 'files'] },
  { name: 'Partner', level: 10, requiredModules: ['reports', 'analytics'] },
  { name: 'Ambassador', level: 11, requiredModules: ['marketplace', 'community'] }
];

roles.forEach(role => {
  role.requiredModules.forEach(module => {
    const moduleDir = path.join(SRC_DIR, 'components', module);
    if (!fs.existsSync(moduleDir)) {
      addGap(
        'CRITICAL',
        'Role Workflows',
        `${role.name} role cannot access ${module} module`,
        `Required module ${module} does not exist, preventing ${role.name} from completing their workflows.`,
        [role.name],
        `Create ${module} module with appropriate components and data hooks.`,
        `${role.name} users cannot perform their job functions, blocking critical business operations.`
      );
    }
  });
});

// 6. AUDIT ERROR BOUNDARIES
console.log('\n6️⃣  Auditing error boundaries...');
const errorBoundaryPath = path.join(SRC_DIR, 'components', 'error-boundary.tsx');
if (!fs.existsSync(errorBoundaryPath)) {
  addGap(
    'HIGH',
    'Error Handling',
    'No global error boundary',
    'Application lacks error boundary component for graceful error handling.',
    ['All'],
    'Create ErrorBoundary component and wrap application root.',
    'Uncaught errors crash entire application instead of showing user-friendly error messages.'
  );
}

// 7. AUDIT LOADING STATES
console.log('\n7️⃣  Auditing loading states...');
let componentsWithoutLoading = 0;
components.filter(c => c.includes('-tab.tsx')).forEach(compPath => {
  const content = readFile(compPath);
  if (content && !content.includes('isLoading') && !content.includes('loading')) {
    componentsWithoutLoading++;
  }
});

if (componentsWithoutLoading > 10) {
  addGap(
    'MEDIUM',
    'User Experience',
    `${componentsWithoutLoading} components without loading states`,
    'Many components lack loading indicators, causing poor user experience.',
    ['All'],
    'Add loading states to all data-fetching components.',
    'Users see blank screens or stale data, unclear if application is working.'
  );
}

// 8. AUDIT INTEGRATION POINTS
console.log('\n8️⃣  Auditing external integrations...');
const integrationModules = [
  'stripe', 'sendgrid', 'twilio', 'slack', 'google', 'microsoft', 'zoom'
];

const envExample = readFile(path.join(REPO_ROOT, '.env.example'));
const hasIntegrations = integrationModules.some(module => 
  envExample && envExample.toLowerCase().includes(module)
);

if (!hasIntegrations) {
  addGap(
    'MEDIUM',
    'Integrations',
    'No external integration configuration',
    'Application lacks environment variables for external service integrations.',
    ['Phantom', 'Legend'],
    'Add integration configuration for payment processing, email, SMS, and communication tools.',
    'Limited automation capabilities, manual processes for payments, notifications, and communications.'
  );
}

// 9. AUDIT WEBHOOK INFRASTRUCTURE
console.log('\n9️⃣  Auditing webhook infrastructure...');
const webhookPath = path.join(SRC_DIR, 'app', 'api', 'webhooks');
if (!fs.existsSync(webhookPath)) {
  addGap(
    'HIGH',
    'Integrations',
    'No webhook infrastructure',
    'Application cannot receive webhooks from external services.',
    ['Phantom', 'Legend'],
    'Create webhook endpoints for Stripe, Supabase, and other external services.',
    'Cannot automate workflows based on external events, requiring manual intervention.'
  );
}

// 10. AUDIT BACKGROUND JOBS
console.log('\n🔟 Auditing background job infrastructure...');
const edgeFunctionsDir = path.join(REPO_ROOT, 'supabase', 'functions');
const edgeFunctions = fs.existsSync(edgeFunctionsDir) 
  ? fs.readdirSync(edgeFunctionsDir).filter(f => !f.startsWith('.'))
  : [];

console.log(`   ✓ Found ${edgeFunctions.length} edge functions`);

const criticalBackgroundJobs = [
  'email-notifications',
  'scheduled-reports',
  'data-sync',
  'cleanup-tasks'
];

criticalBackgroundJobs.forEach(job => {
  if (!edgeFunctions.includes(job)) {
    addGap(
      'MEDIUM',
      'Automation',
      `Missing background job: ${job}`,
      `Critical background job ${job} is not implemented.`,
      ['All'],
      `Create edge function for ${job} with proper scheduling and error handling.`,
      'Manual processes required for automated tasks, reducing efficiency and reliability.'
    );
  }
});

// GENERATE REPORT
console.log('\n📊 GENERATING COMPREHENSIVE GAP ANALYSIS REPORT...\n');

const totalGaps = gaps.critical.length + gaps.high.length + gaps.medium.length + gaps.low.length;
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalGaps,
    critical: gaps.critical.length,
    high: gaps.high.length,
    medium: gaps.medium.length,
    low: gaps.low.length,
    overallStatus: gaps.critical.length > 0 ? 'CRITICAL' : 
                   gaps.high.length > 0 ? 'NEEDS ATTENTION' : 
                   gaps.medium.length > 0 ? 'GOOD' : 'EXCELLENT'
  },
  gaps,
  recommendations: []
};

// Generate recommendations
if (gaps.critical.length > 0) {
  report.recommendations.push({
    priority: 'IMMEDIATE',
    title: 'Address Critical Security and Infrastructure Gaps',
    description: `${gaps.critical.length} critical gaps found that pose security risks or block core functionality.`,
    estimatedEffort: '1-2 weeks',
    impact: 'CRITICAL - Must be resolved before production deployment'
  });
}

if (gaps.high.length > 0) {
  report.recommendations.push({
    priority: 'HIGH',
    title: 'Implement Missing Error Handling and Data Flows',
    description: `${gaps.high.length} high-priority gaps affecting reliability and data integrity.`,
    estimatedEffort: '1-2 weeks',
    impact: 'HIGH - Affects user experience and data consistency'
  });
}

if (gaps.medium.length > 0) {
  report.recommendations.push({
    priority: 'MEDIUM',
    title: 'Enhance User Experience and Automation',
    description: `${gaps.medium.length} medium-priority gaps affecting UX and automation capabilities.`,
    estimatedEffort: '2-3 weeks',
    impact: 'MEDIUM - Improves efficiency and user satisfaction'
  });
}

// Calculate completeness score
const maxPossibleGaps = 100;
const completeness = Math.max(0, 100 - (totalGaps / maxPossibleGaps * 100));
report.summary.completenessScore = completeness.toFixed(1) + '%';

if (completeness >= 98) report.summary.grade = 'A+';
else if (completeness >= 95) report.summary.grade = 'A';
else if (completeness >= 90) report.summary.grade = 'A-';
else if (completeness >= 87) report.summary.grade = 'B+';
else if (completeness >= 83) report.summary.grade = 'B';
else if (completeness >= 80) report.summary.grade = 'B-';
else if (completeness >= 77) report.summary.grade = 'C+';
else if (completeness >= 73) report.summary.grade = 'C';
else if (completeness >= 70) report.summary.grade = 'C-';
else report.summary.grade = 'F';

// Save report
const outputPath = path.join(REPO_ROOT, 'docs', 'audits', 'DEEP_DIVE_GAP_ANALYSIS.json');
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

console.log('═══════════════════════════════════════════════════════════');
console.log('                    GAP ANALYSIS SUMMARY                   ');
console.log('═══════════════════════════════════════════════════════════');
console.log(`Overall Status: ${report.summary.overallStatus}`);
console.log(`Completeness Score: ${report.summary.completenessScore}`);
console.log(`Grade: ${report.summary.grade}`);
console.log(`\nTotal Gaps: ${totalGaps}`);
console.log(`  🔴 Critical: ${gaps.critical.length}`);
console.log(`  🟠 High: ${gaps.high.length}`);
console.log(`  🟡 Medium: ${gaps.medium.length}`);
console.log(`  🟢 Low: ${gaps.low.length}`);
console.log(`\n📄 Full report saved to: ${outputPath}`);
console.log('═══════════════════════════════════════════════════════════\n');
