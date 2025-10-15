# Performance Optimization Implementation Checklist

Track progress of performance optimization plan implementation.

---

## ✅ Week 1: Critical Fixes (Target: 40-60% improvement)

### Configuration Changes
- [ ] **Remove force-dynamic from pages** (2 hours)
  - [ ] `/admin/page.tsx` - Add `export const revalidate = 60`
  - [ ] `/api-tokens/page.tsx` - Add `export const revalidate = 60`
  - [ ] `/automations/page.tsx` - Add `export const revalidate = 60`
  - [ ] `/insights/page.tsx` - Add `export const revalidate = 300`
  - [ ] `/plugins/page.tsx` - Remove force-dynamic (fully static)
  - [ ] `/reports/page.tsx` - Add `export const revalidate = 60`
  - [ ] `/webhooks/page.tsx` - Add `export const revalidate = 60`
  - [ ] `/workspace/[workspaceId]/[module]/[tab]/page.tsx` - Add `export const revalidate = 30`

- [ ] **Update next.config.js** (30 min)
  - [ ] Add `swcMinify: true`
  - [ ] Add `compress: true`
  - [ ] Add `experimental.reactCompiler: true`
  - [ ] Add `experimental.ppr: 'incremental'`
  - [ ] Add `experimental.optimizePackageImports`
  - [ ] Add `modularizeImports` for lucide-react
  - [ ] Update `images` config with formats and caching
  - [ ] Enhance `webpack` splitChunks configuration

- [ ] **Optimize font loading** (5 min)
  - [ ] Update `layout.tsx` Inter import with display: 'swap'
  - [ ] Add preload: true
  - [ ] Add variable: '--font-inter'

- [ ] **Install and configure bundle analyzer** (30 min)
  - [ ] `npm install --save-dev @next/bundle-analyzer`
  - [ ] Add analyzer config to next.config.js
  - [ ] Add `"analyze": "ANALYZE=true next build"` to package.json
  - [ ] Run initial analysis: `npm run analyze`
  - [ ] Document baseline bundle sizes

- [ ] **Add Web Vitals tracking** (1 hour)
  - [ ] Add `reportWebVitals` function to layout.tsx
  - [ ] Log metrics to console (dev)
  - [ ] Optional: Send to analytics service

- [ ] **Set performance budgets** (15 min)
  - [ ] Add performance config to next.config.js
  - [ ] Set maxEntrypointSize: 400KB
  - [ ] Set maxAssetSize: 300KB

### Testing & Validation
- [ ] Run Lighthouse audit before changes (baseline)
- [ ] Run Lighthouse audit after changes
- [ ] Test navigation speed between pages
- [ ] Verify no functionality broken
- [ ] Document improvements

**Baseline Metrics:**
- Page load: _____s
- Navigation: _____s
- LCP: _____s
- Bundle size: _____KB

**After Week 1:**
- Page load: _____s (____% improvement)
- Navigation: _____s (____% improvement)
- LCP: _____s (____% improvement)
- Bundle size: _____KB (____% reduction)

---

## ⏳ Week 2: Data Layer Optimization (Target: 50-70% improvement)

### React Query Setup
- [ ] **Install and configure React Query** (2 hours)
  - [ ] Verify @tanstack/react-query is installed (already in package.json)
  - [ ] Create `src/lib/react-query-client.ts`
  - [ ] Configure QueryClient with optimal defaults
  - [ ] Wrap app in QueryClientProvider in layout.tsx
  - [ ] Add React Query DevTools (dev only)

### Reduce Real-Time Subscriptions
- [ ] **Audit current subscriptions** (2 hours)
  - [ ] Document all hooks using `.channel()` and `.subscribe()`
  - [ ] Categorize: Real-time needed vs. polling vs. static
  - [ ] Identify subscription count per page
  - [ ] Create consolidation plan

- [ ] **Remove unnecessary subscriptions** (2-4 hours)
  - [ ] Remove real-time from settings/config data
  - [ ] Remove real-time from historical/report data
  - [ ] Remove real-time from user profile data
  - [ ] Convert to polling or static fetch

