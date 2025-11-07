#!/usr/bin/env node

/**
 * ADD ERROR HANDLING TO DATA HOOKS
 * Adds comprehensive try-catch blocks and user-friendly error messages
 * to the 5 hooks identified as missing error handling
 */

const fs = require('fs');
const path = require('path');

const HOOKS_DIR = path.join(__dirname, '..', 'src', 'hooks');

const HOOKS_TO_FIX = [
  'use-assets-data.ts',
  'use-events-data.ts',
  'use-finance-data.ts',
  'use-people-data.ts',
  'use-projects-data.ts'
];

console.log('🔧 ADDING ERROR HANDLING TO DATA HOOKS\n');

HOOKS_TO_FIX.forEach(hookFile => {
  const hookPath = path.join(HOOKS_DIR, hookFile);
  
  if (!fs.existsSync(hookPath)) {
    console.log(`⚠️  ${hookFile} - NOT FOUND, skipping`);
    return;
  }
  
  let content = fs.readFileSync(hookPath, 'utf-8');
  
  // Check if already has try-catch
  if (content.includes('try {') && content.includes('catch')) {
    console.log(`✓ ${hookFile} - Already has error handling`);
    return;
  }
  
  // Add toast import if not present
  if (!content.includes('import { toast }')) {
    const importIndex = content.indexOf("import { useQuery");
    if (importIndex !== -1) {
      content = content.slice(0, importIndex) + 
        "import { toast } from 'sonner'\n" +
        content.slice(importIndex);
    }
  }
  
  // Find all fetch functions and wrap in try-catch
  const fetchFunctionRegex = /async function (fetch\w+)\([^)]*\) \{[\s\S]*?\n\}/g;
  
  content = content.replace(fetchFunctionRegex, (match) => {
    // Skip if already has try-catch
    if (match.includes('try {')) return match;
    
    // Extract function signature and body
    const signatureMatch = match.match(/async function (\w+)\(([^)]*)\)/);
    if (!signatureMatch) return match;
    
    const functionName = signatureMatch[1];
    const params = signatureMatch[2];
    
    // Extract function body (everything after the opening brace)
    const bodyStart = match.indexOf('{') + 1;
    const bodyEnd = match.lastIndexOf('}');
    const body = match.slice(bodyStart, bodyEnd).trim();
    
    // Create new function with try-catch
    return `async function ${functionName}(${params}) {
  try {
    ${body}
  } catch (error) {
    console.error('[${functionName}] Error:', error);
    toast.error('Failed to load data. Please try again.');
    throw error;
  }
}`;
  });
  
  // Write back
  fs.writeFileSync(hookPath, content);
  console.log(`✅ ${hookFile} - Error handling added`);
});

console.log('\n✅ Error handling remediation complete!');
