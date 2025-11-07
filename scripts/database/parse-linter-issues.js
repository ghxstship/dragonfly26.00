#!/usr/bin/env node

/**
 * Parse linter issues JSON and generate migration SQL
 * Handles both unindexed foreign keys and unused indexes
 */

const fs = require('fs');
const path = require('path');

// Read the linter issues from stdin or file
const linterIssuesPath = process.argv[2];

if (!linterIssuesPath) {
  console.error('Usage: node parse-linter-issues.js <path-to-linter-issues.json>');
  process.exit(1);
}

const linterIssues = JSON.parse(fs.readFileSync(linterIssuesPath, 'utf8'));

// Separate issues by type
const unindexedForeignKeys = [];
const unusedIndexes = [];

linterIssues.forEach(issue => {
  if (issue.name === 'unindexed_foreign_keys') {
    unindexedForeignKeys.push({
      table: issue.metadata.name,
      fkeyName: issue.metadata.fkey_name,
      fkeyColumns: issue.metadata.fkey_columns
    });
  } else if (issue.name === 'unused_index') {
    unusedIndexes.push({
      table: issue.metadata.name,
      indexName: issue.detail.match(/Index \\`([^`]+)\\`/)[1]
    });
  }
});

console.log(`\n📊 LINTER ISSUES SUMMARY:`);
console.log(`  Unindexed Foreign Keys: ${unindexedForeignKeys.length}`);
console.log(`  Unused Indexes: ${unusedIndexes.length}`);
console.log(`  Total Issues: ${linterIssues.length}\n`);

// Generate SQL for unindexed foreign keys
let sql = `-- =====================================================================================
-- Migration: 125_resolve_all_remaining_linter_issues.sql
-- Description: Resolve ALL remaining Supabase database linter issues
-- - Add ${unindexedForeignKeys.length} indexes for unindexed foreign keys
-- - Remove ${unusedIndexes.length} unused indexes
-- =====================================================================================

-- =====================================================================================
-- PART 1: ADD INDEXES FOR UNINDEXED FOREIGN KEYS (${unindexedForeignKeys.length} indexes)
-- =====================================================================================

`;

// Group by table for better organization
const fkeysByTable = {};
unindexedForeignKeys.forEach(fk => {
  if (!fkeysByTable[fk.table]) {
    fkeysByTable[fk.table] = [];
  }
  fkeysByTable[fk.table].push(fk);
});

// Generate CREATE INDEX statements
Object.keys(fkeysByTable).sort().forEach(table => {
  sql += `-- ${table} table\n`;
  fkeysByTable[table].forEach(fk => {
    // Extract column name from foreign key name
    // Pattern: tablename_columnname_fkey or fk_tablename_columnname
    let columnName = fk.fkeyName
      .replace(`${table}_`, '')
      .replace('_fkey', '')
      .replace('fk_', '');
    
    const indexName = `idx_${table}_${columnName}`;
    sql += `CREATE INDEX IF NOT EXISTS ${indexName}\n`;
    sql += `  ON public.${table}(${columnName});\n\n`;
  });
  sql += '\n';
});

sql += `-- =====================================================================================
-- PART 2: REMOVE UNUSED INDEXES (${unusedIndexes.length} indexes)
-- =====================================================================================

`;

// Group unused indexes by table
const unusedByTable = {};
unusedIndexes.forEach(idx => {
  if (!unusedByTable[idx.table]) {
    unusedByTable[idx.table] = [];
  }
  unusedByTable[idx.table].push(idx);
});

// Generate DROP INDEX statements
Object.keys(unusedByTable).sort().forEach(table => {
  sql += `-- ${table} unused indexes\n`;
  unusedByTable[table].forEach(idx => {
    sql += `DROP INDEX IF EXISTS public.${idx.indexName};\n`;
  });
  sql += '\n';
});

// Write to migration file
const migrationPath = path.join(__dirname, '../supabase/migrations/125_resolve_all_remaining_linter_issues.sql');
fs.writeFileSync(migrationPath, sql);

console.log(`✅ Migration generated: ${migrationPath}`);
console.log(`\n📝 STATISTICS:`);
console.log(`  Tables with unindexed FKs: ${Object.keys(fkeysByTable).length}`);
console.log(`  Tables with unused indexes: ${Object.keys(unusedByTable).length}`);
console.log(`  Total SQL lines: ${sql.split('\n').length}`);