- [ ] **Consolidate workspace subscriptions** (2-4 hours)
  - [ ] Create single `useWorkspaceRealtimeData` hook
  - [ ] Consolidate multiple channels into one
  - [ ] Share subscription across components

### Migrate Data Hooks
- [ ] **Convert to React Query** (6-8 hours)
  - [ ] `use-assets-data.ts` hooks
    - [ ] useAssets
    - [ ] useAssetTransactions  
    - [ ] useMaintenance
    - [ ] useAdvances
    - [ ] useAssetAvailability
  - [ ] Other data hooks (prioritize by usage)
    - [ ] List all hooks to migrate: _________________
    - [ ] Migrate top 5 most-used hooks

### Optimize Supabase Queries
- [ ] **Implement selective field fetching** (2-3 hours)
  - [ ] Audit all `.select('*')` queries
  - [ ] Replace with specific field lists
  - [ ] Test data integrity

- [ ] **Add query limits** (1 hour)
  - [ ] Add `.limit(50)` to list queries
  - [ ] Implement pagination where needed
  - [ ] Add infinite scroll if appropriate

- [ ] **Create RPC functions** (2-3 hours)
  - [ ] Identify complex multi-query patterns
  - [ ] Create SQL RPC functions
  - [ ] Migration: `073_performance_rpcs.sql`
  - [ ] Test RPC performance vs. multiple queries

- [ ] **Add database indexes** (2 hours)
  - [ ] Create migration: `074_performance_indexes.sql`
  - [ ] Add indexes on:
    - [ ] `assets(workspace_id, status)`
    - [ ] `assets(workspace_id, location_id)`
    - [ ] `asset_transactions(workspace_id, created_at DESC)`
    - [ ] `personnel(workspace_id) WHERE active = true`
    - [ ] `productions(workspace_id, status)`
    - [ ] Any other frequently queried columns
  - [ ] Apply migration
  - [ ] Test query performance improvement

### Testing & Validation
- [ ] Measure subscription count reduction
- [ ] Test data loading speed
- [ ] Verify React Query cache working
- [ ] Verify real-time updates still work where needed
- [ ] Load test with multiple tabs open

**After Week 2:**
- Real-time connections: _____→_____ (____% reduction)
- Data fetch time: _____ms→_____ms (____% improvement)
- Cache hit rate: _____% 

---

## ⏳ Week 3: Server Components & Streaming (Target: 50-80% improvement)

### Server Components Migration
- [ ] **Convert pages to Server Components** (12-16 hours)
  - [ ] Admin pages
    - [ ] admin/page.tsx
    - [ ] api-tokens/page.tsx
    - [ ] automations/page.tsx
  - [ ] Insights/reports pages
    - [ ] insights/page.tsx
    - [ ] reports/page.tsx
  - [ ] Workspace pages (prioritize top 5 modules)
    - [ ] Module 1: _______________
    - [ ] Module 2: _______________
    - [ ] Module 3: _______________
    - [ ] Module 4: _______________
    - [ ] Module 5: _______________

- [ ] **Create Server Data Fetching Functions** (included above)
  - [ ] Move fetch logic to async functions
  - [ ] Use `createServerClient()` from Supabase
  - [ ] Pass initialData to client components
  - [ ] Implement proper error handling

### Streaming & Suspense
- [ ] **Create loading.tsx files** (2-3 hours)
  - [ ] `app/[locale]/(dashboard)/loading.tsx`
  - [ ] `app/[locale]/(dashboard)/workspace/[workspaceId]/loading.tsx`
  - [ ] Module-specific loading states (as needed)

- [ ] **Create skeleton components** (2-3 hours)
  - [ ] DashboardSkeleton
  - [ ] WorkspaceSkeleton
  - [ ] TableSkeleton
  - [ ] ChartSkeleton
  - [ ] CardSkeleton

- [ ] **Add Suspense boundaries** (2-4 hours)
  - [ ] Wrap async data components
  - [ ] Wrap heavy chart components
  - [ ] Wrap dialog content that loads data
  - [ ] Test streaming behavior

### Prefetching Strategy
- [ ] **Implement link prefetching** (2 hours)
  - [ ] Update navigation links with `prefetch={true}`
  - [ ] Add `prefetch={false}` to secondary links
  - [ ] Implement hover prefetching for workspace links
  - [ ] Test prefetch behavior in DevTools

