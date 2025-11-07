#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://nhceygmzwmhuyqsjxquk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oY2V5Z216d21odXlxc2p4cXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDE5NzQyMCwiZXhwIjoyMDc1NzczNDIwfQ.72QruToRImmiDiWoy5-OcuC_pBkFF54ENytHuEGSzMI';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyMigration() {
  console.log('🚀 Applying Performance Optimization Migration...\n');
  
  const migrationPath = path.join(__dirname, '../supabase/migrations/079_performance_optimization_indexes.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('📄 Migration file loaded');
  console.log(`📊 SQL length: ${sql.length} characters\n`);
  
  try {
    console.log('⚙️  Executing migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Migration applied successfully!');
    console.log('\n📊 Verifying indexes...');
    
    // Verify indexes were created
    const { data: indexes, error: indexError } = await supabase
      .from('pg_indexes')
      .select('indexname, tablename')
      .like('indexname', 'idx_%')
      .limit(10);
    
    if (!indexError && indexes) {
      console.log(`✅ Found ${indexes.length} new indexes (showing first 10):`);
      indexes.forEach(idx => {
        console.log(`   - ${idx.indexname} on ${idx.tablename}`);
      });
    }
    
    console.log('\n🎉 Performance optimization complete!');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

applyMigration();
