#!/usr/bin/env node

/**
 * Add authentication to the final 19 files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get list of files missing auth
const filesWithoutAuth = execSync(
  'for file in $(find src/components -name "*-tab.tsx"); do if ! grep -q "supabase.auth.getSession" "$file"; then echo "$file"; fi; done',
  { cwd: process.cwd(), encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

console.log(`🔐 Adding authentication to ${filesWithoutAuth.length} remaining files...\n`);

let updated = 0;

filesWithoutAuth.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has auth
    if (content.includes('supabase.auth.getSession') || content.includes('authChecked')) {
      console.log(`⏭️  Already has auth: ${path.basename(filePath)}`);
      return;
    }

    // Add imports if needed
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
    }

    // Add createClient import if not present
    if (!content.includes("from '@/lib/supabase/client'")) {
      const importMatch = content.match(/import\s+.*?\s+from\s+['"].*?['"]/g);
      if (importMatch && importMatch.length > 0) {
        const lastImport = importMatch[importMatch.length - 1];
        const insertPos = content.lastIndexOf(lastImport) + lastImport.length;
        content = content.slice(0, insertPos) + 
                  "\nimport { createClient } from '@/lib/supabase/client'" +
                  content.slice(insertPos);
      }
    }

    // Add useRouter from next/navigation if not already imported
    const hasNextNavRouter = content.includes("from 'next/navigation'") && content.includes('useRouter');
    const hasI18nRouter = content.includes("from '@/i18n/navigation'") && content.includes('useRouter');
    
    if (!hasNextNavRouter && !hasI18nRouter) {
      const importMatch = content.match(/import\s+.*?\s+from\s+['"].*?['"]/g);
      if (importMatch && importMatch.length > 0) {
        const lastImport = importMatch[importMatch.length - 1];
        const insertPos = content.lastIndexOf(lastImport) + lastImport.length;
        content = content.slice(0, insertPos) + 
                  "\nimport { useRouter } from 'next/navigation'" +
                  content.slice(insertPos);
      }
    }

    // Find component function
    const componentMatch = content.match(/export\s+(function|default\s+function)\s+(\w+)\s*\([^)]*\)\s*[:{]/);
    
    if (!componentMatch) {
      console.log(`❌ No component function found: ${path.basename(filePath)}`);
      return;
    }

    const functionStart = content.indexOf(componentMatch[0]) + componentMatch[0].length;
    
    // Find where to insert (after first few hooks)
    let insertPos = functionStart;
    const afterFunction = content.slice(functionStart);
    const hookMatches = afterFunction.match(/const\s+[^=]+=\s+use\w+\([^)]*\)/g);
    
    if (hookMatches && hookMatches.length > 0) {
      // Insert after first 2-3 hooks
      const hooksToSkip = Math.min(3, hookMatches.length);
      let lastHookPos = 0;
      for (let i = 0; i < hooksToSkip; i++) {
        lastHookPos = afterFunction.indexOf(hookMatches[i], lastHookPos) + hookMatches[i].length;
      }
      insertPos = functionStart + lastHookPos;
    }

    const routerVar = hasI18nRouter ? 'routerNav' : 'router';
    const routerImport = hasI18nRouter ? '' : `const ${routerVar} = useRouter()\n  `;

    const authCode = `

  // Auth check
  ${routerImport}const [authChecked, setAuthChecked] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        ${routerVar}.push('/login')
        return
      }
      
      setAuthChecked(true)
    }
    
    checkAuth()
  }, [${routerVar}, supabase])

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

    content = content.slice(0, insertPos) + authCode + content.slice(insertPos);
    
    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
    console.log(`✅ Updated: ${path.basename(filePath)}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
  }
});

console.log(`\n✅ Complete! Updated ${updated}/${filesWithoutAuth.length} files`);
