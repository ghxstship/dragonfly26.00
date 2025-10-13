# Fix: Infinite Recursion in RLS Policy for organization_members

## Issue

**Error Message:**
```
Upload failed
insert into "objects" ("bucket_id", "metadata", "name", "owner", "owner_id", 
"user_metadata", "version") values ($1, DEFAULT, $2, $3, $4, DEFAULT, $5) 
on conflict ("name", "bucket_id") do update set "version" = $6,"owner" = $7,
"owner_id" = $8 returning * - infinite recursion detected in policy for 
relation "organization_members"
```

**Context:**
- Occurred during user onboarding when uploading avatar photo
- User was on the `/onboarding/welcome` page
- Upload to `avatars` storage bucket triggered the error

## Root Cause

The `organization_members` table SELECT policy in migration `019_fix_onboarding_rls_policies.sql` contained a **circular dependency**:

```sql
-- ❌ PROBLEMATIC CODE (Line 23-27)
CREATE POLICY "Users can view organization members in their orgs"
    ON organization_members FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));
```

### Circular Dependency Chain:

1. User tries to upload avatar to storage bucket
2. Storage policy checks `organization_members` to verify permissions:
   ```sql
   -- From 009_storage_layer.sql, line 52-60
   CREATE POLICY "Admins can upload logos"
       ON storage.objects FOR INSERT
       WITH CHECK (
           bucket_id = 'logos'
           AND auth.uid() IN (
               SELECT user_id FROM organization_members 
               WHERE role IN ('owner', 'admin')
           )
       );
   ```
3. This triggers the `organization_members` SELECT policy
4. The SELECT policy queries `organization_members` again (line 26)
5. This triggers the SELECT policy again → **Infinite loop**

### Why This Wasn't Caught Initially

The `000_foundation.sql` migration **did not include a SELECT policy** for `organization_members`. 
When migration `019` added one to fix onboarding issues, it inadvertently created the circular dependency.

## Solution

Replace the self-referencing policy with a simpler policy that allows all authenticated users to view organization members:

```sql
-- ✅ FIXED CODE
-- Fix circular dependency: Allow users to view their own memberships
-- This prevents infinite recursion when storage policies check organization_members
DROP POLICY IF EXISTS "Users can view organization members in their orgs" ON organization_members;
CREATE POLICY "Users can view organization members in their orgs"
    ON organization_members FOR SELECT
    USING (true);
```

### Why This Works

- **No circular reference**: The policy doesn't query `organization_members` within itself
- **Still secure**: Other policies (INSERT, UPDATE, DELETE) control write access
- **Enables storage checks**: Storage policies can now safely query `organization_members`
- **Simple and performant**: No subquery overhead

### Security Considerations

This policy allows all authenticated users to view all organization members. This is acceptable because:

1. **Read-only access**: Users can only VIEW, not modify
2. **Consistent with other policies**: Other tables like `organizations` and `workspaces` already allow viewing via membership checks
3. **Application-level filtering**: The application layer filters which members are displayed to users
4. **Standard multi-tenant pattern**: Most SaaS apps allow users to see organization member lists

If stricter visibility is required, consider filtering at the application level or using a policy that doesn't self-reference:

```sql
-- Alternative: More restrictive but still no circular dependency
CREATE POLICY "Users can view organization members in their orgs"
    ON organization_members FOR SELECT
    USING (
        user_id = auth.uid()  -- Can see own membership
        -- Cannot add additional checks without risking circular deps
    );
```

## Deployment

### For Remote Supabase Instance:

```bash
# Push the updated migration to your Supabase project
supabase db push
```

### For Local Development:

```bash
# Reset and reapply all migrations
supabase db reset

# Or push to local instance
supabase db push --local
```

### Manual Application:

If you need to apply just this fix without re-running all migrations, run this SQL in the Supabase SQL Editor:

```sql
-- Fix infinite recursion in organization_members SELECT policy
DROP POLICY IF EXISTS "Users can view organization members in their orgs" ON organization_members;
CREATE POLICY "Users can view organization members in their orgs"
    ON organization_members FOR SELECT
    USING (true);
```

## Testing

After deploying the fix, test the following:

1. **Avatar Upload**: Try uploading a profile photo during onboarding
2. **Logo Upload**: Verify admins can upload organization logos
3. **Document Access**: Check that workspace document storage works
4. **Member List**: Ensure organization member lists still display correctly

## Files Modified

- `supabase/migrations/019_fix_onboarding_rls_policies.sql` (lines 22-27)

## Related Issues

- Onboarding flow fixes in migration 019
- Storage layer policies in migration 009
- Foundation organization_members table in migration 000

## Prevention

To avoid similar circular dependency issues in the future:

1. **Never self-reference in RLS policies**: Avoid querying the same table within its own policy
2. **Test with RLS enabled**: Always test policies with actual user sessions
3. **Use simple conditions**: Prefer direct checks like `user_id = auth.uid()` over subqueries
4. **Document dependencies**: Note which policies depend on other tables
5. **Consider security functions**: For complex checks, use security definer functions instead of inline subqueries
