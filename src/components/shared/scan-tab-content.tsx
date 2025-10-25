'use client'

import { useState, useRef, useCallback } from 'react'
import { ScanLine, Upload, X, Check, Loader2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/ui-store'
import { useFileUpload, validateFile, compressImage } from '@/hooks/use-file-upload'
import { cn } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'

export function ScanTabContent() {
  const { currentWorkspace } = useUIStore()
  const { uploadFile, uploading, progress } = useFileUpload()
  const { toast } = useToast()
  const [scannedImage, setScannedImage] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  // Start scanner (camera)
  const startScanning = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      })
      
      setStream(mediaStream)
      setShowScanner(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please check permissions.',
        variant: 'destructive'
      })
    }
  }

  // Stop scanner
  const stopScanning = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowScanner(false)
  }, [stream])

  // Capture document scan
  const captureScan = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Draw video frame
        ctx.drawImage(video, 0, 0)
        
        // Apply document enhancement (basic)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        enhanceDocument(imageData)
        ctx.putImageData(imageData, 0, 0)
        
        const scanDataUrl = canvas.toDataURL('image/jpeg', 0.95)
        setScannedImage(scanDataUrl)
        stopScanning()
      }
    }
  }

  // Basic document enhancement
  const enhanceDocument = (imageData: ImageData) => {
    const data = imageData.data
    
    // Increase contrast and reduce colors to make text more readable
    const factor = 1.5 // Contrast factor
    const intercept = 128 * (1 - factor)
    
    for (let i = 0; i < data.length; i += 4) {
      // Apply contrast to RGB channels
      data[i] = Math.min(255, Math.max(0, data[i] * factor + intercept)) // R
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor + intercept)) // G
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor + intercept)) // B
    }
  }

  // Rescan
  const rescan = () => {
    setScannedImage(null)
    startScanning()
  }

  // Save scanned document
  const saveScan = async () => {
    if (!scannedImage || !currentWorkspace) return

    try {
      // Convert data URL to File
      const response = await fetch(scannedImage)
      const blob = await response.blob()
      const timestamp = Date.now()
      const file = new File([blob], `scan-${timestamp}.jpg`, { type: 'image/jpeg' })

      // Upload to storage (keeping high quality for documents)
      const result = await uploadFile(file, {
        workspaceId: currentWorkspace.id,
        bucket: 'documents',
        folder: 'scans',
        fileType: 'other',
        metadata: {
          captureMethod: 'scan',
          scannedAt: new Date().toISOString(),
          documentType: 'scanned_document'
        }
      })

      if (result.success) {
        toast({
          title: 'Scan Saved',
          description: 'Your document has been scanned and saved successfully.'
        })
        setScannedImage(null)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error saving scan:', error)
      toast({
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'Failed to save scan',
        variant: 'destructive'
      })
    }
  }

  // Handle PDF upload
  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !currentWorkspace) return

    const file = files[0]
    
    // Validate file
    const validation = validateFile(file, {
      maxSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: ['application/pdf']
    })

    if (!validation.valid) {
      toast({
        title: 'Invalid File',
        description: validation.error,
        variant: 'destructive'
      })
      return
    }

    try {
      const result = await uploadFile(file, {
        workspaceId: currentWorkspace.id,
        bucket: 'documents',
        folder: 'uploads',
        fileType: 'other',
        metadata: {
          captureMethod: 'upload',
          uploadedAt: new Date().toISOString(),
          documentType: 'pdf'
        }
      })

      if (result.success) {
        toast({
          title: 'PDF Uploaded',
          description: 'Your PDF has been uploaded successfully.'
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error uploading PDF:', error)
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload PDF',
        variant: 'destructive'
      })
    }

    // Reset input
    if (pdfInputRef.current) {
      pdfInputRef.current.value = ''
    }
  }

  // View scans
  const viewScans = () => {
    // TODO: Navigate to files module filtered by scanned documents
    toast({
      title: 'Scans',
      description: 'Opening scanned documents...'
    })
  }

  return (
    <div className="space-y-4">
      {/* Description */}
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm font-medium mb-2">Document Scanner</p>
        <p className="text-xs text-muted-foreground">
          Use your device camera to scan documents, receipts, business cards, and more. 
          Scanned documents are automatically saved to your workspace.
        </p>
      </div>

      {/* Scanner View or Preview */}
      {showScanner ? (
        <div className="relative rounded-lg overflow-hidden md:block bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-48 md:h-56 lg:h-64 object-cover max-w-full"
          />
          {/* Scanning guide overlay */}
          <div className="absolute sm:relative sm:inset-auto inset-0 pointer-events-none sm:relative sm:inset-auto">
            <div className="absolute sm:relative sm:inset-auto inset-8 border-2 border-white/50 rounded-lg sm:relative sm:inset-auto">
              <div className="absolute sm:relative sm:inset-auto top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white sm:relative sm:inset-auto" />
              <div className="absolute sm:relative sm:inset-auto top-2 md:top-0 right-2 md:right-0 w-4 h-4 border-t-2 border-r-2 border-white" />
              <div className="absolute sm:relative sm:inset-auto bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white sm:relative sm:inset-auto" />
              <div className="absolute sm:relative sm:inset-auto bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white sm:relative sm:inset-auto" />
            </div>
            <p className="absolute sm:relative sm:inset-auto bottom-20 left-0 right-0 text-center text-white text-sm bg-black/50 py-2 sm:relative sm:inset-auto">
              Position document within the frame
            </p>
          </div>
          <div className="absolute sm:relative sm:inset-auto bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2 sm:relative sm:inset-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={stopScanning}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={captureScan}
              className="rounded-full h-14 w-14 p-0"
            >
              <ScanLine className="h-6 w-6" />
            </Button>
          </div>
        </div>
      ) : scannedImage ? (
        <div className="relative rounded-lg overflow-hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={scannedImage}
            alt="Scanned document"
            className="w-full h-48 md:h-56 lg:h-64 object-cover max-w-full"
          />
          {uploading ? (
            <div className="absolute sm:relative sm:inset-auto inset-0 bg-black/50 flex flex-wrap items-center justify-center sm:relative sm:inset-auto">
              <div className="text-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Saving... {progress}%</p>
              </div>
            </div>
          ) : (
            <div className="absolute sm:relative sm:inset-auto bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2 sm:relative sm:inset-auto">
              <Button
                variant="secondary"
                size="sm"
                onClick={rescan}
              >
                <X className="h-4 w-4 mr-2" />
                Rescan
              </Button>
              <Button
                size="sm"
                onClick={saveScan}
              >
                <Check className="h-4 w-4 mr-2" />
                Save Scan
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center h-48 md:h-56 lg:h-64 border-2 border-dashed rounded-lg bg-muted/20">
          <div className="text-center">
            <ScanLine className="h-16 w-16 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">Ready to Scan</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Position your document in view and tap the button below to begin scanning
            </p>
          </div>
        </div>
      )}

      {/* Canvas for scan capture (hidden) */}
      <canvas ref={canvasRef} className="hidden md:block" />

      {/* Action Buttons */}
      {!showScanner && !scannedImage && (
        <>
          <Button
            className={cn("w-full", uploading && "opacity-50")}
            size="lg"
            onClick={startScanning}
            disabled={uploading}
          >
            <ScanLine className="h-4 w-4 mr-2" />
            Start Scanning
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pdfInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {progress}%
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload PDF
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={viewScans}
            >
              View Scans
            </Button>
          </div>

          {/* Hidden file input for PDF */}
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            onChange={handlePDFUpload}
            className="hidden md:block"
          />
        </>
      )}
    </div>
  )
}
