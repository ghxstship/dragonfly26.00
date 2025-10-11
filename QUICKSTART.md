# Quick Start Guide

Get your ClickUp clone running locally in 5 minutes.

## Step 1: Installation

```bash
# Clone the repository (or use this directory)
cd /Users/julianclarkson/Documents/Dragonfly26.00

# Install dependencies
npm install
```

## Step 2: Environment Setup

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

For now, you can use the placeholder values to see the UI. To enable full functionality:

### Get Supabase Credentials (Free)

1. Go to [https://supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Project Settings → API
5. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

6. Run the database migration:
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Execute the SQL

### Get Stripe Credentials (Free Test Mode)

1. Go to [https://stripe.com](https://stripe.com)
2. Create a free account
3. Go to Developers → API Keys (Test mode)
4. Copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

## Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Explore the Application

### Available Routes

- **Home**: `/` (redirects to projects)
- **Login**: `/login`
- **Signup**: `/signup`
- **Projects**: `/workspace/default/projects`
- **People**: `/workspace/default/people`
- **Events**: `/workspace/default/events`
- **All 13 modules** available in sidebar

### Test Data

The app includes mock data generator. Navigate to any module to see:
- 20 sample items
- Multiple view types
- Interactive features

### Try Different Views

Click the view switcher dropdown to explore:

1. **List View** - Grouped rows with inline editing
2. **Board View** - Drag-and-drop Kanban board
3. **Table View** - Spreadsheet-style grid
4. **Calendar View** - Month/week/day calendar
5. **Timeline View** - Gantt chart with date ranges
6. **Dashboard View** - Metrics and widgets

### Key Features to Test

**Navigation**
- Toggle sidebar (collapse/expand)
- Click module icons
- Use workspace switcher (top left)

**Global Search**
- Press `Cmd+K` (Mac) or `Ctrl+K` (Windows)
- Search across all modules

**Quick Actions**
- Click "+ New" button
- Create tasks, projects, docs

**Filters & Sorting**
- Click filter icon
- Add multiple filter conditions
- Sort by any column

**Bulk Actions**
- Select multiple items (checkbox)
- Bulk edit, delete, or move

**Item Details**
- Click any item to open detail drawer
- Edit properties
- Add comments
- Track time

**Real-time Collaboration** (requires Supabase)
- Open same page in multiple tabs
- See changes propagate instantly

**Right Sidebar**
- Toggle activity feed
- View comments
- Track time

## Step 5: Customization

### Add Your Own Module

1. Edit `src/lib/modules/registry.ts`
2. Add new module configuration:

```typescript
{
  id: 'custom',
  name: 'Custom Module',
  slug: 'custom',
  description: 'Your custom module',
  icon: 'Star',
  category: 'operations',
  order: 14,
  enabled: true,
  color: '#10b981',
}
```

3. Create corresponding table in Supabase with same structure

### Change Theme

Edit `src/app/globals.css` to customize colors:

```css
:root {
  --primary: 262.1 83.3% 57.8%; /* Change this */
  --accent: 210 40% 96.1%;
  --background: 0 0% 100%;
}
```

### Add Custom Fields

1. Go to any module
2. Click "Settings" or "Custom Fields"
3. Add fields (text, number, date, etc.)
4. Values stored in JSONB column

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Project Structure

```
src/
├── app/                      # Next.js pages
│   ├── (auth)/              # Login/signup
│   ├── (dashboard)/         # Main app
│   └── api/                 # API routes
├── components/
│   ├── ui/                  # Base components
│   ├── layout/              # Navigation
│   ├── views/               # Data views
│   └── shared/              # Reusable components
├── lib/                     # Utilities
│   ├── supabase/           # Database
│   ├── stripe/             # Payments
│   └── modules/            # Configuration
└── types/                   # TypeScript types
```

## Next Steps

1. **Set up Supabase**: Enable full database functionality
2. **Configure Stripe**: Test subscription flows
3. **Customize branding**: Update colors, logo, name
4. **Add modules**: Create custom modules for your use case
5. **Deploy**: Follow DEPLOYMENT.md for production setup

## Troubleshooting

### Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Module not found errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Supabase connection errors

- Check URL and keys in `.env`
- Verify Supabase project is active
- Check RLS policies are set up

### TypeScript errors

```bash
# Restart TypeScript server in VS Code
Cmd+Shift+P → "Restart TypeScript Server"

# Or ignore during dev
npm run dev
```

## Resources

- **Architecture**: See ARCHITECTURE.md
- **Deployment**: See DEPLOYMENT.md
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Stripe Docs**: https://stripe.com/docs

## Support

Questions? Check:
1. README.md for overview
2. ARCHITECTURE.md for technical details
3. Comments in code
4. TypeScript types in `src/types/index.ts`

## What's Included Out of the Box

✅ 13 pre-built modules
✅ 18+ view types
✅ Complete UI component library (40+ components)
✅ Multi-tenant architecture
✅ Row-level security
✅ Real-time collaboration
✅ Stripe subscription management
✅ Auth flows (login/signup)
✅ Global search (Cmd+K)
✅ Bulk actions
✅ Filters & sorting
✅ Comments & activity feed
✅ Time tracking
✅ Custom fields
✅ Dark mode support
✅ Responsive design
✅ TypeScript throughout

Enjoy building your project management platform! 🚀
