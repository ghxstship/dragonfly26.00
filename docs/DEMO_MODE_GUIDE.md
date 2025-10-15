# Demo Mode Implementation Guide

## Overview

Demo mode allows the application to run with mock data instead of live Supabase queries. This is useful for:

- **Product demos** - Show the application without real customer data
- **Development** - Test UI/UX without database setup
- **Onboarding** - Let new users explore features risk-free
- **Testing** - Consistent data for automated tests
- **Offline mode** - Work without internet connection

## Enabling Demo Mode

### Option 1: Environment Variable (Recommended)

Add to your `.env.local` file:

```bash
NEXT_PUBLIC_DEMO_MODE=true
```

Then restart your development server:

```bash
npm run dev
```

### Option 2: Runtime Toggle (Future Enhancement)

You can add a UI toggle in settings to enable/disable demo mode per-session.

## How It Works

### Architecture

```
┌─────────────────┐
│   Component     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Custom Hook    │◄─── Checks shouldUseMockData()
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│ Mock   │ │ Supabase │
│ Data   │ │ Client   │
└────────┘ └──────────┘
```

### Implementation Pattern

All data hooks follow this pattern:

```typescript
import { shouldUseMockData } from '@/lib/demo-mode'
import { mockEvents, simulateDelay } from '@/lib/mock-data'

export function useMyData(workspaceId: string) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      // Demo mode: return mock data
      if (shouldUseMockData()) {
        await simulateDelay(300) // Simulate network delay
        setData(mockEvents)
        setLoading(false)
        return
      }
      
      // Production mode: query Supabase
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('workspace_id', workspaceId)
      
      if (data) setData(data)
      setLoading(false)
    }

    fetchData()
    
    // Skip real-time in demo mode
    if (shouldUseMockData()) return
    
    // Set up real-time subscription
    const channel = supabase.channel('events')...
    
    return () => supabase.removeChannel(channel)
  }, [workspaceId])

  return { data, loading }
}
```

## Mock Data Structure

All mock data is centralized in `/src/lib/mock-data/`:

```
src/lib/mock-data/
├── index.ts                  # Central export
├── dashboard-mocks.ts        # Dashboard module data
├── community-mocks.ts        # Community module data
├── admin-mocks.ts            # Admin module data
├── projects-mocks.ts         # Projects/productions data
├── people-mocks.ts           # Personnel, crews, vendors
├── assets-mocks.ts           # Equipment and inventory
├── events-mocks.ts           # Calendar and events
└── analytics-mocks.ts        # Reports and analytics
```

### Mock Data Guidelines

1. **Realistic Data** - Use production-like data, not "test" or Lorem Ipsum
2. **Consistent IDs** - Use `demo-` prefix for all IDs to avoid conflicts
3. **Proper Types** - Match exact Supabase schema structure
4. **Timestamps** - Use relative dates (e.g., `Date.now() + 86400000`)
5. **Relationships** - Include related data (foreign keys, nested objects)

### Example Mock Data

```typescript
export const mockProductions = [
  {
    id: 'demo-prod-1',
    name: 'Summer Music Festival 2025',
    description: 'Annual outdoor music festival',
    status: 'in_progress',
    start_date: new Date(Date.now() + 5184000000).toISOString(), // 60 days from now
    end_date: new Date(Date.now() + 5443200000).toISOString(),
    budget: 250000,
    spent: 165000,
    progress: 66,
    workspace_id: 'demo-workspace',
    created_at: new Date(Date.now() - 7776000000).toISOString(),
    
    // Related data
    client: { name: 'Festival Productions Inc.' },
    manager: { name: 'John Doe', id: 'demo-user-1' },
    team_members: 45,
  },
]
```

## Updating Hooks for Demo Mode

### Step-by-Step Process

**1. Import demo utilities:**

```typescript
import { shouldUseMockData } from '@/lib/demo-mode'
import { mockYourData, simulateDelay } from '@/lib/mock-data'
```

**2. Add demo mode check at the start of fetch function:**

```typescript
async function fetchData() {
  if (shouldUseMockData()) {
    await simulateDelay(300)
    setData(mockYourData)
    setLoading(false)
    return  // Early return!
  }
  
  // Existing Supabase code below...
}
```

**3. Skip real-time subscriptions in demo mode:**

```typescript
// After calling fetchData()
if (shouldUseMockData()) return

// Set up real-time subscription
const channel = supabase.channel(...)
```

**4. Test both modes:**

```bash
# Test demo mode
NEXT_PUBLIC_DEMO_MODE=true npm run dev

# Test production mode
npm run dev
```

## Hooks to Update

