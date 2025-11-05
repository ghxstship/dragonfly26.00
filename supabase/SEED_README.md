# Database Seed Scripts - README

## Overview

Comprehensive demo seed data showcasing the complete ATLVS platform capabilities for investor demonstrations and development testing using **fictional adventure characters and events**.

**Scenario:** Nebula Nights Festival - Quantum Stage Production  
**Organization:** Starlight Productions (fictional)  
**Budget:** $2.5M (Audio) / $25M (Total Production)  
**Scale:** 150,000 attendee capacity, 11 role types, 70+ interconnected records  
**Theme:** Cosmic adventure with interdimensional music festival

⚠️ **IMPORTANT:** All data is flagged as demo (`is_demo = true`) and only visible to demo users. Zero real company/event names used.

---

## What's Included

### Organizational Hierarchy
- **1 Organization** - Starlight Productions (Enterprise tier, fictional)
- **1 Project** - Galactic Festivals 2025 ($50M budget)
- **1 Production** - Nebula Nights Festival ($25M budget)
- **1 Activation** - Quantum Stage (150K capacity)
- **1 Workspace** - Nebula Nights - Quantum Operations

### Users & Roles (All 11 Fictional Adventure Characters)
1. **Captain Nova Starwind** - Legend (Supreme Commander)
2. **Commander Orion Shadowblade** - Phantom (Operations Phantom)
3. **Captain Zara Skyforge** - Aviator (Strategic Aviator)
4. **Maximus Thunderforge** - Gladiator (Arena Gladiator)
5. **Luna Starchart** - Navigator (Quantum Navigator)
6. **Rogue Soundwave** - Deviator (Sonic Deviator)
7. **Echo Stormbringer** - Raider (Tech Raider)
8. **Merlin Lightweaver** - Vendor (Arcane Vendor - Cosmic Gear Co)
9. **Sage Moonwhisper** - Visitor (Cosmic Safety Inspector)
10. **Lord Atlas Goldenheart** - Partner (Royal Partner - Celestial Kingdom)
11. **Stella Starshine** - Ambassador (Galactic Ambassador)

### Production Data
- **5 Tasks** - Demonstrating hierarchical delegation workflow
- **5 Comments** - Cross-role collaboration examples
- **2 Assets** - Quantum audio equipment with maintenance records
- **1 Budget** - $2.5M with 70% utilization
- **2 Expenses** - Cosmic Gear Co rental ($1.5M) + Labor ($250K)
- **1 Invoice** - Cosmic Gear Co final payment (paid)
- **1 Purchase Order** - 3 line items totaling $1.5M
- **3 Events** - Load-in, sound check, festival
- **3 Locations** - Celestial Arena, Quantum Stage, production office
- **2 Companies** - Cosmic Gear Co (vendor), Celestial Kingdom (partner)
- **3 Files** - Holographic stage design, equipment manifest, safety checklist
- **1 Job Posting** - Sonic engineer (filled)
- **1 Marketplace Listing** - Used ethereal transmission system
- **3 Notifications** - Task assignments, budget alerts, mentions
- **2 Analytics Events** - Budget threshold, task completion
- **1 Report** - Weekly production status
- **1 Insight** - 15% cost optimization opportunity
- **1 Metric** - 92.5% task completion rate
- **3 Tags** - critical-path, vendor-coordination, safety-required

**Total:** 70+ interconnected records demonstrating full platform capabilities

⚠️ **All data uses fictional names** - No real companies, events, or people

---

## Installation

### Prerequisites
- Supabase project with all migrations applied
- PostgreSQL 14+ with required extensions
- Admin database access

### Execution

```bash
# Navigate to supabase directory
cd supabase

# STEP 1: Run demo isolation migration FIRST
psql $DATABASE_URL -f migrations/200_demo_data_isolation.sql

# STEP 2: Run seed scripts in order
psql $DATABASE_URL -f seed.sql
psql $DATABASE_URL -f seed-part2.sql
psql $DATABASE_URL -f seed-part3.sql
```

**Important:** The demo isolation migration (step 1) MUST be run before seeding to ensure proper data filtering.

### Alternative: Supabase CLI

```bash
# If using Supabase CLI
supabase db reset --db-url $DATABASE_URL
cat seed.sql seed-part2.sql seed-part3.sql | supabase db execute
```

