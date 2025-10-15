const { Client } = require('pg');
require('dotenv').config();

const projectRef = 'nhceygmzwmhuyqsjxquk';

const configs = [
  {
    name: 'Pooler with postgres user',
    host: `aws-0-us-east-1.pooler.supabase.com`,
    port: 6543,
    database: 'postgres',
    user: 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Pooler with postgres.project user',
    host: `aws-0-us-east-1.pooler.supabase.com`,
    port: 6543,
    database: 'postgres',
    user: `postgres.${projectRef}`,
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Direct connection on port 5432',
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Direct connection on port 6543',
    host: `db.${projectRef}.supabase.co`,
    port: 6543,
    database: 'postgres',
    user: 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  }
];

async function testConnection(config) {
  const client = new Client(config);
  
  try {
    console.log(`\n🔄 Testing: ${config.name}`);
    console.log(`   Host: ${config.host}:${config.port}`);
    console.log(`   User: ${config.user}`);
    
    await client.connect();
    console.log(`   ✅ Connection successful!`);
    
    const result = await client.query('SELECT version()');
    console.log(`   Database: ${result.rows[0].version.substring(0, 50)}...`);
    
    await client.end();
    return true;
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    await client.end().catch(() => {});
    return false;
  }
}

async function main() {
  console.log('🔍 Testing Supabase database connections...\n');
  console.log(`Password provided: ${process.env.SUPABASE_DB_PASSWORD ? 'Yes' : 'No'}`);
  
  for (const config of configs) {
    const success = await testConnection(config);
    if (success) {
      console.log('\n✅ Found working connection! Use this configuration.');
      break;
    }
  }
}

main();
