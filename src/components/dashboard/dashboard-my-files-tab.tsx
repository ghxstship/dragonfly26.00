"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FolderOpen,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileArchive,
  Star,
  Download,
  Upload,
  Eye,
  Plus,
  Search,
  Clock
} from "lucide-react"
import { useMyFiles } from "@/hooks/use-dashboard-data"
import { useRouter } from "next/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

export function DashboardMyFilesTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const { files, loading } = useMyFiles(workspaceId, userId)
  
  const mockFiles = [
    {
      id: "FILE-001",
      name: "Summer_Festival_Tech_Rider.pdf",
      type: "document",
      category: "Technical",
      size: "2.4 MB",
      uploadedDate: "Oct 10, 2024",
      lastAccessed: "Oct 11, 2024",
      project: "Summer Music Festival",
      isFavorite: true,
      action: "uploaded",
      icon: FileText,
      downloads: 12,
      views: 24,
    },
    {
      id: "FILE-002",
      name: "Stage_Plot_Main_Stage.dwg",
      type: "design",
      category: "Design",
      size: "8.7 MB",
      uploadedDate: "Oct 9, 2024",
      lastAccessed: "Oct 11, 2024",
      project: "Summer Music Festival",
      isFavorite: true,
      action: "uploaded",
      icon: File,
      downloads: 8,
      views: 16,
    },
    {
      id: "FILE-003",
      name: "Equipment_Inventory_2024.xlsx",
      type: "spreadsheet",
      category: "Assets",
      size: "1.2 MB",
      uploadedDate: "Oct 8, 2024",
      lastAccessed: "Oct 10, 2024",
      project: "Multiple Projects",
      isFavorite: true,
      action: "uploaded",
      icon: FileText,
      downloads: 15,
      views: 28,
    },
    {
      id: "FILE-004",
      name: "Corporate_Gala_Reference_Photos.zip",
      type: "archive",
      category: "Reference",
      size: "42.5 MB",
      uploadedDate: "Oct 7, 2024",
      lastAccessed: "Oct 9, 2024",
      project: "Corporate Gala",
      isFavorite: false,
      action: "downloaded",
      icon: FileArchive,
      downloads: 3,
      views: 5,
    },
    {
      id: "FILE-005",
      name: "Lighting_Cue_Sheet_Act2.pdf",
      type: "document",
      category: "Technical",
      size: "890 KB",
      uploadedDate: "Oct 6, 2024",
      lastAccessed: "Oct 11, 2024",
      project: "Theater Revival",
      isFavorite: true,
      action: "uploaded",
      icon: FileText,
      downloads: 6,
      views: 18,
    },
    {
      id: "FILE-006",
      name: "Fashion_Week_Promo_Video.mp4",
      type: "video",
      category: "Media",
      size: "156 MB",
      uploadedDate: "Oct 5, 2024",
      lastAccessed: "Oct 8, 2024",
      project: "Fashion Week",
      isFavorite: false,
      action: "downloaded",
      icon: FileVideo,
      downloads: 4,
      views: 12,
    },
    {
      id: "FILE-007",
      name: "Venue_Site_Survey_Photos.zip",
      type: "archive",
      category: "Reference",
      size: "28.3 MB",
      uploadedDate: "Oct 4, 2024",
      lastAccessed: "Oct 10, 2024",
      project: "Concert Series",
      isFavorite: false,
      action: "uploaded",
      icon: FileImage,
      downloads: 7,
      views: 14,
    },
    {
      id: "FILE-008",
      name: "Budget_Template_2024.xlsx",
      type: "spreadsheet",
      category: "Finance",
      size: "450 KB",
      uploadedDate: "Oct 3, 2024",
      lastAccessed: "Oct 11, 2024",
      project: "Multiple Projects",
      isFavorite: true,
      action: "saved",
      icon: FileText,
      downloads: 18,
      views: 32,
    },
  ]
  
  const filesList = files.length > 0 ? files.map(file => ({
    id: file.id,
    name: file.name || file.title || 'Untitled',
    type: file.type || 'document',
    category: file.category || 'General',
    size: file.size ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : '0 MB',
    uploadedDate: new Date(file.created_at).toLocaleDateString(),
    lastAccessed: new Date(file.updated_at || file.created_at).toLocaleDateString(),
    project: file.production?.name || 'No Project',
    isFavorite: false,
    action: 'uploaded',
    icon: File,
    downloads: 0,
    views: 0,
  })) : mockFiles
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading files...</p>
        </div>
      </div>
    )
  }

  const summary = {
    totalFiles: 156,
    uploaded: 98,
    downloaded: 42,
    favorites: 16,
    totalSize: "2.4 GB",
    thisMonth: 24,
  }

  const storageByCategory = [
    { name: "Technical", size: "680 MB", percentage: 28, color: "bg-purple-500" },
    { name: "Design", size: "540 MB", percentage: 22, color: "bg-blue-500" },
    { name: "Media", size: "480 MB", percentage: 20, color: "bg-red-500" },
    { name: "Assets", size: "420 MB", percentage: 18, color: "bg-green-500" },
    { name: "Other", size: "280 MB", percentage: 12, color: "bg-gray-500" },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "text-blue-600"
      case "spreadsheet":
        return "text-green-600"
      case "design":
        return "text-purple-600"
      case "video":
        return "text-red-600"
      case "archive":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "uploaded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
      case "downloaded":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
      case "saved":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" disabled>
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Button 
            size="sm" 
            className="gap-2"
            onClick={() => router.push(`/workspace/${workspaceId}/files/all-documents`)}
          >
            <Plus className="h-4 w-4" />
            Upload File
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.totalFiles}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Files</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{summary.uploaded}</p>
              <p className="text-xs text-muted-foreground mt-1">Uploaded</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{summary.downloaded}</p>
              <p className="text-xs text-muted-foreground mt-1">Downloaded</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{summary.favorites}</p>
              <p className="text-xs text-muted-foreground mt-1">Favorites</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.totalSize}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Size</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{summary.thisMonth}</p>
              <p className="text-xs text-muted-foreground mt-1">This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Storage by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {storageByCategory.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-muted-foreground">{category.size} ({category.percentage}%)</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${category.color} transition-all`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filesList.map((file) => {
              const Icon = file.icon
              return (
                <div
                  key={file.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => router.push(`/workspace/${workspaceId}/files/all-documents?id=${file.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 bg-gray-100 dark:bg-gray-800 rounded ${getTypeColor(file.type)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{file.name}</h3>
                            {file.isFavorite && (
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{file.project}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className={getActionColor(file.action)}>
                          {file.action}
                        </Badge>
                        <Badge variant="outline">
                          {file.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{file.size}</span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Upload className="h-3 w-3" />
                          Uploaded: {file.uploadedDate}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Accessed: {file.lastAccessed}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {file.downloads} downloads
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {file.views} views
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold text-blue-600">18</p>
              <p className="text-xs text-muted-foreground mt-1">Files Uploaded</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">6</p>
              <p className="text-xs text-muted-foreground mt-1">Files Downloaded</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">342 MB</p>
              <p className="text-xs text-muted-foreground mt-1">Storage Added</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
