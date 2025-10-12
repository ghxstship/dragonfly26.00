# Sidebar Layout Standardization

## Issue
The right sidebar drawer tabs had inconsistent header spacing between different panels (Fields, Pages vs Activity, Comments, Time).

## Root Cause
Different panel components were using inconsistent spacing utilities:
- **Correct pattern** (Activity, Comments, Time Tracker): `space-y-4`
- **Incorrect pattern** (Fields, Pages, Sort, Filter, Import, Export, Share): `space-y-6`

## Changes Made

Standardized all right sidebar panel components to use `space-y-4` for consistent spacing:

### Files Updated
1. ✅ `src/components/shared/field-config-panel.tsx` - Changed root spacing from `space-y-6` to `space-y-4`
2. ✅ `src/components/shared/tab-config-panel.tsx` - Changed root spacing from `space-y-6` to `space-y-4`
3. ✅ `src/components/shared/sort-panel.tsx` - Changed root spacing from `space-y-6` to `space-y-4`
4. ✅ `src/components/shared/filter-panel.tsx` - Changed root spacing from `space-y-6` to `space-y-4`
5. ✅ `src/components/shared/import-panel.tsx` - Changed root spacing from `space-y-6` to `space-y-4`
6. ✅ `src/components/shared/export-panel.tsx` - Changed root spacing from `space-y-6` to `space-y-4`
7. ✅ `src/components/shared/share-panel.tsx` - Changed root spacing from `space-y-6` to `space-y-4`

### Files Already Correct
- ✅ `src/components/shared/activity-feed.tsx` - Already uses `space-y-4`
- ✅ `src/components/shared/time-tracker.tsx` - Already uses `space-y-4`
- ✅ `src/components/shared/comments-section.tsx` - Already uses `space-y-4`
- ✅ `src/components/shared/filters-panel.tsx` - Already uses `space-y-4` (Sheet component)

## Result
All right sidebar panels now have uniform spacing between the header and content, creating a consistent user experience across all drawer tabs.

## Layout Pattern
The standardized layout for all right sidebar panels:
```tsx
<div className="space-y-4">
  {/* Panel content sections */}
</div>
```

This creates consistent 1rem (16px) gaps between sections, matching the design system used by Activity, Comments, and Time Tracker tabs.
