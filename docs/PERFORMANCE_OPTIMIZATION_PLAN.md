# Performance Optimization Plan
**Created:** October 15, 2025  
**Target:** Sub-second navigation, 60-80% speed improvement  
**Status:** Ready for implementation

---

## Executive Summary

Based on analysis of your Next.js 15 + Supabase application, critical bottlenecks identified:

1. **Aggressive force-dynamic** - Disables all Next.js caching (19 pages affected)
2. **No data caching** - Every navigation refetches all data
3. **Over-subscription** - 10-20+ real-time WebSocket connections
4. **Large bundles** - 597 kB+ page loads
5. **Client-side data fetching** - Waterfall requests, no SSR benefits

**Estimated Impact:** 60-80% reduction in load times, 90% reduction in perceived navigation delays.

---

## Phase 1: Critical Configuration Changes ⚡ IMMEDIATE IMPACT

### 1.1 Remove Force-Dynamic (40-60% improvement)
**Priority: CRITICAL | Effort: 2 hours**

Remove `export const dynamic = 'force-dynamic'` from:
- ✅ `/admin/page.tsx` - Use ISR with 60s revalidation
- ✅ `/api-tokens/page.tsx` - Static with on-demand revalidation  
- ✅ `/automations/page.tsx` - Static with 60s revalidation
- ✅ `/insights/page.tsx` - ISR with 5min revalidation
- ✅ `/plugins/page.tsx` - Fully static
- ✅ `/reports/page.tsx` - ISR with 60s revalidation
- ✅ `/webhooks/page.tsx` - Static with revalidation
- ✅ All workspace tab pages - Use `revalidate: 30` instead

**Keep force-dynamic only for:**
- Auth pages (login, signup, reset-password)
- Real-time dashboards requiring live data

**Add instead:**
```typescript
export const revalidate = 60 // seconds
```

### 1.2 Enable React Compiler & PPR (30-50% improvement)
**Priority: CRITICAL | Effort: 30 minutes**

Update `next.config.js`:
```javascript
const nextConfig = {
  // ... existing config
  swcMinify: true,
  compress: true,
  
  experimental: {
    reactCompiler: true,      // ⚡ Major performance boost
    ppr: 'incremental',       // ⚡ Partial Prerendering
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  },
  
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
}
```

### 1.3 Optimize Font Loading (20-30% improvement)
**Priority: HIGH | Effort: 5 minutes**

Update `src/app/layout.tsx`:
```typescript
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})
```

---

## Phase 2: Data Fetching & Caching ⚡ HIGHEST IMPACT

### 2.1 Move to Server Components (50-70% improvement)
**Priority: CRITICAL | Effort: 8-16 hours**

**Current pattern (slow):**
```typescript
// Client Component - fetches after hydration
'use client'
export default function Page() {
  const { data, loading } = useAssets(workspaceId) // Client-side fetch
  if (loading) return <Spinner />
  return <DataTable data={data} />
}
```

**Optimized pattern:**
```typescript
// Server Component - fetches during SSR
import { createServerClient } from '@/lib/supabase/server'

async function getData(workspaceId: string) {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('assets')
    .select('id, name, status, location_id') // Only needed fields
    .eq('workspace_id', workspaceId)
    .limit(50)
  return data
}

export default async function Page({ params }: { params: { workspaceId: string } }) {
  const data = await getData(params.workspaceId)
  return <ClientDataTable initialData={data} /> // Hydrate with server data
}
```

**Apply to:**
- All workspace module pages
- Admin pages
- Reports pages
- Analytics pages

### 2.2 Reduce Real-Time Subscriptions (40-60% improvement)
**Priority: CRITICAL | Effort: 4-8 hours**

**Current:** Every hook creates WebSocket subscription  
**Problem:** 10-20+ concurrent connections, constant re-renders

**Strategy:**
1. **Audit real-time needs:**
   - ✅ Real-time: Notifications, chat, live dashboards
   - ⚠️ Polling (30-60s): Asset locations, inventory
   - ❌ Remove: Settings, historical data, reports

2. **Consolidate subscriptions:**
```typescript
// ❌ Bad - Multiple subscriptions
useAssets(workspaceId)           // → 1 subscription
useAssetTransactions(workspaceId) // → 1 subscription
useMaintenance(workspaceId)      // → 1 subscription
// Total: 3 WebSocket connections

// ✅ Good - Single workspace subscription
useWorkspaceData(workspaceId) // → 1 subscription for all workspace changes
```

3. **Implement polling for non-critical data:**
```typescript
export function useAssets(workspaceId: string) {
  return useQuery({
    queryKey: ['assets', workspaceId],
    queryFn: () => fetchAssets(workspaceId),
    refetchInterval: 30000, // Poll every 30s instead of real-time
    staleTime: 20000,
  })
}
```

