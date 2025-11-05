// Follow @deno-types directives for type safety
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const results = {
      expiredSessions: 0,
      oldLogs: 0,
      tempFiles: 0,
      cacheEntries: 0,
      errors: [] as string[]
    }

    // 1. Clean up expired sessions (older than 30 days)
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { error: sessionsError, count } = await supabaseClient
        .from('session_logs')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString())

      if (sessionsError) throw sessionsError
      results.expiredSessions = count || 0
    } catch (error) {
      results.errors.push(`Sessions cleanup failed: ${error.message}`)
    }

    // 2. Clean up old logs (older than 90 days)
    try {
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

      const { error: logsError, count: errorLogsCount } = await supabaseClient
        .from('error_logs')
        .delete()
        .lt('created_at', ninetyDaysAgo.toISOString())

      if (logsError) throw logsError

      const { error: webhookLogsError, count: webhookLogsCount } = await supabaseClient
        .from('webhook_logs')
        .delete()
        .lt('created_at', ninetyDaysAgo.toISOString())

      if (webhookLogsError) throw webhookLogsError

      results.oldLogs = (errorLogsCount || 0) + (webhookLogsCount || 0)
    } catch (error) {
      results.errors.push(`Logs cleanup failed: ${error.message}`)
    }

    // 3. Clean up temporary files (older than 7 days)
    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      // List temporary files
      const { data: tempFiles, error: listError } = await supabaseClient
        .storage
        .from('temp')
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'asc' }
        })

      if (listError) throw listError

      // Delete old files
      const filesToDelete = tempFiles
        ?.filter(file => new Date(file.created_at) < sevenDaysAgo)
        .map(file => file.name) || []

      if (filesToDelete.length > 0) {
        const { error: deleteError } = await supabaseClient
          .storage
          .from('temp')
          .remove(filesToDelete)

        if (deleteError) throw deleteError
        results.tempFiles = filesToDelete.length
      }
    } catch (error) {
      results.errors.push(`Temp files cleanup failed: ${error.message}`)
    }

    // 4. Clean up cache entries (older than 24 hours)
    try {
      const oneDayAgo = new Date()
      oneDayAgo.setHours(oneDayAgo.getHours() - 24)

      const { error: cacheError, count } = await supabaseClient
        .from('cache_entries')
        .delete()
        .or(`expires_at.lt.${new Date().toISOString()},created_at.lt.${oneDayAgo.toISOString()}`)

      if (cacheError) throw cacheError
      results.cacheEntries = count || 0
    } catch (error) {
      results.errors.push(`Cache cleanup failed: ${error.message}`)
    }

    // 5. Clean up old search history (older than 30 days)
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { error: searchError, count } = await supabaseClient
        .from('search_history')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString())

      if (searchError) throw searchError
      results.oldLogs += count || 0
    } catch (error) {
      results.errors.push(`Search history cleanup failed: ${error.message}`)
    }

    // 6. Clean up old recent items (older than 30 days)
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { error: recentError, count } = await supabaseClient
        .from('recent_items')
        .delete()
        .lt('accessed_at', thirtyDaysAgo.toISOString())

      if (recentError) throw recentError
      results.oldLogs += count || 0
    } catch (error) {
      results.errors.push(`Recent items cleanup failed: ${error.message}`)
    }

    // 7. Clean up failed background jobs (older than 7 days)
    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { error: jobsError, count } = await supabaseClient
        .from('background_jobs')
        .delete()
        .eq('status', 'failed')
        .lt('created_at', sevenDaysAgo.toISOString())

      if (jobsError) throw jobsError
      results.oldLogs += count || 0
    } catch (error) {
      results.errors.push(`Background jobs cleanup failed: ${error.message}`)
    }

    // 8. Vacuum analyze (optimize database)
    try {
      // Note: This requires elevated permissions and may not work in all environments
      // await supabaseClient.rpc('vacuum_analyze')
      console.log('Vacuum analyze skipped (requires elevated permissions)')
    } catch (error) {
      results.errors.push(`Vacuum analyze failed: ${error.message}`)
    }

    // Log cleanup results
    await supabaseClient
      .from('cleanup_logs')
      .insert({
        run_at: new Date().toISOString(),
        expired_sessions: results.expiredSessions,
        old_logs: results.oldLogs,
        temp_files: results.tempFiles,
        cache_entries: results.cacheEntries,
        errors: results.errors.length > 0 ? results.errors : null,
        status: results.errors.length === 0 ? 'success' : 'partial_success'
      })

    return new Response(
      JSON.stringify({
        ...results,
        message: 'Cleanup completed',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
