#!/usr/bin/env node

const connectionString = "postgresql://postgres.nhceygmzwmhuyqsjxquk:CelebritySummit20$1@aws-1-us-east-1.pooler.supabase.com:5432/postgres";

async function mark080() {
  const pg = require('pg');
  const { Client } = pg;
  const client = new Client({ connectionString });

  try {
    await client.connect();
    await client.query(
      `INSERT INTO supabase_migrations.schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING`,
      ['080_add_missing_foreign_key_indexes']
    );
    console.log('✅ 080_add_missing_foreign_key_indexes marked as applied (empty file)');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

mark080();
