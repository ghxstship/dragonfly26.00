# GATED INVITE & WAITLIST SYSTEM - DEPLOYMENT GUIDE

**Version:** 1.0  
**Last Updated:** January 24, 2025  
**Status:** PRODUCTION READY

---

## PRE-DEPLOYMENT CHECKLIST

### Environment Requirements
- [ ] Supabase project configured
- [ ] Database migrations ready
- [ ] Environment variables set
- [ ] Email service configured (optional for Phase 1)
- [ ] Legend user exists in database

### Code Requirements
- [ ] All files committed to repository
- [ ] TypeScript compilation successful
- [ ] ESLint passing
- [ ] No console errors

---

## DEPLOYMENT STEPS

### Step 1: Environment Variables

Add to `.env.local` (development) and production environment:

```env
# Email Service (Optional - can deploy without)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM="ATLVS <noreply@atlvs.com>"

# Feature Flags (Optional)
NEXT_PUBLIC_INVITE_ONLY=true
NEXT_PUBLIC_WAITLIST_ENABLED=true
```

**Note:** Email functionality is optional. System works without it, but users won't receive automated emails.

### Step 2: Install Dependencies (If using email)

```bash
# Optional: For React Email templates
npm install @react-email/render react-email

# Or use the simple HTML templates (already implemented)
# No additional dependencies needed
```

### Step 3: Run Database Migration

```bash
# Apply migration to Supabase
supabase migration up

# Or via Supabase Dashboard:
# 1. Go to Database > Migrations
# 2. Upload: supabase/migrations/20251104183600_gated_invite_waitlist_system.sql
# 3. Run migration
```

### Step 4: Verify Database Tables

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('waitlist', 'invite_codes', 'invite_code_usage');

-- Should return 3 rows

-- Check RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('waitlist', 'invite_codes', 'invite_code_usage');

-- Should return multiple policies

-- Verify functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'is_email_authorized',
    'validate_invite_code',
    'record_invite_code_usage',
    'get_waitlist_position',
    'get_waitlist_stats'
  );

-- Should return 5 functions
```

### Step 5: Create Legend User (If Needed)

```sql
-- Check if Legend role exists
SELECT * FROM roles WHERE level = 1;

-- Create Legend user assignment (replace with actual user_id)
INSERT INTO user_role_assignments (user_id, role_id, organization_id)
SELECT 
  'YOUR_USER_ID_HERE'::uuid,
  r.id,
  NULL  -- Legend can be NULL
FROM roles r
WHERE r.level = 1;
```

### Step 6: Test API Endpoints

**Test 1: Submit to Waitlist**
```bash
curl -X POST http://localhost:3000/api/waitlist/submit \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "full_name": "Test User",
    "company": "Test Company",
    "use_case": "Testing the waitlist system"
  }'

# Expected: 201 Created with waitlist_id
```

**Test 2: Check Waitlist Status**
```bash
curl http://localhost:3000/api/waitlist/check?email=test@example.com

# Expected: 200 OK with status and position
```

**Test 3: Validate Signup (Should Fail)**
```bash
curl -X POST http://localhost:3000/api/auth/validate-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# Expected: { "authorized": false, "reason": "..." }
```

**Test 4: Legend - List Waitlist (Requires Auth)**
```bash
# Must be authenticated as Legend user
# Test via browser at /admin/waitlist
```

### Step 7: Test User Flows

**Flow 1: Unauthorized Signup**
1. Navigate to `/signup`
2. Enter email without invitation
3. Click "Create account"
4. Should redirect to `/waitlist?email=...`
5. Complete waitlist form
6. Should see success message with position

**Flow 2: Waitlist Status Check**
1. Navigate to `/waitlist/status`
2. Enter waitlist email
3. Should see position and status

**Flow 3: Legend Dashboard**
1. Login as Legend user
2. Navigate to `/admin/waitlist`
3. Should see waitlist entries
4. Click "Approve" on an entry
5. Enter organization ID, workspace ID, role
6. Should create invitation
7. Entry status should change to "invited"

**Flow 4: Invite Code Signup**
1. Create invite code via admin (future feature)
2. Navigate to `/signup?code=TESTCODE`
3. Enter details with code
4. Should allow signup

### Step 8: Monitor Logs

```bash
# Check Supabase logs
supabase logs

