'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { CountrySelector } from '@/components/layout/country-selector'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { REFERRAL_SOURCES } from '@/types/waitlist'
import type { WaitlistSubmitRequest, WaitlistSubmitResponse } from '@/types/waitlist'

export default function WaitlistPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('waitlist')
  
  const [formData, setFormData] = useState<WaitlistSubmitRequest>({
    email: searchParams.get('email') || '',
    full_name: '',
    company: '',
    role: '',
    use_case: '',
    referral_source: '',
    invite_code: searchParams.get('code') || '',
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<WaitlistSubmitResponse | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/waitlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Failed to submit waitlist application')
        setLoading(false)
        return
      }

      setResponse(data)
      setSuccess(true)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (success && response) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Country and Theme Toggles */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <CountrySelector />
        <ThemeToggle />
      </div>

        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">You&apos;re on the Waitlist!</CardTitle>
            <CardDescription>
              {response.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {response.position && (
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">Your position in queue</p>
                <p className="text-3xl font-bold">#{response.position}</p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>We&apos;ll review your application</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>You&apos;ll receive an email invitation when approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>Check your email for updates</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/waitlist/status')}
                className="flex-1"
              >
                Check Status
              </Button>
              <Button
                onClick={() => router.push('/')}
                className="flex-1"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
            <h1 className="text-2xl md:text-3xl font-title uppercase">Join the Waitlist</h1>
            <p className="text-muted-foreground mt-2">
              ATLVS is currently in private beta. Request an invitation to get early access.
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Request Access</CardTitle>
            <CardDescription>
              Tell us about yourself and how you plan to use ATLVS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Your company name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Current Role</Label>
                <Input
                  id="role"
                  placeholder="e.g., Production Manager, Event Coordinator"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>

              {/* Use Case */}
              <div className="space-y-2">
                <Label htmlFor="use_case">How do you plan to use ATLVS?</Label>
                <Textarea
                  id="use_case"
                  placeholder="Tell us about your production needs, team size, types of events, etc."
                  value={formData.use_case}
                  onChange={(e) => setFormData({ ...formData, use_case: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Referral Source */}
              <div className="space-y-2">
                <Label htmlFor="referral_source">How did you hear about us?</Label>
                <Select
                  value={formData.referral_source}
                  onValueChange={(value) => setFormData({ ...formData, referral_source: value })}
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

              {/* Invite Code */}
              <div className="space-y-2">
                <Label htmlFor="invite_code">Invite Code (Optional)</Label>
                <Input
                  id="invite_code"
                  placeholder="Enter code if you have one"
                  value={formData.invite_code}
                  onChange={(e) => setFormData({ ...formData, invite_code: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Have an invite code? Enter it to skip the queue
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Submitting...' : 'Join Waitlist'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an invitation?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
