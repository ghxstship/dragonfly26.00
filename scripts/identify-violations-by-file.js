#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/components');

const hubs = {
  'Production Hub': ['dashboard', 'projects', 'events', 'people', 'assets', 'locations', 'files'],
  'Network Hub': ['community', 'marketplace', 'resources'],
  'Business Hub': ['companies', 'jobs', 'procurement', 'finance'],
  'System Hub': ['admin', 'settings', 'profile']
};

console.log('='.repeat(80));
console.log('DETAILED VIOLATION REPORT BY FILE');
console.log('='.repeat(80));
console.log();

const violationFiles = [];

Object.entries(hubs).forEach(([hubName, modules]) => {
  let hubHasViolations = false;
  
  modules.forEach(module => {
    const moduleDir = path.join(componentsDir, module);
    if (!fs.existsSync(moduleDir)) return;
    
    const files = fs.readdirSync(moduleDir).filter(f => f.endsWith('-tab.tsx'));
    
    files.forEach(file => {
      const filePath = path.join(moduleDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const violations = [];
      
      const labelMatches = content.match(/label:\s*"[^"]+"/g) || [];
      const nameMatches = content.match(/name:\s*"[^"]+"/g) || [];
      const titleMatches = content.match(/title:\s*"[^"]+"/g) || [];
      const descriptionMatches = content.match(/description:\s*"[^"]+"/g) || [];
      
      if (labelMatches.length > 0) violations.push({ type: 'label', count: labelMatches.length });
      if (nameMatches.length > 0) violations.push({ type: 'name', count: nameMatches.length });
      if (titleMatches.length > 0) violations.push({ type: 'title', count: titleMatches.length });
      if (descriptionMatches.length > 0) violations.push({ type: 'description', count: descriptionMatches.length });
      
      if (violations.length > 0) {
        if (!hubHasViolations) {
          console.log(`\n${hubName.toUpperCase()}`);
          console.log('-'.repeat(80));
          hubHasViolations = true;
        }
        
        const totalViolations = violations.reduce((sum, v) => sum + v.count, 0);
        console.log(`\n${module}/${file} (${totalViolations} violations):`);
        violations.forEach(v => {
          console.log(`  - ${v.type}: ${v.count}`);
        });
        
        violationFiles.push({
          hub: hubName,
          module,
          file,
          violations: totalViolations
        });
      }
    });
  });
});

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total files with violations: ${violationFiles.length}`);
console.log(`Total violations: ${violationFiles.reduce((sum, f) => sum + f.violations, 0)}`);
console.log();

console.log('FILES REQUIRING REMEDIATION:');
violationFiles.forEach(f => {
  console.log(`  ${f.module}/${f.file} (${f.violations} violations)`);
});
