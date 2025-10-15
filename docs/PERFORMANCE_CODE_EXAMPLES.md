# Performance Optimization Code Examples
Quick reference for implementing performance optimizations.

---

## 1. Remove Force-Dynamic & Add Revalidation

### Before (Slow):
```typescript
// page.tsx
export const dynamic = 'force-dynamic'

export default function Page() {
  return <PageContent />
}
```

### After (Fast):
```typescript
// page.tsx
export const revalidate = 60 // Cache for 60 seconds

export default function Page() {
  return <PageContent />
}
```

**Apply to:** All non-auth pages that don't require real-time data.

---

## 2. Server Component Data Fetching

### Before (Client-Side - Slow):
```typescript
// page.tsx
'use client'
import { useAssets } from '@/hooks/use-assets-data'

export default function AssetsPage({ params }) {
  const { assets, loading } = useAssets(params.workspaceId)
  
  if (loading) return <Spinner />
  
  return <AssetTable data={assets} />
}
```

### After (Server Component - Fast):
```typescript
// page.tsx
import { createServerClient } from '@/lib/supabase/server'

async function getAssets(workspaceId: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('assets')
    .select('id, name, status, location_id, created_at') // Only needed fields
    .eq('workspace_id', workspaceId)
    .order('name', { ascending: true })
    .limit(50)
  
  if (error) throw error
  return data
}

export default async function AssetsPage({ 
  params 
}: { 
  params: { workspaceId: string } 
}) {
  const assets = await getAssets(params.workspaceId)
  
  return <AssetTable initialData={assets} />
}

// components/asset-table.tsx
'use client'
export function AssetTable({ initialData }: { initialData: Asset[] }) {
  const [data, setData] = useState(initialData) // Hydrate with server data
  
  // Optional: Add real-time updates if needed
  // useRealtimeSubscription(...)
  
  return <DataTable data={data} />
}
```

---

## 3. React Query Migration

### Setup (One-time):
```typescript
// lib/react-query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,           // Data fresh for 1 minute
      cacheTime: 5 * 60 * 1000,       // Cache for 5 minutes
      refetchOnWindowFocus: false,    // Don't refetch on tab focus
      refetchOnMount: false,          // Don't refetch on component mount
      refetchOnReconnect: true,       // Refetch on reconnect
      retry: 1,                       // Retry failed requests once
    },
  },
})

// app/layout.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query-client'

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### Before (Manual State - No Caching):
```typescript
// hooks/use-assets-data.ts
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useAssets(workspaceId: string) {
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchAssets() {
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('workspace_id', workspaceId)

      if (!error && data) {
        setAssets(data)
      }
      setLoading(false)
    }

    fetchAssets() // Refetches on every mount!
  }, [workspaceId])

  return { assets, loading }
}
```

### After (React Query - Smart Caching):
```typescript
// hooks/use-assets-data.ts
'use client'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

async function fetchAssets(workspaceId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('assets')
    .select('id, name, status, location_id, created_at') // Selective fields
    .eq('workspace_id', workspaceId)
    .order('name', { ascending: true })
    .limit(50)
  
  if (error) throw error
  return data
}

export function useAssets(workspaceId: string) {
  return useQuery({
    queryKey: ['assets', workspaceId],
    queryFn: () => fetchAssets(workspaceId),
    enabled: !!workspaceId,
    staleTime: 60 * 1000, // Override default if needed
  })
}

// Usage in component:
const { data: assets, isLoading, error } = useAssets(workspaceId)
```

---

## 4. Reduce Real-Time Subscriptions

### Before (Too Many Subscriptions):
```typescript
// Every hook creates a subscription
export function useAssets(workspaceId: string) {
  // ... fetch logic
  
  const channel = supabase
    .channel(`assets:${workspaceId}`)
    .on('postgres_changes', ...)
    .subscribe()  // Subscription 1
}

export function useAssetTransactions(workspaceId: string) {
  // ... fetch logic
  
  const channel = supabase
    .channel(`transactions:${workspaceId}`)
    .on('postgres_changes', ...)
    .subscribe()  // Subscription 2
}

