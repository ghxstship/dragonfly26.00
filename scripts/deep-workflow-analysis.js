#!/usr/bin/env node

/**
 * DEEP WORKFLOW ANALYSIS
 * Examines implicit workflows, cross-module dependencies, and integration points
 * Identifies gaps in end-to-end operational continuity
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = '/Users/julianclarkson/Documents/Dragonfly26.00';
const COMPONENTS_DIR = path.join(WORKSPACE_ROOT, 'src/components');
const HOOKS_DIR = path.join(WORKSPACE_ROOT, 'src/hooks');

// ============================================================================
// IMPLICIT WORKFLOWS - Cross-module workflows not explicitly defined
// ============================================================================

const IMPLICIT_WORKFLOWS = {
  // Cross-hub workflows that span multiple modules
  complete_event_execution: {
    name: 'Complete Event Execution (Load-in to Load-out)',
    description: 'End-to-end event execution workflow',
    modules: ['events', 'assets', 'people', 'locations', 'files'],
    steps: [
      { step: 'Pre-event planning', modules: ['events', 'locations'], critical: true },
      { step: 'Asset checkout & transport', modules: ['assets', 'events'], critical: true },
      { step: 'Crew call & check-in', modules: ['people', 'events'], critical: true },
      { step: 'Load-in & setup', modules: ['assets', 'locations', 'people'], critical: true },
      { step: 'Run of show execution', modules: ['events', 'people'], critical: true },
      { step: 'Load-out & breakdown', modules: ['assets', 'people', 'locations'], critical: true },
      { step: 'Asset return & inspection', modules: ['assets'], critical: true },
      { step: 'Post-event documentation', modules: ['files', 'events'], critical: false }
    ],
    integrationPoints: [
      'events.run_of_show → people.scheduling',
      'events.equipment → assets.tracking',
      'events.shipping_receiving → assets.transactions',
      'locations.bookings → events.calendar'
    ]
  },
  
  vendor_to_payment: {
    name: 'Vendor Onboarding to Payment',
    description: 'Complete vendor lifecycle from onboarding to final payment',
    modules: ['companies', 'procurement', 'finance', 'files'],
    steps: [
      { step: 'Vendor onboarding', modules: ['companies'], critical: true },
      { step: 'Contract negotiation', modules: ['companies', 'files'], critical: true },
      { step: 'Work order creation', modules: ['companies', 'procurement'], critical: true },
      { step: 'Purchase order approval', modules: ['procurement', 'finance'], critical: true },
      { step: 'Delivery & receiving', modules: ['procurement', 'assets'], critical: true },
      { step: 'Invoice submission', modules: ['companies', 'finance'], critical: true },
      { step: '3-way matching', modules: ['procurement', 'finance'], critical: true },
      { step: 'Payment processing', modules: ['finance'], critical: true },
      { step: 'Performance review', modules: ['companies'], critical: false }
    ],
    integrationPoints: [
      'companies.contracts → files.contracts',
      'companies.work_orders → procurement.orders',
      'procurement.receiving → procurement.matching',
      'procurement.matching → finance.invoices',
      'finance.invoices → finance.payments'
    ]
  },
  
  hiring_to_deployment: {
    name: 'Hiring to Field Deployment',
    description: 'Complete hiring workflow from requisition to field deployment',
    modules: ['jobs', 'people', 'profile', 'files', 'events'],
    steps: [
      { step: 'Job requisition', modules: ['jobs'], critical: true },
      { step: 'Job posting', modules: ['jobs'], critical: true },
      { step: 'Application review', modules: ['jobs'], critical: true },
      { step: 'Interview & selection', modules: ['jobs'], critical: true },
      { step: 'Offer & acceptance', modules: ['jobs'], critical: true },
      { step: 'Onboarding', modules: ['people', 'profile'], critical: true },
      { step: 'Training & certification', modules: ['people', 'profile'], critical: true },
      { step: 'Availability tracking', modules: ['people'], critical: true },
      { step: 'Event assignment', modules: ['events', 'people'], critical: true },
      { step: 'Field deployment', modules: ['events', 'people'], critical: true }
    ],
    integrationPoints: [
      'jobs.offers → people.onboarding',
      'people.onboarding → profile.basic_info',
      'profile.certifications → people.training',
      'people.availability → events.scheduling',
      'events.scheduling → people.assignments'
    ]
  },
  
  budget_to_actuals: {
    name: 'Budget Planning to Actuals Reconciliation',
    description: 'Financial planning and tracking workflow',
    modules: ['projects', 'finance', 'procurement', 'reports'],
    steps: [
      { step: 'Project budget creation', modules: ['projects', 'finance'], critical: true },
      { step: 'Budget approval', modules: ['finance'], critical: true },
      { step: 'Purchase requisitions', modules: ['procurement', 'finance'], critical: true },
      { step: 'Expense tracking', modules: ['finance'], critical: true },
      { step: 'Invoice processing', modules: ['finance', 'procurement'], critical: true },
      { step: 'Variance analysis', modules: ['finance', 'reports'], critical: true },
      { step: 'Forecast updates', modules: ['finance'], critical: false },
      { step: 'Final reconciliation', modules: ['finance', 'reports'], critical: true }
    ],
    integrationPoints: [
      'projects.budgets → finance.budgets',
      'finance.budgets → procurement.requisitions',
      'procurement.orders → finance.expenses',
      'finance.transactions → finance.variance',
      'finance.variance → reports.operational'
    ]
  },
  
  asset_procurement_to_deployment: {
    name: 'Asset Procurement to Field Deployment',
    description: 'Asset acquisition and deployment workflow',
    modules: ['procurement', 'assets', 'finance', 'events', 'locations'],
    steps: [
      { step: 'Asset need identification', modules: ['assets', 'events'], critical: true },
      { step: 'Purchase requisition', modules: ['procurement', 'finance'], critical: true },
      { step: 'Vendor selection', modules: ['companies', 'procurement'], critical: true },
      { step: 'Purchase order', modules: ['procurement', 'finance'], critical: true },
      { step: 'Receiving & inspection', modules: ['procurement', 'assets'], critical: true },
      { step: 'Catalog entry', modules: ['assets'], critical: true },
      { step: 'Asset checkout', modules: ['assets', 'events'], critical: true },
      { step: 'Field deployment', modules: ['assets', 'events', 'locations'], critical: true },
      { step: 'Maintenance tracking', modules: ['assets'], critical: false },
      { step: 'Asset return', modules: ['assets'], critical: true }
    ],
    integrationPoints: [
      'procurement.requisitions → procurement.orders',
      'procurement.receiving → assets.catalog',
      'assets.catalog → assets.tracking',
      'assets.tracking → events.equipment',
      'events.equipment → locations.logistics'
    ]
  },
  
  incident_to_resolution: {
    name: 'Incident Reporting to Resolution',
    description: 'Safety incident management workflow',
    modules: ['events', 'people', 'files', 'admin', 'companies'],
    steps: [
      { step: 'Incident reporting', modules: ['events'], critical: true },
      { step: 'Initial assessment', modules: ['events', 'people'], critical: true },
      { step: 'Documentation', modules: ['files', 'events'], critical: true },
      { step: 'Investigation', modules: ['events', 'people', 'companies'], critical: true },
      { step: 'Corrective actions', modules: ['events', 'people'], critical: true },
      { step: 'Follow-up', modules: ['events'], critical: false },
      { step: 'Compliance reporting', modules: ['admin', 'files'], critical: true }
    ],
    integrationPoints: [
      'events.incidents → people.directory',
      'events.incidents → files.production_reports',
      'events.incidents → companies.compliance',
      'events.incidents → admin.security'
    ]
  },
  
  reporting_to_insights: {
    name: 'Data Collection to Actionable Insights',
    description: 'Intelligence workflow from raw data to recommendations',
    modules: ['analytics', 'reports', 'insights'],
    steps: [
      { step: 'Data source configuration', modules: ['analytics'], critical: true },
      { step: 'Metric definition', modules: ['analytics'], critical: true },
      { step: 'Data collection', modules: ['analytics'], critical: true },
      { step: 'Report generation', modules: ['reports'], critical: true },
      { step: 'Trend analysis', modules: ['analytics'], critical: false },
      { step: 'Pattern detection', modules: ['insights'], critical: false },
      { step: 'Recommendation generation', modules: ['insights'], critical: false },
      { step: 'Action planning', modules: ['insights'], critical: false }
    ],
    integrationPoints: [
      'analytics.data_sources → analytics.metrics_library',
      'analytics.trends → reports.builder',
      'reports.templates → insights.patterns',
      'insights.patterns → insights.recommendations'
    ]
  }
};

// ============================================================================
// ROLE-BASED WORKFLOW ACCESS PATTERNS
// ============================================================================

const ROLE_WORKFLOW_MATRIX = {
  legend: {
    workflows: 'ALL',
    restrictions: 'NONE',
    criticalPaths: 'ALL'
  },
  phantom: {
    workflows: [
      'complete_event_execution',
      'vendor_to_payment',
      'hiring_to_deployment',
      'budget_to_actuals',
      'asset_procurement_to_deployment',
      'incident_to_resolution',
      'reporting_to_insights'
    ],
    restrictions: 'Organization-scoped',
    criticalPaths: 'ALL within organization'
  },
  aviator: {
    workflows: [
      'complete_event_execution',
      'budget_to_actuals',
      'asset_procurement_to_deployment',
      'reporting_to_insights'
    ],
    restrictions: 'Project-scoped, view-only finance',
    criticalPaths: 'Project execution, reporting'
  },
  gladiator: {
    workflows: [
      'complete_event_execution',
      'budget_to_actuals',
      'asset_procurement_to_deployment',
      'incident_to_resolution'
    ],
    restrictions: 'Project-scoped, budget approval required',
    criticalPaths: 'Project execution'
  },
  navigator: {
    workflows: [
      'complete_event_execution',
      'asset_procurement_to_deployment'
    ],
    restrictions: 'Department-scoped, view-only finance',
    criticalPaths: 'Department operations'
  },
  deviator: {
    workflows: [
      'complete_event_execution'
    ],
    restrictions: 'Team-scoped, task management only',
    criticalPaths: 'Team task execution'
  },
  raider: {
    workflows: [
      'complete_event_execution'
    ],
    restrictions: 'Assigned tasks only, view-only',
    criticalPaths: 'Individual task completion'
  },
  vendor: {
    workflows: [
      'vendor_to_payment'
    ],
    restrictions: 'Own contracts only, limited visibility',
    criticalPaths: 'Deliverable submission, invoicing'
  },
  visitor: {
    workflows: 'CUSTOM',
    restrictions: 'Configured per-instance, time-limited',
    criticalPaths: 'Varies by configuration'
  },
  partner: {
    workflows: 'ALL',
    restrictions: 'Read-only across all workflows',
    criticalPaths: 'NONE (observer only)'
  },
  ambassador: {
    workflows: [],
    restrictions: 'Marketing content only',
    criticalPaths: 'NONE'
  }
};

// ============================================================================
// INTEGRATION DEPENDENCIES
// ============================================================================

const MODULE_DEPENDENCIES = {
  dashboard: {
    depends_on: ['projects', 'events', 'people', 'assets', 'files', 'finance', 'jobs'],
    provides_to: [],
    integration_type: 'aggregator'
  },
  projects: {
    depends_on: ['finance', 'people'],
    provides_to: ['events', 'assets', 'locations', 'files', 'reports'],
    integration_type: 'core_entity'
  },
  events: {
    depends_on: ['projects', 'assets', 'people', 'locations'],
    provides_to: ['files', 'reports', 'analytics'],
    integration_type: 'core_workflow'
  },
  people: {
    depends_on: ['profile', 'jobs'],
    provides_to: ['events', 'projects', 'assets', 'reports'],
    integration_type: 'core_entity'
  },
  assets: {
    depends_on: ['procurement', 'finance'],
    provides_to: ['events', 'locations', 'reports'],
    integration_type: 'core_entity'
  },
  locations: {
    depends_on: ['projects'],
    provides_to: ['events', 'assets', 'reports'],
    integration_type: 'core_entity'
  },
  files: {
    depends_on: [],
    provides_to: ['projects', 'events', 'companies', 'finance'],
    integration_type: 'support'
  },
  companies: {
    depends_on: ['files'],
    provides_to: ['procurement', 'finance', 'jobs'],
    integration_type: 'core_entity'
  },
  jobs: {
    depends_on: ['companies'],
    provides_to: ['people', 'finance'],
    integration_type: 'core_workflow'
  },
  procurement: {
    depends_on: ['companies', 'finance'],
    provides_to: ['assets', 'finance', 'reports'],
    integration_type: 'core_workflow'
  },
  finance: {
    depends_on: ['projects', 'procurement', 'companies'],
    provides_to: ['reports', 'analytics', 'insights'],
    integration_type: 'core_workflow'
  },
  community: {
    depends_on: ['people'],
    provides_to: ['marketplace'],
    integration_type: 'engagement'
  },
  marketplace: {
    depends_on: ['community', 'companies'],
    provides_to: ['procurement', 'finance'],
    integration_type: 'commerce'
  },
  resources: {
    depends_on: [],
    provides_to: ['people', 'community'],
    integration_type: 'support'
  },
  reports: {
    depends_on: ['ALL_MODULES'],
    provides_to: ['insights'],
    integration_type: 'intelligence'
  },
  analytics: {
    depends_on: ['ALL_MODULES'],
    provides_to: ['reports', 'insights'],
    integration_type: 'intelligence'
  },
  insights: {
    depends_on: ['analytics', 'reports'],
    provides_to: [],
    integration_type: 'intelligence'
  },
  admin: {
    depends_on: [],
    provides_to: ['ALL_MODULES'],
    integration_type: 'system'
  },
  settings: {
    depends_on: [],
    provides_to: ['ALL_MODULES'],
    integration_type: 'system'
  },
  profile: {
    depends_on: [],
    provides_to: ['people', 'jobs'],
    integration_type: 'system'
  }
};

// ============================================================================
// ANALYSIS FUNCTIONS
// ============================================================================

function analyzeImplicitWorkflow(workflowName, workflow) {
  const analysis = {
    name: workflowName,
    displayName: workflow.name,
    description: workflow.description,
    modules: workflow.modules,
    totalSteps: workflow.steps.length,
    criticalSteps: workflow.steps.filter(s => s.critical).length,
    integrationPoints: workflow.integrationPoints.length,
    gaps: [],
    risks: [],
    completeness: 0
  };
  
  // Check if all required modules exist
  workflow.modules.forEach(moduleName => {
    const moduleDir = path.join(COMPONENTS_DIR, moduleName);
    if (!fs.existsSync(moduleDir)) {
      analysis.gaps.push({
        type: 'missing_module',
        module: moduleName,
        severity: 'CRITICAL'
      });
    }
  });
  
  // Check integration points
  workflow.integrationPoints.forEach(integration => {
    const [source, target] = integration.split(' → ');
    const [sourceModule, sourceTab] = source.split('.');
    const [targetModule, targetTab] = target.split('.');
    
    const sourceExists = fs.existsSync(
      path.join(COMPONENTS_DIR, sourceModule, `${sourceModule}-${sourceTab}-tab.tsx`)
    );
    const targetExists = fs.existsSync(
      path.join(COMPONENTS_DIR, targetModule, `${targetModule}-${targetTab}-tab.tsx`)
    );
    
    if (!sourceExists || !targetExists) {
      analysis.gaps.push({
        type: 'broken_integration',
        integration,
        sourceExists,
        targetExists,
        severity: 'HIGH'
      });
    }
  });
  
  // Identify risks
  if (workflow.steps.filter(s => s.critical).length > 5) {
    analysis.risks.push({
      type: 'complex_critical_path',
      message: 'Workflow has many critical steps, increasing failure risk',
      severity: 'MEDIUM'
    });
  }
  
  if (workflow.modules.length > 4) {
    analysis.risks.push({
      type: 'high_module_coupling',
      message: 'Workflow spans many modules, increasing coordination complexity',
      severity: 'MEDIUM'
    });
  }
  
  // Calculate completeness
  const totalChecks = workflow.modules.length + workflow.integrationPoints.length;
  const failedChecks = analysis.gaps.length;
  analysis.completeness = totalChecks > 0 
    ? ((totalChecks - failedChecks) / totalChecks * 100).toFixed(1)
    : 100;
  
  return analysis;
}

function analyzeDependencyGraph() {
  const graph = {
    nodes: Object.keys(MODULE_DEPENDENCIES),
    edges: [],
    circularDependencies: [],
    orphanedModules: [],
    criticalModules: []
  };
  
  // Build edges
  Object.entries(MODULE_DEPENDENCIES).forEach(([module, config]) => {
    config.depends_on.forEach(dependency => {
      if (dependency !== 'ALL_MODULES') {
        graph.edges.push({
          from: dependency,
          to: module,
          type: 'depends_on'
        });
      }
    });
    
    config.provides_to.forEach(consumer => {
      if (consumer !== 'ALL_MODULES') {
        graph.edges.push({
          from: module,
          to: consumer,
          type: 'provides_to'
        });
      }
    });
  });
  
  // Find orphaned modules (no dependencies or consumers)
  graph.nodes.forEach(module => {
    const hasIncoming = graph.edges.some(e => e.to === module);
    const hasOutgoing = graph.edges.some(e => e.from === module);
    
    if (!hasIncoming && !hasOutgoing) {
      graph.orphanedModules.push(module);
    }
  });
  
  // Find critical modules (many consumers)
  graph.nodes.forEach(module => {
    const consumers = graph.edges.filter(e => e.from === module && e.type === 'provides_to');
    if (consumers.length >= 3) {
      graph.criticalModules.push({
        module,
        consumerCount: consumers.length,
        consumers: consumers.map(e => e.to)
      });
    }
  });
  
  return graph;
}

function analyzeRoleWorkflowAccess() {
  const analysis = {
    roles: [],
    workflowCoverage: {},
    accessGaps: []
  };
  
  Object.entries(ROLE_WORKFLOW_MATRIX).forEach(([roleName, config]) => {
    const roleAnalysis = {
      role: roleName,
      workflowAccess: config.workflows === 'ALL' ? 'FULL' : 
                      config.workflows === 'CUSTOM' ? 'CUSTOM' :
                      config.workflows.length,
      restrictions: config.restrictions,
      criticalPaths: config.criticalPaths
    };
    
    analysis.roles.push(roleAnalysis);
    
    // Track workflow coverage
    if (Array.isArray(config.workflows)) {
      config.workflows.forEach(workflow => {
        if (!analysis.workflowCoverage[workflow]) {
          analysis.workflowCoverage[workflow] = [];
        }
        analysis.workflowCoverage[workflow].push(roleName);
      });
    }
  });
  
  // Find workflows with limited role access
  Object.entries(analysis.workflowCoverage).forEach(([workflow, roles]) => {
    if (roles.length < 3) {
      analysis.accessGaps.push({
        workflow,
        accessibleBy: roles,
        severity: 'MEDIUM',
        message: `Workflow only accessible by ${roles.length} role(s)`
      });
    }
  });
  
  return analysis;
}

// ============================================================================
// MAIN ANALYSIS
// ============================================================================

function runDeepAnalysis() {
  console.log('🔬 DEEP WORKFLOW ANALYSIS');
  console.log('=========================\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    implicitWorkflows: {},
    dependencyGraph: null,
    roleAccess: null,
    summary: {
      totalImplicitWorkflows: 0,
      completeImplicitWorkflows: 0,
      averageCompleteness: 0,
      totalGaps: 0,
      totalRisks: 0,
      criticalModules: 0,
      accessGaps: 0
    },
    recommendations: []
  };
  
  // Analyze implicit workflows
  console.log('🔄 Analyzing Implicit Workflows...\n');
  Object.entries(IMPLICIT_WORKFLOWS).forEach(([workflowName, workflow]) => {
    const analysis = analyzeImplicitWorkflow(workflowName, workflow);
    results.implicitWorkflows[workflowName] = analysis;
    results.summary.totalImplicitWorkflows++;
    
    if (parseFloat(analysis.completeness) === 100) {
      results.summary.completeImplicitWorkflows++;
    }
    
    results.summary.totalGaps += analysis.gaps.length;
    results.summary.totalRisks += analysis.risks.length;
  });
  
  // Calculate average completeness
  const completenessValues = Object.values(results.implicitWorkflows)
    .map(w => parseFloat(w.completeness));
  results.summary.averageCompleteness = completenessValues.length > 0
    ? (completenessValues.reduce((a, b) => a + b, 0) / completenessValues.length).toFixed(1)
    : 0;
  
  // Analyze dependency graph
  console.log('🕸️  Analyzing Module Dependencies...\n');
  results.dependencyGraph = analyzeDependencyGraph();
  results.summary.criticalModules = results.dependencyGraph.criticalModules.length;
  
  // Analyze role-based access
  console.log('👥 Analyzing Role-Based Workflow Access...\n');
  results.roleAccess = analyzeRoleWorkflowAccess();
  results.summary.accessGaps = results.roleAccess.accessGaps.length;
  
  // Generate recommendations
  console.log('💡 Generating Recommendations...\n');
  
  if (results.summary.totalGaps > 0) {
    results.recommendations.push({
      priority: 'HIGH',
      title: 'Implicit Workflow Gaps Detected',
      description: `${results.summary.totalGaps} gaps found in cross-module workflows`,
      action: 'Review and implement missing integration points',
      impact: 'Prevents seamless end-to-end workflow execution'
    });
  }
  
  if (results.summary.criticalModules > 0) {
    results.recommendations.push({
      priority: 'MEDIUM',
      title: 'Critical Module Dependencies',
      description: `${results.summary.criticalModules} modules are critical integration points`,
      action: 'Ensure high availability and robust error handling for critical modules',
      impact: 'Failure of critical modules affects multiple workflows'
    });
  }
  
  if (results.summary.accessGaps > 0) {
    results.recommendations.push({
      priority: 'LOW',
      title: 'Limited Workflow Access',
      description: `${results.summary.accessGaps} workflows have limited role access`,
      action: 'Review role permissions to ensure appropriate workflow access',
      impact: 'Some workflows may not be accessible to users who need them'
    });
  }
  
  // Save results
  const outputPath = path.join(WORKSPACE_ROOT, 'docs/audits/DEEP_WORKFLOW_ANALYSIS.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log('✅ Deep Analysis Complete!\n');
  console.log('📈 SUMMARY');
  console.log('==========');
  console.log(`Implicit Workflows: ${results.summary.totalImplicitWorkflows}`);
  console.log(`Complete Workflows: ${results.summary.completeImplicitWorkflows}`);
  console.log(`Average Completeness: ${results.summary.averageCompleteness}%`);
  console.log(`Total Gaps: ${results.summary.totalGaps}`);
  console.log(`Total Risks: ${results.summary.totalRisks}`);
  console.log(`Critical Modules: ${results.summary.criticalModules}`);
  console.log(`Access Gaps: ${results.summary.accessGaps}`);
  console.log(`\n📄 Full report saved to: ${outputPath}`);
  
  return results;
}

// Run the analysis
runDeepAnalysis();
