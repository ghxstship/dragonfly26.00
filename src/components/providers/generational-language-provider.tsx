"use client"

import { GenerationalLanguageProvider } from '@/contexts/GenerationalLanguageContext'

export function GenerationalLanguageClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <GenerationalLanguageProvider>
      {children}
    </GenerationalLanguageProvider>
  )
}
