#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const componentsDir = path.join(__dirname, '../src/components');

const hubs = {
  'Production Hub': ['dashboard', 'projects', 'events', 'people', 'assets', 'locations', 'files'],
  'Network Hub': ['community', 'marketplace', 'resources'],
  'Business Hub': ['companies', 'jobs', 'procurement', 'finance'],
  'Intelligence Hub': ['analytics', 'reports', 'insights'],
  'System Hub': ['admin', 'settings', 'profile']
};

console.log('='.repeat(80));
console.log('COMPREHENSIVE GLOBAL ACCESSIBILITY & i18n AUDIT');
console.log('='.repeat(80));
console.log();

const results = {};
let totalFiles = 0;
let totalCompliant = 0;
let totalViolations = 0;

Object.entries(hubs).forEach(([hubName, modules]) => {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`${hubName.toUpperCase()}`);
  console.log('='.repeat(80));
  
  let hubFiles = 0;
  let hubCompliant = 0;
  let hubViolations = 0;
  
  modules.forEach(module => {
    const moduleDir = path.join(componentsDir, module);
    if (!fs.existsSync(moduleDir)) return;
    
    const files = fs.readdirSync(moduleDir).filter(f => f.endsWith('-tab.tsx'));
    
    files.forEach(file => {
      hubFiles++;
      totalFiles++;
      
      const filePath = path.join(moduleDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for useTranslations
      const hasI18n = content.includes('useTranslations');
      
      // Check for hardcoded strings
      const violations = [];
      
      const labelMatches = content.match(/label:\s*"[^"]+"/g) || [];
      const nameMatches = content.match(/name:\s*"[^"]+"/g) || [];
      const titleMatches = content.match(/title:\s*"[^"]+"/g) || [];
      const descriptionMatches = content.match(/description:\s*"[^"]+"/g) || [];
      
      const violationCount = labelMatches.length + nameMatches.length + titleMatches.length + descriptionMatches.length;
      
      if (violationCount === 0 && hasI18n) {
        hubCompliant++;
        totalCompliant++;
      } else {
        hubViolations += violationCount;
        totalViolations += violationCount;
      }
    });
  });
  
  const compliancePercent = hubFiles > 0 ? Math.round((hubCompliant / hubFiles) * 100) : 0;
  const grade = compliancePercent === 100 ? 'A+' : compliancePercent >= 90 ? 'A' : compliancePercent >= 80 ? 'B' : compliancePercent >= 70 ? 'C' : compliancePercent >= 60 ? 'D' : 'F';
  
  console.log(`Total Files: ${hubFiles}`);
  console.log(`Compliant Files: ${hubCompliant}/${hubFiles} (${compliancePercent}%)`);
  console.log(`Total Violations: ${hubViolations}`);
  console.log(`Grade: ${grade} ${compliancePercent === 100 ? '✅' : '❌'}`);
  
  results[hubName] = {
    files: hubFiles,
    compliant: hubCompliant,
    violations: hubViolations,
    percent: compliancePercent,
    grade: grade
  };
});

console.log('\n' + '='.repeat(80));
console.log('OVERALL SUMMARY');
console.log('='.repeat(80));
console.log(`Total Files: ${totalFiles}`);
console.log(`Compliant Files: ${totalCompliant}/${totalFiles} (${Math.round((totalCompliant/totalFiles)*100)}%)`);
console.log(`Total Violations: ${totalViolations}`);
console.log();

console.log('HUB STATUS:');
Object.entries(results).forEach(([hub, data]) => {
  const status = data.percent === 100 ? '✅ COMPLETE' : '❌ NEEDS WORK';
  console.log(`  ${hub}: ${data.grade} (${data.percent}%) - ${status}`);
});

console.log('\n' + '='.repeat(80));
const overallPercent = Math.round((totalCompliant/totalFiles)*100);
const overallGrade = overallPercent === 100 ? 'A+' : overallPercent >= 90 ? 'A' : overallPercent >= 80 ? 'B' : overallPercent >= 70 ? 'C' : overallPercent >= 60 ? 'D' : 'F';
console.log(`OVERALL GRADE: ${overallGrade} (${overallPercent}%)`);
console.log('='.repeat(80));
