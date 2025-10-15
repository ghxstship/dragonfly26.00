# Architecture Documentation

## Overview

This is a production-ready, multi-tenant ClickUp-style project management platform built with:

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Real-time, Auth, Storage)
- **Payments**: Stripe (Subscriptions & Marketplace)
- **State Management**: Zustand
- **Data Tables**: TanStack Table
- **Drag & Drop**: dnd-kit

## Core Principles

1. **Multi-tenancy**: Organization-based isolation with workspace switching
2. **Universal Data Architecture**: Generic schema that adapts to any Supabase table
3. **Whitelabel Ready**: No domain-specific business logic
4. **Real-time Collaboration**: Live updates via Supabase subscriptions
5. **Role-Based Access Control**: Owner, Admin, Member, Guest roles

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth pages (login, signup)
│   ├── (dashboard)/             # Main application
│   │   └── workspace/
│   │       └── [workspaceId]/
│   │           └── [module]/    # Dynamic module pages
│   ├── api/                     # API routes (Stripe webhooks, etc.)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page (redirects)
│
├── components/
│   ├── ui/                      # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/                  # Layout components
│   │   ├── top-bar.tsx         # Global navigation
│   │   ├── sidebar.tsx         # Module navigation
│   │   ├── right-sidebar.tsx   # Activity/comments panel
│   │   ├── workspace-switcher.tsx
│   │   ├── command-palette.tsx  # Cmd+K search
│   │   └── notifications-panel.tsx
│   ├── views/                   # Data view components
│   │   ├── list-view.tsx
│   │   ├── board-view.tsx
│   │   ├── table-view.tsx
│   │   ├── calendar-view.tsx
│   │   ├── timeline-view.tsx
│   │   ├── dashboard-view.tsx
│   │   └── view-switcher.tsx
│   ├── modules/                 # Module-specific components
│   └── shared/                  # Shared components
│       ├── activity-feed.tsx
│       ├── comments-section.tsx
│       └── time-tracker.tsx
│
├── lib/
│   ├── supabase/               # Supabase integration
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   ├── middleware.ts       # Auth middleware
│   │   └── queries.ts          # Database queries
│   ├── stripe/                 # Stripe integration
│   │   ├── client.ts           # Client-side Stripe
│   │   └── server.ts           # Server-side Stripe
│   ├── modules/                # Module configuration
│   │   └── registry.ts         # Module definitions
│   ├── views/                  # View configuration
│   │   └── registry.ts         # View type definitions
│   ├── hooks/                  # Custom React hooks
│   │   └── use-toast.ts
│   └── utils.ts                # Utility functions
│
├── store/                      # Zustand state stores
│   ├── ui-store.ts            # UI state (theme, sidebar, etc.)
│   ├── workspace-store.ts     # Workspace/org state
│   └── collaboration-store.ts  # Real-time collaboration
│
├── types/                      # TypeScript definitions
│   └── index.ts
│
└── styles/                     # Additional styles

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Database schema
```

## Data Flow

### 1. Authentication Flow
```
User Login → Supabase Auth → Set Session Cookie → Middleware Validates → Access Granted
```

### 2. Data Fetching Flow
```
Component → Supabase Client → RLS Check → PostgreSQL → Real-time Subscription → Update UI
```

### 3. Multi-tenant Data Isolation
```
User → Organization Membership → Workspace Access → Module Data (filtered by workspace_id)
```

### 4. View Rendering Flow
```
Module Page → View Switcher → Selected View Component → Generic Data → Render
```

## Key Components

### Top Bar (`top-bar.tsx`)
- Workspace switcher (organization dropdown)
- Global search (Cmd+K)
- Quick actions (+ New)
- Notifications center
- User menu

### Sidebar (`sidebar.tsx`)
- Favorites section
- Module navigation (grouped by category)
- Collapsible (240px ↔ 60px)
- Settings/profile links

### Right Sidebar (`right-sidebar.tsx`)
- Activity feed
- Comments/chat
- Time tracking
- Custom fields editor
- Relationships

### View Components
All views accept generic `DataItem[]` and render accordingly:
- **List View**: Grouped rows, inline editing
- **Board View**: Drag-and-drop Kanban
- **Table View**: Spreadsheet-style grid
- **Calendar View**: Month/week/day modes
- **Timeline View**: Gantt chart with dependencies
- **Dashboard View**: Customizable widgets

## Database Schema

### Core Tables

**organizations**: Multi-tenant organizations
- Stripe subscription data
- Subscription tier/status

**workspaces**: Multiple workspaces per organization
- Isolated data containers
- Custom branding (color, icon)

**organization_members**: User permissions
- Role-based access (owner, admin, member, guest)
- Join tracking

**custom_fields**: Dynamic field definitions
- Field type (text, number, date, etc.)
- Workspace-specific

**views**: Saved view configurations
- View type, filters, sorting
- Permission levels

### Module Tables
Generic tables that follow this pattern:
```sql
CREATE TABLE {module_name} (
    id UUID PRIMARY KEY,
    workspace_id UUID REFERENCES workspaces(id),
    name TEXT,
    status TEXT,
    custom_fields JSONB,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

### Row Level Security (RLS)
All tables use RLS policies based on:
- User's organization membership
- User's role
- Workspace access

Example policy:
```sql
CREATE POLICY "Users can view items in their workspaces"
ON projects FOR SELECT
USING (workspace_id IN (
    SELECT w.id FROM workspaces w
    JOIN organization_members om ON w.organization_id = om.organization_id
    WHERE om.user_id = auth.uid()
));
```

## Real-time Collaboration

### Supabase Real-time Subscriptions
```typescript
supabase
  .channel(`workspace:${workspaceId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    filter: `workspace_id=eq.${workspaceId}`
  }, handleChange)
  .subscribe()
