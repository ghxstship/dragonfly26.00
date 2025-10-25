#!/usr/bin/env node

/**
 * Analyze Real Responsive Issues (Excluding Mobile-First Patterns)
 * Identifies the 289 real issues that need manual remediation
 */

const fs = require('fs');
const path = require('path');

// Read audit results
const auditPath = path.join(__dirname, '../docs/RESPONSIVE_DESIGN_AUDIT.json');
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));

// Categories to fix (exclude Mobile-First as those are intentional)
const REAL_ISSUE_CATEGORIES = [
  'Layout Responsiveness',
  'Overflow Handling',
  'Visibility Controls',
  'Spacing Responsiveness'
];

// Analyze issues
const realIssues = {
  byCategory: {},
  byFile: [],
  bySeverity: { high: [], medium: [], low: [] },
  total: 0
};

// Initialize category counters
REAL_ISSUE_CATEGORIES.forEach(cat => {
  realIssues.byCategory[cat] = { count: 0, files: [] };
});

// Process each file
audit.detailedResults.forEach(result => {
  const fileIssues = {
    file: result.file,
    issues: [],
    totalIssues: 0,
    score: result.score
  };

  result.issues.forEach(issue => {
    if (REAL_ISSUE_CATEGORIES.includes(issue.category)) {
      fileIssues.issues.push(issue);
      fileIssues.totalIssues += issue.count;
      
      realIssues.byCategory[issue.category].count += issue.count;
      realIssues.byCategory[issue.category].files.push(result.file);
      realIssues.total += issue.count;

      // Categorize by severity
      const severity = issue.severity || 'medium';
      realIssues.bySeverity[severity].push({
        file: result.file,
        category: issue.category,
        count: issue.count
      });
    }
  });

  if (fileIssues.totalIssues > 0) {
    realIssues.byFile.push(fileIssues);
  }
});

// Sort files by issue count (highest first)
realIssues.byFile.sort((a, b) => b.totalIssues - a.totalIssues);

// Generate report
console.log('\n' + '='.repeat(80));
console.log('REAL RESPONSIVE ISSUES ANALYSIS (Excluding Mobile-First Patterns)');
console.log('='.repeat(80));

console.log('\n📊 SUMMARY');
console.log('-'.repeat(80));
console.log(`Total Real Issues: ${realIssues.total}`);
console.log(`Files Affected: ${realIssues.byFile.length}`);
console.log(`Average Issues per File: ${(realIssues.total / realIssues.byFile.length).toFixed(1)}`);

console.log('\n📋 BY CATEGORY');
console.log('-'.repeat(80));
Object.entries(realIssues.byCategory).forEach(([category, data]) => {
  if (data.count > 0) {
    console.log(`${category}: ${data.count} issues in ${new Set(data.files).size} files`);
  }
});

console.log('\n🎯 BY SEVERITY');
console.log('-'.repeat(80));
['high', 'medium', 'low'].forEach(severity => {
  const issues = realIssues.bySeverity[severity];
  if (issues.length > 0) {
    const count = issues.reduce((sum, i) => sum + i.count, 0);
    console.log(`${severity.toUpperCase()}: ${count} issues`);
  }
});

console.log('\n🔥 TOP 20 FILES WITH MOST ISSUES');
console.log('-'.repeat(80));
realIssues.byFile.slice(0, 20).forEach((file, index) => {
  console.log(`${index + 1}. ${file.file}`);
  console.log(`   Total Issues: ${file.totalIssues} | Score: ${file.score}%`);
  file.issues.forEach(issue => {
    console.log(`   - ${issue.category}: ${issue.count} (${issue.severity})`);
  });
  console.log();
});

console.log('\n📁 ALL FILES BY CATEGORY');
console.log('-'.repeat(80));

// Group by category for detailed analysis
REAL_ISSUE_CATEGORIES.forEach(category => {
  const categoryFiles = realIssues.byFile.filter(f => 
    f.issues.some(i => i.category === category)
  );
  
  if (categoryFiles.length > 0) {
    console.log(`\n${category.toUpperCase()} (${realIssues.byCategory[category].count} issues in ${categoryFiles.length} files)`);
    console.log('-'.repeat(80));
    
    categoryFiles.forEach(file => {
      const categoryIssue = file.issues.find(i => i.category === category);
      console.log(`  ${file.file}: ${categoryIssue.count} issues`);
    });
  }
});

// Save detailed report
const reportPath = path.join(__dirname, '../docs/RESPONSIVE_REAL_ISSUES_ANALYSIS.json');
fs.writeFileSync(reportPath, JSON.stringify(realIssues, null, 2));
console.log(`\n✅ Detailed analysis saved to: ${reportPath}`);

// Generate fix priority list
const priorityList = {
  critical: realIssues.byFile.filter(f => f.totalIssues >= 5),
  high: realIssues.byFile.filter(f => f.totalIssues >= 3 && f.totalIssues < 5),
  medium: realIssues.byFile.filter(f => f.totalIssues >= 2 && f.totalIssues < 3),
  low: realIssues.byFile.filter(f => f.totalIssues === 1)
};

console.log('\n🎯 FIX PRIORITY BREAKDOWN');
console.log('-'.repeat(80));
console.log(`CRITICAL (5+ issues): ${priorityList.critical.length} files`);
console.log(`HIGH (3-4 issues): ${priorityList.high.length} files`);
console.log(`MEDIUM (2 issues): ${priorityList.medium.length} files`);
console.log(`LOW (1 issue): ${priorityList.low.length} files`);

// Save priority list
const priorityPath = path.join(__dirname, '../docs/RESPONSIVE_FIX_PRIORITY.json');
fs.writeFileSync(priorityPath, JSON.stringify(priorityList, null, 2));
console.log(`\n✅ Priority list saved to: ${priorityPath}`);

console.log('\n' + '='.repeat(80));
console.log('NEXT STEPS:');
console.log('1. Start with CRITICAL files (5+ issues each)');
console.log('2. Focus on Layout Responsiveness issues first');
console.log('3. Then tackle Overflow Handling issues');
console.log('4. Finally address Visibility and Spacing issues');
console.log('='.repeat(80) + '\n');
