const { Client } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Parse connection string or build from env vars
const getConnectionConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const projectRef = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  
  if (!projectRef) {
    throw new Error('Could not parse project reference from SUPABASE_URL');
  }
  
  return {
    host: `aws-1-us-east-1.pooler.supabase.com`,
    port: 6543,
    database: 'postgres',
    user: `postgres.${projectRef}`,
    password: process.env.SUPABASE_DB_PASSWORD || process.env.DATABASE_PASSWORD,
    ssl: { rejectUnauthorized: false }
  }
};

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
      version TEXT PRIMARY KEY,
      statements TEXT[],
      name TEXT,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  console.log('✓ Migrations table verified');
}

async function getAppliedMigrations(client) {
  try {
    const result = await client.query(`
      SELECT version, name, applied_at 
      FROM supabase_migrations.schema_migrations 
      ORDER BY version;
    `);
    return new Set(result.rows.map(row => row.version));
  } catch (error) {
    console.log('⚠ Could not read migrations table, will create it');
    return new Set();
  }
}

async function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const files = await fs.readdir(migrationsDir);
  
  return files
    .filter(f => f.endsWith('.sql') && !f.startsWith('.'))
    .sort()
    .map(f => ({
      version: f.replace('.sql', ''),
      filename: f,
      path: path.join(migrationsDir, f)
    }));
}

async function applyMigration(client, migration) {
  console.log(`\n📝 Applying: ${migration.filename}`);
  
  const sql = await fs.readFile(migration.path, 'utf8');
  
  // Skip empty files
  if (sql.trim().length === 0) {
    console.log(`⚠ Skipping empty file: ${migration.filename}`);
    return { success: false, reason: 'empty' };
  }
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // Execute migration
    await client.query(sql);
    
    // Record migration
    await client.query(`
      INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
      VALUES ($1, $2, $3)
      ON CONFLICT (version) DO NOTHING;
    `, [migration.version, migration.filename, [sql]]);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log(`✓ Applied successfully: ${migration.filename}`);
    return { success: true };
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error(`✗ Failed to apply ${migration.filename}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function moveMigration(migration) {
  const appliedDir = path.join(__dirname, '../supabase/migrations/applied');
  const targetPath = path.join(appliedDir, migration.filename);
  
  try {
    await fs.mkdir(appliedDir, { recursive: true });
    await fs.rename(migration.path, targetPath);
    console.log(`📦 Moved to applied: ${migration.filename}`);
  } catch (error) {
    console.error(`⚠ Could not move ${migration.filename}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting migration process...\n');
  
  const client = new Client(getConnectionConfig());
  
  try {
    await client.connect();
    console.log('✓ Connected to Supabase database\n');
    
    // Ensure migrations table exists
    await ensureMigrationsTable(client);
    
    // Get applied migrations
    const appliedMigrations = await getAppliedMigrations(client);
    console.log(`\n📊 Found ${appliedMigrations.size} migrations already applied`);
    
    // Get all migration files
    const allMigrations = await getMigrationFiles();
    console.log(`📄 Found ${allMigrations.length} migration files\n`);
    
    // Filter pending migrations
    const pendingMigrations = allMigrations.filter(m => !appliedMigrations.has(m.version));
    
    if (pendingMigrations.length === 0) {
      console.log('✓ All migrations are already applied!');
    } else {
      console.log(`⏳ Applying ${pendingMigrations.length} pending migrations...\n`);
      
      let successCount = 0;
      let skippedCount = 0;
      let failedCount = 0;
      
      for (const migration of pendingMigrations) {
        const result = await applyMigration(client, migration);
        if (result.success) {
          successCount++;
          appliedMigrations.add(migration.version);
        } else if (result.reason === 'empty') {
          skippedCount++;
        } else {
          failedCount++;
        }
      }
      
      console.log(`\n📊 Summary:`);
      console.log(`  ✓ Successfully applied: ${successCount}`);
      if (skippedCount > 0) console.log(`  ⚠ Skipped (empty): ${skippedCount}`);
      if (failedCount > 0) console.log(`  ✗ Failed: ${failedCount}`);
    }
    
    // Verify all migrations
    const finalAppliedMigrations = await getAppliedMigrations(client);
    const totalMigrations = allMigrations.filter(m => {
      // Count non-empty migrations
      const stat = require('fs').statSync(m.path);
      return stat.size > 0;
    }).length;
    
    const completionRate = ((finalAppliedMigrations.size / totalMigrations) * 100).toFixed(1);
    console.log(`\n🎯 Completion: ${finalAppliedMigrations.size}/${totalMigrations} (${completionRate}%)`);
    
    // Move applied migrations to applied folder
    if (process.argv.includes('--move-applied')) {
      console.log('\n📦 Moving applied migrations...');
      for (const migration of allMigrations) {
        if (finalAppliedMigrations.has(migration.version)) {
          await moveMigration(migration);
        }
      }
    } else {
      console.log('\n💡 Tip: Run with --move-applied to organize migration files');
    }
    
    if (completionRate === '100.0') {
      console.log('\n✅ All migrations successfully applied!');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
