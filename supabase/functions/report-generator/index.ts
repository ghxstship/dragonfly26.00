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

    const { reportType, parameters, format = 'json' } = await req.json()

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Generate report based on type
    let reportData

    switch (reportType) {
      case 'executive_summary':
        reportData = await generateExecutiveSummary(supabaseClient, parameters)
        break
      
      case 'financial_report':
        reportData = await generateFinancialReport(supabaseClient, parameters)
        break
      
      case 'project_status':
        reportData = await generateProjectStatusReport(supabaseClient, parameters)
        break
      
      case 'compliance_report':
        reportData = await generateComplianceReport(supabaseClient, parameters)
        break
      
      case 'operational_report':
        reportData = await generateOperationalReport(supabaseClient, parameters)
        break
      
      default:
        throw new Error('Invalid report type')
    }

    // Store report in database
    const { data: savedReport, error: saveError } = await supabaseClient
      .from('reports')
      .insert({
        type: reportType,
        parameters,
        data: reportData,
        generated_by: user.id,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (saveError) throw saveError

    return new Response(
      JSON.stringify({ 
        success: true, 
        reportId: savedReport.id,
        reportType,
        data: reportData 
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

async function generateExecutiveSummary(client: any, params: any) {
  const { dateRange } = params

  // Fetch key metrics
  const [projects, finances, resources] = await Promise.all([
    client.from('projects').select('status, budget, actual_cost')
      .gte('created_at', dateRange.start).lte('created_at', dateRange.end),
    client.from('transactions').select('amount, type')
      .gte('date', dateRange.start).lte('date', dateRange.end),
    client.from('resources').select('status, utilization_rate'),
  ])

  return {
    period: dateRange,
    projects: {
      total: projects.data?.length || 0,
      active: projects.data?.filter((p: any) => p.status === 'active').length || 0,
      budget_variance: projects.data?.reduce((sum: number, p: any) => sum + (p.budget - p.actual_cost), 0) || 0,
    },
    finances: {
      revenue: finances.data?.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0) || 0,
      expenses: finances.data?.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0) || 0,
    },
    resources: {
      total: resources.data?.length || 0,
      avg_utilization: resources.data?.reduce((sum: number, r: any) => sum + r.utilization_rate, 0) / (resources.data?.length || 1) || 0,
    },
  }
}

async function generateFinancialReport(client: any, params: any) {
  const { dateRange, includeForecasts } = params

  const { data: transactions, error } = await client
    .from('transactions')
    .select('*')
    .gte('date', dateRange.start)
    .lte('date', dateRange.end)
    .order('date', { ascending: true })

  if (error) throw error

  const summary = {
    total_revenue: 0,
    total_expenses: 0,
    net_income: 0,
    by_category: {} as Record<string, number>,
    by_month: {} as Record<string, any>,
  }

  transactions.forEach((t: any) => {
    const month = t.date.substring(0, 7)
    
    if (t.type === 'income') {
      summary.total_revenue += t.amount
    } else {
      summary.total_expenses += t.amount
    }

    if (!summary.by_category[t.category]) {
      summary.by_category[t.category] = 0
    }
    summary.by_category[t.category] += t.amount

    if (!summary.by_month[month]) {
      summary.by_month[month] = { revenue: 0, expenses: 0 }
    }
    if (t.type === 'income') {
      summary.by_month[month].revenue += t.amount
    } else {
      summary.by_month[month].expenses += t.amount
    }
  })

  summary.net_income = summary.total_revenue - summary.total_expenses

  return summary
}

async function generateProjectStatusReport(client: any, params: any) {
  const { projectIds, includeDetails } = params

  let query = client.from('projects').select('*')
  
  if (projectIds && projectIds.length > 0) {
    query = query.in('id', projectIds)
  }

  const { data: projects, error } = await query

  if (error) throw error

  return projects.map((project: any) => ({
    id: project.id,
    name: project.name,
    status: project.status,
    progress: project.progress_percentage,
    budget_status: {
      budget: project.budget,
      spent: project.actual_cost,
      remaining: project.budget - project.actual_cost,
      variance_percentage: ((project.budget - project.actual_cost) / project.budget) * 100,
    },
    timeline_status: {
      start_date: project.start_date,
      end_date: project.end_date,
      days_remaining: Math.ceil((new Date(project.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    },
  }))
}

async function generateComplianceReport(client: any, params: any) {
  const { dateRange, standards } = params

  const { data: audits, error } = await client
    .from('compliance_audits')
    .select('*')
    .gte('audit_date', dateRange.start)
    .lte('audit_date', dateRange.end)

  if (error) throw error

  const summary = {
    total_audits: audits.length,
    passed: audits.filter((a: any) => a.status === 'passed').length,
    failed: audits.filter((a: any) => a.status === 'failed').length,
    pending: audits.filter((a: any) => a.status === 'pending').length,
    by_standard: {} as Record<string, any>,
  }

  audits.forEach((audit: any) => {
    if (!summary.by_standard[audit.standard]) {
      summary.by_standard[audit.standard] = { passed: 0, failed: 0, pending: 0 }
    }
    summary.by_standard[audit.standard][audit.status]++
  })

  return summary
}

async function generateOperationalReport(client: any, params: any) {
  const { dateRange, metrics } = params

  const [personnel, assets, incidents] = await Promise.all([
    client.from('personnel').select('status, department'),
    client.from('assets').select('status, type, condition'),
    client.from('incidents').select('severity, status, resolved_at')
      .gte('created_at', dateRange.start).lte('created_at', dateRange.end),
  ])

  return {
    personnel: {
      total: personnel.data?.length || 0,
      by_department: personnel.data?.reduce((acc: any, p: any) => {
        acc[p.department] = (acc[p.department] || 0) + 1
        return acc
      }, {}),
    },
    assets: {
      total: assets.data?.length || 0,
      by_status: assets.data?.reduce((acc: any, a: any) => {
        acc[a.status] = (acc[a.status] || 0) + 1
        return acc
      }, {}),
    },
    incidents: {
      total: incidents.data?.length || 0,
      resolved: incidents.data?.filter((i: any) => i.status === 'resolved').length || 0,
      by_severity: incidents.data?.reduce((acc: any, i: any) => {
        acc[i.severity] = (acc[i.severity] || 0) + 1
        return acc
      }, {}),
    },
  }
}
