#!/usr/bin/env node

/**
 * MAKE ALL MIGRATIONS SAFE
 * Moves problematic migrations that reference non-existent tables to deprecated folder
 * This allows the core workflow migrations to complete successfully
 */

const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');
const DEPRECATED_DIR = path.join(MIGRATIONS_DIR, 'deprecated');

// Migrations that are known to have issues with missing tables
const PROBLEMATIC_MIGRATIONS = [
  '114_drop_duplicate_policies.sql',
  '115_fix_final_12_warnings.sql',
  '116_add_foreign_key_indexes.sql',
  '117_fix_security_warnings.sql',
  '118_fix_function_search_path.sql',
  '119_fix_materialized_view_security.sql',
  '120_fix_permissions_rls_performance.sql',
  '121_add_remaining_foreign_key_indexes.sql',
  '122_drop_unused_indexes.sql',
  '123_fix_hierarchy_rollup_permissions.sql',
  '124_resolve_remaining_linter_issues.sql',
  '125_resolve_all_remaining_linter_issues.sql',
  '126_resolve_audit_foreign_keys.sql',
  '127_restore_workspace_indexes.sql',
  '128_typography_settings.sql'
];

console.log('🛡️  MAKING MIGRATIONS SAFE');
console.log('==========================\n');

let movedCount = 0;

PROBLEMATIC_MIGRATIONS.forEach(migration => {
  const sourcePath = path.join(MIGRATIONS_DIR, migration);
  const destPath = path.join(DEPRECATED_DIR, migration.replace('.sql', '_deferred.sql'));
  
  if (fs.existsSync(sourcePath)) {
    fs.renameSync(sourcePath, destPath);
    console.log(`✅ Moved: ${migration} → deprecated/`);
    movedCount++;
  } else {
    console.log(`⏭️  Skip: ${migration} (already moved or doesn't exist)`);
  }
});

console.log(`\n📊 Summary: Moved ${movedCount} migrations to deprecated/`);
console.log('\nThese migrations reference tables that may not exist in your database.');
console.log('They can be applied later once all tables are created.\n');

console.log('✅ Safe to proceed with remaining migrations!');
console.log('\nNext step: Run node scripts/push-migrations.js\n');
