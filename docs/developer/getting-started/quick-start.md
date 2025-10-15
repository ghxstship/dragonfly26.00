# 🚀 Developer Quick Start

[← Back to Developer Documentation](../README.md)

**Get your development environment running in 10 minutes**

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Supabase Account** - [Sign up](https://supabase.com/) (free tier available)
- **Code Editor** - VS Code recommended

**Recommended VS Code Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

---

## Quick Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/dragonfly26.00.git
cd dragonfly26.00
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

**Installation Time:** ~2-3 minutes depending on internet speed

### 3. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

**Edit `.env.local` with your values:**

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true

# Stripe Configuration (Optional for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

**Where to Find Supabase Keys:**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to Settings → API
4. Copy URL and keys

### 4. Set Up Supabase Database

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

**Alternative:** Use Supabase Dashboard to run migrations manually:
1. Go to SQL Editor in Supabase Dashboard
2. Copy contents of each migration file from `supabase/migrations/`
3. Run in order (000_foundation.sql first)

### 5. Start Development Server

```bash
# Start the Next.js dev server
npm run dev

# Or with yarn
yarn dev
```

**Server starts at:** `http://localhost:3000`

**Build Time:** ~30 seconds first run, ~5 seconds on subsequent starts

---

## Verify Installation

### Check Development Server

1. **Open Browser**: Navigate to `http://localhost:3000`
2. **You Should See**: Dragonfly login page
3. **Check Console**: No errors in browser console

### Test Database Connection

The app should load without errors. If you see database errors:

1. Verify Supabase credentials in `.env.local`
2. Check that migrations ran successfully
3. Verify Supabase project is active

### Enable Demo Mode

For development without a Supabase database:

```bash
# In .env.local
NEXT_PUBLIC_DEMO_MODE=true
```

Demo mode uses mock data for all modules.

---

## Project Structure

```
dragonfly26.00/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── [locale]/       # Internationalized routes
│   │   ├── api/            # API routes
│   │   └── auth/           # Auth pages
│   ├── components/          # React components
│   │   ├── dashboard/      # Dashboard module
│   │   ├── projects/       # Projects module
│   │   ├── events/         # Events module
│   │   └── ...             # Other modules
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and helpers
│   │   ├── supabase/       # Supabase client
│   │   └── modules/        # Mock data
│   ├── i18n/               # Internationalization
│   └── types/              # TypeScript types
├── supabase/
│   ├── migrations/         # SQL migrations
│   ├── functions/          # Edge functions
│   └── config.toml         # Supabase config
├── public/                 # Static assets
├── docs/                   # Documentation
└── package.json            # Dependencies
```

---

## Development Workflow

### Running Commands

```bash
# Development server (with hot reload)
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit files in `src/`
   - Changes hot-reload automatically

3. **Test your changes**
   - Verify in browser
   - Check console for errors
   - Test on mobile viewport

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### File Watching

Next.js watches for changes:
- ✅ **Auto-reloads** on file save
- ✅ **Fast refresh** preserves component state
- ✅ **Error overlay** shows compilation errors
- ✅ **TypeScript** checks in real-time

---

## Common Development Tasks

### Add a New Component

```bash
# Create component file
touch src/components/your-module/your-component.tsx
```

```tsx
// src/components/your-module/your-component.tsx
import React from 'react';

interface YourComponentProps {
  title: string;
}

export function YourComponent({ title }: YourComponentProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}
```

### Add a New Route

```bash
# Create route file in app directory
touch src/app/[locale]/your-route/page.tsx
```

```tsx
// src/app/[locale]/your-route/page.tsx
export default function YourRoutePage() {
  return (
    <div>
      <h1>Your Route</h1>
    </div>
  );
}
```

Access at: `http://localhost:3000/en/your-route`

### Add a Custom Hook

```bash
# Create hook file
touch src/hooks/use-your-hook.ts
```

```ts
// src/hooks/use-your-hook.ts
import { useState, useEffect } from 'react';

export function useYourHook() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Your logic here
  }, []);
  
  return { data };
}
```

### Add a Database Migration

```bash
# Create migration file
supabase migration new your_migration_name
```

Edit the generated file in `supabase/migrations/`:

```sql
-- Description: Your migration description

-- Add your SQL here
CREATE TABLE your_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Apply migration:
```bash
supabase db push
```

---

## Debugging

### Browser DevTools

**Chrome/Edge DevTools:**
- Press `F12` or `Cmd/Ctrl + Shift + I`
- **Console**: View logs and errors
- **Network**: Monitor API calls
- **React DevTools**: Inspect component tree

### VS Code Debugging

**Launch Configuration** (`.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Common Issues

**Port Already in Use:**
```bash
# Kill process on port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Module Not Found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build Errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**TypeScript Errors:**
```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## Environment Modes

### Development Mode

```bash
npm run dev
```

- Hot module replacement
- Detailed error messages
- Source maps enabled
- Demo mode available

### Production Build

```bash
npm run build
npm run start
```

- Optimized bundle
- Minified code
- Production error handling
- Better performance

### Demo Mode

Set in `.env.local`:
```bash
NEXT_PUBLIC_DEMO_MODE=true
```

- Uses mock data instead of Supabase
- Perfect for development without database
- All features functional with realistic data
- No authentication required

---

## Testing

### Run Type Check

```bash
npm run type-check
```

### Run Linter

```bash
npm run lint
```

### Fix Linting Issues

```bash
npm run lint -- --fix
```

---

## Git Workflow

### Commit Message Convention

Follow conventional commits:

```bash
# Feature
git commit -m "feat: add new dashboard widget"

# Bug fix
git commit -m "fix: resolve calendar rendering issue"

# Documentation
git commit -m "docs: update API documentation"

# Refactor
git commit -m "refactor: simplify data fetching logic"

# Style
git commit -m "style: format code with prettier"

# Test
git commit -m "test: add unit tests for hooks"
```

### Branch Naming

```bash
feature/add-dashboard-widget
fix/calendar-rendering-bug
docs/update-api-docs
refactor/data-fetching
```

---

## Next Steps

Now that your environment is set up:

1. ✅ **[Understand Project Structure](project-structure.md)**
2. ✅ **[Learn Development Workflow](development-workflow.md)**
3. ✅ **[Read Architecture Overview](../architecture/overview.md)**
4. ✅ **[Explore Component Guidelines](../guides/component-guidelines.md)**
5. ✅ **[Check Contribution Guidelines](contributing.md)**

---

## Helpful Commands Cheat Sheet

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run type-check      # Check TypeScript
npm run lint            # Run ESLint

# Database
supabase db push        # Apply migrations
supabase db reset       # Reset database
supabase db diff        # Show schema diff
supabase migration new  # Create migration

# Git
git checkout -b feature/name  # New branch
git add .                     # Stage changes
git commit -m "message"       # Commit
git push origin branch-name   # Push to remote

# Package Management
npm install             # Install dependencies
npm install package     # Add package
npm uninstall package   # Remove package
npm update             # Update packages
```

---

## Support

**Need Help?**
- 📚 [Read the documentation](../README.md)
- 🐛 [Report bugs](https://github.com/your-org/dragonfly/issues)
- 💬 [Join discussions](https://github.com/your-org/dragonfly/discussions)
- 📧 [Email support](mailto:dev@dragonfly.com)

**Welcome to Dragonfly Development! 🚀**

[← Back to Developer Documentation](../README.md)
