#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const archiveDir = path.join(docsDir, 'archive');

// File categorization based on patterns
const categories = {
  // KEEP IN ROOT - Essential files
  keep: [
    'README.md',
    'LICENSE'
  ],
  
  // FINAL STATUS - Most recent completion certifications
  final: [
    'GLOBAL_100_PERCENT_CERTIFICATION_2025_10_16.md',
    'COMPLETE_APPLICATION_100_PERCENT_CERTIFICATION.md',
    'COMPLETE_SYSTEM_100_PERCENT_GLOBAL_COMPLIANCE_2025_10_16.md'
  ],
  
  // ARCHIVE - Outdated/duplicate audit files
  archive: {
    // Duplicate/superseded hub audits
    hubAudits: [
      'BUSINESS_HUB_PROGRESS_82_PERCENT.md',
      'BUSINESS_HUB_ACCESSIBILITY_I18N_AUDIT_2025_01_16.md',
      'BUSINESS_HUB_AUDIT_EXECUTIVE_SUMMARY.md',
      'BUSINESS_HUB_COMPLETION_CHECKLIST.md',
      'BUSINESS_HUB_FINAL_COMPLETION_REPORT.md',
      'BUSINESS_HUB_FINAL_STATUS.md',
      'BUSINESS_HUB_REMEDIATION_COMPLETE_2025_01_16.md',
      'BUSINESS_HUB_ZERO_TOLERANCE_AUDIT.md',
      'BUSINESS_HUB_ZERO_TOLERANCE_AUDIT_2025_01_16.md',
      'BUSINESS_HUB_ZERO_TOLERANCE_AUDIT_2025_10_15.md',
      'BUSINESS_HUB_100_PERCENT_COMPLETE.md',
      
      'INTELLIGENCE_HUB_100_PERCENT_VERIFIED.md',
      'INTELLIGENCE_HUB_AUDIT_2025_10_15.md',
      'INTELLIGENCE_HUB_FULL_STACK_AUDIT_2025_10_15.md',
      'INTELLIGENCE_HUB_I18N_ACCESSIBILITY_AUDIT_2025_10_15.md',
      'INTELLIGENCE_HUB_I18N_COMPLETE_100_PERCENT.md',
      'INTELLIGENCE_HUB_I18N_REMEDIATION_STATUS.md',
      'INTELLIGENCE_HUB_ZERO_TOLERANCE_AUDIT_2025_10_15_2334.md',
      'INTELLIGENCE_HUB_ZERO_TOLERANCE_AUDIT_2025_10_15_COMPLETE.md',
      'INTELLIGENCE_HUB_100_PERCENT_COMPLETE_2025_10_16.md',
      
      'NETWORK_HUB_AUDIT_EXECUTIVE_SUMMARY.md',
      'NETWORK_HUB_I18N_100_PERCENT_COMPLETE.md',
      'NETWORK_HUB_I18N_ACCESSIBILITY_AUDIT_2025_01_15.md',
      'NETWORK_HUB_I18N_ACTUAL_100_PERCENT_COMPLETE.md',
      'NETWORK_HUB_I18N_VALIDATION_AUDIT_2025_01_15.md',
      'NETWORK_HUB_ONLY_AUDIT_2025_01_15.md',
      'NETWORK_HUB_ZERO_TOLERANCE_AUDIT_2025_01_15.md',
      'NETWORK_HUB_ZERO_TOLERANCE_FULL_STACK_AUDIT_2025_01_15.md',
      'NETWORK_HUB_100_PERCENT_COMPLETE.md',
      'COMPLETE_NETWORK_HUB_AUDIT_2025_01_15.md',
      
      'PRODUCTION_HUB_100_PERCENT_COMPLETE.md',
      'PRODUCTION_HUB_100_PERCENT_IMPLEMENTATION_GUIDE.md',
      'PRODUCTION_HUB_A11Y_QUICK_REFERENCE.md',
      'PRODUCTION_HUB_ACCESSIBILITY_AUDIT_2025_10_15.md',
      'PRODUCTION_HUB_AUDIT_2025_10_15.md',
      'PRODUCTION_HUB_FILE_BY_FILE_CHECKLIST.md',
      'PRODUCTION_HUB_FILE_INVENTORY_LOG.md',
      'PRODUCTION_HUB_REALTIME_STATUS.md',
      'PRODUCTION_HUB_REMEDIATION_PRIORITY_MATRIX.md',
      'PRODUCTION_HUB_ZERO_TOLERANCE_AUDIT_2025_01_16.md',
      
      'SYSTEM_HUB_100_PERCENT_CERTIFICATION_2025_10_16.md',
      'SYSTEM_HUB_100_PERCENT_COMPLETE_2025_01_16.md',
      'SYSTEM_HUB_100_PERCENT_COMPLETE_2025_10_16_0000.md',
      'SYSTEM_HUB_100_PERCENT_COMPLETE_FINAL.md',
      'SYSTEM_HUB_100_PERCENT_STATUS_FINAL.md',
      'SYSTEM_HUB_ARCHITECTURE_AUDIT.md',
      'SYSTEM_HUB_FILE_BY_FILE_CHECKLIST_2025_01_15.md',
      'SYSTEM_HUB_I18N_ACCESSIBILITY_AUDIT_2025_01_16.md',
      'SYSTEM_HUB_QUICK_REFERENCE_2025_01_16.md',
      'SYSTEM_HUB_TRUE_100_PERCENT_COMPLETE.md',
      'SYSTEM_HUB_ZERO_TOLERANCE_AUDIT_2025_01_15_2357.md',
      'SYSTEM_HUB_ZERO_TOLERANCE_AUDIT_2025_01_16.md',
      'SYSTEM_HUB_ZERO_TOLERANCE_AUDIT_2025_01_16_2334.md',
      'FINAL_SYSTEM_HUB_AUDIT_2025_10_15.md',
      
      'PROFILE_MODULE_FILE_BY_FILE_CHECKLIST.md',
      'PROFILE_MODULE_TRUE_100_PERCENT_COMPLETE.md',
      'PROFILE_MODULE_ZERO_TOLERANCE_AUDIT_2025_01_15.md',
      'PROFILE_MODULE_ZERO_TOLERANCE_COMPLETION_REPORT_2025_01_15.md',
      'PROFILE_PAGES_100_PERCENT_COMPLETE_2025_01_16.md',
      'PROFILE_PAGES_100_PERCENT_COMPLETE_2025_01_16_2300.md',
      'PROFILE_PAGES_100_PERCENT_COMPLETE_2025_01_16_2320.md',
      'PROFILE_PAGES_100_PERCENT_COMPLETION_GUIDE.md',
      'PROFILE_PAGES_ACTUAL_STATUS_2025_01_16_2325.md',
      'PROFILE_PAGES_CRITICAL_FIXES_COMPLETE_2025_01_16.md',
      'PROFILE_PAGES_FINAL_STATUS_2025_01_16_2317.md',
      'PROFILE_PAGES_INTERNATIONAL_ACCESSIBILITY_AUDIT_2025_01_16.md',
      'PROFILE_PAGES_REMEDIATION_COMPLETE_2025_01_16.md',
      'PROFILE_PAGES_TRUE_100_PERCENT_COMPLETE_2025_01_16_2332.md',
      'PROFILE_PAGES_TRUE_FINAL_STATUS_2025_01_16_2330.md',
      'PROFILE_PAGES_ZERO_TOLERANCE_AUDIT_2025_01_16.md',
      'PROFILE_PAGES_ZERO_TOLERANCE_AUDIT_2025_01_16_2255.md',
      'PROFILE_VIOLATION_SUMMARY.md',
      
      'PROJECTS_HUB_100_PERCENT_COMPLETE.md'
    ],
    
    // Duplicate/superseded general audits
    generalAudits: [
      '100_PERCENT_COMPLETE_AUDIT.md',
      'ACTION_ITEMS_FROM_AUDIT.md',
      'APPLICATION_TOP_HEADER_AUDIT_2025_10_15.md',
      'AUDIT_EXECUTIVE_SUMMARY.md',
      'AUDIT_QUICK_REFERENCE.md',
      'AUDIT_SUMMARY_ACTIONS_TAKEN.md',
      'BUGFIX_ASSETS_MODULE_2025_10_15.md',
      'COMPLETE_SYSTEM_AUDIT_SUMMARY.md',
      'DEPLOYMENT_SUMMARY_2025_10_15.md',
      'FULL_STACK_AUDIT_COMPLETE_2025_10_15.md',
      'FULL_STACK_AUDIT_COMPLETE_2025_10_15_2329.md',
      'FULL_STACK_AUDIT_REPORT_2025_10_15.md',
      'FULL_STACK_HEADER_AUDIT_2025_10_15.md',
      'IMMEDIATE_ACTION_PLAN.md',
      'IMPLEMENTATION_STATUS_REALTIME.md',
      'IMPLEMENTATION_SUMMARY.md',
      'IMPLEMENTATION_VERIFICATION_2025_10_15.md',
      'LAYOUT_STANDARDIZATION_AUDIT_2025_10_15.md',
      'LEGACY_TABLE_VIEW_REMOVAL_COMPLETE.md',
      'NEXT_STEPS_TO_100_PERCENT.md',
      'NOTIFICATIONS_QUICK_START.md',
      'PERFORMANCE_OPTIMIZATION_COMPLETE.md',
      'REMEDIATION_COMPLETE_VERIFICATION.md',
      'SESSION_EXECUTION_PLAN.md',
      'ZERO_TOLERANCE_AUDIT_100_PERCENT_COMPLETE.md',
      'ZERO_TOLERANCE_AUDIT_FINAL_2025_10_15.md',
      'ZERO_TOLERANCE_AUDIT_SUMMARY.md',
      'ZERO_TOLERANCE_AUDIT_SUMMARY_2025_10_15.md',
      'ZERO_TOLERANCE_FULL_STACK_AUDIT_2025_10_15.md'
    ]
  }
};

