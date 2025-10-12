// =============================================
// LAYER 4: EDGE FUNCTIONS - Webhook Handler
// Handles incoming webhooks from external services
// =============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { source, event_type, payload } = await req.json()

    // Route to appropriate handler based on source
    let result;
    switch (source) {
      case 'stripe':
        result = await handleStripeWebhook(supabaseClient, event_type, payload)
        break
      case 'calendar':
        result = await handleCalendarWebhook(supabaseClient, event_type, payload)
        break
      case 'email':
        result = await handleEmailWebhook(supabaseClient, event_type, payload)
        break
      default:
        throw new Error(`Unknown webhook source: ${source}`)
    }

    // Log webhook activity
    await supabaseClient
      .from('activities')
      .insert({
        action: `webhook_${event_type}`,
        entity_type: 'webhook',
        entity_id: crypto.randomUUID(),
        metadata: { source, event_type, result }
      })

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Stripe payment webhook handler
async function handleStripeWebhook(supabase: any, eventType: string, payload: any) {
  switch (eventType) {
    case 'payment_intent.succeeded':
      // Update invoice status
      await supabase
        .from('invoices')
        .update({ status: 'paid', paid_date: new Date().toISOString() })
        .eq('stripe_payment_intent_id', payload.id)
      break
    
    case 'subscription.updated':
      // Update organization subscription
      await supabase
        .from('organizations')
        .update({ 
          subscription_status: payload.status,
          subscription_tier: payload.items.data[0].price.product.name 
        })
        .eq('stripe_subscription_id', payload.id)
      break
  }
  
  return { processed: true }
}

// Calendar sync webhook handler
async function handleCalendarWebhook(supabase: any, eventType: string, payload: any) {
  switch (eventType) {
    case 'event.created':
    case 'event.updated':
      // Sync calendar event to events table
      await supabase
        .from('events')
        .upsert({
          id: payload.external_id,
          name: payload.summary,
          description: payload.description,
          start_time: payload.start,
          end_time: payload.end,
          location_details: payload.location
        })
      break
    
    case 'event.deleted':
      await supabase
        .from('events')
        .update({ status: 'cancelled' })
        .eq('external_id', payload.id)
      break
  }
  
  return { synced: true }
}

// Email notification webhook handler
async function handleEmailWebhook(supabase: any, eventType: string, payload: any) {
  switch (eventType) {
    case 'email.bounced':
    case 'email.complained':
      // Mark user email as invalid
      await supabase
        .from('personnel')
        .update({ email_status: 'invalid' })
        .eq('email', payload.email)
      break
  }
  
  return { handled: true }
}
