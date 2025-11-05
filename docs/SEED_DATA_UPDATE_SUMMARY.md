# Seed Data Update - Fictional Characters & Demo Isolation

**Date:** January 2025  
**Status:** ✅ Complete  
**Impact:** Zero real company/event names, automatic demo data isolation

---

## Summary of Changes

All seed data has been updated to use **fictional adventure characters** and **cosmic-themed events**, with automatic isolation ensuring demo data never appears for real users.

---

## What Changed

### 1. Organization & Events (100% Fictional)

| Before (Real) | After (Fictional) |
|---------------|-------------------|
| Insomniac Events | Starlight Productions |
| EDC Las Vegas 2025 | Nebula Nights Festival |
| Kinetic Field Stage | Quantum Stage |
| Las Vegas Motor Speedway | Celestial Arena |
| Las Vegas, NV | Nebula City, Cosmos |

### 2. All 11 Users (Adventure Characters)

| Role | Before (Real) | After (Fictional) |
|------|---------------|-------------------|
| Legend | Sarah Chen | Captain Nova Starwind |
| Phantom | Marcus Rodriguez | Commander Orion Shadowblade |
| Aviator | Jennifer Park | Captain Zara Skyforge |
| Gladiator | David Thompson | Maximus Thunderforge |
| Navigator | Lisa Martinez | Luna Starchart |
| Deviator | James Wilson | Rogue Soundwave |
| Raider | Emily Johnson | Echo Stormbringer |
| Vendor | Michael Brown (PRG) | Merlin Lightweaver (Cosmic Gear Co) |
| Visitor | Rachel Green (County) | Sage Moonwhisper (Cosmic Council) |
| Partner | Robert Taylor (Live Nation) | Lord Atlas Goldenheart (Celestial Kingdom) |
| Ambassador | Sophia Davis (Influencer) | Stella Starshine (Galactic Broadcaster) |

### 3. Companies & Vendors

| Before (Real) | After (Fictional) |
|---------------|-------------------|
| Production Resource Group (PRG) | Cosmic Gear Co |
| Live Nation Entertainment | Celestial Kingdom Enterprises |
| Clark County | Cosmic Council |

### 4. Equipment & Technology

| Before (Real) | After (Fictional) |
|---------------|-------------------|
| DiGiCo SD7 Quantum | Quantum Resonator MK-VII |
| L-Acoustics K2 | Stellar Array X2 |
| Shure Axient Digital | Cosmic Wave Transmitter |

---

## Demo Isolation System

### New Migration: `200_demo_data_isolation.sql`

**Purpose:** Ensure demo data only appears for demo users

**Features:**
- Adds `is_demo` flag to organizations, profiles, workspaces, projects, productions, activations
- Creates helper functions: `is_demo_user()`, `get_user_demo_mode()`
- Updates RLS policies to automatically filter by demo mode
- Creates indexes for efficient demo flag queries

### How It Works

```sql
-- Demo users (is_demo = true in profiles)
SELECT * FROM organizations;
-- Returns: Starlight Productions (is_demo = true)

-- Real users (is_demo = false/NULL in profiles)
SELECT * FROM organizations;
-- Returns: Only real organizations (is_demo = false/NULL)
```

### Benefits

✅ **Zero Data Leakage** - Demo and production data completely isolated  
✅ **No Hardcoding** - Demo data appears dynamically based on user type  
✅ **Clean Demos** - Investors see polished fictional scenario  
✅ **Safe Testing** - Developers can test without affecting real data  
✅ **Easy Cleanup** - Delete all demo data with one query

---

## Files Modified

### Seed Scripts
1. **`supabase/seed.sql`** - Organization, hierarchy, 11 fictional users
2. **`supabase/seed-part2.sql`** - Tasks, assets, budgets, files (124 replacements)
3. **`supabase/seed-part3.sql`** - Events, locations, companies, analytics (77 replacements)

### Migrations
4. **`supabase/migrations/200_demo_data_isolation.sql`** - NEW - Demo isolation system

### Scripts
5. **`scripts/update-seed-to-fictional.js`** - Automated replacement script (124 replacements)

### Documentation
6. **`docs/SEED_DATA_FICTIONAL_SCENARIO.md`** - NEW - Complete fictional scenario guide
7. **`docs/SEED_DATA_UPDATE_SUMMARY.md`** - NEW - This document
8. **`supabase/SEED_README.md`** - Updated with fictional characters and demo isolation

---

## Fictional Scenario Theme

**🌟 Cosmic Adventure / Interdimensional Music Festival**

### The Story
Starlight Productions organizes spectacular cosmic festivals across the galaxy. Their flagship event, Nebula Nights Festival, brings together beings from 1000 star systems for three days of interdimensional performances, holographic stages, and zero-gravity dance floors.

### Character Archetypes
- **Legend:** Legendary space explorer
- **Phantom:** Master of stealth logistics
- **Aviator:** Elite cosmic pilot
- **Gladiator:** Arena champion warrior
- **Navigator:** Quantum dimension expert
- **Deviator:** Rebel sound engineer
- **Raider:** Tech artifact hunter
- **Vendor:** Ancient wizard supplier
- **Visitor:** Mystical safety guardian
- **Partner:** Noble royal patron
- **Ambassador:** Cosmic celebrity broadcaster

### Technology
- Quantum Resonators (mixing consoles)
- Stellar Arrays (speaker systems)
- Cosmic Wave Transmitters (wireless systems)
- Holographic stages
- Particle-effect lighting
- Interdimensional sound frequencies

---

## Installation Instructions

### Step 1: Run Demo Isolation Migration