function createDirectories() {
  console.log('Creating directory structure...');
  
  const dirs = [
    path.join(archiveDir, '2025-01'),
    path.join(archiveDir, '2025-10'),
    path.join(archiveDir, 'hub-audits'),
    path.join(archiveDir, 'general-audits')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  ✓ Created ${path.relative(rootDir, dir)}`);
    }
  });
}

function moveToArchive(filename, subdirectory = '') {
  const sourcePath = path.join(rootDir, filename);
  const targetDir = subdirectory 
    ? path.join(archiveDir, subdirectory)
    : archiveDir;
  const targetPath = path.join(targetDir, filename);
  
  if (fs.existsSync(sourcePath)) {
    fs.renameSync(sourcePath, targetPath);
    console.log(`  ✓ Archived ${filename} → ${path.relative(rootDir, targetPath)}`);
    return true;
  }
  return false;
}

function consolidateDocumentation() {
  console.log('\n=== DRAGONFLY 26.00 DOCUMENTATION CONSOLIDATION ===\n');
  
  // Step 1: Create directories
  createDirectories();
  
  // Step 2: Archive hub-specific audits
  console.log('\nArchiving hub-specific audit documents...');
  let archived = 0;
  categories.archive.hubAudits.forEach(file => {
    if (moveToArchive(file, 'hub-audits')) archived++;
  });
  console.log(`Archived ${archived} hub audit files`);
  
  // Step 3: Archive general audits
  console.log('\nArchiving general audit documents...');
  archived = 0;
  categories.archive.generalAudits.forEach(file => {
    if (moveToArchive(file, 'general-audits')) archived++;
  });
  console.log(`Archived ${archived} general audit files`);
  
  // Step 4: Count remaining files
  const remainingFiles = fs.readdirSync(rootDir)
    .filter(f => f.endsWith('.md') && f !== 'README.md');
  
  console.log(`\n=== CLEANUP COMPLETE ===`);
  console.log(`Root directory now has ${remainingFiles.length + 1} markdown files (including README.md)`);
  console.log(`\nRemaining files:`);
  remainingFiles.forEach(f => console.log(`  - ${f}`));
  
  return {
    archived: categories.archive.hubAudits.length + categories.archive.generalAudits.length,
    remaining: remainingFiles.length + 1
  };
}

// Execute
try {
  const result = consolidateDocumentation();
  console.log(`\n✅ Successfully archived ${result.archived} files`);
  console.log(`✅ ${result.remaining} essential files remain in root`);
} catch (error) {
  console.error('❌ Error during consolidation:', error);
  process.exit(1);
}
