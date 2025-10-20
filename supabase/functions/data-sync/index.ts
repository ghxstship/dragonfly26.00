import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { operation, source, destination, mapping, options = {} } = await req.json()

    let result

    switch (operation) {
      case 'sync':
        result = await syncData(supabaseClient, source, destination, mapping, options)
        break
      
      case 'migrate':
        result = await migrateData(supabaseClient, source, destination, mapping, options)
        break
      
      case 'backup':
        result = await backupData(supabaseClient, source, options)
        break
      
      case 'restore':
        result = await restoreData(supabaseClient, destination, options)
        break
      
      default:
        throw new Error('Invalid operation')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        operation,
        result 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function syncData(client: any, source: any, destination: any, mapping: any, options: any) {
  const { batchSize = 100, conflictResolution = 'source_wins' } = options

  // Fetch data from source
  const { data: sourceData, error: sourceError } = await client
    .from(source.table)
    .select('*')
    .gte('updated_at', source.lastSync || '1970-01-01')
    .limit(batchSize)

  if (sourceError) throw sourceError

  if (!sourceData || sourceData.length === 0) {
    return { synced: 0, message: 'No new data to sync' }
  }

  // Transform data according to mapping
  const transformedData = sourceData.map((record: any) => {
    const transformed: any = {}
    Object.entries(mapping).forEach(([sourceField, destField]) => {
      transformed[destField as string] = record[sourceField]
    })
    return transformed
  })

  // Sync to destination
  const { data: syncedData, error: syncError } = await client
    .from(destination.table)
    .upsert(transformedData, {
      onConflict: destination.conflictColumn || 'id',
      ignoreDuplicates: conflictResolution === 'destination_wins',
    })

  if (syncError) throw syncError

  // Update sync timestamp
  await client
    .from('sync_logs')
    .insert({
      source_table: source.table,
      destination_table: destination.table,
      records_synced: transformedData.length,
      synced_at: new Date().toISOString(),
    })

  return {
    synced: transformedData.length,
    last_sync: new Date().toISOString(),
  }
}

async function migrateData(client: any, source: any, destination: any, mapping: any, options: any) {
  const { batchSize = 1000, deleteSource = false } = options

  let offset = 0
  let totalMigrated = 0

  while (true) {
    // Fetch batch from source
    const { data: sourceData, error: sourceError } = await client
      .from(source.table)
      .select('*')
      .range(offset, offset + batchSize - 1)

    if (sourceError) throw sourceError

    if (!sourceData || sourceData.length === 0) break

    // Transform data
    const transformedData = sourceData.map((record: any) => {
      const transformed: any = {}
      Object.entries(mapping).forEach(([sourceField, destField]) => {
        transformed[destField as string] = record[sourceField]
      })
      return transformed
    })

    // Insert into destination
    const { error: insertError } = await client
      .from(destination.table)
      .insert(transformedData)

    if (insertError) throw insertError

    totalMigrated += transformedData.length
    offset += batchSize

    // Delete from source if requested
    if (deleteSource) {
      const ids = sourceData.map((r: any) => r.id)
      await client
        .from(source.table)
        .delete()
        .in('id', ids)
    }
  }

  return {
    migrated: totalMigrated,
    source_deleted: deleteSource,
  }
}

async function backupData(client: any, source: any, options: any) {
  const { includeRelations = false } = options

  // Fetch all data from source
  const { data, error } = await client
    .from(source.table)
    .select('*')

  if (error) throw error

  // Store backup
  const backupId = crypto.randomUUID()
  const { error: backupError } = await client.storage
    .from('backups')
    .upload(`${source.table}/${backupId}.json`, JSON.stringify(data), {
      contentType: 'application/json',
    })

  if (backupError) throw backupError

  // Log backup
  await client
    .from('backup_logs')
    .insert({
      backup_id: backupId,
      table_name: source.table,
      record_count: data.length,
      created_at: new Date().toISOString(),
    })

  return {
    backup_id: backupId,
    records: data.length,
    location: `backups/${source.table}/${backupId}.json`,
  }
}

async function restoreData(client: any, destination: any, options: any) {
  const { backupId, truncateFirst = false } = options

  // Download backup
  const { data: backupData, error: downloadError } = await client.storage
    .from('backups')
    .download(`${destination.table}/${backupId}.json`)

  if (downloadError) throw downloadError

  const records = JSON.parse(await backupData.text())

  // Truncate destination if requested
  if (truncateFirst) {
    await client
      .from(destination.table)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
  }

  // Restore data
  const { error: insertError } = await client
    .from(destination.table)
    .insert(records)

  if (insertError) throw insertError

  return {
    restored: records.length,
    backup_id: backupId,
  }
}
