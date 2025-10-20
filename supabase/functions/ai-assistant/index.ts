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

    const { query, context, operation = 'chat' } = await req.json()

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    let result

    switch (operation) {
      case 'chat':
        result = await processChat(supabaseClient, user.id, query, context)
        break
      
      case 'suggest':
        result = await generateSuggestions(supabaseClient, user.id, context)
        break
      
      case 'analyze':
        result = await analyzeData(supabaseClient, user.id, context)
        break
      
      case 'summarize':
        result = await summarizeContent(supabaseClient, user.id, context)
        break
      
      default:
        throw new Error('Invalid operation')
    }

    // Log interaction
    await supabaseClient
      .from('ai_interactions')
      .insert({
        user_id: user.id,
        operation,
        query,
        response: result,
        created_at: new Date().toISOString(),
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        operation,
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

async function processChat(client: any, userId: string, query: string, context: any) {
  // Fetch relevant context from database
  const relevantData = await fetchRelevantContext(client, userId, query, context)

  // Build prompt with context
  const prompt = buildPrompt(query, relevantData)

  // Call AI service (placeholder - would integrate with OpenAI, Anthropic, etc.)
  const response = await callAIService(prompt)

  return {
    message: response,
    context_used: relevantData.length,
  }
}

async function generateSuggestions(client: any, userId: string, context: any) {
  const { module, current_state } = context

  // Fetch user's historical data
  const { data: history } = await client
    .from('user_actions')
    .select('*')
    .eq('user_id', userId)
    .eq('module', module)
    .order('created_at', { ascending: false })
    .limit(50)

  // Generate suggestions based on patterns
  const suggestions = analyzePatternsAndSuggest(history, current_state)

  return {
    suggestions,
    confidence: 0.85,
  }
}

async function analyzeData(client: any, userId: string, context: any) {
  const { table, filters, metrics } = context

  // Fetch data
  let query = client.from(table).select('*')
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }

  const { data, error } = await query

  if (error) throw error

  // Perform analysis
  const analysis = {
    total_records: data.length,
    summary: generateSummary(data, metrics),
    insights: generateInsights(data, metrics),
    recommendations: generateRecommendations(data, metrics),
  }

  return analysis
}

async function summarizeContent(client: any, userId: string, context: any) {
  const { content_type, content_id } = context

  // Fetch content
  const { data, error } = await client
    .from(content_type)
    .select('*')
    .eq('id', content_id)
    .single()

  if (error) throw error

  // Generate summary (placeholder - would use AI service)
  const summary = {
    title: data.title || data.name,
    key_points: extractKeyPoints(data),
    word_count: countWords(data),
    reading_time: estimateReadingTime(data),
  }

  return summary
}

async function fetchRelevantContext(client: any, userId: string, query: string, context: any) {
  // Fetch relevant data based on query and context
  const relevantData = []

  // Example: Fetch recent projects if query mentions projects
  if (query.toLowerCase().includes('project')) {
    const { data } = await client
      .from('projects')
      .select('*')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false })
      .limit(5)

    relevantData.push(...(data || []))
  }

  return relevantData
}

function buildPrompt(query: string, context: any[]) {
  let prompt = `User query: ${query}\n\n`
  
  if (context.length > 0) {
    prompt += 'Relevant context:\n'
    context.forEach((item, index) => {
      prompt += `${index + 1}. ${JSON.stringify(item)}\n`
    })
  }

  return prompt
}

async function callAIService(prompt: string) {
  // Placeholder - would integrate with actual AI service
  return 'AI response based on: ' + prompt.substring(0, 100) + '...'
}

function analyzePatternsAndSuggest(history: any[], currentState: any) {
  // Analyze patterns and generate suggestions
  return [
    { action: 'Create new project', confidence: 0.9, reason: 'Based on your recent activity' },
    { action: 'Review pending tasks', confidence: 0.85, reason: 'You have 5 pending tasks' },
    { action: 'Update team status', confidence: 0.75, reason: 'Weekly update is due' },
  ]
}

function generateSummary(data: any[], metrics: string[]) {
  const summary: any = {}
  
  metrics.forEach(metric => {
    if (data.length > 0 && data[0][metric] !== undefined) {
      const values = data.map(d => d[metric]).filter(v => typeof v === 'number')
      summary[metric] = {
        total: values.reduce((a, b) => a + b, 0),
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
      }
    }
  })

  return summary
}

function generateInsights(data: any[], metrics: string[]) {
  return [
    'Data shows upward trend in key metrics',
    'Performance is above average for this period',
    'Consider optimizing resource allocation',
  ]
}

function generateRecommendations(data: any[], metrics: string[]) {
  return [
    'Focus on high-priority items',
    'Review budget allocation',
    'Schedule team sync meeting',
  ]
}

function extractKeyPoints(data: any) {
  // Extract key points from content
  return [
    'Main objective defined',
    'Timeline established',
    'Resources allocated',
  ]
}

function countWords(data: any) {
  const text = JSON.stringify(data)
  return text.split(/\s+/).length
}

function estimateReadingTime(data: any) {
  const words = countWords(data)
  const wordsPerMinute = 200
  return Math.ceil(words / wordsPerMinute)
}
