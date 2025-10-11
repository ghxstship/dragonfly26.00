# ClickUp Clone - Multi-Tenant Project Management Platform

A production-ready, multi-tenant ClickUp-style project management platform with universal data architecture and comprehensive visualization capabilities.

## Features

### Core Architecture
- ✅ Multi-tenant Supabase backend with Row Level Security (RLS)
- ✅ Organization-based data isolation with workspace switching
- ✅ Generic schema mapping - dynamically adapt to any Supabase table structure
- ✅ Real-time subscriptions for live collaborative updates
- ✅ Role-based access control (RBAC) - Owner, Admin, Member, Guest

### Stripe Integration
- ✅ Subscription Management (Free, Pro, Business, Enterprise tiers)
- ✅ Usage-based and seat-based pricing
- ✅ Marketplace for templates and integrations
- ✅ Vendor onboarding and payout management

### 13 Core Modules

#### Operations Hub
- Projects - Project/task management
- People - Team members, contacts, stakeholders
- Events - Calendar, meetings, milestones
- Assets - Equipment, inventory, resources
- Locations - Sites, offices, facilities
- Files - Document management, attachments

#### Marketplace Hub
- Marketplace - Browse/purchase templates, integrations
- Resources - Shared resource library

#### Business Hub
- Finance - Budget tracking, expenses, invoicing
- Procurement - Purchase orders, vendor management
- Jobs - Hiring, applicants, job postings

#### Intelligence Hub
- Reports - Custom report builder
- Analytics - Dashboards, metrics, insights

### 18+ Universal Data Views
1. **List View** - Grouped rows with inline editing
2. **Board/Kanban View** - Drag-and-drop swimlanes
3. **Table View** - Spreadsheet-style grid
4. **Calendar View** - Month/Week/Day/Agenda modes
5. **Timeline/Gantt View** - Dependencies and milestones
6. **Workload View** - Team capacity planning
7. **Map View** - Geographic visualization
8. **Mind Map View** - Hierarchical node diagram
9. **Form View** - Public-facing data collection
10. **Activity/Feed View** - Chronological activity stream
11. **Box View** - Card-based grid layout
12. **Embed View** - Iframe external content
13. **Chat/Inbox View** - Threaded conversations
14. **Dashboard/Widget View** - Customizable widget grid
15. **Doc View** - Collaborative rich text editing
16. **Financial Dashboard** - Budget and expense tracking
17. **Portfolio View** - Multi-project overview
18. **Pivot Table View** - Multi-dimensional analysis

### UI Features
- ✅ Top navigation with workspace switcher and global search (Cmd+K)
- ✅ Collapsible left sidebar with module navigation
- ✅ Contextual right sidebar with activity feed
- ✅ Light/Dark/High-contrast themes
- ✅ Responsive mobile layout
- ✅ Real-time collaboration with user presence
- ✅ Bulk actions and advanced filtering
- ✅ Template marketplace
- ✅ Import/Export (CSV, Excel, JSON, PDF)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Stripe account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd clickup-clone
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase and Stripe credentials.

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase Setup

Run the SQL migrations in `/supabase/migrations` to set up the database schema:

1. Organizations and workspaces
2. User roles and permissions
3. Module tables with RLS policies
4. Real-time subscriptions

### Stripe Setup

Configure Stripe products and prices:
- Free tier (0/month)
- Pro tier ($10/month)
- Business tier ($25/month)
- Enterprise tier (Custom)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main application pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── layout/           # Layout components (nav, sidebar)
│   ├── views/            # Data view components
│   ├── modules/          # Module-specific components
│   └── shared/           # Shared components
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase client and utilities
│   ├── stripe/           # Stripe integration
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Helper functions
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions
└── styles/               # Global styles
```

## Key Technologies

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Real-time, Auth, Storage)
- **Payments**: Stripe
- **State Management**: Zustand, React Query
- **Data Tables**: TanStack Table
- **Drag & Drop**: dnd-kit
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Adding a New Module

1. Create module configuration in `src/lib/modules/registry.ts`
2. Add module routes in `src/app/(dashboard)/[workspace]/[module]`
3. Create module-specific components in `src/components/modules/[module]`
4. Set up Supabase tables with RLS policies

### Adding a New View Type

1. Create view component in `src/components/views/[view-name]`
2. Register view in `src/lib/views/registry.ts`
3. Add view configuration interface in `src/types/views.ts`
4. Implement view controls (filters, sorting, grouping)

## Performance

- Initial load: < 2 seconds
- View switching: < 300ms
- Real-time updates: < 500ms latency
- Virtualization for 1000+ items
- Optimistic UI updates

## Contributing

This is a whitelabel-ready platform designed to adapt to any Supabase schema. Contributions should maintain this flexibility and avoid domain-specific business logic.

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
