#!/usr/bin/env node

/**
 * Comprehensive Marketing Pages Audit
 * 
 * Audits ALL marketing files for:
 * 1. Typography consistency (font-title, font-heading, font-tech)
 * 2. Dark mode classes (dark:text-*, dark:bg-*, dark:border-*)
 * 3. Color consistency
 * 4. Text size consistency
 */

const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, '../src/marketing/components/sections');
const navPath = path.join(__dirname, '../src/marketing/components/MarketingNav.tsx');
const footerPath = path.join(__dirname, '../src/marketing/components/MarketingFooter.tsx');

const issues = {
  typography: [],
  darkMode: [],
  colors: [],
  textSizes: []
};

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for text without dark mode
    if (line.includes('text-gray-') && !line.includes('dark:text-')) {
      issues.darkMode.push({
        file: fileName,
        line: lineNum,
        type: 'MISSING_DARK_TEXT',
        content: line.trim().substring(0, 100),
        fix: 'Add dark:text-* class'
      });
    }
    
    // Check for bg without dark mode
    if (line.includes('bg-gray-') && !line.includes('dark:bg-') && !line.includes('dark:from-') && !line.includes('dark:to-')) {
      issues.darkMode.push({
        file: fileName,
        line: lineNum,
        type: 'MISSING_DARK_BG',
        content: line.trim().substring(0, 100),
        fix: 'Add dark:bg-* class'
      });
    }
    
    // Check for border without dark mode
    if (line.includes('border-gray-') && !line.includes('dark:border-')) {
      issues.darkMode.push({
        file: fileName,
        line: lineNum,
        type: 'MISSING_DARK_BORDER',
        content: line.trim().substring(0, 100),
        fix: 'Add dark:border-* class'
      });
    }
    
    // Check h1 without proper font
    if (line.match(/<h1[^>]*className/) && !line.includes('font-title')) {
      issues.typography.push({
        file: fileName,
        line: lineNum,
        type: 'H1_MISSING_FONT',
        content: line.trim().substring(0, 100),
        fix: 'Add font-title uppercase'
      });
    }
    
    // Check h2-h4 without proper font
    if (line.match(/<h[234][^>]*className/) && !line.includes('font-heading')) {
      issues.typography.push({
        file: fileName,
        line: lineNum,
        type: 'HEADING_MISSING_FONT',
        content: line.trim().substring(0, 100),
        fix: 'Add font-heading uppercase'
      });
    }
    
    // Check for font-bold (should be font-heading)
    if (line.includes('font-bold') && !line.includes('font-heading') && !line.includes('font-title')) {
      issues.typography.push({
        file: fileName,
        line: lineNum,
        type: 'FONT_BOLD_USAGE',
        content: line.trim().substring(0, 100),
        fix: 'Replace font-bold with font-heading uppercase'
      });
    }
    
    // Check for font-semibold (should be font-heading)
    if (line.includes('font-semibold') && !line.includes('font-heading')) {
      issues.typography.push({
        file: fileName,
        line: lineNum,
        type: 'FONT_SEMIBOLD_USAGE',
        content: line.trim().substring(0, 100),
        fix: 'Replace font-semibold with font-heading uppercase'
      });
    }
    
    // Check for inconsistent text colors
    if (line.includes('text-blue-') && !line.includes('text-blue-600')) {
      issues.colors.push({
        file: fileName,
        line: lineNum,
        type: 'INCONSISTENT_BLUE',
        content: line.trim().substring(0, 100),
        fix: 'Use text-blue-600 for consistency'
      });
    }
    
    // Check for text-black or text-white (should use gray scale)
    if ((line.includes('text-black') || line.includes('text-white')) && !line.includes('dark:')) {
      issues.colors.push({
        file: fileName,
        line: lineNum,
        type: 'ABSOLUTE_COLOR',
        content: line.trim().substring(0, 100),
        fix: 'Use text-gray-900 dark:text-white pattern'
      });
    }
  });
}

