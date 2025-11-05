# 🚀 Migration Deployment Guide

## Current Status

- **Local Codebase:** ✅ 100% Complete
- **Remote Database:** ⚠️ 70% Complete (37 pending migrations)
- **Project Reference:** `nhceygmzwmhuyqsjxquk`

## Quick Deploy (Recommended)

Apply all 37 pending migrations using the automated script:

```bash
./scripts/apply-pending-migrations.sh
```

This script will:
1. ✅ Auto-detect your project reference
2. ✅ Link to your Supabase project (if needed)
3. ✅ Show pending migrations
4. ✅ Confirm before applying
5. ✅ Push all migrations
6. ✅ Verify database state

## Manual Deploy (Step-by-Step)

### Step 1: Link to Your Project

```bash
npx supabase link --project-ref nhceygmzwmhuyqsjxquk
```

If you need to authenticate first:

```bash
npx supabase login
```

### Step 2: Check Pending Migrations

```bash
node scripts/check-remote-migrations.js
```

This will show you:
- Total migrations: 122
- Applied: 85
- Pending: 37
- Critical table migrations status

### Step 3: Push Migrations

```bash
npx supabase db push
```

This applies all pending migrations in the correct order.

### Step 4: Verify

```bash
npx supabase db diff
```

Should show no differences if all migrations applied successfully.

## Pending Migrations (37 Total)

### Critical Workflow Infrastructure (Priority 1)

1. `102_branded_rbac_rls_system.sql` - **CRITICAL** - Updated RBAC/RLS system
2. `100_organizational_hierarchy.sql` - Organization hierarchy tables
3. `101_database_normalization.sql` - Database optimization
4. `20251020124531_create_missing_tables.sql` - **296KB** - Missing workflow tables
5. `20251104214000_workflow_remediation_tables.sql` - **NEW** - Workflow remediation tables

### Performance & Security (Priority 2)

6. `103_performance_optimization_indexes.sql`
7. `104_fix_performance_warnings.sql`
8. `105_fix_all_warnings.sql`
9. `110_resolve_database_linter_issues.sql`
10. `113_fix_people_project_tables_rls.sql`
11. `114_drop_duplicate_policies.sql`
12. `115_fix_final_12_warnings.sql`
13. `116_add_foreign_key_indexes.sql`
14. `117_fix_security_warnings.sql`
15. `118_fix_function_search_path.sql`
16. `119_fix_materialized_view_security.sql`
17. `120_fix_permissions_rls_performance.sql`
18. `121_add_remaining_foreign_key_indexes.sql`
19. `122_drop_unused_indexes.sql`
20. `123_fix_hierarchy_rollup_permissions.sql`
21. `124_resolve_remaining_linter_issues.sql`
22. `125_resolve_all_remaining_linter_issues.sql`
23. `126_resolve_audit_foreign_keys.sql`
24. `127_restore_workspace_indexes.sql`

### Additional Features (Priority 3)

25. `094_opportunities_module.sql` - Opportunities module
26. `128_typography_settings.sql` - Typography settings
27. `201_demo_data_isolation_simple.sql` - Demo data isolation
28. `20251023000000_background_jobs_pg_cron.sql` - Background jobs
29. `20251023000001_remove_duplicate_location_access_index.sql` - Index cleanup
30. `20251025_add_billing_cycle_to_subscriptions.sql` - Billing cycle
31. `20251103183000_field_comments.sql` - Field documentation
32. `20251103183100_presence_system.sql` - Real-time presence
33. `20251103183200_public_dashboard_sharing.sql` - Dashboard sharing
34. `20251103183300_rollup_fields.sql` - Rollup fields
35. `20251103183400_sso_saml.sql` - SSO/SAML authentication
36. `20251103183500_version_history.sql` - Version history
37. `20251104183600_gated_invite_waitlist_system.sql` - Waitlist system

## Alternative: Manual Application via Dashboard

If you prefer to apply migrations manually:

1. Go to: https://supabase.com/dashboard/project/nhceygmzwmhuyqsjxquk/editor
2. Open SQL Editor
3. Copy/paste each migration file content in order
4. Execute each migration
5. Verify no errors

⚠️ **WARNING:** This is time-consuming and error-prone. Use the CLI method instead.

## Troubleshooting

### Error: "supabase: command not found"

The script uses `npx` which doesn't require global installation. If you still see this error:

```bash
npm install -g supabase
```

### Error: "Authentication required"

```bash
npx supabase login
```

Then follow the browser authentication flow.

### Error: "Migration already applied"

This is normal if some migrations were previously applied. The CLI will skip them automatically.

### Error: "Conflicting migration"

1. Check the error message for the specific migration
2. Review the migration file for conflicts
3. Apply manually via Dashboard if needed
4. Contact support if issue persists

## Post-Deployment Verification

After applying migrations, verify everything works:

### 1. Run Workflow Audit

```bash
node scripts/comprehensive-workflow-audit.js
```

Should show:
- ✅ Explicit Workflows: 100% (19/19)
- ✅ Lifecycle Completeness: 100%
- ✅ Critical Path: OPERATIONAL

### 2. Run Deep Analysis

```bash
node scripts/deep-workflow-analysis.js
```

Should show improved implicit workflow completeness.

### 3. Test Application

```bash
npm run dev
```

Test key workflows:
- ✅ Project creation
- ✅ Event management
- ✅ Asset lifecycle
- ✅ People management
- ✅ Financial workflows

### 4. Check Database Health

```bash
npx supabase db lint
```

Should show minimal warnings (if any).

## Migration Timeline

| Phase | Migrations | Estimated Time |
|-------|-----------|----------------|
| **Critical Infrastructure** | 5 | 2-3 minutes |
| **Performance & Security** | 20 | 5-7 minutes |
| **Additional Features** | 12 | 3-4 minutes |
| **Total** | **37** | **10-15 minutes** |

## Safety Notes

✅ **Safe Operations:**
- All migrations are additive (create tables, add columns, create indexes)
- No data loss expected
- Can be applied to production safely

⚠️ **Cautions:**
- Some migrations drop and recreate indexes (brief performance impact)
- RLS policy updates may briefly affect permissions
- Large tables may take longer to index

🚨 **Backup Recommended:**
- Take a database snapshot before applying
- Supabase Dashboard → Database → Backups → Create Backup

## Success Criteria

After successful deployment, you should have:

✅ All 122 migrations applied  
✅ 147+ database tables created  
✅ Complete RBAC/RLS system  
✅ All workflow tables present  
✅ Performance indexes in place  
✅ Security policies active  
✅ 100% workflow completeness  

## Support

If you encounter issues:

1. Check the error message carefully
2. Review the specific migration file
3. Check Supabase Dashboard logs
4. Try applying the problematic migration manually
5. Contact Supabase support if needed

## Next Steps After Deployment

1. ✅ Verify 100% workflow completeness
2. ✅ Run integration tests
3. ✅ Deploy application to production
4. ✅ Monitor database performance
5. ✅ Set up automated backups
6. ✅ Configure monitoring/alerts

---

**Ready to deploy?** Run:

```bash
./scripts/apply-pending-migrations.sh
```

**Questions?** Check the migration status:

```bash
node scripts/check-remote-migrations.js
```
