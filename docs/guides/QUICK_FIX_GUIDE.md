# 🔧 Quick Fix: PostgREST Relationship Errors

## 🚨 Problem
Multiple views showing: `Could not find a relationship between [table] and 'profiles'`

## ✅ Solution Ready
A comprehensive SQL script has been created to fix all relationship errors.

## 📋 What to Do

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy & Run the Fix
1. Open the file: **`APPLY_PROFILE_FK_FIX.sql`**
2. Copy all contents (Cmd+A, Cmd+C)
3. Paste into SQL Editor (Cmd+V)
4. Click **Run** (or press Cmd+Enter)

### Step 3: Wait for Completion
- You'll see green "NOTICE" messages as each fix is applied
- Final message shows total foreign keys configured
- Takes ~5-10 seconds to complete

### Step 4: Verify
1. Refresh your application (Cmd+Shift+R)
2. Check these views:
   - Companies → Work Orders
   - Companies → Reviews
   - Jobs → Work Orders
   - Jobs → Estimates
3. All should now load data correctly ✅

## 📊 What Gets Fixed

- ✅ Work Orders & Subcontractor Management
- ✅ Estimates & Invoices
- ✅ Reviews & Compliance
- ✅ Communication Threads
- ✅ Analytics & Reports
- ✅ Events & Logistics
- ✅ Files & Documents
- ✅ Tours & Settlements
- ✅ Procurement & Policies
- ✅ **40+ relationships across all modules**

## ⏱️ Time Required
**2-3 minutes total**

## 🛡️ Safety
- ✅ Non-destructive (no data changes)
- ✅ Idempotent (safe to run multiple times)
- ✅ Transaction-wrapped (atomic operation)
- ✅ Auto-checks for existing constraints

## 📚 More Information
- **Detailed steps:** See `FIX_INSTRUCTIONS.md`
- **Technical details:** See `PROFILE_FK_REMEDIATION.md`
- **SQL script:** `APPLY_PROFILE_FK_FIX.sql`

---

**Ready?** Open Supabase → SQL Editor → Copy `APPLY_PROFILE_FK_FIX.sql` → Run → Done! 🎉
