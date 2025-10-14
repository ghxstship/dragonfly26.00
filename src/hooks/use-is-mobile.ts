"use client"

import { useState, useEffect } from "react"

/**
 * Hook to detect if the current viewport is mobile-sized
 * Uses 768px breakpoint (Tailwind's md breakpoint)
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Check on mount
    checkMobile()

    // Listen for resize events
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobile
}

/**
 * Hook to get current breakpoint
 * Returns: 'mobile' | 'tablet' | 'desktop' | 'wide'
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop' | 'wide'>('desktop')

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth
      if (width < 640) setBreakpoint('mobile')
      else if (width < 768) setBreakpoint('tablet')
      else if (width < 1280) setBreakpoint('desktop')
      else setBreakpoint('wide')
    }

    checkBreakpoint()
    window.addEventListener('resize', checkBreakpoint)
    
    return () => window.removeEventListener('resize', checkBreakpoint)
  }, [])

  return breakpoint
}

/**
 * Hook to detect touch device
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return isTouch
}
