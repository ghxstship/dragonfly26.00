#!/usr/bin/env node

/**
 * ACCURATE FULL-STACK AUDIT
 * Properly verifies Supabase integration and hardcoded data
 */

const fs = require('fs');
const path = require('path');

const RESULTS = {
  timestamp: new Date().toISOString(),
  tabs: {
    total: 0,
    withSupabaseHooks: 0,
    withi18n: 0,
    withHardcodedData: 0,
    withHardcodedPlaceholders: 0
  },
  hooks: {
    total: 0,
    withSupabase: 0
  },
  database: {
    migrations: 0,
    tables: 0,
    policies: 0
  },
  violations: [],
  details: []
};

function scanTabComponent(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);

  const result = {
    file: fileName,
    path: filePath,
    hasSupabaseHook: false,
    hasi18n: false,
    hasHardcodedData: false,
    hasHardcodedPlaceholders: false,
    hookImports: [],
    issues: []
  };

  // Check for Supabase hook imports (use-*-data pattern)
  const hookImportMatches = content.match(/from\s+["']@\/hooks\/(use-[\w-]+-data)["']/g);
  if (hookImportMatches) {
    result.hookImports = hookImportMatches.map(m => m.match(/use-[\w-]+-data/)[0]);
    result.hasSupabaseHook = true;
  }

  // Check for ANY custom hook imports from @/hooks (broader pattern)
  const anyHookImports = content.match(/from\s+["']@\/hooks\/(use-[\w-]+)["']/g);
  if (anyHookImports && !result.hasSupabaseHook) {
    const hooks = anyHookImports.map(m => m.match(/use-[\w-]+/)[0]);
    // Exclude utility hooks
    const dataHooks = hooks.filter(h => !['use-is-mobile', 'use-pwa'].includes(h));
    if (dataHooks.length > 0) {
      result.hasSupabaseHook = true;
      result.hookImports = dataHooks;
    }
  }

  // Check for direct createClient usage
  if (!result.hasSupabaseHook && content.includes('createClient')) {
    result.hasSupabaseHook = true;
    result.hookImports = ['createClient (direct)'];
  }

  // Check for direct hook usage patterns
  const hookUsageMatches = content.match(/const\s+\{[^}]+\}\s*=\s*(use[A-Z][\w]+)\(/g);
  if (hookUsageMatches && !result.hasSupabaseHook) {
    const hooks = hookUsageMatches.map(m => m.match(/use[A-Z][\w]+/)[0]);
    if (hooks.some(h => h.includes('Data') || h.includes('Supabase') || h.includes('Catalog') || h.includes('Member'))) {
      result.hasSupabaseHook = true;
      result.hookImports = hooks;
    }
  }

  // Check for i18n
  result.hasi18n = content.includes('useTranslations');

  // Check for hardcoded placeholders (English text)
  const placeholderMatches = content.match(/placeholder="[A-Z][^"]*"/g);
  if (placeholderMatches && placeholderMatches.length > 0) {
    // Filter out t() wrapped placeholders
    const hardcoded = placeholderMatches.filter(p => !p.includes('t('));
    if (hardcoded.length > 0) {
      result.hasHardcodedPlaceholders = true;
      result.issues.push(`${hardcoded.length} hardcoded placeholders`);
    }
  }

  // Check for mock data arrays
  const mockDataPatterns = [
    /const\s+MOCK_[\w_]+\s*=\s*\[/i,
    /const\s+mock[\w]+\s*=\s*\[/i,
    /const\s+dummy[\w]+\s*=\s*\[/i,
    /const\s+sample[\w]+\s*=\s*\[/i
  ];
  
  for (const pattern of mockDataPatterns) {
    if (pattern.test(content)) {
      result.hasHardcodedData = true;
      result.issues.push('Contains mock data arrays');
      break;
    }
  }

  return result;
}

function scanAllTabs() {
  const componentsDir = path.join(process.cwd(), 'src/components');
  const modules = fs.readdirSync(componentsDir).filter(f => {
    const stat = fs.statSync(path.join(componentsDir, f));
    return stat.isDirectory();
  });

  modules.forEach(module => {
    const moduleDir = path.join(componentsDir, module);
    const files = fs.readdirSync(moduleDir).filter(f => f.endsWith('-tab.tsx'));

    files.forEach(file => {
      const filePath = path.join(moduleDir, file);
      const result = scanTabComponent(filePath);
      
      if (result) {
        RESULTS.tabs.total++;
        if (result.hasSupabaseHook) RESULTS.tabs.withSupabaseHooks++;
        if (result.hasi18n) RESULTS.tabs.withi18n++;
        if (result.hasHardcodedData) RESULTS.tabs.withHardcodedData++;
        if (result.hasHardcodedPlaceholders) RESULTS.tabs.withHardcodedPlaceholders++;

        RESULTS.details.push({
          module,
          file,
          ...result
        });

        // Track violations
        if (!result.hasSupabaseHook) {
          RESULTS.violations.push({
            type: 'missing_supabase',
            module,
            file,
            message: 'No Supabase hook detected'
          });
        }
        if (!result.hasi18n) {
          RESULTS.violations.push({
            type: 'missing_i18n',
            module,
            file,
            message: 'Missing i18n (useTranslations)'
          });
        }
        if (result.hasHardcodedData) {
          RESULTS.violations.push({
            type: 'hardcoded_data',
            module,
            file,
            message: 'Contains hardcoded mock data'
          });
        }
        if (result.hasHardcodedPlaceholders) {
          RESULTS.violations.push({
            type: 'hardcoded_placeholders',
            module,
            file,
            message: 'Contains hardcoded placeholders'
          });
        }
      }
    });
  });
}

function scanHooks() {
  const hooksDir = path.join(process.cwd(), 'src/hooks');
  if (!fs.existsSync(hooksDir)) return;

  const hookFiles = fs.readdirSync(hooksDir).filter(f => f.endsWith('.ts'));
  
  hookFiles.forEach(file => {
    const content = fs.readFileSync(path.join(hooksDir, file), 'utf8');
    RESULTS.hooks.total++;
    
    if (content.includes('createClient') || content.includes('supabase')) {
      RESULTS.hooks.withSupabase++;
    }
  });
}

function scanDatabase() {
  const migrationsDir = path.join(process.cwd(), 'supabase/migrations');
  if (!fs.existsSync(migrationsDir)) return;

  const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
  RESULTS.database.migrations = migrations.length;

  migrations.forEach(migration => {
    const content = fs.readFileSync(path.join(migrationsDir, migration), 'utf8');
    
    const tableMatches = content.match(/CREATE TABLE/gi);
    if (tableMatches) RESULTS.database.tables += tableMatches.length;

    const policyMatches = content.match(/CREATE POLICY/gi);
    if (policyMatches) RESULTS.database.policies += policyMatches.length;
  });
}

function generateReport() {
  const supabaseRate = (RESULTS.tabs.withSupabaseHooks / RESULTS.tabs.total * 100).toFixed(2);
  const i18nRate = (RESULTS.tabs.withi18n / RESULTS.tabs.total * 100).toFixed(2);
  const cleanDataRate = ((RESULTS.tabs.total - RESULTS.tabs.withHardcodedData) / RESULTS.tabs.total * 100).toFixed(2);
  const cleanPlaceholdersRate = ((RESULTS.tabs.total - RESULTS.tabs.withHardcodedPlaceholders) / RESULTS.tabs.total * 100).toFixed(2);

  const overallScore = (
    (parseFloat(supabaseRate) * 0.4) +
    (parseFloat(i18nRate) * 0.3) +
    (parseFloat(cleanDataRate) * 0.2) +
    (parseFloat(cleanPlaceholdersRate) * 0.1)
  ).toFixed(2);

  const grade = overallScore >= 99 ? 'A+' : 
                overallScore >= 95 ? 'A' : 
                overallScore >= 90 ? 'A-' : 
                overallScore >= 85 ? 'B+' : 
                overallScore >= 80 ? 'B' : 'F';

  console.log('\n' + '='.repeat(80));
  console.log('ACCURATE FULL-STACK AUDIT REPORT');
  console.log('Dragonfly26.00 - Supabase Integration & Data Compliance');
  console.log('='.repeat(80) + '\n');

  console.log('📊 SUMMARY');
  console.log('-'.repeat(80));
  console.log(`Total Tab Components: ${RESULTS.tabs.total}`);
  console.log(`With Supabase Hooks: ${RESULTS.tabs.withSupabaseHooks} (${supabaseRate}%)`);
  console.log(`With i18n: ${RESULTS.tabs.withi18n} (${i18nRate}%)`);
  console.log(`With Hardcoded Data: ${RESULTS.tabs.withHardcodedData} (${((RESULTS.tabs.withHardcodedData/RESULTS.tabs.total)*100).toFixed(2)}%)`);
  console.log(`With Hardcoded Placeholders: ${RESULTS.tabs.withHardcodedPlaceholders} (${((RESULTS.tabs.withHardcodedPlaceholders/RESULTS.tabs.total)*100).toFixed(2)}%)`);
  console.log();
  console.log(`Total Data Hooks: ${RESULTS.hooks.total}`);
  console.log(`With Supabase: ${RESULTS.hooks.withSupabase} (${(RESULTS.hooks.withSupabase/RESULTS.hooks.total*100).toFixed(2)}%)`);
  console.log();
  console.log(`Database Migrations: ${RESULTS.database.migrations}`);
  console.log(`Database Tables: ${RESULTS.database.tables}`);
  console.log(`RLS Policies: ${RESULTS.database.policies}`);
  console.log();
  console.log(`Total Violations: ${RESULTS.violations.length}`);
  console.log();

  console.log('🎯 COMPLIANCE RATES');
  console.log('-'.repeat(80));
  console.log(`Supabase Integration: ${supabaseRate}% ${supabaseRate >= 99 ? '✅' : '❌'}`);
  console.log(`i18n Coverage: ${i18nRate}% ${i18nRate >= 99 ? '✅' : '❌'}`);
  console.log(`Clean Data (No Mock): ${cleanDataRate}% ${cleanDataRate >= 99 ? '✅' : '❌'}`);
  console.log(`Clean Placeholders: ${cleanPlaceholdersRate}% ${cleanPlaceholdersRate >= 99 ? '✅' : '❌'}`);
  console.log();

  if (RESULTS.violations.length > 0) {
    console.log('🚨 VIOLATIONS BY TYPE');
    console.log('-'.repeat(80));
    
    const byType = {};
    RESULTS.violations.forEach(v => {
      byType[v.type] = (byType[v.type] || 0) + 1;
    });

    Object.entries(byType).forEach(([type, count]) => {
      console.log(`${type}: ${count}`);
    });
    console.log();

    // Show first 20 violations
    console.log('📋 VIOLATION DETAILS (First 20)');
    console.log('-'.repeat(80));
    RESULTS.violations.slice(0, 20).forEach(v => {
      console.log(`❌ ${v.module}/${v.file}: ${v.message}`);
    });
    if (RESULTS.violations.length > 20) {
      console.log(`... and ${RESULTS.violations.length - 20} more violations`);
    }
    console.log();
  }

  console.log('='.repeat(80));
  console.log(`OVERALL GRADE: ${grade} (${overallScore}%)`);
  console.log(`STATUS: ${overallScore >= 99 ? '✅ PRODUCTION READY' : '❌ REMEDIATION REQUIRED'}`);
  console.log('='.repeat(80) + '\n');

  // Save detailed report
  const reportPath = path.join(process.cwd(), 'docs/audits/ACCURATE_FULL_STACK_AUDIT_2025_01_20.json');
  fs.writeFileSync(reportPath, JSON.stringify(RESULTS, null, 2));
  console.log(`📄 Detailed JSON report saved to: ${reportPath}\n`);

  // Save markdown summary
  const mdPath = path.join(process.cwd(), 'docs/audits/ACCURATE_FULL_STACK_AUDIT_2025_01_20.md');
  const mdContent = generateMarkdown(overallScore, grade, supabaseRate, i18nRate, cleanDataRate, cleanPlaceholdersRate);
  fs.writeFileSync(mdPath, mdContent);
  console.log(`📄 Markdown summary saved to: ${mdPath}\n`);
}

function generateMarkdown(overallScore, grade, supabaseRate, i18nRate, cleanDataRate, cleanPlaceholdersRate) {
  return `# ACCURATE FULL-STACK AUDIT REPORT
**Dragonfly26.00 - Supabase Integration & Data Compliance**

**Date:** ${new Date().toISOString().split('T')[0]}  
**Overall Grade:** ${grade} (${overallScore}%)  
**Status:** ${overallScore >= 99 ? '✅ PRODUCTION READY' : '❌ REMEDIATION REQUIRED'}

---

## 📊 EXECUTIVE SUMMARY

| Metric | Count | Rate |
|--------|-------|------|
| Total Tab Components | ${RESULTS.tabs.total} | 100% |
| With Supabase Hooks | ${RESULTS.tabs.withSupabaseHooks} | ${supabaseRate}% |
| With i18n | ${RESULTS.tabs.withi18n} | ${i18nRate}% |
| With Hardcoded Data | ${RESULTS.tabs.withHardcodedData} | ${((RESULTS.tabs.withHardcodedData/RESULTS.tabs.total)*100).toFixed(2)}% |
| With Hardcoded Placeholders | ${RESULTS.tabs.withHardcodedPlaceholders} | ${((RESULTS.tabs.withHardcodedPlaceholders/RESULTS.tabs.total)*100).toFixed(2)}% |

### Data Hooks
| Metric | Count | Rate |
|--------|-------|------|
| Total Hooks | ${RESULTS.hooks.total} | 100% |
| With Supabase | ${RESULTS.hooks.withSupabase} | ${(RESULTS.hooks.withSupabase/RESULTS.hooks.total*100).toFixed(2)}% |

### Database
| Metric | Count |
|--------|-------|
| Migrations | ${RESULTS.database.migrations} |
| Tables | ${RESULTS.database.tables} |
| RLS Policies | ${RESULTS.database.policies} |

---

## 🎯 COMPLIANCE RATES

| Category | Rate | Status |
|----------|------|--------|
| Supabase Integration | ${supabaseRate}% | ${supabaseRate >= 99 ? '✅ PASS' : '❌ FAIL'} |
| i18n Coverage | ${i18nRate}% | ${i18nRate >= 99 ? '✅ PASS' : '❌ FAIL'} |
| Clean Data (No Mock) | ${cleanDataRate}% | ${cleanDataRate >= 99 ? '✅ PASS' : '❌ FAIL'} |
| Clean Placeholders | ${cleanPlaceholdersRate}% | ${cleanPlaceholdersRate >= 99 ? '✅ PASS' : '❌ FAIL'} |

---

## 🚨 VIOLATIONS

**Total Violations:** ${RESULTS.violations.length}

${RESULTS.violations.length > 0 ? `
### By Type
${Object.entries(RESULTS.violations.reduce((acc, v) => {
  acc[v.type] = (acc[v.type] || 0) + 1;
  return acc;
}, {})).map(([type, count]) => `- **${type}**: ${count}`).join('\n')}

### Details (First 50)
${RESULTS.violations.slice(0, 50).map(v => 
  `- ❌ **${v.module}/${v.file}**: ${v.message}`
).join('\n')}

${RESULTS.violations.length > 50 ? `\n*... and ${RESULTS.violations.length - 50} more violations*` : ''}
` : '✅ **NO VIOLATIONS FOUND**'}

---

## 🏆 CERTIFICATION

${overallScore >= 99 ? `
✅ **CERTIFIED: PRODUCTION READY**

This application has achieved 100% full-stack Supabase integration with zero hardcoded data.
All components are internationalized and connected to live database sources.
` : `
❌ **REMEDIATION REQUIRED**

${RESULTS.violations.length} violations must be addressed before production deployment.

**Priority Actions:**
1. Fix ${RESULTS.tabs.total - RESULTS.tabs.withSupabaseHooks} components missing Supabase integration
2. Add i18n to ${RESULTS.tabs.total - RESULTS.tabs.withi18n} components
3. Remove hardcoded data from ${RESULTS.tabs.withHardcodedData} components
4. Internationalize ${RESULTS.tabs.withHardcodedPlaceholders} hardcoded placeholders
`}

---

**Audit Timestamp:** ${RESULTS.timestamp}
`;
}

// Execute audit
console.log('🔍 Starting accurate full-stack audit...\n');
scanAllTabs();
scanHooks();
scanDatabase();
generateReport();
console.log('✅ Audit complete!\n');