# Check application logs
# Look for:
# - "Waitlist submission error"
# - "Waitlist approve error"
# - "Email send error" (if email configured)
```

---

## POST-DEPLOYMENT VERIFICATION

### Database Verification

```sql
-- Check waitlist entries
SELECT COUNT(*) FROM waitlist;

-- Check invite codes
SELECT COUNT(*) FROM invite_codes;

-- Check RLS is working (should return 0 for non-Legend)
SELECT COUNT(*) FROM waitlist WHERE status = 'pending';
-- Run as non-Legend user - should return 0 or error
```

### Frontend Verification

- [ ] `/waitlist` page loads
- [ ] `/waitlist/status` page loads
- [ ] `/admin/waitlist` requires Legend role
- [ ] `/signup` validates email
- [ ] Unauthorized signup redirects to waitlist

### API Verification

- [ ] Waitlist submission works
- [ ] Status check works
- [ ] Signup validation works
- [ ] Legend endpoints require authentication
- [ ] Non-Legend users get 403 errors

---

## ROLLBACK PLAN

If issues occur, rollback in reverse order:

### 1. Disable Feature (Immediate)

```env
# Set in production environment
NEXT_PUBLIC_INVITE_ONLY=false
```

This disables gated signup while keeping waitlist functional.

### 2. Revert Frontend Changes

```bash
git revert <commit-hash>
git push origin main
```

### 3. Rollback Database (If Necessary)

```sql
-- Drop tables (CAUTION: Loses data)
DROP TABLE IF EXISTS invite_code_usage CASCADE;
DROP TABLE IF EXISTS invite_codes CASCADE;
DROP TABLE IF EXISTS waitlist CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS is_email_authorized(TEXT);
DROP FUNCTION IF EXISTS validate_invite_code(TEXT, TEXT);
DROP FUNCTION IF EXISTS record_invite_code_usage(UUID, TEXT, UUID, INET, TEXT);
DROP FUNCTION IF EXISTS get_waitlist_position(TEXT);
DROP FUNCTION IF EXISTS get_waitlist_stats();

-- Revert invitations table changes
ALTER TABLE invitations DROP COLUMN IF EXISTS source;
ALTER TABLE invitations DROP COLUMN IF EXISTS waitlist_id;
```

---

## MONITORING & MAINTENANCE

### Key Metrics to Monitor

1. **Waitlist Growth**
   ```sql
   SELECT 
     DATE(created_at) as date,
     COUNT(*) as submissions
   FROM waitlist
   GROUP BY DATE(created_at)
   ORDER BY date DESC
   LIMIT 30;
   ```

2. **Approval Rate**
   ```sql
   SELECT 
     status,
     COUNT(*) as count,
     ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
   FROM waitlist
   GROUP BY status;
   ```

3. **Average Wait Time**
   ```sql
   SELECT 
     AVG(EXTRACT(EPOCH FROM (invited_at - created_at)) / 3600) as avg_hours
   FROM waitlist
   WHERE status = 'invited' AND invited_at IS NOT NULL;
   ```

4. **Invite Code Usage**
   ```sql
   SELECT 
     ic.code,
     ic.current_uses,
     ic.max_uses,
     COUNT(icu.id) as actual_uses
   FROM invite_codes ic
   LEFT JOIN invite_code_usage icu ON ic.id = icu.invite_code_id
   GROUP BY ic.id, ic.code, ic.current_uses, ic.max_uses;
   ```

### Daily Tasks

- [ ] Review pending waitlist entries
- [ ] Approve/reject applications
- [ ] Monitor email delivery (if configured)
- [ ] Check for expired invitations

### Weekly Tasks

- [ ] Review waitlist metrics
- [ ] Analyze approval patterns
- [ ] Check invite code effectiveness
- [ ] Clean up expired entries

### Monthly Tasks

- [ ] Export waitlist data for analysis
- [ ] Review and update invite codes
- [ ] Analyze conversion rates
- [ ] Update documentation

---

## TROUBLESHOOTING

### Issue: Users Can't Submit to Waitlist

**Symptoms:** 500 error on waitlist submission

**Solutions:**
1. Check database connection
2. Verify RLS policies allow public insert
3. Check API route logs
4. Verify email validation

```sql
-- Test RLS policy
SET ROLE anon;
INSERT INTO waitlist (email, full_name) 
VALUES ('test@test.com', 'Test');
-- Should succeed
```

### Issue: Legend Can't Access Dashboard

**Symptoms:** 403 error or redirect

**Solutions:**
1. Verify user has Legend role assignment
2. Check RLS policies
3. Verify API authentication

```sql
-- Check user's roles
SELECT 
  u.email,
  r.name,
  r.level
