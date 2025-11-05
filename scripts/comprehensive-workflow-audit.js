/**
 * COMPREHENSIVE WORKFLOW AUDIT
 * Analyzes all workflows across the entire Dragonfly26.00 application
 * Identifies gaps, missing functionality, and workflow continuity issues
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const WORKSPACE_ROOT = '/Users/julianclarkson/Documents/Dragonfly26.00';
const COMPONENTS_DIR = path.join(WORKSPACE_ROOT, 'src/components');
const HOOKS_DIR = path.join(WORKSPACE_ROOT, 'src/hooks');
const MIGRATIONS_DIR = path.join(WORKSPACE_ROOT, 'supabase/migrations');

// ============================================================================
// APPLICATION STRUCTURE
// ============================================================================

const APPLICATION_STRUCTURE = {
  hubs: {
    production: {
      modules: ['dashboard', 'projects', 'events', 'people', 'assets', 'locations', 'files'],
      description: 'Core production management workflows'
    },
    business: {
      modules: ['companies', 'jobs', 'procurement', 'finance'],
      description: 'Business operations and financial workflows'
    },
    network: {
      modules: ['community', 'marketplace', 'resources'],
      description: 'Collaboration and resource sharing workflows'
    },
    intelligence: {
      modules: ['reports', 'analytics', 'insights'],
      description: 'Data analysis and reporting workflows'
    },
    system: {
      modules: ['admin', 'settings', 'profile'],
      description: 'System configuration and user management workflows'
    }
  },
  
  roles: [
    { name: 'legend', level: 1, scope: 'platform', description: 'Platform Super Admin' },
    { name: 'phantom', level: 2, scope: 'organization', description: 'Organization Super Admin' },
    { name: 'aviator', level: 3, scope: 'organization', description: 'Strategic Leader' },
    { name: 'gladiator', level: 4, scope: 'project', description: 'Project Manager' },
    { name: 'navigator', level: 5, scope: 'department', description: 'Department/Area Manager' },
    { name: 'deviator', level: 6, scope: 'team', description: 'Team Lead' },
    { name: 'raider', level: 7, scope: 'individual', description: 'Team Member' },
    { name: 'vendor', level: 8, scope: 'external', description: 'External Contractor' },
    { name: 'visitor', level: 9, scope: 'custom', description: 'Temporary Custom Access' },
    { name: 'partner', level: 10, scope: 'observer', description: 'Read-Only Stakeholder' },
    { name: 'ambassador', level: 11, scope: 'marketing', description: 'Marketing Affiliate' }
  ],
  
  lifecycle: {
    phases: [
      'pre_production',
      'planning',
      'execution',
      'post_production',
      'archival'
    ],
    description: 'Complete production lifecycle from concept to archive'
  }
};

// ============================================================================
// WORKFLOW DEFINITIONS
// ============================================================================

const CORE_WORKFLOWS = {
  // Production Hub Workflows
  production: {
    project_creation: {
      steps: ['create_project', 'assign_team', 'set_budget', 'define_milestones', 'activate'],
      requiredTables: ['projects', 'workspace_members', 'project_budgets', 'project_milestones'],
      requiredHooks: ['use-projects-data'],
      requiredComponents: ['projects/projects-overview-tab']
    },
    event_management: {
      steps: ['create_event', 'schedule', 'assign_resources', 'run_of_show', 'execute', 'wrap'],
      requiredTables: ['events', 'event_calendar', 'event_run_of_show', 'event_shipping_receiving'],
      requiredHooks: ['use-events-data'],
      requiredComponents: ['events/events-overview-tab', 'events/events-calendar-tab']
    },
    people_management: {
      steps: ['onboard', 'assign_role', 'track_availability', 'manage_certifications', 'offboard'],
      requiredTables: ['profiles', 'user_roles', 'people_availability', 'people_certifications'],
      requiredHooks: ['use-people-data', 'use-rbac'],
      requiredComponents: ['people/people-directory-tab', 'people/people-availability-tab']
    },
    asset_lifecycle: {
      steps: ['catalog', 'checkout', 'track', 'maintain', 'return', 'retire'],
      requiredTables: ['assets', 'asset_catalog', 'asset_transactions', 'asset_maintenance'],
      requiredHooks: ['use-assets-data', 'use-asset-catalog'],
      requiredComponents: ['assets/catalog-tab', 'assets/tracking-tab', 'assets/maintenance-tab']
    },
    location_management: {
      steps: ['define_location', 'set_capacity', 'book', 'manage_access', 'close'],
      requiredTables: ['locations', 'location_capacity', 'location_bookings', 'location_access'],
      requiredHooks: ['use-locations-data'],
      requiredComponents: ['locations/locations-overview-tab', 'locations/locations-bookings-tab']
    },
    file_management: {
      steps: ['upload', 'organize', 'share', 'version', 'archive'],
      requiredTables: ['files', 'file_folders', 'file_shared', 'file_versions'],
      requiredHooks: ['use-files-data'],
      requiredComponents: ['files/files-overview-tab', 'files/files-folders-tab']
    }
  },
  
  // Business Hub Workflows
  business: {
    vendor_management: {
      steps: ['onboard_vendor', 'create_contract', 'assign_work', 'track_performance', 'pay'],
      requiredTables: ['companies', 'company_contracts', 'company_work_orders', 'company_invoices'],
      requiredHooks: ['use-companies-data'],
      requiredComponents: ['companies/companies-overview-tab', 'companies/companies-contracts-tab']
    },
    procurement: {
      steps: ['create_requisition', 'approve', 'purchase', 'receive', 'reconcile'],
      requiredTables: ['procurement_requisitions', 'procurement_orders', 'procurement_receiving', 'procurement_matching'],
      requiredHooks: ['use-procurement-data'],
      requiredComponents: ['procurement/procurement-requisitions-tab', 'procurement/procurement-orders-tab']
    },
    financial_management: {
      steps: ['budget', 'track_expenses', 'process_invoices', 'reconcile', 'report'],
      requiredTables: ['budgets', 'transactions', 'invoices', 'expenses', 'gl_codes'],
      requiredHooks: ['use-finance-data', 'use-budgets', 'use-transactions'],
      requiredComponents: ['finance/finance-budgets-tab', 'finance/finance-transactions-tab']
    },
    hiring: {
      steps: ['create_requisition', 'post_job', 'review_applications', 'interview', 'offer', 'onboard'],
      requiredTables: ['job_requisitions', 'job_postings', 'job_applications', 'job_interviews', 'job_offers'],
      requiredHooks: ['use-jobs-data'],
      requiredComponents: ['jobs/jobs-requisitions-tab', 'jobs/jobs-postings-tab']
    }
  },
  
  // Network Hub Workflows
  network: {
    community_engagement: {
      steps: ['join', 'participate', 'share', 'compete', 'earn_points'],
      requiredTables: ['community_members', 'discussions', 'competitions', 'user_points'],
      requiredHooks: ['use-community-data'],
      requiredComponents: ['community/discussions-tab', 'community/competitions-tab']
    },
    marketplace: {
      steps: ['list_product', 'browse', 'purchase', 'review', 'fulfill'],
      requiredTables: ['marketplace_products', 'marketplace_orders', 'marketplace_reviews', 'marketplace_sales'],
      requiredHooks: ['use-marketplace-data'],
      requiredComponents: ['marketplace/marketplace-shop-tab', 'marketplace/marketplace-orders-tab']
    },
    resource_sharing: {
      steps: ['upload_resource', 'categorize', 'share', 'access', 'rate'],
      requiredTables: ['resource_library', 'resource_guides', 'resource_courses'],
      requiredHooks: ['use-resources-data'],
      requiredComponents: ['resources/resources-library-tab', 'resources/resources-guides-tab']
    }
  },
  
  // Intelligence Hub Workflows
  intelligence: {
    reporting: {
      steps: ['define_report', 'build_query', 'schedule', 'generate', 'distribute'],
      requiredTables: ['report_templates', 'report_builder', 'report_schedules', 'report_exports'],
      requiredHooks: ['use-reports-data'],
      requiredComponents: ['reports/reports-builder-tab', 'reports/reports-templates-tab']
    },
    analytics: {
      steps: ['define_metrics', 'collect_data', 'analyze', 'visualize', 'forecast'],
      requiredTables: ['analytics_metrics_library', 'analytics_custom_views', 'analytics_trends', 'analytics_forecasting'],
      requiredHooks: ['use-analytics-data'],
      requiredComponents: ['analytics/analytics-overview-tab', 'analytics/analytics-forecasting-tab']
    },
    insights: {
      steps: ['detect_patterns', 'identify_anomalies', 'generate_recommendations', 'simulate_scenarios'],
      requiredTables: ['insight_patterns', 'insight_anomalies', 'insight_recommendations', 'insight_scenarios'],
      requiredHooks: ['use-insights-data'],
      requiredComponents: ['insights/insights-patterns-tab', 'insights/insights-recommendations-tab']
    }
  },
  
  // System Hub Workflows
  system: {
    organization_setup: {
      steps: ['create_org', 'configure_settings', 'invite_members', 'assign_roles', 'activate'],
      requiredTables: ['organizations', 'workspace_members', 'user_roles', 'invitations'],
      requiredHooks: ['use-admin-data', 'use-rbac'],
      requiredComponents: ['admin/organization-tab', 'admin/members-management-tab']
    },
    user_management: {
      steps: ['invite', 'onboard', 'assign_permissions', 'track_activity', 'offboard'],
      requiredTables: ['profiles', 'user_roles', 'invitations', 'user_activity'],
      requiredHooks: ['use-admin-data', 'use-rbac'],
      requiredComponents: ['admin/members-management-tab', 'admin/roles-permissions-tab']
    },
    automation: {
      steps: ['define_trigger', 'configure_action', 'test', 'activate', 'monitor'],
      requiredTables: ['automations', 'automation_logs'],
      requiredHooks: ['use-admin-data'],
      requiredComponents: ['admin/automations-tab']
    }
  }
};

// ============================================================================
// END-TO-END LIFECYCLE WORKFLOWS
// ============================================================================

const LIFECYCLE_WORKFLOWS = {
  festival_production: {
    name: 'Complete Festival Production Lifecycle',
    phases: [
      {
        phase: 'pre_production',
        duration: '6-12 months',
        workflows: [
          'project_creation',
          'vendor_management',
          'procurement',
          'financial_management',
          'hiring'
        ],
        criticalPath: true
      },
      {
        phase: 'planning',
        duration: '3-6 months',
        workflows: [
          'event_management',
          'location_management',
          'people_management',
          'asset_lifecycle'
        ],
        criticalPath: true
      },
      {
        phase: 'execution',
        duration: '1-7 days',
        workflows: [
          'event_management',
          'asset_lifecycle',
          'people_management',
          'location_management'
        ],
        criticalPath: true
      },
      {
        phase: 'post_production',
        duration: '1-3 months',
        workflows: [
          'financial_management',
          'reporting',
          'analytics',
          'asset_lifecycle'
        ],
        criticalPath: true
      },
      {
        phase: 'archival',
        duration: 'ongoing',
        workflows: [
          'file_management',
          'reporting',
          'insights'
        ],
        criticalPath: false
      }
    ]
  }
};

// ============================================================================
// AUDIT FUNCTIONS
// ============================================================================

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function checkTableExists(tableName, migrations) {
  return migrations.some(migration => 
    migration.includes(`CREATE TABLE`) && 
    migration.includes(tableName)
  );
}

function checkHookExists(hookName) {
  const hookPath = path.join(HOOKS_DIR, `${hookName}.ts`);
  return fs.existsSync(hookPath);
}

function checkComponentExists(componentPath) {
  const fullPath = path.join(COMPONENTS_DIR, `${componentPath}.tsx`);
  return fs.existsSync(fullPath);
}

function auditWorkflow(workflowName, workflow, migrations) {
  const results = {
    name: workflowName,
    complete: true,
    missing: {
      tables: [],
      hooks: [],
      components: []
    },
    warnings: []
  };
  
  // Check tables
  if (workflow.requiredTables) {
    workflow.requiredTables.forEach(table => {
      if (!checkTableExists(table, migrations)) {
        results.missing.tables.push(table);
        results.complete = false;
      }
    });
  }
  
  // Check hooks
  if (workflow.requiredHooks) {
    workflow.requiredHooks.forEach(hook => {
      if (!checkHookExists(hook)) {
        results.missing.hooks.push(hook);
        results.complete = false;
      }
    });
  }
  
  // Check components
  if (workflow.requiredComponents) {
    workflow.requiredComponents.forEach(component => {
      if (!checkComponentExists(component)) {
        results.missing.components.push(component);
        results.complete = false;
      }
    });
  }
  
  // Check step completeness
  if (workflow.steps && workflow.steps.length === 0) {
    results.warnings.push('No workflow steps defined');
  }
  
  return results;
}

function auditHub(hubName, hubConfig, migrations) {
  const results = {
    hub: hubName,
    modules: {},
    completeness: 0,
    totalWorkflows: 0,
    completeWorkflows: 0
  };
  
  // Check each module exists
  hubConfig.modules.forEach(moduleName => {
    const moduleDir = path.join(COMPONENTS_DIR, moduleName);
    results.modules[moduleName] = {
      exists: fs.existsSync(moduleDir),
      tabs: []
    };
    
    if (results.modules[moduleName].exists) {
      const files = fs.readdirSync(moduleDir);
      results.modules[moduleName].tabs = files.filter(f => f.endsWith('-tab.tsx'));
    }
  });
  
  return results;
}

function auditLifecycleWorkflow(lifecycle, workflowAudits) {
  const results = {
    name: lifecycle.name,
    phases: [],
    complete: true,
    criticalPathBlocked: false
  };
  
  lifecycle.phases.forEach(phase => {
    const phaseResult = {
      phase: phase.phase,
      duration: phase.duration,
      criticalPath: phase.criticalPath,
      workflows: [],
      complete: true
    };
    
    phase.workflows.forEach(workflowName => {
      // Find workflow audit result
      const workflowAudit = Object.values(workflowAudits).flat().find(w => w.name === workflowName);
      
      if (workflowAudit) {
        phaseResult.workflows.push({
          name: workflowName,
          complete: workflowAudit.complete
        });
        
        if (!workflowAudit.complete) {
          phaseResult.complete = false;
          results.complete = false;
          
          if (phase.criticalPath) {
            results.criticalPathBlocked = true;
          }
        }
      } else {
        phaseResult.workflows.push({
          name: workflowName,
          complete: false,
          error: 'Workflow not found in audit'
        });
        phaseResult.complete = false;
        results.complete = false;
      }
    });
    
    results.phases.push(phaseResult);
  });
  
  return results;
}

// ============================================================================
// MAIN AUDIT
// ============================================================================

function runComprehensiveAudit() {
  console.log('🔍 COMPREHENSIVE WORKFLOW AUDIT');
  console.log('================================\n');
  
  // Load all migrations
  const migrationFiles = getAllFiles(MIGRATIONS_DIR).filter(f => f.endsWith('.sql'));
  const migrations = migrationFiles.map(f => fs.readFileSync(f, 'utf8'));
  
  const auditResults = {
    timestamp: new Date().toISOString(),
    summary: {
      totalHubs: 0,
      totalModules: 0,
      totalWorkflows: 0,
      completeWorkflows: 0,
      incompleteWorkflows: 0,
      lifecycleWorkflows: 0,
      lifecycleComplete: 0
    },
    hubs: {},
    workflows: {},
    lifecycle: {},
    gaps: {
      critical: [],
      high: [],
      medium: [],
      low: []
    },
    recommendations: []
  };
  
  // Audit each hub
  console.log('📊 Auditing Hubs...\n');
  Object.entries(APPLICATION_STRUCTURE.hubs).forEach(([hubName, hubConfig]) => {
    auditResults.hubs[hubName] = auditHub(hubName, hubConfig, migrations);
    auditResults.summary.totalHubs++;
    auditResults.summary.totalModules += hubConfig.modules.length;
  });
  
  // Audit each workflow
  console.log('🔄 Auditing Workflows...\n');
  Object.entries(CORE_WORKFLOWS).forEach(([category, workflows]) => {
    auditResults.workflows[category] = [];
    
    Object.entries(workflows).forEach(([workflowName, workflow]) => {
      const result = auditWorkflow(workflowName, workflow, migrations);
      auditResults.workflows[category].push(result);
      auditResults.summary.totalWorkflows++;
      
      if (result.complete) {
        auditResults.summary.completeWorkflows++;
      } else {
        auditResults.summary.incompleteWorkflows++;
        
        // Categorize gaps
        if (result.missing.tables.length > 0) {
          auditResults.gaps.critical.push({
            workflow: workflowName,
            category,
            type: 'missing_tables',
            items: result.missing.tables
          });
        }
        
        if (result.missing.hooks.length > 0) {
          auditResults.gaps.high.push({
            workflow: workflowName,
            category,
            type: 'missing_hooks',
            items: result.missing.hooks
          });
        }
        
        if (result.missing.components.length > 0) {
          auditResults.gaps.medium.push({
            workflow: workflowName,
            category,
            type: 'missing_components',
            items: result.missing.components
          });
        }
      }
    });
  });
  
  // Audit lifecycle workflows
  console.log('🎯 Auditing End-to-End Lifecycle Workflows...\n');
  Object.entries(LIFECYCLE_WORKFLOWS).forEach(([lifecycleName, lifecycle]) => {
    const result = auditLifecycleWorkflow(lifecycle, auditResults.workflows);
    auditResults.lifecycle[lifecycleName] = result;
    auditResults.summary.lifecycleWorkflows++;
    
    if (result.complete) {
      auditResults.summary.lifecycleComplete++;
    }
    
    if (result.criticalPathBlocked) {
      auditResults.gaps.critical.push({
        lifecycle: lifecycleName,
        type: 'critical_path_blocked',
        message: 'Critical path workflows are incomplete'
      });
    }
  });
  
  // Generate recommendations
  console.log('💡 Generating Recommendations...\n');
  
  if (auditResults.gaps.critical.length > 0) {
    auditResults.recommendations.push({
      priority: 'CRITICAL',
      title: 'Missing Database Tables',
      description: 'Core database tables are missing, preventing workflows from functioning',
      action: 'Create missing migrations for required tables',
      impact: 'HIGH - Workflows cannot execute without these tables'
    });
  }
  
  if (auditResults.gaps.high.length > 0) {
    auditResults.recommendations.push({
      priority: 'HIGH',
      title: 'Missing Data Hooks',
      description: 'Data access hooks are missing, preventing components from loading data',
      action: 'Implement missing hooks in src/hooks/',
      impact: 'HIGH - Components cannot access data without these hooks'
    });
  }
  
  if (auditResults.gaps.medium.length > 0) {
    auditResults.recommendations.push({
      priority: 'MEDIUM',
      title: 'Missing UI Components',
      description: 'UI components are missing, preventing users from accessing workflows',
      action: 'Create missing tab components',
      impact: 'MEDIUM - Workflows exist but are not accessible to users'
    });
  }
  
  // Calculate completeness percentage
  const workflowCompleteness = auditResults.summary.totalWorkflows > 0
    ? (auditResults.summary.completeWorkflows / auditResults.summary.totalWorkflows * 100).toFixed(1)
    : 0;
  
  const lifecycleCompleteness = auditResults.summary.lifecycleWorkflows > 0
    ? (auditResults.summary.lifecycleComplete / auditResults.summary.lifecycleWorkflows * 100).toFixed(1)
    : 0;
  
  auditResults.summary.workflowCompleteness = `${workflowCompleteness}%`;
  auditResults.summary.lifecycleCompleteness = `${lifecycleCompleteness}%`;
  
  // Save results
  const outputPath = path.join(WORKSPACE_ROOT, 'docs/audits/COMPREHENSIVE_WORKFLOW_AUDIT.json');
  fs.writeFileSync(outputPath, JSON.stringify(auditResults, null, 2));
  
  console.log('✅ Audit Complete!\n');
  console.log('📈 SUMMARY');
  console.log('==========');
  console.log(`Total Hubs: ${auditResults.summary.totalHubs}`);
  console.log(`Total Modules: ${auditResults.summary.totalModules}`);
  console.log(`Total Workflows: ${auditResults.summary.totalWorkflows}`);
  console.log(`Complete Workflows: ${auditResults.summary.completeWorkflows}`);
  console.log(`Incomplete Workflows: ${auditResults.summary.incompleteWorkflows}`);
  console.log(`Workflow Completeness: ${workflowCompleteness}%`);
  console.log(`Lifecycle Completeness: ${lifecycleCompleteness}%`);
  console.log(`\nCritical Gaps: ${auditResults.gaps.critical.length}`);
  console.log(`High Priority Gaps: ${auditResults.gaps.high.length}`);
  console.log(`Medium Priority Gaps: ${auditResults.gaps.medium.length}`);
  console.log(`\n📄 Full report saved to: ${outputPath}`);
  
  return auditResults;
}

// Run the audit
runComprehensiveAudit();