```

### User Presence
Tracks active users in each workspace:
- Current location (module/view)
- Cursor position (for collaborative editing)
- Last seen timestamp

## Stripe Integration

### Subscription Management
- 4 tiers: Free, Pro, Business, Enterprise
- Seat-based pricing
- Trial periods
- Usage tracking

### Marketplace
- One-time purchases (templates, integrations)
- Vendor onboarding (Stripe Connect)
- Transaction fee handling
- Payout management

## State Management

### UI Store (`ui-store.ts`)
- Sidebar collapsed state
- Right sidebar open/closed
- Theme (light/dark/high-contrast)
- Density (compact/comfortable/spacious)
- Current workspace/module/view

### Workspace Store (`workspace-store.ts`)
- Organizations list
- Current organization
- Workspaces list
- Organization members

### Collaboration Store (`collaboration-store.ts`)
- User presence
- Activity feed
- Comments by entity
- Unread notifications count

## Performance Optimizations

1. **Virtualization**: Large lists use virtual scrolling (1000+ items)
2. **Optimistic Updates**: UI updates before server confirmation
3. **Debounced Search**: Search input debounced (300ms)
4. **Lazy Loading**: Images and heavy components load on demand
5. **React Query**: Data fetching with caching and invalidation
6. **Indexes**: Database indexes on frequently queried columns

## Deployment

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

### Build & Deploy
```bash
npm run build
npm run start
```

### Database Migrations
```bash
# Run migrations on Supabase
supabase db push
```

## Extending the Platform

### Adding a New Module
1. Add module config to `lib/modules/registry.ts`
2. Create table in Supabase with RLS policies
3. Add routes: `app/(dashboard)/workspace/[workspaceId]/[module]/page.tsx`
4. (Optional) Create custom components in `components/modules/[module]`

### Adding a New View Type
1. Add view definition to `lib/views/registry.ts`
2. Create view component in `components/views/[view-name].tsx`
3. Add view type to TypeScript types
4. Register in view switcher

### Adding Custom Fields
1. User creates field via UI
2. Stored in `custom_fields` table
3. Values stored in module table's `custom_fields` JSONB column
4. Rendered dynamically in views

## Security

1. **RLS Policies**: All data access controlled at database level
2. **API Routes**: Validated with Supabase service role
3. **CORS**: Configured for production domains
4. **Rate Limiting**: Implemented on API routes
5. **Input Validation**: Zod schemas for all forms
6. **XSS Protection**: React escapes by default
7. **CSRF Protection**: Next.js built-in

## Testing

### Unit Tests
```bash
npm run test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Monitoring

- **Supabase Dashboard**: Database metrics, real-time connections
- **Stripe Dashboard**: Payment metrics, subscription status
- **Vercel Analytics**: Performance metrics, Core Web Vitals
- **Error Tracking**: Sentry integration (optional)

## Support

For issues and questions:
1. Check documentation
2. Review GitHub issues
3. Contact support team