FROM auth.users u
JOIN user_role_assignments ura ON u.id = ura.user_id
JOIN roles r ON ura.role_id = r.id
WHERE u.email = 'legend@example.com';
-- Should show level = 1
```

### Issue: Emails Not Sending

**Symptoms:** No emails received

**Solutions:**
1. Check RESEND_API_KEY is set
2. Verify email service is configured
3. Check API logs for email errors
4. Test email service directly

```bash
# Test Resend API
curl https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "noreply@atlvs.com",
    "to": ["test@example.com"],
    "subject": "Test",
    "html": "<p>Test</p>"
  }'
```

### Issue: Signup Not Redirecting

**Symptoms:** Unauthorized users can signup

**Solutions:**
1. Check validation API is working
2. Verify frontend validation logic
3. Check for JavaScript errors
4. Test validation endpoint directly

---

## SECURITY CONSIDERATIONS

### Legend-Only Access

- ✅ Database RLS enforces level = 1
- ✅ API routes check Legend role
- ✅ Frontend verifies permissions
- ✅ Non-Legend users get 403

### Data Protection

- ✅ Email addresses encrypted in transit
- ✅ RLS prevents unauthorized access
- ✅ Input validation prevents injection
- ✅ Rate limiting prevents abuse

### Audit Trail

- ✅ All approvals tracked (reviewed_by, reviewed_at)
- ✅ Invite code usage logged
- ✅ Timestamps on all records
- ✅ Status changes tracked

---

## PERFORMANCE OPTIMIZATION

### Database Indexes

All necessary indexes created in migration:
- `idx_waitlist_email` - Fast email lookups
- `idx_waitlist_status` - Status filtering
- `idx_waitlist_priority` - Queue ordering
- `idx_invite_codes_code` - Code validation
- And more...

### Query Optimization

```sql
-- Use pagination for large lists
SELECT * FROM waitlist 
WHERE status = 'pending'
ORDER BY priority DESC, created_at ASC
LIMIT 50 OFFSET 0;

-- Use indexes for searches
SELECT * FROM waitlist 
WHERE email ILIKE '%search%'
OR full_name ILIKE '%search%';
```

### Caching Recommendations

- Cache waitlist stats (5 minute TTL)
- Cache invite code validation (1 minute TTL)
- Don't cache user-specific data

---

## SUPPORT & MAINTENANCE

### Getting Help

1. Check this documentation
2. Review error logs
3. Check Supabase dashboard
4. Contact development team

### Reporting Issues

Include:
- Error message
- Steps to reproduce
- User role (Legend/other)
- Browser/environment
- Screenshots if applicable

---

## APPENDIX

### A. Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RESEND_API_KEY` | No | - | Resend API key for emails |
| `EMAIL_FROM` | No | `ATLVS <noreply@atlvs.com>` | From email address |
| `NEXT_PUBLIC_INVITE_ONLY` | No | `false` | Enable invite-only mode |
| `NEXT_PUBLIC_WAITLIST_ENABLED` | No | `true` | Enable waitlist |

### B. Database Schema Quick Reference

**waitlist**
- Primary: `id`, `email`, `full_name`
- Status: `status`, `priority`
- Tracking: `created_at`, `invited_at`, `reviewed_at`

**invite_codes**
- Primary: `id`, `code`
- Limits: `max_uses`, `current_uses`
- Validity: `valid_from`, `valid_until`, `is_active`

**invite_code_usage**
- Primary: `id`
- References: `invite_code_id`, `user_id`
- Tracking: `used_at`, `ip_address`

### C. API Endpoints Quick Reference

**Public:**
- `POST /api/waitlist/submit`
- `GET /api/waitlist/check`
- `POST /api/auth/validate-signup`

**Legend-Only:**
- `GET /api/admin/waitlist/list`
- `POST /api/admin/waitlist/approve`
- `POST /api/admin/waitlist/reject`
- `POST /api/admin/invite-codes/create`

---

**Document Version:** 1.0  
**Deployment Status:** READY  
**Last Tested:** January 24, 2025
