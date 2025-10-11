"use client"

import { useEffect } from "react"
import { useUIStore } from "@/store/ui-store"

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspaceId: string }
}) {
  const { setCurrentWorkspace } = useUIStore()

  useEffect(() => {
    // Initialize workspace from URL params
    setCurrentWorkspace({
      id: params.workspaceId,
      name: params.workspaceId.charAt(0).toUpperCase() + params.workspaceId.slice(1),
      organization_id: "default-org",
      is_default: params.workspaceId === "default",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }, [params.workspaceId, setCurrentWorkspace])

  return <>{children}</>
}
