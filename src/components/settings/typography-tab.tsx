'use client';

/**
 * Typography Settings Tab
 * 
 * Organization-level typography customization
 * Only accessible to Phantom and Aviator roles
 */

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useOrganizationTypography } from '@/hooks/use-typography';
import {
  getDefaultTypographySettings,
  type TypographySettings,
} from '@/lib/google-fonts';
import { Type, RotateCcw, Save } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import { FontSelector } from '@/components/typography/font-selector';

export default function TypographyTab(): JSX.Element {
  const t = useTranslations('settings.typography');
  const { toast } = useToast();
  const {
    organizationTypography,
    canUpdate,
    updateOrganizationTypography,
    isUpdating,
    isLoading
  } = useOrganizationTypography();

  const [settings, setSettings] = useState<TypographySettings>(organizationTypography);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local settings when organization typography changes
  useEffect(() => {
    setSettings(organizationTypography);
    setHasChanges(false);
  }, [organizationTypography]);

  // Track changes
  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(organizationTypography);
    setHasChanges(changed);
  }, [settings, organizationTypography]);

  const handleFontChange = (type: 'headingFont' | 'bodyFont' | 'monoFont', value: string) => {
    setSettings(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleWeightChange = (weight: keyof TypographySettings['fontWeights'], value: string) => {
    setSettings(prev => ({
      ...prev,
      fontWeights: {
        ...prev.fontWeights,
        [weight]: parseInt(value)
      }
    }));
  };

  const handleSave = () => {
    updateOrganizationTypography(settings, {
      onSuccess: () => {
        toast({
          title: t('saveSuccess'),
        });
        setHasChanges(false);
      },
      onError: (error) => {
        toast({
          title: t('saveError', { error: error.message }),
          variant: 'destructive',
        });
      }
    });
  };

  const handleReset = () => {
    setSettings(getDefaultTypographySettings());
  };

  const handleRevert = () => {
    setSettings(organizationTypography);
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">{t('loading')}</div>
      </div>
    );
  }

  if (!canUpdate) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Type aria-hidden="true" className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('noPermission.title')}</h3>
        <p className="text-muted-foreground max-w-md">
          {t('noPermission.description')}
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">{t('title')}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t('description')}
        </p>
      </div>

      {/* Font Selection */}
      <Card aria-hidden="true" className="p-6">
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-4">{t('fontSelection.title')}</h4>
            
            {/* Heading Font */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="heading-font">{t('fontSelection.headingFont')}</Label>
              <FontSelector
                value={settings.headingFont}
                onChange={(value) => handleFontChange('headingFont', value)}
                label={t('fontSelection.headingFont')}
                disabled={isUpdating}
              />
            </div>

            {/* Body Font */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="body-font">{t('fontSelection.bodyFont')}</Label>
              <FontSelector
                value={settings.bodyFont}
                onChange={(value) => handleFontChange('bodyFont', value)}
                label={t('fontSelection.bodyFont')}
                disabled={isUpdating}
              />
            </div>

            {/* Monospace Font */}
            <div className="space-y-2">
              <Label htmlFor="mono-font">{t('fontSelection.monoFont')}</Label>
              <FontSelector
                value={settings.monoFont}
                onChange={(value) => handleFontChange('monoFont', value)}
                category="monospace"
                label={t('fontSelection.monoFont')}
                disabled={isUpdating}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Font Weights */}
      <Card aria-hidden="true" className="p-6">
        <div className="space-y-4">
          <h4 className="font-medium">{t('fontWeights.title')}</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(settings.fontWeights).map(([weight, value]) => (
              <div key={weight} className="space-y-2">
                <Label htmlFor={`weight-${weight}`}>
                  {t(`fontWeights.${weight}`)}
                </Label>
                <Select
                  value={value.toString()}
                  onValueChange={(val) => handleWeightChange(weight as keyof TypographySettings['fontWeights'], val)}
                >
                  <SelectTrigger id={`weight-${weight}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">300 (Light)</SelectItem>
                    <SelectItem value="400">400 (Normal)</SelectItem>
                    <SelectItem value="500">500 (Medium)</SelectItem>
                    <SelectItem value="600">600 (Semibold)</SelectItem>
                    <SelectItem value="700">700 (Bold)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card aria-hidden="true" className="p-6">
        <div className="space-y-4">
          <h4 className="font-medium">{t('preview.title')}</h4>
          
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <div>
              <p className="text-xs text-muted-foreground mb-2">{t('preview.heading')}</p>
              <h1 
                className="text-4xl"
                style={{ 
                  fontFamily: settings.headingFont,
                  fontWeight: settings.fontWeights.bold
                }}
              >
                {t('preview.headingSample')}
              </h1>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">{t('preview.body')}</p>
              <p 
                className="text-base"
                style={{ 
                  fontFamily: settings.bodyFont,
                  fontWeight: settings.fontWeights.normal
                }}
              >
                {t('preview.bodySample')}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">{t('preview.code')}</p>
              <code 
                className="block p-2 bg-background rounded text-sm"
                style={{ 
                  fontFamily: settings.monoFont,
                  fontWeight: settings.fontWeights.normal
                }}
              >
                {t('preview.codeSample')}
              </code>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isUpdating}
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4 mr-2" />
            {t('actions.resetToDefaults')}
          </Button>
          
          {hasChanges && (
            <Button
              variant="ghost"
              onClick={handleRevert}
              disabled={isUpdating}
            >
              {t('actions.revert')}
            </Button>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={!hasChanges || isUpdating}
        >
          <Save aria-hidden="true" className="h-4 w-4 mr-2" />
          {isUpdating ? t('actions.saving') : t('actions.save')}
        </Button>
      </div>
    </div>
  );
}
