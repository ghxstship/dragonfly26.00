#!/usr/bin/env node

/**
 * GENERATE COMPLETE 12-LAYER CHECKLIST
 * Creates a comprehensive markdown checklist for all 221 files across all 12 layers
 */

const fs = require('fs');
const path = require('path');

// Load audit results
const auditPath = path.join(process.cwd(), 'docs/audits/ZERO_TOLERANCE_12_LAYER_AUDIT_2025_01_20.json');
const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));

// Define the 12 layers
const LAYERS = [
  { num: 1, name: 'UI Components', key: 'ui', passingScore: 90 },
  { num: 2, name: 'Data Hooks', key: 'hooks', passingScore: 90 },
  { num: 3, name: 'Database Schema', key: 'schema', passingScore: 90 },
  { num: 4, name: 'RLS Policies', key: 'rls', passingScore: 90 },
  { num: 5, name: 'Internationalization', key: 'i18n', passingScore: 95 },
  { num: 6, name: 'Accessibility', key: 'a11y', passingScore: 90 },
  { num: 7, name: 'Realtime', key: 'realtime', passingScore: 80 },
  { num: 8, name: 'Storage', key: 'storage', passingScore: 85 },
  { num: 9, name: 'Edge Functions', key: 'functions', passingScore: 80 },
  { num: 10, name: 'Authentication', key: 'auth', passingScore: 85 },
  { num: 11, name: 'API Routes', key: 'api', passingScore: 85 },
  { num: 12, name: 'Type Safety', key: 'types', passingScore: 85 }
];

// Group files by module
const moduleGroups = {};
Object.entries(auditData.files).forEach(([fileName, fileData]) => {
  const moduleName = fileName.split('-')[0];
  if (!moduleGroups[moduleName]) {
    moduleGroups[moduleName] = [];
  }
  moduleGroups[moduleName].push({ fileName, fileData });
});

// Generate markdown
let markdown = `# COMPLETE 12-LAYER IMPLEMENTATION CHECKLIST
**Dragonfly26.00 - Zero-Tolerance Full-Stack Validation**

**Date:** ${new Date().toISOString().split('T')[0]}  
**Total Files:** ${Object.keys(auditData.files).length}  
**Total Layers:** 12  
**Overall Grade:** ${auditData.summary.totalScore / Object.keys(auditData.files).length >= 95 ? 'A+' : auditData.summary.totalScore / Object.keys(auditData.files).length >= 90 ? 'A' : auditData.summary.totalScore / Object.keys(auditData.files).length >= 85 ? 'B+' : auditData.summary.totalScore / Object.keys(auditData.files).length >= 80 ? 'B' : 'C'} (${(auditData.summary.totalScore / Object.keys(auditData.files).length).toFixed(2)}/100)

---

## 📊 EXECUTIVE SUMMARY

| Metric | Value |
|--------|-------|
| Total Files Audited | ${Object.keys(auditData.files).length} |
| Perfect Files (A+) | ${auditData.summary.perfect} |
| Passing Files (A-B) | ${auditData.summary.passing} |
| Failing Files (C-F) | ${auditData.summary.failing} |
| Total Violations | ${auditData.violations.length} |

### Layer Compliance Summary

| Layer | Score | Status |
|-------|-------|--------|
${LAYERS.map(layer => {
  const layerData = auditData.layerScores[layer.key];
  const avgScore = layerData.score / layerData.filesAudited;
  const status = avgScore >= 95 ? '✅ Excellent' : avgScore >= 90 ? '✅ Good' : avgScore >= 80 ? '⚠️ Needs Work' : '❌ Critical';
  return `| ${layer.num}. ${layer.name} | ${avgScore.toFixed(1)}/100 | ${status} |`;
}).join('\n')}

---

## 🎯 ZERO-TOLERANCE STANDARDS

Each file must achieve:
- **Layer 1-6:** ≥90% (Core functionality)
- **Layer 5:** ≥95% (i18n is critical)
- **Layer 7-12:** ≥80% (Enhanced features)
- **Overall:** ≥95% for A+ certification

---

## 📋 FILE-BY-FILE CHECKLIST

${Object.entries(moduleGroups).sort().map(([moduleName, files]) => {
  return `### ${moduleName.toUpperCase()} MODULE (${files.length} files)

