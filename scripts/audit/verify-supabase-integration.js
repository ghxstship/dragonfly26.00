#!/usr/bin/env node

/**
 * VERIFY SUPABASE INTEGRATION
 * Simple, direct verification of Supabase hook integration across all tab components
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function main() {
  console.log('🔍 Verifying Supabase Integration...\n');

  const componentsDir = path.join(__dirname, '../src/components');
  
  // Get all *-tab.tsx files
  const result = execSync(`find ${componentsDir} -name "*-tab.tsx" -type f`, { encoding: 'utf8' });
  const allFiles = result.trim().split('\n').filter(f => f);

  console.log(`📊 Total tab components found: ${allFiles.length}\n`);

  let withHooks = 0;
  let withoutHooks = 0;
  const filesWithoutHooks = [];

  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for any data hook import
    const hasHook = /from ["']@\/hooks\/use-[\w-]+-data["']/.test(content) ||
                    /use[\w]+Data\(/.test(content);
    
    if (hasHook) {
      withHooks++;
    } else {
      withoutHooks++;
      filesWithoutHooks.push(file.replace(componentsDir + '/', ''));
    }
  });

  console.log('✅ Files WITH Supabase hooks:', withHooks);
  console.log('❌ Files WITHOUT Supabase hooks:', withoutHooks);
  console.log(`📈 Integration Rate: ${((withHooks / allFiles.length) * 100).toFixed(1)}%\n`);

  if (filesWithoutHooks.length > 0) {
    console.log('📋 Files needing integration:');
    filesWithoutHooks.forEach(f => console.log(`   - ${f}`));
  } else {
    console.log('🎉 100% SUPABASE INTEGRATION ACHIEVED!');
  }

  console.log('\n' + '='.repeat(80));
  console.log(`COMPLIANCE: ${withoutHooks === 0 ? '✅ PASS' : '❌ FAIL'}`);
  console.log('='.repeat(80));
}

main();