---

## Verification

### Quick Check

```sql
-- Count records by table
SELECT 
    'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'comments', COUNT(*) FROM comments
UNION ALL
SELECT 'assets', COUNT(*) FROM assets
UNION ALL
SELECT 'budgets', COUNT(*) FROM budgets
UNION ALL
SELECT 'expenses', COUNT(*) FROM expenses;
```

**Expected Results:**
- profiles: 11
- tasks: 5
- comments: 5
- assets: 2
- budgets: 1
- expenses: 2

### Detailed Verification

```sql
-- Verify role hierarchy
SELECT 
    p.first_name || ' ' || p.last_name as user_name,
    r.name as role,
    r.level,
    r.scope
FROM user_roles ur
JOIN profiles p ON ur.user_id = p.id
JOIN roles r ON ur.role_id = r.id
ORDER BY r.level;
```

**Expected:** 11 users with roles from Legend (level 1) to Ambassador (level 11)

```sql
-- Verify task delegation chain
SELECT 
    t.title,
    creator.first_name || ' ' || creator.last_name as created_by,
    assignee.first_name || ' ' || assignee.last_name as assigned_to,
    t.status,
    t.priority
FROM tasks t
JOIN profiles creator ON t.created_by = creator.id
JOIN profiles assignee ON t.assigned_to = assignee.id
ORDER BY t.created_at;
```

**Expected:** 5 tasks showing Gladiator → Navigator → Deviator → Raider delegation

```sql
-- Verify budget tracking
SELECT 
    b.name,
    b.total_amount,
    b.spent_amount,
    ROUND((b.spent_amount / b.total_amount * 100)::numeric, 1) as percent_spent,
    COUNT(e.id) as expense_count
FROM budgets b
LEFT JOIN expenses e ON e.budget_id = b.id
GROUP BY b.id, b.name, b.total_amount, b.spent_amount;
```

**Expected:** 1 budget at 70% utilization with 2 expenses

---

## Demo Scenarios

### Scenario 1: Hierarchical Task Management

**Login as:** David Thompson (Gladiator)

**Actions:**
1. View "Finalize Kinetic Field Stage Design" task
2. See it's assigned to Lisa Martinez (Navigator)
3. Check comments showing cross-role collaboration
4. View task history and audit trail

**Demonstrates:** Clear accountability, delegation workflow, communication

---

### Scenario 2: Budget Oversight

**Login as:** David Thompson (Gladiator)

**Actions:**
1. Navigate to Budgets
2. View "Kinetic Field - Audio Production" budget
3. See 70% utilization ($1.75M of $2.5M)
4. Drill into expenses (PRG rental, labor)
5. Check notifications for budget alert

**Demonstrates:** Real-time budget tracking, automatic alerts, expense approval

---

### Scenario 3: Vendor Collaboration

**Login as:** Michael Brown (Vendor)

**Actions:**
1. See limited access to only relevant project areas
2. View assigned task "Coordinate Audio Equipment Rental"
3. Check uploaded equipment manifest file
4. Review purchase order and invoice status

**Demonstrates:** Controlled vendor access, procurement workflow, file sharing

---

### Scenario 4: Cross-Role Communication

**Login as:** James Wilson (Deviator)

**Actions:**
1. View task assigned by Lisa (Navigator)
2. Read comment mentioning him (@James Wilson)
3. See his response coordinating with vendor
4. Check notification for the mention

**Demonstrates:** @mentions, real-time notifications, threaded discussions

---

### Scenario 5: Compliance & Temporary Access

**Login as:** Rachel Green (Visitor)

**Actions:**
1. See limited 30-day temporary access
2. View assigned safety inspection task
3. Check uploaded compliance checklist
4. Note access expiration date

**Demonstrates:** Temporary access control, compliance tracking, auto-expiration

---

## User Credentials

**Note:** In production, users authenticate via Supabase Auth. For demo purposes, these are the profile records that would link to auth.users.

