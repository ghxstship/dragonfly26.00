import Link from 'next/link'
import { Home, AlertTriangle } from 'lucide-react'
import { defaultLocale } from '@/i18n/config'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-wrap items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-2xl px-4 sm:px-6 lg:px-8 w-full text-center space-y-3 md:space-y-4 lg:space-y-6 max-w-full">
        {/* Error Icon */}
        <div className="flex flex-wrap justify-center">
          <div className="relative">
            <div className="absolute sm:relative sm:inset-auto inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse sm:relative sm:inset-auto" />
            <div className="relative bg-primary/10 p-6 rounded-full">
              <AlertTriangle className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div className="text-sm font-mono text-muted-foreground">Error 404</div>

        {/* Title */}
        <h1 className="text-lg md:text-xl lg:text-2xl md:text-xl md:text-2xl lg:text-3xl lg:text-4xl font-bold tracking-tight">404 - Page Not Found</h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center pt-4">
          <Link
            href={`/${defaultLocale}`}
            className="inline-flex flex-col md:flex-row items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 md:px-4 md:px-6 lg:px-8"
          >
            <Home className="w-4 h-4" />
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  )
}