### 2.3 Implement React Query (50% improvement)
**Priority: CRITICAL | Effort: 8-12 hours**

**Setup:**
```typescript
// lib/react-query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,              // 1 min
      cacheTime: 5 * 60 * 1000,          // 5 min
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
})

// app/layout.tsx - Wrap with provider
<QueryClientProvider client={queryClient}>
  {children}
</QueryClientProvider>
```

**Migrate hooks:**
```typescript
// ❌ Old pattern - No caching
export function useAssets(workspaceId: string) {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchAssets() // Refetches on every mount
  }, [workspaceId])
  
  return { assets, loading }
}

// ✅ New pattern - Smart caching
export function useAssets(workspaceId: string) {
  return useQuery({
    queryKey: ['assets', workspaceId],
    queryFn: () => fetchAssets(workspaceId),
    enabled: !!workspaceId,
  })
}
```

### 2.4 Optimize Supabase Queries (40-60% faster)
**Priority: HIGH | Effort: 6-10 hours**

**Fixes to implement:**

1. **Selective field fetching:**
```typescript
// ❌ Over-fetching
.select('*')

// ✅ Only needed fields
.select('id, name, status, created_at')
```

2. **Add limits:**
```typescript
.limit(50)
.range(0, 49)
```

3. **Use RPC for complex queries:**
```sql
-- supabase/migrations/073_performance_rpcs.sql
CREATE OR REPLACE FUNCTION get_workspace_dashboard(p_workspace_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'assets', (SELECT count(*) FROM assets WHERE workspace_id = p_workspace_id),
    'projects', (SELECT count(*) FROM productions WHERE workspace_id = p_workspace_id),
    'personnel', (SELECT count(*) FROM personnel WHERE workspace_id = p_workspace_id)
  );
$$ LANGUAGE sql STABLE;
```

4. **Add indexes:**
```sql
CREATE INDEX IF NOT EXISTS idx_assets_workspace_status ON assets(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_transactions_workspace_date ON asset_transactions(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_personnel_workspace_active ON personnel(workspace_id) WHERE active = true;
```

---

## Phase 3: Bundle Optimization ⚡ 30-40% reduction

### 3.1 Dynamic Imports (30-40% initial load improvement)
**Priority: HIGH | Effort: 4-6 hours**

**Target components:**
```typescript
// Charts
const RechartsChart = dynamic(() => import('recharts').then(mod => mod.Chart), {
  loading: () => <ChartSkeleton />,
  ssr: false,
})

// Heavy dialogs
const AssetDetailsDialog = dynamic(() => import('./asset-details-dialog'), {
  loading: () => <DialogSkeleton />,
})

// Framer Motion animations
const AnimatedComponent = dynamic(() => import('./animated-component'), {
  ssr: false,
})

// Date pickers
const DateRangePicker = dynamic(() => import('./date-range-picker'))
```

### 3.2 Bundle Analysis
**Priority: HIGH | Effort: 30 minutes**

```bash
npm install --save-dev @next/bundle-analyzer

# Add to package.json scripts:
"analyze": "ANALYZE=true next build"

# Run analysis:
npm run analyze
```

**Target sizes:**
- Initial JS: <200 KB (currently ~597 KB)
- Each lazy chunk: <100 KB
- Total page: <500 KB

---

## Phase 4: Rendering Optimization ⚡ Instant perceived load

### 4.1 Add Suspense Boundaries (50-80% improvement)
**Priority: HIGH | Effort: 4-6 hours**

**Create loading.tsx files:**
```typescript
// app/[locale]/(dashboard)/loading.tsx
export default function DashboardLoading() {
  return <DashboardSkeleton />
}

// app/[locale]/(dashboard)/workspace/[workspaceId]/loading.tsx
export default function WorkspaceLoading() {
  return <WorkspaceSkeleton />
}
```

**Wrap async components:**
```typescript
<Suspense fallback={<TableSkeleton />}>
  <AsyncDataTable workspaceId={workspaceId} />
</Suspense>

<Suspense fallback={<ChartSkeleton />}>
  <AsyncChart data={data} />
</Suspense>
```

### 4.2 Implement Link Prefetching
**Priority: MEDIUM | Effort: 2 hours**

```typescript
// Primary navigation - prefetch aggressively
<Link href="/workspace/123" prefetch={true}>

// Secondary links - don't prefetch
<Link href="/settings" prefetch={false}>

// Predicted navigation
const router = useRouter()
onMouseEnter={() => router.prefetch('/workspace/123')}
```

---

## Phase 5: Monitoring & Measurement

