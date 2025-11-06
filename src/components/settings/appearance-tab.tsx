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
  RotateCcw,
  Type
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { useUserTypography } from "@/hooks/use-typography"
import {
  type TypographySettings,
} from "@/lib/google-fonts"
import { FontSelector } from "@/components/typography/font-selector"

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
  
  // Typography settings
  const {
    effectiveTypography,
    organizationTypography,
    hasCustomTypography,
    updateUserTypography,
    resetToOrganizationDefaults,
    isUpdating: isUpdatingTypography
  } = useUserTypography()
  
  const [useOrgTypography, setUseOrgTypography] = useState(!hasCustomTypography)
  const [customTypography, setCustomTypography] = useState<TypographySettings>(effectiveTypography)

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
    setUseOrgTypography(true)
    setCustomTypography(organizationTypography)
    toast({
      title: t('settings.toast.settingsReset'),
      description: t('settings.toast.appearanceResetDesc'),
    })
  }
  
  const handleTypographyToggle = (checked: boolean) => {
    setUseOrgTypography(checked)
    if (checked) {
      // Reset to organization defaults
      resetToOrganizationDefaults(undefined, {
        onSuccess: () => {
          setCustomTypography(organizationTypography)
          toast({
            title: "Typography Reset",
            description: "Using organization typography settings",
          })
        }
      })
    }
  }
  
  const handleTypographyChange = (type: 'headingFont' | 'bodyFont' | 'monoFont', value: string) => {
    setCustomTypography(prev => ({
      ...prev,
      [type]: value
    }))
  }
  
  const handleSaveTypography = () => {
    if (useOrgTypography) {
      resetToOrganizationDefaults(undefined, {
        onSuccess: () => {
          toast({
            title: "Typography Saved",
            description: "Using organization typography settings",
          })
        }
      })
    } else {
      updateUserTypography(customTypography, {
        onSuccess: () => {
          toast({
            title: "Typography Saved",
            description: "Custom typography settings applied",
          })
        }
      })
    }
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">

      {/* Theme Mode */}
      <Card>
        <CardHeader>
          <CardTitle aria-hidden="true" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Palette aria-hidden="true" className="h-5 w-5" />
            Theme Mode
          </CardTitle>
          <CardDescription>{t('settings.appearanceTab.chooseTheme')}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme as any} onValueChange={setTheme}>
            <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Accent Color & Presets */}
      <Card>
        <CardHeader>
          <CardTitle aria-hidden="true" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Sparkles aria-hidden="true" className="h-5 w-5" />
            {t('settings.appearanceTab.accentColor')}
          </CardTitle>
          <CardDescription>{t('settings.appearanceTab.customizeColors')}</CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {themePresets.map((preset: any) => (
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
            <div className="flex flex-wrap gap-2">
              <Input
                id="custom-color"
                type="color"
                value={accentColor as any}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={accentColor as any}
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
          <CardTitle aria-hidden="true" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Upload aria-hidden="true" className="h-5 w-5" />
            {t('settings.appearanceTab.customBackground')}
          </CardTitle>
          <CardDescription>
            {t('settings.appearanceTab.backgroundDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="space-y-2">
            <Label>Upload Background Image</Label>
            <input
              ref={backgroundFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleBackgroundFileUpload}
              className="hidden md:block"
             aria-label="file" />
            <Button
              type="button"
              variant="outline"
              onClick={() => backgroundFileInputRef.current?.click()}
              className="w-full max-w-full"
            >
              <Upload aria-hidden="true" className="h-4 w-4 mr-2" />
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
              value={backgroundImage as any}
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
          <CardTitle aria-hidden="true" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Code aria-hidden="true" className="h-5 w-5" />
            Custom CSS
          </CardTitle>
          <CardDescription>
            Advanced: Add custom CSS to further personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <Textarea
            value={customCSS as any}
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
          <CardTitle aria-hidden="true" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Sparkles aria-hidden="true" className="h-5 w-5" />
            {t('settings.appearanceTab.animationEffects')}
          </CardTitle>
          <CardDescription>
            Control visual effects and animations
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
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

          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
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

      {/* Typography Settings */}
      <Card>
        <CardHeader>
          <CardTitle aria-hidden="true" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Type aria-hidden="true" className="h-5 w-5" />
            Typography
          </CardTitle>
          <CardDescription>
            Customize fonts for headings, body text, and code
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          {/* Use Organization Typography Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 items-start">
            <div className="space-y-0.5">
              <Label htmlFor="use-org-typography">Use Organization Typography</Label>
              <p className="text-sm text-muted-foreground">
                Use your organization&apos;s default typography settings
              </p>
            </div>
            <Switch
              id="use-org-typography"
              checked={useOrgTypography}
              onCheckedChange={handleTypographyToggle}
              disabled={isUpdatingTypography}
            />
          </div>

          {/* Custom Typography Controls */}
          {!useOrgTypography && (
            <>
              <Separator />
              
              <div className="space-y-4">
                {/* Heading Font */}
                <div className="space-y-2">
                  <Label htmlFor="user-heading-font">Heading Font</Label>
                  <FontSelector
                    value={customTypography.headingFont}
                    onChange={(value) => handleTypographyChange('headingFont', value)}
                    label="Heading Font"
                    disabled={isUpdatingTypography}
                  />
                </div>

                {/* Body Font */}
                <div className="space-y-2">
                  <Label htmlFor="user-body-font">Body Font</Label>
                  <FontSelector
                    value={customTypography.bodyFont}
                    onChange={(value) => handleTypographyChange('bodyFont', value)}
                    label="Body Font"
                    disabled={isUpdatingTypography}
                  />
                </div>

                {/* Monospace Font */}
                <div className="space-y-2">
                  <Label htmlFor="user-mono-font">Code Font</Label>
                  <FontSelector
                    value={customTypography.monoFont}
                    onChange={(value) => handleTypographyChange('monoFont', value)}
                    category="monospace"
                    label="Code Font"
                    disabled={isUpdatingTypography}
                  />
                </div>

                {/* Preview */}
                <div className="space-y-2 pt-2">
                  <Label>Preview</Label>
                  <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                    <h3 
                      className="text-2xl font-bold"
                      style={{ fontFamily: customTypography.headingFont }}
                    >
                      Heading Example
                    </h3>
                    <p 
                      className="text-base"
                      style={{ fontFamily: customTypography.bodyFont }}
                    >
                      This is how your body text will look with the selected font.
                    </p>
                    <code 
                      className="block p-2 bg-background rounded text-sm"
                      style={{ fontFamily: customTypography.monoFont }}
                    >
                      const example = &quot;code&quot;;
                    </code>
                  </div>
                </div>

                <Button
                  onClick={handleSaveTypography}
                  disabled={isUpdatingTypography}
                  className="w-full"
                >
                  <Save aria-hidden="true" className="h-4 w-4 mr-2" />
                  {isUpdatingTypography ? "Saving..." : "Save Typography"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw aria-hidden="true" className="h-4 w-4 mr-2" />
          {t('settings.appearanceTab.resetToDefault')}
        </Button>
        <Button onClick={handleSave}>
          <Save aria-hidden="true" className="h-4 w-4 mr-2" />
          {t('common.save')}
        </Button>
      </div>
    </div>
  )
}
