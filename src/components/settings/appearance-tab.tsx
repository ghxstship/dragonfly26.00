"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Palette, 
  Upload, 
  Code, 
  Sparkles, 
  Eye, 
  Save,
  RotateCcw 
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

export function AppearanceTab() {
  const { toast } = useToast()
  const [theme, setTheme] = useState("system")
  const [accentColor, setAccentColor] = useState("#8b5cf6")
  const [backgroundImage, setBackgroundImage] = useState("")
  const [customCSS, setCustomCSS] = useState("")
  const [enableAnimations, setEnableAnimations] = useState(true)
  const [enableParticles, setEnableParticles] = useState(false)

  const themePresets = [
    { id: "default", name: "Default Purple", color: "#8b5cf6" },
    { id: "ocean", name: "Ocean Blue", color: "#0ea5e9" },
    { id: "forest", name: "Forest Green", color: "#10b981" },
    { id: "sunset", name: "Sunset Orange", color: "#f97316" },
    { id: "rose", name: "Rose Pink", color: "#f43f5e" },
    { id: "midnight", name: "Midnight", color: "#1e1b4b" },
  ]

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your appearance preferences have been updated.",
    })
  }

  const handleReset = () => {
    setTheme("system")
    setAccentColor("#8b5cf6")
    setBackgroundImage("")
    setCustomCSS("")
    setEnableAnimations(true)
    setEnableParticles(false)
    toast({
      title: "Settings reset",
      description: "Your appearance preferences have been reset to default.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Theme Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Mode
          </CardTitle>
          <CardDescription>
            Choose your preferred theme mode
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={setTheme}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Accent Color & Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Accent Color & Themes
          </CardTitle>
          <CardDescription>
            Customize your interface colors with preset themes or a custom color
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {themePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setAccentColor(preset.color)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  accentColor === preset.color
                    ? "border-primary shadow-md"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className="h-8 w-8 rounded-md"
                  style={{ backgroundColor: preset.color }}
                />
                <span className="text-sm font-medium">{preset.name}</span>
              </button>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="custom-color">Custom Accent Color</Label>
            <div className="flex gap-2">
              <Input
                id="custom-color"
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                placeholder="#8b5cf6"
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Background (MySpace Style) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Custom Background
          </CardTitle>
          <CardDescription>
            Add a custom background image to personalize your workspace (MySpace style!)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bg-image">Background Image URL</Label>
            <Input
              id="bg-image"
              type="text"
              value={backgroundImage}
              onChange={(e) => setBackgroundImage(e.target.value)}
              placeholder="https://example.com/background.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Enter a URL to an image you'd like as your background
            </p>
          </div>

          {backgroundImage && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div
                className="h-32 rounded-lg border bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom CSS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Custom CSS
          </CardTitle>
          <CardDescription>
            Advanced: Add custom CSS to further personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={customCSS}
            onChange={(e) => setCustomCSS(e.target.value)}
            placeholder="/* Your custom CSS here */&#10;.sidebar { border-radius: 12px; }&#10;&#10;/* Be creative! */"
            className="font-mono text-sm min-h-[200px]"
          />
          <p className="text-xs text-muted-foreground">
            ⚠️ Use with caution. Custom CSS may override system styles and affect functionality.
          </p>
        </CardContent>
      </Card>

      {/* Animation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Animation & Effects
          </CardTitle>
          <CardDescription>
            Control visual effects and animations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations">Enable Animations</Label>
              <p className="text-sm text-muted-foreground">
                Smooth transitions and micro-interactions
              </p>
            </div>
            <Switch
              id="animations"
              checked={enableAnimations}
              onCheckedChange={setEnableAnimations}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="particles">Particle Effects</Label>
              <p className="text-sm text-muted-foreground">
                Decorative particle effects (may impact performance)
              </p>
            </div>
            <Switch
              id="particles"
              checked={enableParticles}
              onCheckedChange={setEnableParticles}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
