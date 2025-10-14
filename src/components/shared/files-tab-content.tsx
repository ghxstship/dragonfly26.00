"use client"

import { useState, useEffect } from "react"
import { Upload, File, FileText, Image, FileSpreadsheet, Download, Trash2, Loader2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/utils"
import { getSupabaseClient } from "@/lib/supabase/hooks-client"
import { useUIStore } from "@/store/ui-store"
import { useToast } from "@/lib/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  url: string
  created_at: string
}

export function FilesTabContent() {
  const supabase = getSupabaseClient()
  const { toast } = useToast()
  const { currentWorkspace } = useUIStore()
  
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    fetchUser()
  }, [supabase])

  // Fetch files
  useEffect(() => {
    const fetchFiles = async () => {
      if (!currentWorkspace?.id) return
      
      try {
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('workspace_id', currentWorkspace.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        
        // Transform to FileItem format
        const fileItems: FileItem[] = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name || 'Untitled',
          size: item.size_bytes || 0,
          type: item.type || 'application/octet-stream',
          url: item.storage_path || '',
          created_at: item.created_at,
        }))
        
        setFiles(fileItems)
      } catch (error: any) {
        console.error('Error fetching files:', error)
        toast({
          title: "Error",
          description: "Failed to load files",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFiles()
  }, [supabase, currentWorkspace?.id, toast])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !currentWorkspace?.id || !currentUser) return
    
    const file = e.target.files[0]
    setIsUploading(true)

    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      // Create file record
      const { data: attachmentData, error: attachmentError } = await supabase
        .from('files')
        .insert({
          workspace_id: currentWorkspace.id,
          name: file.name,
          type: file.type,
          size_bytes: file.size,
          storage_path: publicUrl,
          uploaded_by: currentUser.id,
        })
        .select()
        .single()

      if (attachmentError) throw attachmentError

      // Add to local state
      const newFile: FileItem = {
        id: attachmentData.id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl,
        created_at: attachmentData.created_at,
      }
      
      setFiles((prev) => [newFile, ...prev])
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
      })
    } catch (error: any) {
      console.error('Error uploading file:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      e.target.value = '' // Reset input
    }
  }

  const handleDelete = async (id: string, url: string) => {
    try {
      // Extract file path from URL
      const urlParts = url.split('/documents/')
      const filePath = urlParts[1]

      // Delete from storage
      if (filePath) {
        await supabase.storage
          .from('documents')
          .remove([filePath])
      }

      // Delete from database
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', id)

      if (error) throw error

      setFiles((prev) => prev.filter((f) => f.id !== id))
      
      toast({
        title: "Success",
        description: "File deleted successfully",
      })
    } catch (error: any) {
      console.error('Error deleting file:', error)
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image
    if (type.includes('spreadsheet') || type.includes('excel')) return FileSpreadsheet
    if (type.includes('pdf') || type.includes('document')) return FileText
    return File
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-sm">My Files</h3>
            <p className="text-xs text-muted-foreground">
              {files.length} files
            </p>
          </div>
          <label htmlFor="file-upload-input">
            <Button size="sm" className="h-7 gap-1.5" disabled={isUploading} asChild>
              <span>
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Upload
              </span>
            </Button>
          </label>
          <Input
            id="file-upload-input"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {files.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm font-medium">No files yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Upload files to get started
              </p>
              <label htmlFor="file-upload-input-empty">
                <Button variant="outline" size="sm" disabled={isUploading} asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </span>
                </Button>
              </label>
            </div>
          ) : (
            files.map((file) => {
              const FileIcon = getFileIcon(file.type)
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded flex items-center justify-center bg-muted">
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{file.name}</div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{formatDate(file.created_at)}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(file.url, file.name)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDelete(file.id, file.url)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
