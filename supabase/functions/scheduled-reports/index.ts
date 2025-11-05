// Follow @deno-types directives for type safety
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScheduledReport {
  id: string
  name: string
  report_type: string
  schedule: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  recipients: string[]
  workspace_id: string
  filters: Record<string, any>
  format: 'pdf' | 'csv' | 'excel'
  last_run_at?: string
  next_run_at: string
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

    // Fetch scheduled reports that are due
    const now = new Date().toISOString()
    const { data: reports, error: fetchError } = await supabaseClient
      .from('scheduled_reports')
      .select('*')
      .eq('is_active', true)
      .lte('next_run_at', now)
      .limit(20)

    if (fetchError) throw fetchError

    if (!reports || reports.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No reports due', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    const results = {
      processed: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process each report
    for (const report of reports as ScheduledReport[]) {
      try {
        // Generate report data based on type
        const reportData = await generateReportData(supabaseClient, report)

        // Format report (PDF, CSV, Excel)
        const formattedReport = await formatReport(reportData, report.format)

        // Store report in storage
        const { data: uploadData, error: uploadError } = await supabaseClient
          .storage
          .from('reports')
          .upload(
            `${report.workspace_id}/${report.id}/${Date.now()}.${report.format}`,
            formattedReport,
            { contentType: getContentType(report.format) }
          )

        if (uploadError) throw uploadError

        // Send to recipients
        for (const recipientEmail of report.recipients) {
          await supabaseClient
            .from('email_notifications_queue')
            .insert({
              type: 'scheduled_report',
              recipient_email: recipientEmail,
              subject: `Scheduled Report: ${report.name}`,
              template_id: 'scheduled_report_template',
              data: {
                report_name: report.name,
                report_url: uploadData.path,
                generated_at: new Date().toISOString(),
              },
              priority: 'normal',
            })
        }

        // Update next run time
        const nextRunAt = calculateNextRun(report.schedule, new Date())
        await supabaseClient
          .from('scheduled_reports')
          .update({
            last_run_at: now,
            next_run_at: nextRunAt.toISOString(),
            last_run_status: 'success',
          })
          .eq('id', report.id)

        results.processed++
      } catch (error) {
        // Mark as failed
        await supabaseClient
          .from('scheduled_reports')
          .update({
            last_run_status: 'failed',
            last_error: error.message,
          })
          .eq('id', report.id)

        results.failed++
        results.errors.push(`${report.id}: ${error.message}`)
      }
    }

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Generate report data based on report type
async function generateReportData(
  supabaseClient: any,
  report: ScheduledReport
): Promise<any[]> {
  // TODO: Implement report generation logic based on report_type
  // This is a placeholder that fetches sample data
  
  const { data, error } = await supabaseClient
    .from(report.report_type)
    .select('*')
    .eq('workspace_id', report.workspace_id)
    .limit(1000)

  if (error) throw error
  return data || []
}

// Format report data
async function formatReport(data: any[], format: string): Promise<Blob> {
  // TODO: Implement proper formatting for PDF, CSV, Excel
  // For now, return JSON as placeholder
  
  if (format === 'csv') {
    // Convert to CSV
    const csv = convertToCSV(data)
    return new Blob([csv], { type: 'text/csv' })
  }
  
  // Default to JSON
  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
}

// Convert data to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const rows = data.map(row => 
    headers.map(header => JSON.stringify(row[header] ?? '')).join(',')
  )
  
  return [headers.join(','), ...rows].join('\n')
}

// Calculate next run time based on schedule
function calculateNextRun(schedule: string, from: Date): Date {
  const next = new Date(from)
  
  switch (schedule) {
    case 'daily':
      next.setDate(next.getDate() + 1)
      break
    case 'weekly':
      next.setDate(next.getDate() + 7)
      break
    case 'monthly':
      next.setMonth(next.getMonth() + 1)
      break
    case 'quarterly':
      next.setMonth(next.getMonth() + 3)
      break
  }
  
  return next
}

// Get content type for file format
function getContentType(format: string): string {
  switch (format) {
    case 'pdf':
      return 'application/pdf'
    case 'csv':
      return 'text/csv'
    case 'excel':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    default:
      return 'application/octet-stream'
  }
}
