'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, Loader2, AlertCircle, KeyRound, Users } from 'lucide-react'
import { CountrySelector } from '@/components/layout/country-selector'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { REFERRAL_SOURCES } from '@/types/waitlist'
import type { WaitlistSubmitRequest } from '@/types/waitlist'

export default function AccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'invite' | 'waitlist'>(
    searchParams.get('tab') === 'waitlist' ? 'waitlist' : 'invite'
  )

  // Invite Code State
  const [inviteCode, setInviteCode] = useState(searchParams.get('code') || '')
  const [inviteEmail, setInviteEmail] = useState(searchParams.get('email') || '')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)

  // Waitlist State
  const [waitlistData, setWaitlistData] = useState<WaitlistSubmitRequest>({
    email: searchParams.get('email') || '',
    full_name: '',
    company: '',
    role: '',
    use_case: '',
    referral_source: '',
    invite_code: '',
  })
  const [waitlistLoading, setWaitlistLoading] = useState(false)
  const [waitlistError, setWaitlistError] = useState<string | null>(null)

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteLoading(true)
    setInviteError(null)

    try {
      const res = await fetch('/api/auth/validate-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: inviteEmail, 
          invite_code: inviteCode 
        }),
      })

      const data = await res.json()

      if (!data.authorized) {
        setInviteError('Invalid invite code or email. Please check and try again.')
        setInviteLoading(false)
        return
      }

      // Redirect to signup with validated credentials
      router.push(`/signup?email=${encodeURIComponent(inviteEmail)}&code=${encodeURIComponent(inviteCode)}&validated=true`)
    } catch (err) {
      setInviteError('An unexpected error occurred. Please try again.')
      setInviteLoading(false)
    }
  }

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setWaitlistLoading(true)
    setWaitlistError(null)

    try {
      const res = await fetch('/api/waitlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(waitlistData),
      })

      const data = await res.json()

      if (!res.ok) {
        setWaitlistError(data.message || 'Failed to submit waitlist application')
        setWaitlistLoading(false)
        return
      }

      // Redirect to waitlist status page
      router.push('/waitlist/status')
    } catch (err) {
      setWaitlistError('An unexpected error occurred. Please try again.')
      setWaitlistLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Country and Theme Toggles */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <CountrySelector />
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
            <h1 className="text-2xl md:text-3xl font-title uppercase">Get Access</h1>
            <p className="text-muted-foreground mt-2">
              ATLVS is currently in private beta. Enter your invite code or join the waitlist.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'invite' | 'waitlist')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invite" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              <span>I Have a Code</span>
            </TabsTrigger>
            <TabsTrigger value="waitlist" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Join Waitlist</span>
            </TabsTrigger>
          </TabsList>

          {/* Invite Code Tab */}
          <TabsContent value="invite">
            <Card>
              <CardHeader>
                <CardTitle>Enter Invite Code</CardTitle>
                <CardDescription>
                  Have an invitation? Enter your code and email to proceed to signup.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInviteSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Email *</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="you@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invite-code">Invite Code *</Label>
                    <Input
                      id="invite-code"
                      placeholder="Enter your invite code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Check your email for your unique invite code
                    </p>
                  </div>

                  {inviteError && (
                    <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{inviteError}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={inviteLoading}>
                    {inviteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {inviteLoading ? 'Verifying...' : 'Continue to Signup'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Waitlist Tab */}
          <TabsContent value="waitlist">
            <Card>
              <CardHeader>
                <CardTitle>Request Access</CardTitle>
                <CardDescription>
                  Tell us about yourself and how you plan to use ATLVS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="waitlist-email">Email *</Label>
                    <Input
                      id="waitlist-email"
                      type="email"
                      placeholder="you@example.com"
                      value={waitlistData.email}
                      onChange={(e) => setWaitlistData({ ...waitlistData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      placeholder="John Doe"
                      value={waitlistData.full_name}
                      onChange={(e) => setWaitlistData({ ...waitlistData, full_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Your company name"
                      value={waitlistData.company}
                      onChange={(e) => setWaitlistData({ ...waitlistData, company: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Current Role</Label>
                    <Input
                      id="role"
                      placeholder="e.g., Production Manager, Event Coordinator"
                      value={waitlistData.role}
                      onChange={(e) => setWaitlistData({ ...waitlistData, role: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="use_case">How do you plan to use ATLVS?</Label>
                    <Textarea
                      id="use_case"
                      placeholder="Tell us about your production needs, team size, types of events, etc."
                      value={waitlistData.use_case}
                      onChange={(e) => setWaitlistData({ ...waitlistData, use_case: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referral_source">How did you hear about us?</Label>
                    <Select
                      value={waitlistData.referral_source}
                      onValueChange={(value) => setWaitlistData({ ...waitlistData, referral_source: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {REFERRAL_SOURCES.map((source) => (
                          <SelectItem key={source.value} value={source.value}>
                            {source.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {waitlistError && (
                    <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{waitlistError}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={waitlistLoading}>
                    {waitlistLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {waitlistLoading ? 'Submitting...' : 'Join Waitlist'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
