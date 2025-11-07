#!/usr/bin/env node

/**
 * Execute Codebase Reorganization
 * Cleans, consolidates, organizes, and optimizes the directory structure
 * 
 * SAFE MODE: Creates backup before any operations
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');
const BACKUP_DIR = path.join(ROOT, '.reorganization-backup');

const operations = {
  moved: [],
  deleted: [],
  created: [],
  errors: []
};

// Ensure backup directory exists
if (!DRY_RUN && !fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function safeMove(from, to) {
  const fromPath = path.join(ROOT, from);
  const toPath = path.join(ROOT, to);
  
  if (DRY_RUN) {
    console.log(`[DRY RUN] Would move: ${from} → ${to}`);
    operations.moved.push({ from, to, status: 'dry-run' });
    return;
  }

  try {
    // Create target directory if needed
    const toDir = path.dirname(toPath);
    if (!fs.existsSync(toDir)) {
      fs.mkdirSync(toDir, { recursive: true });
      operations.created.push(toDir);
    }

    // Move file
    fs.renameSync(fromPath, toPath);
    operations.moved.push({ from, to, status: 'success' });
    console.log(`✓ Moved: ${from} → ${to}`);
  } catch (error) {
    operations.errors.push({ operation: 'move', from, to, error: error.message });
    console.error(`✗ Error moving ${from}: ${error.message}`);
  }
}

function safeDelete(filePath) {
  const fullPath = path.join(ROOT, filePath);
  
  if (DRY_RUN) {
    console.log(`[DRY RUN] Would delete: ${filePath}`);
    operations.deleted.push({ path: filePath, status: 'dry-run' });
    return;
  }

  try {
    // Backup before delete
    const backupPath = path.join(BACKUP_DIR, filePath);
    const backupDir = path.dirname(backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    fs.copyFileSync(fullPath, backupPath);

    // Delete
    fs.unlinkSync(fullPath);
    operations.deleted.push({ path: filePath, status: 'success' });
    console.log(`✓ Deleted: ${filePath} (backed up)`);
  } catch (error) {
    operations.errors.push({ operation: 'delete', path: filePath, error: error.message });
    console.error(`✗ Error deleting ${filePath}: ${error.message}`);
  }
}

function createDirectory(dirPath) {
  const fullPath = path.join(ROOT, dirPath);
  
  if (DRY_RUN) {
    console.log(`[DRY RUN] Would create directory: ${dirPath}`);
    return;
  }

  try {
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      operations.created.push(dirPath);
      console.log(`✓ Created directory: ${dirPath}`);
    }
  } catch (error) {
    operations.errors.push({ operation: 'mkdir', path: dirPath, error: error.message });
    console.error(`✗ Error creating ${dirPath}: ${error.message}`);
  }
}

console.log('\n' + '='.repeat(80));
console.log('CODEBASE REORGANIZATION EXECUTION');
if (DRY_RUN) {
  console.log('MODE: DRY RUN (no changes will be made)');
} else {
  console.log('MODE: LIVE (changes will be applied)');
  console.log(`BACKUP: ${BACKUP_DIR}`);
}
console.log('='.repeat(80) + '\n');

// ============================================================================
// PHASE 1: ROOT CLEANUP
// ============================================================================
console.log('📁 PHASE 1: Root Cleanup\n');

// Delete build artifacts
console.log('Removing build artifacts...');
safeDelete('build-final.log');
safeDelete('build-output.log');
safeDelete('final-build-output.log');
safeDelete('tsconfig.tsbuildinfo');

// Move Full Stack Audit to docs
console.log('\nMoving audit file to docs...');
safeMove('Full Stack Audit', 'docs/audits/FULL_STACK_AUDIT_LATEST.txt');

// ============================================================================
// PHASE 2: SCRIPTS ORGANIZATION
// ============================================================================
console.log('\n📁 PHASE 2: Scripts Organization\n');

// Create subdirectories
const scriptDirs = [
  'scripts/accessibility',
  'scripts/i18n',
  'scripts/database',
  'scripts/responsive',
  'scripts/typography',
  'scripts/marketing',
  'scripts/audit',
  'scripts/fix',
  'scripts/generation',
  'scripts/testing',
  'scripts/deployment',
  'scripts/archive',
  'scripts/utilities'
];

console.log('Creating script subdirectories...');
scriptDirs.forEach(dir => createDirectory(dir));

// Move scripts by category
console.log('\nOrganizing scripts by category...');

const scriptMappings = {
  // Accessibility
  'accessibility/': [
    'accessibility-achieve-perfect-100.js',
    'accessibility-comprehensive-final.js',
    'accessibility-final-push-100.js',
    'accessibility-final-remediation.js',
    'accessibility-remediation-complete.js',
    'accessibility-true-100-percent.js',
    'accessibility-ultimate-fix.js',
    'fix-accessibility-comprehensive.js',
    'fix-missing-aria.js',
    'find-missing-aria.js',
    'remediate-accessibility-100-percent.js',
    'verify-accessibility-100-percent.js'
  ],
  
  // i18n
  'i18n/': [
    'add-i18n-to-all-marketing-components.js',
    'add-marketing-i18n-to-all-languages.js',
    'add-norwegian-language.js',
    'add-sitemap-translation-keys.js',
    'add-solutions-i18n-to-all-languages.js',
    'audit-marketing-i18n-accessibility.js',
    'audit-marketing-i18n-complete.js',
    'check-translation-progress.js',
    'complete-marketing-i18n-accessibility.js',
    'comprehensive-translation-audit.js',
    'diagnose-language-toggles.js',
    'final-marketing-i18n-complete.js',
    'find-all-hardcoded-strings.js',
    'find-translation-issues.js',
    'fix-i18n-violations-complete.js',
    'fix-language-toggles-complete.js',
    'fix-marketing-locale-params.js',
    'implement-marketing-i18n-accessibility.js',
    'implement-marketing-i18n-complete.js',
    'sync-marketing-translation-keys.js',
    'test-language-switching.js',
    'translate-all-complete.py',
    'translate-all-languages-complete.js',
    'translate-language.py',
    'translate-marketing-complete.js',
    'translate-missing-languages.js',
    'translate-norwegian-alt.js',
    'translate-norwegian-batch.js',
    'translate-norwegian-deepl.js',
    'translate-norwegian-libre.js',
    'translate-norwegian.js',
    'translate-spanish-marketing.js',
    'update-all-marketing-components-i18n.js',
    'verify-all-languages-complete.js',
    'verify-marketing-i18n.js',
    'verify-marketing-translation-keys.js',
    'verify-marketing-translations.js',
    'verify-translation-keys.js'
  ],
  
  // Database
  'database/': [
    'apply-all-migrations-sequentially.js',
    'apply-migration-to-supabase.js',
    'apply-migrations-one-by-one.js',
    'apply-migrations-with-safety-checks.js',
    'apply-migrations.js',
    'apply-missing-tables-migration.js',
    'apply-new-migrations-080-093.js',
    'apply-performance-migration.js',
    'audit-database-optimization.js',
    'audit-rls-policies.js',
    'check-database-schema.js',
    'check-remote-migrations.js',
    'cleanup-and-consolidate-migrations.js',
    'complete-migration-restructure.js',
    'complete-partial-rls.js',
    'comprehensive-migration-audit.js',
    'comprehensive-rls-audit.js',
    'create-legend-users.sql',
    'create-missing-database-tables.js',
    'extract-actual-warning-tables.js',
    'extract-remaining-tables.js',
    'fix-all-rls-warnings.js',
    'fix-migrations-106-112.sh',
    'generate-corrected-auth-migration.js',
    'generate-final-112.js',
    'generate-final-auth-migration.js',
    'generate-migration-112.js',
    'generate-migration-126.js',
    'generate-safe-112.js',
    'generate-safe-index-migration.js',
    'make-migrations-safe.js',
    'mark-080-applied.js',
    'parse-linter-issues.js',
    'push-migrations.js',
    'restructure-migrations.js',
    'sequential-migration-audit.js',
    'setup-storage-buckets.js',
    'sync-migration-history.js',
    'update-seed-to-fictional.js',
    'verify-and-apply-all-migrations.js',
    'verify-and-generate-112.js',
    'verify-database-indexes.sql',
    'verify-database-tables.ts',
    'verify-demo-isolation.sql',
    'verify-linter-tables.js',
    'verify-migration-implementation.js',
    'verify-rls-optimization.sql',
    'verify-rls-policies.ts',
    'verify-schema-alignment.js'
  ],
  
  // Responsive
  'responsive/': [
    'achieve-100-percent-responsive.js',
    'achieve-true-100-percent-responsive-final.js',
    'achieve-true-100-percent-responsive.js',
    'analyze-real-responsive-issues.js',
    'audit-responsive-atomic-ux.js',
    'comprehensive-responsive-audit.js',
    'final-responsive-push.js',
    'fix-critical-responsive-files.js',
    'fix-remaining-responsive.js',
    'fix-responsive-atomic-ux.js',
    'fix-responsive-issues.js',
    'fix-responsive-layout-issues.js',
    'fix-responsive-overflow-issues.js'
  ],
  
  // Typography
  'typography/': [
    'audit-all-marketing-pages-typography.js',
    'audit-auth-onboarding-typography.js',
    'audit-body-text-fonts.js',
    'audit-marketing-typography.js',
    'comprehensive-typography-audit.js',
    'final-typography-audit.js',
    'fix-all-marketing-pages-typography.js',
    'fix-all-typography-issues.js',
    'fix-auth-onboarding-typography.js',
    'fix-typography-violations.js',
    'normalize-marketing-headings.js',
    'standardize-h1-sizes.js',
    'update-marketing-typography.js',
    'verify-marketing-heading-normalization.js',
    'zero-tolerance-typography-audit.js'
  ],
  
  // Marketing
  'marketing/': [
    'add-automations-hub-i18n.js',
    'add-captain-testimonials-i18n.js',
    'apply-generational-to-section.js',
    'apply-marketing-fonts.js',
    'audit-card-alignment-patterns.js',
    'complete-all-marketing-content.js',
    'create-all-marketing-pages.js',
    'create-priority-3-pages.js',
    'fix-marketing-card-alignment.js',
    'fix-marketing-lint-errors.js',
    'fix-remaining-hero-splits.js',
    'fix-remaining-marketing-tokens.js',
    'generate-complete-generational-variants.js',
    'generate-generational-marketing-copy.js',
    'manual-split-hero-headlines.js',
    'marketing-dark-mode-responsive.js',
    'split-hero-headline-highlight.js',
    'true-100-marketing-complete.js',
    'update-about-to-company.js',
    'update-marketing-brand-voice.js',
    'update-marketing-design-tokens.js',
    'verify-automations-hub.js',
    'verify-hero-headline-split.js',
    'verify-marketing-design-tokens.js',
    'verify-marketing-implementation.js',
    'verify-solutions-page.js'
  ],
  
  // Audit
  'audit/': [
    'accurate-full-stack-audit.js',
    'atomic-workflow-audit.js',
    'atomic-workflow-complete-audit.js',
    'comprehensive-atomic-audit.js',
    'comprehensive-enterprise-audit.js',
    'comprehensive-full-stack-audit.js',
    'comprehensive-gap-audit.js',
    'comprehensive-marketing-audit.js',
    'comprehensive-role-workflow-audit.js',
    'comprehensive-supabase-audit.js',
    'comprehensive-workflow-audit.js',
    'cross-page-consistency-audit.js',
    'deep-dive-gap-analysis.js',
    'deep-workflow-analysis.js',
    'final-full-stack-audit.js',
    'final-verification-audit.js',
    'fourth-verification-audit.js',
    'full-damage-audit.js',
    'smart-atomic-audit.js',
    'smart-marketing-audit.js',
    'validate-12-layer-full-stack.js',
    'validate-production-build.js',
    'validate-sitemap-updates.js',
    'verify-100-percent-completion.ts',
    'verify-api-routes-compliance.js',
    'verify-atomic-workflow-error-handling.js',
    'verify-bullet-point-wrapping.js',
    'verify-performance-optimization.js',
    'verify-supabase-integration.js',
    'verify-type-safety.js',
    'zero-tolerance-12-layer-audit.js',
    'zero-tolerance-complete-all-workflows.js'
  ],
  
  // Fix
  'fix/': [
    'achieve-100-percent-compliance.js',
    'cleanup-empty-state-formatting.js',
    'complete-all-atomic-workflows.js',
    'complete-all-remaining-stat-cards.js',
    'complete-prop-interfaces.js',
    'complete-supabase-integration.js',
    'comprehensive-cleanup.sh',
    'comprehensive-error-fix.js',
    'emergency-repair-all-damage.js',
    'final-100-percent-fix.js',
    'final-100-percent-marketing.js',
    'final-100-percent-verification.js',
    'final-aggressive-fix-all.js',
    'final-comprehensive-fix.sh',
    'final-data-hooks-fix.js',
    'final-empty-state-cleanup.js',
    'final-mock-data-cleanup.js',
    'final-type-safety-push.js',
    'final-type-safety-verification.js',
    'fix-all-build-errors.js',
    'fix-all-check-icons-complete.js',
    'fix-all-conditional-hooks-automated.js',
    'fix-all-dashboard-refresh.js',
    'fix-all-duplicate-props.js',
    'fix-all-errors-100-percent.js',
    'fix-all-errors-comprehensive.js',
    'fix-all-errors-final.js',
    'fix-all-hook-destructuring.sh',
    'fix-all-lint-errors-now.js',
    'fix-all-violations.js',
    'fix-aria-wrapper-syntax.js',
    'fix-atomic-violations.js',
    'fix-atomic-workflow-error-handling-v2.js',
    'fix-atomic-workflow-error-handling-v3.js',
    'fix-atomic-workflow-error-handling.js',
    'fix-atomic-workflow-final.js',
    'fix-bullet-point-wrapping-complete.js',
    'fix-bullet-point-wrapping.js',
    'fix-bullet-points-advanced.js',
    'fix-check-icons-flex-shrink.js',
    'fix-conditional-hooks-complete.js',
    'fix-dashboard-hooks.js',
    'fix-data-hooks-complete.js',
    'fix-datatable-columns.js',
    'fix-datatable-props.js',
    'fix-dialog-syntax.js',
    'fix-duplicate-aria-hidden.js',
    'fix-duplicate-classnames.js',
    'fix-duplicate-function-signatures.js',
    'fix-hook-imports.sh',
    'fix-hook-parameters.js',
    'fix-hub-by-hub-100-percent.js',
    'fix-missing-closing-braces.js',
    'fix-missing-hooks.sh',
    'fix-overview-template-props.js',
    'fix-parsing-errors-final.js',
    'fix-people-procurement-final.js',
    'fix-remaining-30-files.js',
    'fix-remaining-any-types.js',
    'fix-remaining-conditional-hooks.js',
    'fix-spotlight-template-props.js',
    'fix-storage-integration.js',
    'fix-syntax-errors-final.js',
    'fix-type-safety-violations.js'
  ],
  
  // Generation
  'generation/': [
    'create-atlvs-favicon.js',
    'create-centered-favicon.js',
    'create-missing-tabs.js',
    'create-pixel-atlvs-favicon.js',
    'create-press-start-favicon-with-download.js',
    'create-press-start-favicon.js',
    'generate-all-api-routes.js',
    'generate-complete-checklist.js',
    'generate-complete-linter-fix.js',
    'generate-emoji-favicon.js',
    'generate-globe-favicon.js',
    'generate-icons.js',
    'generate-logo-pngs.js',
    'update-favicon-from-image.js'
  ],
  
  // Testing
  'testing/': [
    'test-language-toggles.sh',
    'test-role-workflows.ts',
    'test-waitlist-system.ts'
  ],
  
  // Deployment
  'deployment/': [
    'deploy-performance-optimization.js'
  ],
  
  // Utilities
  'utilities/': [
    'add-aria-to-specific-files.js',
    'add-auth-final-19-files.js',
    'add-auth-to-remaining-6-files.js',
    'add-authentication-layer.js',
    'add-back-hook-imports.sh',
    'add-error-handling-to-hooks.js',
    'add-hook-calls-to-files.js',
    'add-hook-error-handling.js',
    'add-jsx-return-types.js',
    'add-missing-prop-interfaces.js',
    'add-realtime-to-hooks.js',
    'add-refresh-functions-to-hooks.js',
    'add-return-types.js',
    'add-storage-integration.js',
    'audit-all-hooks.sh',
    'audit-realtime-hooks.js',
    'batch-remove-mock-data.sh',
    'complete-mock-data-removal.sh',
    'connect-all-tabs-to-supabase.js',
    'execute-comprehensive-audit.sh',
    'expand-role-workflow-access.js',
    'find-all-hardcoded-strings.js',
    'find-hooks-without-realtime.js',
    'find-mock-data.js',
    'generate-translation-scripts.sh',
    'remediate-data-hooks-layer.js',
    'remove-all-mock-data.js',
    'remove-bad-realtime.js',
    'remove-duplicate-closing-tags.js',
    'remove-incorrect-hook-imports.js',
    'replace-all-stat-cards-comprehensive.js',
    'replace-all-stat-cards-final.js',
    'replace-use-module-data.js',
    'standardize-empty-states.js',
    'storage-layer-remediation-clean.js',
    'update-all-empty-states.js',
    'update-module-registries.js'
  ]
};

// Move scripts to subdirectories
for (const [subdir, scripts] of Object.entries(scriptMappings)) {
  for (const script of scripts) {
    const from = `scripts/${script}`;
    const to = `scripts/${subdir}${script}`;
    if (fs.existsSync(path.join(ROOT, from))) {
      safeMove(from, to);
    }
  }
}

// Move shell script translation files to i18n
console.log('\nMoving translation shell scripts...');
const translationShells = [
  'translate-ar.sh', 'translate-bn.sh', 'translate-de.sh', 'translate-es.sh',
  'translate-fr.sh', 'translate-hi.sh', 'translate-id.sh', 'translate-ja.sh',
  'translate-ko.sh', 'translate-mr.sh', 'translate-pt.sh', 'translate-ru.sh',
  'translate-sw.sh', 'translate-ta.sh', 'translate-te.sh', 'translate-tr.sh',
  'translate-ur.sh', 'translate-vi.sh', 'translate-zh.sh'
];

for (const shell of translationShells) {
  const from = `scripts/${shell}`;
  const to = `scripts/i18n/${shell}`;
  if (fs.existsSync(path.join(ROOT, from))) {
    safeMove(from, to);
  }
}

// Move Python translation scripts
console.log('\nMoving Python translation scripts...');
const pythonScripts = [
  'translate-6-languages-marketing.py',
  'translate-6-missing-languages.py'
];

for (const py of pythonScripts) {
  const from = `scripts/${py}`;
  const to = `scripts/i18n/${py}`;
  if (fs.existsSync(path.join(ROOT, from))) {
    safeMove(from, to);
  }
}

// ============================================================================
// PHASE 3: DOCS ORGANIZATION
// ============================================================================
console.log('\n📁 PHASE 3: Documentation Organization\n');

// Create docs subdirectories
const docDirs = [
  'docs/completion-reports',
  'docs/archive'
];

console.log('Creating documentation subdirectories...');
docDirs.forEach(dir => createDirectory(dir));

// Move completion reports
console.log('\nOrganizing completion reports...');
const completionReports = [
  'ACCESSIBILITY_LAYER_6_100_PERCENT_FINAL.md',
  'ACCESSIBILITY_LAYER_6_REMEDIATION_COMPLETE.md',
  'ACCESSIBILITY_LAYER_6_TRUE_100_PERCENT_COMPLETE.md',
  'ACCESSIBILITY_REMEDIATION_COMPLETE_2025_01_20.md',
  'API_ROUTES_REMEDIATION_COMPLETE_2025_01_20.md',
  'ASSET_CATALOG_VALIDATION_COMPLETE.md',
  'AUTHENTICATION_LAYER_100_PERCENT_COMPLETE_2025_01_20.md',
  'BULLET_POINT_WRAPPING_100_PERCENT_COMPLETE_2025_11_04.md',
  'BUTTON_PLACEMENT_COMPLETION_REPORT.md',
  'CARD_ALIGNMENT_IMPLEMENTATION_COMPLETE_2025_10_29.md',
  'COMPETITIVE_FEATURES_IMPLEMENTATION_COMPLETE.md',
  'COMPLETE_APPLICATION_SITEMAP_2025_01_20.md',
  'COMPLETE_MODULE_CHECKLIST_2025_01_20.md',
  'COUNTRY_EXPANSION_COMPLETE.md',
  'DATABASE_OPTIMIZATION_COMPLETE_2025_01_20.md',
  'DATABASE_SCHEMA_REMEDIATION_COMPLETE.md',
  'REALTIME_LAYER_REMEDIATION_COMPLETE_2025_01_20.md',
  'TYPE_SAFETY_100_PERCENT_CERTIFICATION.md',
  'TYPE_SAFETY_REMEDIATION_COMPLETE.md'
];

for (const report of completionReports) {
  const from = `docs/${report}`;
  const to = `docs/completion-reports/${report}`;
  if (fs.existsSync(path.join(ROOT, from))) {
    safeMove(from, to);
  }
}

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(80));
console.log('REORGANIZATION SUMMARY');
console.log('='.repeat(80) + '\n');

console.log(`✓ Files moved: ${operations.moved.length}`);
console.log(`✓ Files deleted: ${operations.deleted.length}`);
console.log(`✓ Directories created: ${operations.created.length}`);
console.log(`✗ Errors: ${operations.errors.length}`);

if (operations.errors.length > 0) {
  console.log('\nErrors encountered:');
  operations.errors.forEach(err => {
    console.log(`  - ${err.operation}: ${err.from || err.path} - ${err.error}`);
  });
}

// Save operation log
const logPath = path.join(ROOT, 'docs', 'REORGANIZATION_LOG_2025_11_06.json');
fs.writeFileSync(logPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  mode: DRY_RUN ? 'dry-run' : 'live',
  backup: BACKUP_DIR,
  operations
}, null, 2));

console.log(`\n✅ Operation log saved to: ${logPath}`);

if (DRY_RUN) {
  console.log('\n⚠️  DRY RUN COMPLETE - No changes were made');
  console.log('Run without --dry-run to apply changes');
} else {
  console.log(`\n✅ REORGANIZATION COMPLETE`);
  console.log(`Backup available at: ${BACKUP_DIR}`);
}

console.log('\n' + '='.repeat(80) + '\n');
