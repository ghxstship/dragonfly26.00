'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Search, CheckCircle2, Clock, XCircle, Mail } from 'lucide-react'
import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { WAITLIST_STATUS_LABELS, WAITLIST_STATUS_COLORS } from '@/types/waitlist'
import type { WaitlistCheckResponse } from '@/types/waitlist'

export default function WaitlistStatusPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<WaitlistCheckResponse | null>(null)

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`/api/waitlist/check?email=${encodeURIComponent(email)}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to check waitlist status')
        setLoading(false)
        return
      }

      setResult(data)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-12 w-12 text-yellow-500" />
      case 'approved':
        return <CheckCircle2 className="h-12 w-12 text-blue-500" />
      case 'invited':
        return <Mail className="h-12 w-12 text-green-500" />
      case 'rejected':
        return <XCircle className="h-12 w-12 text-red-500" />
      default:
        return <Search className="h-12 w-12 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Language and Theme Toggles */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block">
            <div className="font-pixel text-3xl md:text-4xl tracking-wider text-foreground">
              (ATLVS)
            </div>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-title uppercase">Check Waitlist Status</h1>
            <p className="text-muted-foreground mt-2">
              Enter your email to check your position in the queue
            </p>
          </div>
        </div>

        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle>Status Checker</CardTitle>
            <CardDescription>
              Find out where you are in the waitlist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheck} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Checking...' : 'Check Status'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {getStatusIcon(result.status)}
              </div>
              <CardTitle>
                {result.exists ? 'Found Your Application' : 'Not Found'}
              </CardTitle>
              <CardDescription>
                {result.exists
                  ? `Status: ${result.status ? WAITLIST_STATUS_LABELS[result.status] : 'Unknown'}`
                  : 'This email is not on the waitlist'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.exists && result.status && (
                <>
                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${WAITLIST_STATUS_COLORS[result.status]}`}>
                      {WAITLIST_STATUS_LABELS[result.status]}
                    </span>
                  </div>

                  {/* Position (if pending) */}
                  {result.status === 'pending' && result.position && (
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Your position in queue</p>
                      <p className="text-3xl font-bold">#{result.position}</p>
                      {result.estimated_wait_hours && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Estimated wait: ~{Math.round(result.estimated_wait_hours / 24)} days
                        </p>
                      )}
                    </div>
                  )}

                  {/* Status-specific messages */}
                  <div className="space-y-2 text-sm">
                    {result.status === 'pending' && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-yellow-800 dark:text-yellow-200">
                          Your application is being reviewed. We&apos;ll notify you via email when approved.
                        </p>
                      </div>
                    )}
                    {result.status === 'approved' && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-200">
                          Your application has been approved! An invitation will be sent shortly.
                        </p>
                      </div>
                    )}
                    {result.status === 'invited' && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-green-800 dark:text-green-200">
                          An invitation has been sent to your email. Check your inbox!
                        </p>
                      </div>
                    )}
                    {result.status === 'rejected' && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-red-800 dark:text-red-200">
                          Unfortunately, we&apos;re unable to offer access at this time.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Applied date */}
                  {result.created_at && (
                    <p className="text-xs text-center text-muted-foreground">
                      Applied on {new Date(result.created_at).toLocaleDateString()}
                    </p>
                  )}
                </>
              )}

              {/* Not found - offer to join */}
              {!result.exists && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    This email address hasn&apos;t been added to the waitlist yet.
                  </p>
                  <Button
                    onClick={() => router.push(`/waitlist?email=${encodeURIComponent(email)}`)}
                    className="w-full"
                  >
                    Join Waitlist
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer Links */}
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <Link href="/waitlist" className="hover:text-primary">
            Join Waitlist
          </Link>
          <span>•</span>
          <Link href="/login" className="hover:text-primary">
            Sign In
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
