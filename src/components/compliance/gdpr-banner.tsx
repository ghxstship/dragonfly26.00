"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { X, Shield, Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCountrySettings } from "@/hooks/useCountrySettings"

const CONSENT_KEY = 'gdpr_cookie_consent'

export function GDPRBanner(): JSX.Element | null {
  const t = useTranslations("common")
  const { isGDPRRequired } = useCountrySettings()
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (!isGDPRRequired()) {
      setShowBanner(false)
      return
    }

    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      setShowBanner(true)
    }
  }, [isGDPRRequired])

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString(),
      essential: true,
      analytics: true,
      marketing: true
    }))
    setShowBanner(false)
  }

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      accepted: false,
      timestamp: new Date().toISOString(),
      essential: true,
      analytics: false,
      marketing: false
    }))
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
      role="dialog"
      aria-labelledby="gdpr-banner-title"
      aria-describedby="gdpr-banner-description"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Cookie aria-hidden="true" className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 
              id="gdpr-banner-title"
              className="font-heading text-lg uppercase text-gray-900 dark:text-gray-100 mb-2"
            >
              Cookie Consent
            </h3>
            <p 
              id="gdpr-banner-description"
              className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0"
            >
              We use cookies to enhance your experience, analyze site traffic, and personalize content. 
              By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies. You can manage your preferences 
              or reject non-essential cookies.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              className="w-full sm:w-auto"
              aria-label="Reject non-essential cookies"
            >
              Essential Only
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="w-full sm:w-auto"
              aria-label="Accept all cookies"
            >
              Accept All
            </Button>
          </div>
        </div>

        {/* Privacy Link */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            <Shield aria-hidden="true" className="inline h-3 w-3 mr-1" />
            Your privacy is important to us. Read our{" "}
            <a 
              href="/privacy" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
              aria-label="Read our privacy policy"
            >
              Privacy Policy
            </a>
            {' '}and{' '}
            <a 
              href="/cookies" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
              aria-label="Read our cookie policy"
            >
              Cookie Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
