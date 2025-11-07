const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('='.repeat(80));
console.log('FULL DAMAGE AUDIT - CHECKING WHAT WAS BROKEN');
console.log('='.repeat(80));
console.log('');

const issues = {
  timestamp: new Date().toISOString(),
  totalFiles: 0,
  broken: [],
  categories: {
    statCardRemoved: [],
    syntaxErrors: [],
    missingImports: [],
    brokenProps: [],
    typeErrors: [],
    otherIssues: []
  }
};

// Get all tab files
const tabFiles = execSync(
  'find src/components -name "*-tab.tsx" -type f',
  { encoding: 'utf8', cwd: process.cwd() }
).trim().split('\n').filter(Boolean);

issues.totalFiles = tabFiles.length;

console.log(`Auditing ${tabFiles.length} files for damage...\n`);

tabFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    const fileIssues = [];
    
    // Check 1: StatCard was removed but should exist
    if (content.includes('StatCard') && !content.includes('import { StatCard }')) {
      fileIssues.push({
        type: 'missingImport',
        issue: 'StatCard used but not imported',
        severity: 'HIGH'
      });
      issues.categories.missingImports.push(fileName);
    }
    
    // Check 2: Syntax errors in JSX (double braces, etc)
    const doubleBraceMatches = content.match(/\{\{[^}]+\}\}/g);
    if (doubleBraceMatches && doubleBraceMatches.length > 0) {
      fileIssues.push({
        type: 'syntaxError',
        issue: `Found ${doubleBraceMatches.length} double-brace syntax errors`,
        examples: doubleBraceMatches.slice(0, 3),
        severity: 'CRITICAL'
      });
      issues.categories.syntaxErrors.push(fileName);
    }
    
    // Check 3: Invalid prop values (like {#247} or {1.2K})
    const invalidProps = content.match(/value=\{[#\d,\.]+[KMB]?\}/g);
    if (invalidProps && invalidProps.length > 0) {
      fileIssues.push({
        type: 'brokenProps',
        issue: `Found ${invalidProps.length} invalid prop values`,
        examples: invalidProps.slice(0, 3),
        severity: 'HIGH'
      });
      issues.categories.brokenProps.push(fileName);
    }
    
    // Check 4: Unquoted string props
    const unquotedStrings = content.match(/label=\{[A-Z][a-z]+[^}]*\}(?!")/g);
    if (unquotedStrings && unquotedStrings.length > 0) {
      fileIssues.push({
        type: 'typeError',
        issue: `Found ${unquotedStrings.length} unquoted string props`,
        examples: unquotedStrings.slice(0, 3),
        severity: 'HIGH'
      });
      issues.categories.typeErrors.push(fileName);
    }
    
    // Check 5: Card components that should be StatCard
    const hasInlineCards = content.match(/<Card>\s*<CardHeader[^>]*>\s*<CardTitle[^>]*>.*?<\/CardTitle>/s);
    if (hasInlineCards && content.includes('text-2xl font-bold')) {
      // This looks like a stat card pattern
      const statCardPattern = /<Card>\s*<CardHeader.*?<\/Card>/gs;
      const matches = content.match(statCardPattern);
      if (matches && matches.length >= 3) {
        fileIssues.push({
          type: 'statCardRemoved',
          issue: `Has ${matches.length} inline stat cards that should use StatCard component`,
          severity: 'MEDIUM'
        });
        issues.categories.statCardRemoved.push(fileName);
      }
    }
    
    // Check 6: Missing translations (hardcoded strings in StatCard)
    const hardcodedLabels = content.match(/label=["'][A-Z][^"']*["']/g);
    if (hardcodedLabels && hardcodedLabels.length > 0) {
      const nonTranslated = hardcodedLabels.filter(l => !l.includes('t('));
      if (nonTranslated.length > 0) {
        fileIssues.push({
          type: 'otherIssues',
          issue: `Found ${nonTranslated.length} hardcoded labels (should use t())`,
          examples: nonTranslated.slice(0, 3),
          severity: 'LOW'
        });
        issues.categories.otherIssues.push(fileName);
      }
    }
    
    if (fileIssues.length > 0) {
      issues.broken.push({
        file: fileName,
        path: file,
        issues: fileIssues
      });
    }
    
  } catch (error) {
    issues.broken.push({
      file: path.basename(file),
      path: file,
      issues: [{
        type: 'otherIssues',
        issue: `Failed to read file: ${error.message}`,
        severity: 'CRITICAL'
      }]
    });
  }
});

// Summary
console.log('='.repeat(80));
console.log('DAMAGE ASSESSMENT');
console.log('='.repeat(80));
console.log('');
console.log(`Total Files Audited: ${issues.totalFiles}`);
console.log(`Files With Issues: ${issues.broken.length}`);
console.log('');

if (issues.broken.length === 0) {
  console.log('✅ NO DAMAGE FOUND - All files are clean');
} else {
  console.log('🔴 DAMAGE FOUND - Issues by category:\n');
  
  if (issues.categories.syntaxErrors.length > 0) {
    console.log(`🔴 CRITICAL - Syntax Errors: ${issues.categories.syntaxErrors.length} files`);
    issues.categories.syntaxErrors.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }
  
  if (issues.categories.brokenProps.length > 0) {
    console.log(`🟠 HIGH - Broken Props: ${issues.categories.brokenProps.length} files`);
    issues.categories.brokenProps.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }
  
  if (issues.categories.typeErrors.length > 0) {
    console.log(`🟠 HIGH - Type Errors: ${issues.categories.typeErrors.length} files`);
    issues.categories.typeErrors.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }
  
  if (issues.categories.missingImports.length > 0) {
    console.log(`🟠 HIGH - Missing Imports: ${issues.categories.missingImports.length} files`);
    issues.categories.missingImports.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }
  
  if (issues.categories.statCardRemoved.length > 0) {
    console.log(`🟡 MEDIUM - StatCard Removed: ${issues.categories.statCardRemoved.length} files`);
    issues.categories.statCardRemoved.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }
  
  if (issues.categories.otherIssues.length > 0) {
    console.log(`🟢 LOW - Other Issues: ${issues.categories.otherIssues.length} files`);
    console.log('');
  }
  
  console.log('='.repeat(80));
  console.log('DETAILED BREAKDOWN');
  console.log('='.repeat(80));
  console.log('');
  
  issues.broken.forEach(item => {
    console.log(`\n📁 ${item.file}`);
    console.log(`   Path: ${item.path}`);
    item.issues.forEach(issue => {
      const emoji = issue.severity === 'CRITICAL' ? '🔴' : 
                    issue.severity === 'HIGH' ? '🟠' : 
                    issue.severity === 'MEDIUM' ? '🟡' : '🟢';
      console.log(`   ${emoji} [${issue.severity}] ${issue.type}: ${issue.issue}`);
      if (issue.examples) {
        console.log(`      Examples: ${issue.examples.join(', ')}`);
      }
    });
  });
}

console.log('');
console.log('='.repeat(80));

// Save detailed report
fs.writeFileSync(
  'FULL_DAMAGE_AUDIT_REPORT.json',
  JSON.stringify(issues, null, 2)
);

console.log('📄 Detailed report: FULL_DAMAGE_AUDIT_REPORT.json');
console.log('');

// Exit with error if damage found
process.exit(issues.broken.length > 0 ? 1 : 0);
