"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { Link } from "@/i18n/navigation"
import { useRouter } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const locale = useLocale()
  const supabase = createClient()
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${locale}/reset-password`,
    })

    if (error) {
      setError((error as any).message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-wrap items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-4 md:space-y-3 md:space-y-4 lg:space-y-6 lg:space-y-8">
          <div className="text-center">
            <div className="flex flex-wrap justify-center mb-4">
              <div className="relative">
                <div className="absolute sm:relative sm:inset-auto inset-0 bg-green-500/20 rounded-full blur-2xl sm:relative sm:inset-auto" />
                <div className="relative bg-green-500/10 p-6 rounded-full">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
              </div>
            </div>
            <h1 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-title uppercase">Check your email</h1>
            <p className="text-muted-foreground mt-2">
              We&apos;ve sent password reset instructions to
            </p>
            <p className="text-foreground mt-1">{email}</p>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the link in the email to reset your password. The link will expire in 24 hours.
            </p>
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setSuccess(false)}
                className="text-primary hover:underline"
              >
                try again
              </button>
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex flex-col md:flex-row items-center gap-2 text-sm text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-wrap items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4 md:space-y-3 md:space-y-4 lg:space-y-6 lg:space-y-8">
        <div className="text-center">
          <h1 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-title uppercase">Reset your password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email and we&apos;ll send you instructions
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4 md:p-8 space-y-3 md:space-y-4 lg:space-y-6">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full max-w-full" disabled={loading}>
              {loading ? "Sending..." : "Send reset instructions"}
            </Button>
          </form>
        </div>

        <div className="text-center space-y-2">
          <Link
            href="/login"
            className="inline-flex flex-col md:flex-row items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
