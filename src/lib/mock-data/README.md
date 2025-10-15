# Mock Data Library

Centralized mock data for demo mode. All data represents realistic production scenarios for the live event production management platform.

## Structure

```
mock-data/
├── index.ts              # Central exports + helpers
├── dashboard-mocks.ts    # Personal dashboard data
├── community-mocks.ts    # Social/community features
├── admin-mocks.ts        # Admin panel data
├── projects-mocks.ts     # Productions & project mgmt
├── people-mocks.ts       # Personnel & contacts
├── assets-mocks.ts       # Equipment inventory
├── events-mocks.ts       # Calendar & scheduling
└── analytics-mocks.ts    # Reports & analytics
```

## Usage

```typescript
import { mockEvents, mockTasks, simulateDelay } from '@/lib/mock-data'

// In your hook
if (shouldUseMockData()) {
  await simulateDelay(300)
  setData(mockEvents)
  return
}
```

## Guidelines

### IDs
- Always prefix with `demo-` (e.g., `demo-prod-1`, `demo-user-1`)
- Use sequential numbering for consistency
- Never use real production IDs

### Timestamps
- Use relative dates: `new Date(Date.now() + offset).toISOString()`
- Common offsets:
  - 1 hour: `3600000`
  - 1 day: `86400000`
  - 1 week: `604800000`
  - 1 month: `2592000000`
  - 1 year: `31536000000`

### Names
- Use realistic names (not "Test User")
- Represent diverse backgrounds
- Use actual company/venue names (or realistic alternatives)

### Data Quality
- Match Supabase schema exactly
- Include all required fields
- Add optional fields for realism
- Use proper status values
- Include relationships (foreign keys)

## Example

```typescript
export const mockProductions = [
  {
    id: 'demo-prod-1', // Prefixed ID
    name: 'Summer Music Festival 2025', // Realistic name
    status: 'in_progress', // Valid status
    start_date: new Date(Date.now() + 5184000000).toISOString(), // 60 days from now
    budget: 250000,
    workspace_id: 'demo-workspace',
    
    // Related data
    client: { 
      name: 'Festival Productions Inc.',
      id: 'demo-company-1' 
    },
    manager: { 
      name: 'John Doe',
      id: 'demo-user-1' 
    },
  },
]
```

## Maintenance

### When to update:
- Schema changes (new/removed/renamed fields)
- New features added to the app
- Status values change
- Relationships change

### How to update:
1. Edit the appropriate file (e.g., `dashboard-mocks.ts`)
2. Ensure data matches current Supabase schema
3. Test in demo mode
4. Update this README if structure changes

## Module Coverage

### Dashboard
- Events (agenda)
- Tasks
- Jobs/contracts
- Assets (checkouts)
- Expenses
- Orders
- Advances
- Files
- Reports
- Travel

### Projects
- Productions
- Project tasks
- Milestones
- Budget tracking

### People
- Personnel profiles
- Crews/teams
- Vendors
- Client companies

### Assets
- Equipment items
- Categories
- Locations
- Maintenance records

### Events
- Calendar events
- Venues
- Event types

### Community
- Activity posts
- Connections
- Discussions
- Competitions

### Admin
- Team members
- Billing/subscriptions
- API tokens
- Audit logs

### Analytics
- Revenue metrics
- Project performance
- Team utilization
- Equipment usage

## Best Practices

✅ **DO:**
- Keep data realistic and production-like
- Use relative timestamps
- Include edge cases (empty arrays, null values)
- Match real schema structure exactly
- Add comments for complex relationships

❌ **DON'T:**
- Use placeholder text ("Lorem ipsum", "Test User")
- Hardcode absolute dates
- Include sensitive real data
- Break relationships between entities
- Use inconsistent ID formats

## Testing

```bash
# Enable demo mode
NEXT_PUBLIC_DEMO_MODE=true npm run dev

# Verify mock data loads correctly
# Check console for errors
# Test all features in demo mode
```

## Related Files

- `/src/lib/demo-mode.ts` - Demo mode configuration
- `/src/hooks/use-*-data.ts` - Data hooks that consume this mock data
- `/docs/DEMO_MODE_GUIDE.md` - Complete implementation guide