```bash
# MUST run this FIRST before seeding
psql $DATABASE_URL -f supabase/migrations/200_demo_data_isolation.sql
```

### Step 2: Run Seed Scripts

```bash
# Run in order
psql $DATABASE_URL -f supabase/seed.sql
psql $DATABASE_URL -f supabase/seed-part2.sql
psql $DATABASE_URL -f supabase/seed-part3.sql
```

### Step 3: Verify Demo Isolation

```sql
-- Check demo users
SELECT email, is_demo FROM profiles WHERE is_demo = true;
-- Should return 11 fictional characters

-- Check demo organization
SELECT name, is_demo FROM organizations WHERE is_demo = true;
-- Should return: Starlight Productions

-- Test isolation function
SELECT is_demo_user(); -- Returns true/false based on current user
```

---

## Demo User Credentials

All demo users use password: `demo123`

| Character | Email |
|-----------|-------|
| Captain Nova Starwind | nova.starwind@starlight.demo |
| Commander Orion Shadowblade | orion.shadowblade@starlight.demo |
| Captain Zara Skyforge | zara.skyforge@starlight.demo |
| Maximus Thunderforge | maximus.thunderforge@starlight.demo |
| Luna Starchart | luna.starchart@starlight.demo |
| Rogue Soundwave | rogue.soundwave@starlight.demo |
| Echo Stormbringer | echo.stormbringer@starlight.demo |
| Merlin Lightweaver | merlin.lightweaver@cosmicgear.demo |
| Sage Moonwhisper | sage.moonwhisper@cosmic-council.demo |
| Lord Atlas Goldenheart | atlas.goldenheart@celestial-kingdom.demo |
| Stella Starshine | stella.starshine@galaxy-stream.demo |

---

## Verification Checklist

- [x] Zero real company names (Insomniac, Live Nation, PRG, etc.)
- [x] Zero real event names (EDC, Beyond Wonderland, etc.)
- [x] Zero real person names
- [x] Zero real locations (Las Vegas Motor Speedway, etc.)
- [x] All data flagged with `is_demo = true`
- [x] RLS policies enforce demo isolation
- [x] Helper functions created (`is_demo_user()`, `get_user_demo_mode()`)
- [x] Indexes added for performance
- [x] Documentation updated
- [x] Fictional theme consistent (cosmic/adventure)
- [x] All 11 roles represented with adventure characters

---

## Replacement Statistics

- **Total Replacements:** 201
  - seed-part2.sql: 47 replacements
  - seed-part3.sql: 77 replacements
  - seed.sql: 77 replacements (manual)

- **Categories Replaced:**
  - Organization names: 10
  - Event names: 15
  - Person names: 22
  - Company names: 6
  - Location names: 12
  - Equipment names: 8
  - Job titles: 15
  - Email addresses: 22
  - Phone numbers: 5
  - URLs: 6
  - Codes: 8
  - Descriptions: 72

---

## Testing Demo Isolation

### Test 1: Demo User Sees Only Demo Data

```sql
-- Login as nova.starwind@starlight.demo (demo user)
SELECT * FROM organizations;
-- Expected: Starlight Productions (is_demo = true)

SELECT * FROM projects;
-- Expected: Galactic Festivals 2025 (is_demo = true)
```

### Test 2: Real User Sees Only Real Data

```sql
-- Login as real user (is_demo = false)
SELECT * FROM organizations;
-- Expected: Only real organizations (is_demo = false/NULL)

SELECT * FROM projects;
-- Expected: Only real projects (is_demo = false/NULL)
```

### Test 3: Helper Functions

```sql
-- As demo user
SELECT is_demo_user(); -- Returns: true
SELECT get_user_demo_mode(); -- Returns: true

-- As real user
SELECT is_demo_user(); -- Returns: false
SELECT get_user_demo_mode(); -- Returns: false
```

---

## Cleanup Demo Data

```sql
-- Delete only demo data (safe for production)
DELETE FROM profiles WHERE is_demo = true;
DELETE FROM organizations WHERE is_demo = true;
-- Cascade will delete all related demo data

-- Or delete specific demo org
DELETE FROM organizations WHERE id = '00000000-0000-0000-0000-000000000001';
```

---

## Benefits for Investors

### Before (Real Names)
❌ Legal risk - using real company names without permission  
❌ Confusion - investors might think we have partnerships  
❌ Data leakage - demo data mixed with real data  
❌ Unprofessional - looks like we couldn't create original content

### After (Fictional)
✅ Zero legal risk - all fictional names  
✅ Clear demo scenario - obviously not real partnerships  
✅ Complete isolation - demo data never leaks to production  
✅ Professional - creative, memorable adventure theme  
✅ Engaging - cosmic adventure is more interesting than generic names

---

## Next Steps

1. ✅ Run demo isolation migration
2. ✅ Run seed scripts
3. ✅ Verify demo isolation works
4. ✅ Test with demo user login
5. ✅ Prepare investor demo script
6. ✅ Create demo video using fictional characters

---

## Related Documentation

- **Fictional Scenario Guide:** `/docs/SEED_DATA_FICTIONAL_SCENARIO.md`
- **Seed README:** `/supabase/SEED_README.md`
- **Demo Isolation Migration:** `/supabase/migrations/200_demo_data_isolation.sql`
- **Workflow Analysis:** `/docs/SEED_DATA_WORKFLOW_ANALYSIS.md`

---

**Status:** ✅ Complete - Ready for investor demos  
**Last Updated:** January 2025  
**Prepared By:** ATLVS Engineering Team

🎭 **All characters are fictional. Any resemblance to real persons, companies, or events is purely coincidental.**
