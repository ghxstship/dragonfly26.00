"use client"

import { useState } from "react"
import { Search, Grid, List, Star, TrendingUp, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PluginCard } from "@/components/plugins/plugin-card"
import { InstalledPlugins } from "@/components/plugins/installed-plugins"
import type { Plugin, PluginInstallation } from "@/types"

const mockPlugins: Plugin[] = [
  {
    id: "1",
    slug: "slack-integration",
    name: "Slack Integration",
    description: "Send notifications and updates to Slack channels",
    icon_url: "/plugins/slack.png",
    developer_name: "Dragonfly Team",
    version: "1.0.0",
    category: "communication",
    pricing_model: "free",
    required_permissions: ["webhooks", "notifications"],
    supports_webhooks: true,
    supports_api: true,
    supports_ui: false,
    is_published: true,
    is_featured: true,
    install_count: 1250,
    rating: 4.8,
    review_count: 45,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "2",
    slug: "github-sync",
    name: "GitHub Sync",
    description: "Synchronize issues with GitHub repositories",
    icon_url: "/plugins/github.png",
    developer_name: "Dragonfly Team",
    version: "2.1.0",
    category: "integration",
    pricing_model: "free",
    required_permissions: ["api", "webhooks"],
    supports_webhooks: true,
    supports_api: true,
    supports_ui: true,
    is_published: true,
    is_featured: true,
    install_count: 890,
    rating: 4.6,
    review_count: 32,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
]

const mockInstalled: PluginInstallation[] = [
  {
    id: "1",
    plugin_id: "1",
    organization_id: "org-1",
    status: "active",
    config: { channel: "#general" },
    usage_count: 142,
    installed_by: "user-1",
    installed_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
    plugin: mockPlugins[0],
  },
]

export function PluginsPageContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("marketplace")

  const filteredPlugins = mockPlugins.filter((plugin) =>
    plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Plugin Marketplace</h1>
            <p className="text-muted-foreground mt-2">
              Extend your workspace with powerful integrations
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Plugins</p>
                  <p className="text-2xl font-bold">{mockPlugins.length}</p>
                </div>
                <Zap className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Installed</p>
                  <p className="text-2xl font-bold text-green-600">{mockInstalled.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Featured</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {mockPlugins.filter((p) => p.is_featured).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="installed">Installed ({mockInstalled.length})</TabsTrigger>
            </TabsList>

            {activeTab === "marketplace" && (
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search plugins..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-r-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-l-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <TabsContent value="marketplace">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlugins.map((plugin) => (
                  <PluginCard key={plugin.id} plugin={plugin} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPlugins.map((plugin) => (
                  <PluginCard key={plugin.id} plugin={plugin} layout="list" />
                ))}
              </div>
            )}

            {filteredPlugins.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No plugins found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="installed">
            <InstalledPlugins installations={mockInstalled} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
