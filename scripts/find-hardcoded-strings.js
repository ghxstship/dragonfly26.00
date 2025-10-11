const fs = require('fs');
const path = require('path');

// Directories to scan
const dirs = [
  'src/components/views',
  'src/components/admin', 
  'src/components/shared',
  'src/components/goals',
  'src/components/reports',
  'src/components/automations',
  'src/components/plugins',
  'src/components/realtime',
  'src/components/mobile',
  'src/components/api-tokens',
];

// Patterns to look for (strings that are likely hardcoded text)
const patterns = [
  // String literals with spaces (likely UI text)
  /['"]([A-Z][a-z]+(?:\s+[a-z]+)+)['"]/g,
  // Single capitalized words in quotes
  /['"]([A-Z][a-z]{2,})['"]/g,
  // Placeholder text patterns
  /placeholder=['"]([^'"]+)['"]/g,
  // Title attributes
  /title=['"]([^'"]+)['"]/g,
  // ARIA labels
  /aria-label=['"]([^'"]+)['"]/g,
];

// Words/patterns to ignore (not UI text)
const ignorePatterns = [
  /className/,
  /^[a-z]+$/,  // all lowercase
  /^\d+/,      // starts with number
  /^#/,        // color codes
  /^\/\//,     // URLs
  /^http/,     // URLs
  /\w+\.\w+/,  // file extensions or object properties
  /^\w+$/,     // single words (often keys/IDs)
];

let findings = [];

function shouldIgnore(text) {
  // Ignore if matches any ignore pattern
  if (ignorePatterns.some(pattern => pattern.test(text))) {
    return true;
  }
  
  // Ignore common non-UI strings
  const commonIgnores = [
    'use client', 'use server', 'utf-8', 'en-US',
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  
  return commonIgnores.includes(text);
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = filePath.replace(path.join(__dirname, '..'), '');
  
  // Check if file has useTranslations
  const hasTranslations = content.includes('useTranslations');
  
  let fileFindings = [];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1];
      
      // Skip if should ignore
      if (shouldIgnore(text)) continue;
      
      // Skip if it's already using t() function
      const beforeMatch = content.substring(Math.max(0, match.index - 10), match.index);
      if (beforeMatch.includes('t(')) continue;
      
      // Skip if it's a translation key itself (contains dot)
      if (text.includes('.')) continue;
      
      // Get line number
      const lines = content.substring(0, match.index).split('\n');
      const lineNum = lines.length;
      const lineText = content.split('\n')[lineNum - 1].trim();
      
      fileFindings.push({
        file: relativePath,
        line: lineNum,
        text: text,
        context: lineText.substring(0, 100)
      });
    }
  });
  
  return fileFindings;
}

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Directory not found: ${dir}`);
    return;
  }
  
  const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.tsx'));
  
  files.forEach(file => {
    const filePath = path.join(fullPath, file);
    const fileFindings = scanFile(filePath);
    findings = findings.concat(fileFindings);
  });
});

// Group by file
const grouped = {};
findings.forEach(finding => {
  if (!grouped[finding.file]) {
    grouped[finding.file] = [];
  }
  grouped[finding.file].push(finding);
});

// Output results
console.log(`\n🔍 Found ${findings.length} potential hardcoded strings\n`);

Object.keys(grouped).sort().forEach(file => {
  console.log(`\n📄 ${file}`);
  grouped[file].forEach(f => {
    console.log(`   Line ${f.line}: "${f.text}"`);
  });
});

// Save to file for review
fs.writeFileSync(
  path.join(__dirname, '..', 'hardcoded-strings-report.txt'),
  JSON.stringify(grouped, null, 2)
);

console.log(`\n✅ Report saved to hardcoded-strings-report.txt`);
console.log(`\n📊 Summary by file:`);
Object.keys(grouped).forEach(file => {
  console.log(`   ${file}: ${grouped[file].length} strings`);
});
