#!/usr/bin/env node

/**
 * Audit Marketing Typography Compliance
 * 
 * Checks all marketing components for proper typography implementation:
 * - Logo: font-pixel (Coral Pixels)
 * - Titles (h1): font-title uppercase (Anton SC)
 * - Headings (h2-h4): font-heading uppercase (Bebas Neue)
 * - Body: font-tech (Share Tech) - via layout
 * - Mono: font-tech-mono (Share Tech Mono)
 */

const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, '../src/marketing/components/sections');
const navPath = path.join(__dirname, '../src/marketing/components/MarketingNav.tsx');
const footerPath = path.join(__dirname, '../src/marketing/components/MarketingFooter.tsx');

const issues = {
  logo: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  p: [],
  code: []
};

function checkLogo(filePath, content) {
  const fileName = path.basename(filePath);
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Check for ATLVS logo text
    if (line.includes('ATLVS') || line.includes('logo')) {
      if (line.includes('className=') && !line.includes('font-pixel')) {
        issues.logo.push({
          file: fileName,
          line: index + 1,
          content: line.trim(),
          issue: 'Missing font-pixel class'
        });
      }
    }
  });
}

function checkHeadings(filePath, content) {
  const fileName = path.basename(filePath);
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Check h1 tags
    if (line.includes('<h1') && line.includes('className=')) {
      if (!line.includes('font-title')) {
        issues.h1.push({
          file: fileName,
          line: index + 1,
          content: line.trim(),
          issue: 'Missing font-title class'
        });
      }
      if (!line.includes('uppercase')) {
        issues.h1.push({
          file: fileName,
          line: index + 1,
          content: line.trim(),
          issue: 'Missing uppercase class'
        });
      }
    }
    
    // Check h2 tags
    if (line.includes('<h2') && line.includes('className=')) {
      if (!line.includes('font-heading')) {
        issues.h2.push({
          file: fileName,
          line: index + 1,
          content: line.trim(),
          issue: 'Missing font-heading class'
        });
      }
      if (!line.includes('uppercase')) {
        issues.h2.push({
          file: fileName,
          line: index + 1,
          content: line.trim(),
          issue: 'Missing uppercase class'
        });
      }
    }
    
    // Check h3 tags
    if (line.includes('<h3') && line.includes('className=')) {
      if (!line.includes('font-heading')) {
        issues.h3.push({
          file: fileName,
          line: index + 1,
          content: line.trim(),
          issue: 'Missing font-heading class'
        });
      }
      if (!line.includes('uppercase')) {
        issues.h3.push({
          file: fileName,
          line: index + 1,
          content: line.trim(),
          issue: 'Missing uppercase class'
        });
      }
    }
    
    // Check h4 tags
    if (line.includes('<h4') && line.includes('className=')) {
      if (!line.includes('font-heading')) {
        issues.h4.push({
          file: fileName,
          line: index + 1,
          content: line.trim(),
          issue: 'Missing font-heading class'
        });
      }
      if (!line.includes('uppercase')) {
        issues.h4.push({
          file: fileName,
          line: index + 1,
          content: line.trim(),
          issue: 'Missing uppercase class'
        });
      }
    }
    
    // Check for code/mono elements
    if ((line.includes('<code') || line.includes('<pre')) && line.includes('className=')) {
      if (!line.includes('font-tech-mono')) {
        issues.code.push({
          file: fileName,
          line: index + 1,
          content: line.trim(),
          issue: 'Missing font-tech-mono class'
        });
      }
    }
  });
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  // Check logo in nav
  if (fileName === 'MarketingNav.tsx') {
    checkLogo(filePath, content);
  }
  
  // Check headings in all files
  checkHeadings(filePath, content);
}

