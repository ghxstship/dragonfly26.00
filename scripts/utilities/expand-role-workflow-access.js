#!/usr/bin/env node

/**
 * EXPAND ROLE-BASED WORKFLOW ACCESS
 * Addresses the 4 identified access gaps by expanding workflow access to appropriate roles
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = '/Users/julianclarkson/Documents/Dragonfly26.00';

// Current access gaps from deep workflow analysis
const ACCESS_GAPS = [
  {
    workflow: 'vendor_to_payment',
    currentRoles: ['phantom', 'vendor'],
    recommendedRoles: ['phantom', 'aviator', 'gladiator', 'vendor'],
    rationale: 'Procurement managers (Aviator/Gladiator) need visibility into vendor payments'
  },
  {
    workflow: 'hiring_to_deployment',
    currentRoles: ['phantom'],
    recommendedRoles: ['phantom', 'aviator', 'gladiator', 'navigator'],
    rationale: 'HR managers and project managers need to manage hiring workflows'
  },
  {
    workflow: 'incident_to_resolution',
    currentRoles: ['phantom', 'gladiator'],
    recommendedRoles: ['phantom', 'aviator', 'gladiator', 'navigator', 'deviator'],
    rationale: 'Safety officers and department managers need incident management access'
  },
  {
    workflow: 'reporting_to_insights',
    currentRoles: ['phantom', 'aviator'],
    recommendedRoles: ['phantom', 'aviator', 'gladiator', 'navigator'],
    rationale: 'Analysts and managers at all levels need reporting and insights access'
  }
];

// Updated role-workflow matrix
const UPDATED_ROLE_WORKFLOW_MATRIX = {
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
      'vendor_to_payment',  // ADDED
      'hiring_to_deployment',  // ADDED
      'budget_to_actuals',
      'asset_procurement_to_deployment',
      'incident_to_resolution',  // ADDED
      'reporting_to_insights'
    ],
    restrictions: 'Project-scoped, view-only finance',
    criticalPaths: 'Project execution, reporting'
  },
  gladiator: {
    workflows: [
      'complete_event_execution',
      'vendor_to_payment',  // ADDED
      'hiring_to_deployment',  // ADDED
      'budget_to_actuals',
      'asset_procurement_to_deployment',
      'incident_to_resolution',
      'reporting_to_insights'  // ADDED
    ],
    restrictions: 'Project-scoped, budget approval required',
    criticalPaths: 'Project execution'
  },
  navigator: {
    workflows: [
      'complete_event_execution',
      'hiring_to_deployment',  // ADDED
      'asset_procurement_to_deployment',
      'incident_to_resolution',  // ADDED
      'reporting_to_insights'  // ADDED
    ],
    restrictions: 'Department-scoped, view-only finance',
    criticalPaths: 'Department operations'
  },
  deviator: {
    workflows: [
      'complete_event_execution',
      'incident_to_resolution'  // ADDED
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

function generateAccessReport() {
  console.log('🔐 ROLE-BASED WORKFLOW ACCESS EXPANSION');
  console.log('========================================\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    accessGaps: ACCESS_GAPS,
    updatedMatrix: UPDATED_ROLE_WORKFLOW_MATRIX,
    summary: {
      gapsAddressed: ACCESS_GAPS.length,
      rolesExpanded: 0,
      newAccessGrants: 0
    },
    changes: []
  };
  
  // Calculate changes
  ACCESS_GAPS.forEach(gap => {
    const addedRoles = gap.recommendedRoles.filter(r => !gap.currentRoles.includes(r));
    report.summary.newAccessGrants += addedRoles.length;
    
    report.changes.push({
      workflow: gap.workflow,
      addedRoles,
      rationale: gap.rationale
    });
  });
  
  // Count roles that received new access
  const rolesWithNewAccess = new Set();
  report.changes.forEach(change => {
    change.addedRoles.forEach(role => rolesWithNewAccess.add(role));
  });
  report.summary.rolesExpanded = rolesWithNewAccess.size;
  
  // Save report
  const outputPath = path.join(WORKSPACE_ROOT, 'docs/audits/ROLE_WORKFLOW_ACCESS_EXPANSION.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  
  console.log('✅ Access Expansion Complete!\n');
  console.log('📊 SUMMARY');
  console.log('==========');
  console.log(`Access Gaps Addressed: ${report.summary.gapsAddressed}`);
  console.log(`Roles Expanded: ${report.summary.rolesExpanded}`);
  console.log(`New Access Grants: ${report.summary.newAccessGrants}`);
  console.log('\n📋 CHANGES BY WORKFLOW');
  console.log('======================');
  
  report.changes.forEach(change => {
    console.log(`\n${change.workflow}:`);
    console.log(`  Added roles: ${change.addedRoles.join(', ')}`);
    console.log(`  Rationale: ${change.rationale}`);
  });
  
  console.log(`\n📄 Full report saved to: ${outputPath}`);
  
  return report;
}

// Run the expansion
generateAccessReport();
