import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * System Health Check Endpoint
 * 
 * Returns the health status of the application and its dependencies
 * Used by monitoring services, load balancers, and uptime checks
 * 
 * @returns {Object} Health status with checks for database, auth, and storage
 */
export async function GET() {
  const startTime = Date.now()
  const checks: Record<string, any> = {}
  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'

  // 1. Check Database Connection
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('organizations')
      .select('id')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine for health check
      throw error
    }

    checks.database = {
      status: 'healthy',
      message: 'Database connection successful',
      responseTime: Date.now() - startTime,
    }
  } catch (error: any) {
    checks.database = {
      status: 'unhealthy',
      message: error.message || 'Database connection failed',
      responseTime: Date.now() - startTime,
    }
    overallStatus = 'unhealthy'
  }

  // 2. Check Authentication Service
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    checks.auth = {
      status: 'healthy',
      message: 'Authentication service operational',
    }
  } catch (error: any) {
    checks.auth = {
      status: 'degraded',
      message: error.message || 'Authentication service issues',
    }
    if (overallStatus === 'healthy') {
      overallStatus = 'degraded'
    }
  }

  // 3. Check Storage Service (optional - only if critical)
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.storage.listBuckets()

    if (error) {
      throw error
    }

    checks.storage = {
      status: 'healthy',
      message: `Storage service operational (${data.length} buckets)`,
    }
  } catch (error: any) {
    checks.storage = {
      status: 'degraded',
      message: error.message || 'Storage service issues',
    }
    if (overallStatus === 'healthy') {
      overallStatus = 'degraded'
    }
  }

  // 4. Check Environment Variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  )

  checks.environment = {
    status: missingEnvVars.length === 0 ? 'healthy' : 'unhealthy',
    message:
      missingEnvVars.length === 0
        ? 'All required environment variables present'
        : `Missing environment variables: ${missingEnvVars.join(', ')}`,
  }

  if (missingEnvVars.length > 0) {
    overallStatus = 'unhealthy'
  }

  // 5. System Information
  const systemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB',
    },
  }

  // Build response
  const response = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks,
    system: systemInfo,
    responseTime: Date.now() - startTime,
  }

  // Return appropriate HTTP status code
  const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503

  return NextResponse.json(response, { status: httpStatus })
}

/**
 * HEAD request for simple alive check
 * Returns 200 if service is running
 */
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
