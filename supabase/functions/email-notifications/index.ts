// Follow @deno-types directives for type safety
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailNotification {
  id: string
  type: 'task_assigned' | 'event_reminder' | 'approval_required' | 'status_change' | 'mention'
  recipient_id: string
  recipient_email: string
  subject: string
  template_id: string
  data: Record<string, any>
  scheduled_for?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
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

    // Fetch pending email notifications
    const { data: notifications, error: fetchError } = await supabaseClient
      .from('email_notifications_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(50)

    if (fetchError) throw fetchError

    if (!notifications || notifications.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending notifications', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    const results = {
      processed: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process each notification
    for (const notification of notifications as EmailNotification[]) {
      try {
        // Fetch email template
        const { data: template, error: templateError } = await supabaseClient
          .from('email_templates')
          .select('subject, html_body, text_body')
          .eq('id', notification.template_id)
          .single()

        if (templateError) throw templateError

        // Replace template variables
        let subject = template.subject
        let htmlBody = template.html_body
        let textBody = template.text_body

        Object.entries(notification.data).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`
          subject = subject.replace(new RegExp(placeholder, 'g'), String(value))
          htmlBody = htmlBody.replace(new RegExp(placeholder, 'g'), String(value))
          textBody = textBody.replace(new RegExp(placeholder, 'g'), String(value))
        })

        // Send email via your email service (SendGrid, Resend, etc.)
        // For now, we'll use a placeholder
        const emailSent = await sendEmail({
          to: notification.recipient_email,
          subject,
          html: htmlBody,
          text: textBody,
        })

        if (emailSent) {
          // Mark as sent
          await supabaseClient
            .from('email_notifications_queue')
            .update({ 
              status: 'sent', 
              sent_at: new Date().toISOString() 
            })
            .eq('id', notification.id)

          results.processed++
        } else {
          throw new Error('Email sending failed')
        }
      } catch (error) {
        // Mark as failed
        await supabaseClient
          .from('email_notifications_queue')
          .update({ 
            status: 'failed', 
            error_message: error.message,
            failed_at: new Date().toISOString()
          })
          .eq('id', notification.id)

        results.failed++
        results.errors.push(`${notification.id}: ${error.message}`)
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

// Email sending function (integrate with your email service)
async function sendEmail(params: {
  to: string
  subject: string
  html: string
  text: string
}): Promise<boolean> {
  // TODO: Integrate with SendGrid, Resend, or your email service
  // For now, just log and return success
  console.log('Sending email:', {
    to: params.to,
    subject: params.subject,
  })
  
  // Example with Resend:
  // const response = await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     from: 'noreply@yourdomain.com',
  //     to: params.to,
  //     subject: params.subject,
  //     html: params.html,
  //     text: params.text,
  //   }),
  // })
  // return response.ok

  return true // Placeholder
}
