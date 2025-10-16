#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/components');
const modules = ['analytics', 'reports', 'insights'];

console.log('='.repeat(80));
console.log('INTELLIGENCE HUB INTERNATIONAL ACCESSIBILITY & i18n AUDIT');
console.log('='.repeat(80));
console.log();

let totalFiles = 0;
let filesWithHardcodedStrings = 0;
let totalViolations = 0;
const violationsByFile = {};

modules.forEach(module => {
  const moduleDir = path.join(componentsDir, module);
  if (!fs.existsSync(moduleDir)) return;
  
  const files = fs.readdirSync(moduleDir).filter(f => f.endsWith('-tab.tsx'));
  
  files.forEach(file => {
    totalFiles++;
    const filePath = path.join(moduleDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const violations = [];
    
    // Check for hardcoded strings in mock data
    const labelMatches = content.match(/label:\s*"[^"]+"/g) || [];
    const nameMatches = content.match(/name:\s*"[^"]+"/g) || [];
    const titleMatches = content.match(/title:\s*"[^"]+"/g) || [];
    const descriptionMatches = content.match(/description:\s*"[^"]+"/g) || [];
    const textMatches = content.match(/text:\s*"[^"]+"/g) || [];
    
    // Check for hardcoded JSX text (excluding imports and simple values)
    const jsxTextMatches = content.match(/>[A-Z][a-zA-Z\s&]+</g) || [];
    const filteredJsxMatches = jsxTextMatches.filter(m => {
      const text = m.slice(1, -1).trim();
      return text.length > 3 && !text.match(/^[A-Z]{2,}$/) && !text.includes('Icon');
    });
    
    if (labelMatches.length > 0) violations.push({ type: 'label', count: labelMatches.length, examples: labelMatches.slice(0, 3) });
    if (nameMatches.length > 0) violations.push({ type: 'name', count: nameMatches.length, examples: nameMatches.slice(0, 3) });
    if (titleMatches.length > 0) violations.push({ type: 'title', count: titleMatches.length, examples: titleMatches.slice(0, 3) });
    if (descriptionMatches.length > 0) violations.push({ type: 'description', count: descriptionMatches.length, examples: descriptionMatches.slice(0, 3) });
    if (textMatches.length > 0) violations.push({ type: 'text', count: textMatches.length, examples: textMatches.slice(0, 3) });
    if (filteredJsxMatches.length > 0) violations.push({ type: 'jsx', count: filteredJsxMatches.length, examples: filteredJsxMatches.slice(0, 3) });
    
    if (violations.length > 0) {
      filesWithHardcodedStrings++;
      violationsByFile[`${module}/${file}`] = violations;
      const violationCount = violations.reduce((sum, v) => sum + v.count, 0);
      totalViolations += violationCount;
    }
  });
});

console.log('SUMMARY:');
console.log(`Total tab files: ${totalFiles}`);
console.log(`Files with hardcoded strings: ${filesWithHardcodedStrings}`);
console.log(`Total violations: ${totalViolations}`);
console.log();

if (filesWithHardcodedStrings > 0) {
  console.log('VIOLATIONS BY FILE:');
  console.log('-'.repeat(80));
  
  Object.entries(violationsByFile).forEach(([file, violations]) => {
    const totalForFile = violations.reduce((sum, v) => sum + v.count, 0);
    console.log(`\n${file} (${totalForFile} violations):`);
    violations.forEach(v => {
      console.log(`  - ${v.type}: ${v.count} occurrences`);
      v.examples.forEach(ex => console.log(`    ${ex}`));
    });
  });
}

console.log();
console.log('='.repeat(80));
console.log(`GRADE: ${filesWithHardcodedStrings === 0 ? 'A+ (100%)' : `F (${Math.round((1 - filesWithHardcodedStrings / totalFiles) * 100)}%)`}`);
console.log('='.repeat(80));
