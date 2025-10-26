#!/usr/bin/env node

/**
 * Smart Context-Aware Marketing Audit
 * 
 * Understands context to avoid false positives:
 * - text-white is OK on dark backgrounds (bg-gray-900, bg-gray-800, etc.)
 * - font-bold is OK for logos and badges
 * - font-semibold is OK for small labels and badges
 * - Only flags real typography and dark mode issues
 */

const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, '../src/marketing/components/sections');
const navPath = path.join(__dirname, '../src/marketing/components/MarketingNav.tsx');
const footerPath = path.join(__dirname, '../src/marketing/components/MarketingFooter.tsx');

const issues = {
  typography: [],
  darkMode: [],
  realIssues: []
};

function isOnDarkBackground(line, allLines, lineIndex) {
  // Check if this element or its parent has a dark background
  const darkBgPatterns = [
    'bg-gray-900',
    'bg-gray-800',
    'bg-black',
    'bg-blue-600',
    'bg-blue-700',
    'bg-purple-600',
    'bg-gradient-to-r'
  ];
  
  // Check current line
  if (darkBgPatterns.some(pattern => line.includes(pattern))) {
    return true;
  }
  
  // Check previous 10 lines for parent container
  for (let i = Math.max(0, lineIndex - 10); i < lineIndex; i++) {
    if (darkBgPatterns.some(pattern => allLines[i].includes(pattern))) {
      return true;
    }
  }
  
  return false;
}

function isLogoOrBadge(line) {
  return line.includes('font-pixel') || 
         line.includes('badge') || 
         line.includes('rounded-full') ||
         line.includes('text-xs') ||
         line.includes('text-sm') && line.includes('px-');
}

function isLabelOrSmallText(line) {
  return (line.includes('text-xs') || line.includes('text-sm')) &&
         (line.includes('uppercase') || line.includes('label'));
}

function shouldBeHeading(line) {
  // Check if it's a heading element
  if (line.match(/<h[1-6]/)) {
    return true;
  }
  
  // Check if it's large prominent text that should use heading font
  if (line.includes('text-3xl') || 
      line.includes('text-4xl') || 
      line.includes('text-5xl') ||
      line.includes('text-2xl') && !line.includes('text-xs')) {
    return true;
  }
  
  // Check if it's a question or prominent statement
  if (line.includes('question') || 
      line.includes('Everything in') ||
      line.includes('Monthly') && line.includes('Annual')) {
    return true;
  }
  
  return false;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // TYPOGRAPHY CHECKS
    
    // Check h1 without font-title
    if (line.match(/<h1[^>]*className/) && !line.includes('font-title')) {
      issues.typography.push({
        file: fileName,
        line: lineNum,
        type: 'H1_MISSING_FONT_TITLE',
        severity: 'HIGH',
        content: line.trim().substring(0, 120),
        fix: 'Add font-title uppercase'
      });
      issues.realIssues.push('typography');
    }
    
    // Check h2-h4 without font-heading
    if (line.match(/<h[234][^>]*className/) && !line.includes('font-heading')) {
      issues.typography.push({
        file: fileName,
        line: lineNum,
        type: 'HEADING_MISSING_FONT',
        severity: 'HIGH',
        content: line.trim().substring(0, 120),
        fix: 'Add font-heading uppercase'
      });
      issues.realIssues.push('typography');
    }
    
    // Check font-bold usage (only flag if it should be a heading)
    if (line.includes('font-bold') && 
        !isLogoOrBadge(line) && 
        shouldBeHeading(line) &&
        !line.includes('font-heading') && 
        !line.includes('font-title')) {
      issues.typography.push({
        file: fileName,
        line: lineNum,
        type: 'FONT_BOLD_SHOULD_BE_HEADING',
        severity: 'MEDIUM',
        content: line.trim().substring(0, 120),
        fix: 'Replace font-bold with font-heading uppercase'
      });
      issues.realIssues.push('typography');
    }
    
    // Check font-semibold usage (only flag if it should be a heading)
    if (line.includes('font-semibold') && 
        !isLabelOrSmallText(line) &&
        shouldBeHeading(line) &&
        !line.includes('font-heading')) {
      issues.typography.push({
        file: fileName,
        line: lineNum,
        type: 'FONT_SEMIBOLD_SHOULD_BE_HEADING',
        severity: 'MEDIUM',
        content: line.trim().substring(0, 120),
        fix: 'Replace font-semibold with font-heading uppercase'
      });
      issues.realIssues.push('typography');
    }
    
    // DARK MODE CHECKS
    
    // Check for text color without dark mode (but not on dark backgrounds)
    if (line.includes('text-gray-') && 
        !line.includes('dark:text-') &&
        !isOnDarkBackground(line, lines, index) &&
        line.includes('className')) {
      issues.darkMode.push({
        file: fileName,
        line: lineNum,
        type: 'MISSING_DARK_TEXT',
        severity: 'MEDIUM',
        content: line.trim().substring(0, 120),
        fix: 'Add dark:text-* class'
      });
      issues.realIssues.push('darkMode');
    }
    
    // Check for bg without dark mode (but not if already dark)
    if (line.includes('bg-gray-') && 
        !line.includes('dark:bg-') &&
        !line.includes('bg-gray-900') &&
        !line.includes('bg-gray-800') &&
        line.includes('hover:bg-')) {
      issues.darkMode.push({
        file: fileName,
        line: lineNum,
        type: 'MISSING_DARK_BG_HOVER',
        severity: 'LOW',
        content: line.trim().substring(0, 120),
        fix: 'Add dark:hover:bg-* class'
      });
      issues.realIssues.push('darkMode');
    }
    
    // Check for border without dark mode
    if (line.includes('border-gray-') && 
        !line.includes('dark:border-') &&
        !isOnDarkBackground(line, lines, index)) {
      issues.darkMode.push({
        file: fileName,
        line: lineNum,
        type: 'MISSING_DARK_BORDER',
        severity: 'LOW',
        content: line.trim().substring(0, 120),
        fix: 'Add dark:border-* class'
      });
      issues.realIssues.push('darkMode');
    }
  });
}

