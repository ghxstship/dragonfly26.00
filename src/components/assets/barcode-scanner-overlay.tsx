"use client"

import { useState, useEffect, useRef } from "react"
import { X, Camera, Flashlight, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

interface BarcodeScannerOverlayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onScanSuccess: (item: any) => void
  workspaceId: string
}

export function BarcodeScannerOverlay({ open, onOpenChange, onScanSuccess, workspaceId }: BarcodeScannerOverlayProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanning, setScanning] = useState(false)
  const [lastScan, setLastScan] = useState<string>('')
  const [flashOn, setFlashOn] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (open) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [open, facingMode])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
      
      setHasPermission(true)
      setScanning(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      setHasPermission(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setScanning(false)
  }

  const toggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0]
      const capabilities = track.getCapabilities() as any
      
      if (capabilities.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashOn } as any]
          })
          setFlashOn(!flashOn)
        } catch (error) {
          console.error('Flash not supported:', error)
        }
      }
    }
  }

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  const handleManualEntry = async (code: string) => {
    if (!code || code === lastScan) return
    
    setLastScan(code)
    
    const { data, error } = await supabase.rpc('search_inventory_by_code', {
      p_code: code,
      p_workspace_id: workspaceId
    })

    if (!error && data && data.length > 0) {
      onScanSuccess(data[0])
      onOpenChange(false)
    } else {
      alert('Item not found')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="relative aspect-[4/3] bg-black">
          {hasPermission === false ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
              <Camera className="h-16 w-16 mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
              <p className="text-sm text-gray-300 mb-4">
                Please allow camera access to scan barcodes and QR codes
              </p>
              <Button onClick={startCamera} variant="secondary">
                Request Permission
              </Button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-48">
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
                  
                  {/* Scanning line animation */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scan" />
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-black/70 text-white border-white/20">
                  <Camera className="h-3 w-3 mr-1" />
                  Point at barcode or QR code
                </Badge>
              </div>

              {/* Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={toggleFlash}
                  className={flashOn ? 'bg-yellow-400 text-black' : ''}
                >
                  <Flashlight className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={switchCamera}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>

              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Manual entry */}
        <div className="p-4 border-t">
          <form onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.elements.namedItem('code') as HTMLInputElement
            handleManualEntry(input.value)
          }}>
            <div className="flex gap-2">
              <input
                name="code"
                type="text"
                placeholder={t('assets.barcode.manualPlaceholder')}
                className="flex-1 px-3 py-2 text-sm border rounded-md"
                autoComplete="off"
              />
              <Button type="submit">Lookup</Button>
            </div>
          </form>
        </div>
      </DialogContent>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(192px); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </Dialog>
  )
}
