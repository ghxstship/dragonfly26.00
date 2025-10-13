# Onboarding Profile Fix

## Issue
The onboarding page was throwing an error:
```
Could not find the 'title' column of 'profiles' in the schema cache
```

## Root Cause
The code was using incorrect column names for the `profiles` table:
- Code was using `title`, but the database column is `job_title`
- Code in invitations API was using `name`, but the database column is `full_name`

## Database Schema
The `profiles` table has the following columns (from migrations):
- `full_name` TEXT (not `name`)
- `job_title` TEXT (not `title`) - added in migration 018
- `bio` TEXT
- `avatar_url` TEXT
- `stripe_customer_id` TEXT
- `onboarding_completed` BOOLEAN
- `onboarding_completed_at` TIMESTAMPTZ

## Fixes Applied

### 1. Onboarding Welcome Page
**File:** `src/app/[locale]/(onboarding)/onboarding/welcome/page.tsx`

**Changes:**
- Line 50: Changed `title: data.title || ''` to `title: data.job_title || ''`
- Line 71: Changed `title: profile.title` to `job_title: profile.title`

This ensures the onboarding form correctly reads and writes the `job_title` column.

### 2. Invitations API
**File:** `src/app/api/invitations/send/route.ts`

**Changes:**
- Line 45: Changed `.select('name')` to `.select('full_name')`
- Line 49: Changed `profile?.name` to `profile?.full_name`

This ensures the invitation system correctly retrieves the user's full name.

## Testing
To test the fix:
1. Navigate to `/onboarding/welcome`
2. Fill in the profile form including the "Job Title" field
3. Click "Continue"
4. The form should save successfully without schema errors

## Additional Fix: Locale Routing

### Issue
After the profile fix, onboarding navigation was throwing 404 errors because routes were missing the locale prefix.

### Root Cause
The app uses `[locale]` dynamic routing (e.g., `/en/`, `/es/`), but all `router.push()` calls in onboarding were navigating to routes without the locale prefix (e.g., `/onboarding/workspace` instead of `/en/onboarding/workspace`).

### Solution
Updated all onboarding pages to:
1. Import `useParams` from `next/navigation`
2. Extract the `locale` from params
3. Include `/${locale}` prefix in all router.push() calls

**Files Updated:**
- `src/app/[locale]/(onboarding)/onboarding/welcome/page.tsx`
- `src/app/[locale]/(onboarding)/onboarding/workspace/page.tsx`
- `src/app/[locale]/(onboarding)/onboarding/plan/page.tsx`
- `src/app/[locale]/(onboarding)/onboarding/invite/page.tsx`
- `src/app/[locale]/(onboarding)/onboarding/complete/page.tsx`

## Status
✅ Profile schema fixes applied and verified
✅ Locale routing fixes applied and verified
✅ All onboarding routes tested and passing
✅ Complete end-to-end onboarding flow functional
