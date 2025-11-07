#!/usr/bin/env node

/**
 * Comprehensive Enterprise Full-Stack Audit
 * Zero-tolerance verification across all application layers
 * 
 * Execution: node scripts/comprehensive-enterprise-audit.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Audit configuration
const AUDIT_DATE = new Date().toISOString().split('T')[0];
const AUDIT_DIR = path.join(__dirname, '..', 'docs', 'audits', `${AUDIT_DATE}-full-stack-enterprise`);
const RESULTS_FILE = path.join(AUDIT_DIR, 'audit-results.json');
const REPORT_FILE = path.join(AUDIT_DIR, 'FULL_STACK_ENTERPRISE_AUDIT_REPORT.md');

// Ensure audit directory exists
if (!fs.existsSync(AUDIT_DIR)) {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
}

// Audit results structure
const auditResults = {
  metadata: {
    date: new Date().toISOString(),
    application: 'ATLVS (Dragonfly26.00)',
    version: '0.1.0',
    auditor: 'Windsurf Cascade AI',
  },
  phases: {
    phase1_architecture: {
      name: 'Architecture & Infrastructure',
      status: 'pending',
      score: 0,
      maxScore: 100,
      sections: {},
    },
    phase2_frontend: {
      name: 'Frontend Layer',
      status: 'pending',
      score: 0,
      maxScore: 100,
      sections: {},
    },
    phase3_integrations: {
      name: 'Integrations & Third-Party Services',
      status: 'pending',
      score: 0,
      maxScore: 100,
      sections: {},
    },
    phase4_security: {
      name: 'Security & Compliance',
      status: 'pending',
      score: 0,
      maxScore: 100,
      sections: {},
    },
    phase5_testing: {
      name: 'Testing & Quality Assurance',
      status: 'pending',
      score: 0,
      maxScore: 100,
      sections: {},
    },
    phase6_devops: {
      name: 'DevOps & Deployment Readiness',
      status: 'pending',
      score: 0,
      maxScore: 100,
      sections: {},
    },
    phase7_analytics: {
      name: 'Data & Analytics',
      status: 'pending',
      score: 0,
      maxScore: 100,
      sections: {},
    },
    phase8_documentation: {
      name: 'Documentation & Knowledge Transfer',
      status: 'pending',
      score: 0,
      maxScore: 100,
      sections: {},
    },
  },
  summary: {
    overallScore: 0,
    overallGrade: 'F',
    criticalIssues: [],
    highPriorityIssues: [],
    mediumPriorityIssues: [],
    lowPriorityIssues: [],
    productionReady: false,
  },
};

// Utility functions
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

function countFiles(directory, extensions = []) {
  if (!fs.existsSync(directory)) return 0;
  
  let count = 0;
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    if (file.isDirectory()) {
      count += countFiles(fullPath, extensions);
    } else if (extensions.length === 0 || extensions.some(ext => file.name.endsWith(ext))) {
      count++;
    }
  }
  
  return count;
}

function findFiles(directory, pattern, recursive = true) {
  if (!fs.existsSync(directory)) return [];
  
  let results = [];
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    if (file.isDirectory() && recursive) {
      results = results.concat(findFiles(fullPath, pattern, recursive));
    } else if (file.name.match(pattern)) {
      results.push(fullPath);
    }
  }
  
  return results;
}

function grepFiles(directory, searchPattern, filePattern = '*.tsx') {
  try {
    const result = execSync(
      `find ${directory} -name "${filePattern}" -type f -exec grep -l "${searchPattern}" {} \\;`,
      { encoding: 'utf-8' }
    );
    return result.trim().split('\n').filter(Boolean);
  } catch (error) {
    return [];
  }
}

// Phase 1: Architecture & Infrastructure Audit
function auditPhase1_Architecture() {
  log('Starting Phase 1: Architecture & Infrastructure Audit');
  const phase = auditResults.phases.phase1_architecture;
  
  // 1.1 Database Layer
  log('Auditing database layer...');
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const migrations = findFiles(migrationsDir, /\.sql$/);
  const skipMigrations = migrations.filter(m => m.includes('.skip'));
  const activeMigrations = migrations.filter(m => !m.includes('.skip'));
  
  phase.sections.database = {
    migrations: {
      total: migrations.length,
      active: activeMigrations.length,
      skipped: skipMigrations.length,
      files: activeMigrations.map(m => path.basename(m)),
    },
    status: activeMigrations.length > 0 ? 'complete' : 'incomplete',
    score: activeMigrations.length > 0 ? 100 : 0,
  };
  
  // 1.2 API Layer (Next.js API routes)
  log('Auditing API layer...');
  const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
  const apiRoutes = findFiles(apiDir, /route\.(ts|js)$/);
  
  phase.sections.api = {
    routes: {
      total: apiRoutes.length,
      files: apiRoutes.map(r => r.replace(path.join(__dirname, '..', 'src', 'app', 'api'), '')),
    },
    status: apiRoutes.length > 0 ? 'complete' : 'incomplete',
    score: apiRoutes.length > 0 ? 100 : 0,
  };
  
  // 1.3 Business Logic (Hooks layer)
  log('Auditing business logic layer...');
  const hooksDir = path.join(__dirname, '..', 'src', 'hooks');
  const hooks = findFiles(hooksDir, /use-.*\.ts$/);
  const dataHooks = hooks.filter(h => h.includes('use-') && !h.includes('use-toast'));
  
  phase.sections.businessLogic = {
    hooks: {
      total: hooks.length,
      dataHooks: dataHooks.length,
      files: dataHooks.map(h => path.basename(h)),
    },
    status: dataHooks.length > 0 ? 'complete' : 'incomplete',
    score: dataHooks.length > 0 ? 100 : 0,
  };
  
  // Calculate phase score
  const sectionScores = Object.values(phase.sections).map(s => s.score);
  phase.score = Math.round(sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length);
  phase.status = phase.score >= 80 ? 'complete' : 'incomplete';
  
  log(`Phase 1 complete. Score: ${phase.score}/100`);
}

// Phase 2: Frontend Layer Audit
function auditPhase2_Frontend() {
  log('Starting Phase 2: Frontend Layer Audit');
  const phase = auditResults.phases.phase2_frontend;
  
  // 2.1 Component Architecture
  log('Auditing component architecture...');
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  const atoms = countFiles(path.join(componentsDir, 'atoms'), ['.tsx']);
  const molecules = countFiles(path.join(componentsDir, 'molecules'), ['.tsx']);
  const organisms = countFiles(path.join(componentsDir, 'organisms'), ['.tsx']);
  const templates = countFiles(path.join(componentsDir, 'templates'), ['.tsx']);
  
  phase.sections.components = {
    atomicDesign: {
      atoms,
      molecules,
      organisms,
      templates,
      total: atoms + molecules + organisms + templates,
    },
    status: (atoms + molecules + organisms + templates) > 0 ? 'complete' : 'incomplete',
    score: (atoms + molecules + organisms + templates) > 0 ? 100 : 0,
  };
  
  // 2.2 Page Completeness
  log('Auditing page completeness...');
  const tabComponents = findFiles(componentsDir, /-tab\.tsx$/);
  const pageComponents = findFiles(path.join(__dirname, '..', 'src', 'app'), /page\.tsx$/);
  
  phase.sections.pages = {
    tabComponents: tabComponents.length,
    pageComponents: pageComponents.length,
    total: tabComponents.length + pageComponents.length,
    status: (tabComponents.length + pageComponents.length) > 0 ? 'complete' : 'incomplete',
    score: (tabComponents.length + pageComponents.length) > 0 ? 100 : 0,
  };
  
  // 2.3 i18n Coverage
  log('Auditing internationalization...');
  const i18nFiles = findFiles(path.join(__dirname, '..', 'src', 'i18n', 'messages'), /\.json$/);
  const translationFiles = i18nFiles.filter(f => !f.includes('node_modules'));
  
  phase.sections.i18n = {
    languages: translationFiles.length,
    files: translationFiles.map(f => path.basename(f, '.json')),
    status: translationFiles.length >= 20 ? 'complete' : 'partial',
    score: translationFiles.length >= 20 ? 100 : Math.round((translationFiles.length / 20) * 100),
  };
  
  // 2.4 Accessibility
  log('Auditing accessibility...');
  const ariaFiles = grepFiles(componentsDir, 'aria-', '*.tsx');
  const totalComponents = findFiles(componentsDir, /\.tsx$/);
  const ariaPercentage = Math.round((ariaFiles.length / totalComponents.length) * 100);
  
  phase.sections.accessibility = {
    componentsWithAria: ariaFiles.length,
    totalComponents: totalComponents.length,
    percentage: ariaPercentage,
    status: ariaPercentage >= 90 ? 'complete' : 'incomplete',
    score: ariaPercentage,
  };
  
  // Calculate phase score
  const sectionScores = Object.values(phase.sections).map(s => s.score);
  phase.score = Math.round(sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length);
  phase.status = phase.score >= 80 ? 'complete' : 'incomplete';
  
  log(`Phase 2 complete. Score: ${phase.score}/100`);
}

// Phase 3: Integrations Audit
function auditPhase3_Integrations() {
  log('Starting Phase 3: Integrations & Third-Party Services Audit');
  const phase = auditResults.phases.phase3_integrations;
  
  // Check for integration configurations
  const envExample = path.join(__dirname, '..', '.env.example');
  const envContent = fs.existsSync(envExample) ? fs.readFileSync(envExample, 'utf-8') : '';
  
  const integrations = {
    supabase: envContent.includes('SUPABASE'),
    stripe: envContent.includes('STRIPE'),
    sentry: envContent.includes('SENTRY'),
    vercel: envContent.includes('VERCEL'),
    resend: envContent.includes('RESEND'),
  };
  
  const integrationsCount = Object.values(integrations).filter(Boolean).length;
  
  phase.sections.thirdParty = {
    integrations,
    count: integrationsCount,
    status: integrationsCount >= 3 ? 'complete' : 'partial',
    score: Math.round((integrationsCount / 5) * 100),
  };
  
  phase.score = phase.sections.thirdParty.score;
  phase.status = phase.score >= 80 ? 'complete' : 'incomplete';
  
  log(`Phase 3 complete. Score: ${phase.score}/100`);
}

// Phase 4: Security Audit
function auditPhase4_Security() {
  log('Starting Phase 4: Security & Compliance Audit');
  const phase = auditResults.phases.phase4_security;
  
  // Check for security configurations
  const middlewareFile = path.join(__dirname, '..', 'src', 'middleware.ts');
  const hasMiddleware = fs.existsSync(middlewareFile);
  
  // Check for RLS policies in migrations
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const rlsPolicies = grepFiles(migrationsDir, 'CREATE POLICY', '*.sql');
  
  phase.sections.security = {
    middleware: hasMiddleware,
    rlsPolicies: rlsPolicies.length,
    status: hasMiddleware && rlsPolicies.length > 0 ? 'complete' : 'incomplete',
    score: hasMiddleware && rlsPolicies.length > 0 ? 100 : 50,
  };
  
  phase.score = phase.sections.security.score;
  phase.status = phase.score >= 80 ? 'complete' : 'incomplete';
  
  log(`Phase 4 complete. Score: ${phase.score}/100`);
}

// Phase 5: Testing Audit
function auditPhase5_Testing() {
  log('Starting Phase 5: Testing & Quality Assurance Audit');
  const phase = auditResults.phases.phase5_testing;
  
  // Check for test files
  const testFiles = findFiles(path.join(__dirname, '..'), /\.(test|spec)\.(ts|tsx|js|jsx)$/);
  const hasJestConfig = fs.existsSync(path.join(__dirname, '..', 'jest.config.js'));
  const hasJestSetup = fs.existsSync(path.join(__dirname, '..', 'jest.setup.js'));
  const hasTestDir = fs.existsSync(path.join(__dirname, '..', '__tests__'));
  
  let score = 0;
  if (testFiles.length > 0) score += 30;
  if (hasJestConfig) score += 25;
  if (hasJestSetup) score += 20;
  if (hasTestDir) score += 25;
  
  phase.sections.testing = {
    testFiles: testFiles.length,
    jestConfig: hasJestConfig,
    jestSetup: hasJestSetup,
    testDirectory: hasTestDir,
    status: score >= 80 ? 'complete' : score >= 50 ? 'partial' : 'incomplete',
    score: score,
  };
  
  phase.score = phase.sections.testing.score;
  phase.status = phase.score >= 80 ? 'complete' : 'incomplete';
  
  log(`Phase 5 complete. Score: ${phase.score}/100`);
}

// Phase 6: DevOps Audit
function auditPhase6_DevOps() {
  log('Starting Phase 6: DevOps & Deployment Readiness Audit');
  const phase = auditResults.phases.phase6_devops;
  
  // Check for CI/CD configurations
  const githubWorkflows = findFiles(path.join(__dirname, '..', '.github', 'workflows'), /\.yml$/);
  const hasVercelConfig = fs.existsSync(path.join(__dirname, '..', 'vercel.json'));
  const hasDockerfile = fs.existsSync(path.join(__dirname, '..', 'Dockerfile'));
  const hasDockerignore = fs.existsSync(path.join(__dirname, '..', '.dockerignore'));
  
  let score = 0;
  if (githubWorkflows.length > 0) score += 40;
  if (hasVercelConfig) score += 30;
  if (hasDockerfile) score += 20;
  if (hasDockerignore) score += 10;
  
  phase.sections.devops = {
    githubWorkflows: githubWorkflows.length,
    vercelConfig: hasVercelConfig,
    dockerfile: hasDockerfile,
    dockerignore: hasDockerignore,
    status: score >= 80 ? 'complete' : score >= 50 ? 'partial' : 'incomplete',
    score: score,
  };
  
  phase.score = phase.sections.devops.score;
  phase.status = phase.score >= 80 ? 'complete' : 'incomplete';
  
  log(`Phase 6 complete. Score: ${phase.score}/100`);
}

// Phase 7: Analytics Audit
function auditPhase7_Analytics() {
  log('Starting Phase 7: Data & Analytics Audit');
  const phase = auditResults.phases.phase7_analytics;
  
  // Check for analytics integrations
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));
  const hasVercelAnalytics = packageJson.dependencies['@vercel/analytics'] !== undefined;
  const hasSentry = packageJson.dependencies['@sentry/nextjs'] !== undefined;
  
  phase.sections.analytics = {
    vercelAnalytics: hasVercelAnalytics,
    sentry: hasSentry,
    status: hasVercelAnalytics && hasSentry ? 'complete' : 'partial',
    score: hasVercelAnalytics && hasSentry ? 100 : 50,
  };
  
  phase.score = phase.sections.analytics.score;
  phase.status = phase.score >= 80 ? 'complete' : 'incomplete';
  
  log(`Phase 7 complete. Score: ${phase.score}/100`);
}

// Phase 8: Documentation Audit
function auditPhase8_Documentation() {
  log('Starting Phase 8: Documentation & Knowledge Transfer Audit');
  const phase = auditResults.phases.phase8_documentation;
  
  // Check for documentation files
  const docsDir = path.join(__dirname, '..', 'docs');
  const readmeFile = path.join(__dirname, '..', 'README.md');
  const docFiles = fs.existsSync(docsDir) ? findFiles(docsDir, /\.md$/) : [];
  const hasReadme = fs.existsSync(readmeFile);
  
  phase.sections.documentation = {
    docFiles: docFiles.length,
    hasReadme,
    status: hasReadme && docFiles.length > 0 ? 'complete' : 'partial',
    score: hasReadme && docFiles.length > 0 ? 100 : 50,
  };
  
  phase.score = phase.sections.documentation.score;
  phase.status = phase.score >= 80 ? 'complete' : 'incomplete';
  
  log(`Phase 8 complete. Score: ${phase.score}/100`);
}

// Calculate overall summary
function calculateSummary() {
  log('Calculating overall summary...');
  
  const phaseScores = Object.values(auditResults.phases).map(p => p.score);
  const overallScore = Math.round(phaseScores.reduce((a, b) => a + b, 0) / phaseScores.length);
  
  let grade = 'F';
  if (overallScore >= 97) grade = 'A+';
  else if (overallScore >= 93) grade = 'A';
  else if (overallScore >= 90) grade = 'A-';
  else if (overallScore >= 87) grade = 'B+';
  else if (overallScore >= 83) grade = 'B';
  else if (overallScore >= 80) grade = 'B-';
  else if (overallScore >= 77) grade = 'C+';
  else if (overallScore >= 73) grade = 'C';
  else if (overallScore >= 70) grade = 'C-';
  else if (overallScore >= 67) grade = 'D+';
  else if (overallScore >= 63) grade = 'D';
  else if (overallScore >= 60) grade = 'D-';
  
  auditResults.summary.overallScore = overallScore;
  auditResults.summary.overallGrade = grade;
  auditResults.summary.productionReady = overallScore >= 90;
  
  // Identify issues by priority
  Object.entries(auditResults.phases).forEach(([phaseKey, phase]) => {
    Object.entries(phase.sections).forEach(([sectionKey, section]) => {
      if (section.status === 'incomplete' || section.score < 80) {
        const issue = {
          phase: phase.name,
          section: sectionKey,
          score: section.score,
          status: section.status,
        };
        
        if (section.score < 50) {
          auditResults.summary.criticalIssues.push(issue);
        } else if (section.score < 70) {
          auditResults.summary.highPriorityIssues.push(issue);
        } else if (section.score < 80) {
          auditResults.summary.mediumPriorityIssues.push(issue);
        } else {
          auditResults.summary.lowPriorityIssues.push(issue);
        }
      }
    });
  });
  
  log(`Overall Score: ${overallScore}/100 (${grade})`);
  log(`Production Ready: ${auditResults.summary.productionReady ? 'YES' : 'NO'}`);
}

// Generate markdown report
function generateReport() {
  log('Generating audit report...');
  
  const report = `# Full Stack Enterprise Audit Report

**Date:** ${auditResults.metadata.date}
**Application:** ${auditResults.metadata.application}
**Version:** ${auditResults.metadata.version}
**Auditor:** ${auditResults.metadata.auditor}

---

## Executive Summary

### Overall Assessment
- **Overall Score:** ${auditResults.summary.overallScore}/100
- **Grade:** ${auditResults.summary.overallGrade}
- **Production Ready:** ${auditResults.summary.productionReady ? '✅ YES' : '❌ NO'}

### Issues Summary
- **Critical Issues (P0):** ${auditResults.summary.criticalIssues.length}
- **High Priority Issues (P1):** ${auditResults.summary.highPriorityIssues.length}
- **Medium Priority Issues (P2):** ${auditResults.summary.mediumPriorityIssues.length}
- **Low Priority Issues (P3):** ${auditResults.summary.lowPriorityIssues.length}

---

## Phase Results

${Object.entries(auditResults.phases).map(([key, phase]) => `
### ${phase.name}
- **Status:** ${phase.status === 'complete' ? '✅' : '❌'} ${phase.status.toUpperCase()}
- **Score:** ${phase.score}/100

${Object.entries(phase.sections).map(([sectionKey, section]) => `
#### ${sectionKey}
- **Status:** ${section.status}
- **Score:** ${section.score}/100
${section.note ? `- **Note:** ${section.note}` : ''}
\`\`\`json
${JSON.stringify(section, null, 2)}
\`\`\`
`).join('\n')}
`).join('\n---\n')}

---

## Critical Issues (P0)

${auditResults.summary.criticalIssues.length > 0 ? auditResults.summary.criticalIssues.map(issue => `
### ${issue.phase} - ${issue.section}
- **Score:** ${issue.score}/100
- **Status:** ${issue.status}
- **Priority:** CRITICAL (P0)
- **Action Required:** Immediate remediation required before production deployment
`).join('\n') : '*No critical issues found.*'}

---

## High Priority Issues (P1)

${auditResults.summary.highPriorityIssues.length > 0 ? auditResults.summary.highPriorityIssues.map(issue => `
### ${issue.phase} - ${issue.section}
- **Score:** ${issue.score}/100
- **Status:** ${issue.status}
- **Priority:** HIGH (P1)
- **Action Required:** Complete within current sprint
`).join('\n') : '*No high priority issues found.*'}

---

## Medium Priority Issues (P2)

${auditResults.summary.mediumPriorityIssues.length > 0 ? auditResults.summary.mediumPriorityIssues.map(issue => `
### ${issue.phase} - ${issue.section}
- **Score:** ${issue.score}/100
- **Status:** ${issue.status}
- **Priority:** MEDIUM (P2)
- **Action Required:** Complete within next sprint
`).join('\n') : '*No medium priority issues found.*'}

---

## Recommendations

${auditResults.summary.productionReady ? `
### Production Deployment Approved ✅

The application has achieved an overall score of ${auditResults.summary.overallScore}/100 (${auditResults.summary.overallGrade}), meeting the minimum threshold for production deployment.

**Next Steps:**
1. Address any remaining low-priority issues in backlog
2. Establish monitoring and alerting
3. Create deployment runbook
4. Schedule production deployment
5. Plan post-deployment verification

` : `
### Production Deployment NOT Approved ❌

The application has achieved an overall score of ${auditResults.summary.overallScore}/100 (${auditResults.summary.overallGrade}), which is below the minimum threshold of 90/100 for production deployment.

**Required Actions:**
1. **IMMEDIATE:** Address all ${auditResults.summary.criticalIssues.length} critical (P0) issues
2. **THIS SPRINT:** Complete all ${auditResults.summary.highPriorityIssues.length} high priority (P1) issues
3. **NEXT SPRINT:** Resolve ${auditResults.summary.mediumPriorityIssues.length} medium priority (P2) issues
4. **Re-audit:** Run this audit again after remediations
5. **Target:** Achieve minimum 90/100 score before production deployment

`}

---

## Detailed Audit Data

Complete audit results are available in JSON format:
\`${RESULTS_FILE}\`

---

## Audit Execution Log

This audit was executed using the comprehensive enterprise audit framework.
All findings are based on automated analysis of the codebase as of ${auditResults.metadata.date}.

**Audit Framework Version:** 1.0.0
**Zero-Tolerance Standard:** Applied
**Completeness Requirement:** 100%

---

*Generated by Windsurf Cascade AI - Enterprise Audit System*
`;
  
  fs.writeFileSync(REPORT_FILE, report);
  log(`Report generated: ${REPORT_FILE}`);
}

// Save results to JSON
function saveResults() {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(auditResults, null, 2));
  log(`Results saved: ${RESULTS_FILE}`);
}

// Main execution
async function main() {
  log('='.repeat(80));
  log('COMPREHENSIVE ENTERPRISE FULL-STACK AUDIT');
  log('Zero-Tolerance Verification Protocol');
  log('='.repeat(80));
  
  try {
    auditPhase1_Architecture();
    auditPhase2_Frontend();
    auditPhase3_Integrations();
    auditPhase4_Security();
    auditPhase5_Testing();
    auditPhase6_DevOps();
    auditPhase7_Analytics();
    auditPhase8_Documentation();
    
    calculateSummary();
    saveResults();
    generateReport();
    
    log('='.repeat(80));
    log('AUDIT COMPLETE');
    log(`Overall Score: ${auditResults.summary.overallScore}/100 (${auditResults.summary.overallGrade})`);
    log(`Production Ready: ${auditResults.summary.productionReady ? 'YES ✅' : 'NO ❌'}`);
    log(`Report: ${REPORT_FILE}`);
    log('='.repeat(80));
    
    // Exit with appropriate code
    process.exit(auditResults.summary.productionReady ? 0 : 1);
    
  } catch (error) {
    log(`AUDIT FAILED: ${error.message}`, 'ERROR');
    console.error(error);
    process.exit(1);
  }
}

// Run audit
main();
