'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AuthCheckPage() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const locale = pathname.split('/')[1] || 'en'

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Wait a bit for cookies to be fully set
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Not authenticated, go back to login
        router.push(`/${locale}/login`)
        return
      }

      // Get profile to check onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, onboarding_completed')
        .eq('id', user.id)
        .single()

      // Determine where to send the user
      if (!profile?.onboarding_completed || !profile?.full_name) {
        // Need to complete onboarding
        window.location.replace(`/${locale}/onboarding/welcome`)
      } else {
        // All set, go to dashboard
        window.location.replace(`/${locale}/workspace/personal/dashboard/overview`)
      }
    }

    checkAuthAndRedirect()
  }, [supabase, router, locale])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  )
}
