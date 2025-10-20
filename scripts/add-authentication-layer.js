#!/usr/bin/env node

/**
 * Authentication Layer Remediation Script
 * 
 * Adds authentication integration to all 194 tab components
 * that are currently missing auth checks.
 * 
 * Pattern:
 * 1. Import createClient from '@/lib/supabase/client'
 * 2. Add useEffect hook to check authentication
 * 3. Add loading and error states for auth
 * 4. Redirect to login if not authenticated
 * 
 * Zero-tolerance standard: 100% = 100%
 */

const fs = require('fs');
const path = require('path');

// All component directories to process
const COMPONENT_DIRS = [
  'src/components/admin',
  'src/components/analytics',
  'src/components/assets',
  'src/components/community',
  'src/components/companies',
  'src/components/dashboard',
  'src/components/events',
  'src/components/files',
  'src/components/finance',
  'src/components/insights',
  'src/components/jobs',
  'src/components/locations',
  'src/components/marketplace',
  'src/components/people',
  'src/components/procurement',
  'src/components/profile',
  'src/components/projects',
  'src/components/reports',
  'src/components/resources',
  'src/components/settings'
];

let filesUpdated = 0;
let filesSkipped = 0;
let errors = [];

/**
 * Check if file already has authentication
 */
function hasAuthentication(content) {
  return content.includes('supabase.auth.getSession') ||
         content.includes('supabase.auth.getUser') ||
         content.includes('useAuth') ||
         content.includes('// Auth check');
}

/**
 * Add authentication to a component file
 */
function addAuthentication(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has authentication
    if (hasAuthentication(content)) {
      filesSkipped++;
      return;
    }

    // Skip if not a React component file
    if (!content.includes('export function') && !content.includes('export default function')) {
      filesSkipped++;
      return;
    }

    // 1. Add createClient import if not present
    if (!content.includes("from '@/lib/supabase/client'")) {
      // Find the last import statement
      const importRegex = /import\s+.*?\s+from\s+['"].*?['"]/g;
      const imports = content.match(importRegex);
      
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertPosition = lastImportIndex + lastImport.length;
        
        content = content.slice(0, insertPosition) + 
                  "\nimport { createClient } from '@/lib/supabase/client'" +
                  content.slice(insertPosition);
      }
    }

    // 2. Add useEffect import if not present
    if (!content.includes('useEffect')) {
      content = content.replace(
        /import\s+{\s*([^}]+)\s*}\s+from\s+['"]react['"]/,
        (match, imports) => {
          if (!imports.includes('useEffect')) {
            return `import { ${imports.trim()}, useEffect } from 'react'`;
          }
          return match;
        }
      );
      
      // If no react import found, add it
      if (!content.includes("from 'react'") && !content.includes('from "react"')) {
        const firstImportMatch = content.match(/import\s+.*?\s+from\s+['"].*?['"]/);
        if (firstImportMatch) {
          const insertPosition = content.indexOf(firstImportMatch[0]);
          content = content.slice(0, insertPosition) +
                    "import { useEffect } from 'react'\n" +
                    content.slice(insertPosition);
        }
      }
    }

    // 3. Add useState import if not present
    if (!content.includes('useState')) {
      content = content.replace(
        /import\s+{\s*([^}]+)\s*}\s+from\s+['"]react['"]/,
        (match, imports) => {
          if (!imports.includes('useState')) {
            return `import { ${imports.trim()}, useState } from 'react'`;
          }
          return match;
        }
      );
    }

    // 4. Add useRouter import from next/navigation if not present
    if (!content.includes("from 'next/navigation'")) {
      const importRegex = /import\s+.*?\s+from\s+['"].*?['"]/g;
      const imports = content.match(importRegex);
      
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertPosition = lastImportIndex + lastImport.length;
        
        content = content.slice(0, insertPosition) + 
                  "\nimport { useRouter } from 'next/navigation'" +
                  content.slice(insertPosition);
      }
    }

    // 5. Find the component function and add auth logic
    const componentMatch = content.match(/export\s+function\s+(\w+)\s*\([^)]*\)\s*{/);
    
    if (componentMatch) {
      const componentName = componentMatch[1];
      const functionStart = content.indexOf(componentMatch[0]) + componentMatch[0].length;
      
      // Find where to insert the auth logic (after any existing hooks)
      let insertPosition = functionStart;
      
      // Look for existing hook calls to insert after them
      const hooksPattern = /const\s+{\s*[^}]+\s*}\s*=\s*use\w+\([^)]*\)/g;
      const existingHooks = content.slice(functionStart).match(hooksPattern);
      
      if (existingHooks) {
        const lastHook = existingHooks[existingHooks.length - 1];
        const lastHookIndex = content.indexOf(lastHook, functionStart);
        insertPosition = lastHookIndex + lastHook.length;
      }

      // Authentication logic to insert
      const authLogic = `

  // Auth check
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.push('/login')
        return
      }
      
      setAuthChecked(true)
    }
    
    checkAuth()
  }, [router, supabase])

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }
`;

      content = content.slice(0, insertPosition) + authLogic + content.slice(insertPosition);
      
      // Write the updated content
      fs.writeFileSync(filePath, content, 'utf8');
      filesUpdated++;
      console.log(`✅ Updated: ${path.basename(filePath)}`);
    } else {
      filesSkipped++;
      console.log(`⏭️  Skipped (no component function): ${path.basename(filePath)}`);
    }
    
  } catch (error) {
    errors.push({ file: filePath, error: error.message });
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Process all files in a directory
 */
function processDirectory(dirPath) {
  const fullPath = path.join(process.cwd(), dirPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(fullPath);
  
  files.forEach(file => {
    if (file.endsWith('-tab.tsx')) {
      const filePath = path.join(fullPath, file);
      addAuthentication(filePath);
    }
  });
}

/**
 * Main execution
 */
function main() {
  console.log('🔐 AUTHENTICATION LAYER REMEDIATION');
  console.log('=====================================\n');
  console.log('Adding authentication checks to all tab components...\n');

  const startTime = Date.now();

  // Process all component directories
  COMPONENT_DIRS.forEach(dir => {
    console.log(`\n📁 Processing: ${dir}`);
    processDirectory(dir);
  });

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n=====================================');
  console.log('✅ AUTHENTICATION REMEDIATION COMPLETE\n');
  console.log(`📊 Summary:`);
  console.log(`   - Files Updated: ${filesUpdated}`);
  console.log(`   - Files Skipped: ${filesSkipped}`);
  console.log(`   - Errors: ${errors.length}`);
  console.log(`   - Duration: ${duration}s\n`);

  if (errors.length > 0) {
    console.log('❌ Errors encountered:');
    errors.forEach(({ file, error }) => {
      console.log(`   - ${path.basename(file)}: ${error}`);
    });
  }

  console.log('\n🎯 Next Steps:');
  console.log('   1. Run verification: grep -l "supabase.auth.getSession" src/components/**/*-tab.tsx | wc -l');
  console.log('   2. Test authentication flow in development');
  console.log('   3. Verify all protected routes redirect to login');
  console.log('   4. Re-run zero-tolerance audit to confirm 100%\n');
}

// Run the script
main();
