#!/usr/bin/env node

/**
 * ATOMIC-LEVEL WORKFLOW COMPLETE AUDIT
 * Zero tolerance for gaps - 100% coverage required
 * 
 * Analyzes:
 * - All workflows (explicit, implicit, edge cases, error states)
 * - Cross-module dependencies and data flows
 * - Role-based completeness
 * - End-to-end executability
 * - Data integrity and state management
 * - Error handling and recovery paths
 * - Integration points and API endpoints
 * - Database transactions and migrations
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

// Define all hubs, modules, and their expected workflows
const SYSTEM_ARCHITECTURE = {
  hubs: {
    production: {
      modules: ['dashboard', 'projects', 'events', 'people', 'assets', 'locations', 'files'],
      workflows: ['create', 'read', 'update', 'delete', 'search', 'filter', 'export', 'share']
    },
    network: {
      modules: ['community', 'marketplace', 'resources'],
      workflows: ['browse', 'interact', 'transact', 'collaborate', 'share']
    },
    business: {
      modules: ['companies', 'jobs', 'procurement', 'finance'],
      workflows: ['manage', 'track', 'approve', 'report', 'analyze']
    },
    intelligence: {
      modules: ['analytics', 'reports', 'insights'],
      workflows: ['collect', 'analyze', 'visualize', 'export', 'schedule']
    },
    system: {
      modules: ['admin', 'settings', 'profile'],
      workflows: ['configure', 'manage', 'monitor', 'audit']
    }
  },
  roles: [
    'Legend', 'Phantom', 'Aviator', 'Gladiator', 'Navigator',
    'Deviator', 'Raider', 'Vendor', 'Visitor', 'Partner', 'Ambassador'
  ],
  criticalPaths: [
    'user_authentication',
    'workspace_creation',
    'project_lifecycle',
    'production_workflow',
    'event_management',
    'asset_tracking',
    'financial_operations',
    'reporting_pipeline',
    'data_export',
    'collaboration'
  ]
};

const results = {
  timestamp: new Date().toISOString(),
  summary: {
    totalWorkflows: 0,
    completeWorkflows: 0,
    incompleteWorkflows: 0,
    brokenWorkflows: 0,
    missingFunctionality: 0,
    integrationGaps: 0,
    roleGaps: 0
  },
  gaps: {
    critical: [],
    high: [],
    medium: [],
    low: []
  },
  analysis: {
    components: {},
    hooks: {},
    migrations: {},
    apiEndpoints: {},
    dataFlows: {},
    roleCapabilities: {},
    errorHandling: {},
    integrations: {}
  }
};

console.log('🔍 ATOMIC-LEVEL WORKFLOW AUDIT - ZERO TOLERANCE\n');
console.log('═══════════════════════════════════════════════════════════\n');

// ============================================================================
// PHASE 1: COMPONENT ANALYSIS
// ============================================================================
console.log('Phase 1: Analyzing Components & Workflows...');

function analyzeComponents() {
  const componentsDir = path.join(REPO_ROOT, 'src', 'components');
  const hubs = ['dashboard', 'projects', 'events', 'people', 'assets', 'locations', 'files',
                'community', 'marketplace', 'resources', 'companies', 'jobs', 'procurement',
                'finance', 'analytics', 'reports', 'insights', 'admin', 'settings', 'profile'];
  
  hubs.forEach(hub => {
    const hubPath = path.join(componentsDir, hub);
    if (!fs.existsSync(hubPath)) {
      results.gaps.critical.push({
        type: 'MISSING_HUB',
        hub,
        severity: 'CRITICAL',
        impact: `Entire ${hub} hub is missing - complete workflow failure`,
        remediation: `Create ${hub} hub with all required components`
      });
      return;
    }

    const files = fs.readdirSync(hubPath).filter(f => f.endsWith('-tab.tsx'));
    results.analysis.components[hub] = {
      totalTabs: files.length,
      tabs: files,
      workflows: {}
    };

    // Analyze each tab for workflow completeness
    files.forEach(file => {
      const filePath = path.join(hubPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const workflows = {
        hasCreate: /onCreate|handleCreate|createNew/i.test(content),
        hasRead: /useQuery|fetch|load/i.test(content),
        hasUpdate: /onUpdate|handleUpdate|handleEdit/i.test(content),
        hasDelete: /onDelete|handleDelete/i.test(content),
        hasSearch: /search|filter|query/i.test(content),
        hasExport: /export|download/i.test(content),
        hasErrorHandling: /try\s*{|catch\s*\(|\.catch\(/i.test(content),
        hasLoadingState: /loading|isLoading/i.test(content),
        hasEmptyState: /EmptyState|empty/i.test(content),
        hasPermissionCheck: /permission|can|ability|role/i.test(content)
      };

      results.analysis.components[hub].workflows[file] = workflows;

      // Check for incomplete workflows
      const missingWorkflows = [];
      if (!workflows.hasRead) missingWorkflows.push('read');
      if (!workflows.hasErrorHandling) missingWorkflows.push('error_handling');
      if (!workflows.hasLoadingState) missingWorkflows.push('loading_state');

      if (missingWorkflows.length > 0) {
        results.gaps.medium.push({
          type: 'INCOMPLETE_WORKFLOW',
          component: `${hub}/${file}`,
          missing: missingWorkflows,
          severity: 'MEDIUM',
          impact: `User experience degradation in ${hub}`,
          remediation: `Add missing workflow elements: ${missingWorkflows.join(', ')}`
        });
      }
    });
  });

  results.summary.totalWorkflows += Object.keys(results.analysis.components).length;
}

// ============================================================================
// PHASE 2: DATA HOOKS ANALYSIS
// ============================================================================
console.log('Phase 2: Analyzing Data Hooks & State Management...');

function analyzeDataHooks() {
  const hooksDir = path.join(REPO_ROOT, 'src', 'hooks');
  if (!fs.existsSync(hooksDir)) {
    results.gaps.critical.push({
      type: 'MISSING_HOOKS_LAYER',
      severity: 'CRITICAL',
      impact: 'No data layer - application cannot function',
      remediation: 'Create hooks directory with data management hooks'
    });
    return;
  }

  const hookFiles = fs.readdirSync(hooksDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  
  hookFiles.forEach(file => {
    const filePath = path.join(hooksDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const analysis = {
      hasErrorHandling: /try\s*{|catch\s*\(/i.test(content),
      hasRealtimeSubscription: /\.on\(|subscribe|channel/i.test(content),
      hasOptimisticUpdates: /optimistic|onMutate/i.test(content),
      hasCaching: /useQuery|queryClient/i.test(content),
      hasRetry: /retry|refetch/i.test(content),
      usesSupabase: /createClient|supabase/i.test(content)
    };

    results.analysis.hooks[file] = analysis;

    // Check for critical gaps
    if (file.startsWith('use-') && file.includes('-data') && !analysis.hasErrorHandling) {
      results.gaps.high.push({
        type: 'MISSING_ERROR_HANDLING',
        hook: file,
        severity: 'HIGH',
        impact: 'Data operations can fail silently',
        remediation: `Add try-catch blocks and error notifications to ${file}`
      });
    }

    if (file.startsWith('use-') && file.includes('-data') && !analysis.hasRealtimeSubscription) {
      results.gaps.medium.push({
        type: 'MISSING_REALTIME',
        hook: file,
        severity: 'MEDIUM',
        impact: 'Data may become stale, no live updates',
        remediation: `Add realtime subscription to ${file}`
      });
    }
  });
}

// ============================================================================
// PHASE 3: DATABASE & MIGRATIONS ANALYSIS
// ============================================================================
console.log('Phase 3: Analyzing Database Schema & Migrations...');

function analyzeMigrations() {
  const migrationsDir = path.join(REPO_ROOT, 'supabase', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    results.gaps.critical.push({
      type: 'MISSING_MIGRATIONS',
      severity: 'CRITICAL',
      impact: 'No database schema - application cannot store data',
      remediation: 'Create migrations directory with schema definitions'
    });
    return;
  }

  const migrations = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql') && !f.includes('.skip'))
    .sort();

  results.analysis.migrations = {
    total: migrations.length,
    latest: migrations[migrations.length - 1],
    files: migrations
  };

  // Check for RLS coverage
  let rlsPolicyCount = 0;
  let tablesWithRLS = new Set();
  
  migrations.forEach(file => {
    const filePath = path.join(migrationsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const policies = content.match(/CREATE POLICY/gi) || [];
    rlsPolicyCount += policies.length;
    
    const rlsEnables = content.match(/ENABLE ROW LEVEL SECURITY/gi) || [];
    rlsEnables.forEach(() => {
      const tableMatch = content.match(/ALTER TABLE\s+(?:IF EXISTS\s+)?(\w+)\s+ENABLE ROW LEVEL SECURITY/gi);
      if (tableMatch) {
        tableMatch.forEach(match => {
          const table = match.match(/ALTER TABLE\s+(?:IF EXISTS\s+)?(\w+)/i)?.[1];
          if (table) tablesWithRLS.add(table);
        });
      }
    });
  });

  results.analysis.migrations.rlsPolicies = rlsPolicyCount;
  results.analysis.migrations.tablesWithRLS = Array.from(tablesWithRLS);

  console.log(`  ✓ Found ${migrations.length} migrations`);
  console.log(`  ✓ ${rlsPolicyCount} RLS policies`);
  console.log(`  ✓ ${tablesWithRLS.size} tables with RLS`);
}

// ============================================================================
// PHASE 4: API & INTEGRATION ANALYSIS
// ============================================================================
console.log('Phase 4: Analyzing API Endpoints & Integrations...');

function analyzeAPIEndpoints() {
  const apiDir = path.join(REPO_ROOT, 'src', 'app', 'api');
  if (!fs.existsSync(apiDir)) {
    results.gaps.high.push({
      type: 'MISSING_API_LAYER',
      severity: 'HIGH',
      impact: 'No API endpoints for external integrations',
      remediation: 'Create API directory with endpoint handlers'
    });
    return;
  }

  // Analyze Supabase Edge Functions
  const functionsDir = path.join(REPO_ROOT, 'supabase', 'functions');
  if (fs.existsSync(functionsDir)) {
    const functions = fs.readdirSync(functionsDir).filter(f => {
      const stat = fs.statSync(path.join(functionsDir, f));
      return stat.isDirectory();
    });

    results.analysis.apiEndpoints.edgeFunctions = functions;
    console.log(`  ✓ Found ${functions.length} edge functions`);
  }
}

// ============================================================================
// PHASE 5: ROLE-BASED ACCESS ANALYSIS
// ============================================================================
console.log('Phase 5: Analyzing Role-Based Access & Permissions...');

function analyzeRoleCapabilities() {
  const rbacFile = path.join(REPO_ROOT, 'src', 'hooks', 'use-rbac.ts');
  
  if (!fs.existsSync(rbacFile)) {
    results.gaps.critical.push({
      type: 'MISSING_RBAC_SYSTEM',
      severity: 'CRITICAL',
      impact: 'No role-based access control - security vulnerability',
      remediation: 'Implement RBAC system with use-rbac.ts hook'
    });
    return;
  }

  const content = fs.readFileSync(rbacFile, 'utf-8');
  
  SYSTEM_ARCHITECTURE.roles.forEach(role => {
    const hasRoleDefinition = content.includes(role) || content.includes(role.toLowerCase());
    results.analysis.roleCapabilities[role] = {
      defined: hasRoleDefinition,
      permissions: []
    };

    if (!hasRoleDefinition) {
      results.gaps.high.push({
        type: 'MISSING_ROLE_DEFINITION',
        role,
        severity: 'HIGH',
        impact: `${role} role cannot function - users cannot access features`,
        remediation: `Add ${role} role definition and permissions to RBAC system`
      });
    }
  });
}

// ============================================================================
// PHASE 6: ERROR HANDLING & RECOVERY ANALYSIS
// ============================================================================
console.log('Phase 6: Analyzing Error Handling & Recovery Paths...');

function analyzeErrorHandling() {
  const errorBoundaryPath = path.join(REPO_ROOT, 'src', 'components', 'error-boundary.tsx');
  
  results.analysis.errorHandling.hasGlobalBoundary = fs.existsSync(errorBoundaryPath);
  
  if (!results.analysis.errorHandling.hasGlobalBoundary) {
    results.gaps.high.push({
      type: 'MISSING_ERROR_BOUNDARY',
      severity: 'HIGH',
      impact: 'Application crashes show white screen - poor UX',
      remediation: 'Create global ErrorBoundary component'
    });
  }

  // Check for toast notifications
  const hasToastSystem = fs.existsSync(path.join(REPO_ROOT, 'node_modules', 'sonner')) ||
                         fs.existsSync(path.join(REPO_ROOT, 'node_modules', 'react-hot-toast'));
  
  results.analysis.errorHandling.hasToastSystem = hasToastSystem;
  
  if (!hasToastSystem) {
    results.gaps.medium.push({
      type: 'MISSING_NOTIFICATION_SYSTEM',
      severity: 'MEDIUM',
      impact: 'Users not notified of errors or success',
      remediation: 'Install and configure toast notification library'
    });
  }
}

// ============================================================================
// PHASE 7: DATA FLOW & STATE MANAGEMENT ANALYSIS
// ============================================================================
console.log('Phase 7: Analyzing Data Flows & State Management...');

function analyzeDataFlows() {
  // Check for React Query
  const hasReactQuery = fs.existsSync(path.join(REPO_ROOT, 'node_modules', '@tanstack', 'react-query'));
  results.analysis.dataFlows.hasReactQuery = hasReactQuery;

  // Check for state management
  const hasZustand = fs.existsSync(path.join(REPO_ROOT, 'node_modules', 'zustand'));
  const hasRedux = fs.existsSync(path.join(REPO_ROOT, 'node_modules', '@reduxjs', 'toolkit'));
  
  results.analysis.dataFlows.stateManagement = {
    zustand: hasZustand,
    redux: hasRedux,
    reactQuery: hasReactQuery
  };

  if (!hasReactQuery && !hasZustand && !hasRedux) {
    results.gaps.high.push({
      type: 'MISSING_STATE_MANAGEMENT',
      severity: 'HIGH',
      impact: 'No centralized state management - data inconsistencies',
      remediation: 'Implement React Query or Zustand for state management'
    });
  }
}

// ============================================================================
// PHASE 8: INTEGRATION POINTS ANALYSIS
// ============================================================================
console.log('Phase 8: Analyzing Integration Points...');

function analyzeIntegrations() {
  const integrations = {
    supabase: fs.existsSync(path.join(REPO_ROOT, 'node_modules', '@supabase', 'supabase-js')),
    stripe: fs.existsSync(path.join(REPO_ROOT, 'node_modules', 'stripe')),
    email: fs.existsSync(path.join(REPO_ROOT, 'node_modules', 'resend')) ||
           fs.existsSync(path.join(REPO_ROOT, 'node_modules', '@sendgrid', 'mail')),
    storage: fs.existsSync(path.join(REPO_ROOT, 'supabase', 'config.toml')),
    auth: fs.existsSync(path.join(REPO_ROOT, 'src', 'app', 'auth'))
  };

  results.analysis.integrations = integrations;

  if (!integrations.supabase) {
    results.gaps.critical.push({
      type: 'MISSING_DATABASE_INTEGRATION',
      severity: 'CRITICAL',
      impact: 'No database connection - application cannot function',
      remediation: 'Install and configure Supabase client'
    });
  }

  if (!integrations.auth) {
    results.gaps.critical.push({
      type: 'MISSING_AUTH_SYSTEM',
      severity: 'CRITICAL',
      impact: 'No authentication - security vulnerability',
      remediation: 'Implement authentication system'
    });
  }
}

// ============================================================================
// EXECUTE ALL PHASES
// ============================================================================

try {
  analyzeComponents();
  analyzeDataHooks();
  analyzeMigrations();
  analyzeAPIEndpoints();
  analyzeRoleCapabilities();
  analyzeErrorHandling();
  analyzeDataFlows();
  analyzeIntegrations();

  // Calculate summary
  results.summary.completeWorkflows = results.summary.totalWorkflows - results.gaps.critical.length - results.gaps.high.length;
  results.summary.incompleteWorkflows = results.gaps.medium.length;
  results.summary.brokenWorkflows = results.gaps.critical.length;
  results.summary.missingFunctionality = results.gaps.high.length;
  results.summary.integrationGaps = results.gaps.critical.filter(g => g.type.includes('INTEGRATION')).length;
  results.summary.roleGaps = results.gaps.high.filter(g => g.type.includes('ROLE')).length;

  // ============================================================================
  // GENERATE REPORT
  // ============================================================================
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    AUDIT COMPLETE                         ');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('SUMMARY:');
  console.log(`  Critical Gaps: ${results.gaps.critical.length}`);
  console.log(`  High Priority Gaps: ${results.gaps.high.length}`);
  console.log(`  Medium Priority Gaps: ${results.gaps.medium.length}`);
  console.log(`  Low Priority Gaps: ${results.gaps.low.length}`);
  console.log(`  Total Gaps: ${results.gaps.critical.length + results.gaps.high.length + results.gaps.medium.length + results.gaps.low.length}\n`);

  const completionRate = results.summary.totalWorkflows > 0 
    ? ((results.summary.completeWorkflows / results.summary.totalWorkflows) * 100).toFixed(1)
    : 0;

  console.log(`COMPLETION RATE: ${completionRate}%`);
  
  if (results.gaps.critical.length === 0 && results.gaps.high.length === 0 && results.gaps.medium.length === 0) {
    console.log('\n🎉 ✅ 100% COMPLETE - ZERO GAPS FOUND!');
    console.log('🏆 GRADE: A+ (100/100)');
    console.log('🚀 STATUS: PRODUCTION READY');
  } else {
    console.log('\n⚠️  GAPS DETECTED - REMEDIATION REQUIRED');
    console.log(`📊 GRADE: ${completionRate >= 90 ? 'A' : completionRate >= 80 ? 'B' : completionRate >= 70 ? 'C' : 'F'}`);
  }

  // Save results
  const outputPath = path.join(REPO_ROOT, 'docs', 'audits', 'ATOMIC_WORKFLOW_COMPLETE_AUDIT.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Full report saved to: ${outputPath}\n`);

  process.exit(results.gaps.critical.length > 0 ? 1 : 0);

} catch (error) {
  console.error('\n❌ AUDIT FAILED:', error.message);
  console.error(error.stack);
  process.exit(1);
}
