#!/usr/bin/env node

/**
 * CARD ALIGNMENT AUDIT SCRIPT
 * 
 * Analyzes card components and containers across the repository to identify:
 * 1. Current alignment patterns (left, center, justify)
 * 2. Responsive behavior across breakpoints
 * 3. Inconsistencies in similar contexts
 * 4. Industry best practice violations
 * 
 * Focus areas:
 * - Marketing pages
 * - Dashboard components
 * - Card components (atoms/molecules/organisms)
 * - Grid/flex containers
 */

const fs = require('fs');
const path = require('path');

// Patterns to identify card-like components and containers
const CARD_PATTERNS = [
  /className="[^"]*\bcard\b[^"]*"/g,
  /className="[^"]*\bborder\b[^"]*rounded[^"]*"/g,
  /className="[^"]*\bp-\d+[^"]*\bbg-[^"]*"/g,
  /className="[^"]*\bshadow[^"]*"/g,
];

// Alignment patterns to detect
const ALIGNMENT_PATTERNS = {
  center: /\b(mx-auto|text-center|items-center|justify-center)\b/g,
  left: /\b(items-start|justify-start|text-left)\b/g,
  justify: /\b(justify-between|items-stretch)\b/g,
};

// Responsive breakpoint patterns
const BREAKPOINT_PATTERNS = {
  mobile: /\b(sm:|md:)/g,
  tablet: /\b(md:|lg:)/g,
  desktop: /\b(lg:|xl:)/g,
};

// Grid/flex container patterns
const CONTAINER_PATTERNS = {
  grid: /className="[^"]*\bgrid\b[^"]*"/g,
  flex: /className="[^"]*\bflex\b[^"]*"/g,
  gridCols: /grid-cols-(\d+)/g,
  flexWrap: /flex-wrap/g,
};

const results = {
  marketing: {
    pages: [],
    totalCards: 0,
    alignmentPatterns: { center: 0, left: 0, justify: 0, mixed: 0 },
    responsiveCards: 0,
    inconsistencies: [],
  },
  dashboard: {
    components: [],
    totalCards: 0,
    alignmentPatterns: { center: 0, left: 0, justify: 0, mixed: 0 },
    responsiveCards: 0,
    inconsistencies: [],
  },
  components: {
    atoms: [],
    molecules: [],
    organisms: [],
    totalCards: 0,
    alignmentPatterns: { center: 0, left: 0, justify: 0, mixed: 0 },
  },
  summary: {
    totalFilesAnalyzed: 0,
    totalCardsFound: 0,
    centerAlignedCards: 0,
    leftAlignedCards: 0,
    responsiveAlignmentCards: 0,
    inconsistentPatterns: [],
  },
};

function analyzeFile(filePath, category) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const relativePath = path.relative(process.cwd(), filePath);

    // Skip if file is too small or doesn't contain JSX
    if (content.length < 100 || !content.includes('className')) {
      return null;
    }

    const analysis = {
      file: relativePath,
      fileName,
      cards: [],
      containers: [],
      issues: [],
      recommendations: [],
    };

    // Find all card-like elements
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for card patterns
      CARD_PATTERNS.forEach((pattern) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach((match) => {
            const card = {
              line: lineNum,
              className: match,
              alignment: detectAlignment(match),
              responsive: detectResponsiveAlignment(match),
              container: detectContainerType(line),
            };
            analysis.cards.push(card);
          });
        }
      });

      // Check for grid/flex containers
      Object.entries(CONTAINER_PATTERNS).forEach(([type, pattern]) => {
        if (pattern.test(line)) {
          const container = {
            line: lineNum,
            type,
            className: line.match(/className="[^"]*"/)?.[0] || '',
            alignment: detectAlignment(line),
            responsive: detectResponsiveAlignment(line),
          };
          analysis.containers.push(container);
        }
      });
    });

    // Analyze patterns and identify issues
    if (analysis.cards.length > 0) {
      analyzeCardPatterns(analysis, category);
    }

    return analysis.cards.length > 0 || analysis.containers.length > 0 ? analysis : null;
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return null;
  }
}

