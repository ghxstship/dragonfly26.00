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

    const { automationId, trigger, action, conditions = [] } = await req.json()

    // Validate automation configuration
    if (!trigger || !action) {
      throw new Error('Trigger and action required')
    }

    // Evaluate conditions
    const conditionsMet = await evaluateConditions(supabaseClient, conditions)

    if (!conditionsMet) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          executed: false,
          reason: 'Conditions not met' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Execute action
    const result = await executeAction(supabaseClient, action)

    // Log automation execution
    await supabaseClient
      .from('automation_logs')
      .insert({
        automation_id: automationId,
        trigger_type: trigger.type,
        action_type: action.type,
        result,
        executed_at: new Date().toISOString(),
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        executed: true,
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

async function evaluateConditions(client: any, conditions: any[]) {
  for (const condition of conditions) {
    const { table, field, operator, value } = condition

    const { data, error } = await client
      .from(table)
      .select(field)
      .limit(1)

    if (error) throw error

    const fieldValue = data[0]?.[field]

    switch (operator) {
      case 'equals':
        if (fieldValue !== value) return false
        break
      case 'not_equals':
        if (fieldValue === value) return false
        break
      case 'greater_than':
        if (fieldValue <= value) return false
        break
      case 'less_than':
        if (fieldValue >= value) return false
        break
      case 'contains':
        if (!String(fieldValue).includes(value)) return false
        break
      default:
        throw new Error(`Unknown operator: ${operator}`)
    }
  }

  return true
}

async function executeAction(client: any, action: any) {
  const { type, target, parameters } = action

  switch (type) {
    case 'send_notification':
      return await sendNotification(client, parameters)
    
    case 'update_record':
      return await updateRecord(client, target, parameters)
    
    case 'create_record':
      return await createRecord(client, target, parameters)
    
    case 'delete_record':
      return await deleteRecord(client, target, parameters)
    
    case 'trigger_webhook':
      return await triggerWebhook(parameters)
    
    case 'send_email':
      return await sendEmail(parameters)
    
    default:
      throw new Error(`Unknown action type: ${type}`)
  }
}

async function sendNotification(client: any, params: any) {
  const { recipient_id, subject, message } = params

  const { data, error } = await client
    .from('notifications')
    .insert({
      recipient_id,
      subject,
      message,
      type: 'automation',
      status: 'pending',
      created_at: new Date().toISOString(),
    })
    .select()

  if (error) throw error

  return { notification_id: data[0].id }
}

async function updateRecord(client: any, target: any, params: any) {
  const { table, id, updates } = params

  const { data, error } = await client
    .from(table)
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw error

  return { updated: data.length }
}

async function createRecord(client: any, target: any, params: any) {
  const { table, record } = params

  const { data, error } = await client
    .from(table)
    .insert(record)
    .select()

  if (error) throw error

  return { created_id: data[0].id }
}

async function deleteRecord(client: any, target: any, params: any) {
  const { table, id } = params

  const { error } = await client
    .from(table)
    .delete()
    .eq('id', id)

  if (error) throw error

  return { deleted: true }
}

async function triggerWebhook(params: any) {
  const { url, method = 'POST', headers = {}, body } = params

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  })

  return {
    status: response.status,
    success: response.ok,
  }
}

async function sendEmail(params: any) {
  const { to, subject, body } = params

  // Implement email sending logic
  console.log('Sending email:', { to, subject, body })

  return { sent: true }
}