function generateReport() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 COMPREHENSIVE MARKETING AUDIT REPORT');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const totalIssues = 
    issues.typography.length + 
    issues.darkMode.length + 
    issues.colors.length + 
    issues.textSizes.length;
  
  // Typography Issues
  if (issues.typography.length > 0) {
    console.log('🔤 TYPOGRAPHY ISSUES');
    console.log(`   Count: ${issues.typography.length}\n`);
    
    const byType = {};
    issues.typography.forEach(issue => {
      if (!byType[issue.type]) byType[issue.type] = [];
      byType[issue.type].push(issue);
    });
    
    Object.keys(byType).forEach(type => {
      console.log(`   ${type}: ${byType[type].length} occurrences`);
      byType[type].slice(0, 3).forEach(issue => {
        console.log(`      ${issue.file}:${issue.line}`);
        console.log(`      ${issue.content}`);
        console.log(`      Fix: ${issue.fix}\n`);
      });
      if (byType[type].length > 3) {
        console.log(`      ... and ${byType[type].length - 3} more\n`);
      }
    });
  } else {
    console.log('✅ TYPOGRAPHY: All consistent\n');
  }
  
  // Dark Mode Issues
  if (issues.darkMode.length > 0) {
    console.log('🌙 DARK MODE ISSUES');
    console.log(`   Count: ${issues.darkMode.length}\n`);
    
    const byType = {};
    issues.darkMode.forEach(issue => {
      if (!byType[issue.type]) byType[issue.type] = [];
      byType[issue.type].push(issue);
    });
    
    Object.keys(byType).forEach(type => {
      console.log(`   ${type}: ${byType[type].length} occurrences`);
      byType[type].slice(0, 3).forEach(issue => {
        console.log(`      ${issue.file}:${issue.line}`);
        console.log(`      ${issue.content}`);
        console.log(`      Fix: ${issue.fix}\n`);
      });
      if (byType[type].length > 3) {
        console.log(`      ... and ${byType[type].length - 3} more\n`);
      }
    });
  } else {
    console.log('✅ DARK MODE: All classes present\n');
  }
  
  // Color Issues
  if (issues.colors.length > 0) {
    console.log('🎨 COLOR CONSISTENCY ISSUES');
    console.log(`   Count: ${issues.colors.length}\n`);
    
    issues.colors.slice(0, 5).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   Type: ${issue.type}`);
      console.log(`   ${issue.content}`);
      console.log(`   Fix: ${issue.fix}\n`);
    });
    if (issues.colors.length > 5) {
      console.log(`   ... and ${issues.colors.length - 5} more\n`);
    }
  } else {
    console.log('✅ COLORS: All consistent\n');
  }
  
  // Summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📈 SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total Issues: ${totalIssues}`);
  console.log(`  Typography: ${issues.typography.length}`);
  console.log(`  Dark Mode: ${issues.darkMode.length}`);
  console.log(`  Colors: ${issues.colors.length}`);
  console.log(`  Text Sizes: ${issues.textSizes.length}`);
  
  if (totalIssues === 0) {
    console.log('\n✨ PERFECT! All marketing pages are consistent!');
  } else {
    console.log('\n⚠️  Issues found. Remediation needed.');
  }
  
  // File breakdown
  console.log('\n📁 FILES AUDITED:');
  const fileIssues = {};
  [...issues.typography, ...issues.darkMode, ...issues.colors, ...issues.textSizes].forEach(issue => {
    if (!fileIssues[issue.file]) fileIssues[issue.file] = 0;
    fileIssues[issue.file]++;
  });
  
  Object.keys(fileIssues).sort((a, b) => fileIssues[b] - fileIssues[a]).forEach(file => {
    console.log(`   ${file}: ${fileIssues[file]} issues`);
  });
  
  return totalIssues;
}

function main() {
  console.log('🔍 Starting Comprehensive Marketing Audit...\n');
  console.log('Analyzing typography, dark mode, and color consistency...\n');
  
  // Audit all files
  analyzeFile(navPath);
  analyzeFile(footerPath);
  
  const sectionFiles = fs.readdirSync(sectionsDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(sectionsDir, file));
  
  sectionFiles.forEach(analyzeFile);
  
  const totalIssues = generateReport();
  
  process.exit(totalIssues > 0 ? 1 : 0);
}

main();