| Character Name | Email | Role | Level | Password (Demo) |
|----------------|-------|------|-------|-----------------|
| Captain Nova Starwind | nova.starwind@starlight.demo | Legend | 1 | demo123 |
| Commander Orion Shadowblade | orion.shadowblade@starlight.demo | Phantom | 2 | demo123 |
| Captain Zara Skyforge | zara.skyforge@starlight.demo | Aviator | 3 | demo123 |
| Maximus Thunderforge | maximus.thunderforge@starlight.demo | Gladiator | 4 | demo123 |
| Luna Starchart | luna.starchart@starlight.demo | Navigator | 5 | demo123 |
| Rogue Soundwave | rogue.soundwave@starlight.demo | Deviator | 6 | demo123 |
| Echo Stormbringer | echo.stormbringer@starlight.demo | Raider | 7 | demo123 |
| Merlin Lightweaver | merlin.lightweaver@cosmicgear.demo | Vendor | 8 | demo123 |
| Sage Moonwhisper | sage.moonwhisper@cosmic-council.demo | Visitor | 9 | demo123 |
| Lord Atlas Goldenheart | atlas.goldenheart@celestial-kingdom.demo | Partner | 10 | demo123 |
| Stella Starshine | stella.starshine@galaxy-stream.demo | Ambassador | 11 | demo123 |

🎭 **All characters are fictional** - Created for adventure-themed demo scenario

---

## Data Relationships

### Task Delegation Flow
```
Task: "Finalize Quantum Stage Design"
  Created by: Maximus Thunderforge (Gladiator)
  Assigned to: Luna Starchart (Navigator)
    ↓
Task: "Coordinate Quantum Audio Equipment"
  Created by: Luna Starchart (Navigator)
  Assigned to: Rogue Soundwave (Deviator)
    ↓
Task: "Install Sonic Projection System"
  Created by: Rogue Soundwave (Deviator)
  Assigned to: Echo Stormbringer (Raider)
```

### Budget Flow
```
Budget: "Quantum Stage - Audio Production" ($2.5M)
  ↓
Expense: "Cosmic Gear Co Equipment" ($1.5M)
  Submitted by: Rogue Soundwave (Deviator)
  Approved by: Luna Starchart (Navigator)
  ↓
Expense: "Sonic Crew Labor" ($250K)
  Submitted by: Rogue Soundwave (Deviator)
  Approved by: Maximus Thunderforge (Gladiator)
  ↓
Invoice: "Cosmic Gear Co Final Payment" ($1.5M)
  Created by: Luna Starchart (Navigator)
  Status: Paid
```

### Vendor Workflow
```
Company: Cosmic Gear Co (Vendor)
  ↓
Contact: Merlin Lightweaver (Vendor role)
  ↓
Purchase Order: PO-2025-NEB-001 ($1.5M)
  Created by: Rogue Soundwave (Deviator)
  Approved by: Maximus Thunderforge (Gladiator)
  ↓
File: "Cosmic_Gear_Equipment_Manifest.xlsx"
  Uploaded by: Merlin Lightweaver (Vendor)
  ↓
Invoice: CGC-2025-NEB-001 ($1.5M)
  Status: Paid
```

---

## Demo Data Isolation System

### How It Works

All demo data is **automatically isolated** from production data using the `is_demo` flag:

```sql
-- Demo users (is_demo = true) see ONLY demo data
-- Real users (is_demo = false/NULL) see ONLY real data
```

### RLS Policy Enforcement

The system uses Row Level Security (RLS) policies to automatically filter data:

1. **Demo Users** - See only organizations, projects, tasks, etc. where `is_demo = true`
2. **Real Users** - See only data where `is_demo = false` or `is_demo IS NULL`

### Benefits

✅ **Zero Data Leakage** - Demo and production data never mix  
✅ **Clean Investor Demos** - Show polished fictional scenario  
✅ **Safe Development** - Test without affecting real data  
✅ **Easy Cleanup** - Delete all demo data with one query  
✅ **No Hardcoding** - Demo data appears dynamically based on user type

### Example Queries

```sql
-- Check if current user is demo user
SELECT is_demo_user(); -- Returns true/false

-- Get user's demo mode
SELECT get_user_demo_mode(); -- Returns true/false

-- Demo users automatically see only demo orgs
SELECT * FROM organizations; -- Filtered by RLS

-- Real users automatically see only real orgs
SELECT * FROM organizations; -- Filtered by RLS
```

---

## Cleanup

To remove all demo data and start fresh:

