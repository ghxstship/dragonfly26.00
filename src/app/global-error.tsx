'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <div className="max-w-2xl w-full text-center space-y-6">
            {/* Error Icon with Animation */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-red-500/10 p-6 rounded-full">
                  <AlertTriangle className="w-16 h-16 text-red-500" />
                </div>
              </div>
            </div>

            {/* Error Digest */}
            {error.digest && (
              <div className="text-sm font-mono text-slate-500 dark:text-slate-400">
                Error Code: {error.digest}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Critical Error
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              A critical error has occurred. We apologize for the inconvenience. Please try refreshing the page.
            </p>

            {/* What You Can Do Section */}
            <div className="text-left max-w-md mx-auto pt-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                What You Can Do:
              </h2>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-violet-600 dark:text-violet-400 mt-0.5">•</span>
                  <span>Refresh the page and try again</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-600 dark:text-violet-400 mt-0.5">•</span>
                  <span>Clear your browser cache and cookies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-600 dark:text-violet-400 mt-0.5">•</span>
                  <span>Contact support if the problem persists</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 bg-violet-600 text-white hover:bg-violet-700 h-11 px-8"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 h-11 px-8"
              >
                <Home className="w-4 h-4" />
                Go Back Home
              </Link>
            </div>

            {/* Technical Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 text-left">
                <summary className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                  Technical Details
                </summary>
                <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <pre className="text-xs text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap break-words font-mono">
                    {(error as any).message}
                    {'\n\n'}
                    {error.stack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
