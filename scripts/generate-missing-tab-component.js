#!/usr/bin/env node

/**
 * Generate Missing Tab Components
 * Creates properly structured tab components from templates
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 3) {
  console.error('Usage: node generate-missing-tab-component.js <module> <tab-slug> <tab-name>');
  console.error('Example: node generate-missing-tab-component.js finance budgets "Budgets"');
  process.exit(1);
}

const [moduleId, tabSlug, tabName] = args;

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const moduleDir = path.join(COMPONENTS_DIR, moduleId);

// Create module directory if it doesn't exist
if (!fs.existsSync(moduleDir)) {
  fs.mkdirSync(moduleDir, { recursive: true });
  console.log(`✓ Created directory: ${moduleDir}`);
}

// Generate component name
const componentName = tabSlug
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

const fileName = `${moduleId}-${tabSlug}-tab.tsx`;
const filePath = path.join(moduleDir, fileName);

// Check if file already exists
if (fs.existsSync(filePath)) {
  console.error(`✗ Component already exists: ${filePath}`);
  process.exit(1);
}

// Generate component template
const template = `"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import { useModuleData } from "@/hooks/use-module-data"
import { useParams } from "next/navigation"
import { useState } from "react"

interface ${componentName}TabProps {
  data?: any[]
  loading?: boolean
}

export function ${componentName}Tab({ data, loading }: ${componentName}TabProps) {
  const params = useParams()
  const workspaceId = params?.workspaceId as string
  
  // Fetch data if not provided
  const { data: fetchedData, loading: fetchLoading } = data 
    ? { data, loading } 
    : useModuleData('${moduleId}', '${tabSlug}', workspaceId)
  
  const items = fetchedData || []
  const isLoading = loading || fetchLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ${tabName.toLowerCase()}...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Manage ${tabName.toLowerCase()}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create ${tabName}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{items.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-xs text-muted-foreground mt-1">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">0</p>
              <p className="text-xs text-muted-foreground mt-1">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">${tabName}</CardTitle>
          <CardDescription>View and manage ${tabName.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <p className="text-lg font-semibold mb-2">No ${tabName.toLowerCase()} found</p>
                <p className="text-sm mb-4">Get started by creating your first item</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create ${tabName}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{item.name || item.title || 'Untitled'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description || 'No description'}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {item.status || 'active'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ${componentName}Tab
`;

// Write the file
fs.writeFileSync(filePath, template, 'utf8');

console.log(`✓ Generated component: ${filePath}`);
console.log(`✓ Component name: ${componentName}Tab`);
console.log('');
console.log('Next steps:');
console.log(`1. Review and customize the generated component`);
console.log(`2. Add specific data fields and logic`);
console.log(`3. Integrate with your data hooks`);
console.log(`4. Add to module routing if needed`);