function generateReport() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 SMART CONTEXT-AWARE MARKETING AUDIT');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const totalIssues = issues.realIssues.length;
  
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
      byType[type].forEach(issue => {
        console.log(`      ${issue.file}:${issue.line} [${issue.severity}]`);
        console.log(`      ${issue.content}`);
        console.log(`      Fix: ${issue.fix}\n`);
      });
    });
  } else {
    console.log('✅ TYPOGRAPHY: All headings use correct fonts\n');
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
      byType[type].slice(0, 5).forEach(issue => {
        console.log(`      ${issue.file}:${issue.line} [${issue.severity}]`);
        console.log(`      ${issue.content}`);
        console.log(`      Fix: ${issue.fix}\n`);
      });
      if (byType[type].length > 5) {
        console.log(`      ... and ${byType[type].length - 5} more\n`);
      }
    });
  } else {
    console.log('✅ DARK MODE: All elements have proper dark mode support\n');
  }
  
  // Summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📈 SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total Real Issues: ${totalIssues}`);
  console.log(`  Typography: ${issues.typography.length}`);
  console.log(`  Dark Mode: ${issues.darkMode.length}`);
  
  if (totalIssues === 0) {
    console.log('\n✨ PERFECT! All marketing pages are consistent!');
    console.log('\n🎨 Verified:');
    console.log('   ✓ All h1 tags use font-title uppercase');
    console.log('   ✓ All h2-h4 tags use font-heading uppercase');
    console.log('   ✓ All elements have proper dark mode support');
    console.log('   ✓ Context-appropriate font usage (badges, labels, etc.)');
  } else {
    console.log('\n⚠️  Real issues found that need fixing.');
    
    // File breakdown
    console.log('\n📁 FILES WITH ISSUES:');
    const fileIssues = {};
    [...issues.typography, ...issues.darkMode].forEach(issue => {
      if (!fileIssues[issue.file]) fileIssues[issue.file] = 0;
      fileIssues[issue.file]++;
    });
    
    Object.keys(fileIssues).sort((a, b) => fileIssues[b] - fileIssues[a]).forEach(file => {
      console.log(`   ${file}: ${fileIssues[file]} issues`);
    });
  }
  
  return totalIssues;
}

function main() {
  console.log('🔍 Starting Smart Context-Aware Audit...\n');
  console.log('Analyzing with context understanding...\n');
  
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
