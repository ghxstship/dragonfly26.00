#!/usr/bin/env node

/**
 * COMPREHENSIVE MIGRATION AUDIT & RESTRUCTURE
 * Analyzes ALL migrations, categorizes them, and creates a sequential application plan
 */

const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');
const DEPRECATED_DIR = path.join(MIGRATIONS_DIR, 'deprecated');
const APPLIED_DIR = path.join(MIGRATIONS_DIR, 'applied');

console.log('🔍 COMPREHENSIVE MIGRATION AUDIT');
console.log('=================================\n');

// Get all migration files
const allFiles = fs.readdirSync(MIGRATIONS_DIR)
  .filter(f => f.endsWith('.sql') && !f.includes('.skip'))
  .sort();

const deprecatedFiles = fs.existsSync(DEPRECATED_DIR) 
  ? fs.readdirSync(DEPRECATED_DIR).filter(f => f.endsWith('.sql')).sort()
  : [];

const appliedFiles = fs.existsSync(APPLIED_DIR)
  ? fs.readdirSync(APPLIED_DIR).filter(f => f.endsWith('.sql')).sort()
  : [];

console.log(`📊 MIGRATION INVENTORY`);
console.log(`=====================`);
console.log(`Active Migrations: ${allFiles.length}`);
console.log(`Deprecated Migrations: ${deprecatedFiles.length}`);
console.log(`Applied Migrations: ${appliedFiles.length}`);
console.log(`Total Migrations: ${allFiles.length + deprecatedFiles.length}\n`);

// Analyze each migration
const migrations = [];

function analyzeMigration(filename, location) {
  const filepath = location === 'active' 
    ? path.join(MIGRATIONS_DIR, filename)
    : location === 'deprecated'
    ? path.join(DEPRECATED_DIR, filename)
    : path.join(APPLIED_DIR, filename);
  
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n');
  
  // Extract metadata from comments
  let description = '';
  let category = 'unknown';
  let dependencies = [];
  
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const line = lines[i].trim();
    if (line.startsWith('--') && line.includes(':')) {
      const [key, ...valueParts] = line.substring(2).split(':');
      const value = valueParts.join(':').trim();
      
      if (key.trim().toLowerCase().includes('migration') || key.trim().toLowerCase().includes('description')) {
        description = value;
      }
    }
  }
  
  // Categorize by filename patterns
  if (filename.includes('foundation') || filename.match(/^00[0-9]_/)) {
    category = 'foundation';
  } else if (filename.includes('module') || filename.match(/^0[0-9]{2}_.*_(module|hub)/)) {
    category = 'modules';
  } else if (filename.includes('rbac') || filename.includes('rls') || filename.includes('permissions')) {
    category = 'security';
  } else if (filename.includes('index') || filename.includes('performance') || filename.includes('optimization')) {
    category = 'performance';
  } else if (filename.includes('fix') || filename.includes('resolve') || filename.includes('warning')) {
    category = 'fixes';
  } else if (filename.includes('hierarchy') || filename.includes('normalization')) {
    category = 'architecture';
  } else if (filename.match(/^202510[0-9]{2}/)) {
    category = 'features';
  } else if (filename.match(/^202511[0-9]{2}/)) {
    category = 'enhancements';
  }
  
  // Check for table creation
  const createTableMatches = content.match(/CREATE TABLE/gi) || [];
  const createPolicyMatches = content.match(/CREATE POLICY/gi) || [];
  const createIndexMatches = content.match(/CREATE INDEX/gi) || [];
  const createFunctionMatches = content.match(/CREATE (OR REPLACE )?FUNCTION/gi) || [];
  
  // Check for dependencies (tables referenced)
  const tableReferences = new Set();
  const tableRefMatches = content.matchAll(/(?:FROM|JOIN|ON|REFERENCES)\s+(?:public\.)?([a-z_]+)/gi);
  for (const match of tableRefMatches) {
    tableReferences.add(match[1]);
  }
  
  return {
    filename,
    location,
    category,
    description: description || filename.replace('.sql', '').replace(/_/g, ' '),
    size: fs.statSync(filepath).size,
    tables: createTableMatches.length,
    policies: createPolicyMatches.length,
    indexes: createIndexMatches.length,
    functions: createFunctionMatches.length,
    dependencies: Array.from(tableReferences).slice(0, 10), // Top 10
    content: content.substring(0, 500) // First 500 chars for analysis
  };
}

