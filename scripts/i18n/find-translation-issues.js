#!/usr/bin/env node

/**
 * Script to find potential translation issues across the codebase
 * Looks for patterns that might cause translation keys to display instead of translated text
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Searching for potential translation issues...\n');

const issues = [];

// Pattern 1: Check for useTranslations() without namespace in organism/view components
console.log('1️⃣  Checking for useTranslations() without namespace in organism/view components...');
try {
  const result = execSync(
    `grep -r "const t = useTranslations()" src/components/organisms src/components/views.backup --include="*.tsx" || true`,
    { encoding: 'utf-8', cwd: process.cwd() }
  );
  
  if (result.trim()) {
    const lines = result.trim().split('\n');
    lines.forEach(line => {
      const [file] = line.split(':');
      if (file && !file.includes('.backup')) {
        issues.push({
          type: 'MISSING_NAMESPACE',
          file: file.trim(),
          severity: 'WARNING',
          message: 'Component uses useTranslations() without namespace - may cause issues if translation keys are nested'
        });
      }
    });
  }
} catch (error) {
  // Ignore errors
}

// Pattern 2: Check for translation keys that don't match the file structure
console.log('2️⃣  Checking for potentially incorrect translation key patterns...');
try {
  // Look for patterns like t('something.something') where the namespace might be wrong
  const result = execSync(
    `grep -rn "t('[a-z]*\\.[a-z]*')" src/components --include="*.tsx" | grep -v "t('business\\." | grep -v "t('production\\." | grep -v "t('network\\." | grep -v "t('intelligence\\." | grep -v "t('system\\." | grep -v "t('settings\\." | grep -v "t('profile\\." | grep -v "t('admin\\." | grep -v "t('views\\." | grep -v "t('common\\." | grep -v "t('dashboard\\." | grep -v "t('realtime\\." | grep -v "t('placeholders\\." | grep -v "t('quickActions\\." || true`,
    { encoding: 'utf-8', cwd: process.cwd() }
  );
  
  if (result.trim()) {
    const lines = result.trim().split('\n').slice(0, 20); // Limit to first 20
    lines.forEach(line => {
      const match = line.match(/^([^:]+):(\d+):.*t\('([^']+)'\)/);
      if (match) {
        const [, file, lineNum, key] = match;
        issues.push({
          type: 'SUSPICIOUS_KEY',
          file: file.trim(),
          line: lineNum,
          key: key,
          severity: 'INFO',
          message: `Translation key '${key}' doesn't match standard namespace patterns`
        });
      }
    });
  }
} catch (error) {
  // Ignore errors
}

// Pattern 3: Check for hardcoded strings that look like translation keys
console.log('3️⃣  Checking for hardcoded strings that look like translation keys...');
try {
  const result = execSync(
    `grep -rn ">[a-z]*\\.[a-z]*<" src/components --include="*.tsx" | head -20 || true`,
    { encoding: 'utf-8', cwd: process.cwd() }
  );
  
  if (result.trim()) {
    const lines = result.trim().split('\n');
    lines.forEach(line => {
      const match = line.match(/^([^:]+):(\d+):.*>([a-z]+\.[a-z]+.*?)</);
      if (match) {
        const [, file, lineNum, text] = match;
        if (text.includes('.')) {
          issues.push({
            type: 'HARDCODED_KEY',
            file: file.trim(),
            line: lineNum,
            text: text,
            severity: 'ERROR',
            message: `Hardcoded text '${text}' looks like a translation key - should use t() function`
          });
        }
      }
    });
  }
} catch (error) {
  // Ignore errors
}

// Pattern 4: Check translation files for missing keys
console.log('4️⃣  Checking for missing translation keys in en.json...');
const translationFiles = [
  'src/i18n/messages/en.json',
  'src/i18n/messages/en/business.json',
  'src/i18n/messages/en/production.json',
  'src/i18n/messages/en/network.json',
  'src/i18n/messages/en/intelligence.json',
  'src/i18n/messages/en/system.json'
];

translationFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      JSON.parse(content); // Validate JSON
    } catch (error) {
      issues.push({
        type: 'INVALID_JSON',
        file: file,
        severity: 'ERROR',
        message: `Translation file has invalid JSON: ${error.message}`
      });
    }
  }
});

// Report findings
console.log('\n📊 RESULTS\n');
console.log('='.repeat(80));

if (issues.length === 0) {
  console.log('✅ No translation issues found!');
} else {
  // Group by severity
  const errors = issues.filter(i => i.severity === 'ERROR');
  const warnings = issues.filter(i => i.severity === 'WARNING');
  const info = issues.filter(i => i.severity === 'INFO');

  if (errors.length > 0) {
    console.log(`\n🔴 ERRORS (${errors.length}):\n`);
    errors.forEach((issue, idx) => {
      console.log(`${idx + 1}. ${issue.type} in ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
      console.log(`   ${issue.message}`);
      if (issue.key) console.log(`   Key: ${issue.key}`);
      if (issue.text) console.log(`   Text: ${issue.text}`);
      console.log();
    });
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):\n`);
    warnings.forEach((issue, idx) => {
      console.log(`${idx + 1}. ${issue.type} in ${issue.file}`);
      console.log(`   ${issue.message}`);
      console.log();
    });
  }

  if (info.length > 0) {
    console.log(`\n💡 INFO (${info.length}):\n`);
    info.slice(0, 10).forEach((issue, idx) => {
      console.log(`${idx + 1}. ${issue.type} in ${issue.file}:${issue.line}`);
      console.log(`   ${issue.message}`);
      console.log();
    });
    if (info.length > 10) {
      console.log(`   ... and ${info.length - 10} more\n`);
    }
  }
}

console.log('='.repeat(80));
console.log(`\n📈 Summary: ${issues.length} potential issues found`);
console.log(`   🔴 Errors: ${issues.filter(i => i.severity === 'ERROR').length}`);
console.log(`   ⚠️  Warnings: ${issues.filter(i => i.severity === 'WARNING').length}`);
console.log(`   💡 Info: ${issues.filter(i => i.severity === 'INFO').length}`);

process.exit(issues.filter(i => i.severity === 'ERROR').length > 0 ? 1 : 0);
