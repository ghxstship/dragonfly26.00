"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { FileInput, Eye, Code, Settings, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

interface FormViewProps {
  data: DataItem[]
  schema?: FieldSchema[]
  onItemClick?: (item: DataItem) => void
}

export function FormView({ data, schema, onItemClick }: FormViewProps) {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState<"build" | "preview" | "settings">("build")
  const [copied, setCopied] = useState(false)

  const formFields = [
    { id: "name", label: t('fields.name'), type: "text", required: true },
    { id: "email", label: "Email", type: "email", required: true },
    { id: "message", label: "Message", type: "textarea", required: false },
  ]

  const embedCode = `<iframe src="https://yoursite.com/forms/form-id" width="100%" height="600" frameborder="0"></iframe>`

  const handleCopyEmbed = async () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full flex flex-wrap flex-col">
      <Tabs value={activeTab as any} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-wrap flex-col">
        {/* Header */}
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-4 border-b">
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <FileInput aria-hidden="true" className="h-5 w-5" />
            <h3 className="font-semibold">Form Builder</h3>
            <Badge variant="secondary">{data.length} submissions</Badge>
          </div>
          <TabsList>
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>

        {/* Build Tab */}
        <TabsContent value="build" className="flex-1 overflow-auto p-4 sm:p-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
              <CardDescription>Configure the fields for your form</CardDescription>
            </CardHeader>
            <CardContent aria-hidden="true" className="space-y-4">
              {(formFields as any[]).map((field: any) => (
                <div key={field.id} className="flex flex-wrap flex-col md:flex-row items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{field.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {field.type} {field.required && "• Required"}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Delete</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full max-w-full">
                Add Field
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Embed Code</CardTitle>
              <CardDescription>Copy this code to embed the form on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  readOnly
                  value={embedCode as any}
                  className="font-mono text-xs pr-20"
                  rows={3}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute sm:relative sm:inset-auto top-2 md:top-2 right-2 md:right-2"
                  onClick={handleCopyEmbed}
                >
                  {copied ? (
                    <>
                      <Check aria-hidden="true" className="h-4 w-4 mr-1 flex-shrink-0" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy aria-hidden="true" className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-2xl px-4 sm:px-6 lg:px-8 mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>Fill out the form below to get in touch</CardDescription>
              </CardHeader>
              <CardContent aria-hidden="true" className="space-y-4">
                {(formFields as any[]).map((field: any) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    {fiel(d as any).type === "textarea" ? (
                      <Textarea id={field.id} placeholder={`Enter ${field.label.toLowerCase()}`} />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
                <Button aria-hidden="true" className="w-full max-w-full">Submit</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-2xl px-4 sm:px-6 lg:px-8 mx-auto space-y-3 md:space-y-4 lg:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
              </CardHeader>
              <CardContent aria-hidden="true" className="space-y-4">
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Multiple Submissions</Label>
                    <div className="text-sm text-muted-foreground">
                      Users can submit the form multiple times
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive email for each submission
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Success Message</Label>
                    <div className="text-sm text-muted-foreground">
                      Display message after submission
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submissions</CardTitle>
                <CardDescription>Recent form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {data.slice(0, 5).map((item: any) => (
                    <div
                      key={item.id}
                      className="py-3 hover:bg-accent transition-colors cursor-pointer rounded px-2 -mx-2"
                       role="button" tabIndex={0} onClick={() => onItemClick?.(item)}
                    >
                      <div className="font-medium text-sm">
                        {item.name || item.email || "Anonymous"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
