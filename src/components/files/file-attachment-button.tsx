"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Paperclip, X, File, Image as ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FileAttachmentButtonProps {
  onFilesSelected?: (files: File[]) => void
  maxFiles?: number
  acceptedTypes?: string
}

export function FileAttachmentButton({ 
  onFilesSelected, 
  maxFiles = 5,
  acceptedTypes = "*"
}: FileAttachmentButtonProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles = [...selectedFiles, ...files].slice(0, maxFiles)
    setSelectedFiles(newFiles)
    onFilesSelected?.(newFiles)
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onFilesSelected?.(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        className="relative"
        disabled={selectedFiles.length >= maxFiles}
      >
        <Paperclip className="h-4 w-4 mr-2" />
        Attach Files
        <input
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={selectedFiles.length >= maxFiles}
        />
      </Button>

      {selectedFiles.length > 0 && (
        <div className="space-y-1">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg border bg-muted/50"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getFileIcon(file)}
                <span className="text-sm truncate">{file.name}</span>
                <Badge variant="outline" className="text-xs">
                  {formatFileSize(file.size)}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => handleRemoveFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selectedFiles.length} of {maxFiles} files attached
        </p>
      )}
    </div>
  )
}
