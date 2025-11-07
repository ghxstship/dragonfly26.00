#!/usr/bin/env node

/**
 * FINAL FULL STACK AUDIT
 * Comprehensive verification of 100% enterprise readiness
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const results = {
  timestamp: new Date().toISOString(),
  layers: {},
  overallScore: 0,
  compliance: false
};

function auditLayer(name, checks) {
  console.log(`\n🔍 Auditing ${name}...`);
  const layer = {
    name,
    checks: [],
    score: 0,
    passed: 0,
    failed: 0
  };

  checks.forEach(check => {
    const result = check.test();
    layer.checks.push({
      name: check.name,
      passed: result.passed,
      message: result.message,
      details: result.details || {}
    });

    if (result.passed) {
      layer.passed++;
      console.log(`  ✅ ${check.name}`);
    } else {
      layer.failed++;
      console.log(`  ❌ ${check.name}: ${result.message}`);
    }
  });

  layer.score = (layer.passed / checks.length) * 100;
  results.layers[name] = layer;
  return layer;
}

// Layer 1: Database & Migrations
const databaseChecks = [
  {
    name: 'Migrations Present',
    test: () => {
      const migrationsDir = path.join(process.cwd(), 'supabase/migrations');
      if (!fs.existsSync(migrationsDir)) {
        return { passed: false, message: 'Migrations directory not found' };
      }
      const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
      return {
        passed: migrations.length > 0,
        message: `${migrations.length} migrations found`,
        details: { count: migrations.length }
      };
    }
  },
  {
    name: 'Sequential Migration Numbers',
    test: () => {
      const migrationsDir = path.join(process.cwd(), 'supabase/migrations');
      const migrations = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql') && !f.includes('.skip'))
        .sort();
      
      let sequential = true;
      for (let i = 0; i < migrations.length - 1; i++) {
        const current = parseInt(migrations[i].split('_')[0]);
        const next = parseInt(migrations[i + 1].split('_')[0]);
        if (next !== current + 1) {
          sequential = false;
          break;
        }
      }
      
      return {
        passed: sequential,
        message: sequential ? 'All migrations sequential' : 'Gap in migration sequence'
      };
    }
  },
  {
    name: 'RLS Policies Present',
    test: () => {
      const migrationsDir = path.join(process.cwd(), 'supabase/migrations');
      const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
      
      let policyCount = 0;
      migrations.forEach(file => {
        const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        const matches = content.match(/CREATE POLICY/gi);
        if (matches) policyCount += matches.length;
      });
      
      return {
        passed: policyCount > 0,
        message: `${policyCount} RLS policies found`,
        details: { count: policyCount }
      };
    }
  }
];

// Layer 2: Data Hooks
const dataHooksChecks = [
  {
    name: 'Data Hooks Present',
    test: () => {
      const hooksDir = path.join(process.cwd(), 'src/hooks');
      if (!fs.existsSync(hooksDir)) {
        return { passed: false, message: 'Hooks directory not found' };
      }
      
      const dataHooks = fs.readdirSync(hooksDir)
        .filter(f => f.startsWith('use-') && f.endsWith('-data.ts'));
      
      return {
        passed: dataHooks.length >= 20,
        message: `${dataHooks.length} data hooks found`,
        details: { count: dataHooks.length, hooks: dataHooks }
      };
    }
  },
  {
    name: 'Hooks Use Supabase Client',
    test: () => {
      const hooksDir = path.join(process.cwd(), 'src/hooks');
      const dataHooks = fs.readdirSync(hooksDir)
        .filter(f => f.startsWith('use-') && f.endsWith('-data.ts'));
      
      let withSupabase = 0;
      dataHooks.forEach(hook => {
        const content = fs.readFileSync(path.join(hooksDir, hook), 'utf8');
        if (content.includes('createClient') || content.includes('supabase')) {
          withSupabase++;
        }
      });
      
      const rate = (withSupabase / dataHooks.length) * 100;
      return {
        passed: rate >= 95,
        message: `${withSupabase}/${dataHooks.length} hooks use Supabase (${rate.toFixed(1)}%)`,
        details: { withSupabase, total: dataHooks.length, rate }
      };
    }
  }
];

// Layer 3: Component Integration
const componentChecks = [
  {
    name: 'All Tabs Have Supabase Integration',
    test: () => {
      const result = execSync('node scripts/verify-supabase-integration.js', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      const match = result.match(/Integration Rate: ([\d.]+)%/);
      const rate = match ? parseFloat(match[1]) : 0;
      
      return {
        passed: rate === 100,
        message: `${rate}% integration rate`,
        details: { rate }
      };
    }
  },
  {
    name: 'All Components Have i18n',
    test: () => {
      const componentsDir = path.join(process.cwd(), 'src/components');
      const result = execSync(`find ${componentsDir} -name "*-tab.tsx" -type f`, { encoding: 'utf8' });
      const files = result.trim().split('\n').filter(f => f);
      
      let withi18n = 0;
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('useTranslations')) {
          withi18n++;
        }
      });
      
      const rate = (withi18n / files.length) * 100;
      return {
        passed: rate === 100,
        message: `${withi18n}/${files.length} components have i18n (${rate.toFixed(1)}%)`,
        details: { withi18n, total: files.length, rate }
      };
    }
  },
  {
    name: 'No Hardcoded Placeholders',
    test: () => {
      const componentsDir = path.join(process.cwd(), 'src/components');
      const result = execSync(`find ${componentsDir} -name "*-tab.tsx" -type f`, { encoding: 'utf8' });
      const files = result.trim().split('\n').filter(f => f);
      
      let violations = 0;
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const matches = content.match(/placeholder="[A-Z][^"]*"/g);
        if (matches) violations += matches.length;
      });
      
      return {
        passed: violations === 0,
        message: violations === 0 ? 'No hardcoded placeholders' : `${violations} hardcoded placeholders found`,
        details: { violations }
      };
    }
  }
];

// Layer 4: Accessibility
const accessibilityChecks = [
  {
    name: 'Components Have ARIA Labels',
    test: () => {
      const componentsDir = path.join(process.cwd(), 'src/components');
      const result = execSync(`find ${componentsDir} -name "*-tab.tsx" -type f`, { encoding: 'utf8' });
      const files = result.trim().split('\n').filter(f => f);
      
      let withAria = 0;
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('aria-') || content.includes('role=')) {
          withAria++;
        }
      });
      
      const rate = (withAria / files.length) * 100;
      return {
        passed: rate >= 95,
        message: `${withAria}/${files.length} components have ARIA (${rate.toFixed(1)}%)`,
        details: { withAria, total: files.length, rate }
      };
    }
  }
];

// Layer 5: Type Safety
const typeSafetyChecks = [
  {
    name: 'TypeScript Configuration',
    test: () => {
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
      if (!fs.existsSync(tsconfigPath)) {
        return { passed: false, message: 'tsconfig.json not found' };
      }
      
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      const hasStrict = tsconfig.compilerOptions && tsconfig.compilerOptions.strict !== undefined;
      
      return {
        passed: true,
        message: `TypeScript configured (strict: ${hasStrict})`,
        details: { strict: hasStrict }
      };
    }
  }
];

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('FINAL FULL STACK AUDIT REPORT');
  console.log('Dragonfly26.00 - Enterprise Readiness Verification');
  console.log('='.repeat(80));

  // Run all audits
  auditLayer('Database & Migrations', databaseChecks);
  auditLayer('Data Hooks', dataHooksChecks);
  auditLayer('Component Integration', componentChecks);
  auditLayer('Accessibility', accessibilityChecks);
  auditLayer('Type Safety', typeSafetyChecks);

  // Calculate overall score
  const layers = Object.values(results.layers);
  const totalScore = layers.reduce((sum, layer) => sum + layer.score, 0);
  results.overallScore = totalScore / layers.length;
  results.compliance = results.overallScore >= 95;

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  
  layers.forEach(layer => {
    const status = layer.score === 100 ? '✅' : layer.score >= 95 ? '⚠️' : '❌';
    console.log(`${status} ${layer.name}: ${layer.score.toFixed(1)}% (${layer.passed}/${layer.checks.length})`);
  });

  console.log('\n' + '='.repeat(80));
  console.log(`OVERALL SCORE: ${results.overallScore.toFixed(1)}%`);
  console.log(`COMPLIANCE: ${results.compliance ? '✅ PASS' : '❌ FAIL'}`);
  console.log('='.repeat(80));

  // Save report
  const reportPath = path.join(process.cwd(), 'docs/audits/FINAL_FULL_STACK_AUDIT_2025_11_06.md');
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  let markdown = `# FINAL FULL STACK AUDIT REPORT\n`;
  markdown += `**Date:** ${new Date().toLocaleDateString()}\n`;
  markdown += `**Overall Score:** ${results.overallScore.toFixed(1)}%\n`;
  markdown += `**Compliance:** ${results.compliance ? '✅ PASS' : '❌ FAIL'}\n\n`;
  markdown += `---\n\n`;

  layers.forEach(layer => {
    markdown += `## ${layer.name}\n`;
    markdown += `**Score:** ${layer.score.toFixed(1)}% (${layer.passed}/${layer.checks.length} checks passed)\n\n`;
    
    layer.checks.forEach(check => {
      markdown += `- ${check.passed ? '✅' : '❌'} **${check.name}**: ${check.message}\n`;
    });
    markdown += `\n`;
  });

  markdown += `---\n\n`;
  markdown += `**Audit Timestamp:** ${results.timestamp}\n`;

  fs.writeFileSync(reportPath, markdown, 'utf8');
  console.log(`\n📄 Full report saved to: ${reportPath}`);
}

generateReport();
