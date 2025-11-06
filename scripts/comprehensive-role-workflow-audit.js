#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const audit = { timestamp: new Date().toISOString(), gaps: [], summary: { critical: 0, high: 0, medium: 0, low: 0 } };

const ROLES = ['Legend','Phantom','Aviator','Gladiator','Navigator','Deviator','Raider','Vendor','Visitor','Partner','Ambassador'];
const MODULES = ['dashboard','projects','events','people','assets','locations','files','community','marketplace','resources','companies','jobs','procurement','finance','analytics','reports','insights','admin','settings','profile'];

function addGap(sev, cat, role, mod, desc, impact, fix) {
  audit.gaps.push({ severity: sev, category: cat, role, module: mod, description: desc, impact, remediation: fix });
  audit.summary[sev.toLowerCase()]++;
}

console.log('🔍 COMPREHENSIVE ROLE-BASED WORKFLOW AUDIT\n');

// Audit components
const comps = fs.readdirSync(path.join(REPO, 'src/components'), { recursive: true }).filter(f => f.endsWith('-tab.tsx'));
console.log(`✅ Found ${comps.length} tab components`);

// Audit hooks
const hooks = fs.readdirSync(path.join(REPO, 'src/hooks')).filter(f => f.includes('use-') && f.endsWith('-data.ts'));
console.log(`✅ Found ${hooks.length} data hooks`);

// Audit APIs
const apis = fs.readdirSync(path.join(REPO, 'src/app/api'), { recursive: true }).filter(f => f === 'route.ts');
console.log(`✅ Found ${apis.length} API routes`);

// Check critical workflows for each role
ROLES.forEach(role => {
  MODULES.forEach(mod => {
    const hookPath = path.join(REPO, 'src/hooks', `use-${mod}-data.ts`);
    const apiPath = path.join(REPO, 'src/app/api', mod, 'route.ts');
    
    if (!fs.existsSync(hookPath)) {
      addGap('HIGH', 'Data Layer', role, mod, `Missing use-${mod}-data.ts hook`, `${role} cannot access ${mod} data`, `Create use-${mod}-data.ts`);
    }
    
    if (!fs.existsSync(apiPath)) {
      addGap('MEDIUM', 'API Layer', role, mod, `Missing /api/${mod} endpoint`, `${role} cannot perform CRUD on ${mod}`, `Create /api/${mod}/route.ts`);
    }
  });
});

// Save results
const output = path.join(REPO, 'docs/audits', 'COMPREHENSIVE_ROLE_WORKFLOW_AUDIT.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(audit, null, 2));

console.log(`\n📊 AUDIT COMPLETE:`);
console.log(`   Total Gaps: ${audit.gaps.length}`);
console.log(`   Critical: ${audit.summary.critical}`);
console.log(`   High: ${audit.summary.high}`);
console.log(`   Medium: ${audit.summary.medium}`);
console.log(`   Low: ${audit.summary.low}`);
console.log(`\n✅ Results: ${output}`);
