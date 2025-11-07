#!/usr/bin/env node

/**
 * Verify Marketing Translation Keys
 * 
 * Ensures all marketing sections use correct translation key paths
 */

const fs = require('fs');
const path = require('path');

const SECTIONS_DIR = path.join(__dirname, '../src/marketing/components/sections');
const EN_JSON_PATH = path.join(__dirname, '../src/i18n/messages/en.json');

console.log('🔍 Verifying marketing translation keys...\n');

// Read translation structure
const enJson = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf8'));
const marketing = enJson.marketing;

// Get all section files
const sectionFiles = fs.readdirSync(SECTIONS_DIR).filter(f => f.endsWith('.tsx'));

let totalIssues = 0;
let filesChecked = 0;

sectionFiles.forEach(file => {
  const filePath = path.join(SECTIONS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if doesn't use tGen
  if (!content.includes('tGen(')) {
    return;
  }
  
  filesChecked++;
  
  // Extract all tGen calls
  const tGenRegex = /tGen\(['"]([^'"]+)['"]\)/g;
  const matches = [...content.matchAll(tGenRegex)];
  
  const issues = [];
  
  matches.forEach(match => {
    const key = match[1];
    
    // Check if key exists in marketing translations
    const keyParts = key.split('.');
    let current = marketing;
    let valid = true;
    
    for (const part of keyParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        valid = false;
        break;
      }
    }
    
    if (!valid) {
      issues.push(key);
    }
  });
  
  if (issues.length > 0) {
    console.log(`❌ ${file}:`);
    issues.forEach(key => console.log(`   - Missing key: ${key}`));
    console.log('');
    totalIssues += issues.length;
  } else {
    console.log(`✅ ${file} - All keys valid`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Files checked: ${filesChecked}`);
console.log(`   Total issues: ${totalIssues}`);

if (totalIssues === 0) {
  console.log('\n✨ All marketing translation keys are correct!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some translation keys need fixing');
  process.exit(1);
}
