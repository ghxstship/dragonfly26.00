# GATED INVITE & WAITLIST SYSTEM - IMPLEMENTATION PLAN

**Status:** AWAITING APPROVAL  
**Created:** January 24, 2025  
**Version:** 1.0

---

## EXECUTIVE SUMMARY

This plan outlines a comprehensive gated invite and waitlist system to restrict platform access to invited users only. The system will prevent unauthorized signups while providing a professional waitlist experience for interested users.

---

## CURRENT STATE ANALYSIS

### Existing Infrastructure
✅ **Already Implemented:**
- Invitations table (`supabase/migrations/008_subscriptions_and_invitations.sql`)
- Invitation acceptance flow (`src/app/[locale]/(auth)/invite/[token]/page.tsx`)
- Basic signup page (`src/app/[locale]/(auth)/signup/page.tsx`)
- Profile auto-creation trigger (`handle_new_user()`)
- RLS policies for invitations

❌ **Missing Components:**
- Waitlist table and management
- Signup validation against invitations
- Waitlist submission flow
- Admin dashboard for waitlist management
- Email notifications for waitlist/invites
- Invite code validation

---

## SYSTEM ARCHITECTURE

### 1. DATABASE LAYER

#### 1.1 New Tables

**`waitlist` Table**
```sql
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User Information
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  company TEXT,
  role TEXT, -- Their current role/position
  use_case TEXT, -- How they plan to use the platform
  
  -- Status Tracking
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected', 'invited')),
  priority INTEGER DEFAULT 0, -- Higher = more priority
  
  -- Metadata
  referral_source TEXT, -- How they heard about us
  metadata JSONB DEFAULT '{}',
  
  -- Admin Notes
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  
  -- Invitation Tracking
  invited_at TIMESTAMPTZ,
  invitation_id UUID REFERENCES invitations(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_status ON waitlist(status);
CREATE INDEX idx_waitlist_priority ON waitlist(priority DESC);
CREATE INDEX idx_waitlist_created ON waitlist(created_at DESC);
```

**`invite_codes` Table** (Optional - for shareable codes)
```sql
CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Code Details
  code TEXT UNIQUE NOT NULL, -- e.g., "LAUNCH2025"
  description TEXT,
  
  -- Usage Limits
  max_uses INTEGER, -- NULL = unlimited
  current_uses INTEGER DEFAULT 0,
  
  -- Validity
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  -- Restrictions
  allowed_domains TEXT[], -- e.g., ['@company.com']
  auto_approve BOOLEAN DEFAULT false, -- Skip waitlist
  
  -- Tracking
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_active ON invite_codes(is_active) WHERE is_active = true;
```

**`invite_code_usage` Table**
```sql
CREATE TABLE invite_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  invite_code_id UUID REFERENCES invite_codes(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  
  used_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invite_code_usage_code ON invite_code_usage(invite_code_id);
CREATE INDEX idx_invite_code_usage_email ON invite_code_usage(email);
```

#### 1.2 Modified Tables

**`invitations` Table Updates**
```sql
-- Add source tracking
ALTER TABLE invitations 
ADD COLUMN source TEXT DEFAULT 'manual' 
  CHECK (source IN ('manual', 'waitlist', 'invite_code', 'referral'));

-- Add waitlist reference
ALTER TABLE invitations
ADD COLUMN waitlist_id UUID REFERENCES waitlist(id);
```

#### 1.3 Database Functions

**Check if email is authorized to signup**
```sql
CREATE OR REPLACE FUNCTION is_email_authorized(p_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_pending_invite BOOLEAN;
  v_has_valid_code BOOLEAN;
BEGIN
  -- Check for pending invitation
  SELECT EXISTS(
    SELECT 1 FROM invitations
    WHERE email = p_email
      AND status = 'pending'
      AND expires_at > NOW()
  ) INTO v_has_pending_invite;
  
  RETURN v_has_pending_invite;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Auto-approve waitlist based on invite code**
```sql
CREATE OR REPLACE FUNCTION process_invite_code(
  p_code TEXT,
  p_email TEXT
) RETURNS JSONB AS $$
DECLARE
  v_code_record RECORD;
  v_result JSONB;