- [ ] **Add route prefetching** (1 hour)
  - [ ] Prefetch likely next routes
  - [ ] Prefetch on user intent signals

### Testing & Validation
- [ ] Test SSR rendering (view source)
- [ ] Test streaming with slow 3G throttle
- [ ] Measure TTFB improvement
- [ ] Test navigation feels instant
- [ ] Verify no hydration errors

**After Week 3:**
- TTFB: _____ms→_____ms (____% improvement)
- Navigation time: _____ms→_____ms (____% improvement)
- Perceived load: _____ (user feedback)

---

## ⏳ Week 4: Code Splitting & Bundle Optimization (Target: 30-40% reduction)

### Dynamic Imports
- [ ] **Identify heavy components** (1 hour)
  - [ ] Chart components (recharts)
  - [ ] Rich text editors
  - [ ] Image upload components
  - [ ] Date pickers
  - [ ] Large dialogs
  - [ ] Admin components

- [ ] **Implement dynamic imports** (6-10 hours)
  - [ ] Chart components
  - [ ] Dialog components (non-critical)
  - [ ] Form components (heavy)
  - [ ] Animation components
  - [ ] Module-specific heavy components

- [ ] **Add loading states** (2 hours)
  - [ ] Create loading components for dynamic imports
  - [ ] Test loading experience
  - [ ] Ensure no layout shift

### Bundle Analysis & Optimization
- [ ] **Run bundle analysis** (1 hour)
  - [ ] `npm run analyze`
  - [ ] Document largest chunks
  - [ ] Identify optimization opportunities

- [ ] **Optimize largest chunks** (2-4 hours)
  - [ ] Implement recommended optimizations
  - [ ] Test chunk size reduction
  - [ ] Verify no duplicate dependencies

### Final Testing
- [ ] **Performance testing** (2-3 hours)
  - [ ] Run Lighthouse audit (mobile & desktop)
  - [ ] Test on slow 3G network
  - [ ] Test on low-end devices
  - [ ] Cross-browser testing
  - [ ] Load testing with Vercel Speed Insights

- [ ] **Regression testing** (2-3 hours)
  - [ ] Test all major features
  - [ ] Test real-time functionality
  - [ ] Test data integrity
  - [ ] Test auth flows
  - [ ] Test navigation

**After Week 4:**
- Initial bundle: _____KB→_____KB (____% reduction)
- Largest chunk: _____KB→_____KB (____% reduction)
- Lighthouse score: _____→_____ (____% improvement)

---

## Final Metrics Comparison

| Metric | Baseline | Week 1 | Week 2 | Week 3 | Week 4 | Target | ✅ |
|--------|----------|--------|--------|--------|--------|--------|---|
| Page Load (s) | | | | | | <1.5s | |
| Navigation (ms) | | | | | | <500ms | |
| LCP (s) | | | | | | <2.5s | |
| TTFB (ms) | | | | | | <600ms | |
| Bundle (KB) | 597+ | | | | | <300KB | |
| Lighthouse | | | | | | 90+ | |
| RT Connections | | | | | | <5 | |

---

## Additional Optimizations (Optional)

### Phase 5: Advanced Optimizations
- [ ] Implement Service Worker / PWA
- [ ] Add CDN caching headers
- [ ] Optimize images with Next/Image
- [ ] Implement adaptive loading (network-aware)
- [ ] Add error boundaries
- [ ] Implement retry logic
- [ ] Add offline support

### Monitoring
- [ ] Setup Vercel Analytics
- [ ] Setup Sentry Performance Monitoring
- [ ] Create performance dashboard
- [ ] Setup automated Lighthouse CI
- [ ] Create performance budget alerts

---

## Notes & Blockers

**Week 1:**
- 

**Week 2:**
- 

**Week 3:**
- 

**Week 4:**
- 

---

## Resources
- Performance Plan: `docs/PERFORMANCE_OPTIMIZATION_PLAN.md`
- Next.js Docs: https://nextjs.org/docs/app/building-your-application/optimizing
- React Query Docs: https://tanstack.com/query/latest
- Supabase Performance: https://supabase.com/docs/guides/platform/performance
