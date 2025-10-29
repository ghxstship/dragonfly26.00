#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');

const PATTERNS = {
  dialogContent: {
    pattern: /DialogContent.*className="[^"]*p-\d+/g,
    issue: 'Dialog content with fixed padding',
    fix: 'Use responsive padding: p-4 sm:p-6 md:p-8',
    priority: 'HIGH'
  },
  bulletPoints: {
    pattern: /className="[^"]*flex items-start gap-2/g,
    issue: 'Bullet point list items',
    fix: 'Add min-w-0, flex-shrink-0, break-words',
    priority: 'HIGH'
  },
  gridNoMobile: {
    pattern: /className="[^"]*grid grid-cols-\d+/g,
    issue: 'Grid without mobile-first',
    fix: 'Start with grid-cols-1',
    priority: 'MEDIUM'
  },
  largePadding: {
    pattern: /className="[^"]*p-8/g,
    issue: 'Large padding without responsive',
    fix: 'Use p-4 sm:p-6 md:p-8',
    priority: 'MEDIUM'
  }
};

function findFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !file.startsWith('.')) {
      results = results.concat(findFiles(filePath));
    } else if (file.endsWith('.tsx')) {
      results.push(filePath);
    }
  }
  return results;
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];
  const relativePath = path.relative(COMPONENTS_DIR, filePath);

  for (const [patternName, config] of Object.entries(PATTERNS)) {
    const matches = content.match(config.pattern);
    if (matches && matches.length > 0) {
      issues.push({
        pattern: patternName,
        issue: config.issue,
        fix: config.fix,
        priority: config.priority,
        count: matches.length
      });
    }
  }

  return issues.length > 0 ? { filePath: relativePath, issues } : null;
}

function main() {
  console.log('Scanning components...\n');
  const files = findFiles(COMPONENTS_DIR);
  const results = files.map(auditFile).filter(Boolean);
  
  const summary = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  results.forEach(r => r.issues.forEach(i => summary[i.priority]++));
  
  console.log(`Files with issues: ${results.length}`);
  console.log(`HIGH: ${summary.HIGH}, MEDIUM: ${summary.MEDIUM}, LOW: ${summary.LOW}\n`);
  
  const reportPath = path.join(__dirname, '../docs/audits/RESPONSIVE_UX_ATOMIC_AUDIT.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({ results, summary }, null, 2));
  
  console.log(`Report saved to: ${reportPath}`);
}

main();
