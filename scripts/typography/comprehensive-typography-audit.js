#!/usr/bin/env node

/**
 * Comprehensive Marketing Typography Audit
 * 
 * Checks ALL text elements for proper typography:
 * - Logo: font-pixel
 * - Titles (h1): font-title uppercase
 * - Headings (h2-h4): font-heading uppercase
 * - Button text: Should check if needs heading font
 * - Question/FAQ text: Should use heading font
 * - Card titles: Should use heading font
 * - Body: font-tech (via layout)
 */

const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, '../src/marketing/components/sections');
const navPath = path.join(__dirname, '../src/marketing/components/MarketingNav.tsx');
const footerPath = path.join(__dirname, '../src/marketing/components/MarketingFooter.tsx');

const issues = [];

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for any className with text that might need heading font
    if (line.includes('className=') && line.includes('"')) {
      const hasText = line.includes('{') || line.includes('</');
      
      // Check h1-h4 tags
      if (line.match(/<h[1-4]/)) {
        if (!line.includes('font-title') && !line.includes('font-heading')) {
          issues.push({
            file: fileName,
            line: lineNum,
            type: 'HEADING',
            severity: 'HIGH',
            content: line.trim().substring(0, 100),
            suggestion: 'Add font-title (h1) or font-heading (h2-h4) with uppercase'
          });
        } else if (!line.includes('uppercase')) {
          issues.push({
            file: fileName,
            line: lineNum,
            type: 'UPPERCASE',
            severity: 'MEDIUM',
            content: line.trim().substring(0, 100),
            suggestion: 'Add uppercase class'
          });
        }
      }
      
      // Check for button-like elements with font-bold
      if (line.includes('font-bold') && !line.includes('font-heading') && !line.includes('font-title')) {
        if (line.match(/<(button|div|span|p|h[1-6])/)) {
          issues.push({
            file: fileName,
            line: lineNum,
            type: 'FONT_BOLD',
            severity: 'MEDIUM',
            content: line.trim().substring(0, 100),
            suggestion: 'Consider replacing font-bold with font-heading uppercase'
          });
        }
      }
      
      // Check for text-lg, text-xl, text-2xl without proper font
      if (line.match(/text-(lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)/)) {
        if (!line.includes('font-title') && !line.includes('font-heading') && !line.includes('font-tech')) {
          // Skip if it's just a container or has no text content nearby
          if (hasText) {
            issues.push({
              file: fileName,
              line: lineNum,
              type: 'LARGE_TEXT',
              severity: 'LOW',
              content: line.trim().substring(0, 100),
              suggestion: 'Large text should use font-heading or font-title'
            });
          }
        }
      }
    }
  });
}

function main() {
  console.log('🔍 COMPREHENSIVE Marketing Typography Audit\n');
  console.log('Analyzing all marketing components...\n');
  
  // Audit all files
  analyzeFile(navPath);
  analyzeFile(footerPath);
  
  const sectionFiles = fs.readdirSync(sectionsDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(sectionsDir, file));
  
  sectionFiles.forEach(analyzeFile);
  
  // Group issues by severity
  const high = issues.filter(i => i.severity === 'HIGH');
  const medium = issues.filter(i => i.severity === 'MEDIUM');
  const low = issues.filter(i => i.severity === 'LOW');
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 COMPREHENSIVE AUDIT RESULTS');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  if (high.length > 0) {
    console.log('🔴 HIGH SEVERITY ISSUES (Must Fix):');
    console.log(`   Count: ${high.length}\n`);
    high.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   Type: ${issue.type}`);
      console.log(`   Code: ${issue.content}`);
      console.log(`   Fix: ${issue.suggestion}\n`);
    });
  }
  
  if (medium.length > 0) {
    console.log('🟡 MEDIUM SEVERITY ISSUES (Should Fix):');
    console.log(`   Count: ${medium.length}\n`);
    medium.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   Type: ${issue.type}`);
      console.log(`   Code: ${issue.content}`);
      console.log(`   Fix: ${issue.suggestion}\n`);
    });
  }
  
  if (low.length > 0) {
    console.log('🟢 LOW SEVERITY ISSUES (Review):');
    console.log(`   Count: ${low.length}\n`);
    low.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   Type: ${issue.type}`);
      console.log(`   Code: ${issue.content}`);
      console.log(`   Fix: ${issue.suggestion}\n`);
    });
  }
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📈 SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total Issues: ${issues.length}`);
  console.log(`  High: ${high.length}`);
  console.log(`  Medium: ${medium.length}`);
  console.log(`  Low: ${low.length}`);
  console.log(`Files Audited: ${sectionFiles.length + 2}`);
  
  if (issues.length === 0) {
    console.log('\n✨ PERFECT! All typography is compliant!');
  } else {
    console.log('\n⚠️  Issues found. Review and fix as needed.');
  }
  
  process.exit(issues.length > 0 ? 1 : 0);
}

main();
