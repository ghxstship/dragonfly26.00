#!/usr/bin/env node

/**
 * Fix malformed TabComponentProps imports and function signatures
 * These files have the import statement inside the interface block
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files with the malformed pattern
const result = execSync(
  `grep -l "interface.*TabProps" src/components/**/*.tsx`,
  { cwd: path.join(__dirname, '..'), encoding: 'utf-8' }
);

const files = result.trim().split('\n').filter(Boolean);

console.log(`Found ${files.length} files to fix\n`);

let fixed = 0;

files.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  const original = content;
  
  // Pattern 1: Fix the malformed interface/import
  const malformedPattern = /interface \w+TabProps \{\s*data\?: any\[\]\s*loading\?: boolean\s*import type \{ TabComponentProps \} from ["']@\/types["']\s*\}/gs;
  
  if (malformedPattern.test(content)) {
    // Remove the malformed interface
    content = content.replace(malformedPattern, '');
    
    // Add the import at the top if not already there
    if (!content.includes('import type { TabComponentProps }')) {
      const lastImport = content.lastIndexOf('import');
      const nextNewline = content.indexOf('\n', lastImport + 100);
      content = content.slice(0, nextNewline) +
               '\nimport type { TabComponentProps } from "@/types"' +
               content.slice(nextNewline);
    }
    
    // Fix the function signature
    const functionPattern = /export function \w+Tab\(\{ data, loading \}: \w+TabProps\)/;
    const functionMatch = content.match(functionPattern);
    
    if (functionMatch) {
      const functionName = functionMatch[0].match(/export function (\w+Tab)/)[1];
      content = content.replace(
        functionPattern,
        `export function ${functionName}({ workspaceId, moduleId, tabSlug }: TabComponentProps)`
      );
    }
    
    // Fix the data fetching logic
    const dataFetchPattern = /const params = useParams\(\)\s*const workspaceId = params\?\.workspaceId as string\s*\/\/ Fetch data if not provided\s*const \{ data: hookData, loading: hookLoading \} = useModuleData\([^)]+\)\s*const \[createDialogOpen[^\]]+\]\s*const fetchedData = data \|\| hookData\s*const fetchLoading = loading !== undefined \? loading : hookLoading\s*const items = fetchedData \|\| \[\]\s*const isLoading = loading \|\| fetchLoading/gs;
    
    if (dataFetchPattern.test(content)) {
      content = content.replace(
        dataFetchPattern,
        (match) => {
          const moduleDataMatch = match.match(/useModuleData\(([^,]+),\s*'([^']+)',\s*'([^']+)'\)/);
          if (moduleDataMatch) {
            const [, , module, tab] = moduleDataMatch;
            return `// Fetch data\n  const { data: hookData, loading: hookLoading } = useModuleData(workspaceId, '${module}', '${tab}')\n  const [createDialogOpen, setCreateDialogOpen] = useState(false)\n  \n  const items = hookData || []\n  const isLoading = hookLoading`;
          }
          return match;
        }
      );
    }
    
    console.log(`✅ Fixed: ${filePath}`);
    fs.writeFileSync(fullPath, content, 'utf-8');
    fixed++;
  }
});

console.log(`\n✅ Fixed ${fixed} files`);
