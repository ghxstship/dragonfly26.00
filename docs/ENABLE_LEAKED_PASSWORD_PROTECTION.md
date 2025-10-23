# Enable Leaked Password Protection

## Overview
The Supabase linter warning `auth_leaked_password_protection` indicates that leaked password protection is currently disabled. This feature checks user passwords against the HaveIBeenPwned.org database to prevent the use of compromised passwords.

## Why This Cannot Be Resolved via SQL Migration
Leaked password protection is an **Auth service configuration setting**, not a database schema setting. It must be enabled through:
1. Supabase Dashboard (recommended)
2. Supabase Management API
3. Supabase CLI (if supported in future versions)

## How to Enable (Dashboard Method)

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Policies** or **Settings**

### Step 2: Enable the Feature
1. Look for **"Password Security"** or **"Leaked Password Protection"** section
2. Toggle **"Enable Leaked Password Protection"** to ON
3. Save changes

### Step 3: Verify
After enabling, the linter warning should disappear on the next lint check.

## How to Enable (Management API Method)

If you need to enable this programmatically, use the Supabase Management API:

```bash
curl -X PATCH \
  "https://api.supabase.com/v1/projects/{project_ref}/config/auth" \
  -H "Authorization: Bearer {service_role_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "SECURITY_LEAKED_PASSWORD_PROTECTION": true
  }'
```

Replace:
- `{project_ref}` with your project reference ID
- `{service_role_key}` with your service role key

## What This Feature Does

When enabled, Supabase Auth will:
1. Check new passwords against the HaveIBeenPwned database during signup
2. Check passwords during password changes
3. Reject passwords that have been compromised in known data breaches
4. Improve overall account security

## Security Benefits

- ✅ Prevents users from using compromised passwords
- ✅ Reduces risk of account takeover attacks
- ✅ Improves compliance with security best practices
- ✅ No performance impact (checks are fast and cached)

## References

- [Supabase Password Security Documentation](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
- [HaveIBeenPwned API](https://haveibeenpwned.com/API/v3)
- [Database Linter Documentation](https://supabase.com/docs/guides/database/database-linter)

## Status

⚠️ **Action Required**: This setting must be manually enabled in the Supabase Dashboard or via the Management API. It cannot be automated through SQL migrations.

---

**Last Updated**: October 22, 2025  
**Migration**: N/A (Dashboard/API configuration only)
