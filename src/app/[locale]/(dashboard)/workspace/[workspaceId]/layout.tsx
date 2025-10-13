"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useUIStore } from "@/store/ui-store"

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams<{ workspaceId: string }>()
  const { setCurrentWorkspace } = useUIStore()
  const workspaceId = params.workspaceId

  useEffect(() => {
    // Initialize workspace from URL params
    setCurrentWorkspace({
      id: workspaceId,
      name: workspaceId.charAt(0).toUpperCase() + workspaceId.slice(1),
      organization_id: "default-org",
      is_default: workspaceId === "personal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }, [workspaceId, setCurrentWorkspace])

  return <>{children}</>
}
