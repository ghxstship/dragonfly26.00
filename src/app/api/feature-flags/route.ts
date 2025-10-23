import { NextResponse } from 'next/server'
import { getFeatureFlags } from '@/lib/feature-flags'

/**
 * GET /api/feature-flags
 * 
 * Returns current feature flags for the application
 * Can be used by client-side code to conditionally render features
 */
export async function GET() {
  try {
    const flags = await getFeatureFlags()
    
    return NextResponse.json({
      flags,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    })
  } catch (error: any) {
    console.error('Feature flags error:', error)
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch feature flags' },
      { status: 500 }
    )
  }
}