BEGIN
  -- Get invite code details
  SELECT * INTO v_code_record
  FROM invite_codes
  WHERE code = p_code
    AND is_active = true
    AND (valid_until IS NULL OR valid_until > NOW())
    AND (max_uses IS NULL OR current_uses < max_uses);
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired invite code'
    );
  END IF;
  
  -- Check domain restrictions
  IF v_code_record.allowed_domains IS NOT NULL THEN
    IF NOT (SELECT p_email LIKE ANY(v_code_record.allowed_domains)) THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Email domain not allowed for this code'
      );
    END IF;
  END IF;
  
  -- Record usage
  INSERT INTO invite_code_usage (invite_code_id, email)
  VALUES (v_code_record.id, p_email);
  
  -- Update usage count
  UPDATE invite_codes
  SET current_uses = current_uses + 1
  WHERE id = v_code_record.id;
  
  -- If auto-approve, create invitation
  IF v_code_record.auto_approve THEN
    -- Create invitation (implementation depends on your setup)
    RETURN jsonb_build_object(
      'success', true,
      'auto_approved', true
    );
  ELSE
    RETURN jsonb_build_object(
      'success', true,
      'auto_approved', false
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 2. API LAYER

#### 2.1 New API Routes

**`/api/waitlist/submit` (POST)**
- Purpose: Submit waitlist application
- Auth: Public (unauthenticated)
- Input: `{ email, full_name, company?, role?, use_case?, referral_source?, invite_code? }`
- Logic:
  1. Validate email format
  2. Check if email already exists in waitlist or users
  3. If invite_code provided, validate and process
  4. Create waitlist entry
  5. Send confirmation email
- Output: `{ success, message, status }`

**`/api/waitlist/check` (GET)**
- Purpose: Check waitlist status for email
- Auth: Public
- Input: `?email=user@example.com`
- Output: `{ status, position?, estimated_wait? }`

**`/api/admin/waitlist/list` (GET)**
- Purpose: Get waitlist entries (paginated)
- Auth: Admin only (Legend/Phantom roles)
- Input: `?status=pending&page=1&limit=50&sort=priority`
- Output: `{ entries[], total, page, pages }`

**`/api/admin/waitlist/approve` (POST)**
- Purpose: Approve waitlist entry and send invitation
- Auth: Admin only
- Input: `{ waitlist_id, organization_id, workspace_id, role_slug, message? }`
- Logic:
  1. Validate admin permissions
  2. Create invitation
  3. Update waitlist status to 'invited'
  4. Send invitation email
- Output: `{ success, invitation_id }`

**`/api/admin/waitlist/reject` (POST)**
- Purpose: Reject waitlist entry
- Auth: Admin only
- Input: `{ waitlist_id, reason? }`
- Output: `{ success }`

**`/api/admin/invite-codes/create` (POST)**
- Purpose: Create shareable invite code
- Auth: Admin only
- Input: `{ code, max_uses?, valid_until?, allowed_domains?, auto_approve? }`
- Output: `{ success, code_id }`

**`/api/auth/validate-signup` (POST)**
- Purpose: Validate if email can signup
- Auth: Public
- Input: `{ email, invite_code? }`
- Output: `{ authorized, reason?, invitation_token? }`

---

### 3. FRONTEND LAYER

#### 3.1 Modified Pages

**`/signup` Page Updates**
```tsx
// Add validation before signup
const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  
  // 1. Validate email is authorized
  const validation = await fetch('/api/auth/validate-signup', {
    method: 'POST',
    body: JSON.stringify({ email, invite_code: inviteCode })
  }).then(r => r.json())
  
  if (!validation.authorized) {
    // Redirect to waitlist
    router.push(`/waitlist?email=${encodeURIComponent(email)}`)
    return
  }
  
  // 2. Proceed with normal signup
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }
    }
  })
  
  // ... rest of signup logic
}
```

**UI Changes:**
- Add "Invite Code" field (optional)
- Show message: "This platform is currently invite-only"
- Link to waitlist: "Request an invitation"

#### 3.2 New Pages

**`/waitlist` Page**
```tsx
// src/app/[locale]/(auth)/waitlist/page.tsx
export default function WaitlistPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Join the Waitlist</CardTitle>
          <CardDescription>
            ATLVS is currently in private beta. Request an invitation to get early access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WaitlistForm />
        </CardContent>
      </Card>
    </div>
  )
}
```

**Form Fields:**
- Email (required)
- Full Name (required)
- Company (optional)
- Current Role (optional)
- Use Case (textarea, required)
- How did you hear about us? (dropdown)
- Invite Code (optional)

**`/admin/waitlist` Page**
```tsx
// Admin dashboard for managing waitlist
// Features:
// - Table view with filters (status, priority, date)
// - Bulk actions (approve, reject)
// - Individual entry details
// - Send invitation directly
// - Add admin notes
// - Set priority
```

**`/admin/invite-codes` Page**
```tsx
// Manage invite codes
// Features:
// - Create new codes
// - View usage statistics
// - Deactivate codes
// - Set expiration dates
// - Domain restrictions
```

**`/waitlist/status` Page**
```tsx
// Check waitlist status
// Features:
// - Enter email to check status
// - Show position in queue
// - Estimated wait time
// - Referral program info
```

#### 3.3 New Components

**`<WaitlistForm />` Component**
- Form with validation
- Invite code validation
- Success/error states
- Email confirmation message

**`<WaitlistTable />` Component**
- Admin table for waitlist management
- Sortable columns
- Filters
- Bulk actions
- Quick approve/reject

**`<InviteCodeGenerator />` Component**
- Create invite codes
- Set parameters
- Copy to clipboard
- Usage tracking

---

### 4. EMAIL NOTIFICATIONS

#### 4.1 Email Templates

**Waitlist Confirmation**
```
Subject: You're on the ATLVS Waitlist!

Hi [Name],

Thanks for your interest in ATLVS! We've received your request and you're now on our waitlist.

Your position: #[POSITION]
Estimated wait: [ESTIMATE]

We'll notify you as soon as a spot opens up. In the meantime:
- Follow us on [social media]
- Check out our blog
- Refer friends to move up the queue

Thanks for your patience!
The ATLVS Team
```

**Invitation Sent**
```
Subject: Your ATLVS Invitation is Ready!

Hi [Name],

Great news! You've been approved for early access to ATLVS.

[ACCEPT INVITATION BUTTON]

This invitation expires in 7 days.

Welcome aboard!
The ATLVS Team
```

**Waitlist Rejected** (Optional)
```
Subject: Update on Your ATLVS Application

Hi [Name],

Thank you for your interest in ATLVS. Unfortunately, we're unable to offer you access at this time.

[Reason if provided]

You're welcome to reapply in the future.

Best regards,
The ATLVS Team
```

---

### 5. SECURITY & VALIDATION

#### 5.1 RLS Policies

**Waitlist Table**
```sql
-- Public can insert (submit waitlist)
CREATE POLICY "Anyone can submit to waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (true);

-- Users can view their own entry
CREATE POLICY "Users can view their own waitlist entry"
  ON waitlist FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Admins can view all
CREATE POLICY "Admins can view all waitlist entries"
  ON waitlist FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN roles r ON ura.role_id = r.id
      WHERE ura.user_id = auth.uid()
        AND r.level <= 2 -- Legend or Phantom
    )
  );

-- Admins can update
CREATE POLICY "Admins can update waitlist entries"
  ON waitlist FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN roles r ON ura.role_id = r.id
      WHERE ura.user_id = auth.uid()
        AND r.level <= 2
    )
  );
```

**Invite Codes Table**
```sql
-- Admins only
CREATE POLICY "Admins can manage invite codes"
  ON invite_codes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN roles r ON ura.role_id = r.id
      WHERE ura.user_id = auth.uid()
        AND r.level <= 2
    )
  );
```

#### 5.2 Rate Limiting

- Waitlist submissions: 3 per IP per hour
- Status checks: 10 per IP per hour
- Invite code validation: 5 per IP per minute

#### 5.3 Validation Rules

**Email:**
- Valid format
- Not disposable email domain
- Not already in system (users or waitlist)

**Invite Code:**
- Valid format (alphanumeric, 6-20 chars)
- Case-insensitive
- Trim whitespace

---

### 6. ADMIN FEATURES

#### 6.1 Waitlist Management Dashboard

**Features:**
- View all waitlist entries
- Filter by status, date, priority
- Search by email, name, company
- Bulk approve/reject
- Set priority levels
- Add internal notes
- Export to CSV

**Metrics:**
- Total waitlist size
- Pending approvals
- Approval rate
- Average wait time
- Conversion rate (invited → signed up)

#### 6.2 Invite Code Management

**Features:**
- Create codes with custom parameters
- View usage statistics
- Deactivate/reactivate codes
- Set expiration dates
- Domain whitelisting
- Auto-approve toggle

**Analytics:**
- Most used codes
- Conversion by code
- Geographic distribution
- Referral sources

---

### 7. USER EXPERIENCE FLOWS

#### 7.1 New User Tries to Signup (No Invite)

1. User visits `/signup`
2. Enters email and clicks "Create account"
3. System checks: No valid invitation found
4. Redirect to `/waitlist?email=user@example.com`
5. Pre-filled form with email
6. User completes waitlist form
7. Confirmation message + email sent
8. User can check status at `/waitlist/status`

#### 7.2 New User with Invite Code

1. User visits `/signup?code=LAUNCH2025`
2. Invite code auto-filled
3. System validates code
4. If valid: Normal signup proceeds
5. If invalid: Show error, offer waitlist option

#### 7.3 New User with Email Invitation

1. User receives invitation email
2. Clicks invitation link → `/invite/[token]`
3. Reviews invitation details
4. Clicks "Accept & Sign Up"
5. Redirected to `/signup?invite=[token]`
6. Signup form pre-filled with email
7. Complete signup
8. Auto-accepted to organization/workspace

#### 7.4 Admin Approves Waitlist Entry

1. Admin views waitlist dashboard
2. Reviews entry details
3. Clicks "Approve"
4. Selects organization, workspace, role
5. Optionally adds personal message
6. System creates invitation
7. Email sent to user
8. Waitlist status updated to "invited"

---

### 8. MIGRATION STRATEGY

#### 8.1 Existing Users

- No impact - existing users remain active
- Existing invitations continue to work
- No data migration needed

#### 8.2 Deployment Steps

1. **Phase 1: Database** (No downtime)
   - Run migration to create new tables
   - Add RLS policies
   - Deploy database functions

2. **Phase 2: API** (No downtime)
   - Deploy new API routes
   - Keep existing signup working temporarily

3. **Phase 3: Frontend** (Coordinated deployment)
   - Deploy waitlist pages
   - Update signup page with validation
   - Deploy admin dashboard

4. **Phase 4: Activation**
   - Enable invite-only mode via feature flag
   - Monitor for issues
   - Gradual rollout (10% → 50% → 100%)

#### 8.3 Rollback Plan

- Feature flag to disable invite-only mode
- Revert signup page to previous version
- Keep waitlist data for future use

---

### 9. CONFIGURATION & SETTINGS

#### 9.1 Environment Variables

```env
# Waitlist Settings
WAITLIST_ENABLED=true
WAITLIST_AUTO_APPROVE=false
WAITLIST_MAX_DAILY_SUBMISSIONS=1000

# Invite Codes
INVITE_CODE_REQUIRED=false
INVITE_CODE_MIN_LENGTH=6

# Email
WAITLIST_NOTIFICATION_EMAIL=waitlist@atlvs.com
ADMIN_NOTIFICATION_EMAIL=admin@atlvs.com

# Rate Limiting
WAITLIST_RATE_LIMIT_PER_HOUR=3
INVITE_CODE_RATE_LIMIT_PER_MINUTE=5
```

#### 9.2 Feature Flags

```typescript
// src/lib/config/features.ts
export const FEATURES = {
  INVITE_ONLY_MODE: process.env.NEXT_PUBLIC_INVITE_ONLY === 'true',
  WAITLIST_ENABLED: process.env.NEXT_PUBLIC_WAITLIST_ENABLED === 'true',
  INVITE_CODES_ENABLED: process.env.NEXT_PUBLIC_INVITE_CODES === 'true',
  PUBLIC_SIGNUP: process.env.NEXT_PUBLIC_PUBLIC_SIGNUP === 'true',
}
```

---

### 10. ANALYTICS & MONITORING

#### 10.1 Key Metrics

**Waitlist Metrics:**
- Daily submissions
- Approval rate
- Time to approval
- Conversion rate (invited → signup)
- Waitlist growth rate

**Invite Code Metrics:**
- Code usage
- Most effective codes
- Conversion by source
- Geographic distribution

**System Health:**
- Failed validations
- API errors
- Email delivery rate
- Page load times

#### 10.2 Tracking Events

```typescript
// Analytics events to track
{
  'waitlist_submitted': { email, source, has_invite_code },
  'waitlist_approved': { waitlist_id, admin_id, time_to_approval },
  'waitlist_rejected': { waitlist_id, reason },
  'invite_code_used': { code, email, success },
  'signup_blocked': { email, reason },
  'invitation_sent': { email, source },
  'invitation_accepted': { invitation_id, time_to_accept }
}
```

---

### 11. TESTING STRATEGY

#### 11.1 Unit Tests

- Email validation
- Invite code validation
- Database functions
- API route handlers
- Form validation

#### 11.2 Integration Tests

- Waitlist submission flow
- Invitation creation and acceptance
- Invite code processing
- Admin approval workflow
- Email sending

#### 11.3 E2E Tests

- Complete signup journey (blocked)
- Waitlist submission
- Admin approval process
- Invite code signup
- Email invitation acceptance

---

### 12. DOCUMENTATION REQUIREMENTS

#### 12.1 User Documentation

- How to join the waitlist
- How to use invite codes
- What to expect after applying
- FAQ about waitlist process

#### 12.2 Admin Documentation

- How to manage waitlist
- How to create invite codes
- Best practices for approvals
- Bulk operations guide

#### 12.3 Developer Documentation

- API endpoints reference
- Database schema
- Integration guide
- Testing guide

---

### 13. IMPLEMENTATION TIMELINE

#### Phase 1: Database & Core Logic (Week 1)
- [ ] Create migration files
- [ ] Implement database functions
- [ ] Add RLS policies
- [ ] Test database layer

#### Phase 2: API Layer (Week 1-2)
- [ ] Create API routes
- [ ] Implement validation logic
- [ ] Add rate limiting
- [ ] Write API tests

#### Phase 3: Frontend - Waitlist (Week 2)
- [ ] Create waitlist page
- [ ] Build waitlist form component
- [ ] Add status check page
- [ ] Implement client-side validation

#### Phase 4: Frontend - Admin (Week 2-3)
- [ ] Build admin dashboard
- [ ] Create invite code manager
- [ ] Add bulk actions
- [ ] Implement filters and search

#### Phase 5: Signup Integration (Week 3)
- [ ] Update signup page
- [ ] Add validation flow
- [ ] Implement redirects
- [ ] Add invite code field

#### Phase 6: Email & Notifications (Week 3)
- [ ] Create email templates
- [ ] Implement email sending
- [ ] Add notification system
- [ ] Test email delivery

#### Phase 7: Testing & QA (Week 4)
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Security audit

#### Phase 8: Deployment (Week 4)
- [ ] Staging deployment
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Documentation

**Total Estimated Time: 4 weeks (1 developer)**

---

### 14. RISKS & MITIGATION

#### Risk 1: Legitimate Users Blocked
**Mitigation:**
- Clear messaging on signup page
- Easy waitlist process
- Fast approval for valid requests
- Support contact prominently displayed

#### Risk 2: Spam Waitlist Submissions
**Mitigation:**
- Rate limiting
- Email verification
- CAPTCHA on waitlist form
- Admin review process

#### Risk 3: Invite Code Abuse
**Mitigation:**
- Usage limits per code
- Expiration dates
- Domain restrictions
- Monitoring and alerts

#### Risk 4: Poor User Experience
**Mitigation:**
- Clear communication
- Status transparency
- Fast approval process
- Multiple entry methods (invite code, email invite, waitlist)

---

### 15. SUCCESS CRITERIA

✅ **Must Have:**
- Unauthorized users cannot signup
- Waitlist submission works flawlessly
- Admins can approve/reject efficiently
- Email invitations sent automatically
- Invite codes function correctly
- Zero impact on existing users

✅ **Should Have:**
- < 24 hour approval time for valid requests
- 95%+ email delivery rate
- Mobile-friendly waitlist form
- Real-time status updates
- Analytics dashboard

✅ **Nice to Have:**
- Referral program
- Priority queue system
- Automated approval for certain domains
- Waitlist position tracking
- Social proof (X users waiting)

---

### 16. POST-LAUNCH OPTIMIZATION

#### Week 1-2:
- Monitor metrics daily
- Gather user feedback
- Fix critical bugs
- Optimize approval workflow

#### Month 1:
- Analyze conversion rates
- A/B test messaging
- Improve admin tools
- Add requested features

#### Month 2-3:
- Implement referral program
- Add automated approvals
- Optimize email templates
- Scale infrastructure

---

## APPROVAL CHECKLIST

Before proceeding with implementation, confirm:

- [ ] Business requirements understood
- [ ] Technical approach approved
- [ ] Timeline acceptable
- [ ] Resources allocated
- [ ] Security reviewed
- [ ] UX/UI approved
- [ ] Email templates reviewed
- [ ] Analytics requirements clear
- [ ] Support process defined
- [ ] Rollback plan understood

---

## APPENDIX

### A. File Structure

```
supabase/migrations/
  ├── 200_waitlist_system.sql          # Main migration

src/app/[locale]/(auth)/
  ├── waitlist/
  │   ├── page.tsx                      # Waitlist form
  │   └── status/page.tsx               # Check status
  └── signup/page.tsx                   # Updated with validation

src/app/api/
  ├── waitlist/
  │   ├── submit/route.ts
  │   ├── check/route.ts
  │   └── status/route.ts
  ├── admin/
  │   ├── waitlist/
  │   │   ├── list/route.ts
  │   │   ├── approve/route.ts
  │   │   └── reject/route.ts
  │   └── invite-codes/
  │       ├── create/route.ts
  │       ├── list/route.ts
  │       └── deactivate/route.ts
  └── auth/
      └── validate-signup/route.ts

src/components/
  ├── waitlist/
  │   ├── waitlist-form.tsx
  │   ├── waitlist-table.tsx
  │   └── status-checker.tsx
  └── admin/
      ├── invite-code-generator.tsx
      └── waitlist-dashboard.tsx

src/lib/
  ├── email/
  │   └── templates/
  │       ├── waitlist-confirmation.tsx
  │       ├── invitation-sent.tsx
  │       └── waitlist-rejected.tsx
  └── validations/
      └── waitlist.ts
```

### B. Database Schema Diagram

```
┌─────────────────┐
│    waitlist     │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ full_name       │
│ status          │
│ priority        │
│ invitation_id   │──┐
└─────────────────┘  │
                     │
┌─────────────────┐  │
│   invitations   │◄─┘
├─────────────────┤
│ id (PK)         │
│ email           │
│ token (UNIQUE)  │
│ status          │
│ source          │
│ waitlist_id     │
└─────────────────┘

┌─────────────────┐
│  invite_codes   │
├─────────────────┤
│ id (PK)         │
│ code (UNIQUE)   │
│ max_uses        │
│ current_uses    │
│ is_active       │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│ invite_code_    │
│     usage       │
├─────────────────┤
│ id (PK)         │
│ invite_code_id  │
│ email           │
│ used_at         │
└─────────────────┘
```

---

## CONCLUSION

This comprehensive plan provides a complete gated invite and waitlist system that:

1. **Blocks unauthorized signups** while maintaining excellent UX
2. **Provides multiple entry paths** (email invite, invite code, waitlist)
3. **Empowers admins** with efficient management tools
4. **Scales gracefully** with the platform's growth
5. **Maintains security** through RLS and validation
6. **Tracks metrics** for continuous improvement

**Next Steps:**
1. Review and approve this plan
2. Allocate development resources
3. Begin Phase 1 implementation
4. Schedule regular check-ins

**Questions or concerns?** Please provide feedback before implementation begins.

---

**Document Version:** 1.0  
**Last Updated:** January 24, 2025  
**Status:** AWAITING APPROVAL