### 5.1 Web Vitals Tracking
**Priority: CRITICAL | Effort: 1 hour**

```typescript
// app/layout.tsx
export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric)
  
  // Target metrics:
  // LCP < 2.5s
  // FID < 100ms
  // CLS < 0.1
  // TTFB < 600ms
}
```

### 5.2 Performance Budget
**Priority: HIGH | Effort: 15 minutes**

```javascript
// next.config.js
{
  performance: {
    maxEntrypointSize: 400000,  // 400 KB
    maxAssetSize: 300000,       // 300 KB
  },
}
```

---

## Implementation Roadmap

### 🔴 Week 1: Critical Fixes (40-60% improvement)
**Time: 8-12 hours**

- [ ] Remove force-dynamic (1.1) - 2 hours
- [ ] Enable React Compiler & PPR (1.2) - 30 min
- [ ] Optimize fonts (1.3) - 5 min
- [ ] Install bundle analyzer (3.2) - 30 min
- [ ] Add Web Vitals tracking (5.1) - 1 hour
- [ ] Set performance budgets (5.2) - 15 min

**Expected: 40-60% faster page loads**

### 🟠 Week 2: Data Layer (50-70% improvement)  
**Time: 16-24 hours**

- [ ] Setup React Query (2.3) - 2 hours
- [ ] Audit & reduce subscriptions (2.2) - 4-6 hours
- [ ] Migrate 5 critical hooks to React Query - 6-8 hours
- [ ] Optimize Supabase queries (2.4) - 4-6 hours
- [ ] Add database indexes (2.4) - 2 hours

**Expected: 50-70% faster data loading**

### 🟡 Week 3: Server Components (50-80% improvement)
**Time: 20-30 hours**

- [ ] Convert 10 pages to Server Components (2.1) - 12-16 hours
- [ ] Add Suspense boundaries (4.1) - 4-6 hours
- [ ] Create loading skeletons (4.1) - 4-6 hours
- [ ] Implement prefetching (4.2) - 2 hours

**Expected: 50-80% faster navigation**

### 🟢 Week 4: Code Splitting & Polish (30-40% improvement)
**Time: 12-16 hours**

- [ ] Dynamic imports for heavy components (3.1) - 8-12 hours
- [ ] Analyze and optimize bundle (3.2) - 2-3 hours
- [ ] Performance testing and fine-tuning - 2-3 hours

**Expected: 30-40% smaller bundles**

---

## Quick Reference: Critical Files to Update

### Immediate changes (Week 1):
```
next.config.js          → Enable optimizations
src/app/layout.tsx      → Optimize fonts
src/app/[locale]/(dashboard)/admin/page.tsx → Remove force-dynamic
src/app/[locale]/(dashboard)/api-tokens/page.tsx → Remove force-dynamic
src/app/[locale]/(dashboard)/automations/page.tsx → Remove force-dynamic
src/app/[locale]/(dashboard)/insights/page.tsx → Remove force-dynamic
src/app/[locale]/(dashboard)/plugins/page.tsx → Remove force-dynamic
src/app/[locale]/(dashboard)/reports/page.tsx → Remove force-dynamic
src/app/[locale]/(dashboard)/webhooks/page.tsx → Remove force-dynamic
src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/[tab]/page.tsx → Remove force-dynamic
```

### Data layer (Week 2):
```
src/lib/react-query-client.ts → Create QueryClient
src/hooks/use-assets-data.ts → Migrate to React Query
src/hooks/use-*.ts → Migrate all data hooks
supabase/migrations/073_performance_indexes.sql → Add indexes
```

### Rendering (Week 3):
```
src/app/[locale]/(dashboard)/loading.tsx → Create
src/app/[locale]/(dashboard)/workspace/[workspaceId]/loading.tsx → Create
src/components/*/page.tsx → Convert to Server Components
```

---

## Success Metrics

**Current (Baseline):**
- Page load: 3-5 seconds
- Navigation: 2-4 seconds  
- Bundle size: 597+ KB
- LCP: 4-6 seconds

**Target (After optimization):**
- Page load: <1.5 seconds ✅
- Navigation: <500ms ✅
- Bundle size: <300 KB ✅
- LCP: <2.5 seconds ✅

**Tools for measurement:**
- Chrome DevTools Lighthouse
- Next.js Speed Insights
- Vercel Analytics (if deployed)
- `npm run analyze` for bundles

---

## Notes

- All changes are configuration/architectural - no feature changes
- Each phase is independent and can be implemented separately
- Prioritize Week 1 & 2 for maximum impact
- Test performance after each phase
- Monitor Web Vitals continuously

**Questions or need clarification? Reference specific phase numbers.**