```sql
-- WARNING: This deletes ALL DEMO data

-- Option 1: Delete only demo data (recommended)
DELETE FROM activity_logs WHERE workspace_id IN (SELECT id FROM workspaces WHERE is_demo = true);
DELETE FROM notifications WHERE workspace_id IN (SELECT id FROM workspaces WHERE is_demo = true);
DELETE FROM insights;
DELETE FROM metrics;
DELETE FROM analytics_events;
DELETE FROM reports;
DELETE FROM resources;
DELETE FROM marketplace_listings;
DELETE FROM job_applications;
DELETE FROM jobs;
DELETE FROM tags;
DELETE FROM schedules;
DELETE FROM people;
DELETE FROM files;
DELETE FROM comments;
DELETE FROM po_line_items;
DELETE FROM purchase_orders;
DELETE FROM invoices;
DELETE FROM expenses;
DELETE FROM budgets;
DELETE FROM asset_maintenance;
DELETE FROM assets;
DELETE FROM asset_categories;
DELETE FROM events;
DELETE FROM company_contacts;
DELETE FROM companies;
DELETE FROM locations;
DELETE FROM tasks;
DELETE FROM user_roles;
DELETE FROM organization_members;
DELETE FROM workspaces;
DELETE FROM activations;
DELETE FROM productions;
DELETE FROM projects;
DELETE FROM profiles WHERE id LIKE '00000000-0000-0000-0000-%';
DELETE FROM organizations WHERE id = '00000000-0000-0000-0000-000000000001';
```

---

## Troubleshooting

### Issue: Foreign Key Violations

**Cause:** Migrations not applied or tables missing  
**Solution:** Run all migrations before seeding

```bash
supabase db push
```

### Issue: Duplicate Key Errors

**Cause:** Seed data already exists  
**Solution:** Run cleanup script first

### Issue: Permission Denied

**Cause:** RLS policies blocking inserts  
**Solution:** Temporarily disable RLS or use service role

```sql
-- Disable RLS temporarily (development only!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- ... run seeds ...
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Issue: Invalid UUIDs

**Cause:** UUID format incorrect  
**Solution:** All seed UUIDs use format `00000000-0000-0000-0000-0000000001XX`

---

## Best Practices

### Development
- Run seeds on local/staging environments only
- Never run on production
- Use consistent UUID prefixes for easy identification
- Include comments explaining relationships

### Testing
- Verify all relationships after seeding
- Test RLS policies with different user roles
- Check that realtime subscriptions work
- Validate all workflows end-to-end

### Demos
- Reset database before each demo
- Use consistent login credentials
- Prepare talking points for each scenario
- Have backup plan if database is unavailable

---

## Related Documentation

- **Fictional Scenario Details:** `/docs/SEED_DATA_FICTIONAL_SCENARIO.md` ⭐ NEW
- **Workflow Analysis:** `/docs/SEED_DATA_WORKFLOW_ANALYSIS.md`
- **Demo Isolation Migration:** `/supabase/migrations/200_demo_data_isolation.sql`
- **Database Schema:** `/supabase/migrations/`
- **RBAC System:** `/docs/RBAC_RLS_SYSTEM_COMPLETE_2025_01_20.md`
- **Organizational Hierarchy:** `/docs/DATABASE_OPTIMIZATION_COMPLETE_2025_01_20.md`

---

## Fictional Scenario Summary

**🌟 Starlight Productions** organizes cosmic festivals across the galaxy. Their flagship event, **Nebula Nights Festival**, features:

- **Quantum Stage** - Holographic platform with interdimensional sound
- **Celestial Arena** - 150,000 capacity venue in Nebula City
- **11 Adventure Characters** - From Captain Nova Starwind to Stella Starshine
- **Cosmic Technology** - Quantum Resonators, Stellar Arrays, Ethereal Transmitters
- **Mystical Vendors** - Merlin Lightweaver supplies enchanted equipment
- **Royal Patrons** - Lord Atlas Goldenheart from Celestial Kingdom

See `/docs/SEED_DATA_FICTIONAL_SCENARIO.md` for complete character bios, equipment specs, and storyline.

---

## Support

For questions or issues with seed data:
1. Check verification queries above
2. Review related documentation
3. Contact development team

**Last Updated:** January 2025  
**Maintained By:** ATLVS Engineering Team
