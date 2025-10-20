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

    const { type, recipients, subject, message, priority = 'normal', metadata } = await req.json()

    // Validate inputs
    if (!recipients || recipients.length === 0) {
      throw new Error('Recipients required')
    }

    // Create notifications for each recipient
    const notifications = recipients.map((recipientId: string) => ({
      recipient_id: recipientId,
      type,
      subject,
      message,
      priority,
      metadata,
      status: 'pending',
      created_at: new Date().toISOString(),
    }))

    const { data, error } = await supabaseClient
      .from('notifications')
      .insert(notifications)
      .select()

    if (error) throw error

    // Send via appropriate channels based on type
    const sendPromises = data.map(async (notification: any) => {
      switch (type) {
        case 'email':
          return await sendEmail(notification)
        case 'sms':
          return await sendSMS(notification)
        case 'push':
          return await sendPushNotification(notification)
        case 'in_app':
          return await sendInAppNotification(supabaseClient, notification)
        default:
          return await sendInAppNotification(supabaseClient, notification)
      }
    })

    await Promise.allSettled(sendPromises)

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: data.length,
        notifications: data 
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

async function sendEmail(notification: any) {
  // Implement email sending logic (e.g., via SendGrid, AWS SES, etc.)
  console.log('Sending email:', notification)
  return { success: true, channel: 'email' }
}

async function sendSMS(notification: any) {
  // Implement SMS sending logic (e.g., via Twilio, AWS SNS, etc.)
  console.log('Sending SMS:', notification)
  return { success: true, channel: 'sms' }
}

async function sendPushNotification(notification: any) {
  // Implement push notification logic (e.g., via Firebase Cloud Messaging)
  console.log('Sending push notification:', notification)
  return { success: true, channel: 'push' }
}

async function sendInAppNotification(client: any, notification: any) {
  // Update notification status
  await client
    .from('notifications')
    .update({ status: 'delivered', delivered_at: new Date().toISOString() })
    .eq('id', notification.id)

  return { success: true, channel: 'in_app' }
}
