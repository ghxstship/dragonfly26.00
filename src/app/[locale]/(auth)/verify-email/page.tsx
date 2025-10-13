"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'pending'>('pending')
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState<string>("")
  const [resending, setResending] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  // Extract locale from pathname
  const locale = pathname.split('/')[1] || 'en'

  useEffect(() => {
    const checkVerification = async () => {
      // Check if there's a token in the URL (from email link)
      const token = searchParams.get('token')
      const type = searchParams.get('type')
      
      if (token && type === 'email') {
        setStatus('verifying')
        
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        })

        if (error) {
          setStatus('error')
          setError(error.message)
        } else {
          setStatus('success')
          // Redirect to auth-check after 3 seconds - it will handle routing
          setTimeout(() => {
            router.push(`/${locale}/auth-check`)
          }, 3000)
        }
      } else {
        // No token, just showing the "check your email" page
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          setEmail(user.email)
        }
      }
    }

    checkVerification()
  }, [searchParams, supabase, router, locale])

  const handleResendEmail = async () => {
    setResending(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user?.email) {
      setError("No email found. Please sign up again.")
      setResending(false)
      return
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    })

    if (error) {
      setError(error.message)
    }
    
    setResending(false)
  }

  // Verifying state
  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
            </div>
            <h1 className="text-3xl font-bold">Verifying your email...</h1>
            <p className="text-muted-foreground mt-2">
              Please wait while we confirm your email address
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl" />
                <div className="relative bg-green-500/10 p-6 rounded-full">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Email verified!</h1>
            <p className="text-muted-foreground mt-2">
              Your email has been successfully verified
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Redirecting you to your workspace...
            </p>
            <Button
              className="w-full"
              onClick={() => router.push(`/${locale}/auth-check`)}
            >
              Continue to workspace
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl" />
                <div className="relative bg-destructive/10 p-6 rounded-full">
                  <XCircle className="w-16 h-16 text-destructive" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Verification failed</h1>
            <p className="text-muted-foreground mt-2">
              We couldn&apos;t verify your email address
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {error}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              The verification link may have expired or already been used.
            </p>
            <Button
              className="w-full"
              variant="outline"
              onClick={handleResendEmail}
              disabled={resending}
            >
              {resending ? "Sending..." : "Resend verification email"}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href={`/${locale}/login`}
              className="text-sm text-primary hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Pending state (check your email)
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
              <div className="relative bg-primary/10 p-6 rounded-full">
                <Mail className="w-16 h-16 text-primary" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="text-muted-foreground mt-2">
            We&apos;ve sent a verification link to
          </p>
          {email && (
            <p className="text-foreground font-medium mt-1">{email}</p>
          )}
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to verify your account and get started.
          </p>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="text-primary hover:underline disabled:opacity-50"
            >
              {resending ? "Sending..." : "resend it"}
            </button>
          </p>
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <Link
            href={`/${locale}/login`}
            className="text-sm text-primary hover:underline inline-block"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
