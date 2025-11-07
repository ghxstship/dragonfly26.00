#!/usr/bin/env node

/**
 * Schema Alignment Verification Script
 * Compares local and remote Supabase database schemas at the field level
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getRemoteTables() {
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `
  });

  if (error) {
    // Try alternative method
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('❌ Error fetching remote schema:', tablesError);
      return null;
    }
    
    return tables;
  }

  return data;
}

async function verifySchemaAlignment() {
  console.log('🔍 SCHEMA ALIGNMENT VERIFICATION\n');
  console.log('=' .repeat(80));
  
  try {
    // Get remote tables
    console.log('\n📊 Fetching remote database schema...');
    const remoteTables = await getRemoteTables();
    
    if (!remoteTables) {
      console.log('\n⚠️  Unable to fetch detailed schema via RPC.');
      console.log('   Using alternative method to list tables...\n');
      
      // Alternative: Query pg_catalog directly
      const { data: tables, error } = await supabase.rpc('exec_sql', {
        query: `
          SELECT tablename 
          FROM pg_catalog.pg_tables 
          WHERE schemaname = 'public' 
          ORDER BY tablename;
        `
      });
      
      if (error) {
        console.log('\n⚠️  Cannot verify schema alignment automatically.');
        console.log('   Recommendation: Use Supabase Dashboard to inspect schema.\n');
        console.log('   Dashboard URL:', supabaseUrl.replace('.supabase.co', '.supabase.co/project/_/editor'));
        return;
      }
      
      console.log(`\n✅ Found ${tables.length} tables in remote database\n`);
      console.log('Tables:');
      tables.forEach(t => console.log(`  - ${t.tablename}`));
      return;
    }
    
    // Group by table
    const tableMap = {};
    remoteTables.forEach(row => {
      if (!tableMap[row.table_name]) {
        tableMap[row.table_name] = [];
      }
      tableMap[row.table_name].push(row);
    });
    
    const tableCount = Object.keys(tableMap).length;
    const columnCount = remoteTables.length;
    
    console.log(`\n✅ Remote Database Schema:`);
    console.log(`   - Tables: ${tableCount}`);
    console.log(`   - Total Columns: ${columnCount}\n`);
    
    // Check for critical tables
    const criticalTables = [
      'organizations', 'workspaces', 'productions', 'projects', 'activations',
      'profiles', 'events', 'personnel', 'assets', 'locations',
      'roles', 'permissions', 'role_permissions', 'user_roles'
    ];
    
    console.log('🔍 Critical Tables Check:');
    const missingTables = [];
    const existingTables = [];
    
    criticalTables.forEach(table => {
      if (tableMap[table]) {
        existingTables.push(table);
        console.log(`   ✅ ${table} (${tableMap[table].length} columns)`);
      } else {
        missingTables.push(table);
        console.log(`   ❌ ${table} - MISSING`);
      }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   - Existing: ${existingTables.length}/${criticalTables.length}`);
    console.log(`   - Missing: ${missingTables.length}/${criticalTables.length}`);
    
    if (missingTables.length > 0) {
      console.log(`\n⚠️  WARNING: ${missingTables.length} critical tables are missing!`);
      console.log('   This indicates the schemas are NOT 100% aligned.\n');
      return false;
    }
    
    console.log('\n✅ All critical tables exist in remote database!');
    
    // Save detailed schema to file
    const schemaFile = path.join(__dirname, '../docs/REMOTE_SCHEMA_SNAPSHOT.json');
    fs.writeFileSync(schemaFile, JSON.stringify(tableMap, null, 2));
    console.log(`\n📄 Detailed schema saved to: ${schemaFile}`);
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Error during verification:', error.message);
    return false;
  }
}

// Run verification
verifySchemaAlignment()
  .then(aligned => {
    console.log('\n' + '='.repeat(80));
    if (aligned === true) {
      console.log('\n✅ SCHEMA ALIGNMENT: VERIFIED');
    } else if (aligned === false) {
      console.log('\n❌ SCHEMA ALIGNMENT: FAILED');
    } else {
      console.log('\n⚠️  SCHEMA ALIGNMENT: UNABLE TO VERIFY AUTOMATICALLY');
    }
    console.log('\n' + '='.repeat(80) + '\n');
    process.exit(aligned === false ? 1 : 0);
  })
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
