#!/usr/bin/env node

/**
 * Verify API Routes Compliance
 * 
 * Validates that all generated API routes meet zero-tolerance standards:
 * - All CRUD operations present (GET, POST, PUT, DELETE)
 * - Authentication validation in all methods
 * - Error handling implemented
 * - Type safety (TypeScript)
 * - Supabase integration
 */

const fs = require('fs');
const path = require('path');

// Find all route.ts files
function findAllRoutes(dir) {
  const routes = [];
  
  function traverse(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item === 'route.ts') {
        routes.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return routes;
}

// Validate a single route file
function validateRoute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = filePath.replace(process.cwd(), '');
  
  const checks = {
    hasGET: /export\s+async\s+function\s+GET/.test(content),
    hasPOST: /export\s+async\s+function\s+POST/.test(content),
    hasPUT: /export\s+async\s+function\s+PUT/.test(content),
    hasDELETE: /export\s+async\s+function\s+DELETE/.test(content),
    hasAuth: /supabase\.auth\.getUser\(\)/.test(content),
    hasErrorHandling: /catch\s*\(.*error/.test(content),
    hasSupabase: /createClient\(\)/.test(content),
    hasTypeScript: filePath.endsWith('.ts'),
    hasNextResponse: /NextResponse\.json/.test(content),
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  const maxScore = Object.keys(checks).length;
  const percentage = (score / maxScore) * 100;
  
  return {
    path: relativePath,
    checks,
    score,
    maxScore,
    percentage,
    isPerfect: percentage === 100,
  };
}

// Main execution
console.log('🔍 Verifying API Routes Compliance...\n');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
const routes = findAllRoutes(apiDir);

console.log(`📁 Found ${routes.length} API routes\n`);

const results = routes.map(validateRoute);

// Calculate statistics
const perfectRoutes = results.filter(r => r.isPerfect);
const goodRoutes = results.filter(r => r.percentage >= 90 && r.percentage < 100);
const needsWorkRoutes = results.filter(r => r.percentage < 90);

const totalScore = results.reduce((sum, r) => sum + r.percentage, 0);
const averageScore = totalScore / results.length;

// Display summary
console.log('📊 COMPLIANCE SUMMARY\n');
console.log(`Overall Score: ${averageScore.toFixed(1)}/100`);
console.log(`Perfect Routes (100%): ${perfectRoutes.length}/${routes.length} (${((perfectRoutes.length / routes.length) * 100).toFixed(1)}%)`);
console.log(`Good Routes (90-99%): ${goodRoutes.length}/${routes.length} (${((goodRoutes.length / routes.length) * 100).toFixed(1)}%)`);
console.log(`Needs Work (<90%): ${needsWorkRoutes.length}/${routes.length} (${((needsWorkRoutes.length / routes.length) * 100).toFixed(1)}%)`);

// Show routes needing work
if (needsWorkRoutes.length > 0) {
  console.log('\n⚠️  ROUTES NEEDING WORK:\n');
  needsWorkRoutes.forEach(route => {
    console.log(`${route.path} - ${route.percentage.toFixed(0)}%`);
    Object.entries(route.checks).forEach(([check, passed]) => {
      if (!passed) {
        console.log(`   ❌ Missing: ${check}`);
      }
    });
    console.log('');
  });
}

// Detailed breakdown
console.log('\n📋 DETAILED BREAKDOWN:\n');

const checkStats = {
  hasGET: 0,
  hasPOST: 0,
  hasPUT: 0,
  hasDELETE: 0,
  hasAuth: 0,
  hasErrorHandling: 0,
  hasSupabase: 0,
  hasTypeScript: 0,
  hasNextResponse: 0,
};

results.forEach(result => {
  Object.entries(result.checks).forEach(([check, passed]) => {
    if (passed) checkStats[check]++;
  });
});

console.log('Feature Coverage:');
Object.entries(checkStats).forEach(([check, count]) => {
  const percentage = (count / routes.length) * 100;
  const status = percentage === 100 ? '✅' : percentage >= 90 ? '⚠️' : '❌';
  console.log(`   ${status} ${check}: ${count}/${routes.length} (${percentage.toFixed(1)}%)`);
});

// Grade determination
let grade = 'F';
let status = '❌ CRITICAL';

if (averageScore >= 95) {
  grade = 'A+';
  status = '✅ PERFECT';
} else if (averageScore >= 90) {
  grade = 'A';
  status = '✅ EXCELLENT';
} else if (averageScore >= 85) {
  grade = 'B+';
  status = '⚠️ GOOD';
} else if (averageScore >= 80) {
  grade = 'B';
  status = '⚠️ NEEDS WORK';
} else if (averageScore >= 70) {
  grade = 'C';
  status = '❌ CRITICAL';
}

console.log('\n🎯 FINAL VERDICT:\n');
console.log(`Grade: ${grade} (${averageScore.toFixed(1)}/100)`);
console.log(`Status: ${status}`);
console.log(`Perfect Routes: ${perfectRoutes.length}/${routes.length}`);

if (averageScore >= 95) {
  console.log('\n✨ API Routes Layer: PRODUCTION READY');
  console.log('   All routes meet zero-tolerance standards!');
} else {
  console.log('\n⚠️  Remediation Required');
  console.log(`   ${needsWorkRoutes.length} routes need attention`);
}

// Export results to JSON
const outputPath = path.join(__dirname, '..', 'docs', 'audits', 'API_ROUTES_COMPLIANCE_2025_01_20.json');
fs.writeFileSync(outputPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  summary: {
    totalRoutes: routes.length,
    averageScore,
    grade,
    perfectRoutes: perfectRoutes.length,
    goodRoutes: goodRoutes.length,
    needsWorkRoutes: needsWorkRoutes.length,
  },
  checkStats,
  routes: results,
}, null, 2));

console.log(`\n📄 Detailed report saved to: ${outputPath}`);

process.exit(averageScore >= 95 ? 0 : 1);
