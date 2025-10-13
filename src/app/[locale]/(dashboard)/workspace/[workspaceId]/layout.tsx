"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useUIStore } from "@/store/ui-store"
import { useWorkspace } from "@/hooks/use-workspace"

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams<{ workspaceId: string }>()
  const { setCurrentWorkspace } = useUIStore()
  const workspaceIdOrSlug = params.workspaceId
  
  // Resolve workspace ID from slug (e.g., "personal" -> actual UUID)
  const { workspace, loading, error } = useWorkspace(workspaceIdOrSlug)

  useEffect(() => {
    if (workspace) {
      // Set the resolved workspace data
      setCurrentWorkspace(workspace)
    }
  }, [workspace, setCurrentWorkspace])

  // Show loading state while resolving workspace
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    )
  }

  // Show error state if workspace resolution failed
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading workspace</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