function detectAlignment(className) {
  const alignments = [];
  
  if (ALIGNMENT_PATTERNS.center.test(className)) alignments.push('center');
  if (ALIGNMENT_PATTERNS.left.test(className)) alignments.push('left');
  if (ALIGNMENT_PATTERNS.justify.test(className)) alignments.push('justify');

  if (alignments.length === 0) return 'none';
  if (alignments.length === 1) return alignments[0];
  return 'mixed';
}

function detectResponsiveAlignment(className) {
  const responsive = {
    mobile: false,
    tablet: false,
    desktop: false,
    changes: [],
  };

  // Check for responsive alignment changes
  const mobileCenter = /\bsm:(mx-auto|text-center|items-center|justify-center)\b/.test(className);
  const tabletCenter = /\bmd:(mx-auto|text-center|items-center|justify-center)\b/.test(className);
  const desktopCenter = /\blg:(mx-auto|text-center|items-center|justify-center)\b/.test(className);

  const mobileLeft = /\bsm:(items-start|justify-start|text-left)\b/.test(className);
  const tabletLeft = /\bmd:(items-start|justify-start|text-left)\b/.test(className);
  const desktopLeft = /\blg:(items-start|justify-start|text-left)\b/.test(className);

  if (mobileCenter || mobileLeft) {
    responsive.mobile = true;
    responsive.changes.push(`sm:${mobileCenter ? 'center' : 'left'}`);
  }
  if (tabletCenter || tabletLeft) {
    responsive.tablet = true;
    responsive.changes.push(`md:${tabletCenter ? 'center' : 'left'}`);
  }
  if (desktopCenter || desktopLeft) {
    responsive.desktop = true;
    responsive.changes.push(`lg:${desktopCenter ? 'center' : 'left'}`);
  }

  return responsive;
}

function detectContainerType(line) {
  if (/\bgrid\b/.test(line)) return 'grid';
  if (/\bflex\b/.test(line)) return 'flex';
  return 'block';
}

function analyzeCardPatterns(analysis, category) {
  const alignments = analysis.cards.map(c => c.alignment);
  const uniqueAlignments = [...new Set(alignments)];

  // Check for inconsistent alignment in same file
  if (uniqueAlignments.length > 2) {
    analysis.issues.push({
      type: 'inconsistent_alignment',
      severity: 'medium',
      message: `Multiple alignment patterns found: ${uniqueAlignments.join(', ')}`,
      suggestion: 'Standardize card alignment within this component',
    });
  }

  // Check for missing responsive alignment in marketing pages
  if (category === 'marketing') {
    const nonResponsiveCards = analysis.cards.filter(c => 
      c.responsive.changes.length === 0 && c.alignment !== 'center'
    );
    
    if (nonResponsiveCards.length > 0) {
      analysis.issues.push({
        type: 'missing_responsive_alignment',
        severity: 'low',
        message: `${nonResponsiveCards.length} cards lack responsive alignment`,
        suggestion: 'Consider center-aligning cards on mobile for better UX',
        lines: nonResponsiveCards.map(c => c.line),
      });
    }
  }

  // Check for center-aligned cards in dashboard (usually should be left-aligned)
  if (category === 'dashboard') {
    const centerCards = analysis.cards.filter(c => c.alignment === 'center');
    
    if (centerCards.length > 0) {
      analysis.issues.push({
        type: 'dashboard_center_alignment',
        severity: 'low',
        message: `${centerCards.length} cards are center-aligned in dashboard`,
        suggestion: 'Dashboard cards typically use left alignment for data density',
        lines: centerCards.map(c => c.line),
      });
    }
  }

  // Update category stats
  const categoryStats = results[category];
  categoryStats.totalCards += analysis.cards.length;
  
  alignments.forEach(alignment => {
    if (categoryStats.alignmentPatterns[alignment] !== undefined) {
      categoryStats.alignmentPatterns[alignment]++;
    }
  });

  const responsiveCount = analysis.cards.filter(c => c.responsive.changes.length > 0).length;
  categoryStats.responsiveCards += responsiveCount;

  if (analysis.issues.length > 0) {
    categoryStats.inconsistencies.push({
      file: analysis.file,
      issues: analysis.issues,
    });
  }
}

