"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, RotateCcw, XCircle, File, Loader2 } from "lucide-react"
import { useFileTrash, restoreFileFromTrash } from "@/hooks/use-file-enterprise"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/lib/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FileTrashPanelProps {
  workspaceId: string
  className?: string
}

export function FileTrashPanel({ workspaceId, className }: FileTrashPanelProps) {
  const t = useTranslations('files')
  const { trashedFiles, loading, refetch } = useFileTrash(workspaceId)
  const { toast } = useToast()
  const [restoringId, setRestoringId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<any>(null)

  const handleRestore = async (fileId: string) => {
    setRestoringId(fileId)
    try {
      const success = await restoreFileFromTrash(fileId)
      
      if (success) {
        toast({
          title: "File restored",
          description: t('files.toast.fileRestored')
        })
        refetch()
      } else {
        toast({
          title: "Restore failed",
          description: t('files.toast.restoreFailed'),
          variant: "destructive"
        })
      }
    } catch (error: any) {
      console.error("Error restoring file:", error)
      toast({
        title: "Error",
        description: t('files.toast.restoreError'),
        variant: "destructive"
      })
    } finally {
      setRestoringId(null)
    }
  }

  const handlePermanentDelete = (file: any) => {
    setFileToDelete(file)
    setDeleteDialogOpen(true)
  }

  const confirmPermanentDelete = async () => {
    if (!fileToDelete) return

    try {
      // This would call a permanent delete function
      // await permanentlyDeleteFile(fileToDelete.file_id)
      
      toast({
        title: "File permanently deleted",
        description: t('files.toast.fileDeleted')
      })
      refetch()
    } catch (error: any) {
      console.error("Error deleting file:", error)
      toast({
        title: "Error",
        description: t('files.toast.deleteError'),
        variant: "destructive"
      })
    } finally {
      setDeleteDialogOpen(false)
      setFileToDelete(null)
    }
  }

  const getDaysUntilAutoDelete = (deletedAt: string, retentionDays: number = 30) => {
    const deletedDate = new Date(deletedAt)
    const autoDeleteDate = new Date(deletedDate.getTime() + retentionDays * 24 * 60 * 60 * 1000)
    const daysLeft = Math.ceil((autoDeleteDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    return Math.max(0, daysLeft)
  }

  return (
    <>
      <Card aria-hidden="true" className={className}>
        <CardHeader>
          <CardTitle aria-hidden="true" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Trash
          </CardTitle>
          <CardDescription>
            Files will be automatically deleted after 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4 md:py-6 lg:py-8 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              Loading trash...
            </div>
          ) : trashedFiles.length === 0 ? (
            <div className="text-center py-4 md:py-6 lg:py-8 text-muted-foreground">
              <Trash2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Trash is empty</p>
            </div>
          ) : (
            <div className="space-y-2">
              {trashedFiles.map((item: any) => {
                const daysLeft = getDaysUntilAutoDelete(item.deleted_at)
                
                return (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded flex flex-wrap items-center justify-center bg-muted">
                        <File aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {item.file?.name || 'Unnamed file'}
                      </div>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>Deleted {formatDate(item.deleted_at)}</span>
                        <span>•</span>
                        <Badge variant={daysLeft < 7 ? "destructive" : "outline"} className="text-xs">
                          {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(item.file_id)}
                        disabled={restoringId === item.file_id}
                      >
                        {restoringId === item.file_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <RotateCcw aria-hidden="true" className="h-4 w-4 mr-1.5" />
                            Restore
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePermanentDelete(item)}
                      >
                        <XCircle aria-hidden="true" className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete file?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The file will be permanently removed from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPermanentDelete} className="bg-destructive">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
