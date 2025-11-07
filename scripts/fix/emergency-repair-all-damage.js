const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('EMERGENCY REPAIR - FIXING ALL DAMAGE');
console.log('='.repeat(80));
console.log('');

const report = JSON.parse(fs.readFileSync('FULL_DAMAGE_AUDIT_REPORT.json', 'utf8'));

let totalFixed = 0;
let filesFixed = 0;

report.broken.forEach(item => {
  try {
    const fullPath = path.join(process.cwd(), item.path);
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    let fixCount = 0;
    
    console.log(`\n🔧 Fixing: ${item.file}`);
    
    // Fix 1: Double braces {{...}} -> {...}
    const hasSyntaxErrors = item.issues.some(i => i.type === 'syntaxError');
    if (hasSyntaxErrors) {
      // Fix double braces in JSX
      const before = content;
      content = content.replace(/\{\{([^}]+)\}\}/g, '{$1}');
      if (content !== before) {
        const count = (before.match(/\{\{[^}]+\}\}/g) || []).length;
        console.log(`   ✅ Fixed ${count} double-brace syntax errors`);
        fixCount += count;
        modified = true;
      }
    }
    
    // Fix 2: Invalid prop values like {#247}, {1.2K}, {3,456}
    const hasBrokenProps = item.issues.some(i => i.type === 'brokenProps');
    if (hasBrokenProps) {
      // Fix {#247} -> {"#247"}
      content = content.replace(/value=\{#(\d+)\}/g, 'value="#$1"');
      // Fix {1.2K} -> {"1.2K"}
      content = content.replace(/value=\{([\d\.]+[KMB])\}/g, 'value="$1"');
      // Fix {3,456} -> {3456}
      content = content.replace(/value=\{(\d+),(\d+)\}/g, 'value={$1$2}');
      console.log(`   ✅ Fixed broken prop values`);
      fixCount++;
      modified = true;
    }
    
    // Fix 3: Unquoted string props like label={Today's News}
    const hasTypeErrors = item.issues.some(i => i.type === 'typeError');
    if (hasTypeErrors) {
      // Fix unquoted strings in label/description props
      // This is tricky - need to be careful with regex
      // Match: label={SomeText} where SomeText doesn't start with t( or a variable
      content = content.replace(/label=\{([A-Z][a-zA-Z\s'&;]+)\}/g, 'label="$1"');
      content = content.replace(/description=\{([A-Z][a-zA-Z\s'&;]+)\}/g, 'description="$1"');
      console.log(`   ✅ Fixed unquoted string props`);
      fixCount++;
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      filesFixed++;
      totalFixed += fixCount;
      console.log(`   ✅ ${item.file} repaired (${fixCount} fixes)`);
    }
    
  } catch (error) {
    console.log(`   ❌ Failed to fix ${item.file}: ${error.message}`);
  }
});

console.log('');
console.log('='.repeat(80));
console.log('REPAIR COMPLETE');
console.log('='.repeat(80));
console.log('');
console.log(`✅ Files Repaired: ${filesFixed}/${report.broken.length}`);
console.log(`✅ Total Fixes Applied: ${totalFixed}`);
console.log('');
console.log('NOTE: StatCard removals need manual review/revert');
console.log('      Run verification to confirm all syntax errors fixed');
console.log('');
