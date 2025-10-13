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

## Status
✅ All fixes applied and verified
✅ No other instances of incorrect profile column names found in the codebase
