/**
 * Simple in-memory rate limiter
 * For production with multiple servers, use Upstash Redis instead
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime < now) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  limit: number
  
  /**
   * Time window in seconds
   */
  window: number
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  success: boolean
  
  /**
   * Number of requests remaining in the current window
   */
  remaining: number
  
  /**
   * Total limit for the window
   */
  limit: number
  
  /**
   * Unix timestamp when the limit resets
   */
  reset: number
  
  /**
   * Number of requests made in the current window
   */
  pending: number
}

/**
 * Rate limit a request by identifier (e.g., IP address, user ID)
 * 
 * @example
 * ```ts
 * const result = rateLimit('user-123', { limit: 10, window: 60 })
 * if (!result.success) {
 *   return new Response('Too many requests', { status: 429 })
 * }
 * ```
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, window: 60 }
): RateLimitResult {
  const now = Date.now()
  const windowMs = config.window * 1000
  const key = `${identifier}:${config.limit}:${config.window}`
  
  let entry = store.get(key)
  
  // Create new entry if doesn't exist or if window has expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    }
    store.set(key, entry)
  }
  
  // Increment count
  entry.count++
  
  const success = entry.count <= config.limit
  const remaining = Math.max(0, config.limit - entry.count)
  
  return {
    success,
    remaining,
    limit: config.limit,
    reset: Math.floor(entry.resetTime / 1000),
    pending: entry.count,
  }
}

/**
 * Get rate limit headers for HTTP responses
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  }
}

/**
 * Common rate limit configurations
 */
export const RateLimits = {
  /**
   * Strict rate limit for authentication endpoints
   * 5 requests per 15 minutes
   */
  AUTH: { limit: 5, window: 15 * 60 },
  
  /**
   * Standard rate limit for API endpoints
   * 100 requests per minute
   */
  API: { limit: 100, window: 60 },
  
  /**
   * Generous rate limit for read operations
   * 1000 requests per minute
   */
  READ: { limit: 1000, window: 60 },
  
  /**
   * Moderate rate limit for write operations
   * 50 requests per minute
   */
  WRITE: { limit: 50, window: 60 },
  
  /**
   * Very strict rate limit for expensive operations
   * 10 requests per hour
   */
  EXPENSIVE: { limit: 10, window: 60 * 60 },
}