Apply the demo mode pattern to these hooks:

### Dashboard Hooks (`src/hooks/use-dashboard-data.ts`)
- ✅ `useMyAgenda` - Events
- ⬜ `useMyTasks` - Tasks
- ⬜ `useMyJobs` - Jobs/contracts
- ⬜ `useMyAssets` - Asset checkouts
- ⬜ `useMyExpenses` - Expense reports
- ⬜ `useMyOrders` - Purchase orders
- ⬜ `useMyAdvances` - Advance requests
- ⬜ `useMyFiles` - File storage
- ⬜ `useMyReports` - Generated reports
- ⬜ `useMyTravel` - Travel bookings

### Module Hooks (`src/hooks/`)
- ⬜ `use-projects-data.ts` - Productions
- ⬜ `use-people-data.ts` - Personnel
- ⬜ `use-assets-data.ts` - Equipment
- ⬜ `use-events-data.ts` - Calendar
- ⬜ `use-analytics-data.ts` - Reports
- ⬜ `use-admin-data.ts` - Admin functions
- ⬜ `use-community-data.ts` - Social features

## UI Indicators

### Demo Mode Badge

Add a visual indicator when demo mode is active:

```typescript
// In your header or nav component
import { getDemoModeLabel } from '@/lib/demo-mode'

function Header() {
  const demoLabel = getDemoModeLabel()
  
  return (
    <header>
      {/* ...other header content... */}
      
      {demoLabel && (
        <Badge variant="warning" className="ml-2">
          {demoLabel}
        </Badge>
      )}
    </header>
  )
}
```

### Demo Mode Banner

Consider adding a prominent banner:

```typescript
{isDemoMode() && (
  <Alert className="mb-4">
    <InfoIcon className="h-4 w-4" />
    <AlertTitle>Demo Mode Active</AlertTitle>
    <AlertDescription>
      You're viewing sample data. Changes won't be saved.
    </AlertDescription>
  </Alert>
)}
```

## Testing

### Manual Testing Checklist

- [ ] All modules load with mock data
- [ ] No Supabase errors in console
- [ ] Loading states work correctly
- [ ] Simulated delays feel natural
- [ ] Mock data looks realistic
- [ ] Can switch back to production mode
- [ ] Real-time subscriptions are skipped

### Automated Testing

```typescript
describe('Demo Mode', () => {
  it('should use mock data when enabled', () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true'
    const { result } = renderHook(() => useMyAgenda('workspace', 'user'))
    
    expect(result.current.events).toEqual(mockEvents)
  })
  
  it('should use Supabase when disabled', () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false'
    // Test real Supabase query
  })
})
```

## Best Practices

### DO:
- ✅ Use consistent mock data structure across all modules
- ✅ Simulate realistic network delays (200-500ms)
- ✅ Include edge cases (empty states, errors)
- ✅ Keep mock data up-to-date with schema changes
- ✅ Document any special demo mode behaviors

### DON'T:
- ❌ Mix mock and real data in the same session
- ❌ Use "test" or placeholder text in demos
- ❌ Forget to skip real-time subscriptions
- ❌ Make demo mode data too perfect (add some variance)
- ❌ Hardcode demo mode checks in components (use hooks)

## Troubleshooting

### Mock data not showing

**Check:**
1. Environment variable is set: `NEXT_PUBLIC_DEMO_MODE=true`
2. Server was restarted after changing `.env`
3. Hook imports `shouldUseMockData()` correctly
4. Early return is in place after setting mock data

### Real-time subscriptions still running

**Fix:** Add this check after calling fetch function:

```typescript
if (shouldUseMockData()) return
```

### TypeScript errors with mock data

**Ensure** mock data structure matches Supabase types exactly:

```typescript
// Match the actual database schema
export const mockEvents: Database['public']['Tables']['events']['Row'][] = [...]
```

## Future Enhancements

- [ ] UI toggle for demo mode (user settings)
- [ ] Per-feature demo mode (e.g., only demo billing)
- [ ] Demo mode analytics (track what features users explore)
- [ ] Exportable demo data for testing
- [ ] Demo mode with partial real data (hybrid mode)
- [ ] Auto-reset demo data on page refresh

## Summary

Demo mode provides a complete mock data layer that:

1. **Requires zero database setup** - Works offline, no Supabase needed
2. **Is production-ready** - Realistic data for convincing demos
3. **Is developer-friendly** - Simple environment variable toggle
4. **Is maintainable** - Centralized mock data in one place
5. **Is performant** - No network requests, instant loading

Enable with: `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`

All data hooks follow the same pattern - check demo mode first, return mock data, otherwise use Supabase.
