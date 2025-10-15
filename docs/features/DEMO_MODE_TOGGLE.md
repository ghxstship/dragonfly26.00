# Demo Mode Toggle Feature

## Overview

Added a user-friendly toggle to enable/disable demo mode directly from the UI in the profile menu.

## Location

**Profile Menu (User Avatar)** → **Demo Mode Toggle**

Click the user avatar in the top-right corner to access the dropdown menu. The demo mode toggle is located after Profile/Settings options.

## Features

### 1. Toggle Switch in Profile Menu
- Visual switch control with database icon
- Shows current demo mode state (on/off)
- Click to toggle between mock and live data

### 2. Demo Mode Badge in Header
- Badge appears in header when demo mode is active
- Shows "Demo Mode" with database icon
- Positioned next to app logo
- Hidden on mobile screens (< md breakpoint)

### 3. Persistent Setting
- State saved to `localStorage` for persistence
- Automatically reloads page when toggled
- Works per-user, per-browser

## How It Works

### Priority Hierarchy

1. **Environment Variable** - `NEXT_PUBLIC_DEMO_MODE=true` in .env (global)
2. **User Preference** - localStorage setting via UI toggle (per-user)

```typescript
export const isDemoMode = () => {
  // Check env variable first (takes precedence)
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return true
  }
  
  // Check user preference in localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('DEMO_MODE') === 'true'
  }
  
  return false
}
```

## Usage

### Enable Demo Mode
1. Click your avatar (top-right)
2. Click "Demo Mode" toggle
3. Page reloads with mock data
4. Badge appears in header

### Disable Demo Mode
1. Click your avatar
2. Click "Demo Mode" toggle again
3. Page reloads with live Supabase data
4. Badge disappears

## Benefits

- **No .env changes** - Toggle directly in UI
- **Instant visual feedback** - Badge shows state
- **Per-user** - Each user controls their preference
- **Demo-friendly** - Quick switch for presentations
- **Dev-friendly** - Test both modes easily

## Technical Details

### Files Modified

**`/src/components/layout/top-bar.tsx`**
- Added `demoMode` state
- Added `handleToggleDemoMode()` function
- Added badge in header (conditional render)
- Added menu item with Switch component

**`/src/lib/demo-mode.ts`**
- Updated `isDemoMode()` to check localStorage
- Maintains backward compatibility

### State Flow
1. Load from localStorage on mount
2. Toggle updates state + localStorage
3. Page reloads to apply changes
4. Badge visibility updates

## Build Status

✅ **Build successful** - All changes compile without errors