${files.sort((a, b) => a.fileName.localeCompare(b.fileName)).map(({ fileName, fileData }) => {
  const gradeEmoji = fileData.grade === 'A+' ? '🟢' : fileData.grade === 'A' ? '🟢' : fileData.grade.startsWith('B') ? '🟡' : fileData.grade.startsWith('C') ? '🟠' : '🔴';
  
  return `#### ${gradeEmoji} ${fileName}
**Overall Score:** ${fileData.totalScore.toFixed(1)}/100 (${fileData.grade})  
**File Path:** \`${fileData.path}\`  
**Violations:** ${fileData.violations.length}

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
${LAYERS.map(layer => {
  const layerData = fileData.layers[layer.key];
  const status = layerData.score >= layer.passingScore ? '✅' : layerData.score >= 70 ? '⚠️' : '❌';
  const violationText = layerData.violations.length > 0 ? layerData.violations.join('; ') : 'None';
  return `| ${layer.num}. ${layer.name} | ${layerData.score}/100 | ${status} | ${violationText} |`;
}).join('\n')}

${fileData.violations.length > 0 ? `
**Action Items:**
${fileData.violations.map((v, i) => `${i + 1}. ${v}`).join('\n')}
` : '**Status:** ✅ All layers passing'}

---
`;
}).join('\n')}`;
}).join('\n\n')}

---

## 🚨 PRIORITY REMEDIATION MATRIX

### Critical (Must Fix - Blocking Production)

${(() => {
  const critical = [];
  Object.entries(auditData.files).forEach(([fileName, fileData]) => {
    if (fileData.totalScore < 80) {
      critical.push({ fileName, score: fileData.totalScore, violations: fileData.violations.length });
    }
  });
  
  if (critical.length === 0) return '✅ No critical issues';
  
  return critical
    .sort((a, b) => a.score - b.score)
    .map((item, i) => `${i + 1}. **${item.fileName}** - ${item.score.toFixed(1)}/100 (${item.violations} violations)`)
    .join('\n');
})()}

### High Priority (Should Fix - Quality Issues)

${(() => {
  const high = [];
  Object.entries(auditData.files).forEach(([fileName, fileData]) => {
    if (fileData.totalScore >= 80 && fileData.totalScore < 90) {
      high.push({ fileName, score: fileData.totalScore, violations: fileData.violations.length });
    }
  });
  
  if (high.length === 0) return '✅ No high priority issues';
  
  return high
    .sort((a, b) => a.score - b.score)
    .slice(0, 20)
    .map((item, i) => `${i + 1}. **${item.fileName}** - ${item.score.toFixed(1)}/100 (${item.violations} violations)`)
    .join('\n');
})()}

### Medium Priority (Nice to Fix - Enhancement)

${(() => {
  const medium = [];
  Object.entries(auditData.files).forEach(([fileName, fileData]) => {
    if (fileData.totalScore >= 90 && fileData.totalScore < 95) {
      medium.push({ fileName, score: fileData.totalScore, violations: fileData.violations.length });
    }
  });
  
  if (medium.length === 0) return '✅ No medium priority issues';
  
  return `${medium.length} files in this category`;
})()}

---

## 📈 LAYER-SPECIFIC REMEDIATION

${LAYERS.map(layer => {
  const layerData = auditData.layerScores[layer.key];
  const avgScore = layerData.score / layerData.filesAudited;
  
  if (avgScore >= 95) return null;
  
  const filesNeedingWork = layerData.violations.slice(0, 10);
  
  return `### Layer ${layer.num}: ${layer.name} (${avgScore.toFixed(1)}/100)

**Status:** ${avgScore >= 90 ? '⚠️ Needs Minor Fixes' : '❌ Needs Major Fixes'}  
**Files Affected:** ${layerData.violations.length}

**Top Files Needing Work:**
${filesNeedingWork.map((item, i) => `${i + 1}. ${item.file} - ${item.violations.join(', ')}`).join('\n')}
`;
}).filter(Boolean).join('\n---\n\n')}

---

## 🎯 COMPLETION TARGETS

### Phase 1: Critical Fixes (Week 1-2)
- [ ] Fix all files scoring < 80/100
- [ ] Address all Layer 5 (i18n) violations
- [ ] Fix all Layer 1 (UI) critical issues

### Phase 2: Quality Improvements (Week 3-4)
- [ ] Bring all files to ≥85/100
- [ ] Address all Layer 2 (Data Hooks) issues
- [ ] Fix all Layer 6 (Accessibility) violations

### Phase 3: Enhancement (Week 5-6)
- [ ] Bring all files to ≥90/100
- [ ] Address Layer 7 (Realtime) gaps
- [ ] Fix Layer 10 (Auth) integration issues

### Phase 4: Excellence (Week 7-8)
- [ ] Achieve ≥95/100 on all files
- [ ] Zero violations across all layers
- [ ] Production certification

---

## 🏆 CERTIFICATION CRITERIA

For **A+ (100% Production Ready)** certification, the application must achieve:

- ✅ All 221 files scoring ≥95/100
- ✅ Zero critical violations
- ✅ Layer 1-6 at 100%
- ✅ Layer 7-12 at ≥90%
- ✅ Full i18n coverage (Layer 5: 100%)
- ✅ Full accessibility compliance (Layer 6: 100%)
- ✅ Complete Supabase integration (Layers 2-4: 100%)
- ✅ Type safety throughout (Layer 12: ≥95%)

**Current Status:** ${auditData.summary.totalScore / Object.keys(auditData.files).length >= 95 ? '✅ CERTIFIED' : '⚠️ IN PROGRESS'}

---

## 📊 PROGRESS TRACKING

| Milestone | Target | Current | Status |
|-----------|--------|---------|--------|
| Files ≥95% | 221 | ${auditData.summary.perfect} | ${auditData.summary.perfect === 221 ? '✅' : '⏳'} |
| Files ≥90% | 221 | ${auditData.summary.perfect + auditData.summary.passing} | ${auditData.summary.perfect + auditData.summary.passing >= 221 ? '✅' : '⏳'} |
| Files ≥80% | 221 | ${221 - auditData.summary.failing} | ${auditData.summary.failing === 0 ? '✅' : '⏳'} |
| Zero Violations | 0 | ${auditData.violations.length} | ${auditData.violations.length === 0 ? '✅' : '⏳'} |

---

**Last Updated:** ${new Date().toISOString()}  
**Next Audit:** Scheduled after Phase 1 completion  
**Maintained By:** Dragonfly26.00 Development Team
`;

// Write to file
const outputPath = path.join(process.cwd(), 'docs/COMPLETE_MODULE_CHECKLIST_2025_01_20.md');
fs.writeFileSync(outputPath, markdown);

console.log(`✅ Complete checklist generated: ${outputPath}`);
console.log(`📊 Total files: ${Object.keys(auditData.files).length}`);
console.log(`📋 Total violations: ${auditData.violations.length}`);
console.log(`🎯 Files needing work: ${auditData.summary.failing}`);
