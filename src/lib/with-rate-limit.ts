import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getRateLimitHeaders, RateLimitConfig } from './rate-limit'

/**
 * Higher-order function to add rate limiting to API routes
 * 
 * @example
 * ```ts
 * export const POST = withRateLimit(
 *   async (request: NextRequest) => {
 *     // Your handler code
 *     return NextResponse.json({ success: true })
 *   },
 *   { limit: 10, window: 60 } // 10 requests per minute
 * )
 * ```
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<Response>,
  config: RateLimitConfig
) {
  return async (request: NextRequest) => {
    // Get identifier (IP address or user ID)
    const identifier = getIdentifier(request)
    
    // Check rate limit
    const result = rateLimit(identifier, config)
    
    // If rate limit exceeded, return 429
    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${result.reset - Math.floor(Date.now() / 1000)} seconds.`,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...getRateLimitHeaders(result),
            'Retry-After': (result.reset - Math.floor(Date.now() / 1000)).toString(),
          },
        }
      )
    }
    
    // Call the handler
    const response = await handler(request)
    
    // Add rate limit headers to response
    const headers = new Headers(response.headers)
    Object.entries(getRateLimitHeaders(result)).forEach(([key, value]) => {
      headers.set(key, value)
    })
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }
}

/**
 * Get a unique identifier for rate limiting
 * Prefers user ID if authenticated, falls back to IP address
 */
function getIdentifier(request: NextRequest): string {
  // Try to get IP address from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  // In the future, you could also check for authenticated user ID
  // const userId = await getUserId(request)
  // return userId || ip
  
  return ip
}
