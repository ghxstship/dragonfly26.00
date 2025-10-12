# Database Migration Instructions

## 🎯 Quick Start - Run These in Supabase SQL Editor

### Step 1: Run Foundation Migration
1. Go to: https://supabase.com/dashboard/project/nhceygmzwmhuyqsjxquk/sql/new
2. Open file: `/supabase/migrations/000_foundation.sql`
3. Copy entire contents
4. Paste into SQL Editor
5. Click **RUN**

### Step 2: Run Projects Module
1. Open file: `/supabase/migrations/001_projects_module.sql`
2. Copy entire contents
3. Paste into SQL Editor
4. Click **RUN**

---

## ✅ What You Get

### Migration 000: Foundation (Complete!)
**Tables Created:**
- ✅ `organizations` - Top-level multitenant isolation
- ✅ `workspaces` - Project grouping within orgs
- ✅ `roles` - 11 hierarchical system roles (Legend → Ambassador)
- ✅ `permissions` - Granular permission definitions
- ✅ `role_permissions` - Role-permission matrix
- ✅ `user_roles` - User role assignments with scope & expiration
- ✅ `organization_members` - Legacy simplified access
- ✅ `custom_fields` - Extensible field system
- ✅ `module_configs` - Per-module configuration
- ✅ `views` - Saved view configurations (18 types)
- ✅ `templates` - Reusable templates
- ✅ `activities` - Audit log / activity feed
- ✅ `comments` - Universal commenting system
- ✅ `user_presence` - Realtime presence tracking
- ✅ `notifications` - User notifications

**11 System Roles Created:**
1. **Legend** - Platform super admin
2. **Phantom** - Organization super admin
3. **Aviator** - Strategic leader (multi-project)
4. **Gladiator** - Project manager
5. **Navigator** - Department/area manager
6. **Deviator** - Team lead
7. **Raider** - Team member
8. **Merchant** - External contractor
9. **Visitor** - Temporary custom access
10. **Passenger** - Read-only stakeholder
11. **Ambassador** - Marketing affiliate

**Features Included:**
- ✅ Full-text search enabled
- ✅ Auto-update triggers
- ✅ Performance indexes
- ✅ RLS policies
- ✅ Realtime enabled
- ✅ Encryption support

### Migration 001: Projects Module
**Tables Created:**
- ✅ `productions` - Main projects/productions table
- ✅ `project_tasks` - Tasks with dependencies & assignments
- ✅ `project_milestones` - Key deadlines
- ✅ `project_compliance` - Licenses, permits, insurance
- ✅ `project_safety` - Risk assessments, incident reports

**Features:**
- ✅ Full-text search on projects & tasks
- ✅ Multi-assignee support
- ✅ Task dependencies
- ✅ Budget tracking
- ✅ Health indicators
- ✅ Progress tracking
- ✅ Foreign key to user_roles for project-level permissions

---

## 🚀 Next Steps

After running both migrations:

### 1. Verify Tables
Check that all tables were created:
- Go to Table Editor in Supabase
- You should see ~19 tables

### 2. Test Role System
```sql
-- View all roles
SELECT * FROM roles ORDER BY level;

-- Should return 11 roles from Legend to Ambassador
```

### 3. Create Test Data (Optional)
```sql
-- Create test organization
INSERT INTO organizations (name, slug) 
VALUES ('Test Productions', 'test-productions');

-- Create test workspace
INSERT INTO workspaces (organization_id, name) 
VALUES (
    (SELECT id FROM organizations WHERE slug = 'test-productions'),
    'Main Workspace'
);
```

---

## 📋 Remaining Modules to Build

After Projects, we'll create migrations for:
- 002: Events Module (performances, rehearsals, bookings)
- 003: People Module (personnel, teams, time tracking)
- 004: Assets Module (equipment, inventory, maintenance)
- 005: Locations Module (venues, facilities, site maps)
- 006: Files Module (documents, contracts, media)
- 007: Companies Module (vendors, clients, contracts)
- 008: Finance Module (budgets, invoices, transactions)
- 009: Procurement Module (POs, agreements, approvals)
- 010: Community Module (posts, discussions, connections)
- 011: Marketplace Module (products, orders, reviews)
- 012: Jobs Module (contracts, RFPs, offers)
- 013: Reports Module (analytics, dashboards, KPIs)
- 014: Resources Module (learning, courses, grants)

---

## 🔍 Troubleshooting

### If Migration Fails

**Error: "relation already exists"**
- Table already exists, either:
  - Skip that CREATE TABLE statement, or
  - Drop the table first: `DROP TABLE table_name CASCADE;`

**Error: "function does not exist"**
- Previous migration didn't run
- Make sure 000_foundation.sql ran first

**Error: "permission denied"**
- Check you're logged into correct Supabase project
- Verify you have database admin access

### Check Migration Status
```sql
-- See all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Count tables
SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';
```

---

## 💡 Tips

- **Run migrations in order** (000, 001, 002, etc.)
- **Check for errors** after each migration
- **Backup before changes** (Supabase auto-backups daily on Pro plan)
- **Test queries** after migration to verify data access

---

**Ready to proceed?** Run migrations 000 and 001 in the SQL Editor, then let me know when complete and I'll create the next module!
