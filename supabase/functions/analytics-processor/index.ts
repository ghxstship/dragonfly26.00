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

    const { metric, dateRange, groupBy, filters } = await req.json()

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Process analytics based on metric type
    let result

    switch (metric) {
      case 'project_performance':
        result = await processProjectPerformance(supabaseClient, dateRange, filters)
        break
      
      case 'financial_summary':
        result = await processFinancialSummary(supabaseClient, dateRange, filters)
        break
      
      case 'resource_utilization':
        result = await processResourceUtilization(supabaseClient, dateRange, filters)
        break
      
      case 'user_activity':
        result = await processUserActivity(supabaseClient, dateRange, filters)
        break
      
      default:
        throw new Error('Invalid metric type')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        metric,
        dateRange,
        data: result 
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

async function processProjectPerformance(client: any, dateRange: any, filters: any) {
  const { data, error } = await client
    .from('projects')
    .select('id, name, status, budget, actual_cost, start_date, end_date')
    .gte('created_at', dateRange.start)
    .lte('created_at', dateRange.end)

  if (error) throw error

  return data.map((project: any) => ({
    ...project,
    budget_variance: project.budget - project.actual_cost,
    variance_percentage: ((project.budget - project.actual_cost) / project.budget) * 100,
  }))
}

async function processFinancialSummary(client: any, dateRange: any, filters: any) {
  const { data, error } = await client
    .from('transactions')
    .select('amount, type, category, date')
    .gte('date', dateRange.start)
    .lte('date', dateRange.end)

  if (error) throw error

  const summary = {
    total_income: 0,
    total_expenses: 0,
    by_category: {} as Record<string, number>,
  }

  data.forEach((transaction: any) => {
    if (transaction.type === 'income') {
      summary.total_income += transaction.amount
    } else {
      summary.total_expenses += transaction.amount
    }
    
    if (!summary.by_category[transaction.category]) {
      summary.by_category[transaction.category] = 0
    }
    summary.by_category[transaction.category] += transaction.amount
  })

  return summary
}

async function processResourceUtilization(client: any, dateRange: any, filters: any) {
  const { data, error } = await client
    .from('resource_allocations')
    .select('resource_id, hours_allocated, hours_used, date')
    .gte('date', dateRange.start)
    .lte('date', dateRange.end)

  if (error) throw error

  const utilization = {} as Record<string, any>

  data.forEach((allocation: any) => {
    if (!utilization[allocation.resource_id]) {
      utilization[allocation.resource_id] = {
        total_allocated: 0,
        total_used: 0,
      }
    }
    utilization[allocation.resource_id].total_allocated += allocation.hours_allocated
    utilization[allocation.resource_id].total_used += allocation.hours_used
  })

  return Object.entries(utilization).map(([resource_id, data]: [string, any]) => ({
    resource_id,
    ...data,
    utilization_rate: (data.total_used / data.total_allocated) * 100,
  }))
}

async function processUserActivity(client: any, dateRange: any, filters: any) {
  const { data, error } = await client
    .from('activity_logs')
    .select('user_id, action, timestamp')
    .gte('timestamp', dateRange.start)
    .lte('timestamp', dateRange.end)

  if (error) throw error

  const activity = {} as Record<string, any>

  data.forEach((log: any) => {
    if (!activity[log.user_id]) {
      activity[log.user_id] = {
        total_actions: 0,
        actions_by_type: {} as Record<string, number>,
      }
    }
    activity[log.user_id].total_actions++
    if (!activity[log.user_id].actions_by_type[log.action]) {
      activity[log.user_id].actions_by_type[log.action] = 0
    }
    activity[log.user_id].actions_by_type[log.action]++
  })

  return activity
}
