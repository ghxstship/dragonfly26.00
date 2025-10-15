"use client"

import { useEffect } from "react"
import { TopBar } from "@/components/layout/top-bar"
import { Sidebar } from "@/components/layout/sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { cleanupOldStorage } from "@/lib/storage-cleanup"

// force-dynamic required: Dashboard layout contains client components with hooks
// TopBar, Sidebar, and RightSidebar all use client-side state and effects
export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Clean up old localStorage keys on mount
  useEffect(() => {
    cleanupOldStorage()
  }, [])

  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
        <RightSidebar />
      </div>
    </div>
  )
}
