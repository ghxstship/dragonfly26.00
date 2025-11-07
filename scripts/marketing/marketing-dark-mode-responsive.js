#!/usr/bin/env node

/**
 * Marketing Dark Mode & Responsive Optimization Script
 * Adds dark mode support and ensures responsive design across all marketing components
 */

const fs = require('fs');
const path = require('path');

const MARKETING_SECTIONS_DIR = path.join(__dirname, '../src/marketing/components/sections');
const MARKETING_COMPONENTS_DIR = path.join(__dirname, '../src/marketing/components');

// Dark mode class mappings
const darkModeMap = {
  // Backgrounds
  'bg-white': 'bg-white dark:bg-gray-900',
  'bg-gray-50': 'bg-gray-50 dark:bg-gray-800',
  'bg-gray-100': 'bg-gray-100 dark:bg-gray-800',
  'bg-gray-200': 'bg-gray-200 dark:bg-gray-700',
  'bg-gray-900': 'bg-gray-900 dark:bg-gray-950',
  
  // Text colors
  'text-gray-900': 'text-gray-900 dark:text-white',
  'text-gray-800': 'text-gray-800 dark:text-gray-100',
  'text-gray-700': 'text-gray-700 dark:text-gray-300',
  'text-gray-600': 'text-gray-600 dark:text-gray-400',
  'text-gray-500': 'text-gray-500 dark:text-gray-500',
  
  // Borders
  'border-gray-200': 'border-gray-200 dark:border-gray-800',
  'border-gray-300': 'border-gray-300 dark:border-gray-700',
  
  // Hover states
  'hover:bg-gray-100': 'hover:bg-gray-100 dark:hover:bg-gray-800',
  'hover:text-gray-900': 'hover:text-gray-900 dark:hover:text-white',
};

// Responsive breakpoint checks
const responsivePatterns = [
  { pattern: /className="[^"]*\bw-\d+\b[^"]*"/g, name: 'Fixed widths' },
  { pattern: /className="[^"]*\bh-\d+\b[^"]*"/g, name: 'Fixed heights' },
  { pattern: /className="[^"]*\btext-\d+xl\b[^"]*"/g, name: 'Text sizes' },
  { pattern: /className="[^"]*\bp-\d+\b[^"]*"/g, name: 'Padding' },
  { pattern: /className="[^"]*\bm-\d+\b[^"]*"/g, name: 'Margin' },
];

function addDarkModeToFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Skip if already has dark mode classes
  if (content.includes('dark:')) {
    console.log(`✓ ${path.basename(filePath)} - Already has dark mode`);
    return { modified: false, file: filePath };
  }

  // Add dark mode classes
  Object.entries(darkModeMap).forEach(([lightClass, darkClass]) => {
    const regex = new RegExp(`className="([^"]*\\b${lightClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[^"]*)"`, 'g');
    const newContent = content.replace(regex, (match, classes) => {
      // Don't replace if already has dark mode
      if (classes.includes('dark:')) return match;
      
      const updatedClasses = classes.replace(lightClass, darkClass);
      return `className="${updatedClasses}"`;
    });
    
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ ${path.basename(filePath)} - Added dark mode support`);
  }

  return { modified, file: filePath };
}

function analyzeResponsiveness(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // Check for responsive breakpoints
  const hasBreakpoints = /className="[^"]*\b(sm:|md:|lg:|xl:|2xl:)/.test(content);
  
  // Check for fixed widths without responsive variants
  const fixedWidths = content.match(/className="[^"]*\bw-\d+\b[^"]*"/g) || [];
  const responsiveWidths = content.match(/className="[^"]*\b(sm:|md:|lg:|xl:|2xl:)w-/g) || [];
  
  if (fixedWidths.length > 0 && responsiveWidths.length === 0) {
    issues.push('Missing responsive width variants');
  }

  // Check for large text without responsive variants
  const largeText = content.match(/className="[^"]*\btext-[4-9]xl\b[^"]*"/g) || [];
  const responsiveText = content.match(/className="[^"]*\b(sm:|md:|lg:|xl:|2xl:)text-/g) || [];
  
  if (largeText.length > 0 && responsiveText.length === 0) {
    issues.push('Missing responsive text size variants');
  }

  // Check for grid without responsive columns
  const hasGrid = /className="[^"]*\bgrid\b/.test(content);
  const hasResponsiveGrid = /className="[^"]*\b(sm:|md:|lg:|xl:|2xl:)grid-cols-/.test(content);
  
  if (hasGrid && !hasResponsiveGrid) {
    issues.push('Grid layout missing responsive column variants');
  }

  return {
    file: path.basename(filePath),
    hasBreakpoints,
    issues,
    score: issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 20))
  };
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  const results = {
    darkMode: [],
    responsive: []
  };

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile() && file.endsWith('.tsx')) {
      // Add dark mode
      const darkModeResult = addDarkModeToFile(filePath);
      results.darkMode.push(darkModeResult);

      // Analyze responsiveness
      const responsiveResult = analyzeResponsiveness(filePath);
      results.responsive.push(responsiveResult);
    }
  });

  return results;
}

function main() {
  console.log('🎨 Marketing Dark Mode & Responsive Optimization\n');
  console.log('=' .repeat(60));

  // Process sections
  console.log('\n📁 Processing Marketing Sections...\n');
  const sectionsResults = processDirectory(MARKETING_SECTIONS_DIR);

  // Process footer
  console.log('\n📁 Processing Marketing Components...\n');
  const footerPath = path.join(MARKETING_COMPONENTS_DIR, 'MarketingFooter.tsx');
  if (fs.existsSync(footerPath)) {
    const darkModeResult = addDarkModeToFile(footerPath);
    sectionsResults.darkMode.push(darkModeResult);
    
    const responsiveResult = analyzeResponsiveness(footerPath);
    sectionsResults.responsive.push(responsiveResult);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY\n');
  
  const modifiedCount = sectionsResults.darkMode.filter(r => r.modified).length;
  console.log(`✅ Dark Mode: ${modifiedCount} files updated`);
  
  const avgScore = sectionsResults.responsive.reduce((sum, r) => sum + r.score, 0) / sectionsResults.responsive.length;
  console.log(`📱 Responsive Score: ${avgScore.toFixed(1)}%\n`);
  
  // Responsive issues
  const filesWithIssues = sectionsResults.responsive.filter(r => r.issues.length > 0);
  if (filesWithIssues.length > 0) {
    console.log('⚠️  Files needing responsive improvements:\n');
    filesWithIssues.forEach(file => {
      console.log(`   ${file.file}:`);
      file.issues.forEach(issue => console.log(`     - ${issue}`));
    });
  } else {
    console.log('✅ All files are responsive!');
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Marketing optimization complete!\n');
}

main();