function main() {
  console.log('🔍 Auditing Marketing Typography Compliance...\n');
  
  // Audit navigation
  console.log('📋 Checking MarketingNav.tsx...');
  auditFile(navPath);
  
  // Audit footer
  console.log('📋 Checking MarketingFooter.tsx...');
  auditFile(footerPath);
  
  // Audit all section files
  console.log('📋 Checking section components...\n');
  const files = fs.readdirSync(sectionsDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(sectionsDir, file));
  
  files.forEach(filePath => {
    auditFile(filePath);
  });
  
  // Report results
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 AUDIT RESULTS');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  let totalIssues = 0;
  
  // Logo issues
  if (issues.logo.length > 0) {
    console.log('❌ LOGO ISSUES (font-pixel):');
    issues.logo.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   Issue: ${issue.issue}`);
      console.log(`   Code: ${issue.content.substring(0, 80)}...`);
      console.log('');
    });
    totalIssues += issues.logo.length;
  } else {
    console.log('✅ Logo: All ATLVS logos use font-pixel');
  }
  
  // H1 issues
  if (issues.h1.length > 0) {
    console.log('\n❌ H1 TITLE ISSUES (font-title uppercase):');
    issues.h1.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   Issue: ${issue.issue}`);
      console.log(`   Code: ${issue.content.substring(0, 80)}...`);
      console.log('');
    });
    totalIssues += issues.h1.length;
  } else {
    console.log('✅ H1 Titles: All use font-title uppercase');
  }
  
  // H2 issues
  if (issues.h2.length > 0) {
    console.log('\n❌ H2 HEADING ISSUES (font-heading uppercase):');
    issues.h2.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   Issue: ${issue.issue}`);
      console.log(`   Code: ${issue.content.substring(0, 80)}...`);
      console.log('');
    });
    totalIssues += issues.h2.length;
  } else {
    console.log('✅ H2 Headings: All use font-heading uppercase');
  }
  
  // H3 issues
  if (issues.h3.length > 0) {
    console.log('\n❌ H3 HEADING ISSUES (font-heading uppercase):');
    issues.h3.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   Issue: ${issue.issue}`);
      console.log(`   Code: ${issue.content.substring(0, 80)}...`);
      console.log('');
    });
    totalIssues += issues.h3.length;
  } else {
    console.log('✅ H3 Headings: All use font-heading uppercase');
  }
  
  // H4 issues
  if (issues.h4.length > 0) {
    console.log('\n❌ H4 HEADING ISSUES (font-heading uppercase):');
    issues.h4.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   Issue: ${issue.issue}`);
      console.log(`   Code: ${issue.content.substring(0, 80)}...`);
      console.log('');
    });
    totalIssues += issues.h4.length;
  } else {
    console.log('✅ H4 Headings: All use font-heading uppercase');
  }
  
  // Code/mono issues
  if (issues.code.length > 0) {
    console.log('\n❌ CODE/MONO ISSUES (font-tech-mono):');
    issues.code.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   Issue: ${issue.issue}`);
      console.log(`   Code: ${issue.content.substring(0, 80)}...`);
      console.log('');
    });
    totalIssues += issues.code.length;
  } else {
    console.log('✅ Code/Mono: All use font-tech-mono');
  }
  
  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📈 SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total Issues Found: ${totalIssues}`);
  console.log(`Files Audited: ${files.length + 2}`);
  
  if (totalIssues === 0) {
    console.log('\n✨ PERFECT! All marketing typography is compliant! ✨');
    console.log('\n🎨 Typography System:');
    console.log('   ✓ Logo: font-pixel (Coral Pixels)');
    console.log('   ✓ Titles (h1): font-title uppercase (Anton SC)');
    console.log('   ✓ Headings (h2-h4): font-heading uppercase (Bebas Neue)');
    console.log('   ✓ Body: font-tech (Share Tech) - via layout');
    console.log('   ✓ Mono: font-tech-mono (Share Tech Mono)');
  } else {
    console.log('\n⚠️  Issues found. Run fix script to resolve.');
  }
  
  process.exit(totalIssues > 0 ? 1 : 0);
}

main();
