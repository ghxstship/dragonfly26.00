"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Zap, 
  Search,
  Download,
  CheckCircle2,
  Star,
  Settings,
  Trash2,
  ExternalLink,
  Package
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/lib/hooks/use-toast"

interface Plugin {
  id: string
  name: string
  description: string
  author: string
  version: string
  rating: number
  downloads: number
  installed: boolean
  category: string
  icon: string
}

export function PluginsTab() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      id: "1",
      name: "Slack Integration",
      description: "Send notifications and updates to Slack channels",
      author: "Dragonfly Team",
      version: "2.1.0",
      rating: 4.8,
      downloads: 15420,
      installed: true,
      category: "communication",
      icon: "💬",
    },
    {
      id: "2",
      name: "Advanced Analytics",
      description: "Enhanced analytics and reporting capabilities",
      author: "Analytics Pro",
      version: "1.5.2",
      rating: 4.6,
      downloads: 8932,
      installed: true,
      category: "analytics",
      icon: "📊",
    },
    {
      id: "3",
      name: "Timesheet Tracker",
      description: "Track time spent on projects and tasks",
      author: "Time Solutions",
      version: "3.0.1",
      rating: 4.5,
      downloads: 12453,
      installed: false,
      category: "productivity",
      icon: "⏱️",
    },
    {
      id: "4",
      name: "Custom Fields Pro",
      description: "Add unlimited custom fields to any module",
      author: "Extensibility Labs",
      version: "2.3.0",
      rating: 4.9,
      downloads: 23876,
      installed: false,
      category: "customization",
      icon: "🎨",
    },
    {
      id: "5",
      name: "Email Templates",
      description: "Beautiful, customizable email templates",
      author: "Design Studio",
      version: "1.8.4",
      rating: 4.7,
      downloads: 19234,
      installed: false,
      category: "communication",
      icon: "📧",
    },
    {
      id: "6",
      name: "Budget Forecasting",
      description: "AI-powered budget predictions and insights",
      author: "Finance AI",
      version: "1.2.0",
      rating: 4.4,
      downloads: 6721,
      installed: false,
      category: "finance",
      icon: "💰",
    },
  ])

  const handleInstall = (pluginId: string) => {
    setPlugins(plugins.map(p => 
      p.id === pluginId ? { ...p, installed: true } : p
    ))
    const plugin = plugins.find(p => p.id === pluginId)
    toast({
      title: "Plugin installed",
      description: `${plugin?.name} has been installed successfully.`,
    })
  }

  const handleUninstall = (pluginId: string) => {
    setPlugins(plugins.map(p => 
      p.id === pluginId ? { ...p, installed: false } : p
    ))
    const plugin = plugins.find(p => p.id === pluginId)
    toast({
      title: "Plugin uninstalled",
      description: `${plugin?.name} has been removed.`,
      variant: "destructive",
    })
  }

  const installedPlugins = plugins.filter(p => p.installed)
  const availablePlugins = plugins.filter(p => !p.installed)

  const filteredPlugins = (pluginList: Plugin[]) => {
    if (!searchQuery) return pluginList
    return pluginList.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const renderPluginCard = (plugin: Plugin) => (
    <Card key={plugin.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex gap-3 flex-1">
            <div className="text-3xl">{plugin.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-base">{plugin.name}</CardTitle>
                {plugin.installed && (
                  <Badge variant="default">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Installed
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm">{plugin.description}</CardDescription>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>by {plugin.author}</span>
                <span>•</span>
                <span>v{plugin.version}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{plugin.rating}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  <span>{plugin.downloads.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end gap-2">
          {plugin.installed ? (
            <>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleUninstall(plugin.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Uninstall
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn More
              </Button>
              <Button size="sm" onClick={() => handleInstall(plugin.id)}>
                <Download className="h-4 w-4 mr-2" />
                Install
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Installed Plugins</CardDescription>
            <CardTitle className="text-3xl">{installedPlugins.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Available Plugins</CardDescription>
            <CardTitle className="text-3xl">{availablePlugins.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Downloads</CardDescription>
            <CardTitle className="text-3xl">
              {plugins.reduce((sum, p) => sum + p.downloads, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plugins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Plugin Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            <Package className="h-4 w-4 mr-2" />
            All Plugins ({plugins.length})
          </TabsTrigger>
          <TabsTrigger value="installed">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Installed ({installedPlugins.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            <Download className="h-4 w-4 mr-2" />
            Available ({availablePlugins.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {filteredPlugins(plugins).map(renderPluginCard)}
        </TabsContent>

        <TabsContent value="installed" className="space-y-3 mt-4">
          {filteredPlugins(installedPlugins).length > 0 ? (
            filteredPlugins(installedPlugins).map(renderPluginCard)
          ) : (
            <Card>
              <CardContent className="p-0">
                <EmptyState
                  variant="inline"
                  icon={Package}
                  mainMessage="NOTHING TO SEE HERE... (YET)"
                  description="Browse available plugins to extend functionality"
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-3 mt-4">
          {filteredPlugins(availablePlugins).map(renderPluginCard)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
