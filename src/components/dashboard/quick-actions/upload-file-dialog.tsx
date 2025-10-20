"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FolderOpen, Upload, X, File } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/lib/hooks/use-toast"

interface UploadFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  userId: string
  onSuccess?: () => void
}

export function UploadFileDialog({ open, onOpenChange, workspaceId, userId, onSuccess }: UploadFileDialogProps) {
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    category: 'documents',
    description: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: 'documents', label: 'Documents' },
    { value: 'contracts', label: 'Contracts' },
    { value: 'riders', label: 'Riders' },
    { value: 'tech-specs', label: 'Tech Specs' },
    { value: 'call-sheets', label: 'Call Sheets' },
    { value: 'media', label: 'Media Assets' },
    { value: 'reports', label: 'Reports' },
    { value: 'other', label: 'Other' }
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      alert('Please select a file to upload')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${workspaceId}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(fileName)

      // Create file record
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          workspace_id: workspaceId,
          name: selectedFile.name,
          file_path: fileName,
          file_url: publicUrl,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          category_id: formData.category,
          description: formData.description,
          uploaded_by: userId
        })

      if (dbError) throw dbError

      // Reset form
      setSelectedFile(null)
      setFormData({
        category: 'documents',
        description: ''
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      onOpenChange(false)
      onSuccess?.()
      
      toast({
        title: "File uploaded successfully",
        description: `${selectedFile.name} (${formatFileSize(selectedFile.size)}) has been uploaded.`,
      })
    } catch (error: any) {
      console.error('Error uploading file:', error)
      toast({
        title: "Failed to upload file",
        description: error instanceof Error ? (error as any).message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950">
              <FolderOpen className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <DialogTitle>Upload File</DialogTitle>
              <DialogDescription>
                Add a file to your workspace
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>File *</Label>
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedFile ? (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <File className="h-8 w-8 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Any file type, max 50MB
                    </p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept="*/*"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of the file..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedFile}>
              {loading ? 'Uploading...' : 'Upload File'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
