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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { table, filters, format = 'csv' } = await req.json()

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Build query with filters
    let query = supabaseClient.from(table).select('*')
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error } = await query

    if (error) throw error

    // Convert to requested format
    let output: string
    let contentType: string

    if (format === 'csv') {
      const headers = Object.keys(data[0] || {})
      const rows = data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
      output = [headers.join(','), ...rows].join('\n')
      contentType = 'text/csv'
    } else if (format === 'json') {
      output = JSON.stringify(data, null, 2)
      contentType = 'application/json'
    } else {
      throw new Error('Unsupported format')
    }

    return new Response(output, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${table}-export.${format}"`,
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