function scanDirectory(dir, category) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules, .next, etc.
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          scanDirectory(fullPath, category);
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))) {
        const analysis = analyzeFile(fullPath, category);
        if (analysis) {
          results.summary.totalFilesAnalyzed++;
          
          if (category === 'marketing') {
            results.marketing.pages.push(analysis);
          } else if (category === 'dashboard') {
            results.dashboard.components.push(analysis);
          } else if (category === 'components') {
            if (fullPath.includes('/atoms/')) {
              results.components.atoms.push(analysis);
            } else if (fullPath.includes('/molecules/')) {
              results.components.molecules.push(analysis);
            } else if (fullPath.includes('/organisms/')) {
              results.components.organisms.push(analysis);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('CARD ALIGNMENT AUDIT REPORT');
  console.log('='.repeat(80) + '\n');

  // Summary
  console.log('📊 SUMMARY');
  console.log('-'.repeat(80));
  console.log(`Total Files Analyzed: ${results.summary.totalFilesAnalyzed}`);
  console.log(`Total Cards Found: ${results.marketing.totalCards + results.dashboard.totalCards + results.components.totalCards}`);
  console.log('');

  // Marketing Pages Analysis
  console.log('🎨 MARKETING PAGES');
  console.log('-'.repeat(80));
  console.log(`Pages Analyzed: ${results.marketing.pages.length}`);
  console.log(`Total Cards: ${results.marketing.totalCards}`);
  console.log(`Alignment Distribution:`);
  console.log(`  - Center: ${results.marketing.alignmentPatterns.center} (${Math.round(results.marketing.alignmentPatterns.center / results.marketing.totalCards * 100)}%)`);
  console.log(`  - Left: ${results.marketing.alignmentPatterns.left} (${Math.round(results.marketing.alignmentPatterns.left / results.marketing.totalCards * 100)}%)`);
  console.log(`  - Justify: ${results.marketing.alignmentPatterns.justify} (${Math.round(results.marketing.alignmentPatterns.justify / results.marketing.totalCards * 100)}%)`);
  console.log(`  - Mixed: ${results.marketing.alignmentPatterns.mixed}`);
  console.log(`Responsive Cards: ${results.marketing.responsiveCards} (${Math.round(results.marketing.responsiveCards / results.marketing.totalCards * 100)}%)`);
  console.log('');

  if (results.marketing.inconsistencies.length > 0) {
    console.log('⚠️  MARKETING ISSUES:');
    results.marketing.inconsistencies.forEach(({ file, issues }) => {
      console.log(`\n  ${file}:`);
      issues.forEach(issue => {
        console.log(`    [${issue.severity.toUpperCase()}] ${issue.message}`);
        console.log(`    → ${issue.suggestion}`);
        if (issue.lines) {
          console.log(`    Lines: ${issue.lines.join(', ')}`);
        }
      });
    });
    console.log('');
  }

  // Dashboard Components Analysis
  console.log('📱 DASHBOARD COMPONENTS');
  console.log('-'.repeat(80));
  console.log(`Components Analyzed: ${results.dashboard.components.length}`);
  console.log(`Total Cards: ${results.dashboard.totalCards}`);
  console.log(`Alignment Distribution:`);
  console.log(`  - Center: ${results.dashboard.alignmentPatterns.center} (${Math.round(results.dashboard.alignmentPatterns.center / results.dashboard.totalCards * 100)}%)`);
  console.log(`  - Left: ${results.dashboard.alignmentPatterns.left} (${Math.round(results.dashboard.alignmentPatterns.left / results.dashboard.totalCards * 100)}%)`);
  console.log(`  - Justify: ${results.dashboard.alignmentPatterns.justify} (${Math.round(results.dashboard.alignmentPatterns.justify / results.dashboard.totalCards * 100)}%)`);
  console.log(`  - Mixed: ${results.dashboard.alignmentPatterns.mixed}`);
  console.log(`Responsive Cards: ${results.dashboard.responsiveCards} (${Math.round(results.dashboard.responsiveCards / results.dashboard.totalCards * 100)}%)`);
  console.log('');

  if (results.dashboard.inconsistencies.length > 0) {
    console.log('⚠️  DASHBOARD ISSUES:');
    results.dashboard.inconsistencies.slice(0, 10).forEach(({ file, issues }) => {
      console.log(`\n  ${file}:`);
      issues.forEach(issue => {
        console.log(`    [${issue.severity.toUpperCase()}] ${issue.message}`);
        console.log(`    → ${issue.suggestion}`);
      });
    });
    if (results.dashboard.inconsistencies.length > 10) {
      console.log(`\n  ... and ${results.dashboard.inconsistencies.length - 10} more files with issues`);
    }
    console.log('');
  }

  // Component Library Analysis
  console.log('🧩 COMPONENT LIBRARY');
  console.log('-'.repeat(80));
  console.log(`Atoms: ${results.components.atoms.length}`);
  console.log(`Molecules: ${results.components.molecules.length}`);
  console.log(`Organisms: ${results.components.organisms.length}`);
  console.log(`Total Cards: ${results.components.totalCards}`);
  console.log('');

  // Industry Best Practices
  console.log('✅ INDUSTRY BEST PRACTICES');
  console.log('-'.repeat(80));
  console.log('Marketing Pages:');
  console.log('  ✓ Feature cards: Center-aligned on mobile, grid on desktop');
  console.log('  ✓ Testimonial cards: Center-aligned on all breakpoints');
  console.log('  ✓ Pricing cards: Center-aligned on all breakpoints');
  console.log('  ✓ Logo grids: Center-aligned with flex-wrap');
  console.log('  ✓ CTA cards: Center-aligned on all breakpoints');
  console.log('');
  console.log('Dashboard/Application:');
  console.log('  ✓ Data cards: Left-aligned, stretch to fill container');
  console.log('  ✓ List items: Left-aligned, full width');
  console.log('  ✓ Form cards: Left-aligned, max-width with left margin');
  console.log('  ✓ Stat cards: Grid layout, left-aligned content');
  console.log('  ✓ Table cards: Full width, left-aligned');
  console.log('');

  // Recommendations
  console.log('💡 RECOMMENDATIONS');
  console.log('-'.repeat(80));
  
  const recommendations = [];

  // Marketing recommendations
  if (results.marketing.responsiveCards / results.marketing.totalCards < 0.5) {
    recommendations.push({
      priority: 'HIGH',
      area: 'Marketing',
      issue: 'Low responsive alignment coverage',
      action: 'Add responsive center alignment (mx-auto) to marketing cards on mobile breakpoints',
    });
  }

  // Dashboard recommendations
  if (results.dashboard.alignmentPatterns.center > results.dashboard.totalCards * 0.2) {
    recommendations.push({
      priority: 'MEDIUM',
      area: 'Dashboard',
      issue: 'Too many center-aligned cards',
      action: 'Review dashboard cards and use left alignment for data-heavy components',
    });
  }

  if (recommendations.length > 0) {
    recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. [${rec.priority}] ${rec.area}`);
      console.log(`   Issue: ${rec.issue}`);
      console.log(`   Action: ${rec.action}`);
      console.log('');
    });
  } else {
    console.log('No major issues found. Alignment patterns follow best practices.');
    console.log('');
  }

  // Save detailed report
  const reportPath = path.join(process.cwd(), 'docs', 'CARD_ALIGNMENT_AUDIT_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Detailed report saved to: ${reportPath}`);
  console.log('');
}

// Main execution
console.log('Starting card alignment audit...\n');

// Scan marketing pages
console.log('Scanning marketing pages...');
scanDirectory(path.join(process.cwd(), 'src/app/[locale]/(marketing)'), 'marketing');
scanDirectory(path.join(process.cwd(), 'src/marketing'), 'marketing');

// Scan dashboard components
console.log('Scanning dashboard components...');
scanDirectory(path.join(process.cwd(), 'src/app/[locale]/(dashboard)'), 'dashboard');

// Scan component library
console.log('Scanning component library...');
scanDirectory(path.join(process.cwd(), 'src/components'), 'components');

// Generate report
generateReport();

console.log('✅ Audit complete!\n');
