/**
 * PWA Hook
 * Handles service worker registration, install prompt, and updates
 */

import { useEffect, useState } from 'react'

interface PWAState {
  isInstalled: boolean
  isInstallable: boolean
  isUpdateAvailable: boolean
  isOffline: boolean
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isUpdateAvailable: false,
    isOffline: !navigator.onLine,
  })

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    setState((prev) => ({ ...prev, isInstalled: isStandalone }))

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setState((prev) => ({ ...prev, isInstallable: true }))
    }

    // Listen for successful install
    const handleAppInstalled = async () => {
      setState((prev) => ({ ...prev, isInstalled: true, isInstallable: false }))
      setDeferredPrompt(null)
    }

    // Listen for online/offline
    const handleOnline = async () => {
      setState((prev) => ({ ...prev, isOffline: false }))
    }

    const handleOffline = async () => {
      setState((prev) => ({ ...prev, isOffline: true }))
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered')

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing

            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState((prev) => ({ ...prev, isUpdateAvailable: true }))
              }
            })
          })
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error)
        })
    }
  }, [])

  const promptInstall = async () => {
    if (!deferredPrompt) {
      return false
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted install')
      setDeferredPrompt(null)
      setState((prev) => ({ ...prev, isInstallable: false }))
      return true
    }

    console.log('[PWA] User dismissed install')
    return false
  }

  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update()
        
        // Tell the new service worker to skip waiting
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
        
        // Reload page to activate new service worker
        window.location.reload()
      })
    }
  }

  return {
    ...state,
    promptInstall,
    updateServiceWorker,
  }
}
