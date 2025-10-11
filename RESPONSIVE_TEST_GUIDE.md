# Responsive Header Testing Guide

## Quick Test Checklist

### Desktop (≥1280px)
- [ ] All three sections visible (left, center, right)
- [ ] Breadcrumbs displayed after workspace name
- [ ] Status indicator showing "Synced" with green icon
- [ ] Focus mode button visible
- [ ] All quick action icons visible (Calendar, Tasks, Docs, Apps, Help)
- [ ] "New" button shows text label
- [ ] "Upgrade" button shows text label
- [ ] Theme toggle visible
- [ ] Notification badge displays count
- [ ] User avatar with dropdown chevron

### Tablet (768px - 1023px)
- [ ] Breadcrumbs hidden
- [ ] Status indicator hidden
- [ ] Focus mode hidden
- [ ] Quick actions visible but compressed
- [ ] "New" button text visible
- [ ] "Upgrade" button text visible
- [ ] Search bar still prominent
- [ ] All dropdowns functional

### Mobile (<768px)
- [ ] App logo visible
- [ ] Workspace switcher compressed
- [ ] Search shows "Search..." (shorter text)
- [ ] Keyboard shortcut hint hidden on very small screens
- [ ] Quick actions toolbar hidden
- [ ] "New" button shows icon only
- [ ] "Upgrade" button hidden
- [ ] User dropdown chevron hidden
- [ ] Notification bell visible
- [ ] Theme toggle visible

## Interactive Elements

### Command Palette (⌘K)
- [ ] Opens on button click
- [ ] Opens with keyboard shortcut
- [ ] Shows search input
- [ ] Displays grouped commands
- [ ] Closes on selection
- [ ] Closes on escape

### Notifications Panel
- [ ] Opens on bell icon click
- [ ] Shows unread count badge
- [ ] Tabs work (All/Unread/Mentions)
- [ ] Notifications grouped by time
- [ ] Color-coded by type
- [ ] Priority badges visible
- [ ] "Mark read" button works
- [ ] Empty states display correctly

### Theme Toggle
- [ ] Dropdown opens on click
- [ ] Light theme works
- [ ] Dark theme works
- [ ] System theme works
- [ ] Theme persists on reload
- [ ] Smooth transition between themes

### Workspace Switcher
- [ ] Opens dropdown
- [ ] Search input works
- [ ] Filters workspaces
- [ ] Displays workspace icons
- [ ] Shows current workspace indicator
- [ ] "Create workspace" button visible

### Create Menu
- [ ] Opens on "New" button
- [ ] Shows keyboard shortcuts
- [ ] All menu items clickable
- [ ] Menu items grouped logically
- [ ] Closes after selection

### User Menu
- [ ] Opens on avatar click
- [ ] Shows user info (name, email)
- [ ] Keyboard shortcuts displayed
- [ ] Menu items grouped
- [ ] "Log out" in destructive color

## Browser Testing

### Chrome/Edge
- [ ] All features work
- [ ] Backdrop blur visible
- [ ] Animations smooth

### Firefox
- [ ] All features work
- [ ] Fallback for backdrop blur
- [ ] Animations smooth

### Safari
- [ ] All features work
- [ ] Backdrop blur visible
- [ ] Touch gestures work on iPad

## Performance Checks

- [ ] No layout shift on load
- [ ] Smooth scrolling with sticky header
- [ ] No jank on theme switch
- [ ] Fast dropdown open/close
- [ ] Tooltips appear quickly (300ms delay)
- [ ] No console errors

## Accessibility Checks

- [ ] Tab navigation works through all elements
- [ ] Focus visible on all interactive elements
- [ ] Screen reader announces all actions
- [ ] Keyboard shortcuts work
- [ ] Color contrast sufficient (WCAG AA)
- [ ] All icons have ARIA labels

## Visual Regression Points

Compare these elements to screenshots:

1. **Header height**: Should be exactly 56px (3.5rem)
2. **Logo size**: 32px × 32px
3. **Button heights**: All 36px (h-9)
4. **Avatar size**: 28px (h-7 w-7)
5. **Icon sizes**: Consistently 16px (h-4 w-4)
6. **Badge size**: 20px min-width, 20px height
7. **Spacing**: 4px gap between most elements

## Common Issues to Check

### Layout Issues
- [ ] No horizontal scrollbar
- [ ] Elements don't wrap awkwardly
- [ ] No element overlap
- [ ] Proper z-index (header should be z-50)

### Interaction Issues
- [ ] Dropdowns don't close immediately
- [ ] Tooltips don't conflict with dropdowns
- [ ] Click outside closes dropdowns
- [ ] Escape key closes modals

### Styling Issues
- [ ] Border colors consistent
- [ ] Hover states visible
- [ ] Active states clear
- [ ] Disabled states apparent
- [ ] Loading states present

## Dev Tools Responsive Testing

Use these viewport presets in browser dev tools:

1. **iPhone SE** (375px): Minimum mobile support
2. **iPhone 14 Pro** (393px): Modern mobile
3. **iPad Mini** (768px): Tablet breakpoint
4. **iPad Pro** (1024px): Large tablet
5. **Laptop** (1280px): Small desktop
6. **Desktop** (1920px): Standard desktop
7. **4K** (2560px): Large desktop

## Testing Commands

```bash
# Start dev server
npm run dev

# Open in different viewports (if using Playwright/Cypress)
npm run test:visual

# Check for console errors
# Open browser console and look for:
# - Type errors
# - Failed network requests
# - Hydration mismatches
# - PropTypes warnings
```

## Sign-off

Once all checkboxes are complete, the header is ready for production.

**Tested by**: _____________  
**Date**: _____________  
**Browser versions**: _____________  
**Issues found**: _____________
