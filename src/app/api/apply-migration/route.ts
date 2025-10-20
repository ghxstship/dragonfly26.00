import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { migrationFile } = await request.json()
    
    if (!migrationFile) {
      return NextResponse.json(
        { error: 'Migration file name is required' },
        { status: 400 }
      )
    }
    
    // Read the migration file
    const migrationPath = path.join(
      process.cwd(),
      'supabase',
      'migrations',
      migrationFile
    )
    
    if (!fs.existsSync(migrationPath)) {
      return NextResponse.json(
        { error: 'Migration file not found' },
        { status: 404 }
      )
    }
    
    const sql = fs.readFileSync(migrationPath, 'utf8')
    
    if (!sql.trim()) {
      return NextResponse.json(
        { error: 'Migration file is empty' },
        { status: 400 }
      )
    }
    
    // Create Supabase client
    const supabase = await createClient()
    
    // Check if user is authenticated and has admin privileges
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Execute the migration SQL
    // Note: This uses a raw SQL execution which requires service role key
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_string: sql
    })
    
    if (error) {
      console.error('Migration error:', error)
      return NextResponse.json(
        { 
          error: 'Failed to apply migration', 
          details: (error as any).message,
          hint: 'You may need to apply this migration manually via Supabase Dashboard → SQL Editor'
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Migration applied successfully',
      migrationFile,
      data
    })
    
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: (error as any).message },
      { status: 500 }
    )
  }
}
