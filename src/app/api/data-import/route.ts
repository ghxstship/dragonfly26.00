import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/data-import
 * 
 * Import data from JSON file (CSV support can be added)
 * Useful for migrating from other platforms or restoring backups
 * 
 * @body { data: object, importType: string }
 */
export async function POST(request: NextRequest) {
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
    const { data: importData, importType = 'json' } = body

    if (!importData) {
      return NextResponse.json(
        { error: 'No data provided for import' },
        { status: 400 }
      )
    }

    const results = {
      imported: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Import based on type
    switch (importType) {
      case 'json':
        await importFromJSON(supabase, user.id, importData, results)
        break
      
      case 'csv':
        // CSV import can be added here
        return NextResponse.json(
          { error: 'CSV import not yet implemented' },
          { status: 501 }
        )
      
      default:
        return NextResponse.json(
          { error: `Unsupported import type: ${importType}` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Imported ${results.imported} items, ${results.failed} failed`,
    })
  } catch (error: any) {
    console.error('Data import error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to import data' },
      { status: 500 }
    )
  }
}

/**
 * Import data from JSON format
 */
async function importFromJSON(
  supabase: any,
  userId: string,
  data: any,
  results: { imported: number; failed: number; errors: string[] }
) {
  // Import tasks
  if (data.tasks && Array.isArray(data.tasks)) {
    for (const task of data.tasks) {
      try {
        const { error } = await supabase
          .from('tasks')
          .insert({
            ...task,
            created_by: userId,
            updated_by: userId,
          })
        
        if (error) throw error
        results.imported++
      } catch (error: any) {
        results.failed++
        results.errors.push(`Task import failed: ${error.message}`)
      }
    }
  }

  // Import projects
  if (data.projects && Array.isArray(data.projects)) {
    for (const project of data.projects) {
      try {
        const { error } = await supabase
          .from('projects')
          .insert({
            ...project,
            created_by: userId,
            updated_by: userId,
          })
        
        if (error) throw error
        results.imported++
      } catch (error: any) {
        results.failed++
        results.errors.push(`Project import failed: ${error.message}`)
      }
    }
  }

  // Import files metadata (actual files would need separate upload)
  if (data.files && Array.isArray(data.files)) {
    for (const file of data.files) {
      try {
        const { error } = await supabase
          .from('files')
          .insert({
            ...file,
            created_by: userId,
          })
        
        if (error) throw error
        results.imported++
      } catch (error: any) {
        results.failed++
        results.errors.push(`File import failed: ${error.message}`)
      }
    }
  }

  // Add more import types as needed
}
