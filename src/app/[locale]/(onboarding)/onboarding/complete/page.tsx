'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function CompletePage() {
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [isCompleting, setIsCompleting] = useState(false)
  
  const workspaceId = searchParams.get('workspace')

  useEffect(() => {
    // Mark onboarding as complete
    markOnboardingComplete()

    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      handleContinue()
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const markOnboardingComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Call the database function to mark onboarding as complete
      const { error } = await supabase.rpc('complete_user_onboarding', {
        user_id: user.id
      })

      if (error) {
        console.error('Error completing onboarding:', error)
      }
    } catch (error) {
      console.error('Error marking onboarding complete:', error)
    }
  }

  const handleContinue = async () => {
    // Redirect to dashboard
    // If workspaceId is available, use it; otherwise use 'personal' to load user's default workspace
    const targetPath = workspaceId 
      ? `/workspace/${workspaceId}/dashboard/overview` 
      : `/workspace/personal/dashboard/overview`
    router.push(targetPath)
  }

  return (
    <div className="container max-w-2xl min-h-screen flex items-center justify-center py-12">
      <div className="w-full space-y-8 text-center">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <CheckCircle2 className="h-24 w-24 text-green-500 opacity-75" />
            </div>
            <CheckCircle2 className="h-24 w-24 text-green-500 relative" />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold">
            You&apos;re all set! 🎉
          </h1>
          <p className="text-xl text-muted-foreground">
            Welcome to your new workspace
          </p>
        </div>

        {/* What's next */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>What&apos;s Next?</CardTitle>
            </div>
            <CardDescription>
              Here&apos;s what you can do to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 text-left">
              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Profile Complete</p>
                  <p className="text-sm text-muted-foreground">
                    Your profile is set up and ready
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Workspace Created</p>
                  <p className="text-sm text-muted-foreground">
                    Your team workspace is ready to use
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Plan Selected</p>
                  <p className="text-sm text-muted-foreground">
                    Start collaborating with your team
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                onClick={handleContinue}
                className="w-full"
                size="lg"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground">
                Need help? Check out our{' '}
                <Link href="/help" className="text-primary hover:underline">
                  getting started guide
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next steps suggestions */}
        <div className="grid md:grid-cols-3 gap-4 pt-8">
          <div className="p-4 rounded-lg border">
            <p className="font-medium mb-1">Create Your First Project</p>
            <p className="text-sm text-muted-foreground">
              Start organizing your work
            </p>
          </div>
          <div className="p-4 rounded-lg border">
            <p className="font-medium mb-1">Invite Team Members</p>
            <p className="text-sm text-muted-foreground">
              Collaborate with your team
            </p>
          </div>
          <div className="p-4 rounded-lg border">
            <p className="font-medium mb-1">Explore Features</p>
            <p className="text-sm text-muted-foreground">
              Discover all 20 modules
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