// Analyze all migrations
console.log(`🔬 ANALYZING MIGRATIONS...\n`);

allFiles.forEach(f => migrations.push(analyzeMigration(f, 'active')));
deprecatedFiles.forEach(f => migrations.push(analyzeMigration(f, 'deprecated')));

// Categorize migrations
const categories = {
  foundation: [],
  modules: [],
  security: [],
  architecture: [],
  performance: [],
  features: [],
  enhancements: [],
  fixes: [],
  unknown: []
};

migrations.forEach(m => {
  categories[m.category].push(m);
});

// Report by category
console.log(`📋 MIGRATIONS BY CATEGORY`);
console.log(`=========================\n`);

Object.keys(categories).forEach(cat => {
  const migs = categories[cat];
  if (migs.length > 0) {
    console.log(`${cat.toUpperCase()} (${migs.length} migrations):`);
    migs.forEach(m => {
      const status = m.location === 'active' ? '✅' : m.location === 'deprecated' ? '⏸️' : '📦';
      console.log(`  ${status} ${m.filename}`);
      console.log(`     ${m.description.substring(0, 80)}`);
      console.log(`     Tables: ${m.tables}, Policies: ${m.policies}, Indexes: ${m.indexes}, Functions: ${m.functions}`);
    });
    console.log('');
  }
});

// Identify dependencies and ordering issues
console.log(`🔗 DEPENDENCY ANALYSIS`);
console.log(`=====================\n`);

const allTableNames = new Set();
migrations.forEach(m => {
  const tableMatches = m.content.matchAll(/CREATE TABLE (?:IF NOT EXISTS )?(?:public\.)?([a-z_]+)/gi);
  for (const match of tableMatches) {
    allTableNames.add(match[1]);
  }
});

console.log(`Total Tables Created: ${allTableNames.size}`);
console.log(`Sample Tables: ${Array.from(allTableNames).slice(0, 20).join(', ')}\n`);

// Generate restructuring plan
console.log(`📐 RESTRUCTURING PLAN`);
console.log(`====================\n`);

const restructurePlan = {
  phase1_foundation: categories.foundation,
  phase2_modules: categories.modules,
  phase3_security: categories.security,
  phase4_architecture: categories.architecture,
  phase5_features: categories.features,
  phase6_performance: categories.performance,
  phase7_enhancements: categories.enhancements,
  phase8_fixes: categories.fixes
};

let sequenceNumber = 1;
const newStructure = [];

Object.keys(restructurePlan).forEach((phase, phaseIdx) => {
  const phaseName = phase.replace('phase' + (phaseIdx + 1) + '_', '');
  const migrations = restructurePlan[phase];
  
  if (migrations.length > 0) {
    console.log(`PHASE ${phaseIdx + 1}: ${phaseName.toUpperCase()} (${migrations.length} migrations)`);
    
    migrations.forEach(m => {
      const newName = `${String(sequenceNumber).padStart(3, '0')}_${phaseName}_${m.filename.replace(/^[0-9_]+/, '')}`;
      newStructure.push({
        oldName: m.filename,
        newName: newName,
        location: m.location,
        phase: phaseIdx + 1,
        category: phaseName,
        sequence: sequenceNumber
      });
      console.log(`  ${sequenceNumber}. ${m.filename} → ${newName}`);
      sequenceNumber++;
    });
    console.log('');
  }
});

// Save restructuring plan
const reportPath = path.join(__dirname, '../docs/audits/MIGRATION_RESTRUCTURE_PLAN.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  summary: {
    totalMigrations: migrations.length,
    activeMigrations: allFiles.length,
    deprecatedMigrations: deprecatedFiles.length,
    appliedMigrations: appliedFiles.length,
    categories: Object.keys(categories).map(cat => ({
      name: cat,
      count: categories[cat].length
    })),
    totalTables: allTableNames.size
  },
  categories,
  restructurePlan: newStructure,
  allTables: Array.from(allTableNames).sort()
}, null, 2));

console.log(`\n📄 Full report saved to: ${reportPath}`);

console.log(`\n✅ AUDIT COMPLETE`);
console.log(`=================`);
console.log(`Total Migrations Analyzed: ${migrations.length}`);
console.log(`Restructuring Plan Created: ${newStructure.length} migrations`);
console.log(`Ready for sequential application\n`);
