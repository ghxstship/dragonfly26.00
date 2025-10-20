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

    const { operation, table, records, filters } = await req.json()

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    let result

    switch (operation) {
      case 'insert':
        result = await supabaseClient.from(table).insert(records)
        break
      
      case 'update':
        if (!filters) throw new Error('Filters required for bulk update')
        let updateQuery = supabaseClient.from(table).update(records)
        Object.entries(filters).forEach(([key, value]) => {
          updateQuery = updateQuery.eq(key, value)
        })
        result = await updateQuery
        break
      
      case 'delete':
        if (!filters) throw new Error('Filters required for bulk delete')
        let deleteQuery = supabaseClient.from(table).delete()
        Object.entries(filters).forEach(([key, value]) => {
          deleteQuery = deleteQuery.eq(key, value)
        })
        result = await deleteQuery
        break
      
      case 'upsert':
        result = await supabaseClient.from(table).upsert(records)
        break
      
      default:
        throw new Error('Invalid operation')
    }

    if (result.error) throw result.error

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: result.data?.length || 0,
        data: result.data 
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
