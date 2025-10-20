# Quick Deployment Guide - Database Performance Optimization
**⏱️ Total Time: 5-10 minutes**

---

## 🚀 One-Command Deployment

```bash
./scripts/apply-performance-migrations.sh
```

That's it! The script handles everything automatically.

---

## 📋 What It Does

1. ✅ Verifies Supabase is running
2. ✅ Creates automatic backup
3. ✅ Analyzes current indexes
4. ✅ Adds 200+ foreign key indexes
5. ✅ Updates database statistics
6. ⚠️  Prompts for unused index cleanup (optional)
7. ✅ Generates verification reports

---

## ⚡ Manual Deployment (If Needed)

```bash
# 1. Backup (30 seconds)
supabase db dump -f backups/backup_$(date +%Y%m%d).sql

# 2. Apply migrations (2-3 minutes)
supabase db push

# 3. Verify (30 seconds)
supabase db execute -f scripts/verify-database-indexes.sql
```

---

## 🎯 Expected Results

### Before
- 200+ unindexed foreign keys ❌
- Slow JOIN queries (50-1000ms) 🐌
- 80+ unused indexes 📦

### After  
- 0 unindexed foreign keys ✅
- Fast JOIN queries (5-200ms) ⚡
- Optimized index usage 🚀

---

## 📊 Quick Verification

```bash
# Check for unindexed foreign keys (should be 0)
supabase db execute -f scripts/verify-database-indexes.sql | head -20

# Monitor query performance
# Check Supabase Dashboard > Performance > Slow Queries
```

---

## ⚠️ If Something Goes Wrong

```bash
# Restore backup
supabase db restore backups/backup_YYYYMMDD.sql
```

---

## 📞 Need Help?

1. **Check logs:** `supabase/logs/`
2. **Review docs:** `docs/DATABASE_PERFORMANCE_OPTIMIZATION_2025_10_19.md`
3. **Full summary:** `PERFORMANCE_REMEDIATION_SUMMARY.md`

---

## ✅ Success Checklist

- [ ] Backup created
- [ ] Migrations applied
- [ ] No errors in logs
- [ ] Verification shows 0 unindexed FKs
- [ ] Query performance improved

---

**Ready to deploy? Run:**
```bash
./scripts/apply-performance-migrations.sh
```
