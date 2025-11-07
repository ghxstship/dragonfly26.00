#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const hooksDir = path.join(__dirname, '../src/hooks');

// Hooks that need refresh functions added
const hooksToFix = [
  // Intelligence Hub
  'use-analytics-data.ts',
  'use-insights-data.ts',
  'use-reports-data.ts',
  
  // Events Module (use-events-data.ts)
  // Dashboard Module (use-dashboard-data.ts)
  // Finance Module (use-finance-data.ts)
];

// Individual hook functions within files
const individualHooksToFix = {
  'use-events-data.ts': ['useEvents', 'useRunOfShow', 'useBookings', 'useIncidents', 'useTours', 'useShipments'],
  'use-finance-data.ts': ['useBudgets', 'useTransactions', 'useInvoices', 'usePayroll', 'useBudgetVariance', 'useGLCodes'],
  'use-dashboard-data.ts': ['useDashboardData', 'useMyAgenda', 'useMyTasks', 'useMyExpenses', 'useMyJobs', 'useMyAssets', 'useMyOrders', 'useMyAdvances', 'useMyReports', 'useMyFiles', 'useMyTravel']
};

function addRefreshToSimpleHook(content, hookName) {
  // Pattern: export function hookName() {
  //   const [data, setData] = useState...
  //   const [loading, setLoading] = useState...
  //   const supabase = createClient()
  //
  //   useEffect(() => {
  //     async function fetchData() { ... }
  //     fetchData()
  //   }, [])
  //
  //   return { data, loading, error }
  // }

  // Find the fetch function name
  const fetchFunctionMatch = content.match(/async function (fetch\w+)\(\)/);
  if (!fetchFunctionMatch) {
    console.log(`  ⚠️  Could not find fetch function in ${hookName}`);
    return content;
  }
  const fetchFunctionName = fetchFunctionMatch[1];

  // Find the return statement and add refresh
  const returnRegex = new RegExp(`return \\{ ([^}]+) \\}`, 'g');
  
  return content.replace(returnRegex, (match, returnProps) => {
    // Check if refresh already exists
    if (returnProps.includes('refresh')) {
      return match;
    }
    
    // Add refresh function
    return `const refresh = async () => {
    await ${fetchFunctionName}()
  }

  return { ${returnProps}, refresh }`;
  });
}

function addRefreshToMultiHook(content, hookName) {
  // For hooks with multiple exported functions, we need to:
  // 1. Find each function
  // 2. Extract its fetch function name
  // 3. Add refresh to its return statement

  const functionRegex = new RegExp(`export function ${hookName}\\([^)]*\\) \\{[\\s\\S]*?^\\}`, 'gm');
  
  return content.replace(functionRegex, (hookContent) => {
    // Find the fetch function name
    const fetchFunctionMatch = hookContent.match(/async function (fetch\w+)\(\)/);
    if (!fetchFunctionMatch) {
      console.log(`  ⚠️  Could not find fetch function in ${hookName}`);
      return hookContent;
    }
    const fetchFunctionName = fetchFunctionMatch[1];

    // Find the return statement
    const returnRegex = /return \{ ([^}]+) \}/;
    const returnMatch = hookContent.match(returnRegex);
    
    if (!returnMatch) {
      console.log(`  ⚠️  Could not find return statement in ${hookName}`);
      return hookContent;
    }

    const returnProps = returnMatch[1];
    
    // Check if refresh already exists
    if (returnProps.includes('refresh')) {
      return hookContent;
    }

    // Add refresh function before return
    return hookContent.replace(returnRegex, `const refresh = async () => {
    await ${fetchFunctionName}()
  }

  return { ${returnProps}, refresh }`);
  });
}

function fixDashboardDataRefetch(content) {
  // Replace the empty refetch with a real refresh function
  return content.replace(
    /return \{ data, loading, error, refetch: \(\) => \{\} \}/,
    `const refresh = async () => {
    if (workspaceId) {
      const { data: stats, error: statsError } = await supabase
        .rpc('get_workspace_dashboard', {
          p_workspace_id: workspaceId
        })
      if (!statsError && stats) {
        setData(stats)
      }
    }
  }

  return { data, loading, error, refresh }`
  );
}

function processFile(fileName) {
  const filePath = path.join(hooksDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${fileName}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  console.log(`\n📝 Processing: ${fileName}`);

  // Special case for dashboard data
  if (fileName === 'use-dashboard-data.ts') {
    const newContent = fixDashboardDataRefetch(content);
    if (newContent !== content) {
      content = newContent;
      modified = true;
      console.log(`  ✅ Fixed useDashboardData refetch`);
    }
  }

  // Handle files with multiple hook functions
  if (individualHooksToFix[fileName]) {
    for (const hookName of individualHooksToFix[fileName]) {
      if (hookName === 'useDashboardData') continue; // Already handled above
      
      const newContent = addRefreshToMultiHook(content, hookName);
      if (newContent !== content) {
        content = newContent;
        modified = true;
        console.log(`  ✅ Added refresh to ${hookName}`);
      }
    }
  }
  // Handle simple single-function hooks
  else {
    const hookNameMatch = fileName.match(/use-(.+)\.ts/);
    if (hookNameMatch) {
      const hookName = hookNameMatch[1].split('-').map((word, i) => 
        i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      ).join('');
      const fullHookName = 'use' + hookName.charAt(0).toUpperCase() + hookName.slice(1);
      
      const newContent = addRefreshToSimpleHook(content, fullHookName);
      if (newContent !== content) {
        content = newContent;
        modified = true;
        console.log(`  ✅ Added refresh function`);
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  💾 Saved changes`);
  } else {
    console.log(`  ℹ️  No changes needed`);
  }
}

console.log('🚀 Adding refresh functions to hooks...\n');

// Process simple hooks
for (const hookFile of hooksToFix) {
  processFile(hookFile);
}

// Process multi-function hooks
for (const hookFile of Object.keys(individualHooksToFix)) {
  processFile(hookFile);
}

console.log('\n✅ Complete! All hooks now have refresh functions.\n');
