"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { AlertTriangle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCountrySettings } from "@/hooks/useCountrySettings"

interface AgeVerificationProps {
  onVerified: () => void
  onRejected?: () => void
}

export function AgeVerification({ onVerified, onRejected }: AgeVerificationProps): JSX.Element {
  const t = useTranslations("common")
  const { getMinimumAge, localeState } = useCountrySettings()
  const [birthDate, setBirthDate] = useState("")
  const [error, setError] = useState("")

  const minimumAge = getMinimumAge()

  const handleVerify = () => {
    if (!birthDate) {
      setError("Please enter your date of birth")
      return
    }

    const birth = new Date(birthDate)
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())
      ? age - 1
      : age

    if (actualAge < minimumAge) {
      setError(`You must be at least ${minimumAge} years old to use this service`)
      if (onRejected) {
        setTimeout(() => onRejected(), 2000)
      }
      return
    }

    onVerified()
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="age-verification-title"
      aria-describedby="age-verification-description"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 sm:p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <AlertTriangle aria-hidden="true" className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        {/* Title */}
        <h2 
          id="age-verification-title"
          className="font-heading text-2xl uppercase text-center text-gray-900 dark:text-gray-100 mb-2"
        >
          Age Verification Required
        </h2>

        {/* Description */}
        <p 
          id="age-verification-description"
          className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6"
        >
          Due to regulations in {localeState.selectedCountry}, you must be at least{" "}
          <strong>{minimumAge} years old</strong> to access this service.
        </p>

        {/* Date Input */}
        <div className="mb-4">
          <label 
            htmlFor="birth-date" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <Calendar aria-hidden="true" className="inline h-4 w-4 mr-1" />
            Date of Birth
          </label>
          <Input
            id="birth-date"
            type="date"
            value={birthDate}
            onChange={(e) => {
              setBirthDate(e.target.value)
              setError("")
            }}
            max={new Date().toISOString().split('T')[0]}
            className="w-full"
            aria-describedby={error ? "age-error" : undefined}
            aria-invalid={!!error}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div 
            id="age-error"
            className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <Button
          onClick={handleVerify}
          className="w-full"
          size="lg"
          aria-label="Verify age"
        >
          Verify Age
        </Button>

        {/* Footer */}
        <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-500">
          Your date of birth is used solely for age verification and is not stored.
        </p>
      </div>
    </div>
  )
}
