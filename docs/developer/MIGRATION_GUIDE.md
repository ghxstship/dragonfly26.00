# Migration Management Guide

This guide explains how to apply and manage Supabase database migrations for the Dragonfly26.00 project.

## Prerequisites

1. **Database Password**: You need the Supabase database password
   - Find it in the Supabase Dashboard: Project Settings → Database → Connection String
   - Add it to your `.env` file as `SUPABASE_DB_PASSWORD`

2. **Dependencies**: Ensure all npm packages are installed
   ```bash
   npm install
   ```

## Apply All Migrations

### Step 1: Set Database Password

Add to your `.env` file (not `.env.example`):
```bash
SUPABASE_DB_PASSWORD=your_actual_database_password
```

### Step 2: Run Migration Script

To apply all pending migrations:
```bash
node scripts/apply-migrations.js
```

To apply migrations AND move applied files to the `applied` folder:
```bash
node scripts/apply-migrations.js --move-applied
```

## What the Script Does

1. **Connects** to your remote Supabase database
2. **Checks** which migrations have already been applied
3. **Applies** all pending migrations in alphabetical order
4. **Records** each migration in `supabase_migrations.schema_migrations` table
5. **Verifies** 100% completion
6. **Moves** applied migrations to `supabase/migrations/applied/` (if `--move-applied` flag is used)

## Migration Status

The script will show:
- ✓ Successfully applied migrations
- ⚠ Skipped migrations (empty files)
- ✗ Failed migrations (with error details)
- 🎯 Completion percentage

## Troubleshooting

### Connection Errors

If you see connection errors:
1. Verify your database password is correct
2. Check that your Supabase project is active
3. Ensure your IP is allowed in Supabase Dashboard → Settings → Database → Connection Pooling

### Empty Migration Files

Some migration files (like `040_5_create_global_catalog_workspace.sql`) may be empty placeholders. The script will skip these automatically.

### Failed Migrations

If a migration fails:
1. Check the error message for SQL syntax issues
2. Review the migration file content
3. Fix any issues and run the script again (already-applied migrations will be skipped)

## Migration Organization

After running with `--move-applied`:
- Applied migrations → `supabase/migrations/applied/`
- Pending migrations → `supabase/migrations/`
- Deprecated migrations → `supabase/migrations/deprecated/`

## Best Practices

1. **Always backup** your database before running migrations on production
2. **Test migrations** on a development/staging environment first
3. **Review** migration SQL files before applying
4. **Keep** migration files even after applying (don't delete them)
5. **Version control** all migration files

## Manual Migration (Alternative)

If you prefer to use Supabase CLI directly:

```bash
# Check migration status
npx supabase migration list --linked

# Apply specific migration
npx supabase db push

# Or apply all migrations
npx supabase db push
```

## Database Schema Migrations Table

All applied migrations are tracked in:
```sql
SELECT * FROM supabase_migrations.schema_migrations 
ORDER BY applied_at DESC;
```

This table contains:
- `version`: Migration filename (without .sql)
- `name`: Full migration filename
- `statements`: SQL statements that were executed
- `applied_at`: Timestamp when migration was applied
