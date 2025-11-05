#!/usr/bin/env node

/**
 * Add comprehensive error handling to data hooks
 * Wraps async operations in try-catch blocks with toast notifications
 */

const fs = require('fs');
const path = require('path');

const HOOKS_TO_FIX = [
  'use-assets-data.ts',
  'use-events-data.ts',
  'use-finance-data.ts',
  'use-people-data.ts',
  'use-projects-data.ts'
];

const HOOKS_DIR = path.join(__dirname, '..', 'src', 'hooks');

console.log('🔧 Adding error handling to data hooks...\n');

HOOKS_TO_FIX.forEach(hookFile => {
  const filePath = path.join(HOOKS_DIR, hookFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${hookFile} - File not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if toast is already imported
  if (!content.includes("from 'sonner'")) {
    // Add toast import after other imports
    content = content.replace(
      /(import.*from ['"]@\/lib\/supabase\/client['"])/,
      "$1\nimport { toast } from 'sonner'"
    );
  }

  // Add try-catch to async fetch functions that don't have it
  // Pattern: async function fetchXxx() { ... }
  const functionPattern = /(async function fetch\w+\(\)[^{]*{)([\s\S]*?)(^\s{4}}$)/gm;
  
  content = content.replace(functionPattern, (match, funcStart, funcBody, funcEnd) => {
    // Skip if already has try-catch
    if (funcBody.trim().startsWith('try {')) {
      return match;
    }
    
    // Wrap in try-catch
    const indentedBody = funcBody.split('\n').map(line => '  ' + line).join('\n');
    return `${funcStart}
      try {${indentedBody}
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data. Please try again.');
        setLoading(false);
      }
${funcEnd}`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`✓ ${hookFile} - Error handling added`);
});

console.log('\n✅ Error handling remediation complete!');
