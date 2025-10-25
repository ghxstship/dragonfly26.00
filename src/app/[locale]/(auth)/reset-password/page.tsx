"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { Link } from "@/i18n/navigation"
import { useRouter } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle2, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const locale = useLocale()
  const supabase = createClient()

  // Check if user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // No valid session, redirect to forgot password
        router.push('/forgot-password')
      }
    }
    checkSession()
  }, [supabase, router, locale])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    // Check for required character types
    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasDigit = /[0-9]/.test(password)
    const hasSymbol = /[^a-zA-Z0-9]/.test(password)

    if (!hasLowercase || !hasUppercase || !hasDigit || !hasSymbol) {
      setError("Password must contain at least one lowercase letter, one uppercase letter, one digit, and one symbol")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      setError((error as any).message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
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
            <h1 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold">Password updated!</h1>
            <p className="text-muted-foreground mt-2">
              Your password has been successfully reset
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Redirecting you to login...
            </p>
            <Button
              className="w-full max-w-full"
              onClick={() => router.push('/login')}
            >
              Continue to login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-wrap items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4 md:space-y-3 md:space-y-4 lg:space-y-6 lg:space-y-8">
        <div className="text-center">
          <h1 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold">Set new password</h1>
          <p className="text-muted-foreground mt-2">
            Choose a strong password for your account
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4 md:p-8 space-y-3 md:space-y-4 lg:space-y-6">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute sm:relative sm:inset-auto right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground sm:relative sm:inset-auto"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with lowercase, uppercase, digit, and symbol
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute sm:relative sm:inset-auto right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground sm:relative sm:inset-auto"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full max-w-full" disabled={loading}>
              {loading ? "Updating..." : "Update password"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
