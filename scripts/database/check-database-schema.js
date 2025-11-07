const { Client } = require('pg');
require('dotenv').config();

const getConnectionConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const projectRef = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  
  return {
    host: `aws-1-us-east-1.pooler.supabase.com`,
    port: 6543,
    database: 'postgres',
    user: `postgres.${projectRef}`,
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  }
};

async function checkSchema() {
  const client = new Client(getConnectionConfig());
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    // Get all tables in public schema
    const { rows: tables } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
      LIMIT 100;
    `);
    
    console.log(`📊 Found ${tables.length} tables in public schema:\n`);
    tables.forEach((t, i) => {
      console.log(`${(i+1).toString().padStart(3)}. ${t.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkSchema();
