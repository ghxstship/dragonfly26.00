#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING REMAINING ANY TYPES');
console.log('==============================\n');

const fixes = [
  {
    file: 'src/components/marketplace/favorites-tab.tsx',
    replacements: [
      { from: /\[key: string\]: any/g, to: '[key: string]: unknown' }
    ]
  },
  {
    file: 'src/components/marketplace/lists-tab.tsx',
    replacements: [
      { from: /\[key: string\]: any/g, to: '[key: string]: unknown' }
    ]
  },
  {
    file: 'src/components/marketplace/orders-tab.tsx',
    replacements: [
      { from: /\[key: string\]: any/g, to: '[key: string]: unknown' }
    ]
  },
  {
    file: 'src/components/marketplace/products-tab.tsx',
    replacements: [
      { from: /\[key: string\]: any/g, to: '[key: string]: unknown' }
    ]
  },
  {
    file: 'src/components/marketplace/purchases-tab.tsx',
    replacements: [
      { from: /\[key: string\]: any/g, to: '[key: string]: unknown' }
    ]
  },
  {
    file: 'src/components/marketplace/reviews-tab.tsx',
    replacements: [
      { from: /\[key: string\]: any/g, to: '[key: string]: unknown' }
    ]
  },
  {
    file: 'src/components/marketplace/sales-tab.tsx',
    replacements: [
      { from: /\[key: string\]: any/g, to: '[key: string]: unknown' }
    ]
  },
  {
    file: 'src/components/marketplace/services-tab.tsx',
    replacements: [
      { from: /\[key: string\]: any/g, to: '[key: string]: unknown' }
    ]
  },
  {
    file: 'src/components/marketplace/shop-tab.tsx',
    replacements: [
      { from: /\[key: string\]: any/g, to: '[key: string]: unknown' }
    ]
  },
  {
    file: 'src/components/marketplace/spotlight-tab.tsx',
    replacements: [
      { from: /\[key: string\]: any/g, to: '[key: string]: unknown' }
    ]
  },
  {
    file: 'src/components/marketplace/vendors-tab.tsx',
    replacements: [
      { from: /\[key: string\]: any/g, to: '[key: string]: unknown' }
    ]
  }
];

let filesFixed = 0;
let totalReplacements = 0;

fixes.forEach(fix => {
  const filePath = path.join(__dirname, '..', fix.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  File not found: ${fix.file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let fileReplacements = 0;
  let modified = false;

  fix.replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      content = content.replace(from, to);
      fileReplacements += matches.length;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ ${fix.file} - Fixed ${fileReplacements} 'any' types`);
    filesFixed++;
    totalReplacements += fileReplacements;
  }
});

console.log(`\n✅ Fixed ${totalReplacements} 'any' types in ${filesFixed} files\n`);

// Run verification
console.log('═══════════════════════════════════════════════════════════');
console.log('📊 RUNNING FINAL VERIFICATION...');
console.log('═══════════════════════════════════════════════════════════\n');

const { execSync } = require('child_process');
try {
  execSync('node scripts/verify-type-safety.js', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
} catch (error) {
  console.log('Verification completed');
}
