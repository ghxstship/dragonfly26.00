"use client"

/**
 * Offline Page
 * Shown when user is offline and page is not cached
 */

import Link from "next/link"
import { WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = 'force-dynamic'

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-muted/30">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <h1 className="text-2xl font-bold mb-3">You&apos;re Offline</h1>
          
          <p className="text-muted-foreground mb-6">
            It looks like you&apos;ve lost your internet connection. Don&apos;t worry, you can still access
            recently viewed content and make changes that will sync when you&apos;re back online.
          </p>

          <div className="space-y-3">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Go to Dashboard</Link>
            </Button>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg text-left">
            <h3 className="font-semibold text-sm mb-2">Offline Features:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• View recently accessed projects and tasks</li>
              <li>• Create and edit items (will sync later)</li>
              <li>• Add comments and notes</li>
              <li>• Search cached content</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
