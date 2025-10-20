import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET - Fetch approvals records
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch single record by ID
    if (id) {
      const { data, error } = await supabase
        .from('finance_approvals')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }

      return NextResponse.json({ data })
    }

    // Fetch multiple records with pagination
    const { data, error, count } = await supabase
      .from('finance_approvals')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      count,
      limit,
      offset
    })
  } catch (error: any) {
    console.error('GET approvals error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST - Create new approvals record
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      )
    }

    // Add audit fields
    const record = {
      ...body,
      created_by: user.id,
      updated_by: user.id,
    }

    // Insert record
    const { data, error } = await supabase
      .from('finance_approvals')
      .insert(record)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data, message: 'approvals created successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('POST approvals error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT - Update existing approvals record
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      )
    }

    // Add audit fields
    const record = {
      ...updates,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    }

    // Update record
    const { data, error } = await supabase
      .from('finance_approvals')
      .update(record)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      message: 'approvals updated successfully'
    })
  } catch (error: any) {
    console.error('PUT approvals error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Remove approvals record
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      )
    }

    // Delete record
    const { error } = await supabase
      .from('finance_approvals')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'approvals deleted successfully'
    })
  } catch (error: any) {
    console.error('DELETE approvals error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
