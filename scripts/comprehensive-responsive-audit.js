#!/usr/bin/env node

/**
 * Comprehensive Responsive Design Audit
 * Audits all components for responsive design compliance across breakpoints
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const MARKETING_DIR = path.join(__dirname, '../src/marketing');
const APP_DIR = path.join(__dirname, '../src/app');

// Breakpoints to check
const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', '2xl'];

// Responsive patterns to audit
const RESPONSIVE_CHECKS = {
  layout: {
    name: 'Layout Responsiveness',
    patterns: [
      { regex: /className="[^"]*\bgrid\b[^"]*"/g, needsVariant: /\b(sm:|md:|lg:|xl:|2xl:)grid-cols-/ },
      { regex: /className="[^"]*\bflex\b[^"]*"/g, needsVariant: /\b(sm:|md:|lg:|xl:|2xl:)flex-/ },
      { regex: /className="[^"]*\bw-\[\d+/g, needsVariant: /\b(sm:|md:|lg:|xl:|2xl:)w-/ },
    ]
  },
  typography: {
    name: 'Typography Responsiveness',
    patterns: [
      { regex: /className="[^"]*\btext-[4-9]xl\b[^"]*"/g, needsVariant: /\b(sm:|md:|lg:|xl:|2xl:)text-/ },
      { regex: /className="[^"]*\btext-\dxl\b[^"]*"/g, needsVariant: /\b(sm:|md:|lg:|xl:|2xl:)text-/ },
    ]
  },
  spacing: {
    name: 'Spacing Responsiveness',
    patterns: [
      { regex: /className="[^"]*\bp-\d{2,}\b[^"]*"/g, needsVariant: /\b(sm:|md:|lg:|xl:|2xl:)p-/ },
      { regex: /className="[^"]*\bm-\d{2,}\b[^"]*"/g, needsVariant: /\b(sm:|md:|lg:|xl:|2xl:)m-/ },
      { regex: /className="[^"]*\bgap-\d{2,}\b[^"]*"/g, needsVariant: /\b(sm:|md:|lg:|xl:|2xl:)gap-/ },
    ]
  },
  visibility: {
    name: 'Visibility Controls',
    patterns: [
      { regex: /className="[^"]*\bhidden\b[^"]*"/g, needsVariant: /\b(sm:|md:|lg:|xl:|2xl:)block\b|\b(sm:|md:|lg:|xl:|2xl:)flex\b/ },
    ]
  }
};

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  
  const results = {
    file: relativePath,
    issues: [],
    score: 100,
    hasResponsive: false
  };

  // Check if file has any responsive classes
  results.hasResponsive = BREAKPOINTS.some(bp => content.includes(`${bp}:`));

  // Check each category
  Object.entries(RESPONSIVE_CHECKS).forEach(([category, config]) => {
    config.patterns.forEach(({ regex, needsVariant }) => {
      const matches = content.match(regex) || [];
      
      if (matches.length > 0) {
        const hasVariant = needsVariant.test(content);
        
        if (!hasVariant) {
          results.issues.push({
            category: config.name,
            count: matches.length,
            severity: 'medium'
          });
          results.score -= 10;
        }
      }
    });
  });

  // Check for mobile-first approach
  const hasMobileFirst = /className="[^"]*\b(block|flex|grid)\b[^"]*\b(md:|lg:)hidden\b/.test(content);
  if (!hasMobileFirst && content.includes('hidden')) {
    results.issues.push({
      category: 'Mobile-First',
      count: 1,
      severity: 'low'
    });
    results.score -= 5;
  }

  // Check for overflow handling
  const hasOverflow = /overflow-x-auto|overflow-y-auto|overflow-scroll/.test(content);
  const hasLongContent = /className="[^"]*\bw-full\b[^"]*"/.test(content);
  
  if (hasLongContent && !hasOverflow) {
    results.issues.push({
      category: 'Overflow Handling',
      count: 1,
      severity: 'low'
    });
    results.score -= 5;
  }

  results.score = Math.max(0, results.score);
  
  return results;
}

function walkDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (!file.startsWith('.') && file !== 'node_modules') {
        walkDirectory(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function generateReport(results) {
  const totalFiles = results.length;
  const filesWithIssues = results.filter(r => r.issues.length > 0).length;
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / totalFiles;
  
  const issuesByCategory = {};
  results.forEach(r => {
    r.issues.forEach(issue => {
      if (!issuesByCategory[issue.category]) {
        issuesByCategory[issue.category] = 0;
      }
      issuesByCategory[issue.category] += issue.count;
    });
  });

  return {
    totalFiles,
    filesWithIssues,
    avgScore: avgScore.toFixed(1),
    issuesByCategory,
    grade: avgScore >= 95 ? 'A+' : avgScore >= 90 ? 'A' : avgScore >= 85 ? 'B+' : avgScore >= 80 ? 'B' : avgScore >= 75 ? 'C+' : avgScore >= 70 ? 'C' : 'D'
  };
}

function main() {
  console.log('📱 Comprehensive Responsive Design Audit\n');
  console.log('='.repeat(70));

  // Audit components
  console.log('\n📁 Auditing Components...');
  const componentFiles = walkDirectory(COMPONENTS_DIR);
  const componentResults = componentFiles.map(analyzeFile);

  // Audit marketing
  console.log('📁 Auditing Marketing Pages...');
  const marketingFiles = walkDirectory(MARKETING_DIR);
  const marketingResults = marketingFiles.map(analyzeFile);

  // Audit app pages
  console.log('📁 Auditing App Pages...');
  const appFiles = walkDirectory(APP_DIR);
  const appResults = appFiles.map(analyzeFile);

  // Combine results
  const allResults = [...componentResults, ...marketingResults, ...appResults];
  
  // Generate reports
  console.log('\n' + '='.repeat(70));
  console.log('📊 AUDIT RESULTS\n');

  const componentsReport = generateReport(componentResults);
  const marketingReport = generateReport(marketingResults);
  const appReport = generateReport(appResults);
  const overallReport = generateReport(allResults);

  console.log(`📦 Components: ${componentsReport.avgScore}% (${componentsReport.grade}) - ${componentsReport.filesWithIssues}/${componentsReport.totalFiles} files need attention`);
  console.log(`🎨 Marketing: ${marketingReport.avgScore}% (${marketingReport.grade}) - ${marketingReport.filesWithIssues}/${marketingReport.totalFiles} files need attention`);
  console.log(`📄 App Pages: ${appReport.avgScore}% (${appReport.grade}) - ${appReport.filesWithIssues}/${appReport.totalFiles} files need attention`);
  console.log(`\n🎯 Overall: ${overallReport.avgScore}% (${overallReport.grade}) - ${overallReport.filesWithIssues}/${overallReport.totalFiles} files need attention`);

  // Issue breakdown
  console.log('\n📋 Issues by Category:\n');
  Object.entries(overallReport.issuesByCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`   ${category}: ${count} occurrences`);
    });

  // Top files needing attention
  console.log('\n⚠️  Top 10 Files Needing Attention:\n');
  allResults
    .filter(r => r.issues.length > 0)
    .sort((a, b) => a.score - b.score)
    .slice(0, 10)
    .forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.file} (${r.score}%)`);
      r.issues.forEach(issue => {
        console.log(`      - ${issue.category}: ${issue.count} instances`);
      });
    });

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:\n');
  
  if (overallReport.avgScore >= 95) {
    console.log('   ✅ Excellent responsive design! Minor improvements only.');
  } else if (overallReport.avgScore >= 85) {
    console.log('   ✓ Good responsive design. Address remaining issues for perfection.');
  } else if (overallReport.avgScore >= 75) {
    console.log('   ⚠️  Moderate responsive design. Focus on layout and typography.');
  } else {
    console.log('   ❌ Needs significant responsive improvements. Priority fixes required.');
  }

  if (overallReport.issuesByCategory['Layout Responsiveness']) {
    console.log('   - Add responsive grid/flex variants (sm:, md:, lg:)');
  }
  if (overallReport.issuesByCategory['Typography Responsiveness']) {
    console.log('   - Add responsive text size variants for large text');
  }
  if (overallReport.issuesByCategory['Spacing Responsiveness']) {
    console.log('   - Add responsive spacing variants for large padding/margins');
  }

  console.log('\n' + '='.repeat(70));
  console.log(`\n${overallReport.avgScore >= 90 ? '✅' : '⚠️'}  Audit complete! Grade: ${overallReport.grade} (${overallReport.avgScore}%)\n`);

  // Save detailed report
  const reportPath = path.join(__dirname, '../docs/RESPONSIVE_DESIGN_AUDIT.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    overall: overallReport,
    components: componentsReport,
    marketing: marketingReport,
    app: appReport,
    detailedResults: allResults.filter(r => r.issues.length > 0)
  }, null, 2));

  console.log(`📄 Detailed report saved to: docs/RESPONSIVE_DESIGN_AUDIT.json\n`);
}

main();
