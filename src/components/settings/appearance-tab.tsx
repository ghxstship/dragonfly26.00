"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
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
  const t = useTranslations()
  const { toast } = useToast()
  const [theme, setTheme] = useState("system")
  const [accentColor, setAccentColor] = useState("#8b5cf6")
  const [backgroundImage, setBackgroundImage] = useState("")
  const [customCSS, setCustomCSS] = useState("")
  const [enableAnimations, setEnableAnimations] = useState(true)
  const [enableParticles, setEnableParticles] = useState(false)
  const backgroundFileInputRef = useRef<HTMLInputElement>(null)

  // Apply accent color to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor)
    // Update primary color for better integration
    const hsl = hexToHSL(accentColor)
    if (hsl) {
      document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`)
    }
  }, [accentColor])

  // Apply background image
  useEffect(() => {
    if (backgroundImage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundAttachment = 'fixed'
    } else {
      document.body.style.backgroundImage = ''
    }
  }, [backgroundImage])

  // Apply custom CSS
  useEffect(() => {
    const styleId = 'custom-user-css'
    let styleElement = document.getElementById(styleId) as HTMLStyleElement
    
    if (customCSS) {
      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = styleId
        document.head.appendChild(styleElement)
      }
      styleElement.textContent = customCSS
    } else if (styleElement) {
      styleElement.remove()
    }
  }, [customCSS])

  // Helper function to convert hex to HSL
  const hexToHSL = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return null
    
    let r = parseInt(result[1], 16) / 255
    let g = parseInt(result[2], 16) / 255
    let b = parseInt(result[3], 16) / 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const themePresets = [
    { id: "default", name: t('settings.appearance.themes.defaultPurple'), color: "#8b5cf6" },
    { id: "ocean", name: t('settings.appearance.themes.oceanBlue'), color: "#0ea5e9" },
    { id: "forest", name: t('settings.appearance.themes.forestGreen'), color: "#10b981" },
    { id: "sunset", name: t('settings.appearance.themes.sunsetOrange'), color: "#f97316" },
    { id: "rose", name: t('settings.appearance.themes.rosePink'), color: "#f43f5e" },
    { id: "midnight", name: t('settings.appearance.themes.midnight'), color: "#1e1b4b" },
  ]

  const handleSave = async () => {
    // Save to localStorage for persistence
    localStorage.setItem('appearance-settings', JSON.stringify({
      theme,
      accentColor,
      backgroundImage,
      customCSS,
      enableAnimations,
      enableParticles
    }))
    
    toast({
      title: t('settings.toast.settingsSaved'),
      description: t('settings.toast.settingsSavedDesc'),
    })
  }

  const handleBackgroundFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: t('settings.toast.fileTooLarge'),
          description: t('settings.toast.fileTooLarge5mbDesc'),
          variant: "destructive",
        })
        return
      }
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setBackgroundImage(dataUrl)
        toast({
          title: t('settings.toast.backgroundUploaded'),
          description: t('settings.toast.backgroundUploadedDesc'),
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReset = async () => {
    setTheme("system")
    setAccentColor("#8b5cf6")
    setBackgroundImage("")
    setCustomCSS("")
    setEnableAnimations(true)
    setEnableParticles(false)
    toast({
      title: t('settings.toast.settingsReset'),
      description: t('settings.toast.appearanceResetDesc'),
    })
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {t('settings.appearanceTab.description')}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
            Reset
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" aria-hidden="true" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Theme Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" aria-hidden="true" />
            Theme Mode
          </CardTitle>
          <CardDescription>{t('settings.appearanceTab.chooseTheme')}</CardDescription>
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
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            {t('settings.appearanceTab.accentColor')}
          </CardTitle>
          <CardDescription>{t('settings.appearanceTab.customizeColors')}</CardDescription>
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
            <Upload className="h-5 w-5" aria-hidden="true" />
            {t('settings.appearanceTab.customBackground')}
          </CardTitle>
          <CardDescription>
            {t('settings.appearanceTab.backgroundDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Upload Background Image</Label>
            <input
              ref={backgroundFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleBackgroundFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => backgroundFileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
              Choose Image File
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bg-image">Or Enter Image URL</Label>
            <Input
              id="bg-image"
              type="text"
              value={backgroundImage}
              onChange={(e) => setBackgroundImage(e.target.value)}
              placeholder="https://example.com/background.jpg"
            />
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
            <Code className="h-5 w-5" aria-hidden="true" />
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
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            {t('settings.appearanceTab.animationEffects')}
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
          <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
          {t('settings.appearanceTab.resetToDefault')}
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" aria-hidden="true" />
          {t('common.save')}
        </Button>
      </div>
    </div>
  )
}
