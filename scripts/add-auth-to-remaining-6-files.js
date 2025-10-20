#!/usr/bin/env node

/**
 * Add authentication to the remaining 6 files that were skipped
 */

const fs = require('fs');
const path = require('path');

const FILES_TO_UPDATE = [
  'src/components/finance/finance-approvals-tab.tsx',
  'src/components/members/create-tab.tsx',
  'src/components/members/invite-tab.tsx',
  'src/components/assets/assets-approvals-tab.tsx',
  'src/components/assets/catalog-tab.tsx',
  'src/components/assets/assets-advances-tab.tsx'
];

function addAuthToFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already has auth
  if (content.includes('supabase.auth.getSession') || content.includes('authChecked')) {
    console.log(`⏭️  Already has auth: ${path.basename(filePath)}`);
    return false;
  }

  // Add useEffect if not present
  if (!content.includes('useEffect')) {
    if (content.includes("from 'react'") || content.includes('from "react"')) {
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
  }

  // Add useState if not present
  if (!content.includes('useState')) {
    if (content.includes("from 'react'") || content.includes('from "react"')) {
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
  }

  // Add useRouter if not present
  if (!content.includes("from 'next/navigation'")) {
    const lastImportMatch = content.match(/import\s+.*?\s+from\s+['"].*?['"]/g);
    if (lastImportMatch && lastImportMatch.length > 0) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      const insertPos = content.lastIndexOf(lastImport) + lastImport.length;
      content = content.slice(0, insertPos) + 
                "\nimport { useRouter } from 'next/navigation'" +
                content.slice(insertPos);
    }
  }

  // Find the component function
  const componentMatch = content.match(/export\s+function\s+(\w+)\s*\([^)]*\)\s*{/);
  
  if (!componentMatch) {
    console.log(`❌ No component function found: ${path.basename(filePath)}`);
    return false;
  }

  const functionStart = content.indexOf(componentMatch[0]) + componentMatch[0].length;
  
  // Find where to insert (after first hook or at start)
  let insertPos = functionStart;
  const afterFunction = content.slice(functionStart);
  const firstHookMatch = afterFunction.match(/const\s+[^=]+=\s+use\w+\([^)]*\)/);
  
  if (firstHookMatch) {
    insertPos = functionStart + afterFunction.indexOf(firstHookMatch[0]) + firstHookMatch[0].length;
  }

  const authCode = `

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

  content = content.slice(0, insertPos) + authCode + content.slice(insertPos);
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Updated: ${path.basename(filePath)}`);
  return true;
}

console.log('🔐 Adding authentication to remaining 6 files...\n');

let updated = 0;
FILES_TO_UPDATE.forEach(file => {
  if (addAuthToFile(file)) {
    updated++;
  }
});

console.log(`\n✅ Complete! Updated ${updated} files`);
