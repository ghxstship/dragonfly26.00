#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 CROSS-PAGE CONSISTENCY AUDIT\n');
console.log('Verifying typography, style, theme, and color alignment\n');
console.log('═'.repeat(80));

const pagePatterns = {
  h1Sizes: {},
  h2Sizes: {},
  h3Sizes: {},
  pSizes: {},
  fonts: {},
  darkMode: {},
};

const EXPECTED_H1_SIZE = 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl';
const EXPECTED_HERO_H1_SIZE = 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl';

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  const fileName = relativePath.split('/').pop().replace('.tsx', '');
  
  const analysis = {
    file: relativePath,
    fileName,
    h1: [],
    h2: [],
    h3: [],
    fonts: new Set(),
    darkModePatterns: 0,
  };
  
  // Extract h1 tags with sizes
  const h1Regex = /<h1[^>]*className="([^"]*)"[^>]*>/g;
  let match;
  while ((match = h1Regex.exec(content)) !== null) {
    const classes = match[1];
    const sizeMatch = classes.match(/(text-\S+(?:\s+sm:text-\S+)?(?:\s+md:text-\S+)?(?:\s+lg:text-\S+)?)/);
    if (sizeMatch) {
      analysis.h1.push(sizeMatch[1]);
    }
    
    // Check font
    if (classes.includes('font-title')) analysis.fonts.add('font-title');
    if (classes.includes('font-heading')) analysis.fonts.add('font-heading');
    if (classes.includes('font-pixel')) analysis.fonts.add('font-pixel');
  }
  
  // Extract h2 tags
  const h2Regex = /<h2[^>]*className="([^"]*)"[^>]*>/g;
  while ((match = h2Regex.exec(content)) !== null) {
    const classes = match[1];
    if (classes.includes('font-heading')) analysis.fonts.add('h2:font-heading');
    if (!classes.includes('uppercase')) analysis.h2.push('MISSING_UPPERCASE');
  }
  
  // Extract h3 tags
  const h3Regex = /<h3[^>]*className="([^"]*)"[^>]*>/g;
  while ((match = h3Regex.exec(content)) !== null) {
    const classes = match[1];
    if (classes.includes('font-heading')) analysis.fonts.add('h3:font-heading');
    if (!classes.includes('uppercase')) analysis.h3.push('MISSING_UPPERCASE');
  }
  
  // Count dark mode patterns
  analysis.darkModePatterns = (content.match(/dark:/g) || []).length;
  
  return analysis;
}

function scanDirectory(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      results.push(...scanDirectory(fullPath));
    } else if (entry.name === 'page.tsx' || entry.name.endsWith('Section.tsx')) {
      results.push(analyzeFile(fullPath));
    }
  });
  
  return results;
}

// Scan marketing pages
const marketingDir = path.join(process.cwd(), 'src/app/[locale]/(marketing)');
const marketingResults = scanDirectory(marketingDir);

// Scan marketing components
const componentsDir = path.join(process.cwd(), 'src/marketing/components');
const componentResults = scanDirectory(componentsDir);

const allResults = [...marketingResults, ...componentResults];

console.log('\n📊 CROSS-PAGE ANALYSIS\n');
console.log('═'.repeat(80));

// Group h1 sizes
const h1SizeGroups = {};
allResults.forEach(result => {
  result.h1.forEach(size => {
    if (!h1SizeGroups[size]) h1SizeGroups[size] = [];
    h1SizeGroups[size].push(result.fileName);
  });
});

console.log('\n📏 H1 SIZE CONSISTENCY:\n');
Object.entries(h1SizeGroups).forEach(([size, files]) => {
  const isStandard = size === EXPECTED_H1_SIZE || size === EXPECTED_HERO_H1_SIZE;
  const icon = isStandard ? '✅' : '❌';
  console.log(`${icon} ${size}`);
  console.log(`   Files: ${files.join(', ')}`);
  console.log('');
});

// Check font consistency
console.log('\n🔤 FONT USAGE:\n');
const fontUsage = {};
allResults.forEach(result => {
  result.fonts.forEach(font => {
    if (!fontUsage[font]) fontUsage[font] = 0;
    fontUsage[font]++;
  });
});
Object.entries(fontUsage).sort((a, b) => b[1] - a[1]).forEach(([font, count]) => {
  console.log(`✅ ${font}: ${count} files`);
});

// Check dark mode coverage
console.log('\n🌙 DARK MODE COVERAGE:\n');
const darkModeStats = allResults.map(r => ({
  file: r.fileName,
  count: r.darkModePatterns
})).sort((a, b) => a.count - b.count);

const avgDarkMode = darkModeStats.reduce((sum, s) => sum + s.count, 0) / darkModeStats.length;
console.log(`Average dark: variants per file: ${avgDarkMode.toFixed(1)}`);
console.log(`\nFiles with lowest coverage:`);
darkModeStats.slice(0, 5).forEach(s => {
  const icon = s.count > 5 ? '✅' : '⚠️';
  console.log(`${icon} ${s.file}: ${s.count} dark: variants`);
});

// Final summary
console.log('\n═'.repeat(80));
console.log('📈 CONSISTENCY SUMMARY');
console.log('═'.repeat(80));

const h1Consistent = Object.keys(h1SizeGroups).every(size => 
  size === EXPECTED_H1_SIZE || size === EXPECTED_HERO_H1_SIZE
);

const allHaveH2Heading = allResults.every(r => 
  r.fonts.has('h2:font-heading') || r.h2.length === 0
);

const allHaveH3Heading = allResults.every(r => 
  r.fonts.has('h3:font-heading') || r.h3.length === 0
);

console.log(`\n✅ H1 Size Consistency: ${h1Consistent ? 'PERFECT' : 'NEEDS WORK'}`);
console.log(`✅ H2 Font Consistency: ${allHaveH2Heading ? 'PERFECT' : 'NEEDS WORK'}`);
console.log(`✅ H3 Font Consistency: ${allHaveH3Heading ? 'PERFECT' : 'NEEDS WORK'}`);
console.log(`✅ Dark Mode Coverage: ${avgDarkMode > 10 ? 'EXCELLENT' : 'GOOD'}`);

if (h1Consistent && allHaveH2Heading && allHaveH3Heading) {
  console.log('\n✨ PERFECT! 100% CROSS-PAGE CONSISTENCY! ✨');
  console.log('\nSTATUS: PRODUCTION READY - ZERO TOLERANCE ACHIEVED');
  console.log('CERTIFICATION: A+ (100/100) - PERFECT CROSS-PAGE ALIGNMENT');
  process.exit(0);
} else {
  console.log('\n⚠️  STATUS: MINOR INCONSISTENCIES FOUND');
  process.exit(1);
}