// Result: 10-20+ concurrent WebSocket connections
```

### After (Consolidated Subscriptions):
```typescript
// hooks/use-workspace-realtime.ts
export function useWorkspaceRealtime(workspaceId: string) {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const supabase = createClient()
    
    // Single channel for all workspace updates
    const channel = supabase
      .channel(`workspace:${workspaceId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'assets',
          filter: `workspace_id=eq.${workspaceId}` 
        },
        () => {
          // Invalidate React Query cache
          queryClient.invalidateQueries({ queryKey: ['assets', workspaceId] })
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'asset_transactions',
          filter: `workspace_id=eq.${workspaceId}` 
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['transactions', workspaceId] })
        }
      )
      // Add more tables to same channel
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, queryClient])
}

// Usage: Call once at workspace layout level
export default function WorkspaceLayout({ children }) {
  const workspaceId = useWorkspaceId()
  useWorkspaceRealtime(workspaceId) // One subscription for entire workspace
  
  return <>{children}</>
}
```

### Alternative: Polling Instead of Real-Time
```typescript
// For non-critical data, use polling
export function useAssets(workspaceId: string) {
  return useQuery({
    queryKey: ['assets', workspaceId],
    queryFn: () => fetchAssets(workspaceId),
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 20000,       // Data stale after 20 seconds
  })
}
```

---

## 5. Optimize Supabase Queries

### Before (Over-fetching):
```typescript
const { data } = await supabase
  .from('assets')
  .select('*')  // Fetches ALL columns
  .eq('workspace_id', workspaceId)
```

### After (Selective fetching):
```typescript
const { data } = await supabase
  .from('assets')
  .select('id, name, status, location_id, created_at')  // Only needed fields
  .eq('workspace_id', workspaceId)
  .limit(50)  // Add pagination
```

### Use RPC for Complex Queries:
```sql
-- supabase/migrations/073_workspace_dashboard_rpc.sql
CREATE OR REPLACE FUNCTION get_workspace_dashboard(p_workspace_id UUID)
RETURNS JSON
LANGUAGE sql
STABLE
AS $$
  SELECT json_build_object(
    'assets_count', (SELECT count(*) FROM assets WHERE workspace_id = p_workspace_id),
    'active_projects', (SELECT count(*) FROM productions WHERE workspace_id = p_workspace_id AND status = 'active'),
    'total_personnel', (SELECT count(*) FROM personnel WHERE workspace_id = p_workspace_id AND active = true),
    'pending_approvals', (SELECT count(*) FROM approval_steps WHERE workspace_id = p_workspace_id AND status = 'pending')
  );
$$;
```

```typescript
// Usage - Single query instead of 4 separate queries
const { data } = await supabase.rpc('get_workspace_dashboard', {
  p_workspace_id: workspaceId
})
```

---

## 6. Dynamic Imports for Code Splitting

### Before (Included in main bundle):
```typescript
import { BarChart } from 'recharts'
import { DateRangePicker } from '@/components/date-range-picker'
import { RichTextEditor } from '@/components/rich-text-editor'

export default function Page() {
  return (
    <>
      <BarChart data={data} />
      <DateRangePicker />
      <RichTextEditor />
    </>
  )
}
```

### After (Dynamically loaded):
```typescript
import dynamic from 'next/dynamic'

// Lazy load heavy components
const BarChart = dynamic(
  () => import('recharts').then(mod => mod.BarChart),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false  // Don't render on server
  }
)

const DateRangePicker = dynamic(
  () => import('@/components/date-range-picker'),
  { loading: () => <Skeleton className="h-10 w-64" /> }
)

const RichTextEditor = dynamic(
  () => import('@/components/rich-text-editor'),
  { 
    loading: () => <EditorSkeleton />,
    ssr: false
  }
)

export default function Page() {
  return (
    <>
      <BarChart data={data} />
      <DateRangePicker />
      <RichTextEditor />
    </>
  )
}
```

---

## 7. Suspense Boundaries & Loading States

### Create loading.tsx files:
```typescript
// app/[locale]/(dashboard)/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-4 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}
```

### Wrap components with Suspense:
```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <Suspense fallback={<ChartSkeleton />}>
        <AsyncChart workspaceId={workspaceId} />
      </Suspense>
      
      <Suspense fallback={<TableSkeleton />}>
        <AsyncDataTable workspaceId={workspaceId} />
      </Suspense>
    </div>
  )
}
```

---

## 8. Link Prefetching

### Before:
```typescript
<Link href={`/workspace/${id}`}>
  View Workspace
</Link>
```

### After (Prefetch primary navigation):
```typescript
// Prefetch on hover for instant navigation
<Link 
  href={`/workspace/${id}`}
  prefetch={true}  // Prefetch this route
  onMouseEnter={() => router.prefetch(`/workspace/${id}/assets`)}
>
  View Workspace
</Link>

// Don't prefetch secondary/infrequent links
<Link 
  href="/settings"
  prefetch={false}
>
  Settings
</Link>
```

---

## 9. Optimized next.config.js

### Complete optimized configuration:
```javascript
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts')

const nextConfig = {
  // Core optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // 1 year
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  
  // Performance budgets
  performance: {
    maxEntrypointSize: 400000,  // 400 KB
    maxAssetSize: 300000,       // 300 KB
  },
  
  // Experimental features
  experimental: {
    reactCompiler: true,        // React 19 compiler
    ppr: 'incremental',         // Partial Prerendering
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '2mb',
    },
  },
  
  // Modular imports (tree-shaking)
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  
  // Webpack optimization
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            
            // Framework (React, Next.js)
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            
            // Radix UI
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              priority: 30,
              enforce: true,
            },
            
            // Supabase
            supabase: {
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              name: 'supabase',
              priority: 25,
              enforce: true,
            },
            
            // Vendor libraries
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 20,
              minSize: 20000,
              maxSize: 244000,
            },
            
            // Common code
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 10,
            },
          },
        },
      }
    }
    return config
  },
}

module.exports = withNextIntl(nextConfig)
```

---

## 10. Database Indexes

```sql
-- supabase/migrations/074_performance_indexes.sql

-- Assets
CREATE INDEX IF NOT EXISTS idx_assets_workspace_status 
  ON assets(workspace_id, status);

CREATE INDEX IF NOT EXISTS idx_assets_workspace_location 
  ON assets(workspace_id, location_id);

CREATE INDEX IF NOT EXISTS idx_assets_name_search 
  ON assets USING gin(to_tsvector('english', name));

-- Transactions
CREATE INDEX IF NOT EXISTS idx_transactions_workspace_date 
  ON asset_transactions(workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_asset 
  ON asset_transactions(asset_id, created_at DESC);

-- Personnel
CREATE INDEX IF NOT EXISTS idx_personnel_workspace_active 
  ON personnel(workspace_id) WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_personnel_name_search 
  ON personnel USING gin(to_tsvector('english', first_name || ' ' || last_name));

-- Productions
CREATE INDEX IF NOT EXISTS idx_productions_workspace_status 
  ON productions(workspace_id, status);

CREATE INDEX IF NOT EXISTS idx_productions_dates 
  ON productions(workspace_id, start_date, end_date);

-- Add more indexes based on your query patterns
```

---

## Testing Commands

```bash
# Development
npm run dev

# Build & analyze bundle
npm run build
npm run analyze

# Test production build locally
npm run build
npm run start

# Lighthouse audit
lighthouse http://localhost:3000 --view

# Check bundle sizes
npm run build && ls -lh .next/static/chunks/
```

---

## Quick Reference

| Optimization | Impact | Effort | Files |
|-------------|---------|--------|-------|
| Remove force-dynamic | 40-60% | 2h | 19 page.tsx files |
| React Compiler | 30-50% | 30min | next.config.js |
| React Query | 50% | 8-12h | hooks/*.ts |
| Server Components | 50-70% | 12-16h | pages/*.tsx |
| Reduce subscriptions | 40-60% | 4-8h | hooks/*.ts |
| Dynamic imports | 30-40% | 6-10h | components/*.tsx |
| Suspense boundaries | 50-80% | 4-6h | pages/*.tsx |

---

## Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Supabase Performance](https://supabase.com/docs/guides/platform/performance)
- [Web Vitals](https://web.dev/vitals/)
