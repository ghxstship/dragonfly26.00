#!/usr/bin/env node

/**
 * People & Procurement Supabase Integration - FINAL
 * Replace useModuleData with dedicated hooks
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 People & Procurement Supabase Integration - FINAL\n');

// ============================================================================
// PEOPLE MODULE (9 files)
// ============================================================================

const PEOPLE_DIR = path.join(__dirname, '../src/components/people');
const peopleFiles = fs.readdirSync(PEOPLE_DIR).filter(f => f.endsWith('-tab.tsx'));

console.log(`📋 People Module (${peopleFiles.length} files)...\n`);

let peopleFixed = 0;
peopleFiles.forEach(file => {
  const filePath = path.join(PEOPLE_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('usePeopleData')) {
    console.log(`✅ ${file} - Already connected`);
    return;
  }
  
  // Replace useModuleData import
  if (content.includes('useModuleData')) {
    content = content.replace(
      /import { useModuleData } from ["']@\/hooks\/use-module-data["']/,
      'import { usePeopleData } from "@/hooks/use-people-data"'
    );
    
    // Replace hook usage - multiple patterns
    content = content.replace(
      /const { data: (\w+), loading } = useModuleData\([^)]+\)/g,
      'const { $1, loading, error } = usePeopleData()'
    );
    
    content = content.replace(
      /const { data: hookData, loading: hookLoading } = useModuleData\([^)]+\)/g,
      'const { loading: hookLoading, error } = usePeopleData()'
    );
    
    fs.writeFileSync(filePath, content);
    peopleFixed++;
    console.log(`✅ ${file}`);
  }
});

// ============================================================================
// PROCUREMENT MODULE (11 files)
// ============================================================================

const PROCUREMENT_DIR = path.join(__dirname, '../src/components/procurement');
const procurementFiles = fs.readdirSync(PROCUREMENT_DIR).filter(f => f.endsWith('-tab.tsx'));

console.log(`\n📋 Procurement Module (${procurementFiles.length} files)...\n`);

let procurementFixed = 0;
procurementFiles.forEach(file => {
  const filePath = path.join(PROCUREMENT_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('useProcurementData')) {
    console.log(`✅ ${file} - Already connected`);
    return;
  }
  
  // Replace useModuleData import
  if (content.includes('useModuleData')) {
    content = content.replace(
      /import { useModuleData } from ["']@\/hooks\/use-module-data["']/,
      'import { useProcurementData } from "@/hooks/use-procurement-data"'
    );
    
    // Replace hook usage - multiple patterns
    content = content.replace(
      /const { data: (\w+), loading } = useModuleData\([^)]+\)/g,
      'const { $1, loading, error } = useProcurementData()'
    );
    
    content = content.replace(
      /const { data: hookData, loading: hookLoading } = useModuleData\([^)]+\)/g,
      'const { loading: hookLoading, error } = useProcurementData()'
    );
    
    fs.writeFileSync(filePath, content);
    procurementFixed++;
    console.log(`✅ ${file}`);
  }
});

// ============================================================================
// VERIFICATION
// ============================================================================

console.log('\n📊 Final Verification:\n');

// Re-count
const peopleWithHook = peopleFiles.filter(f => {
  const content = fs.readFileSync(path.join(PEOPLE_DIR, f), 'utf8');
  return content.includes('usePeopleData');
}).length;

const procurementWithHook = procurementFiles.filter(f => {
  const content = fs.readFileSync(path.join(PROCUREMENT_DIR, f), 'utf8');
  return content.includes('useProcurementData');
}).length;

console.log(`People: ${peopleWithHook}/${peopleFiles.length} tabs connected`);
console.log(`Procurement: ${procurementWithHook}/${procurementFiles.length} tabs connected`);
console.log(`\nFixed: ${peopleFixed} People + ${procurementFixed} Procurement = ${peopleFixed + procurementFixed} total`);

if (peopleWithHook === peopleFiles.length && procurementWithHook === procurementFiles.length) {
  console.log('\n✅ 100% COMPLETE - All tabs connected to Supabase!');
} else {
  console.log('\n⚠️  Some files still need fixing');
}
